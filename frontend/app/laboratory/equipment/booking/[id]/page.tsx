"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Eye, Calendar, Clock, MapPin, User, Phone, Mail, Zap, Weight, Thermometer, Droplets, ShieldCheck, Info, ChevronRight, CheckCircle2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, addMonths, isSameDay, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { allDemoEquipmentItems } from "../../data/equipment-demo-data"

// 从真实数据中获取仪器信息
const getEquipmentData = (id: string) => {
  console.log("正在查找设备ID:", id);
  const equipment = allDemoEquipmentItems.find((item: any) => item.id === id)
  if (!equipment) {
    console.log("未找到设备，使用默认设备:", allDemoEquipmentItems[0]);
    // 如果找不到，返回第一个作为默认值
    return allDemoEquipmentItems[0]
  }
  console.log("找到设备:", equipment.name, "图片:", equipment.images);
  return equipment
}

// 模拟预约数据
const mockBookings = [
  {
    id: "1",
    startDate: new Date(2024, 2, 15, 9, 0),
    endDate: new Date(2024, 2, 15, 11, 0),
    user: "李研究员",
    purpose: "材料织构分析",
    status: "已确认"
  },
  {
    id: "2",
    startDate: new Date(2024, 2, 16, 14, 0),
    endDate: new Date(2024, 2, 16, 16, 0),
    user: "王博士",
    purpose: "残余应力测量",
    status: "已确认"
  },
  {
    id: "3",
    startDate: new Date(2024, 2, 18, 10, 0),
    endDate: new Date(2024, 2, 18, 12, 0),
    user: "陈教授",
    purpose: "相结构分析",
    status: "待审核"
  }
]

type ViewMode = "week" | "month"

// 技术规格键名中文映射
const getSpecificationLabel = (key: string): string => {
  const labelMap: { [key: string]: string } = {
    'powerSupply': '电源供应',
    'power': '功率',
    'dimensions': '尺寸',
    'weight': '重量',
    'operatingTemperature': '工作温度',
    'humidity': '湿度',
    'specialRequirements': '特殊要求',
    'voltage': '电压',
    'frequency': '频率',
    'resolution': '分辨率',
    'accuracy': '精度',
    'range': '测量范围',
    'sensitivity': '灵敏度',
    'stability': '稳定性',
    'interface': '接口',
    'software': '软件',
    'calibration': '校准',
    'maintenance': '维护',
    'warranty': '保修',
    'manufacturer': '制造商',
    'model': '型号',
    'serialNumber': '序列号'
  }
  
  return labelMap[key] || key
}

export default function EquipmentBookingPage() {
  const router = useRouter()
  const params = useParams()
  const equipmentId = (params?.id as string) || ""
  
  const [equipment] = useState(getEquipmentData(equipmentId))
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ start: Date; end: Date }[]>([])
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [selectedDateForTimeSlots, setSelectedDateForTimeSlots] = useState<Date | null>(null)

  const [formData, setFormData] = useState({
    purpose: "",
    project: "",
    notes: "",
    contact: "",
    phone: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 时间段配置 - 24小时制
  const timeSlots = [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30",
    "03:00", "03:30", "04:00", "04:30", "05:00", "05:30",
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
  ]

  // 获取当前视图的日期范围
  const getDateRange = () => {
    switch (viewMode) {
      case "week":
        return {
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        }
      case "month":
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        }
    }
  }

  // 导航函数
  const navigateDate = (direction: "prev" | "next") => {
    switch (viewMode) {
      case "week":
        setCurrentDate(prev => direction === "next" ? addWeeks(prev, 1) : addWeeks(prev, -1))
        break
      case "month":
        setCurrentDate(prev => direction === "next" ? addMonths(prev, 1) : addMonths(prev, -1))
        break
    }
  }

  // 检查时间段是否被他人预约
  const isTimeSlotBooked = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const slotStart = new Date(date)
    slotStart.setHours(hours, minutes, 0, 0)
    
    return mockBookings.some(booking => {
      return slotStart >= booking.startDate && slotStart < booking.endDate
    })
  }

  // 检查时间段是否已被当前用户选择
  const isTimeSlotSelected = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const slotStart = new Date(date)
    slotStart.setHours(hours, minutes, 0, 0)
    
    return selectedTimeSlots.some(slot => {
      return slotStart.getTime() === slot.start.getTime()
    })
  }

  // 检查时间段是否可预约（不是过去时间且不被他人预约）
  const isTimeSlotAvailable = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const slotStart = new Date(date)
    slotStart.setHours(hours, minutes, 0, 0)
    
    const now = new Date()
    return slotStart > now && !isTimeSlotBooked(date, time)
  }

  // 获取时间段状态和样式
  const getTimeSlotStyle = (date: Date, time: string) => {
    const isBooked = isTimeSlotBooked(date, time)
    const isSelected = isTimeSlotSelected(date, time)
    const isAvailable = isTimeSlotAvailable(date, time)
    
    if (isBooked) {
      return {
        className: "bg-red-50 text-red-600 cursor-not-allowed border border-red-200 hover:bg-red-50",
        text: "他人预约",
        disabled: true
      }
    } else if (isSelected) {
      return {
        className: "bg-blue-500 text-white shadow-md border border-blue-600 hover:bg-blue-600",
        text: "已选择",
        disabled: false
      }
    } else if (isAvailable) {
      return {
        className: "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 hover:border-green-300 cursor-pointer transition-all duration-200",
        text: "可预约",
        disabled: false
      }
    } else {
      return {
        className: "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200",
        text: "不可预约",
        disabled: true
      }
    }
  }

  // 处理时间段选择（支持多选）
  const handleTimeSlotClick = (date: Date, time: string) => {
    const slotStyle = getTimeSlotStyle(date, time)
    if (slotStyle.disabled) return
    
    const [hours, minutes] = time.split(":").map(Number)
    const start = new Date(date)
    start.setHours(hours, minutes, 0, 0)
    
    const end = new Date(start)
    end.setHours(hours + 1, minutes, 0, 0) // 默认1小时时长
    
    const newSlot = { start, end }
    
    // 检查是否已选择，如果已选择则取消选择
    const isAlreadySelected = selectedTimeSlots.some(slot => 
      slot.start.getTime() === start.getTime()
    )
    
    if (isAlreadySelected) {
      // 取消选择
      setSelectedTimeSlots(prev => 
        prev.filter(slot => slot.start.getTime() !== start.getTime())
      )
    } else {
      // 添加选择
      setSelectedTimeSlots(prev => [...prev, newSlot])
    }
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 表单验证
    if (selectedTimeSlots.length === 0 || !formData.purpose || !formData.contact) {
      toast({
        title: "表单验证失败",
        description: "请选择时间段并填写所有必填字段",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // 模拟提交预约
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "预约成功",
        description: "您的仪器预约申请已提交，请等待审核",
        duration: 3000,
      })

      router.push("/laboratory/equipment")
    } catch (error) {
      toast({
        title: "预约失败",
        description: "提交预约时发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 生成日期数组
  const generateDates = (): Date[] => {
    const dateRange = getDateRange()
    const dates: Date[] = []
    const current = new Date(dateRange.start)
    
    while (current <= dateRange.end) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return dates
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "在用": return "bg-green-100 text-green-800 border-green-200"
      case "维修中": return "bg-orange-100 text-orange-800 border-orange-200"
      case "闲置": return "bg-gray-100 text-gray-800 border-gray-200"
      case "报废": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const dates = generateDates()

  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <div className="z-10">
        <div className="container mx-auto py-3">
          <div className="flex items-center gap-3">
            {/* 返回按钮 */}
            <button
              onClick={() => router.back()}
              className="h-8 w-8 flex items-center justify-center border rounded-md text-gray-500 hover:text-primary transition-colors duration-200 bg-white shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              仪器预约
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          {/* 仪器信息卡片 */}
          <div className="xl:col-span-1">
            <Card className="sticky top-8 overflow-hidden bg-white border shadow-xl hover:shadow-2xl transition-all duration-500 group">
              
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
              
              <CardContent className="space-y-6">
                {/* 仪器图片 */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group-hover:shadow-lg transition-shadow">
                    {equipment.images && equipment.images.length > 0 ? (
                      <img
                        src={equipment.images[0]}
                        alt={equipment.name}
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          console.log("图片加载成功:", equipment.images[0]);
                          setIsImageLoaded(true);
                        }}
                        onError={(e) => {
                          console.log("图片加载失败:", equipment.images[0]);
                          setIsImageLoaded(false);
                        }}
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
                    getStatusColor(equipment.status)
                  )}>
                    {equipment.status}
                  </div>
                </div>
                
                {/* 基本信息 */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{equipment.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {equipment.model}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        类型
                      </span>
                      <span className="text-sm font-medium">{equipment.category}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        部门
                      </span>
                      <span className="text-sm font-medium">{equipment.department}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        位置
                      </span>
                      <span className="text-sm font-medium">{equipment.location}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-700 leading-relaxed">{equipment.description}</p>
                  </div>
                </div>
                
                {/* 技术规格 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    技术规格
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(equipment.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-xs text-gray-600">{getSpecificationLabel(key)}</span>
                        <span className="text-xs font-medium text-right max-w-[60%]">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 管理员信息 */}
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
              </CardContent>
            </Card>
          </div>

          {/* 预约时间选择和表单 */}
          <div className="xl:col-span-3 space-y-8">
            {/* 时间选择卡片 */}
            <Card className="overflow-hidden bg-white border shadow-xl">
              
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">选择预约时间</CardTitle>
                    <CardDescription className="text-xs">选择您需要使用仪器的时间段</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 状态图例 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">状态说明</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                      <span className="text-gray-600">可预约</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
                      <span className="text-gray-600">已选择</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                      <span className="text-gray-600">他人预约</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                      <span className="text-gray-600">不可预约</span>
                    </div>
                  </div>
                </div>

                {/* 视图切换和导航 */}
                <div className="flex items-center justify-between">
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                    <TabsList className="bg-blue-50 border border-blue-200">
                      <TabsTrigger value="week" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                        周视图
                      </TabsTrigger>
                      <TabsTrigger value="month" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                        月视图
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateDate("prev")} className="hover:bg-blue-50">
                      上一{viewMode === "week" ? "周" : "月"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="hover:bg-blue-50">
                      今天
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateDate("next")} className="hover:bg-blue-50">
                      下一{viewMode === "week" ? "周" : "月"}
                    </Button>
                </div>
              </div>

                {/* 当前日期显示 */}
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {viewMode === "week" && `${format(getDateRange().start, "yyyy年MM月dd日")} - ${format(getDateRange().end, "yyyy年MM月dd日")}`}
                    {viewMode === "month" && format(currentDate, "yyyy年MM月")}
                  </h3>
                </div>

                {/* 时间表格 */}
                {viewMode === "week" && (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr>
                            <th className="border-b border-gray-200 p-3 bg-gray-50 text-sm font-semibold text-gray-700">时间</th>
                            {dates.map((date) => (
                              <th key={date.toISOString()} className="border-b border-gray-200 p-3 bg-gray-50 text-sm font-semibold text-gray-700 min-w-[120px]">
                                <div className={cn(
                                  "text-center",
                                  isToday(date) && "text-blue-600 font-bold"
                                )}>
                                  <div>{format(date, "MM/dd")}</div>
                                  <div className="text-xs text-gray-500 font-normal">{format(date, "EEE")}</div>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                        {timeSlots.map((time) => (
                            <tr key={time} className="hover:bg-gray-50/50 transition-colors">
                              <td className="border-b border-gray-100 p-3 text-sm font-medium text-gray-700 bg-gray-50/30 sticky left-0">{time}</td>
                              {dates.map((date) => {
                                const slotStyle = getTimeSlotStyle(date, time)
                                
                                return (
                                  <td key={`${date.toISOString()}-${time}`} className="border-b border-gray-100 p-2">
                                    <button
                                      className={cn(
                                        "w-full h-10 text-xs rounded-lg font-medium transition-all duration-200",
                                        slotStyle.className
                                      )}
                                      disabled={slotStyle.disabled}
                                      onClick={() => handleTimeSlotClick(date, time)}
                                    >
                                      {slotStyle.text}
                                    </button>
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* 月视图 */}
                {viewMode === "month" && (
                  <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
                        <div key={day} className="text-center text-sm font-semibold p-3 bg-gray-50 rounded-lg text-gray-700">
                          {day}
                        </div>
                      ))}
                      {dates.map((date) => {
                        const hasBookings = mockBookings.some(booking =>
                          isSameDay(date, booking.startDate)
                        )
                        const hasSelectedSlots = selectedTimeSlots.some(slot =>
                          isSameDay(date, slot.start)
                        )
                        const isSelectedDate = selectedDateForTimeSlots && isSameDay(date, selectedDateForTimeSlots)
                        return (
                          <div
                            key={date.toISOString()}
                            className={cn(
                              "p-3 text-sm border rounded-lg cursor-pointer hover:scale-105 transition-all duration-200",
                              hasBookings 
                                ? "bg-red-50 border-red-200 hover:bg-red-100"
                                : hasSelectedSlots
                                ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                : "bg-green-50 border-green-200 hover:bg-green-100",
                              isToday(date) && "ring-2 ring-blue-500 ring-offset-2",
                              isSelectedDate && "ring-2 ring-purple-500 ring-offset-2"
                            )}
                            onClick={() => {
                              setSelectedDateForTimeSlots(date)
                            }}
                          >
                            <div className="text-center font-medium">
                              {format(date, "d")}
                            </div>
                            {hasBookings && (
                              <div className="text-xs text-red-600 text-center mt-1">有预约</div>
                            )}
                            {hasSelectedSlots && !hasBookings && (
                              <div className="text-xs text-blue-600 text-center mt-1">已选择</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* 选中日期的时间段选择 */}
                    {selectedDateForTimeSlots && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          {format(selectedDateForTimeSlots, "yyyy年MM月dd日")} 可选时间段
                        </h4>
                        <div className="max-h-64 overflow-y-auto">
                          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 pr-2">
                            {timeSlots.map((time) => {
                              const slotStyle = getTimeSlotStyle(selectedDateForTimeSlots, time)
                              return (
                                <button
                                  key={time}
                                  className={cn(
                                    "p-2 text-xs rounded-md transition-all duration-200 font-medium",
                                    slotStyle.className
                                  )}
                                  disabled={slotStyle.disabled}
                                  onClick={() => handleTimeSlotClick(selectedDateForTimeSlots, time)}
                                >
                                  {time}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 选中的时间段显示 */}
                {selectedTimeSlots.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900">已选择时间段 ({selectedTimeSlots.length}个)</h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            {selectedTimeSlots.map((slot, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span>{format(slot.start, "yyyy年MM月dd日 HH:mm")} - {format(slot.end, "HH:mm")}</span>
                                <button
                                  onClick={() => {
                                    setSelectedTimeSlots(prev => 
                                      prev.filter((_, i) => i !== index)
                                    )
                                  }}
                                  className="text-blue-500 hover:text-blue-700 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTimeSlots([])}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        清除全部
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 预约表单卡片 */}
            <Card className="overflow-hidden bg-white border shadow-xl">
              
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">填写预约信息</CardTitle>
                    <CardDescription className="text-xs">请填写详细的预约信息以便审核</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 使用目的 */}
              <div className="space-y-2">
                      <Label htmlFor="purpose" className="text-sm font-semibold text-gray-700">
                        使用目的 <span className="text-red-500">*</span>
                      </Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="请输入使用目的"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 所属项目 */}
              <div className="space-y-2">
                      <Label htmlFor="project" className="text-sm font-semibold text-gray-700">所属项目</Label>
                <Input
                  id="project"
                  value={formData.project}
                  onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                  placeholder="请输入所属项目名称"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* 联系人 */}
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-sm font-semibold text-gray-700">
                        联系人 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contact"
                        value={formData.contact}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                        placeholder="请输入联系人姓名"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    {/* 联系电话 */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">联系电话</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="请输入联系电话"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">备注说明</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="请输入备注说明（如特殊要求、样品信息等）"
                  rows={3}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* 提交按钮 */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                      className="hover:bg-gray-50"
                >
                  取消
                </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || selectedTimeSlots.length === 0}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          提交中...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          提交预约
                        </div>
                      )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 