@echo off
title AGON AI Command Centre
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-Command-Centre.ps1"
if errorlevel 1 pause
