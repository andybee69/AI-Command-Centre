import http from 'node:http';
import {readFile, mkdir, open, readdir, rename, unlink} from 'node:fs/promises';
import {randomUUID, randomBytes, timingSafeEqual} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

export const authors = ['Andy','Chippy','Claude','Codex','OpenCode','Scout'];
export const types = ['Update','Idea','Question','Blocker','Decision'];
const here = path.dirname(fileURLToPath(import.meta.url));
const issuePattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/[1-9]\d*$/;
function bad(message) { throw Object.assign(new Error(message), {status:400}); }
function text(value, name, max=12000) {
  if(typeof value !== 'string' || !value.trim() || value.length>max) bad(`${name} is required (maximum ${max} characters)`);
  return value.trim();
}
function links(value=[]) {
  if(!Array.isArray(value) || value.length>20 || value.some(x=>typeof x!=='string'||!issuePattern.test(x))) bad('Use full GitHub issue URLs');
  return [...new Set(value)];
}
export async function createRoom({dir=path.resolve(here,'../../data/ops-room-local'),host='127.0.0.1',port=8767}={}) {
  await mkdir(dir,{recursive:true});
  const lock=await open(path.join(dir,'writer.lock'),'wx').catch(()=>{throw new Error('Room data is already locked. Stop the other server; after a crash follow README recovery.');});
  let server;
  try {
    let token;
    try {token=(await readFile(path.join(dir,'access-token'),'utf8')).trim();}
    catch(e) {if(e.code!=='ENOENT') throw e; token=randomBytes(32).toString('hex'); await usingFile(path.join(dir,'access-token'),token);}
    if(!/^[a-f0-9]{64}$/.test(token)) throw new Error('Invalid access-token file');
    const events=[];
    for(const name of (await readdir(dir)).filter(x=>/^\d+-[\w-]+\.json$/.test(x)).sort()) {
      const event=JSON.parse(await readFile(path.join(dir,name),'utf8'));
      if(!event.id || !['thread','message','status','promotion'].includes(event.kind)) throw new Error(`Invalid saved event: ${name}`);
      events.push(event);
    }
    let queue=Promise.resolve();
    const state=()=>({events,authors,types});
    async function save(input) {
      if(!input || typeof input!=='object') bad('Expected an object');
      if(!authors.includes(input.author)) bad('Choose a supported author');
      const e={id:randomUUID(),at:new Date().toISOString(),author:input.author,kind:input.kind};
      if(e.kind==='thread') {e.title=text(input.title,'Title',160);e.issues=links(input.issues);}
      else if(e.kind==='message') {
        e.body=text(input.body,'Message'); if(!types.includes(input.type)) bad('Choose a message type');e.type=input.type;
        e.thread=input.thread||null;
        if(e.thread&&!events.some(x=>x.kind==='thread'&&x.id===e.thread)) bad('Thread not found');
        e.issues=links(input.issues);
      } else if(e.kind==='status'||e.kind==='promotion') {
        if(!events.some(x=>['message','thread'].includes(x.kind)&&x.id===input.target)) bad('Target not found');
        e.target=input.target;
        if(e.kind==='status') {if(!['open','resolved'].includes(input.status)) bad('Invalid status');e.status=input.status;}
        else {
          if(!['GitHub Issue','HANDOVER','Architecture decision','AGON_BRAIN'].includes(input.destination)) bad('Invalid destination');
          e.destination=input.destination;e.reference=text(input.reference,'Destination reference',1000);e.body=text(input.body,'Conclusion');
          if(e.destination==='GitHub Issue'&&!issuePattern.test(e.reference)) bad('Use the created GitHub issue URL');
        }
      } else bad('Unknown event kind');
      const filename=`${String(events.length+1).padStart(12,'0')}-${e.id}.json`;
      await usingFile(path.join(dir,filename+'.tmp'),JSON.stringify(e));
      await rename(path.join(dir,filename+'.tmp'),path.join(dir,filename));events.push(e);return e;
    }
    server=http.createServer(async(req,res)=>{
      const send=(code,obj)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(obj));};
      try {
        const allowedHost=host==='127.0.0.1'?`127.0.0.1:${server.address().port}`:null;
        if(allowedHost&&req.headers.host!==allowedHost) return send(403,{error:'Invalid host'});
        if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`) return send(403,{error:'Cross-origin request rejected'});
        const url=new URL(req.url,'http://room.local');
        if(url.pathname.startsWith('/api/')) {
          const supplied=Buffer.from((req.headers.authorization||'').replace(/^Bearer /,''));const expected=Buffer.from(token);
          if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected)) return send(401,{error:'Enter the room access key'});
          if(req.method==='GET'&&url.pathname==='/api/state') return send(200,state());
          if(req.method==='POST'&&url.pathname==='/api/events') {
            if(!req.headers['content-type']?.startsWith('application/json')) return send(415,{error:'JSON required'});
            let body='';for await(const chunk of req) {body+=chunk;if(Buffer.byteLength(body)>65536) return send(413,{error:'Message too large'});}
            let input;try{input=JSON.parse(body);}catch{bad('Invalid JSON');}
            const job=queue.then(()=>save(input));queue=job.catch(()=>{});return send(201,await job);
          }
          return send(404,{error:'API route not found'});
        }
        const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'};
        if(req.method!=='GET'||!files[url.pathname]) return send(404,{error:'Not found'});
        const body=await readFile(path.join(here,'public',files[url.pathname]));
        res.writeHead(200,{'Content-Type':url.pathname.endsWith('.js')?'text/javascript':url.pathname.endsWith('.css')?'text/css':'text/html', 'Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",'X-Content-Type-Options':'nosniff'});res.end(body);
      }catch(e){send(e.status||500,{error:e.status?e.message:'Room could not save or load. Check server/storage.'});}
    });
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,host,resolve);});
    return {server,token,url:`http://${host}:${server.address().port}`,close:async()=>{await new Promise(r=>server.close(r));await queue;await lock.close();await unlink(path.join(dir,'writer.lock'));}};
  } catch(e) {await lock.close();await unlink(path.join(dir,'writer.lock'));throw e;}
}
async function usingFile(filename,body) {const f=await open(filename,'wx',0o600);try{await f.writeFile(body);await f.sync();}finally{await f.close();}}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const room=await createRoom({dir:process.env.OPS_ROOM_DATA_DIR,host:process.env.OPS_ROOM_HOST||'127.0.0.1',port:Number(process.env.OPS_ROOM_PORT||8767)});
  console.log(`Ops Room: ${room.url}\nAccess key is in data/ops-room-local/access-token (keep private).`);
  for(const signal of ['SIGINT','SIGTERM']) process.once(signal,async()=>{await room.close();process.exit();});
}
