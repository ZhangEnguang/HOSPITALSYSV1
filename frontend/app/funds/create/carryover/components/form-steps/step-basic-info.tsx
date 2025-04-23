"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, FileText, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepBasicInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepBasicInfo({ formData, updateFormData, validationErrors }: StepBasicInfoProps) {
  const [date, setDate] = useState<Date | undefined>(formData.date ? new Date(formData.date) : undefined)

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    updateFormData("date", newDate?.toISOString())
    
    // 清除日期验证错误
    if (newDate && validationErrors["结转日期"]) {
      const newErrors = { ...validationErrors }
      delete newErrors["结转日期"]
      updateFormData("validationErrors", newErrors)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData(name, value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">结转基本信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium flex items-center">
            结转名称 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="请输入结转名称"
            value={formData.name || ""}
            onChange={handleInputChange}
            required
            className={cn("h-10", validationErrors["结转名称"] && "border-red-500 focus-visible:ring-red-500")}
          />
          {validationErrors["结转名称"] && (
            <p className="text-sm text-red-500 mt-1">请输入结转名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium flex items-center">
            结转日期 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10",
                  !date && "text-muted-foreground",
                  validationErrors["结转日期"] && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy/MM/dd") : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
          {validationErrors["结转日期"] && (
            <p className="text-sm text-red-500 mt-1">请选择结转日期</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          结转描述
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="请输入结转描述"
          value={formData.description || ""}
          onChange={handleInputChange}
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  )
}
