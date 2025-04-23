import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface RisksAndIssuesProps {
  projectId: string
}

interface Risk {
  id: string
  title: string
  description: string
  level: "high" | "medium" | "low"
  impact: string
  suggestion: string
}

export function RisksAndIssues({ projectId }: RisksAndIssuesProps) {
  // 预设的风险分析结果
  const risks: Risk[] = [
    {
      id: "1",
      title: "学术质量风险",
      description: "著作内容的原创性和学术价值可能不足",
      level: "high",
      impact: "影响出版社评审结果和学术影响力",
      suggestion: "加强文献综述和理论创新，突出研究特色和创新点"
    },
    {
      id: "2",
      title: "出版进度风险",
      description: "出版周期可能延长，影响成果产出时间",
      level: "medium",
      impact: "影响项目结题验收和考核指标完成",
      suggestion: "提前与出版社沟通，做好审稿和修改准备工作"
    },
    {
      id: "3",
      title: "知识产权风险",
      description: "引用内容可能存在版权问题",
      level: "medium",
      impact: "可能引发学术纠纷或法律问题",
      suggestion: "严格规范引用标注，必要时获取相关授权"
    },
    {
      id: "4",
      title: "内容一致性风险",
      description: "多位作者合作可能导致内容衔接不够紧密",
      level: "low",
      impact: "影响著作的整体性和可读性",
      suggestion: "加强作者间沟通，统一写作风格和术语使用"
    }
  ]

  // 风险等级样式
  const getLevelStyle = (level: string) => {
    switch (level) {
      case "high":
        return "bg-slate-50 text-red-600 border-slate-200"
      case "medium":
        return "bg-slate-50 text-amber-600 border-slate-200"
      case "low":
        return "bg-slate-50 text-green-600 border-slate-200"
      default:
        return ""
    }
  }

  // 风险等级中文映射
  const levelText = {
    high: "高",
    medium: "中",
    low: "低"
  }

  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span>风险分析</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {risks.map((risk) => (
            <div key={risk.id} className="border rounded-lg bg-slate-50/50">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{risk.title}</span>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs font-normal", getLevelStyle(risk.level))}
                    >
                      {levelText[risk.level]}级风险
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="text-slate-600">
                    <span className="text-slate-700">风险描述：</span>
                    {risk.description}
                  </div>
                  <div className="text-slate-600">
                    <span className="text-slate-700">影响分析：</span>
                    {risk.impact}
                  </div>
                  <div className="bg-white p-3 rounded-md text-slate-600 border border-slate-100">
                    <span className="text-slate-700">改进建议：</span>
                    {risk.suggestion}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 