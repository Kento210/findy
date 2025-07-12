import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  TextField, 
  Chip 
} from '@mui/material'
import EvaluationDetails from './EvaluationDetails'

export default function PlayerCard({ 
  player, 
  title, 
  evaluation 
}) {
  return (
    <Card elevation={3} sx={{ height: 'fit-content', minHeight: { lg: '600px' } }}>
      <CardContent sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
          <Chip 
            label={player.model} 
            color={title === "あなた" ? "primary" : "secondary"}
            size={window.innerWidth >= 1200 ? "medium" : "small"}
            sx={{ fontSize: { lg: '1rem' } }}
          />
          <Typography variant={{ xs: "subtitle1", md: "h6", lg: "h5" }}>
            {title}
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={{ xs: 3, md: 4, lg: 8 }}
          value={player.output}
          disabled
          label={`${title}のAI出力`}
          sx={{ 
            mb: 2,
            '& .MuiInputBase-input': {
              fontSize: { lg: '1.1rem' },
              lineHeight: { lg: 1.6 }
            }
          }}
        />
        
        <Box display="flex" alignItems="center" justifyContent="center" p={{ xs: 2, lg: 3 }}>
          <Typography variant={{ xs: "h6", md: "h5", lg: "h4" }} color="primary">
            最終スコア: {player.score ? `${player.score}/10` : '判定中...'}
          </Typography>
        </Box>
        
        {evaluation && (
          <EvaluationDetails 
            evaluation={evaluation} 
            title={`${title}のAI評価`}
          />
        )}
      </CardContent>
    </Card>
  )
}