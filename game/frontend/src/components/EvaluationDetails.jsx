import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  LinearProgress, 
  List, 
  ListItem, 
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function EvaluationDetails({ evaluation, title }) {
  if (!evaluation) return null

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'success'
    if (percentage >= 60) return 'warning'
    return 'error'
  }

  return (
    <Card elevation={2} sx={{ mt: 2 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant={{ xs: "subtitle1", md: "h6" }} gutterBottom>
          {title} - 自動評価結果
        </Typography>
        
        <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
          <Typography variant={{ xs: "h5", md: "h4" }} color="primary">
            {evaluation.normalizedScore}/10
          </Typography>
          <Chip 
            label={`総合: ${evaluation.totalScore}/${evaluation.maxScore}`}
            color={getScoreColor(evaluation.totalScore, evaluation.maxScore)}
            variant="outlined"
            size="small"
          />
          {evaluation.multiplier && evaluation.multiplier !== 1.0 && (
            <Chip 
              label={`モデル倍率: ×${evaluation.multiplier}`}
              color="warning"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
        
        {evaluation.originalScore && evaluation.multiplier !== 1.0 && (
          <Box mb={2} p={1} bgcolor="rgba(255,193,7,0.1)" borderRadius={1}>
            <Typography variant="caption" color="warning.main">
              元スコア: {evaluation.originalNormalizedScore}/10 ({evaluation.originalScore}/{100}) → 
              調整後: {evaluation.normalizedScore}/10 ({evaluation.totalScore}/{evaluation.maxScore})
            </Typography>
          </Box>
        )}

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant={{ xs: "body2", md: "subtitle1" }}>詳細な評価内訳</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={{ xs: 1, md: 2 }}>
              {Object.entries(evaluation.categories).map(([key, category]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Box mb={{ xs: 1, md: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant={{ xs: "caption", md: "subtitle2" }}>
                        {getCategoryName(key)}
                      </Typography>
                      <Typography variant={{ xs: "caption", md: "body2" }} color="text.secondary">
                        {category.score}/{category.maxScore}
                      </Typography>
                    </Box>
                    
                    <LinearProgress 
                      variant="determinate" 
                      value={(category.score / category.maxScore) * 100}
                      color={getScoreColor(category.score, category.maxScore)}
                      sx={{ mb: 1 }}
                    />
                    
                    {category.items.length > 0 && (
                      <List dense>
                        {category.items.map((item, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <CheckCircleIcon 
                              color="success" 
                              sx={{ fontSize: 16, mr: 1 }} 
                            />
                            <ListItemText 
                              primary={item}
                              primaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  )
}

function getCategoryName(key) {
  const names = {
    basicInfo: '基本情報',
    routeAccuracy: 'ルート正確性', 
    timeAccuracy: '時間正確性',
    keyDetails: '重要詳細情報'
  }
  return names[key] || key
}