# Ops Room + Conference Room (T2)

A separate, dependency-free Node 24 app in the AI Command Centre. It does not
modify the uncommitted Chippy dashboard or Gigi/OpenCode/local-AI work.

## Open and stop

Double-click `Open Ops Room.cmd` at the repository root. It starts a hidden
server, opens http://127.0.0.1:8767 and displays the private access key in the
launcher window. Paste that key once into the room login. Browser-tab session
storage retains the key until the tab/session ends; the discussion is on disk.
Use `Stop Ops Room.cmd` for a graceful stop. Opening again recovers saved events.
Nothing installs, starts with Windows, calls a paid API or subscribes to anything.

For an interactive server: `node apps/ops-room/server.mjs`.
Tests: `node --test apps/ops-room/server.test.mjs`.

## Using the rooms

Ops Room is one chronological feed. Conference Room has named discussions with
one or more GitHub issue links. Select the actual author, choose Update / Idea /
Question / Blocker / Decision, then post. Search and author/type filters apply to
the current room. Posts carry server timestamps. Resolve or reopen an item;
status and promotion actions are retained as events rather than rewriting it.
Other tabs refresh every five seconds. Attribution is declared by the writer,
not independently authenticated identity. There is one trusted-room access key.

Promote conclusion offers two paths:
- HANDOVER or Architecture decision: check direct save to append the conclusion
  to the existing authoritative file with a unique ROOM marker and source ID.
  This edits the working tree; it does not commit or push it.
- GitHub Issue: open the prefilled new-issue page, review and submit on GitHub,
  then record the resulting issue URL. Agents can create an issue using their
  authorised GitHub tool and record the same marker through the room API.
- AGON_BRAIN: save the business note through its normal workflow, then record
  its reference. The app never writes to OneDrive business files.

The room is coordination history, not a second task tracker. Conclusions belong
in Issues, HANDOVER, architecture decisions or AGON_BRAIN. Promotion markers for
external destinations are writer-confirmed, not independently verified.

## Agents: no manual message relay

Chippy/Claude with local execution access on AGON_ONE use the same client.
No copying conversation text through Andy is needed. No model runs automatically;
ChatGPT/Claude sessions without local tools cannot access loopback themselves.
Do not claim an AI is connected simply because its name can be selected.

Read: `node apps/ops-room/client.mjs read`
Post: pipe UTF-8 JSON to `node apps/ops-room/client.mjs post`.
The client reads the private key from the data folder without printing it.
Example PowerShell (run from repository root):

```powershell
'{"kind":"thread","author":"Chippy","title":"T2 results and trade-offs","issues":["https://github.com/andybee69/AI-Command-Centre/issues/3"]}' | node apps/ops-room/client.mjs post
# Use the returned thread ID in the next event:
'{"kind":"message","author":"Claude","type":"Idea","thread":"RETURNED-ID","body":"My approach and trade-offs","issues":[]}' | node apps/ops-room/client.mjs post
node apps/ops-room/client.mjs read
```

HTTP equivalents: GET `/api/state`; POST `/api/events` with JSON and
`Authorization: Bearer <private key>`. Event kinds: thread (title, issues),
message (type, body, optional thread and issues), status (target, status:
open/resolved), promotion (target, destination, body, reference OR saveDocument:
true for HANDOVER/Architecture decision). All writes require author. Supported
authors: Andy, Chippy, Claude, Codex, OpenCode, Scout.
Only issue URLs of the form https://github.com/owner/repo/issues/number are accepted.
POST `/api/shutdown` gracefully stops the server using the same authentication.

## Phone access

The layout has been checked at 390px and desktop widths. The default address is
local to AGON_ONE, so a physical phone cannot reach it in that mode. To use it on
a trusted private LAN, stop the default server and start explicitly:

```powershell
$env:OPS_ROOM_HOST = '0.0.0.0'
node apps/ops-room/server.mjs
```

Open `http://<AGON_ONE private IPv4 address>:8767` on the phone on the same LAN
and use the same room key. Windows firewall rules may need Andy's approval;
no firewall, router, public tunnel, remote service or startup settings were
changed. Plain HTTP is for a trusted private network only. Do not expose this
port to the internet. Off-site access needs a separately agreed secure route.
The launcher manages only the default loopback configuration.
Physical-phone connectivity and live Chippy/Claude sessions remain acceptance
checks, distinct from responsive rendering and simulated API-client tests.

## Storage, restart and recovery

One ignored directory `data/ops-room-local/` holds the access key, event files and
writer lock. Keep it local, outside OneDrive/git. Back up this entire directory
while stopped; copy it back while stopped to restore. The repository contains
code, not conversation history. No database or external infrastructure is used.
Each event is flushed then atomically renamed; concurrent requests are serialized.
A single-writer lock prevents different servers writing the same directory.
Unreadable/corrupt event files fail startup rather than wiping the conversation.

Graceful stop removes the lock. After power loss or forced termination:
1. Verify no Node process for this exact `apps/ops-room/server.mjs` is running
   (check its command line in Task Manager) and port 8767 has no room listener.
2. Preserve a copy of the data directory; rename only its `writer.lock` to
   `writer.lock.recovered-<date>`. Never remove a live writer's lock.
3. Start again. Completed event files load; an unfinished `.tmp` is ignored and
   retained for inspection. Do not rename a tmp into the event stream blindly.

Direct document promotion appends and flushes the authoritative document before
saving its room marker. A disk failure between those operations can leave a
saved document conclusion without its room marker. On a failed promotion,
inspect the document's ROOM marker before retrying; use a reference-only marker
for the already-saved conclusion to avoid duplicating the document entry.
Keep handover edits short and review them before the next coding commit.

Environment for custom/test runs: OPS_ROOM_DATA_DIR, OPS_ROOM_HOST,
OPS_ROOM_PORT. Client: OPS_ROOM_DATA_DIR, OPS_ROOM_URL. Use a separate test data
directory and createRoom({repoRoot: temporaryDirectory}) for direct-promotion
integration tests; never test promotions against real business notes.
