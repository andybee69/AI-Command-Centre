# Chippy Command Centre

Double-click **Open Chippy.cmd** in the repository root. It starts a hidden local Node process and opens http://127.0.0.1:8766. Double-click **Stop Chippy.cmd** to stop that launcher-managed process. Nothing starts at Windows login. No packages, build step or internet connection are required for the dashboard. The ChatGPT handoff and inbox source links need internet access.

## Views

- **Home:** nine seeded projects, status, stage and next action; lifecycle counts filter Projects.
- **Projects:** search/filter; click a name to edit its status, stage, next action and notes. Confirm provisional entries once checked.
- **To-Do:** the same next actions from Projects, excluding Complete and Shelf. There is no duplicate task list.
- **Chippy Chat:** prepare and copy a context message, then open the existing Project Board Design conversation. This is a manual handoff, not an AI/chat integration or conversation sync.
- **Gigi / Inbox:** reads the existing maintained CSV using apps/gigi-inbox/config.json. Displays counts and waiting items; source links open only when clicked. Does not edit or duplicate the inbox.

Lifecycle: Idea → Research → Planned → Building → Waiting → Active → Complete → Shelf.

## Data and sources

The initial private snapshot is apps/chippy/seed.json. After the first save, all dashboard project state lives in data/chippy-local/projects.json. The app persists saves with a temporary file and atomic rename. Invalid existing JSON fails startup rather than silently replacing saved work. Export board downloads a snapshot; there is no import UI in this version.

Initial context was checked on 28 September 2026 against AGON_BRAIN/00_MASTER_INDEX/master-work-register.md and the AEGIS HMPE handover (both dated 25 September). The source's Started maps to Active; British Steel is Waiting because the register names a draft-review blocker. These lifecycle mappings are dashboard interpretations, not edits to the source register. GIGI Hub remains Planned. LinkedIn Campaign, Solar/EV, £50 XPS 710 and Call Centre AI are provisional conversation-based entries. AI Command Centre reflects the current build request.

AGON_BRAIN and the inbox CSV stay read-only. Changes here do not sync back to OneDrive or ChatGPT. Source attribution remains visible in project details after local edits. Private seed and local state/log files are Git-ignored; do not force-add business data when publishing code. A fresh code-only clone needs its own seed.json with schemaVersion: 1 and a projects array.

## Run and verify

Requires the already-installed Node.js 24 and Windows PowerShell for the inbox reader and launchers. From the repository root:

```
node apps/chippy/server.mjs
node --test apps/chippy/server.test.mjs
```

The tests use a temporary data directory and alternate port; they do not edit real project data. CHIPPY_PORT chooses an alternate port; CHIPPY_DATA_DIR overrides the state directory for tests. Use the exact 127.0.0.1 address (not localhost) because the server checks its Host and Origin headers. It listens only on loopback, serves an explicit public file list, rejects cross-origin writes, and does not expose repository files or run commands from submitted text.

If the inbox cannot be read, check the existing inbox config and CSV availability. If the dashboard cannot start, inspect data/chippy-local/server-error.log. If another application owns the port, choose a different CHIPPY_PORT. Multiple browser tabs share saved state, but refresh a stale tab before editing the same project in another tab; real-time collaboration is not included.
