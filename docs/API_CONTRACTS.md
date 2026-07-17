# FetchDock API 合约

状态：draft
阶段：第一阶段规格盘点
范围：定义前端、Rust 后端、浏览器扩展、本地插件之间的通信协议。本文不包含任何外部产品源码或文案。

## 设计原则

- 所有命令和事件使用 JSON 可序列化结构。
- 每个结构包含 dschema_versiond，后续迁移时保持兼容。
- 前端不依赖外部工具 stdout/stderr 的原始格式，只消费 Rust 统一模型。
- 错误统一为 dAppErrord，不可返回裸字符串。
- 敏感信息默认只传引用 ID，不把 cookie、token、authorization header 明文暴露给 UI 或插件。
- Command 是请求/响应；Event 是状态广播；日志是增量事件 + 可分页查询。

## 近期合约补充
- 2026-07-17 First-phase Settings > AI loop：`settings_get_all` / `settings_update` / `settings_reset_section(ai)` 现在作为本里程碑的停止点合约，覆盖 UI 可编辑的 `whisper_model`、`whisper_language`、`whisper_task`、`subtitle_translate_enabled`、`grammar_cleanup_enabled` 五个既有字段。provider scope 仅只读展示；本合约不增加 cloud provider、API key、network call、AI workflow、Extension/Metadata/Plugin/Library/Music、release signing 或 packaging 范围。
- 2026-07-17 Appearance/theme/language capability catalog：新增只读本地 `appearance_get_capability_catalog` / `appearance_export_capability_catalog` commands、CLI `appearance-capability-catalog` / `export-appearance-capability-catalog`、TypeScript wrapper 和 Settings > Appearance capability catalog 控件。响应列出 appearance settings、appearance settings backup/restore、theme catalog、language catalog 的 commands、CLI aliases、desktop UI、setting fields、data files、supported outputs、sensitive fields、read/write/import/export/external-asset/text-copy/QA flags、verification flags、scope 和 limitation notes；导出写出 `kind=fetchdock.appearance_capability_catalog` envelope。该能力不修改 settings、不导入 backups、不复制 external theme/translation text、不包含 external assets，也不声明 visual contrast/full UI translation manual matrix 已完成。
- 2026-07-17 Settings/local-audit capability catalog：新增只读本地 `settings_get_capability_catalog` / `settings_export_capability_catalog` commands、CLI `settings-capability-catalog` / `export-settings-capability-catalog`、TypeScript wrapper 和 Settings > Advanced capability catalog 控件。响应列出 settings search、settings read/update、settings backups、settings reset、local audit summaries 的 commands、CLI aliases、desktop UI、setting sections、data files、settings fields、supported backup outputs、sensitive fields、settings read/write/import/export/reset/secret/OS side-effect flags、verification flags、scope 和 limitation notes；导出写出 `kind=fetchdock.settings_capability_catalog` envelope。该能力不读取或修改 settings values、不导入/导出 backup contents、不 reset settings、不注册 shortcuts、不轮询 channels、不执行 plugins、不读取 secret values，也不声明 settings roundtrip/OS integration manual matrix 已完成。
- 2026-07-17 Diagnostics/recovery capability catalog：新增只读本地 `app_get_diagnostics_capability_catalog` / `app_export_diagnostics_capability_catalog` commands、CLI `diagnostics-capability-catalog` / `export-diagnostics-capability-catalog`、TypeScript wrapper 和 Settings > Advanced capability catalog 控件。响应列出 minimal diagnostics export、diagnostics bundle、recovery manifest、local evidence snapshot、privacy status、diagnostics/log file inventory、local cleanup controls 的 commands、CLI aliases、desktop UI、data files、evidence fields、supported outputs、sensitive fields、diagnostics/log/url/secret/content/write/delete/settings/recovery/upload flags、verification flags、scope 和 limitation notes；导出写出 `kind=fetchdock.diagnostics_capability_catalog` envelope。该能力不读取 diagnostics files、download log bodies、download URLs、Cookie/Auth values、downloaded content、settings 或 partial files，不执行 recovery、不上传 diagnostics、不删除文件，也不声明 recovery E2E/privacy matrix/manual privacy review 已完成。
- 2026-07-17 Legal/third-party notice capability catalog：新增只读本地 `app_get_legal_capability_catalog` / `app_export_legal_capability_catalog` commands、CLI `legal-capability-catalog` / `export-legal-capability-catalog`、TypeScript wrapper 和 Legal/Settings > Advanced capability catalog 控件。响应列出 legal readiness、notice summary、notice inventory、notice draft、release document tracking 的 commands、CLI aliases、desktop UI、data files、notice fields、tracked documents、supported review outputs、sensitive fields、mutation/read/hash/final-notice/external-audit flags、verification flags、scope 和 limitation notes；导出写出 `kind=fetchdock.legal_capability_catalog` envelope。该能力不读取 dependency manifests、不 hash files、不生成最终 notices、不修改 legal files、不运行外部审计工具、不检查 dependency source text，也不声明 license/bundled/store notice clearance 或 manual legal matrix 已完成。
- 2026-07-17 AI capability catalog：新增只读本地 `ai_get_capability_catalog` / `ai_export_capability_catalog` commands、CLI `ai-capability-catalog` / `export-ai-capability-catalog`、TypeScript wrapper 和 Settings > AI capability catalog 控件。响应列出 provider scope、local assistance flags、local summary/export、Whisper subtitle generation、translate/grammar placeholders 的 commands、CLI aliases、desktop UI、data files、settings fields、supported providers/Whisper tasks、sensitive fields、Whisper/remote AI/media/prompt/API key flags、verification flags、scope 和 limitation notes；导出写出 `kind=fetchdock.ai_capability_catalog` envelope。该能力不执行 Whisper、不翻译字幕、不清理语法、不调用 remote providers、不读取 media files、不包含 prompts/API keys/transcripts/file bodies、不修改 AI settings，也不声明 Whisper/translate/grammar manual matrix 已完成。
- 2026-07-17 Update capability catalog：新增只读本地 `update_get_capability_catalog` / `update_export_capability_catalog` commands、CLI `update-capability-catalog` / `export-update-capability-catalog`、TypeScript wrapper 和 Settings > Advanced update capability catalog 控件。响应列出 manifest checks、settings backup/restore、local summary/export、background due-poll notification 的 commands、CLI aliases、desktop UI、data files、settings fields、supported manifest sources/check modes、sensitive fields、remote/local manifest/download/install/signature/notification flags、verification flags、scope 和 limitation notes；导出写出 `kind=fetchdock.update_capability_catalog` envelope。该能力不抓取 remote manifests、不读取 local manifests、不修改 settings、不下载 artifacts、不安装 updates、不验证 signatures、不替换 binaries、不发布 release files，也不声明 signed-update/rollback/packaged-update manual matrix 已完成。
- 2026-07-17 Release/Packaging capability catalog：新增只读本地 `app_get_release_capability_catalog` / `app_export_release_capability_catalog` commands、CLI `release-capability-catalog` / `export-release-capability-catalog`、TypeScript wrapper 和 Settings > Advanced release capability catalog 控件。响应列出 release gates、package summaries、release documents、legal/notices、update readiness 的 commands、CLI aliases、desktop UI、data files、evidence fields、supported gate statuses/package areas、sensitive fields、build/package/sign/publish/update flags、verification flags、scope 和 limitation notes；导出写出 `kind=fetchdock.release_capability_catalog` envelope。该能力不运行 build、不打包 installer、不签名/公证、不发布 artifacts、不安装 updates、不上传文件、不修改 release artifacts，也不声明 packaged app/signing/update-install manual matrix 已完成。
- 2026-07-17 Plugin capability catalog：新增只读本地 `plugins_get_capability_catalog` / `plugins_export_capability_catalog` commands、CLI `plugin-capability-catalog` / `export-plugin-capability-catalog`、TypeScript wrapper 和 Plugins/Settings capability catalog 控件。响应列出 manifest/preflight、registry state、marketplace registry、settings/data、command/event harness、trust/summary exports 的 commands、CLI aliases、desktop UI、data files、manifest fields、registry fields、supported plugin/preflight states、sensitive fields、mutation/import/delete/runtime/remote flags、signature/runtime/marketplace verification flags、scope 和 limitation notes；导出写出 `kind=fetchdock.plugin_capability_catalog` envelope。该能力不执行 dynamic plugin code、不读取/加载 dynamic libraries、不导入外部 registry、不修改 registry/settings/plugin data、不删除文件、不抓取 remote marketplaces，也不声明 signature/runtime/remote marketplace manual matrix 已完成。
- 2026-07-17 Torrent/P2P capability catalog：新增只读本地 `p2p_get_capability_catalog` / `p2p_export_capability_catalog` commands、CLI `p2p-capability-catalog` / `export-p2p-capability-catalog`、TypeScript wrapper 和 Tools > P2P tools capability catalog 控件。响应列出 torrent/magnet metadata drafts、P2P offer store、LAN send/receive、local summary/transfer panel 的 commands、CLI aliases、desktop UI、P2P surfaces、data files、task kinds、offer statuses、draft types、sensitive fields、tracker/DHT/relay/peer/file/mutation/task/listener/open flags、batch support、BitTorrent/LAN/NAT verification flags、scope 和 limitation notes；导出写出 `kind=fetchdock.p2p_capability_catalog` envelope。该能力不联系 trackers、DHT、relays 或 peers，不运行 BitTorrent engine，不读取 file bodies、不修改 offers、不创建 tasks、不启动 listeners、不打开 local files，也不声明 BitTorrent/LAN/NAT/relay/manual matrix 已完成。
- 2026-07-17 Telegram capability catalog：新增只读本地 `telegram_get_capability_catalog` / `telegram_export_capability_catalog` commands、CLI `telegram-capability-catalog` / `export-telegram-capability-catalog`、TypeScript wrapper 和 Telegram capability catalog 控件。响应列出 auth gate state、manifest chat browser、local search/sync status、media queue/clone、local media preview/copy 的 commands、CLI aliases、desktop UI、Telegram surfaces、data files、task kinds、chat/media kind sets、sensitive fields、remote-read/session/message/file/mutation/task/open flags、batch support、scope 和 limitation notes；导出写出 `kind=fetchdock.telegram_capability_catalog` envelope。该能力不执行 MTProto login、不同步远端 chats、不读取 message bodies、不下载远端 media、不包含 session secrets、media file bodies、downloaded content、account sessions 或 remote Telegram payloads，也不声明真实登录、远端同步、媒体下载或播放器 E2E/manual matrix 已完成。
- 2026-07-17 Courses capability catalog：新增只读本地 `courses_get_capability_catalog` / `courses_export_capability_catalog` commands、CLI `courses-capability-catalog` / `export-courses-capability-catalog`、TypeScript wrapper 和 Courses capability catalog 控件。响应列出 platform matrix/sample metadata、probe/import、manifest backup/restore、progress/notes、lesson/attachment queueing、local playback/file actions 和 library maintenance 的 commands、CLI aliases、desktop UI、course surfaces、data files、task kinds、sensitive fields、remote-read/Cookie/note/file/mutation/task/open flags、batch support、scope 和 limitation notes；导出写出 `kind=fetchdock.course_capability_catalog` envelope。该能力不执行平台登录、不抓取远端附件、不运行下载、不包含 Cookie values、Learning note bodies、downloaded files、account sessions 或 remote platform payloads，也不声明课程播放器、真实平台登录或远端附件抓取 E2E/manual matrix 已完成。
- 2026-07-17 Browser Extension capability catalog：新增只读本地 `extension_get_capability_catalog` / `extension_export_capability_catalog` commands、CLI `extension-capability-catalog` / `export-extension-capability-catalog`、TypeScript wrapper 和 Settings > Browser Extension capability catalog 控件。响应列出 loopback bridge/deep-link intake、pairing/profile metadata、options/blocked hosts、media sniffer/context actions、Cookie/Auth payload staging、package summary、release-safety review 的 commands、CLI aliases、desktop UI、extension surfaces、bridge endpoints、data files、sensitive fields、browser-storage/token/payload/auth/task/install/package/E2E flags、batch support、scope 和 limitation notes；导出写出 `kind=fetchdock.browser_extension_capability_catalog` envelope。该能力不读取 browser storage，不包含 pairing token values、Cookie payload contents、Authorization values、downloaded content 或 log bodies，不修改 extension state、不创建任务、不安装/运行/打包/签名扩展，也不声明 Chrome/Firefox E2E/manual matrix 已完成。
- 2026-07-17 Channels capability catalog：新增只读本地 `channels_get_capability_catalog` / `channels_export_capability_catalog` commands、CLI `channels-capability-catalog` / `export-channels-capability-catalog`、TypeScript wrapper 和 Channels capability catalog 控件。响应列出 subscription store、manual check/due poll、history store、history queue、notification state、settings backup、safe backup/local summary 的 commands、CLI aliases、desktop UI surfaces、data files、record fields、event names、source-url/export/mutation/history/task/polling flags、batch support、scope 和 limitation notes；导出写出 `kind=fetchdock.channels_capability_catalog` envelope。该能力不导出现有 subscription/history row values 或 source URL values，不读取 Cookie values、downloaded files 或 download log bodies，不修改频道状态、不轮询 feeds、不创建任务，也不声明 live feed/manual matrix 已完成。
- 2026-07-17 Cookie/Auth capability catalog：新增只读本地 `cookies_get_capability_catalog` / `cookies_export_capability_catalog` commands、CLI `cookies-capability-catalog` / `export-cookies-capability-catalog`、TypeScript wrapper 和 Settings > Cookies capability catalog 控件。响应列出 Cookie bucket storage/import/export、URL matching、health tests、extension Cookie/Auth payload staging、Twitter/X fallback、Bilibili Cookie state 和 safe summary/export 的 commands、CLI aliases、desktop UI surfaces、data files、sensitive fields、secret export flags、mutation flags、network-check flag、batch support、scope 和 limitation notes；导出写出 `kind=fetchdock.cookie_auth_capability_catalog` envelope。该能力不读取 Cookie values、Authorization values、pairing tokens、staged payload bodies 或 browser storage，不修改 Cookie/Auth 状态、不执行 network checks，也不声明 live-login/manual matrix 已完成。
- 2026-07-17 Downloads filter catalog：新增只读本地 `downloads_get_filter_catalog` / `downloads_export_filter_catalog` commands、CLI `downloads-filter-catalog` / `export-downloads-filter-catalog`、TypeScript wrapper 和 Settings > Downloads Download filter catalog 控件。响应列出 view mode、status、task kind、platform、text query、date range、operational filters、sort modes 和 filter presets 的 desktop UI、CLI flags、task fields、preset fields、applies-to views、copy/export/mutates-task flags、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_filter_catalog` envelope。该能力不调用 `downloads_list`、不读取或列出现有任务、不导出 visible task values、source URLs、output paths、download log bodies、Cookie/Auth values，不修改任务、不重排队列、不启动下载，也不声明 real filter/manual matrix 已完成。

- 2026-07-17 App infrastructure capability catalog：新增只读本地 `app_get_infrastructure_capability_catalog` / `app_export_infrastructure_capability_catalog` commands、CLI `infrastructure-catalog` / `export-infrastructure-catalog`、TypeScript wrapper 和 Settings > Infrastructure catalog 控件。响应列出 desktop window shell、route restore、toast bridge、tray shell、autostart、quick capture global shortcut、deep link scheme、portable mode 和 path inventory 的 commands、CLI aliases、desktop UI surfaces、config files、events、runtime scope、desktop-runtime/state-mutation/OS-verification flags 和 limitation notes；导出写出 `kind=fetchdock.app_infrastructure_capability_catalog` envelope。该能力不打开窗口、不点击托盘、不注册或注销快捷键、不修改 autostart、不调用 deep link、不启动下载，也不声明 real OS shell/manual matrix 已完成。

- 2026-07-17 Downloads inheritance catalog：新增只读本地 `downloads_get_inheritance_catalog` / `downloads_export_inheritance_catalog` commands、CLI `downloads-inheritance-catalog` / `export-downloads-inheritance-catalog`、TypeScript wrapper 和 Settings > Downloads Download inheritance catalog 控件。响应列出 default output directory、filename template、skip existing、quality/audio、subtitles、SponsorBlock/metadata、network defaults、custom yt-dlp args 和 Cookie/Auth refs 的 commands、CLI aliases、desktop UI surfaces、settings fields、task fields、task kinds、adapter support、single/batch inheritance flags、task override flags、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_inheritance_catalog` envelope。该能力不读取或列出现有任务、不导出 setting values、source URLs、output paths、Cookie/Auth values，不修改 settings/tasks、不启动下载，也不声明 real inheritance/manual matrix 已完成。

- 2026-07-17 Downloads runtime catalog：新增只读本地 `downloads_get_runtime_catalog` / `downloads_export_runtime_catalog` commands、CLI `downloads-runtime-catalog` / `export-downloads-runtime-catalog`、TypeScript wrapper 和 Settings > Downloads Download runtime catalog 控件。响应列出 direct-file HTTP、yt-dlp、gallery-dl、FFmpeg media tools、torrent metadata、P2P receive、Whisper subtitles 和 dependency resolver 的 commands、CLI aliases、desktop UI surfaces、task kinds、dependency ids、events、logs/output/Cookie/Auth/external-process/download flags、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_runtime_catalog` envelope。该能力不读取或列出现有任务、不导出 source URLs、output paths、downloaded/log file bodies、Cookie/Auth values，不执行外部工具、不启动下载，也不声明 real dependency/download/manual matrix 已完成。

- 2026-07-17 Downloads privacy catalog：新增只读本地 `downloads_get_privacy_catalog` / `downloads_export_privacy_catalog` commands、CLI `downloads-privacy-catalog` / `export-downloads-privacy-catalog`、TypeScript wrapper 和 Settings > Downloads Download privacy catalog 控件。响应列出 task source URLs、output paths、Cookie values、Authorization values、download logs、downloaded file bodies、diagnostics exports 和 clipboard review helpers 的 commands、CLI aliases、desktop UI surfaces、sensitive fields、default handling、user controls、value/redaction/export flags、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_privacy_catalog` envelope。该能力不读取或列出现有任务、不导出 source URLs、output paths、downloaded/log file bodies、Cookie/Auth values，不修改任务、不启动下载，也不声明 real privacy/manual matrix 已完成。

- 2026-07-17 Downloads history catalog：新增只读本地 `downloads_get_history_catalog` / `downloads_export_history_catalog` commands、CLI `downloads-history-catalog` / `export-downloads-history-catalog`、TypeScript wrapper 和 Settings > Downloads Download history catalog 控件。响应列出 Queue/History views、history filters、archive/restore、clear completed、clear archived、task backup/restore 和 local summary 的 commands、CLI aliases、desktop UI surfaces、statuses、task/settings fields、events、read/export/source-url/mutate/delete/download flags、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_history_catalog` envelope。该能力不读取或列出现有任务、不导出 task rows、source URLs、output paths、downloaded file bodies、log bodies、Cookie/Auth values，不删除记录、不修改任务、不启动下载，也不声明 real history/manual matrix 已完成。

- 2026-07-17 Downloads artifact catalog：新增只读本地 `downloads_get_artifact_catalog` / `downloads_export_artifact_catalog` commands、CLI `downloads-artifact-catalog` / `export-downloads-artifact-catalog`、TypeScript wrapper 和 Settings > Downloads Download artifact catalog 控件。响应列出 primary download、partial download、subtitle sidecar、thumbnail、info JSON、comments/chapters/live chat sidecars、clip/transcode derived media、shot/waveform analysis 和 Whisper subtitles 的 commands、CLI aliases、desktop UI surfaces、artifact roles/extensions、task/output fields、producer、read/write/delete/mutate/download flags、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_artifact_catalog` envelope。该能力不读取或列出现有任务、不导出 artifact paths、source URLs、downloaded/sidecar/log file bodies、Cookie/Auth values，不删除产物、不修改任务、不启动下载，也不声明 real artifact/manual matrix 已完成。

- 2026-07-17 Downloads output catalog：新增只读本地 `downloads_get_output_catalog` / `downloads_export_output_catalog` commands、CLI `downloads-output-catalog` / `export-downloads-output-catalog`、TypeScript wrapper 和 Settings > Downloads Download output catalog 控件。响应列出 default output directory、organize by platform、filename template、skip existing output、task output record、open/reveal output 和 task delete keeps output 的 commands、CLI aliases、desktop UI surfaces、task/settings fields、path/file read-write/open/reveal/delete flags、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_output_catalog` envelope。该能力不读取或列出现有任务、不导出 output paths、source URLs、downloaded file bodies、log bodies、Cookie/Auth values，不打开或定位路径、不删除输出文件、不修改任务、不启动下载，也不声明 real output/manual matrix 已完成。

- 2026-07-17 Downloads source catalog：新增只读本地 `downloads_get_source_catalog` / `downloads_export_source_catalog` commands、CLI `downloads-source-catalog` / `export-downloads-source-catalog`、TypeScript wrapper 和 Settings > Downloads Download source catalog 控件。响应列出 Home URL、batch text import、browser extension bridge、metadata/playlist/gallery tools、channel history、course lessons、Telegram manifest、torrent/magnet 和 P2P share 的 commands、CLI aliases、desktop UI surfaces、task kinds、source reference fields、batch/cookie/auth/probe/queue/runtime-URL flags、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_source_catalog` envelope。该能力不读取或列出现有任务、不导出 source URLs、file/log bodies、Cookie/Auth values、不 probe remote、不 queue tasks、不启动下载，也不声明 real source matrix 已完成。

- 2026-07-17 Downloads retry catalog：新增只读本地 `downloads_get_retry_catalog` / `downloads_export_retry_catalog` commands、CLI `downloads-retry-catalog` / `export-downloads-retry-catalog`、TypeScript wrapper 和 Settings > Downloads Download retry catalog 控件。响应列出 automatic transient retry、manual retry、resume without retry increment、non-retryable failure record、pause/cancel interruption exclusion 的 commands、CLI aliases、desktop UI surfaces、task fields、error categories、retry delays、retry_count/error-state/scheduler flags、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_retry_catalog` envelope。该能力不读取或导出现有 task values、task error messages、task source URLs、file/log bodies、Cookie/Auth values、不 mutate tasks、不启动下载，也不声明 real retry matrix 已完成。

- 2026-07-17 Downloads queue catalog：新增只读本地 `downloads_get_queue_catalog` / `downloads_export_queue_catalog` commands、CLI `downloads-queue-catalog` / `export-downloads-queue-catalog`、TypeScript wrapper 和 Settings > Downloads Download queue catalog 控件。响应列出 task queue create、scheduler activation、manual start、pause/cancel、resume/retry、reorder、concurrency settings 和 restart recovery 的 commands、CLI aliases、desktop UI surfaces、task/settings fields、events、read/mutate/start/stop/order flags、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_queue_catalog` envelope。该能力不读取或列出现有任务、不导出 task source URLs、file/log bodies、Cookie/Auth values、不 mutate tasks、不启动或停止 worker、不执行下载，也不声明 real scheduler matrix 已完成。

- 2026-07-17 Downloads event catalog：新增只读本地 `downloads_get_event_catalog` / `downloads_export_event_catalog` commands、CLI `downloads-event-catalog` / `export-downloads-event-catalog`、TypeScript wrapper 和 Settings > Downloads Download event catalog 控件。响应列出 `download:created`、`download:state`、`download:progress`、`download:completed`、`download:failed`、`downloads:list_changed` 和 planned `download:log` 的 payload shape、emitters、frontend consumers、task/source/output/log/body/privacy flags 和 limitation notes；导出写出 `kind=fetchdock.downloads_event_catalog` envelope。该能力不发事件、不读取或列出任务、不读取日志、不导出 file/log bodies、不导出 Cookie/Auth values、不 mutate tasks、不启动下载，也不声明 real event matrix 已完成。

- 2026-07-17 Downloads log catalog：新增只读本地 `downloads_get_log_catalog` / `downloads_export_log_catalog` commands、CLI `downloads-log-catalog` / `export-downloads-log-catalog`、TypeScript wrapper 和 Settings > Downloads Download log catalog 控件。响应列出 log file inventory、task log paged reader、scoped log file read、scoped log delete、clear logs、runtime append 的 commands、CLI aliases、desktop UI surfaces、read/delete/write flags、pagination/search support、scope 和 limitation notes；导出写出 `kind=fetchdock.downloads_log_catalog` envelope。该能力不列出现有日志、不读取或导出 log bodies、不删除日志、不写日志、不读取 task values/source URLs/Cookie/Auth values、不 mutate tasks、不启动下载，也不声明 real log matrix 已完成。

- 2026-07-17 Downloads cleanup catalog：新增只读本地 `downloads_get_cleanup_catalog` / `downloads_export_cleanup_catalog` commands、CLI `downloads-cleanup-catalog` / `export-downloads-cleanup-catalog`、TypeScript wrapper 和 Settings > Downloads Download cleanup catalog 控件。响应列出 completed task cleanup、archived retention cleanup、visible task delete、partial download cleanup、diagnostics/log cleanup 的 command、CLI aliases、settings fields、scope、confirmation requirement、events、task-record/output/partial-file deletion behavior 和 limitation notes；导出写出 `kind=fetchdock.downloads_cleanup_catalog` envelope。该能力不读取或导出现有 task values、task source URLs、downloaded file bodies、log bodies、Cookie/Auth values，不执行 cleanup、不删除文件、不 mutate tasks、不启动下载，也不声明 real cleanup matrix 已完成。

- 2026-07-17 Downloads integrity catalog：新增只读本地 `downloads_get_integrity_catalog` / `downloads_export_integrity_catalog` commands、CLI `downloads-integrity-catalog` / `export-downloads-integrity-catalog`、TypeScript wrapper 和 Settings > Downloads Download integrity catalog 控件。响应列出 expected SHA-256 input、single-file completion verification、P2P expected hash inherit、UI integrity review、task backup integrity metadata 的 task field、CLI flags、applies-to kinds、metadata write flag、completion file-read flag、failure behavior 和 limitation notes；导出写出 `kind=fetchdock.downloads_integrity_catalog` envelope。该能力不读取或导出现有 task values、task source URLs、downloaded file bodies、log bodies、Cookie/Auth values，不计算 hash、不启动下载、不 mutate tasks，也不声明 real-file matrix 已完成。

- 2026-07-17 Downloads error catalog：新增只读本地 `downloads_get_error_catalog` / `downloads_export_error_catalog` commands、CLI `downloads-error-catalog` / `export-downloads-error-catalog`、TypeScript wrapper 和 Settings > Downloads Download error catalog 控件。响应列出 network、rate_limited、auth_required、permission_denied、not_found、unsupported_url、path_invalid、dependency_missing、dependency_failed、internal 的 code、label、retryable default、auto-retry support、max retry count、retry delay seconds、sample match hints、user action、backend hints 和 limitation notes；导出写出 `kind=fetchdock.downloads_error_catalog` envelope。该能力不读取或导出现有 task values、task error messages、task source URLs、downloaded file bodies、log bodies、Cookie/Auth values，不启动下载、不 mutate tasks、不执行 retry/backoff，也不声明 real failure matrix 已完成。

- 2026-07-17 Downloads status catalog：新增只读本地 `downloads_get_status_catalog` / `downloads_export_status_catalog` commands、CLI `downloads-status-catalog` / `export-downloads-status-catalog`、TypeScript wrapper 和 Settings > Downloads Download status catalog 控件。响应列出 queued、active、paused、completed、failed、canceled、archived 的 label、queue/history visibility、terminal/active runtime flags、allowed actions、bulk actions、next statuses、event names 和 limitation notes；导出写出 `kind=fetchdock.downloads_status_catalog` envelope。该能力不读取或导出现有 task values、task source URLs、downloaded file bodies、log bodies、Cookie/Auth values，不启动下载、不 mutate tasks，也不声明 real runtime transition matrix 已完成。

- 2026-07-17 Downloads option catalog：新增只读本地 `downloads_get_option_catalog` / `downloads_export_option_catalog` commands、CLI `downloads-option-catalog` / `export-downloads-option-catalog`、TypeScript wrapper 和 Settings > Downloads Download option catalog 控件。响应列出 quality、audio_format、clip_range、subtitles、SponsorBlock、metadata、output_dir/output_path、filename_template、skip_existing、User-Agent、Referer、Proxy、rate_limit、live_from_start、concurrent_fragments、custom_ytdlp_args、Cookie/Auth refs、thumbnail_url、expected_sha256 和 run_after_active_slot 的 task/default/UI/CLI/adapter support flags、field mapping、CLI flags、value hints 和 limitation notes；导出写出 `kind=fetchdock.downloads_option_catalog` envelope。该能力不读取或导出现有 task values、task source URLs、downloaded file bodies、log bodies、Cookie/Auth values，不启动下载、不执行 yt-dlp/FFmpeg/gallery-dl，也不声明 real option matrix 已完成。

- 2026-07-17 Downloads kind catalog：新增只读本地 `downloads_get_kind_catalog` / `downloads_export_kind_catalog` commands、CLI `downloads-kind-catalog` / `export-downloads-kind-catalog`、TypeScript wrapper 和 Settings > Downloads Download kind catalog 控件。响应列出 video、playlist、audio、image、subtitles_only、pdf、book、webpage、telegram_media、course_lesson、generic、torrent、p2p 的 alias、local create/queue/UI/CLI/extension/local-summary support flags、execution backend、dependency/source hints 和 limitation notes；导出写出 `kind=fetchdock.downloads_kind_catalog` envelope。该能力不读取或导出 task source URLs、downloaded file bodies、log bodies、Cookie/Auth values，不启动下载、不探测 remote sources，也不声明 manual matrix 已完成。

- 2026-07-17 Music format catalog：新增只读本地 `music_get_format_catalog` / `music_export_format_catalog` commands、CLI `music-format-catalog` / `export-music-format-catalog`、TypeScript wrapper 和 Tools > Local music library Music format catalog 控件。响应列出 MP3/FLAC/M4A/OGG/Opus 的 extension、scan/metadata/embedded metadata/sidecar metadata/cover/embedded cover/queue/lyrics/playlist/playback stats/export support flags 和 limitation notes；导出写出 `kind=fetchdock.music_format_catalog` envelope。该能力不读取或导出 audio file bodies、不验证 playback quality、不连接 external music services，也不声明 manual player matrix 已完成。

- 2026-07-17 Reader format catalog：新增只读本地 `library_get_format_catalog` / `library_export_format_catalog` commands、CLI `library-format-catalog` / `export-library-format-catalog`、TypeScript wrapper 和 Tools > Local reading library Reader format catalog 控件。响应列出 PDF/EPUB/CBZ/TXT/HTML/HTM 的 extension、scan/metadata/cover/bounded preview/reading state/annotation/export support flags 和 limitation notes；导出写出 `kind=fetchdock.library_format_catalog` envelope。该能力不读取源文档正文、不导出书籍内容、不验证完整 renderer，也不声明 manual reader matrix 已完成。

- 2026-07-17 Appearance language catalog：新增只读本地 `appearance_get_language_catalog` / `appearance_export_language_catalog` commands、CLI `language-catalog` / `export-language-catalog`、TypeScript wrapper 和 Settings > Appearance Language catalog 控件。响应包含当前 language、9 个本地 language id/label/native label/text direction、shell dictionary key count 和 originality review notes；导出写出 `kind=fetchdock.appearance.language_catalog` envelope。该能力不复制外部 translation files/product copy，不包含 extension locale packs、plugin runtime i18n、下载内容或 Cookie/Auth values，也不执行 full UI string extraction、linguistic QA 或手动 locale 验收。

- 2026-07-17 Appearance theme catalog：新增只读本地 `appearance_get_theme_catalog` / `appearance_export_theme_catalog` commands、CLI `theme-catalog` / `export-theme-catalog`、TypeScript wrapper 和 Settings > Appearance Theme catalog 控件。响应包含当前 theme/language、14 个本地 theme id/label/CSS class/category、9 个 language id、density/font-scale bounds 和 originality review notes；导出写出 `kind=fetchdock.appearance.theme_catalog` envelope。该能力不复制外部 theme files/assets/screenshots/logos/text，不读取下载内容、Cookie/Auth values，也不执行 visual QA、contrast measurement 或手动主题验收。

- 2026-07-17 Music lyrics sidecar backup：新增显式本地 `music_export_lyrics` / `music_import_lyrics` commands、CLI `export-music-lyrics` / `import-music-lyrics` 和 Tools > Local music library lyrics JSON backup Export/Import 控件。导出写出 `kind=fetchdock.music_lyrics` envelope，只包含一首本地 sidecar lyric 的 `track_path`、`lyrics_path`、`format`、`content` 和 line count；导入接受 envelope、`lyrics`、`item` 或 raw lyrics entry，并复用现有 `music_save_lyrics` 校验写回用户指定或备份内 track 的 `.lrc` / `.txt` / `.srt` / `.vtt` sidecar。该能力不复制 audio file bodies、catalog folders、queue、playlists、playback history、player settings、Cookie/Auth values 或外部 lyrics provider 数据，也不播放音频、不修改队列、不连接外部服务。

- 2026-07-17 Network settings backup：新增显式本地 `network_export_settings` / `network_import_settings` commands、CLI `export-network-settings` / `import-network-settings` 和 Settings > Network JSON backup Export/Import/Open/Reveal 控件。导出写出 `kind=fetchdock_network_settings` envelope，只包含本地网络默认项：User-Agent、Referer、Proxy、Rate limit、Live from start 和 Fragments；不写出 task source URLs、Cookie/Auth values、downloaded file bodies、diagnostics bodies、download log bodies 或 proxy connectivity results。导入接受 envelope、`settings`、`network` 或 raw network defaults object，经 sanitizer 写回 `data/config/downloads.json` 中的网络默认项，只影响未来任务继承，不验证实时连通性、不创建或修改下载任务。

- 2026-07-17 Downloads filter preset backup：新增显式本地 `downloads_export_filter_presets` / `downloads_import_filter_presets` commands、CLI `export-download-filter-presets` / `import-download-filter-presets` 和 Downloads 页 filter preset Export/Import 控件。导出写出 `kind=fetchdock.download_filter_presets` envelope，只包含 preset id/name/view/status/kind/platform/operational/query/date/sort metadata、`storage_key` 和 selected preset id；不写出 task source URLs、task records、downloaded file bodies、diagnostics bodies、download log bodies、Cookie values 或 Authorization values。导入接受 envelope、`items` 或 raw preset array，返回清洗后的 preset metadata 给前端按 name 合并到 localStorage，不创建、启动、暂停、恢复、重试、取消、删除或校验下载任务。

- 2026-07-17 Browser Extension pairing metadata backup：新增显式本地 `extension_export_pairing` / `extension_import_pairing` commands、CLI `export-extension-pairing` / `import-extension-pairing` 和 Settings > Browser Extension Pairing token metadata Export/Import 控件。导出写出 `kind=fetchdock_browser_extension_pairing_metadata` envelope，只包含 paired flag、label、created/expires/revoked timestamps 等 metadata；不写出 pairing token value、browser storage、Cookie/Auth payload contents 或 downloaded content。导入接受 envelope、`pairing_metadata` 或 raw metadata object，写回本地 `data/extension/pairing.json` 时永远清空 token 并恢复为 unpaired，曾 paired 的备份需要重新创建 token。

- 2026-07-16 Learning daily goal backup：新增显式本地 `learning_export_daily_goal` / `learning_import_daily_goal` commands、CLI `export-daily-goal` / `import-daily-goal`、TypeScript wrapper、命令面板关键词和 Learning dashboard Daily goal JSON Export/Import 控件。导出写出 `kind=fetchdock.learning_daily_goal` envelope，只包含本地每日专注目标分钟数；导入接受 envelope、`daily_goal`/`goal` 或 raw goal object，经 sanitizer 限制到 1-1440 分钟并刷新 dashboard。该能力不导出 notes、review answers、Pomodoro sessions、course/reader/music activity、source URLs、Cookie/Auth values 或下载内容，也不会启动或更新计时器。

- 2026-07-16 Cookie bucket backup：新增显式本地 `cookies_export_buckets` / `cookies_import_buckets` commands、CLI `export-cookie-buckets` / `import-cookie-buckets`、TypeScript wrapper、命令面板关键词和 Settings > Cookies Cookie bucket backup Export/Import 控件。导出写出 `kind=fetchdock.cookie_buckets` envelope，包含恢复 managed Cookie bucket 所需的 bucket metadata 与 Cookie row values；不嵌入 Authorization header values、staged extension payload bodies、browser storage、pairing token、keychain items 或 live login session。导入接受 envelope 或 raw entry array，按 bucket id 合并并跳过重复项，写入本地 `.cookies.txt` managed copy，不测试账号、不访问网站、不启动下载。
- 2026-07-16 Downloads task queue backup：新增显式本地 `downloads_export_tasks` / `downloads_import_tasks` commands、CLI `export-download-tasks` / `import-download-tasks`、TypeScript wrapper、命令面板关键词和 Settings > Downloads task backup Export/Import 控件。导出写出 `kind=fetchdock.download_tasks` envelope，包含恢复队列所需的 task metadata 与 source URL；不嵌入已下载文件正文、download log 正文、Cookie 值或 Authorization 值。导入接受 envelope 或 raw task array，按 task id 合并并跳过重复项，active 任务降级为 paused、清空 run-after-active-slot，不启动、恢复、重试或校验下载。
- 2026-07-16 Auth settings safe backup：新增显式本地 `auth_export_settings` / `auth_import_settings` commands、CLI `export-auth-settings` / `import-auth-settings` 和 Settings > Cookies Auth safe JSON Export/Import 控件。导出写出 `kind=fetchdock_auth_settings_public` envelope，只包含 `AuthSettingsPublic` 中的 Twitter/X fallback enabled/header-set/preview/updated metadata；导入接受 envelope、`auth` 或 raw public settings object，只恢复可公开状态，不写入或恢复 manual Cookie header 明文。若导入文件显示曾有 header，但当前设备没有保存 header，fallback 会保持禁用并返回 review note。
- 2026-07-16 Browser Extension options backup：新增显式本地 `extension_export_options` / `extension_import_options` commands、CLI `export-extension-options` / `import-extension-options` 和 Settings > Browser Extension Options JSON Export/Import 控件。导出写出 `kind=fetchdock_browser_extension_options` envelope；导入接受 envelope、`settings` 或 raw options object，并经既有 extension bridge URL、discovery ports 与 blocked hosts sanitizer 写回本地 `data/extension/options.json`。该能力不导出 pairing token 值、Cookie/Auth payload 内容、browser storage、下载内容，也不安装或运行浏览器扩展。
- 2026-07-16 Reader preview：前端打开 CBZ/EPUB 后会根据本地 reading-state progress percent 选择当前 page/spine，并在缺少缓存时调用既有 dlibrary_extract_cbz_page_previewd 或 dlibrary_extract_epub_text_previewd。该行为不新增 command shape，不读取 Cookie/Auth/下载内容，也不代表完整 CBZ/EPUB renderer 已完成。
- 2026-07-16 Learning note review card：前端可把已加载 dLearningNoted 预填或直接保存为本地 dSpacedReviewCardd，复用既有 dspaced_review_cards_saved 请求 shape；prompt 来自 note title，answer 为压缩并截断的 note body 摘要，note_id/source_url/tags 复用 note metadata。该行为不新增 IPC command、不实现 Anki bridge、不远端同步，也不导出 review answer 内容到 metadata summary。
- 2026-07-16 Reader bookmark note：前端可把当前书签草稿或已保存 dLibraryBookmarkd 转成本地 dLearningNoted，复用既有 dlearning_notes_saved / dlearning_notes_saved 请求 shape；body 只包含本地 source path、format、progress percent 和 bookmark label，tags 包含 dreading/bookmark/<format>d。该行为不新增 reader command、不读取额外文档正文、不写 HTTP-only dsource_urld，也不实现 Anki bridge。
- 2026-07-16 Reader settings backup：新增显式本地 dlibrary_export_reader_settingsd / dlibrary_import_reader_settingsd commands、CLI dexport-reader-settingsd / dimport-reader-settingsd 和 Tools 阅读预览 Reader settings JSON Export/Import 控件。导出写出 dkind=fetchdock.reader_settingsd envelope；导入接受 envelope 或 raw settings object，并经既有 reader settings sanitizer 写回本地状态。该能力不复制书籍文件、catalog、reading-state、Learning notes、annotations 或下载内容。
- 2026-07-16 Learning spaced review：新增本地 dspaced_review_cards_listd / dspaced_review_cards_save / dspaced_review_cards_reviewd / dspaced_review_cards_delete / dspaced_review_cards_delete_manyd / dspaced_review_cards_cleard / dspaced_review_cards_exportd / dspaced_review_cards_importd commands，维护 ddata/learning/spaced-review-cards.jsond。响应使用 dSpacedReviewCardd，包含 didd、dnote_idd、dpromptd、danswerd、dtagsd、deased、dinterval_daysd、ddue_atd、dlast_reviewed_atd、dreview_countd、dlapse_countd、dsource_urld、dcreated_atd 和 dupdated_atd。dreviewd 只接受 dagain/hard/good/easyd 本地评分并更新 due/ease/interval counters；dexport/importd 使用 FetchDock JSON envelope，支持 ids 筛选、Save/Open/Reveal UI 和 CLI dimport-review-cardsd / dexport-review-cardsd；该子集不实现 Anki bridge、远端同步、插件访问或 review answer 的 metadata summary export。
- 2026-07-16 Plugin settings backup：新增显式本地 dplugins_export_settingsd / dplugins_import_settingsd commands、CLI dexport-plugin-settingsd / dimport-plugin-settingsd 和 Plugins 页面 Settings JSON Export/Import 控件。导出写出 dkind=fetchdock.plugin_settingsd envelope，包含已安装插件的 settings object；导入接受 envelope 或 raw settings object，只恢复仍已安装 manifest 的 object settings，并跳过缺失 manifest/非 object settings。该能力不复制 plugin data files、manifest、marketplace、logs，不执行动态库、不验签、不授予权限，也不会被 diagnostics bundle 自动包含。
- 2026-07-16 Music playback history backup：新增显式本地 dmusic_export_playback_historyd / dmusic_import_playback_historyd commands、CLI dexport-music-playbackd / dimport-music-playbackd 和 Tools > Local music library Playback JSON Export/Import 控件。导出写出 dkind=fetchdock.music_playback_historyd envelope；导入接受 envelope 或 raw event array，清洗本地播放事件并截断到 5000 条。该能力不复制音频文件、catalog folders、queue、playlists、lyrics、settings 或外部音乐服务数据。
- 2026-07-16 Music queue backup：新增显式本地 dmusic_export_queued / dmusic_import_queued commands、CLI dexport-music-queued / dimport-music-queued 和 Tools > Local music library Queue JSON backup 控件。导出写出 dkind=fetchdock.music_queued envelope；导入接受 envelope 或 raw queue state，并经既有 queue save sanitizer 写回本地 queue。该能力不复制音频文件、catalog folders、playlists、lyrics、playback history、settings 或外部音乐服务数据。
- 2026-07-16 Music settings backup：新增显式本地 dmusic_export_settingsd / dmusic_import_settingsd commands、CLI dexport-music-settingsd / dimport-music-settingsd 和 Tools > Local music library Settings JSON Export/Import 控件。导出写出 dkind=fetchdock.music_settingsd envelope，包含 sleep timer、equalizer 和 Discord Presence metadata；导入接受 envelope 或 raw settings object，并经现有 sanitizer/write path 恢复本地设置。该能力不复制音频文件、catalog folders、queue、playlists、lyrics、playback history、不执行 Discord IPC，也不连接外部音乐服务。
- 2026-07-16 App shell / Update settings backup：新增显式本地 dapp_export_shell_settingsd / dapp_import_shell_settingsd 和 dapp_export_update_settingsd / dapp_import_update_settingsd commands、CLI dexport-app-shell-settingsd / dimport-app-shell-settingsd / dexport-update-settingsd / dimport-update-settingsd，以及 Settings UI JSON Export/Import 控件。导出写出 dkind=fetchdock_app_shell_settingsd 或 dkind=fetchdock_update_settingsd envelope；导入接受 envelope 或 raw settings object，并经现有 sanitizer/write path 恢复本地状态。App shell 导入会按现有 runtime shortcut handler 重新应用 quick-capture shortcut；Update settings 导入只更新本地偏好，不下载、验签、安装或替换应用二进制。
- 2026-07-16 Dependency tool settings backup：新增显式本地 dtools_export_settingsd / dtools_import_settingsd commands、CLI dexport-tool-settingsd / dimport-tool-settingsd 和 Settings > Dependencies Tool settings JSON Export/Import 控件。导出写出 dkind=fetchdock_tool_settingsd envelope；导入接受 envelope 或 raw dToolSettingsd object，过滤 unsupported tool id、无效 executable path 和无效 download source/hash/archive-member 后写回 ddata/config/tools.jsond。该能力不复制 managed dependency files、不下载/安装/更新/执行工具、不读取日志正文或下载内容。

## 通用类型

### Scalar aliases

| 类型 | 表达 | 说明 |
| --- | --- | --- |
| dIdd | string | ULID 或 UUID；前端不解析结构 |
| dIsoDateTimed | string | ISO 8601 UTC |
| dPathStringd | string | 系统路径；前端只展示，不手动拼接 |
| dUrlStringd | string | 经过解析校验的 URL |
| dBytesd | number | 非负整数 |
| dMillisd | number | 非负整数 |
| dPercentd | number | 0-100；未知进度为 null |

### ApiResult

```ts
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError };
```
Tauri command 可直接返回 dResult<T, AppError>d；前端适配层统一转为 dApiResult<T>d。

### AppError

```ts
type ErrorCategory =
  | "network"
  | "rate_limited"
  | "auth_required"
  | "permission_denied"
  | "not_found"
  | "unsupported_url"
  | "format_unavailable"
  | "path_invalid"
  | "dependency_missing"
  | "dependency_failed"
  | "plugin_incompatible"
  | "plugin_failed"
  | "validation"
  | "internal";

interface AppError {
  schema_version: 1;
  code: string;
  category: ErrorCategory;
  message: string;
  retryable: boolean;
  user_action?: string;
  details_id?: string;
  field_errors?: Record<string, string>;
}
```
dmessaged 必须是 FetchDock 自有文案，不复制任何外部错误文案。ddetails_idd 用于关联日志和诊断，不直接暴露敏感细节。

## 数据模型

### AppStatus

```ts
interface AppStatus {
  schema_version: 1;
  app_version: string;
  platform: "windows" | "macos" | "linux";
  arch: string;
  mode: "regular" | "portable";
  paths: {
    config_dir: PathString;
    data_dir: PathString;
    cache_dir: PathString;
    downloads_dir: PathString;
    plugins_dir: PathString;
    dependencies_dir: PathString;
    logs_dir: PathString;
  };
  database_migration: number;
}
```
### Settings

```ts
interface Settings {
  schema_version: 1;
  downloads: DownloadSettings;
  appearance: AppearanceSettings;
  network: NetworkSettings;
  cookies: CookieSettings;
  plugins: PluginSettings;
  extension: ExtensionSettings;
  dependencies: DependencySettings;
  advanced: AdvancedSettings;
  ai?: AiSettings;
}

interface DownloadSettings {
  default_output_dir: PathString;
  organize_by_platform: boolean;
  filename_template: string;
  skip_existing: boolean;
  max_concurrency: number;
  default_quality: string;
  default_audio_format: "mp3" | "m4a" | "opus" | "flac" | "wav";
  default_user_agent?: string;
  default_referer?: string;
  default_proxy?: string;
  default_rate_limit?: string;
  default_live_from_start: boolean;
  default_concurrent_fragments?: number;
  subtitles: SubtitleDefaults;
  sponsorblock: SponsorBlockDefaults;
  metadata: MetadataDefaults;
}

interface NetworkSettings {
  proxy_url?: string;
  speed_limit_bytes_per_sec?: Bytes;
  user_agent?: string;
}
```
### DownloadTask

```ts
type DownloadKind =
  | "video"
  | "playlist"
  | "audio"
  | "image"
  | "pdf"
  | "book"
  | "webpage"
  | "telegram_media"
  | "course_lesson"
  | "generic"
  | "torrent"
  | "p2p";

type DownloadStatus =
  | "queued"
  | "active"
  | "paused"
  | "completed"
  | "failed"
  | "canceled"
  | "archived";

interface DownloadTask {
  schema_version: 1;
  id: Id;
  kind: DownloadKind;
  source_url?: UrlString;
  platform?: string;
  title?: string;
  author?: string;
  thumbnail_path?: PathString;
  output_dir: PathString;
  output_files: DownloadFile[];
  options: DownloadOptions;
  status: DownloadStatus;
  position: number;
  priority: number;
  progress: DownloadProgress;
  retry_count: number;
  last_error?: AppError;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
  started_at?: IsoDateTime;
  finished_at?: IsoDateTime;
}

Current implementation note: persisted `DownloadTask` JSON also carries `downloaded_bytes`, `total_bytes`, and optional `file_count` directly so queued drafts such as selected `.torrent` tasks can show file count/size before a transfer engine emits progress.

Current implementation note: create-download requests and shared create_options now accept optional `expected_sha256`. When present, the backend normalizes the 64-character SHA-256 digest into `DownloadTask.details_json.integrity.expected_sha256`. Completion verifies only single-file outputs; a mismatch or non-file output fails the task through the normal download failure path, while a match records `actual_sha256` and `verified_at` in the same integrity object.

Current implementation note: the built-in HTTP(S) fetch path used by direct-file downloads, webpage archives/assets, thumbnail saves, remote update/tool manifest reads, and channel feed reads follows up to 8 HTTP 3xx redirects. It resolves absolute, scheme-relative, root-relative, query/fragment-only, and `.`/`..` relative `Location` targets; cross-authority redirects drop Cookie and Authorization headers before the next request. The final response URL is retained internally so webpage archive asset bundling resolves relative assets against the redirected page URL, and default thumbnail/asset file names prefer a sanitized Content-Disposition filename from the final response and then fall back to the redirected URL when no explicit output file/name is provided. Real HTTPS/site matrix verification remains deferred to the final gate.

interface DownloadFile {
  path: PathString;
  size_bytes?: Bytes;
  media_type?: string;
  role: "primary" | "subtitle" | "thumbnail" | "metadata" | "attachment" | "log" | "other";
}
```
### DownloadOptions

```ts
interface DownloadOptions {
  mode: "video" | "audio" | "subtitles_only" | "playlist" | "gallery" | "course" | "torrent" | "p2p" | "generic";
  quality?: string;
  format_id?: string;
  audio_format?: "mp3" | "m4a" | "opus" | "flac" | "wav";
  start_time_ms?: Millis;
  end_time_ms?: Millis;
  subtitles?: {
    languages: string[];
    auto: boolean;
    embed: boolean;
    keep_vtt: boolean;
  };
  sponsorblock?: {
    enabled: boolean;
    categories: string[];
  };
  metadata?: {
    embed_metadata: boolean;
    embed_thumbnail: boolean;
    split_chapters: boolean;
  };
  network?: {
    proxy_url?: string;
    speed_limit_bytes_per_sec?: Bytes;
    user_agent?: string;
    referer?: string;
    headers_ref?: Id;
  };
  fragments?: {
    concurrent_fragments?: number;
    live_from_start?: boolean;
  };
  cookie_bucket_id?: Id;
  custom_template_id?: Id;
  platform_options?: Record<string, unknown>;
}
```
### DownloadProgress

```ts
interface DownloadProgress {
  schema_version: 1;
  task_id: Id;
  status: DownloadStatus;
  percent: Percent | null;
  downloaded_bytes?: Bytes;
  total_bytes?: Bytes;
  speed_bytes_per_sec?: Bytes;
  eta_seconds?: number;
  file_index?: number;
  file_count?: number;
  current_file?: string;
  stage:
    | "queued"
    | "probing"
    | "downloading"
    | "postprocessing"
    | "seeding"
    | "verifying"
    | "completed"
    | "failed"
    | "paused"
    | "canceled";
  message?: string;
  updated_at: IsoDateTime;
}
```
未知总大小、直播和外部工具无法给出 ETA 时，dpercentd 和 deta_secondsd 必须为 dnulld 或缺省，不能伪造。

### DownloadLogPage

```ts
interface DownloadLogEntry {
  line_number: number;
  source: "fetchdock" | "yt-dlp stdout" | "yt-dlp stderr" | "gallery-dl stdout" | "gallery-dl stderr" | "direct-file" | "webpage" | string;
  level: "info" | "warning" | "error" | "issue" | string;
  message: string;
  is_issue: boolean;
  raw: string;
}

interface DownloadLogPage {
  lines: string[];
  entries: DownloadLogEntry[];
  cursor: number;
  next_cursor?: number | null;
  total_lines: number;
  matched_lines: number;
}
```
当前实现子集：`downloads_get_logs` 保留兼容 raw `lines`，同时返回结构化 `entries` 供 UI/CLI issue 过滤使用；Downloads 日志抽屉可对已加载 rows 做本地 level/source 筛选并复制结构化 TSV，筛选不新增后端参数；日志仍存储为本地文本文件，不导出 log bodies 到 metadata-only summaries。

### MediaPreview

```ts
interface MediaPreview {
  schema_version: 1;
  input_url: UrlString;
  resolved_url?: UrlString;
  platform: string;
  extractor: "yt-dlp" | "gallery-dl" | "http" | "torrent" | "p2p" | "plugin" | "native";
  kind: DownloadKind;
  title?: string;
  author?: string;
  duration_ms?: Millis;
  thumbnail_url?: UrlString;
  thumbnail_path?: PathString;
  description?: string;
  is_playlist: boolean;
  item_count?: number;
  formats: FormatOption[];
  subtitles: SubtitleOption[];
  thumbnails: ThumbnailOption[];
  warnings: string[];
  required_auth?: AuthRequirement;
}
```
### FormatOption

```ts
interface FormatOption {
  id: string;
  label: string;
  kind: "video" | "audio" | "combined" | "subtitle" | "image" | "document" | "unknown";
  container?: string;
  codec?: string;
  width?: number;
  height?: number;
  fps?: number;
  bitrate_kbps?: number;
  size_bytes?: Bytes;
  is_default: boolean;
}
```
### CookieBucket

```ts
interface CookieBucket {
  schema_version: 1;
  id: Id;
  name: string;
  domain_hint?: string;
  platform?: string;
  entry_count: number;
  health: "unknown" | "valid" | "expired" | "permission_limited" | "error";
  last_tested_at?: IsoDateTime;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}
```
### ToolStatus

```ts
type ToolId = "yt-dlp" | "ffmpeg" | "gallery-dl" | "torrent-engine" | "whisper";

interface ToolStatus {
  schema_version: 1;
  id: ToolId;
  state: "missing" | "installed" | "installing" | "updating" | "error";
  version?: string;
  path?: PathString;
  managed: boolean;
  updatable: boolean;
  last_checked_at?: IsoDateTime;
  error?: AppError;
}
```
### PlatformMatrix

```ts
interface PlatformMatrixEntry {
  platform_key: string;
  display_name: string;
  category: string;
  route: string;
  status: "implemented" | "partial" | "local_draft" | "classifier_only" | "blocked";
  evidence: string[];
  limitations: string[];
}

interface PlatformRouteSample {
  label: string;
  url: string;
}
```
### PluginInfo

```ts
interface PluginInfo {
  schema_version: 1;
  id: Id;
  display_name: string;
  version: string;
  abi_version: string;
  host_abi_version: string;
  state: "not_installed" | "installed" | "enabled" | "disabled" | "loading" | "failed" | "incompatible";
  dynamic_library_path?: PathString | null;
  entrypoint?: string | null;
  preflight_status: "manifest_only" | "ready_local" | "failed" | "incompatible";
  preflight_message: string;
  capabilities: string[];
  permissions: string[];
  commands: string[];
  events: PluginEventInfo[];
  nav_items: PluginNavItem[];
  i18n?: Record<string, unknown>;
  settings_schema?: Record<string, unknown>;
  installed_at?: IsoDateTime;
  updated_at?: IsoDateTime;
  last_error?: AppError;
  manifest_path: PathString;
}

interface PluginEventInfo {
  name: string;
  description?: string | null;
}

interface PluginMarketplaceEntry {
  id: Id;
  name: string;
  manifest_path: PathString;
  version?: string | null;
  description?: string | null;
  source?: string | null;
  sha256?: string | null;
  signature?: string | null;
  signature_url?: string | null;
  capabilities: string[];
  permissions: string[];
}
```
## Tauri Commands

Command 名称使用 snake_case，参数对象只有一个顶层 request。返回值是结构化 response。

### App commands

| Command | Request | Response |
| --- | --- | --- |
| dapp_get_statusd | d{}d | dAppStatusd |
| dapp_show_toastd | d{ level: "success" \| "info" \| "warning" \| "error"; title: string; message?: string; action?: ToastAction }d | d{ ok: true }d |
| dapp_open_pathd | d{ path: PathString }d | d{ opened: true }d |
| dapp_reveal_filed | d{ path: PathString }d | d{ revealed: true }d |
| dapp_export_diagnosticsd | d{ include_urls: boolean; output_path?: PathString }d | d{ archive_path: PathString }d |
| dapp_export_diagnostics_bundled | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dapp_export_release_evidence_snapshotd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dapp_get_third_party_notice_summaryd | d{}d | d{ generated_at; source_root; npm_package_count; npm_missing_license_count; npm_dev_package_count; npm_optional_package_count; rust_crate_count; rust_missing_license_count; bundled_review_file_count; bundled_review_total_size_bytes; license_counts[]; bundled_kind_counts[]; bundled_review_files[]; review_required: true; review_notes[] }d |
| dapp_export_third_party_notice_inventoryd | d{ output_path?: PathString }d | d{ archive_path: PathString; npm_package_count: number; rust_crate_count: number; review_required: true }d |
| dapp_export_third_party_notice_draftd | d{ output_path?: PathString }d | d{ archive_path: PathString; npm_package_count: number; rust_crate_count: number; review_required: true }d |
| dapp_get_local_evidence_snapshotd | d{}d | d{ generated_at; module_count; secrets_exported; modules; honesty_notes: string[] }d |
| dapp_export_local_evidence_snapshotd | d{ output_path?: PathString }d | d{ archive_path: PathString; module_count: number; secrets_exported: false }d |
| dapp_get_privacy_statusd | d{}d | d{ telemetry_enabled: false; network_telemetry_enabled: false; diagnostics_include_urls_default: boolean; cookie_values_exported_in_diagnostics: false; notes: string[] }d；`diagnostics_include_urls_default` 来自本地 Advanced settings。 |
| dapp_export_privacy_statusd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dapp_get_release_checklistd | d{}d | d{ generated_at; ready_count; review_needed_count; pending_count; blocked_count; gates: { id; label; status; evidence; next_step }[] }d |
| dapp_export_release_checklistd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dapp_get_release_package_summaryd | d{}d | d{ generated_at; source_root; frontend_dist; windows_portable; tauri_bundles; packaging_templates; scripts; package_files[]; gate_counts[]; review_notes[] }d |
| dapp_export_release_package_summaryd | d{ output_path?: PathString }d | d{ archive_path; item_count; review_required }d |
| dapp_get_legal_readiness_summaryd | d{}d | d{ generated_at; source_root; data_root; ready_count; review_needed_count; pending_count; blocked_count; missing_document_count; missing_documents[]; npm_package_count; npm_missing_license_count; rust_crate_count; rust_missing_license_count; package_status_counts[]; checklist_gate_counts[]; review_notes[] }d |
| dapp_export_legal_readiness_summaryd | d{ output_path?: PathString }d | d{ archive_path; missing_document_count; review_required }d |
| dapp_get_release_document_summaryd | d{}d | d{ generated_at; source_root; document_count; missing_count; total_size_bytes; documents[]; function_parity_status_counts[]; acceptance_status_counts[]; review_notes[] }d |
| dapp_export_release_document_summaryd | d{ output_path?: PathString }d | d{ archive_path; item_count; review_required }d |
| dapp_check_update_manifestd | d{ manifest_path: PathString \| UrlString }d | d{ current_version; latest_version?; update_available; manifest_path; source_kind; release_notes?; download_url?; checked_at }d |
| dapp_check_configured_update_manifestd | d{}d | d{ current_version; latest_version?; update_available; manifest_path; source_kind; release_notes?; download_url?; checked_at }d |
| dapp_get_update_settingsd | d{}d | d{ enabled; manifest_path?; check_interval_hours; last_checked_at?; last_result? }d |
| dapp_export_update_settingsd | d{ output_path?: PathString }d | d{ output_path; exported_setting_count; settings }d |
| dapp_import_update_settingsd | d{ input_path: PathString }d | d{ input_path; imported_setting_count; settings }d |
| dapp_update_update_settingsd | d{ patch: { enabled?; manifest_path?; check_interval_hours?; last_checked_at?; last_result? } }d | d{ enabled; manifest_path?; check_interval_hours; last_checked_at?; last_result? }d |
| dapp_export_recovery_manifestd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dapp_list_diagnosticsd | d{}d | d{ files: LocalFileSummary[] }d |
| dapp_read_diagnostics_filed | d{ path: PathString }d | d{ path: PathString; content: string; truncated: boolean }d |
| dapp_delete_diagnostics_filed | d{ path: PathString }d | d{ deleted: boolean }d |
| dapp_clear_diagnosticsd | d{}d | d{ cleared: number }d |
| dapp_list_download_logsd | d{ query?: string; task_id?: string; limit?: number }d | d{ logs: LocalFileSummary[]; total_log_count; filtered_log_count; filters }d |
| dapp_read_download_logd | d{ path: PathString }d | d{ file; content: string; truncated: boolean; max_bytes: number; entries?: DownloadLogEntry[]; issue_count?: number }d |
| dapp_delete_download_logd | d{ path: PathString }d | d{ deleted: boolean }d |
| dapp_clear_download_logsd | d{}d | d{ cleared: number }d |
| dapp_cleanup_partial_downloadsd | d{ dry_run: boolean }d | d{ dry_run: boolean; matched: number; deleted: number; files: LocalFileSummary[] }d |
| dapp_get_autostartd | d{}d | dbooleand |
| dapp_set_autostartd | d{ enabled: boolean }d | d{ ok: true }d |
| dapp_get_infrastructure_summaryd | d{}d | d{ generated_at; app_status; autostart_available; autostart_enabled?; autostart_error?; shell_settings; quick_capture_enabled; quick_capture_shortcut; quick_capture_registered?: boolean; path_count; review_notes[] }d |
| dapp_export_infrastructure_summaryd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dapp_get_shell_settingsd | d{}d | d{ quick_capture_shortcut: string; quick_capture_enabled: boolean; updated_at?: IsoDateTime }d |
| dapp_export_shell_settingsd | d{ output_path?: PathString }d | d{ output_path; exported_setting_count; settings }d |
| dapp_import_shell_settingsd | d{ input_path: PathString }d | d{ input_path; imported_setting_count; settings }d |
| dapp_update_shell_settingsd | d{ patch: { quick_capture_shortcut?: string; quick_capture_enabled?: boolean } }d | same as dapp_get_shell_settingsd |

### Settings commands

| Command | Request | Response |
| --- | --- | --- |
| dsettings_get_alld | d{}d | dSettingsd |
| dsettings_updated | d{ patch: Partial<Settings> }d | dSettingsd |
| dsettings_searchd | d{ query: string }d | d{ results: SettingsSearchResult[] }d |
| dsettings_reset_sectiond | d{ section: "all" | "appearance" | "downloads" | "network" | "auth" | "twitter_x_auth" | "ai" | "update" | "extension" | "browser_extension" | "channels" | "reader" | "library" | "music" | "music_queue" | "music_sleep_timer" | "music_equalizer" | "music_discord_presence" | "dependencies" | "tools" | "app_shell" | "shortcut" }d | dSettingsd |
| dsettings_validate_networkd | d{ proxy?: string }d | d{ ok: boolean; proxy_configured: boolean; proxy_kind?: string; proxy_host?: string; proxy_port?: number; message: string }d |
| dnetwork_export_settingsd | d{ output_path?: PathString }d | d{ output_path: PathString; exported_setting_count: number; settings: NetworkSettingsBackup }d |
| dnetwork_import_settingsd | d{ input_path: PathString }d | d{ input_path: PathString; imported_setting_count: number; settings: NetworkSettingsBackup }d |
| dsettings_export_manifestd | d{ output_path?: PathString }d | d{ path: PathString }d |
| dsettings_import_manifestd | d{ manifest_path: PathString }d | dSettingsd |
| dappearance_export_settingsd | d{ output_path?: PathString }d | d{ output_path: PathString; exported_setting_count: number; settings: AppearanceSettings }d |
| dappearance_import_settingsd | d{ input_path: PathString }d | d{ input_path: PathString; imported_setting_count: number; settings: AppearanceSettings }d |
| dappearance_get_theme_catalogd | d{}d | dAppearanceThemeCatalogResponsed |
| dappearance_export_theme_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dappearance_get_language_catalogd | d{}d | dAppearanceLanguageCatalogResponsed |
| dappearance_export_language_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dchannels_export_settingsd | d{ output_path?: PathString }d | d{ output_path: PathString; exported_setting_count: number; settings: ChannelSettings }d |
| dchannels_import_settingsd | d{ input_path: PathString }d | d{ input_path: PathString; imported_setting_count: number; settings: ChannelSettings }d |
| dai_get_local_summaryd | d{}d | dAiLocalSummaryResponsed |
| dai_export_local_summaryd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dai_export_settingsd | d{ output_path?: PathString }d | d{ output_path: PathString; exported_setting_count: number; settings: AiSettings }d |
| dai_import_settingsd | d{ input_path: PathString }d | d{ input_path: PathString; imported_setting_count: number; settings: AiSettings }d |

当前实现子集：dsettings_searchd 已返回 dSettingsSearchResult[]d，索引当前真实存在的设置面板：dpathsd、dinfrastructured、ddependenciesd、dappearanced、ddownloadsd、dnetworkd、dcookiesd、dextensiond、dchannelsd、dpluginsd、daid、dadvancedd；Downloads/Plugins 关键词覆盖 completed cleanup、archived retention days、cleanup CLI flags、Delete visible、Enable shown、Disable shown、copy plugin states/entrypoints/capabilities/commands/events 和 copy marketplace names/versions 等本地批量管理入口，Dependencies/Advanced 关键词覆盖 download source、SHA-256、reset tools、copy tool ids/paths/versions/sources/hashes、implemented settings reset、reader/music/equalizer/sleep/discord 本地状态重置，Infrastructure 关键词覆盖 quick capture/global shortcut/clipboard capture、dapp-shell-settingsd 和 dupdate-app-shell-settingsd，并补充 archived downloads、CLI queued-task/sidecar flags / output mode、Cookie auto-match、Cookie bucket copy ids/names/platforms/health/counts/storage/domain hints、Bilibili transfer batch、Bilibili copy ids/titles/owners/collections/added times、channel copy ids/names/platforms/auto states/history ids/titles/authors/source kinds/notifications/task ids、Telegram copy chat ids/titles/types/usernames/media ids/titles/types、course copy ids/titles/lesson ids/lesson titles/attachment ids/attachment titles、platform copy names/routes/categories/statuses/evidence/limits、route sample copy visible URLs/labels/platforms/kinds/intents、course sample copy labels/platforms/title hints、extension blocked hosts/copy bridge/copy endpoints/copy pairing status/copy extension summary、Auth fallback reset、diagnostics/log copy paths/names/kinds/sizes/modified times and partial cleanup copy paths/names/sizes/modified times、local evidence copy modules/summaries/scopes/generated/notes、privacy notes/matrix/classes/default/export/control copy、release gates/next steps/ids/statuses/evidence copy、update manifest path/download URL/release notes/versions/checked/summary/due-status copy plus update-summary/export-update-summary/status/path/note copy、reading annotations/quick progress/use scroll/bookmark here/highlight here/copy library folders/copy library paths/copy library titles/copy library authors/formats/sizes/covers/metadata/copy annotation ids/text/types/progress/created、metadata copy format ids/thumbnail URLs/subtitle languages/playlist URLs/gallery URLs/chapters/comment ids/comment text、learning graph copy nodes/links、learning note copy titles/tags/timestamps/links、focus copy labels/durations/statuses/start/end times、Torrent/P2P/shot marker copy paths/trackers/hash/codes/folders/times/scores、music playback/playlists/queue append/shuffle/dedupe/clear/copy catalog folders/artists/albums/copy top tracks/copy recent plays/copy track paths/artists/albums/formats/sizes/covers/metadata/copy playlist ids/counts/updated、course prune、Telegram imported-media cleanup，以及 Telegram/Courses/Channels/Torrent/P2P transfer batch、Subtitle Workshop SRT/VTT conversion/ASS no-loss boundary/two-point cue start/end and waveform-target sync helpers、local sidecar lyrics open/reveal 等本地管理入口关键词。空查询返回空结果；前端设置页可显示结果、点击滚动到对应面板并以本地样式高亮。dapp_get_infrastructure_summaryd / dapp_export_infrastructure_summaryd 与 CLI dinfrastructure-summaryd / dexport-infrastructure-summary [output.json]d 会汇总或导出本地 AppStatus paths、runtime mode、quick-capture shell settings、桌面 runtime shortcut registration state 和桌面 autostart 状态（CLI shortcut/autostart 标记为 unavailable），只写 metadata JSON，不注册快捷键、不改变 autostart、不验证 tray/deep-link 手动行为。dsettings_get_alld、dsettings_updated 和 dsettings_reset_sectiond 已覆盖 App shell 本地子集：dapp_shelld 会保存 dquick_capture_shortcutd 与 dquick_capture_enabledd 到 ddata/config/app-shell.jsond，启动时按该设置注册/跳过全局 quick-capture shortcut，Settings > Infrastructure 可编辑、关闭或恢复默认组合；dapp_get_shell_settingsd / dapp_update_shell_settingsd 可单独读写同一状态并即时注册/注销运行时快捷键。dsettings_get_alld、dsettings_updated 和 dsettings_reset_sectiond 已覆盖 Appearance 子集：dlanguaged、dthemed、dfont_scale_percentd、ddensityd，写入 ddata/config/appearance.jsond，前端会立即把 theme、font scale 和 density 应用到 app shell；dthemed 当前接受 dsystemd、dlightd、ddarkd、dcontrastd、dpaperd、dmidnightd、dforestd、ddraculad、dcatppuccind、done-darkd、de-inkd、dsolard、drosed、dnordd，其中常见主题名只作为兼容入口，视觉 token 为 FetchDock 原创；dlanguaged 当前支持 9 个入口（English、简体中文、Español、Français、Deutsch、Italiano、日本語、한국어、Português BR），并会通过前端 i18n helper 即时影响侧边栏导航、品牌副标题、顶栏动作、命令面板和 Settings search 子集，但不代表完整 i18n 翻译已完成。dappearance_export_settingsd / dappearance_import_settingsd 与 CLI dexport-appearance-settings [output.json]d / dimport-appearance-settings <input.json>d 可显式备份/恢复本地 language、theme、font scale 和 density preferences，导入复用现有 Appearance sanitizer，不导出下载文件、Cookie/Auth 值、library content、notes、logs、diagnostics body 或 task data。dsettings_get_alld、dsettings_updated 和 dsettings_reset_sectiond 也已覆盖 Downloads/Network 子集：dmax_concurrencyd、ddefault_output_dird、dorganize_by_platformd、dfilename_templated、dskip_existingd、ddefault_qualityd、ddefault_audio_formatd、ddefault_user_agentd、ddefault_refererd、ddefault_proxyd、ddefault_rate_limitd、ddefault_live_from_startd、ddefault_concurrent_fragmentsd、dcustom_ytdlp_argsd、dsubtitlesd、dsponsorblockd、dmetadatad，并继续写入 ddata/config/downloads.jsond；ddownloads_export_settingsd / ddownloads_import_settingsd 与 CLI dexport-downloads-settings [output.json]d / dimport-downloads-settings <input.json>d 可显式备份/恢复本地 Downloads/Network 默认值、字幕、SponsorBlock、metadata 和 cleanup preferences，导入复用现有 sanitizer，不导出任务 source URLs、Cookie/Auth 值、下载文件、diagnostics body 或 download log body，也不创建、启动或修改现有任务；dnetwork_export_settingsd / dnetwork_import_settingsd 与 CLI dexport-network-settings [output.json]d / dimport-network-settings <input.json>d 提供独立 Network defaults backup，只迁移 default User-Agent、Referer、Proxy、Rate limit、Live from start 和 Fragments，不包含任务 URL、Cookie/Auth 值、下载文件、diagnostics body、download log body 或 proxy connectivity results，导入只影响未来任务继承的本地默认值；dsettings_validate_networkd 可对当前或传入 proxy 做本地格式校验，返回 scheme/host/port 摘要，但不执行网络连通性测试；ddownloads_created 和 ddownloads_create_batchd 在未传任务级 doutput_dird、dqualityd、daudio_formatd、duser_agentd、drefererd、dproxyd、drate_limitd、dlive_from_startd、drun_after_active_slotd、dconcurrent_fragmentsd、dcustom_ytdlp_argsd、dsubtitlesd、dsponsorblockd 或 dmetadatad 时会继承对应默认值，direct-file 下载会应用 dfilename_templated、在 dorganize_by_platform=trued 时写入平台子目录，并在 dskip_existing=trued 且目标文件已存在时跳过重复下载。字幕、SponsorBlock 和 metadata 字段当前会进入 yt-dlp 参数计划，并会随最小 yt-dlp 进程执行路径传给外部工具；真实字幕文件、嵌入结果、VTT 保留、SponsorBlock 片段跳过、metadata/thumbnail 嵌入和章节切分仍需真实样例验收。dsettings_get_alld、dsettings_updated 和 dsettings_reset_section(ai)d 还覆盖 AI 本地配置子集：dproviderd 仅接受 dnoned 或 dlocald 且本里程碑在 UI 中只读展示，dwhisper_modeld 接受 dtiny/base/small/medium/larged，dwhisper_taskd 接受 dtranscribe/translated，dwhisper_languaged 为可选本地 hint；dsubtitle_translate_enabledd 与 dgrammar_cleanup_enabledd 作为本地 workflow preference 独立保存，但不会启用云 provider、API key、network call 或额外 AI 产品功能。dai_export_settingsd / dai_import_settingsd 与 CLI dexport-ai-settings [output.json]d / dimport-ai-settings <input.json>d 可显式备份/恢复本地 provider scope、Whisper 默认值和 local assistance flags，导入复用现有 sanitizer，不导出或恢复 prompts、API keys、Cookie/Auth 值、字幕/媒体正文、下载内容或日志正文，也不执行 AI/Whisper/翻译/语法清理工作流。dai_get_local_summaryd / dai_export_local_summaryd 与 CLI dai-summaryd / dexport-ai-summary [output.json]d 只汇总或导出本地 provider flags、Whisper 默认值和 Whisper dependency metadata；响应显式标记 dexecutes_ai_workflowsd、dincludes_promptsd、dincludes_api_keysd 和 dincludes_file_bodiesd 为 false，不执行 Whisper、subtitle translate、grammar cleanup、远端 provider、downloader/browser workflow，也不导出 prompts、API keys、字幕/媒体正文、Cookie/Auth 值、下载内容或日志正文。dsettings_reset_section(auth)d / dsettings_reset_section(twitter_x_auth)d 会恢复本地 Auth 设置默认值，清空 Twitter/X fallback header 和启用状态，不删除 Cookie buckets；dsettings_reset_section(dependencies)d / dsettings_reset_section(tools)d 会清空本地 tool path overrides、download source entries 和 install errors，但不删除已下载的 managed dependency 文件；dsettings_reset_section(all)d 会恢复已实现设置，不删除 Cookie buckets、downloaded files、task history、plugin installs、manifests 或 catalogs。dsettings_updated、dsettings_import_manifestd、dsettings_reset_sectiond、update preferences、Auth fallback、Browser Extension options、Channels polling、Reader settings、Dependencies tool settings 和 Music queue/sleep/equalizer/Discord presence 写入成功后会发出 dsettings:changedd，payload 包含当前核心 dSettingsd 和 changed path 列表；前端 mount 后订阅该事件并同步本地设置输入，同时按 path 刷新 auth/update/extension/channels/reader/music/dependencies 面板。dsettings_export_manifestd 会把当前已实现的安全配置包写为本地 FetchDock JSON manifest，可用可选 doutput_pathd 指定导出位置，未指定时写入 diagnostics 目录；内容包括 Appearance、App shell quick-capture shortcut、Downloads/Network、Update、Browser Extension options、Channels polling、Reader settings、Music queue/sleep timer/equalizer/Discord presence，以及 Twitter/X 手动 Cookie 是否已设置的脱敏公开状态；不会导出 Cookie/header/token 明文。dsettings_import_manifestd 会读取该 manifest 并通过现有 sanitize/write 路径恢复这些安全子集；Auth 脱敏状态仅用于审计，不会恢复秘密值。Settings > Advanced 还会用 dapp_list_diagnosticsd / dapp_list_download_logsd 返回的本地文件清单提供 diagnostics/log 搜索、类型过滤、download log task/limit metadata 筛选、filtered/total 计数、当前可见文件路径/文件名/类型/大小/修改时间复制和受限预览入口，并为 partial-cleanup 预览提供路径/文件名/大小/修改时间复制入口；dapp_read_diagnostics_filed / dapp_delete_diagnostics_filed / dapp_clear_diagnosticsd 会 canonicalize 到 app diagnostics 目录并限制 d.jsond / d.zipd，其中 zip 预览只返回二进制说明文本；download log 的 read/delete/clear 仍 canonicalize 到 app logs 目录并限制 d.logd；dapp_read_download_logd 还会对预览正文返回结构化 dentriesd 和 issue_count，供 Advanced/CLI 诊断查看。Settings UI 已暴露 Appearance、Downloads、Network、AI、Browser Extension options、Channels polling、本地 Update preferences、Dependencies tool settings、Reader settings、App shell quick-capture shortcut、Auth fallback、Music queue、Music sleep timer、Music equalizer 和 Music Discord Presence 的 reset controls，并在 Settings > Advanced 集中暴露同一组本地状态重置入口；Advanced 还提供带确认的 implemented settings reset-all，恢复已实现设置但不删除 Cookie buckets、downloaded files、task history、plugin installs、manifests、catalogs 或已下载 managed dependency 文件，同时对 diagnostics/download logs 提供可见 paths/names/kinds/sizes/modified times 复制、单文件删除、通过 dapp_delete_local_filesd Remove shown 可见项批量删除和清空确认；本地 diagnostics/log 导出、删除或清空成功后会发出 ddiagnostics:files_changedd，前端同步本地文件清单且 payload 只含文件 metadata。完整 Settings schema、其它下载源实际参数继承、Advanced 恢复向导、危险操作和未实现分组的真实设置项仍未实现。

### Metadata commands

| Command | Request | Response |
| --- | --- | --- |
| metadata_get_local_summary | {} | MetadataLocalSummaryResponse |
| metadata_export_local_summary | { output_path?: PathString } | { archive_path: PathString } |
| media_get_local_summary | {} | MediaToolsLocalSummaryResponse |
| media_export_local_summary | { output_path?: PathString } | { archive_path: PathString } |
| dmetadata_probe_urld | dMetadataProbeRequestd | dMetadataPreviewd |
| metadata_probe_playlist | { source_url: UrlString; limit?: number; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string } | MetadataPlaylistPreview |
| dgallery_probe_urld | d{ source_url: UrlString; limit?: number; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string }d | dGalleryPreviewd |
| dmetadata_list_formatsd | d{ url: UrlString; cookie_bucket_id?: Id }d | d{ formats: FormatOption[] }d |
| metadata_list_subtitles | { url: UrlString; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string } | { subtitles: SubtitleOption[] } |
| metadata_save_subtitle | { url: UrlString; language: string; format: string; is_auto: boolean; output_dir?: PathString; output_path?: PathString; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string } | { output_path: PathString } |
| dmetadata_merge_subtitlesd | d{ input_paths: PathString[]; output_path: PathString }d | d{ output_path: PathString; merged_count: number }d |
| metadata_list_thumbnails | { url: UrlString; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string } | { thumbnails: ThumbnailOption[] } |
| dmetadata_save_thumbnaild | d{ url: UrlString; output_dir?: PathString; output_path?: PathString; file_name?: string; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string }d | d{ output_path: PathString }d |
| metadata_list_chapters | { url: UrlString; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string } | { chapters: ChapterOption[] } |
| metadata_save_chapters | { url: UrlString; output_dir?: PathString; output_path?: PathString; file_name?: string; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string } | { output_path: PathString; chapter_count: number } |
| metadata_list_comments | { url: UrlString; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string } | { comments: CommentOption[] } |
| metadata_save_info_json | { url: UrlString; output_dir?: PathString; output_path?: PathString; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string } | { output_path: PathString } |
| metadata_save_comments | { url: UrlString; output_dir?: PathString; output_path?: PathString; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string } | { output_path: PathString } |
| metadata_save_live_chat | { url: UrlString; output_dir?: PathString; output_path?: PathString; user_agent?: string; referer?: UrlString; proxy?: string; cookie_bucket_id?: Id; auth_payload_ref?: string; rate_limit?: string } | { output_path: PathString } |

```ts
interface MetadataLocalSummaryResponse {
  schema_version: 1;
  generated_at: IsoDateTime;
  data_root: PathString;
  default_output_dir_set: boolean;
  default_output_dir?: PathString | null;
  subtitle_language_count: number;
  subtitle_auto_enabled: boolean;
  subtitle_embed_enabled: boolean;
  subtitle_keep_vtt_enabled: boolean;
  sponsorblock_enabled: boolean;
  sponsorblock_category_count: number;
  embed_metadata_enabled: boolean;
  embed_thumbnail_enabled: boolean;
  split_chapters_enabled: boolean;
  ai_provider: string;
  whisper_model: string;
  whisper_task: string;
  whisper_language_set: boolean;
  subtitle_translate_enabled: boolean;
  grammar_cleanup_enabled: boolean;
  tool_override_count: number;
  tool_source_count: number;
  managed_tool_file_count: number;
  managed_tool_total_size_bytes: Bytes;
  sidecar_file_count: number;
  sidecar_total_size_bytes: Bytes;
  waveform_cache_file_count: number;
  waveform_cache_total_size_bytes: Bytes;
  tool_status_counts: LocalCountEntry[];
  sidecar_kind_counts: LocalCountEntry[];
  sidecar_files: LocalFileSummary[];
  waveform_cache_files: LocalFileSummary[];
  managed_tool_files: LocalFileSummary[];
  includes_source_urls: false;
  includes_cookie_values: false;
  includes_authorization_values: false;
  includes_file_bodies: false;
  executes_tools: false;
  review_notes: string[];
}

interface MetadataProbeRequest {
  source_url: UrlString;
}

interface MetadataPreview {
  schema_version: 1;
  source_url: UrlString;
  platform: string;
  title?: string | null;
  author?: string | null;
  thumbnail_url?: UrlString | null;
  duration_seconds?: number | null;
  formats: MetadataPreviewFormat[];
}

interface MetadataPreviewFormat {
  id: string;
  label?: string | null;
  ext?: string | null;
  width?: number | null;
  height?: number | null;
  filesize_bytes?: Bytes | null;
  vcodec?: string | null;
  acodec?: string | null;
}

interface MetadataPlaylistPreview {
  schema_version: 1;
  source_url: UrlString;
  platform: string;
  title?: string | null;
  author?: string | null;
  item_count: number;
  truncated: boolean;
  entries: MetadataPlaylistEntry[];
}

interface MetadataPlaylistEntry {
  index?: number | null;
  id?: string | null;
  title?: string | null;
  url?: string | null;
  webpage_url?: UrlString | null;
  duration_seconds?: number | null;
  author?: string | null;
  thumbnail_url?: UrlString | null;
}

interface GalleryPreview {
  schema_version: 1;
  source_url: UrlString;
  platform: string;
  item_count: number;
  truncated: boolean;
  entries: GalleryPreviewEntry[];
}

interface GalleryPreviewEntry {
  index: number;
  url: UrlString;
  file_name?: string | null;
  extension?: string | null;
  media_kind: "image" | "video" | "audio" | "unknown" | string;
}

interface SubtitleOption {
  language: string;
  name?: string | null;
  formats: string[];
  is_auto: boolean;
}

interface MetadataSaveSubtitleResponse {
  output_path: PathString;
}

interface MetadataMergeSubtitlesResponse {
  output_path: PathString;
  merged_count: number;
}

interface ThumbnailOption {
  id?: string | null;
  url: UrlString;
  width?: number | null;
  height?: number | null;
  preference?: number | null;
}

interface MetadataThumbnailsResponse {
  thumbnails: ThumbnailOption[];
}

interface MetadataSaveThumbnailResponse {
  output_path: PathString;
}

interface ChapterOption {
  title?: string | null;
  start_seconds?: number | null;
  end_seconds?: number | null;
}

interface MetadataChaptersResponse {
  chapters: ChapterOption[];
}

interface CommentOption {
  id?: string | null;
  author?: string | null;
  text: string;
  timestamp_seconds?: number | null;
  like_count?: number | null;
  reply_count?: number | null;
}

interface MetadataCommentsResponse {
  comments: CommentOption[];
}

interface MetadataSaveChaptersResponse {
  output_path: PathString;
  chapter_count: number;
}

interface MetadataSaveInfoJsonResponse {
  output_path: PathString;
}

interface MetadataSaveCommentsResponse {
  output_path: PathString;
}

interface MetadataSaveLiveChatResponse {
  output_path: PathString;
}
```
当前实现子集：dmetadata_get_local_summaryd / dmetadata_export_local_summaryd 与 CLI dmetadata-summaryd / dexport-metadata-summary [output.json]d 汇总或导出本地 metadata-tool review JSON，覆盖 Downloads metadata/subtitle/SponsorBlock 默认开关、AI/Whisper 本地设置摘要、dependency tool override/source/status counts、managed dependency file metadata、app-managed metadata sidecar 文件清单和 waveform cache 文件清单；响应显式标记 dincludes_source_urlsd、dincludes_cookie_valuesd、dincludes_authorization_valuesd、dincludes_file_bodiesd 和 dexecutes_toolsd 为 false。该摘要不执行 yt-dlp、gallery-dl、FFmpeg、Whisper、torrent engine、浏览器 storage 或远端站点，不嵌入字幕/评论/info/live-chat/media/log/file body，也不证明真实站点 metadata extraction、字幕质量、媒体处理或最终等价。dmetadata_probe_urld 已接入 yt-dlp d--dump-json --no-playlist <url>d 预览路径，只接受 dhttp://d 和 dhttps://d URL，并按 manual override、managed tool、PATH 顺序解析 dyt-dlpd。后端会在短超时内读取 stdout JSON，解析 dtitled、duploader/channeld、dthumbnaild、ddurationd 和 dformats[]d 中的 dformat_idd、label、ext、width、height、filesize/filesize_approx、vcodec、acodec；非零退出、启动失败、超时和无效 JSON 会返回明确错误。首页提供显式 Probe 按钮，成功后展示标题、作者、缩略图、时长和前几个格式；Video 模式可选择一个 preview format，并在创建任务时把 format id 作为任务级 dqualityd 传入。dmetadata_probe_playlistd 已接入 yt-dlp d--flat-playlist --dump-json <url>d，默认最多返回 50 条、调用方可传 dlimitd 且后端夹紧到 1..250；后端兼容整段 JSON dentries[]d 和 line-delimited JSON 条目，返回 playlist title/author/item_count/truncated 以及条目的 index/id/title/url/webpage_url/duration/author/thumbnail。首页 metadata preview 和 Tools > Metadata 均提供 Probe playlist 入口并默认紧凑展示条目，也可把返回中带 URL 的当前 playlist 条目批量创建为本地 dvideo/queuedd 任务草稿；Tools > Metadata 的队列创建会继承工具页自己的 User-Agent、Referer、Proxy、Rate limit、Cookie bucket 和 Authorization payload。dgallery_probe_urld 已接入 gallery-dl d--get-urls <url>d 预览路径，默认最多返回 80 条、调用方可传 dlimitd 且后端夹紧到 1..500；可选传入 User-Agent、Referer、Proxy、Rate limit、Cookie bucket 和 Authorization payload，上下文会转为 gallery-dl 参数或 dheaders.*d option，Cookie/Authorization 在计划日志中脱敏；后端只解析 stdout 中的 http/https 可下载 URL，去重后返回平台、item_count/truncated、条目 index/url/file_name/extension/media_kind。首页和 Tools > Metadata 均提供 Probe gallery 入口并默认紧凑展示文件 URL；Tools > Metadata 有独立 User-Agent、Referer、Proxy、Rate limit、Cookie bucket 和 Authorization payload 控件，预览、sidecar 保存和 Queue shown 会使用该工具页上下文；该路径只列出候选文件，不下载、不代表真实站点矩阵已完成。dmetadata_save_info_jsond 已接入 yt-dlp d--skip-download --write-info-json --paths --no-playlist <url>d，通过输出目录快照返回实际写出的完整 info JSON 文件路径；首页 metadata preview 提供 Save metadata 入口。dmetadata_list_thumbnailsd 已复用 yt-dlp d--dump-json --no-playlist <url>d，解析 dthumbnails[]d 中的 id、URL、宽高和 preference；没有 variants 时会回退顶层 dthumbnaild。dmetadata_save_thumbnaild 可把调用方选定的 http/https 缩略图 URL 保存到指定输出目录或 Downloads 默认目录，使用安全文件名并避免覆盖已有文件；保存路径走内置 direct HTTP(S) 请求，可携带 User-Agent、Referer、Proxy、Rate limit、Cookie bucket 派生的 Cookie header、Twitter/X manual Cookie fallback 和 Authorization payload header。dmetadata_list_chaptersd 已复用 yt-dlp d--dump-json --no-playlist <url>d，解析 dchapters[]d 的标题、开始秒数和结束秒数；dmetadata_save_chaptersd 可把章节结构保存为 JSON 文件并返回章节数量。dmetadata_list_commentsd 已接入 yt-dlp d--dump-json --write-comments --no-playlist <url>d，解析 dcomments[]d 的 id、author、text/html、timestamp/time_text、like_count 和 reply_count，首页与 Tools > Metadata 可预览前几条评论。dmetadata_save_commentsd 已接入 yt-dlp d--skip-download --write-comments --write-info-json --paths --no-playlist <url>d，通过输出目录快照返回实际写出的 comments info JSON 文件路径。dmetadata_save_live_chatd 已接入 yt-dlp d--skip-download --write-subs --sub-langs live_chat --sub-format json3 --paths --no-playlist <url>d，把 live chat 当作字幕 sidecar 保存并返回实际写出的文件路径；首页与 Tools > Metadata 提供 Save live chat 入口。dmetadata_list_subtitlesd 已接入 yt-dlp d--list-subs --skip-download --no-playlist <url>d，返回手动字幕和自动字幕的语言、名称、格式列表和 dis_autod 标记；无字幕时返回空列表。dmetadata_save_subtitled 已接入 yt-dlp d--skip-download --write-subs --sub-langs --sub-format --paths --no-playlist <url>d，可把单个语言/格式字幕保存到指定输出目录或 Downloads 默认目录，并通过输出目录快照返回实际写出的字幕文件路径。以上 subtitle/thumbnail/chapters/info JSON/comments/live chat save commands 都可选 doutput_pathd，CLI 对应 d--output <file>d，Tools > Metadata 提供 Save as/Open file/Reveal；未指定时保留原输出目录行为。dmetadata_merge_subtitlesd 已实现本地文本字幕合并子集：读取至少两个本地字幕文件，支持 UTF-8、UTF-8 BOM、UTF-16LE BOM、UTF-16BE BOM 和无 BOM Windows-1252 fallback 本地输入，用空行分隔写入 UTF-8 目标文件并返回合并数量；Tools > Metadata 已提供多行输入路径、输出路径和 Merge local files 入口。它暂不做时间轴重排、格式转换、GBK/Shift-JIS 等 legacy code page 检测或冲突检测。失败显示错误。metadata preview、playlist preview、字幕/缩略图/章节/评论 list，以及字幕/缩略图/章节/info JSON/comments/live chat 保存路径可携带 User-Agent、Referer、Proxy、Rate limit、Cookie bucket 和 Authorization payload；Home/Tools 前端会在这些 probe/list/save/queue 动作前按目标 host 本地自动填入匹配 Cookie bucket，但后端协议仍只接收显式 dcookie_bucket_idd。yt-dlp 路径转换为 yt-dlp 参数，direct thumbnail save 路径转换为内置 HTTP 请求上下文。Cookie/Authorization 在工具参数日志中继续脱敏。播放列表真实下载后验收、live chat 解析/实时 UI、真实站点矩阵和平台特化预览仍未实现。

补充：dmedia_get_local_summaryd / dmedia_export_local_summaryd 与 CLI dmedia-summaryd / dexport-media-summary [output.json]d 汇总或导出本地 media tools review JSON，覆盖 FFmpeg/Whisper 配置状态、tool override/source/error counts、waveform cache 文件 metadata、subtitle sidecar 文件 metadata、clip-task metadata、Whisper 默认设置和 review notes；响应显式标记 dexecutes_media_toolsd、dincludes_media_file_bodiesd、dincludes_subtitle_bodiesd、dincludes_cookie_valuesd 和 dincludes_authorization_valuesd 为 false。Tools > Media tools 可复制 summary/JSON/waveform files/subtitle files/tool counts/notes，并可 Save as、Export summary、Open summary、Reveal summary；该能力不执行 FFmpeg、Whisper、yt-dlp、gallery-dl、浏览器 storage 或媒体处理任务，不读取或嵌入媒体/字幕/log bodies，也不证明转码、shot detection、waveform、Whisper 或 Subtitle Workshop 等价完成。

### Media tool commands

| Command | Request | Response |
| --- | --- | --- |
| dmedia_clip_videod | d{ job_id?: string; input_path: PathString; output_path: PathString; mode?: "copy" \| "reencode"; video_codec?: string; audio_codec?: string; crf?: number; preset?: string; start_seconds?: number; end_seconds?: number }d | d{ job_id: string; output_path: PathString }d |
| dmedia_transcoded | d{ job_id?: string; input_path: PathString; output_path: PathString; preset?: "copy" \| "h264" \| "h265" \| "vp9" \| "audio_mp3" \| "audio_aac" \| "audio_opus" \| "custom"; video_codec?: string; audio_codec?: string; crf?: number; speed_preset?: string; audio_bitrate?: string; metadata_title?: string; metadata_artist?: string; cover_path?: PathString }d | d{ job_id: string; output_path: PathString }d |
| dmedia_cancel_clipd | d{ job_id: string }d | d{ ok: boolean }d |
| dmedia_detect_shotsd | d{ input_path: PathString; threshold?: number }d | d{ markers: ShotMarker[] }d |
| dmedia_save_shot_markersd | d{ output_path: PathString; markers: ShotMarker[] }d | d{ output_path: PathString; marker_count: number }d |
| dmedia_generate_waveform_peaksd | d{ input_path: PathString; bucket_count?: number }d | dWaveformPeaksResponsed |
| dmedia_generate_whisper_subtitlesd | d{ job_id?: string; input_path: PathString; output_dir?: PathString; output_path?: PathString; language?: string; model?: string; task?: "transcribe" \| "translate"; output_format?: "srt" \| "vtt" \| "txt" }d | d{ job_id: string; output_path: PathString; format: "srt" \| "vtt" \| "txt" }d |
| dsubtitle_workshop_opend | d{ input_path: PathString }d | dSubtitleWorkshopOpenResponsed |
| dsubtitle_workshop_saved | d{ output_path: PathString; content: string }d | dSubtitleWorkshopSaveResponsed |

```ts
interface ShotMarker {
  timestamp_seconds: number;
  score: number;
}

interface WaveformPeak {
  index: number;
  start_seconds: number;
  end_seconds: number;
  min: number;
  max: number;
  rms: number;
}

interface WaveformPeaksResponse {
  cache_path: PathString;
  sample_rate: number;
  channel_count: number;
  bucket_count: number;
  duration_seconds: number;
  peaks: WaveformPeak[];
}

interface SubtitleWorkshopOpenResponse {
  path: PathString;
  format: "srt" | "vtt" | "ass";
  content: string;
  line_count: number;
}

interface SubtitleWorkshopSaveResponse {
  output_path: PathString;
  format: "srt" | "vtt" | "ass";
  line_count: number;
}
```
Event: dmedia:clip-progressd

```ts
interface MediaClipProgressEvent {
  schema_version: 1;
  job_id: string;
  status: "active" | "completed" | "failed" | "canceled";
  elapsed_seconds: number;
  output_path?: PathString | null;
  message: string;
  updated_at: IsoDateTime;
}
```
当前实现子集：dmedia_clip_videod 已接入 FFmpeg 的本地文件片段裁剪路径，按 manual override、managed tool、PATH 顺序解析 dffmpegd，校验输入文件存在、输出父目录可写、开始/结束秒数为非负有限数且结束大于开始。默认 dmode=copyd 调用 dffmpeg -y [-ss start] [-to end] -i <input> -c copy -progress pipe:1 -nostats <output>d；dmode=reencoded 会传入 d-c:vd、d-c:ad、可选 d-crfd 和 d-presetd，同样启用 FFmpeg machine progress 输出。dmedia_transcoded 已接入整文件本地转码子集：校验输入/输出路径，支持 copy streams、H.264、H.265、VP9、MP3、AAC、Opus 和 custom codec 预设，可写入 title/artist metadata，并可把本地封面图映射为 attached picture。两个命令都返回 djob_idd 和输出路径，运行期间会解析 dout_time_ms/out_time_us/out_timed 并发送 dmedia:clip-progressd active/completed/failed/canceled 事件；dmedia_cancel_clipd 会按 djob_idd 请求停止当前 FFmpeg child。dmedia_detect_shotsd 已接入 FFmpeg scene detection，本地校验输入文件与 d0..1d threshold，调用 dselect='gt(scene,threshold)',metadata=mode=print,showinfod，并把相邻 dpts_timed / dlavfi.scene_scored 日志解析为 marker 列表；dmedia_save_shot_markersd 可校验 d.jsond 输出路径并把已有 marker 列表保存为 d{ markers }d JSON，返回写出路径与数量。dmedia_generate_waveform_peaksd 已接入本地 FFmpeg PCM 抽取：校验本地输入文件和 d1..4096d bucket count，调用 dffmpeg -vn -ac 1 -ar 8000 -f s16le pipe:1d，Rust 侧按 bucket 计算 min/max/rms，并把结果写入 dcache/waveform/*.waveform.jsond 后返回同一结构。dmedia_generate_whisper_subtitlesd 已接入本地 Whisper CLI 子集：按 manual override、managed tool、PATH 顺序解析 dwhisperd，校验本地输入媒体、输出目录或可选 doutput_pathd 精确字幕文件路径，支持 dsrtd/dvttd/dtxtd 输出、可选 language/model 和 dtranscribed/dtranslated task，运行后通过输出目录快照返回实际生成的字幕文件；传入 doutput_pathd 时会生成到目标父目录后移动到该精确路径。缺失 Whisper 依赖会返回明确错误，不调用云服务。dsubtitle_workshop_opend 与 dsubtitle_workshop_saved 已实现本地字幕文本打开/保存子集：仅接受 d.srtd、d.vttd、d.assd，返回格式和行数；打开时支持 UTF-8、UTF-8 BOM、UTF-16LE BOM、UTF-16BE BOM 和无 BOM Windows-1252 fallback 文本，保存时写出 UTF-8；前端 Subtitle Workshop 保存路径会按输出扩展在 SRT/VTT 之间执行本地 cue 转换，并在 Save as 区域预览目标转换或 ASS 有损转换拒绝原因；ASS 仍保持原格式以避免样式丢失。Home 和 Tools > Media tools 当前提供最小表单入口，可选择源文件、输出文件、copy/reencode/transcode 参数、metadata 和 cover；profile 会在前端映射为现有 command 字段。Tools > Media tools 还提供本地 shot detection 表单、marker JSON 保存、marker times/scores 可见列表复制、waveform peaks 表单、Whisper subtitles 表单、marker 预览、完整 peak bucket 横向滚动预览、Peak width 基础密度控制、Jump to time 基础定位输入、点击 bar 后的 waveform 时间反馈和当前 bucket 高亮，以及 Subtitle Workshop 的路径选择、textarea 编辑、正文感知的大小写不敏感字面文本匹配计数、Regex toggle、Find next 选中与 Replace all、SRT/VTT 和 ASS dDialogue:d 时间字段的整体毫秒 timing shift、基于两个源/目标毫秒校准点的 SRT/VTT/ASS two-point sync、从当前选中 timed cue 起点/终点填入 Source A/B、从当前 waveform 选中时间填入 Target A/B 以及清空同步字段的本地 sync helper、SRT/VTT auto fix 和保存入口；find/replace、timing shift、two-point sync、auto fix 与 marker/cue selection 都是前端共享 helper。运行中显示 elapsed 状态并可取消；dscripts/verify-media-clip.ps1d 可显式运行已有真实 FFmpeg clip/shot/waveform 样例矩阵。更多容器/编解码组合、Whisper 真实模型矩阵、transcode metadata/cover 真实读取验收、Subtitle Workshop GBK/Shift-JIS 等 legacy code page 编码检测、完整 ASS 样式/特效语义解析/复杂 auto-fix/AI/专业级 waveform 时间轴体验和手动 UI 验收仍未完成。

### Download commands

| Command | Request | Response |
| --- | --- | --- |
| `downloads_get_settings` | `{}` | `DownloadsSettings` |
| `downloads_update_settings` | `{ max_concurrency?: number; patch?: DownloadsSettingsPatch }` | `DownloadsSettings` |
| `downloads_export_settings` | `{ output_path?: PathString }` | `{ output_path: PathString; exported_setting_count: number; settings: DownloadsSettings }` |
| `downloads_import_settings` | `{ input_path: PathString }` | `{ input_path: PathString; imported_setting_count: number; settings: DownloadsSettings }` |
| ddownloads_get_local_summaryd | d{}d | dDownloadsLocalSummaryResponse metadata only; includes_source_urls=false, includes_output_file_bodies=false, includes_log_bodies=falsed |
| ddownloads_export_local_summaryd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_kind_catalogd | d{}d | dDownloadsKindCatalogResponse metadata only; includes_source_urls=false, executes_downloads=falsed |
| ddownloads_export_kind_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_option_catalogd | d{}d | dDownloadsOptionCatalogResponse metadata only; includes_task_values=false, executes_downloads=falsed |
| ddownloads_export_option_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_status_catalogd | d{}d | dDownloadsStatusCatalogResponse metadata only; includes_task_values=false, mutates_tasks=false, executes_downloads=falsed |
| ddownloads_export_status_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_error_catalogd | d{}d | dDownloadsErrorCatalogResponse metadata only; includes_task_values=false, includes_error_messages=false, mutates_tasks=false, executes_downloads=falsed |
| ddownloads_export_error_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_integrity_catalogd | d{}d | dDownloadsIntegrityCatalogResponse metadata only; includes_task_values=false, calculates_hashes=false, executes_downloads=falsed |
| ddownloads_export_integrity_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_cleanup_catalogd | d{}d | dDownloadsCleanupCatalogResponse metadata only; includes_task_values=false, mutates_tasks=false, deletes_files=false, executes_downloads=falsed |
| ddownloads_export_cleanup_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_log_catalogd | d{}d | dDownloadsLogCatalogResponse metadata only; includes_log_bodies=false, reads_log_bodies=false, deletes_log_files=false, writes_log_files=falsed |
| ddownloads_export_log_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_event_catalogd | d{}d | dDownloadsEventCatalogResponse metadata only; emits_events=false, mutates_tasks=false, executes_downloads=falsed |
| ddownloads_export_event_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_queue_catalogd | d{}d | dDownloadsQueueCatalogResponse metadata only; reads_task_records=false, mutates_tasks=false, starts_downloads=false, stops_downloads=false, executes_downloads=falsed |
| ddownloads_export_queue_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_retry_catalogd | d{}d | dDownloadsRetryCatalogResponse metadata only; includes_task_values=false, includes_error_messages=false, mutates_tasks=false, starts_downloads=false, executes_downloads=falsed |
| ddownloads_export_retry_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_get_source_catalogd | d{}d | dDownloadsSourceCatalogResponse metadata only; includes_source_urls=false, probes_remote_metadata=false, queues_download_tasks=false, executes_downloads=falsed |
| ddownloads_export_source_catalogd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| ddownloads_created | dCreateDownloadRequestd | dDownloadTaskd |
| ddownloads_create_batchd | d{ items: CreateDownloadRequest[] }d | d{ created: DownloadTask[]; failed: BatchFailure[] }d |
| ddownloads_listd | dListDownloadsRequestd | d{ tasks: DownloadTask[]; next_cursor?: string }d |
| ddownloads_getd | d{ id: Id }d | dDownloadTaskd |
| ddownloads_startd | d{ id: Id }d | dDownloadTaskd |
| ddownloads_paused | d{ id: Id }d | dDownloadTaskd |
| ddownloads_resumed | d{ id: Id }d | dDownloadTaskd |
| ddownloads_retryd | d{ id: Id }d | dDownloadTaskd |
| ddownloads_canceld | d{ id: Id; keep_partial: boolean }d | dDownloadTaskd |
| ddownloads_deleted | d{ id: Id; delete_files: boolean }d | d{ deleted: true }d |
| ddownloads_clear_completedd | d{ archive: boolean }d | d{ affected: number }d |
| ddownloads_clear_archivedd | d{}d | d{ affected: number }d |
| ddownloads_archived | d{ id: Id }d | dDownloadTaskd |
| ddownloads_restored | d{ id: Id }d | dDownloadTaskd |
| ddownloads_reorderd | d{ ordered_ids: Id[] }d | d{ tasks: DownloadTask[] }d |
| ddownloads_get_logsd | d{ id: Id; cursor?: number; limit?: number; search?: string }d | d{ lines: string[]; cursor: number; next_cursor?: number; total_lines: number; matched_lines: number }d |

```ts
interface CreateDownloadRequest {
  source_url?: UrlString;
  source_file?: PathString;
  kind?: DownloadKind;
  output_dir?: PathString;
  output_path?: PathString;
  title_override?: string;
  user_agent?: string;
  referer?: UrlString;
  proxy?: string;
  rate_limit?: string;
  live_from_start?: boolean;
  concurrent_fragments?: number;
  options: DownloadOptions;
}

interface ListDownloadsRequest {
  status?: DownloadStatus[];
  kind?: DownloadKind[];
  platform?: string;
  query?: string;
  cursor?: string;
  limit: number;
}
```

补充：Downloads 页面可对单个任务点击 Detail，调用 `downloads_get` 刷新本地列表中的该任务记录，并在详情面板显示平台、进度、输出、网络、Cookie bucket、重试、文件摘要、任务级选项和 Integrity；Detail 还可 Open output、Reveal output、Copy summary 和 Copy JSON。Delete visible 只清理当前筛选出的本地任务记录，不删除输出文件；`downloads_archive` 可把 completed/failed/canceled 单任务归档，并在 `details_json.archived_from_status` 保存原终态，`downloads_restore` 可把 archived 任务恢复到原终态，旧归档任务缺少来源时保守恢复为 completed；`downloads_clear_archived` 只删除 archived 本地任务记录，不删除输出文件或 completed/failed/canceled 历史；`downloads_bulk_action` 当前支持 `start`、`pause`、`resume`、`retry`、`cancel`、`archive`、`restore` 和 `delete`，对每个 id 返回成功任务或逐项失败原因；`pause` / `cancel` 会请求停止运行中的任务，`delete` 只删除本地任务记录并发出列表变化事件。`downloads_get_local_summary` / `downloads_export_local_summary` 和 CLI `downloads-summary` / `export-downloads-summary` 只汇总或导出本地任务统计与日志文件 inventory：status/kind/platform/error/output/log/auth/network-option counts、retry totals、byte/file totals、timestamp coverage 和 `.log` 文件数量/大小/最近修改时间；`downloads_get_kind_catalog` / `downloads_export_kind_catalog` 和 CLI `downloads-kind-catalog` / `export-downloads-kind-catalog` 只列出本地 task-kind capability metadata；`downloads_get_option_catalog` / `downloads_export_option_catalog` 和 CLI `downloads-option-catalog` / `export-downloads-option-catalog` 只列出本地 task/default option capability metadata；`downloads_get_status_catalog` / `downloads_export_status_catalog` 和 CLI `downloads-status-catalog` / `export-downloads-status-catalog` 只列出本地 task status/action capability metadata；`downloads_get_error_catalog` / `downloads_export_error_catalog` 和 CLI `downloads-error-catalog` / `export-downloads-error-catalog` 只列出本地 error classification/retry policy metadata；`downloads_get_integrity_catalog` / `downloads_export_integrity_catalog` 和 CLI `downloads-integrity-catalog` / `export-downloads-integrity-catalog` 只列出本地 SHA-256 integrity capability metadata；`downloads_get_cleanup_catalog` / `downloads_export_cleanup_catalog` 和 CLI `downloads-cleanup-catalog` / `export-downloads-cleanup-catalog` 只列出本地 cleanup command capability metadata；`downloads_get_log_catalog` / `downloads_export_log_catalog` 和 CLI `downloads-log-catalog` / `export-downloads-log-catalog` 只列出本地 download-log capability metadata；`downloads_get_event_catalog` / `downloads_export_event_catalog` 和 CLI `downloads-event-catalog` / `export-downloads-event-catalog` 只列出本地 download event contract metadata；`downloads_get_queue_catalog` / `downloads_export_queue_catalog` 和 CLI `downloads-queue-catalog` / `export-downloads-queue-catalog` 只列出本地 download queue/scheduler capability metadata；`downloads_get_retry_catalog` / `downloads_export_retry_catalog` 和 CLI `downloads-retry-catalog` / `export-downloads-retry-catalog` 只列出本地 retry capability metadata；`downloads_get_source_catalog` / `downloads_export_source_catalog` 和 CLI `downloads-source-catalog` / `export-downloads-source-catalog` 只列出本地 source entrypoint capability metadata。Downloads metadata/export 响应都显式不返回逐任务 source URL、下载文件正文、日志正文、Cookie 值或 Authorization 值，catalog 响应不会读取 task values、task error messages、列出现有日志、读取 log bodies、发出事件、启动下载、mutate tasks、删除文件、执行 cleanup、写日志、计算 hash、执行 retry/backoff、启动或停止 worker、探测远端站点、创建队列任务或声明 real matrix 完成。任务日志抽屉会读取 `downloads_get_logs` 可用可选 `cursor`、`limit` 和 `search` 返回分页日志行、`next_cursor`、`total_lines` 和 `matched_lines`；Downloads UI 当前每次加载 200 行，可按后端 search 重置分页并用 Load more 继续读取。旧前端 wrapper 仍可只读取 `lines`。结构化日志等级/source 和 SQLite 日志表仍未实现。

前端本地补充：Downloads 页的 queued/active/failed/retryable/has-output 快速筛选、operational 下拉（errors/retryable/with output）、filter preset 保存/套用/删除和 Copy sources / Copy outputs / Copy ids/titles/statuses/kinds/platforms/errors/created/updated/SHA-256 等剪贴板操作均只消费 `downloads_list` 已返回的本地任务数组。Preset 存在浏览器 `localStorage`，不写入 Rust 配置、不会发出 `settings:changed`，也不新增后端 command/event；复制动作只复制当前可见任务的 `source_url`、`output_path`、`output_dir`、id/title/status/kind/platform/last_error/created_at/updated_at、任务级选项和 `details_json` metadata，不读取文件内容，也不删除任务或输出文件。Downloads 搜索会匹配 task id、title、URL、kind、platform、输出、错误、网络/Auth 字段、任务级选项、metadata 和 nested `details_json` values such as SHA-256 hashes。

### Tool commands

| Command | Request | Response |
| --- | --- | --- |
| dtools_get_statusd | d{}d | d{ tools: ToolStatus[] }d |
| dtools_get_local_summaryd | d{}d | d{ generated_at; tool_count; installed_count; missing_count; error_count; managed_count; updatable_count; path_override_count; download_source_count; install_error_count; source_hash_count; managed_file_count; managed_total_size_bytes; tools[]; configured_sources[]; managed_files[]; review_notes[] }d |
| dtools_export_local_summaryd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dtools_export_settingsd | d{ output_path?: PathString }d | d{ output_path; path_override_count; download_source_count; install_error_count }d |
| dtools_import_settingsd | d{ input_path: PathString }d | d{ input_path; path_override_count; download_source_count; install_error_count; skipped_path_override_count; skipped_download_source_count }d |
| dplatforms_get_matrixd | d{}d | d{ schema_version: 1; platforms: PlatformMatrixEntry[] }d |
| dplatforms_get_route_samplesd | d{}d | d{ schema_version: 1; samples: PlatformRouteSample[]; pending_real_site_verification: true }d |
| dplatforms_get_local_summaryd | d{}d | d{ schema_version; generated_at; platform_count; route_sample_count; implemented_count; partial_count; local_draft_count; classifier_only_count; category_counts[]; route_counts[]; status_counts[]; platforms[]; route_samples[]; pending_real_site_verification; executes_network_checks: false; creates_download_tasks: false; includes_cookie_values: false; includes_authorization_values: false; review_notes[] }d |
| dplatforms_export_matrixd | d{ output_path?: PathString }d | d{ archive_path; platform_count; pending_real_site_verification }d |
| dplatforms_export_route_samplesd | d{ output_path?: PathString }d | d{ archive_path; sample_count; pending_real_site_verification }d |
| dplatforms_export_local_summaryd | d{ output_path?: PathString }d | d{ archive_path; platform_count; route_sample_count; pending_real_site_verification }d |
| dtools_installd | d{ id: ToolId }d | dToolStatusd |
| dtools_updated | d{ id: ToolId }d | dToolStatusd |
| dtools_set_pathd | d{ id: ToolId; path: PathString }d | dToolStatusd |
| dtools_clear_pathd | d{ id: ToolId }d | dToolStatusd |

当前实现子集：dtools_get_statusd 已返回 yt-dlp、FFmpeg、gallery-dl、torrent-engine、Whisper 的基础状态；dplatforms_get_matrixd 返回本地平台路由/能力声明矩阵，覆盖目标媒体平台、direct-file、generic yt-dlp、gallery-dl、torrent/magnet、direct P2P、课程平台、Telegram、本地 gallery helper 标签和 classifier-only 亚洲平台标签；该矩阵只声明当前路由、实现状态、证据和限制，不代表真实站点样例已通过；Tools 前端可 Copy matrix 复制当前 route/status/evidence/limitations 摘要，也可复制当前可见 names/routes/categories/statuses/evidence/limits 并导出 diagnostics JSON；dplatforms_get_route_samplesd 返回同一批原创本地 route sample URL 清单，CLI dplatform-route-samplesd 也可输出该清单；dplatforms_export_route_samplesd / CLI dexport-platform-route-samples [output.json]d 可把同一清单写入 diagnostics 下的 dplatform-route-samples-*.jsond 或指定 JSON 输出路径，供最终人工样例矩阵准备；Tools 前端 route sample check 从该 command 加载样例并复用 dclassifyUrlCandidated 展示 platform、intent 与 suggested task kind，不调用网络，Tauri command 不可用时才回退前端内置清单；当前筛选样例可 Copy URLs 到剪贴板，当前可见样例可复制 labels/platforms/kinds/intents，也可 Export samples、Open sample 或 Queue/Queue shown 创建本地 queued 草稿；dplatforms_export_matrixd 可把当前 route/status/evidence/limitations 矩阵写入 app diagnostics 下的 dplatform-route-matrix-*.jsond 或指定 JSON 输出路径，safe diagnostics bundle 也会包含 dplatform-route-samples.jsond 作为本地样例清单，并明确标记真实站点验收仍未完成。工具检测顺序为 ddata/config/tools.jsond manual override、ddata/dependencies/<tool>/<executable>d，再回退到 PATH。检测到可执行文件后会用无 shell 的短超时命令读取版本，版本读取失败时保留路径并返回 derrord 状态和错误摘要。dtools_set_pathd 会验证工具 id、路径存在、是文件且文件名匹配目标工具后保存 override；dtools_clear_pathd 会移除 override 并重新检测。dtools_get_download_sourcesd / dtools_set_download_sourced / dtools_clear_download_sourced 会读写 per-tool d{ url, sha256, archive_member? }d 下载源，Settings > Dependencies 也提供同一表单；保存时校验 http(s) URL、64 位 SHA-256 和安全相对 archive member，清除只移除配置不删除已下载工具。Dependencies UI 可复制当前 tool ids、executable paths、versions、configured source URLs 和 SHA-256 hashes；`tools_get_local_summary` / `tools_export_local_summary` 与 CLI `tools-summary` / `export-tools-summary [output.json]` 会汇总或导出本地 tool 状态、path override、configured sources、source hashes、install errors、managed dependency file metadata 和 review notes；这些剪贴板/helper/export 只读取已加载或本地状态，不安装、更新、下载、执行工具或校验 artifact。dtools_installd、dtools_check_updated 与 dtools_updated 已接入命令和设置页按钮；后端会发出 dtool:install-progressd 阶段事件，下载 artifact 时事件带可选 ddownloaded_bytesd、dtotal_bytesd 和 dpercentd，前端按钮会在当前工具安装/更新请求期间进入 dInstallingd 或 dUpdatingd 且禁用，并显示 starting/downloading/verifying/installing/completed/failed 阶段消息、百分比和字节数，完成或失败后刷新 dtools_get_statusd 并显示 toast。如果 ddata/config/tools.jsond 中存在 ddownload_sources[tool] = { url, sha256, archive_member? }d，会用内置 HTTP 客户端下载到 ddata/dependencies/<tool>/<executable>.downloadd，写入 d.sha256d sidecar，再做 SHA-256 校验，匹配后提升为 managed executable，失败时删除坏文件并持久化明确 derrord。如果没有配置 source，但 staged 文件已存在，也会执行同样的安装校验/提升流程。dtools_check_updated 仅在用户点击时联网检查 managed dependency 的内置 latest source，返回 current/latest/update_available/message；版本无法可靠比较时 dupdate_availabled 为 null 并给出原因。dtools_updated 仅更新 managed executable：下载新版 staged artifact 后先校验 SHA-256，校验通过才替换旧文件，校验失败会保留旧 managed 文件并记录错误。Windows x64 的 dyt-dlpd 会读取 yt-dlp 官方 GitHub latest release、下载 dSHA2-256SUMSd，解析 dyt-dlp.exed 的 URL 与 SHA-256 后执行下载/校验/提升；Windows x64 的 FFmpeg 会读取 BtbN FFmpeg-Builds latest release、下载 dchecksums.sha256d，解析 dffmpeg-master-latest-win64-lgpl.zipd 的 URL 与 SHA-256，校验 zip 后提取 dbin/ffmpeg.exed 作为 staged executable；Windows x64 的 gallery-dl 会读取 Codeberg latest release，并用 Scoop manifest 的同版本 URL/SHA-256 做交叉检查后下载 dgallery-dl.exed。当前仍未实现其它平台的内置 catalog、独立 dupdatingd 状态枚举、真实 UI 安装/更新检查验收和完整手动更新验收。

补充：dplatforms_get_local_summaryd / dplatforms_export_local_summaryd 与 CLI dplatforms-summaryd / dexport-platforms-summary [output.json]d 汇总或导出同一本地 support matrix 与 route sample metadata，包含 status/category/route 计数、平台行、样例行和 review notes；响应显式标记 dexecutes_network_checksd、dcreates_download_tasksd、dincludes_cookie_valuesd 和 dincludes_authorization_valuesd 为 false。Tools > Support matrix 可复制 summary/JSON/status/category/route counts/notes，并可 Save as、Export summary、Open summary、Reveal summary；该能力不探测真实站点、不执行下载器、不读取浏览器 storage、不创建任务、不导出 Cookie/Auth 值，也不证明 live-site metadata、login 或 download 成功。

### Cookie commands

| Command | Request | Response |
| --- | --- | --- |
| dcookies_list_bucketsd | d{ platform?: string }d | d{ buckets: CookieBucket[] }d |
| dcookies_importd | dCookieImportRequestd | dCookieBucketd |
| dcookies_exportd | d{ bucket_id: Id; output_path: PathString }d | d{ path: PathString }d |
| dcookies_export_bucketsd | d{ output_path?: PathString; bucket_ids?: Id[] }d | dCookieBucketsExportResponse; includes_cookie_values=true, includes_authorization_values=false, executes_network_requests=falsed |
| dcookies_import_bucketsd | d{ input_path: PathString }d | dCookieBucketsImportResponse; merged local buckets onlyd |
| dcookies_delete_bucketd | d{ bucket_id: Id }d | d{ deleted: true }d |
| dcookies_rename_bucketd | d{ bucket_id: Id; name: string }d | dCookieBucketd |
| dcookies_match_urld | d{ url: UrlString }d | d{ buckets: CookieBucket[] }d |
| dcookies_testd | d{ bucket_id: Id; url?: UrlString }d | dCookieBucketd |
| dcookies_test_manyd | d{ bucket_ids: Id[]; url?: UrlString }d | d{ buckets: CookieBucket[]; failed: { id: Id; error: string }[] }d |
| dcookies_cleard | d{ bucket_ids?: Id[]; platform?: string }d | d{ cleared: number }d |
| dcookies_get_local_summaryd | d{}d | dCookieAuthLocalSummaryResponse metadata only; includes_cookie_values=false, includes_authorization_values=falsed |
| dcookies_export_local_summaryd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |

```ts
interface CookieImportRequest {
  name: string;
  platform?: string;
  source:
    | { type: "paste"; text: string }
    | { type: "file"; path: PathString }
    | { type: "browser_extension"; payload_ref: Id };
}
```
当前实现子集：dcookies_importd 支持粘贴 Netscape cookie rows、读取本地 cookie 文件，以及从浏览器扩展 staging payload id 导入；导入时会逐行校验非注释 Netscape rows，接受 d#HttpOnly_d 行，并对格式列数、TRUE/FALSE 字段、domain/path/name 和 expires 时间戳返回具体行号错误；成功导入后保存到 ddata/cookies/<bucket>.cookies.txtd，并把元数据写入 ddata/cookies/buckets.jsond；浏览器扩展 popup 的 Capture cookies 会把当前页最近捕获的 Cookie header 通过 loopback bridge dPOST /v1/extension/cookiesd 写成 ddata/extension/cookie-payloads/<payload_ref>.cookies.txtd，Settings > Cookies 可输入该 payload id 导入为 bucket，Settings > Cookies 和 Settings > Browser Extension 的 staged Cookie payload 列表也可单项 Import 或 Import filtered；这些入口只调用 `cookies_import` 创建 Cookie bucket，不展示 Cookie 明文，也不删除 staged payload；dcookies_list_bucketsd 返回 bucket 元数据，不返回 cookie 明文；dcookies_rename_bucketd、dcookies_delete_bucketd、dcookies_exportd、dcookies_export_bucketsd、dcookies_import_bucketsd、dcookies_match_urld、dcookies_testd、dcookies_test_manyd、dcookies_cleard、dcookies_get_local_summaryd 和 dcookies_export_local_summaryd 已接入 Settings > Cookies 面板。dcookies_export_bucketsd / dcookies_import_bucketsd 是显式 Cookie bucket backup/restore：导出 FetchDock JSON envelope 或指定 bucket ids，包含 managed Cookie row values 以便恢复账号 bucket，导入按 bucket id 合并并跳过重复项、重新规范化 Netscape rows、写入本地 managed `.cookies.txt` 文件并把 health 重置为 untested；该路径不包含 Authorization header values、staged payload bodies、browser storage、pairing token、keychain items 或 live login session，也不测试账号、不访问网站、不启动下载。dcookies_get_local_summaryd / dcookies_export_local_summaryd 只聚合 Cookie bucket metadata、row counts、platform/source/health/expiry/storage 分布、staged extension Cookie/Auth payload inventory、Twitter/X manual Cookie fallback public state 和 Bilibili Cookie bucket status；响应显式包含 dincludes_cookie_values=falsed 与 dincludes_authorization_values=falsed，不返回 Cookie row values、Authorization header values、payload bodies、pairing token 或 browser storage。前端对 dcookies_list_bucketsd 返回结果提供本地搜索、health 过滤、filtered bucket ids/storage paths/domain hints 复制、当前筛选结果一键选择/取消、多选清空、Test selected / Test shown 通过 dcookies_test_manyd 一次刷新本地 health metadata，以及基于已保存 platform 元数据的批量清空；这些不展示 Cookie 明文，复制动作也只复制 bucket metadata。dcookies_match_urld 当前按 URL host 匹配导入 cookie 的 domain hints，匹配结果可直接设为 Home 下一次任务的 dcookie_bucket_idd；dcookies_testd / dcookies_test_manyd 会读取本地 bucket 文件、重算 rows/domain hints、按可选 URL 做 domain 匹配，并根据 expires 字段写回 dvalidd、dexpiredd 或 derrord 与 dlast_tested_atd，批量路径返回逐项 dfailedd 但不会中断其它 bucket。Home 任务创建可选择 dcookie_bucket_idd，非 direct-file 的 yt-dlp 执行路径会把 bucket 文件传给 d--cookiesd。secure/path 完整还原、平台优先级、加密/keychain、真实平台账号态和权限不足状态仍未完成。

### Bilibili auth commands

| Command | Request | Response |
| --- | --- | --- |
| dbilibili_auth_start_qrd | d{}d | d{ session_id: Id; qr_image_path: PathString; expires_at: IsoDateTime }d |
| dbilibili_auth_poll_qrd | d{ session_id: Id }d | d{ status: "pending" | "confirmed" | "expired"; bucket?: CookieBucket }d |
| dbilibili_auth_start_smsd | d{ phone: string; country_code: string }d | d{ session_id: Id }d |
| dbilibili_auth_complete_smsd | d{ session_id: Id; code: string }d | dCookieBucketd |
| dbilibili_account_statusd | d{}d | d{ schema_version: 1; status: string; display_name?: string; cookie_bucket_id?: Id; cookie_bucket_name?: string; cookie_health?: string; imported_watch_later_count: number; imported_history_count: number; last_imported_at?: IsoDateTime; message: string }d |
| dbilibili_import_watch_laterd | d{ bucket_id: Id }d | d{ items: MediaPreview[] }d |
| dbilibili_import_historyd | d{ bucket_id: Id; limit: number }d | d{ items: MediaPreview[] }d |
| dbilibili_import_manifestd | d{ manifest_path: PathString; collection: "watch_later" | "history" | "manifest" }d | d{ items: BilibiliImportItem[] }d |
| dbilibili_export_manifestd | d{ output_path?: PathString; collection?: "all" \| "watch_later" \| "history"; ids?: Id[] }d | d{ schema_version: 1; output_path: PathString; exported_count: number; collection: string }d |
| dbilibili_list_importedd | d{}d | d{ items: BilibiliImportItem[] }d |
| dbilibili_delete_imported_itemd | d{ id: Id }d | d{ deleted: boolean }d |
| dbilibili_delete_imported_itemsd | d{ ids: Id[] }d | d{ deleted: Id[]; failed: BulkDownloadFailure[] }d |
| dbilibili_clear_importedd | d{ collection?: "all" | "watch_later" | "history" }d | d{ cleared: number }d |
| dbilibili_queue_imported_itemd | d{ id: Id }d | dDownloadTaskd |
| dbilibili_queue_imported_itemsd | d{ ids: Id[] }d | d{ created: DownloadTask[]; skipped: { id: Id; reason: string }[] }d |

当前 Bilibili 实现子集：首页 URL 分类本地识别 b23 短链、视频、番剧/影视、课程、UP 主/空间、收藏夹/合集、稍后再看、历史和每周必看等草稿类型，但不做在线解析；真实 QR/SMS/webview 登录、dbilibili_import_watch_laterd 和 dbilibili_import_historyd API 拉取仍未接入；dbilibili_account_statusd 当前是本地状态摘要，会根据 Bilibili cookie bucket 或 bilibili.com/b23.tv domain hints 返回 dnot_configuredd、dcookie_unverifiedd 或 dcookie_availabled，并汇总本地 watch later/history manifest 计数，不声明真实账号登录成功；当前提供本地 manifest 导入/导出路径，dbilibili_import_manifestd 读取转换后的 JSON 数组或 d{ items }d，每项包含 dtitled、dsource_urld、可选 downerd、dduration_secondsd、dadded_atd，写入 ddata/bilibili/imports.jsond；collection 传入 dwatch_laterd 或 dhistoryd 会把导入条目归入指定列表，传入 dmanifestd 会保留每个 manifest item 自带的 collection，便于回导 dbilibili_export_manifestd 输出的 dalld bundle；dbilibili_export_manifestd 可按 dalld、dwatch_laterd、dhistoryd 或显式 ids 把当前本地导入索引写出为 FetchDock JSON manifest，不导出 Cookie、账号 session、下载任务或输出文件；dbilibili_list_importedd 返回本地条目；dbilibili_delete_imported_itemd 只移除单个本地导入索引条目，dbilibili_delete_imported_itemsd 可批量移除传入 ids 并返回 d{ deleted, failed }d，dbilibili_clear_importedd 可按 dalld、dwatch_laterd 或 dhistoryd 清空本地导入索引，两者都不删除下载任务或 Cookie bucket；dbilibili_queue_imported_itemd 将单个条目创建为 dvideo/queuedd 下载任务并把 dcreated_task_idd 回写到本地导入条目，dbilibili_queue_imported_itemsd 会把传入 id 批量创建为 dvideo/queuedd 任务、回写成功项 dcreated_task_idd，并返回重复/缺失 id 的 skipped 列表。Settings > Cookies 当前提供本地 Bilibili status、manifest 导入、manifest 导出 Save/Open/Reveal、列表、前端本地搜索/collection 过滤、all/watch later/history 快速 collection 过滤、当前可见导入项 Copy URLs 和 Copy task ids 剪贴板操作、单项删除、通过 dbilibili_delete_imported_itemsd Remove filtered 当前筛选导入项、按当前 collection/全部清空、单项入队和当前筛选结果批量入队入口；这些本地导入索引写入和入队回写会发出 dbilibili:imports_changedd，前端同步导入列表和本地账号摘要；Bilibili transfers 区只用导入条目中的 dcreated_task_idd 关联本地 download task，支持文本/status 过滤和 Start/Pause/Resume/Retry/Cancel/Archive/Restore shown 批量控制，不删除导入索引、Cookie bucket 或输出文件。

### Plugin commands

| Command | Request | Response |
| --- | --- | --- |
| dplugins_listd | d{}d | d{ plugins: PluginInfo[] }d |
| dplugins_list_marketplaced | d{}d | d{ entries: PluginMarketplaceEntry[] }d |
| dplugins_import_marketplaced | d{ registry_path: PathString }d | d{ entries: PluginMarketplaceEntry[] }d |
| dplugins_export_marketplaced | d{ output_path?: PathString }d | d{ archive_path: PathString }d |
| dplugins_export_registryd | d{ output_path?: PathString }d | d{ output_path: PathString; exported_state_count: number }d |
| dplugins_export_settingsd | d{ output_path?: PathString; ids?: Id[] }d | d{ output_path: PathString; exported_settings_count: number; skipped_plugin_count: number }d |
| dplugins_import_settingsd | d{ input_path: PathString }d | d{ imported_settings_count: number; skipped_settings_count: number; settings: PluginSettingsResponse[] }d |
| dplugins_import_registryd | d{ input_path: PathString }d | d{ imported_state_count: number; skipped_state_count: number; registry: PluginRegistry; plugins: PluginInfo[] }d |
| dplugins_delete_marketplace_entryd | d{ id: Id }d | d{ deleted: boolean }d |
| dplugins_delete_marketplace_entriesd | d{ ids: Id[] }d | d{ deleted: Id[]; failed: { id: Id; error: string }[] }d |
| dplugins_clear_marketplaced | d{}d | d{ cleared: number }d |
| dplugins_installd | d{ manifest_path: PathString }d | dPluginInfod |
| dplugins_install_failure_sampled | d{}d | dPluginInfod |
| dplugins_enabled | d{ id: Id }d | dPluginInfod |
| dplugins_disabled | d{ id: Id }d | dPluginInfod |
| dplugins_set_state_manyd | d{ ids: Id[]; state: "enabled" | "disabled" }d | d{ plugins: PluginInfo[]; failed: BulkDownloadFailure[] }d |
| dplugins_check_hostd | d{ id: Id }d | dPluginInfod |
| dplugins_check_all_hostsd | d{}d | d{ checked: number; plugins: PluginInfo[] }d |
| dplugins_uninstalld | d{ id: Id; remove_data: boolean }d | d{ uninstalled: true }d |
| dplugins_update_from_marketplaced | d{ id: Id }d | dPluginInfod |
| dplugins_update_all_from_marketplaced | d{}d | d{ checked: number; updated: number; plugins: PluginInfo[] }d |
| dplugins_install_missing_from_marketplaced | d{}d | d{ checked: number; installed: number; plugins: PluginInfo[] }d |
| dplugins_run_commandd | d{ id: Id; command: string; payload: Record<string, unknown> }d | d{ schema_version: 1; id: Id; command: string; status: "queued_local"; message: string; result: unknown; log_path: PathString; data_dir: PathString }d |
| dplugins_list_command_logsd | d{ id: Id; limit?: number }d | d{ schema_version: 1; id: Id; commands: PluginCommandLogEntry[]; log_path: PathString }d |
| dplugins_clear_command_logsd | d{ id: Id }d | d{ cleared: boolean; log_path: PathString }d |
| dplugins_list_activityd | d{ id: Id; limit?: number }d | d{ schema_version: 1; id: Id; activity: PluginActivityLogEntry[]; log_path: PathString }d |
| dplugins_clear_activityd | d{ id: Id }d | d{ cleared: boolean; log_path: PathString }d |
| dplugins_emit_eventd | d{ id: Id; event: string; payload: Record<string, unknown> }d | d{ schema_version: 1; id: Id; event: string; status: "recorded_local"; message: string; log_path: PathString; data_dir: PathString }d |
| dplugins_list_eventsd | d{ id: Id; limit?: number }d | d{ schema_version: 1; id: Id; events: PluginEventLogEntry[]; log_path: PathString }d |
| dplugins_clear_eventsd | d{ id: Id }d | d{ cleared: boolean; log_path: PathString }d |
| dplugins_clear_logs_manyd | d{ ids: Id[]; kind: "commands" | "events" | "activity" }d | d{ cleared: Id[]; failed: BulkDownloadFailure[] }d |
| dplugins_get_settingsd | d{ id: Id }d | d{ schema_version: 1; id: Id; settings: Record<string, unknown>; data_dir: PathString }d |
| dplugins_update_settingsd | d{ id: Id; patch: Record<string, unknown> }d | d{ schema_version: 1; id: Id; settings: Record<string, unknown>; data_dir: PathString }d |
| dplugins_get_data_dird | d{ id: Id }d | d{ schema_version: 1; id: Id; data_dir: PathString }d |
| dapp_get_local_plugin_trust_summaryd | d{}d | dLocalPluginTrustSummaryResponsed |
| dapp_export_local_plugin_trust_summaryd | d{ output_path?: PathString }d | d{ archive_path: PathString }d |

当前 Plugin 实现子集：dplugins_listd 会扫描 ddata/plugins/installed/*/plugin.jsond 并合并 ddata/plugins/registry.jsond 中的状态；dplugins_installd 当前只支持本地 manifest 文件路径或包含 dplugin.jsond 的本地目录，会校验 id、display_name、version、abi_version、library_path、entrypoint、capabilities、permissions、commands、events、nav_items 和 i18n 元数据，并把 manifest 复制到 ddata/plugins/installed/<id>/plugin.jsond；若 manifest 声明相对 dlibrary_pathd 且本地文件存在，会一并复制到 managed plugin 目录。dplugins_install_failure_sampled 会在本地 data 目录生成一个声明缺失动态库和 permissions 示例的 sample manifest，再复用同一安装/preflight 路径返回 dfailedd 插件状态，用于验证失败不崩溃展示。安装、更新、启用、dplugins_check_hostd 和 dplugins_check_all_hostsd 会执行安全 preflight：校验 host ABI、库文件存在性和当前平台扩展名，只回传 dmanifest_onlyd / dready_locald / dfailedd / dincompatibled，不会加载或执行动态库；批量检查返回 checked 计数和刷新后的 installed plugin 列表；dplugins_uninstalld 会删除 managed manifest 目录，并可按请求删除 ddata/plugins/data/<id>d。dplugins_get_settingsd / dplugins_update_settingsd / dplugins_get_data_dird 已实现本地 settings/data 子集：为已安装 manifest entry 创建 ddata/plugins/data/<id>d，读写 dsettings.jsond JSON object，并允许以 dnulld 删除 key。dplugins_run_commandd 已实现安全本地记录通道：仅允许 enabled 插件调用 manifest dcommandsd 声明的 command，payload 必须是 JSON object，调用写入 ddata/plugins/data/<id>/command-calls.jsonld 并返回 dqueued_locald；dplugins_list_command_logsd 可读取同一 JSONL 的最近调用记录并跳过坏行，dplugins_clear_command_logsd 只删除当前插件的 command-calls JSONL；dplugins_emit_eventd 仅允许 enabled 插件记录 manifest deventsd 声明的 event，payload 必须是 JSON object，写入 ddata/plugins/data/<id>/events.jsonld 并返回 drecorded_locald，桌面 runtime 会同步发出统一 dtoast:showd 反馈事件，但不会加载或执行动态库；dplugins_list_eventsd 可读取同一 JSONL 的最近记录并跳过坏行，dplugins_clear_eventsd 只删除当前插件的 events JSONL；dplugins_list_activityd 可读取 ddata/plugins/data/<id>/activity.jsonld 中的 install/update/preflight activity，dplugins_clear_activityd 只删除当前插件 activity JSONL，不删除 manifest、settings、command/event logs 或 data 目录。前端 Plugins 页面已接入本地 manifest 安装、刷新、启用/禁用、通过 dplugins_set_state_manyd 按当前筛选结果批量启用/禁用本地 registry 状态、卸载、单插件和批量 host preflight 检查、按 name/id/capability/permission/command/event/i18n/path 搜索已安装插件、按 state 过滤、复制当前筛选 installed plugin manifest paths/ids/dynamic library paths/capabilities/permissions/i18n metadata、JSON settings 编辑、基础 dsettings_schemad 表单（顶层 object properties 的 string/number/integer/boolean/enum 子集，以及 object/array JSON textarea）、安全 command 调用、最近 command/event/activity log 刷新、本地日志搜索、单插件 command/event/activity log 清空、已加载 command/event/activity log Copy summary / Copy JSON（command/event JSON 只复制 payload shape metadata，不复制 payload values），以及通过 dplugins_clear_logs_manyd 按当前插件筛选结果批量 Clear shown commands/activity/events；dplugins_import_marketplaced 可导入本地 marketplace JSON 数组或 d{ entries }d，entry 包含 didd、dnamed、dmanifest_pathd、可选 dversiond/ddescriptiond/dsourced/dsha256d/dsignatured/dsignature_urld/dcapabilitiesd/dpermissionsd，后端会校验 manifest_path 并保存到 ddata/plugins/marketplace.jsond；SHA-256、signature、capabilities 和 permissions 字段只作为本地 review metadata 透传；若 version、description、capabilities 或 permissions 缺失，会从 referenced manifest 回填用于本地审阅，不在导入时验签、授权或信任放行；dplugins_export_marketplaced 可把当前本地 marketplace registry 和 review metadata 导出为 FetchDock JSON 文件；dplugins_export_registryd 可把本地 ddata/plugins/registry.jsond 状态导出为 dkind=fetchdock.plugin_registryd 的 FetchDock JSON envelope，dplugins_import_registryd 可从 envelope 或 raw registry JSON 恢复已安装 manifest 的 registry 状态并跳过缺失插件；该导入不安装 manifest、不复制 plugin data/settings、不导入 marketplace、不执行动态库、不验签或授予权限；dplugins_export_settingsd 可把已安装插件的 ddata/plugins/data/<id>/settings.jsond object 显式导出为 dkind=fetchdock.plugin_settingsd 的 FetchDock JSON envelope，dplugins_import_settingsd 可从 envelope 或 raw settings object 恢复仍已安装 manifest 的 settings 并跳过缺失 manifest 或非 object settings；该 settings 备份不复制 plugin data files、manifest、marketplace、logs，不执行动态库、不验签、不授予权限，也不会自动进入 diagnostics bundle；dplugins_delete_marketplace_entryd / dplugins_delete_marketplace_entriesd / dplugins_clear_marketplaced 可只清理本地 marketplace registry 条目而不卸载已安装插件、settings 或 data；前端可按 entry name/id/source/hash/signature/capability/permission/manifest 搜索 marketplace 条目并安装 manifest、复制当前可见 marketplace manifest paths/source URLs/ids/names/versions/SHA-256/signature/signature URLs/capabilities/permissions、导出当前本地 marketplace registry、删除单个 entry、通过 dplugins_delete_marketplace_entriesd Remove filtered 清理当前筛选 entry 或清空本地 marketplace；dplugins_update_from_marketplaced 会从已导入 marketplace entry 读取同 id 本地 manifest，覆盖已安装 dplugin.jsond 并保留 registry 状态，同时写入本地 activity log；dplugins_update_all_from_marketplaced 会扫描已安装插件，只更新本地 marketplace 中存在同 id entry 的插件，并返回 checked/updated 计数与更新后的 plugins，前端 Plugins 和 Settings > Plugins 均提供 dUpdate all locald 入口；dplugins_install_missing_from_marketplaced 会从已导入本地 marketplace 安装当前未安装的 entries，初始状态仍为 disabled，前端提供 dInstall missing locald 手动入口。enabled manifest 的 dnav_itemsd 会合并到侧边栏插件分组和命令面板；若 manifest 提供 di18nd 元数据，前端会用当前 Appearance language 尝试读取 nav label 并回退到原始 dnav_items.labeld。dapp_get_local_plugin_trust_summaryd 会读取本地 installed plugin、marketplace registry 和 preflight metadata，返回 plugin_count、marketplace_entry_count、ready_local_count、manifest_only_count、failed_count、incompatible_count、unsigned_count、remote_marketplace_count、marketplace_hash_count、marketplace_signature_count、permission_grant_count、marketplace_capability_count、marketplace_permission_count、dynamic_execution_enabled=false、release_gate_status、逐插件 trust_status/review_note/permission_count、逐 marketplace source_kind/sha256/signature/signature_url/capability_count/permission_count/review_note 和 review_notes；dapp_export_local_plugin_trust_summaryd 会把同一只读摘要写出到指定 JSON 路径或 diagnostics 目录，并发出 ddiagnostics:files_changedd。Plugins 页面和 Settings > Advanced 可刷新、复制 summary/JSON/entries/notes 并导出该文件；这些接口不加载动态库、不执行 command、不验证签名、不下载 marketplace artifact、不授予或强制执行插件权限。真实动态 command host、远程 marketplace、artifact 下载、签名/校验、动态库加载、panic isolation、plugin host API、插件运行时语言切换和真实事件总线仍未实现。

### Torrent commands

| Command | Request | Response |
| --- | --- | --- |
| dtorrent_parse_filed | d{ path: PathString }d | d{ name: string; info_hash: string; piece_length_bytes: number; piece_count: number; pieces_sha1_bytes: number; total_size_bytes: number; file_count: number; files: { path: string; size_bytes: number }[]; trackers: string[] }d |
| dtorrent_parse_magnetd | d{ uri: string }d | d{ info_hash: string; display_name?: string; trackers: string[]; web_seeds: string[]; exact_topic: string }d |
| dtorrent_queue_filed | d{ path: PathString; output_dir?: PathString; selected_paths?: string[] }d | dDownloadTask(kind="torrent", status="queued")d |
| `torrent_queue_magnet` | `{ uri: string; output_dir?: PathString }` | `DownloadTask(kind="torrent", status="queued")` |
| `p2p_list_offers` | `{}` | `{ offers: P2pOffer[] }` |
| `p2p_create_offer` | `{ file_path: PathString }` | `P2pOffer(status="waiting", sha256?: string)` |
| `p2p_get_offer` | `{ short_code: string }` | `P2pOffer` |
| `p2p_start_send` | `{ short_code: string }` | `P2pOffer(status="serving", share_code="CODE@host:port")` |
| `p2p_probe_share` | `{ share_code: string }` | `{ short_code: string; file_name: string; size_bytes: number; sha256?: string; endpoint_host: string; endpoint_port: number; share_code: string }` |
| `p2p_prepare_receive` | `{ short_code: string; output_dir: PathString }` | `P2pOffer(status="receive_ready")` |
| `p2p_queue_receive` | `{ short_code: string; create_options?: { output_dir?: PathString; ... } }` | `DownloadTask(kind="p2p", status="queued")` |
| `p2p_pause_offer` | `{ short_code: string }` | `P2pOffer(status="paused")` |
| `p2p_resume_offer` | `{ short_code: string }` | `P2pOffer(status="waiting")` |
| `p2p_cancel_offer` | `{ short_code: string }` | `P2pOffer(status="canceled")` |
| `p2p_bulk_action` | `{ action: "pause" \| "resume" \| "cancel" \| "delete"; short_codes: string[] }` | `{ offers: P2pOffer[]; deleted: string[]; failed: { id: string; error: string }[] }` |
| `p2p_delete_offer` | `{ short_code: string }` | `{ deleted: boolean }` |
| `p2p_clear_offers` | `{}` | `{ cleared: number }` |

当前 Torrent/P2P 实现子集：dtorrent_parse_filed 读取本地 d.torrentd 文件并解析 name、BT v1 info hash、piece metadata、文件列表和 trackers；dtorrent_queue_filed 会校验 dselected_pathsd 并把选择结果写入任务 details；dtorrent_parse_magnetd 解析本地 magnet URI 的 BTIH、display name、trackers、web seeds 和 exact topic；torrent/magnet draft 启动后仍导出 d.torrent-task.jsond metadata sidecar，尚不下载内容或 seeding。P2P offer 保存到 ddata/p2p/offers.jsond，P2pOffer.status 现在包含 dwaitingd、dservingd、dpausedd、dreceive_readyd、dcompletedd、dcanceledd、dexpiredd，并可带 dsha256d、dendpoint_hostd、dendpoint_portd、dshare_coded、dserved_atd。dp2p_create_offerd 会计算源文件 SHA-256 并保存为 offer metadata。dp2p_start_sendd 会为 waiting/serving offer 绑定本机 TCP listener，推断 LAN host，写入 dCODE@host:portd share code，并用私有端点 d/fetchdock-p2p/<code>d 响应 dHEADd metadata probe（含 X-FetchDock-Sha256）和一次 dGETd file stream；CLI dstart-p2p-sendd 会保持进程阻塞直到一次传输完成、过期或 offer 被暂停/取消。dp2p_probe_shared 接受 dCODE@host:portd 或 dp2p://CODE@host:portd，执行 HEAD probe 并返回文件名、大小、SHA-256 和 endpoint metadata。`p2p_prepare_receive` / `p2p_queue_receive` 可接受本地 short code 或远端 share code；远端 share 会先 probe endpoint、创建 receive-ready offer，`p2p_queue_receive` 在 `create_options.output_dir` 存在时可自动 prepare 后入队，并把 offer SHA-256 写入 queued task 的 expected SHA-256（显式 create option 可覆盖）；queued receive task 启动时优先通过 endpoint GET 拉取文件，缺少 endpoint 时保留同一 FetchDock 数据根 local-copy fallback；d.p2p-task.jsond sidecar helper 仍保留为审计/兜底路径。Tools offer 列表支持 serving 过滤、Start send/Copy shares/Copy SHA-256、Pause/Resume/Cancel/Remove shown 和 offer change event 同步，并新增 `p2p_export_offers` / `p2p_import_offers`、CLI `export-p2p-offers` / `import-p2p-offers` 与 UI Import/Export controls，用 FetchDock JSON envelope 迁移本地 offer records；导入 serving offer 时会降级为 waiting，不恢复不存在的 TCP listener。CLI `p2p-offers`/`p2p-offer`/`create-p2p-offer`/`start-p2p-send`/`probe-p2p-share` 的 human 输出也会显示可用 SHA-256，JSON 输出继续返回完整 offer/probe payload；`p2p_get_local_summary` / export 会报告 hashed/missing offer hash coverage，但不在 summary 阶段重算文件 hash；Torrent/P2P transfer panel 继续复用 Downloads 批量 Start/Pause/Resume/Retry/Cancel/Archive/Restore shown。DHT/tracker metadata 请求、magnet 文件列表、piece 校验执行、真实 BT 下载、seeding、P2P NAT traversal、relay、多 peer、跨进程断点续传、跨设备 hash 矩阵和最终双端手动验收尚未完成。

### Extension commands

| Command | Request | Response |
| --- | --- | --- |
| dextension_get_pairing_statusd | d{}d | d{ paired: boolean; port: number; token_required: boolean; label?: string; created_at?: IsoDateTime; expires_at?: IsoDateTime }d |
| dextension_create_pairing_tokend | d{ label?: string }d | d{ pairing_code: string; expires_at: IsoDateTime }d |
| dextension_revoke_pairingd | d{}d | d{ revoked: true }d |
| dextension_export_pairingd | d{ output_path?: string }d | d{ schema_version: 1; output_path: string; pairing: { schema_version: 1; paired: boolean; label?: string; created_at?: IsoDateTime; expires_at?: IsoDateTime; revoked_at?: IsoDateTime }; includes_pairing_token_value: false; review_notes: string[] }d |
| dextension_import_pairingd | d{ input_path: string }d | d{ input_path: string; pairing: ExtensionPairingStatus; imported_was_paired: boolean; review_notes: string[] }d |
| dextension_get_optionsd | d{}d | d{ bridge_url: string; bridge_discovery_ports: number[]; token_set: boolean; deep_link_fallback: boolean; capture_media: boolean; capture_headers: boolean; blocked_hosts: string[]; updated_at: IsoDateTime }d |
| dextension_get_local_package_summaryd | d{}d | d{ schema_version: 1; source_root: string; extension_dir: string; manifest_path: string; manifest_version?: number; extension_name?: string; extension_version?: string; source_file_count: number; source_total_size_bytes: number; source_files: { path: string; size_bytes: number; sha256?: string }[]; package_manifest_path: string; package_manifest_present: boolean; package_targets: { target: string; zip_path?: string; zip_sha256?: string; file_count: number; total_size_bytes: number }[]; review_notes: string[] }d |
| dextension_update_optionsd | d{ bridge_url?: string; bridge_discovery_ports?: number[]; token?: string; deep_link_fallback?: boolean; capture_media?: boolean; capture_headers?: boolean; blocked_hosts?: string[] }d | same as dextension_get_optionsd |
| dextension_get_connector_profiled | d{ token?: string; create_token?: boolean; label?: string }d | d{ schema_version: 1; appId: string; profileVersion: number; source: string; exported_at: IsoDateTime; defaultBridgePort: number; bridgeDiscoveryPorts: number[]; bridgeBaseUrl: string; pairingToken: string; tokenExpiresAt?: IsoDateTime; useDeepLinkFallback: boolean; mediaSnifferEnabled: boolean; headerCaptureEnabled: boolean; blockedHosts: string[]; privacy: { cookie_payload_contents_included: false; authorization_payload_contents_included: false } }d |
| dextension_list_cookie_payloadsd | d{}d | d{ payloads: ExtensionCookiePayloadInfo[] }d |
| dextension_delete_cookie_payloadd | d{ payload_ref: Id }d | d{ deleted: boolean }d |
| dextension_delete_cookie_payloadsd | d{ payload_refs: Id[] }d | d{ deleted: Id[]; failed: BulkDownloadFailure[] }d |
| dextension_clear_cookie_payloadsd | d{}d | d{ cleared: number }d |
| dextension_list_authorization_payloadsd | d{}d | d{ payloads: ExtensionAuthorizationPayloadInfo[] }d |
| dextension_delete_authorization_payloadd | d{ payload_ref: Id }d | d{ deleted: boolean }d |
| dextension_delete_authorization_payloadsd | d{ payload_refs: Id[] }d | d{ deleted: Id[]; failed: BulkDownloadFailure[] }d |
| dextension_clear_authorization_payloadsd | d{}d | d{ cleared: number }d |

当前 Extension 实现子集：仓库新增 dbrowser-extension/d Manifest V3 scaffold，包含 background service worker、popup、options 和 error 页面。桌面端当前启动 loopback-only HTTP bridge，默认 dhttp://127.0.0.1:17654d，但启动时会读取保存的本地 bridge URL 并绑定对应 localhost/127.0.0.1 端口；保存新的 bridge URL 后会立即尝试启动该端口 listener，旧 listener 会保留到应用重启；dGET /healthd 返回 d{ ok, app, port, paired, token_required, token_valid, label?, expires_at? }d，其中 dportd 是实际响应请求的本地端口，token 过期或不匹配时 dtoken_valid=falsed；dPOST /v1/extension/downloadd 接收 d{ schema_version: 1, url, title?, source?, kind?, page_url?, referer?, user_agent?, auth_payload_ref?, header_summary?, sent_at? }d 并按 dkindd 创建本地下载任务，任务会发出 ddownloads_createdd 事件并带 drun_after_active_slotd 进入桌面调度；daudio/image/pdf/book/webpage/generic/playlist/subtitles_onlyd 会映射到对应 dDownloadKindd，dvideo/hls/dash/stream/mediad 或未知值会回退为 dvideod，响应 d{ ok, task_id?, error? }d；dPOST http://127.0.0.1:17654/v1/extension/cookiesd 接收扩展捕获的当前页 Cookie header，写入本地 staging cookie payload 并返回 d{ ok, payload_ref?, error? }d，供 Settings > Cookies 按 payload id 导入；dPOST http://127.0.0.1:17654/v1/extension/authorizationd 接收当前页 Authorization header 和可选 drequest_urld，写入 ddata/extension/auth-payloads/<payload_ref>.jsond 并只返回 d{ ok, payload_ref?, preview?, error? }d，preview 为脱敏字符串；dextension_list_cookie_payloadsd 返回 ddata/extension/cookie-payloads/*.txtd 的 staged Cookie payload metadata，dextension_delete_cookie_payloadd 删除单个本地 Cookie payload 文件，dextension_delete_cookie_payloadsd 批量删除传入 payload refs 并返回 d{ deleted, failed }d，dextension_clear_cookie_payloadsd 只清空本地 staged Cookie payload 文件，不删除已导入 Cookie buckets；dextension_list_authorization_payloadsd 返回脱敏 payload metadata，dextension_delete_authorization_payloadd 删除单个本地 staged payload，dextension_delete_authorization_payloadsd 批量删除传入 payload refs 并返回 d{ deleted, failed }d，dextension_clear_authorization_payloadsd 清空本地 staged Authorization payload JSON 文件；前端在 Settings > Cookies 和 Settings > Browser Extension 对 staged Cookie payload metadata 提供搜索、复制 filtered refs/paths/file names/sizes/modified times、选用、单项 Import、Import filtered、单删、通过 dextension_delete_cookie_payloadsd Remove filtered 和清空，对 staged auth payload metadata 提供本地搜索、行内显示已记录 page/request URL、复制 filtered refs/hosts/paths/file names/sizes/modified times/page URLs/request URLs/previews/times、打开已记录 page/request URL、选为下一次 Home 任务或 Tools metadata workflow 的 auth ref、删除、通过 dextension_delete_authorization_payloadsd Remove filtered、清空的操作，桌面 runtime 会在 Cookie/Auth payload staging、删除或清空成功后发出 dextension:payloads_changedd 并用 metadata-only payload 同步 Settings/Home 当前列表，不返回或显示 Cookie/Authorization 明文；Home/download create 可传 dauth_payload_refd，后端仅在 payload host/request_host 与任务 URL host 或子域匹配时把 Authorization header 注入 yt-dlp/direct-file；Referer/User-Agent 会保存到任务网络参数，dauth_payload_refd 若存在会保存到任务并由下载执行阶段按 host 校验后注入 Authorization header，dheader_summaryd 只写入任务日志并仅包含 Cookie/Authorization 是否存在，不保存秘密明文。扩展 Capture auth header 成功后会在扩展本地 storage 保存 host 到 staged payload ref 的映射，后续 bridge Send page / Send shown media 对匹配 host 只携带该 ref；deep-link fallback 不携带 auth payload ref。扩展会优先调用已保存 bridge URL，失败后按导入 connector profile 的 dbridgeDiscoveryPortsd 或默认 17654-17664 自动探测 localhost/127.0.0.1 端口并保存命中地址，仍失败时可打开 dfetchdock://capture?...&title=...&kind=...d deep link fallback，前端会解析 title 和已知 kind 并传给任务创建，未知 kind 回退为 Home URL 推断。扩展侧当前还实现了本地 media sniffer storage：dfetchdock.media.listd runtime message 按 tab 返回 d{ ok, media, total, limit }d，其中 dmediad 是最多 20 条候选、dtotald 是当前 tab 完整候选数、dlimitd 是返回上限；HLS/DASH segment 会按同目录 stream group 累加到 manifest 候选并显示 segment count；dfetchdock.media.send_shownd 会发送当前 popup 展示的前 8 条候选并返回 d{ ok, sent, failed, attempted, available, mode, bridgeBaseUrl?, error? }d；popup Copy shown 会只在扩展前端把当前可见的唯一媒体 URL 写入剪贴板，不调用 bridge、不改 storage；dfetchdock.media.clear_shownd 只清理当前 tab 前 8 个可见候选并返回 d{ ok, cleared, remaining, error? }d；dfetchdock.media.cleard 清除当前 tab 全部候选。popup 发送候选时会携带候选 kind，options 可保存 dmediaSnifferEnabledd、dheaderCaptureEnabledd 和 dblockedHostsd，blocked hosts 支持换行/逗号或 JSON 输入且 bridge URL 只允许 localhost/127.0.0.1，background 会用 action badge 和 action title 显示检测数量、发送成功、deep-link fallback、Cookie/Auth payload staging 或错误；临时状态会自动恢复为当前媒体候选数量和 title，媒体数量 badge 保持可见。桌面端 pairing commands 会把 token 状态保存到 ddata/extension/pairing.jsond；创建 token 后 bridge 要求 dX-FetchDock-Tokend 匹配，过期 token 会被 POST 拒绝且 d/healthd 返回 dtoken_valid=falsed，撤销后回到无 token 兼容模式。dextension_export_pairingd / dextension_import_pairingd 与 CLI dexport-extension-pairingd / dimport-extension-pairingd 只迁移本地 pairing metadata，不导出或恢复 token value、browser storage、Cookie/Auth payload contents 或 downloaded content；导入曾 paired 的备份会写回 label/timestamp metadata 但恢复为 unpaired，必须重新创建 token 后才能配对浏览器。扩展 popup 和 options 页可用 Check bridge 对当前 bridge URL/token 执行 d/healthd 检查，并按可编辑 discovery ports 发现本地 bridge；options 页在命中其它本地端口时会写回 bridge URL。error 页会读取扩展本地 options metadata，展示 bridge URL、discovery ports、fallback/capture 状态、blocked host 数和 token 是否已配置，可 Retry bridge 跨端口检查并保存发现到的 bridge URL，也可 Copy diagnostics 复制不含 token 值、Cookie/Auth payload 内容或 browser storage 的安全诊断摘要。dextension_get_optionsd / dextension_update_optionsd 会保存桌面侧 extension options，包括 bridge URL、bridge discovery ports、token-set 布尔、deep-link fallback、media capture、header capture 和 sanitized dblocked_hostsd；前端支持粘贴换行/逗号列表、JSON 数组或 d{ blockedHosts }d 导入本地 blocked hosts。dextension_get_local_summaryd 聚合本地 extension options、pairing status、staged Cookie/Auth payload metadata、package summary 和 release-safety summary；dextension_export_local_summaryd / CLI dexport-extension-summaryd 写出同一 metadata-only JSON。该 summary/export 不读取浏览器 storage、pairing token 值、Cookie/Auth payload 内容、下载内容或日志正文，也不运行浏览器自动化、安装扩展、打包、签名、提交商店或证明 review readiness。dextension_get_local_package_summaryd 只读取本地 dbrowser-extension/d 源码文件清单、manifest 元数据和已生成的 ddist-extension/browser-extension-package-manifest.jsond review package metadata，返回 source/package 文件数、大小、SHA-256 和 review notes；Settings > Browser Extension 可刷新并复制 source/package summary、JSON、source file list、source hashes、target zip hashes 和 notes，也可 Open extension folder、Reveal manifest、Open/Reveal package manifest。该摘要不读取浏览器 storage、Cookie/Auth payload contents、pairing token、下载内容，不安装扩展，不运行浏览器，也不证明商店/AMO review ready。Settings > Browser Extension 可生成 connector profile JSON，CLI dextension-connector-profiled 也可输出同结构 profile 或用 d--create-tokend 生成本地 pairing token；profile 包含 dappIdd、dprofileVersiond、ddefaultBridgePortd、dbridgeDiscoveryPortsd、bridge URL、pairing token、fallback、media/header capture 和 blocked hosts；dbridgeDiscoveryPortsd 来自桌面 extension options，未配置时回退默认 17654-17664，不包含 staged Cookie/Auth payload 明文。Settings > Browser Extension 还可复制 bridge URL、discovery ports、supported endpoints、pairing status、local option summary 和 blocked hosts 供本地配置审阅；这些复制入口不读取 staged Cookie/Auth payload contents、不写浏览器 storage、不创建下载任务；Cookie payload Import 入口只创建 Cookie bucket 并保留 staged 文件。前端 Home 与 Tools 会在 URL 提交、metadata/playlist/gallery probe、sidecar list/save 和带 source URL 的本地 manifest queue 前，按目标 host 对 staged Authorization payload metadata 做本地自动匹配并填入 `auth_payload_ref`，且只更新前一次自动填入的 ref，不覆盖用户手动选择。extension id 绑定、一键写入真实扩展 storage、加密/keychain、端到端真实浏览器验收和跨 session HLS/DASH grouping 仍未实现。

补充：Browser Extension popup 提供 Copy page summary，复制当前页面 title/URL/tab id、popup status、当前 loaded/shown media counts、media kind filter/kind counts、bridge URL、discovery ports、fallback/capture flags、blocked-host count 和 pairing token configured 状态；visible media Copy details/JSON 还会输出 stream group、segment_count 和 pending_segment_count，便于核对 HLS/DASH segment 先于 manifest 出现时的本地归并行为。该摘要只来自 popup 当前状态和 extension options metadata，不调用 bridge、不发送任务、不读取 captured Cookie/Auth payload bodies、不复制 pairing token 值、Cookie 值、Authorization header 值或 browser storage 正文。

补充：Browser Extension popup 在初始化和 Send/Cookie/Auth capture click handler 中会读取 sanitized blocked hosts options，并用与 background 相同的 host/subdomain rule 对当前页做本地 preflight。命中时 popup 显示 Blocked、禁用发送和捕获按钮，并且不调用 bridge、不创建任务、不读取或发送 Cookie/Auth payload。

补充：Browser Extension bridge 也接收旧版 dPOST /pair/startd、dPOST /pair/completed、dPOST /download/paged、dPOST /download/mediad、dPOST /download/batchd 与 dPOST /cookies/importd。pair 兼容层只返回状态并校验已由桌面 Settings/CLI 创建的 token，不通过 HTTP 生成或泄露 token；download 兼容层本地转换为 dPOST /v1/extension/downloadd 的同一任务创建路径，只映射 URL、kind、source、referer/page context 和既有 Authorization payload ref，不读取、不返回 Cookie 或 Authorization 明文；cookies 兼容层仍只做本地 Cookie payload staging，不直接导入账号 bucket；真实浏览器端到端验收仍未完成。

### Library, courses, Telegram commands

这些命令属于后续模块，首阶段只固定边界：

| 领域 | Commands |
| --- | --- |
| Reading library | dlibrary_scan_folderd、dlibrary_list_catalogd、dlibrary_import_folderd、dlibrary_rescan_catalogd、dlibrary_prune_missingd、dlibrary_delete_catalog_itemd、dlibrary_delete_catalog_itemsd、dlibrary_clear_catalogd、dlibrary_export_catalogd、dlibrary_import_catalogd、dlibrary_get_format_catalogd、dlibrary_export_format_catalogd、dlibrary_open_itemd、dlibrary_extract_cbz_page_previewd、dlibrary_extract_epub_text_previewd、dlibrary_open_externald、dlibrary_reveal_itemd、dlibrary_get_reading_stated、dlibrary_save_progressd、dlibrary_add_bookmarkd、dlibrary_add_highlightd、dlibrary_update_bookmarkd、dlibrary_update_highlightd、dlibrary_delete_bookmarkd、dlibrary_delete_highlightd、dlibrary_delete_annotationsd、dlibrary_clear_annotationsd、dlibrary_export_reading_stated、dlibrary_import_reading_stated、dlibrary_export_reading_statesd、dlibrary_import_reading_statesd、dlibrary_get_reader_settingsd、dlibrary_update_reader_settingsd |
| Music library | dmusic_scan_folderd、dmusic_list_catalogd、dmusic_import_folderd、dmusic_rescan_catalogd、dmusic_prune_missingd、dmusic_delete_catalog_trackd、dmusic_delete_catalog_tracksd、dmusic_clear_catalogd、dmusic_export_catalogd、dmusic_import_catalogd、dmusic_get_format_catalogd、dmusic_export_format_catalogd、dmusic_get_queued、dmusic_save_queued、dmusic_get_lyricsd、dmusic_save_lyricsd、dmusic_get_service_matrixd、dmusic_list_playlistsd、dmusic_save_playlistd、dmusic_export_playlistd、dmusic_import_playlistd、dmusic_export_playlistsd、dmusic_import_playlistsd、dmusic_delete_playlistd、dmusic_delete_playlistsd、dmusic_clear_playlistsd、dmusic_get_sleep_timerd、dmusic_update_sleep_timerd、dmusic_get_equalizerd、dmusic_update_equalizerd、dmusic_get_discord_presenced、dmusic_update_discord_presenced、dmusic_record_playbackd、dmusic_get_playback_statsd、dmusic_clear_playback_historyd |
| Courses | dcourses_probed、dcourses_get_platform_matrixd、dcourses_importd、dcourses_import_manifestd、dcourses_export_manifestd、dcourses_import_manifest_bundle、dcourses_listd、dcourses_deleted、dcourses_delete_manyd、dcourses_cleard、dcourses_delete_lessond、dcourses_delete_lessonsd、dcourses_delete_attachmentd、dcourses_delete_attachmentsd、dcourses_prune_missing_local_filesd、dcourses_update_progressd、dcourses_open_lessond、dcourses_update_cookie_bucketd、dcourses_queue_lessond、dcourses_queue_all_lessonsd、dcourses_queue_many_lessonsd、dcourses_queue_attachmentd、dcourses_queue_all_attachmentsd、dcourses_queue_many_attachmentsd、dcourses_save_lesson_noted |
| Learning | dlearning_notes_listd、dlearning_notes_saved、dlearning_notes_deleted、dlearning_notes_delete_manyd、dlearning_notes_cleard、dlearning_notes_exportd、dlearning_notes_importd、dpomodoro_sessions_listd、dpomodoro_sessions_saved、dpomodoro_sessions_deleted、dpomodoro_sessions_delete_manyd、dpomodoro_sessions_cleard、dpomodoro_sessions_exportd、dpomodoro_sessions_importd、dlearning_get_dashboardd、dlearning_update_daily_goald、dlearning_get_graphd、dlearning_get_local_summaryd、dlearning_export_local_summaryd、dlearning_export_dashboardd、dlearning_export_graphd |
| Telegram | dtelegram_get_stated、dtelegram_export_stated、dtelegram_import_stated、dtelegram_auth_startd、dtelegram_logoutd、dtelegram_import_manifestd、dtelegram_list_chatsd、dtelegram_delete_chatd、dtelegram_delete_chatsd、dtelegram_delete_mediad、dtelegram_delete_media_itemsd、dtelegram_clear_chatsd、dtelegram_prune_missing_local_mediad、dtelegram_searchd、dtelegram_get_sync_statusd、dtelegram_get_local_summaryd、dtelegram_export_local_summaryd、dtelegram_download_mediad、dtelegram_queue_media_itemsd、dtelegram_copy_local_mediad、dtelegram_clone_wizardd、dtelegram_open_mediad、dtelegram_reveal_mediad |
| Channels | dchannels_listd、dchannels_addd、dchannels_removed、dchannels_remove_manyd、dchannels_cleard、dchannels_check_nowd、dchannels_list_historyd、dchannels_delete_history_itemd、dchannels_delete_history_itemsd、dchannels_clear_historyd、dchannels_mark_notification_shownd、dchannels_mark_notifications_shownd、dchannels_queue_history_itemd、dchannels_queue_history_itemsd、dchannels_get_settingsd、dchannels_update_settingsd、dchannels_poll_dued、dapp_get_local_channels_summaryd、dchannels_export_local_summaryd |
| Torrent/P2P | dtorrent_parse_filed、dtorrent_parse_magnetd、dtorrent_queue_filed、dtorrent_queue_magnetd、dp2p_list_offersd、dp2p_create_offerd、dp2p_get_offerd、dp2p_prepare_received、dp2p_queue_received、dp2p_cancel_offerd、dp2p_pause_offerd、dp2p_resume_offerd、dp2p_delete_offerd、dp2p_bulk_actiond、dp2p_clear_offersd、dp2p_get_local_summaryd、dp2p_export_local_summaryd |

当前 Courses 实现子集：dcourses_probed 校验课程 URL 并按 host 识别 Udemy/Hotmart/Kiwify/Gumroad/Teachable/Kajabi/Skool/Wondrium/Thinkific/Rocketseat 等目标平台，随后复用 yt-dlp metadata / flat-playlist probe 做 best-effort 远端 outline 提取；成功时返回带 lessons 的 dCourseEntryd，并可把缩略图转成 attachment candidate，依赖缺失、登录态不足或平台不支持提取时返回 dprobed_metadata_pendingd candidate，并在可选 dremote_extraction_noted 字段保留脱敏 fallback 原因；响应可携带可选 dcookie_bucket_idd；dcourses_get_platform_matrixd 返回这 10 个目标课程平台的本地矩阵，包含 id、label、host hints、dlocal_candidated 状态、当前证据和真实登录/平台样例限制；dcourses_export_platform_matrixd 可把同一矩阵写入 diagnostics 下的 dcourse-platform-matrix-*.jsond；dcourses_importd 会走同一 best-effort outline 路径并保存到 ddata/courses/courses.jsond；dcourses_import_manifestd 可导入 FetchDock JSON course outline，包含 lessons、local/remote attachments、lesson progress percent、note count 和可选 course-level cookie bucket，导入时会校验 URL、本地附件文件或远端 attachment dsource_urld 并回填 lesson/attachment count；dcourses_export_manifestd 可把当前本地 course store 或传入 course ids 筛选后的 course outlines 写出为 dkind=fetchdock.coursesd 的 JSON bundle，默认写入 ddata/courses/exportsd，也可指定 d.jsond 输出路径；dcourses_get_local_summaryd 返回本地 course outline、lesson/attachment source/path/progress/note-count、Cookie bucket 引用和 course transfer task 状态计数；dcourses_export_local_summaryd 可把同一 metadata-only summary 写出为 JSON，默认写入 ddata/courses/exportsd，也可指定 d.jsond 输出路径；dcourses_import_manifest_bundle 可读取同一 kind 的 bundle、复用 course outline normalization、按 course id 合并写回本地 store，并可用传入 dcookie_bucket_idd 覆盖导入 courses 的 bucket 指针；该 bundle 不导出或导入 Cookie bucket 内容、下载任务、Learning note 正文、下载输出文件或远端平台数据，现有 dcourses_import_manifestd 仍只导入单个 course outline；dcourses_update_cookie_bucketd 可更新已导入 course 的 Cookie bucket；dcourses_update_progressd 可更新单个 lesson 的 progress percent；dcourses_open_lessond 可用系统默认应用打开带 dlocal_pathd 的 lesson media 并记录 dopened_atd，Courses 页面也可对本地 video/audio lesson 使用原生控件预览、Open 或 Reveal，预览会按 lesson progress percent 恢复近似播放位置并在播放中回写 progress percent；dcourses_queue_lessond 可把带远端 dsource_urld 的 lesson 创建为 dcourse_lesson/queuedd 下载草稿；dcourses_queue_all_lessonsd 接收 d{ course_id, output_dir?, limit?, cookie_bucket_id? }d，会为本地 course 中带 dsource_urld 的 lessons 批量创建 dcourse_lesson/queuedd 任务，并返回 created/skipped；dcourses_queue_many_lessonsd 接收按 course 分组的显式 dlesson_idsd，仅为这些指定 lesson 创建 dcourse_lesson/queuedd 任务，空 id 组和缺失 lesson 进入 failed，重复项或缺失 source URL 进入 skipped；dcourses_queue_attachmentd 可把带远端 dsource_urld 的 attachment 创建为 dpdfd、dbookd 或 dgenericd queued 任务；dcourses_queue_all_attachmentsd 接收 d{ course_id, output_dir?, limit?, cookie_bucket_id? }d，会批量创建本地 manifest 中带 dsource_urld 的 attachment 下载草稿，并返回缺失 source URL 的 skipped 项；dcourses_queue_many_attachmentsd 接收按 course 分组的显式 dattachment_idsd，仅为这些指定 attachment 创建 dpdfd、dbookd 或 dgenericd queued 任务，空 id 组和缺失 attachment 进入 failed，重复项或缺失 source URL 进入 skipped；lesson/attachment queue 请求如果未显式传入 bucket，会继承 course-level dcookie_bucket_idd，缺失 bucket 会返回明确错误；dcourses_save_lesson_noted 可把 lesson 关联的 title/body/timestamp seconds 保存为本地 Learning note，并递增 lesson dnote_countd；dcourses_listd 返回本地 courses；dcourses_delete_lessond / dcourses_delete_attachmentd 只移除本地 course outline 中的单个 lesson 或 attachment 索引条目，并返回刷新后的 course；dcourses_delete_lessonsd / dcourses_delete_attachmentsd 可按 course 分组批量移除本地 outline 中的 lesson 或 attachment 索引，返回 d{ deleted, failed, courses }d 供前端一次刷新可见结果；这些删除都不删除下载任务、学习笔记、Cookie bucket、本地媒体/附件文件或已下载内容；dcourses_prune_missing_local_filesd 会清空已不存在的 lesson/attachment 本地路径并返回刷新后的 courses 与 pruned 计数，不删除课程、远端 source URL、进度、笔记、Cookie bucket、下载任务或本地文件；dcourses_deleted 只移除本地 course library 条目，dcourses_cleard 可清空全部本地 course library 条目，两者都不删除下载任务、学习笔记、Cookie bucket、本地附件文件或已下载内容。Courses 主导航页面提供平台矩阵、Probe、Import candidate、manifest import、course/lesson/attachment/URL/path 本地搜索、按当前搜索/筛选结果仅把当前可见且带 source URL 的 lesson/attachment id 传给 dcourses_queue_many_lessonsd / dcourses_queue_many_attachmentsd 执行 Queue shown lessons / Queue shown attachments、复制当前可见 lesson source URLs 或 attachment source URLs、通过 dcourses_delete_lessonsd / dcourses_delete_attachmentsd Remove shown lessons / Remove shown attachments、Remove shown courses、课程级 Cookie bucket 选择与保存、lesson/attachment 展示、lesson progress 保存、本地 lesson Preview/Open/Reveal/Queue/Remove、Queue all lessons、Queue attachments、lesson timestamped note 创建、本地 course entry 删除、missing local path prune、确认清空 course library，以及本地 attachment Preview/Open/Reveal/Remove 操作；本地 PDF attachment 可通过 Tauri asset URL 在 Courses 页 iframe 预览，并可与本地 lesson video/audio 预览同屏显示；Courses 页面还提供 Course transfers 面板，按 dcourse_lessond/dcoursed kind 或 ddetails_json.module = "courses"d 识别课程队列任务，支持文本/status 筛选和 Start/Pause/Resume/Retry/Cancel/Archive/Restore shown 批量控制，仅更新下载任务记录，不删除课程 outline、笔记、Cookie、本地源文件或输出文件；关联 Learning notes 会显示在 lesson 下，timestamp 输入可从当前 lesson 预览捕获 dcurrentTimed，点击带 timestamp 的笔记可打开本地 video/audio 预览并跳到对应 dcurrentTimed。真实登录、平台专用课程结构解析、真实平台附件抓取、专用内置播放器、完整 PDF reader 控件、课程 split view 布局调优和真实课程样例矩阵仍未实现。

补充：dcourses_export_progressd / dcourses_import_progressd 使用 dkind=fetchdock.course_progressd 的本地 JSON envelope 备份或恢复已存在 course/lesson 的学习进度。导出可按 course ids 筛选，只包含 course/lesson id、title、platform、progress_percent、opened_at 和 note_count；导入只更新本机已存在且 id 匹配的 lessons，返回 imported/skipped course/lesson counts 和变更后的 courses。CLI dexport-course-progressd / dimport-course-progressd、TypeScript dexportCourseProgressd / dimportCourseProgressd 和 Courses > Progress backup 控件复用同一路径。该能力不导入课程 outline、source URLs、Cookie bucket、Learning note body、attachments、media files 或 download tasks，也不执行远端课程解析、下载、播放器或登录流程。

当前 Telegram 实现子集：dtelegram_get_stated 读取 ddata/telegram/state.jsond 或返回 dsigned_outd 默认状态；dtelegram_export_stated / dtelegram_import_stated 可把该 placeholder account metadata 写出/恢复为 FetchDock JSON，导出明确不包含 MTProto session/auth keys/chat manifest/media files/Cookie/Auth values/download tasks，导入 dsigned_ind 备份会降级为 dpendingd；dtelegram_auth_startd 保存 phone hint 和 dpendingd 状态，并返回明确的 MTProto 未接入错误；dtelegram_logoutd 清空本地 placeholder 状态。dtelegram_import_manifestd 可导入本地 FetchDock JSON chat/media 清单到 ddata/telegram/chats.jsond，dtelegram_list_chatsd 返回本地 chats，dtelegram_delete_chatd 接收 d{ id }d 并只移除本地 imported chat 索引条目，dtelegram_delete_mediad 可只移除单个 imported media 索引条目并返回刷新后的 chats，dtelegram_delete_media_itemsd 可批量移除传入 media ids 并返回 d{ deleted, failed, chats }d，dtelegram_clear_chatsd 清空本地 imported chat 索引且返回 d{ cleared }d，这些操作都不删除媒体文件、下载任务、transfer 记录或账号状态；dtelegram_prune_missing_local_mediad 会清空已不存在的 manifest media dlocal_pathd 并返回刷新后的 chats 与 pruned 计数，不删除 chat/media 记录、远端 source URL、下载任务、transfer 记录、账号状态或本地文件；dtelegram_searchd 在本地 chat title/username/media title/path/url 中搜索，dtelegram_get_sync_statusd 聚合本地账号状态、manifest chat/media 数、可入队 source URL 数、本地/缺失媒体路径数和 dtelegram_mediad transfer task 状态计数，用于 Telegram 页 sync indicator；dtelegram_get_local_summaryd / dtelegram_export_local_summaryd 汇总或导出 metadata-only 本地 placeholder auth、manifest chat/media/type/status counts、本地路径覆盖、queueable source URL、transfer tasks、最近 manifest 更新时间、最近错误和 review notes，不导出账号 session 或读取媒体正文；dtelegram_download_mediad 可把带 dsource_urld 的 media 创建为 dtelegram_media/queuedd 下载任务；dtelegram_queue_media_itemsd 接收 d{ ids, output_dir? }d，会把带 dsource_urld 的本地 manifest media 批量创建为 dtelegram_media/queuedd 任务，并返回重复、缺失或缺少 dsource_urld 项的 skipped 列表；dtelegram_copy_local_mediad 接收 d{ ids, output_dir }d，只复制已有 dlocal_pathd 的本地 manifest media 到经过校验的输出目录，响应 d{ copied: [{ id, title, source_path, output_path, size_bytes }], skipped, output_dir }d，重复 id、缺失 media、缺失 dlocal_pathd 或源文件不存在进入 skipped，输出文件名会安全化并用唯一后缀避免覆盖；dtelegram_clone_wizardd 接收 d{ chat_id, output_dir?, media_types, limit? }d，会为本地 chat 中匹配且带 dsource_urld 的 media 批量创建 dtelegram_media/queuedd 任务，并返回 d{ chat, created, skipped }d，其中 skipped 包含缺少 dsource_urld 或被类型过滤的项目；dtelegram_open_mediad 和 dtelegram_reveal_mediad 可对带 dlocal_pathd 的 manifest media 执行系统默认打开或文件管理器定位。Telegram 主导航页面已提供 auth gate、manifest import、chat browser、本地 channel drawer、本地 imported chat 删除/清空、Remove filtered chats、本地 chat/media 文本过滤、media type 过滤、search、搜索 chat 结果打开到 Chat browser、单条 media queue、当前筛选 media 批量 queue、复制当前可见 media source URLs 或 local paths、Save local、Save filtered、Save chat、Save results 本地文件复制、单个 chat 批量 queue、search results 批量 queue、单条 media 移除、通过 dtelegram_delete_media_itemsd 当前筛选 media 批量移除、search results 批量移除、local clone wizard、missing local media path prune、本地 transfer panel、transfer Copy sources / Copy outputs、local Open/Reveal，并可对本地 photo/video/audio manifest media 使用原生图片/音视频控件预览，对本地 PDF/HTML document/file 使用 iframe 预览，其它 document/file 显示 Open/Reveal fallback 面板；Manifest summary 面板可刷新、复制 summary/JSON/chat kinds/media types/transfer statuses/notes 并导出 JSON；channel drawer 仅消费 dtelegram_list_chatsd 返回的本地 manifest 数据，会列出 channel/group chats、按 kind 过滤、点选后联动 Chat browser 搜索并切换 clone wizard source；本地 manifest 导入、chat/media 删除、清空、prune 和本地 media/clone 入队写入会发出 dtelegram:manifest_changedd，前端同步 chats、sync indicator 和 summary；transfer panel 当前筛选本地 dtelegram_mediad 下载任务，可按 title/source/output/error 文本搜索并按 queued/active/paused/completed/failed/canceled/archived 状态过滤，可复制当前可见 source URLs 或输出路径，展示状态、进度、输出路径和错误，并复用下载队列 Start/Pause/Resume/Retry/Cancel/Open/Reveal/Logs 操作；当前筛选 transfer tasks 还可批量 Start/Pause/Resume/Retry/Cancel/Archive/Restore shown，这些状态动作复用 ddownloads_bulk_actiond，其中 pause/cancel 会请求停止运行中的任务。真实 QR/手机号登录、session 加密、MTProto chat sync、真实 MTProto 媒体下载、完整内置媒体播放器和真实远端 clone 仍未实现。

当前 Reading/Music 实现子集：dlibrary_scan_folderd 递归扫描本地 PDF/EPUB/CBZ/TXT/HTML/HTM，返回路径、标题/作者 fallback、可选 metadata_source、可选 cover_path、格式、大小和修改时间；EPUB 扫描会读取 package OPF 的 title/creator 并以 dmetadata_source=epub_opfd 标记 catalog 条目，若 OPF manifest 指向常见图片封面，会复制到 ddata/library/coversd 并返回 dcover_pathd；PDF 扫描会用受限 Info/XMP 字节扫描读取 title/author 并以 dmetadata_source=pdf_infod 标记 catalog 条目；CBZ 扫描会把排序后的首张常见图片格式页面复制到 ddata/library/coversd 并返回 dcover_pathd；dlibrary_import_folderd 会扫描文件夹并把结果按 path 合并保存到 ddata/library/catalog.jsond，dlibrary_list_catalogd 返回持久 catalog 的 folders、item_count、items 和 updated_at，dlibrary_rescan_catalogd 会重扫已导入且仍存在的 folders、合并新增/更新条目并 prune 已不存在的文件路径，dlibrary_prune_missingd 会从 catalog 移除已不存在的本地文件路径，dlibrary_delete_catalog_itemd 可移除单条 catalog item，dlibrary_clear_catalogd 可清空本地 reading catalog；这些 catalog 清理都只修改 FetchDock 索引，不删除源文件、笔记或 reading-state；Tools 前端也可按当前 search/format 筛选结果批量 Remove shown catalog items，并通过 dlibrary_delete_catalog_itemsd 一次删除本地索引；dlibrary_export_catalogd / dlibrary_import_catalogd 使用 dkind=fetchdock.library_catalogd 的本地 JSON envelope 备份或恢复 ddata/library/catalog.jsond，也接受 raw LibraryCatalog 导入，导入会规范化 folders/items、跳过空路径或不支持格式项，只写本地 catalog，不复制或删除书籍文件、不修改 reading-state/reader settings/Learning notes；CLI dexport-library-catalogd / dimport-library-catalogd 和 Tools Catalog JSON Export/Import 控件复用同一路径；dlibrary_open_itemd 当前支持 TXT/HTML/HTM 读取并返回 d{ path, title, format, content, word_count, modified_at, extra_json }d，限制 2 MB；PDF 返回同一响应 shape，dextra_json.kind=pdf_manifestd 包含 title/author/creator/producer、创建/修改日期、文件大小、检测到的页数和预览状态，前端通过 Tauri 本地 asset URL 嵌入 iframe 并显示 metadata 摘要；CBZ 返回 dextra_json.kind=cbz_manifestd，包含 archive entry count、总图片页数、最多 500 个图片条目、压缩/原始图片体积、首图路径、dpreview_page_countd，以及前 24 张、单张不超过 8 MB 的本地缓存 dpreview_pathd；dlibrary_extract_cbz_page_previewd 可按 1-based page index 对单张 CBZ 图片页做按需缓存，仍限制为常见图片页且单页不超过 8 MB，返回 d{ index, path, preview_path, size_bytes }d 供前端页面列表和 Page/Previous/Next 控件立即显示；EPUB 返回 dextra_json.kind=epub_manifestd，包含 OPF path、title/creator/language/publisher/date、manifest/spine count、cover/nav candidate、reading order preview 和前 8 个 spine HTML/XHTML 文档的受限纯文本 dtext_previewsd；dlibrary_extract_epub_text_previewd 可按 1-based extractable spine index 对单个 HTML/XHTML/XML spine 文档提取受限纯文本，限制单文档不超过 2 MB，返回 d{ index, idref, href, path, text, size_bytes }d 供 reading order 和 Spine/Previous/Next 控件更新 reader text preview，并仍不执行脚本或远端资源；dlibrary_open_externald 和 dlibrary_reveal_itemd 会先校验路径属于支持的阅读格式，再用系统默认应用打开或在文件管理器中定位，Tools 列表已接入 PDF/EPUB/CBZ 外部 Open/Reveal；dlibrary_get_reading_stated、dlibrary_save_progressd、dlibrary_add_bookmarkd、dlibrary_add_highlightd、dlibrary_update_bookmarkd、dlibrary_update_highlightd、dlibrary_delete_bookmarkd、dlibrary_delete_highlightd、dlibrary_delete_annotationsd 和 dlibrary_clear_annotationsd 按文件路径哈希保存支持预览条目的进度、书签和高亮到 ddata/library/reading-state/*.jsond；dlibrary_delete_annotationsd 接收同一本书的 bookmark/highlight id 列表并返回 d{ state, deleted, failed }d，只批量删除本地 reading-state annotation 索引；dlibrary_export_reading_stated 可把当前书的 reading-state 写成 JSON 或 Markdown 到用户指定路径，dlibrary_import_reading_stated 可把 FetchDock JSON reading-state export 导入到当前指定书籍路径并重写该书本地 progress/bookmarks/highlights，导入会规范化 schema/progress/annotation 文本并跳过空标注，前端 reader state 面板会在导出后提供 Open/Reveal 结果文件操作，也可选择 JSON 文件导入到当前预览书籍；dlibrary_export_reading_statesd / dlibrary_import_reading_statesd 使用 dkind=fetchdock.library_reading_statesd 的本地 JSON envelope 备份或恢复 ddata/library/reading-state/*.jsond 中的全部 reading-state metadata，导入按 state path 覆盖对应本地 JSON 并跳过不可用 path/format/annotation；CLI dexport-reading-statesd / dimport-reading-statesd 和 Tools reader state Export all / Import all 控件复用同一路径；该能力不复制书籍文件、不读取额外正文、不修改 catalog/reader settings/Learning notes；dlibrary_get_local_summaryd / dlibrary_export_local_summaryd 只汇总或导出本地 reading catalog、local/missing path coverage、format/metadata/author counts、cover counts、reading-state progress/bookmark/highlight counts 和 reader settings 到 JSON，默认输出 ddata/library/exports/fetchdock-library-summary-*.jsond，且不读取源文档正文、不导出 Cookie/Auth/下载内容、不验证完整 PDF/EPUB/CBZ renderer；Tools > Local reading library 的 Local library summary 面板可 Refresh、Copy summary/JSON/字段、Export/Open/Reveal 该 JSON；前端 reader state 面板对已读取的 bookmarks/highlights 提供本地搜索和类型过滤，也可通过 dlibrary_delete_annotationsd Remove shown 批量清理当前显示 annotations，不删除阅读进度、导出文件、Learning notes 或源文件；打开支持预览的条目后，前端会按已保存 progress percent 滚动到外层 reader 容器位置，滚动时同步 progress 输入并在停顿后防抖保存进度，书签/高亮以及 CBZ/EPUB preview rows 可跳回对应外层位置，书签/高亮可把内容填回编辑区，Reader state 面板提供 0/25/50/75/100% 快速跳转、Use scroll 捕获当前滚动进度、Bookmark here 和 Highlight here 草稿定位，浏览器可访问的 reader text selection 可复制到高亮草稿；PDF/HTML iframe 内部页级位置和文本选区标注仍不声明完成；dlibrary_get_reader_settingsd / dlibrary_update_reader_settingsd 保存 focus mode、reader theme、font family、font size percent、line height percent 和 zoom percent 到 ddata/library/reader-settings.jsond；Tools TXT 预览会应用字体族、字号、行距和缩放，EPUB spine text excerpt 会应用字体族、字号、行距和缩放。dmusic_scan_folderd 递归扫描 MP3/FLAC/M4A/OGG/Opus，返回 track 列表、artist/album 计数、路径推断 metadata、轻量内嵌 audio tag metadata、同目录 sidecar cover 路径或 MP3/FLAC/M4A 内嵌封面缓存路径、可选 daudio_tagsd 或 dsidecar_jsond metadata_source、大小和修改时间；dmusic_import_folderd 会扫描文件夹并把结果按 path 合并保存到 ddata/music/catalog.jsond，dmusic_list_catalogd 返回持久 catalog 的 folders、track_count、tracks、artists、albums 和 updated_at，dmusic_rescan_catalogd 会重扫已导入且仍存在的 folders、合并新增/更新 tracks 并 prune 缺失文件，dmusic_prune_missingd 会从 catalog 移除已不存在的本地 track 路径，dmusic_delete_catalog_trackd 可移除单条 catalog track，dmusic_clear_catalogd 可清空本地 music catalog；这些 catalog 清理都只修改 FetchDock 索引，不删除源文件、playlists、settings 或 playback events；Tools 前端也可按当前 search/format 筛选结果批量 Remove shown catalog tracks，并通过 dmusic_delete_catalog_tracksd 一次删除本地索引后同步当前 queue；dmusic_export_catalogd / dmusic_import_catalogd 使用 dkind=fetchdock.music_catalogd 的本地 JSON envelope 备份或恢复 ddata/music/catalog.jsond，也接受 raw MusicCatalog 导入，导入会规范化 folders/tracks、跳过空路径或不支持格式 track，只写本地 catalog，不复制或删除音频文件、不修改 queue/playlists/lyrics/sleep timer/equalizer/Discord Presence/playback history；CLI dexport-music-catalogd / dimport-music-catalogd 和 Tools Catalog JSON Export/Import 控件复用同一路径；dmusic_get_queued / dmusic_save_queued 把当前队列、active track 和 volume percent 保存到 ddata/music/queue.jsond；dmusic_get_lyricsd 查找同名 d.lrcd / d.txtd / d.srtd / d.vttd sidecar 并返回文本或空态；dmusic_save_lyricsd 接收 d{ track_path, content, output_path?, format? }d，只写本地歌词 sidecar，默认覆盖已有 sidecar 或写同目录同名 d.lrcd，显式 doutput_pathd 仅允许 d.lrcd / d.txtd / d.srtd / d.vttd，返回 d{ lyrics_path, format, line_count }d；前端会用编辑草稿解析 LRC/SRT/VTT 时间戳并随 HTML audio 播放进度高亮当前歌词行，点击带时间戳的歌词行会把当前本地播放器 seek 到对应秒数；dmusic_list_playlistsd / dmusic_save_playlistd / dmusic_delete_playlistd / dmusic_delete_playlistsd / dmusic_clear_playlistsd 把本地 playlist 保存到 ddata/music/playlists.jsond，支持用同一 id 覆盖更新 playlist，并可清空本地 playlist store；dmusic_get_sleep_timerd / dmusic_update_sleep_timerd 保存 sleep timer 状态到 ddata/music/sleep-timer.jsond；dmusic_get_equalizerd / dmusic_update_equalizerd 保存 enabled、preset、bass/mid/treble gain 到 ddata/music/equalizer.jsond，前端本地播放器会在播放时用 WebAudio lowshelf/peaking/highshelf 三段滤波链应用这些 gain；dmusic_record_playbackd / dmusic_get_playback_statsd 把播放事件保存到 ddata/music/playback-events.jsond 并聚合 play count、played seconds 和 top tracks，dmusic_clear_playback_historyd 清空该 playback events store 并返回空统计；dmusic_get_local_summaryd / dmusic_export_local_summaryd 只汇总或导出本地 music catalog、local/missing path coverage、format/artist/album/metadata counts、cover counts、queue、playlists、sleep timer、equalizer、Discord Presence settings、playback stats 和 service matrix statuses 到 JSON，默认输出 ddata/music/exports/fetchdock-music-summary-*.jsond，且不连接外部音乐服务、不导出音频内容、不执行 Discord IPC、不验证完整播放器 parity；前端会用 HTML audio play/timeupdate/pause/ended 记录近似播放增量秒数，播放历史清理只重置本地统计，不删除 catalog、queue、playlists、settings 或音频文件。Tools 页已有 Local reading library 持久 catalog 摘要、标题/作者/格式/路径搜索、格式过滤、文件夹导入、已导入 folders 重扫、missing path prune、TXT/HTML/PDF/EPUB/CBZ 预览/外部打开 fallback、CBZ/EPUB Page/Spine on-demand controls、EPUB/CBZ cover 缩略图、PDF metadata 摘要、reader settings reset 和 Local music library 持久 catalog 摘要/刷新/导入/已导入 folders 重扫、missing track prune、title/artist/album/format/path 搜索、格式过滤、当前 shown tracks 复制 paths/titles、载入队列/追加到队列/保存为 playlist、Tracks/Artists/Albums 三视图、Artist/Album 分组封面拼图、分组 Load/Append/Play first、全局 docked mini player、HTML audio 播放队列、Previous/Next、队列排序/移除/随机/去重/清空、队列和音量恢复/保存/reset、timed sidecar lyrics highlighting、sidecar cover 显示与封面取色主题、WebView/browser Media Session metadata/actions/position state、playlist 保存/载入/编辑覆盖/删除/Remove shown 可见项批量删除/清空、playlist/track metadata 本地搜索、当前可见 playlist ids/names 复制、sleep timer 到点暂停当前 audio、sleep timer reset、WebAudio equalizer preset state/reset、Discord Presence local settings/reset、基础 playback stats、当前可见 top/recent 播放摘要复制和确认清理 playback history，以及由 dmusic_get_service_matrixd 返回并经前端 API wrapper 显示的 service matrix，用于展示 Local files、Spotify、SoundCloud、YouTube Music、Qobuz 和 Last.fm 的当前支持/blocked/planned 状态；dmusic_export_service_matrixd 可把同一矩阵写入 diagnostics 下的 dmusic-service-matrix-*.jsond；该矩阵不代表后端已接入外部音乐服务 API。真实 metadata/audio tag 解析、内嵌封面解析、PDF/EPUB/CBZ 完整渲染器、完整独立音乐页、OS 媒体键手动矩阵、更多 equalizer 频段和听感矩阵、自动歌词滚动精调、后台计时、外部音乐 OAuth/API、精确播放时长和手动验收仍未实现。

补充：Tools > Local music library 的歌词面板和歌词编辑器提供 Copy summary、Copy text、Copy timed 和 Copy JSON；这些 copy payload 只来自当前已加载 active track、歌词草稿、解析后的 timed lines、当前输出路径和编辑器状态，不调用 dmusic_get_lyricsd 之外的新读取路径、不读取额外音频/歌词文件、不嵌入媒体、不连接外部歌词 provider，也不声明完整 synced-lyrics/manual playback parity。

补充：dmusic_export_playlistsd / dmusic_import_playlistsd 使用 dkind=fetchdock.music_playlistsd 的本地 JSON envelope 备份或恢复 ddata/music/playlists.jsond 中的 playlist registry；导出可按 playlist ids 筛选，导入按 playlist id 合并/覆盖并跳过空名称、空 tracks 或不可用 track metadata 的记录。CLI dexport-music-playlistsd / dimport-music-playlistsd 和 Tools > Local music library 的 JSON Import/Export 控件复用同一路径。该能力只迁移本地 playlist metadata 和 track metadata，不复制音频文件、不修改 catalog/queue/playback history、不连接外部音乐服务。

补充：Tools 当前 reader preview toolbar 提供 Copy preview、Copy preview JSON 和文本型预览 Copy text。Copy preview/JSON 只使用当前 dlibrary_open_itemd 已返回的 title/path/format/modified_at、reading-state 计数、PDF 摘要、CBZ page/cache 计数、EPUB reading-order/text-preview 计数和 dextra_jsond；Copy text 仅对 TXT/HTML/HTM/EPUB 这类已经加载的文本预览生成纯文本摘录，PDF/CBZ 保持禁用，不额外读取源文件、不导出 Cookie/Auth/下载内容，也不声明完整 reader renderer。

当前 Learning 实现子集：dlearning_notes_listd 从 ddata/learning/notes.jsond 读取本地笔记，可按 title/body/tags/source URL/outgoing links 搜索，并在读取时解析正文 d[[title-or-id]]d 生成 outgoing links 与 backlink count；dlearning_notes_saved 创建或更新带 title、body、source URL、timestamp seconds 和 tags 的笔记；课程 lesson note、阅读高亮转笔记和 daily journal 也复用同一 notes store，其中阅读高亮转笔记会把本地文件路径、格式、进度、摘录和备注写入正文而不填充 HTTP-only dsource_urld，journal 会写入 djournald、ddailyd 和日期 tag；dlearning_notes_deleted 删除指定 note id，dlearning_notes_delete_manyd 批量删除传入 note ids 并返回 d{ deleted, failed }d，dlearning_notes_exportd 可把全部或指定 ids 的本地 notes 导出为 FetchDock JSON 包，默认写入 ddata/learning/exportsd，也可指定 d.jsond 输出路径；dlearning_notes_importd 只接受本地 d.jsond，最多 5 MB，导入 FetchDock notes 包或 notes 数组，按 note id 合并/覆盖、跳过空标题/正文项并刷新 backlink graph；dlearning_notes_cleard 清空本地 notes store 并把本地 course lesson dnote_countd 归零，但不删除 Pomodoro sessions、course entries、reading state、music activity、下载任务或本地文件；dpomodoro_sessions_listd 从 ddata/learning/pomodoro-sessions.jsond 读取本地 focus session；dpomodoro_sessions_saved 保存 focus/break 时长、完成状态、可选关联 URL 和可选 dnotify_on_completed 完成通知标记；dpomodoro_sessions_deleted 删除单条本地 focus session，dpomodoro_sessions_delete_manyd 批量删除传入 session ids 并返回 d{ deleted, failed }d，dpomodoro_sessions_cleard 清空本地 focus history，dpomodoro_sessions_exportd 可把全部或指定 ids 的本地 focus sessions 导出为 FetchDock JSON 包，默认写入 ddata/learning/exportsd，也可指定 d.jsond 输出路径；dpomodoro_sessions_importd 只接受本地 d.jsond，最多 5 MB，导入 FetchDock focus-session 包或 sessions 数组，按 session id 合并/覆盖、跳过空 label 项；这些操作都不影响 Notes、课程进度、阅读进度或音乐活动；dlearning_get_dashboardd 聚合本地 notes、completed pomodoro sessions、课程 lesson progress/opened 状态、本地 reading-state 进度/书签/高亮、本地 music playback events 和 ddata/learning/daily-goal.jsond，返回 note count、completed sessions/minutes、course progress count、reading progress/annotation counts、music play count/minutes、today focus minutes、daily goal met、当前/最长 streak、最近 30 天 active days 和 365 天 year-style heatmap；dlearning_update_daily_goald 保存 daily focus minutes；dlearning_get_graphd 返回 note nodes 与已解析 link edges；dlearning_get_local_summaryd / dlearning_export_local_summaryd 可汇总或导出 metadata-only 本地 Learning summary，覆盖 note/tag/source/timestamp/link/backlink 计数、Pomodoro status/source 计数、dashboard/streak/heatmap totals 和 graph counts，默认输出 ddata/learning/exports/fetchdock-learning-summary-*.jsond，且不导出 note bodies、source URLs、下载内容、Cookie/Auth values，也不执行或更新 timers；dlearning_export_dashboardd / dlearning_export_graphd 可把当前本地 dashboard 或 graph JSON 写入用户指定路径，未指定时复用 diagnostics export 目录，并返回 archive path 与 heatmap/node/link 计数。Learning 主导航页面已接入 note 创建/编辑/删除/Remove filtered/清空、source URL 打开、当前筛选 note source URL/id/title/tag/timestamp/link 复制、文本搜索、tag 下拉、source/timestamp/link 状态筛选、更新时间/创建时间、标题或 timestamp 排序、daily journal 快捷记录、本地 Pomodoro 倒计时 Start/Pause/Reset、倒计时结束暂停页面内 audio/video、记录 focus session、触发 best-effort 系统完成通知、Recent focus 本地搜索和 completed/open/linked source 过滤、复制当前可见 linked source URLs、focus session ids、labels、durations、statuses、start/end times，单条 focus session 删除、Remove filtered focus sessions、focus history 清空、本地统计、daily goal、课程/阅读/音乐活动统计、带月份和周中标签的全年 activity heatmap、graph 摘要、轻量 SVG 节点/连线图谱、可点击筛选的节点/backlink 卡片和边列表预览，并提供 metadata-only Local learning summary 面板，可 Refresh、Copy summary/JSON/字段、Export/Open/Reveal summary JSON，以及 dashboard/graph JSON Save as、Export、Open 和 Reveal 控件；后台计时、通知点击路由、可拖拽/缩放完整 graph 和 Anki bridge 仍未实现。

补充：Learning dashboard 面板提供 Copy dashboard、Copy JSON、Copy dates、Copy active days、Copy focus days、dashboard JSON export 和 graph JSON export。Copy 动作只复制当前 dlearning_get_dashboardd / dlearning_get_graphd 已加载的本地统计/heatmap/graph metadata；Export 动作由后端重新读取本地数据并写出 JSON 文件。这些动作不编辑 notes、Pomodoro sessions、course progress、reading state、music playback events、daily goal 或 graph data，也不替代最终 dashboard 手动验收。

当前 Channels 实现子集：dchannels_addd 会保存本地订阅到 ddata/channels/channels.jsond，dchannels_removed 删除单个订阅，dchannels_remove_manyd 批量删除传入 channel ids 并返回 d{ deleted, failed }d，dchannels_cleard 清空本地订阅列表，dchannels_listd 返回当前订阅；删除/清空订阅不会删除 channel history、轮询设置、通知状态或已创建下载任务。dchannels_check_nowd 会先尝试把订阅 URL 作为 RSS/Atom feed 读取，解析 d<item>d / d<entry>d 的 title、author/name、RSS link/guid、RSS enclosure、RSS/Media dmedia:contentd 和 Atom enclosure/alternate link，并把最多 20 条新 feed item 与本地 dsource_kindd 写入 ddata/channels/history.jsond；如果 feed 拉取或解析没有可用 item，则回退到原 metadata probe，成功时写入单条 title/author/source URL，失败时写入错误历史并更新订阅 dlast_errord；如果订阅启用 dauto_downloadd 且发现新 item，会为每条新 item 创建 dvideo/queuedd 下载任务、把 dcreated_task_idd 写入历史、发出 ddownloads_createdd，并带 drun_after_active_slotd 进入桌面调度；dchannels_get_settingsd、dchannels_update_settingsd 和 dchannels_poll_dued 持久化本地轮询开关/间隔，并在 due 时逐个检查 enabled 频道；dchannels_list_historyd 返回本地历史；dchannels_delete_history_itemd 删除单条本地 history item，dchannels_delete_history_itemsd 批量删除传入 history ids 并返回 d{ deleted, failed }d，dchannels_clear_historyd 清空本地 history，这些操作都不删除订阅或已创建下载任务；dchannels_mark_notification_shownd 可把本地 history item 的 dnotification_statusd 从 pending 标记为 shown，dchannels_mark_notifications_shownd 可批量标记传入 history ids 并返回 d{ items, failed }d；dchannels_queue_history_itemd 可对无错误的本地 history item 创建 dvideo/queuedd 任务并把 dcreated_task_idd 回写到 history；dchannels_queue_history_itemsd 可批量处理传入 history ids，跳过重复、缺失或带 error 的项目，返回 d{ created, items, skipped }d，并把成功创建任务的 id 回写到返回的本地 history 列表；dapp_get_local_channels_summaryd 汇总本地订阅/history/notification/polling metadata，返回 channel/enabled/auto-download/history/queued/pending counts、platform/source-kind counts 和 polling settings；dchannels_export_local_summaryd 可把同一 metadata-only summary 写成 JSON，默认输出 ddata/channels/exports/fetchdock-channels-summary-*.jsond，也可指定 d.jsond 输出路径，且不轮询频道、不导出 Cookie 值、不创建下载任务、不包含下载文件。dchannels_export_settingsd / dchannels_import_settingsd 与 CLI dexport-channel-settings [output.json]d / dimport-channel-settings <input.json>d 可显式备份/恢复本地 Channel polling preferences 和 last-poll metadata，导入复用现有 Channel settings sanitizer，不导出 subscriptions、channel history、source URLs、Cookie values、downloaded files 或 created download tasks，也不 poll channels 或启动下载。前端主导航已有 Channels 页面可添加、删除、清空订阅、手动检查、保存轮询设置、查看历史/created task id；订阅列表支持前端本地搜索和 auto-download/error 过滤，并可复制当前可见订阅 source URL 或 Remove filtered 清理当前筛选订阅，不新增后端查询语义；历史列表可按 title/author/URL/task/error/status 搜索并按 pending/queued/ready/error 过滤，也可用前端 quick filters 切换这些状态并复制当前可见 history source URL，对 pending 通知执行单条 dMark shownd 或通过 dchannels_mark_notifications_shownd 批量 Mark shown，并从历史项执行 Queue/Queue again、Queue filtered、单条 Remove、通过 dchannels_delete_history_itemsd Remove filtered 或 Clear history。前端桌面运行时会启动一个每分钟轻量 timer 调用 dchannels_poll_dued，真正是否执行由后端根据持久化 interval 判断；真实系统后台唤醒、真实频道 feed 展开、新内容去重、规则过滤、托盘通知和 SQLite channel state 仍未实现。

## Events

所有事件遵循：

```ts
interface AppEvent<T> {
  schema_version: 1;
  event_id: Id;
  name: string;
  occurred_at: IsoDateTime;
  payload: T;
}
```
### Download events

| Event name | Payload |
| --- | --- |
| ddownload:createdd | dDownloadTaskd |
| ddownload:stated | d{ task_id: Id; previous_status: DownloadStatus; status: DownloadStatus; task: DownloadTask }d |
| ddownloads:list_changedd | d{ reason: string; tasks: DownloadTask[] }d |
| ddownload:progressd | dDownloadProgressd |
| ddownload:logd | dDownloadLogLined |
| ddownload:completedd | d{ task: DownloadTask; files: DownloadFile[] }d |
| ddownload:failedd | d{ task: DownloadTask; error: AppError }d |

```ts
interface DownloadLogLine {
  schema_version: 1;
  id: Id;
  task_id: Id;
  level: "trace" | "debug" | "info" | "warn" | "error";
  source: "app" | "yt-dlp" | "ffmpeg" | "gallery-dl" | "torrent" | "p2p" | "plugin";
  message: string;
  occurred_at: IsoDateTime;
}
```
### System events

| Event name | Payload |
| --- | --- |
| dsettings:changedd | d{ settings: Settings; changed_paths: string[] }d |
| dtool:statusd | dToolStatusd |
| dtool:install-progressd | dToolInstallProgressEventd |
| dplugin:statusd | dPluginInfod |
| dplugins:changedd | d{ reason: string; plugins: PluginInfo[]; marketplace: PluginMarketplaceEntry[] }d |
| dextension:pairedd | d{ paired: boolean; extension_id?: string }d |
| dtoast:showd | d{ level: "success" | "info" | "warning" | "error"; title: string; message?: string; action?: ToastAction }d |
| dfetchdock://shell-opend | d{ source: "deep_link" | "global_shortcut"; url?: UrlString; target?: { route: string; params: Record<string, string> }; message: string }d |
| dlibrary:changedd | d{ domain: "books" | "music" | "courses" | "notes"; reason: string }d |
| dchannel:new_itemsd | d{ channel_id: Id; item_count: number }d |
| dchannels:changedd | d{ reason: string; channels: ChannelSubscription[]; history: ChannelHistoryItem[]; settings: ChannelSettings }d |
| dcookie:buckets_changedd | d{ reason: string; buckets: CookieBucket[] }d |
| dextension:pairing_changedd | d{ reason: string; status: ExtensionPairingStatus }d |
| dextension:payloads_changedd | d{ reason: string; cookie_payloads: ExtensionCookiePayloadInfo[]; authorization_payloads: ExtensionAuthorizationPayloadInfo[] }d |
| dbilibili:imports_changedd | d{ reason: string; items: BilibiliImportItem[]; account_status: BilibiliAccountStatus }d |
| dtelegram:manifest_changedd | d{ reason: string; chats: TelegramChat[]; sync_status: TelegramSyncStatusResponse }d |
| dp2p:offers_changedd | d{ reason: string; offers: P2pOffer[] }d |
| ddiagnostics:files_changedd | d{ reason: string; diagnostics: LocalFileSummary[]; logs: LocalFileSummary[] }d |

For dfetchdock://shell-opend, dglobal_shortcutd events use the first dhttpd or dhttpsd URL found in clipboard text when available. Missing durld means the shell opened successfully but no actionable URL was found. Deep links can also carry an internal dtargetd for safe local navigation: dfetchdock://open?route=downloads&task_id=<id>d focuses the Downloads detail/log context, dfetchdock://open?route=downloads&status=failed&query=<text>d opens a filtered Downloads view, dfetchdock://open?route=channels&status=pendingd opens pending Channel history, dfetchdock://open?route=settings&section=downloadsd opens and highlights a Settings section, dfetchdock://open?route=learning&session_id=<id>d opens Learning with Recent focus filtered to the local Pomodoro session, dfetchdock://open?route=courses&lesson_id=<id>d filters/expands the local course library, dfetchdock://open?route=telegram&media_id=<id>d opens the local Telegram browser/preview context, dfetchdock://open?route=plugins&plugin_id=<id>d filters installed plugins or enters an enabled plugin nav item, and dfetchdock://bilibili?item_id=<id>d jumps to Settings > Cookies and filters local Bilibili imports. Local store aliases are also whitelisted: dlibraryd and dmusicd map to Tools reader/music filters, dp2pd maps to Tools Torrent/P2P offers/transfers, and dcookiesd/dextensiond/dadvancedd map to the matching Settings panels and metadata-only inventories. The frontend still whitelists built-in routes, known aliases, and known filter/section values; unsupported targets fall back to the existing capture flow or are ignored. This does not implement OS notification click callbacks.

dsettings:changedd is emitted after desktop settings writes succeed. dchanged_pathsd uses stable top-level names such as dappearanced, ddownloadsd, dnetworkd, daid, dupdated, dextensiond, dchannelsd, dreaderd, dlibraryd, dmusicd, dmusic_queued, dmusic_sleep_timerd, dmusic_equalizerd, dmusic_discord_presenced, ddependenciesd, dauthd, and dtwitter_x_authd.

dtool:statusd is emitted after dependency path overrides, installs, or updates return a refreshed dToolStatusd. dplugin:statusd is emitted after local plugin install, failure-sample install, enable/disable, host preflight, local marketplace update/install-missing, or bulk host checks return refreshed dPluginInfod records. dplugins:changedd is emitted after local plugin or marketplace list-shape writes, local plugin settings/log/event/activity writes, and plugin command/event recording. Its payload mirrors the installed plugin list plus local marketplace registry and does not execute plugin code.

dtoast:showd is emitted by dapp_show_toastd and by desktop dplugins_emit_eventd after the plugin event is accepted into the local JSONL event log. The frontend subscribes once at app mount and renders it through the same toast stack used by direct UI actions. Toast action commands and direct UI success-toast actions are deliberately limited to safe local navigation: droute:<route_id>d, bare built-in route ids, ddownloads:<task_id>d, ddownloads:<status>d, dsettings:<section>d, dchannels:<status/history_id>d, dlearning:<session_id>d, dcourses:<course_or_lesson_or_attachment_id>d, dtelegram:<chat_or_media_id>d, dplugins:<plugin_id_or_state>d, dbilibili:<item_id_or_collection>d, dlibrary:<item_or_format>d, dmusic:<track_or_format>d, dp2p:<offer_status_or_kind_or_code>d, dcookies:<bucket_or_health>d, dextension:<payload_or_kind>d, dadvanced:<file_or_kind>d, and equivalent droute:<route>:<value>d forms. Downloads task ids open the existing detail/log context; Downloads status values apply the local status filter; Settings sections are whitelisted to implemented panels; Channel status/history ids open the local history filter; Learning session ids filter and expand Recent focus; all other ids only filter or expand existing local UI state. Unknown command strings are ignored rather than executed.

dlibrary:changedd is emitted after successful local reading-library, music-library, course-library, or learning-notes writes; the frontend refreshes the matching existing panel by ddomaind. dchannel:new_itemsd is emitted after manual channel checks or due polling discover new successful history items, grouped by dchannel_idd, and the frontend refreshes Channels plus shows a local toast.

dchannels:changedd is emitted after local Channel subscription, history, notification, queue-backlink, settings, check, or due-poll writes succeed. The payload mirrors the existing Channels list/history/settings commands so the frontend can synchronize without treating dchannel:new_itemsd as the full state event.

ddownload:createdd is emitted after desktop commands create local queued tasks through Home, Channels, Courses, Telegram, Bilibili, Torrent, P2P, or batch creation paths. ddownload:stated is emitted after desktop status transitions such as queued/start, active scheduling, pause, resume, retry, cancel, archive, restore, completion, failure, or retry queueing; frontend subscriptions upsert the existing Downloads list while ddownload:progressd continues to carry byte-level progress. Completed and failed ddownload:stated payloads are also rendered as local actionable toasts whose Detail action switches to the Downloads task detail/log context. The same terminal transitions also emit ddownload:completedd with the primary output path when known, or ddownload:failedd with the current classified error shape. ddownloads:list_changedd is emitted after successful local list-shape changes such as delete, clear completed, clear archived, archive/restore list moves, bulk archive/restore, reorder, and task-backup import; its payload is the current sorted local task list and does not include output file contents.

dcookie:buckets_changedd is emitted after local Cookie bucket import, rename, delete, clear, or health-test writes succeed. The payload only contains bucket metadata, never Cookie values; the frontend syncs Settings/Home Cookie choices and refreshes Bilibili local account summary.

dextension:pairing_changedd is emitted after desktop extension pairing token creation or revocation succeeds. The payload contains current pairing status metadata only; the one-time pairing code remains only in the direct command response.

dextension:payloads_changedd is emitted after browser-extension Cookie/Authorization staging writes, deletes, or clears succeed. The payload contains staged payload metadata and redacted Authorization previews only; it never includes Cookie or Authorization header values.

dbilibili:imports_changedd, dtelegram:manifest_changedd, and dp2p:offers_changedd are emitted after local manifest/index/offer writes succeed. They only broadcast local metadata already returned by the matching list/status commands; they do not imply remote Bilibili API access, MTProto sync, or real P2P transfer.

ddiagnostics:files_changedd is emitted after desktop diagnostics, release evidence, local feature evidence export, recovery manifest, notice inventory/draft, diagnostics bundle, diagnostics file delete/clear, or download-log delete/clear writes succeed. The payload lists local file metadata only and does not include diagnostic, log, Cookie, auth, or downloaded content.

```ts
interface ToolInstallProgressEvent {
  schema_version: 1;
  tool_id: ToolId;
  stage: "starting" | "downloading" | "verifying" | "installing" | "completed" | "failed";
  message: string;
  error?: string;
  updated_at: IsoDateTime;
}
```
## Browser Extension Bridge

Bridge server uses JSON over HTTP on loopback only. When desktop pairing is active, mutating endpoints require:

```http
X-FetchDock-Token: <pairing-token>
Content-Type: application/json
```
### dGET /healthd

Response:

```json
{
  "ok": true,
  "app": "FetchDock",
  "port": 17654,
  "paired": true,
  "token_required": true,
  "token_valid": true,
  "label": "Chrome profile",
  "expires_at": "2026-08-12T00:00:00Z"
}
```
### dPOST /pair/startd

Compatibility endpoint for older pairing flows. It does not create or return a token over HTTP; users must create the token from FetchDock Settings or CLI, then paste it into the extension.

Response:

```ts
interface ExtensionPairStartResponse {
  schema_version: 1;
  ok: boolean;
  mode: "manual";
  paired: boolean;
  token_required: boolean;
  token_valid: boolean;
  port: number;
  label?: string;
  expires_at?: string;
  message: string;
}
```
### dPOST /pair/completed

Compatibility endpoint for older pairing completion flows. It validates a token already created by desktop Settings or CLI and returns metadata only.

Request:

```ts
interface ExtensionPairCompletePayload {
  schema_version: 1;
  token?: string;
  pairing_token?: string;
}
```

Response shape matches dPOST /pair/startd.

### dPOST /v1/extension/downloadd

Request:

```ts
interface ExtensionBridgeDownloadPayload {
  schema_version: 1;
  url: UrlString;
  title?: string | null;
  source?: string | null;
  kind?: "video" | "audio" | "image" | "pdf" | "book" | "webpage" | "generic" | "playlist" | "subtitles_only" | "hls" | "dash" | "stream" | "media";
  page_url?: UrlString | null;
  referer?: string | null;
  user_agent?: string | null;
  header_summary?: { has_cookie: boolean; has_authorization: boolean; captured_at?: string | null } | null;
  sent_at?: string;
}
```
Response:

```ts
interface ExtensionBridgeDownloadResponse {
  ok: boolean;
  task_id?: Id | null;
  error?: string | null;
}
```
### dPOST /download/paged

Compatibility alias for older extension builds. The bridge converts this payload into the same local task creation path as dPOST /v1/extension/downloadd. It still requires dX-FetchDock-Tokend when pairing is active.

Request:

```ts
interface ExtensionPagePayload {
  schema_version: 1;
  page_url: UrlString;
  title?: string;
  referrer?: UrlString;
  platform_hint?: string;
  cookie_payload_ref?: Id;
  headers_ref?: Id;
}
```
Response:

```ts
interface ExtensionDownloadResponse {
  schema_version: 1;
  accepted: boolean;
  task_id?: Id;
  preview_id?: Id;
  error?: AppError;
}
```
### dPOST /download/mediad

Compatibility alias for older media-sniffer payloads. dmedia_urld becomes the task URL, dpage_urld becomes the task page/referer context, dmedia_typed maps through the same kind normalization used by dPOST /v1/extension/downloadd, and dheaders_refd is treated as an Authorization payload reference. It still does not carry Cookie or Authorization plaintext back to the UI.

Request:

```ts
interface ExtensionMediaPayload {
  schema_version: 1;
  page_url: UrlString;
  media_url: UrlString;
  media_type?: string;
  group_id?: string;
  detector: "network" | "dom" | "context_menu";
  referrer?: UrlString;
  headers_ref?: Id;
  cookie_payload_ref?: Id;
}
```
### dPOST /download/batchd

Compatibility alias for older batch extension payloads. The bridge accepts either a plain `urls` array or an `items` array with per-item metadata, then creates at most 100 local tasks through the same path as dPOST /v1/extension/downloadd.

Request:

```ts
interface ExtensionBatchPayload {
  schema_version: 1;
  urls?: UrlString[];
  items?: Array<{
    url: UrlString;
    title?: string;
    source?: string;
    kind?: string;
    page_url?: UrlString;
    referrer?: UrlString;
    headers_ref?: Id;
  }>;
  source?: string;
  kind?: string;
  page_url?: UrlString;
  referrer?: UrlString;
  headers_ref?: Id;
}
```

Response:

```ts
interface ExtensionBatchResponse {
  schema_version: 1;
  accepted: boolean;
  ok: boolean;
  task_ids: Id[];
  failed: Array<{ index: number; url?: UrlString; error: string }>;
  error?: string;
}
```
### dPOST /cookies/importd

Compatibility alias for older Cookie import payloads. The implemented behavior is still safe local Cookie payload staging, identical to dPOST /v1/extension/cookiesd; users must explicitly import a staged payload into a Cookie bucket from the desktop UI/API.

Request passes cookies through an encrypted or in-memory payload reference created by the bridge. The desktop app stores the cookie bucket and returns only metadata:

```ts
interface ExtensionCookieImportResponse {
  schema_version: 1;
  bucket: CookieBucket;
}
```
## Plugin ABI Boundary

Rust dynamic library plugins communicate with the host through FetchDock-owned ABI types. The stable boundary is conceptually:

```rust
pub trait FetchDockPlugin {
    fn manifest(&self) -> PluginManifest;
    fn init(&mut self, host: HostContext) -> PluginResult<()>;
    fn handle_command(&mut self, command: PluginCommand) -> PluginResult<PluginResponse>;
    fn shutdown(&mut self) -> PluginResult<()>;
}
```
ABI implementation details will be fixed during plugin SDK implementation. Public guarantees:

- dmanifestd must be readable before enabling the plugin.
- dabi_versiond mismatch is caught by safe preflight and returns dincompatibled state before any dynamic library execution.
- Plugin command payloads are JSON values.
- Plugin may emit events only through host API.
- Plugin cannot receive raw cookie secrets unless the user grants a bucket for that plugin and the command requires it.

## CLI Boundary

CLI commands reuse the same core services as the desktop app:

| CLI | Core command |
| --- | --- |
| dfetchdock [--json|--human] [--data-dir <path>] infod | local status summary using the same data root conventions |
| dfetchdock [--json|--human] [--data-dir <path>] settings-summaryd | dapp_get_local_settings_summaryd / dbuild_local_settings_summary_at_rootd local settings/channel/plugin/dependency audit summary without secrets |
| dfetchdock [--json|--human] [--data-dir <path>] export-settings-summary [output.json]d | dapp_export_local_settings_summaryd / dexport_local_settings_summary_at_rootd local settings/channel/plugin/dependency metadata-only summary export |
| dfetchdock [--json|--human] [--data-dir <path>] local-audit-summaryd | dapp_get_local_audit_summaryd / dbuild_local_audit_summary_at_rootd aggregate settings/channels/plugins/plugin-trust local audit summary without secrets |
| dfetchdock [--json|--human] [--data-dir <path>] export-local-audit-summary [output.json]d | dapp_export_local_audit_summaryd / dexport_local_audit_summary_at_rootd local JSON export for the same metadata-only audit summary |
| dfetchdock [--json|--human] [--data-dir <path>] channels-summaryd | dapp_get_local_channels_summaryd / dbuild_local_channels_summary_at_rootd local channel subscription/history/settings counts |
| dfetchdock [--json|--human] [--data-dir <path>] plugins-summaryd | dapp_get_local_plugins_summaryd / dbuild_local_plugins_summary_at_rootd local plugin registry/marketplace/preflight counts; dynamic execution remains disabled |
| dfetchdock [--json|--human] [--data-dir <path>] export-plugins-summary [output.json]d | dapp_export_local_plugins_summaryd / dexport_local_plugins_summary_at_rootd local plugin registry/marketplace/preflight metadata-only summary export |
| dfetchdock [--json|--human] [--data-dir <path>] plugin-trust-summaryd | dapp_get_local_plugin_trust_summaryd / dbuild_local_plugin_trust_summary_at_rootd local plugin trust/readiness review summary without dynamic execution or signature claims |
| dfetchdock [--json|--human] [--data-dir <path>] export-plugin-trust-summary [output.json]d | dapp_export_local_plugin_trust_summaryd / dexport_local_plugin_trust_summary_at_rootd diagnostics export for the same local plugin trust/readiness summary |
| dfetchdock [--json|--human] platformsd | local dbuild_platform_matrixd support-boundary declaration |
| dfetchdock [--json|--human] platform-route-samplesd | dplatforms_get_route_samplesd / dbuild_platform_route_samplesd local classifier sample URL list |
| dfetchdock [--json|--human] [--data-dir <path>] platforms-summaryd | dplatforms_get_local_summaryd / dbuild_platform_local_summaryd metadata-only support matrix summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-platform-matrix [output.json]d | dplatforms_export_matrixd / dexport_platform_matrix_at_rootd diagnostics export |
| dfetchdock [--json|--human] [--data-dir <path>] export-platform-route-samples [output.json]d | dplatforms_export_route_samplesd / dexport_platform_route_samples_at_rootd diagnostics export |
| dfetchdock [--json|--human] [--data-dir <path>] export-platforms-summary [output.json]d | dplatforms_export_local_summaryd / dexport_platform_local_summary_at_rootd metadata-only support matrix JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] export-course-matrix [output.json]d | dcourses_export_platform_matrixd / dexport_course_platform_matrix_at_rootd diagnostics export |
| dfetchdock [--json|--human] [--data-dir <path>] course-platform-samplesd | dcourses_get_platform_samplesd / dbuild_course_platform_samplesd local course candidate sample URL list |
| dfetchdock [--json|--human] [--data-dir <path>] export-course-samples [output.json]d | dcourses_export_platform_samplesd / dexport_course_platform_samples_at_rootd diagnostics export |
| dfetchdock [--json|--human] [--data-dir <path>] export-music-matrix [output.json]d | dmusic_export_service_matrixd / dexport_music_service_matrix_at_rootd diagnostics export |
| `fetchdock [--json|--human] [--data-dir <path>] [download options] download <url>` | `downloads_create` / `create_download_task_at_root` queued task creation |
| `fetchdock [--json|--human] [--data-dir <path>] [download options] batch <file>` | repeated queued task creation from text-file URLs; JSON includes `source_file`, `created_count`, `failed_count`, `skipped_line_count`, `parsed_url_count`, `created[]`, and `failed[]` |
| `fetchdock [--json|--human] [--data-dir <path>] tasks [--view <active\|history\|all>] [--status <status>] [--kind <kind>] [--platform <name>] [--query <text>] [--created-after <time\|date>] [--created-before <time\|date>] [--updated-after <time\|date>] [--updated-before <time\|date>] [--failed-only\|--retryable-only\|--with-output] [--sort <queue\|created\|updated\|title\|status\|platform\|kind>] [--asc\|--desc] [--all] [--limit <n>]` | local `read_download_tasks` listing/filtering, including active/history/all view filtering and recursive query matching over task JSON/details |
| `fetchdock [--json|--human] [--data-dir <path>] task <id>` | local `DownloadTask` detail lookup |
| `fetchdock [--json|--human] [--data-dir <path>] logs <id> [--search <text>] [--issues] [--level <level>] [--source <text>] [--cursor <n>] [--limit <n>]` | local paged download log reader with search, issue-line, level, and source filtering |
| `fetchdock [--json|--human] [--data-dir <path>] start|pause|resume|retry|cancel <id>` | local task state mutation for later desktop scheduling |
| `fetchdock [--json|--human] [--data-dir <path>] bulk-downloads --action <action> <id>[,<id>...]` | `downloads_bulk_action` / `apply_download_bulk_action` local bulk state mutation |
| `fetchdock [--json|--human] [--data-dir <path>] reorder-downloads <id>[,<id>...]` | `downloads_reorder` / local queue position update |
| `fetchdock [--json|--human] [--data-dir <path>] open-path <path>` | `app_open_path` / system default opener |
| `fetchdock [--json|--human] [--data-dir <path>] reveal-file <path>` | `app_reveal_file` / system file manager reveal |
| `fetchdock [--json|--human] [--data-dir <path>] archive|restore|delete <id>` | local archive/restore/delete task mutation |
| dfetchdock [--json|--human] [--data-dir <path>] clear-completed [--archive\|--delete]d | local completed-task archive/delete cleanup; defaults to Downloads setting |
| dfetchdock [--json|--human] [--data-dir <path>] clear-archived [--all]d | local archived-record cleanup; without d--alld honors archived retention days |
| dfetchdock [--json|--human] [--data-dir <path>] import-cookies <name> <file> [platform]d | dcookies_importd / dimport_cookie_bucket_at_rootd local Netscape file import |
| dfetchdock [--json|--human] [--data-dir <path>] import-extension-cookies <name> <payload-ref> [platform]d | dcookies_importd / dimport_cookie_bucket_at_rootd local staged browser-extension payload import |
| dfetchdock [--json|--human] [--data-dir <path>] check-update-manifest <manifest.json>d | dapp_check_update_manifestd / dcheck_update_manifest_at_pathd local release manifest check |
| dfetchdock [--json|--human] [--data-dir <path>] check-configured-updated | dapp_check_configured_update_manifestd / dcheck_configured_update_manifest_at_rootd saved local/remote manifest check and last-result writeback |
| dfetchdock [--json|--human] [--data-dir <path>] check-due-updated | dapp_check_due_update_manifestd / dcheck_due_update_manifest_at_rootd saved manifest due check; skips disabled, unconfigured, or not-due settings |
| dfetchdock [--json|--human] [--data-dir <path>] update-settingsd | dapp_get_update_settingsd / dread_update_settingsd local update preferences read |
| dfetchdock [--json|--human] [--data-dir <path>] export-update-settings [output.json]d | dapp_export_update_settingsd / dexport_update_settings_at_rootd local update preferences JSON backup export |
| dfetchdock [--json|--human] [--data-dir <path>] import-update-settings <settings.json>d | dapp_import_update_settingsd / dimport_update_settings_at_rootd local update preferences JSON backup import |
| dfetchdock [--json|--human] [--data-dir <path>] save-update-settings ...d | dapp_update_update_settingsd / dwrite_update_settingsd local update preferences save |
| dfetchdock [--json|--human] [--data-dir <path>] auth-settingsd | dauth_get_settingsd / dauth_settings_publicd local redacted auth settings read |
| dfetchdock [--json|--human] [--data-dir <path>] update-twitter-auth ...d | dauth_update_twitter_xd / dwrite_auth_settingsd local Twitter/X fallback auth update |
| dfetchdock [--json|--human] [--data-dir <path>] app-shell-settingsd | dapp_get_shell_settingsd / dread_app_shell_settingsd local quick-capture shortcut settings read |
| dfetchdock [--json|--human] [--data-dir <path>] export-app-shell-settings [output.json]d | dapp_export_shell_settingsd / dexport_app_shell_settings_at_rootd local quick-capture shortcut settings JSON backup export |
| dfetchdock [--json|--human] [--data-dir <path>] import-app-shell-settings <settings.json>d | dapp_import_shell_settingsd / dimport_app_shell_settings_at_rootd local quick-capture shortcut settings JSON backup import |
| dfetchdock [--json|--human] [--data-dir <path>] update-app-shell-settings [--shortcut <accelerator>] [--enable\|--disable\|--default]d | dapp_update_shell_settingsd / dwrite_app_shell_settingsd local quick-capture shortcut settings update |
| dfetchdock [--json|--human] [--data-dir <path>] export-diagnostics [output.json] [--include-urls]d | dapp_export_diagnosticsd / dexport_diagnostics_at_rootd local minimal diagnostics JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] read-diagnostics-file <diagnostics-path>d | dapp_read_diagnostics_filed / dread_scoped_text_filed local diagnostics preview |
| dfetchdock [--json|--human] [--data-dir <path>] delete-diagnostics-file <diagnostics-path>d | dapp_delete_diagnostics_filed / ddelete_scoped_filed local diagnostics removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-diagnosticsd | dapp_clear_diagnosticsd / dclear_scoped_filesd local diagnostics clear |
| dfetchdock [--json|--human] [--data-dir <path>] download-logs [--query <text>] [--task <id>] [--limit <n>]d | dapp_list_download_logsd / dlist_local_files(data/logs, log)d local log inventory metadata filtering; does not read log bodies |
| dfetchdock [--json|--human] [--data-dir <path>] read-download-log <log-path> [--issues] [--level <level>] [--source <text>]d | dapp_read_download_logd / dread_scoped_download_log_filed local structured log preview; CLI filters preview entries by issue flag, level, or source |
| dfetchdock [--json|--human] [--data-dir <path>] delete-download-log <log-path>d | dapp_delete_download_logd / ddelete_scoped_filed local log removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-download-logsd | dapp_clear_download_logsd / dclear_scoped_filesd local log clear |
| dfetchdock [--json|--human] [--data-dir <path>] delete-local-files [--diagnostics <path>] [--log <path>]d | dapp_delete_local_filesd / ddelete_local_files_at_rootd scoped diagnostics/download-log bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] cleanup-partial-downloads [--dry-run|--apply]d | dapp_cleanup_partial_downloadsd / dcleanup_partial_downloads_at_rootd local d.partd cleanup |
| dfetchdock [--json|--human] [--data-dir <path>] reset-settings-section <section>d | dsettings_reset_sectiond / local section default writers |
| dfetchdock [--json|--human] [--data-dir <path>] settingsd | dsettings_get_alld / dread_settingsd local appearance/downloads/AI settings read |
| dfetchdock [--json|--human] [--data-dir <path>] update-settings-json --json <patch>\|--json-file <path>d | dsettings_updated / dwrite_settingsd local appearance/downloads/AI/App shell JSON patch |
| dfetchdock [--json|--human] [--data-dir <path>] validate-network [--proxy <url>|--clear]d | dsettings_validate_networkd / dparse_direct_file_proxyd local proxy-format validation |
| dfetchdock [--json|--human] [--data-dir <path>] export-appearance-settings [output.json]d | dappearance_export_settingsd / dexport_appearance_settings_at_rootd local Appearance language/theme/typography JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-appearance-settings <input.json>d | dappearance_import_settingsd / dimport_appearance_settings_at_rootd local Appearance language/theme/typography JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] theme-catalogd | dappearance_get_theme_catalogd / dbuild_appearance_theme_catalog_at_rootd local theme catalog metadata |
| dfetchdock [--json|--human] [--data-dir <path>] export-theme-catalog [output.json]d | dappearance_export_theme_catalogd / dexport_appearance_theme_catalog_at_rootd local theme catalog metadata export |
| dfetchdock [--json|--human] [--data-dir <path>] language-catalogd | dappearance_get_language_catalogd / dbuild_appearance_language_catalog_at_rootd local language catalog metadata |
| dfetchdock [--json|--human] [--data-dir <path>] export-language-catalog [output.json]d | dappearance_export_language_catalogd / dexport_appearance_language_catalog_at_rootd local language catalog metadata export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-settingsd | ddownloads_get_settingsd / dread_downloads_settingsd local settings read |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-settings [output.json]d | ddownloads_export_settingsd / dexport_downloads_settings_at_rootd local Downloads defaults JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-downloads-settings <input.json>d | ddownloads_import_settingsd / dimport_downloads_settings_at_rootd local Downloads defaults JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-kind-catalogd | ddownloads_get_kind_catalogd / dbuild_downloads_kind_catalog_at_rootd metadata-only download task-kind capability catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-kind-catalog [output.json]d | ddownloads_export_kind_catalogd / dexport_downloads_kind_catalog_at_rootd metadata-only download task-kind catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-option-catalogd | ddownloads_get_option_catalogd / dbuild_downloads_option_catalog_at_rootd metadata-only download task/default option capability catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-option-catalog [output.json]d | ddownloads_export_option_catalogd / dexport_downloads_option_catalog_at_rootd metadata-only download option catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-status-catalogd | ddownloads_get_status_catalogd / dbuild_downloads_status_catalog_at_rootd metadata-only download status/action capability catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-status-catalog [output.json]d | ddownloads_export_status_catalogd / dexport_downloads_status_catalog_at_rootd metadata-only download status catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-error-catalogd | ddownloads_get_error_catalogd / dbuild_downloads_error_catalog_at_rootd metadata-only download error/retry policy catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-error-catalog [output.json]d | ddownloads_export_error_catalogd / dexport_downloads_error_catalog_at_rootd metadata-only download error catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-integrity-catalogd | ddownloads_get_integrity_catalogd / dbuild_downloads_integrity_catalog_at_rootd metadata-only download SHA-256 integrity capability catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-integrity-catalog [output.json]d | ddownloads_export_integrity_catalogd / dexport_downloads_integrity_catalog_at_rootd metadata-only download integrity catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-cleanup-catalogd | ddownloads_get_cleanup_catalogd / dbuild_downloads_cleanup_catalog_at_rootd metadata-only download cleanup command capability catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-cleanup-catalog [output.json]d | ddownloads_export_cleanup_catalogd / dexport_downloads_cleanup_catalog_at_rootd metadata-only download cleanup catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-log-catalogd | ddownloads_get_log_catalogd / dbuild_downloads_log_catalog_at_rootd metadata-only download log capability catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-log-catalog [output.json]d | ddownloads_export_log_catalogd / dexport_downloads_log_catalog_at_rootd metadata-only download log catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-event-catalogd | ddownloads_get_event_catalogd / dbuild_downloads_event_catalog_at_rootd metadata-only download event contract catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-event-catalog [output.json]d | ddownloads_export_event_catalogd / dexport_downloads_event_catalog_at_rootd metadata-only download event catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-queue-catalogd | ddownloads_get_queue_catalogd / dbuild_downloads_queue_catalog_at_rootd metadata-only download queue/scheduler capability catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-queue-catalog [output.json]d | ddownloads_export_queue_catalogd / dexport_downloads_queue_catalog_at_rootd metadata-only download queue catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-retry-catalogd | ddownloads_get_retry_catalogd / dbuild_downloads_retry_catalog_at_rootd metadata-only download retry capability catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-retry-catalog [output.json]d | ddownloads_export_retry_catalogd / dexport_downloads_retry_catalog_at_rootd metadata-only download retry catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] downloads-source-catalogd | ddownloads_get_source_catalogd / dbuild_downloads_source_catalog_at_rootd metadata-only download source entrypoint catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-downloads-source-catalog [output.json]d | ddownloads_export_source_catalogd / dexport_downloads_source_catalog_at_rootd metadata-only download source catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] export-network-settings [output.json]d | dnetwork_export_settingsd / dexport_network_settings_at_rootd local Network defaults JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-network-settings <input.json>d | dnetwork_import_settingsd / dimport_network_settings_at_rootd local Network defaults JSON restore |
| dfetchdock [--json\|--human] [--data-dir <path>] export-download-filter-presets [output.json] [preset-source.json]d | ddownloads_export_filter_presetsd / dexport_download_filter_presets_at_rootd local Downloads UI filter preset JSON backup |
| dfetchdock [--json\|--human] [--data-dir <path>] import-download-filter-presets <input.json>d | ddownloads_import_filter_presetsd / dimport_download_filter_presets_at_rootd local Downloads UI filter preset JSON parse/restore metadata |
| `fetchdock [--json|--human] [--data-dir <path>] update-downloads-settings [--max-concurrency <n>] [--completed-cleanup <archive|delete>] [--archived-retention-days <n>|--clear-archived-retention] [--json <downloads-patch>\|--json-file <path>] [downloads/subtitle/sponsorblock/metadata defaults flags]` | `downloads_update_settings` / `write_downloads_settings` local Downloads defaults update |
| dfetchdock [--json|--human] [--data-dir <path>] channel-settingsd | dchannels_get_settingsd / dread_channel_settingsd local polling settings read |
| dfetchdock [--json|--human] [--data-dir <path>] export-channel-settings [output.json]d | dchannels_export_settingsd / dexport_channel_settings_at_rootd local channel polling settings JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-channel-settings <input.json>d | dchannels_import_settingsd / dimport_channel_settings_at_rootd local channel polling settings JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] update-channel-settings [--enable|--disable] [--interval <minutes>]d | dchannels_update_settingsd / dwrite_channel_settingsd local polling settings update |
| dfetchdock [--json|--human] [--data-dir <path>] poll-due-channelsd | dchannels_poll_dued / dpoll_due_channels_at_rootd local due-poll execution |
| dfetchdock [--json|--human] [--data-dir <path>] export-channels-summary [output.json]d | dchannels_export_local_summaryd / dexport_channels_local_summary_at_rootd local channel metadata-only summary export |
| dfetchdock [--json|--human] [--data-dir <path>] export-settings [output.json]d | dsettings_export_manifestd / dexport_settings_manifest_at_rootd safe manifest writer |
| dfetchdock [--json|--human] [--data-dir <path>] import-settings <settings-manifest.json>d | dsettings_import_manifestd / dimport_settings_manifest_at_rootd safe manifest reader |
| dfetchdock [--json|--human] [--data-dir <path>] coursesd | local dread_coursesd course outline listing |
| dfetchdock [--json|--human] [--data-dir <path>] course-platformsd | dcourses_get_platform_matrixd / dbuild_course_platform_matrixd local course host/status matrix |
| dfetchdock [--json|--human] [--data-dir <path>] [--cookie-bucket <id>] probe-course <url>d | dbuild_course_entry_with_remote_outlined best-effort yt-dlp-visible outline probe, falling back to metadata-pending candidate |
| dfetchdock [--json|--human] [--data-dir <path>] [--cookie-bucket <id>] import-course <url>d | dbuild_course_entry_with_remote_outlined best-effort yt-dlp-visible outline import into local course store, falling back to metadata-pending candidate |
| dfetchdock [--json|--human] [--data-dir <path>] [--cookie-bucket <id>] import-course-manifest <course.json>d | dcourses_import_manifestd / dimport_course_manifest_at_rootd local course outline import |
| dfetchdock [--json|--human] [--data-dir <path>] export-course-manifest [--output <courses.json>] [--ids <course-id,id>]d | dcourses_export_manifestd / dexport_course_manifest_at_rootd local course outline bundle export |
| dfetchdock [--json|--human] [--data-dir <path>] [--cookie-bucket <id>] import-course-bundle <courses.json>d | dcourses_import_manifest_bundle / dimport_course_manifest_bundle_at_rootd local course outline bundle import |
| dfetchdock [--json|--human] [--data-dir <path>] export-course-progress [--output <progress.json>] [--ids <course-id,id>]d | dcourses_export_progressd / dexport_course_progress_at_rootd local course lesson progress backup export |
| dfetchdock [--json|--human] [--data-dir <path>] import-course-progress <progress.json>d | dcourses_import_progressd / dimport_course_progress_at_rootd local course lesson progress restore for matching existing course/lesson ids |
| dfetchdock [--json|--human] [--data-dir <path>] delete-course <course-id>d | dcourses_deleted / ddelete_course_at_rootd local course outline removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-courses <course-id>[,<course-id>...]d | dcourses_delete_manyd / ddelete_courses_at_rootd local course outline bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-coursesd | dcourses_cleard / dclear_courses_at_rootd local course outline clear |
| dfetchdock [--json|--human] [--data-dir <path>] delete-course-lesson <course-id> <lesson-id>d | dcourses_delete_lessond / ddelete_course_lesson_at_rootd local lesson index removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-course-lessons <course-id>:<lesson-id>[,<course-id>:<lesson-id>...]d | dcourses_delete_lessonsd / ddelete_course_lessons_at_rootd explicit local lesson id-list bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-course-attachment <course-id> <attachment-id>d | dcourses_delete_attachmentd / ddelete_course_attachment_at_rootd local attachment index removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-course-attachments <course-id>:<attachment-id>[,<course-id>:<attachment-id>...]d | dcourses_delete_attachmentsd / ddelete_course_attachments_at_rootd explicit local attachment id-list bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] prune-coursesd | dcourses_prune_missing_local_filesd / dprune_missing_course_local_files_at_rootd stale local path cleanup |
| dfetchdock [--json|--human] [--data-dir <path>] update-course-progress <course-id> <lesson-id> --progress <0-100>d | dcourses_update_progressd / dupdate_course_progress_at_rootd local lesson progress update |
| dfetchdock [--json|--human] [--data-dir <path>] update-course-cookie <course-id> [--cookie-bucket <id>\|--clear]d | dcourses_update_cookie_bucketd / dupdate_course_cookie_bucket_at_rootd local course Cookie bucket pointer update |
| dfetchdock [--json|--human] [--data-dir <path>] save-course-note <course-id> <lesson-id> --title <text> --body <text> [--timestamp <seconds>]d | dcourses_save_lesson_noted / dsave_course_lesson_note_at_rootd local course lesson note save |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] [--cookie-bucket <id>] queue-course-lesson <course-id> <lesson-id>d | dcourses_queue_lessond / dqueue_course_lesson_at_rootd local lesson queued-task creation |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] [--cookie-bucket <id>] queue-course-lessons <course-id> [--limit <n>]d | dcourses_queue_all_lessonsd / dqueue_all_course_lessons_at_rootd local lesson batch queued-task creation |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] [--cookie-bucket <id>] queue-course-many-lessons <course-id>:<lesson-id>[,<course-id>:<lesson-id>...]d | dcourses_queue_many_lessonsd / dqueue_many_course_lessons_at_rootd explicit local lesson id-list queued-task creation |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] [--cookie-bucket <id>] queue-course-attachment <course-id> <attachment-id>d | dcourses_queue_attachmentd / dqueue_course_attachment_at_rootd local attachment queued-task creation |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] [--cookie-bucket <id>] queue-course-attachments <course-id> [--limit <n>]d | dcourses_queue_all_attachmentsd / dqueue_all_course_attachments_at_rootd local attachment batch queued-task creation |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] [--cookie-bucket <id>] queue-course-many-attachments <course-id>:<attachment-id>[,<course-id>:<attachment-id>...]d | dcourses_queue_many_attachmentsd / dqueue_many_course_attachments_at_rootd explicit local attachment id-list queued-task creation |
| dfetchdock [--json|--human] [--data-dir <path>] telegram-auth-start [--label <phone-hint>]d | dtelegram_auth_startd / dwrite_telegram_stated local placeholder auth-state update |
| dfetchdock [--json|--human] [--data-dir <path>] telegram-logoutd | dtelegram_logoutd / dwrite_telegram_stated local auth-state reset |
| dfetchdock [--json|--human] [--data-dir <path>] telegram-stated | dtelegram_get_stated / dread_telegram_stated local account-state read |
| dfetchdock [--json|--human] [--data-dir <path>] export-telegram-state [output.json]d | dtelegram_export_stated / dexport_telegram_state_at_rootd local placeholder account-state JSON export without MTProto session secrets |
| dfetchdock [--json|--human] [--data-dir <path>] import-telegram-state <state.json>d | dtelegram_import_stated / dimport_telegram_state_at_rootd local placeholder account-state JSON import; signed-in backups restore as pending |
| dfetchdock [--json|--human] [--data-dir <path>] telegram-statusd | dtelegram_get_sync_statusd / dbuild_telegram_sync_status_at_rootd local sync summary |
| dfetchdock [--json|--human] [--data-dir <path>] telegram-summaryd | dtelegram_get_local_summaryd / dbuild_telegram_local_summary_at_rootd metadata-only local manifest and transfer summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-telegram-summary [output.json]d | dtelegram_export_local_summaryd / dexport_telegram_local_summary_at_rootd metadata-only local summary JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] telegram-chatsd | dtelegram_list_chatsd / dread_telegram_chatsd local chat/media listing |
| dfetchdock [--json|--human] [--data-dir <path>] telegram-search <query>d | dtelegram_searchd / dsearch_telegram_at_rootd local chat/media search |
| dfetchdock [--json|--human] [--data-dir <path>] import-telegram-manifest <telegram.json>d | dtelegram_import_manifestd / dimport_telegram_manifest_at_rootd local chat/media manifest import |
| dfetchdock [--json|--human] [--data-dir <path>] export-telegram-manifest [--output <telegram.json>] [--ids <chat-id,id>]d | dtelegram_export_manifestd / dexport_telegram_manifest_at_rootd local chat/media manifest JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] delete-telegram-chat <chat-id>d | dtelegram_delete_chatd / ddelete_telegram_chat_at_rootd local chat index removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-telegram-chats <chat-id>[,<chat-id>...]d | dtelegram_delete_chatsd / ddelete_telegram_chats_at_rootd local chat index bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-telegram-media <media-id>d | dtelegram_delete_mediad / ddelete_telegram_media_at_rootd local media index removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-telegram-media-items <media-id>[,<media-id>...]d | dtelegram_delete_media_itemsd / ddelete_telegram_media_items_at_rootd local media index bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-telegram-chatsd | dtelegram_clear_chatsd / dclear_telegram_chats_at_rootd local chat/media index clear |
| dfetchdock [--json|--human] [--data-dir <path>] prune-telegram-mediad | dtelegram_prune_missing_local_mediad / dprune_missing_telegram_local_media_at_rootd stale local media path cleanup |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] queue-telegram-media <media-id>[,<media-id>...]d | dtelegram_download_mediad / dtelegram_queue_media_itemsd local media queued-task creation |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] copy-telegram-media <media-id>[,<media-id>...]d | dtelegram_copy_local_mediad / dcopy_telegram_local_media_at_rootd local existing-media file copy; aliases dtelegram-copy-mediad and dsave-telegram-mediad |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] clone-telegram-chat <chat-id> [--media-types <photo,video,audio,document,file>] [--limit <n>]d | dtelegram_clone_wizardd / dclone_telegram_chat_at_rootd local chat media batch queued-task creation |
| dfetchdock [--json|--human] [--data-dir <path>] bilibili-statusd | dbilibili_account_statusd / dget_bilibili_account_status_at_rootd local status summary |
| dfetchdock [--json|--human] [--data-dir <path>] bilibili-summaryd | dbilibili_get_local_summaryd / dbuild_bilibili_local_summary_at_rootd metadata-only local Cookie/import/transfer summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-bilibili-summary [output.json]d | dbilibili_export_local_summaryd / dexport_bilibili_local_summary_at_rootd metadata-only local Bilibili summary JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] bilibili-imports [--collection <watch_later|history>]d | dbilibili_list_importedd / dread_bilibili_import_itemsd local import listing |
| dfetchdock [--json|--human] [--data-dir <path>] import-bilibili-manifest <bilibili.json> --collection <watch_later|history|manifest>d | dbilibili_import_manifestd / dimport_bilibili_manifest_at_rootd local watch-later/history manifest import; dmanifestd preserves per-item collection |
| dfetchdock [--json|--human] [--data-dir <path>] export-bilibili-manifest [--output <bilibili.json>] [--collection <all|watch_later|history>] [--ids <id,id>]d | dbilibili_export_manifestd / dexport_bilibili_manifest_at_rootd local import manifest export |
| dfetchdock [--json|--human] [--data-dir <path>] delete-bilibili-import <item-id>d | dbilibili_delete_imported_itemd / ddelete_bilibili_import_item_at_rootd local import item removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-bilibili-imports <item-id>[,<item-id>...]d | dbilibili_delete_imported_itemsd / ddelete_bilibili_import_items_at_rootd local import item bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-bilibili-imports [--collection <watch_later|history>]d | dbilibili_clear_importedd / dclear_bilibili_import_items_at_rootd local import item clear |
| dfetchdock [--json|--human] [--data-dir <path>] queue-bilibili-imports <item-id>[,<item-id>...]d | dbilibili_queue_imported_itemd / dbilibili_queue_imported_itemsd local import queued-task creation |
| dfetchdock [--json|--human] [--data-dir <path>] channelsd | dchannels_listd / dread_channelsd local subscription listing |
| dfetchdock [--json|--human] [--data-dir <path>] channels-summaryd | dapp_get_local_channels_summaryd / dbuild_local_channels_summary_at_rootd local subscription/history/settings summary |
| dfetchdock [--json|--human] [--data-dir <path>] add-channel <name> <url> [--platform <label>] [--auto-download] [--disabled]d | dchannels_addd / dadd_channel_at_rootd local subscription creation |
| dfetchdock [--json|--human] [--data-dir <path>] delete-channel <channel-id>d | dchannels_removed / local channel subscription removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-channels <channel-id>[,<channel-id>...]d | dchannels_remove_manyd / dremove_channels_at_rootd local subscription bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-channelsd | dchannels_cleard / dclear_channels_at_rootd local subscription clear |
| dfetchdock [--json|--human] [--data-dir <path>] check-channel <channel-id>d | dchannels_check_nowd / dcheck_channel_now_at_rootd local feed/probe check |
| dfetchdock [--json|--human] [--data-dir <path>] channel-historyd | dchannels_list_historyd / dread_channel_historyd local history listing |
| dfetchdock [--json|--human] [--data-dir <path>] delete-channel-history <history-id>d | dchannels_delete_history_itemd / ddelete_channel_history_item_at_rootd local history removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-channel-histories <history-id>[,<history-id>...]d | dchannels_delete_history_itemsd / ddelete_channel_history_items_at_rootd local history bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-channel-historyd | dchannels_clear_historyd / dclear_channel_history_at_rootd local history clear |
| dfetchdock [--json|--human] [--data-dir <path>] mark-channel-history <history-id>d | dchannels_mark_notification_shownd / dmark_channel_notification_shown_at_rootd local notification-state update |
| dfetchdock [--json|--human] [--data-dir <path>] mark-channel-histories <history-id>[,<history-id>...]d | dchannels_mark_notifications_shownd / dmark_channel_notifications_shown_at_rootd local notification-state batch update |
| dfetchdock [--json|--human] [--data-dir <path>] queue-channel-history <history-id>[,<history-id>...]d | dchannels_queue_history_itemsd / dqueue_channel_history_items_at_rootd local history queued-task creation |
| dfetchdock [--json|--human] [--data-dir <path>] parse-torrent <torrent-file>d | dparse_torrent_filed local metadata parser |
| dfetchdock [--json|--human] [--data-dir <path>] parse-magnet <magnet-uri>d | dparse_magnet_urid local metadata parser |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] queue-torrent <torrent-file> [--select <torrent/path,...>]d | dqueue_torrent_file_at_rootd local torrent queued-task draft |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] queue-magnet <magnet-uri>d | dqueue_magnet_at_rootd local magnet queued-task draft |
| dfetchdock [--json|--human] [--data-dir <path>] p2p-offersd | dread_p2p_offersd local offer listing |
| dfetchdock [--json|--human] [--data-dir <path>] p2p-offer <short-code>d | dp2p_get_offerd / dfind_p2p_offer_by_code_at_rootd local offer lookup |
| dfetchdock [--json|--human] [--data-dir <path>] create-p2p-offer <file-path>d | dcreate_p2p_offer_at_rootd local short-code offer draft |
| dfetchdock [--json|--human] [--data-dir <path>] start-p2p-send <short-code>d | dstart_p2p_send_at_rootd blocking LAN share sender until one transfer, expiry, pause, or cancel |
| dfetchdock [--json|--human] [--data-dir <path>] probe-p2p-share <CODE@host:port>d | dprobe_p2p_share_coded LAN metadata probe |
| dfetchdock [--json|--human] [--data-dir <path>] prepare-p2p-receive <short-code|CODE@host:port> <output-dir>d | dprepare_p2p_receive_at_rootd local or LAN receive folder draft |
| dfetchdock [--json|--human] [--data-dir <path>] [--output-dir <path>] queue-p2p-receive <short-code|CODE@host:port>d | dqueue_p2p_receive_at_rootd local or LAN receive queued-task draft |
| dfetchdock [--json|--human] [--data-dir <path>] cancel-p2p-offer <short-code>d | dp2p_cancel_offerd / dcancel_p2p_offer_at_rootd local offer status update |
| dfetchdock [--json|--human] [--data-dir <path>] pause-p2p-offer <short-code>d | dp2p_pause_offerd / dpause_p2p_offer_at_rootd local offer status update |
| dfetchdock [--json|--human] [--data-dir <path>] resume-p2p-offer <short-code>d | dp2p_resume_offerd / dresume_p2p_offer_at_rootd local offer status update |
| dfetchdock [--json|--human] [--data-dir <path>] bulk-p2p-offers --action <pause\|resume\|cancel\|delete> --code <short-code> [--code <short-code>...]d | dp2p_bulk_action_at_rootd local offer bulk status/delete update |
| dfetchdock [--json|--human] [--data-dir <path>] delete-p2p-offer <short-code>d | dp2p_delete_offerd / ddelete_p2p_offer_at_rootd local offer record removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-p2p-offersd | dp2p_clear_offersd / dclear_p2p_offers_at_rootd local offer store clear |
| dfetchdock [--json|--human] [--data-dir <path>] libraryd | dlibrary_list_catalogd / dread_library_catalogd local reading catalog listing |
| dfetchdock [--json|--human] [--data-dir <path>] scan-library <folder>d | dlibrary_scan_folderd / dscan_library_folderd local preview scan |
| dfetchdock [--json|--human] [--data-dir <path>] import-library <folder>d | dlibrary_import_folderd / dimport_library_folder_at_rootd local catalog import |
| dfetchdock [--json|--human] [--data-dir <path>] rescan-libraryd | dlibrary_rescan_catalogd / drescan_library_catalog_at_rootd local catalog refresh |
| dfetchdock [--json|--human] [--data-dir <path>] prune-libraryd | dlibrary_prune_missingd / dprune_missing_library_items_at_rootd local missing-path prune |
| dfetchdock [--json|--human] [--data-dir <path>] delete-library-item <item-path>d | dlibrary_delete_catalog_itemd / ddelete_library_catalog_item_at_rootd local catalog item removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-library-items <item-path>[,<item-path>...]d | dlibrary_delete_catalog_itemsd / ddelete_library_catalog_items_at_rootd local catalog item bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-libraryd | dlibrary_clear_catalogd / dclear_library_catalog_at_rootd local catalog clear |
| dfetchdock [--json|--human] [--data-dir <path>] library-format-catalogd | dlibrary_get_format_catalogd / dbuild_library_format_catalog_at_rootd metadata-only reader format capability catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-library-format-catalog [output.json]d | dlibrary_export_format_catalogd / dexport_library_format_catalog_at_rootd metadata-only reader format catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] export-library-catalog [output.json]d | dlibrary_export_catalogd / dexport_library_catalog_at_rootd local reading catalog JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-library-catalog <catalog.json>d | dlibrary_import_catalogd / dimport_library_catalog_at_rootd local reading catalog JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] open-library-item <item-path>d | dlibrary_open_itemd / dopen_library_itemd bounded local preview data read |
| dfetchdock [--json|--human] [--data-dir <path>] extract-cbz-page-preview <item-path> <page-index>d | dlibrary_extract_cbz_page_previewd / dextract_cbz_page_preview_at_rootd bounded CBZ page preview cache write |
| dfetchdock [--json|--human] [--data-dir <path>] extract-epub-text-preview <item-path> <spine-index>d | dlibrary_extract_epub_text_previewd / dextract_epub_text_previewd bounded EPUB spine text extraction |
| dfetchdock [--json|--human] [--data-dir <path>] open-library-external <item-path>d | dlibrary_open_externald / dvalidate_library_item_pathd then system open |
| dfetchdock [--json|--human] [--data-dir <path>] reveal-library-item <item-path>d | dlibrary_reveal_itemd / dvalidate_library_item_pathd then system reveal |
| dfetchdock [--json|--human] [--data-dir <path>] library-reading-state <item-path>d | dlibrary_get_reading_stated / dread_library_reading_stated local reading-state read |
| dfetchdock [--json|--human] [--data-dir <path>] save-reading-progress <item-path> --progress <0-100>d | dlibrary_save_progressd / dsave_library_progress_at_rootd local progress update |
| dfetchdock [--json|--human] [--data-dir <path>] add-reading-bookmark <item-path> ...d | dlibrary_add_bookmarkd / dadd_library_bookmark_at_rootd local bookmark add |
| dfetchdock [--json|--human] [--data-dir <path>] add-reading-highlight <item-path> --text <text> ...d | dlibrary_add_highlightd / dadd_library_highlight_at_rootd local highlight add |
| dfetchdock [--json|--human] [--data-dir <path>] update-reading-bookmark <item-path> <bookmark-id> ...d | dlibrary_update_bookmarkd / dupdate_library_bookmark_at_rootd local bookmark update |
| dfetchdock [--json|--human] [--data-dir <path>] update-reading-highlight <item-path> <highlight-id> ...d | dlibrary_update_highlightd / dupdate_library_highlight_at_rootd local highlight update |
| dfetchdock [--json|--human] [--data-dir <path>] delete-reading-bookmark <item-path> <bookmark-id>d | dlibrary_delete_bookmarkd / ddelete_library_bookmark_at_rootd local bookmark removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-reading-highlight <item-path> <highlight-id>d | dlibrary_delete_highlightd / ddelete_library_highlight_at_rootd local highlight removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-reading-annotations <item-path> [--bookmark <id[,id]>] [--highlight <id[,id]>]d | dlibrary_delete_annotationsd / ddelete_library_annotations_at_rootd local bookmark/highlight bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-reading-annotations <item-path> [--scope <bookmarks\|highlights\|all>]d | dlibrary_clear_annotationsd / dclear_library_annotations_at_rootd local annotation clear |
| dfetchdock [--json|--human] [--data-dir <path>] export-reading-state <item-path> <output-path> [--format <json\|markdown>]d | dlibrary_export_reading_stated / dexport_library_reading_state_at_rootd local reading-state export |
| dfetchdock [--json|--human] [--data-dir <path>] import-reading-state <item-path> <state.json>d | dlibrary_import_reading_stated / dimport_library_reading_state_at_rootd local JSON reading-state import |
| dfetchdock [--json|--human] [--data-dir <path>] export-reading-states [output.json]d | dlibrary_export_reading_statesd / dexport_library_reading_states_at_rootd local all reading-states JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-reading-states <reading-states.json>d | dlibrary_import_reading_statesd / dimport_library_reading_states_at_rootd local all reading-states JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] reader-settingsd | dlibrary_get_reader_settingsd / dread_library_reader_settingsd local reader settings read |
| dfetchdock [--json|--human] [--data-dir <path>] update-reader-settings ...d | dlibrary_update_reader_settingsd / dupdate_library_reader_settings_at_rootd local reader settings update |
| dfetchdock [--json|--human] [--data-dir <path>] musicd | dmusic_list_catalogd / dread_music_catalogd local music catalog listing |
| dfetchdock [--json|--human] [--data-dir <path>] music-format-catalogd | dmusic_get_format_catalogd / dbuild_music_format_catalog_at_rootd metadata-only music format capability catalog |
| dfetchdock [--json|--human] [--data-dir <path>] export-music-format-catalog [output.json]d | dmusic_export_format_catalogd / dexport_music_format_catalog_at_rootd metadata-only music format catalog JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] music-servicesd | dmusic_get_service_matrixd / dbuild_music_service_matrixd local service support matrix |
| dfetchdock [--json|--human] [--data-dir <path>] scan-music <folder>d | dmusic_scan_folderd / dscan_music_folderd local preview scan |
| dfetchdock [--json|--human] [--data-dir <path>] import-music <folder>d | dmusic_import_folderd / dimport_music_folder_at_rootd local catalog import |
| dfetchdock [--json|--human] [--data-dir <path>] rescan-musicd | dmusic_rescan_catalogd / drescan_music_catalog_at_rootd local catalog refresh |
| dfetchdock [--json|--human] [--data-dir <path>] prune-musicd | dmusic_prune_missingd / dprune_missing_music_tracks_at_rootd local missing-path prune |
| dfetchdock [--json|--human] [--data-dir <path>] delete-music-track <track-path>d | dmusic_delete_catalog_trackd / ddelete_music_catalog_track_at_rootd local catalog track removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-music-tracks <track-path>[,<track-path>...]d | dmusic_delete_catalog_tracksd / ddelete_music_catalog_tracks_at_rootd local catalog track bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-musicd | dmusic_clear_catalogd / dclear_music_catalog_at_rootd local catalog clear |
| dfetchdock [--json|--human] [--data-dir <path>] export-music-catalog [output.json]d | dmusic_export_catalogd / dexport_music_catalog_at_rootd local music catalog JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-music-catalog <catalog.json>d | dmusic_import_catalogd / dimport_music_catalog_at_rootd local music catalog JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] music-queued | dmusic_get_queued / dread_music_queued local queue state read |
| dfetchdock [--json|--human] [--data-dir <path>] save-music-queue ...d | dmusic_save_queued / dsave_music_queue_at_rootd local queue state save |
| dfetchdock [--json|--human] [--data-dir <path>] export-music-queue [output.json]d | dmusic_export_queued / dexport_music_queue_at_rootd local queue metadata JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-music-queue <queue.json>d | dmusic_import_queued / dimport_music_queue_at_rootd local queue metadata JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] music-lyrics <track-path>d | dmusic_get_lyricsd / dread_music_lyricsd local sidecar lyrics read |
| dfetchdock [--json|--human] [--data-dir <path>] save-music-lyrics <track-path> [--text <lyrics>\|--file <lyrics.txt>] [--output <lyrics.lrc>] [--format <lrc\|txt\|srt\|vtt>]d | dmusic_save_lyricsd / dsave_music_lyrics_at_rootd local sidecar lyrics write |
| dfetchdock [--json|--human] [--data-dir <path>] music-playlistsd | dmusic_list_playlistsd / dread_music_playlistsd local playlist listing |
| dfetchdock [--json|--human] [--data-dir <path>] save-music-playlist --name <text> ...d | dmusic_save_playlistd / dsave_music_playlist_at_rootd local playlist save |
| dfetchdock [--json|--human] [--data-dir <path>] export-music-playlist [--id <playlist-id>|--all|<track-path>...] [--output <path.m3u8>]d | dmusic_export_playlistd / dexport_music_playlist_at_rootd local M3U/M3U8 playlist export |
| dfetchdock [--json|--human] [--data-dir <path>] import-music-playlist --path <playlist.m3u8> [--name <text>]d | dmusic_import_playlistd / dimport_music_playlist_at_rootd local M3U/M3U8 playlist import |
| dfetchdock [--json|--human] [--data-dir <path>] export-music-playlists [output.json] [--ids <playlist-id,id>]d | dmusic_export_playlistsd / dexport_music_playlists_at_rootd local playlist registry JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-music-playlists <playlists.json>d | dmusic_import_playlistsd / dimport_music_playlists_at_rootd local playlist registry JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] delete-music-playlist <playlist-id>d | dmusic_delete_playlistd / ddelete_music_playlist_at_rootd local playlist removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-music-playlists <playlist-id>[,<playlist-id>...]d | dmusic_delete_playlistsd / ddelete_music_playlists_at_rootd local playlist bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-music-playlistsd | dmusic_clear_playlistsd / dclear_music_playlists_at_rootd local playlist clear |
| dfetchdock [--json|--human] [--data-dir <path>] music-sleep-timerd | dmusic_get_sleep_timerd / dread_music_sleep_timerd local sleep timer read |
| dfetchdock [--json|--human] [--data-dir <path>] update-music-sleep-timer ...d | dmusic_update_sleep_timerd / dupdate_music_sleep_timer_at_rootd local sleep timer update |
| dfetchdock [--json|--human] [--data-dir <path>] music-equalizerd | dmusic_get_equalizerd / dread_music_equalizerd local equalizer read |
| dfetchdock [--json|--human] [--data-dir <path>] update-music-equalizer ...d | dmusic_update_equalizerd / dupdate_music_equalizer_at_rootd local equalizer update |
| dfetchdock [--json|--human] [--data-dir <path>] music-discord-presenced | dmusic_get_discord_presenced / dread_music_discord_presenced local Discord Presence settings read |
| dfetchdock [--json|--human] [--data-dir <path>] update-music-discord-presence ...d | dmusic_update_discord_presenced / dupdate_music_discord_presence_at_rootd local Discord Presence settings update |
| dfetchdock [--json|--human] [--data-dir <path>] music-playback-statsd | dmusic_get_playback_statsd / dmusic_playback_stats_at_rootd local playback stats read |
| dfetchdock [--json|--human] [--data-dir <path>] clear-music-playbackd | dmusic_clear_playback_historyd / dclear_music_playback_history_at_rootd local playback history clear |
| dfetchdock [--json|--human] [--data-dir <path>] export-music-playback [output.json]d | dmusic_export_playback_historyd / dexport_music_playback_history_at_rootd local playback event metadata backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-music-playback <playback.json>d | dmusic_import_playback_historyd / dimport_music_playback_history_at_rootd local playback event metadata restore |
| dfetchdock [--json|--human] [--data-dir <path>] learning-notes [--query <text>]d | dlearning_notes_listd / dread_learning_notesd local notes listing |
| dfetchdock [--json|--human] [--data-dir <path>] save-learning-note --title <text> --body <text> ...d | dlearning_notes_saved / dwrite_learning_notesd local note upsert |
| dfetchdock [--json|--human] [--data-dir <path>] delete-learning-note <note-id>d | dlearning_notes_deleted / ddelete_learning_note_at_rootd local note removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-learning-notes <note-id>[,<note-id>...]d | dlearning_notes_delete_manyd / ddelete_learning_notes_at_rootd local note bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-learning-notesd | dlearning_notes_cleard / dclear_learning_notes_at_rootd local note store clear |
| dfetchdock [--json|--human] [--data-dir <path>] export-learning-notes [--output <notes.json>] [--ids <id,id>]d | dlearning_notes_exportd / dexport_learning_notes_at_rootd local notes JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-learning-notes <notes.json>d | dlearning_notes_importd / dimport_learning_notes_at_rootd local notes JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] review-cards [--due] [--query <text>]d | dspaced_review_cards_listd / dread_spaced_review_cardsd local spaced-review card listing with optional due/query filters |
| dfetchdock [--json|--human] [--data-dir <path>] save-review-card --prompt <text> --answer <text> ...d | dspaced_review_cards_saved / dsave_spaced_review_card_at_rootd local spaced-review card upsert |
| dfetchdock [--json|--human] [--data-dir <path>] review-card <card-id> <again|hard|good|easy>d | dspaced_review_cards_reviewd / dreview_spaced_review_card_at_rootd local due/ease/interval update |
| dfetchdock [--json|--human] [--data-dir <path>] delete-review-card <card-id>d | dspaced_review_cards_deleted / ddelete_spaced_review_card_at_rootd local review-card removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-review-cards <card-id>[,<card-id>...]d | dspaced_review_cards_delete_manyd / ddelete_spaced_review_cards_at_rootd local review-card bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-review-cardsd | dspaced_review_cards_cleard / dclear_spaced_review_cards_at_rootd local review-card clear |
| dfetchdock [--json|--human] [--data-dir <path>] export-review-cards [--output <cards.json>] [--ids <id,id>]d | dspaced_review_cards_exportd / dexport_spaced_review_cards_at_rootd local review-card JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-review-cards <cards.json>d | dspaced_review_cards_importd / dimport_spaced_review_cards_at_rootd local review-card JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] learning-dashboardd | dlearning_get_dashboardd / dbuild_learning_dashboard_at_rootd local dashboard aggregation |
| dfetchdock [--json|--human] [--data-dir <path>] export-learning-dashboard [output.json]d | dlearning_export_dashboardd IPC / dexport_learning_dashboard_at_rootd local dashboard JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] learning-graphd | dlearning_get_graphd / dbuild_learning_graph_at_rootd local notes graph aggregation |
| dfetchdock [--json|--human] [--data-dir <path>] export-learning-graph [output.json]d | dlearning_export_graphd IPC / dexport_learning_graph_at_rootd local notes graph JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] pomodoro-sessionsd | dpomodoro_sessions_listd / dread_pomodoro_sessionsd local focus session listing |
| dfetchdock [--json|--human] [--data-dir <path>] save-pomodoro-session --duration <minutes> ...d | dpomodoro_sessions_saved / dwrite_pomodoro_sessionsd local focus session append |
| dfetchdock [--json|--human] [--data-dir <path>] export-pomodoro-sessions [--output <sessions.json>] [--ids <id,id>]d | dpomodoro_sessions_exportd / dexport_pomodoro_sessions_at_rootd local focus session JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-pomodoro-sessions <sessions.json>d | dpomodoro_sessions_importd / dimport_pomodoro_sessions_at_rootd local focus session JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] export-channels [--output <channels.json>] [--ids <id,id>] [--no-history] [--no-settings]d | dchannels_exportd / dexport_channels_at_rootd local channel subscription/history/settings JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] export-channels-summary [output.json]d | dchannels_export_local_summaryd / dexport_channels_local_summary_at_rootd local channel metadata-only summary export |
| dfetchdock [--json|--human] [--data-dir <path>] import-channels <channels.json>d | dchannels_importd / dimport_channels_at_rootd local channel subscription/history/settings JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] delete-pomodoro-session <session-id>d | dpomodoro_sessions_deleted / ddelete_pomodoro_session_at_rootd local focus session removal |
| dfetchdock [--json|--human] [--data-dir <path>] delete-pomodoro-sessions <session-id>[,<session-id>...]d | dpomodoro_sessions_delete_manyd / ddelete_pomodoro_sessions_at_rootd local focus session bulk removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-pomodoro-sessionsd | dpomodoro_sessions_cleard / dclear_pomodoro_sessions_at_rootd local focus session clear |
| dfetchdock [--json|--human] [--data-dir <path>] daily-goal [minutes]d | dlearning_update_daily_goald / dupdate_learning_daily_goal_at_rootd local goal read/update |
| dfetchdock [--json|--human] [--data-dir <path>] extension-optionsd | dextension_get_optionsd / dread_extension_options_stated local extension options read |
| dfetchdock [--json|--human] [--data-dir <path>] extension-summaryd | dextension_get_local_summaryd / dbuild_extension_local_summary_at_rootd local browser-extension options/pairing/payload inventory/package/release-safety metadata summary without browser storage or secrets |
| dfetchdock [--json|--human] [--data-dir <path>] export-extension-summary [output.json]d | dextension_export_local_summaryd / dexport_extension_local_summary_at_rootd local JSON export for the same metadata-only browser-extension summary |
| dfetchdock [--json|--human] [--data-dir <path>] extension-package-summaryd | dextension_get_local_package_summaryd / dbuild_extension_local_package_summaryd local browser-extension source/package metadata summary without browser storage or secrets |
| dfetchdock [--json|--human] [--data-dir <path>] export-extension-package-summary [output.json]d | dextension_export_local_package_summaryd / dexport_extension_local_package_summary_at_rootd local JSON export for the same metadata-only browser-extension source/package summary |
| dfetchdock [--json|--human] [--data-dir <path>] extension-release-safetyd | dextension_get_release_safety_summaryd / dbuild_extension_release_safety_summary_at_rootd local browser-extension package/pairing/options release-safety metadata without token or payload secrets |
| dfetchdock [--json|--human] [--data-dir <path>] export-extension-release-safety [output.json]d | dextension_export_release_safety_summaryd / dexport_extension_release_safety_summary_at_rootd local JSON export for the same metadata-only browser-extension release-safety summary |
| dfetchdock [--json|--human] [--data-dir <path>] update-extension-options ...d | dextension_update_optionsd / dupdate_extension_options_state_at_rootd local bridge/options/discovery-ports/header-capture update |
| dfetchdock [--json|--human] [--data-dir <path>] extension-connector-profile [--create-token|--token <token>] [--label <text>]d | Prints extension options/header-capture import JSON; d--create-tokend writes a fresh local pairing token; payload excludes staged Cookie/Auth contents |
| dfetchdock [--json|--human] [--data-dir <path>] extension-pairingd | dextension_get_pairing_statusd / dread_extension_pairing_stated local pairing status |
| dfetchdock [--json|--human] [--data-dir <path>] export-extension-pairing [output.json]d | dextension_export_pairingd / dexport_extension_pairing_at_rootd metadata-only pairing JSON export without token values |
| dfetchdock [--json|--human] [--data-dir <path>] import-extension-pairing <pairing.json>d | dextension_import_pairingd / dimport_extension_pairing_at_rootd metadata-only pairing JSON import; token values are not restored |
| dfetchdock [--json|--human] [--data-dir <path>] create-extension-token [--label <text>]d | dextension_create_pairing_tokend / dwrite_extension_pairing_stated local token creation |
| dfetchdock [--json|--human] [--data-dir <path>] revoke-extension-tokend | dextension_revoke_pairingd / dwrite_extension_pairing_stated local token revoke |
| dfetchdock [--json|--human] [--data-dir <path>] extension-cookie-payloadsd | dextension_list_cookie_payloadsd / dlist_extension_cookie_payloads_at_rootd local staged Cookie payload listing |
| dfetchdock [--json|--human] [--data-dir <path>] import-extension-cookies <name> <payload-ref> [platform]d | dcookies_importd / dimport_cookie_bucket_at_rootd imports a staged Cookie payload into a managed Cookie bucket without printing Cookie values |
| dfetchdock [--json|--human] [--data-dir <path>] delete-extension-cookie-payload <payload-ref>d | dextension_delete_cookie_payloadd / ddelete_extension_cookie_payload_at_rootd local staged Cookie payload deletion |
| dfetchdock [--json|--human] [--data-dir <path>] delete-extension-cookie-payloads <payload-ref>[,<payload-ref>...]d | dextension_delete_cookie_payloadsd / ddelete_extension_cookie_payloads_at_rootd local staged Cookie payload bulk deletion |
| dfetchdock [--json|--human] [--data-dir <path>] clear-extension-cookie-payloadsd | dextension_clear_cookie_payloadsd / dclear_extension_cookie_payloads_at_rootd local staged Cookie payload clear |
| dfetchdock [--json|--human] [--data-dir <path>] extension-auth-payloadsd | dextension_list_authorization_payloadsd / dlist_extension_authorization_payloads_at_rootd local staged Authorization payload listing |
| dfetchdock [--json|--human] [--data-dir <path>] delete-extension-auth-payload <payload-ref>d | dextension_delete_authorization_payloadd / ddelete_extension_authorization_payload_at_rootd local staged Authorization payload deletion |
| dfetchdock [--json|--human] [--data-dir <path>] delete-extension-auth-payloads <payload-ref>[,<payload-ref>...]d | dextension_delete_authorization_payloadsd / ddelete_extension_authorization_payloads_at_rootd local staged Authorization payload bulk deletion |
| dfetchdock [--json|--human] [--data-dir <path>] clear-extension-auth-payloadsd | dextension_clear_authorization_payloadsd / dclear_extension_authorization_payloads_at_rootd local staged Authorization payload clear |
| dfetchdock [--json|--human] [--data-dir <path>] pluginsd | dplugins_listd / dlist_plugins_at_rootd local plugin registry listing |
| dfetchdock [--json|--human] [--data-dir <path>] plugin-trust-summaryd | dbuild_local_plugin_trust_summary_at_rootd local plugin trust/readiness summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-plugin-trust-summary [output.json]d | dexport_local_plugin_trust_summary_at_rootd local plugin trust/readiness JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] plugin-marketplaced | dplugins_list_marketplaced / dread_plugin_marketplace_entriesd local marketplace listing |
| dfetchdock [--json|--human] [--data-dir <path>] import-plugin-marketplace <registry.json>d | dplugins_import_marketplaced / dimport_plugin_marketplace_at_rootd local marketplace import |
| dfetchdock [--json|--human] [--data-dir <path>] export-plugin-registry [output.json]d | dplugins_export_registryd / dexport_plugin_registry_at_rootd local installed plugin registry JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-plugin-registry <registry.json>d | dplugins_import_registryd / dimport_plugin_registry_at_rootd local installed plugin registry state restore |
| dfetchdock [--json|--human] [--data-dir <path>] export-plugin-settings [output.json]d | dplugins_export_settingsd / dexport_plugin_settings_at_rootd explicit installed plugin settings JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-plugin-settings <settings.json>d | dplugins_import_settingsd / dimport_plugin_settings_at_rootd explicit installed plugin settings JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] delete-plugin-marketplace <plugin-id>d | dplugins_delete_marketplace_entryd / ddelete_plugin_marketplace_entry_at_rootd local marketplace entry deletion |
| dfetchdock [--json|--human] [--data-dir <path>] delete-plugin-marketplaces <plugin-id>[,<plugin-id>...]d | dplugins_delete_marketplace_entriesd / ddelete_plugin_marketplace_entries_at_rootd local marketplace entry bulk deletion |
| dfetchdock [--json|--human] [--data-dir <path>] clear-plugin-marketplaced | dplugins_clear_marketplaced / dclear_plugin_marketplace_at_rootd local marketplace clear |
| dfetchdock [--json|--human] [--data-dir <path>] install-plugin <plugin.json|plugin-dir>d | dplugins_installd / dinstall_plugin_manifest_at_rootd local manifest install |
| dfetchdock [--json|--human] [--data-dir <path>] install-plugin-failure-sampled | dplugins_install_failure_sampled / dinstall_plugin_failure_sample_at_rootd local failure sample install |
| dfetchdock [--json|--human] [--data-dir <path>] update-plugin <plugin-id>d | dplugins_update_from_marketplaced / dupdate_plugin_from_marketplace_at_rootd local manifest update |
| dfetchdock [--json|--human] [--data-dir <path>] update-pluginsd | dplugins_update_all_from_marketplaced / dupdate_all_plugins_from_marketplace_at_rootd local bulk manifest update |
| dfetchdock [--json|--human] [--data-dir <path>] install-missing-pluginsd | dplugins_install_missing_from_marketplaced / dinstall_missing_plugins_from_marketplace_at_rootd local marketplace install-missing |
| dfetchdock [--json|--human] [--data-dir <path>] uninstall-plugin <plugin-id> [--remove-data]d | dplugins_uninstalld / duninstall_plugin_at_rootd local plugin uninstall |
| dfetchdock [--json|--human] [--data-dir <path>] enable-plugin <plugin-id>d | dplugins_enabled / dset_plugin_state_at_rootd local registry state update |
| dfetchdock [--json|--human] [--data-dir <path>] disable-plugin <plugin-id>d | dplugins_disabled / dset_plugin_state_at_rootd local registry state update |
| dfetchdock [--json|--human] [--data-dir <path>] enable-plugins <plugin-id>[,<plugin-id>...]d | dplugins_set_state_manyd / dset_plugin_states_at_rootd local registry bulk enable |
| dfetchdock [--json|--human] [--data-dir <path>] disable-plugins <plugin-id>[,<plugin-id>...]d | dplugins_set_state_manyd / dset_plugin_states_at_rootd local registry bulk disable |
| dfetchdock [--json|--human] [--data-dir <path>] check-plugin <plugin-id>d | dplugins_check_hostd / dcheck_plugin_host_at_rootd local manifest/library preflight |
| dfetchdock [--json|--human] [--data-dir <path>] check-pluginsd | dplugins_check_all_hostsd / dcheck_all_plugin_hosts_at_rootd local bulk preflight |
| dfetchdock [--json|--human] [--data-dir <path>] plugin-settings <plugin-id>d | dplugins_get_settingsd / dread_plugin_settings_at_rootd local settings read |
| dfetchdock [--json|--human] [--data-dir <path>] plugin-data-dir <plugin-id>d | dplugins_get_data_dird / dplugin_data_dir_response_at_rootd local data-dir resolution |
| dfetchdock [--json|--human] [--data-dir <path>] plugin-command-logs <plugin-id> [--limit <n>]d | dplugins_list_command_logsd / dlist_plugin_command_logs_at_rootd local command log read |
| dfetchdock [--json|--human] [--data-dir <path>] clear-plugin-command-logs <plugin-id>d | dplugins_clear_command_logsd / dclear_plugin_command_logs_at_rootd local command log clear |
| dfetchdock [--json|--human] [--data-dir <path>] plugin-events <plugin-id> [--limit <n>]d | dplugins_list_eventsd / dlist_plugin_events_at_rootd local event log read |
| dfetchdock [--json|--human] [--data-dir <path>] clear-plugin-events <plugin-id>d | dplugins_clear_eventsd / dclear_plugin_events_at_rootd local event log clear |
| dfetchdock [--json|--human] [--data-dir <path>] plugin-activity <plugin-id> [--limit <n>]d | dplugins_list_activityd / dlist_plugin_activity_at_rootd local activity log read |
| dfetchdock [--json|--human] [--data-dir <path>] clear-plugin-activity <plugin-id>d | dplugins_clear_activityd / dclear_plugin_activity_at_rootd local activity log clear |
| dfetchdock [--json|--human] [--data-dir <path>] clear-plugin-logs-many <commands\|events\|activity> <plugin-id>[,<plugin-id>...]d | dplugins_clear_logs_manyd / dclear_plugin_logs_many_at_rootd local multi-plugin log clear |
| dfetchdock [--json|--human] [--data-dir <path>] cookies [--platform <label>]d | dcookies_list_bucketsd / dread_cookie_bucketsd local Cookie bucket listing |
| dfetchdock [--json|--human] [--data-dir <path>] match-cookies <url>d | dcookies_match_urld / local domain-hint matching |
| dfetchdock [--json|--human] [--data-dir <path>] test-cookie <bucket-id> [--url <url>]d | dcookies_testd / dtest_cookie_bucket_at_rootd local Cookie bucket health refresh |
| dfetchdock [--json|--human] [--data-dir <path>] test-cookies <bucket-id>[,<bucket-id>...] [--url <url>]d | dcookies_test_manyd / dtest_cookie_buckets_at_rootd local Cookie bucket health batch refresh |
| dfetchdock [--json|--human] [--data-dir <path>] rename-cookie <bucket-id> <new-name>d | dcookies_rename_bucketd / local Cookie bucket metadata update |
| dfetchdock [--json|--human] [--data-dir <path>] export-cookie <bucket-id> <output-path>d | dcookies_exportd / local Cookie file copy |
| dfetchdock [--json|--human] [--data-dir <path>] delete-cookie <bucket-id>d | dcookies_delete_bucketd / local Cookie bucket removal |
| dfetchdock [--json|--human] [--data-dir <path>] clear-cookies (--bucket <id[,id]>\|--platform <label>)d | dcookies_cleard / dclear_cookie_buckets_at_rootd local filtered Cookie bucket clear |
| dfetchdock [--json|--human] [--data-dir <path>] cookies-summaryd | dbuild_cookie_auth_local_summary_at_rootd metadata-only Cookie/Auth local summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-cookies-summary [output.json]d | dexport_cookie_auth_local_summary_at_rootd metadata-only Cookie/Auth JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] infrastructure-summaryd | dapp_get_infrastructure_summaryd / dbuild_cli_app_infrastructure_summaryd metadata-only app path/shell summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-infrastructure-summary [output.json]d | dapp_export_infrastructure_summaryd / dexport_cli_app_infrastructure_summary_at_rootd metadata-only app path/shell JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] tools-statusd | dtools_get_statusd / ddetect_tool_statusesd local dependency status |
| dfetchdock [--json|--human] [--data-dir <path>] tools-summaryd | dtools_get_local_summaryd / dbuild_tools_local_summary_at_rootd metadata-only dependency summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-tools-summary [output.json]d | dtools_export_local_summaryd / dexport_tools_local_summary_at_rootd metadata-only dependency JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] check-tool-update <tool-id>d | dtools_check_updated / dcheck_tool_update_at_rootd explicit managed dependency update check |
| dfetchdock [--json|--human] [--data-dir <path>] metadata-summaryd | dmetadata_get_local_summaryd / dbuild_metadata_local_summary_at_rootd metadata-only Metadata tools local summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-metadata-summary [output.json]d | dmetadata_export_local_summaryd / dexport_metadata_local_summary_at_rootd metadata-only Metadata tools JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] media-summaryd | dmedia_get_local_summaryd / dbuild_media_tools_local_summary_at_rootd metadata-only Media tools local summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-media-summary [output.json]d | dmedia_export_local_summaryd / dexport_media_tools_local_summary_at_rootd metadata-only Media tools JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] ai-summaryd | dai_get_local_summaryd / dbuild_ai_local_summary_at_rootd metadata-only AI/Whisper settings summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-ai-summary [output.json]d | dai_export_local_summaryd / dexport_ai_local_summary_at_rootd metadata-only AI/Whisper settings JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] export-ai-settings [output.json]d | dai_export_settingsd / dexport_ai_settings_at_rootd local AI provider/Whisper/flag settings JSON backup |
| dfetchdock [--json|--human] [--data-dir <path>] import-ai-settings <input.json>d | dai_import_settingsd / dimport_ai_settings_at_rootd local AI provider/Whisper/flag settings JSON restore |
| dfetchdock [--json|--human] [--data-dir <path>] platforms-summaryd | dplatforms_get_local_summaryd / dbuild_platform_local_summaryd metadata-only Support matrix local summary |
| dfetchdock [--json|--human] [--data-dir <path>] export-platforms-summary [output.json]d | dplatforms_export_local_summaryd / dexport_platform_local_summary_at_rootd metadata-only Support matrix JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] install-tool <tool-id>d | dtools_installd / drequest_tool_installd managed dependency install request |
| dfetchdock [--json|--human] [--data-dir <path>] update-tool <tool-id>d | dtools_updated / drequest_tool_updated managed dependency update request |
| dfetchdock [--json|--human] [--data-dir <path>] metadata-probe <url>d | dmetadata_probe_urld / dmetadata_probe_url_at_rootd yt-dlp metadata preview |
| dfetchdock [--json|--human] [--data-dir <path>] list-subtitles <url>d | dmetadata_list_subtitlesd / dmetadata_list_subtitles_at_rootd subtitle track listing |
| dfetchdock [--json|--human] [--data-dir <path>] list-thumbnails <url>d | dmetadata_list_thumbnailsd / dmetadata_list_thumbnails_at_rootd thumbnail listing |
| dfetchdock [--json|--human] [--data-dir <path>] list-chapters <url>d | dmetadata_list_chaptersd / dmetadata_list_chapters_at_rootd chapter listing |
| dfetchdock [--json|--human] [--data-dir <path>] list-comments <url>d | dmetadata_list_commentsd / dmetadata_list_comments_at_rootd comment listing |
| dfetchdock [--json|--human] [--data-dir <path>] save-subtitle <url> ...d | dmetadata_save_subtitled / dmetadata_save_subtitle_at_rootd local subtitle sidecar save |
| dfetchdock [--json|--human] [--data-dir <path>] save-thumbnail <url> ...d | dmetadata_save_thumbnaild / dmetadata_save_thumbnail_at_rootd local thumbnail save |
| dfetchdock [--json|--human] [--data-dir <path>] save-chapters <url> ...d | dmetadata_save_chaptersd / dmetadata_save_chapters_at_rootd local chapter sidecar save |
| dfetchdock [--json|--human] [--data-dir <path>] save-info-json <url> ...d | dmetadata_save_info_jsond / dmetadata_save_info_json_at_rootd local info JSON save |
| dfetchdock [--json|--human] [--data-dir <path>] save-comments <url> ...d | dmetadata_save_commentsd / dmetadata_save_comments_at_rootd local comments sidecar save |
| dfetchdock [--json|--human] [--data-dir <path>] save-live-chat <url> ...d | dmetadata_save_live_chatd / dmetadata_save_live_chat_at_rootd local live-chat sidecar save |
| dfetchdock [--json|--human] merge-subtitles <output-subtitle> <input1> <input2>...d | dmetadata_merge_subtitlesd / dmetadata_merge_subtitles_at_rootd local subtitle text merge |
| dfetchdock [--json|--human] [--data-dir <path>] clip-video <input-media> <output-media> ...d | dmedia_clip_videod / dmedia_clip_video_at_root_with_appd local FFmpeg clip or reencode job |
| dfetchdock [--json|--human] [--data-dir <path>] transcode-media <input-media> <output-media> ...d | dmedia_transcoded / dmedia_transcode_at_root_with_appd local FFmpeg transcode job |
| dfetchdock [--json|--human] [--data-dir <path>] detect-shots <input-media> ...d | dmedia_detect_shotsd / dmedia_detect_shots_at_rootd local FFmpeg shot marker detection |
| dfetchdock [--json|--human] save-shot-markers <markers.json> <output.json>d | dmedia_save_shot_markersd / dmedia_save_shot_markers_at_rootd local shot marker JSON export |
| dfetchdock [--json|--human] [--data-dir <path>] waveform-peaks <input-media> ...d | dmedia_generate_waveform_peaksd / dmedia_generate_waveform_peaks_at_rootd local waveform cache generation |
| dfetchdock [--json|--human] [--data-dir <path>] whisper-subtitles <input-media> [--output-dir <path>] [--output <file>] ...d | dmedia_generate_whisper_subtitlesd / dmedia_generate_whisper_subtitles_at_root_with_appd local Whisper CLI subtitle sidecar generation |
| dfetchdock [--json|--human] subtitle-open <subtitle-file>d | dsubtitle_workshop_opend / dsubtitle_workshop_open_at_rootd local subtitle text read |
| dfetchdock [--json|--human] subtitle-save <output-subtitle> (--content <text>\|--content-file <path>)d | dsubtitle_workshop_saved / dsubtitle_workshop_save_at_rootd local subtitle text write |
当前 CLI 实现子集：主 Tauri binary 在启动桌面 app 前处理 dinfod、dplatformsd/dmatrixd/dsupport-matrixd、dplatform-route-samplesd/droute-samplesd、dexport-platform-matrixd、dexport-platform-route-samplesd、dexport-course-matrixd、dcourse-platform-samplesd、dexport-course-samplesd、dexport-music-matrixd、ddownloadd、dbatchd、dtasksd、dtaskd、dlogsd、dstartd、dresumed、dretryd、dcanceld、darchived、drestored、ddeleted、dclear-completedd、dclear-archivedd、dimport-cookiesd、dimport-extension-cookiesd、dexport-settingsd、dimport-settingsd、dcoursesd、dimport-course-manifestd、dqueue-course-lessond、dqueue-course-lessonsd、dqueue-course-many-lessonsd、dqueue-course-attachmentd、dqueue-course-attachmentsd、dqueue-course-many-attachmentsd、dtelegram-statusd、dtelegram-summaryd、dexport-telegram-summaryd、dtelegram-chatsd、dimport-telegram-manifestd、dexport-telegram-manifestd、dqueue-telegram-mediad、dclone-telegram-chatd、dbilibili-statusd、dbilibili-summaryd、dexport-bilibili-summaryd、dbilibili-importsd、dimport-bilibili-manifestd、dqueue-bilibili-importsd 和 dhelpd。这些命令默认输出 JSON，并兼容命令前后的 d--jsond flag；d--humand 输出面向终端阅读的摘要；dplatformsd 输出与 dplatforms_get_matrixd 同源的本地 route/status/evidence/limitations 矩阵，不代表真实站点样例已通过；dplatform-route-samplesd 输出与 dplatforms_get_route_samplesd 同源的本地 classifier URL 清单，供人工矩阵准备和前端 route sample check 复用，不执行网络探测；dexport-platform-route-samples [output.json]d 把同一清单写出为 diagnostics JSON 或指定路径；dexport-platform-matrix [output.json]d、dexport-course-matrix [output.json]d、dexport-course-samples [output.json]d 和 dexport-music-matrix [output.json]d 会分别写出本地平台、课程平台、课程平台样例和音乐服务矩阵 diagnostics JSON 或指定路径，均不代表真实站点、远端课程或外部音乐服务已通过验收；d--data-dir <path>d 或 d--data-dir=<path>d 可指定 CLI 使用的数据根目录，未指定时仍使用当前目录下的 ddatad；ddownloadd 和 dbatchd 支持 d--kind <kind>d、d--output-dir <path>d、d--title <text>d、d--quality <value>d、d--audio-format <mp3|m4a|opus|flac|wav>d、d--cookie-bucket <id>d、d--user-agent <value>d、d--referer <url>d、d--proxy <url>d、d--rate-limit <value>d、d--live-from-startd、d--fragments <n>d、d--custom-args <args>d、d--start <seconds>d、d--end <seconds>d、d--auth-payload <id>d、d--thumbnail-url <url>d、d--sub-langs <langs>d、d--auto-subsd、d--embed-subsd、d--keep-vttd、d--sponsorblockd、d--sponsorblock-categories <cats>d、d--embed-metadatad、d--embed-thumbnaild 和 d--split-chaptersd，这些选项写入 queued task 请求；dtasksd 支持 d--statusd、d--alld、d--limitd 本地筛选；dtaskd、dlogsd、dstartd、dresumed、dretryd、dcanceld、darchived、drestored、ddeleted、dclear-completedd 和 dclear-archivedd 只读取或修改本地任务库/日志；dclear-completedd 可用 d--archive/d--delete 覆盖 Downloads 设置中的 completed cleanup 策略，dclear-archivedd 默认遵守 archived retention days，d--alld 会清理全部 archived 本地记录；dstart/resume/retry/canceld 不在 CLI 进程内执行下载；ddownloadd 和 dbatchd 只创建 queued 任务，不启动调度器；dimport-cookiesd 读取 Netscape cookie 文件并写入本地 Cookie bucket；dimport-extension-cookiesd 按本地 staged payload id 读取浏览器扩展 Cookie payload 并写入 Cookie bucket，输出只含 bucket metadata，不打印 Cookie 明文；dexport-settingsd / dimport-settingsd 复用安全 settings manifest 路径，dexport-settings [output.json]d 可指定导出目标，未指定时仍写入 diagnostics；导出/导入 Appearance、Downloads/Network、Update、Extension、Channels、Reader 和 Music 本地子集，但不导出或恢复 Cookie/header/token 明文；dcoursesd/dtelegram-chatsd/dbilibili-importsd/status 命令只读取本地 stores，dcourses-summaryd / dexport-courses-summaryd 只汇总或导出本地 course outline、lesson/attachment source/path/progress/note-count、Cookie bucket 引用和 course transfer task metadata，不导出 Cookie 值、Learning note 正文、下载文件或远端平台数据；dlibrary-summaryd / dexport-library-summaryd 只汇总或导出本地 reading catalog、path coverage、format/metadata/author counts、reading-state counts/progress 和 reader settings，不读取源文档正文、不执行完整 renderer 验收；dmusic-summaryd / dexport-music-summaryd 只汇总或导出本地 music catalog、path coverage、format/artist/album/metadata counts、queue、playlists、settings、playback stats 和 service matrix statuses，不连接外部音乐服务、不读取音频内容、不执行播放器验收；dp2p-summaryd / dexport-p2p-summaryd 只汇总或导出本地 P2P offers、source path coverage、receive folders、torrent/magnet/P2P draft task metadata、transfer status counts、info hash/tracker/web seed counts 和 sidecar-ready transfer metadata，不联系 trackers、DHT、relay、peers 或远端设备；dprobe-coursed / dimport-coursed 会先尝试 yt-dlp metadata / flat-playlist 可见 outline，成功时生成 lesson/thumbnail 草稿，失败时回退为 metadata-pending candidate；dexport-course-manifestd / dimport-course-bundle 只把本地 course outlines 写出/读入 FetchDock JSON bundle，不导出或导入 Cookie/session/download-output 或远端平台数据，dqueue-course-*d（包括显式 id 列表的 dqueue-course-many-lessonsd / dqueue-course-many-attachmentsd）、dqueue-telegram-mediad、dclone-telegram-chatd 和 dqueue-bilibili-importsd 只把已有本地 manifest 条目创建为 queued tasks；dcopy-telegram-mediad / dtelegram-copy-mediad / dsave-telegram-mediad 只把已有 dlocal_pathd 的本地 Telegram media 复制到显式 d--output-dird 目录并输出 copied/skipped metadata，不执行远端传输；dimport-course-manifestd、dimport-telegram-manifestd 和 dimport-bilibili-manifestd 只导入本地 JSON manifest 到现有 course/Telegram/Bilibili stores；dexport-course-manifestd 写出当前本地 course outline bundle，dimport-course-bundle 验证同一 bundle kind 后合并恢复本地 outlines，且不改变现有单 course import 格式；dexport-telegram-manifestd 只把当前本地 Telegram chats/media store 写出为 FetchDock JSON manifest，不导出账号 session 或执行 MTProto 同步；dtelegram-summaryd / dexport-telegram-summaryd 只汇总或导出本地 placeholder auth、manifest、media-path 和 transfer metadata，不导出账号 session 或读取媒体正文；dbilibili-summaryd / dexport-bilibili-summaryd 只汇总或导出本地 Cookie bucket/account status metadata、import manifest counts、linked transfer status counts 和 review notes，不导出 Cookie 值、账号 session、在线 API 响应或下载内容；这些命令除 dprobe-coursed / dimport-coursed 的 yt-dlp 可见 best-effort outline 外，不执行平台专用远端课程结构解析、MTProto 同步或 Bilibili 在线 API 拉取。独立 CLI binary、真实 CLI 下载执行和安装包 PATH 集成仍未实现。

下载任务 CLI 查询补充：dtasksd 现在支持 d--statusd、d--kindd、d--platformd、d--queryd/d--searchd、d--created-afterd、d--created-befored、d--updated-afterd、d--updated-befored、d--failed-onlyd/d--errors-onlyd、d--retryable-onlyd、d--with-outputd、d--sort queue|created|updated|title|status|platform|kindd、d--ascd/d--descd、d--alld 和 d--limitd；日期窗口可传 RFC3339 timestamp 或 dYYYY-MM-DDd 日期，date-only 的 after/from 会按当天开始匹配，before/until 会按当天结束匹配；JSON 输出会回显 dfiltersd、dsortd 和 ddescendingd，query 会递归匹配任务 JSON/details。dlogs <id>d 支持 d--searchd/d--queryd、d--issuesd/d--errorsd、d--leveld、d--sourced、d--cursord 和 d--limitd，复用本地分页日志读取路径；JSON 输出包含兼容 raw dlinesd 和结构化 dentriesd（line_number/source/level/message/is_issue/raw）。ddownload-logsd 支持 d--queryd/d--searchd、d--taskd/d--task-idd 和 d--limitd，只筛选本地 log file metadata 清单，不读取日志正文。这些查询只读取本地任务库或本地 download log 文件，不启动下载调度、不删除输出文件、不导出 Cookie/Auth 明文。

下载清理策略补充：dclear-completedd 无 flag 时读取 Downloads 设置里的 dcompleted_task_cleanupd，d--archive / d--delete 可单次覆盖为归档或删除本地 completed 任务记录；dclear-archivedd 无 flag 时遵守 darchived_task_retention_daysd，仅清理达到保留天数的 archived 本地记录，d--alld 会忽略保留期清理全部 archived 本地记录。上述清理只修改本地任务记录，不删除输出文件或远端内容。

CLI 批量删除补充：ddelete-coursesd、ddelete-course-lessonsd、ddelete-course-attachmentsd、ddelete-telegram-chatsd、ddelete-telegram-media-itemsd、ddelete-bilibili-importsd、ddelete-channelsd、ddelete-channel-historiesd、ddelete-learning-notesd 和 ddelete-pomodoro-sessionsd 已复用现有 backend bulk delete paths；这些命令只删除本地 store/index 记录，不删除下载文件、不执行远端删除、不触发真实课程/Telegram/Bilibili/Channel 同步。

补充：第二批 CLI 本地入口还覆盖 Channels、Torrent/P2P、Reading Library 和 Music 的 store/catalog 操作：dchannelsd/dadd-channeld/dcheck-channeld/dchannel-historyd/dqueue-channel-historyd 只读写本地 channel subscription/history 并创建本地 queued tasks；dexport-channelsd/dimport-channelsd 可把本地 channel subscriptions、history 和 polling settings 导出/导入为 JSON bundle，但不导出 Cookie、下载文件或已创建任务；dparse-torrentd/dparse-magnetd 只解析本地 metadata，dqueue-torrentd/dqueue-magnetd 只创建 torrent queued drafts，dp2p-offersd/dcreate-p2p-offerd/dstart-p2p-sendd/dprobe-p2p-shared/dprepare-p2p-received/dqueue-p2p-received 操作 short-code offer、显式 LAN share serving/probe 与 receive draft；dexport-p2p-offersd/dimport-p2p-offersd 只备份/恢复本地 offer records，导入时 serving offer 会降级为 waiting，不恢复 listener；P2P offer/probe 会携带单文件 SHA-256，CLI human 输出会显示该 hash，queued receive 会把该 hash 接到下载任务 expected SHA-256，dp2p-summaryd/dexport-p2p-summaryd 只汇总或导出这些 Torrent/P2P records 和 transfer metadata；dlibraryd/dlibrary-summaryd/dexport-library-summaryd/dscan-libraryd/dimport-libraryd/drescan-libraryd/dprune-libraryd 和 dmusicd/dscan-musicd/dimport-musicd/drescan-musicd/dprune-musicd 只操作或导出本地 reading/music catalog metadata。上述 CLI 命令不执行平台专用远端 sync、不执行真实 BitTorrent 下载/seeding，也不提供 P2P NAT traversal、relay、多 peer、跨进程断点续传、跨设备 hash 验收或完整 reader/player runtime。

补充：第三批 CLI 本地入口覆盖 Learning、Browser Extension 和 Plugins 的本地状态：Learning 命令只读写本地 notes/Pomodoro/daily-goal/spaced-review stores 并聚合 dashboard/graph；Extension 命令只读取 options/pairing/payload inventory、输出 connector profile JSON 或生成本地 pairing token；Plugin 命令只操作本地 manifest registry、marketplace JSON、settings/data-dir 和 preflight/log inspection。它们不执行真实浏览器安装/配对自动化、不读取 Cookie/Auth 明文、不执行动态插件代码，也不声明插件 host ABI 的真实 runtime 已完成。

补充：第四批 CLI 本地入口覆盖 dependency status 与 metadata 工具：dtools-statusd 只读取本地依赖检测状态；dcheck-tool-updated 只在用户显式调用时检查 managed dependency 的可用更新信息，不安装或替换工具；dmetadata-summaryd / dexport-metadata-summaryd 只汇总或导出本地 metadata settings、dependency/tool metadata、sidecar 与 waveform cache metadata；dmetadata-probed、dlist-subtitlesd、dlist-thumbnailsd、dlist-chaptersd、dlist-commentsd 和 dsave-*d metadata commands 复用已有 yt-dlp metadata/sidecar 保存路径。它们不代表最终真实站点矩阵、账号态样例、字幕质量、媒体处理或下载后自动后处理已通过。

补充：第五批 CLI 本地入口覆盖已有媒体工具服务：dmerge-subtitlesd、dsubtitle-opend、dsubtitle-saved 只读写本地字幕文本；dclip-videod、dtranscode-mediad、ddetect-shotsd、dsave-shot-markersd、dwaveform-peaksd 和 dwhisper-subtitlesd 复用本地 FFmpeg/Whisper 依赖解析与 sidecar/cache 输出路径。它们不代表所有真实媒体编码组合、长任务取消 UI、下载后自动处理链或平台样例矩阵已完成。

补充：第六批 CLI 本地入口覆盖 Cookie、Extension、Channels 和 Plugins 的本地管理面：Cookie 命令只读写 FetchDock 本地 Cookie bucket metadata/storage；Extension 命令只管理 staged Cookie/Auth payload、connector profile JSON 输出和 pairing token；Channel 命令只改本地 subscription/history/notification records；Plugin 命令只操作本地 manifest registry、marketplace JSON 和日志文件。它们不执行真实浏览器自动化、远端频道同步、远程 marketplace、签名校验、动态插件代码或下载内容删除。

补充：第七批 CLI 本地入口覆盖 Courses、Telegram、Bilibili、Learning notes 和 Pomodoro 的本地清单/目录清理与局部更新：Courses 命令可删除/清空本地 course outline、删除 lesson/attachment 索引、清理缺失本地路径、更新 lesson progress、更新 course Cookie bucket 指针和保存 lesson note；Telegram 命令可写入 placeholder auth state、reset 本地 auth state、搜索 imported chat/media、删除/清空本地 chat/media 索引并清理缺失 local_path；Bilibili 命令可删除或按 collection 清空本地 watch-later/history import items；Learning/Pomodoro 命令可删除/清空本地 notes 和 focus sessions。它们除 dprobe-coursed / dimport-coursed 的 yt-dlp 可见 best-effort outline 外，不执行平台专用远端课程提取、MTProto 同步、Bilibili 在线 API、媒体文件删除、下载内容删除或后台学习计时 runtime。

补充：第八批 CLI 本地入口覆盖 Library/Reader/Music 的本地状态面：Library 命令可删除/清空 catalog item、读取 bounded preview 数据、读写 reading progress、添加/删除 bookmark/highlight、清空 annotation、导出 reading state 和读写 reader settings；Music 命令可删除/清空 catalog track、读写本地 queue、读取 sidecar lyrics、读写 playlists、读写 sleep timer/equalizer/Discord Presence settings，并读取或清空 playback stats。它们不执行完整 PDF/EPUB/CBZ reader renderer、不播放媒体、不提供系统媒体键、不连接外部音乐服务、不执行 Discord IPC，也不替代最终 GUI/manual 验收。

补充：第十批 CLI 本地入口覆盖 Update/Auth/Extension/P2P/Library 的本地运维状态：dcheck-update-manifestd 只读取本地 release manifest，dupdate-settingsd / dsave-update-settingsd 只读写本地 update preferences，dauth-settingsd / dupdate-twitter-authd 只返回脱敏 auth 摘要或写入 Twitter/X fallback Cookie header，dupdate-extension-optionsd 只写入本地 bridge/options state，dp2p-offerd 只读取本地 short-code offer，dstart-p2p-sendd / dprobe-p2p-shared 只执行显式 LAN share serving/probe 并返回单文件 SHA-256 metadata，dcancel-p2p-offerd / dpause-p2p-offerd / dresume-p2p-offerd / ddelete-p2p-offerd / dclear-p2p-offersd 只修改本地 short-code offer store，dopen-library-externald / dreveal-library-itemd 只对已支持阅读格式做系统打开/定位，dupdate-reading-bookmarkd / dupdate-reading-highlightd 只更新本地 reading-state JSON。它们不执行真实 updater、签名校验、远端 manifest 获取、浏览器自动化、P2P NAT traversal/relay/multi-peer/cross-process resume、跨设备 hash 矩阵、下载内容删除或完整 reader renderer。

补充：第十一批 CLI 本地入口覆盖下载队列和本地诊断/日志清理操作：dpaused 将 active 任务标记 paused 并请求停止运行中的任务，dbulk-downloadsd 对传入 ids 执行 start/pause/resume/retry/cancel/archive/restore/delete 的本地批量状态变更，ddeleted 只删除本地任务记录且不删除输出文件，dreorder-downloadsd 更新本地队列 position，dopen-pathd 和 dreveal-filed 调用系统默认打开/定位，ddelete-local-filesd 仅按 d--diagnosticsd / d--logd 删除 scoped diagnostics/download-log 文件。它们不在 CLI 进程内启动下载调度，不删除下载输出文件，不替代真实 OS 手动打开/定位验收，也不声明完整 Rust build/test/clippy 已完成。

补充：第十二批 CLI 本地入口覆盖更多本地 command wrappers：dset-tool-pathd / dclear-tool-pathd 只写入或清除 dependency path override，dsettings-searchd 查询本地 settings catalog，dprobe-coursed / dimport-coursed 会尝试 yt-dlp 可见 course outline 并在失败时回退本地 metadata-pending candidate，同时在 dremote_extraction_noted 中返回脱敏 fallback 原因，dopen-course-lessond 只操作本地 lesson media path，dopen-telegram-mediad / dreveal-telegram-mediad 只打开/定位 imported manifest 的本地 media path，dupdate-plugin-settingsd 合并本地 plugin settings JSON，drun-plugin-commandd / demit-plugin-eventd 只记录 host stub log，drecord-music-playbackd 只根据本地 catalog track 写 playback event。它们不安装/更新依赖；除 dprobe-coursed / dimport-coursed 的 yt-dlp 可见 best-effort outline 外，不执行平台专用课程/Telegram 同步、不执行动态插件代码、不播放音频、不替代 GUI/manual 验收。

## Versioning

- dschema_version: 1d is mandatory on persisted and cross-boundary models.
- Breaking changes require a new version and migration adapter.
- Events may add optional fields without version bump.
- Required field removal or semantic changes require version bump.
- Plugin ABI version is independent from JSON schema version.

## Acceptance for API Contract

- Every command has typed request and response shape.
- Every event has a payload shape and lifecycle owner.
- Errors never return raw strings.
- Progress events support unknown totals without fake percentages.
- Sensitive values are represented by references unless user explicitly exports them.
- Browser extension has both bridge and deep link path.
- Plugin boundary includes compatibility failure behavior.


当前 Auth/Cookie 补充子集：dauth_get_settingsd 返回脱敏后的认证设置摘要，dauth_update_twitter_xd 保存 Twitter/X manual Cookie header 到 ddata/config/auth.jsond，响应只返回 dmanual_cookie_header_setd、预览 cookie name 列表和启用状态，不返回 Cookie 明文；dcookies_get_local_summaryd / dcookies_export_local_summaryd 和 CLI dcookies-summaryd / dexport-cookies-summaryd / dauth-summaryd 只汇总或导出本地 Cookie/Auth metadata、staged payload inventory、Twitter/X fallback public state 和 Bilibili Cookie bucket status，并显式声明不含 Cookie/Auth values；dsettings_reset_section(auth)d / dsettings_reset_section(twitter_x_auth)d 会恢复默认 Auth 设置并清空该 fallback header，不删除 Cookie buckets。dcookies_match_urld 和 CLI dmatch-cookiesd 会读取本地 Netscape cookie bucket 文件，按 domain/include-subdomains、path、secure flag 和 expires 判断 URL 是否有可用 cookie；未显式填写 platform 的 bucket 会按 domain hints 推断常见平台标签，并按 bucket platform metadata、path/domain 具体度和更新时间排序返回；Cookie bucket public metadata 会补充 dpath_hintsd、dsecure_onlyd 和 dexpires_summaryd，仍不包含 Cookie 名称或值。direct-file/context HTTP header 拼接也只使用未过期且 scope 适用的 cookie row；yt-dlp 任务仍优先通过 d--cookiesd 文件交给 yt-dlp。yt-dlp 任务在 dplatform == "twitter_x"d 且没有任务级 Cookie bucket 时才注入 manual d--add-header Cookie: ...d；任务级 Cookie bucket 仍优先使用 d--cookiesd 文件。下载日志会通过参数脱敏记录命令，不写入 Cookie 明文。真实 Twitter/X 登录有效性和站点样例仍需人工验收。

当前 Release/Privacy/Diagnostics 子集：dapp_export_diagnosticsd / CLI dexport-diagnostics [output.json] [--include-urls]d 会写入最小本地 JSON，可显式选择是否包含下载 URL 标志；桌面 Advanced 页可用可选 doutput_pathd / Save as dialog 指定 JSON 输出位置，未指定时仍写入 diagnostics 目录；dapp_export_diagnostics_bundled / CLI dexport-diagnostics-bundle [output.zip]d 会写入 ddiagnostics-bundle-*.zipd，包含 manifest、privacy status、release checklist、平台 route matrix、课程平台 matrix、课程平台 samples、音乐服务 matrix 和本地 inventory 摘要；桌面 Advanced 页可用可选 doutput_pathd / Save as dialog 指定 ZIP 输出位置，未指定时仍写入 diagnostics 目录；它不嵌入 Cookie 值、auth payload 值、下载内容或下载日志正文。dapp_get_privacy_statusd 是本地声明式状态命令，用于 UI 明确展示默认无遥测 uploader、诊断默认不含下载 URL、Cookie 值不进入诊断摘要，并返回 redaction matrix，列出 Download URLs、Cookie bucket values、auth payload values、download log bodies、downloaded content 与 local path inventory 的默认处理、导出处理和用户控制点；dapp_export_privacy_statusd / CLI dexport-privacy-status [output.json]d 会写出同一 metadata-only privacy JSON，可用可选输出路径或 Advanced Save as dialog 指定目标；它们不执行网络请求、不读取 Cookie/Auth 值、不导出 log bodies 或下载内容。dapp_get_release_checklistd 只读取本地 diagnostics/log inventory、update settings、plugin trust/readiness summary 和 browser extension package/pairing/options/payload metadata，并返回 Legal 页展示用的 release gate 状态：originality、third-party notices、privacy defaults、diagnostics inventory、capability honesty、plugin runtime/trust、browser extension package/pairing safety、updater/signing、packaging smoke、blocked integrations。Plugin runtime/trust gate 只汇总本地 manifest/preflight/marketplace counts，保持动态执行、签名、权限、panic isolation 和远程 marketplace policy pending；Browser extension release-safety gate 只汇总本地 extension package manifest、pairing/options、blocked-host 和 staged payload counts，保持浏览器安装 smoke、store signing/review、bridge pairing E2E 和 capture redaction review pending；dapp_export_release_checklistd / CLI dexport-release-checklist [output.json]d 会写出同一 release gate JSON，可用可选输出路径或 Legal Save as dialog 指定目标；这些 release checklist 命令不运行构建、不联网、不执行插件、不把 pending/blocked gate 标成完成。dapp_get_release_package_summaryd 只读取本地 dist、dist-portable、src-tauri/target/release/bundle、packaging 和 scripts 相关 metadata，返回区域状态、文件计数、大小、关键文件 SHA-256 和 review notes；Legal 页可刷新并复制 summary/JSON/paths/hashes/statuses/notes。dapp_get_release_document_summaryd 只读取 README/docs/scripts/packaging 文档 metadata、SHA-256 和 FUNCTION_PARITY/ACCEPTANCE 状态计数；Legal 页可刷新并复制 summary/JSON/paths/hashes/statuses/notes。它们不运行 npm/Tauri build、portable verification、签名、公证、安装器、浏览器扩展打包或商店提交，也不读取 Cookie/Auth/token、下载内容或日志正文。仓库级 `npm run verify:release-packaging` 会运行 `scripts/verify-release-packaging.ps1`，只做静态发布脚本/模板一致性检查：Windows portable package/verify 脚本所需 marker、manifest、checksum、byte-count 和 data dir 覆盖、Flatpak/macOS 模板 wiring、Build docs 和 npm scripts；它不调用 IPC，不创建包，不启动 Tauri build，不签名、不公证、不安装、不启动应用，也不替代最终 smoke。dapp_get_third_party_notice_summaryd 只读取本地 dpackage-lock.jsond、dsrc-tauri/Cargo.lockd 和 release-review artifact metadata，返回 npm/Rust counts、missing-license counts、npm license counts、bundled review file counts/sizes/kinds/SHA-256 和 review notes；Advanced/Legal 可刷新、复制 summary/JSON/counts/licenses/notes/bundle paths/bundle hashes/bundle kinds，并通过 `app_export_third_party_notice_summary` / CLI `export-notice-summary [output.json]` 写出同一 metadata-only summary JSON；release evidence snapshot 也嵌入该本地摘要。它不生成最终 notice 文件、不运行 cargo-about/cargo-deny、不审查第三方源码文本、installer/store notices，也不声称 final legal clearance。桌面 Advanced/Legal 当前还提供本地剪贴板 review helpers，可复制已加载的 local evidence module names/summaries/scopes、privacy notes/redaction matrix rows，以及 release gate evidence/next steps；这些 helper 不写文件、不读取秘密值、不改变 release gate 结果。dapp_export_release_evidence_snapshotd 会写出 drelease-evidence-snapshot-*.jsond，汇总 release checklist、release package summary、third-party notice summary、privacy status、关键源码/文档/脚本 footprint、FUNCTION_PARITY/ACCEPTANCE 状态计数、本地 feature evidence 摘要、plugin trust/readiness summary、extension release-safety summary、package scripts 和本地 diagnostics/log inventory；桌面 Legal 页可用可选 doutput_pathd / Save as dialog 指定 JSON 输出位置，CLI dexport-evidence [output.json]d 也可传同一目标，未指定时仍写入 diagnostics 目录。该文件是发布审查证据快照，不是 release-ready 声明，且不嵌入 Cookie 值、auth payload 值、下载内容或下载日志正文。dapp_export_third_party_notice_inventoryd 会把 dpackage-lock.jsond 中可见的 npm package name/version/license/dev/optional/resolved 和 dsrc-tauri/Cargo.lockd 中的 Rust crate name/version/source/checksum 导出到 JSON；桌面 Advanced/Legal 页可用可选 doutput_pathd / Save as dialog 指定目标，CLI dexport-notices [output.json]d 也可传同一目标，未指定时仍写入 diagnostics 目录下的 dthird-party-notice-inventory-*.jsond。dapp_export_third_party_notice_draftd / CLI dexport-notice-draft [output.md]d 用同一批本地 metadata 写出 Markdown review draft，Advanced/Legal 可 Save as/Open/Reveal。该 JSON inventory 和 Markdown draft 仅用于本地审查，Rust crate license 仍为 dnulld；third-party notice summary 现在会列出部分本地 bundled artifact/template/extension/package review metadata，但 bundled tools/icons/extension files/packaging templates/installer notices 仍需额外人工或专用工具复核，且都不是最终 legal notice。桌面 recovery manifest 和 local feature evidence snapshot 导出可用可选 doutput_pathd 指定 JSON 输出位置，CLI dexport-recovery [output.json]d 与 dexport-local-evidence [output.json]d 也可传同一目标，未指定时仍写入 diagnostics 目录。桌面 diagnostics/evidence/recovery/notice/bundle 导出和 diagnostics/log 删除清理会发出 ddiagnostics:files_changedd，仅广播本地文件 metadata。dapp_check_update_manifestd 只读取用户指定的本地或 dhttp://d / dhttps://d JSON release manifest（最小字段：dversiond，可选 drelease_notesd、ddownload_urld；远程读取限制 1 MB），与 dCARGO_PKG_VERSIONd 做语义版本近似比较并返回是否有更新；dapp_check_configured_update_manifestd 复用已保存 manifest path/URL 立即检查并回写 dlast_checked_atd / dlast_resultd；dapp_check_due_update_manifestd 在本地 update settings 已启用、已配置且超过 dcheck_interval_hoursd 时复用同一只读检查，未到期时返回 dnot_dued / dnext_check_atd，不下载或安装任何文件；桌面 runtime 会启动一个延迟、低频 due poller，复用同一函数并只在实际检查后发出 dsettings:changedd，在 manifest 报告新版本时发本地 dtoast:showd 信息；Advanced 可复制当前 manifest path、已检查的 download URL 和 release notes 便于本地审查；`update_get_local_summary` 返回本地 update summary（当前 app version、enabled/manifest/source kind、local manifest file metadata、configured manifest version flags、interval、last checked/result、next check、due_now、remote/local boundary、signed updater/download/install false flags 和 review notes），`update_export_local_summary` / CLI `export-update-summary [output.json]` 写出同一 metadata-only JSON；summary/export 不抓取远程 manifest URL、不下载或安装 update package、不做签名校验、不替换二进制；真实 Tauri updater、签名校验、OS 后台唤醒、下载/安装器替换仍未实现。

CLI 本地子集补充：`settings-summary`、`export-settings-summary`、`local-audit-summary`、`export-local-audit-summary`、`channels-summary`、`plugins-summary`、`export-plugins-summary`、`plugin-trust-summary`、`export-plugin-trust-summary`、`update-summary`、`export-update-summary`、`export-privacy-status`、`export-release-checklist` 和 `notice-summary`/`third-party-notice-summary` / `export-notice-summary` 已接入主 binary，并分别复用 `app_get_local_settings_summary`、`app_get_local_channels_summary`、`app_get_local_plugins_summary`、`app_get_local_plugin_trust_summary` / `app_export_local_plugin_trust_summary` 和 `app_get_third_party_notice_summary` 的本地只读构建路径；它们只汇总本地 settings/channel/plugin/dependency/update 元数据或 package-lock/Cargo.lock notice 元数据及本地 bundled release-review artifact metadata，不导出 Cookie/Auth/token/header 明文，不轮询频道，不执行动态插件，不执行下载调度，不抓取远程 update manifest URL，不下载或安装更新，也不证明远端平台、真实插件 runtime parity、真实 signed updater 或最终 license clearance。`release-package-summary` / `package-summary` / `release-packages` 也已接入主 binary，复用 `app_get_release_package_summary` 的本地只读构建路径，只输出发布相关本地 artifact/template/script metadata，不运行构建、签名、安装器、portable verification 或最终 smoke。`legal-readiness-summary` / `legal-readiness` / `release-readiness` 聚合本地 release gates、package statuses、release docs 和 notice counts，并把缺失的 `LICENSE`、`NOTICE.md`、`THIRD_PARTY_NOTICES.md` 暴露为 review 输入，但不创建法律文件或声明 clearance。`release-docs-summary` / `release-documents` / `docs-summary` 复用 `app_get_release_document_summary`，只输出 README/docs/scripts/packaging metadata 和状态计数，不证明最终文档审查完成。
