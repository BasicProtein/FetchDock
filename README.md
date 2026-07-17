# FetchDock

FetchDock is an original desktop application project for local-first downloading, libraries, browser extension handoff, and plugin workflows.

The project keeps its source code, assets, screenshots, branding, UI copy, translations, visual identity, and distinctive design expression original to this repository.

## Current Status

The repository currently contains a Tauri 2 + Svelte desktop app with original navigation for Home, Downloads, Tools, Channels, Courses, Telegram, Settings, Plugins, Legal, and About. Built-in routes persist across frontend reloads and desktop restarts; plugin-contributed routes intentionally fall back to built-in pages if the plugin disappears.

First-phase milestone stopping point: the core desktop shell and Settings loop is closed for `Settings > AI`. That panel now loads existing settings, edits only `whisper_model`, `whisper_language`, `whisper_task`, `subtitle_translate_enabled`, and `grammar_cleanup_enabled`, saves through `settings_update`, resets through `settings_reset_section("ai")`, and reloads the persisted local values through `settings_get_all` after refresh or restart. Provider scope remains read-only here; no cloud provider, API key, network call, or new AI product workflow is added.

Implemented working subsets include:

- Download queue persistence in SQLite with direct-file HTTP(S) downloads, resume via `.part` files with explicit restart logging when a server ignores Range requests, rate limit, unauthenticated HTTP/SOCKS5 proxy support, task logs, retry metadata, and reveal/open actions.
- Downloads history browsing includes status/type/platform filters plus text search across title, URL, platform, output path, and error text.
- Queue task kinds now include video, audio, image, subtitles-only, torrent, P2P, PDF, book, webpage, Telegram media, course lesson, and generic subsets; webpage tasks save the main HTML document plus a conservative same-origin asset folder, including inline/simple CSS url(...) references and same-origin resources referenced by saved CSS files, while unsupported engines fail honestly when started.
- Home URL detection now labels target platforms, gallery-oriented hosts, other Asian platform labels, playlist/profile/gallery/live/clip/direct-file/webpage intents, and per-URL batch draft routing while keeping real-site matrix validation pending.
- Tools includes a local platform support matrix backed by `platforms_get_matrix`, showing route, implementation state, evidence, and limitations without treating classifier labels as verified site support. The matrix can be copied or exported for review. Route sample checks now load their sample URL list from `platforms_get_route_samples` with a frontend fallback, and the visible sample set can be searched, filtered, copied, exported to diagnostics, opened, or queued as local drafts without probing live sites.
- Bilibili URL detection includes local subtype labels for b23 links, video, bangumi/media, course, creator/profile, favorites, watch later, history, and weekly routes; account-backed preview remains pending.
- yt-dlp execution for non-direct-file media tasks with quality, audio extraction, video/audio segment sections, subtitle, SponsorBlock, metadata, Cookie bucket, safe custom argument appends, output directory, filename template, and skip-existing argument planning, plus a gallery-dl image/gallery task subset that writes to task-scoped output directories.
- Dependency detection, manual tool path overrides, staged installs/updates for supported Windows downloader tools, and install progress events.
- Cookie bucket management from paste/file/extension-payload imports, URL matching, local health checks, single/bulk clear, yt-dlp `--cookies`, direct-file `Cookie` header injection, Twitter/X manual Cookie header fallback with log redaction and a local reset path, and a local Bilibili status plus watch-later/history manifest import queue and metadata-only summary/export subset.
- Media tools for metadata probing/saving, thumbnails, subtitles, chapters, comments, live chat sidecars, FFmpeg clip/reencode, shot markers, waveform peaks, and a local Subtitle Workshop subset.
- Local Channels tracking with RSS/Atom feed expansion, metadata-probe fallback checks, persisted history, auto-download queue creation, and a local polling interval setting.
- Channel history entries can be manually queued or queued again into the download list while platform-specific feed expansion and final dedupe validation remain pending.
- Local `.torrent` metadata parsing with queue-time file selection, magnet URI parsing, torrent/magnet queue drafts and metadata sidecar export, P2P short-code offer, receive-folder, `p2p/queued` receive drafts, P2P receive sidecar export, plus a local Torrent/P2P transfer panel for filtering and batch Start/Pause/Resume/Retry/Cancel/Archive/Restore controls. The same local subset also includes reading library scanning/rescanning with TXT/HTML/PDF preview, PDF metadata summaries, safe EPUB/CBZ manifest previews, bounded EPUB reader text previews, bounded CBZ page image previews, and EPUB/CBZ cover thumbnails, persisted progress/bookmarks/highlights editing with preview progress restore, debounced scroll progress autosave, annotation jump/edit helpers, EPUB/CBZ preview-index jumps, reading-highlight-to-note capture, and library-scoped external open/reveal actions, music folder scanning/rescanning with lightweight embedded tags, embedded cover cache, and sidecar metadata JSON, a persisted local audio queue, previous/next controls, queue ordering/removal, saved volume, timed sidecar lyrics highlighting, playlists, sleep timer state, equalizer preset state, course candidate and local manifest import with lesson progress plus local lesson media open, lesson queue drafts, course platform matrix copy plus sample search/copy/export/import candidate actions, timestamped local lesson notes with local preview time jumps, and attachment open/reveal actions, Telegram auth-state plus local chat/media manifest import/search/queue and metadata-only summary/export subset, and local Learning notes/Pomodoro session records plus daily journal, `[[note]]` link summaries, backlinks counts, graph summaries, daily goals, and a 365-day progress dashboard with month and weekday labels.
- Browser extension scaffold plus loopback bridge on `127.0.0.1:17654` for current-page/link/media handoff into desktop download tasks, with extension-side media candidates, HLS/DASH segment grouping, blocked-host settings plus desktop-side blocked-host persistence, current-tab scoped badge feedback, popup/options bridge health checks, desktop-to-extension connector profile JSON import, Referer/User-Agent hint capture with desktop/CLI option persistence, local Cookie payload staging with Extension/Cookies panel inventory and direct staged-payload import into Cookie buckets, Authorization payload staging with metadata path/URL/preview review, task-kind handoff so audio/image candidates do not always become video tasks, local Chrome/Firefox review zip generation, desktop/CLI package metadata summaries for local source/package review, and metadata-only extension package/pairing release-safety evidence in release snapshots.
- Appearance, Downloads, Network, Cookies, Channels, Plugins, Browser Extension, AI scope, Advanced diagnostics/log listing, safe diagnostics bundle export with platform route samples and course sample evidence, recovery manifest export, release evidence snapshot export with plugin trust/readiness and extension release-safety evidence, local legal readiness summary review/export, local release package summary review/export, local release document summary review/export, local third-party notice summary review with bundled artifact metadata, local feature evidence summary/export with platform/course/music matrix counts, local audit summary/export, local privacy status, local update-manifest check plus saved/due update preferences and a read-only due poller, settings manifest import/export, third-party notice inventory export, Markdown notice draft export, preview, local Auth fallback reset, guarded implemented-settings reset, dependency tool-settings reset, cleanup tools, and a dedicated Legal page with a structured release checklist for originality/privacy/release-gate notices, plus Dependencies, Paths, and Infrastructure settings panels, including local Network proxy format validation, desktop-side extension options persistence, command-palette shortcuts into common settings sections, a lightweight app-shell i18n subset, and 14 original theme entries in Appearance.
- Local plugin manifest registry with install/enable/disable/uninstall/update-from-local-marketplace, bulk local marketplace refresh, manual install-missing-local marketplace state, local marketplace JSON import, JSON settings/data directories, manifest-contributed navigation entries, a safe command-call local log, and local plugin trust/readiness summary review/export, without executing plugin code or claiming signing/trust completion.
- Minimal CLI dispatch for info, privacy status, release checklist, legal readiness summary/export, release package summary, release document summary, third-party notice summary with bundled artifact metadata, diagnostics inventory/export/read/delete/clear, download-log inventory/read/delete/clear, partial-download cleanup, release evidence snapshot export, local feature evidence summary/export, safe diagnostics bundle export, third-party notice inventory export, Markdown notice draft export, recovery manifest export, settings read/JSON patch/manifest export/import, local audit summary/export, settings reset/network validation/downloads settings/channel polling settings, local update manifest saved/due checks, local update/auth/extension option updates, P2P offer lookup, lifecycle, and bulk local controls, Library external open/reveal, reading annotation update commands, course/Telegram/Bilibili local manifest import/list/status/search/update/delete/clear/prune/queue commands, direct course/music service matrix reads, course platform sample list/export commands, Channels list/add/check/history queue and cleanup commands, Torrent/P2P parse/queue/offer/receive draft commands, Library/Music list/scan/import/rescan/prune/delete/clear catalog commands, Reader state/settings commands, Music queue/lyrics/playlist/sleep/EQ/Discord-presence/playback-stat commands, Learning notes/dashboard/graph/Pomodoro/daily-goal create/delete/clear commands, Browser Extension options/pairing/connector-profile/package/release-safety/payload inventory, staged Cookie payload import, and cleanup commands, local Plugin registry/marketplace/install/update/uninstall/enable/disable/preflight/log cleanup and trust-summary/export commands, Cookie bucket list/match/test/rename/export/delete/clear/file-import/extension-payload-import commands, dependency status, tool update check, tool path override, tool download source config, settings search, course probe/import/open helpers, Telegram local account state/media open/reveal plus metadata-only local summary/export, Bilibili local summary/export, plugin settings/command/event local logs, music playback record, plus metadata probe/list/save sidecar commands, local media utility commands for subtitle merge/open/save, FFmpeg clip/transcode/shot/waveform, and Whisper subtitle generation, platform/course/music matrix exports, platform support matrix, platform route sample listing/export, course platform sample listing/export, queued URL task creation, batch URL task creation, and local task listing/detail/log/start/pause/resume/retry/cancel/bulk/reorder/archive/restore/delete cleanup plus system open/reveal helpers, with default JSON output, optional `--human` summaries, optional `--data-dir` root selection, queued-task creation flags for kind, output folder, title, quality, audio format, Cookie bucket, network options, live/fragments, run-after-active-slot, custom args, clip range, auth payloads, subtitles, SponsorBlock, thumbnail URLs with the same best-effort local cache path, and metadata, and local-only task management commands that update local stores or the local queue for the desktop scheduler without running downloads, remote sync, BitTorrent transfer, P2P transfer, plugin dynamic execution, full reader rendering, or media playback in the CLI process.

Still incomplete areas are tracked in `docs/FUNCTION_PARITY.md` and `docs/ACCEPTANCE.md`. Outside this first-phase stopping point: Extension, Metadata, Plugin, Library, Music, real-site matrices, full tests, release signing, packaging, real course lesson extraction, Telegram MTProto login/chat/media, full torrent/magnet downloads and seeding, full reader/player views beyond current local previews, full plugin host loading, and remote updater pipelines remain pending.

## Development

Requirements:

- Node.js 24 or compatible modern Node.js.
- npm 11 or compatible npm.
- Rust stable toolchain.
- Tauri 2 prerequisites for your platform.
- On Windows, Visual Studio Build Tools with the Visual C++ toolchain must provide `cl.exe`/`link.exe`; this workspace can also use the locally extracted Windows SDK path described in `docs/BUILD.md`.

Fast feature-work checks:

```powershell
npm run verify:fast
npm run typecheck
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
cargo fmt --manifest-path src-tauri/Cargo.toml
cargo check --manifest-path src-tauri/Cargo.toml
npm run verify:originality
npm run verify:release-packaging
```

Optional real-media smoke, kept out of the regular fast path:

```powershell
npm run verify:media-clip -- -FfmpegPath "E:\Software\FFMPEG\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
```

Full Windows gate for final verification:

```powershell
npm run verify:windows -- -WindowsSdkRoot "E:\Data\Own\Entrepreneurship\FetchDock\build-tools\winsdk-26100-extract\Windows Kits\10"
.\scripts\verify-windows.ps1 -WindowsSdkRoot "E:\Data\Own\Entrepreneurship\FetchDock\build-tools\winsdk-26100-extract\Windows Kits\10"
```

Portable package manifest check after a successful Windows build/staging:

```powershell
npm run package:windows-portable
npm run verify:windows-portable
```

This validates the staged portable marker, data folders, manifest, SHA-256 rows, and byte counts. It is not a signing or runtime smoke substitute.

## Browser Extension

The unpacked extension lives in `browser-extension/`.

Local extension checks and review package:

```powershell
npm run verify:browser-extension
npm run package:browser-extension
fetchdock extension-package-summary --human
fetchdock extension-release-safety --human
fetchdock export-extension-release-safety ./extension-release-safety.json
```

These validate manifest/resource references, lock the current extension permission scope for release review, and run JavaScript syntax checks, then create local Chrome and Firefox review zips plus a package manifest. Settings > Browser Extension, `extension-package-summary`, and `extension-release-safety` can inspect the local source/package manifest, file counts, sizes, SHA-256 values, pairing/options status, blocked-host counts, and staged payload counts without reading browser storage, Cookie/Auth payload contents, pairing tokens, or downloaded content. Settings and CLI can also export this release-safety summary as local JSON. Release evidence snapshots include the same metadata-only extension package, pairing/options, blocked-host, and staged payload counts for review, while the release gate stays pending. They do not replace store signing or end-to-end browser validation.

- Chrome: open Extensions, enable Developer mode, and load `browser-extension/` as an unpacked extension.
- Firefox: load the same folder temporarily from `about:debugging`.
- The extension first tries `POST http://127.0.0.1:17654/v1/extension/download` for page/link/media handoff and can include an inferred `kind` for media candidates or direct file links. The desktop bridge also keeps legacy `/pair/start`, `/pair/complete`, `/download/page`, `/download/media`, `/download/batch`, and `/cookies/import` compatibility endpoints, with pairing tokens still created only from desktop Settings or CLI. Its popup shows visible/hidden detected-media counts, can Send shown, Copy shown, Copy JSON, or Clear shown candidates for the active tab, while the options page can copy a sanitized settings JSON without token/Cookie/Auth values. The popup also exposes local Cookie and Authorization payload staging endpoints.
- If the bridge is unavailable and fallback is enabled, it opens `fetchdock://capture?url=...&kind=...`.

Pairing automation, end-to-end browser validation, authorization storage hardening, HLS grouping matrix checks, store signing, and release submission are not complete yet.

## Documentation

- [Function parity](docs/FUNCTION_PARITY.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API contracts](docs/API_CONTRACTS.md)
- [Acceptance checklist](docs/ACCEPTANCE.md)
- [Build from source](docs/BUILD.md)
- [Changelog](docs/CHANGELOG.md)
