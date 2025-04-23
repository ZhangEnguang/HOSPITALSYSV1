"use client"

// 修改 AIAssistant 组件，添加统计视图功能
// 当没有选中项目时，显示AI建议统计信息

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  AlertCircle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { extendedTodoItems } from "../data/mock-data"

// 在组件顶部添加 pinnedItemId 参数
interface AIAssistantProps {
  selectedItem: any
  activeTab: string
  selectedItems: number[]
  extendedCompletedItems?: any[]
  pinnedItemId?: number | null
}

export default function AIAssistant({
  selectedItem,
  activeTab,
  selectedItems,
  extendedCompletedItems = [],
  pinnedItemId = null,
}: AIAssistantProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [batchAnalysis, setBatchAnalysis] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
  const [progressValues, setProgressValues] = useState({ materials: 0, budget: 0, compliance: 0 })

  // 计算AI建议统计数据
  const [aiSuggestionStats, setAiSuggestionStats] = useState<any>(null)

  useEffect(() => {
    // 只在待审核标签页中计算
    if (activeTab === "pending") {
      // 筛选待审核项目
      const pendingItems = extendedTodoItems.filter((item) => item.status === "待审核")

      // 统计各类AI建议数量
      const stats = {
        approve: 0,
        reject: 0,
        manual: 0,
        total: pendingItems.length,
      }

      pendingItems.forEach((item) => {
        if (item.aiSuggestion === "approve") stats.approve++
        else if (item.aiSuggestion === "reject") stats.reject++
        else stats.manual++
      })

      setAiSuggestionStats(stats)
    } else {
      setAiSuggestionStats(null)
    }
  }, [activeTab])

  // 修改组件加载时触发分析的useEffect，添加更丝滑的进度条动画
  // 组件加载时触发分析
  useEffect(() => {
    if (selectedItems.length <= 1 && activeTab === "pending") {
      // 当选择新项目时，显示分析动画
      setIsAnalyzing(true)
      setShowResults(false) // 重置动画状态
      setProgressValues({ materials: 0, budget: 0, compliance: 0 }) // 重置进度条

      // 设置分析延迟时间 - 如果是钉住的项目，减少延迟
      const analysisDelay = pinnedItemId ? 800 : 2000

      // 在分析过程中，模拟进度条增长
      const progressInterval = setInterval(() => {
        setProgressValues((prev) => {
          // 随机增加一些进度，但不超过最终值的80%
          const randomIncrement = Math.random() * 5
          return {
            materials: Math.min(prev.materials + randomIncrement, 70),
            budget: Math.min(prev.budget + randomIncrement * 0.8, 50),
            compliance: Math.min(prev.compliance + randomIncrement * 1.2, 75),
          }
        })
      }, 200)

      const timer = setTimeout(() => {
        clearInterval(progressInterval)
        setIsAnalyzing(false)
        // 分析完成后显示结果并触发动画
        setTimeout(() => {
          setShowResults(true)
          // 启动进度条动画
          animateProgressBars()
        }, 100)
      }, analysisDelay)

      return () => {
        clearTimeout(timer)
        clearInterval(progressInterval)
      }
    } else if (selectedItems.length > 1) {
      // 批量分析
      setIsAnalyzing(true)
      setShowResults(false) // 重置动画状态
      const timer = setTimeout(() => {
        // 模拟批量分析结果
        const approveCount = Math.floor(selectedItems.length * 0.6)
        const rejectCount = Math.floor(selectedItems.length * 0.3)
        const reviewCount = selectedItems.length - approveCount - rejectCount

        setBatchAnalysis({
          total: selectedItems.length,
          approve: {
            count: approveCount,
            percentage: Math.round((approveCount / selectedItems.length) * 100),
          },
          reject: {
            count: rejectCount,
            percentage: Math.round((rejectCount / selectedItems.length) * 100),
          },
          review: {
            count: reviewCount,
            percentage: Math.round((reviewCount / selectedItems.length) * 100),
          },
          issues: [
            { type: "材料不完整", count: Math.floor(selectedItems.length * 0.4) },
            { type: "预算超限", count: Math.floor(selectedItems.length * 0.25) },
            { type: "格式错误", count: Math.floor(selectedItems.length * 0.2) },
            { type: "其他问题", count: Math.floor(selectedItems.length * 0.15) },
          ],
        })
        setIsAnalyzing(false)
        // 分析完成后显示结果并触发动画
        setTimeout(() => {
          setShowResults(true)
        }, 100)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [selectedItem, selectedItems, activeTab, pinnedItemId])

  // 修改进度条动画函数，使其更加丝滑
  // 进度条动画函数
  const animateProgressBars = () => {
    // 目标值
    const targetValues = { materials: 85, budget: 65, compliance: 92 }
    // 动画持续时间（毫秒）
    const duration = 1500
    // 动画帧数
    const frames = 60
    // 每帧时间
    const frameTime = duration / frames
    // 当前帧
    let currentFrame = 0

    // 动画函数
    const animate = () => {
      currentFrame++
      const progress = currentFrame / frames

      // 计算当前值（使用更平滑的缓动函数）
      const easeOutElastic = (t) => {
        const p = 0.3
        return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
      }

      const easedProgress = easeOutElastic(progress)

      setProgressValues({
        materials: Math.round(targetValues.materials * easedProgress),
        budget: Math.round(targetValues.budget * easedProgress),
        compliance: Math.round(targetValues.compliance * easedProgress),
      })

      // 继续动画或结束
      if (currentFrame < frames) {
        setTimeout(animate, frameTime)
      }
    }

    // 启动动画
    setTimeout(animate, 500) // 延迟500ms开始，与卡片动画错开
  }

  // 添加动画样式
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .result-card {
    opacity: 0;
    transform: translateY(15px);
  }
  
  .result-card.animate {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .result-card.animate:nth-child(1) {
    animation-delay: 0.1s;
  }
  
  .result-card.animate:nth-child(2) {
    animation-delay: 0.25s;
  }
  
  .result-card.animate:nth-child(3) {
    animation-delay: 0.4s;
  }

  /* 增强的分析动画 */
  @keyframes pulse {
    0% {
      transform: scale(0.85);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(0.85);
      opacity: 0.6;
    }
  }
  
  .analysis-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: hsl(var(--primary));
    display: inline-block;
    margin: 0 3px;
    box-shadow: 0 0 8px rgba(var(--primary-rgb), 0.5);
  }
  
  .analysis-dot:nth-child(1) {
    animation: pulse 1.2s ease-in-out infinite;
  }
  
  .analysis-dot:nth-child(2) {
    animation: pulse 1.2s ease-in-out 0.4s infinite;
  }
  
  .analysis-dot:nth-child(3) {
    animation: pulse 1.2s ease-in-out 0.8s infinite;
  }
  
  /* 增强的扫描效果 */
  @keyframes scan {
    0% {
      background-position: -200% 0;
      opacity: 0.3;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      background-position: 300% 0;
      opacity: 0.3;
    }
  }
  
  .scanning-effect {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
  }
  
  .scanning-effect::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(var(--primary-rgb), 0) 0%, 
      rgba(var(--primary-rgb), 0.3) 50%, 
      rgba(var(--primary-rgb), 0) 100%);
    background-size: 50% 100%;
    background-repeat: no-repeat;
    animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    pointer-events: none;
    z-index: 10;
  }
  
  /* 增强的进度条动画 */
  .analysis-progress-bar {
    height: 6px;
    background-color: hsl(var(--muted));
    border-radius: 3px;
    overflow: hidden;
    margin: 12px 0;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .analysis-progress-bar-inner {
    height: 100%;
    background: linear-gradient(90deg, 
      hsl(var(--primary)) 0%, 
      hsl(var(--primary)/0.8) 100%);
    border-radius: 3px;
    transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5);
  }
  
  /* 增强的骨架屏动画 */
  @keyframes shimmer {
    0% {
      background-position: -1200px 0;
    }
    100% {
      background-position: 1200px 0;
    }
  }
  
  .analysis-skeleton {
    background: linear-gradient(90deg, 
      hsl(var(--muted)) 0%, 
      hsl(var(--muted-foreground)/0.3) 40%, 
      hsl(var(--muted)) 80%);
    background-size: 1200px 100%;
    animation: shimmer 2s infinite linear;
    border-radius: 6px;
    height: 18px;
    margin-bottom: 10px;
  }
  
  .analysis-skeleton.short {
    width: 60%;
  }
  
  .analysis-skeleton.medium {
    width: 80%;
  }
  
  .analysis-skeleton.long {
    width: 100%;
  }
  
  /* 旋转动画 */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .spin-animation {
    animation: spin 2s linear infinite;
  }
  
  /* 脉冲光环效果 */
  @keyframes pulse-ring {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  
  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid hsl(var(--primary));
    animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
  }
  
  /* 数据流动画 */
  @keyframes data-flow {
    0% {
      height: 10%;
      opacity: 0;
    }
    20% {
      opacity: 0.8;
    }
    100% {
      height: 100%;
      opacity: 0;
    }
  }
  
  .data-flow-container {
    position: relative;
    width: 100%;
    height: 60px;
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  
  .data-flow-bar {
    width: 4px;
    background-color: hsl(var(--primary)/0.7);
    border-radius: 2px;
    height: 10%;
    opacity: 0;
  }
  
  .data-flow-bar:nth-child(1) { animation: data-flow 1.2s ease-in-out 0.1s infinite; }
  .data-flow-bar:nth-child(2) { animation: data-flow 1.7s ease-in-out 0.2s infinite; }
  .data-flow-bar:nth-child(3) { animation: data-flow 1.4s ease-in-out 0.3s infinite; }
  .data-flow-bar:nth-child(4) { animation: data-flow 1.9s ease-in-out 0.4s infinite; }
  .data-flow-bar:nth-child(5) { animation: data-flow 1.3s ease-in-out 0.5s infinite; }
  .data-flow-bar:nth-child(6) { animation: data-flow 1.8s ease-in-out 0.6s infinite; }
  .data-flow-bar:nth-child(7) { animation: data-flow 1.5s ease-in-out 0.7s infinite; }
  .data-flow-bar:nth-child(8) { animation: data-flow 1.6s ease-in-out 0.8s infinite; }
`
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // 如果是已完成标签页，显示不同的内容
  if (activeTab === "completed") {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">AI审核助手</CardTitle>
          <CardDescription>查看已完成项目的审核历史</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedItem ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  已审核
                </Badge>
                <span className="text-sm text-muted-foreground">
                  由 {selectedItem.reviewer || "系统"} 于 {selectedItem.reviewedAt || "2023-05-15"} 审核
                </span>
              </div>

              <div className="border rounded-lg p-3 bg-slate-50">
                <h3 className="font-medium mb-2">审核意见</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedItem.reviewComment || "该项目符合要求，审核通过。文档齐全，内容符合规范，可以进入下一阶段。"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">选择一个已审核项目</h3>
              <p className="text-sm text-muted-foreground">点击或悬停在列表中的项目上，查看详细的审核历史</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // 如果有选中项目，显示该项目的AI建议
  if (selectedItem && activeTab !== "completed" && selectedItems.length <= 1) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">AI审核助手</CardTitle>
          <CardDescription>AI辅助审核建议</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="suggestion">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="suggestion" className="flex-1">
                审核建议
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex-1">
                风险分析
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestion" className="space-y-4">
              {/* 根据AI建议显示不同的标签 */}
              <div className="flex items-center gap-2">
                {selectedItem.aiSuggestion === "approve" ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    建议通过
                  </Badge>
                ) : selectedItem.aiSuggestion === "reject" ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    建议退回
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                    <HelpCircle className="h-3 w-3 mr-1" />
                    建议人工审核
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">AI置信度: 87%</span>
              </div>

              <div className="border rounded-lg p-3 bg-slate-50">
                <h3 className="font-medium mb-2">审核意见</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedItem.aiSuggestion === "approve"
                    ? "该项目符合要求，建议通过。文档齐全，内容符合规范，可以进入下一阶段。"
                    : selectedItem.aiSuggestion === "reject"
                      ? "该项目存在问题，建议退回。主要问题：1. 预算超出限额；2. 缺少必要的支持文档；3. 时间安排不合理。"
                      : "该项目需要人工审核。存在一些边缘情况：1. 预算接近上限；2. 项目类型较为特殊；3. 有特殊申请说明需要人工判断。"}
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <h3 className="font-medium mb-2">关键点检查</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>文档完整性检查</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>预算合规性检查</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {selectedItem.aiSuggestion === "reject" || selectedItem.aiSuggestion === "manual" ? (
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                    <span>时间安排合理性检查</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {selectedItem.aiSuggestion === "reject" ? (
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    ) : selectedItem.aiSuggestion === "manual" ? (
                      <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                    <span>内容规范性检查</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="space-y-4">
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-2">风险评估</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          selectedItem.aiSuggestion === "approve"
                            ? "bg-green-500 w-[25%]"
                            : selectedItem.aiSuggestion === "reject"
                              ? "bg-red-500 w-[75%]"
                              : "bg-amber-500 w-[50%]"
                        }`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {selectedItem.aiSuggestion === "approve"
                        ? "低风险"
                        : selectedItem.aiSuggestion === "reject"
                          ? "高风险"
                          : "中等风险"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.aiSuggestion === "approve"
                      ? "该项目风险较低，符合审核标准。"
                      : selectedItem.aiSuggestion === "reject"
                        ? "该项目存在较高风险，建议仔细审核。"
                        : "该项目存在一定风险，需要人工判断。"}
                  </p>
                </div>

                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-2">相似案例</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-slate-200 flex-shrink-0 mt-1"></div>
                      <div>
                        <p className="font-medium">项目 #12345</p>
                        <p className="text-muted-foreground">
                          {selectedItem.aiSuggestion === "approve"
                            ? "类似项目，已通过审核"
                            : selectedItem.aiSuggestion === "reject"
                              ? "类似项目，被退回修改"
                              : "类似项目，经人工审核后通过"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-slate-200 flex-shrink-0 mt-1"></div>
                      <div>
                        <p className="font-medium">项目 #67890</p>
                        <p className="text-muted-foreground">
                          {selectedItem.aiSuggestion === "approve"
                            ? "类似预算结构，已通过审核"
                            : selectedItem.aiSuggestion === "reject"
                              ? "类似问题项目，被退回修改"
                              : "类似边缘情况，需人工判断"}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  // 如果没有选中项目，显示AI建议统计信息
  if (!selectedItem && selectedItems.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">AI审核建议统计</CardTitle>
          <CardDescription>初步AI审核结果分布</CardDescription>
        </CardHeader>
        <CardContent>
          {aiSuggestionStats ? (
            <div className="space-y-6">
              {/* 总体统计信息 */}
              <div className="text-center p-4 border rounded-lg bg-slate-50">
                <BarChart2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium">待审核项目总数</h3>
                <p className="text-2xl font-bold">{aiSuggestionStats.total}</p>
              </div>

              {/* 建议类型分布 */}
              <div className="space-y-4">
                {/* 建议通过 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ThumbsUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">建议通过</span>
                      <span className="text-sm font-semibold">{aiSuggestionStats.approve}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(aiSuggestionStats.approve / aiSuggestionStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* 建议退回 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <ThumbsDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">建议退回</span>
                      <span className="text-sm font-semibold">{aiSuggestionStats.reject}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(aiSuggestionStats.reject / aiSuggestionStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* 建议人工审核 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">建议人工审核</span>
                      <span className="text-sm font-semibold">{aiSuggestionStats.manual}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${(aiSuggestionStats.manual / aiSuggestionStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 提示信息 */}
              <div className="text-center text-sm text-muted-foreground mt-6">
                <p>悬停在列表项上查看详细的AI审核建议</p>
                <p className="mt-1">选择多个项目可进行批量操作</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">无可用数据</h3>
              <p className="text-sm text-muted-foreground">切换到待审核标签页查看AI审核建议</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // 如果选中了多个项目，显示批量分析
  if (selectedItems.length > 1) {
    return (
      <Card className="h-full bg-white border">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Bot className="h-4 w-4 text-primary" />
            AI批量审核建议
            <Badge className="ml-auto text-xs font-normal bg-slate-100 text-slate-700 hover:bg-slate-200 px-2">
              {selectedItems.length}个项目
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-[300px] scanning-effect">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring" style={{ animationDelay: "0.5s" }}></div>
              </div>

              <p className="text-base font-medium text-slate-700 mb-4">正在批量分析 {selectedItems.length} 个项目</p>
              <div className="flex items-center justify-center mb-6">
                <span className="analysis-dot"></span>
                <span className="analysis-dot"></span>
                <span className="analysis-dot"></span>
              </div>

              <div className="w-full max-w-sm mt-2 px-4">
                <div className="analysis-progress-bar">
                  <div
                    className="analysis-progress-bar-inner"
                    style={{
                      width: `${Math.floor(30 + Math.random() * 50)}%`,
                      transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  ></div>
                </div>

                <div className="data-flow-container">
                  <div className="data-flow-bar"></div>
                  <div className="data-flow-bar"></div>
                  <div className="data-flow-bar"></div>
                  <div className="data-flow-bar"></div>
                  <div className="data-flow-bar"></div>
                  <div className="data-flow-bar"></div>
                  <div className="data-flow-bar"></div>
                  <div className="data-flow-bar"></div>
                </div>

                <div className="analysis-skeleton short"></div>
                <div className="analysis-skeleton medium"></div>
                <div className="analysis-skeleton long"></div>
              </div>
            </div>
          ) : batchAnalysis ? (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`flex flex-col items-center p-3 rounded-lg border border-slate-200 bg-slate-50 result-card ${showResults ? "animate" : ""}`}
                >
                  <div className="text-xl font-bold text-slate-700 mb-1">{batchAnalysis.approve.count}</div>
                  <div className="text-xs text-slate-600">建议通过</div>
                </div>

                <div
                  className={`flex flex-col items-center p-3 rounded-lg border border-red-200 bg-red-50 result-card ${showResults ? "animate" : ""}`}
                >
                  <div className="text-xl font-bold text-red-600 mb-1">{batchAnalysis.reject.count}</div>
                  <div className="text-xs text-red-600">建议退回</div>
                </div>

                <div
                  className={`flex flex-col items-center p-3 rounded-lg border border-slate-200 bg-slate-50 result-card ${showResults ? "animate" : ""}`}
                >
                  <div className="text-xl font-bold text-slate-700 mb-1">{batchAnalysis.review.count}</div>
                  <div className="text-xs text-slate-600">需人工审核</div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg bg-slate-50 border border-slate-200 result-card ${showResults ? "animate" : ""}`}
              >
                <h3 className="text-sm font-medium mb-3 text-slate-700">批量操作建议</h3>
                <div className="space-y-2.5 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-500 mt-0.5" />
                    <p>
                      建议对符合标准的 <span className="font-medium">{batchAnalysis.approve.count}</span>{" "}
                      个项目进行批量通过操作
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <p>
                      建议对存在问题的 <span className="font-medium text-red-600">{batchAnalysis.reject.count}</span>{" "}
                      个项目进行批量退回
                    </p>
                  </div>
                  {batchAnalysis.review.count > 0 && (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-slate-500 mt-0.5" />
                      <p>
                        有 <span className="font-medium">{batchAnalysis.review.count}</span> 个项目需要进一步人工审核
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-8 w-8 text-slate-400 mb-4" />
              <p className="text-sm text-slate-600">无法加载批量分析结果</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // 单个项目的分析
  return (
    <Card className="h-full bg-white border">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Bot className="h-4 w-4 text-primary" />
          AI审核助手
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-[300px] scanning-effect">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
              <div className="pulse-ring"></div>
              <div className="pulse-ring" style={{ animationDelay: "0.5s" }}></div>
            </div>

            <p className="text-base font-medium text-slate-700 mb-4">正在分析项目内容</p>
            <div className="flex items-center justify-center mb-6">
              <span className="analysis-dot"></span>
              <span className="analysis-dot"></span>
              <span className="analysis-dot"></span>
            </div>

            <div className="w-full max-w-sm mt-2 px-4">
              <div className="analysis-progress-bar">
                <div
                  className="analysis-progress-bar-inner"
                  style={{
                    width: `${Math.floor(30 + Math.random() * 50)}%`,
                    transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                ></div>
              </div>

              <div className="data-flow-container">
                <div className="data-flow-bar"></div>
                <div className="data-flow-bar"></div>
                <div className="data-flow-bar"></div>
                <div className="data-flow-bar"></div>
                <div className="data-flow-bar"></div>
                <div className="data-flow-bar"></div>
                <div className="data-flow-bar"></div>
                <div className="data-flow-bar"></div>
              </div>

              <div className="analysis-skeleton short"></div>
              <div className="analysis-skeleton medium"></div>
              <div className="analysis-skeleton long"></div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "completed" && selectedItem && (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg bg-slate-50 border border-slate-200 result-card ${showResults ? "animate" : ""}`}
                >
                  <h4 className="text-sm font-medium mb-2 text-slate-700">审核历史摘要</h4>
                  <p className="text-sm text-slate-600">
                    该项目于 {selectedItem.completedAt} 完成审核，状态为
                    <span
                      className={`font-medium ${selectedItem.status === "已通过" ? "text-slate-700" : "text-red-600"} ml-1`}
                    >
                      {selectedItem.status}
                    </span>
                  </p>
                  {selectedItem.comments && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <h5 className="text-sm font-medium mb-1 text-slate-700">审核意见</h5>
                      <p className="text-sm text-slate-600">{selectedItem.comments}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab !== "completed" && (
              <div className="space-y-5">
                {/* 主要建议区域 */}
                <div
                  className={`p-4 rounded-lg result-card ${showResults ? "animate" : ""} ${
                    selectedItem?.aiSuggestion === "通过"
                      ? "bg-slate-50 border border-slate-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {selectedItem?.aiSuggestion === "通过" ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <h3
                      className={`text-base font-medium ${
                        selectedItem?.aiSuggestion === "通过" ? "text-slate-700" : "text-red-700"
                      }`}
                    >
                      {selectedItem?.aiSuggestion === "通过" ? "建议通过审核" : "建议退回修改"}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700 ml-8">
                    {selectedItem?.aiSuggestion === "通过"
                      ? "该项目材料基本完整，符合审核标准，建议通过。"
                      : "该项目存在一些问题需要申请人修正，建议退回修改。"}
                  </p>
                </div>

                {/* 审核意见建议 */}
                <div
                  className={`p-4 rounded-lg border border-slate-200 bg-slate-50 result-card ${showResults ? "animate" : ""}`}
                >
                  <h3 className="text-sm font-medium text-slate-700 mb-2">审核意见建议</h3>
                  <p className="text-sm text-slate-600">
                    {selectedItem?.aiSuggestion === "通过"
                      ? "项目申请材料完整，内容合规。建议通过审核，但提醒申请人注意控制预算支出，确保不超出季度限额。"
                      : "项目预算超出部门季度限额15%，且缺少详细的实施计划时间表。请申请人调整预算至限额内或提供特殊申请说明，并补充详细的实施计划时间表后重新提交。"}
                  </p>
                </div>

                {/* 详细分析区域 */}
                <div className={`result-card ${showResults ? "animate" : ""}`}>
                  <h4 className="text-sm font-medium text-slate-700 mb-3 pb-2 border-b border-slate-200">详细分析</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <h5 className="text-sm font-medium text-slate-700">材料完整性</h5>
                        </div>
                        <span className="text-xs font-medium text-primary">{progressValues.materials}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progressValues.materials}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        申请材料基本完整，包含必要的申请表、预算表和实施计划。
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                          <h5 className="text-sm font-medium text-amber-700">预算合理性</h5>
                        </div>
                        <span className="text-xs font-medium text-amber-500">{progressValues.budget}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progressValues.budget}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        预算总额超出部门季度限额，建议申请人调整预算或提供特殊申请说明。
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <h5 className="text-sm font-medium text-slate-700">合规性</h5>
                        </div>
                        <span className="text-xs font-medium text-primary">{progressValues.compliance}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progressValues.compliance}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">项目内容符合部门业务范围和发展规划，无合规性问题。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

