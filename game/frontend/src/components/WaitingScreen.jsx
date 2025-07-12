import { Paper, Typography, LinearProgress, Box } from '@mui/material'

export default function WaitingScreen() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          対戦相手を探しています...
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Paper>
    </Box>
  )
}