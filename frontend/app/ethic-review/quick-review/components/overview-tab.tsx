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
    if (project.projectType === "动物") {
      return "该科研项目当前进度为35%，符合预期计划。项目经费使用率为28.5%，整体于计划进度内。项目已产出3篇研究论文，包括实验设计方案、动物伦理规范与代谢机制初步分析。成果转化进展良好，已有2家制药企业表达合作意向，高于同类项目平均水平25%。"
    } else {
      return "该人体伦理研究项目当前进度为42%，符合预期计划。项目经费使用率为31.8%，整体于计划进度内。项目已完成受试者招募阶段，包括知情同意流程、基线数据收集与安全性评估。临床试验进展良好，已获得2家医疗机构合作支持，受试者依从性高于同类研究平均水平30%。"
    }
  }

  const getDefaultAiSuggestions = () => {
    if (project.projectType === "动物") {
      return [
        "加快经费使用进度，特别是设备采购和试验材料准备",
        "重点关注代谢途径与肝毒性关联研究",
        "加强与高校和研究机构合作，提高成果影响力"
      ]
    } else {
      return [
        "加强受试者随访管理，确保数据收集的完整性",
        "重点关注安全性监测，建立不良事件快速反应机制",
        "加强与临床机构合作，提高研究数据质量"
      ]
    }
  }

  const aiSummaryContent = project.aiSummary || getDefaultAiSummary()
  const aiModelName = project.aiModelName || "GPT-Scientific 2023"
  const aiModelVersion = project.aiModelVersion || "v2.4.1"
  const aiSuggestions: string[] = project.aiSuggestions || getDefaultAiSuggestions()
  const progressScore = project.progressScore || "良好"
  const riskScore = project.riskScore || "中等"
  const achievementScore = project.achievementScore || "良好"
  const confidenceScore = project.confidenceScore || 95
  const analysisTime = project.analysisTime || "2024-03-15 10:32"

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
              <div className="font-medium">{project.title || project.name || (project.projectType === "动物" ? "实验大鼠药代谢研究" : "人体生理功能干预研究")}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目编号</div>
              <div className="font-medium">{project.projectNumber || project.reviewNumber || "系统自动生成或手动输入"}</div>
            </div>
            {project.projectType === "动物" ? (
              <>
                <div>
                  <div className="text-sm text-muted-foreground">动物种系</div>
                  <div className="font-medium">{project.animalType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">动物数量</div>
                  <div className="font-medium">{project.animalCount}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">动物实施设备单位</div>
                  <div className="font-medium">{project.facilityUnit}</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-sm text-muted-foreground">研究类型</div>
                  <div className="font-medium">{project.projectType || "临床干预研究"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">参与人数</div>
                  <div className="font-medium">{project.participantCount || "120人"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">研究实施单位</div>
                  <div className="font-medium">{project.researchUnit || "临床研究中心"}</div>
                </div>
              </>
            )}
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">项目周期</div>
              <div className="font-medium">
                {formatDate(project.startDate || "2024-01-01")} 至 {formatDate(project.endDate || "2026-12-31")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目预算</div>
              <div className="font-medium">{project.budget ? `${project.budget} 元` : "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目状态</div>
              <div className="font-medium">{project.status || "进行中"}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-1">项目描述</div>
            <div className="text-sm">{project.description || (project.projectType === "动物" ? "研究药物在大鼠体内的代谢过程及其机制" : "研究生活方式干预对人体生理功能指标的影响")}</div>
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
              <div className="text-sm">{project.researchPurpose || project.description}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">研究方法</div>
              <div className="text-sm">{project.researchMethod || "暂无研究方法信息"}</div>
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
              <div className="font-medium">{project.leader?.name || project.leader}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">职称/职务</div>
              <div className="font-medium">{project.leader?.title || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">所属院系</div>
              <div className="font-medium">{project.department || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">电子邮箱</div>
              <div className="font-medium">{project.leader?.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">联系电话</div>
              <div className="font-medium">{project.leader?.phone || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">联系地址</div>
              <div className="font-medium">{project.address || "未设置"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目团队成员卡片 */}
      {project.members && project.members.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">项目团队成员</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.members.map((member: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  {/* 头像和基本信息 */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center text-sm flex-shrink-0">
                      {member.name ? member.name.charAt(0) : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{member.name || '未知'}</h4>
                      <p className="text-xs text-muted-foreground truncate">{member.title || '未设置'}</p>
                    </div>
                  </div>
                  
                  {/* 角色标签 */}
                  {member.role && (
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  )}
                  
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 