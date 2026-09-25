param(
    [string]$Checkpoint,
    [string]$NextAction,
    [string]$Tests,
    [string]$Notes,
    [string]$LastCommit,
    [string]$QueuePath = (Join-Path $PSScriptRoot 'tasks.json')
)
$ErrorActionPreference = 'Stop'
$temp = $null
try {
    $path = (Resolve-Path -LiteralPath $QueuePath).Path
    $original = [IO.File]::ReadAllText($path)
    $queue = $original | ConvertFrom-Json
    if ($queue.schema_version -ne 1 -or $queue.tasks -isnot [array]) { throw 'Expected schema_version 1 and a tasks array.' }
    $ids = @{}
    foreach ($task in $queue.tasks) {
        foreach ($field in @('task_id','title','status','last_checkpoint','tests','next_action','last_commit','notes')) {
            if ($task.PSObject.Properties.Name -notcontains $field) { throw "Missing field: $field" }
        }
        if ([string]::IsNullOrWhiteSpace($task.task_id) -or $ids.ContainsKey($task.task_id)) { throw 'Task IDs must be nonempty and unique.' }
        $ids[$task.task_id] = $true
        if ($task.status -notin @('queued','active','blocked','done')) { throw "Invalid status for $($task.task_id)." }
    }
    $active = @($queue.tasks | Where-Object { $_.status -eq 'active' })
    if ($active.Count -ne 1) { throw 'Choose exactly one active task in tasks.json before saving.' }
    $task = $active[0]
    Write-Output "Checkpoint Charlie: $($task.task_id) - $($task.title)"
    if (-not $PSBoundParameters.ContainsKey('Checkpoint')) { $Checkpoint = Read-Host 'Progress made' }
    if (-not $PSBoundParameters.ContainsKey('NextAction')) { $NextAction = Read-Host 'Next action' }
    if ([string]::IsNullOrWhiteSpace($Checkpoint) -or [string]::IsNullOrWhiteSpace($NextAction)) { throw 'Progress and next action cannot be blank. Nothing saved.' }
    if (-not $PSBoundParameters.ContainsKey('Tests')) { $Tests = Read-Host 'Test result (blank keeps previous)' }
    $task.last_checkpoint = "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz'): $($Checkpoint.Trim())"
    $task.next_action = $NextAction.Trim()
    if (-not [string]::IsNullOrWhiteSpace($Tests)) { $task.tests = @($Tests.Trim()) }
    if ($PSBoundParameters.ContainsKey('Notes')) { $task.notes = $Notes }
    if (-not [string]::IsNullOrWhiteSpace($LastCommit)) { $task.last_commit = $LastCommit.Trim() }
    $json = $queue | ConvertTo-Json -Depth 50
    $null = $json | ConvertFrom-Json
    $temp = "$path.$([guid]::NewGuid().ToString('N')).tmp"
    [IO.File]::WriteAllText($temp, $json + [Environment]::NewLine, (New-Object Text.UTF8Encoding($false)))
    if ([IO.File]::ReadAllText($path) -cne $original) { throw 'Queue changed while entering this checkpoint. Run again.' }
    [IO.File]::Replace($temp, $path, "$path.bak")
    $temp = $null
    Write-Output "Saved $($task.task_id). Next action: $($task.next_action)"
    Write-Output 'Previous queue saved as tasks.json.bak. Git commit is a separate step.'
} catch {
    [Console]::Error.WriteLine("Cannot save checkpoint: $($_.Exception.Message)")
    exit 1
} finally {
    if ($temp -and [IO.File]::Exists($temp)) { [IO.File]::Delete($temp) }
}
