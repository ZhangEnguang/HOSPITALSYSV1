"use client"

import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FindingsFormProps {
  data: any
  onUpdate: (data: any) => void
  validationErrors?: Record<string, boolean>
}

export default function FindingsForm({ data, onUpdate, validationErrors = {} }: FindingsFormProps) {
  const [formValues, setFormValues] = useState({
    observations: data?.observations || "",
    nonConformities: data?.nonConformities || "",
    evidenceCollected: data?.evidenceCollected || "",
    riskLevel: data?.riskLevel || "",
  })

  // 使用 ref 跟踪是否表单值已更改
  const formChanged = useRef(false)

  // 当数据从父组件变化时更新本地状态
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormValues({
        observations: data.observations || formValues.observations,
        nonConformities: data.nonConformities || formValues.nonConformities,
        evidenceCollected: data.evidenceCollected || formValues.evidenceCollected,
        riskLevel: data.riskLevel || formValues.riskLevel,
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
        <Label htmlFor="observations" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          观察发现
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="observations"
          value={formValues.observations}
          onChange={(e) => handleChange("observations", e.target.value)}
          placeholder="请描述检查过程中的观察发现"
          className={cn(
            "w-full border-gray-300 rounded-md min-h-[100px]",
            validationErrors.observations && "border-red-500"
          )}
        />
        {validationErrors.observations && (
          <p className="text-red-500 text-xs mt-1">请描述观察发现</p>
        )}
      </div>

      <div>
        <Label htmlFor="nonConformities" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          不符合项
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="nonConformities"
          value={formValues.nonConformities}
          onChange={(e) => handleChange("nonConformities", e.target.value)}
          placeholder="请描述发现的不符合项"
          className={cn(
            "w-full border-gray-300 rounded-md min-h-[100px]",
            validationErrors.nonConformities && "border-red-500"
          )}
        />
        {validationErrors.nonConformities && (
          <p className="text-red-500 text-xs mt-1">请描述不符合项</p>
        )}
      </div>

      <div>
        <Label htmlFor="evidenceCollected" className="block text-sm font-medium text-gray-700 mb-1">
          收集的证据
        </Label>
        <Textarea
          id="evidenceCollected"
          value={formValues.evidenceCollected}
          onChange={(e) => handleChange("evidenceCollected", e.target.value)}
          placeholder="请描述收集的证据"
          className="w-full border-gray-300 rounded-md min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="riskLevel" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          风险等级
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select 
          value={formValues.riskLevel} 
          onValueChange={(value) => handleChange("riskLevel", value)}
        >
          <SelectTrigger 
            id="riskLevel" 
            className={cn(
              "w-full border-gray-300",
              validationErrors.riskLevel && "border-red-500"
            )}
          >
            <SelectValue placeholder="请选择风险等级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">低风险</SelectItem>
            <SelectItem value="medium">中风险</SelectItem>
            <SelectItem value="high">高风险</SelectItem>
            <SelectItem value="critical">严重风险</SelectItem>
          </SelectContent>
        </Select>
        {validationErrors.riskLevel && (
          <p className="text-red-500 text-xs mt-1">请选择风险等级</p>
        )}
      </div>
    </div>
  )
}
