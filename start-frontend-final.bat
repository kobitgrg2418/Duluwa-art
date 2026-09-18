@echo off
echo.
echo ==========================================
echo   Duluwa Art Gallery - Frontend Server
echo ==========================================
echo.
echo Clearing cache...
cd /d "C:\Users\ACER NITRO\Desktop\Duluwa-art\frontend"
if exist .next rmdir /s /q .next > nul 2>&1
if exist node_modules\.cache rmdir /s /q node_modules\.cache > nul 2>&1

echo Building application...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed! Check errors above.
    pause
    exit /b 1
)

echo.
echo Starting development server...
echo Frontend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
npm run dev