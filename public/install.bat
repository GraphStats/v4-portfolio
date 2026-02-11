@echo off
setlocal

echo ==================================================
echo       Portfolio V4 - Auto Installation Script
echo ==================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js n'est pas installe. Installez Node.js v18+.
    pause
    exit /b 1
)

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git n'est pas installe. Installez Git.
    pause
    exit /b 1
)

echo [OK] Node.js et Git detectes.
echo.

REM Clone the repository if package.json is not present
if exist "package.json" goto SKIP_CLONE

echo [CLONE] Telechargement du projet depuis GitHub...
echo ---------------------------------------------------
set /p "install_dir=Nom du dossier d'installation (defaut: v4-portfolio): "
if "%install_dir%"=="" set "install_dir=v4-portfolio"

if exist "%install_dir%\package.json" (
    echo [INFO] Le dossier %install_dir% contient deja le projet. Utilisation du dossier existant.
    cd "%install_dir%"
    goto SKIP_CLONE
)

if exist "%install_dir%" (
    echo [ERROR] Le dossier %install_dir% existe deja mais ne semble pas contenir le projet.
    echo Veuillez supprimer le dossier ou en choisir un autre.
    pause
    exit /b 1
)

git clone https://github.com/GraphStats/v4-portfolio.git "%install_dir%"
if %errorlevel% neq 0 (
    echo [ERROR] Le clonage du repo a echoue.
    pause
    exit /b 1
)

cd "%install_dir%"
echo [OK] Projet clone dans le dossier %install_dir%.
echo.

:SKIP_CLONE

if not exist ".env" goto CONFIGURE_ENV

echo [INFO] Le fichier .env existe deja.
set /p "overwrite=Voulez-vous le remplacer ? (y/n): "
if /i not "%overwrite%"=="y" goto SKIP_CONFIG

:CONFIGURE_ENV
echo.
echo [CONFIG] Configuration des variables d'environnement...
echo ------------------------------------------------------
echo.
echo -- Firebase --
set /p "fb_api_key=API Key: "
set /p "fb_auth_domain=Auth Domain: "
set /p "fb_project_id=Project ID: "
set /p "fb_storage_bucket=Storage Bucket: "
set /p "fb_msg_sender_id=Messaging Sender ID: "
set /p "fb_app_id=App ID: "
set /p "fb_measurement_id=Measurement ID: "
echo.
echo -- Clerk (Auth) --
set /p "clerk_pub_key=Publishable Key: "
set /p "clerk_secret_key=Secret Key: "
echo.
echo -- Cloudflare (Optionnel, appuyez sur Entree pour passer) --
set /p "cf_zone_id=Zone ID: "
set /p "cf_api_token=API Token: "

echo.
echo Ecriture du fichier .env...
echo # Firebase config> .env
echo NEXT_PUBLIC_FIREBASE_API_KEY=%fb_api_key%>> .env
echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=%fb_auth_domain%>> .env
echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=%fb_project_id%>> .env
echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=%fb_storage_bucket%>> .env
echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=%fb_msg_sender_id%>> .env
echo NEXT_PUBLIC_FIREBASE_APP_ID=%fb_app_id%>> .env
echo NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=%fb_measurement_id%>> .env
echo.>> .env
echo # Clerk>> .env
echo NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=%clerk_pub_key%>> .env
echo CLERK_SECRET_KEY=%clerk_secret_key%>> .env
echo.>> .env
echo # Cloudflare>> .env
echo CLOUDFLARE_ZONE_ID=%cf_zone_id%>> .env
echo CLOUDFLARE_API_TOKEN=%cf_api_token%>> .env

echo [OK] .env cree avec succes !

:SKIP_CONFIG
echo.
echo [INSTALL] Installation des dependances...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install a echoue.
    pause
    exit /b 1
)

echo.
echo [BUILD] Build du projet...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Le build a echoue.
    pause
    exit /b 1
)

echo.
echo ==================================================
echo       [OK] Installation terminee !
echo ==================================================
echo.
echo Pour lancer l'application :
echo   npm start
echo.
pause
