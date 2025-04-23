"use client"

import { Bot, Sparkles } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AIAssistantProps {
  setCommentText: (text: string) => void
  setIsAiAnalyzing: (isAnalyzing: boolean) => void
  setIsTypingAI: (isTyping: boolean) => void
  setHasAiGenerated: (hasGenerated: boolean) => void
  setShowAIButton: (show: boolean) => void
  setIsAIButtonVisible: (isVisible: boolean) => void
  setCanScroll: (canScroll: boolean) => void
  typingIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>
  commentText: string
}

export function AIAssistant({
  setCommentText,
  setIsAiAnalyzing,
  setIsTypingAI,
  setHasAiGenerated,
  setShowAIButton,
  setIsAIButtonVisible,
  setCanScroll,
  typingIntervalRef,
  commentText,
}: AIAssistantProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // AI生成的审核意见示例
  const aiResponses = {
    approve: [
      "经审核，该项目研究方向符合学校重点发展领域，研究内容具有创新性和可行性。项目团队结构合理，研究计划详实，预期成果明确。经费预算合理，资源配置适当。建议按计划执行，定期跟进项目进展情况。",
      "该项目立足学科前沿，研究方向明确，技术路线清晰。项目负责人学术背景扎实，团队配置合理。项目预期成果对学科发展和人才培养具有积极意义。经费使用计划详细且合理。同意立项并建议加强与相关学科的交叉融合，扩大研究影响力。",
      "项目选题具有重要的理论价值和应用前景，研究内容充分体现了学科交叉融合的特点。研究方案设计科学，技术路线可行。项目团队实力雄厚，具备完成研究的能力。经费预算合理，资源配置适当。建议加强阶段性成果的凝练和推广应用。",
    ],
    reject: [
      "经审核，该项目存在以下问题需要修改完善：1. 研究内容与申请人研究方向关联度不足；2. 研究方案缺乏创新性，与已有研究重复度高；3. 项目预期成果不够明确；4. 经费预算部分项目偏高，需要调整优化。请根据以上意见进行修改后重新提交。",
      "项目申请材料存在以下问题：1. 研究背景和文献综述不够全面，缺少国内外最新研究进展；2. 研究方法部分缺乏创新性，建议结合多学科交叉方法；3. 经费预算中设备采购比例过高，需要调整；4. 研究团队中缺少跨学科合作人员。请修改完善后重新提交。",
      "该项目需要进一步完善：1. 研究目标过于宽泛，缺乏具体可考核的指标；2. 技术路线不够清晰，关键技术难点及解决方案描述不足；3. 项目实施方案缺乏可行性分析；4. 预期成果与研究内容不够匹配；5. 经费预算结构不合理，人员费用比例过高。请修改后重新提交。",
    ],
    suggestion: [
      "建议项目组进一步明确研究的创新点和关键技术难点，加强与国内外同类研究的对比分析，突出本项目的特色和优势。同时建议完善研究团队的分工与合作机制，明确各成员的职责和贡献。",
      "建议加强项目的理论基础和方法论研究，进一步明确研究的理论框架和技术路线。同时建议细化研究计划，设置合理的里程碑节点和考核指标，便于项目实施过程中的监督和管理。",
      "建议项目组加强与相关领域专家的合作交流，拓展研究视野，提升研究水平。同时建议完善成果转化和应用推广计划，增强项目的社会效益和经济价值。",
    ],
  }

  // 模拟AI分析和生成过程
  const simulateAIGeneration = (responseType: "approve" | "reject" | "suggestion") => {
    // 关闭下拉菜单
    setIsDropdownOpen(false)

    // 禁止滚动，防止用户在AI生成过程中操作界面
    setCanScroll(false)

    // 显示AI分析中状态
    setIsAiAnalyzing(true)

    // 随机选择一个响应
    const responses = aiResponses[responseType]
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)]

    // 模拟AI分析过程
    setTimeout(() => {
      // 分析完成，开始打字效果
      setIsAiAnalyzing(false)
      setIsTypingAI(true)

      let index = 0
      const text = selectedResponse

      // 清除之前的打字效果
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }

      // 创建新的打字效果
      typingIntervalRef.current = setInterval(() => {
        if (index <= text.length) {
          // 如果有原始文本，保留并添加AI生成的文本
          if (commentText.trim()) {
            setCommentText(commentText + "\n\n" + text.substring(0, index))
          } else {
            setCommentText(text.substring(0, index))
          }
          index++
        } else {
          // 打字效果完成
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
          }
          setIsTypingAI(false)
          setHasAiGenerated(true)
          setShowAIButton(false)
          setIsAIButtonVisible(false)
          setCanScroll(true)
        }
      }, 30) // 调整速度，数值越小越快
    }, 1500) // 模拟分析时间
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors duration-200 border border-blue-200">
          <Bot className="h-3.5 w-3.5" />
          AI辅助
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-1.5 border-slate-200 shadow-lg animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
        <DropdownMenuItem
          onClick={() => simulateAIGeneration("approve")}
          className="cursor-pointer px-3 py-2.5 text-sm rounded-md hover:bg-green-50 focus:bg-green-50 flex items-center gap-2 transition-colors duration-200"
        >
          <Sparkles className="h-3.5 w-3.5 text-green-500" />
          <span className="text-green-700">生成通过意见</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => simulateAIGeneration("reject")}
          className="cursor-pointer px-3 py-2.5 text-sm rounded-md hover:bg-red-50 focus:bg-red-50 flex items-center gap-2 transition-colors duration-200"
        >
          <Sparkles className="h-3.5 w-3.5 text-red-500" />
          <span className="text-red-700">生成退回意见</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => simulateAIGeneration("suggestion")}
          className="cursor-pointer px-3 py-2.5 text-sm rounded-md hover:bg-blue-50 focus:bg-blue-50 flex items-center gap-2 transition-colors duration-200"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-blue-700">生成建议意见</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
