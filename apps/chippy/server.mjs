import http from 'node:http';
import {readFile, writeFile, rename, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const here=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(here,'../..');
const port=Number(process.env.CHIPPY_PORT || 8766);
const origin=`http://127.0.0.1:${port}`;
const dataDir=process.env.CHIPPY_DATA_DIR || path.join(repo,'data','chippy-local');
const stateFile=path.join(dataDir,'projects.json');
const statuses=['Idea','Research','Planned','Building','Waiting','Active','Complete','Shelf'];
let state;
try { state=JSON.parse(await readFile(stateFile,'utf8')); }
catch(e) { if(e.code!=='ENOENT') throw e; state=JSON.parse(await readFile(path.join(here,'seed.json'),'utf8')); }
let saving=false;
function reply(res,code,value) { res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value)); }
async function inbox() {
  const config=JSON.parse(await readFile(path.join(repo,'apps','gigi-inbox','config.json'),'utf8'));
  const script="$ErrorActionPreference='Stop'; [Console]::OutputEncoding=[System.Text.Encoding]::UTF8; $rows=@(Import-Csv -LiteralPath $env:CHIPPY_INBOX); foreach($r in $rows) {foreach($f in @('ID','AddedAt','Source','URL','Status')) {if($r.PSObject.Properties.Name -notcontains $f){throw 'Inbox columns are incomplete'}}}; ConvertTo-Json -InputObject $rows -Compress";
  const {stdout}=await promisify(execFile)('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{env:{...process.env,CHIPPY_INBOX:config.inbox_path},windowsHide:true,timeout:15000,maxBuffer:4*1024*1024});
  return {source:config.inbox_path,items:JSON.parse(stdout.replace(/^\uFEFF/,''))};
}
const server=http.createServer(async(req,res)=>{
 try {
  if(req.headers.host!==`127.0.0.1:${port}`) return reply(res,403,{error:'Use the local dashboard address.'});
  if(req.headers.origin && req.headers.origin!==origin) return reply(res,403,{error:'Other websites cannot access this dashboard.'});
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  const pathname=new URL(req.url,origin).pathname;
  if(req.method==='GET' && pathname==='/api/projects') return reply(res,200,state);
  if(req.method==='GET' && pathname==='/api/inbox') {try{return reply(res,200,await inbox());}catch{return reply(res,503,{error:'The maintained Gigi inbox could not be read. Check apps/gigi-inbox/config.json and the source CSV.'});}}
  if(req.method==='PATCH' && pathname.startsWith('/api/projects/')) {
   if(req.headers.origin!==origin || !req.headers['content-type']?.startsWith('application/json')) return reply(res,403,{error:'Save from the dashboard.'});
   const id=pathname.slice('/api/projects/'.length);const index=state.projects.findIndex(p=>p.id===id);
   if(index<0) return reply(res,404,{error:'Project not found.'});
   let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>16000)return reply(res,413,{error:'Update is too large.'});}
   let patch;try{patch=JSON.parse(body);}catch{return reply(res,400,{error:'Invalid update.'});}
   if(!patch || typeof patch!=='object' || Array.isArray(patch))return reply(res,400,{error:'Invalid update.'});
   if(Object.keys(patch).some(k=>!['status','stage','nextAction','notes','provisional'].includes(k)))return reply(res,400,{error:'Unknown project field.'});
   if(patch.status!==undefined && !statuses.includes(patch.status))return reply(res,400,{error:'Choose a lifecycle status.'});
   for(const key of ['stage','nextAction','notes']) if(patch[key]!==undefined && (typeof patch[key]!=='string'||patch[key].length>2000||(key!=='notes'&&!patch[key].trim())))return reply(res,400,{error:'Stage and next action need text (up to 2,000 characters).'});
   if(patch.provisional!==undefined && typeof patch.provisional!=='boolean')return reply(res,400,{error:'Invalid confirmation.'});
   if(saving)return reply(res,409,{error:'Another save is finishing. Please try again.'});
   saving=true;
   try {
    const next=structuredClone(state);next.projects[index]={...next.projects[index],...patch,updatedAt:new Date().toISOString()};
    await mkdir(dataDir,{recursive:true});await writeFile(stateFile+'.tmp',JSON.stringify(next,null,2),'utf8');await rename(stateFile+'.tmp',stateFile);state=next;
    return reply(res,200,state.projects[index]);
   } finally {saving=false;}
  }
  if(req.method!=='GET')return reply(res,405,{error:'Method not allowed.'});
  const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'};
  if(!files[pathname])return reply(res,404,{error:'Not found.'});
  const ext=path.extname(files[pathname]);res.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[ext],'Cache-Control':'no-store'});res.end(await readFile(path.join(here,'public',files[pathname])));
 } catch(e) {console.error(e.message);if(!res.headersSent)reply(res,500,{error:'Could not complete this request. Your last saved data is unchanged.'});else res.end();}
});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?`Port ${port} is already in use. Open ${origin} if Chippy is already running, or choose CHIPPY_PORT.`:e.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Chippy Command Centre: ${origin}`));
