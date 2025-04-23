"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StepBasicInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export function StepBasicInfo({ formData, updateFormData }: StepBasicInfoProps) {
  // 经费入账类别
  const categories = ["纵向项目经费", "横向项目经费", "学校配套经费", "其他经费"]

  return (
    <Card className="w-full border border-gray-100 shadow-sm">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-lg font-medium">基本信息</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              入账名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="请输入入账名称"
              value={formData.name || ""}
              onChange={(e) => updateFormData("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              入账类别 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category || ""}
              onValueChange={(value) => updateFormData("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="请选择入账类别" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">
              入账日期 <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
                  {formData.date ? (
                    format(new Date(formData.date), "yyyy-MM-dd")
                  ) : (
                    <span className="text-muted-foreground">请选择日期</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={(date) => updateFormData("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">账号</Label>
            <Input
              id="accountNumber"
              placeholder="请输入账号"
              value={formData.accountNumber || ""}
              onChange={(e) => updateFormData("accountNumber", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">入账说明</Label>
          <textarea
            id="description"
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="请输入入账说明"
            value={formData.description || ""}
            onChange={(e) => updateFormData("description", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
