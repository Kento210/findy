import { Button } from '@mui/material'

export default function ScoreButton({ 
  score, 
  currentScore, 
  onClick, 
  disabled 
}) {
  return (
    <Button
      variant={currentScore === score ? "contained" : "outlined"}
      onClick={() => onClick(score)}
      size="small"
      disabled={disabled}
      sx={{ 
        minWidth: { xs: '32px', md: '40px' },
        height: { xs: '32px', md: '36px' },
        fontSize: { xs: '0.75rem', md: '0.875rem' }
      }}
    >
      {score}
    </Button>
  )
}