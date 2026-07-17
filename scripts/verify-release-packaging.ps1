param(
  [switch]$Json
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

function Add-Check {
  param(
    [System.Collections.Generic.List[object]]$Checks,
    [string]$Name,
    [bool]$Pass,
    [string]$Message
  )

  $Checks.Add([pscustomobject]@{
    name = $Name
    pass = $Pass
    message = $Message
  }) | Out-Null

  if (-not $Pass) {
    throw $Message
  }
}

function Read-Text {
  param([string]$RelativePath)

  Get-Content -LiteralPath (Join-Path $repoRoot $RelativePath) -Raw -Encoding UTF8
}

function Assert-Contains {
  param(
    [System.Collections.Generic.List[object]]$Checks,
    [string]$Name,
    [string]$Content,
    [string]$Pattern,
    [string]$Message
  )

  Add-Check -Checks $Checks -Name $Name -Pass ($Content -match $Pattern) -Message $Message
}

$checks = [System.Collections.Generic.List[object]]::new()

$requiredFiles = @(
  "scripts/package-windows-portable.ps1",
  "scripts/verify-windows-portable.ps1",
  "scripts/verify-browser-extension.ps1",
  "browser-extension/manifest.json",
  "packaging/flatpak/dev.fetchdock.desktop.yml",
  "packaging/flatpak/dev.fetchdock.desktop.desktop",
  "packaging/flatpak/dev.fetchdock.desktop.metainfo.xml",
  "packaging/macos/README.md",
  "docs/BUILD.md",
  "package.json"
)

foreach ($relativePath in $requiredFiles) {
  $path = Join-Path $repoRoot $relativePath
  Add-Check -Checks $checks -Name "file:$relativePath" -Pass (Test-Path -LiteralPath $path -PathType Leaf) -Message "Required release packaging file is missing: $relativePath"
}

$packageScript = Read-Text "scripts/package-windows-portable.ps1"
$verifyScript = Read-Text "scripts/verify-windows-portable.ps1"
$extensionVerifyScript = Read-Text "scripts/verify-browser-extension.ps1"
$extensionManifest = Read-Text "browser-extension/manifest.json"
$flatpakManifest = Read-Text "packaging/flatpak/dev.fetchdock.desktop.yml"
$flatpakDesktop = Read-Text "packaging/flatpak/dev.fetchdock.desktop.desktop"
$flatpakMetainfo = Read-Text "packaging/flatpak/dev.fetchdock.desktop.metainfo.xml"
$macosReadme = Read-Text "packaging/macos/README.md"
$buildDoc = Read-Text "docs/BUILD.md"
$packageJsonRaw = Read-Text "package.json"
$packageJson = $packageJsonRaw | ConvertFrom-Json

$portableDataDirs = @("config", "db", "downloads", "cache", "cookies", "dependencies", "plugins", "logs", "diagnostics")
foreach ($name in $portableDataDirs) {
  Assert-Contains -Checks $checks -Name "portable-package-dir:$name" -Content $packageScript -Pattern ([regex]::Escape($name)) -Message "package-windows-portable.ps1 does not stage data directory: $name"
  Assert-Contains -Checks $checks -Name "portable-verify-dir:$name" -Content $verifyScript -Pattern ([regex]::Escape($name)) -Message "verify-windows-portable.ps1 does not require data directory: $name"
}

Assert-Contains -Checks $checks -Name "portable-package-exe" -Content $packageScript -Pattern "FetchDock\.exe" -Message "package-windows-portable.ps1 must stage FetchDock.exe"
Assert-Contains -Checks $checks -Name "portable-package-marker" -Content $packageScript -Pattern "portable\.txt" -Message "package-windows-portable.ps1 must write portable.txt"
Assert-Contains -Checks $checks -Name "portable-package-checksums" -Content $packageScript -Pattern "checksums\.sha256" -Message "package-windows-portable.ps1 must write checksums.sha256"
Assert-Contains -Checks $checks -Name "portable-package-manifest" -Content $packageScript -Pattern "release-manifest\.json" -Message "package-windows-portable.ps1 must write release-manifest.json"
Assert-Contains -Checks $checks -Name "portable-package-id" -Content $packageScript -Pattern "fetchdock-windows-portable" -Message "package-windows-portable.ps1 must use the expected package id"

Assert-Contains -Checks $checks -Name "portable-verify-exe" -Content $verifyScript -Pattern "FetchDock\.exe" -Message "verify-windows-portable.ps1 must require FetchDock.exe"
Assert-Contains -Checks $checks -Name "portable-verify-marker" -Content $verifyScript -Pattern "portable\.txt" -Message "verify-windows-portable.ps1 must require portable.txt"
Assert-Contains -Checks $checks -Name "portable-verify-checksums" -Content $verifyScript -Pattern "checksums\.sha256" -Message "verify-windows-portable.ps1 must require checksums.sha256"
Assert-Contains -Checks $checks -Name "portable-verify-manifest" -Content $verifyScript -Pattern "release-manifest\.json" -Message "verify-windows-portable.ps1 must require release-manifest.json"
Assert-Contains -Checks $checks -Name "portable-verify-schema" -Content $verifyScript -Pattern "schema_version" -Message "verify-windows-portable.ps1 must validate manifest schema_version"
Assert-Contains -Checks $checks -Name "portable-verify-package-id" -Content $verifyScript -Pattern "fetchdock-windows-portable" -Message "verify-windows-portable.ps1 must validate the expected package id"
Assert-Contains -Checks $checks -Name "portable-verify-hash" -Content $verifyScript -Pattern "Get-Sha256Hex" -Message "verify-windows-portable.ps1 must validate SHA-256 hashes"
Assert-Contains -Checks $checks -Name "portable-verify-bytes" -Content $verifyScript -Pattern "bytes" -Message "verify-windows-portable.ps1 must validate file byte counts"

Assert-Contains -Checks $checks -Name "extension-package-flag" -Content $extensionVerifyScript -Pattern '\[switch\]\$Package' -Message "verify-browser-extension.ps1 must keep the package switch"
Assert-Contains -Checks $checks -Name "extension-chrome-target" -Content $extensionVerifyScript -Pattern "chrome" -Message "verify-browser-extension.ps1 must keep Chrome target packaging"
Assert-Contains -Checks $checks -Name "extension-firefox-target" -Content $extensionVerifyScript -Pattern "firefox" -Message "verify-browser-extension.ps1 must keep Firefox target packaging"
Assert-Contains -Checks $checks -Name "extension-package-manifest" -Content $extensionVerifyScript -Pattern "browser-extension-package-manifest\.json" -Message "verify-browser-extension.ps1 must write package manifest metadata"
Assert-Contains -Checks $checks -Name "extension-permission-guard" -Content $extensionVerifyScript -Pattern "Assert-ManifestStringSet" -Message "verify-browser-extension.ps1 must guard manifest permission drift"
Assert-Contains -Checks $checks -Name "extension-manifest-v3" -Content $extensionManifest -Pattern '"manifest_version"\s*:\s*3' -Message "Browser extension manifest must remain Manifest V3"
Assert-Contains -Checks $checks -Name "extension-background-worker" -Content $extensionManifest -Pattern '"service_worker"\s*:\s*"shared/background\.js"' -Message "Browser extension manifest must reference the background worker"

Assert-Contains -Checks $checks -Name "flatpak-app-id" -Content $flatpakManifest -Pattern "app-id:\s+dev\.fetchdock\.desktop" -Message "Flatpak manifest app-id must match desktop/metainfo id"
Assert-Contains -Checks $checks -Name "flatpak-runtime" -Content $flatpakManifest -Pattern "org\.freedesktop\.Platform" -Message "Flatpak manifest must declare a freedesktop runtime"
Assert-Contains -Checks $checks -Name "flatpak-command" -Content $flatpakManifest -Pattern "command:\s+fetchdock" -Message "Flatpak manifest must launch fetchdock"
Assert-Contains -Checks $checks -Name "flatpak-desktop-source" -Content $flatpakManifest -Pattern "dev\.fetchdock\.desktop\.desktop" -Message "Flatpak manifest must include the desktop entry"
Assert-Contains -Checks $checks -Name "flatpak-metainfo-source" -Content $flatpakManifest -Pattern "dev\.fetchdock\.desktop\.metainfo\.xml" -Message "Flatpak manifest must include the metainfo file"
Assert-Contains -Checks $checks -Name "flatpak-desktop-exec" -Content $flatpakDesktop -Pattern "Exec=fetchdock" -Message "Flatpak desktop entry must launch fetchdock"
Assert-Contains -Checks $checks -Name "flatpak-desktop-icon" -Content $flatpakDesktop -Pattern "Icon=dev\.fetchdock\.desktop" -Message "Flatpak desktop entry icon id must match app id"
Assert-Contains -Checks $checks -Name "flatpak-metainfo-id" -Content $flatpakMetainfo -Pattern "<id>dev\.fetchdock\.desktop</id>" -Message "Flatpak metainfo id must match app id"
Assert-Contains -Checks $checks -Name "flatpak-metainfo-launchable" -Content $flatpakMetainfo -Pattern "<launchable type=`"desktop-id`">dev\.fetchdock\.desktop\.desktop</launchable>" -Message "Flatpak metainfo must reference the desktop id"

Assert-Contains -Checks $checks -Name "macos-dmg-command" -Content $macosReadme -Pattern "tauri -- build -- --bundles dmg" -Message "macOS packaging notes must include the DMG build command"
Assert-Contains -Checks $checks -Name "macos-icon" -Content $macosReadme -Pattern "src-tauri/icons/icon\.icns" -Message "macOS packaging notes must reference the app icon input"
Assert-Contains -Checks $checks -Name "macos-signing" -Content $macosReadme -Pattern "notariz|Sign|sign" -Message "macOS packaging notes must keep signing/notarization visible"

Assert-Contains -Checks $checks -Name "build-doc-portable" -Content $buildDoc -Pattern "package:windows-portable" -Message "Build docs must document Windows portable packaging"
Assert-Contains -Checks $checks -Name "build-doc-verify-portable" -Content $buildDoc -Pattern "verify:windows-portable" -Message "Build docs must document Windows portable verification"
Assert-Contains -Checks $checks -Name "build-doc-verify-windows" -Content $buildDoc -Pattern "verify:windows" -Message "Build docs must document the final Windows verification npm script"
Assert-Contains -Checks $checks -Name "build-doc-verify-media-clip" -Content $buildDoc -Pattern "verify:media-clip" -Message "Build docs must document the optional real-media smoke npm script"
Assert-Contains -Checks $checks -Name "build-doc-browser-extension" -Content $buildDoc -Pattern "package:browser-extension" -Message "Build docs must document browser extension packaging"
Assert-Contains -Checks $checks -Name "build-doc-flatpak" -Content $buildDoc -Pattern "Flatpak" -Message "Build docs must document Flatpak packaging skeleton"
Assert-Contains -Checks $checks -Name "build-doc-macos" -Content $buildDoc -Pattern "macOS DMG" -Message "Build docs must document macOS DMG packaging"
$readme = Read-Text "README.md"
Assert-Contains -Checks $checks -Name "readme-verify-media-clip" -Content $readme -Pattern "verify:media-clip" -Message "README must document the optional real-media smoke npm script"
Assert-Contains -Checks $checks -Name "readme-browser-extension" -Content $readme -Pattern "package:browser-extension" -Message "README must document browser extension packaging"

Add-Check -Checks $checks -Name "npm-script-package-portable" -Pass ($null -ne $packageJson.scripts."package:windows-portable") -Message "package.json must expose package:windows-portable"
Add-Check -Checks $checks -Name "npm-script-verify-portable" -Pass ($null -ne $packageJson.scripts."verify:windows-portable") -Message "package.json must expose verify:windows-portable"
Add-Check -Checks $checks -Name "npm-script-verify-windows" -Pass ($null -ne $packageJson.scripts."verify:windows") -Message "package.json must expose verify:windows"
Add-Check -Checks $checks -Name "npm-script-verify-media-clip" -Pass ($null -ne $packageJson.scripts."verify:media-clip") -Message "package.json must expose verify:media-clip"
Add-Check -Checks $checks -Name "npm-script-verify-browser-extension" -Pass ($null -ne $packageJson.scripts."verify:browser-extension") -Message "package.json must expose verify:browser-extension"
Add-Check -Checks $checks -Name "npm-script-package-browser-extension" -Pass ($null -ne $packageJson.scripts."package:browser-extension") -Message "package.json must expose package:browser-extension"

$result = [pscustomobject]@{
  ok = $true
  checked_at = (Get-Date).ToUniversalTime().ToString("o")
  source_root = $repoRoot.Path
  check_count = $checks.Count
  checks = $checks
  note = "Static release packaging guard only; it does not build, sign, notarize, package, install, or smoke-test release artifacts."
}

if ($Json) {
  $result | ConvertTo-Json -Depth 5
} else {
  Write-Output "Release packaging static guard passed: $($checks.Count) checks"
  Write-Output $result.note
}
