"use client"

import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface InspectionDetailsFormProps {
  data: any
  onUpdate: (data: any) => void
  validationErrors?: Record<string, boolean>
}

export default function InspectionDetailsForm({ data, onUpdate, validationErrors = {} }: InspectionDetailsFormProps) {
  const [formValues, setFormValues] = useState({
    inspectionScope: data?.inspectionScope || "",
    methodology: data?.methodology || "",
    standards: data?.standards || "",
    participants: data?.participants || "",
  })

  // 使用 ref 跟踪是否表单值已更改
  const formChanged = useRef(false)

  // 当数据从父组件变化时更新本地状态
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormValues({
        inspectionScope: data.inspectionScope || formValues.inspectionScope,
        methodology: data.methodology || formValues.methodology,
        standards: data.standards || formValues.standards,
        participants: data.participants || formValues.participants,
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
        <Label htmlFor="inspectionScope" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          检查范围
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="inspectionScope"
          value={formValues.inspectionScope}
          onChange={(e) => handleChange("inspectionScope", e.target.value)}
          placeholder="请描述检查范围"
          className={cn(
            "w-full border-gray-300 rounded-md min-h-[100px]",
            validationErrors.inspectionScope && "border-red-500"
          )}
        />
        {validationErrors.inspectionScope && (
          <p className="text-red-500 text-xs mt-1">请描述检查范围</p>
        )}
      </div>

      <div>
        <Label htmlFor="methodology" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          检查方法
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="methodology"
          value={formValues.methodology}
          onChange={(e) => handleChange("methodology", e.target.value)}
          placeholder="请描述检查方法"
          className={cn(
            "w-full border-gray-300 rounded-md min-h-[100px]",
            validationErrors.methodology && "border-red-500"
          )}
        />
        {validationErrors.methodology && (
          <p className="text-red-500 text-xs mt-1">请描述检查方法</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="standards" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            检查标准
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="standards"
            value={formValues.standards}
            onChange={(e) => handleChange("standards", e.target.value)}
            placeholder="请输入检查标准"
            className={cn(
              "w-full border-gray-300 rounded-md",
              validationErrors.standards && "border-red-500"
            )}
          />
          {validationErrors.standards && (
            <p className="text-red-500 text-xs mt-1">请输入检查标准</p>
          )}
        </div>
        <div>
          <Label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
            参与人员
          </Label>
          <Input
            id="participants"
            value={formValues.participants}
            onChange={(e) => handleChange("participants", e.target.value)}
            placeholder="请输入参与检查人员"
            className="w-full border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  )
}
