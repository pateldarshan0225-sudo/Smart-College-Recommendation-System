@echo off
title GitHub Auto-Sync Watcher
color 0b
echo ========================================================
echo Starting GitHub Auto-Sync Watcher for Smart College Repo
echo ========================================================
echo.
cd /d "%~dp0"
node auto-push.js
pause
