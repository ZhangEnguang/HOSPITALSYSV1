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
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { allDemoEquipmentItems } from "../data/equipment-demo-data"
import { statusColors } from "../config/equipment-config"
import { Skeleton } from "@/components/ui/skeleton"

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

        <div className="flex-1 overflow-y-auto space-y-6 min-h-0 custom-scrollbar">
          {/* 仪器信息卡片 */}
          <Card className="border-l-4 border-l-orange-400">
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
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
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 不可预约原因 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  不可预约原因
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800 font-medium">
                    {reason.description}
                  </p>
                  <p className="text-xs text-orange-600 mt-2">
                    {reason.suggestion}
                  </p>
                </div>
                
                <Separator />
                
                {/* 联系管理员 */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    联系设备管理员
                  </h4>
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={managerContact.avatar} />
                      <AvatarFallback>张</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{managerContact.name}</p>
                      <p className="text-xs text-muted-foreground">{managerContact.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleContactManager('phone')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      电话联系
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleContactManager('email')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      邮件联系
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI推荐替代仪器 */}
            <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                  <h3 className="font-semibold text-blue-900">AI推荐替代仪器</h3>
                  <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                    基于功能相似性分析
                  </Badge>
                </div>
                
                <p className="text-sm text-blue-700 mb-4">
                  基于功能相似性为您推荐可预约的仪器
                </p>

                {isLoadingRecommendations ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="w-16 h-8 rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recommendedEquipment.map((rec) => (
                      <div key={rec.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all">
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
                          <h4 className="font-medium text-gray-900 truncate">{rec.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{rec.model}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              可预约
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">{rec.department}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="text-xs px-4 py-2 h-8 bg-blue-600 hover:bg-blue-700 flex-shrink-0 font-medium"
                          onClick={() => {
                            router.push(`/laboratory/equipment/booking?id=${rec.id}&quick=true`);
                            onOpenChange(false);
                          }}
                        >
                          快速预约
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    推荐基于AI功能相似性分析，如需更多选择请联系设备管理员
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
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