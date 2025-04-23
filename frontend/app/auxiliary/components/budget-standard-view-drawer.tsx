"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export interface BudgetStandardDetailProps {
  id: string
  name: string
  code: string
  projectType: string
  limitAmount?: number
  description?: string
  status: string
  createdAt: string
  type?: string
  budgetItems?: Array<{
    id: string;
    name: string;
    code: string;
    category?: string;
    limitAmount?: number | string;
    limitPercent?: number | string;
    description?: string;
    isRequired?: boolean;
    adjustmentLimit?: string;
  }>;
}

interface BudgetStandardViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  standard: BudgetStandardDetailProps | null
}

export function BudgetStandardViewDrawer({
  isOpen,
  onClose,
  standard,
}: BudgetStandardViewDrawerProps) {
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

  if (!standard) return null

  // 使用标准对象中的真实预算科目数据
  const budgetItems = standard.budgetItems || [];
  
  // 分类预算科目项
  const directCostItems = budgetItems.filter(item => item.category === "直接费用");
  const indirectCostItems = budgetItems.filter(item => item.category === "间接费用");
  const otherCostItems = budgetItems.filter(item => item.category === "其他费用" || !item.category);

  return (
    <>
      {/* 添加遮罩层，点击时关闭抽屉 */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-30 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      />
      
      {/* 抽屉内容 */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-auto min-w-[600px] max-w-[800px] bg-gradient-to-br from-white to-slate-50 shadow-xl overflow-hidden transition-transform duration-300 ease-in-out border-l border-slate-200",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* 抽屉头部 */}
          <div className="flex items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-green-50 to-green-100">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-green-800">查看预算标准</h2>
              <p className="text-sm text-green-600">{standard.code} - {standard.name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-white/80">
              <X className="h-5 w-5 text-green-600" />
              <span className="sr-only">关闭</span>
            </Button>
          </div>

          {/* 抽屉内容区域 - 使用滚动区域 */}
          <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-white to-slate-50">
            <Tabs defaultValue="basic-info" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="w-full mb-6 grid grid-cols-2 gap-2 rounded-lg bg-muted/30 p-1">
                <TabsTrigger 
                  value="basic-info" 
                  className="rounded-md data-[state=active]:bg-green-50 data-[state=active]:text-green-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  基本信息
                </TabsTrigger>
                <TabsTrigger 
                  value="budget-items" 
                  className="rounded-md data-[state=active]:bg-green-50 data-[state=active]:text-green-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  预算科目信息
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic-info" className="mt-0 space-y-4">
                <Card className="p-6 border border-green-100 bg-green-50/30 shadow-sm">
                  <h3 className="text-lg font-medium text-green-800 mb-4">基本信息</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <InfoField label="标准名称" value={standard.name} />
                    <InfoField label="编码" value={standard.code} />
                    <InfoField label="适用项目类型" value={standard.projectType} />
                    <InfoField label="限额" value={standard.limitAmount ? `¥${standard.limitAmount.toLocaleString()}` : "无限额"} />
                    <InfoField 
                      label="状态" 
                      value={standard.status} 
                      isStatus 
                    />
                    <InfoField 
                      label="创建时间" 
                      value={formatCreatedAt(standard.createdAt)} 
                    />
                    <InfoField 
                      label="描述" 
                      value={standard.description} 
                      className="col-span-2"
                    />
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="budget-items" className="mt-0 space-y-4">
                <Card className="p-6 border border-teal-100 bg-teal-50/30 shadow-sm">
                  <h3 className="text-lg font-medium text-teal-800 mb-4">预算科目信息</h3>
                  <div className="space-y-6">
                    {/* 直接费用 */}
                    {directCostItems.length > 0 && (
                      <div>
                        <h4 className="text-base font-medium text-teal-700 mb-3 pb-2 border-b border-teal-100">直接费用</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                          {directCostItems.map(item => (
                            <InfoField 
                              key={item.id}
                              label={`${item.name} (${item.code})`}
                              value={item.limitAmount ? `最高限额: ¥${Number(item.limitAmount).toLocaleString()}` : 
                                     item.limitPercent ? `最高比例: ${item.limitPercent}%` : "无限制"}
                              description={item.description}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 间接费用 */}
                    {indirectCostItems.length > 0 && (
                      <div>
                        <h4 className="text-base font-medium text-teal-700 mb-3 pb-2 border-b border-teal-100">间接费用</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                          {indirectCostItems.map(item => (
                            <InfoField 
                              key={item.id}
                              label={`${item.name} (${item.code})`}
                              value={item.limitAmount ? `最高限额: ¥${Number(item.limitAmount).toLocaleString()}` : 
                                     item.limitPercent ? `最高比例: ${item.limitPercent}%` : "无限制"}
                              description={item.description}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 其他费用 */}
                    {otherCostItems.length > 0 && (
                      <div>
                        <h4 className="text-base font-medium text-teal-700 mb-3 pb-2 border-b border-teal-100">其他费用</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                          {otherCostItems.map(item => (
                            <InfoField 
                              key={item.id}
                              label={`${item.name} (${item.code})`}
                              value={item.limitAmount ? `最高限额: ¥${Number(item.limitAmount).toLocaleString()}` : 
                                     item.limitPercent ? `最高比例: ${item.limitPercent}%` : "无限制"}
                              description={item.description}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {budgetItems.length === 0 && (
                      <div className="py-4 text-center text-muted-foreground">
                        未设置预算科目信息
                      </div>
                    )}
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
  description,
  className
}: { 
  label: string; 
  value?: string | null; 
  isStatus?: boolean;
  description?: string;
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
      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );
}

// 格式化日期函数
function formatCreatedAt(dateString?: string): string {
  if (!dateString) return "--";
  try {
    // 如果是正常的日期格式字符串，直接返回
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString.split('T')[0]; // 去掉时间部分
    }
    return dateString;
  } catch (error) {
    return dateString || "--";
  }
} 