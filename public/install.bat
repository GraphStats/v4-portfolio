@echo off
TITLE Portfolio V4 Installer

echo ==================================================
echo       Portfolio V4 - Auto Installation Script     
echo ==================================================
echo.

:: Check Node
node -v > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js (v18+) first.
    pause
    exit
)

:: Check Git
git --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed. Please install Git first.
    pause
    exit
)

echo [OK] Dependencies found (Node.js & Git).
echo.

if exist ".env.local" goto ASK_OVERWRITE
goto CONFIGURE_ENV

:ASK_OVERWRITE
echo [INFO] .env.local file already exists.
set /p overwrite="Do you want to overwrite it? (y/n): "
if /i "%overwrite%"=="y" goto CONFIGURE_ENV
goto SKIP_CONFIG

:CONFIGURE_ENV
echo.
echo [CONFIG] Configuring Environment Variables...
echo --------------------------------------

echo.
echo -- Firebase Configuration --
set /p fb_api_key="API Key: "
set /p fb_auth_domain="Auth Domain: "
set /p fb_project_id="Project ID: "
set /p fb_storage_bucket="Storage Bucket: "
set /p fb_msg_sender_id="Messaging Sender ID: "
set /p fb_app_id="App ID: "
set /p fb_measurement_id="Measurement ID: "

echo.
echo -- Clerk Configuration (Auth) --
set /p clerk_pub_key="Publishable Key: "
set /p clerk_secret_key="Secret Key: "

echo.
echo -- Cloudflare Configuration (Optional) --
set /p cf_zone_id="Zone ID: "
set /p cf_api_token="API Token: "

echo.
echo Writing to .env.local...
(
    echo # Firebase config
    echo NEXT_PUBLIC_FIREBASE_API_KEY=%fb_api_key%
    echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=%fb_auth_domain%
    echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=%fb_project_id%
    echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=%fb_storage_bucket%
    echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=%fb_msg_sender_id%
    echo NEXT_PUBLIC_FIREBASE_APP_ID=%fb_app_id%
    echo NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=%fb_measurement_id%
    echo.
    echo # Clerk ^(auth^)
    echo NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=%clerk_pub_key%
    echo CLERK_SECRET_KEY=%clerk_secret_key%
    echo.
    echo # Cloudflare ^(optional: stats^)
    echo CLOUDFLARE_ZONE_ID=%cf_zone_id%
    echo CLOUDFLARE_API_TOKEN=%cf_api_token%
) > .env.local
echo [OK] .env.local created successfully!

:SKIP_CONFIG
echo.
echo [INSTALL] Installing Dependencies...
echo ----------------------------
call npm install
if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit
)

echo.
echo [BUILD] Building Project...
echo ---------------------
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed.
    pause
    exit
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
