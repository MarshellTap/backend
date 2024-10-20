#!/bin/bash

cd /root/marshelltap/backend || exit

echo "Closing any process using port 3489..."
fuser -k 3489/tcp

echo "Pulling latest changes from GitHub..."
git pull origin main

echo "Forcing local state to match remote..."
git fetch origin main
git reset --hard origin/main

echo "Installing dependencies with legacy-peer-deps to bypass conflicts..."
npm install --legacy-peer-deps

echo "Restarting backend with PM2 on port 3489..."
pm2 restart backend || pm2 start app.js --name "backend"

pm2 save

echo "Backend update, restart, and port cleanup completed!"