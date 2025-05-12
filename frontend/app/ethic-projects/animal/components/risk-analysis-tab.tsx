"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Shield,
  Activity,
  FileCheck,
  Landmark,
  CircleAlert,
  Rat,
  Brain,
  Syringe,
  HeartPulse,
  RefreshCw,
  PieChart,
  LineChart,
  CheckCircle2,
  LifeBuoy,
  BrainCircuit
} from "lucide-react"

// 风险与分析标签页组件
export default function RiskAnalysisTab({ todo }: { todo?: any }) {
  const [activeTab, setActiveTab] = useState("risk")
  const [isLoading, setIsLoading] = useState(false)
  const [refreshedTime, setRefreshedTime] = useState(new Date().toLocaleString())

  // 处理刷新分析
  const handleRefreshAnalysis = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setRefreshedTime(new Date().toLocaleString())
    }, 2000)
  }

  // 获取风险级别颜色
  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "高":
        return "bg-red-100 text-red-600 border-red-200"
      case "中":
        return "bg-amber-100 text-amber-600 border-amber-200"
      case "低":
        return "bg-green-100 text-green-600 border-green-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  // 模拟风险数据
  const riskData = [
    {
      id: 1,
      category: "动物福利",
      title: "麻醉方案风险",
      level: "低",
      description: "当前麻醉方案剂量精确控制，但长时间手术可能需要调整",
      impact: "可能导致动物不适或痛苦",
      mitigation: "准备备用麻醉方案，持续监测生命体征",
      indicators: ["呼吸频率", "体温", "疼痛评分"],
      aiScore: 92
    },
    {
      id: 2,
      category: "操作风险",
      title: "实验技术风险",
      level: "中",
      description: "药物投递精确度依赖操作人员经验，可能存在偏差",
      impact: "影响实验数据准确性和一致性",
      mitigation: "加强操作人员培训，使用自动化给药系统",
      indicators: ["给药准确度", "技术偏差率", "操作一致性评分"],
      aiScore: 78
    },
    {
      id: 3,
      category: "伦理合规",
      title: "动物数量风险",
      level: "低",
      description: "当前实验设计已优化动物使用数量，但实验进展可能需要额外样本",
      impact: "可能增加动物使用数量",
      mitigation: "采用统计学方法优化样本量，提高单个样本数据利用率",
      indicators: ["动物使用效率", "统计功效", "样本最优化指数"],
      aiScore: 95
    },
    {
      id: 4,
      category: "科学质量",
      title: "数据可靠性风险",
      level: "中",
      description: "个体差异可能影响实验结果的一致性",
      impact: "增加结果变异性，影响结论可靠性",
      mitigation: "增加分组精确性，控制变量，采用匹配设计",
      indicators: ["组内变异系数", "数据完整性", "重复性评分"],
      aiScore: 83
    }
  ]

  // 模拟安全评分数据
  const safetyScores = {
    animalWelfare: 92,
    procedureRisk: 78,
    ethicalCompliance: 95,
    scientificQuality: 83,
    overallScore: 87,
    recommendation: "建议继续实验，同时加强实验技术标准化和监测措施"
  }

  // 模拟建议数据
  const recommendations = [
    "优化麻醉方案，考虑采用不同种类药物组合减轻可能的副作用",
    "建立更精确的给药系统，减少人为操作误差",
    "加强实验人员技术培训，特别是手术和取样技术",
    "改进数据收集方法，增加自动化程度，减少主观偏差",
    "完善应急预案，为实验过程中可能出现的意外情况做准备"
  ]

  return (
    <div className="space-y-6">
      {/* 风险分析概览卡片 */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              风险与安全分析
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-slate-600"
              onClick={handleRefreshAnalysis}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs">分析中...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="text-xs">刷新分析</span>
                </>
              )}
            </Button>
          </div>
          <CardDescription className="text-slate-500">
            最近更新：{refreshedTime}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 rounded-md border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium text-slate-800">总体风险评分</h3>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-800">{safetyScores.overallScore}</span>
                <span className="text-slate-500 text-sm mb-0.5">/100</span>
                <Badge className="ml-auto bg-green-100 text-green-800 border border-green-200">
                  良好
                </Badge>
              </div>
              <Progress value={safetyScores.overallScore} className="h-2 mb-3" />
              <p className="text-sm text-slate-600">{safetyScores.recommendation}</p>
            </div>

            <div className="bg-slate-50 rounded-md border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-slate-800">分项风险评分</h3>
              </div>
              
              {/* 优化后的分项风险评分展示 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center justify-center p-2 border border-slate-200 rounded-md bg-white">
                  <div className="flex items-center gap-1 mb-1 text-xs text-slate-600">
                    <Rat className="h-3.5 w-3.5" />
                    <span>动物福利</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {safetyScores.animalWelfare}%
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-2 border border-slate-200 rounded-md bg-white">
                  <div className="flex items-center gap-1 mb-1 text-xs text-slate-600">
                    <Syringe className="h-3.5 w-3.5" />
                    <span>操作风险</span>
                  </div>
                  <div className="text-lg font-bold text-amber-600">
                    {safetyScores.procedureRisk}%
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-2 border border-slate-200 rounded-md bg-white">
                  <div className="flex items-center gap-1 mb-1 text-xs text-slate-600">
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>伦理合规</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {safetyScores.ethicalCompliance}%
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-2 border border-slate-200 rounded-md bg-white">
                  <div className="flex items-center gap-1 mb-1 text-xs text-slate-600">
                    <Brain className="h-3.5 w-3.5" />
                    <span>科学质量</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {safetyScores.scientificQuality}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详细信息标签页 */}
      <Tabs defaultValue="risk" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="risk" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
            <AlertTriangle className="h-4 w-4 mr-2" />
            风险清单
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <BrainCircuit className="h-4 w-4 mr-2" />
            AI分析
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <LifeBuoy className="h-4 w-4 mr-2" />
            改进建议
          </TabsTrigger>
        </TabsList>

        {/* 风险清单内容 */}
        <TabsContent value="risk" className="mt-0">
          <div className="space-y-4">
            {riskData.map((risk) => (
              <Card key={risk.id} className={`border-l-4 border-slate-200 shadow-sm ${
                risk.level === "高" 
                  ? "border-l-red-500" 
                  : risk.level === "中" 
                    ? "border-l-amber-500" 
                    : "border-l-green-500"
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                      <CircleAlert className={`h-4 w-4 ${
                        risk.level === "高" 
                          ? "text-red-500" 
                          : risk.level === "中" 
                            ? "text-amber-500" 
                            : "text-green-500"
                      }`} />
                      <span>{risk.title}</span>
                      <Badge variant="outline" className={`ml-2 px-2 py-0.5 text-xs ${getRiskLevelColor(risk.level)}`}>
                        {risk.level}风险
                      </Badge>
                    </CardTitle>
                    <div className="text-xs flex items-center gap-1 text-slate-500">
                      <Shield className="h-3.5 w-3.5" />
                      <span>AI评分: {risk.aiScore}</span>
                    </div>
                  </div>
                  <CardDescription className="text-slate-600 flex items-center gap-1">
                    <span className="font-medium text-xs px-1.5 py-0.5 rounded bg-slate-100">
                      {risk.category}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">风险描述</h4>
                      <p className="text-sm text-slate-600">{risk.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">潜在影响</h4>
                      <p className="text-sm text-slate-600">{risk.impact}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">缓解措施</h4>
                      <p className="text-sm text-slate-600">{risk.mitigation}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">关键指标</h4>
                      <div className="flex flex-wrap gap-2">
                        {risk.indicators.map((indicator, idx) => (
                          <Badge key={idx} variant="outline" className="bg-slate-50">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI分析内容 */}
        <TabsContent value="analysis" className="mt-0">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-blue-500" />
                人工智能风险评估
              </CardTitle>
              <CardDescription>
                基于动物伦理项目数据的智能风险分析及评估
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    项目风险分析摘要
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    本项目整体风险处于可控范围内，主要风险点集中在实验操作标准化和数据可靠性方面。动物福利保障措施完善，伦理合规性高。建议加强实验技术培训和数据质量控制，进一步提高实验可靠性和科学性。
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-md border border-blue-200">
                      <div className="text-xs text-blue-600 mb-1">动物福利风险</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-800">低</span>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-blue-200">
                      <div className="text-xs text-blue-600 mb-1">操作流程风险</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-800">中</span>
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-blue-200">
                      <div className="text-xs text-blue-600 mb-1">数据质量风险</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-800">中</span>
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-blue-200">
                      <div className="text-xs text-blue-600 mb-1">伦理合规风险</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-800">低</span>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-800 mb-3">风险趋势分析</h3>
                  <div className="h-64 bg-white rounded-md border border-slate-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm font-medium text-slate-800">各类风险月度趋势（近6个月）</div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs text-slate-600">动物福利</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-xs text-slate-600">操作风险</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-slate-600">数据质量</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="text-xs text-slate-600">伦理合规</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-[calc(100%-28px)]">
                      {/* 图表网格线 */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        <div className="border-b border-dashed border-slate-200 h-0"></div>
                        <div className="border-b border-dashed border-slate-200 h-0"></div>
                        <div className="border-b border-dashed border-slate-200 h-0"></div>
                        <div className="border-b border-dashed border-slate-200 h-0"></div>
                        <div className="border-b border-dashed border-slate-200 h-0"></div>
                      </div>
                      
                      {/* Y轴标签 */}
                      <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-slate-400 pr-2">
                        <div>100</div>
                        <div>75</div>
                        <div>50</div>
                        <div>25</div>
                        <div>0</div>
                      </div>
                      
                      {/* X轴标签 */}
                      <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-slate-400 pt-2">
                        <div>1月</div>
                        <div>2月</div>
                        <div>3月</div>
                        <div>4月</div>
                        <div>5月</div>
                        <div>6月</div>
                      </div>
                      
                      {/* 图表区域 */}
                      <div className="absolute left-8 right-0 top-0 bottom-8">
                        <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                          {/* 动物福利风险 - 绿色 */}
                          <path
                            d="M0,70 C20,65 40,60 60,55 C80,50 100,48 120,45 C140,42 160,40 180,38 C200,36 220,35 240,34 C260,33 280,32 300,30"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2"
                          />
                          
                          {/* 操作风险 - 黄色 */}
                          <path
                            d="M0,50 C20,52 40,54 60,56 C80,58 100,60 120,58 C140,56 160,54 180,58 C200,62 220,64 240,62 C260,60 280,58 300,55"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2"
                          />
                          
                          {/* 数据质量风险 - 蓝色 */}
                          <path
                            d="M0,55 C20,56 40,57 60,58 C80,59 100,60 120,62 C140,64 160,63 180,60 C200,57 220,55 240,53 C260,51 280,50 300,48"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                          />
                          
                          {/* 伦理合规风险 - 紫色 */}
                          <path
                            d="M0,30 C20,31 40,32 60,33 C80,34 100,35 120,34 C140,33 160,32 180,30 C200,28 220,26 240,25 C260,24 280,23 300,22"
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="2"
                          />
                          
                          {/* 动物福利风险数据点 */}
                          <circle cx="0" cy="70" r="3" fill="#22c55e" />
                          <circle cx="60" cy="55" r="3" fill="#22c55e" />
                          <circle cx="120" cy="45" r="3" fill="#22c55e" />
                          <circle cx="180" cy="38" r="3" fill="#22c55e" />
                          <circle cx="240" cy="34" r="3" fill="#22c55e" />
                          <circle cx="300" cy="30" r="3" fill="#22c55e" />
                          
                          {/* 操作风险数据点 */}
                          <circle cx="0" cy="50" r="3" fill="#f59e0b" />
                          <circle cx="60" cy="56" r="3" fill="#f59e0b" />
                          <circle cx="120" cy="58" r="3" fill="#f59e0b" />
                          <circle cx="180" cy="58" r="3" fill="#f59e0b" />
                          <circle cx="240" cy="62" r="3" fill="#f59e0b" />
                          <circle cx="300" cy="55" r="3" fill="#f59e0b" />
                          
                          {/* 数据质量风险数据点 */}
                          <circle cx="0" cy="55" r="3" fill="#3b82f6" />
                          <circle cx="60" cy="58" r="3" fill="#3b82f6" />
                          <circle cx="120" cy="62" r="3" fill="#3b82f6" />
                          <circle cx="180" cy="60" r="3" fill="#3b82f6" />
                          <circle cx="240" cy="53" r="3" fill="#3b82f6" />
                          <circle cx="300" cy="48" r="3" fill="#3b82f6" />
                          
                          {/* 伦理合规风险数据点 */}
                          <circle cx="0" cy="30" r="3" fill="#a855f7" />
                          <circle cx="60" cy="33" r="3" fill="#a855f7" />
                          <circle cx="120" cy="34" r="3" fill="#a855f7" />
                          <circle cx="180" cy="30" r="3" fill="#a855f7" />
                          <circle cx="240" cy="25" r="3" fill="#a855f7" />
                          <circle cx="300" cy="22" r="3" fill="#a855f7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-800 mb-3">AI风险预测</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                      <div className="mt-0.5">
                        <CircleAlert className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-800">实验进度风险</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          预测风险：时间延误可能性为28%。主要原因为药物给药后观察期可能需要延长，建议提前做好进度调整准备。
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                      <div className="mt-0.5">
                        <CircleAlert className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-800">数据质量风险</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          预测风险：数据变异性增加可能性为35%。由于个体差异和环境因素影响，建议增加样本量并严格控制实验环境变量。
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                      <div className="mt-0.5">
                        <CircleAlert className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-800">伦理合规风险</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          预测风险：伦理问题出现可能性低于5%。当前伦理审查和动物福利措施完善，符合相关规范要求。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 改进建议内容 */}
        <TabsContent value="recommendations" className="mt-0">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-green-500" />
                项目改进建议
              </CardTitle>
              <CardDescription>
                基于风险分析的具体改进措施和建议
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((recommendation, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                    <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm text-slate-800">{recommendation}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-6">
                  <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-slate-600" />
                    政策与标准参考
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-slate-800">实验动物管理条例</span>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        查看
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-slate-800">动物实验伦理审查指南</span>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        查看
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-slate-800">实验动物福利与伦理标准</span>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        查看
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between">
              <div className="text-xs text-slate-500">AI分析更新时间：{refreshedTime}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <HeartPulse className="h-3.5 w-3.5 text-green-500" />
                <span>可信度: 92%</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 