param(
    [int]$PollSeconds = 3
)

$ErrorActionPreference = 'Stop'
$sharedScript = 'C:\Users\andyb\OneDrive - Agon\Agon Info\Agon_Master folder\AGON_BRAIN\05_GIGI_HUB\Learning Inbox\scripts\Add-ToGigiInbox.ps1'
$logPath = Join-Path $PSScriptRoot 'watcher.log'
$lastUrl = ''

Add-Type -AssemblyName System.Windows.Forms

"[$(Get-Date -Format s)] GIGI watcher started." | Add-Content -LiteralPath $logPath

while ($true) {
    try {
        $text = [System.Windows.Forms.Clipboard]::GetText()
        $match = [regex]::Match($text, 'https?://[^\s<>"]+')
        if ($match.Success) {
            $url = $match.Value.TrimEnd('.', ',', ';', ')', ']')
            $host = ([uri]$url).Host.ToLowerInvariant()
            $supported = $host -match '(^|\.)(facebook\.com|fb\.watch|youtube\.com|youtu\.be|instagram\.com|tiktok\.com)$'
            if ($supported -and $url -ne $lastUrl) {
                $lastUrl = $url
                $result = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $sharedScript -Url $url -NoUi 2>&1
                "[$(Get-Date -Format s)] $url :: $($result -join ' ')" | Add-Content -LiteralPath $logPath
            }
        }
    } catch {
        "[$(Get-Date -Format s)] ERROR :: $($_.Exception.Message)" | Add-Content -LiteralPath $logPath
    }
    Start-Sleep -Seconds $PollSeconds
}
