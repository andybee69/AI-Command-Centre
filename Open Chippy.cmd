@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0apps\chippy\Start-Chippy.ps1"
if errorlevel 1 pause
