@echo off
echo ====================================================================
echo FIXING STUDENT CREATION 500 ERROR
echo ====================================================================
echo.

REM Build frontend
echo [1/4] Building frontend assets...
call npm run build
echo.

REM Commit changes
echo [2/4] Committing fixes to git...
git add .
git commit -m "Fix: Add missing address column to students table and save parent relationship"
echo.

REM Push to GitHub (Railway will auto-deploy)
echo [3/4] Pushing to GitHub...
git push origin main
echo.

echo [4/4] Complete!
echo.
echo ====================================================================
echo FIXES APPLIED:
echo 1. Created migration to add 'address' column to students table
echo 2. Fixed parent-student relationship to save relationship type
echo.
echo Railway will automatically deploy these changes in 2-3 minutes.
echo Please wait for the deployment to complete before testing.
echo ====================================================================
echo.
pause
