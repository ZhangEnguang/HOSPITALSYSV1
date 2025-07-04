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
  Sparkles
} from "lucide-react"

interface ConsumableAISummaryProps {
  consumableData: any
}

export default function ConsumableAISummary({ consumableData }: ConsumableAISummaryProps) {
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
  
  // 根据耗材类型生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const category = consumableData.category || "未知类型"
    const status = consumableData.status || "充足"
    
    if (isUpdated) {
      if (category === "塑料器皿") {
        return `该${consumableData.name}是高质量塑料实验器皿，具有良好的化学稳定性和机械强度。最新分析显示，耗材库存状态为${status}，当前库存${consumableData.currentStock}${consumableData.unit}。耗材质量稳定，符合实验要求，适用于常规生物化学实验。建议保持适当库存，避免因缺货影响实验进度。使用频率较高，建议制定定期采购计划。`
      } else if (category === "移液器材") {
        return `该${consumableData.name}是精密移液实验的专用耗材，具有高精度和重现性。最新分析显示，耗材使用性能良好，当前库存状态为${status}。该类型耗材对实验准确性要求较高，建议选择知名品牌产品。使用前应检查包装完整性，确保无菌状态。库存管理应考虑有效期限制，避免过期浪费。`
      } else if (category === "培养耗材") {
        return `该${consumableData.name}是细胞培养和微生物实验的重要耗材，对无菌要求严格。最新分析显示，耗材质量稳定，当前库存${consumableData.currentStock}${consumableData.unit}，状态为${status}。建议严格控制储存环境，避免污染。该耗材在生物实验中使用频繁，需要确保充足库存以支持连续实验。`
      } else if (category === "分析耗材") {
        return `该${consumableData.name}是分析检测实验的专用耗材，对精度和稳定性要求较高。最新分析显示，耗材性能可靠，库存状态为${status}。建议定期检查耗材规格是否符合仪器要求，确保分析结果准确性。该类耗材通常为一次性使用，需要根据实验计划合理预估需求量。`
      } else if (category === "通用耗材") {
        return `该${consumableData.name}是实验室通用耗材，具有广泛的适用性和良好的性价比。最新分析显示，耗材状态良好，当前库存状态为${status}。该类耗材使用频率高，适用于多种实验场景，建议保持适当的安全库存。耗材质量稳定，用户反馈良好，是实验室的基础支撑材料。`
      } else {
        return `该${consumableData.name}是重要的实验室耗材，在各类实验中发挥重要作用。最新分析显示，耗材状态良好，库存状态为${status}，当前库存${consumableData.currentStock}${consumableData.unit}。建议按照标准操作程序使用，确保实验效果。耗材为多个实验项目提供支持，使用效率较高，用户满意度达到95%以上。`
      }
    } else {
      if (category === "塑料器皿") {
        return `该${consumableData.name}是高质量塑料实验器皿，具有良好的化学稳定性和机械强度。耗材质量稳定，适用于常规生物化学实验。当前库存状态为${status}，建议定期检查库存水平。`
      } else if (category === "移液器材") {
        return `该${consumableData.name}是精密移液实验的专用耗材，具有高精度和重现性。该类型耗材对实验准确性要求较高，使用前应检查包装完整性。当前状态为${status}，请按照说明书操作。`
      } else if (category === "培养耗材") {
        return `该${consumableData.name}是细胞培养和微生物实验的重要耗材，对无菌要求严格。耗材质量稳定，在生物实验中使用频繁。当前状态为${status}，建议注意储存条件。`
      } else if (category === "分析耗材") {
        return `该${consumableData.name}是分析检测实验的专用耗材，对精度和稳定性要求较高。耗材性能可靠，能够满足分析要求。当前状态为${status}，请查看详细信息了解更多。`
      } else if (category === "通用耗材") {
        return `该${consumableData.name}是实验室通用耗材，具有广泛的适用性和良好的性价比。该类耗材使用频率高，适用于多种实验场景。当前状态为${status}，建议保持适当库存。`
      } else {
        return `该${consumableData.name}是重要的实验室耗材，在各类实验中发挥重要作用。耗材质量稳定，性能可靠，为科研工作提供有力支持。当前状态为${status}，请查看详细信息了解更多。`
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const category = consumableData.category || "未知类型"
    const status = consumableData.status || "充足"
    
    if (isUpdated) {
      if (category === "塑料器皿") {
        return [
          "建议检查器皿完整性，避免使用有裂纹或变形的器皿",
          "定期清洁和维护，确保器皿清洁度符合实验要求",
          "建立耗材使用记录，监控消耗量和更换周期"
        ]
      } else if (category === "移液器材") {
        return [
          "使用前检查吸头密封性，确保移液精度",
          "避免反复使用一次性吸头，防止交叉污染",
          "建议定期校准移液器，确保移液准确性"
        ]
      } else if (category === "培养耗材") {
        return [
          "严格保持无菌操作环境，避免培养物污染",
          "控制储存温湿度，确保耗材性能稳定",
          "建议分批采购，避免长期储存影响质量"
        ]
      } else if (category === "分析耗材") {
        return [
          "使用前检查耗材规格是否匹配仪器要求",
          "避免重复使用一次性耗材，确保分析准确性",
          "建议建立耗材质量档案，追踪使用效果"
        ]
      } else if (category === "通用耗材") {
        return [
          "建议制定详细的耗材使用计划，优化库存管理",
          "加强耗材质量检查，确保符合实验标准",
          "定期评估供应商质量，选择可靠的供应渠道"
        ]
      } else {
        return [
          "建议制定详细的耗材使用计划，优化库存管理",
          "加强使用培训，确保操作人员正确使用耗材",
          "定期评估耗材性能，及时发现和解决质量问题"
        ]
      }
    } else {
      if (status === "充足") {
        return [
          "耗材库存充足，建议继续按规范使用",
          "优化耗材使用流程，提高实验效率",
          "加强耗材质量管理，确保实验结果可靠"
        ]
      } else if (status === "低库存") {
        return [
          "建议尽快补充库存，避免影响实验进度",
          "评估耗材使用需求，制定采购计划",
          "考虑寻找替代耗材，确保实验连续性"
        ]
      } else if (status === "缺货") {
        return [
          "紧急补充库存，联系供应商加急配送",
          "寻找替代耗材，确保实验不受影响",
          "调整实验计划，优先使用现有库存"
        ]
      } else {
        return [
          "建议详细检查耗材状态，制定相应的处理方案",
          "加强耗材日常管理，及时发现异常情况",
          "建立耗材质量监控体系，提高管理水平"
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
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
              <div className="text-xs text-slate-500 mt-2">正在分析耗材数据并生成智能洞察...</div>
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
                      <span className="font-medium">最新分析已更新 - 检测到耗材库存和状态变化</span>
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