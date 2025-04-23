"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepContentDetailsProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepContentDetails({ formData, updateFormData, validationErrors }: StepContentDetailsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData(name, value)
    
    // 清除验证错误
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors }
      delete newErrors[name]
      updateFormData("validationErrors", newErrors)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">著作内容详情</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-medium flex items-center">
            内容简介 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea 
            id="summary" 
            name="summary" 
            placeholder="请输入著作内容简介" 
            value={formData.summary || ""}
            onChange={handleInputChange}
            className={cn(
              "resize-none min-h-[120px]",
              validationErrors["内容简介"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["内容简介"] && (
            <p className="text-sm text-red-500">请输入内容简介</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-sm font-medium flex items-center">
            关键词 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="keywords" 
            name="keywords" 
            placeholder="请输入关键词，用逗号分隔" 
            value={formData.keywords || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["关键词"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["关键词"] && (
            <p className="text-sm text-red-500">请输入关键词</p>
          )}
          <p className="text-xs text-muted-foreground">请用逗号分隔多个关键词</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="awards" className="text-sm font-medium">
            获奖情况
          </Label>
          <Textarea 
            id="awards" 
            name="awards" 
            placeholder="请输入著作获奖情况（如有）" 
            value={formData.awards || ""}
            onChange={handleInputChange}
            className="resize-none min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="citation" className="text-sm font-medium">
            引用情况
          </Label>
          <Textarea 
            id="citation" 
            name="citation" 
            placeholder="请输入引用情况（如有）" 
            value={formData.citation || ""}
            onChange={handleInputChange}
            className="resize-none min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            备注
          </Label>
          <Textarea 
            id="notes" 
            name="notes" 
            placeholder="其他需要说明的情况" 
            value={formData.notes || ""}
            onChange={handleInputChange}
            className="resize-none min-h-[80px]"
          />
        </div>
      </div>
    </div>
  )
} 