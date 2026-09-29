param(
    [string]$Prompt = "",
    [ValidateSet("models","chat","home")]
    [string]$Page = "models"
)

$urls = @{
    models = "https://aifreeforever.com/models"
    chat   = "https://aifreeforever.com/tools/ai-chat-no-sign-up"
    home   = "https://aifreeforever.com/"
}

if ($Prompt) {
    Set-Clipboard -Value $Prompt
    Write-Host "Prompt copied to clipboard." -ForegroundColor Green
}

Write-Host "Opening AI Free Forever in your browser..." -ForegroundColor Cyan
Write-Host "SAFE DATA ONLY: no customer lists, pricing, certificates, personal data, passwords or confidential AGON material." -ForegroundColor Yellow
Start-Process $urls[$Page]
