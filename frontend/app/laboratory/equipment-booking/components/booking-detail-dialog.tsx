"use client"

import React from "react"
import { format } from "date-fns"
// import { zhCN } from "date-fns/locale/zh-CN"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  User,
  Building,
  Phone,
  FileText,
  Settings,
  Target,
  MessageCircle,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock3,
  Printer,
  Hash,
  CalendarDays,
  Timer
} from "lucide-react"

interface BookingDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: any
}

export function BookingDetailDialog({ 
  open, 
  onOpenChange, 
  booking 
}: BookingDetailDialogProps) {
  if (!booking) {
    return null
  }

  // 状态样式配置
  const getStatusConfig = (status: string) => {
    const configs = {
      "审核通过": {
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle className="h-4 w-4" />
      },
      "待审核": {
        className: "bg-yellow-100 text-yellow-800",
        icon: <Clock3 className="h-4 w-4" />
      },
      "审核退回": {
        className: "bg-red-100 text-red-800",
        icon: <XCircle className="h-4 w-4" />
      },
      "已取消": {
        className: "bg-gray-100 text-gray-800",
        icon: <AlertCircle className="h-4 w-4" />
      }
    }
    return configs[status as keyof typeof configs] || configs["待审核"]
  }

  const statusConfig = getStatusConfig(booking.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        {/* 固定的头部 */}
        <DialogHeader className="flex-shrink-0 border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
                预约详情
          </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">#{booking.id}</p>
            </div>
            <Badge className={`${statusConfig.className} px-3 py-1`}>
              <span className="flex items-center gap-1.5">
                {statusConfig.icon}
                {booking.status}
              </span>
            </Badge>
          </div>
        </DialogHeader>

        {/* 可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* 基本信息 - 统一高度的两列布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 仪器信息 */}
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                    <Settings className="h-5 w-5 text-blue-600" />
                  仪器信息
                </h3>
                <Card className="flex-1">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">仪器名称</p>
                        <p className="font-medium text-gray-900 text-lg">{booking.equipmentName}</p>
                      </div>
                    <Separator />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">仪器编号</p>
                        <p className="font-mono text-gray-900">{booking.equipmentId}</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">仪器类型</p>
                        <p className="text-gray-900">{booking.equipmentType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>

              {/* 申请人信息 */}
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-green-600" />
                  申请人信息
                </h3>
                <Card className="flex-1">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={booking.applicant?.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                        {booking.applicant?.name?.[0] || "用"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-gray-900 text-lg">{booking.applicant?.name}</p>
                        <p className="text-sm text-gray-500">{booking.applicant?.role || "研究员"}</p>
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                  <Separator />
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">部门：</span>
                        <span className="text-gray-900">{booking.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">电话：</span>
                        <span className="font-mono text-gray-900">{booking.applicant?.phone || "未提供"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>

            {/* 时间信息 - 单行布局 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-purple-600" />
                时间安排
              </h3>
            <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-500 mb-2">预约日期</p>
                      <p className="font-semibold text-gray-900 text-lg">
                      {format(new Date(booking.startTime), "yyyy年MM月dd日")}
                    </p>
                      <p className="text-sm text-gray-400">
                      {format(new Date(booking.startTime), "EEEE")}
                    </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-500 mb-2">使用时段</p>
                      <p className="font-semibold text-gray-900 text-lg">
                      {format(new Date(booking.startTime), "HH:mm")} - {format(new Date(booking.endTime), "HH:mm")}
                    </p>
                      <p className="text-sm text-gray-400">
                      共 {booking.duration}
                    </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-500 mb-2">申请时间</p>
                      <p className="font-semibold text-gray-900 text-lg">
                      {format(new Date(booking.applicationDate), "MM月dd日 HH:mm")}
                    </p>
                      <p className="text-sm text-gray-400">
                        {booking.processor ? `${booking.processor.name}处理` : "待处理"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>

            {/* 详细信息 - 统一高度的两列布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 项目信息 */}
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-orange-600" />
                  项目信息
                </h3>
                <Card className="flex-1">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">关联项目</p>
                        <p className="font-medium text-gray-900 text-lg">{booking.project || "环境污染物检测"}</p>
                    </div>
                    <Separator />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">使用目的</p>
                        <p className="text-gray-900 leading-relaxed">{booking.purpose}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>

              {/* 备注信息 */}
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                    <MessageCircle className="h-5 w-5 text-gray-600" />
                  备注信息
                </h3>
                <Card className="flex-1">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">申请备注</p>
                        <p className="text-gray-900 leading-relaxed">
                          {booking.notes || "样品处理完毕"}
                      </p>
                    </div>
                    
                    {booking.approvalComments && (
                      <>
                        <Separator />
                        <div>
                            <p className="text-sm text-blue-600 font-medium mb-1">审核意见</p>
                            <p className="text-gray-900 leading-relaxed">
                            {booking.approvalComments}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>

            {/* 处理信息 - 单行布局 */}
            {booking.processor && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-indigo-600" />
                    处理信息
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                        <AvatarImage src={booking.processor.avatar} />
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-lg font-semibold">
                          {booking.processor.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-semibold text-gray-900 text-lg">{booking.processor.name}</p>
                          <p className="text-sm text-gray-500">{booking.processor.role || "审核员"}</p>
                      </div>
                    </div>
                    
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">处理时间</p>
                        <p className="font-semibold text-gray-900 text-lg">
                          {booking.processDate ? format(new Date(booking.processDate), "MM月dd日 HH:mm") : "未处理"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            )}
          </div>
        </div>

        {/* 固定的底部操作栏 */}
        <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-t bg-white">
          <p className="text-sm text-gray-500">
            创建于 {format(new Date(booking.applicationDate), "yyyy年MM月dd日")}
          </p>
          <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              打印
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 