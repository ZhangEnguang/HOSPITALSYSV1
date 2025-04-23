"use client"

import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface RecommendationsFormProps {
  data: any
  onUpdate: (data: any) => void
  validationErrors?: Record<string, boolean>
}

export default function RecommendationsForm({ data, onUpdate, validationErrors = {} }: RecommendationsFormProps) {
  const [formValues, setFormValues] = useState({
    correctiveActions: data?.correctiveActions || "",
    preventiveActions: data?.preventiveActions || "",
    improvementOpportunities: data?.improvementOpportunities || "",
    followUpDate: data?.followUpDate || "",
    responsibleParty: data?.responsibleParty || "",
  })

  // 使用 ref 跟踪是否表单值已更改
  const formChanged = useRef(false)

  // 当数据从父组件变化时更新本地状态
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormValues({
        correctiveActions: data.correctiveActions || formValues.correctiveActions,
        preventiveActions: data.preventiveActions || formValues.preventiveActions,
        improvementOpportunities: data.improvementOpportunities || formValues.improvementOpportunities,
        followUpDate: data.followUpDate || formValues.followUpDate,
        responsibleParty: data.responsibleParty || formValues.responsibleParty,
      })
    }
    // 仅在data变化时执行
  }, [data])

  // 仅在表单值实际更改时更新父组件
  useEffect(() => {
    if (formChanged.current) {
      onUpdate(formValues)
    } else {
      formChanged.current = true
    }
    // 这里不将onUpdate添加到依赖项中，避免循环更新
  }, [formValues])

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="correctiveActions" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          整改措施
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="correctiveActions"
          value={formValues.correctiveActions}
          onChange={(e) => handleChange("correctiveActions", e.target.value)}
          placeholder="请描述针对发现问题的整改措施"
          className={cn(
            "w-full border-gray-300 rounded-md min-h-[100px]",
            validationErrors.correctiveActions && "border-red-500"
          )}
        />
        {validationErrors.correctiveActions && (
          <p className="text-red-500 text-xs mt-1">请描述整改措施</p>
        )}
      </div>

      <div>
        <Label htmlFor="preventiveActions" className="block text-sm font-medium text-gray-700 mb-1">
          预防措施
        </Label>
        <Textarea
          id="preventiveActions"
          value={formValues.preventiveActions}
          onChange={(e) => handleChange("preventiveActions", e.target.value)}
          placeholder="请描述预防类似问题的措施"
          className="w-full border-gray-300 rounded-md min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="improvementOpportunities" className="block text-sm font-medium text-gray-700 mb-1">
          改进机会
        </Label>
        <Textarea
          id="improvementOpportunities"
          value={formValues.improvementOpportunities}
          onChange={(e) => handleChange("improvementOpportunities", e.target.value)}
          placeholder="请描述可能的改进机会"
          className="w-full border-gray-300 rounded-md min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="followUpDate" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            跟进日期
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="followUpDate"
            type="date"
            value={formValues.followUpDate}
            onChange={(e) => handleChange("followUpDate", e.target.value)}
            className={cn(
              "w-full border-gray-300 rounded-md",
              validationErrors.followUpDate && "border-red-500"
            )}
          />
          {validationErrors.followUpDate && (
            <p className="text-red-500 text-xs mt-1">请选择跟进日期</p>
          )}
        </div>
        <div>
          <Label htmlFor="responsibleParty" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            责任方
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="responsibleParty"
            value={formValues.responsibleParty}
            onChange={(e) => handleChange("responsibleParty", e.target.value)}
            placeholder="请输入责任方"
            className={cn(
              "w-full border-gray-300 rounded-md",
              validationErrors.responsibleParty && "border-red-500"
            )}
          />
          {validationErrors.responsibleParty && (
            <p className="text-red-500 text-xs mt-1">请输入责任方</p>
          )}
        </div>
      </div>
    </div>
  )
}
