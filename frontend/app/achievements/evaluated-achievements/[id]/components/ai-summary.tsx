"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
  ClipboardCheck,
  Users,
  Award
} from "lucide-react"

interface AISummaryProps {
  data: any
}

export default function AISummary({ data }: AISummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isUpdatingAnalysis, setIsUpdatingAnalysis] = useState(false)
  const [isAnalysisUpdated, setIsAnalysisUpdated] = useState(false)
  
  // 处理更新分析
  const handleUpdateAnalysis = () => {
    setIsUpdatingAnalysis(true)
    
    // 模拟分析过程
    setTimeout(() => {
      setIsUpdatingAnalysis(false)
      setIsAnalysisUpdated(true)
    }, 3000)
  }
  
  // 根据鉴定成果数据生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const achievementLevel = data.level || "未知级别"
    const achievementStatus = data.status || "未知状态"
    
    if (isUpdated) {
      if (achievementStatus === "已鉴定") {
        return `《${data.name}》是一项${achievementLevel}鉴定成果，已由${data.venue}鉴定完成，鉴定结果为"${data.appraisalResult}"。鉴定编号为${data.appraisalNumber}，共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位参与人员。该成果主要内容为：${data.description}。该成果对于${data.project.name}项目具有重要的理论和实践意义，为相关领域的发展提供了新的技术方案和应用模式。`
      } else if (achievementStatus === "鉴定中") {
        return `《${data.name}》是一项${achievementLevel}鉴定成果，目前正在${data.venue}鉴定中。最新分析显示，该成果技术水平评分达到9.4，共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位参与人员。该成果主要内容为：${data.description}。该成果对于${data.project.name}项目具有重要的理论和实践意义，预计将为相关领域的发展提供新的技术方案和应用模式。`
      } else {
        return `《${data.name}》是一项${achievementLevel}鉴定成果，${achievementStatus}。最新分析显示，该成果具有较高的技术创新性和应用价值，共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位参与人员。该成果主要内容为：${data.description}。该成果对于${data.project.name}项目具有重要的理论和实践意义，预计将为相关领域的发展提供新的技术方案和应用模式。`
      }
    } else {
      if (achievementStatus === "已鉴定") {
        return `《${data.name}》是一项${achievementLevel}鉴定成果，已由${data.venue}鉴定完成，鉴定结果为"${data.appraisalResult}"。鉴定编号为${data.appraisalNumber}，共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位参与人员。该成果主要内容为：${data.description}`
      } else if (achievementStatus === "鉴定中") {
        return `《${data.name}》是一项${achievementLevel}鉴定成果，目前正在${data.venue}鉴定中。共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位参与人员。该成果主要内容为：${data.description}`
      } else {
        return `《${data.name}》是一项${achievementLevel}鉴定成果，${achievementStatus}。共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位参与人员。该成果主要内容为：${data.description}`
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const achievementStatus = data.status || "未知状态"
    
    if (isUpdated) {
      if (achievementStatus === "已鉴定") {
        return [
          "建议将该鉴定成果应用于相关项目实践，提高成果转化率",
          "可考虑基于该成果申请专利保护，提升知识产权价值",
          "建议组织技术推广会，扩大成果影响力并促进产业合作"
        ]
      } else if (achievementStatus === "鉴定中") {
        return [
          "建议关注鉴定进度，及时回应鉴定专家意见",
          "可以准备相关补充材料，以应对可能的修改要求",
          "同时开展后续研究，为鉴定完成后的推广应用做准备"
        ]
      } else {
        return [
          "建议明确鉴定重点，突出技术创新点和应用价值",
          "加强与合作人员的沟通协作，提高研究效率",
          "制定详细的鉴定申请计划，确保研究成果及时获得认可"
        ]
      }
    } else {
      if (achievementStatus === "已鉴定") {
        return [
          "建议跟踪成果应用情况，评估技术影响力",
          "可考虑将鉴定成果转化为专利申请",
          "基于该成果开展后续深入研究"
        ]
      } else if (achievementStatus === "鉴定中") {
        return [
          "建议密切关注鉴定进度和专家意见",
          "准备针对可能的修改意见的应对方案",
          "同时规划鉴定完成后的推广应用工作"
        ]
      } else {
        return [
          "建议明确鉴定的技术目标和创新点",
          "制定合理的研究方案和时间规划",
          "加强与项目组其他成员的协作"
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
              <Image src="/ai-icon.png" alt="AI摘要" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span>AI摘要</span>
                <Badge
                  variant="outline"
                  className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2 tracking-wide font-normal border border-primary/20"
                >
                  v2.4.1
                </Badge>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">AI模型: GPT-Scientific 2023</p>
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
              <div className="text-xs text-slate-500 mt-2">正在处理鉴定数据并生成智能洞察...</div>
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
                  <Award className="h-4 w-4 text-blue-600" />
                  <div className="text-xs text-slate-600">
                    <span>技术水平</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "较高" : "中等"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                  <ClipboardCheck className="h-4 w-4 text-amber-600" />
                  <div className="text-xs text-slate-600">
                    <span>应用价值</span>
                    <div className="font-semibold text-sm text-slate-900">
                      {isAnalysisUpdated ? (
                        <>
                          高 <span className="text-green-600 text-xs">↑</span>
                        </>
                      ) : (
                        "中等"
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-green-600" />
                  <div className="text-xs text-slate-600">
                    <span>合作度</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "良好" : "一般"}</div>
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
                      <span className="font-medium">最新分析已更新 - 检测到鉴定详情变化</span>
                    </div>
                    <p>
                      {generateAISummary(true)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <Award className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>技术水平</span>
                          <div className="font-semibold text-sm text-slate-900">较高</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <ClipboardCheck className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>应用价值</span>
                          <div className="font-semibold text-sm text-slate-900">
                            高 <span className="text-green-600 text-xs">↑</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>合作度</span>
                          <div className="font-semibold text-sm text-slate-900">良好</div>
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
                        <Award className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>技术水平</span>
                          <div className="font-semibold text-sm text-slate-900">中等</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <ClipboardCheck className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>应用价值</span>
                          <div className="font-semibold text-sm text-slate-900">中等</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>合作度</span>
                          <div className="font-semibold text-sm text-slate-900">一般</div>
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
                可信度 97%
              </div>
              <span>分析时间: {isAnalysisUpdated ? "2024-04-08 12:42" : "2024-04-05 10:32"}</span>
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
  )
}
