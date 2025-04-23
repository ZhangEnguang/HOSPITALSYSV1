"use client"

import { CheckCircle2, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BudgetStandardFormData } from "./basic-info-form"
import { BudgetItem } from "./budget-items-form"

interface CompletionStepProps {
  formData: {
    basicInfo: Partial<BudgetStandardFormData>,
    budgetItems: {
      budgetItems: BudgetItem[]
    }
  }
}

export default function CompletionStep({ formData }: CompletionStepProps) {
  const { basicInfo, budgetItems } = formData
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-1">预算标准创建完成</h3>
        <p className="text-muted-foreground text-center max-w-md">
          预算标准信息已准备就绪，请确认以下信息无误后提交。
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-base font-medium">基本信息</h4>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">预算标准名称</p>
                <p className="font-medium">{basicInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">编码</p>
                <p className="font-medium">{basicInfo.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">适用项目类型</p>
                <p className="font-medium">{basicInfo.projectType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">限额(元)</p>
                <p className="font-medium">{Number(basicInfo.limitAmount).toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">状态</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    basicInfo.status === '启用' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {basicInfo.status}
                  </span>
                </p>
              </div>
              {basicInfo.description && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">描述</p>
                  <p className="font-medium">{basicInfo.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-medium">预算科目信息</h4>
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-sm font-medium">科目名称</th>
                    <th className="text-left py-2 px-3 text-sm font-medium">编码</th>
                    <th className="text-left py-2 px-3 text-sm font-medium">类别</th>
                    <th className="text-left py-2 px-3 text-sm font-medium">限额(元)</th>
                    <th className="text-left py-2 px-3 text-sm font-medium">比例(%)</th>
                    <th className="text-left py-2 px-3 text-sm font-medium">必填</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetItems.budgetItems.map((item, index) => (
                    <tr key={item.id} className={index !== budgetItems.budgetItems.length - 1 ? "border-b" : ""}>
                      <td className="py-2 px-3">{item.name}</td>
                      <td className="py-2 px-3">{item.code}</td>
                      <td className="py-2 px-3">{item.category}</td>
                      <td className="py-2 px-3">{Number(item.limitAmount).toLocaleString() || '-'}</td>
                      <td className="py-2 px-3">{Number(item.limitPercent) || '-'}</td>
                      <td className="py-2 px-3">{item.isRequired ? '是' : '否'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 