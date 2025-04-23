"use client"

import { FileTextIcon } from "lucide-react"
import { FormData } from "../patents-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface StepPatentDetailsProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  validationErrors: Record<string, string>
}

export function StepPatentDetails({ formData, updateFormData, validationErrors }: StepPatentDetailsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    updateFormData(id as keyof FormData, value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <FileTextIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">专利详情</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patentAbstract" className="flex items-center">
            专利摘要 <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="patentAbstract"
            placeholder="请输入专利摘要内容"
            value={formData.patentAbstract || ""}
            onChange={handleInputChange}
            className={cn(
              "min-h-[120px]",
              validationErrors["patentAbstract"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["patentAbstract"] && (
            <p className="text-sm text-destructive">{validationErrors["patentAbstract"]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="disciplineCategory" className="flex items-center">
              学科类别 <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="disciplineCategory"
              placeholder="请输入学科类别"
              value={formData.disciplineCategory || ""}
              onChange={handleInputChange}
              className={cn(
                validationErrors["disciplineCategory"] && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {validationErrors["disciplineCategory"] && (
              <p className="text-sm text-destructive">{validationErrors["disciplineCategory"]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationArea" className="flex items-center">
              应用领域 <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="applicationArea"
              placeholder="请输入应用领域，多个领域请用逗号分隔"
              value={formData.applicationArea || ""}
              onChange={handleInputChange}
              className={cn(
                validationErrors["applicationArea"] && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {validationErrors["applicationArea"] && (
              <p className="text-sm text-destructive">{validationErrors["applicationArea"]}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>技术要点</Label>
          <div className="text-xs text-muted-foreground space-y-1 p-3 border border-input rounded-md bg-muted/50">
            <p>专利技术要点说明：</p>
            <p>1. 明确说明专利的技术特征和创新点</p>
            <p>2. 简要说明与现有技术的区别</p>
            <p>3. 描述专利的应用场景和实际价值</p>
          </div>
        </div>
      </div>
    </div>
  )
} 