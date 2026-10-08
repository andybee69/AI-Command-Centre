const $=id=>document.getElementById(id);
let key=sessionStorage.getItem('ops-room-key')||'',state={events:[]},mode='ops',thread=null,promotionTarget=null,loading=false;
const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
function error(e){$('error').textContent=e?.message||'';}
async function api(route,body){const r=await fetch('/api/'+route,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});const data=await r.json();if(!r.ok)throw new Error(data.error||'Request failed');return data;}
function options(id,values){for(const value of values)$(id).append(new Option(value,value));}
function issueLinks(parent,links){for(const url of links||[]){const a=el('a','#'+url.split('/').at(-1));a.href=url;a.target='_blank';a.rel='noopener';a.title=url;parent.append(a,document.createTextNode(' '));}}
async function refresh(){if(loading||!key)return;loading=true;try{const next=await api('state');state=next;if(!$('author').options.length){options('author',state.authors);options('filter-author',state.authors);options('type',state.types);options('filter-type',state.types);$('author').value=sessionStorage.getItem('ops-room-author')||'Andy';}$('login').hidden=true;$('room').hidden=false;$('connection').textContent='Connected · saved on AGON_ONE';render();error();}catch(e){$('connection').textContent='Disconnected · retry with Refresh';error(e);}finally{loading=false;}}
async function post(body){return api('events',{...body,author:$('author').value});}
function render(){
 $('activity-view').hidden=mode!=='activity';$('room-layout').hidden=mode==='activity';$('activity-tab').setAttribute('aria-pressed',mode==='activity');if(mode==='activity'){renderActivity();return;}
 $('threads').hidden=mode!=='conference';$('ops-tab').setAttribute('aria-pressed',mode==='ops');$('conference-tab').setAttribute('aria-pressed',mode==='conference');
 const threads=state.events.filter(e=>e.kind==='thread');if(mode==='conference'&&!threads.some(e=>e.id===thread))thread=threads[0]?.id||null;
 const selected=threads.find(e=>e.id===thread);$('room-title').textContent=mode==='ops'?'Ops Room':selected?.title||'Conference Room';$('room-detail').textContent=mode==='ops'?'One shared feed for day-to-day coordination.':'Andy + Chippy + Claude · approach, results, disagreements and next steps.'+(selected?' Started by '+selected.author+' · '+new Date(selected.at).toLocaleString():'');
 $('room-links').replaceChildren();if(mode==='conference')issueLinks($('room-links'),selected?.issues);
 $('thread-list').replaceChildren();for(const t of threads){const b=el('button',t.title,'thread');b.setAttribute('aria-pressed',t.id===thread);b.onclick=()=>{thread=t.id;render();};$('thread-list').append(b);}
 $('message-form').hidden=mode==='conference'&&!thread;
 const query=$('search').value.toLowerCase();const items=state.events.filter(e=>e.kind==='message'&&(mode==='ops'?!e.thread:Boolean(thread)&&e.thread===thread)&&(!$('filter-author').value||e.author===$('filter-author').value)&&(!$('filter-type').value||e.type===$('filter-type').value)&&(!query||e.body.toLowerCase().includes(query)));
 $('feed').replaceChildren();if(!items.length)$('feed').append(el('p',mode==='conference'&&!thread?'Start a discussion to bring the team together.':'No messages here yet.','empty'));
 for(const e of items){const article=el('article');const meta=el('div',undefined,'meta');meta.append(el('strong',e.author),el('span',e.type,'badge'));const time=el('time',new Date(e.at).toLocaleString());time.dateTime=e.at;meta.append(time);article.append(meta,el('p',e.body,'message'));const links=el('div');issueLinks(links,e.issues);article.append(links);
 const status=state.events.filter(x=>x.kind==='status'&&x.target===e.id).at(-1)?.status||'open';const actions=el('div',undefined,'actions');const resolve=el('button',status==='resolved'?'Reopen':'Mark resolved','quiet');resolve.onclick=async()=>{try{await post({kind:'status',target:e.id,status:status==='resolved'?'open':'resolved'});await refresh();}catch(err){error(err);}};actions.append(resolve);if(status==='resolved')actions.append(el('span','Resolved','badge'));
 const promote=el('button','Promote conclusion','quiet');promote.onclick=()=>{promotionTarget=e.id;$('conclusion').value=e.body;$('reference').value='';$('confirmed').checked=false;$('save-document').checked=false;updateDestination();updateIssueLink();$('promotion').showModal();};actions.append(promote);article.append(actions);
 for(const p of state.events.filter(x=>x.kind==='promotion'&&x.target===e.id)){const marker=el('p',`Promoted to ${p.destination} · ${p.reference}`,'promotion');marker.append(el('small',`Recorded by ${p.author} · ${new Date(p.at).toLocaleString()}`));article.append(marker);}$('feed').append(article);}
}

function activityUpdates(events){
 const latest=new Map(),marker='[gigi-agent-task:v1]\n',issue=/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/[1-9]\d*$/;
 for(const e of events){
  if(e?.kind!=='message'||typeof e.body!=='string'||!e.body.startsWith(marker))continue;
  try{
   const u=JSON.parse(e.body.slice(marker.length));
   if(!u||Array.isArray(u)||Object.keys(u).sort().join(',')!=='issueUrl,needsApproval,status,summary,taskId')continue;
   if(!['Andy','Chippy','Claude','Codex','OpenCode','Scout'].includes(e.author))continue;
   if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(u.taskId)||u.taskId.length>100||!issue.test(u.issueUrl)||!['queued','working','blocked','review','done'].includes(u.status)||typeof u.summary!=='string'||!u.summary.trim()||u.summary.length>1000||/[\\u0000-\\u001f\\u007f]/.test(u.summary)||typeof u.needsApproval!=='boolean')continue;
   if(!Array.isArray(e.issues)||e.issues.length!==1||e.issues[0]!==u.issueUrl)continue;
   latest.set(u.taskId,{...u,author:e.author,at:e.at});
  }catch{}
 }
 return [...latest.values()].reverse();
}
function renderActivity(){
 const list=$('activity-list');list.replaceChildren();
 const tasks=activityUpdates(state.events);
 if(!tasks.length){list.append(el('p','No agent task updates recorded yet. Agent reports will appear here after a task-post.','empty'));return;}
 for(const task of tasks){
  const article=el('article',undefined,'activity-task');
  const head=el('div',undefined,'meta');head.append(el('strong',task.taskId),el('span',task.status,'badge'),el('span','Reported by '+task.author));
  if(task.at){const when=new Date(task.at);if(!Number.isNaN(when.getTime()))head.append(el('time',when.toLocaleString()));}
  article.append(head,el('p',task.summary,'message'));
  if(task.needsApproval)article.append(el('p','Approval requested before proceeding','approval'));
  const a=el('a','View GitHub issue');a.href=task.issueUrl;a.target='_blank';a.rel='noopener';article.append(a);
  list.append(article);
 }
}

function updateIssueLink(){$('new-issue').href='https://github.com/andybee69/AI-Command-Centre/issues/new?'+new URLSearchParams({title:$('conclusion').value.slice(0,100),body:$('conclusion').value+'\n\nSource: T2 room message '+promotionTarget});}
$('login-form').onsubmit=async e=>{e.preventDefault();key=$('key').value.trim();sessionStorage.setItem('ops-room-key',key);await refresh();};
$('disconnect').onclick=()=>{key='';sessionStorage.removeItem('ops-room-key');$('room').hidden=true;$('login').hidden=false;$('key').value='';$('connection').textContent='Not connected';};
$('ops-tab').onclick=()=>{mode='ops';render();};$('conference-tab').onclick=()=>{mode='conference';render();};$('activity-tab').onclick=()=>{mode='activity';render();};$('refresh').onclick=refresh;
for(const id of ['search','filter-author','filter-type'])$(id).oninput=render;
$('author').onchange=()=>sessionStorage.setItem('ops-room-author',$('author').value);
const parseLinks=id=>$(id).value.split(/\s+/).filter(Boolean);
$('thread-form').onsubmit=async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;try{const saved=await post({kind:'thread',title:$('thread-title').value,issues:parseLinks('thread-issues')});thread=saved.id;$('thread-form').reset();await refresh();}catch(err){error(err);}finally{b.disabled=false;}};
$('message-form').onsubmit=async e=>{e.preventDefault();$('post').disabled=true;try{await post({kind:'message',type:$('type').value,body:$('body').value,thread:mode==='ops'?null:thread,issues:parseLinks('issues')});$('body').value='';$('issues').value='';await refresh();}catch(err){error(err);}finally{$('post').disabled=false;}};
function updateDestination(){const local=['HANDOVER','Architecture decision'].includes($('destination').value);$('direct-row').hidden=!local;if(!local)$('save-document').checked=false;const direct=$('save-document').checked;$('reference').disabled=direct;$('reference').required=!direct;$('confirmed').disabled=direct;$('confirmed').required=!direct;$('new-issue').hidden=$('destination').value!=='GitHub Issue';}
$('destination').onchange=updateDestination;$('save-document').onchange=updateDestination;
$('conclusion').oninput=updateIssueLink;$('cancel-promotion').onclick=()=>$('promotion').close();
$('promotion-form').onsubmit=async e=>{e.preventDefault();e.submitter.disabled=true;try{await post({kind:'promotion',target:promotionTarget,destination:$('destination').value,reference:$('reference').value,body:$('conclusion').value,saveDocument:$('save-document').checked});$('promotion').close();await refresh();}catch(err){error(err);$('promotion').close();}finally{e.submitter.disabled=false;}};
if(key)refresh();setInterval(()=>{if(!document.hidden&&!$('promotion').open)refresh();},5000);
