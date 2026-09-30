# Coding Handover

Current issue: #3 - T2 Ops Room + Conference Room
Status: implementation passes tests; live integration check in progress.

Known-good implementation: 6cfac24, after 79fcae1 / 6904c57 / afd66db.
Andy approved live connection checks and pushing on 30 September 2026.
All 4 integration tests passed again. Private runtime files are not tracked.
Existing unrelated Chippy/Gigi/OpenCode/local-AI changes remain untouched.

Room is RUNNING at http://127.0.0.1:8767.
Live discussion: 0aba8c50-c80c-4e1f-b9ba-d6d1e1c9d159.
Chippy check sent to Shared conversation (6abcc74e-ecc0-83ed-9d43-36a19260f426).
Chippy live read/post PASSED, verified event 99a38e7a-f73b-4b58-bf00-78388faebe0a.
Andy explicitly approved the bounded Claude document/discussion transfer.
Claude attempt failed: OAuth session expired and could not be refreshed.
A fresh claude auth login --claudeai flow has opened; Andy must complete sign-in.
Then retry the bounded live read/post test in discussion above.
Phone: Andy confirmed work Wi-Fi, different home Wi-Fi and Vodafone while out.
Work IPv4 is 192.168.1.63; BTB-37FGJF network profile is Public. NordLynx exists.
No Tailscale installation found. Cloudflare free secure access is being evaluated;
account availability and phone OS requested. No software installed or firewall,
network category, public tunnel or router settings changed.

Next: check shared discussion via node apps/ops-room/client.mjs read; finish
Claude check after renewed login, then phone access on an agreed secure route.
Keep Issue #3 open until live checks pass. Source push is authorised; verify
origin/main after pushing. Push of 646379a was verified against GitHub. Tests: node --test apps/ops-room/server.test.mjs.
Launch: Open Ops Room.cmd; stop: Stop Ops Room.cmd. API/recovery: app README.
Preserve safety/pre-reconcile-20260930 and pre-reconcile stash.
