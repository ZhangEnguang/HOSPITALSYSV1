"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface BasicInfoFormProps {
  data: any
  onUpdate: (data: any) => void
  validationErrors?: Record<string, boolean>
}

export default function BasicInfoForm({ data, onUpdate, validationErrors = {} }: BasicInfoFormProps) {
  const [formValues, setFormValues] = useState({
    inspectionNumber: data?.inspectionNumber || "",
    inspectionName: data?.inspectionName || "",
    inspectionType: data?.inspectionType || "",
    inspectionStatus: data?.inspectionStatus || "",
    relatedProjectNumber: data?.relatedProjectNumber || "",
    relatedProjectName: data?.relatedProjectName || "",
    inspectionDate: data?.inspectionDate || "",
  })

  // 使用 ref 跟踪是否表单值已更改
  const formChanged = useRef(false)

  // 当数据从父组件变化时更新本地状态
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      // 使用函数式更新，避免依赖于之前的状态
      setFormValues({
        inspectionNumber: data.inspectionNumber || "",
        inspectionName: data.inspectionName || "",
        inspectionType: data.inspectionType || "",
        inspectionStatus: data.inspectionStatus || "",
        relatedProjectNumber: data.relatedProjectNumber || "",
        relatedProjectName: data.relatedProjectName || "",
        inspectionDate: data.inspectionDate || "",
      });
    }
  }, [data]); // 仅在data变化时执行

  // 使用useRef存储最新的onUpdate函数，避免在依赖项中包含它
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // 使用useRef存储最新的表单值，用于防抖处理
  const formValuesRef = useRef(formValues);
  useEffect(() => {
    formValuesRef.current = formValues;
  }, [formValues]);

  // 使用防抖函数来减少更新次数
  const debouncedUpdate = useRef<NodeJS.Timeout | null>(null);
  
  // 当表单值变化时，使用防抖更新父组件
  useEffect(() => {
    // 首次渲染时不触发更新
    if (!formChanged.current) {
      formChanged.current = true;
      return;
    }
    
    // 清除之前的定时器
    if (debouncedUpdate.current) {
      clearTimeout(debouncedUpdate.current);
    }
    
    // 设置新的定时器，延迟更新
    debouncedUpdate.current = setTimeout(() => {
      onUpdateRef.current(formValuesRef.current);
    }, 300); // 300ms 防抖延迟
    
    // 组件卸载时清除定时器
    return () => {
      if (debouncedUpdate.current) {
        clearTimeout(debouncedUpdate.current);
      }
    };
  }, [formValues]); // 仅在表单值变化时执行

  // 使用 useCallback 包装 handleChange 函数，避免重新创建
  const handleChange = useCallback((field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="inspectionNumber" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            检查编号
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="inspectionNumber"
            value={formValues.inspectionNumber}
            onChange={(e) => handleChange("inspectionNumber", e.target.value)}
            placeholder="请输入检查编号"
            className={cn(
              "w-full border-gray-300 rounded-md",
              validationErrors.inspectionNumber && "border-red-500"
            )}
          />
          {validationErrors.inspectionNumber && (
            <p className="text-red-500 text-xs mt-1">请输入检查编号</p>
          )}
        </div>
        <div>
          <Label htmlFor="inspectionName" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            检查名称
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="inspectionName"
            value={formValues.inspectionName}
            onChange={(e) => handleChange("inspectionName", e.target.value)}
            placeholder="请输入检查名称"
            className={cn(
              "w-full border-gray-300 rounded-md",
              validationErrors.inspectionName && "border-red-500"
            )}
          />
          {validationErrors.inspectionName && (
            <p className="text-red-500 text-xs mt-1">请输入检查名称</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="inspectionType" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            检查类型
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formValues.inspectionType} 
            onValueChange={(value) => handleChange("inspectionType", value)}
          >
            <SelectTrigger 
              id="inspectionType" 
              className={cn(
                "w-full border-gray-300",
                validationErrors.inspectionType && "border-red-500"
              )}
            >
              <SelectValue placeholder="请选择检查类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">常规检查</SelectItem>
              <SelectItem value="special">专项检查</SelectItem>
              <SelectItem value="followup">复查</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.inspectionType && (
            <p className="text-red-500 text-xs mt-1">请选择检查类型</p>
          )}
        </div>
        <div>
          <Label htmlFor="relatedProjectNumber" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            关联项目编号
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="relatedProjectNumber"
            value={formValues.relatedProjectNumber}
            onChange={(e) => handleChange("relatedProjectNumber", e.target.value)}
            placeholder="请输入关联项目编号"
            className={cn(
              "w-full border-gray-300 rounded-md",
              validationErrors.relatedProjectNumber && "border-red-500"
            )}
          />
          {validationErrors.relatedProjectNumber && (
            <p className="text-red-500 text-xs mt-1">请输入关联项目编号</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="inspectionDate" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            检查日期
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="inspectionDate"
            type="date"
            value={formValues.inspectionDate}
            onChange={(e) => handleChange("inspectionDate", e.target.value)}
            className={cn(
              "w-full border-gray-300 rounded-md",
              validationErrors.inspectionDate && "border-red-500"
            )}
          />
          {validationErrors.inspectionDate && (
            <p className="text-red-500 text-xs mt-1">请选择检查日期</p>
          )}
        </div>
        <div>
          <Label htmlFor="relatedProjectName" className="block text-sm font-medium text-gray-700 mb-1">
            关联项目名称
          </Label>
          <Input
            id="relatedProjectName"
            value={formValues.relatedProjectName}
            onChange={(e) => handleChange("relatedProjectName", e.target.value)}
            placeholder="请输入关联项目名称"
            className="w-full border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  )
}
