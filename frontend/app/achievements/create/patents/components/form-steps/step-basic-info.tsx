"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepBasicInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepBasicInfo({ formData, updateFormData, validationErrors }: StepBasicInfoProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    updateFormData(id, value)
  }

  const handleSelectChange = (field: string, value: string) => {
    updateFormData(field, value)
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
          <Label htmlFor="patentNumber" className="text-sm font-medium flex items-center">
            专利号 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="patentNumber"
            placeholder="请输入专利号"
            value={formData.patentNumber || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["专利号"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["专利号"] && (
            <p className="text-sm text-destructive">请输入专利号</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="patentName" className="text-sm font-medium flex items-center">
            专利名称 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="patentName"
            placeholder="请输入专利名称"
            value={formData.patentName || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["专利名称"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["专利名称"] && (
            <p className="text-sm text-destructive">请输入专利名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="patentType" className="text-sm font-medium flex items-center">
            专利类型 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.patentType || ""} 
            onValueChange={(value) => handleSelectChange("patentType", value)}
          >
            <SelectTrigger 
              id="patentType"
              className={cn(
                validationErrors["专利类型"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择专利类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="invention">发明专利</SelectItem>
              <SelectItem value="utility">实用新型专利</SelectItem>
              <SelectItem value="design">外观设计专利</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors["专利类型"] && (
            <p className="text-sm text-destructive">请选择专利类型</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="patentStatus" className="text-sm font-medium flex items-center">
            专利状态 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formData.patentStatus || ""} 
            onValueChange={(value) => handleSelectChange("patentStatus", value)}
          >
            <SelectTrigger 
              id="patentStatus"
              className={cn(
                validationErrors["专利状态"] && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder="请选择专利状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">已申请</SelectItem>
              <SelectItem value="authorized">已授权</SelectItem>
              <SelectItem value="rejected">已驳回</SelectItem>
              <SelectItem value="abandoned">已放弃</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors["专利状态"] && (
            <p className="text-sm text-destructive">请选择专利状态</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationDate" className="text-sm font-medium flex items-center">
            申请日期 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="applicationDate"
            type="date"
            value={formData.applicationDate || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["申请日期"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["申请日期"] && (
            <p className="text-sm text-destructive">请选择申请日期</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalDate" className="text-sm font-medium">
            授权日期
          </Label>
          <Input
            id="approvalDate"
            type="date"
            value={formData.approvalDate || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
}
