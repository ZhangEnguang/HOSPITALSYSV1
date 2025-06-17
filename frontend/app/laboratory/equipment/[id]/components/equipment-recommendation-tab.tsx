"use client"

import { Eye, Star, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface EquipmentRecommendationTabProps {
  data: any
}

// 模拟相关仪器推荐数据
const mockRelatedEquipment = [
  {
    id: "eq2",
    name: "普通广角XRD（X射线衍射仪）",
    model: "Rigaku SmartLab SE",
    category: "分析仪器",
    status: "在用",
    department: "材料实验室",
    location: "B栋实验楼 105",
    bookingCount: 205,
    useFrequency: "高",
    similarity: 95,
    reason: "同为X射线分析设备，可进行互补性分析",
    advantages: ["晶体结构分析", "相组成分析", "残余应力测量"],
    images: ["/equipment/xrd-diffractometer.png"]
  },
  {
    id: "eq3",
    name: "单晶（顶级解析专家）",
    model: "Bruker D8 VENTURE",
    category: "分析仪器",
    status: "在用",
    department: "物理实验室",
    location: "A栋实验楼 308",
    bookingCount: 205,
    useFrequency: "中",
    similarity: 88,
    reason: "精密单晶结构解析，与XPS形成完整分析链",
    advantages: ["单晶体结构解析", "精确晶体学研究", "高精度测量"],
    images: ["/equipment/single-crystal-diffractometer.png"]
  },
  {
    id: "eq5",
    name: "电子探针（EPMA）",
    model: "JEOL JXA-8530FPlus",
    category: "分析仪器",
    status: "在用",
    department: "材料实验室",
    location: "D栋实验楼 101",
    bookingCount: 156,
    useFrequency: "高",
    similarity: 82,
    reason: "微区成分分析，与XPS表面分析形成互补",
    advantages: ["化学成分分析", "元素分布成像", "微区分析"],
    images: ["/equipment/epma-analyzer.png"]
  }
]



export default function EquipmentRecommendationTab({ data }: EquipmentRecommendationTabProps) {
  // 获取相似度颜色
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return "bg-green-50 text-green-700 border-green-200"
    if (similarity >= 80) return "bg-blue-50 text-blue-700 border-blue-200"
    if (similarity >= 70) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-slate-50 text-slate-700 border-slate-200"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">相关仪器推荐</CardTitle>
          <CardDescription>基于功能相似性和应用场景推荐的相关仪器</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRelatedEquipment.map((equipment) => (
              <div key={equipment.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-4">
                  {/* 仪器图片 */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {equipment.images && equipment.images[0] ? (
                      <img
                        src={equipment.images[0]}
                        alt={equipment.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                </svg>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">{equipment.name}</span>
                      <Badge className={getSimilarityColor(equipment.similarity)}>
                        <Star className="h-3 w-3 mr-1" />
                        相似度 {equipment.similarity}%
                      </Badge>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        {equipment.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{equipment.model}</p>
                    <p className="text-sm text-slate-700 mb-2">{equipment.reason}</p>
                    
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-4">
                        <span>位置: {equipment.location}</span>
                        <span>使用频率: {equipment.useFrequency}</span>
                        <span>预约次数: {equipment.bookingCount}次</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>优势:</span>
                        {equipment.advantages.map((advantage, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {advantage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>查看</span>
                  </Button>
                  <Button size="sm" className="h-8 gap-1">
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span>预约</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 