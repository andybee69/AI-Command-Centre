# GIGI Office — read-only integration audit (9 Oct 2026)

Source: existing Ops Room source, README and HANDOVER.md; no runtime connectivity claimed.

## What already exists
- `apps/ops-room/server.mjs`: local Node 24, dependency-free Ops Room, authenticated state and append-only event API, launcher on 127.0.0.1:8767.
- `apps/ops-room/client.mjs`: read/post/stop and task-post/task-list command handlers on the development branches described in HANDOVER.md.
- `apps/ops-room/agent-task.mjs`: marker `[gigi-agent-task:v1]`, taskId, issueUrl, status, summary, needsApproval; validates author and body. Statuses: queued, working, blocked, review, done. Latest event per task wins.
- `apps/ops-room/public/app.js`: existing read-only Agent Activity tab, computes latest updates from state.events.
- Sources of truth: GitHub Issues for actionable work; Ops Room for discussion/coordination evidence. No independently authenticated agent identity, heartbeat, automatic agent execution or authoritative assignment/acceptance protocol.
- HANDOVER.md: #5, #7, #9 are stacked draft feature branches; ten tests on work PC reported passing on Oct 8, but browser manual acceptance and merged state not confirmed. Phone access #3 remains separate.

## Adapter plan
1. First review stacked draft PRs #6 and successors and their base branches; do not merge or overwrite work.
2. Reuse the existing `/api/state` JSON fetch + authenticated browser session and `activityUpdates(state.events)` shape. Do not add another storage engine.
3. Render a 2D Office tab in the existing Ops Room; derive displayed task cards from validated latest agent updates, grouped by `author` (not fictional job titles). Map roles to named workstations via a separate presentational mapping; unmatched authors go to Unassigned.
4. Show a prominent disclaimer: `Last reported by [author]`, rather than `connected/running`. The reported author is user-selected, not cryptographically authenticated. Time age = event timestamp; if stale, say `not recently updated`; never infer live activity from a stale report.
5. Clicking a desk opens a view of original taskId, issue link, status, summary, approval flag, reporting author and timestamp. Fields not in schema (receiver acknowledgments, blocker details, output links) must display `not recorded` rather than be invented.
6. For actual handoff state, create a separate, backward-compatible validated event schema only after the existing agent protocol is merged and reviewed; specify sender, recipient, requested/accepted/completed/failed status, related issue, output ref, actor and timestamps. Do not interpret a single task status as receipt.
7. Offline/auth-failed state: reveal that connectivity is lost and flag on-screen task cards as historical, never display the office as live. No new default keys.
8. Demo data kept in tests / explicit demo route only, visually labeled.

## First safe implementation slice
- No new packages. Add read-only Office tab, desk layout and clickable task panel to existing `apps/ops-room/public`.
- Preserve Ops Room, Conference Room and Agent Activity functions.
- Desktop and 390px checks, keyboard and accessible focus, disconnected state.
- Test with isolated fixtures; live AGON_ONE checks only in a separate approved session.
- Maintain `HANDOVER.md` after implementation, not before.

## Acceptance gates
1. A real task-post from a test agent is shown under its actual declared author with matching issue link and timestamp.
2. A stale event does not masquerade as an active AI session.
3. Missing data and disconnected state are explicit.
4. Existing test suite passes, plus Office view tests, no change to authentication.
5. No external customer contact, invoice/quote dispatch or installations.

## Design constraint
Function before decoration. Coffee and bourbons welcome as static Easter egg; 3D deferred.
