$ErrorActionPreference = 'Stop'
$pidFile = Join-Path $PSScriptRoot '..\..\data\chippy-local\server.pid'
if (!(Test-Path -LiteralPath $pidFile)) { Write-Host 'No launcher-managed Chippy process recorded.'; exit }
$chippyProcessId = [int](Get-Content -LiteralPath $pidFile)
$process = Get-CimInstance Win32_Process -Filter "ProcessId=$chippyProcessId"
$expectedScript = Join-Path $PSScriptRoot 'server.mjs'
if ($process -and $process.Name -eq 'node.exe' -and $process.CommandLine.Contains($expectedScript)) {
    Stop-Process -Id $chippyProcessId
    Write-Host 'Chippy stopped. Your saved projects are retained.'
} else { Write-Host 'The recorded Chippy process is no longer running.' }
