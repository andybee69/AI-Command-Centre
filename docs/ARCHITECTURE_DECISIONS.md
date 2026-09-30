# Architecture Decisions

## AD-001 — GitHub owns technical delivery state
**Decision:** GitHub Issues, commits, repository files and HANDOVER.md are the source of truth for coding work.

**Reason:** Coding must survive chat/session/token limits and be resumable by another coding agent.

## AD-002 — AGON_BRAIN owns business knowledge
**Decision:** Business/project context, customers, products, commercial research and decisions stay in AGON_BRAIN.

**Reason:** Duplicating project status between GitHub and AGON_BRAIN will drift.

## AD-003 — One ticket at a time
**Decision:** Coding agents work one bounded GitHub Issue at a time using thin working slices and frequent commits.

**Reason:** Small resumable units reduce stop-start failures.

## AD-004 — Coding horses are interchangeable
**Decision:** Codex and Claude Code can pick up the same ticket using the Issue + commit history + HANDOVER.md. OpenCode/Ollama may handle suitable lightweight work.

**Reason:** No single model/session should be a delivery bottleneck.

## AD-005 — One scouting lane
**Decision:** Tool/model discovery feeds one Evaluation Lane rather than separate overlapping scouts.

**Reason:** Avoid duplicate research and hype-driven rebuilds.

## AD-006 - T2 local shared event service
**Decision:** T2 uses an isolated Node-core HTTP service with one append-only
file per event, serialized writes and an exclusive writer lock. Private room
history stays in ignored local data, not git. All local agents use the same API.
**Reason:** Avoid dependencies, paid infrastructure, a new database and concurrent
Markdown-log edits. GitHub-backed conversation persistence was deferred because
it requires a trusted credential bridge; none is installed by this slice.
**Boundary:** Existing Chippy/Gigi work is untouched. This is a shared message
service, not a model runner. Remote agents/phones require an approved connection
route. Technical delivery truth remains GitHub and repo documents; direct
promotion appends a source-linked conclusion to the existing authoritative file.
