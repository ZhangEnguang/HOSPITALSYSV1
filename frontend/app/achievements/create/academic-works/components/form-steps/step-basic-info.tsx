"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon, BookOpen, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// 示例数据
const publishers = [
  "高等教育出版社",
  "科学出版社",
  "清华大学出版社",
  "人民教育出版社",
  "机械工业出版社",
  "电子工业出版社",
  "北京大学出版社",
  "复旦大学出版社",
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

const workTypes = ["专著", "教材", "译著", "工具书", "论文集"]

interface StepBasicInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepBasicInfo({ formData, updateFormData, validationErrors }: StepBasicInfoProps) {
  const [date, setDate] = useState<Date | undefined>(formData.publishDate ? new Date(formData.publishDate) : undefined)

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      updateFormData("publishDate", newDate)
      
      // 清除日期验证错误
      if (validationErrors["出版日期"]) {
        const newErrors = { ...validationErrors }
        delete newErrors["出版日期"]
        updateFormData("validationErrors", newErrors)
      }
    } else {
      updateFormData("publishDate", undefined)
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
        <h3 className="text-base font-medium">著作基本信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium flex items-center">
            著作名称 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input 
            id="title" 
            placeholder="请输入著作名称" 
            value={formData.title || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["著作名称"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["著作名称"] && (
            <p className="text-sm text-destructive">请输入著作名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="workType" className="text-sm font-medium flex items-center">
            著作类型 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.workType || ""} 
            onValueChange={(value) => handleSelectChange("workType", value)}
          >
            <SelectTrigger 
              id="workType"
              className={cn(
                validationErrors["著作类型"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择著作类型" />
            </SelectTrigger>
            <SelectContent>
              {workTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["著作类型"] && (
            <p className="text-sm text-destructive">请选择著作类型</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="publisher" className="text-sm font-medium flex items-center">
            出版社 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.publisher || ""} 
            onValueChange={(value) => handleSelectChange("publisher", value)}
          >
            <SelectTrigger 
              id="publisher"
              className={cn(
                validationErrors["出版社"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择出版社" />
            </SelectTrigger>
            <SelectContent>
              {publishers.map((publisher) => (
                <SelectItem key={publisher} value={publisher}>{publisher}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["出版社"] && (
            <p className="text-sm text-destructive">请选择出版社</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="publishDate" className="text-sm font-medium flex items-center">
            出版日期 <span className="text-destructive ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="publishDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  validationErrors["出版日期"] && "border-destructive focus-visible:ring-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy-MM-dd") : "请选择出版日期"}
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
          {validationErrors["出版日期"] && (
            <p className="text-sm text-destructive">请选择出版日期</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isbn" className="text-sm font-medium flex items-center">
            ISBN <span className="text-destructive ml-1">*</span>
          </Label>
          <Input 
            id="isbn" 
            placeholder="请输入ISBN" 
            value={formData.isbn || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["ISBN"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["ISBN"] && (
            <p className="text-sm text-destructive">请输入ISBN</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pages" className="text-sm font-medium">
            总页数
          </Label>
          <Input 
            id="pages" 
            placeholder="请输入总页数" 
            value={formData.pages || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="words" className="text-sm font-medium">
            总字数（千字）
          </Label>
          <Input 
            id="words" 
            placeholder="请输入总字数（千字）" 
            value={formData.words || ""}
            onChange={handleInputChange}
          />
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
      </div>
    </div>
  )
}
