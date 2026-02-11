@echo off
setlocal EnableExtensions DisableDelayedExpansion

echo ==================================================
echo       Portfolio V4 - Auto Installation Script     
echo ==================================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js (v18+) from https://nodejs.org/
    pause
    exit /b 1
)

REM Check for Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo [OK] Dependencies found (Node.js and Git).
echo.

if exist ".env.local" (
    echo [INFO] .env.local file already exists.
    set /p "overwrite=Do you want to overwrite it? (y/n): "
) else (
    set "overwrite=y"
)

if /i "%overwrite%" neq "y" goto SKIP_CONFIG

echo.
echo [CONFIG] Configuring Environment Variables...
echo --------------------------------------

echo.
echo -- Firebase Configuration --
set /p "fb_api_key=API Key: "
set /p "fb_auth_domain=Auth Domain: "
set /p "fb_project_id=Project ID: "
set /p "fb_storage_bucket=Storage Bucket: "
set /p "fb_msg_sender_id=Messaging Sender ID: "
set /p "fb_app_id=App ID: "
set /p "fb_measurement_id=Measurement ID: "

echo.
echo -- Clerk Configuration --
set /p "clerk_pub_key=Publishable Key: "
set /p "clerk_secret_key=Secret Key: "

echo.
echo -- Cloudflare Configuration (Optional) --
set /p "cf_zone_id=Zone ID: "
set /p "cf_api_token=API Token: "

echo.
echo Writing to .env.local...

REM Writing file content line by line to avoid syntax errors with blocks
echo # Firebase config > .env.local
echo NEXT_PUBLIC_FIREBASE_API_KEY=%fb_api_key%>> .env.local
echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=%fb_auth_domain%>> .env.local
echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=%fb_project_id%>> .env.local
echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=%fb_storage_bucket%>> .env.local
echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=%fb_msg_sender_id%>> .env.local
echo NEXT_PUBLIC_FIREBASE_APP_ID=%fb_app_id%>> .env.local
echo NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=%fb_measurement_id%>> .env.local
echo.>> .env.local
echo # Clerk (auth)>> .env.local
echo NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=%clerk_pub_key%>> .env.local
echo CLERK_SECRET_KEY=%clerk_secret_key%>> .env.local
echo.>> .env.local
echo # Cloudflare (optional: stats)>> .env.local
echo CLOUDFLARE_ZONE_ID=%cf_zone_id%>> .env.local
echo CLOUDFLARE_API_TOKEN=%cf_api_token%>> .env.local

echo [OK] .env.local created successfully!

:SKIP_CONFIG
echo.
echo [INSTALL] Installing Dependencies...
echo ----------------------------
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [BUILD] Building Project...
echo ---------------------
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo ==================================================
echo       [OK] Installation Complete!                   
echo ==================================================
echo.
echo To start the application, run:
echo   npm start
echo.
pause
