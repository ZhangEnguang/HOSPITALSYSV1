"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, InfoIcon } from "lucide-react"

interface StepPaperDetailsProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepPaperDetails({ formData, updateFormData, validationErrors }: StepPaperDetailsProps) {
  const [date, setDate] = useState<Date | undefined>(formData.publishDate ? new Date(formData.publishDate) : undefined)

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    updateFormData("publishDate", newDate?.toISOString())
    
    // 清除日期验证错误
    if (newDate && validationErrors["发表日期"]) {
      const newErrors = { ...validationErrors }
      delete newErrors["发表日期"]
      updateFormData("validationErrors", newErrors)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData(name, value)
  }

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateFormData(field, checked)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">论文详情</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="journal" className="text-sm font-medium flex items-center">
            期刊名称 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="journal" 
            name="journal" 
            placeholder="请输入期刊名称" 
            value={formData.journal || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["期刊名称"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["期刊名称"] && (
            <p className="text-sm text-red-500">请输入期刊名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="publishDate" className="text-sm font-medium flex items-center">
            发表日期 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  validationErrors["发表日期"] && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy年MM月dd日") : "请选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationErrors["发表日期"] && (
            <p className="text-sm text-red-500">请选择发表日期</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume" className="text-sm font-medium flex items-center">
            卷号页码 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="volume" 
            name="volume" 
            placeholder="请输入卷号页码" 
            value={formData.volume || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["卷号页码"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["卷号页码"] && (
            <p className="text-sm text-red-500">请输入卷号页码</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="doi" className="text-sm font-medium">
            DOI编号
          </Label>
          <Input 
            id="doi" 
            name="doi" 
            placeholder="请输入DOI编号" 
            value={formData.doi || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="impactFactor" className="text-sm font-medium flex items-center">
            影响因子 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="impactFactor" 
            name="impactFactor" 
            placeholder="请输入影响因子" 
            value={formData.impactFactor || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["影响因子"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["影响因子"] && (
            <p className="text-sm text-red-500">请输入影响因子</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="citations" className="text-sm font-medium">
            引用次数
          </Label>
          <Input 
            id="citations" 
            name="citations" 
            placeholder="请输入引用次数" 
            value={formData.citations || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="keywords" className="text-sm font-medium">
            关键词
          </Label>
          <Input 
            id="keywords" 
            name="keywords" 
            placeholder="请输入关键词，多个关键词用逗号分隔" 
            value={formData.keywords || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="abstract" className="text-sm font-medium">
            摘要
          </Label>
          <Textarea 
            id="abstract" 
            name="abstract" 
            placeholder="请输入论文摘要" 
            value={formData.abstract || ""}
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="funding" className="text-sm font-medium">
            基金资助
          </Label>
          <Input 
            id="funding" 
            name="funding" 
            placeholder="请输入基金资助信息" 
            value={formData.funding || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isEsi" 
            checked={formData.isEsi || false}
            onCheckedChange={(checked) => handleCheckboxChange("isEsi", checked as boolean)}
          />
          <Label htmlFor="isEsi" className="text-sm font-medium cursor-pointer">
            是否为ESI论文
          </Label>
        </div>
      </div>
    </div>
  )
} 