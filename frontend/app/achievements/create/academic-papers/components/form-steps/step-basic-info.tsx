"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon, FileText, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepBasicInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepBasicInfo({ formData, updateFormData, validationErrors }: StepBasicInfoProps) {
  const [date, setDate] = useState<Date | undefined>(formData.startDate ? new Date(formData.startDate) : undefined)

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    updateFormData("startDate", newDate?.toISOString())
    
    // 清除日期验证错误
    if (newDate && validationErrors["开始日期"]) {
      const newErrors = { ...validationErrors }
      delete newErrors["开始日期"]
      updateFormData("validationErrors", newErrors)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData(name, value)
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

  // 模拟数据
  const paperTypes = ["SCI", "EI", "CSSCI", "SSCI", "A&HCI", "CSCD", "北大核心", "其他"]
  const paperLevels = ["国际顶级", "国际一流", "国际知名", "国内顶级", "国内一流", "国内知名"]
  const paperStatuses = ["已发表", "已接收", "已投稿", "撰写中"]
  const fundingSources = [
    "国家自然科学基金",
    "国家社会科学基金",
    "教育部人文社科基金",
    "省部级基金",
    "校级基金",
    "企业合作",
    "自筹",
  ]
  const categories = [
    "计算机科学",
    "人工智能",
    "机器学习",
    "自然语言处理",
    "计算机视觉",
    "数据挖掘",
    "信息安全",
    "软件工程",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">论文基本信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="paperCode" className="text-sm font-medium">
            论文编号
          </Label>
          <Input 
            id="paperCode" 
            name="paperCode" 
            placeholder="请输入论文编号" 
            value={formData.paperCode || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paperTitle" className="text-sm font-medium flex items-center">
            论文标题 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="paperTitle" 
            name="paperTitle" 
            placeholder="请输入论文标题" 
            value={formData.paperTitle || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["论文标题"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["论文标题"] && (
            <p className="text-sm text-red-500">请输入论文标题</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paperType" className="text-sm font-medium flex items-center">
            论文类型 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.paperType || ""} 
            onValueChange={(value) => handleSelectChange("paperType", value)}
          >
            <SelectTrigger 
              id="paperType"
              className={cn(
                validationErrors["论文类型"] && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="请选择论文类型" />
            </SelectTrigger>
            <SelectContent>
              {paperTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["论文类型"] && (
            <p className="text-sm text-red-500">请选择论文类型</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paperLevel" className="text-sm font-medium flex items-center">
            论文级别 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.paperLevel || ""} 
            onValueChange={(value) => handleSelectChange("paperLevel", value)}
          >
            <SelectTrigger 
              id="paperLevel"
              className={cn(
                validationErrors["论文级别"] && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="请选择论文级别" />
            </SelectTrigger>
            <SelectContent>
              {paperLevels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["论文级别"] && (
            <p className="text-sm text-red-500">请选择论文级别</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paperStatus" className="text-sm font-medium flex items-center">
            发表状态 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.paperStatus || ""} 
            onValueChange={(value) => handleSelectChange("paperStatus", value)}
          >
            <SelectTrigger 
              id="paperStatus"
              className={cn(
                validationErrors["发表状态"] && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="请选择发表状态" />
            </SelectTrigger>
            <SelectContent>
              {paperStatuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["发表状态"] && (
            <p className="text-sm text-red-500">请选择发表状态</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="text-sm font-medium">
            所属院系
          </Label>
          <Input 
            id="department" 
            name="department" 
            placeholder="请输入所属院系" 
            value={formData.department || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            研究领域
          </Label>
          <Select 
            value={formData.category || ""} 
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="请选择研究领域" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fundingSource" className="text-sm font-medium">
            经费来源
          </Label>
          <Select 
            value={formData.fundingSource || ""} 
            onValueChange={(value) => handleSelectChange("fundingSource", value)}
          >
            <SelectTrigger id="fundingSource">
              <SelectValue placeholder="请选择经费来源" />
            </SelectTrigger>
            <SelectContent>
              {fundingSources.map((source) => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            开始日期
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy/MM/dd") : "请选择日期"}
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
        </div>
      </div>
    </div>
  )
}
