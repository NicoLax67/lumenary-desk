@echo off
set "APP=%LOCALAPPDATA%\LumenaryDeskMail"
if not exist "%APP%\start button.cmd" (
  echo Lumenary Desk Mail ist noch nicht installiert. Bitte zuerst install-button.ps1 ausfuehren.
  pause
  exit /b 1
)
call "%APP%\start button.cmd"
