# Command Centre Recovery

## Normal start

From the repository root, double-click:

`START COMMAND CENTRE.cmd`

This starts Ops Room first, then Chippy. Chippy opens in the browser at
http://127.0.0.1:8766. Ops Room remains available at http://127.0.0.1:8767.

## Five-minute recovery

1. Confirm Desktop Commander can see AGON_ONE.
2. Open the repo at `C:\Users\andyb\Documents\AI-Command-Centre`.
3. Run `START COMMAND CENTRE.cmd`.
4. In Chippy, open **System**. Chippy, AGON_BRAIN, GIGI and Ops Room should be green.
5. If Ops Room reports a stale writer lock, first confirm no live
   `apps\ops-room\server.mjs` process and no listener on port 8767. Then rename
   `data\ops-room-local\writer.lock` to a dated recovered name and restart.
6. If Chippy fails, inspect `data\chippy-local\server-error.log`.
7. If GIGI is red, verify the maintained inbox path in
   `apps\gigi-inbox\config.json`.
8. Local Ollama may be red when it is intentionally not running.

## Sources of truth

- Code/version history: GitHub repository.
- Business/project knowledge: AGON_BRAIN in the synced OneDrive - Agon folder.
- GIGI learning records: AGON_BRAIN\05_GIGI_HUB\Learning Inbox.
- Build coordination: GitHub issues and Ops Room.
- Do not copy business data into Git just to make the dashboard work.

## Backups from recovery build

- T2: `C:\Users\andyb\Documents\AI-Command-Centre-T2-backup-20261001`
- T3: `C:\Users\andyb\Documents\AI-Command-Centre-T3-backup-20261001`
- T4: `C:\Users\andyb\Documents\AI-Command-Centre-T4-backup-20261001`
- T5: `C:\Users\andyb\Documents\AI-Command-Centre-T5-backup-20261001`
