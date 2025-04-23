"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, FileText, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepAmountExpenseProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
  expenseTypes: string[]
}

export function StepAmountExpense({ 
  formData, 
  updateFormData, 
  validationErrors,
  expenseTypes
}: StepAmountExpenseProps) {
  const [expenseDate, setExpenseDate] = useState<Date | undefined>(
    formData.expenseDate ? new Date(formData.expenseDate) : undefined
  )

  const handleDateChange = (newDate: Date | undefined) => {
    setExpenseDate(newDate)
    updateFormData("expenseDate", newDate?.toISOString())
    
    // 清除日期验证错误
    if (newDate && validationErrors["费用发生日期"]) {
      const newErrors = { ...validationErrors }
      delete newErrors["费用发生日期"]
      updateFormData("validationErrors", newErrors)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData(name, value)
  }

  const handleSelectChange = (name: string, value: string) => {
    updateFormData(name, value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <DollarSign className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">金额与费用信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium flex items-center">
            报销金额 (元) <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="请输入报销金额"
            value={formData.amount || ""}
            onChange={handleInputChange}
            required
            className={cn(
              "h-10", 
              validationErrors["报销金额"] && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {validationErrors["报销金额"] && (
            <p className="text-sm text-red-500 mt-1">请输入报销金额</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expenseType" className="text-sm font-medium flex items-center">
            费用类型 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.expenseType || ""}
            onValueChange={(value) => handleSelectChange("expenseType", value)}
          >
            <SelectTrigger 
              className={cn(
                "h-10", 
                validationErrors["费用类型"] && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <SelectValue placeholder="选择费用类型" />
            </SelectTrigger>
            <SelectContent>
              {expenseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors["费用类型"] && (
            <p className="text-sm text-red-500 mt-1">请选择费用类型</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expenseDate" className="text-sm font-medium flex items-center">
            费用发生日期 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10",
                  !expenseDate && "text-muted-foreground",
                  validationErrors["费用发生日期"] && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expenseDate ? format(expenseDate, "yyyy/MM/dd") : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={expenseDate} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
          {validationErrors["费用发生日期"] && (
            <p className="text-sm text-red-500 mt-1">请选择费用发生日期</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="receiptNumber" className="text-sm font-medium">
            票据编号
          </Label>
          <Input
            id="receiptNumber"
            name="receiptNumber"
            placeholder="请输入票据编号"
            value={formData.receiptNumber || ""}
            onChange={handleInputChange}
            className="h-10"
          />
        </div>
      </div>
    </div>
  )
}
