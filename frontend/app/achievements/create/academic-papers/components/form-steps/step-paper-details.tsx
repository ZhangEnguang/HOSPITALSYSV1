"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepPaperDetailsProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepPaperDetails({ formData, updateFormData, validationErrors }: StepPaperDetailsProps) {
  const [publishDate, setPublishDate] = useState<Date | undefined>(
    formData.publishDate ? new Date(formData.publishDate) : undefined
  )

  const handleDateChange = (newDate: Date | undefined) => {
    setPublishDate(newDate)
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
    
    // 清除验证错误
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors }
      delete newErrors[name]
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

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateFormData(field, checked)
  }

  // 模拟数据
  const journals = [
    "Nature",
    "Science",
    "Cell",
    "IEEE Transactions",
    "ACM Computing Surveys",
    "Journal of Artificial Intelligence Research",
    "International Journal of Computer Vision",
    "Neural Networks",
  ]

  const impactFactors = ["10.0+", "5.0-9.9", "3.0-4.9", "1.0-2.9", "0.1-0.9"]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">论文详情</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="journal" className="text-sm font-medium flex items-center">
            期刊名称 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.journal || ""} 
            onValueChange={(value) => handleSelectChange("journal", value)}
          >
            <SelectTrigger 
              id="journal"
              className={cn(
                validationErrors["期刊名称"] && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="请选择期刊名称" />
            </SelectTrigger>
            <SelectContent>
              {journals.map((journal) => (
                <SelectItem key={journal} value={journal}>{journal}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["期刊名称"] && (
            <p className="text-sm text-red-500">请选择期刊名称</p>
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
                  !publishDate && "text-muted-foreground",
                  validationErrors["发表日期"] && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {publishDate ? format(publishDate, "yyyy/MM/dd") : "请选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={publishDate}
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
            placeholder="例如：Vol. 42, No. 3, pp. 256-278" 
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
            DOI
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
          <Select 
            value={formData.impactFactor || ""} 
            onValueChange={(value) => handleSelectChange("impactFactor", value)}
          >
            <SelectTrigger 
              id="impactFactor"
              className={cn(
                validationErrors["影响因子"] && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="请选择影响因子范围" />
            </SelectTrigger>
            <SelectContent>
              {impactFactors.map((factor) => (
                <SelectItem key={factor} value={factor}>{factor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["影响因子"] && (
            <p className="text-sm text-red-500">请选择影响因子</p>
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
            placeholder="请输入关键词，用逗号分隔" 
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

        <div className="space-y-2">
          <Label htmlFor="funding" className="text-sm font-medium">
            基金项目
          </Label>
          <Input 
            id="funding" 
            name="funding" 
            placeholder="例如：国家自然科学基金(No.12345678)" 
            value={formData.funding || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center space-x-2 h-full">
          <Checkbox 
            id="isEsi" 
            checked={formData.isEsi || false}
            onCheckedChange={(checked) => handleCheckboxChange("isEsi", checked as boolean)}
          />
          <Label htmlFor="isEsi" className="text-sm font-medium">
            是否为ESI高被引论文
          </Label>
        </div>
      </div>
    </div>
  )
}
