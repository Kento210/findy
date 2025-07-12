#!/bin/bash

# Render.com用ビルドスクリプト
set -e

echo "Building for Render.com..."

# Node.jsのバージョンを確認
node --version
npm --version

# ルートの依存関係がある場合はインストール
if [ -f "package.json" ]; then
  npm install
fi

# フロントエンドのビルド
echo "Building frontend..."
if [ -d "game/frontend" ]; then
  cd game/frontend
  npm ci
  npm run build
  cd ../..
fi

# バックエンドの依存関係インストール
echo "Installing backend dependencies..."
if [ -d "game/backend" ]; then
  cd game/backend
  npm ci
  cd ../..
fi

echo "Build completed successfully!"