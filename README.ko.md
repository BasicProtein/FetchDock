# FetchDock

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README.zh-CN.md">简体中文</a> |
  <a href="./README.ko.md">한국어</a> |
  <a href="./README.ja.md">日本語</a>
</p>

**동영상, 강의, 음악, 책, 브라우저 캡처, 플러그인 워크플로를 위한 로컬 중심 데스크톱 다운로더이자 학습 작업 공간입니다.**

FetchDock은 학습 자료와 미디어 파일이 브라우저 탭, 강의 플랫폼, 채팅 채널, 다운로드 폴더, 명령줄 도구에 나뉘어 있는 사용자를 위해 만들어지고 있습니다. 캡처, 큐, 메타데이터, 로컬 라이브러리, 검토 도구를 하나의 데스크톱 앱에 모으고, 사용자 데이터는 기본적으로 로컬 컴퓨터에 남깁니다.

> Status: FetchDock is in active development. The repository contains a working local desktop milestone, but some integrations, packaging gates, and real-service validation matrices are still pending.

## Why FetchDock

다운로드는 보통 단순한 다운로드로 끝나지 않습니다.

- 링크, Cookie, 파일 이름, 자막, 메타데이터, 출력 폴더가 서로 다른 도구에 흩어지기 쉽습니다.
- yt-dlp, FFmpeg, gallery-dl은 강력하지만 옵션, 의존성, 로그가 하나의 로컬 작업 공간에서 보일 때 더 관리하기 쉽습니다.
- 강의, 동영상, PDF, 음악, 노트, 브라우저 캡처는 파일이 저장된 뒤에도 정리가 필요합니다.
- 개인 미디어 워크플로가 링크, 파일 경로, Cookie, 진단 정보, 학습 기록을 원격 서비스에 업로드하도록 요구해서는 안 됩니다.

FetchDock은 흩어진 흐름을 로컬 데스크톱 제어 공간으로 바꾸는 것을 목표로 합니다.

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
