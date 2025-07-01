"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Eye, Calendar, Clock, MapPin, User, Phone, Mail, Zap, Weight, Thermometer, Droplets, ShieldCheck, Info, ChevronRight, CheckCircle2, Brain, AlertTriangle, Lightbulb, TrendingUp, Users, FileText, Sparkles, ChevronUp, ChevronDown } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, addMonths, isSameDay, isToday, isSameMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { allDemoEquipmentItems } from "../../../equipment/data/equipment-demo-data"

// 导入AI功能
import { 
  getBestTimeRecommendations, 
  detectConflicts, 
  getDurationSuggestion, 
  getUsageHeatmapData,
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

// 模拟现有预约数据 - 用于编辑
const mockExistingBookings = {
  "book-001": {
    id: "book-001",
    bookingTitle: "纳米颗粒表征实验",
    equipmentId: "eq1",
    equipmentName: "扫描电子显微镜",
    equipmentType: "分析仪器",
    booker: "李四",
    department: "材料实验室",
    phone: "18045678901",
    purpose: "观察纳米颗粒形貌和尺寸分布",
    project: "新型纳米材料开发",
    notes: "需要准备样品载台",
    startTime: "2023-11-25T09:00:00.000Z",
    endTime: "2023-11-25T12:00:00.000Z",
    duration: "3小时",
    status: "审核通过",
    applicationDate: "2023-11-20T14:30:00.000Z",
    applicant: {
      id: "user-004",
      name: "李四",
      email: "li4@university.edu",
      avatar: "/avatars/04.png"
    }
  },
  "book-002": {
    id: "book-002",
    bookingTitle: "蛋白质结构分析",
    equipmentId: "eq2", 
    equipmentName: "X射线衍射仪",
    equipmentType: "分析仪器",
    booker: "张教授",
    department: "生物实验室",
    phone: "13912345678",
    purpose: "分析蛋白质晶体结构",
    project: "肿瘤标志物检测技术",
    notes: "需要专业人员指导",
    startTime: "2023-11-24T14:00:00.000Z",
    endTime: "2023-11-24T18:00:00.000Z",
    duration: "4小时",
    status: "审核通过",
    applicationDate: "2023-11-18T16:20:00.000Z",
    applicant: {
      id: "user-005",
      name: "张教授",
      email: "zhang@university.edu",
      avatar: "/avatars/05.png"
    }
  },
  "book-003": {
    id: "book-003",
    bookingTitle: "光谱测量实验",
    equipmentId: "eq3",
    equipmentName: "荧光光谱仪",
    equipmentType: "光学仪器",
    booker: "王研究员",
    department: "化学实验室",
    phone: "13800138000",
    purpose: "测量有机化合物的荧光光谱",
    project: "有机发光材料研究",
    notes: "样品已准备完毕",
    startTime: "2023-11-26T10:00:00.000Z",
    endTime: "2023-11-26T15:00:00.000Z",
    duration: "5小时",
    status: "待审核",
    applicationDate: "2023-11-22T11:45:00.000Z",
    applicant: {
      id: "user-001",
      name: "王研究员",
      email: "wang@university.edu",
      avatar: "/avatars/01.png"
    }
  },
  "book-004": {
    id: "book-004",
    bookingTitle: "细胞培养观察",
    equipmentId: "eq4",
    equipmentName: "倒置荧光显微镜",
    equipmentType: "光学仪器",
    booker: "赵博士",
    department: "生物实验室",
    phone: "15900159000",
    purpose: "观察细胞分化过程",
    project: "干细胞分化机制研究",
    notes: "需要CO2培养箱配合",
    startTime: "2023-11-22T13:00:00.000Z",
    endTime: "2023-11-22T17:00:00.000Z",
    duration: "4小时",
    status: "审核通过",
    applicationDate: "2023-11-18T09:15:00.000Z",
    applicant: {
      id: "user-005",
      name: "赵博士",
      email: "zhao@university.edu",
      avatar: "/avatars/05.png"
    }
  },
  "book-005": {
    id: "book-005",
    bookingTitle: "金属成分检测",
    equipmentId: "eq5",
    equipmentName: "原子吸收光谱仪",
    equipmentType: "分析仪器",
    booker: "钱教授",
    department: "材料实验室",
    phone: "13600136000",
    purpose: "检测合金中微量元素含量",
    project: "合金材料性能优化",
    notes: "需要标准样品对照",
    startTime: "2023-11-24T09:00:00.000Z",
    endTime: "2023-11-24T12:00:00.000Z",
    duration: "3小时",
    status: "审核退回",
    applicationDate: "2023-11-20T10:30:00.000Z",
    applicant: {
      id: "user-004",
      name: "钱教授",
      email: "qian@university.edu",
      avatar: "/avatars/04.png"
    }
  },
  "book-006": {
    id: "book-006",
    bookingTitle: "电化学性能测试",
    equipmentId: "eq6",
    equipmentName: "电化学工作站",
    equipmentType: "电子仪器",
    booker: "孙研究员",
    department: "化学实验室",
    phone: "18700187000",
    purpose: "测试电极材料的电化学性能",
    project: "新型电池材料开发",
    notes: "需要准备电解液",
    startTime: "2023-11-27T09:00:00.000Z",
    endTime: "2023-11-27T16:00:00.000Z",
    duration: "7小时",
    status: "审核通过",
    applicationDate: "2023-11-21T13:20:00.000Z",
    applicant: {
      id: "user-001",
      name: "孙研究员",
      email: "sun@university.edu",
      avatar: "/avatars/01.png"
    }
  },
  "book-007": {
    id: "book-007",
    bookingTitle: "热分析实验",
    equipmentId: "eq7",
    equipmentName: "差示扫描量热仪",
    equipmentType: "分析仪器",
    booker: "周博士",
    department: "材料实验室",
    phone: "13500135000",
    purpose: "分析聚合物的热性能",
    project: "聚合物材料研究",
    notes: "申请人主动取消",
    startTime: "2023-11-23T14:00:00.000Z",
    endTime: "2023-11-23T18:00:00.000Z",
    duration: "4小时",
    status: "已取消",
    applicationDate: "2023-11-19T15:45:00.000Z",
    applicant: {
      id: "user-005",
      name: "周博士",
      email: "zhou@university.edu",
      avatar: "/avatars/05.png"
    }
  },
  "book-008": {
    id: "book-008",
    bookingTitle: "气相色谱分析",
    equipmentId: "eq1",
    equipmentName: "气相色谱-质谱联用仪",
    equipmentType: "分析仪器",
    booker: "吴教授",
    department: "化学实验室",
    phone: "18900189000",
    purpose: "分析水样中有机污染物成分",
    project: "环境污染物检测",
    notes: "样品预处理已完成",
    startTime: "2023-11-28T08:30:00.000Z",
    endTime: "2023-11-28T12:30:00.000Z",
    duration: "4小时",
    status: "待审核",
    applicationDate: "2023-11-23T10:15:00.000Z",
    applicant: {
      id: "user-004",
      name: "吴教授",
      email: "wu@university.edu",
      avatar: "/avatars/04.png"
    }
  },
  "book-009": {
    id: "book-009",
    bookingTitle: "力学性能测试",
    equipmentId: "eq9",
    equipmentName: "万能试验机",
    equipmentType: "物理仪器",
    booker: "王研究员",
    department: "材料实验室",
    phone: "13700137000",
    purpose: "测试复合材料的拉伸强度",
    project: "复合材料强度研究",
    notes: "准备多组试样",
    startTime: "2023-11-29T13:00:00.000Z",
    endTime: "2023-11-29T17:00:00.000Z",
    duration: "4小时",
    status: "审核通过",
    applicationDate: "2023-11-22T16:30:00.000Z",
    applicant: {
      id: "user-001",
      name: "王研究员",
      email: "wang@university.edu",
      avatar: "/avatars/01.png"
    }
  },
  "book-010": {
    id: "book-010",
    bookingTitle: "核磁共振波谱测定",
    equipmentId: "eq10",
    equipmentName: "核磁共振波谱仪",
    equipmentType: "分析仪器",
    booker: "赵博士",
    department: "化学实验室",
    phone: "15800158000",
    purpose: "确定有机化合物的分子结构",
    project: "新药分子设计",
    notes: "样品纯度要求较高",
    startTime: "2023-11-24T10:00:00.000Z",
    endTime: "2023-11-24T14:00:00.000Z",
    duration: "4小时",
    status: "审核通过",
    applicationDate: "2023-11-19T14:20:00.000Z",
    applicant: {
      id: "user-005",
      name: "赵博士",
      email: "zhao@university.edu",
      avatar: "/avatars/05.png"
    }
  }
}

// 获取现有预约数据
const getExistingBookingData = (bookingId: string) => {
  return mockExistingBookings[bookingId as keyof typeof mockExistingBookings] || null
}

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

export default function EquipmentBookingEditPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = (params?.id as string) || ""
  
  // 获取现有预约数据
  const existingBooking = getExistingBookingData(bookingId)
  const equipmentId = existingBooking?.equipmentId || ""
  
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

  // 在组件加载时填充现有数据
  useEffect(() => {
    if (existingBooking) {
      setFormData({
        booker: existingBooking.booker,
        department: existingBooking.department,
        purpose: existingBooking.purpose,
        project: existingBooking.project || "",
        notes: existingBooking.notes || "",
        phone: existingBooking.phone,
      })

      // 设置现有的时间段
      if (existingBooking.startTime && existingBooking.endTime) {
        const startTime = new Date(existingBooking.startTime)
        const endTime = new Date(existingBooking.endTime)
        setSelectedTimeSlots([{ start: startTime, end: endTime }])
        setCurrentDate(startTime) // 将日历定位到预约日期
      }
    }
  }, [existingBooking])

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
  const [showAIRecommendations, setShowAIRecommendations] = useState(false)
  const [projectInputOpen, setProjectInputOpen] = useState(false)
  const [projectInputFocused, setProjectInputFocused] = useState(false)
  const [usageHeatmapData] = useState(getUsageHeatmapData())

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
      // 模拟更新预约
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "预约更新成功",
        description: "您的仪器预约已更新，请等待重新审核",
        duration: 3000,
      })

      router.push("/laboratory/equipment-booking")
    } catch (error) {
      toast({
        title: "更新失败",
        description: "更新预约时发生错误，请重试",
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
              编辑预约
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
                    {format(new Date(existingBooking.startTime), "yyyy年MM月dd日 HH:mm")} - 
                    {format(new Date(existingBooking.endTime), "HH:mm")}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
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
            <Card className="overflow-hidden bg-white border">
              
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

                {/* AI智能推荐区域 */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">AI智能推荐</h4>
                        <p className="text-xs text-gray-500">基于历史数据为您推荐最佳时间</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      {showAIRecommendations ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          收起
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          展开
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {showAIRecommendations && (
                    <div className="p-4">
                      {timeRecommendations.length > 0 ? (
                        <div className="space-y-3">
                          {timeRecommendations.slice(0, 3).map((recommendation, index) => (
                            <div key={index} className="group relative bg-gray-50 rounded-lg p-3 hover:bg-blue-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900">
                                      {format(recommendation.date, 'MM月dd日')} {recommendation.startTime} - {recommendation.endTime}
                                    </span>
                                    <span className={cn(
                                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                      recommendation.score >= 80 ? "bg-green-100 text-green-800" :
                                      recommendation.score >= 60 ? "bg-yellow-100 text-yellow-800" :
                                      "bg-red-100 text-red-800"
                                    )}>
                                      {recommendation.score}%
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600">{recommendation.reason}</p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => applyTimeRecommendation(recommendation)}
                                  className="ml-3 bg-blue-600 hover:bg-blue-700 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  选择
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Brain className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">暂无可推荐的时间段</p>
                        </div>
                      )}
                    </div>
                  )}
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
                            <tr key={time} className="hover:bg-gray-50">
                              <td className="border-b border-gray-100 p-3 text-sm font-medium text-gray-700 bg-gray-50/50">
                                {time}
                              </td>
                              {dates.map((date) => {
                                const slotStyle = getTimeSlotStyle(date, time)
                                return (
                                  <td key={`${date.toISOString()}-${time}`} className="border-b border-gray-100 p-1">
                                    <button
                                      className={cn(
                                        "w-full h-10 text-xs rounded-md transition-all duration-200 font-medium",
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
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                      {/* 周标题 */}
                      {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                        <div key={day} className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                          {day}
                        </div>
                      ))}
                      
                      {/* 月份日期 */}
                      {generateDates().map((date, index) => {
                        const hasBookings = mockBookings.some(booking => 
                          isSameDay(booking.startDate, date)
                        )
                        const hasSelectedSlots = selectedTimeSlots.some(slot => 
                          isSameDay(slot.start, date)
                        )
                        const isSelectedDate = selectedDateForTimeSlots && isSameDay(date, selectedDateForTimeSlots)
                        
                        return (
                          <div
                            key={index}
                            className={cn(
                              "min-h-[80px] p-2 border-b border-r border-gray-200 cursor-pointer transition-colors",
                              !isSameMonth(date, currentDate) && "bg-gray-50 text-gray-400",
                              hasBookings && !hasSelectedSlots
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

                    {/* 所属单位 - 自动带出 */}
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-semibold text-gray-700">
                        所属单位 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="department"
                        value={formData.department}
                        placeholder="根据预约人自动带出"
                        className="border-gray-200 bg-gray-50 cursor-not-allowed"
                        disabled
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
                          更新中...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          更新预约
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