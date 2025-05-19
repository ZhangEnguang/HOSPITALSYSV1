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
  StarIcon
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
                                    {title === "审核要点摘要" ? "项目审查摘要" : title}
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
                                    {title === "审核要点摘要" ? "项目审查摘要" : title}
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
                            // 处理普通段落，包含(1)、(2)、(3)格式的内容需要转换为列表形式
                            const text = paragraph;
                            if (text.includes('(1)') && text.includes('(2)') && text.includes('(3)')) {
                              // 找到建议部分的起始位置
                              const startPos = text.indexOf('(1)');
                              // 将起始部分作为普通段落
                              const introText = text.substring(0, startPos).trim();
                              // 提取建议点并转换为数组
                              const suggestions = [
                                text.substring(text.indexOf('(1)'), text.indexOf('(2)')).trim(),
                                text.substring(text.indexOf('(2)'), text.indexOf('(3)')).trim(),
                                text.substring(text.indexOf('(3)')).trim()
                              ];
                              
                              // 提取最后一条建议后的内容（如果有）
                              let endText = '';
                              const lastSuggestion = suggestions[2];
                              if (lastSuggestion.includes('。')) {
                                const endPos = lastSuggestion.indexOf('。') + 1;
                                endText = lastSuggestion.substring(endPos).trim();
                                suggestions[2] = lastSuggestion.substring(0, endPos).trim();
                              }
                              
                              return (
                                <div key={idx}>
                                  <p className="mb-2">{introText}</p>
                                  <div className="pl-2 space-y-2 mb-2">
                                    {suggestions.map((suggestion, i) => (
                                      <div key={i} className="flex items-start">
                                        <span className="mr-2 flex-shrink-0">{suggestion.substring(0, 3)}</span>
                                        <span>{suggestion.substring(3)}</span>
                                      </div>
                                    ))}
                                  </div>
                                  {endText && <p className="mt-2">{endText}</p>}
                                </div>
                              );
                            } else {
                              // 处理普通段落
                              return (
                                <p key={idx} className="mb-3">
                                  {paragraph}
                                </p>
                              );
                            }
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
                        <div className="mt-2">
                          {aiSuggestions.map((suggestion: string, index: number) => (
                            <div key={index} className="flex items-start gap-1.5 mt-1.5">
                              <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{suggestion}</span>
                            </div>
                          ))}
                        </div>
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
                                    {title === "审核要点摘要" ? "项目审查摘要" : title}
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
                                    {title === "审核要点摘要" ? "项目审查摘要" : title}
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
                            // 处理普通段落，包含(1)、(2)、(3)格式的内容需要转换为列表形式
                            const text = paragraph;
                            if (text.includes('(1)') && text.includes('(2)') && text.includes('(3)')) {
                              // 找到建议部分的起始位置
                              const startPos = text.indexOf('(1)');
                              // 将起始部分作为普通段落
                              const introText = text.substring(0, startPos).trim();
                              // 提取建议点并转换为数组
                              const suggestions = [
                                text.substring(text.indexOf('(1)'), text.indexOf('(2)')).trim(),
                                text.substring(text.indexOf('(2)'), text.indexOf('(3)')).trim(),
                                text.substring(text.indexOf('(3)')).trim()
                              ];
                              
                              // 提取最后一条建议后的内容（如果有）
                              let endText = '';
                              const lastSuggestion = suggestions[2];
                              if (lastSuggestion.includes('。')) {
                                const endPos = lastSuggestion.indexOf('。') + 1;
                                endText = lastSuggestion.substring(endPos).trim();
                                suggestions[2] = lastSuggestion.substring(0, endPos).trim();
                              }
                              
                              return (
                                <div key={idx}>
                                  <p className="mb-2">{introText}</p>
                                  <div className="pl-2 space-y-2 mb-2">
                                    {suggestions.map((suggestion, i) => (
                                      <div key={i} className="flex items-start">
                                        <span className="mr-2 flex-shrink-0">{suggestion.substring(0, 3)}</span>
                                        <span>{suggestion.substring(3)}</span>
                                      </div>
                                    ))}
                                  </div>
                                  {endText && <p className="mt-2">{endText}</p>}
                                </div>
                              );
                            } else {
                              // 处理普通段落
                              return (
                                <p key={idx} className="mb-3">
                                  {paragraph}
                                </p>
                              );
                            }
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
                        <div className="mt-2">
                          {aiSuggestions.map((suggestion: string, index: number) => (
                            <div key={index} className="flex items-start gap-1.5 mt-1.5">
                              <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{suggestion}</span>
                            </div>
                          ))}
                        </div>
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