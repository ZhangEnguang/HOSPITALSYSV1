"use client"

import { Calendar, Clock, User, AlertCircle, CheckCircle, Eye, Star, ArrowRight, Zap, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    images: ["/equipment/XRD.png"]
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
    images: ["/equipment/danjing.png"]
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
    images: ["/equipment/EPMA.png"]
  }
]

// 模拟配套设备数据
const mockComplementaryEquipment = [
  {
    id: "comp1",
    name: "样品预处理系统",
    model: "SamplePrep Pro 2000",
    category: "预处理设备",
    status: "在用",
    department: "化学实验室",
    location: "A栋实验楼 201",
    purpose: "XPS样品前处理",
    compatibility: "完全兼容",
    benefits: ["提高样品质量", "减少污染", "标准化处理"],
    images: ["/equipment/sample-prep.png"]
  },
  {
    id: "comp2",
    name: "真空干燥箱",
    model: "VacuumDry VD-500",
    category: "辅助设备",
    status: "在用",
    department: "化学实验室",
    location: "A栋实验楼 202",
    purpose: "样品干燥处理",
    compatibility: "高度兼容",
    benefits: ["去除水分", "防止氧化", "保持样品稳定"],
    images: ["/equipment/vacuum-dry.png"]
  },
  {
    id: "comp3",
    name: "离子溅射仪",
    model: "IonSputter IS-300",
    category: "表面处理设备",
    status: "在用",
    department: "物理实验室",
    location: "A栋实验楼 305",
    purpose: "表面清洁和深度剖析",
    compatibility: "完全兼容",
    benefits: ["表面清洁", "深度剖析", "去除污染层"],
    images: ["/equipment/ion-sputter.png"]
  }
]

// 模拟推荐实验方案
const mockExperimentPlans = [
  {
    id: "plan1",
    title: "材料表面与结构综合分析方案",
    description: "结合XPS表面分析和XRD结构分析，全面表征材料性质",
    equipment: ["XPS", "XRD", "样品预处理系统"],
    duration: "1-2天",
    applications: ["催化剂研究", "薄膜材料", "纳米材料"],
    advantages: ["全面表征", "数据互补", "结果可靠"],
    difficulty: "中等"
  },
  {
    id: "plan2",
    title: "微区成分与表面状态分析",
    description: "利用EPMA微区分析和XPS表面分析，研究材料局部特性",
    equipment: ["XPS", "EPMA", "离子溅射仪"],
    duration: "2-3天",
    applications: ["合金材料", "复合材料", "界面研究"],
    advantages: ["微区精确", "表面敏感", "深度信息"],
    difficulty: "较高"
  },
  {
    id: "plan3",
    title: "单晶结构与表面化学分析",
    description: "单晶结构解析结合表面化学状态分析，深入理解材料本质",
    equipment: ["XPS", "单晶衍射仪", "真空干燥箱"],
    duration: "3-5天",
    applications: ["晶体材料", "功能材料", "电子材料"],
    advantages: ["结构明确", "化学清晰", "机理深入"],
    difficulty: "高"
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

  // 获取兼容性颜色
  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case "完全兼容":
        return "bg-green-50 text-green-700 border-green-200"
      case "高度兼容":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "部分兼容":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "简单":
        return "bg-green-50 text-green-700 border-green-200"
      case "中等":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "较高":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "高":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="related" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="related">相关仪器</TabsTrigger>
          <TabsTrigger value="complementary">配套设备</TabsTrigger>
          <TabsTrigger value="experiments">实验方案</TabsTrigger>
        </TabsList>
        
        <TabsContent value="related">
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
        </TabsContent>
        
        <TabsContent value="complementary">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">配套设备推荐</CardTitle>
              <CardDescription>与当前设备配套使用的辅助设备和预处理设备</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockComplementaryEquipment.map((equipment) => (
                  <div key={equipment.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-green-300 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* 设备图片 */}
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
                          <Badge className={getCompatibilityColor(equipment.compatibility)}>
                            <Zap className="h-3 w-3 mr-1" />
                            {equipment.compatibility}
                          </Badge>
                          <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                            {equipment.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{equipment.model}</p>
                        <p className="text-sm text-slate-700 mb-2">用途: {equipment.purpose}</p>
                        
                        <div className="text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-4">
                            <span>位置: {equipment.location}</span>
                            <span>状态: {equipment.status}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>优势:</span>
                            {equipment.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
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
        </TabsContent>
        
        <TabsContent value="experiments">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">推荐实验方案</CardTitle>
              <CardDescription>基于当前设备的综合实验方案推荐</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExperimentPlans.map((plan) => (
                  <div key={plan.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-slate-900 text-lg">{plan.title}</span>
                        <Badge className={getDifficultyColor(plan.difficulty)}>
                          难度: {plan.difficulty}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        预计时间: {plan.duration}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-700 mb-3">{plan.description}</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">所需设备:</span>
                        {plan.equipment.map((eq, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">应用领域:</span>
                        {plan.applications.map((app, index) => (
                          <Badge key={index} className="bg-green-50 text-green-700 border-green-200 text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">方案优势:</span>
                        {plan.advantages.map((advantage, index) => (
                          <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            {advantage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>详细方案</span>
                      </Button>
                      <Button size="sm" className="h-8 gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>预约实验</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 