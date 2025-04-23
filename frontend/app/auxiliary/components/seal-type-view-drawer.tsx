"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export interface SealType {
  id: string
  businessCategory: string
  businessType: string
  sealType: string
  status: string
  createdAt: string
  type: string
  description?: string
  name: string
}

interface SealTypeViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  sealType: SealType | null
}

export function SealTypeViewDrawer({
  isOpen,
  onClose,
  sealType,
}: SealTypeViewDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("basic-info")
  const [currentSealType, setCurrentSealType] = useState<SealType | null>(null)

  // 控制抽屉显示/隐藏的动画
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // 当sealType改变时，更新currentSealType
  useEffect(() => {
    if (sealType) {
      setCurrentSealType(sealType)
    }
  }, [sealType])

  // 处理关闭抽屉
  const handleClose = () => {
    setIsVisible(false)
    // 动画结束后再关闭
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!currentSealType) return null

  return (
    <>
      {/* 抽屉内容 - 非模态，去掉遮罩层 */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-auto min-w-[600px] max-w-[800px] bg-gradient-to-br from-white to-slate-50 shadow-xl overflow-hidden transition-transform duration-300 ease-in-out border-l border-slate-200",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* 抽屉头部 */}
          <div className="flex items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-teal-50 to-cyan-100">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-teal-800">查看用章类型</h2>
              <p className="text-sm text-teal-600">{currentSealType.sealType} - {currentSealType.name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-white/80">
              <X className="h-5 w-5 text-teal-600" />
              <span className="sr-only">关闭</span>
            </Button>
          </div>

          {/* 抽屉内容区域 - 使用滚动区域 */}
          <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-white to-slate-50">
            <Tabs defaultValue="basic-info" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="w-full mb-6 grid grid-cols-2 gap-2 rounded-lg bg-muted/30 p-1">
                <TabsTrigger 
                  value="basic-info" 
                  className="rounded-md data-[state=active]:bg-teal-50 data-[state=active]:text-teal-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  基本信息
                </TabsTrigger>
                <TabsTrigger 
                  value="detail-info" 
                  className="rounded-md data-[state=active]:bg-teal-50 data-[state=active]:text-teal-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  详细信息
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic-info" className="mt-0 space-y-4">
                <Card className="p-6 border border-teal-100 bg-teal-50/30 shadow-sm">
                  <h3 className="text-lg font-medium text-teal-800 mb-4">基本信息</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <InfoField label="用章类型" value={currentSealType.sealType} />
                    <InfoField label="名称" value={currentSealType.name} />
                    <InfoField 
                      label="状态" 
                      value={currentSealType.status} 
                      isStatus 
                    />
                    <InfoField label="创建时间" value={currentSealType.createdAt} />
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="detail-info" className="mt-0 space-y-4">
                <Card className="p-6 border border-cyan-100 bg-cyan-50/30 shadow-sm">
                  <h3 className="text-lg font-medium text-cyan-800 mb-4">详细信息</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <InfoField label="用章业务分类" value={currentSealType.businessCategory} />
                    <InfoField label="用章业务类型" value={currentSealType.businessType} />
                    <InfoField 
                      label="描述" 
                      value={currentSealType.description} 
                      className="col-span-2"
                    />
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

// 信息字段组件
function InfoField({ 
  label, 
  value, 
  isStatus = false,
  customBadge,
  className
}: { 
  label: string; 
  value?: string | null; 
  isStatus?: boolean;
  customBadge?: React.ReactNode;
  className?: string;
}) {
  if (!value) return null;
  
  return (
    <div className={cn("space-y-2 bg-white/60 p-3 rounded-md shadow-sm border border-slate-100", className)}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {isStatus ? (
        <Badge variant={value === "启用" ? "outline" : "secondary"} className="mt-1 px-3 py-1 text-sm font-medium">
          {value === "启用" ? 
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
              {value}
            </span> : 
            <span className="flex items-center gap-1 text-slate-500">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full"></span>
              {value}
            </span>
          }
        </Badge>
      ) : customBadge ? (
        customBadge
      ) : (
        <p className="font-medium text-base text-slate-800">{value}</p>
      )}
    </div>
  );
} 