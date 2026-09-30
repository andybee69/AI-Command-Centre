# AI Command Centre — Agent Rules

## Purpose
This repository is the technical source of truth for the AI Command Centre.

## Operating rules
1. Work from one GitHub Issue at a time.
2. Read the issue, the latest relevant commit, and HANDOVER.md before changing code.
3. Deliver the smallest working slice that satisfies the current acceptance test.
4. Do not start unrelated work inside the same ticket.
5. Commit after each working slice with a clear message.
6. Before stopping, update HANDOVER.md with the exact baton-pass state.
7. Never leave essential implementation knowledge only in chat.
8. GitHub owns code status. AGON_BRAIN owns business/project knowledge and commercial decisions.
9. Prefer existing/free/local tools when suitable; add paid dependencies only for clear value.
10. Avoid architecture rewrites unless a documented problem requires one.

## Ticket contract
Each ticket should state:
- Goal
- Files/areas allowed to change
- Acceptance test
- Dependencies
- Stop condition

## Handover contract
A coding session must leave:
- current issue number
- completed work
- work in progress
- blockers
- exact next action
- last known-good commit

If the current task conflicts with these rules, stop and record the conflict in the issue rather than improvising a new architecture.
