const correctAnswer = {
  location: "アートヴィレッジ大崎セントラルタワー 5階",
  timeMinutes: 5,
  steps: [
    "北改札口を出て、東口方面へ向かう",
    "NewDays（コンビニ）を正面に見て右折", 
    "突き当たりを左折し、そのまま直進",
    "エスカレーターを下る",
    "降りた先、左斜め前方の通路を進む",
    "次のエスカレーターで上へ",
    "開けた場所に出たら右手前方向へ進む",
    "分岐点を左に進み、直進",
    "左手最初のビル「アートヴィレッジ大崎セントラルタワー」に到着"
  ],
  keyPoints: [
    "雨に濡れずに到着可能",
    "5階",
    "中央のエレベーター", 
    "受付のiPad",
    "Findy Blue",
    "20時以降は電話が必要"
  ],
  importantKeywords: [
    "アートヴィレッジ大崎セントラルタワー",
    "5階",
    "北改札口",
    "東口",
    "NewDays",
    "エスカレーター",
    "約5分"
  ]
}

function evaluateRoute(userOutput) {
  const evaluation = {
    totalScore: 0,
    maxScore: 100,
    details: [],
    categories: {
      basicInfo: { score: 0, maxScore: 20, items: [] },
      routeAccuracy: { score: 0, maxScore: 40, items: [] },
      timeAccuracy: { score: 0, maxScore: 15, items: [] },
      keyDetails: { score: 0, maxScore: 25, items: [] }
    }
  }

  const output = userOutput.toLowerCase()

  // 基本情報の採点
  if (output.includes("アートヴィレッジ大崎セントラルタワー") || output.includes("アートビレッジ") || output.includes("art village")) {
    evaluation.categories.basicInfo.score += 10
    evaluation.categories.basicInfo.items.push("正しいビル名を記載")
  }

  if (output.includes("5階") || output.includes("5f") || output.includes("fifth floor")) {
    evaluation.categories.basicInfo.score += 10  
    evaluation.categories.basicInfo.items.push("正しいフロア情報")
  }

  // 時間の正確性
  const timeMatch = output.match(/(\d+)分/)
  if (timeMatch) {
    const mentionedTime = parseInt(timeMatch[1])
    if (mentionedTime >= 4 && mentionedTime <= 6) {
      evaluation.categories.timeAccuracy.score += 15
      evaluation.categories.timeAccuracy.items.push("正確な所要時間（約5分）")
    } else if (mentionedTime >= 3 && mentionedTime <= 8) {
      evaluation.categories.timeAccuracy.score += 10
      evaluation.categories.timeAccuracy.items.push("おおよそ正しい所要時間")
    } else {
      evaluation.categories.timeAccuracy.score += 5
      evaluation.categories.timeAccuracy.items.push("時間情報はあるが不正確")
    }
  }

  // ルートの正確性
  let routeAccuracyScore = 0
  const routeKeywords = ["北改札", "東口", "newdays", "エスカレーター", "左折", "右折", "直進"]
  
  routeKeywords.forEach(keyword => {
    if (output.includes(keyword)) {
      routeAccuracyScore += 5
      evaluation.categories.routeAccuracy.items.push(`重要なルート情報: ${keyword}`)
    }
  })
  
  evaluation.categories.routeAccuracy.score = Math.min(routeAccuracyScore, 40)

  // 重要な詳細情報
  const detailKeywords = [
    { keyword: "雨", point: 5, description: "雨に濡れない情報" },
    { keyword: "中央", point: 5, description: "中央エレベーター情報" },
    { keyword: "ipad", point: 5, description: "受付iPad情報" },
    { keyword: "findy blue", point: 5, description: "待機場所情報" },
    { keyword: "20時", point: 5, description: "夜間アクセス情報" }
  ]

  detailKeywords.forEach(item => {
    if (output.includes(item.keyword)) {
      evaluation.categories.keyDetails.score += item.point
      evaluation.categories.keyDetails.items.push(item.description)
    }
  })

  // 総合スコア計算
  evaluation.totalScore = Object.values(evaluation.categories).reduce((sum, cat) => sum + cat.score, 0)

  // 10点満点に正規化
  evaluation.normalizedScore = Math.round((evaluation.totalScore / evaluation.maxScore) * 10)

  return evaluation
}

// AIモデルの倍率設定
const modelMultipliers = {
  'OpenAI 4o': 0.8,
  'OpenAI o3': 0.6,
  'OpenAI o3-pro': 0.5,
  'Claude Sonnet 4': 0.7,
  'Claude Opus 4': 0.5
}

function getModelMultiplier(modelName) {
  return modelMultipliers[modelName] || 1.0
}

function applyModelMultiplier(evaluation, modelName) {
  const multiplier = getModelMultiplier(modelName)
  
  const adjustedEvaluation = {
    ...evaluation,
    originalScore: evaluation.totalScore,
    originalNormalizedScore: evaluation.normalizedScore,
    totalScore: Math.round(evaluation.totalScore * multiplier),
    normalizedScore: Math.round(evaluation.normalizedScore * multiplier * 10) / 10,
    multiplier: multiplier,
    modelName: modelName
  }
  
  // 最大スコアの調整
  adjustedEvaluation.maxScore = Math.round(evaluation.maxScore * multiplier)
  
  return adjustedEvaluation
}

module.exports = { correctAnswer, evaluateRoute, applyModelMultiplier, getModelMultiplier }