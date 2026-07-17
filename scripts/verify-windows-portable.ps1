param(
  [string]$PortableDir = "dist-portable",
  [string]$ManifestPath = ""
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$portableRoot = if ([System.IO.Path]::IsPathRooted($PortableDir)) {
  $PortableDir
} else {
  Join-Path $repoRoot $PortableDir
}

if (-not (Test-Path -LiteralPath $portableRoot -PathType Container)) {
  throw "Portable directory was not found: $portableRoot"
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

$exePath = Join-Path $portableRoot "FetchDock.exe"
$markerPath = Join-Path $portableRoot "portable.txt"
$checksumPath = Join-Path $portableRoot "checksums.sha256"
$manifestPath = if ([string]::IsNullOrWhiteSpace($ManifestPath)) {
  Join-Path $portableRoot "release-manifest.json"
} elseif ([System.IO.Path]::IsPathRooted($ManifestPath)) {
  $ManifestPath
} else {
  Join-Path $portableRoot $ManifestPath
}

foreach ($requiredFile in @($exePath, $markerPath, $checksumPath, $manifestPath)) {
  if (-not (Test-Path -LiteralPath $requiredFile -PathType Leaf)) {
    throw "Portable package is missing required file: $requiredFile"
  }
}

$requiredDataDirs = @("config", "db", "downloads", "cache", "cookies", "dependencies", "plugins", "logs", "diagnostics")
foreach ($name in $requiredDataDirs) {
  $dir = Join-Path $portableRoot "data\$name"
  if (-not (Test-Path -LiteralPath $dir -PathType Container)) {
    throw "Portable package is missing data directory: $dir"
  }
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($manifest.schema_version -ne 1) {
  throw "release-manifest.json has unsupported schema_version: $($manifest.schema_version)"
}
if ($manifest.package -ne "fetchdock-windows-portable") {
  throw "release-manifest.json package mismatch: $($manifest.package)"
}
if ($manifest.checksum_file -ne "checksums.sha256") {
  throw "release-manifest.json checksum_file mismatch: $($manifest.checksum_file)"
}

$manifestRows = @($manifest.files)
if ($manifestRows.Count -eq 0) {
  throw "release-manifest.json does not list any files."
}

$checksumRows = @{}
foreach ($line in Get-Content -LiteralPath $checksumPath -Encoding UTF8) {
  $trimmed = $line.Trim()
  if ($trimmed -eq "") {
    continue
  }
  if ($trimmed -notmatch '^([a-fA-F0-9]{64})\s+(.+)$') {
    throw "Invalid checksum row: $line"
  }
  $checksumRows[$Matches[2]] = $Matches[1].ToLowerInvariant()
}

foreach ($entry in $manifestRows) {
  $relativePath = [string]$entry.path
  if ([string]::IsNullOrWhiteSpace($relativePath) -or $relativePath.Contains("..")) {
    throw "Manifest contains unsafe relative path: $relativePath"
  }
  $filePath = Join-Path $portableRoot ($relativePath.Replace("/", [System.IO.Path]::DirectorySeparatorChar))
  if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
    throw "Manifest file was not found: $relativePath"
  }
  $actualHash = Get-Sha256Hex -Path $filePath
  $manifestHash = ([string]$entry.sha256).ToLowerInvariant()
  if ($actualHash -ne $manifestHash) {
    throw "Manifest hash mismatch for $relativePath"
  }
  if (-not $checksumRows.ContainsKey($relativePath)) {
    throw "checksums.sha256 is missing $relativePath"
  }
  if ($checksumRows[$relativePath] -ne $actualHash) {
    throw "checksums.sha256 hash mismatch for $relativePath"
  }
  $actualBytes = (Get-Item -LiteralPath $filePath).Length
  if ([int64]$entry.bytes -ne $actualBytes) {
    throw "Manifest byte count mismatch for $relativePath"
  }
}

$manifestPaths = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($entry in $manifestRows) {
  [void]$manifestPaths.Add([string]$entry.path)
}
foreach ($path in $checksumRows.Keys) {
  if (-not $manifestPaths.Contains($path)) {
    throw "checksums.sha256 contains file not present in manifest: $path"
  }
}

Write-Output "Windows portable package verified: $portableRoot"
