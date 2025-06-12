"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  Settings,
  Sparkles,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Zap,
  X,
  Contact
} from "lucide-react"
import { cn } from "@/lib/utils"
import { allDemoEquipmentItems } from "../data/equipment-demo-data"
import { statusColors } from "../config/equipment-config"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BookingUnavailableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipment: any
}

// 获取不可预约原因
const getUnavailableReason = (status: string) => {
  const reasons = {
    "维修中": {
      title: "设备正在维修",
      description: "该仪器目前正在进行维护保养，暂时无法提供服务",
      icon: <Settings className="h-5 w-5 text-orange-500" />,
      suggestion: "预计维修完成后即可恢复预约"
    },
    "报废": {
      title: "设备已报废",
      description: "该仪器已达到使用年限或因故障无法继续使用",
      icon: <X className="h-5 w-5 text-red-500" />,
      suggestion: "建议选择其他同类型仪器"
    },
    "待验收": {
      title: "设备待验收",
      description: "该仪器刚完成安装调试，正在等待验收测试",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      suggestion: "验收完成后将开放预约"
    },
    "外借": {
      title: "设备外借中",
      description: "该仪器目前借调到其他实验室使用",
      icon: <MapPin className="h-5 w-5 text-purple-500" />,
      suggestion: "预计归还后即可恢复预约"
    }
  }
  
  return reasons[status as keyof typeof reasons] || {
    title: "设备不可用",
    description: "该仪器当前无法预约使用",
    icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
    suggestion: "请联系管理员了解详情"
  }
}

// 管理员联系信息
const managerContact = {
  name: "张设备管理员",
  phone: "021-12345678",
  email: "equipment@lab.edu.cn",
  avatar: "/avatars/manager.png",
  department: "设备管理处"
}

// AI推荐相似仪器
const getRecommendedEquipment = (equipment: any) => {
  // 基于仪器类型和功能进行智能推荐
  const allEquipment = allDemoEquipmentItems.filter(item => 
    item.id !== equipment.id && item.status === "正常"
  )
  
  // 优先推荐同类型仪器
  const sameCategory = allEquipment.filter(item => 
    item.category === equipment.category
  )
  
  // 如果同类型仪器不足，补充其他分析仪器
  const otherAnalytical = allEquipment.filter(item => 
    item.category === "分析仪器" && item.category !== equipment.category
  )
  
  const recommended = [...sameCategory.slice(0, 3), ...otherAnalytical.slice(0, 1)]
  
  return recommended.slice(0, 3)
}

export function BookingUnavailableDialog({ 
  open, 
  onOpenChange, 
  equipment 
}: BookingUnavailableDialogProps) {
  const router = useRouter()
  const [recommendedEquipment, setRecommendedEquipment] = useState<any[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  
  const reason = getUnavailableReason(equipment?.status || "")
  
  useEffect(() => {
    if (open && equipment) {
      setIsLoadingRecommendations(true)
      // 模拟AI推荐延迟
      setTimeout(() => {
        const recommended = getRecommendedEquipment(equipment)
        setRecommendedEquipment(recommended)
        setIsLoadingRecommendations(false)
      }, 800)
    }
  }, [open, equipment])
  
  const handleBookingRedirect = (item: any) => {
    onOpenChange(false)
    router.push(`/laboratory/equipment/booking/${item.id}`)
  }
  
  const handleContactManager = (type: 'phone' | 'email') => {
    if (type === 'phone') {
      window.open(`tel:${managerContact.phone}`)
    } else {
      window.open(`mailto:${managerContact.email}`)
    }
  }

  if (!equipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[95vw] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {reason.icon}
            <div>
              <DialogTitle className="text-xl">{reason.title}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {equipment.name} 当前不可预约
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 custom-scrollbar">
          {/* 设备信息卡片 - 融合不可预约原因和管理员联系方式 */}
          <Card className="relative">
            {/* 右上角管理员联系图标 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors">
                    <Contact className="h-4 w-4 text-blue-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <div className="space-y-3 p-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={managerContact.avatar} />
                        <AvatarFallback className="text-xs">张</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-xs">{managerContact.name}</p>
                        <p className="text-xs text-muted-foreground">{managerContact.department}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs h-7"
                        onClick={() => handleContactManager('phone')}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        {managerContact.phone}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs h-7"
                        onClick={() => handleContactManager('email')}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        邮件联系
                      </Button>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <CardContent className="pt-4 space-y-4">
              {/* 设备基本信息 */}
              <div className="flex items-start gap-4 pr-12">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {equipment.images && equipment.images.length > 0 ? (
                    <img
                      src={equipment.images[0]}
                      alt={`${equipment.name} - 图片`}
                      className="w-full h-full object-contain bg-white"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                              <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <Settings className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{equipment.name}</h3>
                  <p className="text-sm text-muted-foreground">{equipment.model}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={(statusColors[equipment.status] || "secondary") as any}>
                      {equipment.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {equipment.department} · {equipment.location}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 不可预约原因 */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  不可预约原因
                </h4>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800 font-medium">
                    {reason.description}
                  </p>
                  <p className="text-xs text-orange-600 mt-2">
                    {reason.suggestion}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI推荐替代仪器 - 撑满整个宽度 */}
          <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                <h3 className="font-semibold text-blue-900">AI推荐替代仪器</h3>
                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                  智能推荐
                </Badge>
              </div>
              
              <p className="text-sm text-blue-700 mb-4">
                为您推荐功能相似的可预约仪器
              </p>

              {isLoadingRecommendations ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2 mb-2" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recommendedEquipment.map((rec) => (
                    <div key={rec.id} className="flex flex-col p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all h-full">
                      <div className="flex items-start gap-3 mb-3 flex-1">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {rec.images && rec.images.length > 0 ? (
                            <img
                              src={rec.images[0]}
                              alt={`${rec.name} - 图片`}
                              className="w-full h-full object-contain bg-white"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                      <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                      </svg>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                              <Settings className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{rec.name}</h4>
                          <p className="text-xs text-muted-foreground truncate mt-1">{rec.model}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 flex-shrink-0">
                            可预约
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate">{rec.department}</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="text-xs px-3 py-1 h-7 bg-blue-600 hover:bg-blue-700 flex-shrink-0 font-medium ml-2"
                          onClick={() => {
                            router.push(`/laboratory/equipment/booking?id=${rec.id}&quick=true`);
                            onOpenChange(false);
                          }}
                        >
                          快速预约
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}


            </CardContent>
          </Card>
        </div>

        <div className="flex-shrink-0 pt-4 border-t bg-background">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">如有紧急需求，请直接联系设备管理员</span>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 