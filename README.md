# AI Route Battle

大崎駅からFindyオフィスまでのルート対戦ゲーム

## 構成

- **Frontend**: React + Vite + Material-UI
- **Backend**: Node.js + Express + Socket.IO

## クイックスタート

### 1. ビルド
```bash
./build.sh
```

### 2. 起動
```bash
./start.sh
```

### 3. アクセス
- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:3000

## 開発者向け

### 個別起動
```bash
# フロントエンド
cd game/frontend
npm run dev

# バックエンド
cd game/backend
npm start
```

### 停止
`Ctrl+C` でサーバーを停止

## ゲームの流れ

1. AIモデルを選択
2. AIの出力結果を入力
3. 対戦相手とマッチング
4. AI評価による対戦
5. 結果発表