param([Parameter(Mandatory=$true)][string]$InboxPath,[Parameter(Mandatory=$true)][string]$Url)
$ErrorActionPreference='Stop'
$uri=$null
if(-not [System.Uri]::TryCreate($Url,[System.UriKind]::Absolute,[ref]$uri) -or $uri.Scheme -notin @('http','https')){throw 'Invalid web link.'}
$normalisedUrl=$uri.AbsoluteUri
$hostName=$uri.Host.ToLowerInvariant()
$source=switch -Regex ($hostName) {
  '(^|\.)youtu\.be$|(^|\.)youtube\.com$' {'YouTube';break}
  '(^|\.)facebook\.com$|(^|\.)fb\.watch$' {'Facebook';break}
  '(^|\.)instagram\.com$' {'Instagram';break}
  '(^|\.)tiktok\.com$' {'TikTok';break}
  default {'Web'}
}
$items=@(Import-Csv -LiteralPath $InboxPath)
$duplicate=$items|Where-Object{$_.URL -eq $normalisedUrl}|Select-Object -First 1
if($duplicate){$duplicate|ConvertTo-Json -Compress;exit 0}
$itemId='GLI-{0}-{1}' -f (Get-Date -Format 'yyyyMMdd-HHmmss'),([guid]::NewGuid().ToString('N').Substring(0,4).ToUpperInvariant())
$item=[pscustomobject][ordered]@{
 ID=$itemId
 AddedAt=Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'
 Source=$source
 URL=$normalisedUrl
 Status='Waiting for review'
 EvaluationFile=''
 SkillCandidate=''
 Notes=''
}
$item|Export-Csv -LiteralPath $InboxPath -Append -NoTypeInformation -Encoding UTF8
$item|ConvertTo-Json -Compress
