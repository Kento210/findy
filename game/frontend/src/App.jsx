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
import ParticleBackground from './components/ParticleBackground'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
      light: '#62efff',
      dark: '#00b2cc',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
    },
    background: {
      default: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "SF Pro Display", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      background: 'linear-gradient(45deg, #00e5ff, #ff4081)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h3: {
      fontWeight: 600,
      textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 20px 40px rgba(0, 229, 255, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #00e5ff, #0091ea)',
          '&:hover': {
            background: 'linear-gradient(45deg, #00b2cc, #0077c2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #ff4081, #f50057)',
          color: 'white',
          fontWeight: 600,
        },
      },
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

  // ゲーム開始後にプレイヤー情報を設定
  useEffect(() => {
    if (gameState === 'battle' && playerRole && currentGame) {
      setCurrentGame(prev => ({
        ...prev,
        [playerRole]: {
          model: selectedModel,
          output: aiOutput,
          score: prev[playerRole]?.score || null
        }
      }))
    }
  }, [gameState, playerRole, selectedModel, aiOutput])

  const handleNewGame = () => {
    resetGame()
    setSelectedModel('')
    setAiOutput('')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(0, 229, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 64, 129, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <ParticleBackground />
        <Container 
          maxWidth={false} 
          sx={{ 
            py: { xs: 2, md: 4 }, 
            px: { xs: 1, sm: 2, md: 3 },
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
          }}
        >
        <Typography 
          variant={{ xs: "h4", md: "h3" }} 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem' },
            fontWeight: 700,
            background: 'linear-gradient(45deg, #00e5ff, #ff4081, #00e5ff)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient 3s ease infinite, glow 2s ease-in-out infinite alternate',
            textShadow: '0 0 30px rgba(0, 229, 255, 0.7)',
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
            '@keyframes glow': {
              '0%': { filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.5))' },
              '100%': { filter: 'drop-shadow(0 0 20px rgba(255, 64, 129, 0.8))' },
            },
          }}
        >
          🤖 AI Route Battle ⚡
        </Typography>
        <Typography 
          variant={{ xs: "subtitle1", md: "h6" }} 
          component="p" 
          gutterBottom 
          align="center" 
          color="text.secondary" 
          sx={{ 
            mb: { xs: 2, md: 4 },
            opacity: 0.8,
            animation: 'fadeInUp 1s ease-out 0.5s both',
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 0.8, transform: 'translateY(0)' },
            },
          }}
        >
          🚉 大崎駅 → 🏢 Findy オフィスまでのルート対戦ゲーム
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
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ flex: 1 }}>
            <Grid item xs={12} lg={6}>
              <PlayerCard 
                player={currentGame.player1}
                title={playerRole === 'player1' ? 'あなた' : '対戦相手'}
                evaluation={evaluations?.player1}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <PlayerCard 
                player={currentGame.player2}
                title={playerRole === 'player2' ? 'あなた' : '対戦相手'}
                evaluation={evaluations?.player2}
              />
            </Grid>
          </Grid>
        )}

        {gameState === 'result' && gameResult && currentGame && (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ flex: 1 }}>
            <Grid item xs={12} lg={6}>
              <PlayerCard 
                player={currentGame.player1}
                title={playerRole === 'player1' ? 'あなた' : '対戦相手'}
                evaluation={evaluations?.player1}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
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
      </Box>
    </ThemeProvider>
  )
}

export default App
