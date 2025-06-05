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

// 动物伦理项目概览标签组件
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
  const aiSummaryContent = todo.aiSummary || "该科研项目当前进度为35%，符合预期计划。项目经费使用率为28.5%，整体于计划进度内。项目已产出3篇研究论文，包括实验设计方案、动物伦理规范与代谢机制初步分析。成果转化进展良好，已有2家制药企业表达合作意向，高于同类项目平均水平25%。"
  const aiModelName = todo.aiModelName || "GPT-Scientific 2023"
  const aiModelVersion = todo.aiModelVersion || "v2.4.1"
  const aiSuggestions: string[] = todo.aiSuggestions || [
    "加快经费使用进度，特别是设备采购和试验材料准备",
    "重点关注代谢途径与肝毒性关联研究",
    "加强与高校和研究机构合作，提高成果影响力"
  ]
  const progressScore = todo.progressScore || "良好"
  const riskScore = todo.riskScore || "中等"
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
                      <p className="whitespace-pre-line">
                        {aiSummaryContent.split('\n\n').map((paragraph: string, idx: number) => {
                          // 检查段落是否包含【】标题
                          if (paragraph.includes('【') && paragraph.includes('】')) {
                            const titleMatch = paragraph.match(/【(.+?)】/);
                            const title = titleMatch ? titleMatch[1] : '';
                            const content = paragraph.replace(/【(.+?)】/, '');
                            
                            // 检查内容是否包含列表项（以"•"开头的行）
                            const hasListItems = content.includes('\n•');
                            
                            if (hasListItems) {
                              // 处理包含列表项的内容
                              const listItems = content.split('\n').filter((line: string) => line.trim().length > 0);
                              
                              return (
                                <div key={idx} className="mb-4">
                                  <h4 className="text-sm font-semibold text-blue-700 bg-blue-50 py-1 px-2 rounded mb-2">
                                    {title}
                                  </h4>
                                  <ul className="pl-1 space-y-1">
                                    {listItems.map((item: string, itemIdx: number) => (
                                      <li key={itemIdx} className={`pl-5 relative ${item.startsWith('•') ? 'text-slate-700' : 'text-slate-600'}`}>
                                        {item.startsWith('•') ? (
                                          <>
                                            <span className="absolute left-0 text-blue-500">•</span>
                                            {item.substring(1).trim()}
                                          </>
                                        ) : item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            } else {
                              return (
                                <div key={idx} className="mb-3">
                                  <h4 className="text-sm font-semibold text-blue-700 bg-blue-50 py-1 px-2 rounded mb-1.5">
                                    {title}
                                  </h4>
                                  <div className="pl-2">{content}</div>
                                </div>
                              );
                            }
                          } else if (paragraph.includes('\n•')) {
                            // 处理不包含标题但包含列表项的段落
                            const lines = paragraph.split('\n').filter((line: string) => line.trim().length > 0);
                            return (
                              <div key={idx} className="mb-3">
                                <ul className="pl-1 space-y-1">
                                  {lines.map((line: string, lineIdx: number) => (
                                    <li key={lineIdx} className={`pl-5 relative ${line.startsWith('•') ? 'text-slate-700' : 'text-slate-600'}`}>
                                      {line.startsWith('•') ? (
                                        <>
                                          <span className="absolute left-0 text-blue-500">•</span>
                                          {line.substring(1).trim()}
                                        </>
                                      ) : line}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          } else {
                            return (
                              <p key={idx} className="mb-3">
                                {paragraph}
                              </p>
                            );
                          }
                        })}
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
                      <p className="whitespace-pre-line">
                        {aiSummaryContent.split('\n\n').map((paragraph: string, idx: number) => {
                          // 检查段落是否包含【】标题
                          if (paragraph.includes('【') && paragraph.includes('】')) {
                            const titleMatch = paragraph.match(/【(.+?)】/);
                            const title = titleMatch ? titleMatch[1] : '';
                            const content = paragraph.replace(/【(.+?)】/, '');
                            
                            // 检查内容是否包含列表项（以"•"开头的行）
                            const hasListItems = content.includes('\n•');
                            
                            if (hasListItems) {
                              // 处理包含列表项的内容
                              const listItems = content.split('\n').filter((line: string) => line.trim().length > 0);
                              
                              return (
                                <div key={idx} className="mb-4">
                                  <h4 className="text-sm font-semibold text-blue-700 bg-blue-50 py-1 px-2 rounded mb-2">
                                    {title}
                                  </h4>
                                  <ul className="pl-1 space-y-1">
                                    {listItems.map((item: string, itemIdx: number) => (
                                      <li key={itemIdx} className={`pl-5 relative ${item.startsWith('•') ? 'text-slate-700' : 'text-slate-600'}`}>
                                        {item.startsWith('•') ? (
                                          <>
                                            <span className="absolute left-0 text-blue-500">•</span>
                                            {item.substring(1).trim()}
                                          </>
                                        ) : item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            } else {
                              return (
                                <div key={idx} className="mb-3">
                                  <h4 className="text-sm font-semibold text-blue-700 bg-blue-50 py-1 px-2 rounded mb-1.5">
                                    {title}
                                  </h4>
                                  <div className="pl-2">{content}</div>
                                </div>
                              );
                            }
                          } else if (paragraph.includes('\n•')) {
                            // 处理不包含标题但包含列表项的段落
                            const lines = paragraph.split('\n').filter((line: string) => line.trim().length > 0);
                            return (
                              <div key={idx} className="mb-3">
                                <ul className="pl-1 space-y-1">
                                  {lines.map((line: string, lineIdx: number) => (
                                    <li key={lineIdx} className={`pl-5 relative ${line.startsWith('•') ? 'text-slate-700' : 'text-slate-600'}`}>
                                      {line.startsWith('•') ? (
                                        <>
                                          <span className="absolute left-0 text-blue-500">•</span>
                                          {line.substring(1).trim()}
                                        </>
                                      ) : line}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          } else {
                            return (
                              <p key={idx} className="mb-3">
                                {paragraph}
                              </p>
                            );
                          }
                        })}
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
              <div className="font-medium">{todo.name || "实验大鼠药代谢研究"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目编号</div>
              <div className="font-medium">{todo.projectNumber || "系统自动生成或手动输入"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">动物种系</div>
              <div className="font-medium">{todo.animalType}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">动物数量</div>
              <div className="font-medium">{todo.animalCount}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">动物实施设备单位</div>
              <div className="font-medium">{todo.facilityUnit}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">项目周期</div>
              <div className="font-medium">
                {formatDate(todo.startDate || "2024-01-01")} 至 {formatDate(todo.endDate || "2026-12-31")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目预算</div>
              <div className="font-medium">{todo.budget ? `${todo.budget} 元` : "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">项目状态</div>
              <div className="font-medium">{todo.status || "进行中"}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-1">项目描述</div>
            <div className="text-sm">{todo.description || "研究药物在大鼠体内的代谢过程及其机制"}</div>
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
              <div className="text-sm">{todo.researchMethod || "暂无研究方法信息"}</div>
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
              <div className="font-medium">{todo.leader?.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">职称/职务</div>
              <div className="font-medium">{todo.leader?.title || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">所属院系</div>
              <div className="font-medium">{todo.department || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">电子邮箱</div>
              <div className="font-medium">{todo.leader?.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">联系电话</div>
              <div className="font-medium">{todo.leader?.phone || "未设置"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">联系地址</div>
              <div className="font-medium">{todo.address || "未设置"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目团队成员卡片 */}
      {todo.members && todo.members.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              项目团队成员
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {todo.members.map((member: any, index: number) => (
                <div key={index} className="group relative bg-white border border-gray-200 rounded-xl p-3 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1">
                  {/* 头像和姓名 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-2">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center text-lg shadow-lg">
                        {member.name.charAt(0)}
                      </div>
                      {/* 角色小徽章 */}
                      {member.role && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 姓名和职称 */}
                    <div className="w-full">
                      <h4 className="font-semibold text-gray-900 text-sm truncate mb-0.5">{member.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{member.title}</p>
                    </div>
                    
                    {/* 角色标签 */}
                    {member.role && (
                      <div className="mt-2 mb-2">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-200">
                          {member.role}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* 详细信息 - 悬停显示 */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center text-xs">
                      <span className="text-gray-400 mr-2">🏢</span>
                      <span className="text-gray-600 truncate flex-1">{member.department}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="text-gray-400 mr-2">
                        {member.contact.includes('@') ? '📧' : '📞'}
                      </span>
                      <div className="flex-1 min-w-0">
                        {member.contact.includes('@') ? (
                          <a href={`mailto:${member.contact}`} className="text-blue-600 hover:text-blue-800 truncate block">
                            {member.contact}
                          </a>
                        ) : (
                          <a href={`tel:${member.contact}`} className="text-blue-600 hover:text-blue-800">
                            {member.contact}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 悬停时的操作按钮 */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="h-6 w-6 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                      <span className="text-gray-400 text-xs">···</span>
                    </button>
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