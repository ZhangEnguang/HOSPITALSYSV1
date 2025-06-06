"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileText, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepAuthorInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepAuthorInfo({ formData, updateFormData, validationErrors }: StepAuthorInfoProps) {
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

  const handleRadioChange = (field: string, value: string) => {
    updateFormData(field, value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Users className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">作者信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstAuthor" className="text-sm font-medium flex items-center">
            第一作者 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="firstAuthor" 
            name="firstAuthor" 
            placeholder="请输入第一作者姓名" 
            value={formData.firstAuthor || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["第一作者"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["第一作者"] && (
            <p className="text-sm text-red-500">请输入第一作者姓名</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="correspondingAuthor" className="text-sm font-medium flex items-center">
            通讯作者 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="correspondingAuthor" 
            name="correspondingAuthor" 
            placeholder="请输入通讯作者姓名" 
            value={formData.correspondingAuthor || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["通讯作者"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["通讯作者"] && (
            <p className="text-sm text-red-500">请输入通讯作者姓名</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstAuthorUnit" className="text-sm font-medium flex items-center">
            第一作者单位 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="firstAuthorUnit" 
            name="firstAuthorUnit" 
            placeholder="请输入第一作者单位" 
            value={formData.firstAuthorUnit || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["第一作者单位"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["第一作者单位"] && (
            <p className="text-sm text-red-500">请输入第一作者单位</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherAuthors" className="text-sm font-medium">
            其他作者
          </Label>
          <Input 
            id="otherAuthors" 
            name="otherAuthors" 
            placeholder="请输入其他作者姓名，用逗号分隔" 
            value={formData.otherAuthors || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherUnits" className="text-sm font-medium">
            其他单位
          </Label>
          <Input 
            id="otherUnits" 
            name="otherUnits" 
            placeholder="请输入其他单位，用逗号分隔" 
            value={formData.otherUnits || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label className="text-sm font-medium">
            是否为第一单位
          </Label>
          <RadioGroup
            value={formData.isFirstUnit || "yes"}
            onValueChange={(value) => handleRadioChange("isFirstUnit", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="is-first-unit-yes" />
              <Label htmlFor="is-first-unit-yes">是</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="is-first-unit-no" />
              <Label htmlFor="is-first-unit-no">否</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2 col-span-2">
          <Label className="text-sm font-medium">
            是否为通讯单位
          </Label>
          <RadioGroup
            value={formData.isCorrespondingUnit || "yes"}
            onValueChange={(value) => handleRadioChange("isCorrespondingUnit", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="is-corresponding-unit-yes" />
              <Label htmlFor="is-corresponding-unit-yes">是</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="is-corresponding-unit-no" />
              <Label htmlFor="is-corresponding-unit-no">否</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
