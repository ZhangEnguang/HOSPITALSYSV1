"use client"

import { useState, useEffect, useRef } from "react"
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
  LayoutGrid
} from "lucide-react"

interface AISummaryProps {
  fundsData: any
}

export default function AISummary({ fundsData }: AISummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isUpdatingAnalysis, setIsUpdatingAnalysis] = useState(false)
  const [isAnalysisUpdated, setIsAnalysisUpdated] = useState(false)
  const [hasAiWritten, setHasAiWritten] = useState(true)
  const [aiInputValue, setAiInputValue] = useState("已生成")
  
  // 处理更新分析
  const handleUpdateAnalysis = () => {
    setIsUpdatingAnalysis(true)
    
    // 模拟分析过程
    setTimeout(() => {
      setIsUpdatingAnalysis(false)
      setIsAnalysisUpdated(true)
      setHasAiWritten(true)
    }, 3000)
  }
  
  // 根据经费类型生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const category = fundsData.category || "未知类型"
    const amount = fundsData.amount || 0
    
    if (isUpdated) {
      if (category === "纵向项目经费") {
        return `该经费入账为纵向项目经费，总额${amount.toLocaleString('zh-CN')}元，来源于${fundsData.source}。最新分析显示，该经费已完成入账审批，资金已到账，可用于项目支出。经费使用计划合理，预计主要用于设备采购(45%)、人员费用(30%)、材料费(15%)和其他支出(10%)。项目执行情况良好，当前进度符合预期，无明显风险点。`
      } else if (category === "横向项目经费") {
        return `该经费入账为横向项目经费，总额${amount.toLocaleString('zh-CN')}元，来源于${fundsData.source}。最新分析显示，该经费已完成入账流程，资金已到位。根据合同约定，经费将分三期使用，当前为第一期，主要用于前期研究和设备采购。项目合作方关系良好，沟通顺畅，预计可按期完成合同约定的研究任务。`
      } else if (category === "科研奖励经费") {
        return `该经费入账为科研奖励经费，总额${amount.toLocaleString('zh-CN')}元，来源于${fundsData.source}。最新分析显示，该奖励经费已完成审批和入账，可按规定使用。奖励经费主要用于表彰科研团队在${fundsData.project.name}项目中的突出成果，将按照学校相关规定分配使用，有助于激励团队继续深入研究。`
      } else {
        return `该经费入账为${category}，总额${amount.toLocaleString('zh-CN')}元，来源于${fundsData.source}。最新分析显示，该经费已完成入账流程，资金已到位可用。经费使用计划合理，预计可有效支持${fundsData.project.name}项目的顺利开展。项目执行情况良好，当前无明显风险点。`
      }
    } else {
      if (category === "纵向项目经费") {
        return `该经费入账为纵向项目经费，总额${amount.toLocaleString('zh-CN')}元，来源于${fundsData.source}。经费已完成入账审批，资金已到账，可用于项目支出。纵向项目经费需严格按照预算执行，预算调整需履行相应审批程序。`
      } else if (category === "横向项目经费") {
        return `该经费入账为横向项目经费，总额${amount.toLocaleString('zh-CN')}元，来源于${fundsData.source}。经费已完成入账流程，资金已到位。横向项目经费使用相对灵活，但需符合合同约定和学校财务规定。`
      } else if (category === "科研奖励经费") {
        return `该经费入账为科研奖励经费，总额${amount.toLocaleString('zh-CN')}元，来源于${fundsData.source}。奖励经费已完成审批和入账，可按规定使用。科研奖励经费主要用于表彰科研成果，按照学校相关规定分配使用。`
      } else {
        return `该经费入账为${category}，总额${amount.toLocaleString('zh-CN')}元，来源于${fundsData.source}。经费已完成入账流程，资金已到位可用。请查看详细信息了解更多经费使用规定。`
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const category = fundsData.category || "未知类型"
    const amount = fundsData.amount || 0
    
    if (isUpdated) {
      if (category === "纵向项目经费") {
        return [
          "建议严格按照项目预算执行经费使用，重大调整需履行审批程序",
          "定期检查经费使用进度，避免出现经费使用不均衡的情况",
          "做好经费使用记录，保留完整的原始票据和合同等材料"
        ]
      } else if (category === "横向项目经费") {
        return [
          "建议根据合同约定和研究进度合理安排经费使用",
          "加强与合作方的沟通，及时报告研究进展和经费使用情况",
          "做好成果转化和知识产权保护工作，确保合作双方权益"
        ]
      } else if (category === "科研奖励经费") {
        return [
          "建议按照学校规定合理分配奖励经费，做到公平公正",
          "可将部分奖励经费用于团队建设和后续研究工作",
          "做好经费使用记录，确保透明合规"
        ]
      } else {
        return [
          "建议制定详细的经费使用计划，确保资金高效利用",
          "定期检查经费使用情况，避免超支或资金闲置",
          "做好经费使用记录和财务报表，确保合规透明"
        ]
      }
    } else {
      if (category === "纵向项目经费") {
        return [
          "建议严格按照项目预算执行经费",
          "重大调整需履行审批程序",
          "做好经费使用记录和原始票据保存"
        ]
      } else if (category === "横向项目经费") {
        return [
          "建议根据合同约定使用经费",
          "加强与合作方的沟通",
          "注意成果转化和知识产权保护"
        ]
      } else if (category === "科研奖励经费") {
        return [
          "建议按规定分配奖励经费",
          "部分用于团队建设和后续研究",
          "确保经费使用透明合规"
        ]
      } else {
        return [
          "建议制定经费使用计划",
          "定期检查经费使用情况",
          "做好财务记录和报表"
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
              <div className="text-xs text-slate-500 mt-2">正在处理经费数据并生成智能洞察...</div>
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
                    <span>经费评估</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "合理" : "合理"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                  <PieChart className="h-4 w-4 text-amber-600" />
                  <div className="text-xs text-slate-600">
                    <span>风险评估</span>
                    <div className="font-semibold text-sm text-slate-900">
                      {isAnalysisUpdated ? (
                        <>
                          低风险 <span className="text-green-600 text-xs">↓</span>
                        </>
                      ) : (
                        "中等"
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <LineChart className="h-4 w-4 text-green-600" />
                  <div className="text-xs text-slate-600">
                    <span>使用评估</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "高效" : "正常"}</div>
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
                      <span className="font-medium">最新分析已更新 - 检测到经费入账详情</span>
                    </div>
                    <p>
                      {generateAISummary(true)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>经费评估</span>
                          <div className="font-semibold text-sm text-slate-900">合理</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>风险评估</span>
                          <div className="font-semibold text-sm text-slate-900">
                            低风险 <span className="text-green-600 text-xs">↓</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>使用评估</span>
                          <div className="font-semibold text-sm text-slate-900">高效</div>
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
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>经费评估</span>
                          <div className="font-semibold text-sm text-slate-900">合理</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>风险评估</span>
                          <div className="font-semibold text-sm text-slate-900">中等</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>使用评估</span>
                          <div className="font-semibold text-sm text-slate-900">正常</div>
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

          <div className="flex justify-end items-center mt-2 pt-2 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? "展开详情" : "收起详情"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 ml-2"
              onClick={() => {
                // 复制AI摘要内容
                navigator.clipboard.writeText(generateAISummary(isAnalysisUpdated))
                toast({
                  title: "已复制到剪贴板",
                  description: "AI摘要内容已复制",
                })
              }}
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              复制摘要
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
