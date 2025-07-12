import { 
  Paper, 
  Typography, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button,
  Box,
  Chip
} from '@mui/material'
import { aiModelConfig, getModelTier, getModelMultiplier } from '../utils/modelConfig'

const aiModels = Object.keys(aiModelConfig)

export default function GameSetup({ 
  selectedModel, 
  setSelectedModel, 
  aiOutput, 
  setAiOutput, 
  onSubmit 
}) {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 2, md: 4, lg: 6 }, 
        mb: { xs: 2, md: 4 },
        maxWidth: { lg: '80%' },
        mx: 'auto'
      }}
    >
      <Typography 
        variant={{ xs: "h6", md: "h5", lg: "h4" }} 
        gutterBottom 
        align="center"
        color="primary"
        sx={{ mb: { xs: 2, md: 3, lg: 4 } }}
      >
        🚀 ルート情報を入力してバトル開始！
      </Typography>
      
      <Grid container spacing={{ xs: 2, md: 3, lg: 4 }} alignItems="stretch">
        <Grid item xs={12} lg={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom color="secondary" sx={{ mb: 2 }}>
              🤖 AIモデル選択
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ fontSize: { lg: '1.1rem' } }}>AIモデルを選択</InputLabel>
              <Select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                label="AIモデルを選択"
                sx={{ 
                  height: { lg: '60px' },
                  fontSize: { lg: '1.1rem' }
                }}
              >
              {aiModels.map((model) => {
                const config = aiModelConfig[model]
                const tier = getModelTier(model)
                const multiplier = getModelMultiplier(model)
                
                return (
                  <MenuItem key={model} value={model}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography>{model}</Typography>
                        <Chip 
                          label={tier.toUpperCase()} 
                          size="small" 
                          color={tier === 'ultra' ? 'secondary' : tier === 'premium' ? 'primary' : 'default'}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        倍率: ×{multiplier}
                      </Typography>
                    </Box>
                  </MenuItem>
                )
              })}
              </Select>
            </FormControl>
            
            {selectedModel && (
              <Box 
                p={{ xs: 2, lg: 3 }} 
                bgcolor="rgba(255,255,255,0.05)" 
                borderRadius={2}
                sx={{ flex: 1 }}
              >
                <Typography variant={{ xs: "body2", lg: "body1" }} color="text.secondary" gutterBottom>
                  {aiModelConfig[selectedModel]?.description}
                </Typography>
                <Typography variant={{ xs: "caption", lg: "body2" }} color="warning.main">
                  ⚠️ 高級モデルほど倍率が低く設定されています（バランス調整）
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom color="secondary" sx={{ mb: 2 }}>
              📝 AI出力入力
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={{ xs: 4, md: 6, lg: 10 }}
              label="AIの出力結果を貼り付けてください"
              placeholder="大崎駅からFindyオフィスまでのルートをAIに聞いた結果を貼り付けてください..."
              value={aiOutput}
              onChange={(e) => setAiOutput(e.target.value)}
              sx={{ 
                flex: 1,
                '& .MuiInputBase-root': {
                  height: '100%',
                },
                '& .MuiInputBase-input': {
                  fontSize: { lg: '1.1rem' },
                  lineHeight: { lg: 1.6 }
                }
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={onSubmit}
            disabled={!selectedModel || !aiOutput.trim()}
            fullWidth
            sx={{ 
              py: { xs: 1.5, md: 2, lg: 3 },
              fontSize: { lg: '1.2rem' },
              fontWeight: 'bold'
            }}
          >
            🚀 対戦相手を探す
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}