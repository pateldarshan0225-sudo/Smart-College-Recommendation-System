@echo off
echo ========================================================
echo Starting Smart College Recommendation Full Stack App...
echo ========================================================
start "Smart College Backend (Port 5000)" cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 3 /nobreak >nul
start "Smart College Frontend (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"
echo.
echo Both servers have been launched in separate windows!
echo - Frontend:  http://localhost:5173
echo - Backend:   http://localhost:5000
echo.
echo Admin Login:
echo   Email:     darshan@gmail.com
echo   Password:  darshan123
echo ========================================================
pause
