param([switch]$NoBrowser, [switch]$NoKey)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$taskData = Join-Path $taskRoot 'data\ops-room-local'
$taskServer = Join-Path $PSScriptRoot 'server.mjs'
$taskNode = (Get-Command node -ErrorAction Stop).Source
New-Item -ItemType Directory -Force $taskData | Out-Null
$taskRunning = $false
if (Test-Path (Join-Path $taskData 'access-token')) {
    $taskKey = (Get-Content (Join-Path $taskData 'access-token') -Raw).Trim()
    try { $null = Invoke-RestMethod 'http://127.0.0.1:8767/api/state' -Headers @{Authorization="Bearer $taskKey"}; $taskRunning = $true } catch {}
}
if (-not $taskRunning) {
    $taskProcess = Start-Process -FilePath $taskNode -ArgumentList ('"' + $taskServer + '"') -WorkingDirectory $taskRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $taskData 'server.log') -RedirectStandardError (Join-Path $taskData 'server-error.log') -PassThru
    $taskProcess.Id | Set-Content (Join-Path $taskData 'launcher.pid')
    for ($taskAttempt=0; $taskAttempt -lt 30; $taskAttempt++) {
        Start-Sleep -Milliseconds 200
        if (Test-Path (Join-Path $taskData 'access-token')) {
            $taskKey = (Get-Content (Join-Path $taskData 'access-token') -Raw).Trim()
            try { $null = Invoke-RestMethod 'http://127.0.0.1:8767/api/state' -Headers @{Authorization="Bearer $taskKey"}; $taskRunning = $true; break } catch {}
        }
        if ($taskProcess.HasExited) { break }
    }
}
if (-not $taskRunning) { throw "Room could not start. Read $taskData\server-error.log and apps\ops-room\README.md recovery instructions." }
if (-not $NoKey) {
    Write-Host 'Your private room access key (copy into the room login):'
    Write-Host $taskKey
}
if (-not $NoBrowser) { Start-Process 'http://127.0.0.1:8767' }
Write-Host 'The room server stays running after this window closes. No Windows startup service was installed.'
