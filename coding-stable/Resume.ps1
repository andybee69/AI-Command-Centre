param([string]$QueuePath = (Join-Path $PSScriptRoot 'tasks.json'))
$ErrorActionPreference = 'Stop'
try {
    $queue = Get-Content -LiteralPath $QueuePath -Raw | ConvertFrom-Json
    if ($queue.schema_version -ne 1 -or $null -eq $queue.tasks) { throw 'Expected schema_version 1 and a tasks array.' }
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
    if ($active.Count -gt 1) { throw 'More than one active task. Choose just one in tasks.json.' }
    if ($active.Count -eq 0) { Write-Output 'No active task. Set one task status to active in tasks.json.'; exit 0 }
    $task = $active[0]
    Write-Output "Active: $($task.task_id) - $($task.title)"
    Write-Output "Checkpoint: $($task.last_checkpoint)"
    Write-Output "Next action: $($task.next_action)"
    Write-Output "Last commit: $($task.last_commit)"
    Write-Output "Tests: $($task.tests -join '; ')"
    Write-Output "Notes: $($task.notes)"
} catch {
    Write-Error "Cannot resume: $($_.Exception.Message)"
    exit 1
}
