// GIGI agent handover v1. Pure data contract: no execution, filesystem or network calls.
const marker='[gigi-agent-task:v1]';
const authors=new Set(['Andy','Chippy','Claude','Codex','OpenCode','Scout']);
const statuses=new Set(['queued','working','blocked','review','done']);
const issue=/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/[1-9]\d*$/;
function field(value,name,max=500) {
  if(typeof value!=='string'||!value.trim()||value.length>max||/[\u0000-\u001f\u007f]/.test(value)) throw new TypeError('Invalid '+name);
  return value.trim();
}
export function makeAgentUpdate({author,taskId,issueUrl,status,summary,needsApproval=false}) {
  if(!authors.has(author)) throw new TypeError('Unsupported author');
  const task=field(taskId,'taskId',100);
  if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(task)) throw new TypeError('Invalid taskId');
  if(!issue.test(issueUrl||'')) throw new TypeError('Invalid issueUrl');
  if(!statuses.has(status)) throw new TypeError('Invalid status');
  const note=field(summary,'summary',1000);
  if(typeof needsApproval!=='boolean') throw new TypeError('Invalid needsApproval');
  const payload={taskId:task,issueUrl,status,summary:note,needsApproval};
  return {kind:'message',author,type:status==='blocked'?'Blocker':status==='done'?'Decision':'Update',
    body:marker+'\n'+JSON.stringify(payload),issues:[issueUrl]};
}
export function parseAgentUpdate(event) {
  if(!event||event.kind!=='message'||typeof event.body!=='string'||!event.body.startsWith(marker+'\n')) return null;
  try {
    const raw=JSON.parse(event.body.slice(marker.length+1));
    if(!raw||Array.isArray(raw)||Object.keys(raw).sort().join(',')!=='issueUrl,needsApproval,status,summary,taskId') return null;
    const expected=makeAgentUpdate({author:event.author,...raw});
    if(expected.body!==event.body||!Array.isArray(event.issues)||event.issues.length!==1||event.issues[0]!==raw.issueUrl) return null;
    return {...raw,author:event.author,eventId:event.id??null,at:event.at??null};
  }catch{return null;}
}
// Append-only history: the latest valid update for each task wins; no actions execute.
export function latestAgentTasks(events) {
  if(!Array.isArray(events)) throw new TypeError('Events must be an array');
  const latest=new Map();
  for(const event of events) {
    const update=parseAgentUpdate(event);
    if(update) latest.set(update.taskId,update);
  }
  return [...latest.values()];
}
