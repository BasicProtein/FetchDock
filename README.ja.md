# FetchDock

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README.zh-CN.md">简体中文</a> |
  <a href="./README.ko.md">한국어</a> |
  <a href="./README.ja.md">日本語</a>
</p>

**動画、講座、音楽、書籍、ブラウザ取り込み、プラグインワークフローのためのローカル中心デスクトップダウンローダー兼学習ワークスペースです。**

FetchDock は、学習素材やメディアワークフローがブラウザタブ、講座プラットフォーム、チャットチャンネル、ダウンロードフォルダ、コマンドラインツールに分かれている人のために作られています。取り込み、キュー、メタデータ、ローカルライブラリ、レビュー機能をひとつのデスクトップアプリにまとめ、ユーザーデータは既定でローカルマシンに置きます。

> Status: FetchDock is in active development. The repository contains a working local desktop milestone, but some integrations, packaging gates, and real-service validation matrices are still pending.

## Why FetchDock

ダウンロードは、たいてい単なるダウンロードでは終わりません。

- リンク、Cookie、ファイル名、字幕、メタデータ、出力フォルダが別々のツールに分かれがちです。
- yt-dlp、FFmpeg、gallery-dl は強力ですが、オプション、依存関係、ログがひとつのローカル作業環境で見えるほうが扱いやすくなります。
- 講座、動画、PDF、音楽、ノート、ブラウザ取り込みは、ファイル保存後にも整理が必要です。
- プライベートなメディアワークフローで、リンク、ファイルパス、Cookie、診断情報、学習履歴をリモートサービスに送る必要はありません。

FetchDock は、散らばった流れをローカルのデスクトップ制御環境にまとめることを目指しています。

## Highlights

- **Unified capture**: paste URLs, import batches, or send page and media candidates from the browser extension bridge.
- **Local download queue**: track queued, active, paused, completed, failed, canceled, and archived tasks with logs, progress, retry metadata, and output actions.
- **Media toolchain**: inspect metadata, thumbnails, subtitles, chapters, comments, live chat sidecars, FFmpeg clips, waveform peaks, and subtitle workshop data.
- **Dependency control**: review tool status, manual paths, managed Windows installs for supported tools, and clear failure messages.
- **Cookie workspace**: manage local Cookie buckets, imports, URL matching, health checks, and redacted task logs.
- **Learning libraries**: keep local course manifests, reading previews, music scans, timestamped notes, Pomodoro sessions, daily goals, and graph summaries together.
- **Browser handoff**: use the Chrome/Firefox extension scaffold with a local loopback bridge and blocked-host settings.
- **Plugin-ready shell**: install and review local plugin manifests, settings, data folders, navigation entries, preflight checks, and activity logs.

## Current Build

The current repository contains a Tauri 2 + Svelte desktop app with Rust backend commands, SQLite-backed local state, a browser extension scaffold, packaging scripts, and engineering docs.

Working local subsets include:

- Direct-file HTTP(S) downloads with `.part` resume behavior, rate limiting, proxy options, retry metadata, logs, and output actions.
- yt-dlp media task execution with quality, audio extraction, clip ranges, subtitle options, SponsorBlock flags, metadata, Cookie bucket support, and custom argument planning.
- gallery-dl image/gallery task routing into task-scoped output folders.
- Platform and route classification metadata for common video, social, gallery, direct-file, playlist, profile, live, clip, and webpage intents.
- Settings sections for downloads, network, cookies, browser extension, channels, plugins, dependencies, appearance, advanced review tools, and scoped AI/Whisper configuration.
- Local course, Telegram, Bilibili, channel, torrent/magnet, P2P, reading, music, and learning data stores with metadata-first queueing and review actions.
- CLI commands for local task management, settings import/export, diagnostics, platform matrices, metadata tools, cookies, channels, courses, library, music, plugins, and release evidence.

Still pending:

- Full release packaging, signing, final license/notice review, and packaged-app smoke tests.
- Real-service validation matrices for every platform and account state.
- Full browser-store extension validation.
- Telegram MTProto login, sync, and media download.
- Full torrent/magnet engine and seeding.
- Complete reader/player experiences beyond current local previews.
- Dynamic plugin host loading, signing, isolation, and remote marketplace policy.
- Full test, build, clippy, and release gate completion.

## Development

Requirements:

- Node.js 24 or compatible modern Node.js.
- npm 11 or compatible npm.
- Rust stable toolchain.
- Tauri 2 prerequisites for your platform.

Fast feature-work checks:

```powershell
npm run verify:fast
npm run typecheck
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
cargo fmt --manifest-path src-tauri/Cargo.toml
cargo check --manifest-path src-tauri/Cargo.toml
npm run verify:project-boundary
npm run verify:release-packaging
```

## Browser Extension

The unpacked extension lives in `browser-extension/`.

```powershell
npm run verify:browser-extension
npm run package:browser-extension
fetchdock extension-package-summary --human
fetchdock extension-release-safety --human
fetchdock export-extension-release-safety ./extension-release-safety.json
```

- Chrome: open Extensions, enable Developer mode, and load `browser-extension/` as an unpacked extension.
- Firefox: load the same folder temporarily from `about:debugging`.
- The extension first tries `POST http://127.0.0.1:17654/v1/extension/download` for page, link, and media handoff.
- If the bridge is unavailable and fallback is enabled, it opens `fetchdock://capture?url=...&kind=...`.

Pairing automation, end-to-end browser validation, authorization storage hardening, HLS grouping matrix checks, store signing, and release submission are not complete yet.

## Documentation

- [Capability map](docs/CAPABILITY_MAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API contracts](docs/API_CONTRACTS.md)
- [Acceptance checklist](docs/ACCEPTANCE.md)
- [Build from source](docs/BUILD.md)
- [Changelog](docs/CHANGELOG.md)
