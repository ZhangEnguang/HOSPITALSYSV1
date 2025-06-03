"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Package,
  Clock,
  AlertTriangle,
  Edit,
  User,
  FileText,
  Calendar,
  Target,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface ReagentApplicationEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: any
  onSave: (updatedApplication: any) => void
}

export function ReagentApplicationEditDialog({ 
  open, 
  onOpenChange, 
  application,
  onSave
}: ReagentApplicationEditDialogProps) {
  // 表单数据状态
  const [formData, setFormData] = useState({
    applicationTitle: "",
    quantity: "",
    unit: "mL",
    purpose: "",
    expectedDate: "",
    urgency: "一般",
    remarks: "",
    project: "",
  })

  // 初始化表单数据
  useEffect(() => {
    if (application && open) {
      setFormData({
        applicationTitle: application.applicationTitle || "",
        quantity: application.quantity?.toString() || "",
        unit: application.unit || "mL",
        purpose: application.purpose || "",
        expectedDate: application.expectedDate ? format(new Date(application.expectedDate), "yyyy-MM-dd") : "",
        urgency: application.urgency || "一般",
        remarks: application.remarks || application.notes || "",
        project: application.project || "",
      })
    }
  }, [application, open])

  // 数量验证状态
  const [quantityError, setQuantityError] = useState("")

  // 验证申领数量
  const validateQuantity = (value: string) => {
    if (!value) {
      setQuantityError("")
      return
    }

    // 检查是否为有效数字
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      setQuantityError("请输入有效的数量")
      return
    }

    // 检查是否为整数或小数（根据单位判断）
    if (!["mL", "L", "g", "kg"].includes(formData.unit) && numValue !== Math.floor(numValue)) {
      setQuantityError("申领数量必须为整数")
      return
    }

    setQuantityError("")
  }

  // 处理数量输入变化
  const handleQuantityChange = (value: string) => {
    setFormData(prev => ({ ...prev, quantity: value }))
    validateQuantity(value)
  }

  // 紧急程度选项
  const urgencyOptions = [
    { value: "一般", label: "一般", color: "bg-gray-100 text-gray-700" },
    { value: "紧急", label: "紧急", color: "bg-yellow-100 text-yellow-700" },
    { value: "非常紧急", label: "非常紧急", color: "bg-red-100 text-red-700" },
  ]

  // 状态颜色配置
  const getStatusStyle = (status: string) => {
    const statusColors: Record<string, string> = {
      "待审核": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "审核通过": "bg-green-100 text-green-700 border-green-200",
      "审核退回": "bg-red-100 text-red-700 border-red-200",
      "已发放": "bg-blue-100 text-blue-700 border-blue-200",
      "已完成": "bg-purple-100 text-purple-700 border-purple-200",
      "已取消": "bg-gray-100 text-gray-700 border-gray-200",
    }
    return statusColors[status] || statusColors["待审核"]
  }

  // 处理表单提交
  const handleSubmit = () => {
    // 验证表单数据
    if (!formData.applicationTitle || !formData.quantity || !formData.purpose || !formData.expectedDate) {
      toast({
        title: "表单验证失败",
        description: "请填写完整的申领信息",
        variant: "destructive",
      })
      return
    }

    // 检查数量验证错误
    if (quantityError) {
      toast({
        title: "数量验证失败",
        description: quantityError,
        variant: "destructive",
      })
      return
    }

    // 构建更新后的申请数据
    const updatedApplication = {
      ...application,
      applicationTitle: formData.applicationTitle,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      purpose: formData.purpose,
      expectedDate: formData.expectedDate,
      urgency: formData.urgency,
      remarks: formData.remarks,
      notes: formData.remarks, // 同时更新notes字段
      project: formData.project,
      // 更新最后修改时间
      lastModified: new Date().toISOString(),
    }

    // 调用保存回调
    onSave(updatedApplication)

    toast({
      title: "申请已更新",
      description: `申领申请 "${formData.applicationTitle}" 已成功更新`,
    })

    onOpenChange(false)
  }

  // 重置表单
  const handleReset = () => {
    if (application) {
      setFormData({
        applicationTitle: application.applicationTitle || "",
        quantity: application.quantity?.toString() || "",
        unit: application.unit || "mL",
        purpose: application.purpose || "",
        expectedDate: application.expectedDate ? format(new Date(application.expectedDate), "yyyy-MM-dd") : "",
        urgency: application.urgency || "一般",
        remarks: application.remarks || application.notes || "",
        project: application.project || "",
      })
      setQuantityError("")
    }
  }

  if (!application) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        {/* 固定顶部标题栏 */}
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            编辑申领申请
          </DialogTitle>
        </DialogHeader>

        {/* 可滚动的中间内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* 申领状态提示 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">申领状态</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs", getStatusStyle(application.status))}>
                      {application.status}
                    </Badge>
                    <span className="text-sm text-blue-700">
                      申请时间：{format(new Date(application.applicationDate), "yyyy年MM月dd日 HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 试剂基本信息展示（只读） */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                试剂信息
              </h4>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{application.reagentName}</h3>
                    {application.englishName && (
                      <p className="text-sm text-gray-600">{application.englishName}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">试剂类型</span>
                    <span className="font-medium">{application.reagentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">规格型号</span>
                    <span className="font-medium">{application.specification}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 申请人信息展示（只读） */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                申请人信息
              </h4>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{application.applicant.name}</p>
                    <p className="text-sm text-gray-600">{application.department}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">联系邮箱</span>
                    <span className="font-medium">{application.applicant.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 可编辑的申领信息 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                申领信息
              </h4>

              {/* 申领标题 */}
              <div className="space-y-2">
                <Label htmlFor="applicationTitle">申领标题 *</Label>
                <Input
                  id="applicationTitle"
                  placeholder="请输入申领标题"
                  value={formData.applicationTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationTitle: e.target.value }))}
                />
              </div>

              {/* 项目名称 */}
              <div className="space-y-2">
                <Label htmlFor="project">所属项目</Label>
                <Input
                  id="project"
                  placeholder="请输入项目名称"
                  value={formData.project}
                  onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                />
              </div>
            
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">申领数量 *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="quantity"
                      type="number"
                      placeholder="输入数量"
                      value={formData.quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className={cn(
                        "flex-1",
                        quantityError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      )}
                      min="1"
                      step="0.1"
                    />
                    <Input
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-20"
                      placeholder="单位"
                    />
                  </div>
                  
                  {/* 错误提示 */}
                  {quantityError && (
                    <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {quantityError}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectedDate">期望使用日期 *</Label>
                  <Input
                    id="expectedDate"
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>紧急程度</Label>
                <div className="flex gap-2">
                  {urgencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, urgency: option.value }))}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                        formData.urgency === option.value
                          ? `${option.color} border-current`
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 申领用途 */}
            <div className="space-y-2">
              <Label htmlFor="purpose">申领用途 *</Label>
              <Textarea 
                id="purpose"
                placeholder="请详细说明试剂用途和使用目的..."
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                rows={3}
              />
            </div>
            
            {/* 备注说明 */}
            <div className="space-y-2">
              <Label htmlFor="remarks">备注说明</Label>
              <Textarea 
                id="remarks"
                placeholder="其他需要说明的事项（可选）..."
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                rows={2}
              />
            </div>

            {/* 审核信息（如果已审核） */}
            {(application.status === "审核通过" || application.status === "审核退回" || application.status === "已发放" || application.status === "已完成") && application.processor && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  审核信息
                </h4>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">审核人</span>
                      <span className="font-medium">{application.processor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">审核时间</span>
                      <span className="font-medium">
                        {application.processDate && format(new Date(application.processDate), "yyyy/MM/dd HH:mm")}
                      </span>
                    </div>
                  </div>
                  
                  {application.approvalComments && (
                    <div className="pt-2 border-t">
                      <Label className="text-sm text-muted-foreground">审核意见</Label>
                      <p className="text-sm mt-1">{application.approvalComments}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 固定底部操作栏 */}
        <div className="flex-shrink-0 flex justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <Button variant="outline" onClick={handleReset}>
            重置
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!!quantityError || !formData.applicationTitle || !formData.quantity || !formData.purpose || !formData.expectedDate}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4 mr-2" />
              保存修改
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 