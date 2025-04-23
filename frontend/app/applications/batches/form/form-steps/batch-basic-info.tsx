"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InfoIcon, CalendarIcon, Upload, PaperclipIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useState } from "react"

interface BatchBasicInfoStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, string>
  isViewMode?: boolean
}

export function BatchBasicInfoStep({
  formData,
  handleInputChange,
  validationErrors,
  isViewMode = false,
}: BatchBasicInfoStepProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(
    formData.申请指南?.fileName || null
  )

  // 项目分类选项
  const projectCategories = [
    "国家自然科学基金项目",
    "国家社会科学基金项目",
    "教育部人文社科项目",
    "省级科研项目",
    "市级科研项目",
    "校级科研项目",
    "产学研合作项目",
    "其他项目"
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFileName(file.name)
      handleInputChange("申请指南", { file, fileName: file.name })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">基本信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md">
        {/* 计划名称 */}
        <div className="space-y-2">
          <Label htmlFor="planName" className="flex items-center">
            计划名称
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="planName"
              placeholder="请输入计划名称"
              value={formData.计划名称 || ""}
              onChange={(e) => handleInputChange("计划名称", e.target.value)}
              className={cn(
                validationErrors.计划名称 && "border-destructive",
              )}
              disabled={isViewMode}
            />
          </div>
          {validationErrors.计划名称 && <p className="text-destructive text-sm mt-1">{validationErrors.计划名称}</p>}
        </div>

        {/* 项目分类 */}
        <div className="space-y-2">
          <Label htmlFor="projectCategory" className="flex items-center">
            项目分类
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select
            value={formData.项目分类 || ""}
            onValueChange={(value) => handleInputChange("项目分类", value)}
            disabled={isViewMode}
          >
            <SelectTrigger
              id="projectCategory"
              className={cn(
                validationErrors.项目分类 && "border-destructive",
              )}
              disabled={isViewMode}
            >
              <SelectValue placeholder="请选择项目分类" />
            </SelectTrigger>
            <SelectContent>
              {projectCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.项目分类 && <p className="text-destructive text-sm mt-1">{validationErrors.项目分类}</p>}
        </div>

        {/* 申报开始日期 */}
        <div className="space-y-2">
          <Label htmlFor="applicationStartDate" className="flex items-center">
            申报开始日期
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.申报开始日期 && "text-muted-foreground",
                  validationErrors.申报开始日期 && "border-destructive",
                )}
                disabled={isViewMode}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.申报开始日期 ? format(new Date(formData.申报开始日期), "yyyy-MM-dd") : "请选择申报开始日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.申报开始日期 ? new Date(formData.申报开始日期) : undefined}
                onSelect={(date) => handleInputChange("申报开始日期", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationErrors.申报开始日期 && <p className="text-destructive text-sm mt-1">{validationErrors.申报开始日期}</p>}
        </div>

        {/* 申报结束日期 */}
        <div className="space-y-2">
          <Label htmlFor="applicationEndDate" className="flex items-center">
            申报结束日期
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.申报结束日期 && "text-muted-foreground",
                  validationErrors.申报结束日期 && "border-destructive",
                )}
                disabled={isViewMode}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.申报结束日期 ? format(new Date(formData.申报结束日期), "yyyy-MM-dd") : "请选择申报结束日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.申报结束日期 ? new Date(formData.申报结束日期) : undefined}
                onSelect={(date) => handleInputChange("申报结束日期", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationErrors.申报结束日期 && <p className="text-destructive text-sm mt-1">{validationErrors.申报结束日期}</p>}
        </div>

        {/* 申请指南 */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="applicationGuide" className="flex items-center">
            申请指南
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Label htmlFor="applicationGuide" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50">
                  <Upload className="h-4 w-4" />
                  <span>上传文档</span>
                </div>
                <input 
                  id="applicationGuide" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  disabled={isViewMode}
                />
              </Label>
              <span className="text-sm text-muted-foreground">支持上传PDF、Word等文档格式</span>
            </div>
            {selectedFileName && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedFileName}</span>
              </div>
            )}
          </div>
          {validationErrors.申请指南 && <p className="text-destructive text-sm mt-1">{validationErrors.申请指南}</p>}
        </div>

        {/* 批次说明 - 跨越两列 */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="batchDescription" className="flex items-center">
            批次说明
          </Label>
          <Textarea
            id="batchDescription"
            placeholder="请输入批次说明"
            value={formData.批次说明 || ""}
            onChange={(e) => handleInputChange("批次说明", e.target.value)}
            className={cn(
              validationErrors.批次说明 && "border-destructive",
            )}
            disabled={isViewMode}
          />
        </div>
      </div>
    </div>
  )
}
