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
  Building,
  Mail,
  Phone,
  Users,
  ExternalLink,
  Sparkles,
  FileText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { formatDateToString } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 初始审查项目概览标签组件
export default function EthicProjectOverviewTab({
  project,
  getPriorityColor,
}: { 
  project: any; 
  getPriorityColor?: (priority: string) => string 
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

  // 从project对象获取AI摘要内容，根据项目类型提供不同的默认内容
  const getDefaultAiSummary = () => {
    if (!project?.projectType) {
      return "项目信息暂未完善，无法生成AI分析摘要。请先完善项目基本信息。"
    }
    
    // 如果项目有具体的进度和数据，可以基于实际数据生成摘要
    const progress = project.progress || 0
    const budgetUsed = project.budgetUsed || 0
    const budget = project.budget || 0
    const usageRate = budget > 0 ? ((budgetUsed / budget) * 100).toFixed(1) : 0
    
    if (project.projectType === "动物实验") {
      return `该动物实验伦理项目当前进度为${progress}%。项目预算为${budget}元，已使用${budgetUsed}元，使用率为${usageRate}%。项目按计划稳步推进，动物福利保障措施完善，符合相关伦理规范要求。`
    } else if (project.projectType === "人体试验") {
      return `该人体试验伦理项目当前进度为${progress}%。项目预算为${budget}元，已使用${budgetUsed}元，使用率为${usageRate}%。受试者招募和知情同意程序规范，试验安全性监测到位，符合人体试验伦理要求。`
    } else {
      return `该伦理审查项目当前进度为${progress}%。项目预算为${budget}元，已使用${budgetUsed}元，使用率为${usageRate}%。项目进展符合预期，伦理合规性良好。`
    }
  }

  const getDefaultAiSuggestions = () => {
    if (!project?.projectType) {
      return ["请完善项目基本信息", "明确项目类型和研究内容", "提交必要的伦理审查文件"]
    }
    
    const suggestions = []
    
    // 基于项目状态给出建议
    if (project.status === "待审核") {
      suggestions.push("确保所有必需文件已提交完整")
      suggestions.push("关注伦理委员会审核进度")
    }
    
    if (project.projectType === "动物实验") {
      suggestions.push("严格遵守动物福利相关规定")
      suggestions.push("定期更新动物使用记录")
      suggestions.push("确保实验人员具备相应资质")
    } else if (project.projectType === "人体试验") {
      suggestions.push("加强受试者安全性监测")
      suggestions.push("确保知情同意程序规范")
      suggestions.push("建立不良事件报告机制")
    }
    
    // 基于项目进度给出建议
    const progress = project.progress || 0
    if (progress < 30) {
      suggestions.push("制定详细的项目推进计划")
    } else if (progress > 80) {
      suggestions.push("准备项目结题相关文件")
    }
    
    return suggestions.length > 0 ? suggestions : ["项目进展正常，请继续按计划执行"]
  }

  // 动态获取AI分析数据
  const aiSummaryContent = project?.aiAnalysis?.summary || getDefaultAiSummary()
  const aiModelName = project?.aiAnalysis?.modelName || "EthicsGPT"
  const aiModelVersion = project?.aiAnalysis?.modelVersion || "v1.0"
  const aiSuggestions: string[] = project?.aiAnalysis?.suggestions || getDefaultAiSuggestions()
  
  // 评分数据
  const progressScore = project?.analysis?.progressScore || (project?.progress >= 80 ? "优秀" : project?.progress >= 60 ? "良好" : project?.progress >= 40 ? "一般" : "待改进")
  const riskScore = project?.analysis?.riskScore || (project?.riskLevel === "高" ? "高风险" : project?.riskLevel === "中" ? "中等风险" : "低风险")
  const achievementScore = project?.analysis?.achievementScore || "良好"
  const confidenceScore = project?.aiAnalysis?.confidence || (project?.progress > 50 ? 85 : 70)
  const analysisTime = project?.aiAnalysis?.updatedAt || project?.updatedAt || new Date().toISOString().slice(0, 16).replace('T', ' ')

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
    if (!priority) return null;
    
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
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
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
                      <p className="text-slate-700 leading-relaxed">
                        {aiSummaryContent}
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
                      <p className="text-slate-700 leading-relaxed">
                        {aiSummaryContent}
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
                <span>分析时间: {isAnalysisUpdated ? "2024-05-08 14:52" : analysisTime}</span>
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
                        ? `该科研项目当前进度为35%，符合预期计划。项目经费使用率为31.2%（↑2.7%），整体于计划进度内。项目已产出3篇研究论文，包括实验设计方案、动物伦理规范与代谢机制初步分析。成果转化进展良好，已有2家制药企业表达合作意向，高于同类项目平均水平25%。`
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
              <div className="font-medium">{project?.title || project?.name || "未设置项目名称"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目编号</div>
              <div className="font-medium">{project?.projectNumber || project?.reviewNumber || "未分配编号"}</div>
            </div>
            {project?.projectType === "动物实验" ? (
              <>
                <div>
                  <div className="text-sm text-muted-foreground">动物种系</div>
                  <div className="font-medium">{project?.animalType || "未设置"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">动物数量</div>
                  <div className="font-medium">{project?.animalCount || "未设置"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">实验设施单位</div>
                  <div className="font-medium">{project?.facilityUnit || "未设置"}</div>
                </div>
              </>
            ) : project?.projectType === "人体试验" ? (
              <>
                <div>
                  <div className="text-sm text-muted-foreground">研究类型</div>
                  <div className="font-medium">{project?.studyType || "临床研究"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">参与人数</div>
                  <div className="font-medium">{project?.participantCount ? `${project.participantCount}人` : "未设置"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">研究执行单位</div>
                  <div className="font-medium">{project?.researchUnit || "未设置"}</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-sm text-muted-foreground">研究类型</div>
                  <div className="font-medium">{project?.projectType || "未设置"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">研究规模</div>
                  <div className="font-medium">{project?.scale || "未设置"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">研究执行单位</div>
                  <div className="font-medium">{project?.institution || "未设置"}</div>
                </div>
              </>
            )}
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">项目周期</div>
              <div className="font-medium">
                {project?.startDate ? formatDate(project.startDate) : "未设置"} 至 {project?.endDate ? formatDate(project.endDate) : "未设置"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目预算</div>
              <div className="font-medium">{project?.budget ? `${project.budget} 元` : "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目状态</div>
              <div className="font-medium">{project?.status || "未设置"}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-1">项目描述</div>
            <div className="text-sm">{project?.description || "暂无项目描述"}</div>
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
              <div className="text-sm">{project?.researchPurpose || project?.purpose || "暂无研究目的信息"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">研究方法</div>
              <div className="text-sm">{project?.researchMethod || project?.methodology || "暂无研究方法信息"}</div>
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
              <div className="font-medium">{project?.leader?.name || project?.leader || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">职称/职务</div>
              <div className="font-medium">{project?.leader?.title || project?.leaderTitle || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">所属院系</div>
              <div className="font-medium">{project?.department || project?.leader?.department || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">电子邮箱</div>
              <div className="font-medium">{project?.leader?.email || project?.contactEmail || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">联系电话</div>
              <div className="font-medium">{project?.leader?.phone || project?.contactPhone || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">联系地址</div>
              <div className="font-medium">{project?.address || project?.leader?.address || "未设置"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目团队成员卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">项目团队成员</CardTitle>
        </CardHeader>
        <CardContent>
          {project?.members && project.members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {project.members.map((member: any, index: number) => {
                // 为每个成员生成不同的头像颜色
                const avatarColors = [
                  "bg-gradient-to-r from-blue-500 to-purple-600",
                  "bg-gradient-to-r from-green-500 to-blue-500", 
                  "bg-gradient-to-r from-purple-500 to-pink-500",
                  "bg-gradient-to-r from-yellow-500 to-orange-500",
                  "bg-gradient-to-r from-red-500 to-pink-500",
                  "bg-gradient-to-r from-indigo-500 to-blue-500",
                  "bg-gradient-to-r from-teal-500 to-green-500",
                  "bg-gradient-to-r from-orange-500 to-red-500"
                ]
                const avatarColor = avatarColors[index % avatarColors.length]
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                    {/* 头像和基本信息 */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`h-10 w-10 rounded-full ${avatarColor} text-white font-semibold flex items-center justify-center text-sm flex-shrink-0`}>
                        {member.name ? member.name.charAt(0) : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{member.name || '未知'}</h4>
                        <p className="text-xs text-muted-foreground truncate">{member.title || member.role || '未设置'}</p>
                      </div>
                    </div>
                    
                    {/* 详细信息 */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">部门：</span>
                        <span className="font-medium">{member.department || '未设置'}</span>
                      </div>
                      
                      {member.email && (
                        <div>
                          <span className="text-muted-foreground">邮箱：</span>
                          <a href={`mailto:${member.email}`} className="font-medium text-blue-600 hover:text-blue-800 break-all">
                            {member.email}
                          </a>
                        </div>
                      )}
                      
                      {member.phone && (
                        <div>
                          <span className="text-muted-foreground">电话：</span>
                          <a href={`tel:${member.phone}`} className="font-medium text-blue-600 hover:text-blue-800">
                            {member.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )
                              })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">暂无团队成员信息</p>
                <p className="text-sm mt-1">请在项目设置中添加团队成员</p>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
} 