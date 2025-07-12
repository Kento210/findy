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
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom align="center" color="primary" sx={{ mb: 3 }}>
        ルート情報を入力してバトル開始
      </Typography>
      
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              AIモデル選択
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>AIモデルを選択</InputLabel>
              <Select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                label="AIモデルを選択"
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
              <Box p={2} bgcolor="grey.50" borderRadius={1} sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {aiModelConfig[selectedModel]?.description}
                </Typography>
                <Typography variant="caption" color="warning.main">
                  ⚠️ 高級モデルほど倍率が低く設定されています（バランス調整）
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              AI出力入力
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="AIの出力結果を貼り付けてください"
              placeholder="大崎駅からFindyオフィスまでのルートをAIに聞いた結果を貼り付けてください..."
              value={aiOutput}
              onChange={(e) => setAiOutput(e.target.value)}
              sx={{ flex: 1 }}
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
            sx={{ py: 2 }}
          >
対戦相手を探す
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}