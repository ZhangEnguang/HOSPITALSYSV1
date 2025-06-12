"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  Clock,
  Package,
  User,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react"

// 状态颜色映射
const statusColors = {
  "库存充足": "success",
  "库存不足": "warning", 
  "缺货": "destructive",
  "已过期": "destructive",
  "正常": "success",
  "即将过期": "warning"
}

interface ConsumableUnavailableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  consumable: any
}

export function ConsumableUnavailableDialog({ 
  open, 
  onOpenChange, 
  consumable 
}: ConsumableUnavailableDialogProps) {
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true)
  const [recommendedConsumables, setRecommendedConsumables] = useState<any[]>([])

  // 获取不可申领原因
  const getUnavailableReason = (consumable: any) => {
    if (!consumable) {
      return {
        title: "耗材信息不可用",
        description: "无法获取耗材信息",
        suggestion: "请刷新页面重试或联系管理员",
        severity: "low" as const
      }
    }
    
    const today = new Date()
    const expiryDate = new Date(consumable.expiryDate)
    const isExpired = expiryDate < today || consumable.status === "已过期"
    const isOutOfStock = consumable.currentStock <= 0 || consumable.status === "缺货"
    
    if (isExpired && isOutOfStock) {
      return {
        title: "耗材已过期且无库存",
        description: "该耗材已超过有效期且当前库存为零，无法申领使用",
        suggestion: "建议联系耗材管理员采购新的耗材或寻找替代产品",
        severity: "high" as const
      }
    } else if (isExpired) {
      return {
        title: "耗材已过期",
        description: "该耗材已超过有效期，为保证实验安全和结果准确性，已禁用申领功能",
        suggestion: "建议联系耗材管理员处理过期耗材并采购新品",
        severity: "high" as const
      }
    } else if (isOutOfStock) {
      return {
        title: "库存不足",
        description: "该耗材当前库存为零，无法满足申领需求",
        suggestion: "建议联系耗材管理员及时补充库存或寻找替代产品",
        severity: "medium" as const
      }
    } else {
      return {
        title: "暂时无法申领",
        description: "该耗材当前状态不允许申领",
        suggestion: "请联系耗材管理员了解详细情况",
        severity: "low" as const
      }
    }
  }

  // 获取推荐耗材
  const getRecommendedConsumables = (consumable: any) => {
    if (!consumable) {
      return []
    }
    
    // 模拟耗材数据
    const allConsumables = [
      {
        id: "cons-001",
        name: "移液器吸头",
        englishName: "Pipette Tips",
        category: "移液器配件",
        specification: "200μL蓝色吸头",
        currentStock: 500,
        unit: "个",
        status: "库存充足",
        expiryDate: "2026/06/12",
        description: "高精度移液器吸头，适用于各种移液操作"
      },
      {
        id: "cons-002", 
        name: "微量离心管",
        englishName: "Microcentrifuge Tubes",
        category: "离心管",
        specification: "1.5mL透明管",
        currentStock: 200,
        unit: "个",
        status: "库存充足", 
        expiryDate: "2026/12/31",
        description: "高质量微量离心管，适用于样品储存和离心"
      },
      {
        id: "cons-003",
        name: "96孔PCR板",
        englishName: "96-well PCR Plate", 
        category: "PCR耗材",
        specification: "96孔PCR反应板",
        currentStock: 50,
        unit: "块",
        status: "库存充足",
        expiryDate: "2027/06/12", 
        description: "标准96孔PCR反应板，适用于PCR扩增反应"
      }
    ]

    // AI推荐算法
    return allConsumables
      .filter(item => {
        const today = new Date()
        const itemExpiryDate = new Date(item.expiryDate)
        const isAvailable = item.currentStock > 0 && itemExpiryDate >= today && item.status !== "已过期" && item.status !== "缺货"
        const isDifferent = item.id !== consumable.id
        return isAvailable && isDifferent
      })
      .map(item => ({
        ...item,
        similarity: calculateSimilarity(consumable, item)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
  }

  // 计算相似度
  const calculateSimilarity = (target: any, candidate: any) => {
    if (!target || !candidate) {
      return 0
    }
    
    let score = 0
    
    if (target.category === candidate.category) {
      score += 40
    } else if (target.category && candidate.category && 
               target.category.includes(candidate.category.split('')[0]) || 
               candidate.category.includes(target.category.split('')[0])) {
      score += 20
    }
    
    const targetKeywords = (target.description || '').toLowerCase().split(/[，。、\s]+/)
    const candidateKeywords = (candidate.description || '').toLowerCase().split(/[，。、\s]+/)
    const commonKeywords = targetKeywords.filter((keyword: string) => 
      candidateKeywords.some((ck: string) => ck.includes(keyword) || keyword.includes(ck))
    )
    score += Math.min(30, commonKeywords.length * 10)
    
    if (target.specification && candidate.specification) {
      const targetSpec = target.specification.toLowerCase()
      const candidateSpec = candidate.specification.toLowerCase()
      if (targetSpec.includes(candidateSpec) || candidateSpec.includes(targetSpec)) {
        score += 20
      }
    }
    
    if (candidate.status === "库存充足") {
      score += 10
    } else if (candidate.status === "库存不足") {
      score += 5
    }
    
    return score
  }

  // 管理员联系信息
  const managerContact = {
    name: "王耗材管理员",
    department: "耗材管理中心",
    phone: "010-12345678",
    email: "consumables@hospital.com",
    avatar: "/avatars/manager-wang.jpg"
  }

  const reason = getUnavailableReason(consumable)

  const handleApplyRedirect = (item: any) => {
    window.open(`/laboratory/consumables/apply/${item.id}`, '_blank')
  }

  const handleContactManager = (type: 'phone' | 'email') => {
    if (type === 'phone') {
      window.open(`tel:${managerContact.phone}`)
    } else {
      const consumableName = consumable?.name || '未知耗材'
      window.open(`mailto:${managerContact.email}?subject=耗材申领咨询&body=您好，我需要咨询关于"${consumableName}"的申领事宜。`)
    }
  }

  useEffect(() => {
    if (open && consumable) {
      setIsLoadingRecommendations(true)
      setTimeout(() => {
        const recommendations = getRecommendedConsumables(consumable)
        setRecommendedConsumables(recommendations)
        setIsLoadingRecommendations(false)
      }, 1000)
    }
  }, [open, consumable])

  if (!consumable) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b bg-background">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900 mb-1">
                耗材已过期
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {consumable.name} 当前不可申领
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 min-h-0 custom-scrollbar">
          {/* 耗材信息卡片 */}
          <Card className={cn(
            "border-l-4 mx-6 mt-6",
            reason.severity === "high" ? "border-l-red-400" : 
            reason.severity === "medium" ? "border-l-orange-400" : "border-l-gray-400"
          )}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {consumable.imageUrl ? (
                    <img
                      src={consumable.imageUrl}
                      alt={`${consumable.name} - 图片`}
                      className="w-full h-full object-contain bg-white"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{consumable.name}</h3>
                  <p className="text-sm text-muted-foreground">{consumable.englishName}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={(statusColors[consumable.status as keyof typeof statusColors] || "secondary") as any}>
                      {consumable.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {consumable.specification}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{consumable.department}</span>
                    <span>·</span>
                    <span>{consumable.location}</span>
                    <span>·</span>
                    <span>库存: {consumable.currentStock}{consumable.unit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-6">
            {/* 不可申领原因 */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  不可申领原因
                </h3>
                
                <div className={cn(
                  "p-4 rounded-lg border",
                  reason.severity === "high" ? "bg-red-50 border-red-200" :
                  reason.severity === "medium" ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200"
                )}>
                  <p className={cn(
                    "text-sm font-medium",
                    reason.severity === "high" ? "text-red-800" :
                    reason.severity === "medium" ? "text-orange-800" : "text-gray-800"
                  )}>
                    {reason.description}
                  </p>
                  <p className={cn(
                    "text-xs mt-2",
                    reason.severity === "high" ? "text-red-600" :
                    reason.severity === "medium" ? "text-orange-600" : "text-gray-600"
                  )}>
                    {reason.suggestion}
                  </p>
                </div>
                
                <Separator />
                
                {/* 联系管理员 */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    联系耗材管理员
                  </h4>
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={managerContact.avatar} />
                      <AvatarFallback>王</AvatarFallback>
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

            {/* AI推荐替代耗材 */}
            <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                  <h3 className="font-semibold text-blue-900">AI智能推荐耗材</h3>
                  <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                    基于用途相似性分析
                  </Badge>
                </div>
                
                <p className="text-sm text-blue-700 mb-4">
                  基于耗材类型、用途和规格为您推荐可申领的耗材
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
                ) : recommendedConsumables.length > 0 ? (
                  <div className="space-y-3">
                    {recommendedConsumables.map((rec) => (
                      <div key={rec.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {rec.imageUrl ? (
                            <img
                              src={rec.imageUrl}
                              alt={`${rec.name} - 图片`}
                              className="w-full h-full object-contain bg-white"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{rec.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{rec.englishName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <Package className="h-3 w-3 mr-1" />
                              {rec.currentStock}{rec.unit}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">{rec.category}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="text-xs px-4 py-2 h-8 bg-blue-600 hover:bg-blue-700 flex-shrink-0 font-medium"
                          onClick={() => handleApplyRedirect(rec)}
                        >
                          快速申领
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">暂无可推荐的替代耗材</p>
                    <p className="text-xs text-gray-400 mt-1">请联系管理员了解更多选择</p>
                  </div>
                )}

                {recommendedConsumables.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      推荐基于AI用途相似性分析，如需更多选择请联系耗材管理员
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex-shrink-0 pt-4 border-t bg-background mx-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">如有紧急需求，请直接联系耗材管理员</span>
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