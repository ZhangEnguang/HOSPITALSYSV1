"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export interface ReviewWorksheetDetailProps {
  id: string
  name: string
  code: string
  projectType: string
  description?: string
  status: string
  createdAt: string
  type?: string
  reviewStandards?: Array<{
    id: string;
    name: string;
    score: number;
    weight: number;
    criteria: string;
    category: string;
  }>;
}

interface ReviewWorksheetViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  worksheet: ReviewWorksheetDetailProps | null
}

export function ReviewWorksheetViewDrawer({
  isOpen,
  onClose,
  worksheet,
}: ReviewWorksheetViewDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("basic-info")

  // 控制抽屉显示/隐藏的动画
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // 处理关闭抽屉
  const handleClose = () => {
    setIsVisible(false)
    // 动画结束后再关闭
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!worksheet) return null

  // 模拟评审标准数据，实际应从方案对象中获取
  const reviewStandards = worksheet.reviewStandards || [
    { id: "1", name: "科学性", score: 20, weight: 0.2, criteria: "评估项目的科学依据与理论基础", category: "技术指标" },
    { id: "2", name: "创新性", score: 20, weight: 0.2, criteria: "评估项目的创新点与突破性", category: "技术指标" },
    { id: "3", name: "可行性", score: 15, weight: 0.15, criteria: "评估项目实施的可行性", category: "技术指标" },
    { id: "4", name: "研究方案", score: 15, weight: 0.15, criteria: "评估研究方案的合理性和完整性", category: "技术指标" },
    { id: "5", name: "团队能力", score: 10, weight: 0.1, criteria: "评估项目团队的研究能力和基础", category: "团队指标" },
    { id: "6", name: "资源条件", score: 5, weight: 0.05, criteria: "评估项目实施的资源与条件", category: "团队指标" },
    { id: "7", name: "预期成果", score: 10, weight: 0.1, criteria: "评估项目预期成果的价值", category: "成果指标" },
    { id: "8", name: "经济效益", score: 5, weight: 0.05, criteria: "评估项目的经济效益", category: "成果指标" }
  ];

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
              <h2 className="text-xl font-semibold text-purple-800">查看评审方案</h2>
              <p className="text-sm text-purple-600">{worksheet.code} - {worksheet.name}</p>
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
                  value="review-standards" 
                  className="rounded-md data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  评审标准信息
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic-info" className="mt-0 space-y-4">
                <Card className="p-6 border border-purple-100 bg-purple-50/30 shadow-sm">
                  <h3 className="text-lg font-medium text-purple-800 mb-4">基本信息</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <InfoField label="评审表名称" value={worksheet.name} />
                    <InfoField label="编码" value={worksheet.code} />
                    <InfoField label="适用项目类型" value={worksheet.projectType} />
                    <InfoField 
                      label="状态" 
                      value={worksheet.status} 
                      isStatus 
                    />
                    <InfoField label="创建时间" value={worksheet.createdAt} />
                    <InfoField 
                      label="描述" 
                      value={worksheet.description} 
                      className="col-span-2"
                    />
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="review-standards" className="mt-0 space-y-4">
                <Card className="p-6 border border-indigo-100 bg-indigo-50/30 shadow-sm">
                  <h3 className="text-lg font-medium text-indigo-800 mb-4">评审标准信息</h3>
                  <div className="space-y-6">
                    {/* 技术指标 */}
                    <div>
                      <h4 className="text-base font-medium text-indigo-700 mb-3 pb-2 border-b border-indigo-100">技术指标</h4>
                      <div className="space-y-4">
                        {reviewStandards
                          .filter(item => item.category === "技术指标")
                          .map(item => (
                            <ReviewStandardItem 
                              key={item.id}
                              name={item.name}
                              score={item.score}
                              weight={item.weight}
                              criteria={item.criteria}
                            />
                          ))
                        }
                      </div>
                    </div>
                    
                    {/* 团队指标 */}
                    <div>
                      <h4 className="text-base font-medium text-indigo-700 mb-3 pb-2 border-b border-indigo-100">团队指标</h4>
                      <div className="space-y-4">
                        {reviewStandards
                          .filter(item => item.category === "团队指标")
                          .map(item => (
                            <ReviewStandardItem 
                              key={item.id}
                              name={item.name}
                              score={item.score}
                              weight={item.weight}
                              criteria={item.criteria}
                            />
                          ))
                        }
                      </div>
                    </div>
                    
                    {/* 成果指标 */}
                    <div>
                      <h4 className="text-base font-medium text-indigo-700 mb-3 pb-2 border-b border-indigo-100">成果指标</h4>
                      <div className="space-y-4">
                        {reviewStandards
                          .filter(item => item.category === "成果指标")
                          .map(item => (
                            <ReviewStandardItem 
                              key={item.id}
                              name={item.name}
                              score={item.score}
                              weight={item.weight}
                              criteria={item.criteria}
                            />
                          ))
                        }
                      </div>
                    </div>
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
  className
}: { 
  label: string; 
  value?: string | null; 
  isStatus?: boolean;
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
      ) : (
        <p className="font-medium text-base text-slate-800">{value}</p>
      )}
    </div>
  );
}

// 评审标准项组件
function ReviewStandardItem({
  name,
  score,
  weight,
  criteria
}: {
  name: string;
  score: number;
  weight: number;
  criteria: string;
}) {
  return (
    <div className="bg-white/70 p-4 rounded-md shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-medium text-indigo-700">{name}</h5>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
            {score}分
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            权重 {weight * 100}%
          </Badge>
        </div>
      </div>
      <p className="text-sm text-slate-600">{criteria}</p>
    </div>
  );
} 