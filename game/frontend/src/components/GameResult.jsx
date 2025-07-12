import { Paper, Typography, Button } from '@mui/material'

export default function GameResult({ 
  winner, 
  player1Score, 
  player2Score, 
  isWinner,
  onNewGame 
}) {
  const getWinnerText = () => {
    if (winner === 'tie') return '引き分け!'
    return isWinner ? '🎉 あなたの勝利！' : '😔 惜敗...'
  }

  const getResultColor = () => {
    if (winner === 'tie') return 'warning.main'
    return isWinner ? 'success.main' : 'error.main'
  }

  return (
    <Paper elevation={3} sx={{ 
      p: { xs: 3, md: 4, lg: 6 }, 
      textAlign: 'center', 
      background: `linear-gradient(135deg, ${isWinner ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'} 0%, rgba(255, 255, 255, 0.05) 100%)`,
      border: `2px solid ${isWinner ? '#4caf50' : '#f44336'}`,
      borderRadius: '20px'
    }}>
      <Typography 
        variant={{ xs: "h4", md: "h3", lg: "h2" }} 
        gutterBottom
        color={getResultColor()}
        sx={{ 
          fontWeight: 'bold',
          textShadow: '0 0 20px rgba(255,255,255,0.5)'
        }}
      >
        {getWinnerText()}
      </Typography>
      
      <Typography 
        variant={{ xs: "h6", md: "h5", lg: "h4" }} 
        sx={{ mb: { xs: 2, lg: 4 } }}
        color="text.primary"
      >
        最終スコア: {player1Score} vs {player2Score}
      </Typography>
      
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={onNewGame}
        size="large"
        sx={{ 
          mt: { xs: 2, lg: 3 },
          px: { xs: 4, lg: 6 },
          py: { xs: 1.5, lg: 2 },
          fontSize: { lg: '1.2rem' },
          fontWeight: 'bold'
        }}
      >
        🚀 新しいゲームを開始
      </Button>
    </Paper>
  )
}