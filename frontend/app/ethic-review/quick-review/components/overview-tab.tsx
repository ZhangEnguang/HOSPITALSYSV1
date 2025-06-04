"use client"

import { useState, useRef, useEffect } from "react"
import {
  Calendar,
  Clock,
  FileText,
  RefreshCw,
  Copy,
  ChevronRight,
  Building,
  User,
  PawPrint,
  Users,
  FileCheck,
  Tag,
  BadgeCheck,
  Info,
  Heart,
  Beaker,
  Microscope,
  Brain,
  Hourglass,
  BarChart3,
  PieChart,
  LineChart,
  LayoutGrid,
  StarIcon,
  Sparkles
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// 项目概览标签页组件
export default function EthicProjectOverviewTab({
  project
}: { 
  project: any 
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

  // 从project对象获取AI摘要内容
  const aiSummaryContent = project.aiSummary || ""
  const aiModelName = project.aiModelName || "EthicGPT 2024"
  const aiModelVersion = project.aiModelVersion || "v3.1"
  const aiSuggestions: string[] = project.aiSuggestions || [
    "完善受试者基因数据保护与匿名化方案",
    "明确CRISPR技术仅限于体外诊断用途，禁止人体基因组修饰",
    "加强实验动物福利保障措施，严格遵循3R原则",
    "建立基因信息安全泄露应急处理机制"
  ]
  const progressScore = project.progressScore || "良好"
  const riskScore = project.riskScore || "低"
  const achievementScore = project.achievementScore || "良好"
  const confidenceScore = project.confidenceScore || 95
  const analysisTime = project.analysisTime || "2024-05-18 14:30"

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

    // 添加进度条动画样式
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

  // 获取项目类型图标
  const getProjectTypeIcon = () => {
    if (project.projectType === "动物") {
      return <PawPrint className="h-4 w-4 text-blue-500 mr-2" />
    } else {
      return <User className="h-4 w-4 text-blue-500 mr-2" />
    }
  }

  // 生成项目简化摘要
  const generateProjectSummary = () => {
    const reviewType = project.reviewType || "初始审查"
    
    switch (reviewType) {
      case "初始审查":
        if (project.projectType === "动物") {
          if (project.title?.includes("转基因")) {
            return "该项目采用转基因动物模型进行研究，实验设计科学合理，动物福利保障措施完善，已通过初步审查。项目符合3R原则要求，预计能够为相关疾病研究提供重要支撑。"
          } else if (project.title?.includes("基因编辑")) {
            return "该项目采用CRISPR基因编辑技术构建动物模型，技术方案相对成熟，但需要严格评估基因编辑的安全性和有效性。动物福利保障措施需要进一步完善。"
          } else {
            return "该项目为动物实验研究，实验设计遵循3R原则，动物福利保障措施完善，风险控制方案合理，已通过形式审查阶段，整体符合伦理审查要求。"
          }
        } else if (project.projectType === "人体") {
          if (project.title?.includes("临床试验")) {
            return "该项目为人体临床试验研究，知情同意流程规范，受试者保护措施完善，数据安全保障合理，已通过初步审查。项目设计科学，预期能够为临床治疗提供重要依据。"
          } else if (project.title?.includes("基因") || project.title?.includes("遗传")) {
            return "该项目涉及基因检测和遗传信息研究，知情同意程序规范，遗传咨询支持完善，数据保护措施到位。项目设计合理，符合遗传研究伦理要求，预期能够提高疾病诊断效率。"
          } else {
            return "该项目为人体研究，知情同意程序规范，隐私保护措施完善，研究设计合理，已通过形式审查。项目风险较低，符合人体研究伦理基本要求。"
          }
        }
        break;
        
      case "人遗采集审批":
        if (project.title?.includes("儿科") || project.title?.includes("儿童")) {
          return "该项目为儿科遗传病样本采集审批，建立了专门的儿童知情同意程序，紧急采集流程设计合理，样本保存规范完善。项目充分考虑了儿童受试者的特殊保护需求。"
        } else if (project.title?.includes("家族性")) {
          return "该项目为家族性遗传病样本采集审批，建立了完善的家族成员知情同意协调机制，样本采集标准规范，遗传信息保护措施充分，符合人遗资源管理要求。"
        } else {
          return "该项目为人遗采集审批，建立了标准化的样本采集和保存流程，知情同意程序完善，遗传信息保护措施到位，符合相关法规要求。"
        }
        break;
        
      case "修正案审查":
        if (project.title?.includes("系统") || project.title?.includes("信息")) {
          return "该修正案主要涉及信息系统的优化升级，修正内容合理可行，数据安全保护措施进一步完善，对受试者权益无不良影响。修正案符合伦理要求，建议按计划实施。"
        } else {
          return "该修正案内容经过充分论证，变更具有科学依据和实际必要性，不会增加受试者风险或损害其权益。修正后的研究方案仍符合伦理要求，可以批准实施。"
        }
        break;
        
      case "国际合作科学研究审批":
        return "该国际合作项目涉及多国研究机构协作，但跨境数据传输安全保障措施不足，各国伦理审查标准差异需要进一步协调。建议完善数据共享协议和知识产权保护条款后重新审查。"
        
      case "复审":
        if (project.title?.includes("繁育")) {
          return "该复审项目针对转基因动物繁育计划，前期审查意见得到较好回应，动物福利保障措施有所改善，但繁育质量监测方案仍需进一步完善。整体改进效果良好。"
        } else {
          return "该复审项目对前期审查意见进行了认真回应，提出的改进措施具有针对性和可行性。质量控制体系得到完善，符合复审要求，建议通过审查。"
        }
        break;
        
      default:
        return "该项目已通过初步审查，研究设计合理，伦理风险控制措施适当，符合相关审查标准和伦理要求，建议进入下一审查阶段。"
    }
    
    return "该项目已通过初步审查，研究设计合理，伦理风险控制措施适当，符合相关审查标准和伦理要求。"
  }

  return (
    <div className="space-y-6">
      {/* AI智能摘要区域 */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50 border border-slate-200 shadow-sm">
        {/* 添加渐变色线条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-1 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="h-6 w-6 text-white" />
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
                      {/* 简化的AI摘要显示 - 只显示一段话总结 */}
                      <div className="mb-4">
                        <p className="text-slate-700 leading-relaxed">
                          {generateProjectSummary()}
                        </p>
                      </div>
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
                      {/* 简化的AI摘要显示 - 只显示一段话总结 */}
                      <div className="mb-4">
                        <p className="text-slate-700 leading-relaxed">
                          {generateProjectSummary()}
                        </p>
                      </div>
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
                <span>分析时间: {isAnalysisUpdated ? "2024-05-18 15:25" : analysisTime}</span>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 text-slate-500 hover:text-slate-900"
                  onClick={() => {
                    // 复制文本到剪贴板
                    navigator.clipboard.writeText(aiSummaryContent)
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

      {/* 项目基本信息区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className="text-sm text-muted-foreground">项目名称</div>
              <div className="font-medium">{project.title}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目编号</div>
              <div className="font-medium">{project.reviewNumber || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">审查类型</div>
              <div className="font-medium">{project.reviewType || "初始审查"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">伦理委员会</div>
              <div className="font-medium">{project.ethicsCommittee}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目类型</div>
              <div className="font-medium">{project.projectType}伦理</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">负责人</div>
              <div className="font-medium">{project.leader}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">所属院系</div>
              <div className="font-medium">{project.department}</div>
            </div>
            
            {project.projectType === "动物" && (
              <>
                <div>
                  <div className="text-sm text-muted-foreground">动物种系</div>
                  <div className="font-medium">{project.animalType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">动物数量</div>
                  <div className="font-medium">{project.animalCount}</div>
                </div>
              </>
            )}
            
            {project.projectType === "人体" && (
              <div>
                <div className="text-sm text-muted-foreground">参与人数</div>
                <div className="font-medium">{project.participantCount}</div>
              </div>
            )}
            
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">审核期限</div>
              <div className="font-medium">
                {project.submittedAt || "2024-05-18"} 至 {project.deadline || "2024-06-15"}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">项目状态</div>
              <div className="font-medium">{project.status || "审核中"}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-1">项目描述</div>
            <div className="text-sm">{project.description}</div>
          </div>
        </CardContent>
      </Card>
      
    
    </div>
  )
} 