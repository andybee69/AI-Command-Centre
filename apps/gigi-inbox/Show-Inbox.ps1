param([string]$InboxPath)
$ErrorActionPreference = 'Stop'
try {
    if (-not $InboxPath) {
        $config = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'config.json') -Raw | ConvertFrom-Json
        $InboxPath = $config.inbox_path
    }
    if (-not $InboxPath -or -not (Test-Path -LiteralPath $InboxPath -PathType Leaf)) { throw 'Inbox file not found. Set inbox_path in config.json to the existing Learning_Inbox.csv.' }
    $rows = @(Import-Csv -LiteralPath $InboxPath)
    if ($rows.Count -eq 0) { Write-Output 'Gigi inbox: 0 items. Nothing waiting for review.'; exit 0 }
    foreach ($field in @('ID','AddedAt','Source','URL','Status')) {
        if ($rows[0].PSObject.Properties.Name -notcontains $field) { throw "Inbox is missing column: $field" }
    }
    $waiting = @($rows | Where-Object { $_.Status.Trim() -eq 'Waiting for review' } | Sort-Object AddedAt,ID)
    Write-Output "Gigi inbox: $($rows.Count) items; $($waiting.Count) waiting for review."
    foreach ($group in ($rows | Group-Object Status | Sort-Object Name)) { Write-Output "  $($group.Name): $($group.Count)" }
    if ($waiting.Count -eq 0) { Write-Output 'Next action: no items waiting for review.'; exit 0 }
    $next = $waiting[0]
    Write-Output "Next to review: $($next.ID) ($($next.Source), added $($next.AddedAt))"
    Write-Output "Source: $($next.URL)"
    Write-Output "Next action: ask Gigi to review $($next.ID) from the existing Learning Inbox."
    Write-Output 'Status only: this command does not assess sources or change the inbox.'
} catch {
    [Console]::Error.WriteLine("Cannot read Gigi inbox: $($_.Exception.Message)")
    exit 1
}
