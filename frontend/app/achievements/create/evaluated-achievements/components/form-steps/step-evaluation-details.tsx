"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepEvaluationDetailsProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepEvaluationDetails({ formData, updateFormData, validationErrors }: StepEvaluationDetailsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    updateFormData(id, value)
    
    // 清除验证错误
    if (validationErrors[id]) {
      const newErrors = { ...validationErrors }
      delete newErrors[id]
      updateFormData("validationErrors", newErrors)
    }
  }

  const handleRadioChange = (value: string) => {
    updateFormData("isPassed", value)
    
    // 清除验证错误
    if (validationErrors["是否通过鉴定"]) {
      const newErrors = { ...validationErrors }
      delete newErrors["是否通过鉴定"]
      updateFormData("validationErrors", newErrors)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">鉴定详情</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-medium flex items-center">
            成果简介 <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="summary"
            className={cn(
              "min-h-[150px]",
              validationErrors["成果简介"] && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="请输入成果简介"
            value={formData.summary || ""}
            onChange={handleInputChange}
          />
          {validationErrors["成果简介"] && (
            <p className="text-sm text-destructive">请输入成果简介</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">鉴定专家信息</h3>

          <div className="space-y-2">
            <Label htmlFor="expertNames" className="text-sm font-medium flex items-center">
              专家姓名 <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="expertNames"
              className={cn(
                validationErrors["专家姓名"] && "border-destructive focus-visible:ring-destructive"
              )}
              placeholder="请输入专家姓名，用逗号分隔"
              value={formData.expertNames || ""}
              onChange={handleInputChange}
            />
            {validationErrors["专家姓名"] && (
              <p className="text-sm text-destructive">请输入专家姓名</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertTitles" className="text-sm font-medium">
              专家职称
            </Label>
            <Input
              id="expertTitles"
              placeholder="请输入专家职称，用逗号分隔"
              value={formData.expertTitles || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertUnits" className="text-sm font-medium">
              专家单位
            </Label>
            <Input
              id="expertUnits"
              placeholder="请输入专家单位，用逗号分隔"
              value={formData.expertUnits || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              是否通过鉴定 <span className="text-destructive ml-1">*</span>
            </Label>
            <RadioGroup
              value={formData.isPassed || ""}
              onValueChange={handleRadioChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="yes" 
                  id="is-passed-yes"
                  className={cn(
                    validationErrors["是否通过鉴定"] && "border-destructive"
                  )}
                />
                <Label htmlFor="is-passed-yes">是</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="no" 
                  id="is-passed-no"
                  className={cn(
                    validationErrors["是否通过鉴定"] && "border-destructive"
                  )}
                />
                <Label htmlFor="is-passed-no">否</Label>
              </div>
            </RadioGroup>
            {validationErrors["是否通过鉴定"] && (
              <p className="text-sm text-destructive">请选择是否通过鉴定</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
