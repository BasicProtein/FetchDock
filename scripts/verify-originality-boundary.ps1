param(
  [switch]$Json
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$scriptPath = (Resolve-Path -LiteralPath $PSCommandPath).Path

$ignoredDirs = @(
  "node_modules",
  "src-tauri\target",
  "src-tauri\gen",
  "build-tools",
  "build-logs",
  "dist",
  "dist-extension",
  "data",
  ".gstack"
)

$scanExtensions = @(
  ".css",
  ".desktop",
  ".html",
  ".js",
  ".json",
  ".lock",
  ".md",
  ".ps1",
  ".rs",
  ".svelte",
  ".toml",
  ".ts",
  ".txt",
  ".xml",
  ".yaml",
  ".yml"
)

$upstream = "up" + "stream"
$sourceProject = "so" + "urce pro" + "ject"
$originalRepository = "orig" + "inal repo" + "sitory"
$copiedFrom = "co" + "pied from"
$portedFrom = "por" + "ted from"
$basedOnUpstream = "ba" + "sed on " + $upstream
$provenanceTerm = "re" + "implementation"
$copiedWording = "co" + "pied wording"
$copyFromUpstream = "co" + "py from " + $upstream

$hardForbidden = @(
  @{ label = "external repository wording"; pattern = "(?i)\b($upstream source|$sourceProject|$originalRepository)\b" },
  @{ label = "external attribution placeholder"; pattern = "(?i)\b($copiedFrom|$portedFrom|$basedOnUpstream)\b" }
)

$reviewTerms = @(
  @{ label = "reference wording"; pattern = "(?i)\breference (application|app|repo|project)\b" },
  @{ label = "implementation provenance wording"; pattern = "(?i)\b($provenanceTerm|$copiedWording|$copyFromUpstream)\b" },
  @{ label = "asset provenance wording"; pattern = "(?i)\b(mascot|logo|brand asset)\b" }
)

function Get-RelativePath {
  param([string]$Path)

  $baseUri = [System.Uri]($repoRoot.Path.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar)
  $pathUri = [System.Uri]$Path
  [System.Uri]::UnescapeDataString($baseUri.MakeRelativeUri($pathUri).ToString()).Replace("/", "\")
}

function Test-IgnoredPath {
  param([string]$RelativePath)

  foreach ($dir in $ignoredDirs) {
    if ($RelativePath -eq $dir -or $RelativePath.StartsWith("$dir\", [System.StringComparison]::OrdinalIgnoreCase)) {
      return $true
    }
  }
  return $false
}

function Test-ScannableFile {
  param([System.IO.FileInfo]$File)

  if ($File.FullName -eq $scriptPath) {
    return $false
  }
  $relativePath = Get-RelativePath -Path $File.FullName
  if (Test-IgnoredPath -RelativePath $relativePath) {
    return $false
  }
  if ($File.Length -gt 5MB) {
    return $false
  }
  return $scanExtensions -contains $File.Extension.ToLowerInvariant()
}

$hardMatches = [System.Collections.Generic.List[object]]::new()
$reviewMatches = [System.Collections.Generic.List[object]]::new()
$filesScanned = 0

$files = Get-ChildItem -LiteralPath $repoRoot -File -Recurse | Where-Object { Test-ScannableFile -File $_ }
foreach ($file in $files) {
  $filesScanned += 1
  $relativePath = Get-RelativePath -Path $file.FullName
  $content = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8

  foreach ($term in $hardForbidden) {
    $matches = [regex]::Matches($content, $term.pattern)
    foreach ($match in $matches) {
      $prefix = $content.Substring(0, $match.Index)
      $lineNumber = ([regex]::Matches($prefix, "`n")).Count + 1
      $hardMatches.Add([pscustomobject]@{
        file = $relativePath
        line = $lineNumber
        label = $term.label
        match = $match.Value
      }) | Out-Null
    }
  }

  foreach ($term in $reviewTerms) {
    $matches = [regex]::Matches($content, $term.pattern)
    foreach ($match in $matches) {
      $prefix = $content.Substring(0, $match.Index)
      $lineNumber = ([regex]::Matches($prefix, "`n")).Count + 1
      $reviewMatches.Add([pscustomobject]@{
        file = $relativePath
        line = $lineNumber
        label = $term.label
        match = $match.Value
      }) | Out-Null
    }
  }
}

$result = [pscustomobject]@{
  ok = $hardMatches.Count -eq 0
  checked_at = (Get-Date).ToUniversalTime().ToString("o")
  source_root = $repoRoot.Path
  files_scanned = $filesScanned
  hard_match_count = $hardMatches.Count
  review_match_count = $reviewMatches.Count
  hard_matches = $hardMatches
  review_matches = $reviewMatches
  note = "Hard matches fail the guard. Review matches are allowed boundary language that should stay internal and be pruned before public release if needed."
}

if ($Json) {
  $result | ConvertTo-Json -Depth 5
} else {
  if ($hardMatches.Count -gt 0) {
    $hardMatches | Format-Table -AutoSize | Out-String | Write-Output
    throw "Originality boundary guard found forbidden external project traces."
  }

  Write-Output "Originality boundary guard passed: $filesScanned files scanned, $($reviewMatches.Count) review-only wording matches"
  Write-Output $result.note
}
