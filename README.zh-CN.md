# FetchDock

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README.zh-CN.md">简体中文</a> |
  <a href="./README.ko.md">한국어</a> |
  <a href="./README.ja.md">日本語</a>
</p>

**一个本地优先的桌面下载器与学习工作区，面向视频、课程、音乐、书籍、浏览器捕获和插件工作流。**

FetchDock 面向那些学习素材和媒体文件分散在浏览器标签页、课程平台、聊天频道、下载目录和命令行工具里的用户。它把捕获、队列、元数据、本地资料库和审阅工具放进同一个桌面应用，并默认把用户数据留在本机。

> 状态：FetchDock 正在开发中。当前仓库已经包含可运行的本地桌面里程碑，但部分集成、打包 gate 和真实服务验证矩阵仍未完成。

## 为什么需要 FetchDock

下载很少只是“下载”。

- 链接、Cookie、文件名、字幕、元数据和输出目录经常分散在不同工具里。
- yt-dlp、FFmpeg、gallery-dl 很强，但参数、依赖和日志放在一个可见的本地工作区里才更容易管理。
- 课程、视频、PDF、音乐、笔记和浏览器捕获通常还需要下载后的整理。
- 私密媒体工作流不应该要求上传链接、文件路径、Cookie、诊断信息或学习记录到远端服务。

FetchDock 的目标是把这些分散步骤变成一个本地桌面控制中心。

## 亮点

- **统一捕获入口**：粘贴 URL、批量导入链接，或从浏览器扩展桥接接收页面和媒体候选项。
- **本地下载队列**：跟踪排队、活动、暂停、完成、失败、取消和归档任务，并提供日志、进度、重试元数据和输出动作。
- **媒体工具链**：检查元数据、缩略图、字幕、章节、评论、直播聊天 sidecar、FFmpeg 片段、波形峰值和字幕工作台数据。
- **依赖控制**：审阅工具状态、手动路径、受支持 Windows 工具的托管安装，以及明确的失败信息。
- **Cookie 工作区**：管理本地 Cookie bucket、导入、URL 匹配、健康检查和脱敏任务日志。
- **学习资料库**：把本地课程清单、阅读预览、音乐扫描、时间戳笔记、番茄钟、每日目标和图谱摘要放在一起。
- **浏览器交接**：使用 Chrome/Firefox 扩展脚手架、本地 loopback bridge 和 blocked-host 设置。
- **插件化应用壳**：安装和审阅本地插件 manifest、设置、数据目录、导航入口、预检和活动日志。

## 当前构建

当前仓库包含 Tauri 2 + Svelte 桌面应用、Rust 后端 commands、SQLite 本地状态、浏览器扩展脚手架、打包脚本和工程文档。

已工作的本地子集包括：

- Direct-file HTTP(S) 下载，包含 `.part` 恢复行为、限速、代理选项、重试元数据、日志和输出动作。
- yt-dlp 媒体任务执行，包含质量、音频提取、片段范围、字幕选项、SponsorBlock flags、元数据、Cookie bucket 和自定义参数规划。
- gallery-dl 图片/图库任务路由到任务专属输出目录。
- 针对常见视频、社交、图库、直链、播放列表、主页、直播、片段和网页意图的平台与路由分类元数据。
- 下载、网络、Cookie、浏览器扩展、频道、插件、依赖、外观、高级审阅工具和受限 AI/Whisper 配置设置页。
- 课程、Telegram、Bilibili、频道、torrent/magnet、P2P、阅读、音乐和学习数据的本地 store，以及 metadata-first 入队和审阅动作。
- 面向本地任务管理、设置导入/导出、诊断、平台矩阵、元数据工具、Cookie、频道、课程、资料库、音乐、插件和发布证据的 CLI commands。

仍未完成：

- 完整发布打包、签名、最终 license/notice 审查和打包后 smoke tests。
- 所有平台与账号状态的真实服务验证矩阵。
- 完整浏览器商店扩展验证。
- Telegram MTProto 登录、同步和媒体下载。
- 完整 torrent/magnet engine 和 seeding。
- 超出当前本地预览范围的完整阅读器/播放器体验。
- 动态插件 host、签名、隔离和远程 marketplace policy。
- 完整 test、build、clippy 和 release gate。

## 开发

要求：

- Node.js 24 或兼容的现代 Node.js。
- npm 11 或兼容 npm。
- Rust stable toolchain。
- 当前平台所需的 Tauri 2 前置依赖。
- Windows 上需要 Visual Studio Build Tools 提供 `cl.exe`/`link.exe`；本工作区也可使用 `docs/BUILD.md` 中说明的本地 Windows SDK 路径。

快速开发检查：

```powershell
npm run verify:fast
npm run typecheck
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
cargo fmt --manifest-path src-tauri/Cargo.toml
cargo check --manifest-path src-tauri/Cargo.toml
npm run verify:project-boundary
npm run verify:release-packaging
```

## 浏览器扩展

未打包扩展位于 `browser-extension/`。

```powershell
npm run verify:browser-extension
npm run package:browser-extension
fetchdock extension-package-summary --human
fetchdock extension-release-safety --human
fetchdock export-extension-release-safety ./extension-release-safety.json
```

- Chrome：打开 Extensions，启用 Developer mode，然后加载 `browser-extension/`。
- Firefox：从 `about:debugging` 临时加载同一目录。
- 扩展会优先尝试 `POST http://127.0.0.1:17654/v1/extension/download` 进行页面、链接和媒体交接。
- 如果 bridge 不可用且 fallback 已启用，会打开 `fetchdock://capture?url=...&kind=...`。

配对自动化、端到端浏览器验证、授权存储加固、HLS 分组矩阵、商店签名和发布提交仍未完成。

## 文档

- [能力地图](docs/CAPABILITY_MAP.md)
- [架构](docs/ARCHITECTURE.md)
- [API contracts](docs/API_CONTRACTS.md)
- [验收清单](docs/ACCEPTANCE.md)
- [源码构建](docs/BUILD.md)
- [Changelog](docs/CHANGELOG.md)
