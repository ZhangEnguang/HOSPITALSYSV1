"use client"

import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { ApplicationFormData, FormMode } from "../types"

interface StepCompleteProps {
  formData: ApplicationFormData
  onSubmit?: () => Promise<void>
  isSubmitting?: boolean
  mode?: FormMode
  hiddenFields?: string[]
}

export function StepComplete({
  formData,
  onSubmit,
  isSubmitting = false,
  mode = FormMode.CREATE,
  hiddenFields = [],
}: StepCompleteProps) {
  const isViewMode = mode === FormMode.VIEW
  
  const isFieldHidden = (fieldName: string) => {
    return hiddenFields.includes(fieldName)
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="space-y-6 p-0">
        <div className="text-center py-4">
          <div className="rounded-full bg-primary/10 p-3 inline-flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {isViewMode ? "申报批次信息" : "申报信息确认"}
          </h3>
          <p className="text-muted-foreground">
            {isViewMode 
              ? "以下是申报批次的详细信息" 
              : "请确认以下申报信息是否正确，确认后点击提交按钮完成创建"}
          </p>
        </div>

        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">基本信息</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {!isFieldHidden('name') && (
              <div>
                <span className="text-muted-foreground">申报名称：</span>
                <span className="font-medium">{formData.name || "--"}</span>
              </div>
            )}
            {!isFieldHidden('type') && (
              <div>
                <span className="text-muted-foreground">申报类型：</span>
                <span>{formData.type || "--"}</span>
              </div>
            )}
            {!isFieldHidden('category') && (
              <div>
                <span className="text-muted-foreground">所属学科分类：</span>
                <span>{formData.category || "--"}</span>
              </div>
            )}
            {!isFieldHidden('startDate') && (
              <div>
                <span className="text-muted-foreground">开始日期：</span>
                <span>
                  {formData.startDate instanceof Date
                    ? format(formData.startDate, "yyyy-MM-dd")
                    : "--"}
                </span>
              </div>
            )}
            {!isFieldHidden('endDate') && (
              <div>
                <span className="text-muted-foreground">结束日期：</span>
                <span>
                  {formData.endDate instanceof Date
                    ? format(formData.endDate, "yyyy-MM-dd")
                    : "--"}
                </span>
              </div>
            )}
            {!isFieldHidden('amount') && (
              <div>
                <span className="text-muted-foreground">预算总额：</span>
                <span>{formData.amount ? `${formData.amount} 万元` : "--"}</span>
              </div>
            )}
          </div>
        </div>

        {!isFieldHidden('materials') && formData.materials.length > 0 && (
          <div className="space-y-4 border rounded-md p-4">
            <h4 className="font-medium">申报材料</h4>
            <ul className="space-y-2 text-sm">
              {formData.materials.map((material) => (
                <li key={material.id} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <div>
                    <div className="font-medium">{material.name}</div>
                    {material.description && (
                      <div className="text-muted-foreground text-xs mt-1">
                        {material.description}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isFieldHidden('keyDates') && formData.keyDates.length > 0 && (
          <div className="space-y-4 border rounded-md p-4">
            <h4 className="font-medium">关键时间节点</h4>
            <ul className="space-y-2 text-sm">
              {formData.keyDates.map((date) => (
                <li key={date.id} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <div>
                    <span className="font-medium">{date.name}：</span>
                    <span>
                      {date.date instanceof Date ? format(date.date, "yyyy-MM-dd") : "未设置"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isFieldHidden('requirements') && formData.requirements.length > 0 && (
          <div className="space-y-4 border rounded-md p-4">
            <h4 className="font-medium">特殊要求</h4>
            <ul className="space-y-2 text-sm">
              {formData.requirements.map((requirement) => (
                <li key={requirement.id} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <div>{requirement.content}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isFieldHidden('notes') && formData.notes && (
          <div className="space-y-4 border rounded-md p-4">
            <h4 className="font-medium">备注说明</h4>
            <div className="text-sm whitespace-pre-wrap">{formData.notes}</div>
          </div>
        )}

        {!isViewMode && onSubmit && (
          <div className="flex justify-center pt-4">
            <Button 
              onClick={onSubmit} 
              disabled={isSubmitting}
              className="w-full max-w-xs bg-primary"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  正在提交...
                </>
              ) : (
                "确认并提交"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
