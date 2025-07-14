#!/bin/bash

# Render.com用改良版ビルドスクリプト
set -e

echo "=== Render.com Build Script v2 ==="
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# ルートの依存関係処理
echo "Installing root dependencies..."
if [ -f "package.json" ]; then
  npm install --production=false
fi

# フロントエンドのビルド
echo "=== Building Frontend ==="
if [ -d "game/frontend" ]; then
  cd game/frontend
  
  echo "Cleaning previous build artifacts..."
  rm -rf node_modules package-lock.json dist .vite
  
  # Viteのキャッシュもクリア
  rm -rf node_modules/.vite
  
  echo "Installing frontend dependencies (clean install)..."
  # オプショナル依存関係を無効にしてインストール
  npm install --no-optional --legacy-peer-deps
  
  echo "Building frontend application..."
  # ビルド時の環境変数を設定
  NODE_ENV=production npm run build
  
  echo "Frontend build completed successfully!"
  echo "Build output size:"
  du -sh dist/ || echo "dist directory not found"
  
  cd ../..
else
  echo "Frontend directory not found!"
  exit 1
fi

# バックエンドの依存関係インストール
echo "=== Installing Backend Dependencies ==="
if [ -d "game/backend" ]; then
  cd game/backend
  
  echo "Cleaning backend dependencies..."
  rm -rf node_modules package-lock.json
  
  echo "Installing backend dependencies..."
  npm install --production
  
  echo "Backend dependencies installed successfully!"
  cd ../..
else
  echo "Backend directory not found!"
  exit 1
fi

echo "=== Build Completed Successfully! ==="