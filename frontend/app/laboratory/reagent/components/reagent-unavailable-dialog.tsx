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
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertTriangle,
  Phone,
  Mail,
  Sparkles,
  Clock,
  User,
  X,
  Package,
  FlaskConical,
  ShieldAlert,
  Droplets,
  Contact
} from "lucide-react"
import { cn } from "@/lib/utils"
import { allDemoReagentItems } from "../data/reagent-demo-data"
import { statusColors } from "../config/reagent-config"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ReagentUnavailableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reagent: any
  onOpenApplyDialog?: (reagent: any) => void
}

export function ReagentUnavailableDialog({ 
  open, 
  onOpenChange, 
  reagent,
  onOpenApplyDialog
}: ReagentUnavailableDialogProps) {
  const router = useRouter()
  const [recommendedReagents, setRecommendedReagents] = useState<any[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  
  // 获取不可申领原因
  const getUnavailableReason = (reagent: any) => {
    if (!reagent) return null
    
    const today = new Date()
    const expiryDate = new Date(reagent.expiryDate)
    const isExpired = expiryDate < today || reagent.status === "已过期"
    const isOutOfStock = reagent.currentAmount <= 0 || reagent.status === "缺货"
    
    if (isExpired && isOutOfStock) {
      return {
        title: "试剂已过期且无库存",
        description: `该试剂已于 ${format(expiryDate, "yyyy年MM月dd日")} 过期，且当前库存为零，无法申领使用`,
        icon: <X className="h-5 w-5 text-red-500" />,
        suggestion: "建议选择其他同类型试剂或联系管理员采购新试剂",
        severity: "high"
      }
    }
    
    if (isExpired) {
      return {
        title: "试剂已过期",
        description: `该试剂已于 ${format(expiryDate, "yyyy年MM月dd日")} 过期，为确保实验安全和结果准确性，已禁用申领功能`,
        icon: <Clock className="h-5 w-5 text-red-500" />,
        suggestion: "建议选择其他有效期内的同类型试剂",
        severity: "high"
      }
    }
    
    if (isOutOfStock) {
      return {
        title: "试剂库存不足",
        description: "该试剂当前库存为零，无法满足申领需求",
        icon: <Package className="h-5 w-5 text-orange-500" />,
        suggestion: "建议选择其他有库存的同类型试剂或联系管理员补充库存",
        severity: "medium"
      }
    }
    
    return {
      title: "试剂不可申领",
      description: "该试剂当前无法申领使用",
      icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
      suggestion: "请联系管理员了解详情",
      severity: "low"
    }
  }

  // AI推荐相似试剂
  const getRecommendedReagents = (reagent: any) => {
    if (!reagent) return []
    
    // 基于试剂类型、用途和化学性质进行智能推荐
    const allReagents = allDemoReagentItems.filter(item => 
      item.id !== reagent.id && 
      item.currentAmount > 0 && 
      item.status !== "已过期" &&
      new Date(item.expiryDate) > new Date()
    )
    
    // 1. 优先推荐同类别试剂
    const sameCategory = allReagents.filter(item => 
      item.category === reagent.category
    )
    
    // 2. 推荐相似化学性质的试剂（基于分子式相似性）
    const similarChemical = allReagents.filter(item => {
      if (!reagent.linearFormula || !item.linearFormula) return false
      // 简单的化学相似性判断：包含相同元素
      const reagentElements = reagent.linearFormula.match(/[A-Z][a-z]*/g) || []
      const itemElements = item.linearFormula.match(/[A-Z][a-z]*/g) || []
      const commonElements = reagentElements.filter((el: string) => itemElements.includes(el))
      return commonElements.length >= 2 // 至少有2个相同元素
    })
    
    // 3. 推荐同用途试剂（基于描述关键词）
    const similarPurpose = allReagents.filter(item => {
      if (!reagent.description || !item.description) return false
      const reagentKeywords = reagent.description.toLowerCase().split(/[，。、\s]+/)
      const itemKeywords = item.description.toLowerCase().split(/[，。、\s]+/)
      const commonKeywords = reagentKeywords.filter((kw: string) => 
        kw.length > 1 && itemKeywords.some((ikw: string) => ikw.includes(kw) || kw.includes(ikw))
      )
      return commonKeywords.length >= 1
    })
    
    // 合并推荐结果，去重并按优先级排序
    const recommended = [
      ...sameCategory.slice(0, 2),
      ...similarChemical.slice(0, 2),
      ...similarPurpose.slice(0, 1)
    ]
    
    // 去重
    const uniqueRecommended = recommended.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    )
    
    return uniqueRecommended.slice(0, 3)
  }

  const reason = getUnavailableReason(reagent)
  
  // 管理员联系信息
  const managerContact = {
    name: "李试剂管理员",
    phone: "021-87654321",
    email: "reagent@lab.edu.cn",
    avatar: "/avatars/reagent-manager.png",
    department: "试剂管理中心"
  }
  
  useEffect(() => {
    if (open && reagent) {
      setIsLoadingRecommendations(true)
      // 模拟AI推荐延迟
      setTimeout(() => {
        const recommended = getRecommendedReagents(reagent)
        setRecommendedReagents(recommended)
        setIsLoadingRecommendations(false)
      }, 1000)
    }
  }, [open, reagent])
  
  const handleApplyRedirect = (item: any) => {
    onOpenChange(false)
    // 如果提供了申领弹框回调函数，则直接打开申领弹框
    if (onOpenApplyDialog) {
      onOpenApplyDialog(item)
    } else {
      // 否则跳转到申领页面
      router.push(`/laboratory/reagent/apply/${item.id}`)
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
      const link = document.createElement('a')
      link.href = `mailto:${managerContact.email}?subject=试剂申领咨询&body=您好，我在试剂申领过程中遇到问题，请协助处理。`
      link.click()
    }
  }

  if (!reagent || !reason) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[95vw] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {reason.icon}
            <div>
              <DialogTitle className="text-xl">{reason.title}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {reagent.name} 当前不可申领
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 custom-scrollbar">
          {/* 试剂信息卡片 - 融合不可申领原因和管理员联系方式 */}
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
                        <AvatarFallback className="text-xs">李</AvatarFallback>
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
              {/* 试剂基本信息 */}
              <div className="flex items-start gap-4 pr-12">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {reagent.imageUrl ? (
                    <img
                      src={reagent.imageUrl}
                      alt={`${reagent.name} - 图片`}
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
                      <FlaskConical className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{reagent.name}</h3>
                  <p className="text-sm text-muted-foreground">{reagent.englishName}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={(statusColors[reagent.status] || "secondary") as any}>
                      {reagent.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {reagent.specification}
                    </Badge>
                    {reagent.dangerLevel && (
                      <Badge variant={reagent.dangerLevel === "高" ? "destructive" : reagent.dangerLevel === "中" ? "default" : "secondary"}>
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        {reagent.dangerLevel}危险
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{reagent.department}</span>
                    <span>·</span>
                    <span>{reagent.location}</span>
                    <span>·</span>
                    <span>库存: {reagent.currentAmount}{reagent.unit}</span>
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

          {/* AI推荐替代试剂 - 撑满整个宽度 */}
          <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                <h3 className="font-semibold text-blue-900">AI智能推荐试剂</h3>
                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                  智能推荐
                </Badge>
              </div>
              
              <p className="text-sm text-blue-700 mb-4">
                为您推荐化学性质相似的可申领试剂
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
              ) : recommendedReagents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recommendedReagents.map((rec) => (
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
                              <FlaskConical className="h-6 w-6 text-gray-400" />
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
                            <Droplets className="h-3 w-3 mr-1" />
                            {rec.currentAmount}{rec.unit}
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
                  <FlaskConical className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">暂无可推荐的替代试剂</p>
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
              <span className="text-xs sm:text-sm">如有紧急需求，请直接联系试剂管理员</span>
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