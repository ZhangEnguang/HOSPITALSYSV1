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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Clock3
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            预约详情信息
          </DialogTitle>
        </DialogHeader>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 预约仪器信息 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  预约仪器信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{booking.equipmentName}</h3>
                      <p className="text-sm text-gray-600">{booking.equipmentType}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">仪器编号</span>
                      <p className="font-medium">{booking.equipmentId}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">仪器类型</span>
                      <p className="font-medium">{booking.equipmentType}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 预约人信息 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  预约人信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={booking.applicant?.avatar} />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {booking.applicant?.name?.[0] || "用"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.applicant?.name}</h3>
                    <p className="text-sm text-gray-600">{booking.applicant?.role || "研究员"}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">所属单位</span>
                    <span className="text-sm font-medium">{booking.department}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">联系电话</span>
                    <span className="text-sm font-medium">{booking.applicant?.phone || "未提供"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 预约时间信息 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                预约时间信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    预约日期
                  </div>
                  <p className="font-semibold text-lg">
                    {format(new Date(booking.startTime), "yyyy年MM月dd日")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(booking.startTime), "EEEE")}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    使用时间
                  </div>
                  <p className="font-semibold text-lg">
                    {format(new Date(booking.startTime), "HH:mm")} - {format(new Date(booking.endTime), "HH:mm")}
                  </p>
                  <p className="text-sm text-gray-600">
                    共 {booking.duration}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="h-4 w-4" />
                    申请时间
                  </div>
                  <p className="font-semibold text-lg">
                    {format(new Date(booking.applicationDate), "MM月dd日 HH:mm")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.processor ? `处理人：${booking.processor.name}` : "待处理"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 预约详情 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 关联项目 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  关联项目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">项目名称</span>
                    <p className="font-medium">{booking.project || "无关联项目"}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-gray-500">使用目的</span>
                    <p className="font-medium">{booking.purpose}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 备注说明 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  备注说明
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">申请备注</span>
                    <p className="font-medium text-gray-700">
                      {booking.notes || "无特殊说明"}
                    </p>
                  </div>
                  
                  {booking.approvalComments && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm text-gray-500">审核意见</span>
                        <p className="font-medium text-gray-700">
                          {booking.approvalComments}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 处理信息 */}
          {booking.processor && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  处理信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={booking.processor.avatar} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700">
                        {booking.processor.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{booking.processor.name}</p>
                      <p className="text-sm text-gray-600">{booking.processor.role || "审核员"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">处理时间</span>
                    <p className="font-medium">
                      {booking.processDate ? format(new Date(booking.processDate), "yyyy年MM月dd日 HH:mm") : "未处理"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button onClick={() => window.print()}>
            打印详情
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 