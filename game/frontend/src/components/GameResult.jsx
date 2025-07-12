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
    <Paper elevation={1} sx={{ 
      p: 3, 
      textAlign: 'center',
      border: `1px solid ${getResultColor()}`,
      borderRadius: 2
    }}>
      <Typography 
        variant="h4" 
        gutterBottom
        color={getResultColor()}
        sx={{ fontWeight: 'bold' }}
      >
        {getWinnerText()}
      </Typography>
      
      <Typography 
        variant="h6" 
        sx={{ mb: 2 }}
        color="text.primary"
      >
        最終スコア: {player1Score} vs {player2Score}
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={onNewGame}
        sx={{ 
          mt: 2,
          px: 3,
          py: 1
        }}
      >
        新しいゲームを開始
      </Button>
    </Paper>
  )
}