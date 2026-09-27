@echo off
echo ========================================================
echo Starting Smart College Recommendation Full Stack App...
echo ========================================================
start "Smart College Backend (Port 5000)" cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 3 /nobreak >nul
start "Smart College Frontend (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"
timeout /t 2 /nobreak >nul
start "GitHub Auto-Sync Watcher" cmd /k "cd /d %~dp0 && node auto-push.js"
echo.
echo All services launched in separate windows!
echo - Frontend:  http://localhost:5173
echo - Backend:   http://localhost:5000
echo - Auto-Sync: Active (Watching for code changes and pushing to GitHub)
echo.
echo Admin Login:
echo   Email:     darshan@gmail.com
echo   Password:  darshan123
echo ========================================================
pause
