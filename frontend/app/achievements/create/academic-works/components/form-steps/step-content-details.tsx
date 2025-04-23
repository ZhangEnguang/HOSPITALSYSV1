"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepContentDetailsProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepContentDetails({ formData, updateFormData, validationErrors }: StepContentDetailsProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">内容详情</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-medium flex items-center">
            内容简介 <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="summary"
            className={cn(
              "min-h-[150px]",
              validationErrors["内容简介"] && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="请输入内容简介"
            value={formData.summary || ""}
            onChange={handleInputChange}
          />
          {validationErrors["内容简介"] && (
            <p className="text-sm text-destructive">请输入内容简介</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-sm font-medium flex items-center">
            关键词 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="keywords"
            className={cn(
              validationErrors["关键词"] && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder="请输入关键词，用逗号分隔"
            value={formData.keywords || ""}
            onChange={handleInputChange}
          />
          {validationErrors["关键词"] && (
            <p className="text-sm text-destructive">请输入关键词</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="series" className="text-sm font-medium">
            丛书名称
          </Label>
          <Input
            id="series"
            placeholder="请输入丛书名称"
            value={formData.series || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="awards" className="text-sm font-medium">
            获奖情况
          </Label>
          <Input
            id="awards"
            placeholder="请输入获奖情况"
            value={formData.awards || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
}
