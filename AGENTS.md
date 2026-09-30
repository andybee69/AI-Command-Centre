# AGON AI Command Centre - Operating Rules

You are working inside the AGON AI Command Centre. These rules apply to every AI that works in this repo.

## Who does what

| Role | Job |
|---|---|
| Chippy (ChatGPT) | Coordinator. Writes business requirements and acceptance tests for tickets. |
| Codex | Bounded coding tickets. |
| Claude (Claude Code / desktop) | Architecture review, plan refinement, and bounded coding tickets when Codex is unavailable. |
| OpenCode / Ollama | Cheap local edits, inspection, simple tests. |

Any coder can pick up any open ticket. That is the point: when one AI runs out of tokens, another carries on from the files.

## Start of every session

1. Read `HANDOVER.md`.
2. Read the open GitHub issue named in HANDOVER.md.
3. Run `git status` and `git log --oneline -5` to see where the code actually is.
4. If HANDOVER.md and git disagree, trust git and tell Andy.

## Scope

- Focus on AGON Lifting UK work unless explicitly told otherwise.
- Work only inside this repo folder and AGON_BRAIN.
- Do not scan unrelated folders, drives, or services.
- Do not infer file contents or system state. Verify first.

## Source of truth

- OneDrive - Agon is the authoritative business file store.
- GitHub is for code only.
- Mintsoft is authoritative for UK stock.
- Use actual files, exports, APIs, or commands rather than assumptions.

## How to work

1. **One ticket at a time.** Every piece of work is a GitHub issue using the Coding ticket template. No issue, no work.
2. **Stay inside the ticket.** If you spot something else worth doing, add it to the Parked list in HANDOVER.md. Do not build it.
3. **Thin slices.** Get the smallest version working first, then extend.
4. **Commit after each working step**, with a message like `T2: add launcher menu`. Never commit passwords, API keys or tokens.
5. **Follow the build path.** T1 Reality Check, T2 Launcher + Shell, T3 Persistent Tasks, T4 GIGI Vertical Slice, T5 Recovery & Docs. Evaluation Lane tools (Paperclip, OpenAI Dots, 0x Alpha / GLM, VoiceStudio) are not touched until the core slice works, and only through a ticket.

## Tool use

- Prefer local/open-source tools first.
- Prefer already-installed or already-paid tools before recommending paid services.
- Use the smallest tool or action necessary.
- For environment checks, report only what tools actually return.

## Saving tokens

- Read only the files the ticket needs. Search, or read line ranges, rather than opening whole files.
- Avoid broad repo scans unless explicitly requested.
- Do not paste whole files back into the chat. Show only what changed.
- When the session is getting long, stop at the next working point, commit, and update HANDOVER.md before you run out. A clean stop beats a lost session.

## Safety

- Outside the current ticket, you are read-only.
- Inside the current ticket, you may create and edit files in this repo and commit them.
- Ask Andy before: deleting, moving, renaming or overwriting existing files; installing software; pushing to GitHub; sending anything or making any external change; changing system settings.
- If a requested action would modify something outside the ticket, explain the intended change first.
- Never move, rename, overwrite or alter original customer, technical, literature or certification files in Agon_Master.
- Do not claim a ticket is done until the acceptance test passes and the saved result has been checked.

## Accuracy

- Never invent files, folders, models, dependencies, settings, or installed software.
- Clearly distinguish verified facts from assumptions.
- If a command or tool does not return evidence, say so.
- If uncertain, stop and ask rather than guessing.

## End of every session

1. Commit working code.
2. Update `HANDOVER.md` (current ticket, done, half-done, next step, blockers).
3. Tell Andy, concisely and practically: what changed, the exact file paths, and what is left. Use three headings: what you verified, what is working, what is missing or broken.
