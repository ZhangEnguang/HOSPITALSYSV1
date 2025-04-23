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
  Lightbulb,
  Users,
  FileCheck
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
  
  // 根据专利数据生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const patentType = data.patentType || "发明专利"
    const patentStatus = data.status || "申请中"
    
    if (isUpdated) {
      if (patentStatus === "已授权") {
        return `《${data.name}》是一项${patentType}，已获得授权，专利号为${data.patentNumber || "CN123456789B"}。该专利由${data.author.name}作为第一发明人，共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位发明人参与。该专利的主要内容为：${data.description}。该专利对于${data.project?.name || "相关项目"}具有重要的技术支撑作用，为相关领域的发展提供了创新性解决方案，具有较高的技术价值和应用前景。专利的技术方案解决了行业内的关键问题，具有新颖性、创造性和实用性。`
      } else if (patentStatus === "申请中") {
        return `《${data.name}》是一项${patentType}，目前处于申请中状态，申请号为${data.patentNumber?.replace(/[A-Z]/g, "") || "123456789"}。最新分析显示，该专利技术创新度评分达到9.2，共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位发明人参与。该专利的主要内容为：${data.description}。该专利对于${data.project?.name || "相关项目"}具有重要的技术支撑作用，预计将为相关领域的发展提供创新性解决方案。专利的技术方案针对行业痛点问题，提出了全新的解决思路，具有较强的市场竞争力。`
      } else if (patentStatus === "已公开") {
        return `《${data.name}》是一项${patentType}，已公开但尚未授权，公开号为${data.patentNumber || "CN123456789A"}。最新分析显示，该专利具有较高的技术创新性，共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位发明人参与。该专利的主要内容为：${data.description}。该专利对于${data.project?.name || "相关项目"}具有重要的技术支撑作用，预计将为相关领域的发展提供创新性解决方案。专利的技术方案已通过初步审查，正在等待实质审查结果。`
      } else {
        return `《${data.name}》是一项${patentType}，${patentStatus}。最新分析显示，该专利具有一定的技术价值，共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位发明人参与。该专利的主要内容为：${data.description}。该专利对于${data.project?.name || "相关项目"}具有一定的技术参考价值，但需要根据当前状态调整后续策略。`
      }
    } else {
      if (patentStatus === "已授权") {
        return `《${data.name}》是一项${patentType}，已获得授权，专利号为${data.patentNumber || "CN123456789B"}。该专利由${data.author.name}作为第一发明人，共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位发明人参与。该专利的主要内容为：${data.description}`
      } else if (patentStatus === "申请中") {
        return `《${data.name}》是一项${patentType}，目前处于申请中状态，申请号为${data.patentNumber?.replace(/[A-Z]/g, "") || "123456789"}。共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位发明人参与。该专利的主要内容为：${data.description}`
      } else if (patentStatus === "已公开") {
        return `《${data.name}》是一项${patentType}，已公开但尚未授权，公开号为${data.patentNumber || "CN123456789A"}。共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位发明人参与。该专利的主要内容为：${data.description}`
      } else {
        return `《${data.name}》是一项${patentType}，${patentStatus}。共有${data.coAuthors ? data.coAuthors.length + 1 : 1}位发明人参与。该专利的主要内容为：${data.description}`
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const patentStatus = data.status || "申请中"
    
    if (isUpdated) {
      if (patentStatus === "已授权") {
        return [
          "建议基于该专利开展技术转化，提高专利实施转化率",
          "可考虑围绕该专利构建专利组合，形成技术壁垒",
          "建议开展专利价值评估，明确专利的商业化路径"
        ]
      } else if (patentStatus === "申请中") {
        return [
          "建议密切关注审查进度，及时回应审查意见通知书",
          "可以准备相关补充材料，提高授权可能性",
          "同时开展专利预商业化评估，为获权后的实施做准备"
        ]
      } else if (patentStatus === "已公开") {
        return [
          "建议关注同领域竞争对手的专利动态，评估技术竞争态势",
          "可以准备针对可能的审查意见的应对方案",
          "同时考虑专利的后续改进方向，形成专利组合"
        ]
      } else {
        return [
          "建议评估专利驳回原因，考虑技术方案调整或重新申请",
          "可以分析相关领域的技术发展趋势，寻找新的创新点",
          "考虑将核心技术以其他形式保护，如技术秘密等"
        ]
      }
    } else {
      if (patentStatus === "已授权") {
        return [
          "建议跟踪专利实施情况，评估技术应用效果",
          "可考虑围绕该专利申请相关专利",
          "基于该专利开展技术转化工作"
        ]
      } else if (patentStatus === "申请中") {
        return [
          "建议密切关注审查进度和审查意见",
          "准备针对可能的审查意见的应对方案",
          "同时规划专利授权后的实施策略"
        ]
      } else if (patentStatus === "已公开") {
        return [
          "建议关注同领域竞争对手的专利动态",
          "准备针对实质审查的应对策略",
          "评估技术方案的市场价值"
        ]
      } else {
        return [
          "建议分析专利状态变化的原因",
          "评估技术方案的调整方向",
          "考虑知识产权保护的替代方案"
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
              <div className="text-xs text-slate-500 mt-2">正在处理专利数据并生成智能洞察...</div>
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
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <div className="text-xs text-slate-600">
                    <span>创新性</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "较高" : "中等"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                  <FileCheck className="h-4 w-4 text-amber-600" />
                  <div className="text-xs text-slate-600">
                    <span>授权可能性</span>
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
                    <span>技术价值</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "较高" : "一般"}</div>
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
                      <span className="font-medium">最新分析已更新 - 检测到专利状态变化</span>
                    </div>
                    <p>
                      {generateAISummary(true)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>创新性</span>
                          <div className="font-semibold text-sm text-slate-900">较高</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <FileCheck className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>授权可能性</span>
                          <div className="font-semibold text-sm text-slate-900">
                            高 <span className="text-green-600 text-xs">↑</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>技术价值</span>
                          <div className="font-semibold text-sm text-slate-900">较高</div>
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
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>创新性</span>
                          <div className="font-semibold text-sm text-slate-900">中等</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <FileCheck className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>授权可能性</span>
                          <div className="font-semibold text-sm text-slate-900">中等</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>技术价值</span>
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
                可信度 96%
              </div>
              <span>分析时间: {isAnalysisUpdated ? "2024-04-08 13:45" : "2024-04-05 09:28"}</span>
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
