import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeAgentUpdate,latestAgentTasks} from './agent-task.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const command=process.argv[2]||'read';
if(!['read','post','stop','task-post','task-list'].includes(command)) {console.error('Usage: node apps/ops-room/client.mjs read | post | stop | task-post | task-list');process.exit(1);}
try {
 const dir=process.env.OPS_ROOM_DATA_DIR||path.resolve(here,'../../data/ops-room-local');
 const token=(await readFile(path.join(dir,'access-token'),'utf8')).trim();
 const url=process.env.OPS_ROOM_URL||'http://127.0.0.1:8767';
 let body;
 if(command==='post'||command==='task-post') {
  let input='';for await(const chunk of process.stdin)input+=chunk;
  const data=JSON.parse(input);
  body=JSON.stringify(command==='task-post'?makeAgentUpdate(data):data);
 }
 const reading=command==='read'||command==='task-list';
 const response=await fetch(url+(reading?'/api/state':command==='stop'?'/api/shutdown':'/api/events'),{method:reading?'GET':'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body});
 const data=await response.json();if(!response.ok)throw new Error(data.error);
 console.log(JSON.stringify(command==='task-list'?latestAgentTasks(data.events):data,null,2));
}catch(e){console.error(`Room request failed: ${e.message}`);process.exitCode=1;}
