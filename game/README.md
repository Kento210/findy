# AI Route Battle

JR山手線大崎駅からアートヴィレッジ大崎セントラルタワー5階のFindyオフィスまでのルートについて、AIモデルの出力結果で対戦するゲームアプリケーションです。

## 機能

- **AIモデル選択**: ChatGPT-4、Claude-3.5-Sonnet、Gemini Pro等の主要AIモデルから選択
- **ルート入力**: AIが出力したルート情報を貼り付けて投稿
- **リアルタイム対戦**: Socket.IOを使用したリアルタイムマッチメイキング
- **精度評価**: 1-10点でルートの精度を相互評価
- **勝敗判定**: スコアに基づく自動勝敗判定

## 技術スタック

### フロントエンド
- React 18
- Vite (開発サーバー)
- Material-UI (MUI) - モダンなUI/UXデザイン
- Socket.io-client - リアルタイム通信

### バックエンド
- Node.js
- Express.js
- Socket.io - WebSocketサーバー
- CORS対応

## プロジェクト構成

```
game/
├── frontend/          # Reactフロントエンド
│   ├── src/
│   │   ├── components/    # UIコンポーネント
│   │   │   ├── GameSetup.jsx      # ゲーム設定画面
│   │   │   ├── WaitingScreen.jsx  # 待機画面
│   │   │   ├── PlayerCard.jsx     # プレイヤーカード
│   │   │   ├── GameResult.jsx     # 結果表示
│   │   │   └── ScoreButton.jsx    # スコアボタン
│   │   ├── hooks/         # カスタムフック
│   │   │   └── useSocket.js       # Socket.io管理
│   │   └── App.jsx        # メインアプリケーション
│   └── package.json
└── backend/           # Node.jsバックエンド
    ├── server.js      # サーバーメイン
    └── package.json
```

## セットアップ手順

### 1. 依存関係のインストール

**バックエンド:**
```bash
cd backend
npm install
```

**フロントエンド:**
```bash
cd frontend
npm install
```

### 2. サーバー起動

**バックエンドサーバー (ポート3001):**
```bash
cd backend
npm start
```

**フロントエンドサーバー (ポート5173):**
```bash
cd frontend
npm run dev
```

### 3. アクセス

ブラウザで `http://localhost:5173` にアクセスしてゲームを開始してください。

## ゲームの流れ

1. **ルート入力**: AIモデルを選択し、ルート情報を入力
2. **マッチメイキング**: 自動で対戦相手を検索
3. **対戦開始**: 両プレイヤーのルート情報が表示
4. **相互評価**: 相手のルートを1-10点で評価
5. **勝敗判定**: 高いスコアを獲得したプレイヤーが勝利

## 対象ルート

**出発地点**: JR山手線 大崎駅
**目的地**: アートヴィレッジ大崎セントラルタワー 5階 Findyオフィス

最適なルートは徒歩約8分、距離約600mとなります。

## 開発者向け情報

### Socket.IOイベント

- `findMatch`: マッチング開始
- `waitingForMatch`: 対戦相手待ち
- `gameFound`: 対戦相手決定
- `submitScore`: スコア送信
- `gameResult`: ゲーム結果
- `opponentDisconnected`: 相手の切断通知

### コンポーネント設計

- **関心の分離**: UI、ロジック、通信の責務を明確に分離
- **再利用性**: 汎用的なコンポーネント設計
- **状態管理**: カスタムフックによる状態の一元管理

### スタイリング

- Material-UIによる統一されたデザインシステム
- レスポンシブデザイン対応
- 青色を基調としたシンプルでモダンなUI

## 今後の拡張可能性

- ユーザー認証機能
- 戦績・ランキング機能
- 複数人対戦機能
- AI自動評価機能
- ルート可視化機能