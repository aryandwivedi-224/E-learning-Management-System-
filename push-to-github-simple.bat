@echo off
echo ========================================
echo Push Code to GitHub
echo Repository: aryandwivedi-224/E-learning-Management-System-
echo ========================================
echo.

REM Try to find git
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not found in PATH!
    echo.
    echo Please use one of these options:
    echo 1. Open Git Bash and run the commands manually
    echo 2. Use GitHub Desktop
    echo 3. Install Git from https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Git found! Proceeding...
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing git repository...
    git init
    git remote add origin https://github.com/aryandwivedi-224/E-learning-Management-System-.git
    echo.
)

echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "Add Render deployment configuration - Backend server, CORS setup, environment variables, and deployment guides"

echo.
echo Pushing to GitHub...
echo (You may be prompted for credentials)
git push origin master

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERROR: Push failed!
    echo.
    echo Try these:
    echo 1. Check your branch name (might be 'main' not 'master')
    echo 2. Use: git push origin main
    echo 3. Check authentication
    echo ========================================
)

echo.
pause
