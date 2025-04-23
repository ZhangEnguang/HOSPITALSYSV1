"use client"

import type React from "react"
import { useState } from "react"

type AIAnalysisPanelProps = {}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = () => {
  // 模式和状态控制
  // 修改初始状态，默认为分析模式
  const [isAIAnalysisMode, setIsAIAnalysisMode] = useState(true)

  return (
    <div>
      {/* AI Analysis Panel Content */}
      {isAIAnalysisMode ? <div>AI Analysis Mode is ON</div> : <div>AI Analysis Mode is OFF</div>}
      <button onClick={() => setIsAIAnalysisMode(!isAIAnalysisMode)}>Toggle AI Analysis Mode</button>
    </div>
  )
}

export default AIAnalysisPanel

