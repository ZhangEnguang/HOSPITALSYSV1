"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { FormData } from "../../page"

interface StepCompleteProps {
  formData: FormData
  onSubmit: () => void
  isSubmitting: boolean
}

export function StepComplete({ formData, onSubmit, isSubmitting }: StepCompleteProps) {
  // 时间格式化函数
  const formatDate = (date: Date | string) => {
    if (!date) return ""
    if (typeof date === "string") return date
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="text-primary h-5 w-5" />
          您已完成所有信息的填写
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">申请计划信息概要</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">申请计划名称</p>
              <p className="text-sm">{formData.name}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">项目分类</p>
              <p className="text-sm">{formData.category}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">申请开始日期</p>
              <p className="text-sm">{formatDate(formData.startDate)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">申请结束日期</p>
              <p className="text-sm">{formatDate(formData.endDate)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">到期自动结束</p>
              <p className="text-sm">{formData.autoEnd === "yes" ? "是" : "否"}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">是否可转入评审</p>
              <p className="text-sm">{formData.canReview === "yes" ? "是" : "否"}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">是否单位限额</p>
              <p className="text-sm">{formData.hasQuota === "yes" ? "是" : "否"}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">申请指南</p>
            <p className="text-sm whitespace-pre-wrap bg-background p-3 rounded border">{formData.guide}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">申报材料清单</h3>
          <div className="border rounded-lg divide-y">
            {formData.materials.length > 0 ? (
              formData.materials.map((material, index) => (
                material.name && (
                  <div key={material.id} className="p-3 flex items-center">
                    <div className="mr-4 bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{material.name}</p>
                      {material.description && <p className="text-sm text-muted-foreground">{material.description}</p>}
                    </div>
                  </div>
                )
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">暂无申报材料</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">时间节点</h3>
          <div className="border rounded-lg divide-y">
            {formData.keyDates.length > 0 ? (
              formData.keyDates.map((date, index) => (
                date.name && (
                  <div key={date.id} className="p-3 flex items-center">
                    <div className="mr-4 bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{date.name}</p>
                    </div>
                    <div className="text-sm">{formatDate(date.date)}</div>
                  </div>
                )
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">暂无时间节点</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">特殊要求</h3>
          <div className="border rounded-lg divide-y">
            {formData.requirements.length > 0 ? (
              formData.requirements.map((req, index) => (
                req.content && (
                  <div key={req.id} className="p-3 flex items-start">
                    <div className="mr-4 bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p>{req.content}</p>
                    </div>
                  </div>
                )
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">暂无特殊要求</div>
            )}
          </div>
        </div>

        {formData.notes && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">备注</h3>
            <p className="text-sm whitespace-pre-wrap bg-background p-3 rounded border">{formData.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "提交中..." : "提交申报"}
        </Button>
      </CardFooter>
    </Card>
  )
}
