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
  Contact,
  X,
  ShieldAlert
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  onOpenApplyDialog?: (consumable: any) => void
}

export function ConsumableUnavailableDialog({ 
  open, 
  onOpenChange, 
  consumable,
  onOpenApplyDialog
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
        severity: "low" as const,
        icon: <AlertTriangle className="h-5 w-5 text-gray-500" />
      }
    }
    
    const today = new Date()
    const expiryDate = new Date(consumable.expiryDate)
    const isExpired = expiryDate < today || consumable.status === "已过期"
    const isOutOfStock = consumable.currentStock <= 0 || consumable.status === "缺货"
    
    if (isExpired && isOutOfStock) {
      return {
        title: "耗材已过期且无库存",
        description: `该耗材已于 ${format(expiryDate, "yyyy年MM月dd日")} 过期，且当前库存为零，无法申领使用`,
        suggestion: "建议联系耗材管理员采购新的耗材或寻找替代产品",
        severity: "high" as const,
        icon: <X className="h-5 w-5 text-red-500" />
      }
    } else if (isExpired) {
      return {
        title: "耗材已过期",
        description: `该耗材已于 ${format(expiryDate, "yyyy年MM月dd日")} 过期，为保证实验安全和结果准确性，已禁用申领功能`,
        suggestion: "建议联系耗材管理员处理过期耗材并采购新品",
        severity: "high" as const,
        icon: <Clock className="h-5 w-5 text-red-500" />
      }
    } else if (isOutOfStock) {
      return {
        title: "库存不足",
        description: "该耗材当前库存为零，无法满足申领需求",
        suggestion: "建议联系耗材管理员及时补充库存或寻找替代产品",
        severity: "medium" as const,
        icon: <Package className="h-5 w-5 text-orange-500" />
      }
    } else {
      return {
        title: "暂时无法申领",
        description: "该耗材当前状态不允许申领",
        suggestion: "请联系耗材管理员了解详细情况",
        severity: "low" as const,
        icon: <AlertTriangle className="h-5 w-5 text-gray-500" />
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
        description: "高精度移液器吸头，适用于各种移液操作",
        imageUrl: "/consumables/pipette-tips.png"
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
        description: "高质量微量离心管，适用于样品储存和离心",
        imageUrl: "/consumables/microcentrifuge-tube.png"
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
        description: "标准96孔PCR反应板，适用于PCR扩增反应",
        imageUrl: "/consumables/pcr-plate-96.png"
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
    onOpenChange(false)
    // 如果提供了申领弹框回调函数，则直接打开申领弹框
    if (onOpenApplyDialog) {
      onOpenApplyDialog(item)
    } else {
      // 否则跳转到申领页面
      window.open(`/laboratory/consumables/apply/${item.id}`, '_blank')
    }
  }

  const handleContactManager = (type: 'phone' | 'email') => {
    console.log('联系管理员:', type, managerContact)
    if (type === 'phone') {
      // 复制电话号码到剪贴板
      navigator.clipboard?.writeText(managerContact.phone).then(() => {
        alert(`电话号码已复制: ${managerContact.phone}`)
      }).catch(() => {
        // 尝试打开电话应用
        const link = document.createElement('a')
        link.href = `tel:${managerContact.phone}`
        link.click()
      })
    } else {
      // 打开邮件客户端
      const consumableName = consumable?.name || '未知耗材'
      const link = document.createElement('a')
      link.href = `mailto:${managerContact.email}?subject=耗材申领咨询&body=您好，我需要咨询关于"${consumableName}"的申领事宜。`
      link.click()
    }
  }

  useEffect(() => {
    if (open && consumable) {
      console.log('耗材不可申领弹框数据:', consumable)
      setIsLoadingRecommendations(true)
      setTimeout(() => {
        const recommendations = getRecommendedConsumables(consumable)
        setRecommendedConsumables(recommendations)
        setIsLoadingRecommendations(false)
      }, 1000)
    }
  }, [open, consumable])

  if (!consumable || !reason) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[95vw] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {reason.icon}
            <div>
              <DialogTitle className="text-xl">{reason.title}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {consumable.name} 当前不可申领
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 custom-scrollbar">
          {/* 耗材信息卡片 - 融合不可申领原因和管理员联系方式 */}
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
                        <AvatarFallback className="text-xs">王</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-xs">{managerContact.name}</p>
                        <p className="text-xs text-muted-foreground">{managerContact.department}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button 
                        className="w-full text-xs h-7 px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleContactManager('phone');
                        }}
                      >
                        <Phone className="h-3 w-3" />
                        {managerContact.phone}
                      </button>
                      <button 
                        className="w-full text-xs h-7 px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleContactManager('email');
                        }}
                      >
                        <Mail className="h-3 w-3" />
                        邮件联系
                      </button>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <CardContent className="pt-4 space-y-4">
              {/* 耗材基本信息 */}
              <div className="flex items-start gap-4 pr-12">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {consumable.imageUrl ? (
                    <img
                      src={consumable.imageUrl}
                      alt={`${consumable.name} - 图片`}
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
                    {consumable.riskLevel && (
                      <Badge variant={consumable.riskLevel === "高" ? "destructive" : consumable.riskLevel === "中" ? "default" : "secondary"}>
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        {consumable.riskLevel}风险
                      </Badge>
                    )}
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

              <Separator />

              {/* 不可申领原因 */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  不可申领原因
                </h4>
                <div className="space-y-2">
                  <p className={cn(
                    "text-sm font-medium",
                    reason.severity === "high" ? "text-red-800" :
                    reason.severity === "medium" ? "text-orange-800" : "text-gray-800"
                  )}>
                    {reason.description}
                  </p>
                  <p className={cn(
                    "text-xs",
                    reason.severity === "high" ? "text-red-600" :
                    reason.severity === "medium" ? "text-orange-600" : "text-gray-600"
                  )}>
                    {reason.suggestion}
                  </p>
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
                  智能推荐
                </Badge>
              </div>
              
              <p className="text-sm text-blue-700 mb-4">
                为您推荐用途相似的可申领耗材
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
              ) : recommendedConsumables.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recommendedConsumables.map((rec) => (
                    <div key={rec.id} className="flex flex-col p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all h-full">
                      <div className="flex items-start gap-3 mb-3 flex-1">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {rec.imageUrl ? (
                            <img
                              src={rec.imageUrl}
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
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{rec.name}</h4>
                          <p className="text-xs text-muted-foreground truncate mt-1">{rec.englishName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 flex-shrink-0">
                            <Package className="h-3 w-3 mr-1" />
                            {rec.currentStock}{rec.unit}
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate">{rec.category}</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="text-xs px-3 py-1 h-7 bg-blue-600 hover:bg-blue-700 flex-shrink-0 font-medium ml-2"
                          onClick={() => handleApplyRedirect(rec)}
                        >
                          快速申领
                        </Button>
                      </div>
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
            </CardContent>
          </Card>
        </div>

        <div className="flex-shrink-0 pt-4 border-t bg-background">
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