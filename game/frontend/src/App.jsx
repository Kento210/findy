import { useState, useEffect } from 'react'
import { Container, Typography, Grid, Box } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { useSocket } from './hooks/useSocket'
import GameSetup from './components/GameSetup'
import WaitingScreen from './components/WaitingScreen'
import JudgingScreen from './components/JudgingScreen'
import PlayerCard from './components/PlayerCard'
import GameResult from './components/GameResult'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  const [selectedModel, setSelectedModel] = useState('')
  const [aiOutput, setAiOutput] = useState('')
  
  const {
    gameState,
    currentGame,
    playerRole,
    evaluations,
    gameResult,
    findMatch,
    resetGame,
    setCurrentGame,
    setEvaluations
  } = useSocket()


  const handleSubmitRoute = async () => {
    if (!selectedModel || !aiOutput.trim()) {
      return
    }
    
    // マッチングを開始
    findMatch({
      model: selectedModel,
      output: aiOutput
    })
  }

  const handleNewGame = () => {
    resetGame()
    setSelectedModel('')
    setAiOutput('')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
          AI Route Battle
        </Typography>
        <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
          大崎駅 → Findy オフィスまでのルート対戦ゲーム
        </Typography>

        {gameState === 'setup' && (
          <GameSetup 
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            aiOutput={aiOutput}
            setAiOutput={setAiOutput}
            onSubmit={handleSubmitRoute}
          />
        )}

        {gameState === 'waiting' && <WaitingScreen />}

        {gameState === 'judging' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5">判定中...</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>AIが回答を評価しています</Typography>
          </Box>
        )}

        {gameState === 'battle' && currentGame && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PlayerCard 
                player={currentGame.player1}
                title={playerRole === 'player1' ? 'あなた' : '対戦相手'}
                evaluation={evaluations?.player1}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <PlayerCard 
                player={currentGame.player2}
                title={playerRole === 'player2' ? 'あなた' : '対戦相手'}
                evaluation={evaluations?.player2}
              />
            </Grid>
          </Grid>
        )}

        {gameState === 'result' && gameResult && currentGame && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PlayerCard 
                player={currentGame.player1}
                title={playerRole === 'player1' ? 'あなた' : '対戦相手'}
                evaluation={evaluations?.player1}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <PlayerCard 
                player={currentGame.player2}
                title={playerRole === 'player2' ? 'あなた' : '対戦相手'}
                evaluation={evaluations?.player2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <GameResult 
                winner={gameResult.winner}
                player1Score={gameResult.scores.player1}
                player2Score={gameResult.scores.player2}
                isWinner={gameResult.isWinner}
                onNewGame={handleNewGame}
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default App
