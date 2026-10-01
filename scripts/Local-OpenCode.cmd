@echo off
setlocal
cd /d "%~dp0.."
set "XDG_CONFIG_HOME=%CD%\.runtime\opencode\config"
set "XDG_DATA_HOME=%CD%\.runtime\opencode\data"
set "XDG_CACHE_HOME=%CD%\.runtime\opencode\cache"
set "XDG_STATE_HOME=%CD%\.runtime\opencode\state"
call opencode --pure %*
endlocal
