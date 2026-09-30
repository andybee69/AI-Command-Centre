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
