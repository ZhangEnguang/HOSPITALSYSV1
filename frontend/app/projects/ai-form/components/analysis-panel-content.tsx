"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Check, Database, Zap, UploadCloud, Mic, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { TextRecognitionPanel } from "./text-recognition-panel"
import { VoiceInputPanel } from "./voice-input-panel"
import { AIAnalysisContent } from "./ai-analysis-content"

interface AnalysisPanelContentProps {
  mockAnalysisResult?: Record<string, any>
  filledFields?: string[]
  handleFillField?: (field: string) => void
  handleFillAll: () => void
  isPanelCollapsed: boolean
  isFillingAll: boolean
  currentFillingIndex: number
  currentFillingField: string
  fillProgress: number
  fillCompleted: boolean
  isFillingField: string | null
  handleCancelFilling: () => void
  handleReupload: () => void
  handleFillAllWithAnimation: () => void
}

export const AnalysisPanelContent = ({
  mockAnalysisResult = {},
  filledFields = [],
  handleFillField = () => {},
  handleFillAll,
  isPanelCollapsed,
  isFillingAll,
  currentFillingIndex,
  currentFillingField,
  fillProgress,
  fillCompleted,
  isFillingField,
  handleCancelFilling,
  handleReupload,
  handleFillAllWithAnimation,
}: AnalysisPanelContentProps) => {
  // 模式和状态控制
  const [isAIAnalysisMode, setIsAIAnalysisMode] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [confidence, setConfidence] = useState(92)

  // 分析状态
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [showProjectType, setShowProjectType] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  // 填充模式
  const [fillMode, setFillMode] = useState<"text" | "voice">("text")

  // 切换AI分析模式
  const toggleAIAnalysisMode = () => {
    setIsAIAnalysisMode(!isAIAnalysisMode)

    // 如果切换到分析模式，重置分析状态
    if (!isAIAnalysisMode) {
      setHasAnalyzed(false)
      setShowProjectType(false)
      setShowSuggestions(false)
      setShowCompletion(false)
    }
  }

  // 开始分析项目
  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
    setHasAnalyzed(false)
    setShowProjectType(false)
    setShowSuggestions(false)
    setShowCompletion(false)

    // 模拟分析过程
    setTimeout(() => {
      setHasAnalyzed(true)

      // 随机生成新的置信度，在85-98之间
      const newConfidence = Math.floor(Math.random() * 14) + 85
      setConfidence(newConfidence)

      // 依次显示各个分析结果
      setTimeout(() => {
        setShowProjectType(true)

        setTimeout(() => {
          setShowSuggestions(true)

          setTimeout(() => {
            setShowCompletion(true)
            setIsAnalyzing(false)
          }, 800)
        }, 800)
      }, 800)
    }, 2000)
  }

  // 重新分析项目
  const handleReanalyze = () => {
    handleStartAnalysis()
  }

  return (
    <div
      className={cn(
        "fixed right-0 top-[var(--header-height)] bottom-0 w-[350px] bg-white border-l border-muted/50 flex flex-col transition-all duration-300 overflow-hidden",
        isPanelCollapsed && "translate-x-full",
      )}
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(236, 242, 255, 0.7), rgba(245, 235, 255, 0.7), rgba(255, 235, 245, 0.7))",
      }}
    >
      {/* 彩色渐变边框 */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-400/60 via-primary/70 to-purple-400/60"></div>

      {/* 弥散的彩色背景 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 更明显的装饰元素 */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-blue-300/40 blur-2xl"></div>
        <div className="absolute bottom-40 left-10 w-56 h-56 rounded-full bg-purple-300/40 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-pink-300/40 blur-2xl"></div>
        <div className="absolute top-1/4 right-1/3 w-40 h-40 rounded-full bg-indigo-300/40 blur-2xl"></div>
      </div>

      <CardHeader className="pb-3 border-b border-muted/30 shrink-0 relative z-10 bg-white/70">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-base">
            {isAIAnalysisMode ? (
              <BrainCircuit className="h-4 w-4 mr-2 text-primary" />
            ) : (
              <Database className="h-4 w-4 mr-2 text-primary" />
            )}
            <span className="bg-gradient-to-r from-blue-600 to-red-500 text-transparent bg-clip-text">
              {isAIAnalysisMode ? "AI分析" : "AI智能填充"}
            </span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Label htmlFor="ai-mode" className="text-xs text-muted-foreground">
              {isAIAnalysisMode ? "分析" : "填充"}
            </Label>
            <Switch
              id="ai-mode"
              checked={isAIAnalysisMode}
              onCheckedChange={toggleAIAnalysisMode}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* 添加填充模式切换Tab */}
        {!isAIAnalysisMode && (
          <div className="flex mt-3 pt-2">
            <div className="w-full flex rounded-md p-1 bg-muted/20">
              <button
                onClick={() => setFillMode("text")}
                className={cn(
                  "flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  fillMode === "text"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-muted-foreground hover:text-foreground hover:bg-muted/30",
                )}
              >
                <FileText className={cn("h-3.5 w-3.5 mr-1.5", fillMode === "text" ? "text-white" : "")} />
                文本识别
              </button>
              <button
                onClick={() => setFillMode("voice")}
                className={cn(
                  "flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  fillMode === "voice"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-muted-foreground hover:text-foreground hover:bg-muted/30",
                )}
              >
                <Mic className={cn("h-3.5 w-3.5 mr-1.5", fillMode === "voice" ? "text-white" : "")} />
                语音录入
              </button>
            </div>
          </div>
        )}
      </CardHeader>

      {/* 填充进行中的蒙版 */}
      {isFillingAll && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
            <div className="text-xl font-bold text-primary">{fillProgress}%</div>
          </div>

          <h3 className="text-lg font-medium mb-2">正在填充字段</h3>
          <p className="text-sm text-muted-foreground mb-1">当前: {currentFillingField}</p>
          <p className="text-sm text-muted-foreground mb-6">
            已完成 {currentFillingIndex} / {Object.keys(mockAnalysisResult).length} 个字段
          </p>

          <Progress value={fillProgress} className="w-full h-2 mb-6" />

          <Button
            variant="outline"
            className="border-dashed border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleCancelFilling}
          >
            <X className="mr-2 h-4 w-4" />
            取消填充
          </Button>
        </div>
      )}

      <CardContent className="space-y-4 overflow-y-auto flex-grow relative z-10 bg-white/70">
        {isAIAnalysisMode ? (
          <AIAnalysisContent
            hasAnalyzed={hasAnalyzed}
            isAnalyzing={isAnalyzing}
            confidence={confidence}
            showProjectType={showProjectType}
            showSuggestions={showSuggestions}
            showCompletion={showCompletion}
            handleStartAnalysis={handleStartAnalysis}
            handleReanalyze={handleReanalyze}
          />
        ) : fillMode === "text" ? (
          <TextRecognitionPanel
            mockAnalysisResult={mockAnalysisResult}
            filledFields={filledFields}
            handleFillField={handleFillField}
            isFillingAll={isFillingAll}
            currentFillingIndex={currentFillingIndex}
            isFillingField={isFillingField}
          />
        ) : (
          <VoiceInputPanel handleFillAll={handleFillAll} />
        )}
      </CardContent>

      {/* 固定在底部的按钮区域 */}
      <div className="border-t border-muted/30 p-4 space-y-3 bg-white/80 shrink-0 relative z-10">
        {isAIAnalysisMode ? null : (
          <>
            {/* 一键填充按钮 */}
            {!fillCompleted && (
              <Button
                className={cn(
                  "w-full relative overflow-hidden transition-all duration-500",
                  filledFields.length === Object.keys(mockAnalysisResult).length
                    ? "bg-primary/90 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-primary to-red-500 hover:scale-[1.02] active:scale-[0.98]",
                )}
                onClick={handleFillAllWithAnimation}
                disabled={filledFields.length === Object.keys(mockAnalysisResult).length || isFillingField !== null}
              >
                {/* 发光效果 */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine"></div>

                <div className="relative flex items-center justify-center">
                  {filledFields.length === Object.keys(mockAnalysisResult).length ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      已全部填充
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      一键填充所有字段
                    </>
                  )}
                </div>
              </Button>
            )}

            {/* 重新上传按钮 - 始终显示，但在有识别结果时才启用 */}
            <Button
              variant="outline"
              className={cn(
                "w-full border-dashed transition-all",
                Object.keys(mockAnalysisResult).length > 0
                  ? "border-primary/70 text-primary hover:bg-primary/10"
                  : "border-muted text-muted-foreground",
              )}
              onClick={handleReupload}
              disabled={Object.keys(mockAnalysisResult).length === 0}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              重新上传文件
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

