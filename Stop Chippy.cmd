@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0apps\chippy\Stop-Chippy.ps1"
if errorlevel 1 pause
