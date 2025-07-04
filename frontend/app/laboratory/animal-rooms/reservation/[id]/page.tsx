"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Users, 
  Thermometer, 
  Droplets, 
  MapPin, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { allDemoAnimalRoomItems } from "../../data/animal-rooms-demo-data"
import { toast } from "@/components/ui/use-toast"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 笼位状态类型
type CageStatus = "available" | "unavailable"

// 笼位数据接口
interface CageData {
  id: string
  number: number
  status: CageStatus
  notes?: string
  reservationInfo?: {
    applicantName: string
    department: string
    startTime: string
    endTime: string
    reservationId: string
  }
}

// 预约表单数据接口
interface ReservationForm {
  applicantName: string
  department: string
  relatedProject: string
  contactPhone: string
  purpose: string
  notes: string
  startTime: string
  endTime: string
  duration: string
  // 动物信息字段
  animalSpecies: string
  animalStrain: string
  animalAge: string
  animalCount: string
  genderRatio: string
}

export default function AnimalRoomReservationPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params?.id as string

  // 模拟当前用户信息（在实际应用中应该从认证系统获取）
  const currentUser = {
    name: "张三", // 当前登录用户姓名
    department: "生物医学研究院" // 当前用户所属单位
  }

  // 获取动物房数据
  const roomData = allDemoAnimalRoomItems.find(room => room.id === roomId)
  
  // 状态管理
  const [cages, setCages] = useState<CageData[]>([])
  const [selectedCages, setSelectedCages] = useState<string[]>([])
  const [isCageAreaExpanded, setIsCageAreaExpanded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [quickReservationCount, setQuickReservationCount] = useState<string>("")
  const [isReservationFormExpanded, setIsReservationFormExpanded] = useState(false)
  const [reservationForm, setReservationForm] = useState<ReservationForm>({
    applicantName: "",
    department: "",
    relatedProject: "",
    contactPhone: "",
    purpose: "",
    notes: "",
    startTime: "",
    endTime: "",
    duration: "",
    // 动物信息字段初始化
    animalSpecies: "",
    animalStrain: "",
    animalAge: "",
    animalCount: "",
    genderRatio: ""
  })

  // 检查并释放过期预约
  const checkExpiredReservations = () => {
    const now = new Date()
    setCages(prev => prev.map(cage => {
      if (cage.reservationInfo && cage.status === "unavailable") {
        const endTime = new Date(cage.reservationInfo.endTime)
        if (now > endTime) {
          // 预约已过期，释放笼位
          return {
            ...cage,
            status: "available",
            reservationInfo: undefined
          }
        }
      }
      return cage
    }))
  }

  // 定时检查过期预约（每分钟检查一次）
  useEffect(() => {
    const interval = setInterval(checkExpiredReservations, 60000) // 60秒检查一次
    return () => clearInterval(interval)
  }, [])

  // 分页配置
  const CAGES_PER_PAGE = 25
  const totalPages = Math.ceil(cages.length / CAGES_PER_PAGE)
  const startIndex = (currentPage - 1) * CAGES_PER_PAGE
  const endIndex = startIndex + CAGES_PER_PAGE
  const currentCages = cages.slice(startIndex, endIndex)

  // 计算每页的可预约笼位数量
  const getPageAvailableCount = (pageNum: number) => {
    const pageStartIndex = (pageNum - 1) * CAGES_PER_PAGE
    const pageEndIndex = pageStartIndex + CAGES_PER_PAGE
    const pageCages = cages.slice(pageStartIndex, pageEndIndex)
    return pageCages.filter(cage => cage.status === "available").length
  }

  // 初始化笼位数据
  useEffect(() => {
    if (roomData) {
      const initialCages: CageData[] = []
      
      for (let i = 1; i <= roomData.capacity; i++) {
        let status: CageStatus = "available"
        
        // 模拟一些笼位状态，确保有可预约笼位用于演示
        if (i <= Math.floor(roomData.currentOccupancy * 0.7)) {
          // 约70%的当前使用量设为使用中
          status = "unavailable"
        } else if (i <= Math.floor(roomData.currentOccupancy * 0.8)) {
          // 约10%设为已预约
          status = "unavailable"
        } else if (i === roomData.capacity) {
          // 最后一个设为维护中
          status = "unavailable"
        } else {
          // 其余笼位设为可预约状态
          status = "available"
        }
        
        initialCages.push({
          id: `cage-${i}`,
          number: i,
          status,
          notes: "",
          reservationInfo: undefined
        })
      }
      
      setCages(initialCages)
    }
  }, [roomData])

  // 自动定位到第一个有可预约笼位的页面
  useEffect(() => {
    if (cages.length > 0) {
      // 查找第一个可预约笼位的页面
      const totalPages = Math.ceil(cages.length / CAGES_PER_PAGE)
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const pageStartIndex = (pageNum - 1) * CAGES_PER_PAGE
        const pageEndIndex = pageStartIndex + CAGES_PER_PAGE
        const pageCages = cages.slice(pageStartIndex, pageEndIndex)
        const hasAvailableCages = pageCages.some(cage => cage.status === "available")
        
        if (hasAvailableCages) {
          setCurrentPage(pageNum)
          break
        }
      }
    }
  }, [cages])

  if (!roomData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">动物房未找到</h1>
          <p className="text-gray-600 mt-2">请检查房间编号是否正确</p>
          <Button onClick={() => router.back()} className="mt-4">
            返回上一页
          </Button>
        </div>
      </div>
    )
  }

  // 获取各状态笼位统计
  const cageStats = {
    total: cages.length,
    available: cages.filter(c => c.status === "available").length,
    unavailable: cages.filter(c => c.status === "unavailable").length,
  }

  // 笼位状态配置
  const cageStatusConfig = {
    available: {
      label: "可预约",
      color: "bg-green-100 border-green-200 text-green-700 hover:bg-green-200",
      badgeVariant: "outline" as const,
      icon: CheckCircle
    },
    unavailable: {
      label: "不可预约",
      color: "bg-gray-100 border-gray-200 text-gray-600",
      badgeVariant: "secondary" as const,
      icon: XCircle
    }
  }

  // 检查笼位是否为当前用户预约
  const isMyReservation = (cage: CageData) => {
    return cage.reservationInfo && 
           cage.reservationInfo.applicantName === currentUser.name &&
           cage.reservationInfo.department === currentUser.department
  }

  // 处理笼位选择
  const handleCageSelect = (cageId: string) => {
    const cage = cages.find(c => c.id === cageId)
    if (cage?.status !== "available") return

    const newSelectedCages = selectedCages.includes(cageId) 
      ? selectedCages.filter(id => id !== cageId)
      : [...selectedCages, cageId]
    
    setSelectedCages(newSelectedCages)
    
    // 智能展开/收缩预约表单
    if (newSelectedCages.length > 0 && !isReservationFormExpanded) {
      // 选择笼位后自动展开
      setIsReservationFormExpanded(true)
      // 延迟滚动到表单位置
      setTimeout(() => {
        const formElement = document.getElementById('reservation-form')
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    } else if (newSelectedCages.length === 0) {
      // 取消所有选择时自动收缩
      setIsReservationFormExpanded(false)
    }
  }

  // 快捷预约功能
  const handleQuickReservation = () => {
    const count = parseInt(quickReservationCount)
    if (!count || count <= 0) {
      toast({
        title: "请输入有效数量",
        description: "请输入大于0的数字",
        variant: "destructive"
      })
      return
    }

    // 获取所有可预约的笼位，按编号排序
    const availableCages = cages
      .filter(cage => cage.status === "available")
      .sort((a, b) => a.number - b.number)

    if (availableCages.length < count) {
      toast({
        title: `可预约${roomData?.capacityUnit || '笼位'}不足`,
        description: `当前只有${availableCages.length}个可预约${roomData?.capacityUnit || '笼位'}，无法预约${count}个`,
        variant: "destructive"
      })
      return
    }

    // 查找连续的笼位组合
    const findConsecutiveCages = (cages: CageData[], needed: number) => {
      for (let i = 0; i <= cages.length - needed; i++) {
        const group = cages.slice(i, i + needed)
        let isConsecutive = true
        
        for (let j = 1; j < group.length; j++) {
          if (group[j].number !== group[j-1].number + 1) {
            isConsecutive = false
            break
          }
        }
        
        if (isConsecutive) {
          return group
        }
      }
      return null
    }

    // 优先选择连续的笼位
    let selectedGroup = findConsecutiveCages(availableCages, count)
    
    // 如果找不到完全连续的，则选择最接近的笼位
    if (!selectedGroup) {
      selectedGroup = availableCages.slice(0, count)
    }

    // 更新选中状态
    const newSelectedCages = selectedGroup.map(cage => cage.id)
    setSelectedCages(newSelectedCages)
    
    // 智能展开预约表单
    if (!isReservationFormExpanded) {
      setIsReservationFormExpanded(true)
      // 延迟滚动到表单位置
      setTimeout(() => {
        const formElement = document.getElementById('reservation-form')
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
    
    // 跳转到第一个选中笼位所在的页面
    const firstCageNumber = selectedGroup[0].number
    const targetPage = Math.ceil(firstCageNumber / CAGES_PER_PAGE)
    setCurrentPage(targetPage)

    // 清空输入框
    setQuickReservationCount("")

    // 成功提示
    const isConsecutive = selectedGroup.every((cage, index) => 
      index === 0 || cage.number === selectedGroup[index-1].number + 1
    )
    
    toast({
      title: "快捷预约成功",
      description: isConsecutive 
        ? `已选择连续${roomData?.capacityUnit || '笼位'} #${selectedGroup[0].number}-#${selectedGroup[selectedGroup.length-1].number}`
        : `已选择${roomData?.capacityUnit || '笼位'} #${selectedGroup.map(c => c.number).join(', #')}`,
    })
  }

  // 获取选中笼位的详细信息
  const getSelectedCagesInfo = () => {
    const selectedCageObjects = cages.filter(cage => selectedCages.includes(cage.id))
    const sortedCages = selectedCageObjects.sort((a, b) => a.number - b.number)
    const numbers = sortedCages.map(cage => cage.number)
    
    // 检查是否连续
    const isConsecutive = numbers.length > 1 && numbers.every((num, index) => 
      index === 0 || num === numbers[index-1] + 1
    )

    return {
      count: numbers.length,
      numbers,
      isConsecutive,
      displayText: isConsecutive && numbers.length > 2
        ? `#${numbers[0]}-#${numbers[numbers.length-1]}`
        : numbers.map(n => `#${n}`).join(', ')
    }
  }

  // 时间验证函数
  const validateTimeRange = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return false
    
    const start = new Date(startTime)
    const end = new Date(endTime)
    const now = new Date()
    
    // 开始时间不能早于当前时间
    if (start < now) {
      toast({
        title: "时间设置错误",
        description: "开始时间不能早于当前时间",
        variant: "destructive"
      })
      return false
    }
    
    // 结束时间必须晚于开始时间
    if (end <= start) {
      toast({
        title: "时间设置错误", 
        description: "结束时间必须晚于开始时间",
        variant: "destructive"
      })
      return false
    }
    
    // 预约时长不能超过6个月
    const maxDuration = 6 * 30 * 24 * 60 * 60 * 1000 // 6个月的毫秒数
    if (end.getTime() - start.getTime() > maxDuration) {
      toast({
        title: "预约时长过长",
        description: "预约时长不能超过6个月",
        variant: "destructive"
      })
      return false
    }
    
    return true
  }

  // 计算预约时长
  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return ""
    
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 7) {
      return `${diffDays}天`
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7)
      const remainingDays = diffDays % 7
      return `${weeks}周${remainingDays > 0 ? remainingDays + '天' : ''}`
    } else {
      const months = Math.floor(diffDays / 30)
      const remainingDays = diffDays % 30
      return `${months}个月${remainingDays > 0 ? remainingDays + '天' : ''}`
    }
  }

  // 处理时间变化
  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setReservationForm(prev => {
      const newForm = { ...prev, [field]: value }
      
      // 自动计算时长
      if (newForm.startTime && newForm.endTime) {
        newForm.duration = calculateDuration(newForm.startTime, newForm.endTime)
      }
      
      return newForm
    })
  }

  // 预约管理工具函数
  const reservationManager = {
    // 创建预约
    createReservation: (cageIds: string[], reservationData: {
      applicantName: string
      department: string
      startTime: string
      endTime: string
      relatedProject?: string
      contactPhone?: string
      purpose?: string
      notes?: string
    }) => {
      const reservationId = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      setCages(prev => prev.map(cage => {
        if (cageIds.includes(cage.id)) {
          return {
            ...cage,
            status: "unavailable",
            reservationInfo: {
              applicantName: reservationData.applicantName,
              department: reservationData.department,
              startTime: reservationData.startTime,
              endTime: reservationData.endTime,
              reservationId: reservationId
            }
          }
        }
        return cage
      }))

      // 设置自动释放定时器
      const endTime = new Date(reservationData.endTime)
      const now = new Date()
      const timeout = endTime.getTime() - now.getTime()
      
      if (timeout > 0) {
        setTimeout(() => {
          reservationManager.releaseReservation(reservationId)
        }, timeout)
      }

      return reservationId
    },

    // 释放预约
    releaseReservation: (reservationId: string) => {
      setCages(prev => prev.map(cage => {
        if (cage.reservationInfo?.reservationId === reservationId) {
          return {
            ...cage,
            status: "available",
            reservationInfo: undefined
          }
        }
        return cage
      }))
      
      toast({
        title: "笼位已释放",
        description: "预约时间已到，笼位已自动释放并可重新预约",
        duration: 3000,
      })
    },

    // 检查预约冲突
    checkConflict: (cageIds: string[], startTime: string, endTime: string) => {
      const conflicts = cages.filter(cage => {
        if (!cageIds.includes(cage.id) || !cage.reservationInfo) return false
        
        const existingStart = new Date(cage.reservationInfo.startTime)
        const existingEnd = new Date(cage.reservationInfo.endTime)
        const newStart = new Date(startTime)
        const newEnd = new Date(endTime)
        
        // 检查时间重叠
        return (newStart < existingEnd && newEnd > existingStart)
      })
      
      return conflicts
    },

         // 获取预约统计
     getReservationStats: () => {
       const reservedCages = cages.filter(cage => cage.reservationInfo)
       const myCages = reservedCages.filter(cage => isMyReservation(cage))
       const othersCages = reservedCages.filter(cage => !isMyReservation(cage))
       const expiringSoon = reservedCages.filter(cage => {
         const endTime = new Date(cage.reservationInfo!.endTime)
         const now = new Date()
         const hoursLeft = (endTime.getTime() - now.getTime()) / (1000 * 60 * 60)
         return hoursLeft <= 24 && hoursLeft > 0 // 24小时内到期
       })
       
       return {
         totalReserved: reservedCages.length,
         myReservations: myCages.length,
         othersReservations: othersCages.length,
         expiringSoon: expiringSoon.length,
         availableForReservation: cages.filter(cage => cage.status === "available").length
       }
     }
  }

  // 检查表单完成状态
  const checkFormCompletion = () => {
    const requiredFields = [
      reservationForm.applicantName,
      reservationForm.department,
      reservationForm.startTime,
      reservationForm.endTime
    ]
    const requiredFieldsCompleted = requiredFields.every(field => field.trim() !== "")
    const hasCagesSelected = selectedCages.length > 0
    
    return {
      hasCagesSelected,
      requiredFieldsCompleted,
      isFullyCompleted: hasCagesSelected && requiredFieldsCompleted
    }
  }

  // 使用率计算
  const occupancyRate = Math.round((roomData.currentOccupancy / roomData.capacity) * 100)
  const availabilityRate = Math.round((cageStats.available / cageStats.total) * 100)

  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <div className="z-10">
        <div className="container mx-auto py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* 返回按钮 */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">预约{roomData?.capacityUnit || '笼位'}</h1>
                <p className="text-gray-600">{roomData.name} ({roomData.roomId})</p>
              </div>
            </div>
            
            {/* 选中笼位提示 */}
            {selectedCages.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <p className="text-sm text-blue-700">
                  已选择 <span className="font-medium">{selectedCages.length}</span> 个{roomData?.capacityUnit || '笼位'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="container mx-auto py-8">
        <div className={`grid gap-6 items-start transition-all duration-300 ${
          isCageAreaExpanded ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-5'
        }`}>
          
          {/* 动物房信息卡片 - 左侧 */}
          <div className={`xl:col-span-1 transition-all duration-300 ${
            isCageAreaExpanded ? 'hidden' : 'block'
          }`}>
            <Card className="sticky top-8 overflow-hidden bg-white border hover:shadow-lg transition-all duration-500 group h-full">
              
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">动物房信息</CardTitle>
                    <CardDescription className="text-xs">房间详细信息</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 房间图片 */}
                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                  {roomData.image ? (
                    <img
                      src={roomData.image}
                      alt={roomData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${roomData.image ? 'hidden' : ''}`}>
                    <div className="text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">暂无图片</p>
                    </div>
                  </div>
                </div>

                {/* 基本信息 */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">房间编号</p>
                    <p className="font-medium text-gray-900">{roomData.roomId}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">房间类型</p>
                    <p className="font-medium text-gray-900">{roomData.type}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">容量信息</p>
                    <p className="font-medium text-gray-900">{roomData.capacity} {roomData.capacityUnit || '笼位'}</p>
                    <p className="text-xs text-gray-400">已使用 {roomData.currentOccupancy} {roomData.capacityUnit || '笼位'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">位置</p>
                        <p className="text-sm font-medium">{roomData.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Thermometer className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">温度</p>
                          <p className="text-sm font-medium">{roomData.temperature}°C</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Droplets className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">湿度</p>
                          <p className="text-sm font-medium">{roomData.humidity}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>



                {/* 管理员联系方式 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    管理员信息
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">负责人</p>
                      <p className="text-sm font-medium">{roomData.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">所属部门</p>
                      <p className="text-sm font-medium">{roomData.department}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 笼位可视化区域 - 右侧 */}
          <div className={`space-y-8 transition-all duration-300 ${
            isCageAreaExpanded ? 'col-span-1' : 'xl:col-span-4'
          }`}>
            
            {/* 笼位布局卡片 */}
            <Card className="overflow-hidden bg-white border">
              
              <CardHeader className="pb-4 h-16 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{roomData?.capacityUnit || '笼位'}布局</CardTitle>
                      <CardDescription className="text-xs">
                        总计 {cageStats.available} 个可预约，{cageStats.unavailable} 个不可预约 · 当前已选择 {selectedCages.length} 个{roomData?.capacityUnit || '笼位'}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* 展开/收缩按钮 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCageAreaExpanded(!isCageAreaExpanded)}
                    className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title={isCageAreaExpanded ? "缩小卡片" : "放大卡片"}
                  >
                    {isCageAreaExpanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 快捷预约功能 */}
                <div className="flex items-center justify-between py-3 bg-blue-50 rounded-lg px-4 border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">快捷预约</span>
                      <p className="text-xs text-gray-500">自动选择连续{roomData?.capacityUnit || '笼位'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="数量"
                      value={quickReservationCount}
                      onChange={(e) => setQuickReservationCount(e.target.value)}
                      className="w-20 h-8 text-sm"
                      min="1"
                      max={cageStats.available}
                    />
                    <Button
                      size="sm"
                      onClick={handleQuickReservation}
                      disabled={!quickReservationCount || parseInt(quickReservationCount) <= 0}
                      className="h-8 px-3 text-xs"
                    >
                      预约
                    </Button>
                  </div>
                </div>

                {/* 分页信息和控制 */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      第 {currentPage} 页，共 {totalPages} 页
                    </div>
                    <div className="text-xs text-gray-500">
                      显示{roomData?.capacityUnit || '笼位'} #{startIndex + 1}-#{Math.min(endIndex, cages.length)}
                    </div>
                  </div>
                  
                                    <div className="flex items-center gap-2">
                    {/* 分组页码导航 - 固定显示5页 */}
                    <div className="flex items-center gap-1">
                      {(() => {
                        // 计算当前页所在的分组
                        const pageGroup = Math.ceil(currentPage / 5)
                        const startPage = (pageGroup - 1) * 5 + 1
                        const endPage = Math.min(pageGroup * 5, totalPages)
                        
                        const pageNumbers = Array.from(
                          { length: endPage - startPage + 1 }, 
                          (_, i) => startPage + i
                        )
                        
                        return pageNumbers.map((pageNum) => {
                          const isCurrentPage = pageNum === currentPage
                          const availableCount = getPageAvailableCount(pageNum)
                          const hasAvailable = availableCount > 0
                          
                          return (
                            <div key={pageNum} className="relative">
                              <Button
                                variant={isCurrentPage ? "default" : "ghost"}
                                size="sm"
                                className={cn(
                                  "h-10 w-12 p-0 flex flex-col gap-0.5",
                                  isCurrentPage && "bg-primary text-white hover:bg-primary/90",
                                  hasAvailable && !isCurrentPage && "border-green-200 bg-green-50 hover:bg-green-100"
                                )}
                                onClick={() => setCurrentPage(pageNum)}
                                title={`第${pageNum}页 - ${availableCount}个可预约${roomData?.capacityUnit || '笼位'}`}
                              >
                                <span className="text-sm font-medium">{pageNum}</span>
                                {hasAvailable && (
                                  <span className={cn(
                                    "text-xs",
                                    isCurrentPage ? "text-white/80" : "text-green-600"
                                  )}>
                                    {availableCount}剩余
                                  </span>
                                )}
                              </Button>
                              {hasAvailable && !isCurrentPage && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-2 w-2 text-white" />
                                </div>
                              )}
                            </div>
                          )
                        })
                      })()}
                    </div>
                    
                    {/* 分组导航按钮 */}
                    <div className="flex items-center gap-1 ml-2 border-l pl-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 5}
                        onClick={() => {
                          const currentGroup = Math.ceil(currentPage / 5)
                          const targetPage = Math.max(1, (currentGroup - 2) * 5 + 1)
                          setCurrentPage(targetPage)
                        }}
                        className="h-8 px-2"
                        title="上一组"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage > totalPages - 5}
                        onClick={() => {
                          const currentGroup = Math.ceil(currentPage / 5)
                          const targetPage = Math.min(totalPages, currentGroup * 5 + 1)
                          setCurrentPage(targetPage)
                        }}
                        className="h-8 px-2"
                        title="下一组"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 笼位网格 */}
                <div className="grid grid-cols-5 gap-3">
                  {currentCages.map((cage) => {
                    const config = cageStatusConfig[cage.status]
                    const Icon = config.icon
                    const isSelected = selectedCages.includes(cage.id)
                    
                    return (
                      <div
                        key={cage.id}
                        className={cn(
                          "relative p-3 rounded-lg border-2 text-center cursor-pointer transition-all duration-200",
                          config.color,
                          cage.status === "available" && "hover:shadow-md hover:scale-105",
                          cage.status !== "available" && "cursor-not-allowed opacity-75",
                          isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg"
                        )}
                        onClick={() => handleCageSelect(cage.id)}
                        title={
                          cage.status === "unavailable"
                            ? cage.reservationInfo 
                              ? isMyReservation(cage)
                                ? `我的预约\n时间：${new Date(cage.reservationInfo.startTime).toLocaleString()} 至 ${new Date(cage.reservationInfo.endTime).toLocaleString()}`
                                : `此${roomData?.capacityUnit || '笼位'}已被预约\n预约人：${cage.reservationInfo.applicantName}\n单位：${cage.reservationInfo.department}\n时间：${new Date(cage.reservationInfo.startTime).toLocaleString()} 至 ${new Date(cage.reservationInfo.endTime).toLocaleString()}`
                              : `此${roomData?.capacityUnit || '笼位'}不可预约`
                            : `点击预约此${roomData?.capacityUnit || '笼位'}`
                        }
                      >
                        <Icon className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-xs font-medium">#{cage.number}</p>
                        {cage.reservationInfo && isMyReservation(cage) && (
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full" 
                               title={`我的预约 - 预约至 ${new Date(cage.reservationInfo.endTime).toLocaleString()}`} />
                        )}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {/* 状态图例 */}
                <div className="flex flex-wrap gap-4 justify-center pt-4 border-t">
                  {Object.entries(cageStatusConfig).map(([status, config]) => {
                    const Icon = config.icon
                    return (
                      <div key={status} className="flex items-center gap-2">
                        <div className={cn("p-2 rounded border", config.color.split(' ').slice(0, 3).join(' '))}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-sm">{config.label}</span>
                      </div>
                    )
                  })}
                  {/* 我的预约状态图例 */}
                  <div className="flex items-center gap-2">
                    <div className="relative p-2 rounded border bg-gray-100 border-gray-200">
                      <div className="w-3 h-3 bg-blue-500 rounded-full absolute -top-1 -left-1" />
                      <XCircle className="h-3 w-3 text-gray-600" />
                    </div>
                    <span className="text-sm">我的预约</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 填写预约信息卡片 - 智能折叠 */}
            <Card 
              id="reservation-form"
              className="overflow-hidden bg-white border border-gray-200 transition-all duration-500"
            >
              
              <CardHeader 
                className="pb-4 h-16 flex flex-col justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  if (selectedCages.length > 0) {
                    setIsReservationFormExpanded(!isReservationFormExpanded)
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      selectedCages.length === 0 
                        ? "bg-gray-100" 
                        : checkFormCompletion().isFullyCompleted
                          ? "bg-green-100"
                          : "bg-orange-100"
                    )}>
                      {selectedCages.length === 0 ? (
                        <Plus className="h-4 w-4 text-gray-400" />
                      ) : checkFormCompletion().isFullyCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">填写预约信息</CardTitle>
                        {selectedCages.length > 0 && (
                          <div className="flex items-center gap-1">
                            {checkFormCompletion().isFullyCompleted ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                已完成
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                                请填写
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        {selectedCages.length === 0 
                          ? "请先选择笼位，然后填写预约信息" 
                          : isReservationFormExpanded 
                            ? "请填写预约申请信息，带*为必填项"
                            : "点击展开填写预约信息"
                        }
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* 展开/收缩指示器 */}
                  {selectedCages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {isReservationFormExpanded ? "收缩" : "展开"}
                      </span>
                      <div className={cn(
                        "transition-transform duration-300",
                        isReservationFormExpanded ? "rotate-180" : "rotate-0"
                      )}>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              {/* 表单内容 - 条件渲染 */}
              {selectedCages.length === 0 ? (
                // 未选择笼位时的提示内容
                <CardContent className="py-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">请先在上方选择需要预约的{roomData?.capacityUnit || '笼位'}</p>
                    <p className="text-gray-400 text-xs mt-1">选择后此区域将自动展开预约表单</p>
                  </div>
                </CardContent>
              ) : (
                // 选择笼位后的表单内容
                <div className={cn(
                  "transition-all duration-500 ease-in-out",
                  isReservationFormExpanded 
                    ? "max-h-[2000px] opacity-100" 
                    : "max-h-0 opacity-0 overflow-hidden"
                )}>
                  <CardContent className="space-y-6">
                    {/* 选中笼位展示 */}
                    {selectedCages.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">已选择{roomData?.capacityUnit || '笼位'}</span>
                    </div>
                    <div className="text-sm text-green-700">
                      <span className="font-medium">数量：</span>{getSelectedCagesInfo().count} 个
                    </div>
                    <div className="text-sm text-green-700">
                      <span className="font-medium">{roomData?.capacityUnit || '笼位'}：</span>{getSelectedCagesInfo().displayText}
                      {getSelectedCagesInfo().isConsecutive && getSelectedCagesInfo().count > 2 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">连续</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 预约人 - 必填 */}
                  <div className="space-y-2">
                    <Label htmlFor="applicantName" className="text-sm font-medium">
                      预约人 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="applicantName"
                      value={reservationForm.applicantName}
                      onChange={(e) => setReservationForm(prev => ({...prev, applicantName: e.target.value}))}
                      placeholder="请输入预约人姓名"
                      className="w-full"
                    />
                  </div>

                  {/* 所属单位 - 必填 */}
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">
                      所属单位 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="department"
                      value={reservationForm.department}
                      onChange={(e) => setReservationForm(prev => ({...prev, department: e.target.value}))}
                      placeholder="请输入所属单位"
                      className="w-full"
                    />
                  </div>

                  {/* 关联项目 - 选填 */}
                  <div className="space-y-2">
                    <Label htmlFor="relatedProject" className="text-sm font-medium">
                      关联项目
                    </Label>
                    <Input
                      id="relatedProject"
                      value={reservationForm.relatedProject}
                      onChange={(e) => setReservationForm(prev => ({...prev, relatedProject: e.target.value}))}
                      placeholder="请输入关联项目名称"
                      className="w-full"
                    />
                  </div>

                  {/* 联系电话 - 选填 */}
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-sm font-medium">
                      联系电话
                    </Label>
                    <Input
                      id="contactPhone"
                      value={reservationForm.contactPhone}
                      onChange={(e) => setReservationForm(prev => ({...prev, contactPhone: e.target.value}))}
                      placeholder="请输入联系电话"
                      className="w-full"
                    />
                  </div>

                  {/* 使用目的 - 选填 */}
                  <div className="space-y-2">
                    <Label htmlFor="purpose" className="text-sm font-medium">
                      使用目的
                    </Label>
                    <Select 
                      value={reservationForm.purpose} 
                      onValueChange={(value) => setReservationForm(prev => ({...prev, purpose: value}))}
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

                {/* 动物信息 - 新增字段 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">动物信息</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 动物种类 */}
                    <div className="space-y-2">
                      <Label htmlFor="animalSpecies" className="text-sm font-medium">
                        动物种类
                      </Label>
                      <Select 
                        value={reservationForm.animalSpecies} 
                        onValueChange={(value) => setReservationForm(prev => ({...prev, animalSpecies: value}))}
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
                      <Label htmlFor="animalStrain" className="text-sm font-medium">
                        品系与级别
                      </Label>
                      <Input
                        id="animalStrain"
                        value={reservationForm.animalStrain}
                        onChange={(e) => setReservationForm(prev => ({...prev, animalStrain: e.target.value}))}
                        placeholder="如：C57BL/6J、SPF级等"
                        className="w-full"
                      />
                    </div>

                    {/* 动物年龄 */}
                    <div className="space-y-2">
                      <Label htmlFor="animalAge" className="text-sm font-medium">
                        动物年龄
                      </Label>
                      <Input
                        id="animalAge"
                        value={reservationForm.animalAge}
                        onChange={(e) => setReservationForm(prev => ({...prev, animalAge: e.target.value}))}
                        placeholder="如：6-8周龄、成年等"
                        className="w-full"
                      />
                    </div>

                    {/* 动物数量 */}
                    <div className="space-y-2">
                      <Label htmlFor="animalCount" className="text-sm font-medium">
                        动物数量
                      </Label>
                      <Input
                        id="animalCount"
                        type="number"
                        value={reservationForm.animalCount}
                        onChange={(e) => setReservationForm(prev => ({...prev, animalCount: e.target.value}))}
                        placeholder="请输入动物数量"
                        className="w-full"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* 性别比例 - 占整行 */}
                  <div className="space-y-2">
                    <Label htmlFor="genderRatio" className="text-sm font-medium">
                      性别比例
                    </Label>
                    <Select 
                      value={reservationForm.genderRatio} 
                      onValueChange={(value) => setReservationForm(prev => ({...prev, genderRatio: value}))}
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

                {/* 时间设置 - 必填 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">使用时间设置</span>
                    <span className="text-red-500 text-sm">*</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 起始时间 */}
                    <div className="space-y-2">
                      <Label htmlFor="startTime" className="text-sm font-medium">
                        起始时间 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="startTime"
                        type="datetime-local"
                        value={reservationForm.startTime}
                        onChange={(e) => handleTimeChange('startTime', e.target.value)}
                        className="w-full"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>

                    {/* 完成时间 */}
                    <div className="space-y-2">
                      <Label htmlFor="endTime" className="text-sm font-medium">
                        完成时间 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="endTime"
                        type="datetime-local"
                        value={reservationForm.endTime}
                        onChange={(e) => handleTimeChange('endTime', e.target.value)}
                        className="w-full"
                        min={reservationForm.startTime || new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  </div>

                  {/* 预约时长显示 */}
                  {reservationForm.duration && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">预约时长</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">{reservationForm.duration}</p>
                    </div>
                  )}
                </div>

                {/* 备注说明 - 选填 */}
                <div className="-mt-3">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    备注说明
                  </Label>
                  <Textarea
                    id="notes"
                    value={reservationForm.notes}
                    onChange={(e) => setReservationForm(prev => ({...prev, notes: e.target.value}))}
                    placeholder="请输入备注说明或特殊要求"
                    rows={4}
                    className="w-full mt-2"
                  />
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCages([])
                      setQuickReservationCount("")
                      setIsReservationFormExpanded(false) // 取消时收缩表单
                      setReservationForm({
                        applicantName: "",
                        department: "",
                        relatedProject: "",
                        contactPhone: "",
                        purpose: "",
                        notes: "",
                        startTime: "",
                        endTime: "",
                        duration: "",
                        animalSpecies: "",
                        animalStrain: "",
                        animalAge: "",
                        animalCount: "",
                        genderRatio: ""
                      })
                      setCurrentPage(1)
                    }}
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={() => {
                      if (selectedCages.length === 0) {
                        toast({
                          title: `请选择${roomData?.capacityUnit || '笼位'}`,
                          description: `请至少选择一个可预约的${roomData?.capacityUnit || '笼位'}`,
                          variant: "destructive"
                        })
                        return
                      }

                      if (!reservationForm.applicantName || !reservationForm.department) {
                        toast({
                          title: "请填写必填信息",
                          description: "预约人和所属单位为必填项",
                          variant: "destructive"
                        })
                        return
                      }

                      if (!reservationForm.startTime || !reservationForm.endTime) {
                        toast({
                          title: "请设置使用时间",
                          description: "请设置笼位使用的开始时间和结束时间",
                          variant: "destructive"
                        })
                        return
                      }

                      if (!validateTimeRange(reservationForm.startTime, reservationForm.endTime)) {
                        return
                      }

                      const reservationId = reservationManager.createReservation(selectedCages, {
                        applicantName: reservationForm.applicantName,
                        department: reservationForm.department,
                        startTime: reservationForm.startTime,
                        endTime: reservationForm.endTime,
                        relatedProject: reservationForm.relatedProject,
                        contactPhone: reservationForm.contactPhone,
                        purpose: reservationForm.purpose,
                        notes: reservationForm.notes
                      })

                      // 清空选择和表单
                      setSelectedCages([])
                      setQuickReservationCount("")
                      setIsReservationFormExpanded(false) // 提交成功后收缩表单
                      setReservationForm({
                        applicantName: "",
                        department: "",
                        relatedProject: "",
                        contactPhone: "",
                        purpose: "",
                        notes: "",
                        startTime: "",
                        endTime: "",
                        duration: "",
                        animalSpecies: "",
                        animalStrain: "",
                        animalAge: "",
                        animalCount: "",
                        genderRatio: ""
                      })
                      
                      // 跳转到第一页
                      setCurrentPage(1)

                      toast({
                        title: "预约成功",
                        description: `已成功预约 ${selectedCages.length} 个${roomData?.capacityUnit || '笼位'}，预约时间：${reservationForm.startTime} 至 ${reservationForm.endTime}`,
                        duration: 5000,
                      })
                    }}
                    disabled={
                      selectedCages.length === 0 || 
                      !reservationForm.applicantName || 
                      !reservationForm.department ||
                      !reservationForm.startTime ||
                      !reservationForm.endTime
                    }
                    className="bg-primary hover:bg-primary/90"
                  >
                    提交预约
                  </Button>
                </div>
                  </CardContent>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 