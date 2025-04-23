"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepInventorInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepInventorInfo({ formData, updateFormData, validationErrors }: StepInventorInfoProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    updateFormData(id, value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Users className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">发明人信息</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="inventors" className="text-sm font-medium flex items-center">
            发明人 <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="inventors"
            placeholder="请输入发明人信息，多个发明人请用逗号分隔"
            value={formData.inventors || ""}
            onChange={handleInputChange}
            className={cn(
              "min-h-[100px]",
              validationErrors["发明人"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["发明人"] && (
            <p className="text-sm text-destructive">请输入发明人信息</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="affiliatedUnit" className="text-sm font-medium flex items-center">
            所属单位 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="affiliatedUnit"
            placeholder="请输入所属单位"
            value={formData.affiliatedUnit || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["所属单位"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["所属单位"] && (
            <p className="text-sm text-destructive">请输入所属单位</p>
          )}
        </div>
      </div>
    </div>
  )
}
