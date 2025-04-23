"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface StepBasicInfoProps {
  formData: {
    name: string
    description: string
    date?: string
  }
  date: Date | undefined
  validationErrors: Record<string, string>
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleDateSelect: (date: Date | undefined) => void
}

export function StepBasicInfo({
  formData,
  date,
  validationErrors,
  handleInputChange,
  handleDateSelect,
}: StepBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </div>
        <h3 className="text-base font-medium">基本信息</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            外拨名称 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="请输入外拨名称"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={cn("w-full", validationErrors.name && "border-red-500")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">
            外拨日期 <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  validationErrors.date && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy-MM-dd") : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">外拨描述</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="请输入外拨描述"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
        />
      </div>
    </div>
  )
}
