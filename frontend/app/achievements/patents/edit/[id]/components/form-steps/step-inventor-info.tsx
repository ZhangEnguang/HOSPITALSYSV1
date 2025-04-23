"use client"

import { UserIcon } from "lucide-react"
import { FormData } from "../patents-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface StepInventorInfoProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  validationErrors: Record<string, string>
}

export function StepInventorInfo({ formData, updateFormData, validationErrors }: StepInventorInfoProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    updateFormData(id as keyof FormData, value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <UserIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">发明人信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inventors" className="flex items-center">
            发明人 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="inventors"
            placeholder="请输入发明人，多个发明人请用逗号分隔"
            value={formData.inventors || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["inventors"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["inventors"] && (
            <p className="text-sm text-destructive">{validationErrors["inventors"]}</p>
          )}
          <p className="text-xs text-muted-foreground">多个发明人请用逗号分隔，例如：张三,李四,王五</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="affiliatedUnit" className="flex items-center">
            所属单位 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="affiliatedUnit"
            placeholder="请输入所属单位"
            value={formData.affiliatedUnit || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["affiliatedUnit"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["affiliatedUnit"] && (
            <p className="text-sm text-destructive">{validationErrors["affiliatedUnit"]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 col-span-2">
        <Label>发明人排序与贡献度说明</Label>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>1. 发明人按照贡献大小依次填写，第一发明人为主要贡献者</p>
          <p>2. 请确保所有发明人信息准确无误，后续将用于专利证书出具</p>
          <p>3. 如有单位发明人，请在所属单位中注明</p>
        </div>
      </div>
    </div>
  )
} 