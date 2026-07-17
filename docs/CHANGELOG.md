# Changelog
- Closed the first-phase desktop shell/settings loop for Settings > AI: the panel now loads, edits, saves, resets, and reloads the existing local `whisper_model`, `whisper_language`, `whisper_task`, `subtitle_translate_enabled`, and `grammar_cleanup_enabled` fields through `settings_get_all`, `settings_update`, and `settings_reset_section("ai")`. Provider scope is shown read-only for this milestone; no cloud provider, API key, network call, new AI workflow, broad tests, signing, or packaging work is included.
- Added Appearance/theme/language capability catalog summary/export through `appearance_get_capability_catalog` / `appearance_export_capability_catalog`, CLI `appearance-capability-catalog` / `export-appearance-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Appearance capability catalog controls. The catalog records local appearance capability metadata for appearance settings, safe backup/restore, theme catalog, and language catalog, including commands, CLI aliases, UI surfaces, setting fields, data files, sensitive fields, external asset/text-copy flags, and visual/locale verification gaps; it does not mutate settings, import backups, copy external theme or translation text, include external assets, or claim visual contrast/full UI translation QA.
- Added Settings/local-audit capability catalog summary/export through `settings_get_capability_catalog` / `settings_export_capability_catalog`, CLI `settings-capability-catalog` / `export-settings-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Advanced settings capability catalog controls. The catalog records local settings capability metadata for settings search, read/update, backup/restore, reset, and local audit summaries, including setting sections, settings fields, surfaces, data files, sensitive fields, mutation/import/export/reset/secret/OS-side-effect flags, and verification gaps; it does not read or mutate settings values, import/export backup contents, reset settings, register shortcuts, poll channels, execute plugins, read secret values, or claim settings roundtrip/OS integration E2E verification.
- Added Diagnostics/recovery capability catalog summary/export through `app_get_diagnostics_capability_catalog` / `app_export_diagnostics_capability_catalog`, CLI `diagnostics-capability-catalog` / `export-diagnostics-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Advanced diagnostics capability catalog controls. The catalog records local diagnostics/recovery capability metadata for minimal diagnostics export, diagnostics bundle, recovery manifest, local evidence snapshot, privacy status, file inventories, cleanup controls, fields, surfaces, data files, sensitive fields, and verification gaps; it does not read diagnostics files, log bodies, download URLs, Cookie/Auth values, downloaded content, settings, or partial files, run recovery, upload diagnostics, delete files, or claim recovery/privacy E2E verification.
- Added Legal/third-party notice capability catalog summary/export through `app_get_legal_capability_catalog` / `app_export_legal_capability_catalog`, CLI `legal-capability-catalog` / `export-legal-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Legal plus Settings > Advanced legal capability catalog controls. The catalog records local legal/notice capability metadata for legal readiness, notice summary, notice inventory, notice draft, release document tracking, fields, surfaces, data files, sensitive fields, human-review requirements, and verification gaps; it does not create final legal files, generate final notices, run external audit tools, inspect dependency source text, mutate legal files, or claim license/bundled/store notice clearance.
- Added AI capability catalog summary/export through `ai_get_capability_catalog` / `ai_export_capability_catalog`, CLI `ai-capability-catalog` / `export-ai-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > AI capability catalog controls. The catalog records local AI/Whisper capability metadata for provider scope, local assistance flags, local summary/export, Whisper subtitle generation boundaries, translate/grammar placeholders, fields, surfaces, data files, sensitive fields, and verification gaps; it does not execute Whisper, translate subtitles, clean grammar, call remote providers, read media files, include prompts/API keys/transcripts/file bodies, mutate AI settings, or claim Whisper/translate/grammar E2E verification.
- Added Update capability catalog summary/export through `update_get_capability_catalog` / `update_export_capability_catalog`, CLI `update-capability-catalog` / `export-update-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Advanced update capability catalog controls. The catalog records local updater capability metadata for manifest checks, update settings backup/restore, local summary/export, background due-poll notifications, fields, surfaces, data files, sensitive fields, and verification gaps; it does not fetch remote manifests, read local manifests, mutate settings, download update artifacts, install updates, verify signatures, replace binaries, publish release files, or claim signed-update/rollback/packaged-update E2E verification.
- Added Release/Packaging capability catalog summary/export through `app_get_release_capability_catalog` / `app_export_release_capability_catalog`, CLI `release-capability-catalog` / `export-release-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Advanced release capability catalog controls. The catalog records local release capability metadata for release gates, package summaries, release documents, legal/notices, update readiness, fields, surfaces, data files, sensitive fields, and verification gaps; it does not run builds, package installers, sign artifacts, notarize, publish, install updates, upload files, mutate release artifacts, or claim packaged-app/signing/update-install E2E verification.
- Added Plugin capability catalog summary/export through `plugins_get_capability_catalog` / `plugins_export_capability_catalog`, CLI `plugin-capability-catalog` / `export-plugin-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, Plugins page controls, and Settings > Plugins copy/export entry points. The catalog records local plugin capability metadata for manifest/preflight, registry state, marketplace registry, settings/data, command/event harness, trust/summary exports, fields, surfaces, data files, sensitive fields, and verification gaps; it does not execute dynamic plugin code, import external registries, mutate registry/settings/data, delete plugin files, fetch remote marketplaces, verify signatures, or claim plugin runtime E2E verification.
- Added Torrent/P2P capability catalog summary/export through `p2p_get_capability_catalog` / `p2p_export_capability_catalog`, CLI `p2p-capability-catalog` / `export-p2p-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Tools > P2P tools capability catalog controls. The catalog records local Torrent/P2P capability metadata for torrent/magnet drafts, offer store backup, LAN send/receive boundaries, local summary, transfer panel, commands, UI surfaces, data files, task kinds, sensitive fields, and verification gaps; it does not contact trackers, DHT, relays, or peers, does not run a BitTorrent engine, does not read file bodies, mutate offers, create tasks, start listeners, open local files, or claim BitTorrent/LAN/NAT/relay E2E verification.
- Added Telegram capability catalog summary/export through `telegram_get_capability_catalog` / `telegram_export_capability_catalog`, CLI `telegram-capability-catalog` / `export-telegram-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Telegram page capability catalog controls. The catalog records local Telegram capability metadata for auth gate state, manifest chat browser, local search/sync status, media queue/clone, and local media preview/copy boundaries; it does not perform MTProto login, sync remote chats, read message bodies, download remote media, include session secrets, include media file bodies, or claim Telegram E2E verification.
- Added Courses capability catalog summary/export through `courses_get_capability_catalog` / `courses_export_capability_catalog`, CLI `courses-capability-catalog` / `export-courses-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Courses page capability catalog controls. The catalog records local Courses capability metadata for platform matrix/sample metadata, probe/import, manifest backup/restore, progress/notes, lesson/attachment queueing, local playback/file actions, and library maintenance; it does not perform platform login, crawl remote attachments, run downloads, include Cookie values, include note bodies, include downloaded files, or claim course player/platform E2E verification.
- Added Browser Extension capability catalog summary/export through `extension_get_capability_catalog` / `extension_export_capability_catalog`, CLI `extension-capability-catalog` / `export-extension-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Browser Extension capability catalog controls. The catalog records local extension capability metadata for loopback bridge/deep-link intake, pairing/profile metadata, options/blocked hosts, media sniffing/context actions, Cookie/Auth payload staging, package summary, and release-safety review; it does not read browser storage, include pairing token values, Cookie payload contents, Authorization values, downloaded content, or log bodies, and it does not install/run/package/sign the extension, create tasks, or claim Chrome/Firefox E2E verification.
- Added Channels capability catalog summary/export through `channels_get_capability_catalog` / `channels_export_capability_catalog`, CLI `channels-capability-catalog` / `export-channels-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Channels page capability catalog controls. The catalog records local Channels capability metadata for subscriptions, manual checks/due polling, history, history queueing, notification state, polling settings backup, safe backup, and local summary/export boundaries; it does not export current subscription/history row values, source URL values, Cookie values, downloaded files, log bodies, poll feeds, create tasks, or claim live feed/manual verification.
- Added Cookie/Auth capability catalog summary/export through `cookies_get_capability_catalog` / `cookies_export_capability_catalog`, CLI `cookies-capability-catalog` / `export-cookies-capability-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Cookies capability catalog controls. The catalog records local Cookie/Auth capability metadata for bucket storage, import/export, URL matching, health tests, staged extension Cookie/Auth payloads, Twitter/X fallback, Bilibili Cookie state, and metadata-only summary/export boundaries; it does not read Cookie values, Authorization values, pairing tokens, staged payload bodies, browser storage, mutate Cookie/Auth state, execute network checks, or claim live-login verification.
- Added Downloads deep-link/target support for `view=active|history|all` (also `view_mode` / `mode`) so internal toasts, command targets, and shell-open requests can land directly on the intended local task view without mutating tasks.
- Added Downloads page All view alongside Queue and History. All shows every local task record, including archived records, and filter presets now preserve `viewMode: "all"` while remaining backward-compatible with older active/history presets.
- Added CLI `tasks --view <active|history|all>` / `--view-mode` filtering and surfaced it in Downloads filter catalog, help text, command-palette keywords, settings-search keywords, and API docs. `active` keeps the existing non-archived default, `history` matches completed/failed/canceled/archived task records, and `all` preserves the older `--all` behavior.
- Added Downloads filter catalog summary/export through `downloads_get_filter_catalog` / `downloads_export_filter_catalog`, CLI `downloads-filter-catalog` / `export-downloads-filter-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads filter catalog controls. The catalog records local filter metadata for view mode, status, task kind, platform, text query, date range, operational filters, sort modes, and filter presets; it does not read/list task rows, export visible task values, source URLs, output paths, log bodies, Cookie/Auth values, mutate tasks, reorder the queue, or start downloads.
- Added App infrastructure capability catalog summary/export through `app_get_infrastructure_capability_catalog` / `app_export_infrastructure_capability_catalog`, CLI `infrastructure-catalog` / `export-infrastructure-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Infrastructure catalog controls. The catalog records local app shell capability metadata for the desktop window shell, route restore, toast bridge, tray, autostart, quick-capture shortcut, deep-link scheme, portable mode, and path inventory; it does not open windows, register shortcuts, change autostart, invoke deep links, or start downloads.
- Added Downloads inheritance catalog summary/export through `downloads_get_inheritance_catalog` / `downloads_export_inheritance_catalog`, CLI `downloads-inheritance-catalog` / `export-downloads-inheritance-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads inheritance catalog controls. The catalog records local setting-to-task inheritance metadata for output folders, filename templates, skip-existing, quality/audio, subtitles, SponsorBlock/metadata, network defaults, custom yt-dlp args, and Cookie/Auth refs; it does not inspect task rows or setting values, expose source URLs/output paths/secrets, mutate settings/tasks, or start downloads.
- Added Downloads runtime catalog summary/export through `downloads_get_runtime_catalog` / `downloads_export_runtime_catalog`, CLI `downloads-runtime-catalog` / `export-downloads-runtime-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads runtime catalog controls. The catalog records local runtime/dependency metadata for direct-file HTTP, yt-dlp, gallery-dl, FFmpeg tools, torrent metadata, P2P receive, Whisper subtitles, and dependency resolver paths; it does not inspect tasks, execute tools, read logs/files, or start downloads.
- Added Downloads privacy catalog summary/export through `downloads_get_privacy_catalog` / `downloads_export_privacy_catalog`, CLI `downloads-privacy-catalog` / `export-downloads-privacy-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads privacy catalog controls. The catalog records local privacy boundary metadata for source URLs, output paths, Cookie refs/values, Authorization values, log bodies, downloaded file bodies, diagnostics exports, and clipboard review helpers; it does not read task records, secrets, logs, output files, mutate tasks, or start downloads.
- Added Downloads history catalog summary/export through `downloads_get_history_catalog` / `downloads_export_history_catalog`, CLI `downloads-history-catalog` / `export-downloads-history-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads history catalog controls. The catalog records local history capability metadata for Queue/History views, filters, archive/restore, clear completed, clear archived, task backup/restore, and local summary; it does not export task rows, source URLs, output paths, file/log bodies, mutate tasks, delete records, or start downloads.
- Added Downloads artifact catalog summary/export through `downloads_get_artifact_catalog` / `downloads_export_artifact_catalog`, CLI `downloads-artifact-catalog` / `export-downloads-artifact-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads artifact catalog controls. The catalog records local artifact capability metadata for primary downloads, partial files, subtitle sidecars, thumbnails, info JSON, comments/chapters/live chat sidecars, derived media, shot/waveform analysis, and Whisper subtitles; it does not export artifact paths, read file bodies, delete artifacts, mutate tasks, or start downloads.
- Added Downloads output catalog summary/export through `downloads_get_output_catalog` / `downloads_export_output_catalog`, CLI `downloads-output-catalog` / `export-downloads-output-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads output catalog controls. The catalog records local output handling metadata for default folders, platform subdirectories, filename templates, skip-existing behavior, task output records, open/reveal actions, and task cleanup output retention; it does not export output paths, read file bodies, open/reveal paths, delete output files, mutate tasks, or start downloads.
- Added Downloads source catalog summary/export through `downloads_get_source_catalog` / `downloads_export_source_catalog`, CLI `downloads-source-catalog` / `export-downloads-source-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads source catalog controls. The catalog records local source entrypoint metadata for Home URLs, batch import, browser extension bridge, metadata/gallery tools, channel history, courses, Telegram manifests, torrent/magnet, and P2P shares; it does not include source URLs, probe remote sites, queue tasks, start downloads, or expose Cookie/Auth values.
- Added Downloads retry catalog summary/export through `downloads_get_retry_catalog` / `downloads_export_retry_catalog`, CLI `downloads-retry-catalog` / `export-downloads-retry-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads retry catalog controls. The catalog records local retry metadata for automatic transient retry, manual retry, resume without retry increment, non-retryable failure records, and pause/cancel interruption exclusion; it does not read task values or error messages, export source URLs, mutate tasks, start downloads, or claim a real retry matrix.
- Added Downloads queue catalog summary/export through `downloads_get_queue_catalog` / `downloads_export_queue_catalog`, CLI `downloads-queue-catalog` / `export-downloads-queue-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads queue catalog controls. The catalog records local queue/scheduler capability metadata for task creation, slot activation, manual start, pause/cancel, resume/retry, reorder, concurrency settings, and restart recovery; it does not read/list tasks, export source URLs, mutate task state, start/stop workers, execute downloads, or claim a runtime scheduler matrix.
- Added Downloads event catalog summary/export through `downloads_get_event_catalog` / `downloads_export_event_catalog`, CLI `downloads-event-catalog` / `export-downloads-event-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads event catalog controls. The catalog records local download event contract metadata for created/state/progress/completed/failed/list-changed and the planned live log event; it does not emit events, read tasks, list tasks, read logs, mutate tasks, start downloads, or claim a manual event matrix.
- Added Downloads log catalog summary/export through `downloads_get_log_catalog` / `downloads_export_log_catalog`, CLI `downloads-log-catalog` / `export-downloads-log-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads log catalog controls. The catalog records local download-log capability metadata for inventory, paged task logs, scoped file reads, scoped deletes, clear logs, and runtime append behavior; it does not list existing logs, read log bodies, delete logs, write logs, mutate tasks, start downloads, or claim a manual log matrix.
- Added Downloads cleanup catalog summary/export through `downloads_get_cleanup_catalog` / `downloads_export_cleanup_catalog`, CLI `downloads-cleanup-catalog` / `export-downloads-cleanup-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads cleanup catalog controls. The catalog records local cleanup command metadata for completed task cleanup, archived retention cleanup, visible task delete, partial download cleanup, and diagnostics/log cleanup; it does not read task values, source URLs, output file bodies, log bodies, Cookie/Auth values, mutate tasks, delete files, run cleanup commands, start downloads, or claim a manual cleanup matrix.
- Added Downloads integrity catalog summary/export through `downloads_get_integrity_catalog` / `downloads_export_integrity_catalog`, CLI `downloads-integrity-catalog` / `export-downloads-integrity-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads integrity catalog controls. The catalog records local SHA-256 capability metadata for expected digest input, single-file completion verification, P2P expected-hash inheritance, UI copy helpers, and task backup preservation; it does not read task values, source URLs, output file bodies, log bodies, Cookie/Auth values, calculate hashes, mutate tasks, start downloads, or claim a real-file matrix.
- Added Downloads error catalog summary/export through `downloads_get_error_catalog` / `downloads_export_error_catalog`, CLI `downloads-error-catalog` / `export-downloads-error-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads error catalog controls. The catalog records local error classification and retry policy metadata for network, rate-limited, auth, permission, not-found, unsupported URL, path, dependency, and internal failures; it does not read task error messages, source URLs, file bodies, log bodies, Cookie/Auth values, mutate tasks, trigger retries, start downloads, or claim a real failure matrix.
- Added Downloads status catalog summary/export through `downloads_get_status_catalog` / `downloads_export_status_catalog`, CLI `downloads-status-catalog` / `export-downloads-status-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads status catalog controls. The catalog records local task status/action metadata for queued, active, paused, completed, failed, canceled, and archived states, including visibility, terminal/active flags, actions, bulk actions, transitions, events, and limitations; it does not read task values, source URLs, file bodies, log bodies, Cookie/Auth values, mutate tasks, start downloads, or claim a runtime state-machine matrix.
- Added Downloads option catalog summary/export through `downloads_get_option_catalog` / `downloads_export_option_catalog`, CLI `downloads-option-catalog` / `export-downloads-option-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads option catalog controls. The catalog records local task/default option capability metadata for quality, audio format, clip ranges, subtitles, SponsorBlock, metadata embedding, output paths, filename templates, skip-existing, network headers, proxy/rate limits, live/fragments, custom yt-dlp args, Cookie/Auth refs, thumbnails, integrity, and active-slot scheduling; it does not export existing task values, source URLs, file bodies, log bodies, Cookie/Auth values, start downloads, execute tools, or claim a real option matrix.
- Added Downloads kind catalog summary/export through `downloads_get_kind_catalog` / `downloads_export_kind_catalog`, CLI `downloads-kind-catalog` / `export-downloads-kind-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Downloads kind catalog controls. The catalog records local task-kind capability metadata for video, playlist, audio, image, subtitles-only, PDF, book, webpage, Telegram media, course lesson, generic, torrent, and P2P tasks; it does not export task source URLs, downloaded file bodies, log bodies, Cookie/Auth values, start downloads, probe remote sites, or claim a manual source matrix.
- Added Music format catalog summary/export through `music_get_format_catalog` / `music_export_format_catalog`, CLI `music-format-catalog` / `export-music-format-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Tools > Local music library format catalog controls. The catalog records local MP3/FLAC/M4A/OGG/Opus support flags, extensions, metadata/cover/queue/lyrics/playlist/playback-stat/export availability, and limitations; it does not read or export audio file bodies, verify playback quality, connect external music services, or run a manual player matrix.
- Added Reader/Library format catalog summary/export through `library_get_format_catalog` / `library_export_format_catalog`, CLI `library-format-catalog` / `export-library-format-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Tools > Local reading library format catalog controls. The catalog records local PDF/EPUB/CBZ/TXT/HTML support flags, extensions, bounded preview coverage, reading-state/annotation/export availability, and limitations; it does not read source document bodies, export book contents, verify the full renderer, or run a manual reader matrix.
- Added Appearance language catalog summary/export through `appearance_get_language_catalog` / `appearance_export_language_catalog`, CLI `language-catalog` / `export-language-catalog`, TypeScript wrappers, command-palette/settings-search keywords, and Settings > Appearance language catalog controls. The catalog records local language ids, labels, current language, shell dictionary key counts, and source and asset review notes; it excludes external translation files, extension locale packs, plugin runtime i18n, downloaded content, Cookie/Auth values, and does not claim full UI translation QA or manual locale verification.
- Added Appearance theme catalog summary/export through `appearance_get_theme_catalog` / `appearance_export_theme_catalog`, CLI `theme-catalog` / `export-theme-catalog`, TypeScript wrappers, command-palette keywords, and Settings > Appearance theme catalog controls. The catalog records local theme ids, CSS classes, current theme/language, density/font-scale bounds, and source and asset review notes; it excludes external theme files, assets, screenshots, downloaded content, Cookie/Auth values, and does not claim visual contrast or manual theme QA.

- Added Course lesson progress JSON backup/restore through `courses_export_progress` / `courses_import_progress`, CLI `export-course-progress` / `import-course-progress`, TypeScript wrappers, command-palette keywords, and Courses > Progress backup controls. The backup stores only local lesson ids/titles, progress percent, opened-at time, and note counts for already-imported courses; it excludes course outlines, source URLs, Cookie buckets, note bodies, attachments, media files, and download tasks, and import only updates matching local course lessons.

- Added one-track Music lyrics JSON backup/restore through `music_export_lyrics` / `music_import_lyrics`, CLI `export-music-lyrics` / `import-music-lyrics`, TypeScript wrappers, command-palette keywords, and Tools > Local music library lyrics backup controls. The backup stores one local sidecar lyric text file plus track/lyrics path metadata; it excludes audio files, catalog folders, queue, playlists, playback history, player settings, Cookie/Auth values, and external lyrics providers.

- Added explicit Network settings JSON backup/restore through `network_export_settings` / `network_import_settings`, CLI `export-network-settings` / `import-network-settings`, TypeScript wrappers, command-palette keywords, and Settings > Network backup controls. The backup stores only local network defaults for future tasks: User-Agent, Referer, proxy, rate limit, live-from-start, and fragments; it excludes task source URLs, Cookie/Auth values, downloaded files, diagnostics bodies, log bodies, and proxy connectivity results, and import does not start downloads or alter existing tasks.

- Added safe Downloads filter preset JSON backup/restore through `downloads_export_filter_presets` / `downloads_import_filter_presets`, CLI `export-download-filter-presets` / `import-download-filter-presets`, TypeScript wrappers, command-palette keywords, and Downloads page preset Export/Import/Open/Reveal controls. The backup stores only local UI filter preset metadata; it excludes task source URLs, Cookie/Auth values, downloaded files, diagnostics bodies, and download log bodies, and import only merges local preset names without changing tasks or starting downloads.

- Added safe Browser Extension pairing metadata JSON backup/restore through `extension_export_pairing` / `extension_import_pairing`, CLI `export-extension-pairing` / `import-extension-pairing`, TypeScript wrappers, command-palette keywords, and Settings > Browser Extension Pairing token Export/Import controls. The backup stores only local pairing metadata such as label and timestamps; it excludes pairing token values, browser storage, Cookie/Auth payload contents, and downloaded content, and paired backups restore as unpaired until a new token is created.

- Added safe Telegram state JSON backup/restore through `telegram_export_state` / `telegram_import_state`, CLI `export-telegram-state` / `import-telegram-state`, TypeScript wrappers, command-palette keywords, and Telegram account-gate Export/Import controls. The backup stores only local placeholder account metadata; it excludes MTProto sessions, auth keys, chat manifests, media files, Cookie/Auth values, and download tasks, and signed-in backups restore as pending until Telegram is reconnected locally.

- Added explicit Channel settings JSON backup/restore through `channels_export_settings` / `channels_import_settings`, CLI `export-channel-settings` / `import-channel-settings`, TypeScript wrappers, command-palette keywords, and Settings > Channels backup controls. The backup stores only local polling preferences and last-poll metadata; it excludes subscriptions, channel history, source URLs, Cookie values, downloaded files, and created download tasks, and import does not poll channels or start downloads.

- Added explicit Appearance settings JSON backup/restore through `appearance_export_settings` / `appearance_import_settings`, CLI `export-appearance-settings` / `import-appearance-settings`, TypeScript wrappers, command-palette keywords, and Settings > Appearance backup controls. The backup stores only local language, theme, font scale, and density preferences; it excludes downloaded files, Cookie/Auth values, library content, notes, logs, diagnostics bodies, and task data.

- Added explicit Downloads settings JSON backup/restore through `downloads_export_settings` / `downloads_import_settings`, CLI `export-downloads-settings` / `import-downloads-settings`, TypeScript wrappers, command-palette keywords, and Settings > Downloads backup controls. The backup stores local download/network defaults, subtitle, SponsorBlock, metadata, and cleanup preferences; it excludes task source URLs, Cookie/Auth values, downloaded files, diagnostics bodies, and download log bodies, and import does not start or alter existing tasks.

- Added explicit AI settings JSON backup/restore through `ai_export_settings` / `ai_import_settings`, CLI `export-ai-settings` / `import-ai-settings`, TypeScript wrappers, command-palette keywords, and Settings > AI backup controls. The backup stores only local provider scope, Whisper defaults, and local assistance flags; it excludes prompts, API keys, subtitle/media bodies, Cookie/Auth values, downloaded content, log bodies, and AI workflow execution.

- Added Learning daily goal JSON backup/restore through `learning_export_daily_goal` / `learning_import_daily_goal`, CLI `export-daily-goal` / `import-daily-goal`, TypeScript wrappers, command-palette keywords, and Learning dashboard controls. The backup stores only local daily focus target minutes and excludes notes, review answers, Pomodoro sessions, activity history, URLs, Cookie/Auth values, downloaded content, and timer runtime state.

- Added explicit Cookie bucket JSON backup/restore through `cookies_export_buckets` / `cookies_import_buckets`, CLI `export-cookie-buckets` / `import-cookie-buckets`, TypeScript wrappers, command-palette keywords, and Settings > Cookies controls. This user-triggered backup includes Cookie row values so managed buckets can be restored, but excludes Authorization header values, staged extension payload bodies, browser storage, keychain items, pairing tokens, and live login sessions; import merges new bucket ids without testing accounts or starting downloads.

- Added Downloads task queue JSON backup/restore through `downloads_export_tasks` / `downloads_import_tasks`, CLI `export-download-tasks` / `import-download-tasks`, TypeScript wrappers, command-palette keywords, and Settings > Downloads controls. The backup includes source URLs and queue metadata needed to restore tasks, but excludes downloaded file bodies, download log bodies, Cookie values, and Authorization values; import merges new task ids and downgrades active tasks to paused without starting downloads.

- Added safe Auth/Twitter-X fallback settings backup/restore through `auth_export_settings` / `auth_import_settings`, CLI `export-auth-settings` / `import-auth-settings`, TypeScript wrappers, command-palette keywords, and Settings > Cookies controls. The export records only public fallback metadata and never includes or restores manual Cookie header values.
- Added Browser Extension options JSON backup/restore through `extension_export_options` / `extension_import_options`, CLI `export-extension-options` / `import-extension-options`, TypeScript wrappers, command-palette keywords, and Settings > Browser Extension controls. The backup migrates local bridge/discovery/fallback/capture/blocked-host metadata only and excludes pairing token values, staged Cookie/Auth payload contents, browser storage, and downloaded content.
- Fixed EPUB on-demand text extraction to use the visible reading-order spine index instead of recounting only extractable text documents, so mixed-image/text spines no longer jump to the wrong chapter. The reader preview text Go action now uses the full reading-order count for progress jumps.
- Added Downloads local summary copy controls for output, log, auth, and network distributions, and allowed Open/Reveal to use the manually entered Downloads summary export path before an export result exists.
- Added Save as controls for Plugin trust summary exports and Torrent/P2P local summary exports, reusing the existing desktop save dialog/export/open/reveal paths without executing plugins, contacting trackers, or starting transfers.
- Added first-pass LAN direct P2P file transfer: send offers can enter `serving`, expose `CODE@host:port` share codes, answer metadata probes, and stream one file over the private LAN endpoint; receive drafts use endpoint metadata when present and keep same-data-root local copy plus `.p2p-task.json` sidecar paths as fallbacks. The LAN endpoint now supports FetchDock's single-range resume subset and receive paths reuse `.part` files before falling back to restart. NAT traversal, relay, multi-peer transfer, cross-process sender recovery, content verification, and final two-device verification remain pending.
- Added diagnostics refresh events after local P2P summary, course platform matrix/sample, and music service matrix exports, plus a `channels_get_local_summary` command alias matching the domain-scoped summary naming used by other modules.
- Course local summaries now count `imported_metadata_pending` and `probed_metadata_pending` course candidates under the imported/probed totals so fallback candidates remain visible in local review counts.
- Added Home batch Paste URLs, Downloads summary Save as, and Bilibili summary last-export Open/Reveal controls, reusing existing clipboard, export, and desktop dialog paths without changing download execution behavior.
- Local audit refresh now uses the existing aggregate audit summary command first and falls back to individual settings/channels/plugins/plugin-trust summaries only for older runtimes.
- Browser Extension settings now use the lightweight pairing-status command for Refresh status and expose Reload options for the existing options command, avoiding a full local-summary refresh for those small controls.
- Platform summary/matrix/samples, Cookie/Auth summary, Bilibili summary, Learning summary, and Downloads summary exports now emit diagnostics file-change events after successful writes so local diagnostics inventories refresh consistently.
- Channel, Telegram, Bilibili, and Course manifest exports plus Learning notes/Pomodoro/dashboard/graph, Settings manifest, Library reading-state, and Music playlist exports now emit file-change events after successful writes for the same local inventory refresh path.
- Course, Telegram, and Bilibili manifest export Open/Reveal controls now enable from the last export result even when the optional export path field was left blank.
- Added explicit privacy flags to Browser Extension error-page copied diagnostics and guarded them in `verify:browser-extension`, making the safe diagnostic copy boundary visible in the copied text.
- Enhanced Home and CLI batch URL extraction so pasted text, imported text files, and `batch <urls.txt>` can contribute multiple http/https URLs from the same line, including Markdown/chat-style wrapped links and FetchDock deep-link URL payloads; the Home batch panel now also exposes Copy parsed for a pre-queue review list, and CLI batch now reports non-comment lines without URLs as failed items instead of silently skipping them.
- Added CLI batch summary fields (`source_file`, created/failed counts, skipped line count, and parsed URL count) so scripting output can be checked without recounting result arrays.
- Added missing CLI help entries for Downloads, Learning, and Cookie/Auth local summary/export commands so implemented metadata-only review commands are discoverable from `fetchdock help`.
- Added `npm run verify:media-clip` as the optional real FFmpeg media smoke wrapper and extended release-packaging static checks plus docs to keep the entry discoverable without adding it to fast feature-work verification.
- Added a Browser Extension manifest permission-scope drift guard to `verify:browser-extension`, locking the current `permissions` and `host_permissions` set until release/review approval updates the verifier.
- Trimmed common trailing sentence punctuation from Home clipboard and batch URL extraction so pasted links like `https://example.com/file.zip.` queue the intended URL.
- Added a Home URL classification recommendation action that lets users apply the detected task mode (playlist/image/pdf/book/etc.) from the existing classifier without probing the network or overriding special Torrent/P2P/Course flows.
- Added Browser Extension options-page Copy JSON for sanitized connector settings, including bridge URL, discovery ports, capture toggles, blocked hosts, token-configured boolean, and explicit privacy flags without copying pairing token values, Cookie values, Authorization headers, browser storage payload bodies, or captured payload contents.
- Added Browser Extension popup Copy JSON for the currently shown detected-media candidates, including page metadata, kind filter, counts, media URL/group/segment metadata, and explicit privacy flags without copying pairing token values, Cookie values, Authorization headers, browser storage, or payload bodies.
- Added explicit Send and Open actions for each detected-media row in the Browser Extension popup, so users can inspect a captured media source URL in a new tab without accidentally sending it to the desktop bridge.
- Scoped Browser Extension action badge feedback to the current/target tab. Detected-media counts now follow tab activation and page updates, tab navigation/removal clears stale candidates for that tab, and temporary OK/ERR/Cookie/Auth badge states restore to that tab's media count instead of a global extension count.
- Added Browser Extension popup Copy page summary with current page, loaded/shown media counts, kind filter, bridge/discovery/capture flags, blocked-host count, and pairing-token configured status without copying pairing token values, Cookie values, Authorization headers, browser storage, or payload bodies; the static extension verifier now checks the popup control.
- Added Browser Extension popup blocked-host preflight so blocked current pages show Blocked and disable Send/Cookie/Auth capture before the user submits them, matching the existing background bridge rejection path.
- Added `npm run verify:windows` as the final Windows verification script wrapper and extended the release-packaging static guard plus build docs to require/document it.
- Added Plugins loaded command/event/activity log Copy summary and Copy JSON actions in the Plugins page and plugin entry pages. The JSON copies only currently loaded UI log rows plus payload shape metadata, not payload values, and does not execute plugin code or read extra log files.
- Added Music lyrics Copy summary, Copy text, Copy timed, and Copy JSON actions for the loaded local lyrics editor/sidecar state without reading extra audio/lyrics files, embedding lyrics, or contacting external lyric providers.
- Added a Browser Extension options-page Copy summary action plus static verification for the control, copying bridge/discovery/capture/blocked-host metadata without pairing token values, Cookie values, or Authorization headers.
- Added Settings > Advanced download-log inventory task and limit filters backed by `app_list_download_logs`, including filtered/total counts in UI copy exports without reading log bodies.
- Added structured `entries` to paged download-log responses with line number, source, level, message, and issue flags while keeping the existing raw `lines` array compatible; the Downloads log drawer now displays source/level/message rows, can filter loaded rows by level/source, can copy the shown structured TSV rows, and CLI/UI issue filtering reuses the same classification.
- Added CLI `logs <id> --level <level> --source <text>` filters so terminal log inspection can narrow the same structured entries by severity/source without changing the paged raw log storage.
- Added desktop bridge enforcement for Browser Extension blocked hosts so direct extension download requests and legacy page/media/batch aliases are rejected before creating local tasks when the target host matches a configured blocked host.
- Added extension-side blocked-host enforcement to Send page/link/media so blocked URLs stop before bridge submission or deep-link fallback.
- Added structured entries and issue counts to scoped download-log file previews, letting Advanced previews and CLI `read-download-log` inspect local `.log` files without losing the existing raw text preview.
- Added `read-download-log --issues --level --source` filtering and Advanced preview level/source filters plus copy actions for raw preview text, structured TSV rows, issue lines, and local file preview summaries.
- Added download-logs --query --task --limit metadata filtering for local download-log inventories without reading log bodies.
- Added Browser Extension popup media kind filtering and Copy details TSV for shown detected media candidates, including HLS/DASH segment counts, without changing bridge payloads or reading captured headers.
- Added limited HTTP(S) 3xx redirect following to the built-in HTTP fetch path used by direct-file downloads, thumbnail saves, webpage assets, update/tool manifest reads, and channel feeds; cross-authority redirects now drop Cookie and Authorization headers before following.
- Webpage archive asset bundling now resolves relative asset URLs against the final HTTP response URL after redirects instead of the originally submitted URL.
- Thumbnail saves, task thumbnail cache files, and webpage asset bundle files now derive default local file names from a sanitized final-response Content-Disposition filename when available, falling back to the final redirected URL when the user did not provide an explicit output file/name.
- Wired the final Windows verification helper to run the fast static preflight after typecheck and before the heavier frontend/Rust/build checks, skipping duplicate typecheck and Rust fmt inside the nested fast pass.
- Added `scripts/verify-fast.ps1` and `npm run verify:fast` as a fast implementation preflight that chains typecheck, Rust fmt check, browser-extension static verification, release-packaging guard, project boundary guard, conflict-marker scan, and literal newline escape scan without running frontend tests, Rust tests, clippy, Tauri build, signing, installer smoke, or browser E2E.
- Added a source and asset boundary static guard through `scripts/verify-project-boundary.ps1` and `npm run verify:project-boundary`. It scans source/docs/scripts/extension/packaging text outside generated/build directories for hard external project traces, fails on forbidden project/owner/repository matches, and reports review-only boundary wording counts for release cleanup without changing product behavior.
- Added a fast static release packaging guard through `scripts/verify-release-packaging.ps1` and `npm run verify:release-packaging`. The guard checks Windows portable script/verification consistency, portable data directory coverage, required manifest/checksum validation, Flatpak/macOS template wiring, and npm script exposure without building, signing, notarizing, installing, launching, or smoke-testing release artifacts.
- Enhanced the browser extension error page with local bridge diagnostics, retry health checks across configured discovery ports, and a copyable safe diagnostic summary. The copied summary redacts pairing token values and does not include Cookie/Auth payload bodies or browser storage contents.
- Expanded `scripts/verify-browser-extension.ps1` to assert that the extension error page keeps the required diagnostics, retry, copy, status, and settings controls present before packaging/review.
- Added metadata-only AI local summary/export support through `ai_get_local_summary`, `ai_export_local_summary`, CLI `ai-summary` / `export-ai-summary`, TypeScript wrapper, command-palette/settings-search keywords, and Settings > AI copy/export/open/reveal controls. The summary reads local AI provider flags and Whisper dependency metadata without executing Whisper, subtitle translation, grammar cleanup, remote providers, downloader/browser workflows, or exporting prompts, API keys, Cookie/Auth values, subtitle/media bodies, downloaded content, or log bodies.
- Expanded the local settings/audit summary with AI provider, Whisper dependency, and AI privacy-boundary fields, plus a Settings > Advanced Copy AI helper. This keeps the unified local audit evidence aligned with the dedicated AI summary without executing AI workflows or exporting sensitive bodies/secrets.
- Added metadata-only Update local summary/export support through `update_get_local_summary`, `update_export_local_summary`, CLI `update-summary` / `export-update-summary`, TypeScript wrapper, command-palette/settings-search keywords, and Settings > Advanced update summary copy/export/open/reveal controls. The summary reads local update preferences, current app version, last check metadata, and local manifest file metadata without fetching remote manifest URLs, downloading installers, verifying signatures, applying updates, replacing binaries, or claiming signed updater parity.
- Added metadata-only Media tools local summary/export support through `media_get_local_summary`, `media_export_local_summary`, CLI `media-summary` / `export-media-summary`, TypeScript wrapper, command-palette keywords, and Tools > Media tools summary copy/export/open/reveal controls. The summary reads local FFmpeg/Whisper configuration, waveform cache metadata, subtitle sidecar metadata, and local clip-task metadata without executing FFmpeg, Whisper, yt-dlp, gallery-dl, browser storage, or media processing jobs, and without exporting media/subtitle bodies, Cookie/Auth values, or media-processing parity claims.
- Added metadata-only Support matrix local summary/export support through `platforms_get_local_summary`, `platforms_export_local_summary`, CLI `platforms-summary` / `export-platforms-summary`, TypeScript wrapper, command-palette keywords, and Tools > Support matrix copy/export/open/reveal controls. The summary reads local platform route declarations and route sample metadata without probing live sites, executing yt-dlp/gallery-dl, creating download tasks, reading browser storage, exporting Cookie/Auth values, or claiming live platform parity.
- Added metadata-only Metadata tools local summary/export support through `metadata_get_local_summary`, `metadata_export_local_summary`, CLI `metadata-summary` / `export-metadata-summary`, TypeScript wrapper, command-palette keywords, and Tools > Metadata copy/export/open/reveal controls. The summary reads local metadata-tool settings, managed dependency file metadata, app-managed sidecar metadata, and waveform cache metadata without executing yt-dlp, gallery-dl, FFmpeg, Whisper, torrent engines, browser storage, or remote sites, and without exporting source URLs, Cookie/Auth values, file bodies, log bodies, or real-site/media parity claims.
- Added metadata-only App infrastructure local summary/export support through `app_get_infrastructure_summary`, `app_export_infrastructure_summary`, CLI `infrastructure-summary` / `export-infrastructure-summary`, TypeScript wrapper, command-palette/settings-search keywords, and Settings > Application paths / Infrastructure export controls. The export records app paths, runtime mode, quick-capture shell settings, and desktop autostart status when available without changing shortcuts, autostart, tray, deep-link, or download state.
- Added metadata-only Dependency tools local summary/export support through `tools_get_local_summary`, `tools_export_local_summary`, CLI `tools-summary` / `export-tools-summary`, TypeScript wrapper, command-palette/settings-search keywords, and Settings > Dependencies export/open/reveal controls. The summary reads local tool status, path overrides, configured download sources, hashes, install errors, and managed dependency file metadata without downloading, updating, executing tools, reading log bodies, or claiming dependency install matrix parity.
- Added metadata-only Privacy status JSON export support through `app_export_privacy_status`, CLI `export-privacy-status`, TypeScript wrapper, command-palette keywords, and Settings > Advanced export/open/reveal controls. The export writes the existing local no-telemetry and redaction-matrix status without running network checks, reading Cookie/Auth values, exporting log bodies, or claiming packaged binary privacy review.
- Added metadata-only Release checklist JSON export support through `app_export_release_checklist`, CLI `export-release-checklist`, TypeScript wrapper, command-palette keywords, and Legal export/open/reveal controls. The export writes current local gate evidence only and does not run builds, signing, notarization, packaging smoke, plugin execution, browser extension E2E, or mark pending gates complete.
- Added metadata-only Plugins local summary export support through `app_export_local_plugins_summary`, CLI `export-plugins-summary`, TypeScript wrapper, command-palette keywords, and Settings > Advanced export/open/reveal controls. The export writes local plugin registry, marketplace, manifest, capability, permission, and preflight metadata without executing dynamic libraries, installing marketplace artifacts, fetching remote registry data, or verifying signatures.
- Added metadata-only Settings local summary export support through `app_export_local_settings_summary`, CLI `export-settings-summary`, TypeScript wrapper, command-palette keywords, and Settings > Advanced export/open/reveal controls. The export writes local settings, dependency, extension-option, channel, and plugin metadata without Cookie values, Authorization headers, tokens, diagnostics bodies, log bodies, or downloaded content.
- Added metadata-only Channels local summary and export support through `app_get_local_channels_summary`, `channels_export_local_summary`, CLI `export-channels-summary`, TypeScript wrappers, command-palette keywords, and Channels page copy/export/open/reveal controls. The summary aggregates local subscription, history, notification, platform/source-kind, and polling-setting metadata without polling feeds, creating tasks, exporting Cookie values, or including downloaded files.
- Added metadata-only Learning local summary and export support through `learning_get_local_summary`, `learning_export_local_summary`, CLI `learning-summary` / `export-learning-summary`, TypeScript wrappers, command-palette/settings-search keywords, and Learning page copy/export/open/reveal controls. The summary aggregates local note metadata, tag/source/timestamp counts, backlink/link counts, Pomodoro session metadata, dashboard/streak/heatmap totals, and graph counts without exporting note bodies, source URLs, downloaded content, Cookie values, or executing/updating timers.
- Added metadata-only Downloads local queue summary and export support through `downloads_get_local_summary`, `downloads_export_local_summary`, CLI `downloads-summary` / `export-downloads-summary`, TypeScript wrappers, command-palette keywords, and Settings > Downloads copy/export/open/reveal controls. The summary aggregates local task status/kind/platform/error/output/log/auth/network-option counts, retry totals, byte/file totals, timestamp coverage, and log file inventory without exporting task source URLs, downloaded file bodies, log bodies, Cookie values, Authorization values, or starting any download execution.

- Added metadata-only Cookie/Auth local summary and export support through `cookies_get_local_summary`, `cookies_export_local_summary`, CLI `cookies-summary` / `export-cookies-summary` / `auth-summary`, TypeScript wrappers, command-palette keywords, and Settings > Cookies copy/export/open/reveal controls. The summary aggregates local Cookie bucket metadata, row counts, platform/source/health/expiry/storage distributions, staged extension Cookie/Auth payload inventories, Twitter/X manual Cookie fallback status, and Bilibili Cookie bucket status without exporting Cookie values, Authorization header values, staged payload bodies, pairing tokens, browser storage, or live account sessions.

- Added metadata-only Torrent/P2P local summary and export support through `p2p_get_local_summary`, `p2p_export_local_summary`, CLI `p2p-summary` / `export-p2p-summary`, TypeScript wrappers, command-palette keywords, and Tools > P2P tools copy/export/open/reveal controls. The summary aggregates local P2P offer records, source path coverage, receive folders, torrent/magnet/P2P draft task counts, transfer status counts, known info hashes/trackers/web seeds, selected torrent file counts, and sidecar-ready transfers without contacting trackers, DHT, relays, peers, or claiming real BT/P2P network parity.

- Added metadata-only Music Library local summary and export support through `music_get_local_summary`, `music_export_local_summary`, CLI `music-summary` / `export-music-summary`, TypeScript wrappers, command-palette keywords, and Tools > Local music library copy/export/open/reveal controls. The summary aggregates the local catalog, file path coverage, formats, artists/albums, metadata sources, covers, queue, playlists, sleep timer, equalizer, Discord Presence settings, playback stats, and external-service matrix statuses without connecting external music services, exporting audio contents, or claiming full player parity.

- Added metadata-only Reading Library local summary and export support through `library_get_local_summary`, `library_export_local_summary`, CLI `library-summary` / `export-library-summary`, TypeScript wrappers, command-palette keywords, and Tools > Local reading library copy/export/open/reveal controls. The summary aggregates the local catalog, file path coverage, formats, metadata sources, covers, reading-state progress, bookmarks/highlights, and reader settings without reading source document bodies, exporting annotations beyond counts, rendering every file, or claiming full reader parity.

- Added metadata-only Courses local summary and export support through `courses_get_local_summary`, `courses_export_local_summary`, CLI `courses-summary` / `export-courses-summary`, TypeScript wrappers, and Courses UI copy/export/open/reveal controls. The summary aggregates local course outlines, queueable lesson/attachment sources, local/missing path coverage, progress, notes, Cookie bucket references, and transfer task status counts without exporting Cookie values, note bodies, downloaded files, or remote course-platform data.

- Added local Plugin marketplace export support through `plugins_export_marketplace`, CLI `export-plugin-marketplace`, and Plugins UI Save as / Export / Open / Reveal controls. The export writes the local registry JSON and review metadata only, without installing plugins, downloading artifacts, contacting a remote marketplace, or verifying signatures.

- Plugin marketplace import now backfills missing entry version, description, capabilities, and permissions from the referenced local manifest, keeping registry review metadata complete without adding trust enforcement or remote artifact handling.

- Added local Plugin permission and capability review metadata across installed manifests and marketplace entries. Manifest `permissions` now round-trip through `PluginInfo`, marketplace `capabilities`/`permissions` are preserved on import, Plugins UI can search/copy/display them, and local plugin summaries/trust exports count them without granting permissions or enforcing a runtime sandbox.

- Expanded Plugin CLI and release-gate review output so `plugins`, `plugin-marketplace`, `plugins-summary`, `plugin-trust-summary`, and the plugin runtime gate surface permission/capability review counts in human-readable summaries while leaving JSON output metadata-only.

- Added local Plugin marketplace review metadata for optional SHA-256, signature, and signature URL fields. Marketplace import preserves these fields, Plugins UI can search/copy/display them, and plugin trust summaries count them while keeping actual signature verification and trust policy pending.

- Expanded local Plugin settings schema forms with JSON textarea editing for top-level object and array fields, preserving the existing raw settings JSON editor and keeping nested schema layout, dynamic host settings APIs, and plugin code execution pending.

- Added local Plugin manifest i18n metadata surfacing: installed plugin manifests can carry i18n JSON, PluginInfo returns it, Plugins search/copy/summary UI includes it, enabled plugin nav labels can use the current Appearance language, and the failure-sample manifest exposes a small local i18n example without enabling dynamic code execution or a full plugin runtime translation host.

- Added Learning dashboard and graph desktop exports: `learning_export_dashboard` / `learning_export_graph` IPC commands, TypeScript wrappers, Learning panel Save as / Export / Open / Reveal controls, and command-palette keywords. The exports write local dashboard or graph JSON evidence without editing notes, Pomodoro sessions, course progress, reading state, music playback events, daily goals, or graph data.

- Added CLI export-learning-dashboard and export-learning-graph JSON exports for local Learning dashboard and graph evidence, defaulting to diagnostics when no output path is supplied.

- Added Learning dashboard copy actions for the local progress summary, full dashboard JSON, heatmap dates, active days, and focus days without mutating notes, Pomodoro sessions, course progress, reading state, music activity, or daily goals.

- Added Reader preview copy actions for the active local TXT/HTML/PDF/EPUB/CBZ preview: Copy preview, Copy preview JSON, and Copy text for text-backed previews, using already-loaded preview data without reading extra source files or claiming a full reader renderer.
- Added a Downloads page operational filter for failed/error, retryable, and output-backed tasks, matching the recent CLI local review filters and preserving saved filter presets.

- Added Downloads quick-filter buttons for retryable and output-backed tasks, and let CLI `tasks` date-window filters accept either RFC3339 timestamps or `YYYY-MM-DD` dates.

- Added CLI `tasks` operational filters for local review workflows: `--failed-only`/`--errors-only`, `--retryable-only`, and `--with-output`.

- Added a Downloads page date-field selector so the local task list can filter either created or updated dates while preserving saved filter presets.

- Expanded Downloads page sort modes with updated ascending, status, platform, and kind ordering to better match CLI task list review workflows.

- Added CLI `tasks` date-window filters for created/updated timestamps: `--created-after`, `--created-before`, `--updated-after`, and `--updated-before`.

- Added CLI `tasks --sort <queue|created|updated|title|status|platform|kind>` with `--asc`/`--desc` ordering and JSON sort metadata.

- Added CLI `logs <id>` pagination and filtering flags: `--search`/`--query`, `--issues`/`--errors`, `--level`, `--source`, `--cursor`, and `--limit`.

- Expanded CLI `tasks --human` rows with platform, output path/folder, and last-error snippets when available.

- Added CLI `tasks` filters for kind, platform, and recursive query/search matching across task JSON/details, with JSON filter echoing.

- Expanded CLI human task summaries with progress, file count, task option, and SHA-256 Integrity lines for `task` and task state commands.

- Expanded Downloads search to match task ids, output directories, network/auth fields, task options, metadata, and nested `details_json` values such as SHA-256 integrity hashes.

- Added single-task Copy summary and Copy JSON actions in the Downloads Detail panel, and included `details_json` in Downloads JSON clipboard payloads.

- Added Open output and Reveal output actions to the Downloads Detail panel using the existing task output path handlers.

- Expanded the Downloads Detail panel with task-level option and Integrity summaries so queued/completed tasks expose the same context shown by clipboard helpers.

- Surfaced task-level SHA-256 integrity details in Downloads task summaries, visible-task summaries, and the Copy SHA-256 clipboard helper.

- Added a Home advanced expected SHA-256 field that sends the task-level integrity digest through the shared create-options path without making it a global default.

- Added task-level SHA-256 integrity metadata for queued downloads: API create options and CLI `download` / `batch` now accept expected hashes, single-file completion records verified hashes, and mismatches fail through the normal download error path without marking tasks completed.

- Added backend batch-task protection for exact output files: multi-item `downloads_create_batch` requests now fail those items with a clear per-item error instead of creating several tasks targeting the same file.

- Blocked Home multi-URL batches from reusing a single exact Output file path, nudging users to Output folder for batches while leaving single-URL Save as behavior intact.

- Added Home batch URL failure details with line numbers, source URL snippets, copy-to-clipboard support, and dismiss controls for per-item `downloads_create_batch` failures.

- Added line-level Netscape Cookie import diagnostics for paste/file/extension payload imports, including malformed row line numbers, boolean field validation, expires timestamp validation, and `#HttpOnly_` row handling without exposing Cookie values.

- Added a metadata-only Bilibili local summary panel and CLI `bilibili-summary` / `export-bilibili-summary`, aggregating local Cookie bucket status, imported watch-later/history counts, linked transfer status counts, and review notes without calling Bilibili online APIs, exporting Cookie values, or exporting account sessions.

- Added a metadata-only Telegram local summary panel and CLI `telegram-summary` / `export-telegram-summary`, aggregating placeholder auth state, imported manifest counts, local media path coverage, queueable source URLs, transfer status counts, and review notes without running MTProto sync or exporting session data.

- Added a saved update manifest check path in Settings and CLI `check-configured-update`, reusing persisted update settings and recording the latest check result without applying updates.

- Extended update manifest checks to accept remote `http://` / `https://` JSON manifests as a read-only check path, with a 1 MB limit and source-kind reporting, without downloading or installing updates.

- Added JSON exports for local release package and release document summaries in Legal and CLI `export-release-package-summary` / `export-release-docs-summary`, preserving the same metadata-only release-review boundary.

- Added a local Legal readiness summary in Legal and CLI `legal-readiness-summary`, plus JSON export via `export-legal-readiness`, aggregating release gates, package statuses, release docs, and dependency notice counts while explicitly tracking missing final `LICENSE`, `NOTICE.md`, and `THIRD_PARTY_NOTICES.md` files without generating legal text or claiming clearance.

- Added release document summaries in Legal and CLI `release-docs-summary`, covering README/docs/scripts/packaging metadata, SHA-256 values, and parity/acceptance status counts without claiming final release readiness.

- Added third-party notice Markdown draft exports in Advanced/Legal and CLI `export-notice-draft`, using local npm/Rust dependency metadata as a review aid without replacing final legal notice work.

- Extended local third-party notice summaries with bundled release-review artifact counts, sizes, kind counts, and SHA-256 copy helpers in Advanced/Legal and CLI human output, without generating final notices or claiming bundled asset/tool clearance.

- Added local third-party notice summaries in Advanced/Legal and CLI `notice-summary`, covering npm/Rust dependency metadata counts, missing-license counts, license counts, and review notes without generating final legal notices or claiming license clearance.

- Added third-party notice summary JSON exports in Advanced/Legal and CLI `export-notice-summary`, writing the same local metadata-only review summary without generating final `THIRD_PARTY_NOTICES.md` or claiming license clearance.

- Added Browser Extension local package summaries in Settings and CLI `extension-package-summary`, covering source/package file counts, SHA-256 values, target review zips, and review notes without reading browser storage, Cookie/Auth payload contents, pairing tokens, or downloaded content.

- Added Browser Extension package summary JSON exports in Settings and CLI `export-extension-package-summary`, preserving the same local metadata-only boundary without packaging, installing, signing, or submitting the extension.

- Added a legacy Browser Extension `/cookies/import` bridge alias that reuses the safe Cookie payload staging path without directly importing buckets or returning Cookie values.

- Added safe legacy Browser Extension pairing endpoints: `/pair/start` reports manual pairing status, and `/pair/complete` validates a token already created by desktop Settings or CLI without minting or returning tokens over HTTP.

- Added a legacy Browser Extension `/download/batch` bridge alias that accepts URL arrays or item arrays, creates up to 100 local tasks through the existing download intake path, and reports per-item failures without exposing secret header contents.

- Added Browser Extension bridge compatibility aliases for legacy `/download/page` and `/download/media` payloads, routing them through the same local task creation path as `/v1/extension/download` without exposing Cookie or Authorization plaintext.

- Added local Downloads history cleanup policy controls: completed tasks can default to archive or delete, archived task cleanup can honor optional retention days, and CLI cleanup/settings flags now mirror the same local-only behavior without deleting output files.

- Added Settings search and command palette keywords for Downloads cleanup policy, archived retention days, and the matching cleanup CLI flags.

- Expanded `downloads-settings --human` and `update-downloads-settings --human` output to show completed cleanup mode and archived retention days.

- Expanded `clear-archived --human` output to state whether it used the retention policy or cleared all archived task records.

- Added local music lyrics sidecar editing and save support for `.lrc`, `.txt`, `.srt`, and `.vtt` files from the Music panel plus CLI `save-music-lyrics`, without modifying audio files or adding external lyrics providers.

- Settings manifest import and Browser Extension reset now also attempt to start the configured local bridge port immediately, so imported/reset bridge settings can be discovered without restarting the app.

- Aligned the desktop Browser Extension bridge with saved local bridge settings: startup now binds the configured localhost/127.0.0.1 port, saving a new bridge URL immediately attempts to start that local port, and health/pairing status report the active port while keeping real browser E2E and full build gates deferred.

- Added local Downloads copy expansion for current visible task ids, titles, statuses, kinds, platforms, errors, created times, and updated times without reading logs/output files or changing queue state.

- Added local Advanced/Legal copy expansion for evidence generated timestamps/notes, privacy classes/default/export/control rows, update manifest summaries/versions/check times, and release gate ids/statuses/evidence without changing diagnostics, updater behavior, privacy defaults, or release readiness status.

- Added local Library/Reader/Music copy expansion for library catalog folders, library authors/formats/sizes/covers/metadata labels, reading annotation types/progress/created times, music catalog folders/artists/albums, music artists/albums/formats/sizes/covers/metadata labels, playback top/recent summaries, and playlist counts/updated times without reading extra file bodies, changing reading state, playback, playlists, or source files.

- Added local Learning note/focus copy expansion for note titles, tags, timestamps, outgoing links, focus labels, durations, statuses, start times, and end times without editing notes, Pomodoro sessions, graph data, or media playback.






- Added local Cookie/Bilibili copy helpers for bucket names/platforms/health/counts and Bilibili import ids/owners/added times without exposing Cookie values, calling Bilibili APIs, queueing imports, or deleting local rows.
- Added local Channels copy helpers for channel ids/auto-download states plus history ids/authors/source kinds/notification states without polling feeds, queueing history, deleting rows, or changing notification state.
- Added local Telegram manifest copy helpers for visible chat titles/types and media titles/types without running MTProto sync, queueing media, deleting manifest rows, or reading local media file contents.
- Added local Browser Extension option copy helpers for bridge URL, discovery ports, endpoints, pairing status, option summary, and blocked hosts without copying staged Cookie/Auth values or writing browser storage.
- Added local Plugins copy helpers for shown plugin states, entrypoints, capabilities, commands, events, and marketplace names/versions without executing plugin code, installing entries, updating manifests, or contacting a remote marketplace.
- Added local support-matrix, route-sample, and course-sample copy helpers for names/routes/categories/statuses/evidence/limits, visible URLs/labels/platforms/kinds/intents, and title hints without probing live sites or changing queued tasks.
- Added local Courses copy helpers for visible course ids/titles, lesson ids/titles, and attachment ids/titles without changing manifests, queueing lessons, deleting outlines, or touching local files.
- Added local Channels, Telegram, and Bilibili visible-field copy helpers for names/platforms/history titles/task ids, chat ids/usernames/media ids, and import titles/collections without remote sync, account API calls, or queue mutations.
- Added local Dependencies copy helpers for tool ids, executable paths, versions, configured source URLs, and SHA-256 hashes without installing, updating, deleting, or validating dependency artifacts.
- Added local update-manifest copy helpers for the selected manifest path plus checked download URL/release notes without enabling remote updater behavior, signing, or installer replacement.
- Added local Advanced/Legal copy helpers for local evidence modules/summaries/scopes, privacy notes/redaction matrix rows, and release gate evidence/next steps without changing diagnostics exports, privacy behavior, or release readiness status.
- Added local Learning graph copy helpers for visible node summaries and visible link summaries without editing notes, graph data, Pomodoro sessions, or dashboard metrics.
- Added local Home/Tools metadata copy helpers for visible format ids, thumbnail URLs, subtitle languages, playlist/gallery URLs, chapter summaries, and comment ids/text without probing new sites, saving sidecars, or queueing tasks.
- Added local Torrent/P2P/Shot marker copy helpers for torrent file paths/trackers/info hash, visible P2P offer codes/source paths/receive folders, and visible shot marker times/scores without claiming real BT/P2P transfer or media QA completion.
- Added local Library/Reader copy helpers for catalog folders, filtered library item paths/titles, and visible reading annotation ids/text without changing source files, reading progress, annotations, exports, or Learning notes.
- Added local Music copy helpers for catalog folders/artists/albums, filtered track paths/titles, playback top/recent summaries, and visible playlist ids/names without changing playback, playlists, queue state, or external music-service scope.
- Added local Cookie bucket copy helpers for filtered bucket ids, storage paths, and domain hints without exporting or displaying Cookie values.
- Added local Browser Extension staged payload copy helpers for filtered Cookie payload refs/paths and Authorization payload refs/hosts without exposing Cookie or Authorization header values.
- Added local Advanced diagnostics/log and partial-cleanup copy helpers for current visible file paths, names, kinds, sizes, and modified times without reading file bodies, deleting files, or changing diagnostics export behavior.
- Added local Plugins copy helpers for shown installed plugin manifests/ids/library paths and marketplace manifests/sources/ids without executing plugin code.
- Added local Learning copy helpers for filtered note source URLs/ids and visible focus source URLs/ids without changing notes or Pomodoro history.
- Added local Course and Telegram visible-list copy helpers for course lesson/attachment source URLs and Telegram media source/local paths without changing queue or delete behavior.
- Added local Bilibili import quick collection filters plus Copy URLs and Copy task ids actions for the current visible import list without adding online Bilibili API behavior.
- Added Copy sources and Copy outputs actions to local Channel, Course, Telegram, Torrent/P2P, and Bilibili transfer panels without adding new transfer behavior.
- Added local Channels Copy URLs actions for visible subscriptions/history plus pending/queued/ready/error quick history filters, without changing remote feed behavior.
- Added local Downloads quick filters, saved filter presets, and Copy sources/Copy outputs actions for the current visible task set without adding new backend protocol or deleting output files.
- Added local Reader quick progress controls for 0/25/50/75/100%, plus Use scroll, Bookmark here, and Highlight here draft helpers for the existing reading-state workflow.
- Added local Music queue Append shown, Shuffle, Dedupe, and Clear actions, preserving persisted queue state without touching audio files or external music services.
- Extended Subtitle Workshop two-point sync helpers with cue start/end fill actions, waveform-selected target fill actions, and a local Clear sync action while keeping the workflow local-only.
- Added Subtitle Workshop two-point sync helpers that fill Source A/B from the currently selected timed cue, keeping the existing local-only timing workflow faster to use.
- Added click-to-seek behavior for timed local sidecar lyrics in the music player, reusing LRC/SRT/VTT timestamps without adding external lyric providers.
- Added a local Subtitle Workshop save preview that reports SRT/VTT conversion targets and warns before unsupported ASS lossy conversion attempts.
- Expanded Settings search and command palette keywords for Subtitle Workshop conversion, ASS no-loss save boundaries, and local sidecar lyrics Open/Reveal workflows.
- Added Open/Reveal shortcuts for local sidecar lyric files in the music player panel.
- Extended local music lyric discovery to check a sibling `lyrics/` folder and ignore LRC metadata tags such as `ti`/`ar` during display.
- Improved local music lyrics parsing so SRT/VTT sidecars use cue block text instead of showing timing lines as lyrics.
- Added automatic centering of the active local lyric line while HTML audio playback advances, improving the existing sidecar LRC/SRT/VTT sync subset without adding external lyric providers.
- Added a conservative Windows-1252 fallback for local subtitle text decoding in metadata merge and Subtitle Workshop open, while leaving broader legacy code page detection pending.
- Added local Subtitle Workshop SRT/VTT save-time conversion based on the output extension, while keeping ASS lossy conversion explicitly unsupported to preserve styling/event fields.
- Extended local Channels RSS/Atom parsing to recognize RSS `enclosure`, RSS/Media `media:content`, and Atom enclosure links, recording a local source-kind hint while keeping platform-specific feed/API expansion and live feed verification pending.
- Added local Courses manifest JSON bundle export/import for current local course outlines through desktop Save/Open controls plus CLI `export-course-manifest` / `import-course-bundle`, keeping remote course extraction/login and real course download verification pending.
- Added Bilibili local import round-trip support: `import-bilibili-manifest --collection manifest` and the desktop Keep manifest collections option preserve per-item watch-later/history collection from FetchDock exports while keeping online account/API sync pending.
- Added local Bilibili imports JSON export for already-imported watch-later/history items through desktop Save/Open controls plus CLI `export-bilibili-manifest`, keeping Bilibili online login/API sync and real download verification pending.
- Added local Telegram manifest JSON export for imported chats/media through desktop Save/Open controls plus CLI `export-telegram-manifest`, keeping MTProto sync/download, account auth, and remote browsing marked pending.
- Added local Channels JSON backup/restore for tracked subscriptions, channel history, and polling settings through desktop Save/Open controls plus CLI `export-channels` / `import-channels`, while keeping created download tasks, files, Cookies, and real remote channel sync out of scope.
- Preserved Browser Extension deep-link fallback titles by parsing `title` from `fetchdock://capture?...` links and using it as the captured task title hint when no Home title override is set.
- Added Browser Extension Authorization payload ref reuse: after Capture auth header stages a payload, later bridge Send page / Send shown media requests for matching hosts carry only the staged `auth_payload_ref`, letting desktop tasks use the existing Authorization injection path without sending header plaintext in download payloads.
- Aligned browser-extension bridge downloads and Channel auto-downloads with desktop queue events: bridge POSTs and auto-created channel history tasks now mark tasks to run when a slot opens, emit the same download-created event path, and trigger scheduler dispatch while keeping real browser/channel sample verification deferred.
- Added optional `create_options` plumbing for torrent file, magnet, and P2P receive queue drafts, and reused CLI global queued-task flags across Course, Telegram, Bilibili, Channel, torrent, magnet, and P2P module queue commands while keeping real BT/P2P transfer parity deferred.
- Aligned desktop module queue commands with create-time scheduling: Course, Telegram, Bilibili, Channel, torrent, magnet, and P2P drafts that inherit `run_after_active_slot` now trigger the desktop scheduler after task creation, while CLI module queues remain local draft creation only.
- Added optional `create_options` plumbing for Course lesson/attachment queue actions, so local course manifest transfers can inherit the shared Tools output, network/auth, and Cookie task context while keeping remote course extraction parity deferred.
- Added optional `create_options` plumbing for Telegram media queue and clone-wizard queue actions, so local Telegram manifest transfers can inherit Tools output, network/auth, and Cookie task context while keeping MTProto sync/download parity deferred.
- Added optional `create_options` plumbing for Bilibili import and Channel history queue actions, so these local module queues can inherit the Tools page output, network/auth, Cookie, and selected-subtitle task context while keeping real online Bilibili/channel feed parity deferred.
- Reused the shared queued-task option builder for Tools playlist/gallery queues and platform route sample queues, so Tools-local output, network/auth, and selected subtitle context are handled consistently while real download verification remains deferred.
- Added structured `details_json` summaries for Bilibili import and Channel history queued tasks, and surfaced Bilibili/Channel summaries in the Downloads detail line without claiming remote API/feed parity.
- Bilibili import queued tasks now inherit the local Bilibili Cookie bucket detected by the existing account-status helper, keeping online API sync pending while improving account-backed downloader context.
- Added Home task-level SponsorBlock and metadata controls for queued download creation, wiring them through the shared TypeScript task option builder and Save as defaults flow while keeping real output verification deferred.
- Wired selected Home subtitle tracks into video, audio, and playlist queued task options so probed subtitle choices are no longer limited to subtitles-only drafts; real subtitle output verification remains deferred.
- Added task-level exact output file paths for queued downloads through backend `output_path`, TypeScript `outputPath`, Home output-file Save as/Open/Reveal controls, and CLI `download` / `batch --output <file>` while keeping broad real-site verification deferred.
- Added optional exact output file paths for local Whisper subtitle sidecars through backend `output_path`, TypeScript `outputPath`, Tools > Media tools Save as/Open/Reveal controls, and CLI `whisper-subtitles --output <file>` while preserving output-directory defaults when blank.
- Added optional custom output paths for local platform/course/music matrix and sample diagnostics exports through backend APIs, desktop Save as/Open/Reveal controls, and CLI `[output.json]` arguments, preserving diagnostics-directory defaults when blank.
- Added optional exact output file paths for Tools metadata subtitle, thumbnail, chapters JSON, info JSON, comments, and live chat saves through desktop Save as/Open/Reveal controls, TypeScript API fields, and CLI `--output <file>` while preserving output-folder defaults when blank.
- Added optional custom output paths for diagnostics JSON and diagnostics bundle exports in Settings > Advanced and CLI `export-diagnostics [output.json] [--include-urls]` / `export-diagnostics-bundle [output.zip]`, preserving diagnostics-directory defaults when blank.
- Added optional custom output paths for Third-party notice inventory export in the desktop Advanced/Legal panels and CLI `export-notices [output.json]`, preserving the diagnostics-directory default when blank.
- Added optional custom output paths for Release evidence snapshot export in the desktop Legal panel and CLI `export-evidence [output.json]`, preserving the diagnostics-directory default when blank.
- Added optional custom output paths for Local feature evidence snapshot export in the desktop Advanced panel and CLI `export-local-evidence [output.json]`, preserving the diagnostics-directory default when blank.
- Added optional custom output paths for Recovery manifest export in the desktop Advanced panel and CLI `export-recovery [output.json]`, preserving the diagnostics-directory default when blank.
- Extended CLI `export-settings` to accept an optional output JSON path, matching the desktop Settings manifest custom export path while keeping secrets excluded.
- Added optional custom output paths for safe Settings manifest export, including a Settings > Advanced Save as dialog and API request field while preserving the diagnostics-directory default when blank.
- Added desktop pickers for Settings > Downloads default output folder and Tools > Metadata local subtitle merge inputs/output, keeping these as local path selection improvements rather than downloader or subtitle-format verification.
- Added a desktop save dialog and optional output path field for local Music playlist M3U/M3U8 export, reusing the existing export command for queue and saved-playlist exports without changing external music-service sync scope.
- Added desktop pickers for the shared Tools output folder plus Video clip and FFmpeg transcode output files, improving local sidecar/queue output selection without changing downloader or media verification scope.
- Added desktop save dialogs for local Learning notes export, Reading state export, shot marker JSON output, and Subtitle Workshop Save as paths; these only fill existing local output fields and keep broad media/manual verification deferred.
- Added a Dependencies executable picker so each manual tool override can be selected through the desktop file dialog before saving, without changing dependency trust, install, or update behavior.
- Added desktop pickers for local update manifests and plugin install/marketplace paths: Advanced can choose a release manifest JSON, and Plugins can choose a manifest JSON, plugin folder, or marketplace registry JSON without enabling remote updater or dynamic plugin execution.
- Added Settings > Cookies file/save pickers for local Cookie file import, per-bucket Cookie export paths, and Bilibili watch-later/history manifest JSON selection; these are desktop UI convenience flows only and do not expose Cookie values or claim online Bilibili sync.

- Added create-time `run_after_active_slot` support across desktop `downloads_create` / `downloads_create_batch`, Home queued URL drafts, and CLI `download` / `batch --run-after-active-slot`, so desktop-created tasks can immediately fill available scheduler slots while CLI remains local queue creation only.

- Added Home Title hint and Run when a slot opens controls for normal URL and batch URL task creation without forcing those hints onto Torrent/P2P/Course specialized drafts.

- Added Chrome and Firefox browser-extension review zip targets plus per-target SHA-256 rows in the package manifest, and kept store signing/submission/browser E2E explicitly pending.

- Added Settings > Advanced third-party notice inventory access, extended settings/command keywords for dependency CLI, auth payloads, connector profiles, release gates, notice/legal inventory, and fixed media-tool CLI help lines to include `--data-dir`.
- Added CLI bulk delete commands for local Courses, Telegram chats/media, Bilibili imports, Channels/history, Learning notes, and Pomodoro sessions through existing backend batch delete paths.

- Added CLI plugin bulk commands for marketplace entry deletion, installed plugin enable/disable, and multi-plugin command/event/activity log clearing through existing backend batch paths.

- Added CLI `delete-reading-annotations` to bulk-remove local Reader bookmarks/highlights through the existing reading-state batch delete path.

- Added CLI bulk delete commands for staged Browser Extension Cookie and Authorization payload records through the existing safe payload deletion paths.

- Added CLI `delete-local-files` for scoped diagnostics/download-log bulk cleanup through the existing local-file deletion backend.

- Added CLI `install-tool` and `update-tool` wrappers for explicit managed dependency install/update requests.

- Added CLI `mark-channel-histories` to batch-mark local channel notification history items through the existing `channels_mark_notifications_shown` path.

- Added CLI `test-cookies` to batch-refresh local Cookie bucket health through the existing `cookies_test_many` path without exposing Cookie values.

- Fixed Courses Queue shown lessons/attachments to pass explicit visible lesson/attachment ids into `courses_queue_many_lessons` / `courses_queue_many_attachments`, so filtered UI batches and CLI id-list batches no longer expand to whole-course queues.

- Extended the local feature evidence snapshot with queueable course lesson/attachment counts so manifest-backed course queue coverage is visible without exporting course content or claiming remote extraction.

- Added backend `courses_queue_many_lessons` / `courses_queue_many_attachments` and frontend wrappers so Courses Queue shown lessons/attachments can create cross-course local download tasks in one backend write while keeping real remote course extraction pending.

- Added backend `plugins_clear_logs_many` and a frontend wrapper for local plugin command/event/activity logs, moving Plugins Clear shown commands/events/activity off frontend serial clear loops without deleting manifests, settings, data, or other log kinds.

- Added backend `plugins_set_state_many` and a frontend wrapper for local installed-plugin state changes, moving Plugins Enable shown / Disable shown off frontend serial command loops while preserving manifest-only/preflight behavior.

- Added backend `library_delete_annotations` and a frontend wrapper for local Reading bookmark/highlight cleanup, moving Reader Remove shown annotations off frontend serial delete loops without deleting source files, progress, exports, or Learning notes.

- Added backend bulk removal commands and frontend wrappers for local Course lessons and attachments, moving Courses Remove shown lessons/attachments off frontend serial delete loops while preserving the local-outline-only boundary.

- Added backend bulk removal commands and frontend wrappers for local Courses, Telegram chats, and Plugin marketplace entries, moving their filtered Remove actions off frontend serial delete loops.

- Added backend and CLI bulk removal for local Reading catalog items, Music catalog tracks, and Music playlists, and moved the matching Tools Remove shown actions off frontend serial delete loops.

- Added backend `p2p_bulk_action`, CLI `bulk-p2p-offers`, and Tools shown-offer controls that update/delete visible local P2P offer records in one backend write while keeping real network transfer explicitly pending.

- Added local feature evidence snapshot export for Courses, Library, Learning, Music, local queues, extension metadata, and plugin registry counts without exporting note bodies, lyrics, Cookie values, Authorization payloads, downloaded content, or log bodies.

- Added Open/Reveal controls for local import/export manifests and managed files across Course, Telegram, Bilibili, Cookie bucket import/export/storage, and plugin install/marketplace paths.

- Added local Open/Reveal controls for Tools path inputs covering torrent files, P2P send/receive paths, media tool inputs/outputs, waveform/Whisper sidecars, local library/music folders, and dependency executable overrides.

- Added local Open file/Reveal shortcuts for diagnostics/log inventories, settings/update manifest paths, and staged browser-extension Cookie/Auth payload files without exposing payload secrets or enabling remote updater behavior.

- Added plugin manifest/source path shortcuts for installed plugins and local marketplace entries, keeping dynamic plugin execution and trust/signing gates explicitly pending.

- Added local Open sample shortcuts for platform route examples and Open source shortcuts for configured dependency download-source URLs without changing dependency install behavior.

- Added Source shortcuts to the Downloads task list and task detail panel so persisted tasks can open their original URL without copying it from the row.

- Added Home and Tools metadata/playlist/gallery preview Open source shortcuts for preview roots, playlist item URLs, and gallery file URLs so users can inspect probed URLs without copying them manually.

- Added local Open source shortcuts for Course lesson and attachment rows/previews, Telegram media rows/previews, and linked Pomodoro focus sessions, plus Source/Detail shortcuts in local transfer panels so users can jump to the original URL or Downloads context without claiming new remote extraction or transfer capability.
- Added local Open source and linked Task shortcuts for Channel subscriptions/history rows and Bilibili import rows so manifest/check items can jump to their source URL or created download task without adding remote API claims.

- Added local P2P offer Open source, Reveal source, and Open receive folder shortcuts in the active offer card and offer list, keeping real network transfer explicitly pending.

- Added current Reading preview Open external/Reveal shortcuts so users do not have to return to the catalog row to locate the active local book/document.

- Added local Music track Open/Reveal shortcuts in the current player, queue, library tracks, and playback stats lists, reusing the existing system open/reveal commands without adding external music-service support.

- Added local preview-panel quick actions for Courses and Telegram: course lesson/attachment previews now expose Open/Reveal/Queue/Save progress where applicable, and Telegram media previews expose Queue/Open/Reveal/Remove without changing the local-manifest-only boundary.

- Extended Settings search and command palette keywords for course preview/reveal/queue and Telegram preview/reveal/clone/local-media workflows.

- Added a Courses lesson Reveal action for local lesson media so course lessons now match attachment/library/Telegram local-file workflows without adding remote course extraction.

- Added Tools reader Page/Previous/Next and Spine/Previous/Next controls for CBZ and EPUB local previews, reusing bounded on-demand extraction without claiming a full reader renderer.

- Added CLI `extract-cbz-page-preview` and `extract-epub-text-preview` wrappers so the local reading preview cache/text extraction paths are reachable from scripts as well as the desktop UI.

- Added Settings search and command palette keywords for CBZ/EPUB page, spine, text preview, and reading-order reader workflows.

- Added desktop `extension_get_connector_profile` and routed Settings profile preview/copy through the backend generator so desktop and CLI share pairing-token/profile JSON behavior without exporting staged Cookie or Authorization payload contents.

- Added desktop and CLI Browser Extension header-capture option persistence so connector profiles reflect the actual header-capture setting instead of hard-coding it on.

- Added CLI `extension-connector-profile`, which prints the extension options import JSON and can optionally mint a fresh pairing token without including staged Cookie or Authorization payload contents.

- Added Browser Extension connector profile onboarding: desktop Settings can generate/copy a bridge profile JSON, and the extension options page can import that JSON to fill bridge URL, pairing token, fallback, capture, and blocked-host options without exporting staged Cookie or Authorization payload contents.

- Added a Browser Extension popup bridge health check that calls `/health`, reports token validity, and keeps the existing options-page check for deeper setup.

- Added Browser Extension settings Cookie payload inventory so staged extension Cookie headers can be searched, selected for Cookie import, or deleted from the Extension panel as well as the Cookies panel.

- Added local reader progress restore and annotation helpers: opening a supported preview scrolls to saved progress, reader scroll updates and debounced-autosaves the progress input, bookmarks/highlights and EPUB/CBZ preview rows can jump back into the preview or refill the edit fields, and selected reader text can be copied into the highlight draft without claiming a full PDF/EPUB/CBZ renderer.

- Added safer local reader previews: EPUB now returns bounded spine text excerpts as reader content with existing typography controls, and HTML/HTM previews strip active embed/script/style blocks before rendering in a sandboxed iframe.

- Added Settings > Dependencies and Settings > Advanced reset controls for implemented local tool/settings state, including a guarded reset-all path that restores supported settings without deleting Cookie buckets, downloaded files, task history, plugin installs, manifests, or catalogs.

- Added Settings and CLI dependency download-source management (`tools_get_download_sources`, `tools_set_download_source`, `tools_clear_download_source`, `tool-sources`, `set-tool-source`, `clear-tool-source`) so configured URL/SHA-256/archive-member sources can drive the existing managed install path without hand-editing `tools.json`.

- Added `scripts/verify-browser-extension.ps1`, `npm run verify:browser-extension`, and `npm run package:browser-extension` for MV3 manifest/resource/JS checks plus a local review zip and package manifest without claiming store signing or browser E2E completion.

- Added `scripts/verify-windows-portable.ps1` and `npm run verify:windows-portable` to verify staged Windows portable marker files, data directories, checksum rows, release manifest entries, hashes, and byte counts without claiming signing or runtime smoke completion.

- Added independent Tools > Metadata network/auth controls for User-Agent, Referer, Proxy, Rate limit, Cookie bucket, and Authorization payload; Tools probes, sidecar saves, and Queue shown actions now use the tools-local context instead of the Home task fields.

- Extended metadata sidecar tools to carry the same advanced network/auth context as downloads and gallery preview: metadata/playlist probes, subtitle/thumbnail/chapter/comment listing, subtitle/info/comments/live-chat saves, and direct thumbnail file saving now accept User-Agent, Referer, Proxy, Rate limit, Cookie bucket, and Authorization payload where the underlying path can apply them.

- Added gallery-dl URL preview coverage: `gallery_probe_url`, CLI `gallery-probe`, and Home/Tools Probe gallery panels list candidate file URLs and can queue shown files as local image drafts without claiming download or real-site matrix completion.

- Added desktop `extension:pairing_changed` event emission for browser-extension pairing token creation/revocation, plus `settings:changed` emission for the legacy max-concurrency downloads settings command; both sync frontend state without exposing pairing token values.

- Added desktop `plugins:changed` event emission for local plugin install/update/uninstall, marketplace import/delete/clear, settings/log/event/activity writes, and command/event recording, with frontend subscriptions that sync installed plugins plus marketplace metadata without executing dynamic plugin code.

- Added desktop `downloads:list_changed` event emission for local Downloads delete, clear, archive/restore list moves, bulk archive/restore, and reorder writes, with frontend subscriptions that replace the local task list and clear stale detail/log selections without touching output files.

- Added desktop `channels:changed` event emission for local Channel subscription/history/settings/queue-backlink writes, with frontend subscriptions that sync the Channels panel while keeping `channel:new_items` focused on new-item notification.

- Added desktop `diagnostics:files_changed` event emission for local diagnostics/log export and cleanup actions, with frontend subscriptions that refresh Advanced file inventories without embedding file contents or secrets.

- Added desktop `bilibili:imports_changed`, `telegram:manifest_changed`, and `p2p:offers_changed` event emission for local manifest/index/offer writes, with frontend subscriptions that sync existing panels without claiming remote Bilibili, MTProto, or real P2P runtime parity.

- Added desktop `extension:payloads_changed` event emission for browser-extension Cookie/Auth payload staging, deletion, and clearing, with frontend subscriptions that refresh staged metadata without exposing Cookie or Authorization values.

- Added desktop `cookie:buckets_changed` event emission for local Cookie bucket import/rename/delete/clear/health-test writes, with frontend subscriptions that sync Cookie choices without exposing Cookie values.

- Added desktop `download:created` and `download:state` event emission for local task creation and status transitions, with frontend subscriptions that upsert the Downloads list while keeping full downloader/runtime verification for the final gate.

- Added desktop `library:changed` and `channel:new_items` event emission for successful local Library/Music/Courses/Learning writes and channel checks, with frontend subscriptions that refresh the existing panels without claiming full background/runtime parity.

- Added desktop `tool:status` and `plugin:status` event emission for successful local dependency and plugin state changes, with frontend subscriptions that update the current lists without a full manual refresh.

- Added a desktop `settings:changed` event bridge for successful local settings writes, with frontend subscription that keeps Settings inputs plus related Auth, Update, Extension, Channels, Reader, and Music local state in sync.

- Added a unified desktop toast bridge: `app_show_toast` emits `toast:show`, the frontend subscribes through the existing toast stack, and desktop plugin event recording now triggers the same local feedback event without claiming dynamic plugin execution.

- Added CLI managed dependency update check command that reports existing update metadata without installing or replacing dependency binaries.

- Added CLI read-only matrix/state commands for course platform support, Telegram local account state, and music service support without claiming remote extraction, MTProto sync, or external music connectors.

- Added CLI local full settings read and JSON patch commands for the implemented Appearance/Downloads/AI settings subset without widening the schema or running desktop/manual verification.

- Added CLI local diagnostics export and single P2P offer lookup commands without enabling URL inclusion by default or claiming real P2P transfer/runtime verification.

- Added CLI local wrappers for tool path overrides, settings search, course probe/import/open, Telegram media open/reveal, plugin settings/command/event host local logs, and music playback event recording without installing dependencies, syncing remote services, executing plugin code, or playing audio in the CLI process.

- Added CLI local download queue operations for pause, bulk state actions, queue reorder, and system open/reveal helpers without starting downloader scheduling, deleting output files, or claiming full OS/manual verification.

- Added CLI local Update/Auth/Extension/P2P/Library operations for local update manifest/settings reads, redacted auth settings and Twitter/X fallback updates, extension option updates, P2P offer lifecycle cleanup, Library external open/reveal, and reading annotation updates without claiming real updater, browser automation, P2P transfer, or full reader rendering.

- Added CLI local App/Settings/Diagnostics/Channels operations for diagnostics/log read-delete-clear, partial-download cleanup, settings reset/network validation/downloads settings, and channel polling settings/due-poll execution without claiming network connectivity, background OS wakeups, downloader execution, or full verification.

- Added CLI local Library/Reader/Music state commands for catalog delete/clear, reader progress/bookmarks/highlights/settings, music queue/lyrics/playlists/sleep timer/equalizer/Discord presence/playback stats, without claiming full reader rendering, media playback runtime, external music services, or full verification.

- Added CLI local manifest/catalog cleanup commands for Courses, Telegram, Bilibili, Learning notes, and Pomodoro sessions, including course progress/Cookie/note updates and Telegram local search/auth-state reset without claiming real remote course extraction, MTProto sync, Bilibili online API access, or full runtime verification.

- Added CLI local management commands for Cookie bucket list/match/test/rename/export/delete/clear, Extension staged payload cleanup, Channel/history cleanup, and Plugin marketplace/update/uninstall/log cleanup without executing remote sync or dynamic plugin code.

- Added CLI media utility commands for local subtitle merge/open/save, FFmpeg clip/transcode/shot/waveform tools, and Whisper subtitle generation, reusing existing backend services without claiming broad real-media or real-site matrix coverage.

- Added CLI dependency status plus metadata probe/list/save sidecar commands for subtitles, thumbnails, chapters, info JSON, comments, and live chat, reusing existing local metadata services without claiming final real-site coverage.

- Added CLI commands for local Learning notes/dashboard/graph/Pomodoro/daily goals, Browser Extension options/pairing/payload inventory, and local Plugin registry/marketplace/install/enable/disable/preflight/log inspection without claiming full browser pairing automation or dynamic plugin execution.

- Added CLI list/scan/import/rescan/prune and queue-draft commands for local Channels, Torrent/P2P, Reading Library, and Music stores, keeping real remote sync, BitTorrent transfer, P2P transfer, full reader, and full player work out of scope for this local subset.

- Added CLI list/status/queue commands for local Course, Telegram, and Bilibili manifest stores, including course lesson/attachment queueing, Telegram media/chat clone queueing, and Bilibili import queueing without claiming remote extraction or account sync.

- Added CLI manifest import commands for course outlines, Telegram chat/media manifests, and Bilibili watch-later/history manifests, reusing the existing local import stores without claiming remote account sync.

- Added CLI exports for platform route, course platform, and music service matrices so local support evidence can be gathered without opening the desktop UI.

- Expanded webpage asset bundling so saved same-origin CSS files are scanned for bounded same-origin `url(...)` resources and rewritten relative to the local CSS file.
- Added CLI settings manifest export/import commands so safe local configuration bundles can be moved between data roots without exporting Cookie/header/token secrets.

- CLI queued tasks now trigger the same best-effort thumbnail cache path when `--thumbnail-url` is provided; task thumbnail caching reuses task-level User-Agent, Referer, Proxy, Rate limit, Cookie bucket, and Authorization payload context where applicable.

- Added CLI export commands for diagnostics bundle, third-party notice inventory, and recovery manifest so release evidence can be gathered without opening the desktop UI.

- Added best-effort local task thumbnail caching: tasks keep the remote thumbnail URL, cache a bounded copy under app cache in the background, and Downloads prefers the local thumbnail path before falling back to the remote URL or type placeholder.

- Expanded webpage same-origin asset bundling to include simple CSS `url(...)` references in addition to `src`, `href`, and `poster`, while keeping the conservative same-origin and size limits.

- Added a Legal-page release evidence snapshot export that writes release gates, privacy status, source/document footprints, status counts, package scripts, and local diagnostics/log inventory into diagnostics JSON without claiming final release readiness.

- Added a privacy redaction matrix to the local privacy status panel, covering download URLs, Cookie values, auth payloads, log bodies, downloaded content, and local path inventory handling.

- Added a safe diagnostics bundle export that writes privacy/release summaries, route matrices, and local file inventories into a zip without Cookie values, auth payload values, downloaded content, or download log bodies.

- Added a Music service matrix export so Local/Spotify/SoundCloud/YouTube Music/Qobuz/Last.fm support status can be saved as diagnostics JSON without claiming external connectors are complete.

- Added a Courses platform matrix export so the local course host-hint/candidate support table can be saved as diagnostics JSON while remote extraction stays pending.

- Added a platform route matrix export from Tools > Support matrix so local route/status/evidence declarations can be saved as diagnostics JSON without claiming live-site verification.

- Added a Legal-page third-party notice inventory export that writes a local diagnostics JSON from npm package-lock metadata and Rust Cargo.lock crate metadata while keeping final license review marked required.

- Added a structured release checklist command and Legal-page panel that reports source and asset review, third-party notice, privacy, diagnostics inventory, capability honesty, updater/signing, packaging smoke, and blocked integration gates without running builds or overstating pending work.

- Added a built-in Legal route/page for source and asset boundary, dependency-license, user-responsibility, privacy, no-telemetry, and release-gate notices, with About and command-palette navigation.

- Added Browser Extension context-link task kind inference for direct image, audio, video, PDF, EPUB, and CBZ links while keeping ordinary page/link captures on the conservative video fallback.

- Added Settings reset support for the local Twitter/X auth fallback header plus an Advanced "Auth fallback" reset button that clears only FetchDock's fallback auth config without touching Cookie buckets.

- Added command-palette setting-section commands for Dependencies, Downloads, Network, Cookies, Browser Extension, Channels, Plugins, Appearance, Advanced, and AI, including Settings navigation plus pinned section highlight.

- Added app-shell route persistence so the last built-in route is restored from local storage after a frontend reload or desktop restart, while plugin routes safely fall back to built-in pages.

- Added Browser Extension task-kind handoff so context-media, media sniffer, local bridge POSTs, and deep-link fallback can preserve inferred audio/image/video-style task kinds instead of always creating video tasks.

- Added Tools Torrent/P2P local transfer filters and Start/Pause/Resume/Retry/Cancel/Archive/Restore shown controls for queued `torrent` and `p2p` task records without deleting offer records, source files, receive folders, or output files.

- Added Bilibili import `created_task_id` linking plus Settings > Cookies Bilibili transfer filters and Start/Pause/Resume/Retry/Cancel/Archive/Restore shown controls for local tasks created from imports.

- Added Channels and Courses local transfer panels with Start/Pause/Resume/Retry/Cancel/Archive/Restore shown controls for tasks explicitly created from channel history or course lesson/attachment queues, without deleting subscriptions, course outlines, notes, source files, or output files.

- Extended `downloads_bulk_action` to cover Pause visible plus Telegram/Channel/Course/Bilibili/Torrent transfer Pause shown controls, so active local task records can be paused in one backend command without deleting media files or output files.

- Added Plugins Clear shown commands/activity/events controls for batch-cleaning local plugin logs without deleting plugin manifests, settings, data, or marketplace entries.

- Added backend `cookies_test_many` plus Settings Cookies Test selected and Test shown controls for batch-refreshing local Cookie bucket health metadata in one command without exposing cookie values.

- Added Courses Remove shown courses for batch-cleaning currently filtered local course entries without deleting lesson files, attachments, notes, Cookie buckets, or download tasks.

- Added Telegram Remove filtered chats for batch-cleaning currently visible imported chat index entries without deleting media files, transfer tasks, or account state.

- Added P2P Pause shown, Resume shown, and Cancel shown controls for batch-updating currently visible local short-code offer state without deleting source files, receive folders, or queued tasks.

- Added a Channel history Mark shown control for batch-clearing currently visible pending notification flags without deleting history rows, subscriptions, or created download tasks.

- Extended `downloads_bulk_action` to cover Downloads Delete visible so currently filtered local task records can be removed in one backend command after confirmation while leaving output files and unrelated history untouched.

- Added Plugins Enable shown and Disable shown controls for batch-changing currently filtered installed plugin registry state without touching manifests, settings, data, or marketplace entries.

- Added a P2P Remove shown offers control for batch-cleaning currently visible local short-code records without deleting source files, receive folders, or queued tasks.

- Added Music playlist and Advanced diagnostics/log Remove shown controls so currently visible local playlist rows and diagnostics/log files can be batch-cleaned without deleting audio files, queue state, downloads, Cookie buckets, plugin data, or settings.

- Added Learning and Reader Remove filtered/shown controls for local notes, focus sessions, and reading annotations without deleting source files, downloads, progress, or media activity.

- Added Extension staged payload Remove filtered controls and Plugin marketplace Remove filtered registry cleanup without deleting imported Cookie buckets, created tasks, installed plugins, settings, or data.

- Added Channels Remove filtered controls for local subscription and history indexes without deleting created tasks, polling settings, notifications, or source history links.

- Added Telegram Remove filtered and Remove results controls for local manifest media indexes without deleting files, chats, transfer tasks, or account state.

- Added Courses Remove shown lessons and Remove shown attachments controls for local course outlines without deleting files, tasks, notes, or Cookie buckets.

- Added a Bilibili Remove filtered imports control in Settings > Cookies for local watch-later/history index cleanup.

- Added Remove shown controls for Reading and Music catalog filters so current search results can be removed from FetchDock indexes without deleting source files or history.

- Added a local platform route sample check in Tools so target URLs show classifier platform, intent, and suggested task kind without claiming live-site verification.

- Added Torrent metadata selection shortcuts for selecting or clearing the currently shown file-filter results without losing unrelated selections.

- Added a local Telegram channel drawer that lists imported channel/group chats from the manifest, filters by kind, and selects a chat for browser filtering and clone setup.

- Extended local Telegram manifest previews so PDF/HTML document/file media can open in an iframe preview and other local files get an explicit Open/Reveal fallback panel.

- Added Telegram chat-level queue controls so imported chat cards and search chat results can batch queue that chat's source-backed local manifest media.

- Added Course library queue controls for the currently shown/search-matched lessons and attachments, reusing the existing local course batch queue commands.

- Added Music library controls to load the currently shown/search-filtered tracks into the queue or save them directly as a local playlist.

- Added Reading state export Open/Reveal actions so exported JSON or Markdown annotation files can be opened or located from the reader panel.

- Added `telegram_get_sync_status` and a Telegram local sync indicator for manifest counts, local/missing media paths, queueable sources, and transfer task state counts.

- Added Browser Extension bridge health token diagnostics so `/health` reports pairing/token validity and the extension options page can Check bridge for the current URL/token.

- Improved Browser Extension action feedback so badge/title states cover send, fallback, error, Cookie/Auth staging, and restore to the current media candidate count.

- Added backend-backed `music_get_service_matrix` support so the Music service matrix now comes through the Tauri command/API wrapper instead of a frontend-only constant.

- Added courses_get_platform_matrix and a Courses platform matrix panel for the ten target course providers, honestly marking the current local-candidate scope and remote extraction limits.

- Normalized magnet BTIH metadata so 40-character hex hashes become lowercase and 32-character base32 hashes decode to 40-character hex while preserving the original exact topic.

- Added .torrent piece metadata parsing for piece length, piece count, and pieces digest bytes in metadata responses, Tools display, queued draft details, and sidecar exports.

- Added BT v1 info-hash calculation to .torrent metadata parsing, display, queued draft details, and torrent sidecar exports.

- Added courses_delete_lesson and courses_delete_attachment plus Courses Remove controls for local lesson and attachment index cleanup without deleting files, tasks, notes, or cookies.

- Added `channels_queue_history_items` plus a Channels history Queue filtered control for batch-creating local `video/queued` tasks from error-free history rows.

- Added `telegram_queue_media_items` plus Telegram Chat browser/Search result controls to batch queue local manifest media with source URLs.

- Added `bilibili_queue_imported_items` plus a Settings > Cookies button to queue the current filtered Bilibili import list as local `video/queued` download tasks.

- Added `telegram_delete_media` and Telegram Chat browser/Search result controls to remove one imported media index entry without deleting files, chats, transfer records, or tasks.

- Added `telegram_prune_missing_local_media` and a Telegram Chat browser button to clear stale imported media paths while keeping chats, media records, remote URLs, transfer tasks, and files intact.

- Added `courses_prune_missing_local_files` and a Courses button to clear stale local lesson or attachment paths while preserving courses, remote URLs, progress, notes, cookies, and files.

- Added `plugins_check_all_hosts` plus Plugins and Settings controls to refresh host preflight state for all installed plugin manifests without dynamic loading.

- Added `music_rescan_catalog` and a Tools button to rescan already-imported music folders, merge new or updated tracks, prune missing files, and keep the local queue consistent.

- Added `library_rescan_catalog` and a Tools button to rescan already-imported reading library folders, merge new or updated items, and prune missing file paths without deleting source files or reading state.

- Added local RSS/Atom expansion to channel checks so one subscription check can record and auto-queue multiple feed items before falling back to the existing metadata probe path.

- Exposed the local platform support matrix through CLI `platforms`/`matrix`/`support-matrix` aliases with JSON and human-readable output.

- Added platform/support-matrix search terms to the Tools command palette entry.

- Wired the Downloads task log drawer to paged `downloads_get_logs` reads with backend search and Load more controls.

- Added a local platform support matrix command and Tools panel that reports route, implementation status, evidence, and limitations without treating classifier-only labels as verified site support.

- Added additive download-log pagination fields to `downloads_get_logs`, including optional cursor, limit, search, next cursor, total lines, and matched lines while keeping the existing `lines` wrapper compatible.

- Added local CLI task management commands for listing, showing details, reading logs, queueing start/resume/retry/cancel state changes, archiving, restoring, deleting, and clearing completed/archived task records without starting the desktop scheduler.

- Expanded CLI queued-task sidecar flags for auth payloads, thumbnail URL, subtitles, SponsorBlock, and metadata embedding preferences.

- Expanded CLI queued-task options with title, headers, proxy, rate limit, live/fragments, custom yt-dlp args, and clip start/end fields.

- Expanded Settings search keywords for CLI output mode and queued-task creation flags.

- Added CLI download creation options for queued tasks: `--kind`, `--output-dir`, `--quality`, `--audio-format`, and `--cookie-bucket`.

- Expanded Settings search keywords for archived Downloads records, Cookie auto-match, extension blocked hosts, Reading annotations, and Music playback/playlists.
- Added Home Cookie bucket auto-match so the first URL match can preselect a bucket without overriding manual choices.
- Added an Archived Downloads history clear control that only removes archived task records and leaves output files plus non-archived history untouched.
- Tightened Browser Extension options so the bridge URL must stay on localhost/127.0.0.1 and blocked hosts accept the same JSON/list formats as desktop settings.
- Added a local Reading annotation clear control for the current book that preserves reading progress, learning notes, exported files, and source files.
- Added a local Music playback history clear control that resets stored play events without touching catalog, queue, playlists, settings, or audio files.
- Added local clear-all controls for tracked channel subscriptions, course library candidates, and Learning notes while preserving related history, tasks, cookies, and files.
- Added local P2P offer remove and clear-all controls that only edit FetchDock pairing records without deleting source files or queued tasks.
- Added local Reading and Music catalog remove/clear controls that only edit FetchDock catalog indexes and leave source files untouched.
- Added local Browser Extension Cookie payload browsing, search, use, single-delete, and clear-all controls for staged Cookie captures.
- Added local Plugin activity log browsing and clear controls for marketplace/install/update/preflight history.
- Added scoped Settings > Advanced delete and clear controls for local diagnostics JSON and download log files.
- Added local Plugin marketplace entry removal and clear-registry controls.
- Added local Plugin command/event log clear controls for each installed plugin.
- Added local Browser Extension Authorization payload clear-all controls for staged header payloads.
- Added local Channel history item removal and clear-history controls.
- Added local Pomodoro focus-session removal and clear-history controls for Learning.
- Added local Bilibili imported-item removal and filtered clear controls that only edit the FetchDock import index.
- Added local Telegram imported-chat removal and clear-all controls that only edit the FetchDock manifest index.
- Added local reset controls for Reader settings, Music queue, Sleep timer, Equalizer, and Discord Presence state in Tools and Settings > Advanced.
- Expanded Settings search so reader/music/equalizer/sleep/Discord reset queries land on Advanced.
- Added local reading-state export for the current book as JSON or Markdown from the reader state panel.
- Added persisted reader font family and TXT zoom settings alongside existing reader font size and line height controls.
- Added single-task and visible-batch Downloads archive/restore actions that keep the original completed/failed/canceled terminal status in task metadata.
- Added Queue/History views in Downloads so active work excludes archived tasks by default while completed, failed, canceled, and archived tasks stay browsable.
- Added a backend `downloads_bulk_action` command and moved visible Downloads Start/Resume/Retry/Cancel bulk actions off the frontend serial loop.
- Added expandable full Home/Tools metadata lists, learning graph nodes/links, torrent/magnet trackers, shot markers, CBZ/EPUB structure previews, music stats, plugin marketplace entries, and partial cleanup previews while keeping compact defaults.
- Added expandable full Focus session, Bilibili import, and Advanced diagnostics/log lists while keeping compact defaults.
- Added expandable full Torrent file and P2P offer lists while keeping compact defaults.
- Added expandable full Local music playlists, queue, tracks, artists, and albums while keeping compact defaults.
- Added expandable full Local reading library catalog, bookmark, and highlight lists while keeping compact defaults.
- Added expandable full Channel history browsing while keeping the default history panel compact.
- Added expandable full Telegram chat, media, and transfer lists while keeping compact defaults.
- Added expandable full lesson and attachment lists in the Courses library while keeping compact defaults.
- Added editable channel polling controls to Settings > Channels, including save and due-poll actions.
- Added a manual dependency update check command and Dependencies UI Check action for managed tool sources.
- Added downloaded/total byte and percent progress to dependency install/update artifact downloads and surfaced it in the Dependencies UI.
- Added browser extension bridge port discovery across localhost ports 17654-17664 and transient badge cleanup for send/error states.
- Added best-effort system notifications for completed Pomodoro timers and completed download tasks.
## 0.1.0 - Unreleased

- Added best-effort system notifications for new pending channel history items from manual checks and due polling.
- Added drag-and-drop reordering for queued Downloads tasks in the unfiltered queue-order view.
- Expanded the About page with runtime, data root, source and asset boundary, privacy stance, legal note, build status, diagnostics export, and Settings navigation.
- Added a per-task Downloads Detail panel backed by `downloads_get`.
- Split the local reading library controls into Scan preview and Import catalog actions.
- Added Open data actions for installed plugins and plugin entry settings panels.
- Added a Tools > Metadata local subtitle merge form for multi-file subtitle inputs and one output path.
- Added Settings Cookies filtered multi-select controls, platform-level clear, and matched-bucket handoff to the next Home task.
- Added reader highlight-to-Learning-note actions for both draft highlight text and persisted highlights.
- Added month and weekday labels to the Learning dashboard year-style heatmap.
- Added a lightweight SVG knowledge graph preview for local note links in the Learning dashboard.
- Added clickable knowledge graph node cards that filter the Learning notes list by the selected note title.
- Added edit/cancel support for local Learning notes using the existing note save command update path.
- Added edit/cancel support for local music playlists so the current queue can overwrite an existing saved playlist.
- Added an Open source action for Learning notes that carry an HTTP source URL.
- Added torrent/magnet task metadata sidecar export so queued drafts can produce an auditable `.torrent-task.json` file while real BT transfer remains pending.
- Added P2P receive task sidecar export so queued short-code drafts can produce an auditable `.p2p-task.json` file while real transfer remains pending.
- Added lightweight webpage task execution that saves the main HTML document through the built-in HTTP(S) path; a later local subset now also saves bounded same-origin assets while full offline mirroring remains pending.
- Added task detail metadata for local course lesson/attachment and Telegram media queue entries; Telegram manifest media source URLs now execute through the built-in HTTP(S) downloader while MTProto transfer remains pending.
- Added a Downloads source-detail summary line for course, Telegram, torrent, and P2P task metadata.
- Added safe CBZ and EPUB manifest previews that list image pages or package metadata without extracting/rendering the archives.
- Expanded CBZ/EPUB manifest previews with archive image totals, OPF metadata, navigation candidates, and reading-order summaries while keeping full rendering pending.
- Added EPUB OPF title/creator extraction during local reading-library scans, marked as `epub_opf` metadata.
- Added EPUB OPF cover-image extraction into the local reading-library cover cache for list thumbnails.
- Added CBZ first-image cover extraction into the same local reading-library cover cache for list thumbnails.
- Added bounded CBZ page image preview extraction into `data/library/previews`, limited to the first 24 pages under 8 MB each.
- Added bounded EPUB spine text previews from the first 8 HTML/XHTML reading-order documents without executing scripts or loading remote assets.
- Added bounded PDF Info/XMP metadata scanning for title, author, creator, producer, dates, detected page count, and PDF preview summary chips.
- Added local music sidecar metadata JSON support for title, artist, and album overrides during folder scans.
- Added lightweight embedded music metadata scanning for MP3 ID3v1/ID3v2, FLAC/Ogg/Opus Vorbis comments, and common M4A title/artist/album atoms.
- Added embedded music cover extraction for MP3 APIC, FLAC PICTURE, and M4A covr images into `data/music/covers` when no sidecar cover exists.
- Added timed sidecar lyrics highlighting for local `.lrc`, `.srt`, and `.vtt` files in the music player.
- Added WebAudio-backed local music equalizer filtering for saved bass/mid/treble presets.
- Added CLI `--data-dir` support so info, download, batch, and Cookie import can target an explicit FetchDock data root.
- Added CLI `--json` flag compatibility before or after the command while preserving JSON as the default output.
- Added local P2P offer pause/resume controls and a paused filter state while keeping real network transfer marked pending.
- Added a plugin failure-sample installer that generates a missing-library manifest and verifies the Plugins page can show `failed` preflight state without crashing.
- Added a Home Bilibili special-preview summary for local URL subtype, cookie health, import counts, status message, and refresh.
- Added a Home advanced-options `Save as defaults` action that explicitly persists one-off task network/output/yt-dlp values into global Downloads/Network defaults.
- Added Settings Cookies local bucket search, health filtering, and filtered Bilibili import browsing.
- Added Browser Extension authorization payload search for staged header references without exposing secrets.
- Added Channels subscription search and auto-download/error filtering for local tracked channels.
- Added per-task download log search inside the Downloads task log drawer.
- Added Learning Pomodoro session search/status filtering and local music playlist search.
- Added local reading annotation search and bookmark/highlight type filtering in the Tools reader state panel.
- Added a local music service matrix for Spotify, SoundCloud, YouTube Music, Qobuz, Last.fm, and local files without claiming external account sync.
- Added local Discord Rich Presence music settings with privacy controls while keeping real Discord IPC marked pending.
- Expanded the Learning dashboard heatmap from a 30-day strip to a local 365-day year-style activity view.
- Added course progress and local music playback activity into the Learning dashboard aggregation.
- Added local reading progress, bookmarks, and highlights into the Learning dashboard aggregation.
- Added a Local reading library prune action to remove missing file paths from the persisted catalog.
- Added a Local music library prune action to remove missing tracks from the persisted catalog and queue.
- Added pinned Settings search highlighting so clicked results keep one active target until the next search.
- Added Italian as a ninth app language entry for the current shell i18n subset.
- Added approximate local course preview resume and progress writeback for video/audio lessons.
- Switched local music playback stats from fixed play events to approximate elapsed playback increments.
- Added Plugins page search and state filtering for installed manifest entries.
- Added local plugin marketplace entry search and plugin command/event log search.
- Added Torrent metadata file search and selected-only filtering for local .torrent file selection.
- Added local P2P offer search and status filtering in the Tools short-code transfer panel.
- Added Settings Advanced diagnostics/log search and kind filtering for local file previews.
- Added local course library search across courses, lessons, attachments, URLs, and paths.
- Added Learning note local filters for tags, source/timestamp/link state, and note sort modes.
- Added Telegram transfer panel search and status filters for local telegram_media download tasks.
- Added created-date range filters to the Downloads persisted task list.
- Added local PDF iframe preview in the Tools reading library while keeping full PDF/EPUB/CBZ readers pending.
- Added local course PDF attachment preview alongside lesson media previews for imported course manifests.
- Added local reading library search and format filtering for imported or persisted catalog items.
- Added local music library search and format filtering across Tracks, Artists, and Albums views.
- Added Downloads local view sort modes for queue order, created time, updated time, and title.
- Added Downloads visible-task bulk actions for start, resume, retry, and cancel using existing task commands.
- Added Channels history search and status filtering for local check results.
- Added Telegram local chat browser text and media-type filtering for imported manifests.
- Added task thumbnail URL persistence from Home metadata preview and thumbnail/placeholder rendering in the Downloads queue.
- Added a local knowledge graph preview with note nodes, backlink counts, and resolved link edges in the Learning dashboard.
- Added a local Pomodoro countdown with Start/Pause/Reset that records completed focus sessions and pauses in-app media when the timer ends.
- Added local music Tracks, Artists, and Albums views backed by scanned or persisted catalog tracks.
- Added a persisted local music catalog: imported folders are scanned into `data/music/catalog.json` and restored in the Tools music library panel.
- Added a persisted local reading catalog: imported folders are scanned into `data/library/catalog.json` and restored in the Tools reading library panel.
- Added a Home Course mode that imports course URLs into the local Courses library as candidates without claiming remote lesson extraction.
- Added Home Torrent and P2P modes that queue magnet, local `.torrent`, and prepared short-code receive drafts through the existing local queue paths.
- Added a local Telegram transfer panel that lists `telegram_media` download tasks with status, progress, output paths, errors, and queue controls.
- Added local course attachment queueing for manifest attachments with remote source URLs, including PDF/book/generic task kind inference and batch skipped-item reporting.
- Added local course Queue all lessons support for manifest lessons with remote source URLs, including skipped-item reporting for lessons without source URLs.
- Added a Playlist Home mode and `playlist` download kind that queues yt-dlp tasks with `--yes-playlist`.
- Added a local FFmpeg transcode command and Tools panel for copy/H.264/H.265/VP9/audio presets, simple metadata, cover attachment, progress, and cancel.
- Added a local Telegram clone wizard that batches imported manifest media into queued `telegram_media` tasks and reports skipped items.
- Added local music sidecar cover detection and cover-derived player theme color controls.
- Added plugin command-call log listing so safe command stubs can be inspected from Plugins and plugin entry pages.
- Added a basic plugin settings schema form for top-level string, number, integer, boolean, and enum fields while keeping JSON editing available.
- Added Windows portable checksum output with `checksums.sha256` and a local `release-manifest.json` file list.
- Added manifest-declared plugin event metadata, a safe event-recording stub, and recent event log listing from plugin JSONL without dynamic plugin execution.
- Added metadata-probe channel history dedupe keys so repeated successful checks do not duplicate history rows or auto-queue tasks.
- Added staged browser-extension Authorization payload management and task-level auth payload references for yt-dlp/direct-file requests with host matching.
- Added plugin dynamic-library preflight metadata: manifest `library_path`/`entrypoint`, host ABI status, library file checks, and a Plugins page host check without executing plugin code.
- Added Windows portable package staging script for built Tauri executables and portable data directories.
- Added Linux Flatpak packaging skeleton with desktop entry and metainfo templates.
- Added local update settings for Advanced: enable flag, release manifest path, check interval, and last local manifest result.
- Added a lightweight frontend i18n helper and wired Appearance language into navigation, command palette, topbar actions, and Settings search labels.
- Added task-level and Downloads-default custom yt-dlp argument appends with argv parsing and blocking for FetchDock-managed or risky options.
- Added URL intent classification and per-URL batch draft routing for target platforms, gallery-oriented hosts, other Asian platform labels, and direct file type inference.
- Added local Bilibili URL subtype labels for b23 links, video, bangumi/media, course, creator/profile, favorites, watch later, history, and weekly routes.
- Added Downloads platform and text filters for persisted task history browsing.
- Added Channels history Queue/Queue again actions backed by a desktop command that creates download tasks from existing history items.
- Added local privacy status reporting in Advanced settings for no-telemetry and diagnostics-default visibility.
- Added a local update manifest checker for release manifest smoke checks without enabling remote updater behavior.
- Added Twitter/X manual Cookie header fallback settings with task-level Cookie bucket priority and yt-dlp command-log redaction.
- Added local course note timestamp jumps into native lesson video/audio previews.
- Added desktop-side Browser Extension blocked-host persistence with newline/comma/JSON import parsing.
- Added local course lesson video/audio preview fallback for manifest lessons with local paths.
- Added local Telegram photo/video/audio preview fallback for manifest media with local paths.
- Added manual install-missing-local support for imported plugin marketplace entries.
- Added persisted download task file counts so queued torrent selections show file count and total size in Downloads.
- Updated Telegram local media docs to reflect existing Open/Reveal commands.
- Added library-scoped external open/reveal commands for scanned reading items.
- Added local channel notification mark-shown handling for pending history items.
- Added local plugin marketplace bulk update for installed plugins that match imported registry entries.
- Added browser extension Cookie payload staging through the loopback bridge plus Settings import by payload id.
- Added a local Bilibili account status summary based on local Cookie buckets and manifest import counts.
- Added P2P receive-folder drafts so short-code offers can be marked receive-ready without claiming real transfer support.
- Added `p2p/queued` receive task drafts from prepared short-code offers while keeping real transfer support explicitly pending.
- Added PDF, book, and webpage task kinds plus Home mode buttons; webpage execution now saves the main HTML document and a bounded same-origin asset folder while full offline archiving remains pending.
- Added Downloads type filters and kind/platform task chips for the expanded task kind set.
- Added local channel notification markers plus in-app toast feedback for successful channel checks.
- Added course lesson queue drafts with the course_lesson download kind for manifest lessons that have remote source URLs.
- Added Learning daily focus goals and local note graph summaries derived from [[title-or-id]] links.
- Added Local music queue Up/Down/Remove controls backed by the persisted queue state.
- Added desktop-side extension options persistence for bridge URL, token-set state, deep-link fallback, and media capture settings.
- Expanded Settings manifest export/import to cover implemented safe local settings bundles across Appearance, Downloads/Network, Update, Extension options, Channels polling, Reader settings, and local Music UI state without exporting secrets.
- Added local course lesson media Open action with `opened_at` tracking for manifest lessons.
- Added Learning note `[[title-or-id]]` outgoing link summaries and backlink counts.
- Added Local music Previous control plus persisted queue volume.
- Added local Network proxy format validation and UI feedback in Settings.
- Added local music equalizer preset state storage and controls while DSP processing remains pending.
- Added external Open/Reveal fallback actions for scanned PDF/EPUB/CBZ reading library items.
- Added an Advanced recovery manifest export with local path, task status, tool status, diagnostics, and log inventory.
- Added course attachment Open/Reveal actions for local manifest attachments.
- Added a Learning daily journal shortcut backed by the local notes store.
- Added a local Learning progress dashboard command and UI with note/focus totals, streaks, active-day count, and a 30-day heatmap.
- Added queue-time `.torrent` file selection metadata so selected paths are validated and logged before the real transfer engine is wired.
- Added local plugin update-from-marketplace support for replacing an installed manifest from an imported marketplace entry.
- Added local plugin marketplace registry import with manifest-path entries installable from the Plugins page.
- Added a local Bilibili watch-later/history manifest import subset with imported item listing and video task queueing.
- Added timestamped local course lesson notes from the Courses page, backed by the Learning notes store and lesson note counts.
- Added current-preview timestamp capture for local course lesson notes.
- Added course-level Cookie bucket association so queued course lessons and attachments can inherit an existing account bucket.
- Added a local Whisper CLI subtitle generation tool for SRT/VTT/TXT sidecars when a Whisper executable is configured.
- Added a Home Images mode and backend gallery-dl execution path for image download tasks, with task-scoped output directories and multi-file completion summaries.
- Added a local Telegram manifest import/search/media-queue subset for browsing exported chat/media metadata while real MTProto transport remains in progress.
- Added scoped Advanced diagnostics/log preview commands and Settings UI previews for local app diagnostics JSON and download logs.

- Added local course manifest import for FetchDock JSON outlines with lessons, attachments, and lesson progress updates in the Courses page.
- Added editable reading annotations for TXT/HTML previews, including bookmark/highlight update and delete actions persisted in reading-state JSON.
- Added persisted local music queue state plus sidecar lyrics preview for .lrc, .txt, .srt, and .vtt files next to the active track.


- Added a safe plugin command-call local log for manifest-declared commands, recording JSON payloads under plugin data without executing dynamic plugin code.
- Added local music playlists and sleep timer state with Tools UI controls for saving/loading queues and pausing the active audio when the timer ends.
- Added a local P2P short-code offer skeleton for send-file pairing metadata, receive-code lookup, and offer cancellation while real transfer remains in progress.
- Added Advanced diagnostics/log file listing and dry-run-confirmed `.part` partial download cleanup scoped to the app downloads folder.
- Added Cookie bucket bulk clear controls and backend `cookies_clear` for selected buckets or platform-scoped clearing.
- Added local channel polling settings with due-poll execution, persisted timestamps, and UI controls alongside manual channel checks.
- Added torrent and magnet queue draft commands so parsed `.torrent` files and magnet URIs can enter the download queue while the real transfer engine remains marked in progress.
- Added local reading state persistence for TXT/HTML previews, including progress percent, bookmarks, and highlights stored under the app data directory.
- Added a browser extension media-sniffer subset: HLS/DASH/video/audio/image URL capture, popup media candidate sending, blocked-host settings, media context menu, and action badge feedback.
- Added a Learning module subset with local note create/search/delete commands and local Pomodoro session recording in the desktop UI.
- Added a local reader preview subset for TXT/HTML/HTM library scan items and a local music playback queue using scanned tracks plus HTML audio controls.
- Added channel auto-download queue creation for manual checks when a subscription has auto-download enabled, with created task ids recorded in channel history.
- Added browser extension pairing-token commands, Settings UI controls, and bridge token validation when a token is active.
- Added a minimal CLI dispatch path for info, queued single-URL download creation, batch queued creation, and Cookie bucket import.
- Expanded Appearance themes to 14 original token sets, including compatibility entries for Dracula, Catppuccin, One Dark, e-ink, Nord, Rose, Solar, Forest, and Midnight.
- Added local plugin settings/data directory commands with a JSON settings editor in the Plugins page.
- Added plugin manifest navigation entries for enabled local plugins, visible in the sidebar and command palette without executing plugin code.
- Added Settings panels and search entries for Channels, Plugins, and AI scope controls.
- Added local AI settings persistence for provider scope, Whisper defaults, assistance flags, and AI section reset without enabling cloud AI workflows.
- Added a browser extension header-capture subset that passes Referer/User-Agent hints and logs only secret-header presence.
- Added browser extension HLS/DASH segment grouping so stream segments update a manifest candidate instead of cluttering popup results.
- Added Settings > Browser Extension auth payload selection for the next Home task, with selected payload preview in the Home advanced options.
- Added local Cookie bucket health checks and reset buttons for implemented Appearance, Downloads, and Network settings.
- Added plugin command/event payload formatting and latest-log reuse controls in plugin panels.
- Added reset controls for Browser Extension options, Channel polling settings, and local Update preferences.
- Added capability map, architecture, API contract, and acceptance documentation.
- Added minimal Tauri 2 + Svelte application shell.
- Added original navigation for Home, Downloads, Tools, Settings, Plugins, and About.
- Added basic app status, path opening, file reveal, diagnostics export, close-to-tray, tray menu, deep link configuration, and portable data path detection.
- Added generated Tauri icon variants for Windows/macOS/Linux packaging.
- Added autostart status commands plus a settings confirmation flow for launch-at-sign-in.
- Added shell-open event bridging for deep links and the default global capture shortcut, with captured URLs landing in the home input.
- Added clipboard text reading for the global capture shortcut plus focused Rust URL extraction tests.
- Added a Home Paste button that reads the system clipboard and fills the first URL found.
- Added a persisted queued download draft entry point: manual capture/deep link payloads can create local `generic/queued` tasks and the Downloads page can list them.
- Added lightweight URL platform detection labels for the Home capture input and matching task platform tags.
- Added multi-line and `.txt` batch URL entry with per-item task creation failures.
- Added local queue management commands and UI actions for canceling, deleting, refreshing, and reordering queued draft tasks.
- Added status filters for the Downloads page task list.
- Added Downloads page Open and Reveal actions for tasks with output paths.
- Added a minimal background direct-file start path for `http://` and `https://` URLs, with byte progress events, completed/failed state updates, saved output paths, and file-backed task logs.
- Added a process-local download scheduler with configurable max active downloads, pause/resume/retry commands, running cancellation flags, retry/backoff classification for transient HTTP failures, startup recovery for interrupted active tasks, and a task log panel in the Downloads page.
- Added Settings page persistence for the download scheduler concurrency limit.
- Added implemented-settings search for the Settings page with clickable highlighted results.
- Added a Downloads settings subset for default output folder, filename template, and skip-existing, with single-task and batch default output inheritance.
- Applied the Downloads filename template and skip-existing settings to direct-file output planning.
- Added Downloads organize-by-platform setting support for direct-file output planning.
- Added Downloads default quality and audio-format preferences, persisted them, and inherited them onto new task records.
- Added Downloads subtitle default preferences, persisted them, exposed them in Settings, and inherited them onto new task records.
- Added Downloads SponsorBlock default preferences, persisted them, exposed them in Settings, and inherited them onto new task records.
- Added Downloads metadata default preferences, persisted them, exposed them in Settings, and inherited them onto new task records.
- Added a yt-dlp argument builder for quality, subtitles, SponsorBlock, metadata, thumbnails, and chapter-splitting preferences.
- Added a minimal yt-dlp execution path for non-direct-file tasks, including configured/managed/PATH tool resolution, output-file detection, and nonzero process failure reporting.
- Added yt-dlp stdout/stderr capture into per-task download logs.
- Applied Downloads output folder, organize-by-platform, filename template, and skip-existing settings to yt-dlp command planning and output detection.
- Restored the Rust application backend source after local truncation and re-verified the existing Rust test suite.
- Added a minimal audio download mode path: frontend API payloads can send `kind: "audio"`, the Home capture UI exposes a Video/Audio segmented control, and the Rust yt-dlp plan maps audio tasks to extraction with the selected audio format.
- Added a Home audio-format selector for audio tasks and a shared task-create options helper so single and batch creation pass task-level audio formats consistently.
- Added focused fake-tool coverage for audio yt-dlp execution output detection, including task-level audio format arguments and completed output path selection.
- Added explicit `video` task kind support so the Home Video mode creates video tasks while keeping `generic` available for fallback and legacy tasks.
- Added focused fake-tool coverage for video yt-dlp execution output detection, confirming video tasks use the normal quality format path without audio extraction arguments.
- Added create/start/completion fake-tool coverage for video tasks, including queued-to-active state changes, SQLite persistence, completed output path updates, and stdout/stderr task logs.
- Added create/start/completion fake-tool coverage for audio tasks, including extraction arguments, selected audio format output detection, SQLite persistence, and stdout/stderr task logs.
- Added create/start/failure fake-tool coverage for yt-dlp tasks, including failed state persistence, error summaries, retry metadata, and stdout/stderr task logs.
- Added rate-limit retry coverage for yt-dlp tasks, including queued retry state, retry metadata, retry log entries, and retry-limit exhaustion falling back to failed state.
- Added dedicated dependency-missing and dependency-failed download error categories for absent or unstartable yt-dlp executables, with matching frontend API typing.
- Added yt-dlp [download] progress line parsing that maps external tool output to download:progress payloads, persists downloaded/total bytes, and records structured task log entries.
- Added runtime yt-dlp stdout/stderr streaming so parsed [download] progress is persisted and logged before the child process exits.
- Added yt-dlp child-process cancellation so pause/cancel requests stop the running external process and return an interrupted result.
- Added a minimal metadata preview path: `metadata_probe_url` runs yt-dlp `--dump-json --no-playlist`, parses title, author, thumbnail, duration, and formats, exposes a frontend API wrapper, and shows a Probe preview panel on Home.
- Added a minimal metadata info JSON save command and Home action: `metadata_save_info_json` asks yt-dlp to write the full info JSON file and returns the generated path.
- Added minimal thumbnail list/save commands: `metadata_list_thumbnails` parses yt-dlp thumbnail variants and `metadata_save_thumbnail` saves a selected thumbnail URL to disk.
- Added Home thumbnail list/save controls inside metadata preview, including selected thumbnail persistence to the chosen output folder or Downloads default.
- Added minimal chapters list/save commands and Home preview controls: `metadata_list_chapters` parses yt-dlp chapters and `metadata_save_chapters` writes them as JSON.
- Added a minimal comments save command and Home preview action: `metadata_save_comments` asks yt-dlp to write comments into an info JSON file and returns the generated path.
- Added a minimal comments list command and Home/Tools preview actions: `metadata_list_comments` asks yt-dlp for comments metadata and parses author, text, time, likes, and replies for short previews.
- Added a minimal live chat save command and Home/Tools actions: `metadata_save_live_chat` asks yt-dlp to save the `live_chat` subtitle track as a json3 sidecar file and returns the generated path.
- Added Home preview format selection for Video tasks, forwarding the selected format id into task `quality` and preserving raw numeric ids as yt-dlp `--format <id>` while keeping `720p`-style height mapping.
- Added a minimal subtitles-only mode: Home can create `subtitles_only` tasks and yt-dlp planning/execution uses `--skip-download --write-subs` with subtitle preferences while detecting `.vtt` outputs.
- Added a minimal subtitle listing command: `metadata_list_subtitles` runs yt-dlp `--list-subs --skip-download --no-playlist` and returns manual/automatic subtitle language, name, and format options through the frontend API.
- Added a minimal subtitle save command: `metadata_save_subtitle` saves a selected language/format sidecar subtitle file with yt-dlp and returns the detected output path.
- Added Home subtitle language selection for Subtitles mode, forwarding selected languages into task-level subtitle options while leaving Video/Audio tasks to inherit defaults.
- Added a Home subtitle save action that saves the selected subtitle option to the chosen output folder or the Downloads default.
- Added a minimal local subtitle merge command: `metadata_merge_subtitles` concatenates multiple local text subtitle files into one output path and reports the merged count.
- Extended local subtitle merge input decoding to accept UTF-8 BOM and UTF-16 BOM subtitle files before writing the merged output as UTF-8.
- Added a minimal local video clip/reencode command and Home action: `media_clip_video` validates local paths and asks FFmpeg to stream-copy or reencode a selected time range, while Home exposes source/output/time fields, codec/CRF/preset controls, FFmpeg machine-progress elapsed updates, and cancel controls.
- Added an independent Tools > Video clip entry that reuses the local FFmpeg clip/reencode controls outside the Home capture flow.
- Added an independent Tools > Metadata entry that reuses the existing URL metadata, thumbnail, subtitle, chapter, and comments commands outside the Home capture flow.
- Added an explicit real-media clip verification script that generates a synthetic MP4 with FFmpeg, exercises copy plus H.264/H.265/VP9 profile reencode clipping through FetchDock's media command path, and checks error handling for missing input and invalid ranges.
- Added local video clip reencode profiles for H.264 balanced, H.265 compact, VP9 web, and custom FFmpeg options.
- Added a minimal local shot detection command and Tools action: `media_detect_shots` runs FFmpeg scene detection with metadata output, parses marker timestamps and scene scores, and shows the detected markers in Tools > Media tools.
- Added a minimal local waveform peaks command and Tools action: `media_generate_waveform_peaks` asks FFmpeg for mono PCM audio, computes min/max/rms peak buckets, writes a waveform cache JSON file, and previews peak bars in Tools > Media tools.
- Added a minimal Subtitle Workshop open/save subset: `subtitle_workshop_open` reads local SRT/VTT/ASS text, `subtitle_workshop_save` writes edited SRT/VTT/ASS text, and Tools > Media tools exposes an editor with source/output paths.
- Added UTF-8 BOM and UTF-16 BOM decoding for Subtitle Workshop open so BOM-marked SRT/VTT/ASS files can be loaded before saving edited text back as UTF-8.
- Added a minimal Subtitle Workshop find/replace subset with literal case-insensitive match counting and Replace all editing inside the local subtitle text editor.
- Made Subtitle Workshop find/replace cue-aware for SRT/VTT cue text and common ASS `Dialogue:` text fields while preserving plain-text fallback behavior.
- Added Subtitle Workshop Find next navigation that selects the next cue-aware match in the local editor and wraps at the end.
- Added an optional Subtitle Workshop Regex mode for find/replace with capture-group replacement and invalid-pattern feedback.
- Added a minimal Subtitle Workshop Auto fix action for SRT/VTT cue numbering, inverted timing, cue whitespace, and repeated blank-line cleanup.
- Added a minimal Subtitle Workshop timing shift subset that moves SRT/VTT timestamps by a millisecond offset and clamps negative results to zero.
- Added a minimal Subtitle Workshop two-point sync subset that linearly remaps SRT/VTT timestamps from two source/target millisecond calibration points.
- Extended the Subtitle Workshop timing helpers to common ASS `Dialogue:` timestamps while preserving centisecond precision.
- Added minimal ASS event `Format:` awareness for Subtitle Workshop helpers so find/replace edits only the declared `Text` field and timing tools shift only declared `Start`/`End` fields when ASS columns are reordered.
- Extended Subtitle Workshop Auto fix to ASS event `Format:` rows, trimming declared `Text` fields and swapping inverted declared `Start`/`End` fields without changing style columns.
- Added a minimal Subtitle Workshop waveform cue link: the editor parses the current SRT/VTT/ASS cue timing and highlights overlapping generated waveform peak bars.
- Extended the Subtitle Workshop waveform cue link so clicking a generated waveform peak selects the SRT/VTT/ASS cue covering that time.
- Linked shot markers into Subtitle Workshop: marker rows can select the covering or nearest SRT/VTT/ASS cue, and generated waveform bars indicate buckets containing shot markers.
- Added shot marker JSON export through `media_save_shot_markers` and the Tools > Media Save markers action.
- Extended the real FFmpeg media smoke to cover waveform cache generation and black-to-white shot marker detection.
- Extended the Tools > Media waveform preview to keep every generated peak bucket available in a horizontally scrollable bar strip instead of truncating the preview to the first buckets.
- Added a basic Tools > Media waveform Peak width control that adjusts generated peak bar density within readable bounds.
- Added selected waveform time feedback when a generated waveform bar is clicked in Tools > Media.
- Added a basic Tools > Media waveform Jump to time control that accepts seconds, `mm:ss`, or `hh:mm:ss`, clamps to media duration, and reuses subtitle cue selection at that time.
- Added selected-time highlighting for the generated waveform bucket that contains the active waveform time.
- Added a basic dependency status command and Settings page list for yt-dlp, FFmpeg, gallery-dl, torrent-engine, and Whisper detection.
- Added dependency tool path overrides with validation plus Settings page save/clear controls.
- Added short-timeout dependency version checks and Settings page version/error display.
- Added dependency install request plumbing that records a clear unsupported-auto-install error instead of pretending a missing tool was installed.
- Added Settings dependency install button busy-state feedback and status refresh after install requests.
- Added staged dependency SHA-256 verification: matching staged files are promoted to managed tool paths, while mismatches delete the bad file and persist an explicit error.
- Added a configured dependency artifact download path that writes `{ url, sha256 }` sources to staged files before verification.
- Added a Windows x64 yt-dlp built-in install source resolver using the official latest GitHub release and `SHA2-256SUMS`.
- Added a Windows x64 FFmpeg built-in install source resolver using the BtbN FFmpeg-Builds latest LGPL zip, `checksums.sha256`, and zip member extraction for `bin/ffmpeg.exe`.
- Added a Windows x64 gallery-dl built-in install source resolver using Codeberg latest release metadata cross-checked against the Scoop manifest URL and SHA-256.
- Added dependency install progress events and row-level Settings progress messages for install requests.
- Added managed dependency update requests that verify staged artifacts before replacing existing tools and keep the previous tool on verification failure.
- Added task-level User-Agent and Referer options for direct-file downloads.
- Added task-level and Downloads-default Proxy, Rate limit, Live from start, and concurrent fragments options for yt-dlp task planning.
- Added direct-file rate limit throttling for the built-in HTTP(S) downloader.
- Added task-level output directory picker, writable-path validation, persistence, and direct-file output routing.
- Added a basic `.part` file and `Range` request resume path for direct-file downloads.
- Added a SQLite-backed download task store with legacy JSON task import.
- Verified Windows portable mode at runtime with an executable-adjacent marker and local `data` directories.
- Fixed the Windows Rust/Tauri build path by supporting a locally extracted Windows SDK in the verification helper.



- Added direct-file proxy support for unauthenticated HTTP and SOCKS5 proxies in the built-in HTTP(S) downloader.
- Split default proxy, speed limit, User-Agent, Referer, live, and fragment controls into an independent Network settings panel.
- Added local Cookie bucket commands and a Settings > Cookies panel for paste/file import, rename, export, delete, and URL matching.
- Wired Cookie buckets into Home task creation and yt-dlp execution through persisted `cookie_bucket_id` plus `--cookies <bucket-file>`.
- Added local Channels tracking commands and a Channels page for persisted subscriptions, manual metadata checks, removal, and check history.
- Added persisted Appearance settings for language preference, theme, font scale, and interface density with immediate app-shell styling.
- Added a local plugin manifest registry with list/install/enable/disable/uninstall commands and a Plugins page wired to managed manifest state.
- Added a local `.torrent` metadata parser and Tools panel that read bencode info, file entries, total size, and trackers without starting a torrent download.
- Added a local magnet URI parser and Tools panel that extracts BTIH info hash, display name, trackers, and web seeds while keeping real network metadata/download work pending.
- Added a local reading library scanner and Tools panel for PDF, EPUB, CBZ, TXT, and HTML folders with filename-based title/author fallback.
- Added a local music library scanner and Tools panel for MP3, FLAC, M4A, OGG, and Opus folders with path-based artist/album/title fallback.
- Added a Manifest V3 browser extension scaffold with popup, options, error page, current-tab sending, page/link context menus, and deep-link fallback.
- Added a loopback-only desktop extension bridge on `127.0.0.1:17654` with `/health` and `/v1/extension/download` endpoints that create download tasks from extension payloads.
- Added Settings > Browser Extension status details for the unpacked extension folder, loopback bridge URL, and implemented bridge endpoints.
- Added Settings > Advanced diagnostics export controls with an explicit include-download-URLs privacy toggle.
- Wired selected Cookie buckets into the built-in direct-file downloader by converting matching Netscape cookie rows into a `Cookie` request header.
- Confirmed extension deep-link fallback lands in the existing desktop capture flow and can create a queued task from `fetchdock://capture?url=...`.
- Added a Telegram navigation page with a local auth-state gate plus `telegram_get_state`, `telegram_auth_start`, and `telegram_logout` placeholder commands that clearly report MTProto login is not wired yet.
- Added best-effort course remote outline extraction: `courses_probe` and `courses_import` now reuse yt-dlp metadata/flat-playlist probes to turn course-like URLs into lessons and a thumbnail attachment candidate when metadata is available, while falling back to an honest metadata-pending course candidate when dependencies, login, or platform extraction are unavailable.
- Added a Courses navigation page with `courses_probe`, `courses_import`, and `courses_list` course-library commands for the target course platforms.
