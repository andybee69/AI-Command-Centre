@echo off
setlocal
cd /d "%~dp0.."
set "OLLAMA_HOST=127.0.0.1:11434"
set "OLLAMA_NO_CLOUD=1"
set "OLLAMA_MODELS=%CD%\.runtime\models"
set "OLLAMA_CONTEXT_LENGTH=4096"
set "OLLAMA_NUM_PARALLEL=1"
set "OLLAMA_VULKAN=false"
set "CUDA_VISIBLE_DEVICES=-1"
set "GGML_VK_VISIBLE_DEVICES=-1"
"%CD%\.runtime\ollama\ollama.exe" serve
endlocal
