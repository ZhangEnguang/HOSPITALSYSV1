"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SupplierInfoFormProps {
  data: any
  onUpdate: (data: any) => void
  validationErrors: Record<string, boolean>
}

export default function SupplierInfoForm({ data, onUpdate, validationErrors }: SupplierInfoFormProps) {
  const [formValues, setFormValues] = useState({
    supplierName: data?.supplierName || "",
    supplierSocialCode: data?.supplierSocialCode || "",
    supplierPhone: data?.supplierPhone || "",
    supplierCity: data?.supplierCity || "",
    supplierBank: data?.supplierBank || "",
    supplierType: data?.supplierType || "",
    contactName: data?.contactName || "",
    supplierMilitaryProperty: data?.supplierMilitaryProperty || "",
    supplierReceiver: data?.supplierReceiver || "",
    supplierAccountNumber: data?.supplierAccountNumber || "",
    isForeignCompany: data?.isForeignCompany || "否",
    remarks: data?.remarks || "",
  })

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

  const handleChange = (field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileUpload = () => {
    // 模拟文件上传
    handleChange("businessLicense", "business_license_12345.pdf")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Building2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">供方信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="supplierName" className="flex items-center">
            供方单位 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="supplierName"
            value={formValues.supplierName}
            onChange={(e) => handleChange("supplierName", e.target.value)}
            placeholder="请输入供方单位"
            className={cn(
              validationErrors?.["供应商名称"] && "border-destructive"
            )}
          />
          {validationErrors?.["供应商名称"] && (
            <p className="text-xs text-destructive mt-1">请输入供方单位</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierUnitNature" className="flex items-center">
            供方单位性质 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formValues.supplierType} 
            onValueChange={(value) => handleChange("supplierType", value)}
          >
            <SelectTrigger id="supplierUnitNature">
              <SelectValue placeholder="请选择供方单位性质" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="国内企业">国内企业</SelectItem>
              <SelectItem value="央企">央企</SelectItem>
              <SelectItem value="国企">国企</SelectItem>
              <SelectItem value="事业单位">事业单位</SelectItem>
              <SelectItem value="民营企业">民营企业</SelectItem>
              <SelectItem value="个体工商户">个体工商户</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["供应商类型"] && (
            <p className="text-xs text-destructive mt-1">请选择供方单位性质</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierSocialCode" className="flex items-center">
            供方社会信用代码 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="supplierSocialCode"
            value={formValues.supplierSocialCode}
            onChange={(e) => handleChange("supplierSocialCode", e.target.value)}
            placeholder="请输入供方社会信用代码"
            className={cn(
              validationErrors?.["信用代码"] && "border-destructive"
            )}
          />
          {validationErrors?.["信用代码"] && (
            <p className="text-xs text-destructive mt-1">请输入供方社会信用代码</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactName" className="flex items-center">
            供方联系人姓名 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="contactName"
            value={formValues.contactName}
            onChange={(e) => handleChange("contactName", e.target.value)}
            placeholder="请输入联系人姓名"
            className={cn(
              validationErrors?.["联系人"] && "border-destructive"
            )}
          />
          {validationErrors?.["联系人"] && (
            <p className="text-xs text-destructive mt-1">请输入供方联系人姓名</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierPhone" className="flex items-center">
            供方电话 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="supplierPhone"
            value={formValues.supplierPhone}
            onChange={(e) => handleChange("supplierPhone", e.target.value)}
            placeholder="请输入供方电话"
            className={cn(
              validationErrors?.["联系电话"] && "border-destructive"
            )}
          />
          {validationErrors?.["联系电话"] && (
            <p className="text-xs text-destructive mt-1">请输入供方电话</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierMilitaryProperty" className="flex items-center">
            供方军品资质
          </Label>
          <Select 
            value={formValues.supplierMilitaryProperty} 
            onValueChange={(value) => handleChange("supplierMilitaryProperty", value)}
          >
            <SelectTrigger id="supplierMilitaryProperty">
              <SelectValue placeholder="请选择供方军品资质" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="无军品资质">无军品资质</SelectItem>
              <SelectItem value="三级保密资格">三级保密资格</SelectItem>
              <SelectItem value="二级保密资格">二级保密资格</SelectItem>
              <SelectItem value="一级保密资格">一级保密资格</SelectItem>
              <SelectItem value="军工认证">军工认证</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierCity" className="flex items-center">
            供方所属地市
          </Label>
          <Select 
            value={formValues.supplierCity} 
            onValueChange={(value) => handleChange("supplierCity", value)}
          >
            <SelectTrigger id="supplierCity">
              <SelectValue placeholder="请选择所属地市" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="北京市">北京市</SelectItem>
              <SelectItem value="上海市">上海市</SelectItem>
              <SelectItem value="广州市">广州市</SelectItem>
              <SelectItem value="深圳市">深圳市</SelectItem>
              <SelectItem value="杭州市">杭州市</SelectItem>
              <SelectItem value="南京市">南京市</SelectItem>
              <SelectItem value="成都市">成都市</SelectItem>
              <SelectItem value="重庆市">重庆市</SelectItem>
              <SelectItem value="武汉市">武汉市</SelectItem>
              <SelectItem value="西安市">西安市</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierBank" className="flex items-center">
            供方开户银行
          </Label>
          <Input
            id="supplierBank"
            value={formValues.supplierBank}
            onChange={(e) => handleChange("supplierBank", e.target.value)}
            placeholder="请输入开户银行"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierReceiver" className="flex items-center">
            供方收款人
          </Label>
          <Input
            id="supplierReceiver"
            value={formValues.supplierReceiver}
            onChange={(e) => handleChange("supplierReceiver", e.target.value)}
            placeholder="请输入收款人"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierAccountNumber" className="flex items-center">
            供方开户账号
          </Label>
          <Input
            id="supplierAccountNumber"
            value={formValues.supplierAccountNumber}
            onChange={(e) => handleChange("supplierAccountNumber", e.target.value)}
            placeholder="请输入开户账号"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center">
            供方是否境外单位
          </Label>
          <RadioGroup
            value={formValues.isForeignCompany}
            onValueChange={(value) => handleChange("isForeignCompany", value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="是" id="foreign-yes" />
              <Label htmlFor="foreign-yes" className="cursor-pointer">是</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="否" id="foreign-no" />
              <Label htmlFor="foreign-no" className="cursor-pointer">否</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks" className="flex items-center">
          备注
        </Label>
        <Textarea
          id="remarks"
          value={formValues.remarks}
          onChange={(e) => handleChange("remarks", e.target.value)}
          placeholder="请输入备注信息"
          rows={3}
        />
      </div>
    </div>
  )
} 