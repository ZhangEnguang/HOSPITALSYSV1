"use client"

import { InfoIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface StepAwardInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepAwardInfo({ formData, updateFormData, validationErrors }: StepAwardInfoProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    updateFormData(id, value)
  }

  const handleSelectChange = (field: string, value: string) => {
    updateFormData(field, value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
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
              <SelectItem value="科技进步奖">科技进步奖</SelectItem>
              <SelectItem value="自然科学奖">自然科学奖</SelectItem>
              <SelectItem value="技术发明奖">技术发明奖</SelectItem>
              <SelectItem value="教学成果奖">教学成果奖</SelectItem>
              <SelectItem value="专利奖">专利奖</SelectItem>
              <SelectItem value="其他">其他</SelectItem>
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
              <SelectItem value="其他">其他</SelectItem>
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

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="awardDescription" className="text-sm font-medium flex items-center">
            奖励描述 <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="awardDescription"
            placeholder="请描述获奖成果的主要内容和创新点"
            className={cn(
              "min-h-[100px]",
              validationErrors["奖励描述"] && "border-destructive focus-visible:ring-destructive"
            )}
            value={formData.awardDescription || ""}
            onChange={handleInputChange}
          />
          {validationErrors["奖励描述"] && (
            <p className="text-sm text-destructive">请填写奖励描述</p>
          )}
        </div>
      </div>
    </div>
  )
} 