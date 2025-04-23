"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

// 示例数据
const members = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十"]

interface StepAuthorInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepAuthorInfo({ formData, updateFormData, validationErrors }: StepAuthorInfoProps) {
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

  const handleCheckboxChange = (checked: boolean) => {
    updateFormData("rankingConfirmed", checked)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Users className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">获奖人信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstAuthor" className="text-sm font-medium flex items-center">
            第一获奖人 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.firstAuthor || ""} 
            onValueChange={(value) => handleSelectChange("firstAuthor", value)}
          >
            <SelectTrigger 
              id="firstAuthor"
              className={cn(
                validationErrors["第一获奖人"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择第一获奖人" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member} value={member}>{member}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["第一获奖人"] && (
            <p className="text-sm text-destructive">请选择第一获奖人</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondAuthor" className="text-sm font-medium">
            第二获奖人
          </Label>
          <Select 
            value={formData.secondAuthor || ""} 
            onValueChange={(value) => handleSelectChange("secondAuthor", value)}
          >
            <SelectTrigger id="secondAuthor">
              <SelectValue placeholder="请选择第二获奖人" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member} value={member}>{member}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="otherAuthors" className="text-sm font-medium">
            其他获奖人
          </Label>
          <Input
            id="otherAuthors"
            placeholder="请输入其他获奖人，多个人名之间用逗号分隔"
            value={formData.otherAuthors || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="contribution" className="text-sm font-medium flex items-center">
            本人贡献 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="contribution"
            placeholder="请描述本人在该奖励中的贡献"
            value={formData.contribution || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["本人贡献"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["本人贡献"] && (
            <p className="text-sm text-destructive">请描述本人贡献</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2 flex items-center space-x-2">
          <Checkbox
            id="rankingConfirmed"
            checked={formData.rankingConfirmed}
            onCheckedChange={handleCheckboxChange}
          />
          <Label
            htmlFor="rankingConfirmed"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            我确认上述获奖人排名无误
          </Label>
        </div>
      </div>
    </div>
  )
}
