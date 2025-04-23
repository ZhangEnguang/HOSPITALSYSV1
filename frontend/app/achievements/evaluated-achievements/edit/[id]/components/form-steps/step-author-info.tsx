"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepAuthorInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepAuthorInfo({ formData, updateFormData, validationErrors }: StepAuthorInfoProps) {
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

  const handleCheckboxChange = (checked: boolean) => {
    updateFormData("rankingConfirmed", checked)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">完成人信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstCompleter" className="text-sm font-medium flex items-center">
            第一完成人 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input 
            id="firstCompleter" 
            placeholder="请输入第一完成人姓名" 
            value={formData.firstCompleter || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["第一完成人"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["第一完成人"] && (
            <p className="text-sm text-destructive">请输入第一完成人</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondCompleter" className="text-sm font-medium">
            第二完成人
          </Label>
          <Input 
            id="secondCompleter" 
            placeholder="请输入第二完成人姓名（选填）" 
            value={formData.secondCompleter || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="otherCompleters" className="text-sm font-medium">
            其他完成人
          </Label>
          <Input 
            id="otherCompleters" 
            placeholder="请输入其他完成人姓名，多个人名用逗号分隔（选填）" 
            value={formData.otherCompleters || ""}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">多个完成人姓名请用英文逗号（,）分隔</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="contribution" className="text-sm font-medium flex items-center">
            本人贡献 <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea 
            id="contribution" 
            placeholder="请描述本人在该项成果中的贡献" 
            value={formData.contribution || ""}
            onChange={handleInputChange}
            className={cn(
              "min-h-24",
              validationErrors["本人贡献"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["本人贡献"] && (
            <p className="text-sm text-destructive">请输入本人贡献</p>
          )}
        </div>

        <div className="md:col-span-2 flex items-center space-x-2">
          <Checkbox 
            id="rankingConfirmed" 
            checked={formData.rankingConfirmed}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="rankingConfirmed" className="text-sm font-medium cursor-pointer">
            我确认完成人排名无误
          </Label>
        </div>
      </div>
    </div>
  )
} 