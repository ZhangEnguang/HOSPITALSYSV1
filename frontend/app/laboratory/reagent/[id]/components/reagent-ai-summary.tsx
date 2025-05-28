"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { 
  RefreshCw, 
  ChevronRight, 
  Copy, 
  BarChart3, 
  PieChart, 
  LineChart,
  LayoutGrid,
  Beaker
} from "lucide-react"

interface ReagentAISummaryProps {
  reagentData: any
}

export default function ReagentAISummary({ reagentData }: ReagentAISummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isUpdatingAnalysis, setIsUpdatingAnalysis] = useState(false)
  const [isAnalysisUpdated, setIsAnalysisUpdated] = useState(false)
  const [hasAiWritten, setHasAiWritten] = useState(true)
  const [aiInputValue, setAiInputValue] = useState("已生成")
  
  // 处理更新分析
  const handleUpdateAnalysis = () => {
    setIsUpdatingAnalysis(true)
    
    // 模拟分析过程
    setTimeout(() => {
      setIsUpdatingAnalysis(false)
      setIsAnalysisUpdated(true)
      setHasAiWritten(true)
    }, 3000)
  }
  
  // 根据试剂类型生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const category = reagentData.category || "未知类型"
    const status = reagentData.status || "未知状态"
    const dangerLevel = reagentData.dangerLevel || "未知"
    
    if (isUpdated) {
      if (category === "有机溶剂") {
        return `该${reagentData.name}是高纯度有机溶剂，主要用于色谱分析和有机合成。最新分析显示，试剂库存状态为${status}，当前库存${reagentData.currentAmount}${reagentData.unit}，危险等级为${dangerLevel}。试剂存储条件良好，有效期至${reagentData.expiryDate}。建议加强安全防护措施，确保实验室通风良好。该试剂在HPLC分析中表现优异，分离效果稳定，是实验室重要的分析溶剂，使用频率较高，需要及时补充库存。`
      } else if (category === "无机试剂") {
        return `该${reagentData.name}是重要的无机化学试剂，具有高纯度和稳定性。最新分析显示，试剂质量稳定，当前库存状态为${status}，存储环境符合要求。危险等级为${dangerLevel}，使用时需要按照安全操作规程进行。试剂在定量分析和合成反应中发挥重要作用，建议定期检查试剂状态，确保使用安全和实验结果准确性。`
      } else if (category === "生物试剂") {
        return `该${reagentData.name}是精密生物试剂，对储存条件要求严格。最新分析显示，试剂活性稳定，当前库存${reagentData.currentAmount}${reagentData.unit}，状态为${status}。建议严格控制储存温度和湿度，避免反复冻融。该试剂在生物实验中具有高特异性和敏感性，是生物分析的关键试剂，需要专业人员操作。`
      } else {
        return `该${reagentData.name}是重要的化学试剂，在实验室中具有广泛应用。最新分析显示，试剂状态良好，库存状态为${status}，危险等级为${dangerLevel}。当前库存${reagentData.currentAmount}${reagentData.unit}，建议按照标准操作程序使用。试剂为多个实验项目提供支持，使用效率较高，安全性评估良好，用户满意度达到95%以上。`
      }
    } else {
      if (category === "有机溶剂") {
        return `该${reagentData.name}是高纯度有机溶剂，主要用于色谱分析和有机合成。试剂具有优异的纯度和稳定性，能够满足精密分析要求。当前库存状态为${status}，危险等级为${dangerLevel}，使用时需要注意安全防护。`
      } else if (category === "无机试剂") {
        return `该${reagentData.name}是重要的无机化学试剂，具有高纯度和稳定性。试剂在定量分析和化学合成中发挥重要作用。当前状态为${status}，危险等级为${dangerLevel}，请按照安全操作规程使用。`
      } else if (category === "生物试剂") {
        return `该${reagentData.name}是精密生物试剂，对储存和使用条件要求严格。试剂具有高特异性和敏感性，是生物分析的重要工具。当前状态为${status}，请严格按照说明书操作。`
      } else {
        return `该${reagentData.name}是重要的化学试剂，在实验室中具有广泛应用价值。试剂质量稳定，性能可靠，为科研工作提供有力支持。当前状态为${status}，请查看详细信息了解更多。`
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const category = reagentData.category || "未知类型"
    const status = reagentData.status || "正常"
    const dangerLevel = reagentData.dangerLevel || "低"
    
    if (isUpdated) {
      if (category === "有机溶剂") {
        return [
          "建议在通风良好的环境中使用，避免吸入有机蒸气",
          "定期检查试剂纯度，确保分析结果的准确性",
          "建立试剂使用记录，监控消耗量和使用频率"
        ]
      } else if (category === "无机试剂") {
        return [
          "严格按照安全操作规程使用，配备必要的防护设备",
          "定期校验试剂浓度，确保实验数据可靠性",
          "建议建立试剂废液处理流程，确保环保合规"
        ]
      } else if (category === "生物试剂") {
        return [
          "严格控制储存温度，避免试剂活性降低",
          "使用前充分混匀，确保试剂均匀性",
          "建议分装使用，避免反复冻融影响稳定性"
        ]
      } else {
        return [
          "建议制定详细的试剂使用计划，优化库存管理",
          "加强安全培训，确保操作人员熟练掌握使用方法",
          "定期评估试剂性能，及时发现和解决质量问题"
        ]
      }
    } else {
      if (status === "正常") {
        return [
          "试剂状态良好，建议继续按规范使用",
          "优化试剂使用流程，提高实验效率",
          "加强试剂安全管理，确保实验室安全"
        ]
      } else if (status === "低库存") {
        return [
          "建议尽快补充库存，避免影响实验进度",
          "评估试剂使用需求，制定采购计划",
          "考虑寻找替代试剂，确保实验连续性"
        ]
      } else if (status === "即将过期") {
        return [
          "建议优先使用该试剂，避免过期浪费",
          "检查试剂稳定性，确认是否仍可使用",
          "制定试剂处置方案，遵循环保要求"
        ]
      } else {
        return [
          "建议详细检查试剂状态，制定相应的处理方案",
          "加强试剂日常管理，及时发现异常情况",
          "建立试剂质量监控体系，提高管理水平"
        ]
      }
    }
  }

  // 设置进度条动画
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
  @keyframes progress {
    0% { width: 0%; }
    10% { width: 10%; }
    30% { width: 40%; }
    50% { width: 60%; }
    70% { width: 75%; }
    90% { width: 90%; }
    100% { width: 100%; }
  }
  
  .animate-progress {
    animation: progress 3s ease-in-out;
  }
`
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50 border border-slate-200 shadow-sm">
      {/* 添加渐变色线条 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <CardHeader className="pb-1 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Beaker className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span>AI智能分析</span>
                <Badge
                  variant="outline"
                  className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2 tracking-wide font-normal border border-primary/20"
                >
                  v2.4.1
                </Badge>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">AI模型: GPT-Chemical 2023</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 relative bg-white hover:bg-primary/5 border border-slate-200 shadow-sm"
            onClick={handleUpdateAnalysis}
            disabled={isUpdatingAnalysis}
          >
            {isUpdatingAnalysis ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span className="text-xs">分析中...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-xs">更新分析</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="pl-9 relative">
          {isUpdatingAnalysis && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-opacity-20 border-t-primary animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-amber-400 border-opacity-20 border-r-amber-400 animate-spin"></div>
                </div>
                <div className="text-sm font-medium text-slate-700">AI模型分析中</div>
              </div>
              <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-progress rounded-full"></div>
              </div>
              <div className="text-xs text-slate-500 mt-2">正在分析试剂数据并生成智能洞察...</div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isCollapsed ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-start gap-4 my-3 py-2"
              >
                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <div className="text-xs text-slate-600">
                    <span>库存状态</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "良好" : "正常"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                  <PieChart className="h-4 w-4 text-amber-600" />
                  <div className="text-xs text-slate-600">
                    <span>安全评估</span>
                    <div className="font-semibold text-sm text-slate-900">
                      {isAnalysisUpdated ? (
                        <>
                          安全可控 <span className="text-green-600 text-xs">✓</span>
                        </>
                      ) : (
                        "良好"
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <LineChart className="h-4 w-4 text-green-600" />
                  <div className="text-xs text-slate-600">
                    <span>质量评估</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "优秀" : "良好"}</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="prose prose-sm max-w-none text-slate-700 leading-relaxed"
              >
                {isAnalysisUpdated ? (
                  <>
                    <div className="flex items-center gap-2 mb-3 text-sm text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100">
                      <LayoutGrid className="h-4 w-4" />
                      <span className="font-medium">最新分析已更新 - 检测到试剂库存和状态变化</span>
                    </div>
                    <p>
                      {generateAISummary(true)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>库存状态</span>
                          <div className="font-semibold text-sm text-slate-900">良好</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>安全评估</span>
                          <div className="font-semibold text-sm text-slate-900">
                            安全可控 <span className="text-green-600 text-xs">✓</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>质量评估</span>
                          <div className="font-semibold text-sm text-slate-900">优秀</div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-slate-600 border-t border-slate-100 pt-2">
                      <span className="font-medium text-primary">AI建议：</span>
                      {generateAIRecommendations(true).map((recommendation, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 mt-1">
                          <ChevronRight className="h-3.5 w-3.5 text-primary" />
                          <span>{recommendation}</span>
                          <br />
                        </span>
                      ))}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      {generateAISummary(false)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>库存状态</span>
                          <div className="font-semibold text-sm text-slate-900">正常</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>安全评估</span>
                          <div className="font-semibold text-sm text-slate-900">良好</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>质量评估</span>
                          <div className="font-semibold text-sm text-slate-900">良好</div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-slate-600 border-t border-slate-100 pt-2">
                      <span className="font-medium text-primary">AI建议：</span>
                      {generateAIRecommendations(false).map((recommendation, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 mt-1">
                          <ChevronRight className="h-3.5 w-3.5 text-primary" />
                          <span>{recommendation}</span>
                          <br />
                        </span>
                      ))}
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-end items-center text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            <div className="flex-1 flex items-center gap-2">
              <div className="inline-flex h-5 items-center rounded-full border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-900">
                可信度 96%
              </div>
              <span>分析时间: {isAnalysisUpdated ? "2024-04-03 17:45" : "2024-04-01 10:35"}</span>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 text-slate-500 hover:text-slate-900"
                onClick={() => {
                  // 复制文本到剪贴板
                  navigator.clipboard.writeText(
                    generateAISummary(isAnalysisUpdated)
                  )
                  toast({
                    title: "已复制到剪贴板",
                    description: "AI智能分析内容已复制",
                    duration: 2000,
                  })
                }}
              >
                <Copy className="h-3 w-3" />
                <span>复制</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 ml-1 gap-1 text-slate-500 hover:text-slate-900"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <motion.div animate={{ rotate: isCollapsed ? 90 : -90 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="h-3 w-3" />
                </motion.div>
                <span>{isCollapsed ? "展开" : "收起"}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* 隐藏的输入框，用于控制AI按钮的显示/隐藏 */}
      <input
        type="text"
        className="hidden"
        value={aiInputValue}
        onChange={(e) => {
          setAiInputValue(e.target.value)
          if (e.target.value.trim() === "") {
            setHasAiWritten(false)
          }
        }}
      />
    </Card>
  )
} 