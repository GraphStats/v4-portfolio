#!/bin/bash

# Portfolio V4 - Auto Installer
# Author: GraphStats
# License: MIT

echo "=================================================="
echo "      Portfolio V4 - Auto Installation Script"
echo "=================================================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Please install Node.js (v18+)."
    exit 1
fi

# Check for Git
if ! command -v git &> /dev/null; then
    echo "[ERROR] Git is not installed. Please install Git."
    exit 1
fi

echo "[OK] Environment check passed (Node.js and Git found)."
echo ""

# Check if .env.local exists
SETUP_ENV=true
if [ -f .env.local ]; then
    echo "[INFO] .env.local file already exists."
    read -p "Do you want to overwrite it? (y/n): " overwrite_env
    if [[ "$overwrite_env" != "y" && "$overwrite_env" != "Y" ]]; then
        SETUP_ENV=false
    fi
fi

if [ "$SETUP_ENV" = true ]; then
    echo ""
    echo "[CONFIG] Configuring Environment Variables..."
    echo "--------------------------------------"

    # Firebase
    echo "-- Firebase Configuration --"
    read -p "API Key: " fb_api_key
    read -p "Auth Domain: " fb_auth_domain
    read -p "Project ID: " fb_project_id
    read -p "Storage Bucket: " fb_storage_bucket
    read -p "Messaging Sender ID: " fb_msg_sender_id
    read -p "App ID: " fb_app_id
    read -p "Measurement ID: " fb_measurement_id

    echo ""
    # Clerk
    echo "-- Clerk Configuration (Authentication) --"
    read -p "Publishable Key: " clerk_pub_key
    read -p "Secret Key: " clerk_secret_key

    echo ""
    # Cloudflare
    echo "-- Cloudflare Configuration (Optional - Press Enter to skip) --"
    read -p "Zone ID: " cf_zone_id
    read -p "API Token: " cf_api_token

    # Write to .env.local
    echo "Writing to .env.local..."
    cat > .env.local <<EOL
# Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=$fb_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$fb_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$fb_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$fb_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$fb_msg_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=$fb_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$fb_measurement_id

# Clerk (auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$clerk_pub_key
CLERK_SECRET_KEY=$clerk_secret_key

# Cloudflare (optional: stats)
CLOUDFLARE_ZONE_ID=$cf_zone_id
CLOUDFLARE_API_TOKEN=$cf_api_token
EOL

    echo "[OK] .env.local created successfully!"
fi

echo ""
echo "[INSTALL] Installing Dependencies..."
echo "----------------------------"
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] npm install failed."
    exit 1
fi

echo ""
echo "[BUILD] Building Project..."
echo "---------------------"
npm run build
if [ $? -ne 0 ]; then
    echo "[ERROR] Build failed."
    exit 1
fi

echo ""
echo "=================================================="
echo "      [OK] Installation Complete!"
echo "=================================================="
echo ""
echo "To start the application, run:"
echo "  npm start"
echo ""
