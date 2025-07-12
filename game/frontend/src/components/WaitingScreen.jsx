import { Paper, Typography, LinearProgress } from '@mui/material'

export default function WaitingScreen() {
  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        対戦相手を探しています...
      </Typography>
      <LinearProgress sx={{ mt: 2 }} />
    </Paper>
  )
}