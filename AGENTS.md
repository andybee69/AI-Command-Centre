# AGON AI Command Centre - Operating Rules

You are working inside the AGON AI Command Centre. These rules apply to every AI that works in this repo.

## Who does what

| Role | Job |
|---|---|
| Chippy (ChatGPT) | Coordinator. Writes business requirements and acceptance tests, reviews results and dispatches work. |
| Codex | Bounded coding tickets. |
| Claude (Claude Code / desktop) | Architecture review, plan refinement, and bounded coding tickets when needed. |
| OpenCode / Ollama | Cheap local edits, inspection, classification and simple tests where suitable. |

Any coder can pick up any open ticket. When one AI stops, another carries on from GitHub + HANDOVER.md.

## Start of every session

1. Read `HANDOVER.md`.
2. Read the active GitHub Issue named there.
3. Run `git status` and `git log --oneline -5`.
4. Inspect the latest relevant commit/diff.
5. If HANDOVER.md and git disagree, trust git and record the mismatch.

## Source of truth

- GitHub Issues, commits and repo files = technical delivery truth.
- HANDOVER.md = current technical baton.
- AGON_BRAIN = business/project knowledge, customers, products, research and commercial decisions.
- OneDrive - Agon remains the authoritative business file store.
- Mintsoft remains authoritative for UK stock.
- docs/ARCHITECTURE_DECISIONS.md = settled architecture decisions.
- Important decisions must not live only in chat.

## How to work

1. One ticket at a time. No issue, no coding work.
2. Stay inside the ticket. Park unrelated ideas rather than building them.
3. Thin slices. Deliver the smallest working version first.
4. Commit after each working step with a clear message.
5. Never commit passwords, API keys, tokens, logs, caches or machine-local runtime data.
6. Before stopping, update HANDOVER.md with the exact baton-pass state.
7. Prefer existing/free/local tools where suitable; paid services only when they add clear value.
8. Avoid architecture rewrites unless a documented problem requires one.

## Ticket contract

Each ticket should state:
- Goal
- Files / areas allowed to change
- Acceptance test
- Dependencies
- Stop condition

## Tool use

- Prefer local/open-source tools first.
- Prefer already-installed or already-paid tools before recommending paid services.
- Use the smallest tool or action necessary.
- For environment checks, report only what tools actually return.
- Ollama/OpenCode are optional helpers, not critical-path dependencies.

## Saving tokens and time

- Read only the files the ticket needs.
- Avoid broad repo scans unless explicitly required.
- Do not paste whole files into chat unless necessary.
- Stop at a clean working point, commit, and update HANDOVER.md before a session runs dry.

## Safety

- Outside the current ticket, be read-only.
- Inside the ticket, create/edit repo files and commit as required.
- Ask Andy before destructive actions, software installs, external sends, pushes, or system-setting changes unless the active ticket explicitly authorises them.
- Never move, rename, overwrite or alter original customer, technical, literature or certification files in Agon_Master.
- Do not claim a ticket is complete until its acceptance test passes.

## Accuracy

- Never invent files, folders, models, dependencies, settings or installed software.
- Clearly distinguish verified facts from assumptions.
- If a command or tool does not return evidence, say so.
- If uncertain, stop and record the uncertainty rather than guessing.

## End of every session

1. Commit working changes.
2. Update HANDOVER.md with current ticket, completed work, in-progress work, blockers, exact next action, and last known-good commit.
3. Add a concise issue comment with result, test status, blocker/next step.
4. Tell Andy concisely what changed and what remains.

If the current task conflicts with these rules, stop and record the conflict in the issue rather than improvising a new architecture.
