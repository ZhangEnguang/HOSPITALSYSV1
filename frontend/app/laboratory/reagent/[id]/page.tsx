"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft, Edit, Printer, File, BarChart2, Clipboard, 
  AlertTriangle, Info, Calendar, User, MapPin, Building, Tag, 
  ChevronRight, ShieldAlert, Download
} from "lucide-react"
import { format } from "date-fns"
import { allDemoReagentItems } from "../data/reagent-demo-data"
import { statusColors } from "../config/reagent-config"

export default function ReagentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [reagent, setReagent] = useState<any>(null)

  // 模拟加载特定试剂数据
  useEffect(() => {
    // 在实际应用中，这里会从API获取数据
    const found = allDemoReagentItems.find((item) => item.id === params.id)
    
    if (found) {
      setReagent(found)
    } else {
      // 如果找不到指定ID的试剂，使用第一个作为演示
      setReagent(allDemoReagentItems[0])
    }
  }, [params.id])

  if (!reagent) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-60">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  // 计算剩余量百分比
  const remainingPercentage = (reagent.currentAmount / reagent.initialAmount) * 100
  
  // 判断是否过期
  const isExpired = new Date(reagent.expiryDate) < new Date()
  
  // 剩余天数
  const daysRemaining = Math.ceil(
    (new Date(reagent.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="container mx-auto py-6">
      {/* 标题和返回按钮 */}
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          className="mr-2"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold flex-1">{reagent.name}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            打印
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/laboratory/reagent/edit/${reagent.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            编辑
          </Button>
        </div>
      </div>

      {/* 英文名称和状态 */}
      <div className="mb-6 flex items-center">
        <p className="text-muted-foreground mr-4">{reagent.englishName}</p>
        <Badge variant={(statusColors[reagent.status] || "secondary") as any}>
          {reagent.status}
        </Badge>
        {isExpired && (
          <Badge variant="destructive" className="ml-2">
            <AlertTriangle className="h-3 w-3 mr-1" />
            已过期
          </Badge>
        )}
        {!isExpired && daysRemaining <= 30 && (
          <Badge variant="warning" className="ml-2">
            <AlertTriangle className="h-3 w-3 mr-1" />
            即将过期 ({daysRemaining}天)
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 基本信息卡片 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">规格</p>
                <p className="font-medium">{reagent.specification}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">试剂类型</p>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1 text-blue-500" />
                  <p className="font-medium">{reagent.category}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">CAS号</p>
                <p className="font-medium">{reagent.casNumber || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">目录号</p>
                <p className="font-medium">{reagent.catalogNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">生产厂商</p>
                <p className="font-medium">{reagent.manufacturer}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">供应商</p>
                <p className="font-medium">{reagent.supplier}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">所属部门</p>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1 text-purple-500" />
                  <p className="font-medium">{reagent.department}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">存放位置</p>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-red-500" />
                  <p className="font-medium">{reagent.location}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">存储条件</p>
                <p className="font-medium">{reagent.storageCondition}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">危险等级</p>
                <div className="flex items-center">
                  {reagent.dangerLevel === "高" ? (
                    <ShieldAlert className="h-4 w-4 mr-1 text-red-500" />
                  ) : reagent.dangerLevel === "中" ? (
                    <ShieldAlert className="h-4 w-4 mr-1 text-amber-500" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 mr-1 text-green-500" />
                  )}
                  <p className="font-medium">{reagent.dangerLevel}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">价格</p>
                <p className="font-medium">￥{reagent.price.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">负责人</p>
                <div className="flex items-center">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={reagent.manager.avatar} />
                    <AvatarFallback>{reagent.manager.name[0]}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{reagent.manager.name}</p>
                </div>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-sm text-muted-foreground">描述</p>
                <p className="font-medium">{reagent.description}</p>
              </div>
              {reagent.notes && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm text-muted-foreground">注意事项</p>
                  <div className="flex items-start rounded-md bg-amber-50 p-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <p className="text-amber-800">{reagent.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 状态卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>库存状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 库存状态 */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">当前库存</p>
                <p className="font-medium">{reagent.currentAmount} / {reagent.initialAmount} {reagent.unit}</p>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div 
                  className={`h-full ${
                    remainingPercentage <= 20 
                      ? "bg-red-500" 
                      : remainingPercentage <= 50 
                        ? "bg-amber-500" 
                        : "bg-green-500"
                  }`}
                  style={{ width: `${remainingPercentage}%` }}
                />
              </div>
            </div>

            {/* 日期信息 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <p className="text-sm">购置日期</p>
                </div>
                <p className="font-medium">{format(new Date(reagent.purchaseDate), "yyyy/MM/dd")}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                  <p className="text-sm">开封日期</p>
                </div>
                <p className="font-medium">{reagent.openDate ? format(new Date(reagent.openDate), "yyyy/MM/dd") : "-"}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-red-500" />
                  <p className="text-sm">有效期至</p>
                </div>
                <p className={`font-medium ${isExpired ? "text-red-500" : ""}`}>
                  {format(new Date(reagent.expiryDate), "yyyy/MM/dd")}
                </p>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="space-y-2 pt-4">
              <h4 className="font-medium text-sm mb-3">快捷操作</h4>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start" onClick={() => router.push(`/laboratory/reagent/usage/${reagent.id}`)}>
                  <Clipboard className="h-4 w-4 mr-2" />
                  使用记录
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => router.push(`/laboratory/reagent/usage/${reagent.id}/new`)}>
                  <Clipboard className="h-4 w-4 mr-2" />
                  记录使用量
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="justify-start">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  消耗统计
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                {reagent.msdsUrl && (
                  <Button variant="outline" className="justify-start" onClick={() => window.open(reagent.msdsUrl, '_blank')}>
                    <Download className="h-4 w-4 mr-2" />
                    下载MSDS
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用记录卡片 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>使用记录</CardTitle>
            <CardDescription>试剂的近期使用和库存记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="usage">
              <TabsList className="mb-4">
                <TabsTrigger value="usage">使用记录</TabsTrigger>
                <TabsTrigger value="inventory">入库记录</TabsTrigger>
                <TabsTrigger value="report">月度报表</TabsTrigger>
              </TabsList>
              
              <TabsContent value="usage">
                <div className="text-center py-10 text-muted-foreground">
                  试剂使用记录将显示在此处
                </div>
              </TabsContent>
              
              <TabsContent value="inventory">
                <div className="text-center py-10 text-muted-foreground">
                  试剂入库记录将显示在此处
                </div>
              </TabsContent>
              
              <TabsContent value="report">
                <div className="text-center py-10 text-muted-foreground">
                  试剂使用统计报表将显示在此处
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 