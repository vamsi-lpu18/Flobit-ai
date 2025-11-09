@echo off
REM Flobit Analytics - Deployment Helper Script (Windows)
REM This script helps you prepare and deploy your application

echo ========================================
echo   Flobit Analytics - Deployment Helper
echo ========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo Git initialized
) else (
    echo Git already initialized
)

REM Check for uncommitted changes
git status --porcelain > nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo You have changes to commit. Adding all files...
    git add .
    
    set /p commit_msg="Enter commit message (or press Enter for default): "
    if "%commit_msg%"=="" set commit_msg=Update: Ready for deployment
    
    git commit -m "%commit_msg%"
    echo Changes committed
)

REM Check if remote exists
git remote | findstr "origin" > nul
if %errorlevel% neq 0 (
    echo.
    echo WARNING: No Git remote found!
    echo Please create a GitHub repository first:
    echo 1. Go to https://github.com/new
    echo 2. Create repository named: flobit-analytics
    echo 3. Run this command:
    echo    git remote add origin https://github.com/YOUR_USERNAME/flobit-analytics.git
    echo.
    pause
    exit /b 1
)

REM Push to GitHub
echo.
echo Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo Successfully pushed to GitHub!
) else (
    echo Failed to push. Make sure you have committed changes and set up remote.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Your code is now on GitHub!
echo ========================================
echo.
echo NEXT STEPS:
echo -----------
echo 1. Open https://vercel.com/new in your browser
echo 2. Click "Import Git Repository"
echo 3. Select your flobit-analytics repository
echo 4. Configure:
echo    - Root Directory: apps/web
echo    - Framework Preset: Next.js
echo.
echo 5. Add Environment Variables:
echo    DATABASE_URL (from Vercel Postgres or Neon)
echo    GROQ_API_KEY (from console.groq.com)
echo    NEXT_PUBLIC_API_BASE = /api
echo.
echo 6. Click DEPLOY!
echo.
echo Full guide: VERCEL_DEPLOYMENT.md
echo Quick guide: DEPLOY_QUICKSTART.md
echo.
pause
