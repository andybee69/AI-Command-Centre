@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Show-Inbox.ps1"
set "result=%errorlevel%"
pause
exit /b %result%
