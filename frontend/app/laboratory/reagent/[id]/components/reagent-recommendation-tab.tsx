"use client"

import { useState } from "react"
import { Star, Beaker, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ReagentRecommendationTabProps {
  data: any
}

// 模拟相关试剂推荐数据
const mockRelatedReagents = [
  {
    id: "1",
    name: "甲醇",
    englishName: "Methanol",
    category: "有机溶剂",
    specification: "HPLC级, 4L",
    currentAmount: 2800,
    unit: "mL",
    status: "正常",
    price: 850,
    supplier: "赛默飞世尔",
    similarity: 95,
    reason: "同为HPLC级有机溶剂，常用于色谱分析",
    imageUrl: "/reagent/CH3OH.png",
  },
  {
    id: "2",
    name: "乙醇",
    englishName: "Ethanol",
    category: "有机溶剂",
    specification: "Pure 200级, 2.5L",
    currentAmount: 1800,
    unit: "mL",
    status: "正常",
    price: 420,
    supplier: "默克中国",
    similarity: 88,
    reason: "极性相近的质子溶剂，可作为替代溶剂",
    imageUrl: "/reagent/C2H5OH.png",
  },
  {
    id: "3",
    name: "2-丙醇",
    englishName: "2-Propanol",
    category: "有机溶剂",
    specification: "分析级, 2.5L",
    currentAmount: 1950,
    unit: "mL",
    status: "正常",
    price: 320,
    supplier: "费舍尔科学",
    similarity: 82,
    reason: "中等极性溶剂，适用于萃取和清洗",
    imageUrl: "/reagent/C3H8O.png",
  },
]

export default function ReagentRecommendationTab({ data }: ReagentRecommendationTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border border-gray-100 rounded-md bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">相关试剂推荐</CardTitle>
          <CardDescription className="text-gray-600">
            基于试剂类型、用途和化学性质的智能推荐
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRelatedReagents.map((reagent) => (
              <Card key={reagent.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-4">
                  {/* 试剂图片和基本信息 */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                      {reagent.imageUrl ? (
                        <img 
                          src={reagent.imageUrl} 
                          alt={reagent.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <Beaker className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{reagent.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{reagent.englishName}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="text-sm font-medium">{reagent.similarity}%</span>
                    </div>
                  </div>

                  {/* 规格和状态 */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">规格:</span>
                      <span className="font-medium">{reagent.specification}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">库存:</span>
                      <span className="font-medium">{reagent.currentAmount}{reagent.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">价格:</span>
                      <span className="font-medium">￥{reagent.price}</span>
                    </div>
                  </div>

                  {/* 推荐理由 */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      {reagent.reason}
                    </p>
                  </div>

                  {/* 状态和操作 */}
                  <div className="flex items-center justify-between">
                    <Badge className={
                      reagent.status === "正常" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }>
                      {reagent.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      查看详情
                    </Button>
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