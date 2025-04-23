"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon, FileText, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// 示例数据
const evaluationOrgs = [
  "中国科学院",
  "中国工程院",
  "教育部科技委员会",
  "国家自然科学基金委员会",
  "中国科学技术协会",
  "中国电子学会",
  "中国计算机学会",
  "中国人工智能学会",
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

const levels = ["国际领先", "国际先进", "国内领先", "国内先进"]
const types = ["科技成果", "软件成果", "工程成果", "理论成果", "应用成果"]

interface StepBasicInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepBasicInfo({ formData, updateFormData, validationErrors }: StepBasicInfoProps) {
  const [date, setDate] = useState<Date | undefined>(formData.evaluationDate ? new Date(formData.evaluationDate) : undefined)

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      updateFormData("evaluationDate", newDate)
      
      // 清除日期验证错误
      if (validationErrors["鉴定日期"]) {
        const newErrors = { ...validationErrors }
        delete newErrors["鉴定日期"]
        updateFormData("validationErrors", newErrors)
      }
    } else {
      updateFormData("evaluationDate", undefined)
    }
  }

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
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">鉴定成果基本信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium flex items-center">
            成果名称 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input 
            id="title" 
            placeholder="请输入成果名称" 
            value={formData.title || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["成果名称"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["成果名称"] && (
            <p className="text-sm text-destructive">请输入成果名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium flex items-center">
            成果类型 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.type || ""} 
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger 
              id="type"
              className={cn(
                validationErrors["成果类型"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择成果类型" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["成果类型"] && (
            <p className="text-sm text-destructive">请选择成果类型</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="evaluationOrg" className="text-sm font-medium flex items-center">
            鉴定单位 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.evaluationOrg || ""} 
            onValueChange={(value) => handleSelectChange("evaluationOrg", value)}
          >
            <SelectTrigger 
              id="evaluationOrg"
              className={cn(
                validationErrors["鉴定单位"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择鉴定单位" />
            </SelectTrigger>
            <SelectContent>
              {evaluationOrgs.map((org) => (
                <SelectItem key={org} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["鉴定单位"] && (
            <p className="text-sm text-destructive">请选择鉴定单位</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="evaluationDate" className="text-sm font-medium flex items-center">
            鉴定日期 <span className="text-destructive ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="evaluationDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  validationErrors["鉴定日期"] && "border-destructive focus-visible:ring-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy-MM-dd") : "请选择鉴定日期"}
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
          {validationErrors["鉴定日期"] && (
            <p className="text-sm text-destructive">请选择鉴定日期</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="certificateNo" className="text-sm font-medium flex items-center">
            鉴定证书编号 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input 
            id="certificateNo" 
            placeholder="请输入鉴定证书编号" 
            value={formData.certificateNo || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["鉴定证书编号"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["鉴定证书编号"] && (
            <p className="text-sm text-destructive">请输入鉴定证书编号</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="level" className="text-sm font-medium flex items-center">
            鉴定水平 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.level || ""} 
            onValueChange={(value) => handleSelectChange("level", value)}
          >
            <SelectTrigger 
              id="level"
              className={cn(
                validationErrors["鉴定水平"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择鉴定水平" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["鉴定水平"] && (
            <p className="text-sm text-destructive">请选择鉴定水平</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium flex items-center">
            学科分类 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.category || ""} 
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger 
              id="category"
              className={cn(
                validationErrors["学科分类"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择学科分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["学科分类"] && (
            <p className="text-sm text-destructive">请选择学科分类</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectSource" className="text-sm font-medium">
            项目来源
          </Label>
          <Input 
            id="projectSource" 
            placeholder="请输入项目来源" 
            value={formData.projectSource || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
}
