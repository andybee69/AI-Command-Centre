# Coding Stable - first small component

Built 25 September 2026 in the existing Work PC AI Command Centre.

## Resume
Double-click Resume.cmd in this folder. It displays the active task, checkpoint,
next action, tests, commit reference and notes. It does not execute the task.
From PowerShell, run:

    & .\coding-stable\Resume.ps1

The command finds tasks.json relative to itself, so it works from any directory.
Resume.cmd uses a process-only execution-policy override; no machine setting changes.

## One durable queue
Edit tasks.json in a text editor. Keep exactly one task active while working.
Statuses: queued, active, blocked, done. Task IDs must be unique.
Every task has task_id, title, status, last_checkpoint, tests, next_action,
last_commit and notes. Record actual test outcomes in tests and an explicit next
step before stopping. Keep secrets and customer data out of this code repository.

For each later checkpoint: update the queue, stage only the intended files, and
commit. last_commit records the latest known checkpoint hash or Git tag; it can
refer to the previous checkpoint when saving the next one. The initial value is
the tag coding-stable-checkpoint-001, attached to the initial component commit
(avoids embedding a commit's own hash inside itself).

## What was done
Added a JSON queue, read-only PowerShell resume script and double-click launcher.
No packages, services, background jobs, Builder/Tester agents or full stable.
Existing repository files and unrelated changes are outside this checkpoint.

Validation: active-task output, no-active queue, duplicate-active rejection and
invalid-JSON rejection were checked with temporary fixtures outside this folder.

## Checkpoint Charlie
Double-click Checkpoint.cmd. Enter progress made, the next action and test results.
Blank test results keep the existing tests. Progress and next action are required.
Only the active task is updated; task status, notes and commit reference stay as-is.
The previous queue is kept in tasks.json.bak (ignored by Git). Each successful save
replaces that backup with the immediately preceding queue. Invalid input leaves
the queue untouched. Close the window before completing prompts to cancel.

For scripted use, from the repository folder:

    & .\coding-stable\Save-Checkpoint.ps1 -Checkpoint "Work completed" -NextAction "Next small step" -Tests "Checks passed"

Optional -Notes and -LastCommit update those fields. -QueuePath supports a separate
queue for checks. This saves progress only; Git commits remain a separate step.
Checkpoint.cmd uses the same process-only policy override as Resume.cmd.

Added 25 September 2026. Verified saves, repeated saves, backup contents,
untouched other tasks, retained tests, and rejection without writes for blank
progress, no active task, multiple active tasks and invalid JSON.

## Next small step
Use Checkpoint.cmd after the next small work session, then Resume.cmd to pick up
again. Choose the next coding job before adding further features.
