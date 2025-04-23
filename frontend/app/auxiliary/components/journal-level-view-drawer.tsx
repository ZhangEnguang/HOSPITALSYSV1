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

export interface JournalLevelDetailProps {
  id: string
  code: string
  name: string
  paperType: string
  applicableJournalSource: string
  isIndexed: boolean
  status: string
  createdAt: string
  type?: string
  description?: string
}

interface JournalLevelViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  level: JournalLevelDetailProps | null
}

export function JournalLevelViewDrawer({
  isOpen,
  onClose,
  level,
}: JournalLevelViewDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("basic-info")
  const [currentLevel, setCurrentLevel] = useState<JournalLevelDetailProps | null>(null)

  // 控制抽屉显示/隐藏的动画
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // 当level改变时，更新currentLevel
  useEffect(() => {
    if (level) {
      setCurrentLevel(level)
    }
  }, [level])

  // 处理关闭抽屉
  const handleClose = () => {
    setIsVisible(false)
    // 动画结束后再关闭
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!currentLevel) return null

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
          <div className="flex items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-purple-800">查看刊物级别</h2>
              <p className="text-sm text-purple-600">{currentLevel.code} - {currentLevel.name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-white/80">
              <X className="h-5 w-5 text-purple-600" />
              <span className="sr-only">关闭</span>
            </Button>
          </div>

          {/* 抽屉内容区域 - 使用滚动区域 */}
          <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-white to-slate-50">
            <Tabs defaultValue="basic-info" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="w-full mb-6 grid grid-cols-2 gap-2 rounded-lg bg-muted/30 p-1">
                <TabsTrigger 
                  value="basic-info" 
                  className="rounded-md data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  基本信息
                </TabsTrigger>
                <TabsTrigger 
                  value="journal-source" 
                  className="rounded-md data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  期刊源信息
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic-info" className="mt-0 space-y-4">
                <Card className="p-6 border border-purple-100 bg-purple-50/30 shadow-sm">
                  <h3 className="text-lg font-medium text-purple-800 mb-4">基本信息</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <InfoField label="级别编号" value={currentLevel.code} />
                    <InfoField label="级别名称" value={currentLevel.name} />
                    <InfoField 
                      label="状态" 
                      value={currentLevel.status} 
                      isStatus 
                    />
                    <InfoField label="创建时间" value={currentLevel.createdAt} />
                    <InfoField 
                      label="描述" 
                      value={currentLevel.description} 
                      className="col-span-2"
                    />
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="journal-source" className="mt-0 space-y-4">
                <Card className="p-6 border border-indigo-100 bg-indigo-50/30 shadow-sm">
                  <h3 className="text-lg font-medium text-indigo-800 mb-4">期刊源信息</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <InfoField label="论文类型" value={currentLevel.paperType} />
                    <InfoField label="适用期刊源" value={currentLevel.applicableJournalSource} />
                    <InfoField 
                      label="是否为收录" 
                      value={currentLevel.isIndexed ? "是" : "否"} 
                      customBadge={
                        currentLevel.isIndexed ? 
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">是</Badge> : 
                          <Badge variant="outline" className="text-slate-500 border-slate-300">否</Badge>
                      }
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