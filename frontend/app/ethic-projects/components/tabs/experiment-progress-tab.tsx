"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { CheckCircle, Clock, Calendar, ChevronDown, ChevronUp, ChartBarIcon, ArrowUpRight, Flag, LineChart, BarChart3, PieChart, Download, AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 实验进度与结果标签页组件
export default function ExperimentProgressTab() {
  // 定义实验阶段数据
  const experimentStages = [
    {
      id: "1",
      name: "准备阶段",
      status: "已完成",
      startDate: "2024-01-15",
      endDate: "2024-02-10",
      progress: 100,
      description: "实验动物准备与环境适应，实验器材与试剂准备",
      milestones: [
        { name: "动物购买与检疫", date: "2024-01-15", status: "已完成" },
        { name: "动物适应性饲养", date: "2024-01-25", status: "已完成" },
        { name: "实验器材准备", date: "2024-02-05", status: "已完成" }
      ]
    },
    {
      id: "2",
      name: "分组与基线测量",
      status: "已完成",
      startDate: "2024-02-12",
      endDate: "2024-02-25",
      progress: 100,
      description: "实验动物分组，采集基线生理指标与生化参数",
      milestones: [
        { name: "动物随机分组", date: "2024-02-12", status: "已完成" },
        { name: "基线生理指标测量", date: "2024-02-18", status: "已完成" },
        { name: "基线生化参数测定", date: "2024-02-23", status: "已完成" }
      ]
    },
    {
      id: "3",
      name: "实验干预",
      status: "进行中",
      startDate: "2024-02-28",
      endDate: "2024-04-15",
      progress: 65,
      description: "按照实验方案进行药物干预与样本采集",
      milestones: [
        { name: "第一轮给药", date: "2024-02-28", status: "已完成" },
        { name: "中期数据采集", date: "2024-03-20", status: "已完成" },
        { name: "第二轮给药", date: "2024-03-30", status: "进行中" },
        { name: "最终样本采集", date: "2024-04-12", status: "未开始" }
      ]
    },
    {
      id: "4",
      name: "数据分析",
      status: "未开始",
      startDate: "2024-04-18",
      endDate: "2024-05-15",
      progress: 0,
      description: "实验数据整理与统计分析，结果可视化",
      milestones: [
        { name: "数据整理与清洗", date: "2024-04-18", status: "未开始" },
        { name: "统计分析", date: "2024-04-28", status: "未开始" },
        { name: "结果可视化", date: "2024-05-10", status: "未开始" }
      ]
    },
    {
      id: "5",
      name: "报告撰写",
      status: "未开始",
      startDate: "2024-05-18",
      endDate: "2024-06-10",
      progress: 0,
      description: "实验报告撰写与论文准备",
      milestones: [
        { name: "实验报告初稿", date: "2024-05-18", status: "未开始" },
        { name: "报告修订", date: "2024-05-30", status: "未开始" },
        { name: "论文撰写", date: "2024-06-05", status: "未开始" }
      ]
    }
  ]

  // 实验数据统计
  const experimentData = {
    totalAnimals: 85,
    groupCount: 5,
    samplesCollected: 127,
    dataPoints: 835,
    significantFindings: 3,
    mainOutcomeIndex: 0.37, // 主要结局指标
    pValue: 0.032,
    completionRate: 62
  }

  // 实验结果数据
  const resultsData = [
    { 
      name: "血清药物浓度", 
      datasets: [
        { group: "对照组", value: 0 },
        { group: "低剂量组", value: 12.3 },
        { group: "中剂量组", value: 24.7 },
        { group: "高剂量组", value: 38.5 }
      ],
      unit: "ng/ml",
      comparisonResult: "剂量依赖性增加，p<0.01"
    },
    {
      name: "体重变化", 
      datasets: [
        { group: "对照组", value: 2.5 },
        { group: "低剂量组", value: 1.8 },
        { group: "中剂量组", value: 0.9 },
        { group: "高剂量组", value: -0.7 }
      ],
      unit: "%",
      comparisonResult: "高剂量组显著降低，p<0.05"
    },
    {
      name: "肝功能指标", 
      datasets: [
        { group: "对照组", value: 32.1 },
        { group: "低剂量组", value: 34.5 },
        { group: "中剂量组", value: 41.2 },
        { group: "高剂量组", value: 52.7 }
      ],
      unit: "U/L",
      comparisonResult: "高剂量组显著升高，p<0.01"
    }
  ]

  // 管理各阶段的展开状态
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    "1": true,
    "2": true,
    "3": true,
    "4": false,
    "5": false
  })

  // 切换展开状态函数
  const toggleStageExpand = (stageId: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }))
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-700"
      case "进行中":
        return "bg-blue-100 text-blue-700"
      case "未开始":
        return "bg-slate-100 text-slate-700"
      case "延期":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  // 获取里程碑状态图标
  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "已完成":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "进行中":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "未开始":
        return <Clock className="h-4 w-4 text-slate-400" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 实验进度概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              总体进度
            </CardTitle>
            <CardDescription>实验总体完成情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-2">
              <span className="text-4xl font-bold text-blue-600">{experimentData.completionRate}%</span>
            </div>
            <Progress value={experimentData.completionRate} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>开始</span>
              <span>当前阶段</span>
              <span>完成</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Flag className="h-5 w-5 text-amber-500" />
              实验数据
            </CardTitle>
            <CardDescription>实验数据采集情况</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">实验动物:</span>
              <span className="font-medium">{experimentData.totalAnimals}只</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">分组数量:</span>
              <span className="font-medium">{experimentData.groupCount}组</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">样本采集:</span>
              <span className="font-medium">{experimentData.samplesCollected}份</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">数据点数:</span>
              <span className="font-medium">{experimentData.dataPoints}个</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <LineChart className="h-5 w-5 text-green-500" />
              初步结果
            </CardTitle>
            <CardDescription>主要研究发现</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">显著发现:</span>
              <span className="font-medium">{experimentData.significantFindings}项</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">主要指标:</span>
              <span className="font-medium">{experimentData.mainOutcomeIndex}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">统计显著性:</span>
              <span className="font-medium">p={experimentData.pValue}</span>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
              查看详细报告
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 实验阶段与结果选项卡 */}
      <Tabs defaultValue="stages" className="w-full">
        <TabsList>
          <TabsTrigger value="stages">实验阶段进度</TabsTrigger>
          <TabsTrigger value="results">数据与结果</TabsTrigger>
        </TabsList>
        
        {/* 实验阶段进度内容 */}
        <TabsContent value="stages" className="space-y-4 mt-4">
          {experimentStages.map((stage) => (
            <Card key={stage.id} className="overflow-hidden border border-slate-200">
              <CardHeader 
                className={`py-3 px-4 border-b flex flex-row justify-between items-center cursor-pointer
                  ${stage.status === "已完成" ? "bg-green-50/50" : 
                    stage.status === "进行中" ? "bg-blue-50/50" : "bg-white"}`}
                onClick={() => toggleStageExpand(stage.id)}
              >
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(stage.status)} border-none`}
                  >
                    {stage.status}
                  </Badge>
                  <h3 className="text-base font-medium">{stage.name}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {stage.startDate} - {stage.endDate}
                  </div>
                  <Progress value={stage.progress} className="w-20 h-2" />
                  <span className="text-sm font-medium">{stage.progress}%</span>
                  {expandedStages[stage.id] ? 
                    <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
              </CardHeader>
              
              {expandedStages[stage.id] && (
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-4">{stage.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">关键里程碑</h4>
                    <div className="space-y-2">
                      {stage.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-md">
                          <div className="flex items-center gap-2">
                            {getMilestoneIcon(milestone.status)}
                            <span className="text-sm">{milestone.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(milestone.status)} text-xs px-2 py-0 h-5`}
                            >
                              {milestone.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{milestone.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>
        
        {/* 数据与结果内容 */}
        <TabsContent value="results" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">实验初步结果</CardTitle>
              <CardDescription>实验关键指标数据对比（进行中）</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resultsData.map((result, index) => (
                  <div key={index} className="space-y-2">
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-medium">{result.name}</h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        中期数据
                      </Badge>
                    </div>
                    
                    {/* 简易图表 - 在实际应用中可替换为真实的图表组件 */}
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-100 mt-2">
                      <div className="flex items-end h-32 gap-4 mb-2">
                        {result.datasets.map((dataset, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-blue-500 rounded-t-sm" 
                              style={{ 
                                height: `${Math.max(5, Math.abs(dataset.value) / (result.datasets.reduce((max, d) => Math.max(max, Math.abs(d.value)), 0) || 1) * 100)}%`,
                                backgroundColor: i === 0 ? '#94a3b8' : '#3b82f6'
                              }}
                            />
                            <div className="text-xs mt-1 font-medium">{dataset.value} {result.unit}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{dataset.group}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 flex items-start gap-2 text-sm border-t border-slate-200 pt-3">
                        <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{result.comparisonResult}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 flex justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                <span className="text-sm text-muted-foreground">数据为初步结果，尚未经过完整统计分析</span>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                导出数据
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 