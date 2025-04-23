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

interface CompletionAISummaryProps {
  completionData: any
}

export default function CompletionAISummary({ completionData }: CompletionAISummaryProps) {
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
  
  // 根据项目结项类型生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const completionType = completionData.completionType || "正常结项"
    
    if (isUpdated) {
      if (completionType === "正常结项") {
        return "该项目申请正常结项，项目已完成全部研发任务，各项指标均达到或超过预期目标。最新分析显示，项目完成度达到98.5%，核心功能全部实现，性能指标优良。用户满意度调查结果显示，满意度达到92%，远高于行业平均水平。项目文档完整，代码质量高，可维护性强，为后续系统升级和维护奠定了良好基础。"
      } else if (completionType === "提前结项") {
        return "该项目申请提前结项，项目已提前完成全部研发任务，各项指标均达到预期目标。最新分析显示，项目提前完成了原计划的所有任务，时间节约率达到23.7%。关键技术突破进展顺利，核心功能实现稳定，性能测试结果优异。项目提前结项不影响成果质量，反而通过优化研发流程，提高了研发效率。"
      } else if (completionType === "延期结项") {
        return "该项目申请延期结项，虽然超出原定计划时间，但已完成全部研发任务。最新分析显示，延期原因主要是技术难点攻克时间超出预期和外部环境变化。尽管延期，项目最终成果质量良好，关键指标全部达标。团队在延期期间进一步优化了系统性能和用户体验，使最终成果质量有所提升。"
      } else if (completionType === "终止结项") {
        return "该项目申请终止结项，根据项目进展和环境变化评估，继续推进价值不大。最新分析显示，终止原因合理，主要受市场环境变化和技术路线调整影响。项目已完成阶段性成果，部分研究成果和技术积累仍有价值，可用于其他相关项目。终止决策及时，避免了更多资源投入，决策过程规范。"
      } else if (completionType === "成果转化结项") {
        return "该项目申请成果转化结项，研究成果已达到转化条件。最新分析显示，项目成果具有显著的应用价值和市场前景，技术成熟度高，已完成知识产权保护。转化路径明确，已与3家企业达成初步合作意向，预计产生经济效益超过500万元。成果转化计划详细可行，风险评估充分，转化前景良好。"
      } else {
        return "该项目申请" + completionType + "结项，最新分析显示项目结项合理性高，项目完成质量良好，达到了预期目标。结项文档完整规范，成果交付清晰，后续工作安排合理。请查看详细信息了解更多。"
      }
    } else {
      if (completionType === "正常结项") {
        return "该项目申请正常结项，项目已完成全部研发任务，各项指标均达到或超过预期目标。项目完成度高，核心功能全部实现，性能指标良好。项目文档完整，代码质量高，为后续系统维护奠定了基础。"
      } else if (completionType === "提前结项") {
        return "该项目申请提前结项，项目已提前完成全部研发任务，各项指标均达到预期目标。关键技术突破进展顺利，核心功能实现稳定。项目提前结项不影响成果质量，反而提高了研发效率。"
      } else if (completionType === "延期结项") {
        return "该项目申请延期结项，虽然超出原定计划时间，但已完成全部研发任务。延期原因主要是技术难点攻克时间超出预期。尽管延期，项目最终成果质量良好，关键指标达标。"
      } else if (completionType === "终止结项") {
        return "该项目申请终止结项，根据项目进展和环境变化评估，继续推进价值不大。终止原因主要受市场环境变化影响。项目已完成阶段性成果，部分研究成果仍有价值。"
      } else if (completionType === "成果转化结项") {
        return "该项目申请成果转化结项，研究成果已达到转化条件。项目成果具有应用价值和市场前景，技术成熟度高。转化路径明确，已与企业达成初步合作意向。"
      } else {
        return "该项目申请" + completionType + "结项，项目结项合理，项目完成质量良好，达到了预期目标。结项文档完整，成果交付清晰。请查看详细信息了解更多。"
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const completionType = completionData.completionType || "正常结项"
    
    if (isUpdated) {
      if (completionType === "正常结项") {
        return [
          "建议制定详细的成果推广计划，最大化项目成果价值",
          "加强与用户的沟通，收集使用反馈，为系统迭代提供依据",
          "整理项目经验和技术积累，形成知识库用于后续项目参考"
        ]
      } else if (completionType === "提前结项") {
        return [
          "建议分析提前完成的经验，形成最佳实践用于其他项目",
          "关注系统上线后的运行情况，及时处理可能出现的问题",
          "考虑将节约的时间和资源投入到系统功能扩展或优化中"
        ]
      } else if (completionType === "延期结项") {
        return [
          "建议总结延期原因和应对措施，避免后续项目重复类似问题",
          "加强项目风险评估和管理，提高应对突发情况的能力",
          "制定详细的系统维护和升级计划，确保系统稳定运行"
        ]
      } else if (completionType === "终止结项") {
        return [
          "建议深入分析终止原因，形成经验教训用于项目立项决策参考",
          "评估已完成工作的价值，考虑技术和成果的二次利用可能",
          "与项目相关方充分沟通，妥善处理终止后的各项事宜"
        ]
      } else if (completionType === "成果转化结项") {
        return [
          "建议制定详细的成果转化实施计划，明确时间节点和责任人",
          "加强与合作企业的沟通协调，确保转化过程顺利进行",
          "关注知识产权保护，防止核心技术流失"
        ]
      } else {
        return [
          "建议做好项目结项后的成果归档和知识沉淀工作",
          "加强与项目相关方的沟通，确保结项工作顺利完成",
          "总结项目经验教训，为后续项目提供参考"
        ]
      }
    } else {
      if (completionType === "正常结项") {
        return [
          "建议做好项目成果的推广和应用工作",
          "关注系统运行情况，及时处理可能出现的问题",
          "整理项目经验，用于后续项目参考"
        ]
      } else if (completionType === "提前结项") {
        return [
          "建议分析提前完成的经验和方法",
          "关注系统上线后的运行情况",
          "考虑将节约的资源用于系统优化"
        ]
      } else if (completionType === "延期结项") {
        return [
          "建议总结延期原因，避免后续项目类似问题",
          "加强项目风险管理",
          "确保系统稳定运行"
        ]
      } else if (completionType === "终止结项") {
        return [
          "建议分析终止原因，形成经验教训",
          "评估已完成工作的价值和可利用性",
          "妥善处理终止后的各项事宜"
        ]
      } else if (completionType === "成果转化结项") {
        return [
          "建议制定成果转化实施计划",
          "加强与合作企业的沟通",
          "关注知识产权保护"
        ]
      } else {
        return [
          "建议做好项目结项后的成果归档工作",
          "加强与项目相关方的沟通",
          "总结项目经验教训"
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
                    <span>结项评估</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "优秀" : "良好"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                  <PieChart className="h-4 w-4 text-amber-600" />
                  <div className="text-xs text-slate-600">
                    <span>完成度评估</span>
                    <div className="font-semibold text-sm text-slate-900">
                      {isAnalysisUpdated ? (
                        <>
                          高完成度 <span className="text-green-600 text-xs">↑</span>
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
                    <span>价值评估</span>
                    <div className="font-semibold text-sm text-slate-900">{isAnalysisUpdated ? "高价值" : "中等"}</div>
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
                      <span className="font-medium">最新分析已更新 - 检测到项目结项详情</span>
                    </div>
                    <p>
                      {generateAISummary(true)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>结项评估</span>
                          <div className="font-semibold text-sm text-slate-900">优秀</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>完成度评估</span>
                          <div className="font-semibold text-sm text-slate-900">
                            高完成度 <span className="text-green-600 text-xs">↑</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>价值评估</span>
                          <div className="font-semibold text-sm text-slate-900">高价值</div>
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
                          <span>结项评估</span>
                          <div className="font-semibold text-sm text-slate-900">良好</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <div className="text-xs text-slate-600">
                          <span>完成度评估</span>
                          <div className="font-semibold text-sm text-slate-900">中等</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LineChart className="h-4 w-4 text-green-600" />
                        <div className="text-xs text-slate-600">
                          <span>价值评估</span>
                          <div className="font-semibold text-sm text-slate-900">中等</div>
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
