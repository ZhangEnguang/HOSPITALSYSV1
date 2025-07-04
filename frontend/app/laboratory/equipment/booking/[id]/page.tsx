"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Eye, Calendar, Clock, MapPin, User, Phone, Mail, Zap, Weight, Thermometer, Droplets, ShieldCheck, Info, ChevronRight, CheckCircle2, Brain, AlertTriangle, Lightbulb, TrendingUp, Users, FileText, Sparkles, Maximize2, Minimize2, X, MoreHorizontal } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, addMonths, isSameDay, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { allDemoEquipmentItems } from "../../data/equipment-demo-data"

// 导入AI功能
import { 
  getBestTimeRecommendations, 
  detectConflicts, 
  getDurationSuggestion, 
  getUsageHeatmapData,
  mockHistoricalData,
  type TimeRecommendation,
  type ConflictDetection,
  type DurationSuggestion
} from "./ai-recommendation"
import { 
  getSmartFormSuggestions,
  getProjectSuggestions,
  type ExperimentSuggestion,
  type ProjectSuggestion,
  type SampleInfo,
  type SmartFormSuggestions
} from "./smart-form-assistant"

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

// 模拟预约数据 - 基于当前日期动态生成
const mockBookings = (() => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const currentDate = now.getDate()
  
  return [
    // 当前周的预约
    {
      id: "1",
      startDate: new Date(currentYear, currentMonth, currentDate + 1, 9, 0),
      endDate: new Date(currentYear, currentMonth, currentDate + 1, 11, 30),
      user: "李研究员",
      purpose: "材料织构分析",
      status: "已确认"
    },
    {
      id: "2", 
      startDate: new Date(currentYear, currentMonth, currentDate + 1, 14, 30),
      endDate: new Date(currentYear, currentMonth, currentDate + 1, 16, 0),
      user: "张教授",
      purpose: "晶体结构解析",
      status: "已确认"
    },
    {
      id: "3",
      startDate: new Date(currentYear, currentMonth, currentDate + 2, 10, 0),
      endDate: new Date(currentYear, currentMonth, currentDate + 2, 12, 30),
      user: "王博士",
      purpose: "残余应力测量",
      status: "已确认"
    },
    {
      id: "4",
      startDate: new Date(currentYear, currentMonth, currentDate + 2, 15, 30),
      endDate: new Date(currentYear, currentMonth, currentDate + 2, 17, 0),
      user: "陈教授",
      purpose: "相结构分析",
      status: "待审核"
    },
    {
      id: "5",
      startDate: new Date(currentYear, currentMonth, currentDate + 3, 8, 30),
      endDate: new Date(currentYear, currentMonth, currentDate + 3, 10, 0),
      user: "刘博士",
      purpose: "薄膜分析实验",
      status: "已确认"
    },
    {
      id: "6",
      startDate: new Date(currentYear, currentMonth, currentDate + 3, 13, 0),
      endDate: new Date(currentYear, currentMonth, currentDate + 3, 15, 30),
      user: "赵博士",
      purpose: "粉末衍射测试",
      status: "已确认"
    },
    {
      id: "7",
      startDate: new Date(currentYear, currentMonth, currentDate + 4, 9, 30),
      endDate: new Date(currentYear, currentMonth, currentDate + 4, 11, 0),
      user: "孙研究员",
      purpose: "单晶衍射分析",
      status: "已确认"
    },
    {
      id: "8",
      startDate: new Date(currentYear, currentMonth, currentDate + 4, 16, 0),
      endDate: new Date(currentYear, currentMonth, currentDate + 4, 17, 30),
      user: "马教授",
      purpose: "小角散射测量",
      status: "待审核"
    },
    {
      id: "9",
      startDate: new Date(currentYear, currentMonth, currentDate + 5, 10, 30),
      endDate: new Date(currentYear, currentMonth, currentDate + 5, 12, 0),
      user: "钱博士",
      purpose: "织构分析研究",
      status: "已确认"
    },
    
    // 下一周的预约
    {
      id: "10",
      startDate: new Date(currentYear, currentMonth, currentDate + 7, 8, 0),
      endDate: new Date(currentYear, currentMonth, currentDate + 7, 10, 30),
      user: "周教授",
      purpose: "新材料结构表征",
      status: "已确认"
    },
    {
      id: "11",
      startDate: new Date(currentYear, currentMonth, currentDate + 7, 14, 0),
      endDate: new Date(currentYear, currentMonth, currentDate + 7, 16, 30),
      user: "吴博士",
      purpose: "纳米材料分析",
      status: "已确认"
    },
    {
      id: "12",
      startDate: new Date(currentYear, currentMonth, currentDate + 8, 9, 0),
      endDate: new Date(currentYear, currentMonth, currentDate + 8, 11, 30),
      user: "郑研究员",
      purpose: "复合材料检测",
      status: "已确认"
    },
    {
      id: "13",
      startDate: new Date(currentYear, currentMonth, currentDate + 8, 15, 0),
      endDate: new Date(currentYear, currentMonth, currentDate + 8, 17, 0),
      user: "王教授",
      purpose: "陶瓷材料研究",
      status: "待审核"
    },
    {
      id: "14",
      startDate: new Date(currentYear, currentMonth, currentDate + 9, 10, 0),
      endDate: new Date(currentYear, currentMonth, currentDate + 9, 12, 0),
      user: "林博士",
      purpose: "金属材料分析",
      status: "已确认"
    },
    {
      id: "15",
      startDate: new Date(currentYear, currentMonth, currentDate + 10, 8, 30),
      endDate: new Date(currentYear, currentMonth, currentDate + 10, 10, 30),
      user: "黄研究员",
      purpose: "聚合物结构分析",
      status: "已确认"
    },
    {
      id: "16",
      startDate: new Date(currentYear, currentMonth, currentDate + 10, 13, 30),
      endDate: new Date(currentYear, currentMonth, currentDate + 10, 16, 0),
      user: "杨教授",
      purpose: "功能材料测试",
      status: "已确认"
    },
    {
      id: "17",
      startDate: new Date(currentYear, currentMonth, currentDate + 11, 9, 30),
      endDate: new Date(currentYear, currentMonth, currentDate + 11, 11, 30),
      user: "胡博士",
      purpose: "生物材料表征",
      status: "待审核"
    },
    {
      id: "18",
      startDate: new Date(currentYear, currentMonth, currentDate + 12, 14, 30),
      endDate: new Date(currentYear, currentMonth, currentDate + 12, 16, 30),
      user: "徐研究员",
      purpose: "能源材料研究",
      status: "已确认"
    }
  ]
})()

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
    booker: "",        // 预约人
    department: "",    // 所属单位
    purpose: "",
    project: "",
    notes: "",
    phone: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookerInputOpen, setBookerInputOpen] = useState(false)

  // AI功能相关状态
  const [timeRecommendations, setTimeRecommendations] = useState<TimeRecommendation[]>([])
  const [conflictDetection, setConflictDetection] = useState<ConflictDetection>({
    hasConflict: false,
    conflictType: 'none',
    message: '',
    suggestion: ''
  })
  const [durationSuggestion, setDurationSuggestion] = useState<DurationSuggestion | null>(null)
  const [smartFormSuggestions, setSmartFormSuggestions] = useState<SmartFormSuggestions>({
    purpose: [],
    project: [],
    sampleInfo: null,
    completionTips: []
  })
  
  const [projectInputOpen, setProjectInputOpen] = useState(false)
  const [projectInputFocused, setProjectInputFocused] = useState(false)
  const [usageHeatmapData] = useState(getUsageHeatmapData())
  const [isTimeCardExpanded, setIsTimeCardExpanded] = useState(false)

  // 模拟人员数据
  const mockUsers = [
    { id: "1", name: "张教授", department: "材料科学与工程学院", role: "教授", email: "zhang@university.edu" },
    { id: "2", name: "李博士", department: "材料科学与工程学院", role: "博士后", email: "li@university.edu" },
    { id: "3", name: "王研究员", department: "物理学院", role: "研究员", email: "wang@university.edu" },
    { id: "4", name: "陈教授", department: "化学学院", role: "教授", email: "chen@university.edu" },
    { id: "5", name: "刘博士", department: "材料科学与工程学院", role: "副教授", email: "liu@university.edu" },
    { id: "6", name: "赵博士", department: "纳米技术研究院", role: "博士", email: "zhao@university.edu" },
    { id: "7", name: "孙研究员", department: "纳米技术研究院", role: "研究员", email: "sun@university.edu" },
    { id: "8", name: "马教授", department: "生物医学工程学院", role: "教授", email: "ma@university.edu" },
    { id: "9", name: "钱博士", department: "生物医学工程学院", role: "博士后", email: "qian@university.edu" }
  ]

  // 获取预约人建议
  const getBookerSuggestions = (input: string) => {
    if (!input) return []
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(input.toLowerCase()) ||
      user.department.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5)
  }

  // 应用预约人选择
  const applyBookerSelection = (user: typeof mockUsers[0]) => {
    setFormData(prev => ({ 
      ...prev, 
      booker: user.name,
      department: user.department 
    }))
    setBookerInputOpen(false)
    
    toast({
      title: "预约人已选择",
      description: `已选择：${user.name}（${user.department}）`,
      duration: 2000,
    })
  }

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

  // AI功能实时更新
  useEffect(() => {
    // 获取时间推荐
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 14) // 未来两周
    const recommendations = getBestTimeRecommendations(
      new Date(),
      endDate,
      equipment.name,
      mockBookings
    )
    setTimeRecommendations(recommendations)
  }, [equipment.name])

  useEffect(() => {
    // 检测时间冲突
    const conflicts = detectConflicts(selectedTimeSlots)
    setConflictDetection(conflicts)
  }, [selectedTimeSlots])

  useEffect(() => {
    // 获取时长建议
    if (formData.purpose) {
      const suggestion = getDurationSuggestion(formData.purpose, equipment.name)
      setDurationSuggestion(suggestion)
    }
  }, [formData.purpose, equipment.name])

  useEffect(() => {
    // 使用防抖机制，避免频繁更新导致闪烁
    const timeoutId = setTimeout(() => {
      // 更新智能表单建议
      const suggestions = getSmartFormSuggestions(formData, equipment.name)
      // 更新项目建议，传入预约人信息
      const projectSuggestions = getProjectSuggestions(formData.purpose, equipment.name, formData.project, formData.booker)
      suggestions.project = projectSuggestions
      setSmartFormSuggestions(suggestions)
    }, 300) // 300ms防抖延迟

    return () => clearTimeout(timeoutId)
  }, [formData, equipment.name])

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

  // 获取AI推荐级别
  const getAIRecommendationLevel = (date: Date, time: string) => {
    // 根据历史数据计算空闲率
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay()
    const [hours] = time.split(':').map(Number)
    
    const historicalSlot = mockHistoricalData.find(d => 
      d.dayOfWeek === dayOfWeek && d.hour === hours
    )
    
    if (!historicalSlot) return null
    
    const maxUsage = Math.max(...mockHistoricalData.map((d: any) => d.usageCount))
    const freeRate = Math.round((1 - (historicalSlot.usageCount / maxUsage)) * 100)
    
    if (freeRate >= 70) return 'strong'
    if (freeRate >= 50 && freeRate < 70) return 'recommend'
    return null
  }

  // 获取时间段状态和样式
  const getTimeSlotStyle = (date: Date, time: string) => {
    const isBooked = isTimeSlotBooked(date, time)
    const isSelected = isTimeSlotSelected(date, time)
    const isAvailable = isTimeSlotAvailable(date, time)
    const aiLevel = getAIRecommendationLevel(date, time)
    
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
      // 根据AI推荐级别设置不同的样式
      if (aiLevel === 'strong') {
        return {
          className: "bg-teal-600 text-white shadow-sm hover:bg-teal-700 cursor-pointer transition-all duration-200 font-medium",
          text: "强推荐",
          disabled: false
        }
      } else if (aiLevel === 'recommend') {
        return {
          className: "bg-purple-500 text-white shadow-sm hover:bg-purple-600 cursor-pointer transition-all duration-200 font-medium",
          text: "推荐",
          disabled: false
        }
      } else {
        return {
          className: "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 hover:border-green-300 cursor-pointer transition-all duration-200",
          text: "可预约",
          disabled: false
        }
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
    end.setMinutes(end.getMinutes() + 30) // 每个时间段30分钟
    
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
    if (selectedTimeSlots.length === 0 || !formData.booker || !formData.department || !formData.purpose || !formData.phone) {
      toast({
        title: "表单验证失败",
        description: "请选择时间段并填写所有必填字段（预约人、所属单位、使用目的、联系电话）",
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

  // AI推荐处理函数
  const applyTimeRecommendation = (recommendation: TimeRecommendation) => {
    const start = new Date(recommendation.date)
    const [hours, minutes] = recommendation.startTime.split(':').map(Number)
    start.setHours(hours, minutes, 0, 0)
    
    const end = new Date(recommendation.date)
    const [endHours, endMinutes] = recommendation.endTime.split(':').map(Number)
    end.setHours(endHours, endMinutes, 0, 0)
    
    const newSlot = { start, end }
    setSelectedTimeSlots(prev => [...prev, newSlot])
    
    toast({
      title: "时间推荐已应用",
      description: `已添加 ${recommendation.startTime} - ${recommendation.endTime} 时间段`,
      duration: 2000,
    })
  }

  const applyProjectSuggestion = (suggestion: ProjectSuggestion) => {
    setFormData(prev => ({ ...prev, project: suggestion.name }))
    setProjectInputOpen(false)
    
    toast({
      title: "项目已关联",
      description: `已关联到：${suggestion.name}`,
      duration: 2000,
    })
  }

  const applySampleTemplate = () => {
    if (smartFormSuggestions.sampleInfo) {
      setFormData(prev => ({ 
        ...prev, 
        notes: prev.notes + (prev.notes ? '\n\n' : '') + smartFormSuggestions.sampleInfo!.template 
      }))
      
      toast({
        title: "样品信息模板已应用",
        description: "已在备注中添加样品信息模板",
        duration: 2000,
      })
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

  // 格式化时间段显示
  const formatTimeSlot = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const startTimeObj = new Date()
    startTimeObj.setHours(hours, minutes, 0, 0)
    
    const endTimeObj = new Date(startTimeObj)
    endTimeObj.setMinutes(endTimeObj.getMinutes() + 30) // 加30分钟
    
    const formatTime = (time: Date) => {
      return time.toTimeString().slice(0, 5) // HH:MM
    }
    
    return `${formatTime(startTimeObj)}-${formatTime(endTimeObj)}`
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
              仪器预约
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className={`grid gap-6 items-start transition-all duration-300 ${
          isTimeCardExpanded ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-5'
        }`}>
          {/* 仪器信息卡片 */}
          <div className={`xl:col-span-1 transition-all duration-300 ${
            isTimeCardExpanded ? 'hidden' : 'block'
          }`}>
            <Card className="sticky top-8 overflow-hidden bg-white border">
              
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
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
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
                  
                  {/* 管理联系人信息 */}
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 预约时间选择和表单 */}
          <div className={`space-y-8 transition-all duration-300 ${
            isTimeCardExpanded ? 'col-span-1' : 'xl:col-span-4'
          }`}>
            {/* 时间选择卡片 */}
            <Card className="overflow-hidden bg-white border">
              
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">选择预约时间</CardTitle>
                      <CardDescription className="text-xs">选择您需要使用仪器的时间段</CardDescription>
                    </div>
                  </div>
                  {/* 放大/缩小按钮 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTimeCardExpanded(!isTimeCardExpanded)}
                    className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title={isTimeCardExpanded ? "缩小卡片" : "放大卡片"}
                  >
                    {isTimeCardExpanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                                {/* AI智能推荐状态说明 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-medium text-gray-900">AI智能推荐状态说明</h4>
                  </div>
                  
                  {/* 状态图例 */}
                  <div className="grid grid-cols-4 gap-3 text-xs mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-50 border border-purple-300 rounded"></div>
                      <span className="text-gray-700">推荐</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                      <span className="text-gray-600">可预约</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-gray-600">已选择</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                      <span className="text-gray-600">他人预约</span>
                    </div>
                  </div>

                  {/* 推荐说明 */}
                  <div className="text-xs text-gray-600 flex items-center gap-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <div className="w-2 h-2 bg-purple-50 border border-purple-300 rounded-full"></div>
                      <span><strong>推荐:</strong> 空闲率≥50%，较好预约时间</span>
                    </div>
                  </div>
                </div>

                {/* 冲突检测提示 */}
                {conflictDetection.hasConflict && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      <div className="space-y-1">
                        <p className="font-medium">{conflictDetection.message}</p>
                        <p className="text-sm">{conflictDetection.suggestion}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

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
                  <div className="bg-white rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <div className={`overflow-y-auto transition-all duration-300 ${
                        isTimeCardExpanded ? 'max-h-[600px]' : 'max-h-96'
                      }`}>
                        <table className="w-full border-collapse min-w-[1000px]">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr>
                            <th className="border-b border-gray-200 p-2 bg-gray-50 text-sm font-semibold text-gray-700 min-w-[140px] whitespace-nowrap">时间</th>
                            {dates.map((date) => (
                              <th key={date.toISOString()} className="border-b border-gray-200 p-2 bg-gray-50 text-sm font-semibold text-gray-700 min-w-[110px]">
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
                              <td className="border-b border-gray-100 p-2 text-sm font-medium text-gray-700 bg-gray-50/30 sticky left-0 min-w-[140px] whitespace-nowrap text-center">{formatTimeSlot(time)}</td>
                              {dates.map((date) => {
                                const slotStyle = getTimeSlotStyle(date, time)
                                
                                return (
                                  <td key={`${date.toISOString()}-${time}`} className="border-b border-gray-100 p-1.5">
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
                  </div>
                )}
                
                {/* 月视图 */}
                {viewMode === "month" && (
                  <div className="bg-white rounded-xl p-4 space-y-4">
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
                        
                        // 检查当天是否有强推荐或推荐时段
                        const dayRecommendations = timeRecommendations.filter(rec => 
                          isSameDay(rec.date, date)
                        )
                        const hasStrongRecommend = dayRecommendations.some(rec => {
                          const freeRate = Math.round((1 - (rec.historicalUsage / Math.max(...mockHistoricalData.map((d: any) => d.usageCount)))) * 100)
                          return freeRate >= 70
                        })
                        const hasRecommend = dayRecommendations.some(rec => {
                          const freeRate = Math.round((1 - (rec.historicalUsage / Math.max(...mockHistoricalData.map((d: any) => d.usageCount)))) * 100)
                          return freeRate >= 50 && freeRate < 70
                        })
                        
                        return (
                          <div
                            key={date.toISOString()}
                            className={cn(
                              "p-3 text-sm border rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 relative overflow-hidden",
                              hasBookings 
                                ? "bg-red-50 border-red-200 hover:bg-red-100"
                                : hasSelectedSlots
                                ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                : hasStrongRecommend
                                ? "bg-teal-50 border-teal-200 hover:bg-teal-100"
                                : hasRecommend
                                ? "bg-green-50 border-green-200 hover:bg-green-100"
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
                            {hasStrongRecommend && !hasBookings && !hasSelectedSlots && (
                              <div className="text-xs text-teal-700 text-center mt-1 font-medium">强推荐</div>
                            )}
                            {hasRecommend && !hasStrongRecommend && !hasBookings && !hasSelectedSlots && (
                              <div className="text-xs text-green-600 text-center mt-1 font-medium">推荐</div>
                            )}
                            {hasBookings && (
                              <div className="text-xs text-red-600 text-center mt-1">有预约</div>
                            )}
                            {hasSelectedSlots && !hasBookings && (
                              <div className="text-xs text-blue-600 text-center mt-1">已选择</div>
                            )}
                            {/* AI推荐指示器 */}
                            {(hasStrongRecommend || hasRecommend) && !hasBookings && !hasSelectedSlots && (
                              <div className={cn(
                                "absolute top-1 right-1 w-2 h-2 rounded-full",
                                hasStrongRecommend ? "bg-teal-600" : "bg-green-500"
                              )}></div>
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
                        <div className={`overflow-y-auto transition-all duration-300 ${
                          isTimeCardExpanded ? 'max-h-80' : 'max-h-64'
                        }`}>
                                                      <div className={`grid gap-2 pr-2 transition-all duration-300 ${
                              isTimeCardExpanded 
                                ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10' 
                                : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                            }`}>
                            {timeSlots.map((time) => {
                              const slotStyle = getTimeSlotStyle(selectedDateForTimeSlots, time)
                              return (
                                <button
                                  key={time}
                                  className={cn(
                                    "p-2 text-xs rounded-md transition-all duration-200 font-medium whitespace-nowrap",
                                    slotStyle.className
                                  )}
                                  disabled={slotStyle.disabled}
                                  onClick={() => handleTimeSlotClick(selectedDateForTimeSlots, time)}
                                >
                                  {formatTimeSlot(time)}
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-blue-900 text-sm">已选择时间段 ({selectedTimeSlots.length}个)</h4>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTimeSlots([])}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 h-7 px-2 text-xs"
                      >
                        清除全部
                      </Button>
                    </div>
                    
                    {/* 时间段标签展示 */}
                    <div className="flex flex-wrap gap-2">
                      {selectedTimeSlots.slice(0, 6).map((slot, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-2.5 py-1.5 rounded-md text-xs font-medium border border-blue-200 hover:bg-blue-200 transition-colors group"
                        >
                          <span className="truncate max-w-[200px]">
                            {format(slot.start, "MM/dd HH:mm")} - {format(slot.end, "HH:mm")}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedTimeSlots(prev => 
                                prev.filter((_, i) => i !== index)
                              )
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-300 rounded-full p-0.5 transition-colors opacity-70 group-hover:opacity-100"
                            title="删除此时间段"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      
                      {/* 折叠显示更多时间段 */}
                      {selectedTimeSlots.length > 6 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-md text-xs font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
                              <MoreHorizontal className="h-3 w-3" />
                              还有{selectedTimeSlots.length - 6}个
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-3" side="top" align="start">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-gray-900">更多时间段</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTimeSlots([])}
                                  className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  全部清除
                                </Button>
                              </div>
                              <div className="max-h-48 overflow-y-auto space-y-1">
                                {selectedTimeSlots.slice(6).map((slot, index) => (
                                  <div
                                    key={index + 6}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-xs hover:bg-gray-100 transition-colors"
                                  >
                                    <span className="text-gray-700">
                                      {format(slot.start, "yyyy/MM/dd HH:mm")} - {format(slot.end, "HH:mm")}
                                    </span>
                                    <button
                                      onClick={() => {
                                        setSelectedTimeSlots(prev => 
                                          prev.filter((_, i) => i !== index + 6)
                                        )
                                      }}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors"
                                      title="删除此时间段"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    
                    {/* 快速统计信息 */}
                    {selectedTimeSlots.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-blue-200 text-xs text-blue-700">
                        <div className="flex items-center justify-between">
                          <span>
                            总时长: {selectedTimeSlots.reduce((total, slot) => {
                              return total + (slot.end.getTime() - slot.start.getTime()) / (1000 * 60 * 60)
                            }, 0).toFixed(1)} 小时
                          </span>
                          <span>
                            时间跨度: {selectedTimeSlots.length > 1 ? 
                              `${format(new Date(Math.min(...selectedTimeSlots.map(s => s.start.getTime()))), "MM/dd")} - ${format(new Date(Math.max(...selectedTimeSlots.map(s => s.end.getTime()))), "MM/dd")}` 
                              : format(selectedTimeSlots[0].start, "MM/dd")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 预约表单卡片 */}
            <Card className="overflow-hidden bg-white border">
              
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">填写预约信息</CardTitle>
                    <CardDescription className="text-xs">请填写详细的预约信息以便审核</CardDescription>
                  </div>
                  {/* AI智能建议图标 */}
                  {smartFormSuggestions.completionTips.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-2 h-8 w-8 hover:bg-yellow-50">
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" side="left" align="start">
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                            <h4 className="text-sm font-semibold text-gray-900">AI智能建议</h4>
                          </div>
                          <div className="space-y-2">
                            {smartFormSuggestions.completionTips.map((tip, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                          {/* 时长建议 */}
                          {durationSuggestion && (
                            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-3 w-3 text-green-600" />
                                <span className="text-xs font-medium text-green-900">推荐使用时长</span>
                              </div>
                              <p className="text-xs text-green-800">
                                <span className="font-semibold">{durationSuggestion.recommended}小时</span>
                                （{durationSuggestion.min}-{durationSuggestion.max}小时范围）
                              </p>
                              <p className="text-xs text-green-700 mt-1">{durationSuggestion.reason}</p>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 第一行：预约人和所属单位 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 预约人 - 支持检索 */}
                    <div className="space-y-2">
                      <Label htmlFor="booker" className="text-sm font-semibold text-gray-700">
                        预约人 <span className="text-red-500">*</span>
                      </Label>
                      <Popover open={bookerInputOpen} onOpenChange={setBookerInputOpen}>
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <Input
                              id="booker"
                              value={formData.booker}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, booker: e.target.value }))
                                if (e.target.value && !bookerInputOpen) {
                                  setBookerInputOpen(true)
                                }
                              }}
                              placeholder="请输入预约人姓名（支持检索）"
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                              required
                              onFocus={() => {
                                if (formData.booker || getBookerSuggestions(formData.booker).length > 0) {
                                  setBookerInputOpen(true)
                                }
                              }}
                              onBlur={(e) => {
                                // 延迟关闭，让用户有时间点击选项
                                setTimeout(() => {
                                  if (!e.currentTarget.contains(document.activeElement)) {
                                    setBookerInputOpen(false)
                                  }
                                }, 200)
                              }}
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-96 p-0" 
                          side="bottom" 
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          <Command>
                            <CommandInput placeholder="搜索预约人..." />
                            <CommandList>
                              <CommandEmpty>未找到相关人员</CommandEmpty>
                              {getBookerSuggestions(formData.booker).length > 0 && (
                                <CommandGroup heading="人员列表">
                                  {getBookerSuggestions(formData.booker).map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      onSelect={() => applyBookerSelection(user)}
                                      className="flex items-center justify-between cursor-pointer p-3"
                                    >
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{user.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          <div className="flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                                              {user.department}
                                            </span>
                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                                              {user.role}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <User className="h-4 w-4 text-blue-500 flex-shrink-0 ml-2" />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* 所属单位 */}
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-semibold text-gray-700">
                        所属单位 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="请输入所属单位（或选择预约人自动带出）"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* 第二行：关联项目和联系电话 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 关联项目 - 智能关联 */}
                    <div className="space-y-2">
                      <Label htmlFor="project" className="text-sm font-semibold text-gray-700">关联项目</Label>
                      <Popover open={projectInputOpen} onOpenChange={setProjectInputOpen}>
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <Input
                              id="project"
                              value={formData.project}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, project: e.target.value }))
                                // 只有在聚焦状态且有内容时才打开
                                if (projectInputFocused && e.target.value.length > 0 && !projectInputOpen) {
                                  setProjectInputOpen(true)
                                }
                              }}
                              placeholder="请输入关联项目名称（显示该预约人的项目）"
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                              onFocus={() => {
                                setProjectInputFocused(true)
                                // 如果有内容或有建议，延迟打开
                                setTimeout(() => {
                                  if ((formData.project.length > 0 || smartFormSuggestions.project.length > 0) && 
                                      projectInputFocused) {
                                    setProjectInputOpen(true)
                                  }
                                }, 200)
                              }}
                              onBlur={() => {
                                setProjectInputFocused(false)
                                // 延迟关闭，让用户有时间点击选项
                                setTimeout(() => {
                                  if (!projectInputFocused) {
                                    setProjectInputOpen(false)
                                  }
                                }, 300)
                              }}
                            />
                            <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-96 p-0" 
                          side="bottom" 
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          <Command>
                            <CommandInput placeholder="搜索项目..." />
                            <CommandList>
                              <CommandEmpty>未找到相关项目</CommandEmpty>
                              {smartFormSuggestions.project.length > 0 && (
                                <CommandGroup heading="AI推荐项目">
                                  {smartFormSuggestions.project.map((suggestion, index) => (
                                    <CommandItem
                                      key={index}
                                      onSelect={() => applyProjectSuggestion(suggestion)}
                                      className="flex flex-col items-start cursor-pointer p-3 space-y-2"
                                    >
                                      <div className="w-full flex items-center justify-between">
                                        <div className="font-medium text-sm truncate flex-1 mr-2">
                                          {suggestion.name}
                                        </div>
                                        <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full flex-shrink-0">
                                          {Math.round(suggestion.relevanceScore * 100)}%
                                        </div>
                                      </div>
                                      <div className="w-full">
                                        <div className="text-xs text-gray-500 space-y-1">
                                          <div className="flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                                              {suggestion.category}
                                            </span>
                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                                              {suggestion.reason}
                                            </span>
                                          </div>
                                          <div className="text-xs text-gray-600">
                                            <span className="font-medium">团队：</span>
                                            {suggestion.team.join(', ')}
                                          </div>
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* 联系电话 */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        联系电话 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="请输入联系电话"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* 第三行：使用目的（占整行） */}
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

                  {/* 备注 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">备注说明</Label>
                      {smartFormSuggestions.sampleInfo && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={applySampleTemplate}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          应用样品信息模板
                        </Button>
                      )}
                    </div>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="请输入备注说明（如特殊要求、样品信息等）"
                      rows={5}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {smartFormSuggestions.sampleInfo && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-4 w-4 text-green-600" />
                          <h5 className="text-sm font-semibold text-green-900">样品信息助手</h5>
                        </div>
                        <div className="text-sm text-green-800 space-y-3">
                          <div>
                            <p className="font-medium mb-2">必填信息：</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                              {smartFormSuggestions.sampleInfo.required.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium mb-2">注意事项：</p>
                            <div className="space-y-1 text-xs">
                              {smartFormSuggestions.sampleInfo.tips.slice(0, 3).map((tip, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <span className="text-green-600 mt-0.5">•</span>
                                  <span>{tip}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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