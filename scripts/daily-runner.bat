@echo off
chcp 65001 >nul
setlocal
cd /d "G:\blog_quant"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "G:\blog_quant\scripts\daily-runner.ps1"
endlocal
