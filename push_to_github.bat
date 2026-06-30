@echo off
cd /d "C:\Users\user\Desktop\portfolio"

echo ========================================
echo   My-Portfolio - GitHub ga Push qilish
echo ========================================
echo.

echo 1. Stage barcha fayllar...
git add .

echo.
echo 2. Status tekshirish...
git status

echo.
echo ========================================
echo   Davom etish uchun Enter bosing...
echo ========================================
pause

echo 3. Commit...
git commit -m "Full-stack portfolio: React + Django + 3D background + AI chat + 3 languages"

echo 4. Branch va push...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   Tugadi!
echo ========================================
pause
