# Gigi inbox status

Double-click Gigi-Inbox.cmd to see the total, status counts and oldest waiting
item. This reads the existing Learning Inbox; it creates no second list and does
not assess, open or modify source links. No packages or background services.

The source path is configured in config.json, not embedded in the script.
If the inbox moves, update inbox_path to the maintained CSV. Do not copy the CSV
here. A different source can also be supplied with Show-Inbox.ps1 -InboxPath.
Waiting items are ordered by AddedAt then ID (the current inbox uses sortable
YYYY-MM-DD timestamps). The command works from any working directory.
The launcher uses a process-only PowerShell policy override.

Verified: live status and oldest waiting item; input file hash unchanged;
empty inbox; no waiting items; missing file; missing required column.

Next small step: review the displayed waiting item using the existing Gigi
review workflow. A cross-device Gigi Hub remains a separate, larger project.
