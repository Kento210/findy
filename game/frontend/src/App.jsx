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
  const [selectedModel, setSelectedModel] = useState('OpenAI 4o')
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
    setSelectedModel('OpenAI 4o')
    setAiOutput('')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 }, textAlign: 'center' }}>
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

        {gameState === 'judging' && <JudgingScreen />}

        {gameState === 'battle' && currentGame && (
          <Box sx={{ textAlign: 'left' }}>
            <Grid container spacing={3} justifyContent="center">
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
          </Box>
        )}

        {gameState === 'result' && gameResult && currentGame && (
          <Box sx={{ textAlign: 'left' }}>
            <Grid container spacing={3} justifyContent="center">
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
                <Box sx={{ textAlign: 'center' }}>
                  <GameResult 
                    winner={gameResult.winner}
                    player1Score={gameResult.scores.player1}
                    player2Score={gameResult.scores.player2}
                    isWinner={gameResult.isWinner}
                    onNewGame={handleNewGame}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default App
