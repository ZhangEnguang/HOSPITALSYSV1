"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

// 导入拆分后的组件
import { AIPanelContent } from "./ai-panel-content"

interface AIAnalysisPanelProps {
  mockAnalysisResult?: Record<string, any>
  filledFields?: string[]
  handleFillField?: (field: string) => void
  handleFillAll: () => void
  isPanelCollapsed?: boolean
  setIsPanelCollapsed?: (collapsed: boolean) => void
  defaultAnalysisMode?: boolean // 添加此属性
  forceOpen?: boolean // 支持强制开启面板
}

export const AIAnalysisPanel = ({
  mockAnalysisResult = {},
  filledFields = [],
  handleFillField = () => {},
  handleFillAll,
  isPanelCollapsed = false,
  setIsPanelCollapsed,
  defaultAnalysisMode = false, // 默认为false，但可通过props覆盖
  forceOpen = false,
}: AIAnalysisPanelProps) => {
  const router = useRouter()
  const [isFillingAll, setIsFillingAll] = useState(false)
  const [currentFillingIndex, setCurrentFillingIndex] = useState(-1)
  const [currentFillingField, setCurrentFillingField] = useState("")
  const [fillProgress, setFillProgress] = useState(0)
  const [fillCompleted, setFillCompleted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  // 使用ref存储取消状态，确保在异步回调中能获取最新值
  const isCancelledRef = useRef(false)
  // 使用数组存储所有定时器ID
  const timeoutIdsRef = useRef<number[]>([])

  // 在组件卸载时清除所有定时器
  useEffect(() => {
    return () => {
      clearAllTimeouts()
    }
  }, [])

  // 面板折叠状态控制
  const [internalIsPanelCollapsed, setInternalIsPanelCollapsed] = useState(false)
  const actualIsPanelCollapsed = isPanelCollapsed !== undefined ? isPanelCollapsed : internalIsPanelCollapsed
  const toggleCollapsed = (value: boolean) => {
    if (setIsPanelCollapsed) {
      setIsPanelCollapsed(value)
    } else {
      setInternalIsPanelCollapsed(value)
    }
  }

  // 模式和状态控制
  const [isAIAnalysisMode, setIsAIAnalysisMode] = useState(defaultAnalysisMode)
  const [isFillingField, setIsFillingField] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [confidence, setConfidence] = useState(92)

  // 分析状态
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [showProjectType, setShowProjectType] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  // 填充模式
  const [fillMode, setFillMode] = useState<"text" | "voice">("text")

  const verticalTextStyle = {
    writingMode: "vertical-rl" as const,
    textOrientation: "mixed" as const,
    letterSpacing: "0.05em",
  }

  // 重新上传功能 - 修改为不跳转
  const handleReupload = () => {
    // 不再跳转，而是在面板内处理
    // 这个函数的实现已经移到AIPanelContent组件中
  }

  // 清除所有定时器的函数
  const clearAllTimeouts = () => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutIdsRef.current = []
  }

  // 一键填充动画效果
  const handleFillAllWithAnimation = () => {
    // 重置取消状态
    isCancelledRef.current = false
    // 清除之前可能存在的定时器
    clearAllTimeouts()

    setIsFillingAll(true)
    setCurrentFillingIndex(0)
    setFillProgress(0)
    setFillCompleted(false)

    toast({
      title: "开始填充",
      description: "AI正在填充所有字段，请稍候...",
      duration: 2000,
    })

    // 调用父组件的填充函数
    handleFillAll()

    // 模拟字段填充的动画
    const fields = Object.keys(mockAnalysisResult)
    let index = 0

    const fillNextField = () => {
      // 如果已取消，则不继续执行
      if (isCancelledRef.current) return

      if (index < fields.length) {
        setCurrentFillingIndex(index)
        setCurrentFillingField(fields[index])
        setFillProgress(Math.floor((index / fields.length) * 100))

        // 模拟填充当前字段
        const id1 = window.setTimeout(() => {
          if (isCancelledRef.current) return
          setIsFillingField(fields[index])

          // 模拟填充完成后进入下一个字段
          const id2 = window.setTimeout(() => {
            if (isCancelledRef.current) return
            setIsFillingField(null)
            index++
            fillNextField()
          }, 300)

          timeoutIdsRef.current.push(id2)
        }, 500)

        timeoutIdsRef.current.push(id1)
      } else {
        // 所有字段填充完成
        if (!isCancelledRef.current) {
          setIsFillingAll(false)
          setCurrentFillingIndex(-1)
          setFillProgress(100)
          setFillCompleted(true)

          toast({
            title: "填充完成",
            description: `已成功填充${fields.length}个字段`,
            duration: 3000,
          })
        }
      }
    }

    // 开始填充第一个字段
    fillNextField()
  }

  // 取消填充
  const handleCancelFilling = () => {
    // 设置取消状态
    isCancelledRef.current = true
    // 清除所有定时器
    clearAllTimeouts()

    // 重置所有状态
    setIsFillingAll(false)
    setCurrentFillingIndex(-1)
    setIsFillingField(null)
    setFillProgress(0)

    toast({
      title: "已取消填充",
      description: "填充过程已停止",
      duration: 2000,
    })
  }

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

            toast({
              title: "分析完成",
              description: `AI已完成项目分析，置信度: ${newConfidence}%`,
              duration: 3000,
            })
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
    <>
      {/* 收起/展开按钮 */}
      <button
        onClick={() => toggleCollapsed(!actualIsPanelCollapsed)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "fixed z-10 flex flex-col items-center justify-center transition-all",
          actualIsPanelCollapsed
            ? "right-0 top-[calc(var(--header-height)+8rem)] h-32 w-7 text-white rounded-l-md"
            : "right-[350px] top-[calc(var(--header-height)+12rem)] h-16 w-4 text-white rounded-l-md",
          isHovering
            ? "bg-gradient-to-b from-primary/90 to-primary/70"
            : "bg-gray-400/70 hover:bg-gradient-to-b hover:from-primary/90 hover:to-primary/70",
        )}
      >
        {actualIsPanelCollapsed ? (
          <>
            <div className="flex flex-col items-center justify-center h-full w-full">
              <ChevronLeft className="h-5 w-5 mb-2" />
              <div style={verticalTextStyle} className="text-xs font-medium tracking-wider">
                智能填充
              </div>
            </div>
          </>
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {/* AI分析结果面板 */}
      <AIPanelContent
        actualIsPanelCollapsed={actualIsPanelCollapsed}
        isAIAnalysisMode={isAIAnalysisMode}
        fillMode={fillMode}
        setFillMode={setFillMode}
        isFillingAll={isFillingAll}
        fillProgress={fillProgress}
        currentFillingField={currentFillingField}
        currentFillingIndex={currentFillingIndex}
        handleCancelFilling={handleCancelFilling}
        mockAnalysisResult={mockAnalysisResult}
        hasAnalyzed={hasAnalyzed}
        isAnalyzing={isAnalyzing}
        confidence={confidence}
        showProjectType={showProjectType}
        showSuggestions={showSuggestions}
        showCompletion={showCompletion}
        handleStartAnalysis={handleStartAnalysis}
        handleReanalyze={handleReanalyze}
        filledFields={filledFields}
        handleFillField={handleFillField}
        handleFillAll={handleFillAll}
        isFillingField={isFillingField}
        fillCompleted={fillCompleted}
        handleFillAllWithAnimation={handleFillAllWithAnimation}
        handleReupload={handleReupload}
        toggleAIAnalysisMode={toggleAIAnalysisMode}
      />
    </>
  )
}

