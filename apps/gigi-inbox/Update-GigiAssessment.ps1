param([string]$InboxPath,[string]$Id,[string]$Status,[string]$SkillCandidate='',[string]$Notes='',[string]$Assessment='')
$ErrorActionPreference='Stop'
$allowed=@('Waiting for review','Evaluated - reference only','Approved - skill created','Rejected - not useful')
if($Status -notin $allowed){throw 'Unsupported GIGI status.'}
$rows=@(Import-Csv -LiteralPath $InboxPath)
$item=$rows|Where-Object{$_.ID -eq $Id}|Select-Object -First 1
if(-not $item){throw 'GIGI item not found.'}
$inboxRoot=Split-Path -Parent $InboxPath
$evaluationDir=Join-Path $inboxRoot 'Evaluations'
New-Item -ItemType Directory -Force -Path $evaluationDir|Out-Null
$evaluationRelative=''
if($Status -ne 'Waiting for review'){
  $evaluationRelative="Evaluations/$Id.md"
  $evaluationPath=Join-Path $inboxRoot $evaluationRelative
  $safeAssessment=if([string]::IsNullOrWhiteSpace($Assessment)){'No detailed assessment entered.'}else{$Assessment.Trim()}
  $safeSkill=if([string]::IsNullOrWhiteSpace($SkillCandidate)){'None'}else{$SkillCandidate.Trim()}
  $md=@("# GIGI Evaluation - $Id",'', '## Source',"- $($item.Source): $($item.URL)",'','## Assessment',"**Status:** $Status  ","**Skill candidate:** $safeSkill",'',$safeAssessment,'','## Decision',$(if([string]::IsNullOrWhiteSpace($Notes)){$Status}else{$Notes.Trim()}))-join [Environment]::NewLine
  Set-Content -LiteralPath ($evaluationPath+'.tmp') -Value $md -Encoding UTF8
  Move-Item -LiteralPath ($evaluationPath+'.tmp') -Destination $evaluationPath -Force
}
$item.Status=$Status
$item.EvaluationFile=$evaluationRelative
$item.SkillCandidate=if([string]::IsNullOrWhiteSpace($SkillCandidate)){''}else{$SkillCandidate.Trim()}
$item.Notes=if([string]::IsNullOrWhiteSpace($Notes)){''}else{$Notes.Trim()}
$tmp=$InboxPath+'.tmp'
$rows|Export-Csv -LiteralPath $tmp -NoTypeInformation -Encoding UTF8
Move-Item -LiteralPath $tmp -Destination $InboxPath -Force
$item|ConvertTo-Json -Compress
