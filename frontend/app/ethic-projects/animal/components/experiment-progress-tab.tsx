"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  LineChart,
  PieChart,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  ChevronRight,
  BarChart,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  FlaskConical as Flask,
  Microscope,
  Beaker,
  BarChartHorizontal
} from "lucide-react"
import { SerumConcentrationChart } from "./charts/serum-concentration-chart"
import { BasicSerumChart } from "./charts/basic-serum-chart"
import { SimpleSerumChart } from "./charts/simple-serum-chart"
import { LiverFunctionChart } from "./charts/liver-function-chart"
import { MetaboliteDistributionChart } from "./charts/metabolite-distribution-chart"
import { EnhancedProgress } from "./enhanced-progress"

// 实验进度与结果标签页组件
export default function ExperimentProgressTab({ todo }: { todo?: any }) {
  const [activeTab, setActiveTab] = useState("progress")
  
  // 模拟实验阶段数据
  const experimentStages = [
    {
      id: 1,
      name: "前期准备",
      status: "已完成",
      progress: 100,
      startDate: "2024-01-01",
      endDate: "2024-01-15",
      description: "实验设备准备与动物适应性观察",
      milestones: [
        { name: "实验环境准备", date: "2024-01-03", status: "已完成" },
        { name: "实验动物入组", date: "2024-01-05", status: "已完成" },
        { name: "适应性喂养", date: "2024-01-08", status: "已完成" },
        { name: "分组标记", date: "2024-01-12", status: "已完成" }
      ]
    },
    {
      id: 2,
      name: "实验干预",
      status: "进行中",
      progress: 65,
      startDate: "2024-01-16",
      endDate: "2024-04-20",
      description: "药物干预与生理参数监测",
      milestones: [
        { name: "初次给药", date: "2024-01-16", status: "已完成" },
        { name: "第一阶段监测", date: "2024-02-15", status: "已完成" },
        { name: "中期评估", date: "2024-03-15", status: "已完成" },
        { name: "第二阶段监测", date: "2024-04-15", status: "进行中" }
      ]
    },
    {
      id: 3,
      name: "数据收集",
      status: "进行中",
      progress: 40,
      startDate: "2024-02-01",
      endDate: "2024-05-15",
      description: "生物样本采集与指标测量",
      milestones: [
        { name: "第一次采样", date: "2024-02-01", status: "已完成" },
        { name: "血液生化分析", date: "2024-02-10", status: "已完成" },
        { name: "第二次采样", date: "2024-03-20", status: "已完成" },
        { name: "组织病理切片", date: "2024-04-25", status: "未开始" }
      ]
    },
    {
      id: 4,
      name: "数据分析",
      status: "未开始",
      progress: 0,
      startDate: "2024-05-16",
      endDate: "2024-06-30",
      description: "数据统计与结果分析",
      milestones: [
        { name: "数据整理", date: "2024-05-20", status: "未开始" },
        { name: "统计分析", date: "2024-06-05", status: "未开始" },
        { name: "结果可视化", date: "2024-06-15", status: "未开始" },
        { name: "报告撰写", date: "2024-06-25", status: "未开始" }
      ]
    }
  ]
  
  // 关键结果数据
  const experimentResults = [
    {
      id: 1,
      title: "实验药物血药浓度曲线",
      type: "line-chart",
      date: "2024-03-15",
      status: "已完成",
      description: "实验组与对照组药物血浓度监测结果",
      summary: "药物在实验组中表现出较长的半衰期，维持有效血药浓度时间延长32%",
      metrics: [
        { name: "峰浓度", value: "248ng/ml", change: "+15%" },
        { name: "谷浓度", value: "65ng/ml", change: "+22%" },
        { name: "半衰期", value: "4.2小时", change: "+32%" }
      ]
    },
    {
      id: 2,
      title: "肝功能指标变化",
      type: "bar-chart",
      date: "2024-03-20",
      status: "已完成",
      description: "ALT、AST等肝功能指标在不同给药剂量下的变化",
      summary: "实验组肝功能指标在治疗剂量范围内保持稳定，无明显肝毒性反应",
      metrics: [
        { name: "ALT变化率", value: "+5.2%", change: "正常范围内" },
        { name: "AST变化率", value: "+6.8%", change: "正常范围内" },
        { name: "ALP变化率", value: "+2.1%", change: "无显著变化" }
      ]
    },
    {
      id: 3,
      title: "代谢物分布情况",
      type: "pie-chart",
      date: "2024-04-05",
      status: "进行中",
      description: "药物在体内主要代谢物的比例分布",
      summary: "初步结果显示代谢物M1和M2占总代谢物的78%，与预期一致",
      metrics: [
        { name: "M1代谢物", value: "45%", change: "" },
        { name: "M2代谢物", value: "33%", change: "" },
        { name: "其他代谢物", value: "22%", change: "" }
      ]
    }
  ]

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-800 border border-green-200"
      case "进行中":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "未开始":
        return "bg-gray-100 text-gray-800 border border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "已完成":
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />
      case "进行中":
        return <Clock className="h-3.5 w-3.5 mr-1" />
      case "未开始":
        return <AlertCircle className="h-3.5 w-3.5 mr-1" />
      default:
        return null
    }
  }

  // 获取结果类型图标
  const getResultIcon = (type: string) => {
    switch (type) {
      case "line-chart":
        return <LineChart className="h-4 w-4 text-blue-500" />
      case "bar-chart":
        return <BarChartHorizontal className="h-4 w-4 text-purple-500" />
      case "pie-chart":
        return <PieChart className="h-4 w-4 text-amber-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  // 计算总体进度
  const calculateOverallProgress = () => {
    const totalStages = experimentStages.length
    const completedWeight = experimentStages.filter(s => s.status === "已完成").length
    const inProgressWeight = experimentStages
      .filter(s => s.status === "进行中")
      .reduce((sum, stage) => sum + (stage.progress / 100), 0)
    
    return Math.round((completedWeight + inProgressWeight) / totalStages * 100)
  }

  return (
    <div className="space-y-6">
      {/* 总体进度卡片 */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            <Flask className="h-5 w-5 text-blue-500" />
            实验总体进度
          </CardTitle>
          <CardDescription className="text-slate-500">
            目前已完成 {experimentStages.filter(s => s.status === "已完成").length} 个阶段，
            {experimentStages.filter(s => s.status === "进行中").length} 个阶段进行中
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-0 space-y-1">
            {experimentStages.map((stage) => (
              <div key={stage.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                  {stage.status === "已完成" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : stage.status === "进行中" ? (
                    <Clock className="h-4 w-4 text-blue-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                  )}
                  <span className="text-sm font-medium text-slate-700">{stage.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <EnhancedProgress 
                      value={stage.progress} 
                      size="sm"
                      showSegmentMarkers={false}
                      variant={
                        stage.status === "已完成" 
                          ? "success" 
                          : stage.status === "进行中" 
                            ? "default" 
                            : "default"
                      }
                      showAnimation={stage.status === "进行中"}
                    />
                  </div>
                  <Badge variant="outline" className={`px-2 py-0.5 text-xs ${getStatusColor(stage.status)}`}>
                    {getStatusIcon(stage.status)}
                    {stage.progress}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 详细信息标签页 */}
      <Tabs defaultValue="progress" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="progress" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Microscope className="h-4 w-4 mr-2" />
            实验阶段详情
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Beaker className="h-4 w-4 mr-2" />
            实验结果
          </TabsTrigger>
        </TabsList>

        {/* 实验阶段详情内容 */}
        <TabsContent value="progress" className="mt-0">
          <div className="space-y-4">
            {experimentStages.map((stage) => (
              <Card key={stage.id} className={`border-l-4 ${
                stage.status === "已完成" 
                  ? "border-l-green-500" 
                  : stage.status === "进行中" 
                    ? "border-l-blue-500" 
                    : "border-l-slate-300"
              } border-slate-200 shadow-sm`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                      <span>阶段 {stage.id}：{stage.name}</span>
                      <Badge variant="outline" className={`ml-2 px-2 py-0.5 text-xs ${getStatusColor(stage.status)}`}>
                        {getStatusIcon(stage.status)}
                        {stage.status}
                      </Badge>
                    </CardTitle>
                    <div className="text-xs text-slate-500 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {stage.startDate} 至 {stage.endDate}
                    </div>
                  </div>
                  <CardDescription className="text-slate-600">
                    {stage.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 pt-2">
                    <div className="text-sm font-medium text-slate-700">关键里程碑</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stage.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-start p-2 rounded-md bg-slate-50 border border-slate-100">
                          <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center mr-2 ${
                            milestone.status === "已完成" 
                              ? "bg-green-100 text-green-600" 
                              : milestone.status === "进行中" 
                                ? "bg-blue-100 text-blue-600" 
                                : "bg-slate-100 text-slate-400"
                          }`}>
                            {milestone.status === "已完成" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : milestone.status === "进行中" ? (
                              <Clock className="h-3 w-3" />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-700">{milestone.name}</div>
                            <div className="text-xs text-slate-500 flex items-center mt-0.5">
                              <Calendar className="h-3 w-3 mr-1" />
                              {milestone.date}
                              <Badge variant="outline" className={`ml-2 px-1.5 py-px text-[10px] ${getStatusColor(milestone.status)}`}>
                                {milestone.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 实验结果内容 */}
        <TabsContent value="results" className="mt-0">
          <div className="space-y-4">
            {experimentResults.map((result) => (
              <Card key={result.id} className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                      {getResultIcon(result.type)}
                      <span>{result.title}</span>
                      <Badge variant="outline" className={`ml-2 px-2 py-0.5 text-xs ${getStatusColor(result.status)}`}>
                        {getStatusIcon(result.status)}
                        {result.status}
                      </Badge>
                    </CardTitle>
                    <div className="text-xs text-slate-500 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {result.date}
                    </div>
                  </div>
                  <CardDescription className="text-slate-600">
                    {result.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-md bg-slate-50 border border-slate-100 text-sm text-slate-700">
                    <div className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p>{result.summary}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {result.metrics.map((metric, idx) => (
                      <div key={idx} className="p-3 rounded-md bg-white border border-slate-200">
                        <div className="text-xs font-medium text-slate-500">{metric.name}</div>
                        <div className="flex items-end justify-between mt-1">
                          <div className="text-lg font-semibold text-slate-800">{metric.value}</div>
                          {metric.change && (
                            <Badge variant="outline" className={`px-1.5 py-0.5 text-xs ${
                              metric.change.includes('+') 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : metric.change.includes('-') 
                                  ? 'bg-red-50 text-red-700 border-red-200' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                              {metric.change}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 图表区 */}
                  <div className="mt-4">
                    {result.id === 1 && result.type === "line-chart" ? (
                      <SimpleSerumChart />
                    ) : result.id === 2 && result.type === "bar-chart" ? (
                      <LiverFunctionChart />
                    ) : result.id === 3 && result.type === "pie-chart" ? (
                      <MetaboliteDistributionChart />
                    ) : (
                      <div className="h-64 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          {result.type === "bar-chart" && <BarChart className="h-10 w-10" />}
                          {result.type === "pie-chart" && <PieChart className="h-10 w-10" />}
                          <span className="text-sm">图表数据展示区域</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 