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
    <div className="container mx-auto py-8">
      {/* 标题栏 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            className="mr-3"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{reagent.name}</h1>
          </div>
          <div className="flex space-x-3">
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

        {/* 状态标识栏 */}
        <div className="flex items-center gap-3">
          <Badge 
            variant={(statusColors[reagent.status] || "secondary") as any}
            className="px-3 py-1 text-sm font-medium"
          >
            {reagent.status}
          </Badge>
          
          {/* 危险等级标识 */}
          {reagent.dangerLevel && reagent.dangerLevel !== "低" && (
            <Badge 
              variant="outline" 
              className={`px-3 py-1 text-sm font-medium ${
                reagent.dangerLevel === "高" 
                  ? "bg-red-50 text-red-700 border-red-200" 
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              <ShieldAlert className="h-3 w-3 mr-1" />
              {reagent.dangerLevel === "高" ? "高危试剂" : "中危试剂"}
            </Badge>
          )}

          {/* 过期状态 */}
          {isExpired && (
            <Badge variant="destructive" className="px-3 py-1 text-sm font-medium">
              <AlertTriangle className="h-3 w-3 mr-1" />
              已过期
            </Badge>
          )}
          {!isExpired && daysRemaining <= 30 && (
            <Badge variant="outline" className="px-3 py-1 text-sm font-medium bg-yellow-50 text-yellow-700 border-yellow-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              即将过期 ({daysRemaining}天)
            </Badge>
          )}

          {/* 库存状态 */}
          {remainingPercentage <= 20 && (
            <Badge variant="destructive" className="px-3 py-1 text-sm font-medium">
              库存不足
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* 基本信息卡片 */}
        <Card className="lg:col-span-3 border border-gray-100 rounded-lg bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">规格</div>
                <div className="text-sm font-medium text-gray-900">{reagent.specification}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">试剂类型</div>
                <div className="flex items-center">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    {reagent.category}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">CAS号</div>
                <div className="text-sm font-medium text-gray-900">{reagent.casNumber || "-"}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">目录号</div>
                <div className="text-sm font-medium text-gray-900">{reagent.catalogNumber}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">生产厂商</div>
                <div className="text-sm font-medium text-gray-900">{reagent.manufacturer}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">供应商</div>
                <div className="text-sm font-medium text-gray-900">{reagent.supplier}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">所属部门</div>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span>{reagent.department}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">存放位置</div>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{reagent.location}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">存储条件</div>
                <div className="text-sm font-medium text-gray-900">{reagent.storageCondition}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">危险等级</div>
                <div className="flex items-center gap-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      reagent.dangerLevel === "高" 
                        ? "bg-red-50 text-red-700 border-red-200" 
                        : reagent.dangerLevel === "中"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {reagent.dangerLevel}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">价格</div>
                <div className="text-sm font-medium text-gray-900">￥{reagent.price.toLocaleString()}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">负责人</div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reagent.manager.avatar} />
                    <AvatarFallback className="text-xs">{reagent.manager.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-900">{reagent.manager.name}</span>
                </div>
              </div>
            </div>
            
            {/* 描述信息 */}
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">描述</div>
                <p className="text-sm text-gray-700 leading-relaxed">{reagent.description}</p>
              </div>
              
              {reagent.notes && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 font-medium">注意事项</div>
                  <div className="flex items-start rounded-lg bg-amber-50 p-4 border border-amber-200">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-800 leading-relaxed">{reagent.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 状态卡片 */}
        <Card className="border border-gray-100 rounded-lg bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">库存状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 库存状态 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">当前库存</span>
                <span className="font-semibold text-gray-900">
                  {reagent.currentAmount} / {reagent.initialAmount} {reagent.unit}
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      remainingPercentage <= 20 
                        ? "bg-red-500" 
                        : remainingPercentage <= 50 
                          ? "bg-amber-500" 
                          : "bg-green-500"
                    }`}
                    style={{ width: `${remainingPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span className="font-medium">{remainingPercentage.toFixed(1)}%</span>
                  <span>{reagent.initialAmount}{reagent.unit}</span>
                </div>
              </div>
            </div>

            {/* 日期信息 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">购置日期</span>
                </div>
                <span className="font-medium text-gray-900">{format(new Date(reagent.purchaseDate), "yyyy/MM/dd")}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">开封日期</span>
                </div>
                <span className="font-medium text-gray-900">{reagent.openDate ? format(new Date(reagent.openDate), "yyyy/MM/dd") : "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">有效期至</span>
                </div>
                <span className={`font-medium ${isExpired ? "text-red-600" : daysRemaining <= 30 ? "text-yellow-600" : "text-gray-900"}`}>
                  {format(new Date(reagent.expiryDate), "yyyy/MM/dd")}
                </span>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="font-semibold text-sm text-gray-900">快捷操作</h4>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start h-10 text-sm hover:bg-gray-50" 
                  onClick={() => router.push(`/laboratory/reagent/usage/${reagent.id}`)}
                >
                  <Clipboard className="h-4 w-4 mr-2 text-gray-500" />
                  使用记录
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-10 text-sm hover:bg-gray-50" 
                  onClick={() => router.push(`/laboratory/reagent/usage/${reagent.id}/new`)}
                >
                  <Clipboard className="h-4 w-4 mr-2 text-gray-500" />
                  记录使用量
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-10 text-sm hover:bg-gray-50"
                >
                  <BarChart2 className="h-4 w-4 mr-2 text-gray-500" />
                  消耗统计
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </Button>
                {reagent.msdsUrl && (
                  <Button 
                    variant="outline" 
                    className="justify-start h-10 text-sm hover:bg-gray-50" 
                    onClick={() => window.open(reagent.msdsUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2 text-gray-500" />
                    下载MSDS
                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用记录卡片 */}
        <Card className="lg:col-span-4 border border-gray-100 rounded-lg bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">使用记录</CardTitle>
            <CardDescription className="text-gray-600">试剂的近期使用和库存记录</CardDescription>
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