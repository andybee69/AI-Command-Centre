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
