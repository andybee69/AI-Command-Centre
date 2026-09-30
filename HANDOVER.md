# Coding Handover

Current issue: #3 - T2 Ops Room + Conference Room
Status: implemented locally; automated/browser checks pass; final live-access acceptance pending.

Known-good implementation: afd66db (slice 3), preceded by 6904c57 (UI) and
79fcae1 (persistence/API). This checkpoint adds quiet launcher verification and
thread creator/time display. Use HEAD for the complete checkpoint; nothing pushed.

Verified: 4 integration tests; concurrent agent-client posts; exact restart
recovery; actual launcher start/read/stop twice; browser Ops/Conference posting,
issue links, direct promotion to a TEST architecture file, resolved state and
390px phone-width layout without overflow. Test data is separate from real data.
Issue #3 milestone comments posted. All runtime and access-key files ignored.

Resume exactly:
1. Open Ops Room.cmd (repo root). Key shown locally; app http://127.0.0.1:8767.
2. In actual Chippy and Claude local-tool sessions on AGON_ONE, each run
   node apps/ops-room/client.mjs read; post in one shared thread using the JSON
   examples in apps/ops-room/README.md. Do not claim test identities are live AIs.
3. Agree a private-network route and verify a physical phone. LAN opt-in commands
   are in README. No firewall, tunnel or system settings have been changed.
4. Re-run node --test apps/ops-room/server.test.mjs; record live results on #3.
   Keep #3 open until acceptance passes. Push requires Andy's approval per AGENTS.

Existing Chippy/Gigi/OpenCode/local-AI changes are untouched and uncommitted.
Preserve safety/pre-reconcile-20260930 and the pre-reconcile stash.
Room service is stopped cleanly after verification; no auto-start service installed.
