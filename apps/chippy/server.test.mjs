import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const here=path.dirname(fileURLToPath(import.meta.url));
const port=18766, origin=`http://127.0.0.1:${port}`;
const dir=await mkdtemp(path.join(tmpdir(),'chippy-test-'));
async function start(data=dir){const child=spawn(process.execPath,[path.join(here,'server.mjs')],{env:{...process.env,CHIPPY_PORT:String(port),CHIPPY_DATA_DIR:data},windowsHide:true});await Promise.race([once(child.stdout,'data'),once(child,'exit').then(()=>{throw Error('Server failed to start');}),new Promise((_,reject)=>{const t=setTimeout(()=>reject(Error('Startup timeout')),8000);t.unref();})]);return child;}
async function stop(child){const done=once(child,'exit');child.kill();await done;}
const patch=(id,data,other={})=>fetch(`${origin}/api/projects/${id}`,{method:'PATCH',headers:{Origin:origin,'Content-Type':'application/json',...other},body:JSON.stringify(data)});
test('HTTP flow: seed, validation, private paths, origin protection and persistent edits',async()=>{
 let child=await start();
 try{
  let r=await fetch(origin+'/api/projects');let body=await r.json();assert.equal(body.projects.length,9);assert.equal(body.projects.filter(p=>p.provisional).length,4);
  const system=await (await fetch(origin+'/api/system')).json();assert.equal(system.commandCentre.ok,true);assert.equal(typeof system.brain.ok,'boolean');assert.equal(typeof system.gigi.ok,'boolean');assert.equal(typeof system.opsRoom.ok,'boolean');assert.equal(typeof system.localAI.ok,'boolean');
  const home=await fetch(origin);assert.match(await home.text(),/Chippy Command Centre/);assert.ok(home.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
  assert.equal((await fetch(origin+'/seed.json')).status,404);
  assert.equal((await fetch(origin+'/server.mjs')).status,404);
  assert.equal((await patch('xps',{status:'Bogus'})).status,400);
  assert.equal((await patch('xps',{stage:'   '})).status,400);
  assert.equal((await patch('xps',{id:'overwritten'})).status,400);
  assert.equal((await patch('xps',null)).status,400);
  assert.equal((await patch('missing',{status:'Idea'})).status,404);
  assert.equal((await patch('xps',{status:'Complete'},{Origin:'https://untrusted.example'})).status,403);
  r=await patch('xps',{status:'Planned',stage:'Test persistence',nextAction:'Confirm £50 parts list',provisional:false});assert.equal(r.status,200);
  const saved=JSON.parse(await readFile(path.join(dir,'projects.json'),'utf8'));assert.equal(saved.projects.find(p=>p.id==='xps').nextAction,'Confirm £50 parts list');
  await stop(child);child=await start();
  body=await (await fetch(origin+'/api/projects')).json();assert.equal(body.projects.find(p=>p.id==='xps').stage,'Test persistence');assert.equal(body.projects.find(p=>p.id==='xps').provisional,false);
 }finally{await stop(child);}
});
test('corrupt existing state fails closed instead of replacing user data',async()=>{
 const broken=path.join(dir,'broken');await mkdir(broken);await writeFile(path.join(broken,'projects.json'),'{broken');
 const child=spawn(process.execPath,[path.join(here,'server.mjs')],{env:{...process.env,CHIPPY_PORT:String(port),CHIPPY_DATA_DIR:broken},windowsHide:true});child.stderr.resume();const [code]=await once(child,'exit');assert.notEqual(code,0);assert.equal(await readFile(path.join(broken,'projects.json'),'utf8'),'{broken');
});
