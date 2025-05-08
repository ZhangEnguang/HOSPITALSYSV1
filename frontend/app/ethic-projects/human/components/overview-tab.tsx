"use client"

import { useEffect, useRef, useState } from "react"
import {
  Calendar,
  Clock,
  Award,
  RefreshCw,
  Copy,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  LayoutGrid,
  StarIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { formatDateToString } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 人体伦理项目概览标签组件
export default function EthicProjectOverviewTab({
  todo,
  getPriorityColor,
}: { 
  todo: any; 
  getPriorityColor: (priority: string) => string 
}) {
  // 折线图动画的引用
  const chartRef = useRef<SVGPathElement>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  // AI分析状态
  const [isUpdatingAnalysis, setIsUpdatingAnalysis] = useState(false)
  const [isAnalysisUpdated, setIsAnalysisUpdated] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hasAiWritten, setHasAiWritten] = useState(false)
  const [aiInputValue, setAiInputValue] = useState("")

  // 从todo对象获取AI摘要内容
  const aiSummaryContent = todo.aiSummary || "该科研项目当前进度为60%，符合预期计划。项目经费使用率为58.2%，资源调配合理。已完成4个阶段的临床试验，纳入80例患者，形成了初步的疗效和安全性评估。初步数据显示药物对轻中度患者有明显改善作用，但重度患者效果有限。"
  const aiModelName = todo.aiModelName || "GPT-Scientific 2023"
  const aiModelVersion = todo.aiModelVersion || "v2.4.1"
  const aiSuggestions: string[] = todo.aiSuggestions || [
    "增加对药物作用机制的深入研究",
    "细化患者分组，优化给药方案",
    "增强对长期用药安全性的监测工作"
  ]
  const progressScore = todo.progressScore || "优秀"
  const riskScore = todo.riskScore || "中低"
  const achievementScore = todo.achievementScore || "良好"
  const confidenceScore = todo.confidenceScore || 96
  const analysisTime = todo.analysisTime || "2024-04-02 11:18"

  // 处理更新分析
  const handleUpdateAnalysis = () => {
    if (isUpdatingAnalysis) return

    setIsUpdatingAnalysis(true)
    toast({
      title: "正在更新分析",
      description: "AI正在重新分析最新项目数据...",
      duration: 2000,
    })

    // 模拟分析过程
    setTimeout(() => {
      setIsUpdatingAnalysis(false)
      setIsAnalysisUpdated(true)
      setHasAiWritten(true)
      toast({
        title: "分析完成",
        description: "AI智能摘要已更新",
        duration: 3000,
      })
    }, 3000)
  }

  // 监听元素是否在视口中，触发动画
  useEffect(() => {
    if (!chartRef.current || !chartContainerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 重置动画
            const path = chartRef.current
            if (path) {
              const length = path.getTotalLength()
              path.style.strokeDasharray = `${length}`
              path.style.strokeDashoffset = `${length}`
              path.getBoundingClientRect() // 触发重绘
              path.style.transition = "stroke-dashoffset 1.5s ease-in-out"
              path.style.strokeDashoffset = "0"
            }
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(chartContainerRef.current)

    // 添加进度条动画样式 - 移除了animation-delay-200类，避免闪动
    const style = document.createElement("style")
    style.textContent = `
  @keyframes progress {
    0% { width: 0; }
    50% { width: 70%; }
    100% { width: 100%; }
  }
  
  .animate-progress {
    animation: progress 3s ease-in-out;
  }
`
    document.head.appendChild(style)

    return () => {
      observer.disconnect()
      document.head.removeChild(style)
    }
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return formatDateToString(new Date(dateString));
    } catch (error) {
      return dateString;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colorMap: Record<string, string> = {
      "高": "bg-red-100 text-red-700 hover:bg-red-100",
      "中": "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      "低": "bg-green-100 text-green-700 hover:bg-green-100",
    };

    return (
      <Badge className={cn("font-normal py-0.5", colorMap[priority] || "bg-gray-100 text-gray-700")}>
        <StarIcon className="h-3 w-3 mr-1" />
        {priority}级
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI智能摘要区域 */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50 border border-slate-200 shadow-sm">
        {/* 添加渐变色线条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-1 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image src="/ai-icon.png" alt="AI摘要" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <span>AI摘要</span>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2 tracking-wide font-normal border border-primary/20"
                  >
                    {aiModelVersion}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">AI模型: {aiModelName}</p>
              </div>
            </div>
            {(!hasAiWritten || aiInputValue.trim() === "") && (
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
            )}
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
                <div className="text-xs text-slate-500 mt-2">正在处理项目数据并生成智能洞察...</div>
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
                      <span>进度评估</span>
                      <div className="font-semibold text-sm text-slate-900">{progressScore}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                    <PieChart className="h-4 w-4 text-amber-600" />
                    <div className="text-xs text-slate-600">
                      <span>风险评估</span>
                      <div className="font-semibold text-sm text-slate-900">{riskScore}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <LineChart className="h-4 w-4 text-green-600" />
                    <div className="text-xs text-slate-600">
                      <span>成果质量</span>
                      <div className="font-semibold text-sm text-slate-900">{achievementScore}</div>
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
                        <span className="font-medium">最新分析已更新 - 检测到项目进度变更</span>
                      </div>
                      <p>
                        该科研项目当前进度为<strong className="text-primary font-medium">62%</strong>，
                        符合预期计划。项目经费使用率为
                        <strong className="text-primary font-medium">60.5%</strong>（
                        <span className="text-green-600">↑2.3%</span>），整体于计划进度内。已完成
                        <strong className="text-primary font-medium">5个</strong>阶段的临床试验，
                        新增20例患者数据，形成了更全面的疗效和安全性评估。最新数据证实药物对轻中度患者有显著改善作用，
                        并且对部分重度患者也表现出一定疗效。
                      </p>
                      <div className="flex items-start gap-4 my-3 py-2">
                        <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          <div className="text-xs text-slate-600">
                            <span>进度评估</span>
                            <div className="font-semibold text-sm text-slate-900">{progressScore}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                          <PieChart className="h-4 w-4 text-amber-600" />
                          <div className="text-xs text-slate-600">
                            <span>风险评估</span>
                            <div className="font-semibold text-sm text-slate-900">
                              {riskScore} <span className="text-green-600 text-xs">↓</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <LineChart className="h-4 w-4 text-green-600" />
                          <div className="text-xs text-slate-600">
                            <span>成果质量</span>
                            <div className="font-semibold text-sm text-slate-900">{achievementScore}</div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-slate-600 border-t border-slate-100 pt-2">
                        <span className="font-medium text-primary">AI建议：</span>
                        {aiSuggestions.map((suggestion: string, index: number) => (
                          <span key={index} className="inline-flex items-center gap-1.5 mt-1">
                            <ChevronRight className="h-3.5 w-3.5 text-primary" />
                            <span>{suggestion}</span>
                            {index < aiSuggestions.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>{aiSummaryContent}</p>
                      <div className="flex items-start gap-4 my-3 py-2">
                        <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          <div className="text-xs text-slate-600">
                            <span>进度评估</span>
                            <div className="font-semibold text-sm text-slate-900">{progressScore}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                          <PieChart className="h-4 w-4 text-amber-600" />
                          <div className="text-xs text-slate-600">
                            <span>风险评估</span>
                            <div className="font-semibold text-sm text-slate-900">{riskScore}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <LineChart className="h-4 w-4 text-green-600" />
                          <div className="text-xs text-slate-600">
                            <span>成果质量</span>
                            <div className="font-semibold text-sm text-slate-900">{achievementScore}</div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-slate-600 border-t border-slate-100 pt-2">
                        <span className="font-medium text-primary">AI建议：</span>
                        {aiSuggestions.map((suggestion: string, index: number) => (
                          <span key={index} className="inline-flex items-center gap-1.5 mt-1">
                            <ChevronRight className="h-3.5 w-3.5 text-primary" />
                            <span>{suggestion}</span>
                            {index < aiSuggestions.length - 1 && <br />}
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
                  可信度 {confidenceScore}%
                </div>
                <span>分析时间: {isAnalysisUpdated ? "2024-05-08 16:24" : analysisTime}</span>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 text-slate-500 hover:text-slate-900"
                  onClick={() => {
                    // 复制文本到剪贴板
                    navigator.clipboard.writeText(
                      isAnalysisUpdated
                        ? `该科研项目当前进度为62%，符合预期计划。项目经费使用率为60.5%（↑2.3%），整体于计划进度内。已完成5个阶段的临床试验，新增20例患者数据，形成了更全面的疗效和安全性评估。最新数据证实药物对轻中度患者有显著改善作用，并且对部分重度患者也表现出一定疗效。`
                        : aiSummaryContent,
                    )
                    toast({
                      title: "已复制到剪贴板",
                      description: "AI智能摘要内容已复制",
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
      </Card>

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

      {/* 基本信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className="text-sm text-muted-foreground">项目名称</div>
              <div className="font-medium">{todo.name || "老年痴呆症患者实验性药物临床试验"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目编号</div>
              <div className="font-medium">{todo.projectNumber || "人伦2023003"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">参与者数量</div>
              <div className="font-medium">{todo.participantCount || "80例"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">研究设备单位</div>
              <div className="font-medium">{todo.facilityUnit || "神经内科"}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">项目周期</div>
              <div className="font-medium">
                {formatDate(todo.startDate || "2023-10-01")} 至 {formatDate(todo.endDate || "2025-10-31")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目预算</div>
              <div className="font-medium">{todo.budget ? `${todo.budget} 元` : "1,200,000 元"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目状态</div>
              <div className="font-medium">{todo.status || "进行中"}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-1">项目描述</div>
            <div className="text-sm">{todo.description || "针对老年痴呆症患者的实验性药物临床试验，评估药效与安全性"}</div>
          </div>
        </CardContent>
      </Card>

      {/* 研究信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">研究信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">研究目的</div>
              <div className="text-sm">{todo.researchPurpose || todo.description}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">研究方法</div>
              <div className="text-sm">{todo.researchMethod || "双盲随机临床试验，分对照组和实验组进行为期12个月的跟踪研究"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 主要研究者信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">主要研究者信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className="text-sm text-muted-foreground">负责人姓名</div>
              <div className="font-medium">{todo.leader?.name || "李主任"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">职称/职务</div>
              <div className="font-medium">{todo.leader?.title || "主任医师"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">所属院系</div>
              <div className="font-medium">{todo.department || "医学院"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">电子邮箱</div>
              <div className="font-medium">{todo.leader?.email || "li@example.com"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">联系电话</div>
              <div className="font-medium">{todo.leader?.phone || "13800000003"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">联系地址</div>
              <div className="font-medium">{todo.address || "北京市海淀区学院路38号"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 