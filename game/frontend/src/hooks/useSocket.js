import { useState, useEffect } from 'react'
import io from 'socket.io-client'

/**
 * Socket.ioを使用したリアルタイムゲーム管理フック
 * @returns {Object} ゲーム状態と操作関数を含むオブジェクト
 */
export function useSocket() {
  const [socket, setSocket] = useState(null)
  const [gameState, setGameState] = useState('setup') // setup, waiting, battle, judging, result
  const [currentGame, setCurrentGame] = useState(null)
  const [gameId, setGameId] = useState(null)
  const [playerRole, setPlayerRole] = useState(null)
  const [evaluations, setEvaluations] = useState(null)
  const [gameResult, setGameResult] = useState(null)

  useEffect(() => {
    const newSocket = io('http://localhost:3001')
    setSocket(newSocket)

    newSocket.on('waitingForMatch', () => {
      setGameState('waiting')
    })

    newSocket.on('gameFound', (data) => {
      setGameId(data.gameId)
      setPlayerRole(data.playerRole)
      setGameState('battle')
      
      // 評価データを状態に保存
      const opponentRole = data.playerRole === 'player1' ? 'player2' : 'player1'
      setEvaluations({
        [data.playerRole]: data.evaluation || null,
        [opponentRole]: data.opponentEvaluation || null
      })
      
      // プレイヤー1とプレイヤー2の情報を正しく設定
      const gameData = {
        player1: {
          model: data.opponent.model || 'Unknown',
          output: data.opponent.output || '',
          score: data.opponentEvaluation?.normalizedScore || 0
        },
        player2: {
          model: data.opponent.model || 'Unknown',
          output: data.opponent.output || '',
          score: data.evaluation?.normalizedScore || 0
        }
      }
      
      // 一時保存された自分の入力データを取得
      const playerData = window.playerInputData || { model: 'Unknown', output: '' }
      
      if (data.playerRole === 'player1') {
        gameData.player1 = {
          model: playerData.model || 'Unknown',
          output: playerData.output || '', 
          score: data.evaluation?.normalizedScore || 0
        }
        gameData.player2 = {
          model: data.opponent.model || 'Unknown',
          output: data.opponent.output || '',
          score: data.opponentEvaluation?.normalizedScore || 0
        }
      } else {
        gameData.player1 = {
          model: data.opponent.model || 'Unknown',
          output: data.opponent.output || '',
          score: data.opponentEvaluation?.normalizedScore || 0
        }
        gameData.player2 = {
          model: playerData.model || 'Unknown',
          output: playerData.output || '',
          score: data.evaluation?.normalizedScore || 0
        }
      }
      
      setCurrentGame(gameData)
      
      // バトル表示後、1秒後に判定画面に移行
      setTimeout(() => {
        console.log('Moving to judging state...')
        setGameState('judging')
      }, 1000)
    })

    newSocket.on('gameResult', (data) => {
      setGameResult(data)
      setGameState('result')
      setCurrentGame(prev => ({
        ...prev,
        player1: { ...prev.player1, score: data.scores.player1 },
        player2: { ...prev.player2, score: data.scores.player2 }
      }))
    })

    newSocket.on('opponentDisconnected', () => {
      alert('対戦相手が切断されました')
      resetGame()
    })

    return () => newSocket.close()
  }, [])

  /**
   * マッチメイキングを開始する
   * @param {Object} playerData - プレイヤーのモデルと出力情報
   */
  const findMatch = (playerData) => {
    if (socket) {
      socket.emit('findMatch', playerData)
      // React Hooksの依存関係問題を回避するための一時保存
      window.playerInputData = playerData
    }
  }

  const submitScore = (score) => {
    if (socket && gameId) {
      socket.emit('submitScore', {
        gameId: gameId,
        playerRole: playerRole,
        score: score
      })
    }
  }

  /**
   * ゲーム状態をリセットして初期状態に戻す
   */
  const resetGame = () => {
    setGameState('setup')
    setCurrentGame(null)
    setGameId(null)
    setPlayerRole(null)
    setEvaluations(null)
    setGameResult(null)
  }

  return {
    socket,
    gameState,
    currentGame,
    gameId,
    playerRole,
    evaluations,
    gameResult,
    findMatch,
    resetGame,
    setCurrentGame,
    setEvaluations
  }
}