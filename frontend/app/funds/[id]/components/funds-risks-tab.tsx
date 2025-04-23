"use client"

import { AlertTriangle, AlertCircle, CheckCircle, HelpCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FundsRisksTabProps {
  data: any
}

export default function FundsRisksTab({ data }: FundsRisksTabProps) {
  // 根据经费类型和金额生成不同的风险提示
  const generateRisks = () => {
    const risks = []
    
    // 根据经费类型生成风险
    if (data.category === "纵向项目经费") {
      risks.push({
        title: "预算执行风险",
        description: "纵向项目经费需严格按照预算执行，预算调整需履行相应审批程序。",
        level: "中",
        status: "需关注"
      })
      risks.push({
        title: "结题验收风险",
        description: "项目结题时需提交完整的经费使用报告，确保资金使用合规。",
        level: "中",
        status: "需关注"
      })
    } else if (data.category === "横向项目经费") {
      risks.push({
        title: "合同履约风险",
        description: "横向项目经费使用需符合合同约定，注意按时交付成果。",
        level: "低",
        status: "可控"
      })
    }
    
    // 根据金额大小生成风险
    if (data.amount > 500000) {
      risks.push({
        title: "大额资金管理风险",
        description: "大额资金需加强监管，严格执行大额资金使用审批流程。",
        level: "高",
        status: "需严控"
      })
    }
    
    // 如果没有风险，添加一个默认项
    if (risks.length === 0) {
      risks.push({
        title: "暂无明显风险",
        description: "当前经费入账暂未发现明显风险点，请按照正常流程管理使用。",
        level: "低",
        status: "良好"
      })
    }
    
    return risks
  }
  
  const risks = generateRisks()
  
  return (
    <div className="space-y-6">
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">风险评估</span>
          </div>
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <div key={index} className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {risk.level === "高" ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : risk.level === "中" ? (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900">{risk.title}</h3>
                      <Badge 
                        className={
                          risk.status === "需严控" 
                            ? "bg-red-50 text-red-700 border-red-200" 
                            : risk.status === "需关注" 
                              ? "bg-amber-50 text-amber-700 border-amber-200" 
                              : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        {risk.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{risk.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">常见问题</span>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">经费入账后如何使用？</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    经费入账后，需按照项目预算和学校财务制度规定使用。大额支出需履行审批流程，小额支出可按照简化程序办理。
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">经费使用有哪些注意事项？</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    经费使用需符合项目预算和相关财务制度，保留完整的票据和合同等原始凭证，定期核对账目，确保资金使用合规有效。
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">如何查询经费余额？</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    可通过财务系统查询经费余额和使用明细，也可向财务部门申请打印经费使用明细表。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
