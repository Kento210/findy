import { Paper, Typography, Box, CircularProgress, LinearProgress } from '@mui/material'
import { useState, useEffect } from 'react'

export default function JudgingScreen() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  
  const steps = [
    '🤖 AI出力を分析中...',
    '📊 ルート精度を評価中...',
    '⚖️ モデル倍率を適用中...',
    '🏆 勝者を判定中...'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1
        const stepIndex = Math.floor(newProgress / 25)
        setCurrentStep(stepIndex)
        
        if (newProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return newProgress
      })
    }, 30) // 3秒で100%

    return () => clearInterval(timer)
  }, [])

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 3, md: 6 }, 
        mb: { xs: 2, md: 4 },
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
      }}
    >
      <Typography variant={{ xs: "h5", md: "h4" }} gutterBottom color="primary">
        🔍 AI判定中...
      </Typography>
      
      <Box sx={{ my: 4 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={120}
            thickness={4}
            sx={{
              color: 'primary.main',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" component="div" color="primary">
              {Math.round(progress)}%
            </Typography>
          </Box>
        </Box>
        
        <Typography variant={{ xs: "body1", md: "h6" }} color="text.secondary" gutterBottom>
          {steps[currentStep] || steps[steps.length - 1]}
        </Typography>
        
        <Box sx={{ mt: 3, mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(45deg, #00e5ff, #ff4081)',
              },
            }}
          />
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          高精度なAIアルゴリズムで公正な判定を行っています
        </Typography>
      </Box>
    </Paper>
  )
}