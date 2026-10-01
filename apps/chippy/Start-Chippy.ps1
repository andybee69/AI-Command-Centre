$ErrorActionPreference = 'Stop'
$port = if ($env:CHIPPY_PORT) { [int]$env:CHIPPY_PORT } else { 8766 }
$url = "http://127.0.0.1:$port"
try {
    $existing = Invoke-RestMethod "$url/api/projects" -TimeoutSec 2
    if ($existing.schemaVersion -eq 1 -and $existing.projects) { Start-Process $url; exit }
    throw 'The selected port is being used by another app.'
} catch {
    if ($_.Exception.Message -eq 'The selected port is being used by another app.') { throw }
}
$node = (Get-Command node -ErrorAction Stop).Source
$app = Join-Path $PSScriptRoot 'server.mjs'
$logs = Join-Path $PSScriptRoot '..\..\data\chippy-local'
New-Item -ItemType Directory -Path $logs -Force | Out-Null
$process = Start-Process -FilePath $node -ArgumentList @(('"' + $app + '"')) -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logs 'server.log') -RedirectStandardError (Join-Path $logs 'server-error.log') -PassThru
for ($i=0; $i -lt 30; $i++) {
    Start-Sleep -Milliseconds 200
    if ($process.HasExited) { throw 'Chippy could not start. Check data\chippy-local\server-error.log.' }
    try { $ready = Invoke-RestMethod "$url/api/projects" -TimeoutSec 1 } catch { continue }
    if ($ready.schemaVersion -eq 1) {
        Set-Content -LiteralPath (Join-Path $logs 'server.pid') -Value $process.Id
        Start-Process $url
        exit
    }
}
throw 'Chippy did not become ready. Check the server log.'
