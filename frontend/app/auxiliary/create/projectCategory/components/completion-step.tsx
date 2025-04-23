"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Check } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dict } from "@/components/dict"

// 预算项接口
interface BudgetItem {
  name: string
  startDate?: string
  endDate?: string
  note?: string
}

interface CompletionStepProps {
  formData: {
    basicInfo: any
    budgetInfo: any
  }
}

export default function CompletionStep({ formData }: CompletionStepProps) {
  const { basicInfo, budgetInfo } = formData

  // 获取预算类型文本
  const getBudgetTypeText = (type: string): string => {
    switch (type) {
      case 'fixed': return '固定额度';
      case 'percent': return '百分比';
      case 'dynamic': return '动态计算';
      default: return type;
    }
  }

  // 获取父级分类文本
  const getParentCategoryText = (id: string): string => {
    return id || '-';  // 这里应从父分类列表中获取，暂时直接返回ID
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-8">
        <div className="rounded-full bg-primary/10 p-2 mb-4">
          <Check className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>项目分类的基本信息</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">名称</dt>
                <dd className="mt-1 text-sm">{basicInfo.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">编码</dt>
                <dd className="mt-1 text-sm">{basicInfo.code || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">项目级别</dt>
                <dd className="mt-1 text-sm"><Dict dictCode="project_level" displayType="tag" value={basicInfo.projectLevel}/></dd>
              </div>
              {basicInfo.parentId && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">上级分类</dt>
                  <dd className="mt-1 text-sm">{getParentCategoryText(basicInfo.parentId)}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-muted-foreground">项目类别</dt>
                <dd className="mt-1 text-sm"><Dict dictCode="project_type" displayType="tag" value={basicInfo.category}/></dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">财务账号</dt>
                <dd className="mt-1 text-sm">{basicInfo.feeCode || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">教育部统计归属</dt>
                <dd className="mt-1 text-sm">{basicInfo.eduStatistics || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">项目来源</dt>
                <dd className="mt-1 text-sm">{basicInfo.projectSource || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">支付来源</dt>
                <dd className="mt-1 text-sm">{basicInfo.paymentSource || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">预算管控</dt>
                <dd className="mt-1 text-sm">{basicInfo.budgetControl ? '是' : '否'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">状态</dt>
                <dd className="mt-1 text-sm">
                  {basicInfo.isUsed === true || basicInfo.isUsed === "true" ? "启用" : "停用"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">备注</dt>
                <dd className="mt-1 text-sm">{basicInfo.note || '-'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>预算信息</CardTitle>
            <CardDescription>项目分类的预算标准设置</CardDescription>
          </CardHeader>
          <CardContent>
            <h4 className="text-sm font-medium mb-3">预算标准列表</h4>
            {budgetInfo.budgetItems?.length > 0 ? (
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 text-sm font-medium">预算标准名称</th>
                      <th className="text-left p-2 text-sm font-medium">开始时间</th>
                      <th className="text-left p-2 text-sm font-medium">结束时间</th>
                      <th className="text-left p-2 text-sm font-medium">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetInfo.budgetItems.map((item: BudgetItem, index: number) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-2 text-sm"><Dict dictCode="budget_standard" value={item.name} displayType="text" /></td>
                        <td className="p-2 text-sm">{item.startDate || '-'}</td>
                        <td className="p-2 text-sm">{item.endDate || '-'}</td>
                        <td className="p-2 text-sm">{item.note || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">未设置预算标准</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 