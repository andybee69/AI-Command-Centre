# Local AI install status — 23 September 2026

Runtime location: `.runtime/` (Git ignored). Existing global OpenCode and Claude settings are unchanged.

## Ready
- Official Ollama v0.34.3 standalone archive verified against GitHub release SHA-256, extracted locally.
- Server uses 127.0.0.1:11434, OLLAMA_NO_CLOUD=1, project model storage, 4096 context and one parallel request.
- CPU mode clears a startup stall seen during integrated-GPU discovery.
- `scripts/Start-Local-Ollama.cmd` starts the server in a terminal. Close it to stop. No startup task or Windows service installed.
- `scripts/Local-OpenCode.cmd` uses separate project-local configuration/data/cache directories and disables external plugins.
- Effective OpenCode configuration validated: only local Ollama provider; all tools denied; no MCP entries; plugins empty; automatic updates and sharing disabled.
- `scripts/Test-Local-Qwen.cmd` runs the four-row synthetic classification acceptance test after the model is downloaded. Result saved under `.runtime/`.

## Pending
- Official qwen3.5:4b download and measured benchmark. The configured model is provisional, not a final strongest-model selection.
- OpenCode end-to-end classification test. Do not claim routine delegated edits work until separately tested with narrowly scoped permissions.
- Consider 9B only after the CPU baseline. RAM reported available at server startup was 14.8 GiB despite 39.9 GiB total.

## BASE blocker
Official BASE v0.15.2 archive hash verified. Installer partially populated `.runtime/base-home` with binary, config and AST scripts; Python dependencies installed into the earlier task's isolated virtual environment. `update.auto=false` is preserved. No hooks activated.
The bundled isolation guard rejects any graph write beneath the real Windows user profile (except system temporary storage), including this deliberately isolated BASE_HOME under Documents. It panics during system-rule seeding. This version therefore cannot complete the proposed in-project isolated installation as-is.
Do not invoke BASE from the global PATH, unset BASE_HOME, or activate hooks to bypass this. Resolve with an upstream-supported fix or approve a different isolated location. No global Claude integration has been installed.

## Boundaries
No system PATH changes, service, scheduled task or firewall rule. No live customer inputs, OneDrive indexing, CUA or JARVIS. Launchers do not alter persistent environment variables.

## Resume efficiently
Read this file and runtime test result first; do not rescan the repository. Backups and original release files are in the earlier install task under Documents/Codex/2026-09-23/referenced-chatgpt-conversation-this-is-an/work.
