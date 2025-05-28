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
import { AlertCircle, Package, User, Calendar, FileText } from "lucide-react"

interface ReagentApplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reagent: any
}

export function ReagentApplyDialog({ open, onOpenChange, reagent }: ReagentApplyDialogProps) {
  // 表单数据状态
  const [formData, setFormData] = useState({
    // 申领基本信息
    applyAmount: "",
    applyPurpose: "",
    expectedUseDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 默认一周后
    urgencyLevel: "普通",
    
    // 申领人信息
    applicantName: "当前用户", // 实际项目中应该从用户上下文获取
    contactPhone: "",
    department: "",
    
    // 其他信息
    applyReason: "",
    notes: "",
  })

  // 当试剂数据变化时，更新表单中的部门信息
  useEffect(() => {
    if (reagent) {
      setFormData(prev => ({
        ...prev,
        department: reagent.department || "",
      }))
    }
  }, [reagent])

  // 当弹框打开状态变化时，重置表单数据
  useEffect(() => {
    if (!open) {
      // 弹框关闭时重置表单
      resetForm()
    }
  }, [open])

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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 处理字段失去焦点
  const handleBlur = (field: string) => {
    setFormTouched(prev => ({
      ...prev,
      [field]: true
    }))
  }

  // 验证表单
  const validateForm = () => {
    const requiredFields = [
      "applyAmount", 
      "applyPurpose", 
      "department",
      "applyReason"
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
          field === "applyAmount" ? "申领数量" : 
          field === "applyPurpose" ? "申领用途" : 
          field === "department" ? "所属部门" :
          field === "applyReason" ? "申请理由" : ""
        }`
      }
    })
    
    // 验证申领数量是否为有效数字且不超过库存
    if (formData.applyAmount) {
      const amount = Number(formData.applyAmount)
      if (isNaN(amount) || amount <= 0) {
        isValid = false
        newErrors.applyAmount = "请输入有效的申领数量"
      } else if (amount > reagent.currentAmount) {
        isValid = false
        newErrors.applyAmount = `申领数量不能超过当前库存（${reagent.currentAmount}${reagent.unit}）`
      }
    }
    
    // 验证预计使用日期不能是过去
    if (formData.expectedUseDate <= new Date()) {
      isValid = false
      newErrors.expectedUseDate = "预计使用日期不能是过去的日期"
    }
    
    setFormErrors(newErrors)
    setFormTouched(prev => ({
      ...prev,
      ...newTouched
    }))
    
    return isValid
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // 构建申领数据
      const applyData = {
        reagentId: reagent.id,
        reagentName: reagent.name,
        specification: reagent.specification,
        ...formData,
        applyDate: new Date(),
        status: "待审批"
      }
      
      // 这里应该调用API保存数据
      console.log("提交申领数据:", applyData)
      
      // 模拟API调用 - 95% 成功率用于演示
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.05) {
            resolve(applyData)
          } else {
            reject(new Error("服务器繁忙，请稍后重试"))
          }
        }, 1500)
      })
      
      // 设置成功状态
      setIsSuccess(true)
      
      // 成功提示
      toast({
        title: "🎉 申领提交成功",
        description: `${reagent.name} 申领申请已提交，申领数量：${formData.applyAmount}${reagent.unit}。请等待审批结果，我们会及时通知您。`,
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
        title: "❌ 申领提交失败",
        description: `提交失败：${errorMessage}。请检查网络连接是否正常，确认申领信息是否正确。您可以修改信息后重新提交。`,
        variant: "destructive",
        duration: 8000,
      })
      
      // 失败时不关闭弹框，允许用户继续操作
      console.error("申领提交失败:", error)
      
    } finally {
      setIsLoading(false)
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      applyAmount: "",
      applyPurpose: "",
      expectedUseDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      urgencyLevel: "普通",
      applicantName: "当前用户",
      contactPhone: "",
      department: reagent?.department || "",
      applyReason: "",
      notes: "",
    })
    setFormErrors({})
    setFormTouched({})
    setIsLoading(false)
    setIsSuccess(false)
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
            试剂申领
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            申领 <span className="font-medium text-foreground">{reagent.name}</span> 试剂
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
                  <span className="text-muted-foreground">当前库存</span>
                  <span className="font-medium text-blue-600">{reagent.currentAmount}{reagent.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">存储条件</span>
                  <span className="font-medium text-gray-900">{reagent.storageCondition}</span>
                </div>
              </div>
            </div>

            {/* 申领基本信息 */}
            <div>
              <SectionTitle 
                icon={<Package className="h-5 w-5" />} 
                title="申领信息" 
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="applyAmount" className="text-muted-foreground">
                    申领数量 <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      id="applyAmount" 
                      type="number"
                      value={formData.applyAmount} 
                      onChange={(e) => updateFormData("applyAmount", e.target.value)} 
                      onBlur={() => handleBlur("applyAmount")}
                      placeholder="请输入申领数量"
                      className={cn(
                        "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                        formTouched.applyAmount && formErrors.applyAmount ? "border-red-500" : ""
                      )}
                    />
                    <div className="flex items-center px-3 bg-gray-50 border border-[#E9ECF2] rounded-md text-sm text-muted-foreground">
                      {reagent.unit}
                    </div>
                  </div>
                  {formTouched.applyAmount && <ErrorMessage message={formErrors.applyAmount || ""} />}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="applyPurpose" className="text-muted-foreground">
                    申领用途 <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.applyPurpose} 
                    onValueChange={(value) => updateFormData("applyPurpose", value)}
                    onOpenChange={(open) => !open && handleBlur("applyPurpose")}
                  >
                    <SelectTrigger 
                      id="applyPurpose"
                      className={cn(
                        "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                        formTouched.applyPurpose && formErrors.applyPurpose ? "border-red-500" : ""
                      )}
                    >
                      <SelectValue placeholder="请选择申领用途" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="科研实验">科研实验</SelectItem>
                      <SelectItem value="教学实验">教学实验</SelectItem>
                      <SelectItem value="质量检测">质量检测</SelectItem>
                      <SelectItem value="产品开发">产品开发</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                  {formTouched.applyPurpose && <ErrorMessage message={formErrors.applyPurpose || ""} />}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedUseDate" className="text-muted-foreground">预计使用日期</Label>
                  <DatePicker 
                    id="expectedUseDate"
                    date={formData.expectedUseDate} 
                    onSelect={(date) => date && updateFormData("expectedUseDate", date)} 
                    className={cn(
                      "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                      formTouched.expectedUseDate && formErrors.expectedUseDate ? "border-red-500" : ""
                    )}
                  />
                  {formTouched.expectedUseDate && <ErrorMessage message={formErrors.expectedUseDate || ""} />}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="urgencyLevel" className="text-muted-foreground">紧急程度</Label>
                  <Select 
                    value={formData.urgencyLevel} 
                    onValueChange={(value) => updateFormData("urgencyLevel", value)}
                  >
                    <SelectTrigger 
                      id="urgencyLevel"
                      className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                    >
                      <SelectValue placeholder="请选择紧急程度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="普通">普通</SelectItem>
                      <SelectItem value="紧急">紧急</SelectItem>
                      <SelectItem value="特急">特急</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 申领人信息 */}
            <div>
              <SectionTitle 
                icon={<User className="h-5 w-5" />} 
                title="申领人信息" 
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName" className="text-muted-foreground">申领人</Label>
                  <Input 
                    id="applicantName" 
                    value={formData.applicantName} 
                    disabled
                    className="border-[#E9ECF2] rounded-md bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-muted-foreground">
                    联系方式
                  </Label>
                  <Input 
                    id="contactPhone" 
                    value={formData.contactPhone} 
                    onChange={(e) => updateFormData("contactPhone", e.target.value)} 
                    onBlur={() => handleBlur("contactPhone")}
                    placeholder="请输入手机号码"
                    className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                  />
                  {formTouched.contactPhone && <ErrorMessage message={formErrors.contactPhone || ""} />}
                </div>
              </div>

              <div className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-muted-foreground">
                    所属部门 <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => updateFormData("department", value)}
                    onOpenChange={(open) => !open && handleBlur("department")}
                  >
                    <SelectTrigger 
                      id="department"
                      className={cn(
                        "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                        formTouched.department && formErrors.department ? "border-red-500" : ""
                      )}
                    >
                      <SelectValue placeholder="请选择所属部门" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="化学实验室">化学实验室</SelectItem>
                      <SelectItem value="有机化学实验室">有机化学实验室</SelectItem>
                      <SelectItem value="分析化学实验室">分析化学实验室</SelectItem>
                      <SelectItem value="物理化学实验室">物理化学实验室</SelectItem>
                      <SelectItem value="无机化学实验室">无机化学实验室</SelectItem>
                      <SelectItem value="仪器分析实验室">仪器分析实验室</SelectItem>
                    </SelectContent>
                  </Select>
                  {formTouched.department && <ErrorMessage message={formErrors.department || ""} />}
                </div>
              </div>
            </div>

            {/* 其他信息 */}
            <div>
              <SectionTitle 
                icon={<FileText className="h-5 w-5" />} 
                title="其他信息" 
              />
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="applyReason" className="text-muted-foreground">
                    申请理由 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea 
                    id="applyReason" 
                    value={formData.applyReason} 
                    onChange={(e) => updateFormData("applyReason", e.target.value)} 
                    onBlur={() => handleBlur("applyReason")}
                    placeholder="请简要说明申领试剂的具体用途和理由"
                    className={cn(
                      "border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[80px]",
                      formTouched.applyReason && formErrors.applyReason ? "border-red-500" : ""
                    )}
                  />
                  {formTouched.applyReason && <ErrorMessage message={formErrors.applyReason || ""} />}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-muted-foreground">备注说明</Label>
                  <Textarea 
                    id="notes" 
                    value={formData.notes} 
                    onChange={(e) => updateFormData("notes", e.target.value)} 
                    placeholder="其他需要说明的信息（可选）"
                    className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 min-h-[60px]"
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
                提交中...
              </div>
            ) : isSuccess ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 text-white">✓</div>
                提交成功
              </div>
            ) : (
              "提交申请"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 