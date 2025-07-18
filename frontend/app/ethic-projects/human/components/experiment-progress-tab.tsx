"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  FileText,
  Calendar,
  User,
  MapPin,
  Beaker,
  ClipboardCheck,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Activity,
  TestTube,
  Calculator,
  CheckCircle2,
  Clock,
  AlertCircle,
  FlaskConical,
  Microscope,
  ChevronRight,
  Sparkles,
  Upload
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

// 实验数据标签页组件
export default function ExperimentProgressTab({ todo }: { todo?: any }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // 模拟实验数据 - 基于上传表单的数据结构
  const [experimentData, setExperimentData] = useState([
    {
      id: "exp001",
      experimentStage: "preliminary",
      experimentDate: "2024-01-15",
      experimentLocation: "临床研究中心",
      experimentOperator: "张研究员",
      experimentEquipment: "血压计、血糖仪、体成分分析仪",
      resultSummary: "初步研究显示饮食干预对血脂水平有积极影响，受试者反应良好",
      participantCondition: "受试者健康状况良好，无不良反应",
      successRate: "95%",
      sampleCount: "20人",
      dataDescription: "血液生化指标、体成分数据",
      observations: "受试者依从性良好，配合度高",
      unexpectedResults: "部分受试者出现轻微体重减轻",
      methodology: "标准临床试验流程",
      dataAnalysisMethod: "统计学T检验",
      conclusion: "初步结果符合预期",
      status: "已完成",
      uploadDate: "2024-01-16",
      filesCount: 3,
      createdBy: "张研究员"
    },
    {
      id: "exp002", 
      experimentStage: "midterm",
      experimentDate: "2024-02-20",
      experimentLocation: "临床研究中心",
      experimentOperator: "李助理",
      experimentEquipment: "心电图机、超声设备",
      resultSummary: "中期阶段研究显示干预方案效果稳定，受试者生理指标改善明显",
      participantCondition: "受试者健康状况良好，无异常表现",
      successRate: "88%",
      sampleCount: "25人",
      dataDescription: "心血管功能指标、代谢指标数据",
      observations: "生理指标改善在预期范围内",
      unexpectedResults: "个别受试者出现轻微血压波动",
      methodology: "生理指标监测与效果评估",
      dataAnalysisMethod: "非线性回归分析",
      conclusion: "中期结果良好，需继续观察",
      status: "已完成",
      uploadDate: "2024-02-21",
      filesCount: 5,
      createdBy: "李助理"
    },
    {
      id: "exp003",
      experimentStage: "final",
      experimentDate: "2024-03-10",
      experimentLocation: "临床研究中心",
      experimentOperator: "王教授",
      experimentEquipment: "生化分析仪、血细胞分析仪",
      resultSummary: "最终阶段研究确认干预方案安全性良好，疗效显著",
      participantCondition: "所有受试者状况稳定，未发现严重不良事件",
      successRate: "92%",
      sampleCount: "30人",
      dataDescription: "完整的生化指标数据、安全性数据",
      observations: "治疗效果持续时间符合预期",
      unexpectedResults: "无显著未预期结果",
      methodology: "综合疗效与安全性评价",
      dataAnalysisMethod: "多变量统计分析",
      conclusion: "研究目标达成，可进入下一阶段",
      status: "进行中",
      uploadDate: "2024-03-11",
      filesCount: 8,
      createdBy: "王教授"
    }
  ])

  // 研究阶段映射
  const stageMapping = {
    preliminary: "初步研究",
    midterm: "中期阶段", 
    final: "最终阶段",
    followUp: "随访阶段"
  }

  // 状态颜色映射
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
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
      case "进行中":
        return <Clock className="h-3.5 w-3.5 mr-1" />
      case "未开始":
        return <AlertCircle className="h-3.5 w-3.5 mr-1" />
      default:
        return null
    }
  }

  // 过滤实验数据
  const filteredData = experimentData.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.resultSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.experimentOperator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.experimentLocation.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStage = stageFilter === "all" || item.experimentStage === stageFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    
    return matchesSearch && matchesStage && matchesStatus
  })

  // 统计信息
  const totalExperiments = experimentData.length
  const completedExperiments = experimentData.filter(item => item.status === "已完成").length
  const inProgressExperiments = experimentData.filter(item => item.status === "进行中").length
  const totalSamples = experimentData.reduce((sum, item) => sum + parseInt(item.sampleCount), 0)
  const averageSuccessRate = experimentData.reduce((sum, item) => sum + parseFloat(item.successRate), 0) / experimentData.length

  // 处理查看详情
  const handleViewDetail = (experiment: any) => {
    toast({
      title: "查看研究详情",
      description: `正在查看${stageMapping[experiment.experimentStage as keyof typeof stageMapping]}的详细数据`
    })
  }

  // 处理上传新数据
  const handleUploadData = () => {
    if (todo?.id) {
      router.push(`/ethic-projects/human/upload/${todo.id}`)
    }
  }

  // 处理导出数据
  const handleExportData = () => {
    toast({
      title: "导出数据",
      description: "正在准备研究数据导出..."
    })
  }

  return (
    <div className="space-y-6">
      {/* 总览统计卡片 */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  研究数据概览
                  <Badge variant="outline" className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2">
                    {totalExperiments}项研究
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-500">
                  项目研究数据统计与进度跟踪
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={handleUploadData}
              className="h-8 gap-1 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Upload className="h-3.5 w-3.5" />
              上传数据
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{completedExperiments}</div>
              <div className="text-xs text-slate-500 mt-0.5">已完成研究</div>
            </div>
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{inProgressExperiments}</div>
              <div className="text-xs text-slate-500 mt-0.5">进行中研究</div>
            </div>
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{totalSamples}</div>
              <div className="text-xs text-slate-500 mt-0.5">总受试者数</div>
            </div>
            <div className="text-center p-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-lg font-semibold text-slate-700">{averageSuccessRate.toFixed(1)}%</div>
              <div className="text-xs text-slate-500 mt-0.5">平均成功率</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索和筛选 */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="搜索研究数据..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="研究阶段" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部阶段</SelectItem>
                <SelectItem value="preliminary">初步研究</SelectItem>
                <SelectItem value="midterm">中期阶段</SelectItem>
                <SelectItem value="final">最终阶段</SelectItem>
                <SelectItem value="followUp">随访阶段</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
                <SelectItem value="进行中">进行中</SelectItem>
                <SelectItem value="未开始">未开始</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={handleExportData}
              className="w-full md:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 实验数据列表 */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4 text-slate-500">
                <FlaskConical className="h-12 w-12" />
                <div>
                  <h3 className="font-medium">暂无研究数据</h3>
                  <p className="text-sm mt-1">
                    {searchTerm || stageFilter !== "all" || statusFilter !== "all" 
                      ? "没有找到符合条件的研究数据" 
                      : "还没有上传任何研究数据"}
                  </p>
                </div>
                {!searchTerm && stageFilter === "all" && statusFilter === "all" && (
                  <Button onClick={handleUploadData} className="mt-2">
                    <Upload className="h-4 w-4 mr-2" />
                    上传第一个研究数据
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredData.map((experiment) => (
            <Card key={experiment.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TestTube className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-800">
                          {stageMapping[experiment.experimentStage as keyof typeof stageMapping]}
                        </h3>
                        <Badge variant="outline" className={`px-2 py-0.5 text-xs ${getStatusColor(experiment.status)}`}>
                          {getStatusIcon(experiment.status)}
                          {experiment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {experiment.experimentDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {experiment.experimentOperator}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {experiment.experimentLocation}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetail(experiment)}
                    className="h-8"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    查看
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
                    <div className="text-sm font-medium text-slate-700 mb-1">实验结果摘要</div>
                    <p className="text-sm text-slate-600">{experiment.resultSummary}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-2 rounded-md bg-white border border-slate-200">
                      <div className="text-xs text-slate-500">成功率</div>
                      <div className="text-sm font-medium text-slate-800">{experiment.successRate}</div>
                    </div>
                    <div className="p-2 rounded-md bg-white border border-slate-200">
                      <div className="text-xs text-slate-500">样本数</div>
                      <div className="text-sm font-medium text-slate-800">{experiment.sampleCount}</div>
                    </div>
                    <div className="p-2 rounded-md bg-white border border-slate-200">
                      <div className="text-xs text-slate-500">文件数</div>
                      <div className="text-sm font-medium text-slate-800">{experiment.filesCount}个</div>
                    </div>
                    <div className="p-2 rounded-md bg-white border border-slate-200">
                      <div className="text-xs text-slate-500">上传日期</div>
                      <div className="text-sm font-medium text-slate-800">{experiment.uploadDate}</div>
                    </div>
                  </div>

                  {experiment.participantCondition && (
                    <div className="p-3 rounded-md bg-green-50 border border-green-100">
                      <div className="text-sm font-medium text-green-700 mb-1">受试者状况</div>
                      <p className="text-sm text-green-600">{experiment.participantCondition}</p>
                    </div>
                  )}

                  {experiment.unexpectedResults && experiment.unexpectedResults !== "无显著未预期结果" && (
                    <div className="p-3 rounded-md bg-amber-50 border border-amber-100">
                      <div className="text-sm font-medium text-amber-700 mb-1">注意事项</div>
                      <p className="text-sm text-amber-600">{experiment.unexpectedResults}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 