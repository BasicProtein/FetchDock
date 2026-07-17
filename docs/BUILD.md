# Build From Source

## Prerequisites

Install:

- Node.js and npm.
- Rust stable toolchain.
- Tauri 2 platform prerequisites.

On Windows, Rust's default MSVC target requires Visual Studio Build Tools with the Visual C++ workload and Windows SDK libraries/tools. Verify the linker is available:

```powershell
where.exe link
```

If `link.exe` is not found, Rust compilation and Tauri build smoke tests cannot complete on that machine. If `kernel32.lib` or `rc.exe` is missing, install the Windows SDK component for the local Build Tools installation or provide a locally extracted SDK root to the verification script.

## Install Dependencies

```powershell
npm install
```

## Frontend Checks

During fast implementation passes, prefer the light checks below and save the full gate for convergence:

```powershell
npm run verify:fast
```

The fast preflight runs typecheck, Rust fmt check, browser-extension static verification, release packaging static guard, project boundary guard, conflict-marker scan, and CRLF escape literal scan. It does not run frontend tests, Rust tests, clippy, Tauri build, package signing, installer smoke, or browser E2E.

Individual light checks:

```powershell
npm run typecheck
node --check browser-extension/shared/background.js
node --check browser-extension/popup/popup.js
node --check browser-extension/options/options.js
npm run verify:release-packaging
npm run verify:project-boundary
```

Local release package metadata can be reviewed without running the full packaging gate:

```powershell
fetchdock legal-readiness-summary --human
fetchdock export-legal-readiness legal-readiness-summary.json --human
fetchdock release-package-summary --human
fetchdock export-release-package-summary release-package-summary.json --human
fetchdock release-docs-summary --human
fetchdock export-release-docs-summary release-document-summary.json --human
```

These read local release gates, release-document metadata, missing final legal files such as `LICENSE` / `NOTICE.md` / `THIRD_PARTY_NOTICES.md`, `dist/`, `dist-portable/`, Tauri bundle output, packaging templates, release scripts, and dependency notice counts. They do not run builds, signing, notarization, installer smoke tests, portable verification, or legal clearance.

`npm run verify:release-packaging` is a fast static guard for release helper consistency. It checks that the Windows portable package/verify scripts agree on required marker files, manifest fields, checksum/byte validation, and portable data directories, and that the Flatpak/macOS packaging templates plus npm scripts are still wired. It does not run Tauri build, create packages, sign, notarize, install, launch, or smoke-test artifacts.

`npm run verify:project-boundary` scans tracked source, docs, scripts, extension, and packaging text outside generated/build directories for hard external project traces. Hard matches fail the guard; review-only boundary language is counted so it can be pruned or reworded before a public release.

Local dependency notice metadata can be reviewed without exporting a notice file:

```powershell
fetchdock notice-summary --human
fetchdock export-notice-draft third-party-notice-draft.md --human
```

This reads local `package-lock.json` and `src-tauri/Cargo.lock` metadata only. The Markdown draft is a review aid; it does not replace bundled asset/tool/installer license review or final notices.

The full frontend gate remains:

```powershell
npm run typecheck
npm test
npm run build
```

## Rust Checks

If Cargo is installed under the default user profile path but is not on `PATH`, run:

```powershell
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
```

Then run:

```powershell
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo test --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets --all-features -- -D warnings
```

For fast implementation passes on this Windows workspace, use `cargo fmt` and `cargo check` with the local SDK environment, then run the full script near the end:

```powershell
$cargo = Join-Path $env:USERPROFILE ".cargo\bin\cargo.exe"
& $cargo fmt --manifest-path src-tauri/Cargo.toml

$vcvars = "E:\Software\VS_BuildTools\Microsoft Visual Studio\18\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
$WindowsSdkRoot = "E:\Data\Own\Entrepreneurship\FetchDock\build-tools\winsdk-26100-extract\Windows Kits\10"
$sdkVersion = "10.0.26100.0"
$sdkBin = Join-Path $WindowsSdkRoot "bin\$sdkVersion\x64"
$sdkLib = Join-Path $WindowsSdkRoot "Lib\$sdkVersion"
$sdkInclude = Join-Path $WindowsSdkRoot "Include\$sdkVersion"
$envSetup = "call `"$vcvars`" && set WindowsSdkDir=$WindowsSdkRoot\ && set WindowsSDKVersion=$sdkVersion\ && set PATH=$sdkBin;%PATH% && set LIB=$sdkLib\um\x64;$sdkLib\ucrt\x64;%LIB% && set INCLUDE=$sdkInclude\um;$sdkInclude\ucrt;$sdkInclude\shared;%INCLUDE%"
cmd.exe /v:on /d /c "$envSetup && `"$cargo`" check --manifest-path src-tauri/Cargo.toml"
```

For this workspace, the checked-in helper uses `E:\Software\VS_BuildTools` by default:

```powershell
npm run verify:windows
.\scripts\verify-windows.ps1
```

The final Windows gate runs the fast static preflight after typecheck and before the heavier frontend/Rust/build steps, while skipping duplicate typecheck and Rust fmt inside that fast pass.

If the Windows SDK is not registered system-wide but has been extracted locally, pass the extracted `Windows Kits\10` path:

```powershell
.\scripts\verify-windows.ps1 -WindowsSdkRoot "E:\Data\Own\Entrepreneurship\FetchDock\build-tools\winsdk-26100-extract\Windows Kits\10"
```

This local extraction path is a machine cache and is ignored by Git. A normal administrator-installed Windows SDK remains the preferred durable setup.


## Update Manifest Smoke

Saved update preferences can also be exercised with `check-configured-update` for an immediate read-only manifest check or `check-due-update` / `poll-due-update` for an interval-aware check. These commands and the desktop due poller only inspect manifest metadata and update local settings state; they do not download installers, verify signatures, replace binaries, or apply updates.


The current updater subset checks local or remote JSON manifests but does not download, verify signatures, or install updates. To exercise the manifest parser from the UI, create a JSON file such as:

```json
{
  "version": "0.1.1",
  "release_notes": "Local release manifest smoke check.",
  "download_url": "https://example.invalid/fetchdock-0.1.1.exe"
}
```

Open Settings > Advanced, paste the manifest path or an `http://` / `https://` URL, and run `Check`. Remote manifest reads are capped at 1 MB and only parse JSON metadata. A real signed Tauri updater pipeline is still pending.

After saving the manifest path or URL in Settings, the same persisted source can be checked from the CLI:

```powershell
fetchdock check-configured-update --human
```

## Privacy Smoke

Settings > Advanced exposes the local privacy status command. It should report telemetry disabled, URL inclusion off by default, and Cookie values excluded from diagnostics summaries. This is a local state check, not a substitute for the final network audit.
## Optional Real Media Checks

The regular Windows gate uses fake tools for deterministic downloader coverage. To verify the local FFmpeg video clip path against real media, run the explicit media smoke script with a real `ffmpeg.exe`:

```powershell
npm run verify:media-clip -- -WindowsSdkRoot "E:\Data\Own\Entrepreneurship\FetchDock\build-tools\winsdk-26100-extract\Windows Kits\10" -FfmpegPath "E:\Software\FFMPEG\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
```

Equivalent direct script call:

```powershell
.\scripts\verify-media-clip.ps1 -WindowsSdkRoot "E:\Data\Own\Entrepreneurship\FetchDock\build-tools\winsdk-26100-extract\Windows Kits\10" -FfmpegPath "E:\Software\FFMPEG\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
```

The script generates a synthetic MP4, runs stream-copy plus H.264, H.265, and VP9 profile reencode clips through the Rust media command path, decodes the outputs with FFmpeg, and checks missing-input plus invalid-range errors.

## Packaging Skeletons

Windows portable staging after a successful Tauri build:

```powershell
npm run tauri -- build
npm run package:windows-portable
npm run verify:windows-portable
npm run verify:release-packaging
```

The portable script copies the built `fetchdock.exe` to `dist-portable/FetchDock.exe`, writes `portable.txt`, creates the local `data/{config,db,downloads,cache,cookies,dependencies,plugins,logs,diagnostics}` folders used by portable mode, and writes `checksums.sha256` plus `release-manifest.json` with relative file hashes. `npm run verify:windows-portable` checks the staged marker, data directories, manifest rows, SHA-256 hashes, and byte counts without launching the app. `scripts/package-windows-portable.ps1 -Verify` runs the same verifier after staging. Use `-SkipManifest` only for local staging. These scripts do not replace the final Windows signing, installer, or runtime smoke-test gate.

Linux Flatpak packaging has a local manifest skeleton under `packaging/flatpak/dev.fetchdock.desktop.yml` with desktop and metainfo templates. It expects a prepared Linux `fetchdock` binary in the Flatpak build context; full dependency bundling, icons, permissions review, and a real Linux build are still pending.
macOS DMG packaging notes live in `packaging/macos/README.md`. The current Tauri config already references `src-tauri/icons/icon.icns`; real DMG generation, signing, notarization, and macOS smoke logs must happen on macOS.
## Desktop Build

```powershell
npm run tauri build
```

The build output location is managed by Tauri under `src-tauri/target`.

## Browser Extension

Verify extension manifest/resource references and JavaScript syntax:

```powershell
npm run verify:browser-extension
```

Create a local review zip plus package manifest:

```powershell
npm run package:browser-extension
```

The package script writes `dist-extension/fetchdock-connector-<version>.zip` and `browser-extension-package-manifest.json` for local review. It does not replace Chrome Web Store, Firefox Add-ons, signing, or end-to-end browser validation.

The desktop Settings > Browser Extension panel and CLI `fetchdock extension-package-summary --human` can review the local extension source/package metadata after packaging. CLI `fetchdock extension-release-safety --human`, CLI `fetchdock export-extension-release-safety ./extension-release-safety.json`, and the same Settings panel also report or export package/pairing/options/blocked-host/staged-payload release-safety metadata while keeping the release gate pending. These summaries report source/package file counts, byte sizes, SHA-256 values, target zip metadata, local review notes, and safe counts without reading browser storage, Cookie/Auth payload contents, pairing token values, or downloaded content.

Load `browser-extension/` as an unpacked or temporary extension during development. The extension expects the desktop bridge at:

```text
http://127.0.0.1:17654
```

Implemented extension endpoints and flows are:

- `GET /health`
- `POST /pair/start` (manual pairing compatibility)
- `POST /pair/complete` (manual pairing compatibility)
- `POST /v1/extension/download`
- `POST /download/page` (legacy compatibility)
- `POST /download/media` (legacy compatibility)
- `POST /download/batch` (legacy compatibility)
- `POST /v1/extension/cookies`
- `POST /cookies/import` (legacy Cookie payload staging compatibility)
- `POST /v1/extension/authorization`
- popup current-page send
- page/link/media context menus
- media-sniffer candidates in popup, including local HLS grouping
- blocked-host settings and header-capture preference
- desktop-generated connector profile import/copy
- deep-link fallback through `fetchdock://capture?...`

Pairing token validation, cookie/auth payload staging, header capture settings, local media sniffing/HLS grouping, and local extension packaging artifacts are implemented for development review. Chrome/Firefox end-to-end browser validation, store signing/submission, one-click browser storage sync, cross-session grouping, and full auth/media site verification are still pending.
