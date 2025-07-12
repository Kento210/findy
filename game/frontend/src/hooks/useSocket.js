import { useState, useEffect } from 'react'
import io from 'socket.io-client'

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
      
      // 評価データを保存
      const opponentRole = data.playerRole === 'player1' ? 'player2' : 'player1'
      setEvaluations({
        [data.playerRole]: data.evaluation || null,
        [opponentRole]: data.opponentEvaluation || null
      })
      
      // プレイヤー情報を正しく設定
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
      
      // 自分のデータを設定
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
      
      // 3秒後に判定画面に移行
      setTimeout(() => {
        setGameState('judging')
      }, 2000)
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

  const findMatch = (playerData) => {
    if (socket) {
      socket.emit('findMatch', playerData)
      // 自分の入力データを一時保存
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