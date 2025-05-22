"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Pencil, Clock, Calendar, Tag, Building, MapPin, DollarSign, Wrench, User } from "lucide-react"
import Link from "next/link"
import { allDemoEquipmentItems } from "../data/equipment-demo-data"
import { Badge } from "@/components/ui/badge"
import { statusColors } from "../config/equipment-config"
import { format } from "date-fns"

export default function EquipmentDetailsPage({ params }: { params: { id: string } }) {
  // 从演示数据中获取仪器信息
  const equipment = allDemoEquipmentItems.find((item) => item.id === params.id)

  if (!equipment) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold">未找到仪器</h1>
        <p className="text-muted-foreground mt-2">找不到ID为 {params.id} 的仪器信息</p>
        <Link href="/laboratory/equipment">
          <Button className="mt-4">返回仪器列表</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/laboratory/equipment">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">{equipment.name}</h1>
          <Badge variant={(statusColors[equipment.status] || "secondary") as any} className="ml-2">
            {equipment.status}
          </Badge>
        </div>
        <Link href={`/laboratory/equipment/edit/${equipment.id}`}>
          <Button variant="outline" className="gap-2">
            <Pencil className="h-4 w-4" />
            编辑
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>仪器信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">型号</p>
                <p className="font-medium">{equipment.model}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">序列号</p>
                <p className="font-medium">{equipment.serialNumber}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">仪器类型</p>
                </div>
                <p className="font-medium">{equipment.category}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">所属部门</p>
                </div>
                <p className="font-medium">{equipment.department}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">存放位置</p>
                </div>
                <p className="font-medium">{equipment.location}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">购置日期</p>
                </div>
                <p className="font-medium">{format(new Date(equipment.purchaseDate), "yyyy/MM/dd")}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">保修到期</p>
                </div>
                <p className="font-medium">
                  {format(new Date(equipment.warrantyExpiry), "yyyy/MM/dd")}
                  {new Date(equipment.warrantyExpiry) < new Date() && (
                    <Badge variant="destructive" className="ml-2">已过期</Badge>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">价格</p>
                </div>
                <p className="font-medium">￥{equipment.price.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">维护状态</p>
                </div>
                <Badge variant={(statusColors[equipment.maintenanceStatus] || "secondary") as any}>
                  {equipment.maintenanceStatus}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">负责人</p>
                </div>
                <p className="font-medium">{equipment.manager.name}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">描述</p>
              <p>{equipment.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>规格参数</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipment.specifications && (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">电源要求</p>
                  <p className="font-medium">{equipment.specifications.powerSupply}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">尺寸</p>
                  <p className="font-medium">{equipment.specifications.dimensions}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">重量</p>
                  <p className="font-medium">{equipment.specifications.weight}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">工作温度</p>
                  <p className="font-medium">{equipment.specifications.operatingTemperature}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">湿度要求</p>
                  <p className="font-medium">{equipment.specifications.humidity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">特殊要求</p>
                  <p className="font-medium">{equipment.specifications.specialRequirements}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="maintenance">
        <TabsList className="mb-4">
          <TabsTrigger value="maintenance">维护记录</TabsTrigger>
          <TabsTrigger value="usage">使用记录</TabsTrigger>
          <TabsTrigger value="reservation">预约情况</TabsTrigger>
        </TabsList>
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">维护记录将在此处实现</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">使用记录将在此处实现</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reservation" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">预约情况将在此处实现</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 