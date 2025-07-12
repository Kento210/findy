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

/**
 * パターンマッチングを使用してルート回答を評価する
 * @param {string} userOutput - ユーザーが入力したAI出力
 * @returns {Object} 評価結果オブジェクト
 */
function evaluateRoute(userOutput) {
  console.log('Evaluating route:', userOutput.substring(0, 100) + '...')
  
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

  // 基本情報の採点: ビル名とフロア情報の確認
  if (output.includes("アートヴィレッジ") || output.includes("アートビレッジ") || 
      output.includes("art village") || output.includes("セントラルタワー")) {
    evaluation.categories.basicInfo.score += 10
    evaluation.categories.basicInfo.items.push("正しいビル名を記載")
  }

  if (output.includes("5階") || output.includes("5f") || output.includes("5 階")) {
    evaluation.categories.basicInfo.score += 10  
    evaluation.categories.basicInfo.items.push("正しいフロア情報")
  }

  // 時間の正確性: 所要時間の記載をチェック
  const timePatterns = [/(\d+)分/, /(\d+)min/, /約(\d+)/, /(\d+)minute/]
  let timeFound = false
  
  for (const pattern of timePatterns) {
    const timeMatch = output.match(pattern)
    if (timeMatch && !timeFound) {
      timeFound = true
      const mentionedTime = parseInt(timeMatch[1])
      if (mentionedTime >= 4 && mentionedTime <= 6) {
        evaluation.categories.timeAccuracy.score += 15
        evaluation.categories.timeAccuracy.items.push("正確な所要時間（約5分）")
      } else if (mentionedTime >= 2 && mentionedTime <= 10) {
        evaluation.categories.timeAccuracy.score += 10
        evaluation.categories.timeAccuracy.items.push("おおよそ正しい所要時間")
      } else if (mentionedTime > 0) {
        evaluation.categories.timeAccuracy.score += 5
        evaluation.categories.timeAccuracy.items.push("時間情報はあるが不正確")
      }
      break
    }
  }

  // ルートの正確性: 重要なキーワードの存在確認
  const routeKeywords = [
    { word: "大崎駅", score: 8, desc: "出発地点" },
    { word: "北改札", score: 6, desc: "正しい改札口" },
    { word: "東口", score: 6, desc: "正しい出口" },
    { word: "徒歩", score: 4, desc: "移動手段" },
    { word: "直進", score: 3, desc: "方向指示" },
    { word: "左", score: 2, desc: "曲がる方向" },
    { word: "右", score: 2, desc: "曲がる方向" },
    { word: "エスカレーター", score: 4, desc: "重要な経路" },
    { word: "通路", score: 3, desc: "経路情報" }
  ]
  
  routeKeywords.forEach(item => {
    if (output.includes(item.word)) {
      evaluation.categories.routeAccuracy.score += item.score
      evaluation.categories.routeAccuracy.items.push(`${item.desc}: ${item.word}`)
    }
  })
  
  evaluation.categories.routeAccuracy.score = Math.min(evaluation.categories.routeAccuracy.score, 40)

  // 詳細情報: 追加の有用な情報をチェック
  const detailKeywords = [
    { keyword: "雨", point: 5, description: "屋内ルート情報" },
    { keyword: "エレベーター", point: 4, description: "ビル内移動手段" },
    { keyword: "受付", point: 4, description: "到着後の手続き" },
    { keyword: "findy", point: 6, description: "目的地企業名" },
    { keyword: "600m", point: 3, description: "距離情報" },
    { keyword: "メートル", point: 2, description: "距離の単位" }
  ]

  detailKeywords.forEach(item => {
    if (output.includes(item.keyword)) {
      evaluation.categories.keyDetails.score += item.point
      evaluation.categories.keyDetails.items.push(item.description)
    }
  })
  
  evaluation.categories.keyDetails.score = Math.min(evaluation.categories.keyDetails.score, 25)

  // 総合スコア計算: 各カテゴリーのスコアを合計
  evaluation.totalScore = Object.values(evaluation.categories).reduce((sum, cat) => sum + cat.score, 0)

  // 10点満点に正規化
  evaluation.normalizedScore = Math.max(1, Math.round((evaluation.totalScore / evaluation.maxScore) * 10))

  console.log('Evaluation result:', { 
    totalScore: evaluation.totalScore, 
    normalizedScore: evaluation.normalizedScore 
  })

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