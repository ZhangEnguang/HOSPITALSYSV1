"use client"

import { useState, useEffect } from "react"
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
  Sparkles
} from "lucide-react"

interface AnimalRoomAISummaryProps {
  roomData: any
}

export default function AnimalRoomAISummary({ roomData }: AnimalRoomAISummaryProps) {
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
  
  // 根据动物房类型和状态生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const type = roomData.type || "未知类型"
    const status = roomData.status || "未知状态"
    const occupancyRate = ((roomData.currentOccupancy || 0) / (roomData.capacity || 1) * 100).toFixed(1)
    
    if (isUpdated) {
      if (type === "SPF饲养间") {
        return `该${roomData.name}是SPF级动物饲养间，配备先进的空气净化和温湿度控制系统。最新分析显示，房间运行状态为${status}，当前入住${roomData.currentOccupancy}只动物，容量使用率${occupancyRate}%。环境参数稳定，温度控制在${roomData.temperature}°C，湿度维持${roomData.humidity}%，符合SPF级动物饲养标准。建议继续保持严格的清洁消毒制度，确保微生物控制达标。该房间为多个科研项目提供高质量的实验动物，使用效率较高，管理规范，动物健康状况良好。`
      } else if (type === "普通饲养间") {
        return `该${roomData.name}是标准动物饲养间，具备基础的环境控制设施。最新分析显示，房间状态为${status}，入住率${occupancyRate}%，环境条件稳定。温度控制在${roomData.temperature}°C范围内，湿度保持${roomData.humidity}%，满足常规实验动物饲养要求。建议定期检查通风系统和环境监控设备，确保动物饲养环境的稳定性。该房间为科研项目提供可靠的动物饲养支持，管理制度完善。`
      } else if (type === "隔离饲养间") {
        return `该${roomData.name}是隔离动物饲养间，专用于新入所动物的隔离观察和检疫。最新分析显示，房间运行正常，当前状态为${status}，入住率${occupancyRate}%。严格的隔离措施和环境控制确保了动物健康状态的有效监控。建议继续执行隔离期管理规程，定期进行健康检查和环境消毒。该房间是动物质量控制的重要环节，为后续实验提供健康保障。`
      } else {
        return `该${roomData.name}是实验动物饲养设施，配备完善的环境控制系统。最新分析显示，房间运行状态为${status}，使用率${occupancyRate}%，环境参数稳定。当前入住${roomData.currentOccupancy}只动物，温度${roomData.temperature}°C，湿度${roomData.humidity}%。建议按照标准操作程序进行管理维护。该房间为科研项目提供可靠的动物饲养支持，管理规范，使用效率良好，符合动物福利要求。`
      }
    } else {
      if (type === "SPF饲养间") {
        return `该${roomData.name}是SPF级动物饲养间，严格按照无特定病原体动物饲养标准运行。房间具备先进的空气净化系统和精确的环境控制设备。当前状态为${status}，使用率${occupancyRate}%，为高质量的科研工作提供可靠保障。`
      } else if (type === "普通饲养间") {
        return `该${roomData.name}是标准动物饲养间，配备基础的环境控制设施，满足常规实验动物的饲养需求。房间运行稳定，当前状态为${status}，使用率${occupancyRate}%，为科研项目提供基础饲养支持。`
      } else if (type === "隔离饲养间") {
        return `该${roomData.name}是隔离动物饲养间，专门用于新入所动物的隔离检疫。严格的隔离措施确保动物健康状态的有效监控。当前状态为${status}，是动物质量控制的重要环节。`
      } else {
        return `该${roomData.name}是实验动物饲养设施，配备完善的环境控制系统。房间运行稳定，环境参数良好，当前状态为${status}，为科研工作提供可靠的动物饲养支持。`
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const type = roomData.type || "未知类型"
    const status = roomData.status || "正常"
    const occupancyRate = ((roomData.currentOccupancy || 0) / (roomData.capacity || 1) * 100)
    
    if (isUpdated) {
      if (type === "SPF饲养间") {
        return [
          "严格执行SPF级操作规程，确保人员进入前完成消毒程序",
          "定期检测微生物指标，维持无特定病原体环境",
          "优化空气净化系统运行参数，确保环境质量稳定"
        ]
      } else if (type === "普通饲养间") {
        return [
          "加强日常清洁消毒工作，维持良好的卫生环境",
          "定期校准环境监控设备，确保数据准确性",
          "建立完善的饲养记录体系，提高管理效率"
        ]
      } else if (type === "隔离饲养间") {
        return [
          "严格执行隔离期管理规程，避免交叉感染",
          "加强动物健康监测，及时发现异常情况",
          "定期进行环境消毒，确保隔离效果"
        ]
      } else {
        return [
          "建立标准化的房间管理流程，提高运营效率",
          "加强环境参数监控，确保动物饲养条件稳定",
          "定期进行设备维护保养，保证系统正常运行"
        ]
      }
    } else {
      if (occupancyRate >= 90) {
        return [
          "当前使用率较高，建议合理安排动物入住计划",
          "加强房间清洁维护，确保高密度饲养的环境质量",
          "考虑优化空间布局，提高饲养效率"
        ]
      } else if (occupancyRate <= 30) {
        return [
          "当前使用率较低，可考虑安排更多实验项目",
          "定期维护房间设施，保持良好的待用状态",
          "优化资源配置，提高房间利用效率"
        ]
      } else if (status === "维修中") {
        return [
          "尽快完成维修工作，减少对科研项目的影响",
          "检查维修质量，确保设备正常运行",
          "制定预防性维护计划，减少故障发生"
        ]
      } else {
        return [
          "继续保持良好的管理状态，确保饲养质量",
          "定期评估房间运行效果，持续改进管理",
          "加强人员培训，提高专业操作水平"
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span>AI智能分析</span>
                <Badge
                  variant="outline"
                  className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2 tracking-wide font-normal border border-primary/20"
                >
                  v2.4.1
                </Badge>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">AI模型: GPT-Animal 2023</p>
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
              <div className="text-xs text-slate-500 mt-2">正在分析动物房数据并生成智能洞察...</div>
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
                    <span>运行状态</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "优秀" : "良好"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                  <PieChart className="h-4 w-4 text-amber-600" />
                  <div className="text-xs text-slate-600">
                    <span>环境评估</span>
                    <div className="font-semibold text-sm text-slate-900">
                      {isAnalysisUpdated ? (
                        <>
                          环境稳定 <span className="text-green-600 text-xs">✓</span>
                        </>
                      ) : (
                        "稳定"
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <LineChart className="h-4 w-4 text-green-600" />
                  <div className="text-xs text-slate-600">
                    <span>使用效率</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "高效" : "良好"}</div>
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
                      <span className="font-medium">最新分析已更新 - 检测到动物房运行和环境变化</span>
                    </div>
                    <p>
                      {generateAISummary(true)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>运行状态</span>
                          <div className="font-semibold text-sm text-slate-900">优秀</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>环境评估</span>
                          <div className="font-semibold text-sm text-slate-900">
                            环境稳定 <span className="text-green-600 text-xs">✓</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>使用效率</span>
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
                          <span>运行状态</span>
                          <div className="font-semibold text-sm text-slate-900">良好</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>环境评估</span>
                          <div className="font-semibold text-sm text-slate-900">稳定</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>使用效率</span>
                          <div className="font-semibold text-sm text-slate-900">良好</div>
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
                可信度 95%
              </div>
              <span>分析时间: {isAnalysisUpdated ? "2024-04-03 17:45" : "2024-04-01 10:35"}</span>
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
                    description: "AI智能分析内容已复制",
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
    </Card>
  )
}