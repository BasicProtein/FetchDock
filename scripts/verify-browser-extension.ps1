param(
  [string]$ExtensionDir = "browser-extension",
  [string]$OutputDir = "dist-extension",
  [ValidateSet("chrome", "firefox")]
  [string[]]$Targets = @("chrome", "firefox"),
  [switch]$Package
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$extensionRoot = if ([System.IO.Path]::IsPathRooted($ExtensionDir)) {
  $ExtensionDir
} else {
  Join-Path $repoRoot $ExtensionDir
}

if (-not (Test-Path -LiteralPath $extensionRoot -PathType Container)) {
  throw "Browser extension directory was not found: $extensionRoot"
}

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

function Copy-JsonObject {
  param([object]$Value)

  $Value | ConvertTo-Json -Depth 20 | ConvertFrom-Json
}

function Get-TargetManifest {
  param(
    [object]$Manifest,
    [string]$Target
  )

  $targetManifest = Copy-JsonObject -Value $Manifest
  if ($Target -eq "chrome" -and $targetManifest.PSObject.Properties.Name -contains "browser_specific_settings") {
    $targetManifest.PSObject.Properties.Remove("browser_specific_settings")
  }
  $targetManifest
}

function New-ExtensionPackage {
  param(
    [string]$Target,
    [string]$ExtensionRoot,
    [string]$OutputRoot,
    [string]$SafeVersion,
    [object]$TargetManifest,
    [object[]]$SourceFiles
  )

  $zipPath = Join-Path $OutputRoot "fetchdock-connector-$Target-$SafeVersion.zip"
  if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
  }

  $stagingRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("fetchdock-extension-$Target-package-" + [guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Path $stagingRoot | Out-Null
  try {
    foreach ($file in $SourceFiles) {
      $relativePath = (Get-RelativePackagePath -BaseDir $ExtensionRoot -Path $file.FullName).Replace("/", [System.IO.Path]::DirectorySeparatorChar)
      $targetPath = Join-Path $stagingRoot $relativePath
      $targetParent = Split-Path -Parent $targetPath
      if (-not (Test-Path -LiteralPath $targetParent -PathType Container)) {
        New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
      }
      if ($relativePath -ieq "manifest.json") {
        Set-Content -LiteralPath $targetPath -Value ($TargetManifest | ConvertTo-Json -Depth 20) -Encoding UTF8
      } else {
        Copy-Item -LiteralPath $file.FullName -Destination $targetPath -Force
      }
    }
    Compress-Archive -Path (Join-Path $stagingRoot "*") -DestinationPath $zipPath -Force

    $stagedFiles = Get-ChildItem -LiteralPath $stagingRoot -Recurse -File | Sort-Object FullName
    $rows = foreach ($file in $stagedFiles) {
      $relativePath = Get-RelativePackagePath -BaseDir $stagingRoot -Path $file.FullName
      [pscustomobject]@{
        path = $relativePath
        sha256 = Get-Sha256Hex -Path $file.FullName
        bytes = $file.Length
      }
    }

    [pscustomobject]@{
      target = $Target
      zip_path = [System.IO.Path]::GetFileName($zipPath)
      zip_sha256 = Get-Sha256Hex -Path $zipPath
      files = $rows
    }
  } finally {
    if (Test-Path -LiteralPath $stagingRoot) {
      Remove-Item -LiteralPath $stagingRoot -Recurse -Force
    }
  }
}

$manifestPath = Join-Path $extensionRoot "manifest.json"
if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
  throw "Browser extension manifest was not found: $manifestPath"
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($manifest.manifest_version -ne 3) {
  throw "Browser extension manifest_version must be 3."
}
if ([string]::IsNullOrWhiteSpace($manifest.name)) {
  throw "Browser extension manifest is missing name."
}
if ([string]::IsNullOrWhiteSpace($manifest.version)) {
  throw "Browser extension manifest is missing version."
}

function Assert-ManifestStringSet {
  param(
    [string]$FieldName,
    [object]$Actual,
    [string[]]$Expected
  )

  $actualValues = @()
  if ($null -ne $Actual) {
    $actualValues = @($Actual | ForEach-Object { [string]$_ } | Sort-Object -Unique)
  }
  $expectedValues = @($Expected | Sort-Object -Unique)
  $missingValues = @($expectedValues | Where-Object { $actualValues -cnotcontains $_ })
  $extraValues = @($actualValues | Where-Object { $expectedValues -cnotcontains $_ })

  if ($missingValues.Count -gt 0 -or $extraValues.Count -gt 0) {
    $missing = if ($missingValues.Count -gt 0) { $missingValues -join ", " } else { "none" }
    $extra = if ($extraValues.Count -gt 0) { $extraValues -join ", " } else { "none" }
    throw "Browser extension manifest $FieldName changed. Missing: $missing. Extra: $extra. Update the verifier only after release/review permission scope is approved."
  }
}

Assert-ManifestStringSet -FieldName "permissions" -Actual $manifest.permissions -Expected @(
  "activeTab",
  "contextMenus",
  "storage",
  "tabs",
  "webRequest"
)
Assert-ManifestStringSet -FieldName "host_permissions" -Actual $manifest.host_permissions -Expected @(
  "<all_urls>"
)

function Resolve-ExtensionPath {
  param(
    [string]$BaseDir,
    [string]$RelativePath
  )

  $value = $RelativePath.Trim()
  if ($value -eq "" -or $value.StartsWith("#") -or $value -match "^[a-zA-Z][a-zA-Z0-9+.-]*:") {
    return $null
  }
  $withoutFragment = $value.Split("#")[0].Split("?")[0]
  if ($withoutFragment -eq "") {
    return $null
  }
  if ($withoutFragment.StartsWith("/")) {
    return Join-Path $extensionRoot $withoutFragment.TrimStart("/")
  }
  Join-Path $BaseDir $withoutFragment
}

$manifestRefs = @()
if ($manifest.action.default_popup) {
  $manifestRefs += [string]$manifest.action.default_popup
}
if ($manifest.background.service_worker) {
  $manifestRefs += [string]$manifest.background.service_worker
}
if ($manifest.options_page) {
  $manifestRefs += [string]$manifest.options_page
}

foreach ($relativePath in $manifestRefs) {
  $filePath = Resolve-ExtensionPath -BaseDir $extensionRoot -RelativePath $relativePath
  if ($filePath -and -not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
    throw "Manifest references missing file: $relativePath"
  }
}

$htmlFiles = Get-ChildItem -LiteralPath $extensionRoot -Recurse -File -Filter "*.html"
foreach ($htmlFile in $htmlFiles) {
  $html = Get-Content -LiteralPath $htmlFile.FullName -Raw -Encoding UTF8
  $matches = [System.Text.RegularExpressions.Regex]::Matches($html, '(?:src|href)\s*=\s*"([^"]+)"')
  foreach ($match in $matches) {
    $ref = [string]$match.Groups[1].Value
    $filePath = Resolve-ExtensionPath -BaseDir $htmlFile.DirectoryName -RelativePath $ref
    if ($filePath -and -not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
      $relativeHtml = Get-RelativePackagePath -BaseDir $extensionRoot -Path $htmlFile.FullName
      throw "HTML file $relativeHtml references missing file: $ref"
    }
  }
}

function Assert-HtmlElementIds {
  param(
    [string]$RelativePath,
    [string[]]$ElementIds
  )

  $filePath = Resolve-ExtensionPath -BaseDir $extensionRoot -RelativePath $RelativePath
  if (-not $filePath -or -not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
    throw "Required browser extension HTML file was not found: $RelativePath"
  }

  $html = Get-Content -LiteralPath $filePath -Raw -Encoding UTF8
  foreach ($elementId in $ElementIds) {
    $escaped = [System.Text.RegularExpressions.Regex]::Escape($elementId)
    if ($html -notmatch "id\s*=\s*['""]$escaped['""]") {
      throw "Browser extension $RelativePath is missing required element id: $elementId"
    }
  }
}

Assert-HtmlElementIds -RelativePath "error/error.html" -ElementIds @(
  "message",
  "diagnostics",
  "status",
  "retry-bridge",
  "copy-diagnostics",
  "open-options"
)

Assert-HtmlElementIds -RelativePath "options/options.html" -ElementIds @(
  "bridge-url",
  "bridge-discovery-ports",
  "pairing-token",
  "blocked-hosts",
  "copy-summary",
  "copy-json",
  "check-bridge",
  "import-profile"
)

Assert-HtmlElementIds -RelativePath "popup/popup.html" -ElementIds @(
  "page-title",
  "page-url",
  "copy-page-summary",
  "media-summary",
  "copy-media-shown",
  "copy-media-details",
  "copy-media-json",
  "check-bridge"
)

$errorScriptPath = Resolve-ExtensionPath -BaseDir $extensionRoot -RelativePath "error/error.js"
$errorScript = Get-Content -LiteralPath $errorScriptPath -Raw -Encoding UTF8
foreach ($requiredSnippet in @(
  "pairing token value copied: no",
  "Cookie values copied: no",
  "Authorization header values copied: no",
  "browser storage payload bodies copied: no",
  "captured payload bodies copied: no"
)) {
  if (-not $errorScript.Contains($requiredSnippet)) {
    throw "Browser extension error page is missing safe diagnostics privacy guard: $requiredSnippet"
  }
}

$optionsScriptPath = Resolve-ExtensionPath -BaseDir $extensionRoot -RelativePath "options/options.js"
$optionsScript = Get-Content -LiteralPath $optionsScriptPath -Raw -Encoding UTF8
foreach ($requiredSnippet in @(
  "copySafeJson",
  "safeSettingsPayload",
  "fetchdock.browser_extension.options.safe_settings",
  "pairingTokenValueCopied",
  "authorizationHeaderValuesCopied",
  "browserStoragePayloadBodiesCopied",
  "capturedPayloadBodiesCopied"
)) {
  if (-not $optionsScript.Contains($requiredSnippet)) {
    throw "Browser extension options page is missing safe settings JSON guard: $requiredSnippet"
  }
}

$popupScriptPath = Resolve-ExtensionPath -BaseDir $extensionRoot -RelativePath "popup/popup.js"
$popupScript = Get-Content -LiteralPath $popupScriptPath -Raw -Encoding UTF8
foreach ($requiredSnippet in @(
  'data-action="send"',
  'data-action="open"',
  'openMediaItemSource',
  'runtimeApi.tabs.create({ url })',
  'copyShownMediaJson',
  'fetchdock.browser_extension.visible_media',
  'pending_segment_count',
  'authorization_header_values_copied'
)) {
  if (-not $popupScript.Contains($requiredSnippet)) {
    throw "Browser extension popup is missing detected-media source action guard: $requiredSnippet"
  }
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  throw "node was not found on PATH; JavaScript syntax checks cannot run."
}

$jsFiles = Get-ChildItem -LiteralPath $extensionRoot -Recurse -File -Filter "*.js"
foreach ($jsFile in $jsFiles) {
  & $node.Source --check $jsFile.FullName
  if ($LASTEXITCODE -ne 0) {
    throw "JavaScript syntax check failed: $($jsFile.FullName)"
  }
}

$backgroundPath = Resolve-ExtensionPath -BaseDir $extensionRoot -RelativePath "shared/background.js"
$background = Get-Content -LiteralPath $backgroundPath -Raw -Encoding UTF8
foreach ($requiredSnippet in @(
  "runtimeApi.tabs?.onActivated?.addListener",
  "runtimeApi.tabs?.onUpdated?.addListener",
  "runtimeApi.tabs?.onRemoved?.addListener",
  "refreshDetectedMediaActionState(details.tabId)",
  "pendingStreamSegments",
  "rememberPendingStreamSegment(media.groupId)",
  "takePendingStreamSegmentCount(media.groupId)",
  "setBadgeText({ ...actionTarget, text })",
  "setBadgeBackgroundColor({ ...actionTarget, color"
)) {
  if (-not $background.Contains($requiredSnippet)) {
    throw "Browser extension background is missing current-tab action badge guard: $requiredSnippet"
  }
}

if ($Package) {
  $outputRoot = if ([System.IO.Path]::IsPathRooted($OutputDir)) {
    $OutputDir
  } else {
    Join-Path $repoRoot $OutputDir
  }
  if (-not (Test-Path -LiteralPath $outputRoot -PathType Container)) {
    New-Item -ItemType Directory -Path $outputRoot | Out-Null
  }

  $safeVersion = ([string]$manifest.version) -replace '[^a-zA-Z0-9._-]', '_'
  $files = Get-ChildItem -LiteralPath $extensionRoot -Recurse -File | Sort-Object FullName
  $legacyZipPath = Join-Path $outputRoot "fetchdock-connector-$safeVersion.zip"
  if (Test-Path -LiteralPath $legacyZipPath) {
    Remove-Item -LiteralPath $legacyZipPath -Force
  }

  $targetPackages = foreach ($target in ($Targets | Select-Object -Unique)) {
    $targetManifest = Get-TargetManifest -Manifest $manifest -Target $target
    New-ExtensionPackage `
      -Target $target `
      -ExtensionRoot $extensionRoot `
      -OutputRoot $outputRoot `
      -SafeVersion $safeVersion `
      -TargetManifest $targetManifest `
      -SourceFiles $files
  }
  $primaryPackage = @($targetPackages)[0]

  $packageManifest = [ordered]@{
    schema_version = 1
    package = "fetchdock-browser-extension"
    extension_name = [string]$manifest.name
    version = [string]$manifest.version
    generated_at = (Get-Date).ToUniversalTime().ToString("o")
    targets = @($targetPackages)
    zip_path = $primaryPackage.zip_path
    zip_sha256 = $primaryPackage.zip_sha256
    files = $primaryPackage.files
  }
  $packageManifestPath = Join-Path $outputRoot "browser-extension-package-manifest.json"
  Set-Content -LiteralPath $packageManifestPath -Value ($packageManifest | ConvertTo-Json -Depth 5) -Encoding UTF8
  foreach ($targetPackage in $targetPackages) {
    Write-Output "Browser extension $($targetPackage.target) package written to $(Join-Path $outputRoot $targetPackage.zip_path)"
  }
  Write-Output "Browser extension package manifest written to $packageManifestPath"
}

Write-Output "Browser extension verified: $extensionRoot"
