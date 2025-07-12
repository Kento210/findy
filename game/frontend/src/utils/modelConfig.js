// AIモデルの設定と倍率システム
export const aiModelConfig = {
  'OpenAI 4o': {
    name: 'OpenAI 4o',
    tier: 'premium',
    multiplier: 0.8, // 高級モデルは倍率が低い
    color: '#10a37f',
    description: '最新のGPT-4o モデル'
  },
  'OpenAI o3': {
    name: 'OpenAI o3',
    tier: 'ultra',
    multiplier: 0.6,
    color: '#6366f1',
    description: '革新的な推論モデル'
  },
  'OpenAI o3-pro': {
    name: 'OpenAI o3-pro',
    tier: 'ultra',
    multiplier: 0.5, // 最も高級なモデル
    color: '#8b5cf6',
    description: 'プロフェッショナル向け最高性能'
  },
  'Claude Sonnet 4': {
    name: 'Claude Sonnet 4',
    tier: 'premium',
    multiplier: 0.7,
    color: '#ff6b35',
    description: 'Anthropic最新モデル'
  },
  'Claude Opus 4': {
    name: 'Claude Opus 4',
    tier: 'ultra',
    multiplier: 0.5,
    color: '#e11d48',
    description: '最高峰の言語理解'
  }
}

export const getModelMultiplier = (modelName) => {
  return aiModelConfig[modelName]?.multiplier || 1.0
}

export const getModelTier = (modelName) => {
  return aiModelConfig[modelName]?.tier || 'standard'
}

export const getModelColor = (modelName) => {
  return aiModelConfig[modelName]?.color || '#00e5ff'
}

export const applyModelMultiplier = (score, modelName) => {
  const multiplier = getModelMultiplier(modelName)
  return Math.round(score * multiplier * 10) / 10 // 小数点1桁まで
}