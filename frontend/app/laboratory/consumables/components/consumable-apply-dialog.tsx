"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, User, Package, FileText, AlertTriangle, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ConsumableApplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  consumable: any
}

export function ConsumableApplyDialog({ open, onOpenChange, consumable }: ConsumableApplyDialogProps) {
  // 1. 有效期验证逻辑
  const isExpired = () => {
    if (!consumable) return false;
    const expiryDate = new Date(consumable.expiryDate);
    const today = new Date();
    return expiryDate < today || consumable.status === "已过期";
  };

  // 检查是否即将过期（30天内）
  const isSoonExpired = () => {
    if (!consumable) return false;
    const expiryDate = new Date(consumable.expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate <= thirtyDaysFromNow && expiryDate > today;
  };

  // 检查是否已停用
  const isDisabled = () => {
    if (!consumable) return false;
    return consumable.status === "已停用";
  };

  // 检查是否库存不足
  const isOutOfStock = () => {
    if (!consumable) return false;
    return consumable.currentStock <= 0;
  };

  // 2. 申领功能逻辑 - 同时满足条件
  const canApply = () => {
    return !isExpired() && !isDisabled() && !isOutOfStock();
  };

  // 获取不可申领的原因
  const getDisabledReason = () => {
    if (isExpired()) return "耗材已过期，无法申领";
    if (isDisabled()) return "耗材已停用，无法申领";
    if (isOutOfStock()) return "库存不足，无法申领";
    return "";
  };

  // 表单数据状态
  const [formData, setFormData] = useState({
    quantity: "",
    unit: consumable?.unit || "个",
    purpose: "",
    expectedDate: "",
    urgency: "一般",
    remarks: "",
  })

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

    // 检查是否超过库存
    if (numValue > (consumable?.currentStock || 0)) {
      setQuantityError(`申领数量不能超过当前库存 ${consumable?.currentStock}${consumable?.unit}`)
      return
    }

    // 检查是否为整数（可选，根据需要）
    if (numValue !== Math.floor(numValue)) {
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

  // 在耗材信息变化时重新验证数量
  useEffect(() => {
    if (formData.quantity) {
      validateQuantity(formData.quantity)
    }
  }, [consumable?.currentStock, consumable?.unit])

  // 紧急程度选项
  const urgencyOptions = [
    { value: "一般", label: "一般", color: "bg-gray-100 text-gray-700" },
    { value: "紧急", label: "紧急", color: "bg-yellow-100 text-yellow-700" },
    { value: "非常紧急", label: "非常紧急", color: "bg-red-100 text-red-700" },
  ]

  // 处理表单提交
  const handleSubmit = () => {
    console.log("提交按钮被点击 - 开始验证", {
      formData,
      consumable: {
        name: consumable?.name,
        currentStock: consumable?.currentStock,
        unit: consumable?.unit,
        status: consumable?.status
      }
    });

    if (isDisabled()) {
      console.log("验证失败: 耗材已停用");
      toast({
        title: "申领失败",
        description: "耗材已停用，无法申领。请联系管理员进行处理。",
        variant: "destructive",
      })
      return;
    }

    if (!canApply()) {
      console.log("验证失败: 无法申领");
      toast({
        title: "申领失败", 
        description: "耗材库存不足或状态异常，无法申领。",
        variant: "destructive",
      })
      return;
    }

    // 验证表单数据
    if (!formData.quantity || !formData.purpose || !formData.expectedDate) {
      console.log("验证失败: 表单数据不完整", {
        quantity: formData.quantity,
        purpose: formData.purpose,
        expectedDate: formData.expectedDate
      });
      toast({
        title: "表单验证失败",
        description: "请填写完整的申领信息",
        variant: "destructive",
      })
      return
    }

    // 检查数量验证错误
    if (quantityError) {
      console.log("验证失败: 数量输入错误", quantityError);
      toast({
        title: "数量验证失败",
        description: quantityError,
        variant: "destructive",
      })
      return
    }
    
    // 检查申领数量是否超过库存（双重验证）
    const requestedQuantity = parseFloat(formData.quantity)
    console.log("数量验证", {
      requestedQuantity,
      currentStock: consumable.currentStock,
      超过库存: requestedQuantity > consumable.currentStock
    });
    
    if (requestedQuantity > consumable.currentStock) {
      console.log("验证失败: 申领数量超限");
      toast({
        title: "申领数量超限",
        description: `申领数量不能超过当前库存量 ${consumable.currentStock}${consumable.unit}`,
        variant: "destructive",
      })
      return
    }

    // 模拟提交申请
    console.log("验证通过 - 提交耗材申领申请:", {
      consumableId: consumable.id,
      consumableName: consumable.name,
      ...formData,
      requestedQuantity
    })

    toast({
      title: "申领申请已提交",
      description: `已成功提交 ${consumable.name} 的申领申请，申请数量：${formData.quantity}${formData.unit}`,
    })

    // 重置表单并关闭弹框
    setFormData({
      quantity: "",
      unit: consumable?.unit || "个", 
      purpose: "",
      expectedDate: "",
      urgency: "一般",
      remarks: "",
    })
    setQuantityError("")
    onOpenChange(false)
  }

  // 建议替代耗材
  const getSuggestedAlternatives = () => {
    // 这里可以实现实际的推荐逻辑
    return [
      { name: "无菌培养皿 (90mm)", currentStock: 150, unit: "个" },
      { name: "细胞培养瓶 (25cm²)", currentStock: 80, unit: "个" },
    ];
  };

  if (!consumable) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0">
        {/* 固定顶部标题栏 */}
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Package className="h-5 w-5 text-blue-500" />
            耗材申领
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            为 <span className="font-medium text-foreground">{consumable?.name}</span> 提交申领申请
          </DialogDescription>
        </DialogHeader>

        {/* 可滚动的中间内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* 已过期警告 */}
            {isExpired() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900 mb-2">耗材已过期</h4>
                    <p className="text-sm text-red-700 mb-3">
                      此耗材已超过有效期，无法进行申领操作。过期耗材可能存在质量风险，建议寻找替代方案。
                    </p>
                    <div className="text-sm text-red-600 bg-red-100 rounded px-2 py-1 inline-block">
                      有效期：{format(new Date(consumable.expiryDate), "yyyy年MM月dd日")}
                    </div>
                    {getSuggestedAlternatives().length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-red-800 mb-2">推荐替代耗材：</p>
                        <div className="space-y-1">
                          {getSuggestedAlternatives().map((alt, index) => (
                            <div key={index} className="text-sm text-red-700 bg-red-100 rounded px-2 py-1">
                              {alt.name} - 可用库存：{alt.currentStock}{alt.unit}
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
            {!isExpired() && isSoonExpired() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">即将过期提醒</h4>
                    <p className="text-sm text-yellow-700 mb-2">
                      此耗材将在30天内过期，建议优先使用。如非必要，请考虑使用其他耗材。
                    </p>
                    <div className="text-sm text-yellow-700 bg-yellow-100 rounded px-2 py-1 inline-block">
                      有效期：{format(new Date(consumable.expiryDate), "yyyy年MM月dd日")}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 已停用警告 */}
            {!isExpired() && isDisabled() && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">耗材已停用</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      此耗材已被停用，无法进行申领操作。如有需要，请联系管理员进行处理。
                    </p>
                    {getSuggestedAlternatives().length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-800 mb-2">推荐替代耗材：</p>
                        <div className="space-y-1">
                          {getSuggestedAlternatives().map((alt, index) => (
                            <div key={index} className="text-sm text-gray-700 bg-gray-100 rounded px-2 py-1">
                              {alt.name} - 可用库存：{alt.currentStock}{alt.unit}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 库存不足警告 */}
            {!isExpired() && !isDisabled() && isOutOfStock() && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-orange-900 mb-1">库存不足</h4>
                    <p className="text-sm text-orange-700">
                      当前耗材库存不足，无法进行申领。请联系管理员补充库存。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 耗材基本信息展示 */}
            <div className={cn(
              "border p-4 rounded-lg",
              isDisabled() ? "bg-gray-50 border-gray-200" : "bg-blue-50/50 border-blue-100"
            )}>
              <h4 className={cn(
                "font-medium mb-3 flex items-center gap-2",
                isDisabled() ? "text-gray-700" : "text-gray-900"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isDisabled() ? "bg-gray-400" : "bg-blue-500"
                )}></div>
                耗材信息
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">耗材名称</span>
                  <span className={cn(
                    "font-medium",
                    isDisabled() ? "text-gray-600" : "text-gray-900"
                  )}>{consumable.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">型号规格</span>
                  <span className={cn(
                    "font-medium",
                    isDisabled() ? "text-gray-600" : "text-gray-900"
                  )}>{consumable.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">耗材类型</span>
                  <span className={cn(
                    "font-medium",
                    isDisabled() ? "text-gray-600" : "text-gray-900"
                  )}>{consumable.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">有效期</span>
                  <span className={cn(
                    "font-medium",
                    isDisabled() ? "text-gray-600" : 
                    isExpired() ? "text-red-600" : "text-green-600"
                  )}>{format(new Date(consumable.expiryDate), "yyyy/MM/dd")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">当前库存</span>
                  <span className={cn(
                    "font-medium",
                    isDisabled() ? "text-gray-600" : 
                    consumable.currentStock > 0 ? "text-blue-600" : "text-red-600"
                  )}>{consumable.currentStock}{consumable.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">状态</span>
                  <span className={cn(
                    "font-medium",
                    isDisabled() ? "text-gray-600" :
                    isExpired() ? "text-red-600" :
                    isSoonExpired() ? "text-yellow-600" : "text-green-600"
                  )}>
                    {isExpired() ? "已过期" : 
                     isSoonExpired() ? "即将过期" : 
                     isDisabled() ? "已停用" : "正常"}
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
                          onChange={(e) => handleQuantityChange(e.target.value)}
                          className={cn(
                            "flex-1",
                            quantityError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                          )}
                          min="1"
                          max={consumable.currentStock}
                        />
                        <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-md">
                          <span className="text-sm text-gray-600">{formData.unit}</span>
                        </div>
                      </div>
                      
                      {/* 错误提示 */}
                      {quantityError ? (
                        <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          {quantityError}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          最大可申领：{consumable.currentStock}{consumable.unit}
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
                    placeholder="请详细说明耗材用途和使用目的..."
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
        </div>

        {/* 固定底部操作栏 */}
        <DialogFooter className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-24 h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            取消
          </Button>
          {canApply() ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!!quantityError || !formData.quantity || !formData.purpose || !formData.expectedDate}
              className="w-28 h-10 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4 mr-2" />
              提交申请
            </Button>
          ) : (
            <Button 
              disabled 
              className="w-28 h-10 opacity-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {isDisabled() ? "耗材已停用" : "无法申领"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 