@echo off
title SOT Tracker Laptop Installer Builder
color 0b

echo =======================================================================
echo              SOT TRACKER - DESKTOP PORTABLE EXE BUILDER
echo =======================================================================
echo.
echo This script will automatically package the complete application into a
echo single high-fidelity standalone Windows .exe client for your laptop!
echo.
echo REQUIREMENTS:
echo 1. Node.js installed (from https://nodejs.org)
echo 2. Python installed (Optional, to package the local monitoring hooks)
echo.
echo =======================================================================
echo.

:: 1. Verify Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js is not installed or not in your system path!
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b
)
echo [SUCCESS] Node.js detected: 
node -v
echo.

:: 2. Install Javascript NPM dependencies
echo [1/4] Installing React, Express, & Electron packages...
call npm install
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] NPM installation failed. Please check your internet connection.
    pause
    exit /b
)
echo.

:: 3. Build & Compile Python Telemetry Daemon (If python is ready)
where python >nul 2>nul
if %errorlevel% eq 0 (
    echo [2/4] Python detected! Packaging background monitoring executable...
    echo Installing telemetry dependencies...
    call pip install psutil pynput watchdog pywin32 pygetwindow wmi pyinstaller >nul 2>nul
    
    echo Compiling SOTTrackerDaemon.exe via PyInstaller...
    call pyinstaller --noconsole --onefile --distpath .\dist --name=SOTTrackerDaemon desktop-agent\tracker.py
    
    echo [SUCCESS] Python telemetry background daemon built!
) else (
    echo [2/4] Python not detected on path. Standard simulation engine will run.
)
echo.

:: 4. Build frontend/backend react server bundles
echo [3/4] Compiling React GUI and Express relational state engine...
call npm run build
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Compilation failed.
    pause
    exit /b
)
echo.

:: 5. Bundle with Electron and packaging
echo [4/4] Packing into a single standalone physical SOTTracker.exe file...
call npx electron-builder build --win --x64
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Electron packaging failed.
    pause
    exit /b
)

echo.
echo =======================================================================
echo                           BUILD COMPLETE!
echo =======================================================================
echo.
echo Your portable executable is ready! 
echo Open the new "dist" folder inside your project directory to find:
echo.
echo   =====>  SOTTracker.exe  (Double-click this to run the app!)
echo.
echo You can run or distribute SOTTracker.exe directly on any Windows laptop!
echo =======================================================================
echo.
pause
