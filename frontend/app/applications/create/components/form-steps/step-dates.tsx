"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Trash2, CalendarIcon } from "lucide-react"
import { FormData } from "../../page"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface StepDatesProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: Record<string, string | undefined>
}

export function StepDates({ formData, setFormData, errors }: StepDatesProps) {
  // 添加时间节点
  const handleAddDate = () => {
    const newId = `date-${Date.now()}`
    setFormData({
      ...formData,
      keyDates: [...formData.keyDates, { id: newId, name: "", date: new Date() }]
    })
  }

  // 移除时间节点
  const handleRemoveDate = (index: number) => {
    setFormData({
      ...formData,
      keyDates: formData.keyDates.filter((_, i) => i !== index)
    })
  }

  // 更新时间节点信息
  const handleDateChange = (index: number, field: "name" | "date", value: string | Date) => {
    const updatedDates = [...formData.keyDates]
    updatedDates[index] = {
      ...updatedDates[index],
      [field]: value
    }
    setFormData({ ...formData, keyDates: updatedDates })
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>关键时间节点</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={handleAddDate}>
          <Plus className="h-4 w-4 mr-1" />
          添加节点
        </Button>
      </CardHeader>
      <CardContent>
        {formData.keyDates.length > 0 ? (
          <div className="space-y-4">
            {formData.keyDates.map((date, index) => (
              <div 
                key={date.id} 
                className={cn(
                  "p-4 border rounded-md relative",
                  errors.keyDates && "border-destructive"
                )}
              >
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDate(index)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`date-name-${index}`} className="flex items-center">
                      节点名称 <span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id={`date-name-${index}`}
                      value={date.name || ""}
                      onChange={(e) => handleDateChange(index, "name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`date-date-${index}`} className="flex items-center">
                      节点日期 <span className="text-destructive ml-1">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id={`date-date-${index}`}
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date.date ? format(new Date(date.date), "yyyy-MM-dd") : <span>选择日期</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date.date ? new Date(date.date) : undefined}
                          onSelect={(selectedDate) => selectedDate && handleDateChange(index, "date", selectedDate)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ))}
            {errors.keyDates && <p className="text-sm text-destructive">{errors.keyDates}</p>}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>请添加关键时间节点</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
