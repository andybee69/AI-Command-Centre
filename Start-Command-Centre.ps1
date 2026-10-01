param([switch]$NoBrowser)
$ErrorActionPreference='Stop'
$root=Split-Path -Parent $MyInvocation.MyCommand.Path
$ops=Join-Path $root 'apps\ops-room\Open-Room.ps1'
$chippy=Join-Path $root 'apps\chippy\Start-Chippy.ps1'

Write-Host 'Starting AGON AI Command Centre...'
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $ops -NoBrowser -NoKey
if($LASTEXITCODE -ne 0){throw 'Ops Room failed to start.'}

if($NoBrowser){
  $env:CHIPPY_NO_BROWSER='1'
}
powershell.exe -NoProfile -ExecutionPolicy Bypass -File $chippy
if($LASTEXITCODE -ne 0){throw 'Chippy failed to start.'}

$ready=$false
for($i=0;$i -lt 20;$i++){
  try{$p=Invoke-RestMethod 'http://127.0.0.1:8766/api/projects' -TimeoutSec 1;$opsReady=Get-NetTCPConnection -State Listen -LocalPort 8767 -ErrorAction SilentlyContinue;if($p.schemaVersion -eq 1 -and $opsReady){$ready=$true;break}}catch{}
  Start-Sleep -Milliseconds 250
}
if(-not $ready){throw 'Command Centre did not become healthy. See docs\recovery.md.'}

Write-Host 'Command Centre ready.'
Write-Host 'Chippy:   http://127.0.0.1:8766'
Write-Host 'Ops Room: http://127.0.0.1:8767'
