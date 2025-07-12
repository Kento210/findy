const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const http = require('http')
const { evaluateRoute, applyModelMultiplier } = require('./answerData')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
app.use(express.json())

// ゲーム状態管理
const games = new Map()
const waitingPlayers = []

// プレイヤー接続
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id)

  // マッチメイキング
  socket.on('findMatch', (playerData) => {
    const player = {
      id: socket.id,
      model: playerData.model,
      output: playerData.output,
      socket: socket
    }

    // 待機中のプレイヤーがいる場合はマッチング
    if (waitingPlayers.length > 0) {
      const opponent = waitingPlayers.shift()
      
      const gameId = `game_${Date.now()}`
      const game = {
        id: gameId,
        player1: opponent,
        player2: player,
        scores: {},
        evaluations: {},
        state: 'battle'
      }

      // AIの出力を自動評価
      const player1BaseEvaluation = evaluateRoute(opponent.output)
      const player2BaseEvaluation = evaluateRoute(player.output)
      
      // モデル倍率を適用
      const player1Evaluation = applyModelMultiplier(player1BaseEvaluation, opponent.model)
      const player2Evaluation = applyModelMultiplier(player2BaseEvaluation, player.model)

      game.evaluations = {
        player1: player1Evaluation,
        player2: player2Evaluation
      }

      games.set(gameId, game)

      // 両プレイヤーにゲーム開始を通知
      opponent.socket.emit('gameFound', {
        gameId: gameId,
        opponent: {
          model: player.model,
          output: player.output
        },
        playerRole: 'player1',
        evaluation: player1Evaluation,
        opponentEvaluation: player2Evaluation
      })

      player.socket.emit('gameFound', {
        gameId: gameId,
        opponent: {
          model: opponent.model,
          output: opponent.output
        },
        playerRole: 'player2',
        evaluation: player2Evaluation,
        opponentEvaluation: player1Evaluation
      })

      // 3秒後に自動判定を実行
      setTimeout(() => {
        const winner = player1Evaluation.normalizedScore > player2Evaluation.normalizedScore ? 'player1' : 
                      player2Evaluation.normalizedScore > player1Evaluation.normalizedScore ? 'player2' : 'tie'
        
        const result = {
          winner: winner,
          scores: {
            player1: player1Evaluation.normalizedScore,
            player2: player2Evaluation.normalizedScore
          },
          evaluations: {
            player1: player1Evaluation,
            player2: player2Evaluation
          }
        }

        // 両プレイヤーに結果を送信
        opponent.socket.emit('gameResult', {
          ...result,
          isWinner: winner === 'player1',
          yourScore: player1Evaluation.normalizedScore,
          opponentScore: player2Evaluation.normalizedScore
        })
        
        player.socket.emit('gameResult', {
          ...result,
          isWinner: winner === 'player2',
          yourScore: player2Evaluation.normalizedScore,
          opponentScore: player1Evaluation.normalizedScore
        })
        
        // ゲーム終了後にゲームを削除
        games.delete(gameId)
      }, 3000) // 3秒の判定時間

    } else {
      // 待機リストに追加
      waitingPlayers.push(player)
      socket.emit('waitingForMatch')
    }
  })

  // 手動スコア投稿は削除（自動判定に変更）

  // 切断処理
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id)
    
    // 待機リストから削除
    const waitingIndex = waitingPlayers.findIndex(player => player.id === socket.id)
    if (waitingIndex !== -1) {
      waitingPlayers.splice(waitingIndex, 1)
    }
    
    // ゲーム中の場合は相手に通知
    for (const [gameId, game] of games) {
      if (game.player1.id === socket.id || game.player2.id === socket.id) {
        const opponent = game.player1.id === socket.id ? game.player2 : game.player1
        opponent.socket.emit('opponentDisconnected')
        games.delete(gameId)
        break
      }
    }
  })
})

// ルート情報を評価するAPI
app.post('/api/evaluate-route', (req, res) => {
  const { aiOutput, model } = req.body
  
  try {
    const baseEvaluation = evaluateRoute(aiOutput)
    const evaluation = applyModelMultiplier(baseEvaluation, model)
    
    res.json({ 
      evaluation: evaluation,
      suggestedScore: evaluation.normalizedScore 
    })
  } catch (error) {
    console.error('Evaluation error:', error)
    res.status(500).json({ error: 'Evaluation failed' })
  }
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})