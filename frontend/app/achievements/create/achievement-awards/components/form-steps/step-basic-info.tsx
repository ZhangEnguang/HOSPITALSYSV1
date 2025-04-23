"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, InfoIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface StepBasicInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepBasicInfo({ formData, updateFormData, validationErrors }: StepBasicInfoProps) {
  const [date, setDate] = useState<Date | undefined>(formData.awardDate ? new Date(formData.awardDate) : undefined)

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

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      updateFormData("awardDate", newDate)
      // 清除验证错误
      if (validationErrors["获奖日期"]) {
        const newErrors = { ...validationErrors }
        delete newErrors["获奖日期"]
        updateFormData("validationErrors", newErrors)
      }
    } else {
      updateFormData("awardDate", undefined)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">基本信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="awardName" className="text-sm font-medium flex items-center">
            奖励名称 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="awardName"
            placeholder="请输入奖励名称"
            value={formData.awardName || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["奖励名称"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["奖励名称"] && (
            <p className="text-sm text-destructive">请输入奖励名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="awardLevel" className="text-sm font-medium flex items-center">
            奖励级别 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.awardLevel || ""} 
            onValueChange={(value) => handleSelectChange("awardLevel", value)}
          >
            <SelectTrigger 
              id="awardLevel"
              className={cn(
                validationErrors["奖励级别"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择奖励级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">国家级</SelectItem>
              <SelectItem value="provincial">省部级</SelectItem>
              <SelectItem value="municipal">市级</SelectItem>
              <SelectItem value="institutional">校级</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors["奖励级别"] && (
            <p className="text-sm text-destructive">请选择奖励级别</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="awardDate" className="text-sm font-medium flex items-center">
            获奖日期 <span className="text-destructive ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <div 
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
                  validationErrors["获奖日期"] && "border-destructive focus-visible:ring-destructive"
                )}
              >
                {date ? (
                  format(date, "yyyy-MM-dd")
                ) : (
                  <span className="text-muted-foreground">请选择日期</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationErrors["获奖日期"] && (
            <p className="text-sm text-destructive">请选择获奖日期</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="awardingBody" className="text-sm font-medium flex items-center">
            颁奖单位 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="awardingBody"
            placeholder="请输入颁奖单位"
            value={formData.awardingBody || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["颁奖单位"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["颁奖单位"] && (
            <p className="text-sm text-destructive">请输入颁奖单位</p>
          )}
        </div>
      </div>
    </div>
  )
}
