import test from 'node:test';
import assert from 'node:assert/strict';
import {makeAgentUpdate,parseAgentUpdate,latestAgentTasks} from './agent-task.mjs';
const base={author:'Chippy',taskId:'GIGI-5',issueUrl:'https://github.com/andybee69/AI-Command-Centre/issues/5',status:'queued',summary:'Review shared agent handover',needsApproval:true};
test('encodes an existing Ops Room message event and parses it safely',()=>{
 const event={id:'one',at:'2026-10-08T09:00:00Z',...makeAgentUpdate(base)};
 assert.equal(event.kind,'message');assert.deepEqual(event.issues,[base.issueUrl]);
 assert.deepEqual(parseAgentUpdate(event),{taskId:base.taskId,issueUrl:base.issueUrl,status:'queued',summary:base.summary,needsApproval:true,author:'Chippy',eventId:'one',at:event.at});
});
test('rejects bad status, author, links, controls and unsafe shape',()=>{
 for(const change of [{author:'Intruder'},{status:'execute'},{issueUrl:'javascript:alert(1)'},{taskId:'../escape'},{summary:'bad\nnewline'},{needsApproval:'yes'}]){
  assert.throws(()=>makeAgentUpdate({...base,...change}));
 }
 assert.equal(parseAgentUpdate({kind:'message',author:'Andy',body:'Ordinary room discussion'}),null);
 const e=makeAgentUpdate(base);
 assert.equal(parseAgentUpdate({...e,body:e.body+' extra'}),null);
 assert.equal(parseAgentUpdate({...e,issues:[]}),null);
 assert.equal(parseAgentUpdate({...e,author:'Unknown'}),null);
});
test('recovers latest task state from append-only events, without executing anything',()=>{
 const first={id:'1',...makeAgentUpdate(base)};
 const second={id:'2',...makeAgentUpdate({...base,author:'Claude',status:'working',summary:'Review in progress',needsApproval:false})};
 const other={id:'3',...makeAgentUpdate({...base,taskId:'GIGI-6',status:'blocked',summary:'Waiting for permission'})};
 const latest=latestAgentTasks([first,{kind:'message',body:'hello'},second,other]);
 assert.equal(latest.length,2);
 assert.equal(latest.find(x=>x.taskId==='GIGI-5').status,'working');
 assert.equal(latest.find(x=>x.taskId==='GIGI-6').status,'blocked');
 assert.throws(()=>latestAgentTasks({}));
});
