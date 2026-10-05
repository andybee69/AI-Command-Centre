# Coding Handover

## Command Centre foundation — COMPLETE (T1-T5, 1 Oct 2026)

Normal start: double-click `START COMMAND CENTRE.cmd` in the repo root.
Chippy: http://127.0.0.1:8766. Ops Room: http://127.0.0.1:8767.
Chippy now includes project views, GIGI capture/review, and System health status.
Recovery instructions: `docs/recovery.md`.
Do not rebuild this foundation or introduce a new framework without a proven blocker.
GitHub `main` is the code source of truth; AGON_BRAIN remains the business source.

## Separate open item — phone access

Current issue: #3 - Ops Room + Conference Room phone access
Status: implementation and BOTH live agent checks pass; phone access pending.

Chippy read/post verified: 99a38e7a-f73b-4b58-bf00-78388faebe0a.
Claude renewed login and real read/post verified: 9051e991-9762-4357-ad9f-67d98926f9ef.
Claude read Chippy's message before posting. Neither response was simulated.
Shared thread: 0aba8c50-c80c-4e1f-b9ba-d6d1e1c9d159.
Room is running on http://127.0.0.1:8767. Runtime/key files remain ignored.
Four integration tests and desktop/390px browser checks passed previously.

Phone: Samsung S25 Ultra (Android), work/home Wi-Fi and Vodafone.
Cloudflare Zero Trust Free activation verified. Team name: white-mode-31c0.
Existing tunnel agon-one-ops-room (51750ef0-19d4-4c5d-814b-7c12e7c34cae)
is HEALTHY in dashboard; local metrics showed 4 active connections and 4
successful registrations. User installed cloudflared 2026.9.3 as an automatic
Windows service. Never copy tunnel tokens into notes or GitHub.
No route or phone access has been configured yet.
Prepared UNSAVED device enrolment policy: Andy - Ops Room phone; Allow;
Include Emails = andybee46@gmail.com. Needs action-time confirmation before
saving/attaching. User asked to install Cloudflare One Agent on S25 Ultra.
Cloudflare device page currently warns of One Client service degradation.
Next: save restricted enrolment after confirmation; prepare private Ops Room
route and minimal device traffic profile; verify phone on Wi-Fi and Vodafone.
App still loopback-only. Keep Issue #3 open until physical phone test passes.

Code and handover pushed through 6511e64; this checkpoint records Claude success.
Push remains authorised. Tests: node --test apps/ops-room/server.test.mjs.
Launch/stop: Open Ops Room.cmd / Stop Ops Room.cmd. Details: app README.
Unrelated Chippy/Gigi/OpenCode/local-AI work stays untouched and uncommitted.
Preserve safety/pre-reconcile-20260930 and pre-reconcile stash.


## UX harvest checkpoint — 5 Oct 2026

Andy approved the "steal and harvest" rule for useful app/reel ideas: harvest strong UX/workflow patterns into the existing Command Centre rather than adding another platform by default.

Bordy-inspired home-screen upgrade implemented in Chippy:
- Today / priority hero.
- Command pulse.
- Needs Attention cards.
- Cleaner management-first hierarchy above the full project board.
- Responsive mobile treatment.
- Design/guardrail recorded in docs/ux-harvest.md.

No AGON business source was migrated or replaced. AGON_BRAIN remains authoritative.
Verification: node --check apps/chippy/public/app.js; node --test apps/chippy/server.test.mjs — 2/2 pass.


## Customer-led Trip Planner — 5 Oct 2026

Andy clarified that trip planning must be driven by the 2026 customer database, not hard-coded itineraries. The intended workflow is: choose area/postcode and/or customer type, discover matching accounts/prospects, then select the companies to visit.

Implemented first usable slice in Chippy:
- New Trip Planner navigation item.
- Live read-only query of `Database/2026/MASTER_Customers_2026_v2.xlsx` (5,328 rows / 16 columns) via Python/openpyxl.
- Filters: area/postcode, customer type, free-text search.
- Select/remove companies in a browser-local visit list.
- Cardiff is the initial default/current-use example.
- Noted data-quality risk: city-only matching can confuse South Wales Newport with Isle of Wight records; use postcode/country context.

Verification:
- node --check app.js + server.mjs passed.
- customer-db.py live Cardiff query passed.
- /api/customers live test on alternate port returned 12 Cardiff sites.
- existing Chippy tests 2/2 passed.
