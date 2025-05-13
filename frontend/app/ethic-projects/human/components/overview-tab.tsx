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
  Tag,
  Stethoscope,
  FileText,
  Bookmark,
  GraduationCap,
  BriefcaseMedical,
  UserIcon,
  CheckCircle
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

// 定义团队成员类型
interface TeamMember {
  name: string;
  title: string;
  department: string;
  role: string;
  contact: string;
}

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
  const aiSummaryContent = todo.aiSummary || "该研究项目当前进度为35%，符合预期计划。项目经费使用率为28.5%，整体于计划进度内。项目已入组42名患者，完成基线数据收集。预期结果显示饮食干预对血脂水平有积极影响。达到临床显著性标准，低密度脂蛋白胆固醇平均下降16.5%。"
  const aiModelName = todo.aiModelName || "GPT-Scientific 2023"
  const aiModelVersion = todo.aiModelVersion || "v2.4.1"
  const aiSuggestions: string[] = todo.aiSuggestions || [
    "加强患者依从性监测，特别是饮食日记记录",
    "增加中期数据分析节点，评估干预效果",
    "完善不良事件报告流程"
  ]
  const progressScore = todo.progressScore || "良好"
  const riskScore = todo.riskScore || "低"
  const achievementScore = todo.achievementScore || "良好"
  const confidenceScore = todo.confidenceScore || 95
  const analysisTime = todo.analysisTime || "2024-03-15 10:32"

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
                      <span>成果评估</span>
                      <div className="font-semibold text-sm text-slate-900">{achievementScore}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-7 text-xs text-slate-500 hover:text-slate-900"
                    onClick={() => setIsCollapsed(false)}
                  >
                    展开
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="my-3"
                >
                  <div className="mt-1 mb-4 text-sm leading-relaxed whitespace-pre-line text-slate-700">
                    {aiSummaryContent}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-slate-500">AI建议:</span>
                    {aiSuggestions.map((suggestion, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] whitespace-normal text-left"
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between mt-4 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>进度评估</span>
                          <div className="font-semibold text-sm text-slate-900">{progressScore}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>风险评估</span>
                          <div className="font-semibold text-sm text-slate-900">{riskScore}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>成果评估</span>
                          <div className="font-semibold text-sm text-slate-900">{achievementScore}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-slate-500">
                        <span>可信度:</span>{" "}
                        <span className="font-medium text-slate-700">{confidenceScore}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500">{analysisTime}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-slate-500 hover:text-slate-900"
                        onClick={() => setIsCollapsed(true)}
                      >
                        收起
                        <ChevronRight className="h-3.5 w-3.5 ml-1 rotate-90" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* 基本信息卡片 */}
      <Card className="border-slate-200 shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">项目名称</span>
              <span className="text-sm font-medium">{todo.name || "实验大鼠药代动力学研究"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">项目编号</span>
              <span className="text-sm font-medium">{todo.projectNumber || "动伦2025001"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">研究种系</span>
              <span className="text-sm font-medium">{todo.animalType || "大鼠"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">研究数量</span>
              <span className="text-sm font-medium">{todo.participantCount || "85只"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">研究实施设备单位</span>
              <span className="text-sm font-medium">{todo.researchUnit || "基础医学实验中心"}</span>
            </div>
            <div className="flex flex-col"></div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">项目周期</span>
              <span className="text-sm font-medium">
                {formatDate(todo.startDate || "2024-01-01")} 至 {formatDate(todo.endDate || "2026-12-31")}
              </span>
            </div>
            <div className="flex flex-col"></div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">项目预算</span>
              <span className="text-sm font-medium">{(todo.budget || 850000).toLocaleString()} 元</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">项目状态</span>
              <span className="text-sm font-medium">{todo.status || "进行中"}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-sm text-slate-500">项目描述</span>
              <span className="text-sm">{todo.description || "研究药物在大鼠体内的代谢过程及其机制"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 研究信息卡片 */}
      <Card className="border-slate-200 shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">研究信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-sm text-slate-500">研究目的</span>
              <p className="text-sm mt-1">{todo.researchPurpose || "研究药物在大鼠体内的代谢过程及其机制"}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500">研究方法</span>
              <p className="text-sm mt-1">{todo.researchMethod || "暂无研究方法详细信息"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 主要研究者信息卡片 */}
      <Card className="border-slate-200 shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">主要研究者信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">负责人姓名</span>
              <span className="text-sm font-medium">{todo.leader?.name || "王教授"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">职称/职务</span>
              <span className="text-sm font-medium">{todo.leader?.title || "教授"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">所属院系</span>
              <span className="text-sm font-medium">{todo.department || "基础医学院"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">电子邮箱</span>
              <span className="text-sm font-medium">{todo.leader?.email || "wang@example.com"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">联系电话</span>
              <span className="text-sm font-medium">{todo.leader?.phone || "13800000001"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">联系地址</span>
              <span className="text-sm font-medium">{todo.leaderAddress || "未设置"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目团队成员卡片 */}
      <Card className="border-slate-200 shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">项目团队成员</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(todo.members || [
              { name: "李助理", title: "研究助理", department: "基础医学院", role: "实验操作", contact: "li@example.com" },
              { name: "张技术员", title: "高级技术员", department: "基础医学院", role: "数据分析", contact: "zhang@example.com" },
              { name: "刘研究员", title: "副研究员", department: "药理学系", role: "实验设计", contact: "13800000003" }
            ]).map((member: TeamMember, index: number) => (
              <div key={index} className="flex items-start border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex-none w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-medium">{member.name.charAt(0)}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium">{member.name}</h3>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          {member.title}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">所属院系</div>
                    <div className="text-sm">{member.department}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">电子邮箱</div>
                    <div className="text-sm text-blue-600">{member.contact.includes('@') ? member.contact : ''}</div>
                    
                    {!member.contact.includes('@') && (
                      <>
                        <div className="text-xs text-slate-500 mt-2">联系电话</div>
                        <div className="text-sm">{member.contact}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 