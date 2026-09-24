@echo off
if exist "%LOCALAPPDATA%\Programs\node\node-v20.18.0-win-x64" (
  set "PATH=%LOCALAPPDATA%\Programs\node\node-v20.18.0-win-x64;%PATH%"
)
echo ===================================================
echo   St Mary's Pharmacy - Starting Development Server
echo ===================================================
echo Backend API : http://localhost:5001
echo Frontend UI : http://localhost:5173
echo ===================================================
npm run dev
