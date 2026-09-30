import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createRoom} from './server.mjs';
test('shared writers, concurrent saves, restart, promotions and input boundaries',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'ops-room-'));let room=await createRoom({dir,port:0});
 const request=(method,route,body,token=room.token)=>fetch(room.url+route,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
 const post=async(body)=>{const r=await request('POST','/api/events',body);assert.equal(r.status,201);return r.json();};
 try {
  assert.equal((await request('GET','/api/state',undefined,'wrong')).status,401);
  const thread=await post({kind:'thread',author:'Andy',title:'Approach and trade-offs',issues:['https://github.com/andybee69/AI-Command-Centre/issues/3']});
  const messages=await Promise.all(Array.from({length:12},(_,i)=>post({kind:'message',author:i%2?'Chippy':'Claude',type:'Update',body:`Contribution ${i}`,thread:thread.id})));
  await post({kind:'status',author:'Andy',target:messages[0].id,status:'resolved'});
  await post({kind:'promotion',author:'Andy',target:thread.id,destination:'Architecture decision',reference:'docs/ARCHITECTURE_DECISIONS.md#AD-006',body:'Use shared event storage'});
  assert.equal((await request('POST','/api/events',{kind:'message',author:'Unknown',type:'Update',body:'x'})).status,400);
  assert.equal((await request('POST','/api/events',{kind:'message',author:'Andy',type:'Update',body:'x',thread:'missing'})).status,400);
  assert.equal((await request('POST','/api/events',{kind:'thread',author:'Andy',title:'bad',issues:['javascript:alert(1)']})).status,400);
  assert.equal((await fetch(room.url+'/api/state',{headers:{Origin:'http://evil.example',Authorization:`Bearer ${room.token}`}})).status,403);
  assert.equal((await fetch(room.url+'/server.mjs')).status,404);
  await assert.rejects(createRoom({dir,port:0}),/locked/);
  const before=await (await request('GET','/api/state')).json();const token=room.token;
  await room.close();room=await createRoom({dir,port:0});
  assert.equal(room.token,token);assert.deepEqual(await (await request('GET','/api/state')).json(),before);assert.equal(before.events.length,15);
 }finally{await room.close();await rm(dir,{recursive:true,force:true});}
});
test('corrupt saved data fails closed',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'ops-bad-'));
 try{await writeFile(path.join(dir,'000000000001-bad.json'),'broken');await assert.rejects(createRoom({dir,port:0}));}finally{await rm(dir,{recursive:true,force:true});}
});

test('direct promotion writes authoritative documents and retains source marker',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'ops-promote-'));
 const {mkdir,readFile}=await import('node:fs/promises');
 await mkdir(path.join(dir,'docs'));await writeFile(path.join(dir,'HANDOVER.md'),'# Baton\n');await writeFile(path.join(dir,'docs/ARCHITECTURE_DECISIONS.md'),'# Decisions\n');
 const room=await createRoom({dir:path.join(dir,'data'),repoRoot:dir,port:0});
 const post=async(body)=>{const r=await fetch(room.url+'/api/events',{method:'POST',headers:{Authorization:`Bearer ${room.token}`,'Content-Type':'application/json'},body:JSON.stringify({author:'Codex',...body})});return {status:r.status,data:await r.json()};};
 try{
  const message=await post({kind:'message',type:'Decision',body:'Keep authoritative records separate.'});
  for(const destination of ['HANDOVER','Architecture decision']){
   const saved=await post({kind:'promotion',target:message.data.id,destination,saveDocument:true,body:'Verified conclusion — preserved Unicode 🐴'});assert.equal(saved.status,201);
   const file=destination==='HANDOVER'?'HANDOVER.md':'docs/ARCHITECTURE_DECISIONS.md';const content=await readFile(path.join(dir,file),'utf8');assert.ok(content.startsWith('# '));assert.ok(content.includes(saved.data.id));assert.ok(content.includes('preserved Unicode 🐴'));assert.ok(content.includes(message.data.id));
  }
  assert.equal((await post({kind:'promotion',target:message.data.id,destination:'AGON_BRAIN',saveDocument:true,body:'No arbitrary write'})).status,400);
  const response=await fetch(room.url);assert.equal(response.status,200);assert.match(await response.text(),/Conference Room/);
 }finally{await room.close();await rm(dir,{recursive:true,force:true});}
});
test('independent agent client processes read and write the same discussion',async()=>{
 const {spawn}=await import('node:child_process');const {fileURLToPath}=await import('node:url');
 const dir=await mkdtemp(path.join(os.tmpdir(),'ops-client-'));const room=await createRoom({dir,port:0});
 function client(command,input){return new Promise((resolve,reject)=>{const p=spawn(process.execPath,[fileURLToPath(new URL('./client.mjs',import.meta.url)),command],{env:{...process.env,OPS_ROOM_DATA_DIR:dir,OPS_ROOM_URL:room.url}});let out='',err='';p.stdout.on('data',x=>out+=x);p.stderr.on('data',x=>err+=x);p.on('error',reject);p.on('exit',code=>code?reject(new Error(err)):resolve(JSON.parse(out)));p.stdin.end(input?JSON.stringify(input):undefined);});}
 try{
  const thread=await client('post',{kind:'thread',author:'Andy',title:'Shared API acceptance'});
  await Promise.all(['Chippy','Claude'].map(author=>client('post',{kind:'message',author,type:'Idea',thread:thread.id,body:'Independent test-client contribution'})));
  const shared=await client('read');assert.deepEqual(shared.events.filter(x=>x.kind==='message').map(x=>x.author).sort(),['Chippy','Claude']);
  assert.equal((await client('stop')).stopping,true);await room.close();
  const restarted=await createRoom({dir,port:0});await restarted.close();
 }finally{await room.close();await rm(dir,{recursive:true,force:true});}
});
