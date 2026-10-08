import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createRoom} from './server.mjs';
const script=fileURLToPath(new URL('./client.mjs',import.meta.url));
test('GIGI CLI task-post and task-list roundtrip with rejected invalid payload',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'gigi-cli-'));
 const room=await createRoom({dir,port:0});
 const invoke=(command,input)=>new Promise((resolve,reject)=>{
  const p=spawn(process.execPath,[script,command],{env:{...process.env,OPS_ROOM_DATA_DIR:dir,OPS_ROOM_URL:room.url}});
  let stdout='',stderr='';
  p.stdout.on('data',s=>stdout+=s);p.stderr.on('data',s=>stderr+=s);
  p.on('error',reject);p.on('close',code=>resolve({code,stdout,stderr}));
  p.stdin.end(input===undefined?undefined:JSON.stringify(input));
 });
 const update={author:'Claude',taskId:'GIGI-7',issueUrl:'https://github.com/andybee69/AI-Command-Centre/issues/7',status:'working',summary:'CLI integration test',needsApproval:false};
 try {
  const posted=await invoke('task-post',update);
  assert.equal(posted.code,0,posted.stderr);
  assert.equal(JSON.parse(posted.stdout).kind,'message');
  const listed=await invoke('task-list');
  assert.equal(listed.code,0,listed.stderr);
  const tasks=JSON.parse(listed.stdout);
  assert.equal(tasks.length,1);assert.equal(tasks[0].taskId,'GIGI-7');
  assert.equal(tasks[0].status,'working');
  const rejected=await invoke('task-post',{...update,status:'execute'});
  assert.notEqual(rejected.code,0);
  assert.match(rejected.stderr,/Invalid status/);
  assert.equal(JSON.parse((await invoke('task-list')).stdout).length,1);
 }finally{await room.close();await rm(dir,{recursive:true,force:true});}
});
