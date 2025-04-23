"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, HelpCircle } from "lucide-react"

interface AcademicPaperRisksTabProps {
  data: any
}

export default function AcademicPaperRisksTab({ data }: AcademicPaperRisksTabProps) {
  // 根据论文状态生成不同的风险点
  const getRisks = () => {
    if (data.status === "已发表") {
      return [
        {
          id: "risk1",
          level: "中",
          title: "学术不端风险",
          description: "论文内容可能存在与其他已发表论文相似的部分，可能引发学术不端争议",
          solution: "使用学术不端检测系统进行全面检查，确保论文内容的原创性"
        },
        {
          id: "risk2",
          level: "低",
          title: "版权风险",
          description: "论文中使用的图表、数据等内容可能涉及版权问题",
          solution: "确保所有引用内容均已获得适当授权或符合合理使用原则"
        },
        {
          id: "risk3",
          level: "低",
          title: "数据可靠性风险",
          description: "论文中的实验数据可能存在准确性或可重复性问题",
          solution: "保存完整的实验记录和原始数据，确保研究过程可追溯和可重复"
        }
      ]
    } else if (data.status === "审核中") {
      return [
        {
          id: "risk1",
          level: "高",
          title: "审稿意见风险",
          description: "论文可能因方法学问题或创新性不足被拒稿",
          solution: "提前准备修改方案，针对可能的审稿意见做好充分准备"
        },
        {
          id: "risk2",
          level: "中",
          title: "研究方法风险",
          description: "论文中使用的研究方法可能被审稿人质疑",
          solution: "详细说明研究方法的选择理由和适用性，提供充分的方法学依据"
        },
        {
          id: "risk3",
          level: "中",
          title: "时效性风险",
          description: "审稿周期过长可能导致研究成果时效性降低",
          solution: "持续关注研究领域最新进展，准备在修改稿中更新相关内容"
        }
      ]
    } else {
      return [
        {
          id: "risk1",
          level: "高",
          title: "进度风险",
          description: "论文撰写进度可能滞后，影响项目整体进度",
          solution: "制定详细的论文撰写计划，设置明确的时间节点和里程碑"
        },
        {
          id: "risk2",
          level: "中",
          title: "质量风险",
          description: "论文质量不达标，可能影响后续发表",
          solution: "邀请领域专家进行内部评审，提前发现并解决潜在问题"
        },
        {
          id: "risk3",
          level: "中",
          title: "协作风险",
          description: "多作者协作可能导致内容不一致或沟通不畅",
          solution: "明确各作者职责和贡献，建立有效的协作机制和沟通渠道"
        }
      ]
    }
  }

  // 常见问题
  const commonQuestions = [
    {
      question: "如何提高论文被高水平期刊接收的可能性？",
      answer: "选择热点研究方向，确保研究方法严谨，结果可靠且有创新性，论文结构清晰，语言表达准确，参考文献全面且最新，并严格按照目标期刊的投稿要求准备稿件。"
    },
    {
      question: "论文被拒后应该如何处理？",
      answer: "仔细分析审稿意见，区分必须修改和可选修改的内容，根据意见进行有针对性的修改，必要时可考虑更换投稿期刊，但不要简单地将同一稿件投递给多个期刊。"
    },
    {
      question: "如何避免学术不端问题？",
      answer: "确保研究数据真实可靠，引用他人成果时进行准确引用和标注，使用学术不端检测系统检查论文，遵循学术规范和伦理准则，保持研究过程的透明度。"
    },
    {
      question: "如何处理合作作者之间的贡献排序问题？",
      answer: "根据各作者在研究中的实际贡献确定排序，包括研究设计、数据收集、分析解释、论文撰写等方面的工作量，在论文投稿前应与所有作者就排序达成一致意见。"
    }
  ]

  const risks = getRisks()

  return (
    <div className="space-y-6">
      {/* 风险评估 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span>风险评估</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {risks.map((risk) => (
              <div key={risk.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center">
                    {risk.title}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={
                      risk.level === "高" 
                        ? "bg-red-50 text-red-700 border-red-200" 
                        : risk.level === "中"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-green-50 text-green-700 border-green-200"
                    }
                  >
                    {risk.level}风险
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-2">{risk.description}</p>
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-sm font-medium">建议措施</p>
                  <p className="text-sm text-slate-600">{risk.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 常见问题 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            <span>常见问题</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commonQuestions.map((item, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-medium mb-2">{item.question}</h3>
                <p className="text-sm text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
