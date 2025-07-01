"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Eye, Calendar, Clock, MapPin, User, Phone, Mail, Zap, Settings, Info, Printer } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { allDemoEquipmentItems } from "../../../equipment/data/equipment-demo-data"
import { allDemoEquipmentBookingItems } from "../../data/equipment-booking-demo-data"

// 从真实数据中获取仪器信息
const getEquipmentData = (id: string) => {
  const equipment = allDemoEquipmentItems.find((item: any) => item.id === id)
  if (!equipment) {
    return allDemoEquipmentItems[0]
  }
  return equipment
}

// 获取预约数据
const getExistingBookingData = (bookingId: string) => {
  return allDemoEquipmentBookingItems.find(item => item.id === bookingId) || null
}

const getSpecificationLabel = (key: string): string => {
  const labels: Record<string, string> = {
    resolution: "分辨率",
    magnification: "放大倍数",
    voltage: "工作电压",
    current: "工作电流", 
    power: "功率",
    accuracy: "精度",
    range: "测量范围",
    sensitivity: "灵敏度",
    stability: "稳定性",
    temperature: "工作温度",
    humidity: "湿度要求",
    dimensions: "外形尺寸",
    weight: "重量",
    sample_size: "样品尺寸",
    detection_limit: "检出限",
    wavelength: "波长范围",
    frequency: "频率",
    capacity: "容量",
    speed: "速度",
    pressure: "压力",
    flow_rate: "流速"
  }
  return labels[key] || key
}

// 转换日期格式
const parseDate = (dateStr: string) => {
  // 处理 "2023/11/25 09:00" 格式
  if (dateStr.includes('/')) {
    const [datePart, timePart] = dateStr.split(' ')
    const [year, month, day] = datePart.split('/')
    const [hour, minute] = timePart.split(':')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute))
  }
  // 处理 ISO 格式
  return new Date(dateStr)
}

export default function EquipmentBookingViewPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = (params?.id as string) || ""
  const [existingBooking, setExistingBooking] = useState<any>(null)
  const [equipment, setEquipment] = useState<any>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  useEffect(() => {
    if (!bookingId) return
    
    // 获取预约数据
    const bookingData = getExistingBookingData(bookingId)
    if (bookingData) {
      setExistingBooking(bookingData)
      // 获取对应的设备数据
      const equipmentData = getEquipmentData(bookingData.equipmentId)
      setEquipment(equipmentData)
    }
  }, [bookingId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "审核通过": return "bg-green-50 text-green-700 border-green-200"
      case "待审核": return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "审核退回": return "bg-red-50 text-red-700 border-red-200"
      case "已取消": return "bg-gray-50 text-gray-700 border-gray-200"
      case "在用": return "bg-green-50 text-green-700 border-green-200"
      case "维修中": return "bg-orange-100 text-orange-800 border-orange-200"
      case "闲置": return "bg-gray-100 text-gray-800 border-gray-200"
      case "报废": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  // 如果找不到预约数据，显示错误信息
  if (!existingBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">预约不存在</h2>
          <p className="text-gray-600 mb-8">找不到指定的预约记录，请检查链接是否正确。</p>
          <Button onClick={() => router.push("/laboratory/equipment-booking")}>
            返回预约管理
          </Button>
        </div>
      </div>
    )
  }

  const startTime = parseDate(existingBooking.startTime)
  const endTime = parseDate(existingBooking.endTime)
  const applicationDate = parseDate(existingBooking.applicationDate)
  const processDate = existingBooking.processDate ? parseDate(existingBooking.processDate) : null

  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <div className="z-10">
        <div className="container mx-auto py-3">
          <div className="flex items-center gap-2">
            {/* 返回按钮 */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              预约详情
            </h1>
          </div>
          
          {/* 预约信息概览 */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-blue-600 font-medium">预约编号: {existingBooking.id}</p>
                  <p className="text-lg font-semibold text-gray-900">{existingBooking.equipmentName}</p>
                </div>
                <div className="h-8 w-px bg-blue-200"></div>
                <div>
                  <p className="text-sm text-blue-600">预约时间</p>
                  <p className="font-medium text-gray-900">
                    {format(startTime, "yyyy年MM月dd日 HH:mm")} - 
                    {format(endTime, "HH:mm")}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={getStatusColor(existingBooking.status)}>
                {existingBooking.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          {/* 仪器信息卡片 */}
          <div className="xl:col-span-1">
            <Card className="sticky top-8 overflow-hidden bg-white border hover:shadow-lg transition-all duration-500 group h-full">
              
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">仪器信息</CardTitle>
                    <CardDescription className="text-xs">设备详细信息</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 flex-1">
                {/* 仪器图片 */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group-hover:shadow-lg transition-shadow">
                    {equipment?.images && equipment.images.length > 0 ? (
                      <img
                        src={equipment.images[0]}
                        alt={equipment.name}
                        className="w-full h-full object-cover"
                        onLoad={() => setIsImageLoaded(true)}
                        onError={() => setIsImageLoaded(false)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Eye className="h-16 w-16 mx-auto mb-2" />
                          <p className="text-sm">暂无图片</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(equipment?.status || "在用")
                  )}>
                    {equipment?.status || "在用"}
                  </div>
                </div>
                
                {/* 基本信息 */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{equipment?.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {equipment?.model}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        类型
                      </span>
                      <span className="text-sm font-medium">{equipment?.category}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        部门
                      </span>
                      <span className="text-sm font-medium">{equipment?.department}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        位置
                      </span>
                      <span className="text-sm font-medium">{equipment?.location}</span>
                    </div>
                  </div>
                </div>

                {/* 管理员信息 */}
                {equipment?.manager && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      管理联系人
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                            {equipment.manager.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{equipment.manager.name}</p>
                          <p className="text-xs text-gray-500">{equipment.manager.role}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {equipment.manager.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 预约信息展示 */}
          <div className="xl:col-span-3 space-y-8">
            {/* 时间信息卡片 */}
            <Card className="overflow-hidden bg-white border">
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">预约时间</CardTitle>
                    <CardDescription className="text-xs">查看预约的时间安排</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-2">预约日期</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {format(startTime, "yyyy年MM月dd日")}
                    </p>
                    <p className="text-sm text-gray-400">
                      {format(startTime, "EEEE")}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-2">使用时段</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                    </p>
                    <p className="text-sm text-gray-400">
                      共 {existingBooking.duration}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-2">申请时间</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {format(applicationDate, "MM月dd日 HH:mm")}
                    </p>
                    <p className="text-sm text-gray-400">
                      {existingBooking.processor ? `${existingBooking.processor.name}处理` : "待处理"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 预约详细信息卡片 */}
            <Card className="overflow-hidden bg-white border">
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">预约信息</CardTitle>
                    <CardDescription className="text-xs">查看详细的预约信息</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {/* 第一行：预约人和所属单位 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 预约人 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">预约人</Label>
                      <Input
                        value={existingBooking.applicant?.name || ""}
                        className="border-gray-200 bg-gray-50"
                        disabled
                        readOnly
                      />
                    </div>

                    {/* 所属单位 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">所属单位</Label>
                      <Input
                        value={existingBooking.department}
                        className="border-gray-200 bg-gray-50"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>

                  {/* 第二行：关联项目和联系电话 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 关联项目 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">关联项目</Label>
                      <Input
                        value={existingBooking.project}
                        className="border-gray-200 bg-gray-50"
                        disabled
                        readOnly
                      />
                    </div>
                    
                    {/* 联系电话 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">联系电话</Label>
                      <Input
                        value={existingBooking.applicant?.phone || ""}
                        className="border-gray-200 bg-gray-50"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>

                  {/* 第三行：使用目的（占整行） */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">使用目的</Label>
                    <Input
                      value={existingBooking.purpose}
                      className="border-gray-200 bg-gray-50"
                      disabled
                      readOnly
                    />
                  </div>

                  {/* 备注 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">备注说明</Label>
                    <Textarea
                      value={existingBooking.notes}
                      rows={5}
                      className="border-gray-200 bg-gray-50"
                      disabled
                      readOnly
                    />
                  </div>

                  {/* 审核信息 */}
                  {existingBooking.processor && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">审核信息</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">审核人员</Label>
                          <p className="text-sm font-medium text-gray-900">{existingBooking.processor.name}</p>
                          <p className="text-xs text-gray-500">{existingBooking.processor.role}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">审核时间</Label>
                          <p className="text-sm font-medium text-gray-900">
                            {processDate ? format(processDate, "yyyy年MM月dd日 HH:mm") : "未处理"}
                          </p>
                        </div>
                      </div>
                      {existingBooking.approvalComments && (
                        <div className="mt-3">
                          <Label className="text-sm text-gray-600">审核意见</Label>
                          <p className="text-sm text-gray-900 mt-1">{existingBooking.approvalComments}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => router.back()}
                      className="hover:bg-gray-50"
                    >
                      返回
                    </Button>
                    <Button 
                      onClick={() => window.print()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      打印详情
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 