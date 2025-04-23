"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { get } from "@/lib/api"
import type { ApiResponse } from "@/lib/api"
import { Loader2 } from "lucide-react"
import Dict from "@/components/dict/Dict"

// 定义表单值的接口
export interface BudgetStandardFormData {
  name: string
  code: string
  projectType: string
  limitAmount: string | number
  description: string
  status: string
}

interface BasicInfoFormProps {
  data?: Partial<BudgetStandardFormData>
  onUpdate: (data: BudgetStandardFormData) => void
  validationErrors?: Record<string, boolean>
}

export default function BasicInfoForm({ data, onUpdate, validationErrors }: BasicInfoFormProps) {
  const [formValues, setFormValues] = useState<BudgetStandardFormData>({
    name: data?.name || "",
    code: data?.code || "",
    projectType: data?.projectType || "",
    limitAmount: data?.limitAmount || "",
    description: data?.description || "",
    status: data?.status || "启用",
  })
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  // Only update parent when form values actually change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    onUpdate(formValues)
  }, [formValues, onUpdate])

  // 当项目类型变化时自动生成编码
  useEffect(() => {
    if (formValues.projectType) {
      generateCodeFromProjectType(formValues.projectType);
    }
  }, [formValues.projectType]);

  const handleChange = (field: keyof BudgetStandardFormData, value: string | number) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 用于Dict组件的setFormData
  const setDictFormData = (updater: any) => {
    // Dict组件传入的是一个更新函数，不是对象
    if (typeof updater === 'function') {
      setFormValues(prev => {
        try {
          // 创建一个临时对象，模拟updater函数的运行结果
          const tempData = updater({
            projectType: prev.projectType
          });
          
          // 更新状态
          const newValues = { ...prev, ...tempData };
          return newValues;
        } catch (error) {
          console.error("处理Dict组件数据出错:", error);
          return prev;
        }
      });
    }
  }

  // 根据项目类型生成编码
  const generateCodeFromProjectType = async (projectType: string) => {
    setIsGeneratingCode(true);
    try {
      // 调用后端API生成前缀
      const response = await get<ApiResponse<string>>(`/api/project/budgetStandard/generatePrefix?projectType=${encodeURIComponent(projectType)}`);
      
      if (response.code === 200 && response.data) {
        setFormValues(prev => ({
          ...prev,
          code: response.data
        }));
      }
    } catch (error) {
      console.error("生成编码失败:", error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center">
            预算标准名称 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="name"
            value={formValues.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="请输入预算标准名称"
            className={cn(
              validationErrors?.["名称"] && "border-destructive"
            )}
          />
          {validationErrors?.["名称"] && (
            <p className="text-xs text-destructive mt-1">请输入预算标准名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectType" className="flex items-center">
            适用项目类型 <span className="text-destructive ml-1">*</span>
          </Label>
          <Dict 
            dictCode="project_type"
            displayType="select"
            value={formValues.projectType} 
            field="projectType"
            setFormData={setDictFormData}
            placeholder="请选择适用项目类型"
            className={cn(
              validationErrors?.["项目类型"] && "border-destructive"
            )}
          />
          {validationErrors?.["项目类型"] && (
            <p className="text-xs text-destructive mt-1">请选择适用项目类型</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="code" className="flex items-center">
            编码 <span className="text-destructive ml-1">*</span>
            {isGeneratingCode && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Label>
          <Input
            id="code"
            value={formValues.code}
            readOnly
            placeholder="选择项目类型后自动生成"
            className={cn(
              "bg-muted cursor-not-allowed",
              validationErrors?.["编码"] && "border-destructive"
            )}
          />
          {validationErrors?.["编码"] && (
            <p className="text-xs text-destructive mt-1">请先选择项目类型生成编码</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="limitAmount" className="flex items-center">
            限额(元) <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="limitAmount"
            type="number"
            value={formValues.limitAmount}
            onChange={(e) => handleChange("limitAmount", e.target.value)}
            placeholder="请输入限额"
            className={cn(
              validationErrors?.["限额"] && "border-destructive"
            )}
          />
          {validationErrors?.["限额"] && (
            <p className="text-xs text-destructive mt-1">请输入有效的限额</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center">
          预算标准描述
        </Label>
        <Textarea
          id="description"
          value={formValues.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="请输入预算标准描述"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="flex items-center">
          状态 <span className="text-destructive ml-1">*</span>
        </Label>
        <Select 
          value={formValues.status} 
          onValueChange={(value) => handleChange("status", value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="请选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="启用">启用</SelectItem>
            <SelectItem value="停用">停用</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}