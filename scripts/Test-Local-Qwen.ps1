param([string]$Model='qwen3.5:4b')
$ErrorActionPreference='Stop'
$repo=Split-Path $PSScriptRoot -Parent
$prompt=Get-Content "$repo\prompts\local-classification-test.txt" -Raw
$body=@{model=$Model;messages=@(@{role='user';content=$prompt});stream=$false;think=$false;format='json';options=@{temperature=0;num_ctx=4096;num_predict=160}} | ConvertTo-Json -Depth 5
$timer=[Diagnostics.Stopwatch]::StartNew()
$result=Invoke-RestMethod -Method Post -Uri http://127.0.0.1:11434/api/chat -ContentType 'application/json' -Body $body -TimeoutSec 600
$timer.Stop()
$answer=$result.message.content | ConvertFrom-Json
$expected=@{A='Steelmaker';B='Steel processor';C='Lifting supplier';D='Unknown'}
$score=0
foreach($id in $expected.Keys){if($answer.$id -ceq $expected[$id]){$score++}}
$record=[ordered]@{Model=$Model;Correct=$score;Total=4;Seconds=[math]::Round($timer.Elapsed.TotalSeconds,1);TokensPerSecond=if($result.eval_duration){[math]::Round($result.eval_count/($result.eval_duration/1e9),2)}else{0};Answer=$answer}
$record | ConvertTo-Json -Depth 5 | Tee-Object -FilePath "$repo\.runtime\classification-result.json"
if($score -ne 4){throw 'Classification acceptance test failed'}

