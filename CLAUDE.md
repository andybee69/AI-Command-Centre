# Claude Code Instructions

Read and follow AGENTS.md first.

@AGENTS.md

## Role
Claude Code is a coding horse and architecture reviewer for the AI Command Centre. It must be able to take over a bounded GitHub Issue from Codex/OpenCode and leave it in a state another agent can resume.

## Start of session
1. Read AGENTS.md.
2. Read HANDOVER.md.
3. Read the active GitHub Issue.
4. Run git status and inspect the latest relevant commit/diff.
5. Continue the existing ticket unless explicitly told to change tickets.

## During work
- Keep changes inside the ticket scope.
- Prefer thin, testable slices.
- Run the acceptance test before declaring a slice complete.
- Do not duplicate business notes into the repository; reference AGON_BRAIN where needed.
- Do not push, install software, or make destructive changes unless the ticket/user explicitly authorises it.

## End of session
- Commit working changes.
- Update HANDOVER.md.
- Add a concise issue comment with result, test status, blocker/next step.
- If unfinished, leave a precise next action rather than a broad summary.
