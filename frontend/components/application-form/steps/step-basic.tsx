"use client"

import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApplicationFormData, FormMode } from "../types"

interface StepBasicProps {
  formData: ApplicationFormData
  setFormData: (formData: ApplicationFormData) => void
  errors?: Record<string, boolean>
  mode?: FormMode
  disabledFields?: string[]
  hiddenFields?: string[]
}

export function StepBasic({ 
  formData, 
  setFormData, 
  errors = {}, 
  mode = FormMode.CREATE,
  disabledFields = [],
  hiddenFields = [],
}: StepBasicProps) {
  const isDisabled = mode === FormMode.VIEW
  
  const isFieldDisabled = (fieldName: string) => {
    return isDisabled || disabledFields.includes(fieldName)
  }
  
  const isFieldHidden = (fieldName: string) => {
    return hiddenFields.includes(fieldName)
  }
  
  const handleChange = (field: string, value: any) => {
    if (isDisabled) return
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="space-y-6 p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 申报名称 */}
          {!isFieldHidden('name') && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name" className="flex items-center">
                申报名称
                {errors.name && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isFieldDisabled('name')}
                className={errors.name ? "border-destructive" : ""}
              />
            </div>
          )}

          {/* 申报类型 */}
          {!isFieldHidden('type') && (
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center">
                申报类型
                {errors.type && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Select
                value={formData.type || ''}
                onValueChange={(value) => handleChange('type', value)}
                disabled={isFieldDisabled('type')}
              >
                <SelectTrigger id="type" className={errors.type ? "border-destructive" : ""}>
                  <SelectValue placeholder="选择申报类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="国家级">国家级</SelectItem>
                  <SelectItem value="省部级">省部级</SelectItem>
                  <SelectItem value="市厅级">市厅级</SelectItem>
                  <SelectItem value="校级">校级</SelectItem>
                  <SelectItem value="院级">院级</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 所属学科分类 */}
          {!isFieldHidden('category') && (
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center">
                所属学科分类
                {errors.category && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Select
                value={formData.category || ''}
                onValueChange={(value) => handleChange('category', value)}
                disabled={isFieldDisabled('category')}
              >
                <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="选择学科分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="自然科学">自然科学</SelectItem>
                  <SelectItem value="社会科学">社会科学</SelectItem>
                  <SelectItem value="工程技术">工程技术</SelectItem>
                  <SelectItem value="人文艺术">人文艺术</SelectItem>
                  <SelectItem value="医药卫生">医药卫生</SelectItem>
                  <SelectItem value="农业科学">农业科学</SelectItem>
                  <SelectItem value="交叉学科">交叉学科</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 申报开始日期 */}
          {!isFieldHidden('startDate') && (
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center">
                申报开始日期
                {errors.startDate && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isFieldDisabled('startDate')}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                      errors.startDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : "选择日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && handleChange('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* 申报结束日期 */}
          {!isFieldHidden('endDate') && (
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center">
                申报结束日期
                {errors.endDate && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isFieldDisabled('endDate')}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                      errors.endDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : "选择日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && handleChange('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* 预算总额 */}
          {!isFieldHidden('amount') && (
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center">
                预算总额（万元）
                {errors.amount && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount || 0}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                disabled={isFieldDisabled('amount')}
                className={errors.amount ? "border-destructive" : ""}
              />
            </div>
          )}

          {/* 是否自动截止 */}
          {!isFieldHidden('autoEnd') && (
            <div className="space-y-2">
              <Label htmlFor="autoEnd" className="flex items-center">
                到期是否自动截止
                {errors.autoEnd && <span className="text-destructive ml-1">*</span>}
              </Label>
              <RadioGroup
                value={formData.autoEnd || "no"}
                onValueChange={(value) => handleChange('autoEnd', value)}
                disabled={isFieldDisabled('autoEnd')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="autoEnd-yes" />
                  <Label htmlFor="autoEnd-yes">是</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="autoEnd-no" />
                  <Label htmlFor="autoEnd-no">否</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* 是否支持在线评审 */}
          {!isFieldHidden('canReview') && (
            <div className="space-y-2">
              <Label htmlFor="canReview" className="flex items-center">
                是否支持在线评审
                {errors.canReview && <span className="text-destructive ml-1">*</span>}
              </Label>
              <RadioGroup
                value={formData.canReview || "no"}
                onValueChange={(value) => handleChange('canReview', value)}
                disabled={isFieldDisabled('canReview')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="canReview-yes" />
                  <Label htmlFor="canReview-yes">是</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="canReview-no" />
                  <Label htmlFor="canReview-no">否</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* 是否有名额限制 */}
          {!isFieldHidden('hasQuota') && (
            <div className="space-y-2">
              <Label htmlFor="hasQuota" className="flex items-center">
                是否有名额限制
                {errors.hasQuota && <span className="text-destructive ml-1">*</span>}
              </Label>
              <RadioGroup
                value={formData.hasQuota || "no"}
                onValueChange={(value) => handleChange('hasQuota', value)}
                disabled={isFieldDisabled('hasQuota')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="hasQuota-yes" />
                  <Label htmlFor="hasQuota-yes">是</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="hasQuota-no" />
                  <Label htmlFor="hasQuota-no">否</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* 申报指南 */}
          {!isFieldHidden('guide') && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="guide" className="flex items-center">
                申报指南
                {errors.guide && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Textarea
                id="guide"
                value={formData.guide || ''}
                onChange={(e) => handleChange('guide', e.target.value)}
                disabled={isFieldDisabled('guide')}
                className={cn("min-h-32", errors.guide ? "border-destructive" : "")}
                placeholder="请输入申报指南内容..."
              />
            </div>
          )}

          {/* 模板说明 */}
          {!isFieldHidden('template') && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="template" className="flex items-center">
                模板说明
                {errors.template && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Textarea
                id="template"
                value={formData.template || ''}
                onChange={(e) => handleChange('template', e.target.value)}
                disabled={isFieldDisabled('template')}
                className={cn("min-h-20", errors.template ? "border-destructive" : "")}
                placeholder="请输入模板说明内容..."
              />
            </div>
          )}

          {/* 申报说明 */}
          {!isFieldHidden('description') && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="flex items-center">
                申报说明
                {errors.description && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={isFieldDisabled('description')}
                className={cn("min-h-20", errors.description ? "border-destructive" : "")}
                placeholder="请输入申报说明..."
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
