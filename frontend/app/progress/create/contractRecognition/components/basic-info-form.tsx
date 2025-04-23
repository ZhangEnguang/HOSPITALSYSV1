"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function BasicInfoForm({ data, onUpdate, validationErrors }) {
  const [formValues, setFormValues] = useState({
    contractNumber: data?.contractNumber || "",
    contractName: data?.contractName || "",
    contractType: data?.contractType || "",
    contractStatus: data?.contractStatus || "",
    projectNumber: data?.projectNumber || "",
    projectName: data?.projectName || "",
    contractPurpose: data?.contractPurpose || "", 
    contractSource: data?.contractSource || "", 
    contractCategory: data?.contractCategory || "", 
  })

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    onUpdate(formValues)
  }, [formValues, onUpdate])

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contractNumber" className="flex items-center">
            合同编号
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="contractNumber"
            value={formValues.contractNumber}
            onChange={(e) => handleChange("contractNumber", e.target.value)}
            placeholder="请输入合同编号"
            className={validationErrors?.["合同编号"] ? "border-red-500" : ""}
          />
          {validationErrors?.["合同编号"] && (
            <p className="text-sm text-red-500 mt-1">请输入合同编号</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractName" className="flex items-center">
            合同名称
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="contractName"
            value={formValues.contractName}
            onChange={(e) => handleChange("contractName", e.target.value)}
            placeholder="请输入合同名称"
            className={validationErrors?.["合同名称"] ? "border-red-500" : ""}
          />
          {validationErrors?.["合同名称"] && (
            <p className="text-sm text-red-500 mt-1">请输入合同名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractType" className="flex items-center">
            合同类型
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formValues.contractType} 
            onValueChange={(value) => handleChange("contractType", value)}
          >
            <SelectTrigger 
              id="contractType"
              className={validationErrors?.["合同类型"] ? "border-red-500" : ""}
            >
              <SelectValue placeholder="请选择合同类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="purchase">采购合同</SelectItem>
              <SelectItem value="service">服务合同</SelectItem>
              <SelectItem value="cooperation">合作合同</SelectItem>
              <SelectItem value="research">研究合同</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["合同类型"] && (
            <p className="text-sm text-red-500 mt-1">请选择合同类型</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractCategory" className="flex items-center">
            合同分类
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formValues.contractCategory} 
            onValueChange={(value) => handleChange("contractCategory", value)}
          >
            <SelectTrigger 
              id="contractCategory"
              className={validationErrors?.["合同分类"] ? "border-red-500" : ""}
            >
              <SelectValue placeholder="请选择合同分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">标准合同</SelectItem>
              <SelectItem value="custom">定制合同</SelectItem>
              <SelectItem value="framework">框架合同</SelectItem>
              <SelectItem value="supplement">补充合同</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["合同分类"] && (
            <p className="text-sm text-red-500 mt-1">请选择合同分类</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractSource" className="flex items-center">
            合同来源
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={formValues.contractSource} 
            onValueChange={(value) => handleChange("contractSource", value)}
          >
            <SelectTrigger 
              id="contractSource"
              className={validationErrors?.["合同来源"] ? "border-red-500" : ""}
            >
              <SelectValue placeholder="请选择合同来源" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bidding">招投标</SelectItem>
              <SelectItem value="negotiation">商务谈判</SelectItem>
              <SelectItem value="renewal">续签</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["合同来源"] && (
            <p className="text-sm text-red-500 mt-1">请选择合同来源</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractStatus">合同状态</Label>
          <Select value={formValues.contractStatus} onValueChange={(value) => handleChange("contractStatus", value)}>
            <SelectTrigger id="contractStatus">
              <SelectValue placeholder="请选择合同状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="pending">待审批</SelectItem>
              <SelectItem value="active">生效中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="terminated">已终止</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="contractPurpose" className="flex items-center">
            合同目的
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="contractPurpose"
            value={formValues.contractPurpose}
            onChange={(e) => handleChange("contractPurpose", e.target.value)}
            placeholder="请简要描述合同目的"
            rows={3}
            className={validationErrors?.["合同目的"] ? "border-red-500" : ""}
          />
          {validationErrors?.["合同目的"] && (
            <p className="text-sm text-red-500 mt-1">请输入合同目的</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectNumber">关联项目编号</Label>
          <Input
            id="projectNumber"
            value={formValues.projectNumber}
            onChange={(e) => handleChange("projectNumber", e.target.value)}
            placeholder="请输入关联项目编号"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectName">关联项目名称</Label>
          <Input
            id="projectName"
            value={formValues.projectName}
            onChange={(e) => handleChange("projectName", e.target.value)}
            placeholder="请输入关联项目名称"
          />
        </div>
      </div>
    </div>
  )
}
