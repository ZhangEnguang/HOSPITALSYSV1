"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon } from "lucide-react"
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

  const handleSelectChange = (field: string, value: string) => {
    updateFormData(field, value)
    
    // 清除验证错误
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors }
      delete newErrors[field]
      updateFormData("validationErrors", newErrors)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">鉴定成果详情</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-medium flex items-center">
            成果简介 <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea 
            id="summary" 
            placeholder="请简要描述成果的创新点、应用价值和社会效益等" 
            value={formData.summary || ""}
            onChange={handleInputChange}
            className={cn(
              "min-h-36",
              validationErrors["成果简介"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["成果简介"] && (
            <p className="text-sm text-destructive">请输入成果简介</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="expertNames" className="text-sm font-medium flex items-center">
              专家姓名 <span className="text-destructive ml-1">*</span>
            </Label>
            <Input 
              id="expertNames" 
              placeholder="请输入鉴定专家姓名，多个专家用逗号分隔" 
              value={formData.expertNames || ""}
              onChange={handleInputChange}
              className={cn(
                validationErrors["专家姓名"] && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {validationErrors["专家姓名"] && (
              <p className="text-sm text-destructive">请输入专家姓名</p>
            )}
            <p className="text-xs text-muted-foreground">多个专家姓名请用英文逗号（,）分隔</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertTitles" className="text-sm font-medium">
              专家职称
            </Label>
            <Input 
              id="expertTitles" 
              placeholder="请输入专家职称，与专家姓名对应，用逗号分隔" 
              value={formData.expertTitles || ""}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">多个职称请用英文逗号（,）分隔，顺序需与专家姓名对应</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertUnits" className="text-sm font-medium">
              专家单位
            </Label>
            <Input 
              id="expertUnits" 
              placeholder="请输入专家所在单位，与专家姓名对应，用逗号分隔" 
              value={formData.expertUnits || ""}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">多个单位请用英文逗号（,）分隔，顺序需与专家姓名对应</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="isPassed" className="text-sm font-medium flex items-center">
              是否通过鉴定 <span className="text-destructive ml-1">*</span>
            </Label>
            <Select 
              value={formData.isPassed || ""} 
              onValueChange={(value) => handleSelectChange("isPassed", value)}
            >
              <SelectTrigger 
                id="isPassed"
                className={cn(
                  validationErrors["是否通过鉴定"] && "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder="请选择是否通过鉴定" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="是">是</SelectItem>
                <SelectItem value="否">否</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors["是否通过鉴定"] && (
              <p className="text-sm text-destructive">请选择是否通过鉴定</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 