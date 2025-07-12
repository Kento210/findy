#!/bin/bash

# AI Route Battle - Build Script
echo "🏗️  AI Route Battle ビルド開始..."

# エラーが発生した場合にスクリプトを停止
set -e

# フロントエンドのビルド
echo "📦 フロントエンドをビルド中..."
cd game/frontend
npm install
npm run build
echo "✅ フロントエンド ビルド完了"

# バックエンドの依存関係インストール
echo "🔧 バックエンドの依存関係をインストール中..."
cd ../backend
npm install
echo "✅ バックエンド 依存関係インストール完了"

# ルートに戻る
cd ../../

echo "🎉 全体のビルドが完了しました！"
echo "📝 次のコマンドでアプリケーションを起動できます: ./start.sh"