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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Clock,
  User,
  Building,
  Phone,
  FileText,
  Package,
  Target,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock3,
  Check,
  X,
  Beaker,
  Clock4
} from "lucide-react"

interface ReagentApplicationApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: any
  onApprove?: (application: any, comments: string) => void
  onReject?: (application: any, comments: string) => void
}

export function ReagentApplicationApprovalDialog({ 
  open, 
  onOpenChange, 
  application,
  onApprove,
  onReject
}: ReagentApplicationApprovalDialogProps) {
  const [approvalComments, setApprovalComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!application) return null

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

  // 紧急程度样式配置
  const getUrgencyConfig = (urgency: string) => {
    const configs = {
      "非常紧急": { className: "bg-red-50 text-red-700 border-red-200", label: "非常紧急" },
      "紧急": { className: "bg-orange-50 text-orange-700 border-orange-200", label: "紧急" },
      "一般": { className: "bg-blue-50 text-blue-700 border-blue-200", label: "一般" },
      "不紧急": { className: "bg-gray-50 text-gray-700 border-gray-200", label: "不紧急" }
    }
    return configs[urgency as keyof typeof configs] || configs["一般"]
  }

  const statusConfig = getStatusConfig(application.status)
  const urgencyConfig = getUrgencyConfig(application.urgency)

  // 处理审核通过
  const handleApprove = async () => {
    if (!approvalComments.trim()) {
      alert("请填写审核意见")
      return
    }
    
    setIsSubmitting(true)
    try {
      if (onApprove) {
        await onApprove(application, approvalComments)
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
        await onReject(application, approvalComments)
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
            试剂审核申领
          </DialogTitle>
        </DialogHeader>

        {/* 可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ margin: '-16px 0' }}>
          <div className="space-y-6">
            {/* 申领状态 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {statusConfig.icon}
                  <span className="text-sm font-medium text-gray-600">申领状态</span>
                </div>
                <Badge className={statusConfig.className}>
                  {application.status}
                </Badge>
                <div className="flex items-center gap-2">
                  <Clock4 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">紧急程度</span>
                </div>
                <Badge className={urgencyConfig.className}>
                  {urgencyConfig.label}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                申领编号：{application.id}
              </div>
            </div>

            {/* 申领试剂信息 */}
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                申领试剂信息
              </h3>
              <div className="space-y-4 pl-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Beaker className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{application.reagentName}</h4>
                    <p className="text-sm text-gray-500 mt-1">{application.englishName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">试剂类型</label>
                    <p className="text-sm font-medium text-gray-700">{application.reagentType}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">申领数量</label>
                    <p className="text-sm font-medium text-gray-700">{application.quantity} {application.unit}</p>
                  </div>
                </div>
                
                {application.specification && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">规格说明</label>
                    <p className="text-sm font-medium text-gray-700">{application.specification}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 申请人信息 */}
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                申请人信息
              </h3>
              <div className="space-y-4 pl-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={application.applicant?.avatar} />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {application.applicant?.name?.[0] || "用"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{application.applicant?.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{application.applicant?.role || "研究员"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      所属单位
                    </label>
                    <p className="text-sm font-medium text-gray-700">{application.department}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      联系电话
                    </label>
                    <p className="text-sm font-medium text-gray-700">{application.applicant?.phone || "未提供"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 申领时间信息 */}
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                申领时间信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    期望日期
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {format(new Date(application.expectedDate), "yyyy年MM月dd日")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(application.expectedDate), "EEEE")}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    申请时间
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {format(new Date(application.applicationDate), "MM月dd日 HH:mm")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(application.applicationDate), "yyyy年MM月dd日")}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    处理状态
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {application.processor ? `已处理` : "待处理"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {application.processor ? `处理人：${application.processor.name}` : "等待审核"}
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
                  <p className="text-sm font-medium text-gray-700">{application.project || "无关联项目"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">使用目的</label>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed">{application.purpose}</p>
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
                    {application.notes || "无特殊说明"}
                  </p>
                </div>
                
                {application.approvalComments && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">历史审核意见</label>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      {application.approvalComments}
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