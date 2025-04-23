"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { FormData } from "../../page"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"

interface StepBasicProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: Record<string, string | undefined>
}

export function StepBasic({ formData, setFormData, errors }: StepBasicProps) {
  // 处理日期选择
  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }))
    }
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader>
        <CardTitle>基本信息</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name" className="flex items-center">
              申请计划名称 <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center">
              项目分类 <span className="text-destructive ml-1">*</span>
            </Label>
            <Select
              value={formData.category || ""}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger 
                id="category" 
                className={cn(errors.category && "border-destructive")}
              >
                <SelectValue placeholder="选择项目分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="自然科学">自然科学</SelectItem>
                <SelectItem value="人文社科">人文社科</SelectItem>
                <SelectItem value="工程技术">工程技术</SelectItem>
                <SelectItem value="医药卫生">医药卫生</SelectItem>
                <SelectItem value="交叉学科">交叉学科</SelectItem>
                <SelectItem value="便利项目">便利项目</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              申报类型
            </Label>
            <Select
              value={formData.type || ""}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="选择申报类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="国家级">国家级</SelectItem>
                <SelectItem value="省部级">省部级</SelectItem>
                <SelectItem value="市县级">市县级</SelectItem>
                <SelectItem value="校院级">校院级</SelectItem>
                <SelectItem value="企业契约">企业契约</SelectItem>
                <SelectItem value="国际合作">国际合作</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">申报开始日期 <span className="text-destructive ml-1">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDate && "text-muted-foreground",
                    errors.startDate && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : <span>选择日期</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) => handleDateChange("startDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && <p className="text-sm text-destructive mt-1">{errors.startDate}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">申报结束日期 <span className="text-destructive ml-1">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.endDate && "text-muted-foreground",
                    errors.endDate && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : <span>选择日期</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.endDate}
                  onSelect={(date) => handleDateChange("endDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && <p className="text-sm text-destructive mt-1">{errors.endDate}</p>}
          </div>

          <div className="space-y-2">
            <Label>到期自动结束</Label>
            <RadioGroup
              value={formData.autoEnd || "no"}
              onValueChange={(value) => setFormData({ ...formData, autoEnd: value })}
              className="flex flex-row gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="autoEnd-yes" />
                <Label htmlFor="autoEnd-yes" className="cursor-pointer">是</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="autoEnd-no" />
                <Label htmlFor="autoEnd-no" className="cursor-pointer">否</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>是否可转入评审</Label>
            <RadioGroup
              value={formData.canReview || "no"}
              onValueChange={(value) => setFormData({ ...formData, canReview: value })}
              className="flex flex-row gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="canReview-yes" />
                <Label htmlFor="canReview-yes" className="cursor-pointer">是</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="canReview-no" />
                <Label htmlFor="canReview-no" className="cursor-pointer">否</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>是否单位限额</Label>
            <RadioGroup
              value={formData.hasQuota || "no"}
              onValueChange={(value) => setFormData({ ...formData, hasQuota: value })}
              className="flex flex-row gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hasQuota-yes" />
                <Label htmlFor="hasQuota-yes" className="cursor-pointer">是</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hasQuota-no" />
                <Label htmlFor="hasQuota-no" className="cursor-pointer">否</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="guide" className="flex items-center">
            申报指南 <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="guide"
            placeholder="请输入申报指南详细内容..."
            className={cn("min-h-[150px]", errors.guide && "border-destructive")}
            value={formData.guide || ""}
            onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
          />
          {errors.guide && <p className="text-sm text-destructive mt-1">{errors.guide}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="template" className="flex items-center">
            模板说明
          </Label>
          <Textarea
            id="template"
            placeholder="请填写模板说明内容..."
            className="min-h-[100px]"
            value={formData.template || ""}
            onChange={(e) => setFormData({ ...formData, template: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">
            备注
          </Label>
          <Textarea
            id="notes"
            placeholder="可选填写备注内容..."
            className="min-h-[100px]"
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
