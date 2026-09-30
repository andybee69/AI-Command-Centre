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
Await actual posted event; do not treat a dispatched prompt as a passing test.
Claude Code is installed and signed in; execution was blocked by automatic
approval review requiring explicit consent to send the named repo documents
and test discussion to Claude. Question is pending with Andy; do not bypass.
Phone network question is pending. Wi-Fi BTB-37FGJF is currently Public;
NordLynx is Private. No firewall, network category or tunnel settings changed.

Next: check shared discussion via node apps/ops-room/client.mjs read; finish
Claude check after explicit approval, then phone access on an agreed route.
Keep Issue #3 open until live checks pass. Source push is authorised; verify
origin/main after pushing. Tests: node --test apps/ops-room/server.test.mjs.
Launch: Open Ops Room.cmd; stop: Stop Ops Room.cmd. API/recovery: app README.
Preserve safety/pre-reconcile-20260930 and pre-reconcile stash.
