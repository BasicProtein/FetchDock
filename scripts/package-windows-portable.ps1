param(
  [string]$Configuration = "release",
  [string]$OutputDir = "dist-portable",
  [string]$ManifestPath = "",
  [switch]$SkipManifest,
  [switch]$Verify
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$targetDir = Join-Path $repoRoot "src-tauri\target\$Configuration"
$exePath = Join-Path $targetDir "fetchdock.exe"

function Get-RelativePackagePath {
  param(
    [string]$BaseDir,
    [string]$Path
  )

  $baseUri = [System.Uri]((Resolve-Path -LiteralPath $BaseDir).Path.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar)
  $pathUri = [System.Uri]((Resolve-Path -LiteralPath $Path).Path)
  [System.Uri]::UnescapeDataString($baseUri.MakeRelativeUri($pathUri).ToString())
}

function Get-Sha256Hex {
  param([string]$Path)

  $stream = [System.IO.File]::OpenRead((Resolve-Path -LiteralPath $Path).Path)
  try {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
      ($sha.ComputeHash($stream) | ForEach-Object { $_.ToString("x2") }) -join ""
    } finally {
      $sha.Dispose()
    }
  } finally {
    $stream.Dispose()
  }
}

if (-not (Test-Path -LiteralPath $exePath)) {
  throw "Build output was not found: $exePath. Run npm run tauri -- build first."
}

$portableRoot = Join-Path $repoRoot $OutputDir
if (-not (Test-Path -LiteralPath $portableRoot)) {
  New-Item -ItemType Directory -Path $portableRoot | Out-Null
}

Copy-Item -LiteralPath $exePath -Destination (Join-Path $portableRoot "FetchDock.exe") -Force
Set-Content -LiteralPath (Join-Path $portableRoot "portable.txt") -Value "FetchDock portable mode marker" -Encoding UTF8

$dataDirs = @("config", "db", "downloads", "cache", "cookies", "dependencies", "plugins", "logs", "diagnostics")
foreach ($name in $dataDirs) {
  $dir = Join-Path $portableRoot "data\$name"
  if (-not (Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }
}

if (-not $SkipManifest) {
  $checksumPath = Join-Path $portableRoot "checksums.sha256"
  $filesToHash = Get-ChildItem -LiteralPath $portableRoot -File -Recurse |
    Where-Object { $_.FullName -ne $checksumPath -and $_.FullName -ne (Join-Path $portableRoot "release-manifest.json") } |
    Sort-Object FullName
  $hashRows = foreach ($file in $filesToHash) {
    $relativePath = Get-RelativePackagePath -BaseDir $portableRoot -Path $file.FullName
    [pscustomobject]@{
      path = $relativePath
      sha256 = Get-Sha256Hex -Path $file.FullName
      bytes = $file.Length
    }
  }
  $checksumLines = $hashRows | ForEach-Object { "$($_.sha256)  $($_.path)" }
  Set-Content -LiteralPath $checksumPath -Value $checksumLines -Encoding UTF8

  $targetManifestPath = if ([string]::IsNullOrWhiteSpace($ManifestPath)) {
    Join-Path $portableRoot "release-manifest.json"
  } elseif ([System.IO.Path]::IsPathRooted($ManifestPath)) {
    $ManifestPath
  } else {
    Join-Path $portableRoot $ManifestPath
  }
  $manifest = [ordered]@{
    schema_version = 1
    package = "fetchdock-windows-portable"
    configuration = $Configuration
    generated_at = (Get-Date).ToUniversalTime().ToString("o")
    root = $portableRoot
    files = $hashRows
    checksum_file = "checksums.sha256"
  }
  $manifestJson = $manifest | ConvertTo-Json -Depth 5
  Set-Content -LiteralPath $targetManifestPath -Value $manifestJson -Encoding UTF8
  Write-Output "Checksum manifest written to $targetManifestPath"
}

if ($Verify) {
  if ($SkipManifest) {
    throw "-Verify requires a checksum manifest. Remove -SkipManifest and try again."
  }
  $verifyArgs = @{ PortableDir = $portableRoot }
  if (-not [string]::IsNullOrWhiteSpace($ManifestPath)) {
    $verifyArgs.ManifestPath = $targetManifestPath
  }
  & (Join-Path $PSScriptRoot "verify-windows-portable.ps1") @verifyArgs
}

Write-Output "Portable package staged at $portableRoot"
