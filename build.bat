@echo off
REM Build script for ToManyTab (Windows)
REM This script builds the extension and creates icon files

echo.
echo 🔨 Building ToManyTab extension...
echo.

REM Build with Vite
call npm run build

REM Create icons directory
if not exist dist\icons mkdir dist\icons

echo 📦 Creating icon files...

REM Create icon SVG files
(
echo ^<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"^>
echo   ^<rect width="128" height="128" fill="#8B5CF6"/^>
echo   ^<text x="64" y="74" font-size="80" font-weight="bold" text-anchor="middle" fill="white"^>📑^</text^>
echo ^</svg^>
) > dist\icons\icon-128.svg

(
echo ^<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"^>
echo   ^<rect width="48" height="48" fill="#8B5CF6"/^>
echo   ^<text x="24" y="36" font-size="32" font-weight="bold" text-anchor="middle" fill="white"^>📑^</text^>
echo ^</svg^>
) > dist\icons\icon-48.svg

(
echo ^<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"^>
echo   ^<rect width="16" height="16" fill="#8B5CF6"/^>
echo   ^<text x="8" y="13" font-size="12" font-weight="bold" text-anchor="middle" fill="white"^>📑^</text^>
echo ^</svg^>
) > dist\icons\icon-16.svg

echo.
echo ✅ Build complete! Extension is ready in the 'dist' folder.
echo.
echo 📋 Next steps:
echo 1. Open Chrome and go to chrome://extensions/
echo 2. Enable 'Developer mode' ^(top right^)
echo 3. Click 'Load unpacked' and select the 'dist' folder
echo 4. The ToManyTab extension should now appear in your extensions!
echo.
