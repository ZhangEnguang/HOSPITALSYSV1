"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, User, Package, FileText, AlertTriangle, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ReagentApplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reagent: any
}

export function ReagentApplyDialog({ open, onOpenChange, reagent }: ReagentApplyDialogProps) {
  // 检查是否已过期
  const isExpired = () => {
    if (!reagent) return false;
    const expiryDate = new Date(reagent.expiryDate);
    const today = new Date();
    return expiryDate < today || reagent.status === "已过期";
  };

  // 检查是否即将过期（30天内）
  const isExpiringSoon = () => {
    if (!reagent) return false;
    const expiryDate = new Date(reagent.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  // 检查是否库存不足
  const isOutOfStock = () => {
    if (!reagent) return false;
    return reagent.currentAmount <= 0;
  };

  // 检查是否可以申领
  const canApply = () => {
    return !isExpired() && !isOutOfStock();
  };

  // 表单数据状态
  const [formData, setFormData] = useState({
    quantity: "",
    unit: reagent?.unit || "mL",
    purpose: "",
    expectedDate: "",
    urgency: "一般",
    remarks: "",
  })

  // 紧急程度选项
  const urgencyOptions = [
    { value: "一般", label: "一般", color: "bg-gray-100 text-gray-700" },
    { value: "紧急", label: "紧急", color: "bg-yellow-100 text-yellow-700" },
    { value: "非常紧急", label: "非常紧急", color: "bg-red-100 text-red-700" },
  ]

  // 处理表单提交
  const handleSubmit = () => {
    if (isExpired()) {
      toast({
        title: "申领失败",
        description: "试剂已过期，无法申领。请联系管理员进行处理。",
        variant: "destructive",
      })
      return;
    }

    if (!canApply()) {
      toast({
        title: "申领失败", 
        description: "试剂库存不足或状态异常，无法申领。",
        variant: "destructive",
      })
      return;
    }

    // 验证表单数据
    if (!formData.quantity || !formData.purpose || !formData.expectedDate) {
      toast({
        title: "表单验证失败",
        description: "请填写完整的申领信息",
        variant: "destructive",
      })
      return
    }
    
    // 检查申领数量是否超过库存
    const requestedQuantity = parseFloat(formData.quantity)
    if (requestedQuantity > reagent.currentAmount) {
      toast({
        title: "申领数量超限",
        description: `申领数量不能超过当前库存量 ${reagent.currentAmount}${reagent.unit}`,
        variant: "destructive",
      })
      return
    }

    // 模拟提交申请
    console.log("提交申领申请:", {
      reagentId: reagent.id,
      reagentName: reagent.name,
      ...formData,
      requestedQuantity
    })

    toast({
      title: "申领申请已提交",
      description: `已成功提交 ${reagent.name} 的申领申请，申请数量：${formData.quantity}${formData.unit}`,
    })

    // 重置表单并关闭弹框
    setFormData({
      quantity: "",
      unit: reagent?.unit || "mL", 
      purpose: "",
      expectedDate: "",
      urgency: "一般",
      remarks: "",
    })
    onOpenChange(false)
  }

  // 建议替代试剂
  const getSuggestedAlternatives = () => {
    // 这里可以实现实际的推荐逻辑
    return [
      { name: "乙腈 (HPLC级)", currentAmount: 3250, unit: "mL" },
      { name: "甲醇 (HPLC级)", currentAmount: 2800, unit: "mL" },
    ];
  };

  if (!reagent) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            试剂申领
          </DialogTitle>
        </DialogHeader>

          <div className="space-y-6">
          {/* 过期警告 */}
          {isExpired() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900 mb-2">试剂已过期</h4>
                  <p className="text-sm text-red-700 mb-3">
                    此试剂已于 {format(new Date(reagent.expiryDate), "yyyy年MM月dd日")} 过期，为确保实验安全和结果准确性，已禁用申领功能。
                  </p>
                  {getSuggestedAlternatives().length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-2">推荐替代试剂：</p>
                      <div className="space-y-1">
                        {getSuggestedAlternatives().map((alt, index) => (
                          <div key={index} className="text-sm text-red-700 bg-red-100 rounded px-2 py-1">
                            {alt.name} - 可用库存：{alt.currentAmount}{alt.unit}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 即将过期警告 */}
          {!isExpired() && isExpiringSoon() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">试剂即将过期</h4>
                  <p className="text-sm text-yellow-700">
                    此试剂将于 {format(new Date(reagent.expiryDate), "yyyy年MM月dd日")} 过期，请尽快使用。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 库存不足警告 */}
          {!isExpired() && isOutOfStock() && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">库存不足</h4>
                  <p className="text-sm text-orange-700">
                    当前试剂库存不足，无法进行申领。请联系管理员补充库存。
                  </p>
                </div>
              </div>
            </div>
          )}

            {/* 试剂基本信息展示 */}
          <div className={cn(
            "border p-4 rounded-lg",
            isExpired() ? "bg-gray-50 border-gray-200" : "bg-blue-50/50 border-blue-100"
          )}>
            <h4 className={cn(
              "font-medium mb-3 flex items-center gap-2",
              isExpired() ? "text-gray-700" : "text-gray-900"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                isExpired() ? "bg-gray-400" : "bg-blue-500"
              )}></div>
                试剂信息
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">试剂名称</span>
                <span className={cn(
                  "font-medium",
                  isExpired() ? "text-gray-600" : "text-gray-900"
                )}>{reagent.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">规格</span>
                <span className={cn(
                  "font-medium",
                  isExpired() ? "text-gray-600" : "text-gray-900"
                )}>{reagent.specification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">当前库存</span>
                <span className={cn(
                  "font-medium",
                  isExpired() ? "text-gray-600" : 
                  reagent.currentAmount > 0 ? "text-blue-600" : "text-red-600"
                )}>{reagent.currentAmount}{reagent.unit}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-muted-foreground">有效期</span>
                <span className={cn(
                  "font-medium",
                  isExpired() ? "text-red-600" :
                  isExpiringSoon() ? "text-yellow-600" : "text-gray-900"
                )}>
                  {format(new Date(reagent.expiryDate), "yyyy/MM/dd")}
                </span>
                </div>
              </div>
            </div>

          {/* 申领表单 - 仅在可申领时显示 */}
          {canApply() && (
            <>
            {/* 申领基本信息 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  申领信息
                </h4>
              
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quantity">申领数量 *</Label>
                  <div className="flex gap-2">
                    <Input 
                        id="quantity"
                      type="number"
                        placeholder="输入数量"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                        className="flex-1"
                        min="1"
                        max={reagent.currentAmount}
                    />
                      <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-md">
                        <span className="text-sm text-gray-600">{formData.unit}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      最大可申领：{reagent.currentAmount}{reagent.unit}
                    </p>
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
                  placeholder="请详细说明试剂用途和实验目的..."
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  rows={3}
                />
                </div>
                
              {/* 备注 */}
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
            </>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          {canApply() ? (
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              提交申请
            </Button>
          ) : (
            <Button disabled className="opacity-50">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {isExpired() ? "试剂已过期" : "无法申领"}
            </Button>
          )}
              </div>
      </DialogContent>
    </Dialog>
  )
} 