import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {makeAgentUpdate} from './agent-task.mjs';

const source=await readFile(new URL('./public/app.js',import.meta.url),'utf8');
const start=source.indexOf('function activityUpdates(events)');
const end=source.indexOf('function renderActivity()',start);
assert.ok(start>=0&&end>start);
const activityUpdates=runInNewContext(source.slice(start,end)+'; activityUpdates');
const issueUrl='https://github.com/andybee69/AI-Command-Centre/issues/9';
test('activity view shows only latest validated task updates, not fabricated presence',()=>{
 const first={id:'1',at:'2026-10-08T09:00:00Z',...makeAgentUpdate({author:'Claude',taskId:'GIGI-9',issueUrl,status:'queued',summary:'Awaiting review',needsApproval:false})};
 const second={id:'2',at:'2026-10-08T09:01:00Z',...makeAgentUpdate({author:'Chippy',taskId:'GIGI-9',issueUrl,status:'blocked',summary:'Needs approval',needsApproval:true})};
 const tasks=activityUpdates([first,{kind:'message',body:'Unrelated'},second]);
 assert.equal(tasks.length,1);assert.equal(tasks[0].status,'blocked');assert.equal(tasks[0].author,'Chippy');assert.equal(tasks[0].needsApproval,true);
});
test('activity view rejects malformed claims and control characters',()=>{
 const good=makeAgentUpdate({author:'Claude',taskId:'GIGI-9',issueUrl,status:'working',summary:'Valid progress',needsApproval:false});
 assert.equal(activityUpdates([{...good,author:'Unknown'}]).length,0);
 assert.equal(activityUpdates([{...good,body:good.body.replace('Valid progress','Bad\\nline')}]).length,0);
 assert.equal(activityUpdates([{...good,issues:[]}]).length,0);
 assert.equal(activityUpdates([]).length,0);
});
