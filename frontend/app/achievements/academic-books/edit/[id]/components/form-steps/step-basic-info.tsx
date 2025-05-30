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
  const [date, setDate] = useState<Date | undefined>(formData.publishDate ? new Date(formData.publishDate) : undefined)

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    updateFormData("publishDate", newDate?.toISOString())
    
    // 清除日期验证错误
    if (newDate && validationErrors["出版日期"]) {
      const newErrors = { ...validationErrors }
      delete newErrors["出版日期"]
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
  const workTypes = ["专著", "编著", "译著", "教材", "工具书", "科普读物", "其他"]
  const statuses = ["已出版", "即将出版", "编写中"]
  const categories = [
    "计算机科学",
    "人工智能",
    "工程技术",
    "自然科学",
    "社会科学",
    "人文艺术",
    "医学卫生",
    "经济管理",
    "教育学",
    "其他"
  ]

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
            著作名称 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="title" 
            name="title" 
            placeholder="请输入著作名称" 
            value={formData.title || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["著作名称"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["著作名称"] && (
            <p className="text-sm text-red-500">请输入著作名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="workType" className="text-sm font-medium flex items-center">
            著作类型 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.workType || ""} 
            onValueChange={(value) => handleSelectChange("workType", value)}
          >
            <SelectTrigger 
              id="workType"
              className={cn(
                validationErrors["著作类型"] && "border-red-500 focus-visible:ring-red-500"
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
            <p className="text-sm text-red-500">请选择著作类型</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="publisher" className="text-sm font-medium flex items-center">
            出版社 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="publisher" 
            name="publisher" 
            placeholder="请输入出版社" 
            value={formData.publisher || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["出版社"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["出版社"] && (
            <p className="text-sm text-red-500">请输入出版社</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="publishDate" className="text-sm font-medium flex items-center">
            出版日期 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  validationErrors["出版日期"] && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy-MM-dd") : "请选择出版日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
          {validationErrors["出版日期"] && (
            <p className="text-sm text-red-500">请选择出版日期</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isbn" className="text-sm font-medium flex items-center">
            ISBN <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="isbn" 
            name="isbn" 
            placeholder="请输入ISBN" 
            value={formData.isbn || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["ISBN"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["ISBN"] && (
            <p className="text-sm text-red-500">请输入ISBN</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pages" className="text-sm font-medium">
            总页数
          </Label>
          <Input 
            id="pages" 
            name="pages" 
            placeholder="请输入总页数" 
            value={formData.pages || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="words" className="text-sm font-medium">
            总字数
          </Label>
          <Input 
            id="words" 
            name="words" 
            placeholder="请输入总字数" 
            value={formData.words || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium flex items-center">
            学科分类 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formData.category || ""} 
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger 
              id="category"
              className={cn(
                validationErrors["学科分类"] && "border-red-500 focus-visible:ring-red-500"
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
            <p className="text-sm text-red-500">请选择学科分类</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            出版状态
          </Label>
          <Select 
            value={formData.status || ""} 
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="请选择出版状态" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 col-span-1 md:col-span-2">
        <Label htmlFor="series" className="text-sm font-medium">
          丛书名称
        </Label>
        <Input 
          id="series" 
          name="series" 
          placeholder="请输入丛书名称（如有）" 
          value={formData.series || ""}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
} 