"use client"

import { useState } from "react"
import { Star, TestTube, Eye, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface ConsumableRecommendationTabProps {
  data: any
}

// 模拟相关耗材推荐数据
const mockRelatedConsumables = [
  {
    id: "1",
    name: "微量离心管盖",
    category: "塑料器皿",
    specification: "1.5mL离心管配套盖",
    currentStock: 500,
    unit: "包",
    status: "充足",
    price: 15.0,
    supplier: "艾本德",
    similarity: 95,
    reason: "与当前耗材配套使用",
    imageUrl: "/consumables/microcentrifuge-tube-caps.png",
  },
  {
    id: "2",
    name: "移液器吸头盒",
    category: "移液器材",
    specification: "200μL吸头收纳盒",
    currentStock: 0,
    unit: "个",
    status: "缺货",
    price: 25.0,
    supplier: "艾本德",
    similarity: 85,
    reason: "同类耗材，经常配套采购",
    imageUrl: "/consumables/pipette-tip-box.png",
  },
  {
    id: "3",
    name: "微孔板封膜",
    category: "培养耗材",
    specification: "透明PCR封膜",
    currentStock: 200,
    unit: "卷",
    status: "充足",
    price: 18.5,
    supplier: "赛默飞",
    similarity: 80,
    reason: "实验流程中常用配套耗材",
    imageUrl: "/consumables/pcr-sealing-film.png",
  },
]

export default function ConsumableRecommendationTab({ data }: ConsumableRecommendationTabProps) {
  // 处理查看详情
  const handleViewDetails = (consumable: any) => {
    window.open(`/laboratory/consumables/${consumable.id}`, "_self")
  }

  // 处理申领
  const handleApplyConsumable = (consumable: any) => {
    // 检查是否可以申领
    if (consumable.status === "缺货" || consumable.currentStock <= 0) {
      toast({
        title: "无法申领",
        description: "该耗材当前缺货或库存不足",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // 跳转到申领页面
    window.open(`/laboratory/consumables/apply/${consumable.id}`, "_self")
  }

  return (
    <div className="space-y-6">
      <Card className="border border-gray-100 rounded-md bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">相关耗材推荐</CardTitle>
          <CardDescription className="text-gray-600">
            基于耗材类型、用途和使用特性的智能推荐
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRelatedConsumables.map((consumable) => (
              <Card key={consumable.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-4">
                  {/* 耗材图片和基本信息 */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                      {consumable.imageUrl ? (
                        <img 
                          src={consumable.imageUrl} 
                          alt={consumable.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <TestTube className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{consumable.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{consumable.category}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="text-sm font-medium">{consumable.similarity}%</span>
                    </div>
                  </div>

                  {/* 规格和状态 */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">规格:</span>
                      <span className="font-medium">{consumable.specification}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">库存:</span>
                      <span className="font-medium">{consumable.currentStock}{consumable.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">价格:</span>
                      <span className="font-medium">￥{consumable.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* 推荐理由 */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      {consumable.reason}
                    </p>
                  </div>

                  {/* 状态和操作按钮 */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge className={
                      consumable.status === "充足" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : consumable.status === "低库存"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }>
                      {consumable.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1"
                        onClick={() => handleViewDetails(consumable)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>查看</span>
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-8 gap-1"
                        onClick={() => handleApplyConsumable(consumable)}
                        disabled={consumable.status === "缺货" || consumable.currentStock <= 0}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>申领</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 