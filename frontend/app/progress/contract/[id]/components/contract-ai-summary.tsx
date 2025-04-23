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

interface ContractAISummaryProps {
  contractData: any
}

export default function ContractAISummary({ contractData }: ContractAISummaryProps) {
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
  
  // 根据合同类型生成不同的AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    const contractType = contractData.changeType || "未知类型"
    
    if (isUpdated) {
      if (contractType === "技术开发") {
        return "该合同为技术开发合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。最新分析显示，该合同技术路线清晰，开发目标明确，预期成果可行性高。合同条款完备，知识产权归属明确，风险责任划分合理。合同执行周期与项目进度匹配，资金支付节点设置科学。建议按期推进合同执行，做好技术交付和验收准备。"
      } else if (contractType === "技术服务") {
        return "该合同为技术服务合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。最新分析显示，服务内容界定清晰，服务标准和质量要求明确。服务周期安排合理，付款条件和方式符合行业惯例。合同中的保密条款完善，知识产权归属明确。服务方资质良好，技术能力满足需求，履约能力强。建议加强过程管理，确保服务质量达标。"
      } else if (contractType === "技术咨询") {
        return "该合同为技术咨询合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。最新分析显示，咨询范围和目标明确，咨询方案科学可行。咨询方专业背景强，行业经验丰富，信誉良好。合同约定的咨询成果形式明确，验收标准合理。付款条件与咨询进度匹配，合同风险控制措施完善。建议做好咨询成果的转化应用，充分发挥咨询价值。"
      } else if (contractType === "技术转让") {
        return "该合同为技术转让合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。最新分析显示，转让技术的范围和内容明确，技术状态描述准确。技术转让方式和步骤清晰，技术资料交付完整。技术指标和性能要求明确，技术保密措施完善。转让方技术实力强，技术成熟度高，转让风险低。建议做好技术交接和培训工作，确保技术有效转移。"
      } else if (contractType === "合作研发") {
        return "该合同为合作研发合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。最新分析显示，研发目标和内容明确，技术路线可行。双方权责划分清晰，投入比例合理。知识产权归属和利益分配机制公平。研发风险评估充分，风险应对措施完善。合作方研发实力强，互补性好，协同效应明显。建议建立有效的项目管理机制，加强沟通协作，确保研发目标实现。"
      } else if (contractType === "委托加工") {
        return "该合同为委托加工合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。最新分析显示，加工内容和要求明确，技术标准和质量要求详细。加工周期安排合理，交付方式明确。质量检验和验收标准完善，不合格品处理方式明确。加工方资质良好，生产能力满足需求，质量管理体系健全。建议加强过程监督和质量控制，确保加工产品满足要求。"
      } else {
        return "该合同类型为" + contractType + "，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。最新分析显示，合同条款完整，权责划分清晰，风险控制措施完善。合同执行计划合理，预期目标可实现。合作方资质良好，履约能力强。建议按计划推进合同执行，加强过程管理，确保合同目标实现。"
      }
    } else {
      if (contractType === "技术开发") {
        return "该合同为技术开发合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。合同主要内容包括技术开发目标、技术路线、开发周期、成果形式、验收标准等。合同条款完整，权责划分清晰。合作方具备相关技术开发能力，履约风险较低。"
      } else if (contractType === "技术服务") {
        return "该合同为技术服务合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。合同主要约定了服务内容、服务标准、服务周期、付款条件等。服务内容明确，质量要求清晰。合作方具备相关服务资质和能力，服务质量有保障。"
      } else if (contractType === "技术咨询") {
        return "该合同为技术咨询合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。合同主要约定了咨询范围、咨询方案、成果形式、验收标准等。咨询目标明确，咨询方案可行。合作方具备专业背景和行业经验，咨询质量有保障。"
      } else if (contractType === "技术转让") {
        return "该合同为技术转让合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。合同主要约定了转让技术的范围、转让方式、技术指标、保密措施等。技术状态描述准确，转让步骤清晰。技术成熟度高，转让风险可控。"
      } else if (contractType === "合作研发") {
        return "该合同为合作研发合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。合同主要约定了研发目标、双方投入、权责划分、知识产权归属等。研发目标明确，技术路线可行。双方优势互补，合作基础良好。"
      } else if (contractType === "委托加工") {
        return "该合同为委托加工合同，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。合同主要约定了加工内容、技术标准、交付方式、质量要求等。加工要求明确，质量标准详细。合作方加工能力满足需求，质量管理体系健全。"
      } else {
        return "该合同类型为" + contractType + "，合同金额为" + contractData.contractAmount + "，合作方为" + contractData.contractParty + "。合同条款完整，权责划分清晰。合同执行计划合理，预期目标明确。合作方资质和能力满足合同要求。"
      }
    }
  }
  
  // 生成AI建议内容
  const generateAIRecommendations = (isUpdated: boolean) => {
    const contractType = contractData.changeType || "未知类型"
    
    if (isUpdated) {
      if (contractType === "技术开发") {
        return [
          "建议建立定期进度报告机制，及时跟踪开发进展",
          "做好技术开发过程文档管理，确保技术资料完整",
          "提前规划成果验收工作，明确验收标准和流程"
        ]
      } else if (contractType === "技术服务") {
        return [
          "建议制定服务质量监控计划，定期评估服务效果",
          "加强与服务方的沟通协调，及时解决服务过程中的问题",
          "做好服务成果的接收和应用，最大化服务价值"
        ]
      } else if (contractType === "技术咨询") {
        return [
          "建议充分提供背景资料，确保咨询方了解需求",
          "加强与咨询方的互动交流，提高咨询针对性",
          "做好咨询成果的转化应用，制定实施计划"
        ]
      } else if (contractType === "技术转让") {
        return [
          "建议做好技术交接准备，确保技术资料完整",
          "组织技术培训，确保技术有效吸收和应用",
          "制定技术消化吸收计划，提高技术应用能力"
        ]
      } else if (contractType === "合作研发") {
        return [
          "建议建立有效的项目管理机制，明确里程碑和交付物",
          "加强双方技术团队的沟通协作，形成协同效应",
          "做好研发风险管理，及时应对技术难题"
        ]
      } else if (contractType === "委托加工") {
        return [
          "建议加强过程质量监控，定期检查加工进度和质量",
          "做好技术指导和支持，确保加工符合要求",
          "制定详细的产品验收标准和流程，严格把控质量"
        ]
      } else {
        return [
          "建议做好合同执行计划，明确关键节点和责任人",
          "加强与合作方的沟通协调，及时解决执行中的问题",
          "做好合同履约监督，确保合同目标实现"
        ]
      }
    } else {
      if (contractType === "技术开发") {
        return [
          "建议明确技术开发的具体目标和验收标准",
          "关注知识产权保护条款，确保权益明确",
          "制定开发进度监控计划，确保按期完成"
        ]
      } else if (contractType === "技术服务") {
        return [
          "建议明确服务内容和质量标准",
          "关注服务过程中的责任划分",
          "制定服务质量评估方案"
        ]
      } else if (contractType === "技术咨询") {
        return [
          "建议明确咨询成果的形式和应用方向",
          "关注咨询信息的保密条款",
          "做好咨询需求的准确表达"
        ]
      } else if (contractType === "技术转让") {
        return [
          "建议明确技术转让的范围和内容",
          "关注技术保密和限制使用条款",
          "制定技术交接和培训计划"
        ]
      } else if (contractType === "合作研发") {
        return [
          "建议明确双方投入和责任分工",
          "关注知识产权归属和利益分配",
          "制定研发风险应对措施"
        ]
      } else if (contractType === "委托加工") {
        return [
          "建议明确加工技术标准和质量要求",
          "关注不合格品处理方式",
          "制定加工过程监督计划"
        ]
      } else {
        return [
          "建议明确合同执行的关键节点和目标",
          "关注合同风险控制条款",
          "制定合同履约监督计划"
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
              <div className="text-xs text-slate-500 mt-2">正在处理合同数据并生成智能洞察...</div>
            </div>
          )}

          <div className="mb-3">
            {isAnalysisUpdated && (
              <div className="flex items-center gap-2 mb-3 text-sm text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100">
                <LayoutGrid className="h-4 w-4" />
                <span className="font-medium">最新分析已更新 - 检测到合同详情</span>
              </div>
            )}
          </div>
          <div className="mb-3">
            {isAnalysisUpdated && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2">
                最新
              </Badge>
            )}
          </div>
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
                    <span>合同评估</span>
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
                    <span>价值评估</span>
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
                    <p>
                      {generateAISummary(true)}
                    </p>
                    <div className="flex items-start gap-4 my-3 py-2">
                      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <div className="text-xs text-slate-600">
                          <span>合同评估</span>
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
                          <span>价值评估</span>
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
                          <span>合同评估</span>
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
                          <span>价值评估</span>
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
