"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Clock,
  Building,
  Phone,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock3,
  Check,
  X
} from "lucide-react"

interface BookingApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: any
  onApprove?: (booking: any, comments: string) => void
  onReject?: (booking: any, comments: string) => void
}

export function BookingApprovalDialog({ 
  open, 
  onOpenChange, 
  booking,
  onApprove,
  onReject
}: BookingApprovalDialogProps) {
  const [approvalComments, setApprovalComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!booking) return null

  // 状态样式配置
  const getStatusConfig = (status: string) => {
    const configs = {
      "审核通过": {
        className: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle className="h-4 w-4" />
      },
      "待审核": {
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <Clock3 className="h-4 w-4" />
      },
      "审核退回": {
        className: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle className="h-4 w-4" />
      },
      "已取消": {
        className: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <AlertCircle className="h-4 w-4" />
      }
    }
    return configs[status as keyof typeof configs] || configs["待审核"]
  }

  const statusConfig = getStatusConfig(booking.status)

  // 处理审核通过
  const handleApprove = async () => {
    if (!approvalComments.trim()) {
      alert("请填写审核意见")
      return
    }
    
    setIsSubmitting(true)
    try {
      if (onApprove) {
        await onApprove(booking, approvalComments)
      }
      setApprovalComments("")
      onOpenChange(false)
    } catch (error) {
      console.error("审核通过失败:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理审核退回
  const handleReject = async () => {
    if (!approvalComments.trim()) {
      alert("请填写审核意见")
      return
    }
    
    setIsSubmitting(true)
    try {
      if (onReject) {
        await onReject(booking, approvalComments)
      }
      setApprovalComments("")
      onOpenChange(false)
    } catch (error) {
      console.error("审核退回失败:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        {/* 固定头部 */}
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            仪器审核预约
          </DialogTitle>
        </DialogHeader>

        {/* 可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ margin: '-16px 0' }}>
          <div className="space-y-6">
            {/* 预约状态 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {statusConfig.icon}
                  <span className="text-sm font-medium text-gray-600">预约状态</span>
                </div>
                <Badge className={statusConfig.className}>
                  {booking.status}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                预约编号：{booking.id}
              </div>
            </div>

            {/* 预约仪器信息 */}
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                预约仪器信息
              </h3>
              <div className="space-y-4 pl-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{booking.equipmentName}</h4>
                    <p className="text-sm text-gray-500 mt-1">{booking.equipmentType}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">仪器编号</label>
                    <p className="text-sm font-medium text-gray-700">{booking.equipmentId}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">仪器类型</label>
                    <p className="text-sm font-medium text-gray-700">{booking.equipmentType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 预约人信息 */}
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                预约人信息
              </h3>
              <div className="space-y-4 pl-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={booking.applicant?.avatar} />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {booking.applicant?.name?.[0] || "用"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{booking.applicant?.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{booking.applicant?.role || "研究员"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      所属单位
                    </label>
                    <p className="text-sm font-medium text-gray-700">{booking.department}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      联系电话
                    </label>
                    <p className="text-sm font-medium text-gray-700">{booking.applicant?.phone || "未提供"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 预约时间信息 */}
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                预约时间信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    预约日期
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {format(new Date(booking.startTime), "yyyy年MM月dd日")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(booking.startTime), "EEEE")}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    使用时间
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {format(new Date(booking.startTime), "HH:mm")} - {format(new Date(booking.endTime), "HH:mm")}
                  </p>
                  <p className="text-xs text-gray-500">
                    共 {booking.duration}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    申请时间
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {format(new Date(booking.applicationDate), "MM月dd日 HH:mm")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.processor ? `处理人：${booking.processor.name}` : "待处理"}
                  </p>
                </div>
              </div>
            </div>

            {/* 关联项目 */}
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                关联项目
              </h3>
              <div className="space-y-4 pl-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">项目名称</label>
                  <p className="text-sm font-medium text-gray-700">{booking.project || "无关联项目"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">使用目的</label>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed">{booking.purpose}</p>
                </div>
              </div>
            </div>

            {/* 申请备注 */}
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                申请备注
              </h3>
              <div className="space-y-4 pl-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">申请备注</label>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed">
                    {booking.notes || "无特殊说明"}
                  </p>
                </div>
                
                {booking.approvalComments && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">历史审核意见</label>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      {booking.approvalComments}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 审核意见 */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                审核意见
                <span className="text-red-500 text-sm">*</span>
              </h3>
              <div className="pl-3">
                <Textarea
                  id="approval-comments"
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  placeholder="请输入审核意见..."
                  className="min-h-[80px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-2">请详细说明审核理由和注意事项</p>
              </div>
            </div>
          </div>
        </div>

        {/* 固定底部操作栏 */}
        <div className="flex-shrink-0 flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReject}
            disabled={isSubmitting || !approvalComments.trim()}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            审核退回
          </Button>
          <Button 
            onClick={handleApprove}
            disabled={isSubmitting || !approvalComments.trim()}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            审核通过
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 