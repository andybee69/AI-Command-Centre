import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=new URL('./public/',import.meta.url);
const read=p=>readFile(new URL(p,base),'utf8');

test('office exists as separate read-only tab with six desks',async()=>{
 const html=await read('index.html'),js=await read('app.js');
 for(const id of ['office-tab','office-view','office-health','office-desks','office-detail']) assert.match(html,new RegExp('id="'+id+'"'));
 for(const agent of ['Chippy','Claude','Codex','OpenCode','Scout','Andy']) assert.match(js,new RegExp("\\['"+agent+"'"));
 assert.match(js,/activityUpdates\(state\.events\|\|\[\]\)/);
 assert.match(html,/self-reported|reported tasks/i);
});

test('offline view cannot display cached historical tasks as current',async()=>{
 const js=await read('app.js');
 assert.match(js,/catch\(e\)\{officeConnected=false;state=\{events:\[\]\}/);
 assert.match(js,/Offline · historical reports only/);
 assert.match(js,/No recorded tasks for this desk/);
});

test('office links use stored GitHub issue references and prevent opener access',async()=>{
 const js=await read('app.js');
 assert.match(js,/link\.href=t\.issueUrl/);
 assert.match(js,/link\.rel='noopener'/);
 assert.match(js,/Approval required/);
});

test('office styles are responsive and do not contain literal newline escape prefix',async()=>{
 const css=await read('style.css');
 assert.match(css,/\.office-grid\{display:grid/);
 assert.match(css,/@media\(max-width:700px\)\{\.office-grid/);
 assert.doesNotMatch(css,/\\\\n#activity-view/);
});
