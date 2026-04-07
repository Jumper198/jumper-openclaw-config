## LEARNINGS.md

## 2026-03-30
### 1. 小红书图文海报的最佳实践（弃用 Pillow）
- **问题**: 之前用 Python Pillow 徒手画文字长图，不仅版式僵硬，还被小红书 CDN 报错（图挂了）。
- **正确做法**: 全面弃用本地代码排版，**唯一指定使用 Nano Banana Pro (Gemini 3 Pro Image)** 生成所有含复杂中文排版的极简高级海报（Typography Poster）。
- **工具调用细节**: OpenClaw 内置 `image_generate` 有 30 秒硬超时限制，而 Pro 模型生图经常需要 40-50 秒。必须使用后台挂起的 Python 脚本 (`urllib.request` 设置 `timeout=120`) 配合代理 (`http://192.168.64.1:7897`) 直接调用 Google API，从而完美绕过 Timeout 限制。

### 2. xiaohongshu-mcp 在 macOS 的启动修复
- **问题**: `xiaohongshu` skill (基于 xiaohongshu-mcp) 的 `start-mcp.sh` 在 macOS 上运行会报错 `未检测到桌面环境，且未安装 Xvfb`。
- **根本原因**: macOS 没有自带 X11 的 `xdpyinfo`，脚本误判为无头服务器。
- **正确做法**: 已将 `start-mcp.sh` 脚本强制移除了对虚拟桌面的依赖检测（去掉了 `ensure_display` 调用），现在它可以直接调用 macOS 原生图形环境稳定运行。以后发帖直接调用 `mcp-call.sh publish_content` 即可。

### 3. OpenCLI (opencli-rs) 的隔离红线
- **确认**: 牢记 2026-03-26 的纪律，`opencli-rs` 权限过高，仅能在沙盒内用作“数据矿机”。主账号的小号发帖操作，**一律使用安全的 `xiaohongshu-mcp` 技能**。
