import { Paper, Typography, Box, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'

/**
 * 判定中のローディング画面コンポーネント
 * パターンマッチングによる判定プロセスを視覚的に表示
 * @returns {JSX.Element} 判定ローディングコンポーネント
 */
export default function JudgingScreen() {
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(0)
  
  // 判定プロセスのステップ表示
  const steps = [
    '📊 ルート情報を解析中...',
    '🔍 キーワードをチェック中...',
    '⚖️ スコアを計算中...',
    '🏆 勝者を決定中...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const newProgress = prev + 10
        const newStep = Math.floor(newProgress / 25)
        if (newStep !== step && newStep < steps.length) {
          setStep(newStep)
        }
        return newProgress
      })
    }, 100) // 100ms間隔で滑らかなプログレスアニメーション

    return () => clearInterval(interval)
  }, [step, steps.length])

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, bgcolor: 'background.paper' }}>
        <Typography variant="h5" gutterBottom color="primary">
          🔍 判定中...
        </Typography>
        
        <Box sx={{ my: 3 }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={80}
            thickness={4}
            sx={{ mb: 2 }}
          />
          <Typography variant="h6" color="primary">
            {progress}%
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary">
          {steps[step]}
        </Typography>
        
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          高精度なパターンマッチングで判定中...
        </Typography>
      </Paper>
    </Box>
  )
}