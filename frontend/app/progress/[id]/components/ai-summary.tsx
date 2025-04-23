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
  projectData: any
}

export default function AISummary({ projectData }: AISummaryProps) {
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
  
  // 根据项目变更类型生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const changeType = projectData.changeType || "未知类型"
    
    if (isUpdated) {
      if (changeType === "设备更新") {
        return "该项目申请设备更新变更，更新实验设备配置，提高研究效率和数据精度。最新分析显示，设备更新后预计可提高实验效率25%，数据精度提升30%，有效缩短研究周期。项目已完成设备选型和供应商筛选，采购流程进展顺利，预计可按期完成设备更新。"
      } else if (changeType === "经费调整") {
        return "因实验设备采购价格上涨，申请调整项目经费预算结构。最新分析显示，设备价格上涨幅度为15.7%，主要受全球芯片短缺影响。调整后的经费结构更加合理，设备采购占比45.3%，人员费用占比32.1%，材料费用占比15.6%，其他费用占比7%。"
      } else if (changeType === "人员变更") {
        return "调整研究团队成员，增加人工智能算法专家，提升研究能力。最新分析显示，新增专家在相关领域发表高水平论文12篇，拥有核心专利3项，加入后预计可提升算法效率35%，加快研究进度。团队协作指数提升至92分，处于优秀水平。"
      } else if (changeType === "周期调整") {
        return "因疫情影响调研工作，申请延长研究周期6个月。最新分析显示，延期后的时间安排更加合理，关键节点调整科学，不影响最终研究质量。项目已完成的工作量占总量的65%，符合预期进度。延期后可确保充分的实验验证和数据分析时间。"
      } else if (changeType === "研究方向") {
        return "根据最新研究趋势和评审专家意见，调整项目研究方向和技术路线。最新分析显示，新研究方向更符合学科前沿发展，引用影响因子提升28%，成果转化潜力增加45%。调整后的技术路线更加清晰，风险点减少，预期成果质量提升。"
      } else if (changeType === "进度延期") {
        return "由于设备采购延迟和人员变动，项目进度受到影响，需要延期三个月完成。最新分析显示，延期后的进度计划更加合理，各阶段时间分配科学，关键节点明确。项目已完成工作量占总量的58%，延期不会影响最终成果质量，反而有利于提高研究深度。"
      } else {
        return "该项目申请" + changeType + "变更，最新分析显示变更合理性高，对项目整体目标影响可控，变更后预期效果良好。请查看详细信息了解更多。"
      }
    } else {
      if (changeType === "设备更新") {
        return "该项目申请设备更新变更，更新实验设备配置，提高研究效率和数据精度。变更原因是提高研究精度，审批状态已通过。设备更新预计可提高实验效率和数据精度，有效促进研究进展。"
      } else if (changeType === "经费调整") {
        return "因实验设备采购价格上涨，申请调整项目经费预算结构。变更类型为经费调整，原因是设备成本增加，目前审批状态为待审核。经费调整合理，不影响项目总体目标。"
      } else if (changeType === "人员变更") {
        return "调整研究团队成员，增加人工智能算法专家，提升研究能力。变更影响：增强团队研究能力，有望提前完成研究目标。人员变更符合项目发展需求，有利于提高研究质量。"
      } else if (changeType === "周期调整") {
        return "因疫情影响调研工作，申请延长研究周期6个月。变更类型为周期调整，原因是疫情影响，目前审批状态为待审核。周期调整合理，不影响最终研究成果质量。"
      } else if (changeType === "研究方向") {
        return "根据最新研究趋势和评审专家意见，调整项目研究方向和技术路线。变更类型为研究方向调整，原因是专家评审意见，审批状态已通过。研究方向调整符合学科发展趋势，有利于提高成果质量。"
      } else if (changeType === "进度延期") {
        return "由于设备采购延迟和人员变动，项目进度受到影响，需要延期三个月完成。项目整体进度将延后，但不影响最终成果质量。预计在延期后能够按照原计划完成所有研究目标。"
      } else {
        return "该项目申请" + changeType + "变更，请查看详细信息了解更多。变更内容合理，对项目整体目标影响可控。"
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const changeType = projectData.changeType || "未知类型"
    
    if (isUpdated) {
      if (changeType === "设备更新") {
        return [
          "建议在设备安装前组织技术培训，确保研究人员熟练掌握新设备操作",
          "制定详细的设备验收标准和流程，确保设备性能符合研究需求",
          "建议与供应商签订长期技术支持协议，保障设备稳定运行"
        ]
      } else if (changeType === "经费调整") {
        return [
          "建议优化采购策略，考虑批量采购或长期合作以降低设备成本",
          "加强经费使用监控，建立月度经费使用报告制度",
          "考虑寻找替代设备或分阶段采购，平衡预算压力"
        ]
      } else if (changeType === "人员变更") {
        return [
          "建议制定详细的新成员融入计划，包括项目背景介绍和技术交接",
          "组织团队建设活动，促进新老成员有效沟通和协作",
          "明确新增专家的具体职责和考核指标，确保人员变更效果"
        ]
      } else if (changeType === "周期调整") {
        return [
          "建议重新制定详细的里程碑计划，明确各阶段交付成果",
          "加强与合作方和上级部门的沟通，说明延期原因和应对措施",
          "考虑是否可以调整研究方法，在延长周期的同时提高研究深度"
        ]
      } else if (changeType === "研究方向") {
        return [
          "建议组织专家研讨会，深入讨论新研究方向的技术路线",
          "制定详细的方向调整实施计划，确保平稳过渡",
          "加强与相关领域专家的合作，借鉴先进经验提高研究效率"
        ]
      } else if (changeType === "进度延期") {
        return [
          "建议重新评估项目风险点，制定针对性的应对措施",
          "优化人员和资源配置，确保关键节点按期完成",
          "加强与项目相关方的沟通，及时报告进度情况"
        ]
      } else {
        return [
          "建议详细记录变更实施过程，积累经验用于未来项目管理",
          "加强与项目相关方的沟通，确保变更顺利实施",
          "定期评估变更效果，必要时进行调整优化"
        ]
      }
    } else {
      if (changeType === "设备更新") {
        return [
          "建议在设备更新前做好技术对接和培训计划",
          "确保新设备与现有研究系统兼容",
          "制定设备更新后的验收标准"
        ]
      } else if (changeType === "经费调整") {
        return [
          "建议详细列出经费调整明细和理由",
          "提供市场调研报告支持价格上涨说明",
          "考虑是否可以分阶段采购以平衡预算"
        ]
      } else if (changeType === "人员变更") {
        return [
          "建议制定新成员融入计划",
          "明确新增人员的具体职责和工作目标",
          "评估人员变动对项目进度的影响"
        ]
      } else if (changeType === "周期调整") {
        return [
          "建议制定详细的延期后工作计划",
          "评估延期对后续研究阶段的影响",
          "考虑是否需要调整研究方法以适应新周期"
        ]
      } else if (changeType === "研究方向") {
        return [
          "建议明确新研究方向的具体目标和预期成果",
          "评估方向调整对已有研究成果的影响",
          "制定新方向的技术路线图"
        ]
      } else if (changeType === "进度延期") {
        return [
          "建议重新评估项目里程碑和交付时间",
          "加强与相关方的沟通，说明延期原因和影响",
          "考虑是否可以并行开展某些工作以减少延期影响"
        ]
      } else {
        return [
          "建议详细说明变更原因和必要性",
          "评估变更对项目整体目标的影响",
          "制定变更后的工作计划"
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
                    <span>变更评估</span>
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
                    <span>影响评估</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "积极" : "中性"}</div>
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
                      <span className="font-medium">最新分析已更新 - 检测到项目变更详情</span>
                    </div>
                    <p>
                      {generateAISummary(true)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>变更评估</span>
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
                          <span>影响评估</span>
                          <div className="font-semibold text-sm text-slate-900">积极</div>
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
                          <span>变更评估</span>
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
                          <span>影响评估</span>
                          <div className="font-semibold text-sm text-slate-900">中性</div>
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
