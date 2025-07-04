"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, Calendar, Clock, MapPin, User, Phone, Mail, Zap, Home, Info, Printer, Users, Building, Thermometer, Droplets } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { allDemoCageBookingItems } from "../../data/cage-booking-demo-data"
import { allDemoAnimalRoomItems } from "../../../animal-rooms/data/animal-rooms-demo-data"

// 获取笼位预约数据
const getCageBookingData = (id: string) => {
  const booking = allDemoCageBookingItems.find((item: any) => item.id === id)
  if (!booking) {
    return allDemoCageBookingItems[0]
  }
  return booking
}

// 获取动物房数据
const getAnimalRoomData = (cageLocation: string) => {
  // 根据笼位位置匹配动物房
  const roomName = cageLocation.split('-')[0] || "SPF大鼠饲养间1"
  const room = allDemoAnimalRoomItems.find((item: any) => item.name.includes(roomName) || item.name === roomName)
  return room || allDemoAnimalRoomItems[0]
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

export default function CageBookingEditPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = (params?.id as string) || ""
  
  const [booking, setBooking] = useState<any>(null)
  const [animalRoom, setAnimalRoom] = useState<any>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    bookingTitle: "",
    applicantName: "",
    department: "",
    cageLocation: "",
    cageId: "",
    animalSpecies: "",
    animalStrain: "",
    animalAge: "",
    animalCount: "",
    genderRatio: "",
    project: "",
    contactPhone: "",
    purpose: "",
    startTime: "",
    endTime: "",
    notes: ""
  })

  useEffect(() => {
    if (!bookingId) return
    
    // 获取预约数据
    const bookingData = getCageBookingData(bookingId)
    if (bookingData) {
      setBooking(bookingData)
      // 获取对应的动物房数据
      const roomData = getAnimalRoomData(bookingData.cageLocation)
      setAnimalRoom(roomData)
      
      // 初始化表单数据
      const bookingDataAny = bookingData as any
      setFormData({
        bookingTitle: bookingDataAny.bookingTitle || "",
        applicantName: bookingDataAny.applicant?.name || "",
        department: bookingDataAny.department || "",
        cageLocation: bookingDataAny.cageLocation || "",
        cageId: bookingDataAny.cageId || "",
        animalSpecies: bookingDataAny.animalSpecies || "",
        animalStrain: bookingDataAny.animalStrain || "",
        animalAge: bookingDataAny.animalAge || "",
        animalCount: String(bookingDataAny.animalCount || ""),
        genderRatio: bookingDataAny.genderRatio || "",
        project: bookingDataAny.project || "",
        contactPhone: bookingDataAny.applicant?.phone || "",
        purpose: bookingDataAny.purpose || "",
        startTime: bookingDataAny.startTime ? formatDateTimeLocal(parseDate(bookingDataAny.startTime)) : "",
        endTime: bookingDataAny.endTime ? formatDateTimeLocal(parseDate(bookingDataAny.endTime)) : "",
        notes: bookingDataAny.notes || ""
      })
    }
    setIsLoading(false)
  }, [bookingId])
  
  // 格式化日期时间为 datetime-local 输入格式
  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }
  
  // 处理表单字段变化
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // 处理表单提交
  const handleSubmit = () => {
    console.log("提交表单数据:", formData)
    // 这里可以添加保存逻辑
    alert("保存成功！")
    router.back()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "审核通过": return "bg-green-50 text-green-700 border-green-200"
      case "待审核": return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "审核退回": return "bg-red-50 text-red-700 border-red-200"
      case "已取消": return "bg-gray-50 text-gray-700 border-gray-200"
      case "使用中": return "bg-blue-50 text-blue-700 border-blue-200"
      case "已完成": return "bg-slate-50 text-slate-700 border-slate-200"
      default: return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  // 如果找不到预约数据，显示错误信息
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">预约不存在</h2>
          <p className="text-gray-600 mb-8">找不到指定的预约记录，请检查链接是否正确。</p>
          <Button onClick={() => router.push("/laboratory/cage-booking")}>
            返回笼位预约管理
          </Button>
        </div>
      </div>
    )
  }

  const startTime = parseDate(booking.startTime)
  const endTime = parseDate(booking.endTime)
  const applicationDate = parseDate(booking.applicationDate)
  const processDate = booking.processDate ? parseDate(booking.processDate) : null

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
              编辑笼位预约
            </h1>
          </div>
          
          {/* 预约信息概览 */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-blue-600 font-medium">预约编号: {booking.id}</p>
                  <p className="text-lg font-semibold text-gray-900">{booking.bookingTitle}</p>
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
              <Badge variant="outline" className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          {/* 动物房信息卡片 */}
          <div className="xl:col-span-1">
            <Card className="sticky top-8 overflow-hidden bg-white border hover:shadow-lg transition-all duration-500 group h-full">
              
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Home className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">动物房信息</CardTitle>
                    <CardDescription className="text-xs">饲养环境详情</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 flex-1">
                {/* 动物房图片 */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group-hover:shadow-lg transition-shadow">
                    {animalRoom?.image ? (
                      <img
                        src={animalRoom.image}
                        alt={animalRoom.name}
                        className="w-full h-full object-cover"
                        onLoad={() => setIsImageLoaded(true)}
                        onError={() => setIsImageLoaded(false)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Home className="h-16 w-16 mx-auto mb-2" />
                          <p className="text-sm">暂无图片</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(animalRoom?.status || "使用中")
                  )}>
                    {animalRoom?.status || "使用中"}
                  </div>
                </div>
                
                {/* 基本信息 */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{animalRoom?.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {animalRoom?.type}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        容量
                      </span>
                      <span className="text-sm font-medium">{animalRoom?.capacity}{animalRoom?.capacityUnit}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        部门
                      </span>
                      <span className="text-sm font-medium">{animalRoom?.department}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        位置
                      </span>
                      <span className="text-sm font-medium">{animalRoom?.location}</span>
                    </div>
                  </div>
                </div>

                {/* 环境信息 */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-green-600" />
                    环境条件
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">温度</span>
                      <span className="text-sm font-medium">{animalRoom?.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">湿度</span>
                      <span className="text-sm font-medium">{animalRoom?.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">负责人</span>
                      <span className="text-sm font-medium">{animalRoom?.manager}</span>
                    </div>
                  </div>
                </div>
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
                    <CardDescription className="text-xs">设置预约的时间安排</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 起始时间 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">起始时间 <span className="text-red-500">*</span></Label>
                    <Input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  {/* 完成时间 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">完成时间 <span className="text-red-500">*</span></Label>
                    <Input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full"
                      min={formData.startTime || new Date().toISOString().slice(0, 16)}
                    />
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
                    <CardDescription className="text-xs">编辑详细的预约信息</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {/* 预约标题 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">预约标题 <span className="text-red-500">*</span></Label>
                    <Input
                      value={formData.bookingTitle}
                      onChange={(e) => handleInputChange('bookingTitle', e.target.value)}
                      placeholder="请输入预约标题"
                      className="w-full"
                    />
                  </div>

                  {/* 第一行：预约人和所属单位 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 预约人 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">预约人 <span className="text-red-500">*</span></Label>
                      <Input
                        value={formData.applicantName}
                        onChange={(e) => handleInputChange('applicantName', e.target.value)}
                        placeholder="请输入预约人姓名"
                        className="w-full"
                      />
                    </div>

                    {/* 所属单位 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">所属单位 <span className="text-red-500">*</span></Label>
                      <Input
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        placeholder="请输入所属单位"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* 第二行：笼位信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 笼位位置 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">笼位位置</Label>
                      <Input
                        value={formData.cageLocation}
                        onChange={(e) => handleInputChange('cageLocation', e.target.value)}
                        placeholder="请输入笼位位置"
                        className="w-full"
                      />
                    </div>
                    
                    {/* 笼位编号 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">笼位编号</Label>
                      <Input
                        value={formData.cageId}
                        onChange={(e) => handleInputChange('cageId', e.target.value)}
                        placeholder="请输入笼位编号"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* 动物信息 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">动物信息</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 动物种类 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">动物种类</Label>
                        <Select 
                          value={formData.animalSpecies} 
                          onValueChange={(value) => handleInputChange('animalSpecies', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="请选择动物种类" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="小鼠">小鼠</SelectItem>
                            <SelectItem value="大鼠">大鼠</SelectItem>
                            <SelectItem value="兔">兔</SelectItem>
                            <SelectItem value="豚鼠">豚鼠</SelectItem>
                            <SelectItem value="猴">猴</SelectItem>
                            <SelectItem value="其他">其他</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 品系与级别 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">品系与级别</Label>
                        <Input
                          value={formData.animalStrain}
                          onChange={(e) => handleInputChange('animalStrain', e.target.value)}
                          placeholder="如：C57BL/6J、SPF级等"
                          className="w-full"
                        />
                      </div>

                      {/* 动物年龄 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">动物年龄</Label>
                        <Input
                          value={formData.animalAge}
                          onChange={(e) => handleInputChange('animalAge', e.target.value)}
                          placeholder="如：6-8周龄、成年等"
                          className="w-full"
                        />
                      </div>

                      {/* 动物数量 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">动物数量</Label>
                        <Input
                          type="number"
                          value={formData.animalCount}
                          onChange={(e) => handleInputChange('animalCount', e.target.value)}
                          placeholder="请输入动物数量"
                          className="w-full"
                          min="1"
                        />
                      </div>
                    </div>

                    {/* 性别比例 - 占整行 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">性别比例</Label>
                      <Select 
                        value={formData.genderRatio} 
                        onValueChange={(value) => handleInputChange('genderRatio', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择性别比例" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="雄性">全雄性</SelectItem>
                          <SelectItem value="雌性">全雌性</SelectItem>
                          <SelectItem value="1:1">雄雌1:1</SelectItem>
                          <SelectItem value="2:1">雄雌2:1</SelectItem>
                          <SelectItem value="1:2">雄雌1:2</SelectItem>
                          <SelectItem value="混合">混合（不限比例）</SelectItem>
                          <SelectItem value="其他">其他（请在备注中说明）</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 关联项目、联系电话和使用目的 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 关联项目 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">关联项目</Label>
                      <Input
                        value={formData.project}
                        onChange={(e) => handleInputChange('project', e.target.value)}
                        placeholder="请输入关联项目名称"
                        className="w-full"
                      />
                    </div>
                    
                    {/* 联系电话 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">联系电话</Label>
                      <Input
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="请输入联系电话"
                        className="w-full"
                      />
                    </div>

                    {/* 使用目的 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">使用目的</Label>
                      <Select 
                        value={formData.purpose} 
                        onValueChange={(value) => handleInputChange('purpose', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择使用目的" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="research">科研实验</SelectItem>
                          <SelectItem value="breeding">动物繁殖</SelectItem>
                          <SelectItem value="teaching">教学实验</SelectItem>
                          <SelectItem value="drug_test">药物测试</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 备注 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">备注说明</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="请输入备注说明或特殊要求"
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => router.back()}
                      className="hover:bg-gray-50"
                    >
                      取消
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      className="bg-primary hover:bg-primary/90"
                    >
                      保存修改
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