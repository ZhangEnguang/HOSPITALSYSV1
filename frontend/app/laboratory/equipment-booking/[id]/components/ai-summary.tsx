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
  equipmentData: any
}

export default function AISummary({ equipmentData }: AISummaryProps) {
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
  
  // 根据仪器类型生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const category = equipmentData.category || "未知类型"
    const status = equipmentData.status || "未知状态"
    
    if (isUpdated) {
      if (category === "分析仪器") {
        return `该${equipmentData.name}是高精度分析仪器，主要用于材料成分分析和结构表征。最新分析显示，设备运行状态优良，使用频率为${equipmentData.useFrequency || "中等"}，预约次数达${equipmentData.bookingCount || 0}次。设备维护状态为${equipmentData.maintenanceStatus || "正常"}，建议按计划进行定期维护以确保测试精度。该设备在科研项目中发挥重要作用，为多个研究方向提供关键数据支持，设备利用率达到78%，表现优异。`
      } else if (category === "光学仪器") {
        return `该${equipmentData.name}是精密光学仪器，具有高分辨率和稳定性。最新分析显示，设备光学系统性能稳定，测量精度符合技术指标要求。当前使用状态为${status}，预约使用率较高，建议优化预约时间安排。设备存放环境良好，温湿度控制在规定范围内，有利于设备长期稳定运行。光学元件清洁度良好，建议继续保持当前维护水平。`
      } else if (category === "电子仪器") {
        return `该${equipmentData.name}是先进电子测试仪器，具备多种测试功能和高精度测量能力。最新分析显示，设备电子系统运行正常，校准状态良好。使用频率为${equipmentData.useFrequency || "中等"}，设备利用率合理。建议定期进行电子系统检查和校准，确保测量数据的准确性和可靠性。设备故障率低，维护成本控制良好。`
      } else {
        return `该${equipmentData.name}是重要的科研设备，在相关领域具有重要应用价值。最新分析显示，设备整体状态良好，使用情况正常。当前维护状态为${equipmentData.maintenanceStatus || "正常"}，建议按照维护计划进行定期保养。设备为多个科研项目提供技术支持，使用效率较高，用户满意度达到90%以上。`
      }
    } else {
      if (category === "分析仪器") {
        return `该${equipmentData.name}是高精度分析仪器，主要用于材料成分分析和结构表征。设备具有高分辨率、高精度的特点，能够提供准确的分析数据。当前状态为${status}，使用频率${equipmentData.useFrequency || "中等"}，是科研工作的重要工具。`
      } else if (category === "光学仪器") {
        return `该${equipmentData.name}是精密光学仪器，具有高分辨率和稳定性。设备采用先进的光学技术，能够进行精确的光学测量和分析。当前使用状态为${status}，为光学相关研究提供重要支持。`
      } else if (category === "电子仪器") {
        return `该${equipmentData.name}是先进电子测试仪器，具备多种测试功能和高精度测量能力。设备能够进行各种电子参数的测量和分析，是电子技术研究的重要工具。当前状态为${status}。`
      } else {
        return `该${equipmentData.name}是重要的科研设备，在相关领域具有重要应用价值。设备功能完善，技术先进，为科研工作提供有力支持。当前状态为${status}，请查看详细信息了解更多。`
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const category = equipmentData.category || "未知类型"
    const maintenanceStatus = equipmentData.maintenanceStatus || "正常"
    
    if (isUpdated) {
      if (category === "分析仪器") {
        return [
          "建议定期校准设备，确保分析结果的准确性和可靠性",
          "加强设备使用培训，提高操作人员的专业技能水平",
          "建立完善的样品预处理流程，提高分析效率和质量"
        ]
      } else if (category === "光学仪器") {
        return [
          "保持设备清洁，定期清理光学元件，避免灰尘影响测量精度",
          "控制环境温湿度，确保设备在最佳条件下运行",
          "建议建立设备使用日志，记录每次使用情况和异常现象"
        ]
      } else if (category === "电子仪器") {
        return [
          "定期进行电子系统检查，确保各项功能正常",
          "建议制定标准操作程序，规范设备使用流程",
          "加强设备防护，避免电磁干扰影响测量结果"
        ]
      } else {
        return [
          "建议制定详细的设备维护计划，确保设备长期稳定运行",
          "加强设备使用管理，提高设备利用率",
          "定期评估设备性能，及时发现和解决潜在问题"
        ]
      }
    } else {
      if (maintenanceStatus === "正常") {
        return [
          "设备状态良好，建议继续按计划进行维护",
          "优化设备使用安排，提高使用效率",
          "加强设备操作培训，确保规范使用"
        ]
      } else if (maintenanceStatus === "待维护") {
        return [
          "建议尽快安排设备维护，确保设备正常运行",
          "检查设备关键部件，及时更换老化元件",
          "制定维护后的验证程序，确保设备性能恢复"
        ]
      } else {
        return [
          "建议详细检查设备状态，制定相应的处理方案",
          "加强设备日常巡检，及时发现异常情况",
          "建立设备故障处理流程，提高响应效率"
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
              <div className="text-xs text-slate-500 mt-2">正在处理设备数据并生成智能洞察...</div>
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
                    <span>设备状态</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "优秀" : "良好"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                  <PieChart className="h-4 w-4 text-amber-600" />
                  <div className="text-xs text-slate-600">
                    <span>利用率评估</span>
                    <div className="font-semibold text-sm text-slate-900">
                      {isAnalysisUpdated ? (
                        <>
                          高利用率 <span className="text-green-600 text-xs">↑</span>
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
                    <span>性能评估</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "优异" : "良好"}</div>
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
                      <span className="font-medium">最新分析已更新 - 检测到设备使用数据变化</span>
                    </div>
                    <p>
                      {generateAISummary(true)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>设备状态</span>
                          <div className="font-semibold text-sm text-slate-900">优秀</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>利用率评估</span>
                          <div className="font-semibold text-sm text-slate-900">
                            高利用率 <span className="text-green-600 text-xs">↑</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>性能评估</span>
                          <div className="font-semibold text-sm text-slate-900">优异</div>
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
                          <span>设备状态</span>
                          <div className="font-semibold text-sm text-slate-900">良好</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>利用率评估</span>
                          <div className="font-semibold text-sm text-slate-900">中等</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>性能评估</span>
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
                可信度 94%
              </div>
              <span>分析时间: {isAnalysisUpdated ? "2024-04-03 17:42" : "2024-04-01 10:32"}</span>
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