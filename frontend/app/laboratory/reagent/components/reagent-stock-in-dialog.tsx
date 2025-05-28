"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DatePicker } from "@/components/date-picker"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Package, Calendar, DollarSign, FileText } from "lucide-react"

interface ReagentStockInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reagent: any
}

export function ReagentStockInDialog({ open, onOpenChange, reagent }: ReagentStockInDialogProps) {
  // 表单数据状态
  const [formData, setFormData] = useState({
    // 入库基本信息
    stockInAmount: "",
    batchNumber: "",
    productionDate: new Date(),
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
    stockInDate: new Date(),
    
    // 存储信息
    location: "",
    storageCondition: "",
    
    // 质量信息
    qualityStatus: "待检验",
    qualityReport: null as File | null,
    
    // 成本信息
    unitPrice: "",
    totalPrice: "",
    
    // 其他信息
    notes: "",
  })

  // 当试剂数据变化时，更新表单中的存储信息
  useEffect(() => {
    if (reagent) {
      setFormData(prev => ({
        ...prev,
        location: reagent.location || "",
        storageCondition: reagent.storageCondition || "",
      }))
    }
  }, [reagent])

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // 表单字段触摸状态
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false)
  
  // 成功状态
  const [isSuccess, setIsSuccess] = useState(false)

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value
      }

      // 自动计算总价
      if (field === "stockInAmount" || field === "unitPrice") {
        const amount = field === "stockInAmount" ? parseFloat(value) || 0 : parseFloat(prev.stockInAmount) || 0
        const price = field === "unitPrice" ? parseFloat(value) || 0 : parseFloat(prev.unitPrice) || 0
        const total = amount * price
        
        if (total > 0) {
          newData.totalPrice = total.toFixed(2)
        }
      }

      return newData
    })
  }

  // 处理字段失去焦点
  const handleBlur = (field: string) => {
    setFormTouched((prev) => ({
      ...prev,
      [field]: true
    }))
  }

  // 验证表单
  const validateForm = () => {
    const requiredFields = [
      "stockInAmount", 
      "batchNumber", 
      "location",
      "storageCondition",
      "qualityStatus"
    ]
    
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}
    
    // 验证必填字段是否填写
    requiredFields.forEach(field => {
      newTouched[field] = true
      
      if (!formData[field as keyof typeof formData]) {
        isValid = false
        newErrors[field] = `请填写${
          field === "stockInAmount" ? "入库数量" : 
          field === "batchNumber" ? "批次号" : 
          field === "location" ? "存放位置" : 
          field === "storageCondition" ? "存储条件" :
          field === "qualityStatus" ? "质检状态" : ""
        }`
      }
    })
    
    // 验证数量是否为有效数字
    if (formData.stockInAmount && isNaN(Number(formData.stockInAmount))) {
      isValid = false
      newErrors.stockInAmount = "请输入有效的数量"
    }
    
    // 验证价格是否为有效数字
    if (formData.unitPrice && isNaN(Number(formData.unitPrice))) {
      isValid = false
      newErrors.unitPrice = "请输入有效的单价"
    }
    
    // 验证有效期是否晚于生产日期
    if (formData.expiryDate <= formData.productionDate) {
      isValid = false
      newErrors.expiryDate = "有效期必须晚于生产日期"
    }
    
    setFormErrors(newErrors)
    setFormTouched(prev => ({
      ...prev,
      ...newTouched
    }))
    
    return isValid
  }

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        qualityReport: file
      }))
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // 构建入库数据
      const stockInData = {
        reagentId: reagent.id,
        ...formData,
        // 计算入库后的总库存
        newTotalAmount: (reagent.currentAmount || 0) + parseFloat(formData.stockInAmount)
      }
      
      // 这里应该调用API保存数据
      console.log("提交入库数据:", stockInData)
      
      // 模拟API调用 - 随机成功或失败用于演示
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 90% 成功率用于演示
          if (Math.random() > 0.1) {
            resolve(stockInData)
          } else {
            reject(new Error("网络连接超时"))
          }
        }, 1500)
      })
      
      // 计算新库存
      const newTotalAmount = (reagent.currentAmount || 0) + parseFloat(formData.stockInAmount)
      
      // 设置成功状态
      setIsSuccess(true)
      
      // 成功提示
      toast({
        title: "🎉 入库成功",
        description: `${reagent.name} 已成功入库 ${formData.stockInAmount}${reagent.unit}，批次号：${formData.batchNumber}。库存已更新：${reagent.currentAmount}${reagent.unit} → ${newTotalAmount}${reagent.unit}`,
        duration: 5000,
      })
      
      // 延迟关闭弹框，确保用户看到成功提示
      setTimeout(() => {
        onOpenChange(false)
        resetForm()
        setIsSuccess(false)
      }, 2000)
      
    } catch (error: any) {
      // 失败提示 - 显示具体错误信息
      const errorMessage = error?.message || "未知错误"
      
      toast({
        title: "❌ 入库失败",
        description: `操作失败：${errorMessage}。请检查网络连接是否正常，确认试剂信息是否正确。您可以修改信息后重新提交，或联系管理员处理。`,
        variant: "destructive",
        duration: 8000,
      })
      
      // 失败时不关闭弹框，允许用户继续操作
      console.error("入库失败:", error)
      
    } finally {
      setIsLoading(false)
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      stockInAmount: "",
      batchNumber: "",
      productionDate: new Date(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      stockInDate: new Date(),
      location: reagent?.location || "",
      storageCondition: reagent?.storageCondition || "",
      qualityStatus: "待检验",
      qualityReport: null,
      unitPrice: "",
      totalPrice: "",
      notes: "",
    })
    setFormErrors({})
    setFormTouched({})
  }

  // 错误信息组件
  const ErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null
    
    return (
      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {message}
      </div>
    )
  }

  // 区域标题组件
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className="flex items-center gap-2 mb-4">
        <div className="text-blue-500">
          {icon}
        </div>
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
      </div>
    )
  }

  if (!reagent) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 gap-0">
        {/* 固定顶部标题栏 */}
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Package className="h-5 w-5 text-blue-500" />
            试剂入库
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            为 <span className="font-medium text-foreground">{reagent.name}</span> 添加新的库存
          </DialogDescription>
        </DialogHeader>

        {/* 可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
          {/* 试剂基本信息展示 */}
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              试剂信息
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">试剂名称</span>
                <span className="font-medium text-gray-900">{reagent.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">规格</span>
                <span className="font-medium text-gray-900">{reagent.specification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">目录号</span>
                <span className="font-medium text-gray-900">{reagent.catalogNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">当前库存</span>
                <span className="font-medium text-blue-600">{reagent.currentAmount}{reagent.unit}</span>
              </div>
            </div>
          </div>

          {/* 入库基本信息 */}
          <div>
            <SectionTitle 
              icon={<Package className="h-5 w-5" />} 
              title="入库信息" 
            />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="stockInAmount" className="text-muted-foreground">
                  入库数量 <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    id="stockInAmount" 
                    type="number"
                    value={formData.stockInAmount} 
                    onChange={(e) => updateFormData("stockInAmount", e.target.value)} 
                    onBlur={() => handleBlur("stockInAmount")}
                    placeholder="请输入入库数量"
                    className={cn(
                      "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                      formTouched.stockInAmount && formErrors.stockInAmount ? "border-red-500" : ""
                    )}
                  />
                  <div className="flex items-center px-3 bg-gray-50 border border-[#E9ECF2] rounded-md text-sm text-muted-foreground">
                    {reagent.unit}
                  </div>
                </div>
                {formTouched.stockInAmount && <ErrorMessage message={formErrors.stockInAmount || ""} />}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batchNumber" className="text-muted-foreground">
                  批次号 <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="batchNumber" 
                  value={formData.batchNumber} 
                  onChange={(e) => updateFormData("batchNumber", e.target.value)} 
                  onBlur={() => handleBlur("batchNumber")}
                  placeholder="请输入批次号"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.batchNumber && formErrors.batchNumber ? "border-red-500" : ""
                  )}
                />
                {formTouched.batchNumber && <ErrorMessage message={formErrors.batchNumber || ""} />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="productionDate" className="text-muted-foreground">生产日期</Label>
                <DatePicker 
                  id="productionDate"
                  date={formData.productionDate} 
                  onSelect={(date) => date && updateFormData("productionDate", date)} 
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-muted-foreground">有效期至</Label>
                <DatePicker 
                  id="expiryDate"
                  date={formData.expiryDate} 
                  onSelect={(date) => date && updateFormData("expiryDate", date)} 
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.expiryDate && formErrors.expiryDate ? "border-red-500" : ""
                  )}
                />
                {formTouched.expiryDate && <ErrorMessage message={formErrors.expiryDate || ""} />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="stockInDate" className="text-muted-foreground">入库日期</Label>
                <DatePicker 
                  id="stockInDate"
                  date={formData.stockInDate} 
                  onSelect={(date) => date && updateFormData("stockInDate", date)} 
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qualityStatus" className="text-muted-foreground">
                  质检状态 <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.qualityStatus} 
                  onValueChange={(value) => updateFormData("qualityStatus", value)}
                  onOpenChange={(open) => !open && handleBlur("qualityStatus")}
                >
                  <SelectTrigger 
                    id="qualityStatus"
                    className={cn(
                      "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                      formTouched.qualityStatus && formErrors.qualityStatus ? "border-red-500" : ""
                    )}
                  >
                    <SelectValue placeholder="请选择质检状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="待检验">待检验</SelectItem>
                    <SelectItem value="合格">合格</SelectItem>
                    <SelectItem value="不合格">不合格</SelectItem>
                  </SelectContent>
                </Select>
                {formTouched.qualityStatus && <ErrorMessage message={formErrors.qualityStatus || ""} />}
              </div>
            </div>
          </div>

          {/* 存储信息 */}
          <div>
            <SectionTitle 
              icon={<Calendar className="h-5 w-5" />} 
              title="存储信息" 
            />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-muted-foreground">
                  存放位置 <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.location} 
                  onValueChange={(value) => updateFormData("location", value)}
                  onOpenChange={(open) => !open && handleBlur("location")}
                >
                  <SelectTrigger 
                    id="location"
                    className={cn(
                      "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                      formTouched.location && formErrors.location ? "border-red-500" : ""
                    )}
                  >
                    <SelectValue placeholder="请选择存放位置" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A栋冰箱">A栋冰箱</SelectItem>
                    <SelectItem value="B栋试剂柜">B栋试剂柜</SelectItem>
                    <SelectItem value="C栋危化品柜">C栋危化品柜</SelectItem>
                    <SelectItem value="D栋常温架">D栋常温架</SelectItem>
                  </SelectContent>
                </Select>
                {formTouched.location && <ErrorMessage message={formErrors.location || ""} />}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storageCondition" className="text-muted-foreground">
                  存储条件 <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.storageCondition} 
                  onValueChange={(value) => updateFormData("storageCondition", value)}
                  onOpenChange={(open) => !open && handleBlur("storageCondition")}
                >
                  <SelectTrigger 
                    id="storageCondition"
                    className={cn(
                      "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                      formTouched.storageCondition && formErrors.storageCondition ? "border-red-500" : ""
                    )}
                  >
                    <SelectValue placeholder="请选择存储条件" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="常温">常温</SelectItem>
                    <SelectItem value="4℃">4℃</SelectItem>
                    <SelectItem value="-20℃">-20℃</SelectItem>
                    <SelectItem value="-80℃">-80℃</SelectItem>
                  </SelectContent>
                </Select>
                {formTouched.storageCondition && <ErrorMessage message={formErrors.storageCondition || ""} />}
              </div>
            </div>
          </div>

          {/* 成本信息 */}
          <div>
            <SectionTitle 
              icon={<DollarSign className="h-5 w-5" />} 
              title="成本信息" 
            />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="unitPrice" className="text-muted-foreground">单价（元）</Label>
                <Input 
                  id="unitPrice" 
                  type="number"
                  step="0.01"
                  value={formData.unitPrice} 
                  onChange={(e) => updateFormData("unitPrice", e.target.value)} 
                  onBlur={() => handleBlur("unitPrice")}
                  placeholder="请输入单价"
                  className={cn(
                    "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    formTouched.unitPrice && formErrors.unitPrice ? "border-red-500" : ""
                  )}
                />
                {formTouched.unitPrice && <ErrorMessage message={formErrors.unitPrice || ""} />}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalPrice" className="text-muted-foreground">总价（元）</Label>
                <Input 
                  id="totalPrice" 
                  type="number"
                  step="0.01"
                  value={formData.totalPrice} 
                  onChange={(e) => updateFormData("totalPrice", e.target.value)} 
                  placeholder="自动计算或手动输入"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                />
              </div>
            </div>
          </div>

          {/* 质检报告和备注 */}
          <div>
            <SectionTitle 
              icon={<FileText className="h-5 w-5" />} 
              title="其他信息" 
            />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qualityReport" className="text-muted-foreground">质检报告</Label>
                <Input 
                  id="qualityReport" 
                  type="file" 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                />
                <p className="text-sm text-muted-foreground">
                  支持PDF、Word文档、图片格式，最大10MB
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-muted-foreground">备注</Label>
                <Textarea 
                  id="notes" 
                  value={formData.notes} 
                  onChange={(e) => updateFormData("notes", e.target.value)} 
                  placeholder="请输入入库备注信息"
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]"
                />
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* 固定底部操作栏 */}
        <DialogFooter className="flex-shrink-0 flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {isLoading ? "取消" : "返回列表"}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || isSuccess}
            className={cn(
              "flex-1 h-10 text-white",
              isSuccess 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                入库中...
              </div>
            ) : isSuccess ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 text-white">✓</div>
                入库成功
              </div>
            ) : (
              "确认入库"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 