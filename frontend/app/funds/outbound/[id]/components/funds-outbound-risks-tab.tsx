"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, HelpCircle } from "lucide-react"

interface FundsOutboundRisksTabProps {
  data: any
}

export default function FundsOutboundRisksTab({ data }: FundsOutboundRisksTabProps) {
  // 根据经费类别生成不同的风险点
  const getRisks = () => {
    if (data.category === "合作经费") {
      return [
        {
          id: "risk1",
          level: "中",
          title: "合作单位资质风险",
          description: "合作单位资质不符合要求，可能导致经费使用不合规",
          solution: "审核合作单位资质，确保符合相关规定"
        },
        {
          id: "risk2",
          level: "高",
          title: "经费使用监管风险",
          description: "合作单位经费使用缺乏有效监管，可能导致资金使用不当",
          solution: "建立定期报告机制，加强经费使用监管"
        },
        {
          id: "risk3",
          level: "低",
          title: "成果交付风险",
          description: "合作单位未按约定交付研究成果",
          solution: "明确成果交付时间节点，建立考核机制"
        }
      ]
    } else if (data.category === "设备采购") {
      return [
        {
          id: "risk1",
          level: "中",
          title: "采购合规风险",
          description: "设备采购流程不合规，可能导致审计问题",
          solution: "严格按照采购制度执行，保留完整采购记录"
        },
        {
          id: "risk2",
          level: "高",
          title: "设备质量风险",
          description: "采购设备质量不符合要求，影响项目进展",
          solution: "制定详细技术参数，严格验收流程"
        }
      ]
    } else {
      return [
        {
          id: "risk1",
          level: "中",
          title: "经费外拨合规风险",
          description: "经费外拨不符合项目预算或财务规定",
          solution: "严格按照预算和财务制度执行外拨"
        },
        {
          id: "risk2",
          level: "低",
          title: "账务处理风险",
          description: "账务处理不及时或不准确",
          solution: "及时准确记录账务，定期核对"
        }
      ]
    }
  }

  // 常见问题
  const commonQuestions = [
    {
      question: "经费外拨需要哪些审批手续？",
      answer: "经费外拨需要项目负责人提出申请，经部门负责人、财务部门审核后，由学校分管领导审批。金额较大的外拨还需要校长或校务会审批。"
    },
    {
      question: "经费外拨后如何监管资金使用？",
      answer: "可通过要求接收单位定期提交经费使用报告、不定期抽查、成果验收等方式监管资金使用情况。"
    },
    {
      question: "经费外拨的账务如何处理？",
      answer: "经费外拨需要在财务系统中进行专项登记，记录外拨金额、接收单位、用途等信息，并保留相关合同、协议等证明材料。"
    }
  ]

  const risks = getRisks()

  return (
    <div className="space-y-6">
      {/* 风险评估 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
            风险评估
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
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
            常见问题
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
