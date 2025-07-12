#!/bin/bash

# AI Route Battle - Start Script
echo "🚀 AI Route Battle 起動中..."

# 並列実行のためのプロセス管理
cleanup() {
    echo "🛑 アプリケーションを停止中..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Ctrl+Cでクリーンアップ
trap cleanup SIGINT

# バックエンドを起動（バックグラウンド）
echo "🔧 バックエンドサーバーを起動中..."
cd game/backend
npm start &
BACKEND_PID=$!

# 少し待ってからフロントエンドを起動
sleep 2

# フロントエンドを起動（バックグラウンド）
echo "🌐 フロントエンドサーバーを起動中..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# ルートに戻る
cd ../../

echo "✅ 起動完了！"
echo "📱 フロントエンド: http://localhost:5173"
echo "🔧 バックエンド: http://localhost:3000"
echo "⚠️  停止するには Ctrl+C を押してください"

# プロセスが終了するまで待機
wait