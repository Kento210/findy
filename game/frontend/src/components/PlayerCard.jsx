import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  TextField, 
  Chip 
} from '@mui/material'

export default function PlayerCard({ 
  player, 
  title, 
  evaluation 
}) {
  return (
    <Card elevation={1} sx={{ height: 'fit-content' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
          <Chip 
            label={player.model} 
            color={title === "あなた" ? "primary" : "secondary"}
            size="small"
          />
          <Typography variant="h6">
            {title}
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          value={player.output}
          disabled
          label={`${title}のAI出力`}
          sx={{ mb: 2 }}
        />
        
        <Box display="flex" alignItems="center" justifyContent="center" p={2}>
          <Typography variant="h6" color="primary">
            最終スコア: {player.score ? `${player.score}/10` : '判定中...'}
          </Typography>
        </Box>
        
        {evaluation && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {title}のAI評価
            </Typography>
            <Typography variant="body2">
              総合スコア: {evaluation.totalScore || 0}/{evaluation.maxScore || 100}
            </Typography>
            {evaluation.multiplier && evaluation.multiplier !== 1.0 && (
              <Typography variant="caption" color="warning.main">
                モデル倍率: ×{evaluation.multiplier}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}