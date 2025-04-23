"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepAwardInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepAwardInfo({ formData, updateFormData, validationErrors }: StepAwardInfoProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Award className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">奖励信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="awardCategory" className="text-sm font-medium flex items-center">
            奖励类别 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.awardCategory || ""} 
            onValueChange={(value) => handleSelectChange("awardCategory", value)}
          >
            <SelectTrigger 
              id="awardCategory"
              className={cn(
                validationErrors["奖励类别"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择奖励类别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="科学技术奖">科学技术奖</SelectItem>
              <SelectItem value="教学成果奖">教学成果奖</SelectItem>
              <SelectItem value="发明专利奖">发明专利奖</SelectItem>
              <SelectItem value="其他奖项">其他奖项</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors["奖励类别"] && (
            <p className="text-sm text-destructive">请选择奖励类别</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="awardRank" className="text-sm font-medium flex items-center">
            奖励等级 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.awardRank || ""} 
            onValueChange={(value) => handleSelectChange("awardRank", value)}
          >
            <SelectTrigger 
              id="awardRank"
              className={cn(
                validationErrors["奖励等级"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择奖励等级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="特等奖">特等奖</SelectItem>
              <SelectItem value="一等奖">一等奖</SelectItem>
              <SelectItem value="二等奖">二等奖</SelectItem>
              <SelectItem value="三等奖">三等奖</SelectItem>
              <SelectItem value="优秀奖">优秀奖</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors["奖励等级"] && (
            <p className="text-sm text-destructive">请选择奖励等级</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="certificateNumber" className="text-sm font-medium flex items-center">
            证书编号 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="certificateNumber"
            placeholder="请输入证书编号"
            value={formData.certificateNumber || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["证书编号"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["证书编号"] && (
            <p className="text-sm text-destructive">请输入证书编号</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="awardDescription" className="text-sm font-medium">
            奖励描述
          </Label>
          <Input
            id="awardDescription"
            placeholder="请输入奖励描述"
            value={formData.awardDescription || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
}
