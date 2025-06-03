"use client"

import { useState } from "react"
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
  Eye,
  User,
  FileText,
  Calendar,
  Target,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ConsumablesApplicationViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: any
}

export function ConsumablesApplicationViewDialog({ 
  open, 
  onOpenChange, 
  application 
}: ConsumablesApplicationViewDialogProps) {
  if (!application) return null

  // 紧急程度选项配置
  const urgencyOptions = [
    { value: "一般", label: "一般", color: "bg-gray-100 text-gray-700" },
    { value: "紧急", label: "紧急", color: "bg-yellow-100 text-yellow-700" },
    { value: "非常紧急", label: "非常紧急", color: "bg-red-100 text-red-700" },
  ]

  // 获取当前紧急程度的样式
  const getUrgencyStyle = (urgency: string) => {
    const option = urgencyOptions.find(opt => opt.value === urgency)
    return option ? option.color : urgencyOptions[0].color
  }

  // 状态颜色配置
  const getStatusStyle = (status: string) => {
    const statusColors: Record<string, string> = {
      "待审核": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "审核通过": "bg-green-100 text-green-700 border-green-200",
      "已拒绝": "bg-red-100 text-red-700 border-red-200",
      "已发放": "bg-blue-100 text-blue-700 border-blue-200",
      "已完成": "bg-purple-100 text-purple-700 border-purple-200",
      "已取消": "bg-gray-100 text-gray-700 border-gray-200",
    }
    return statusColors[status] || statusColors["待审核"]
  }

  // 判断耗材状态
  const isExpired = () => {
    if (!application.expiryDate) return false;
    const expiryDate = new Date(application.expiryDate);
    const today = new Date();
    return expiryDate < today;
  };

  const isSoonExpired = () => {
    if (!application.expiryDate) return false;
    const expiryDate = new Date(application.expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate <= thirtyDaysFromNow && expiryDate > today;
  };

  const isDisabled = () => {
    return application.consumableStatus === "已停用";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        {/* 固定顶部标题栏 */}
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            申领详情查看
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

            {/* 耗材基本信息展示 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                耗材信息
              </h4>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{application.consumableName}</h3>
                    {application.englishName && (
                      <p className="text-sm text-gray-600">{application.englishName}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">耗材类型</span>
                    <span className="font-medium">{application.consumableType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">型号规格</span>
                    <span className="font-medium">{application.specification || application.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">有效期</span>
                    <span className={cn(
                      "font-medium",
                      isExpired() ? "text-red-600" : 
                      isSoonExpired() ? "text-yellow-600" : "text-green-600"
                    )}>
                      {application.expiryDate ? format(new Date(application.expiryDate), "yyyy/MM/dd") : "长期有效"}
                    </span>
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
            </div>

            {/* 申请人信息 */}
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

            {/* 申领信息详情 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                申领信息
              </h4>
            
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>申领数量</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={application.quantity}
                      readOnly
                      className="flex-1 bg-gray-50"
                    />
                    <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-md">
                      <span className="text-sm text-gray-600">{application.unit}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>期望使用日期</Label>
                  <Input
                    type="date"
                    value={format(new Date(application.expectedDate), "yyyy-MM-dd")}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>紧急程度</Label>
                <div className="flex gap-2">
                  {urgencyOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-sm font-medium border",
                        application.urgency === option.value
                          ? `${option.color} border-current`
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      )}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 申领用途 */}
            <div className="space-y-2">
              <Label>申领用途</Label>
              <Textarea 
                value={application.purpose}
                readOnly
                className="bg-gray-50"
                rows={3}
              />
            </div>
              
            {/* 备注信息 */}
            {application.remarks && (
              <div className="space-y-2">
                <Label>备注说明</Label>
                <Textarea 
                  value={application.remarks}
                  readOnly
                  className="bg-gray-50"
                  rows={2}
                />
              </div>
            )}

            {/* 审核信息（如果已审核） */}
            {(application.status === "审核通过" || application.status === "已拒绝" || application.status === "已发放" || application.status === "已完成") && application.processor && (
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
                  
                  {application.processComments && (
                    <div className="pt-2 border-t">
                      <Label className="text-sm text-muted-foreground">审核意见</Label>
                      <p className="text-sm mt-1">{application.processComments}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 固定底部操作栏 */}
        <div className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 