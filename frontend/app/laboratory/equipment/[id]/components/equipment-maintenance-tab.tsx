"use client"

import { Calendar, Clock, User, AlertCircle, CheckCircle, Wrench, FileText, BarChart3, Layout, Activity, AlertTriangle, TrendingUp, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"

interface EquipmentMaintenanceTabProps {
  data: any
}

// 模拟维护记录数据
const mockMaintenanceRecords = [
  {
    id: "maintenance1",
    type: "定期保养",
    date: "2023-11-20",
    technician: { name: "李工程师", department: "设备维护部" },
    description: "更换滤芯，清洁光学元件，校准参数",
    status: "已完成",
    nextDate: "2024-05-20",
    cost: 1200,
    parts: ["滤芯", "清洁剂", "校准标准品"],
    notes: "设备运行正常，所有参数在标准范围内",
    duration: "2小时"
  },
  {
    id: "maintenance2",
    type: "故障维修",
    date: "2023-09-15",
    technician: { name: "王技师", department: "设备维护部" },
    description: "修复X射线源异常，更换高压电源模块",
    status: "已完成",
    nextDate: null,
    cost: 8500,
    parts: ["高压电源模块", "连接线缆"],
    notes: "故障已排除，设备恢复正常运行",
    duration: "4小时"
  },
  {
    id: "maintenance3",
    type: "年度检查",
    date: "2023-06-10",
    technician: { name: "张主管", department: "设备维护部" },
    description: "全面检查设备各项功能，更新软件版本",
    status: "已完成",
    nextDate: "2024-06-10",
    cost: 2800,
    parts: ["软件升级包", "检测工具"],
    notes: "设备状态良好，软件升级成功",
    duration: "6小时"
  },
  {
    id: "maintenance4",
    type: "定期保养",
    date: "2024-05-20",
    technician: { name: "李工程师", department: "设备维护部" },
    description: "定期保养维护，检查关键部件",
    status: "计划中",
    nextDate: "2024-11-20",
    cost: 1500,
    parts: ["滤芯", "润滑油", "密封件"],
    notes: "即将进行的定期维护",
    duration: "3小时"
  }
]

// 模拟维护计划数据
const mockMaintenancePlans = [
  {
    id: "plan1",
    type: "定期保养",
    scheduledDate: "2024-05-20",
    frequency: "每6个月",
    description: "更换滤芯，清洁光学元件，校准参数",
    responsible: "李工程师",
    estimatedCost: 1500,
    estimatedDuration: "3小时",
    priority: "中",
    status: "待执行"
  },
  {
    id: "plan2",
    type: "年度检查",
    scheduledDate: "2024-06-10",
    frequency: "每年",
    description: "全面检查设备各项功能，软件更新",
    responsible: "张主管",
    estimatedCost: 3000,
    estimatedDuration: "6小时",
    priority: "高",
    status: "待执行"
  },
  {
    id: "plan3",
    type: "校准检测",
    scheduledDate: "2024-08-15",
    frequency: "每年",
    description: "精度校准，性能测试，出具校准报告",
    responsible: "校准中心",
    estimatedCost: 5000,
    estimatedDuration: "1天",
    priority: "高",
    status: "待安排"
  }
]

export default function EquipmentMaintenanceTab({ data }: EquipmentMaintenanceTabProps) {
  // 获取状态对应的颜色和图标
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "已完成":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        }
      case "进行中":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock className="h-4 w-4 text-blue-500" />
        }
      case "计划中":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Calendar className="h-4 w-4 text-amber-500" />
        }
      case "待执行":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <Clock className="h-4 w-4 text-purple-500" />
        }
      case "待安排":
        return {
          color: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <AlertCircle className="h-4 w-4 text-slate-500" />
        }
      default:
        return {
          color: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <AlertCircle className="h-4 w-4 text-slate-500" />
        }
    }
  }

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高":
        return "bg-red-50 text-red-700 border-red-200"
      case "中":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "低":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  // 统计数据
  const statistics = {
    total: mockMaintenanceRecords.length,
    completed: mockMaintenanceRecords.filter(r => r.status === "已完成").length,
    planned: mockMaintenancePlans.length,
    totalCost: mockMaintenanceRecords
      .filter(r => r.status === "已完成")
      .reduce((sum, r) => sum + r.cost, 0),
    upcomingMaintenance: mockMaintenancePlans.length > 0 ? mockMaintenancePlans[0] : null
  }

  // 排序记录，最新的在前面
  const sortedRecords = [...mockMaintenanceRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // 维护健康度分析
  const healthAnalysis = {
    overallHealth: 85,
    maintenanceCompliance: 92,
    avgMaintenanceInterval: 5.2,
    costTrend: "稳定",
    reliabilityScore: 88,
    nextMaintenanceDays: 15,
    criticalIssues: 0,
    preventiveRatio: 75
  }

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">设备健康度</p>
                <p className="text-2xl font-bold text-green-600">{healthAnalysis.overallHealth}%</p>
                <p className="text-xs text-green-600 mt-1">状态良好</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">维护计划</p>
                <p className="text-2xl font-bold text-amber-600">{statistics.planned}</p>
                <p className="text-xs text-amber-600 mt-1">{healthAnalysis.nextMaintenanceDays}天后</p>
              </div>
              <Calendar className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">可靠性评分</p>
                <p className="text-2xl font-bold text-blue-600">{healthAnalysis.reliabilityScore}</p>
                <p className="text-xs text-blue-600 mt-1">表现优秀</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">维护费用</p>
                <p className="text-2xl font-bold text-purple-600">￥{Math.round(statistics.totalCost / 1000)}K</p>
                <p className="text-xs text-purple-600 mt-1">趋势{healthAnalysis.costTrend}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 维护状态提醒 */}
      {statistics.upcomingMaintenance && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-900">即将进行的维护</h3>
                <p className="text-sm text-amber-700 mt-1">{statistics.upcomingMaintenance.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-amber-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>计划日期: {statistics.upcomingMaintenance.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>负责人: {statistics.upcomingMaintenance.responsible}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wrench className="h-3 w-3" />
                    <span>预计费用: ￥{statistics.upcomingMaintenance.estimatedCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左侧：维护记录时间轴 */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Layout className="h-5 w-5 text-blue-500" />
                维护记录
              </CardTitle>
              <CardDescription>最近的设备维护记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {sortedRecords.slice(0, 6).map((record, index) => {
                  const statusInfo = getStatusInfo(record.status)
                  const isLast = index === 5 || index === sortedRecords.length - 1
                  
                  return (
                    <div key={record.id}>
                      <div className="flex items-start gap-4">
                        {/* 时间轴线条 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            record.status === "已完成" ? "bg-green-500 border-green-500" :
                            record.status === "进行中" ? "bg-blue-500 border-blue-500" :
                            "bg-amber-500 border-amber-500"
                          }`} />
                          {!isLast && <div className="w-0.5 h-24 bg-slate-200 mt-2" />}
                        </div>
                        
                        {/* 维护信息 */}
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{record.type}</span>
                            <Badge className={statusInfo.color}>
                              {statusInfo.icon}
                              <span className="ml-1">{record.status}</span>
                            </Badge>
                            <span className="text-xs text-muted-foreground">{record.date}</span>
                          </div>
                          
                          <p className="text-sm text-slate-700 mb-2">{record.description}</p>
                          
                          <div className="text-xs text-slate-600 space-y-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{record.technician.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{record.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Wrench className="h-3 w-3" />
                                <span>￥{record.cost.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>{record.parts.length}个配件</span>
                              </div>
                            </div>
                            {record.nextDate && (
                              <div className="flex items-center gap-1 text-blue-600 mt-1">
                                <Calendar className="h-3 w-3" />
                                <span>下次维护: {record.nextDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：维护分析和状态 */}
        <div className="space-y-6">
          {/* 维护健康度分析 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                健康度分析
              </CardTitle>
              <CardDescription>设备维护健康状况评估</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600">整体健康度</span>
                  <span className="font-semibold">{healthAnalysis.overallHealth}%</span>
                </div>
                <Progress value={healthAnalysis.overallHealth} className="h-2" />
                <p className="text-xs text-slate-500 mt-1">设备状态良好，运行稳定</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600">维护合规性</span>
                  <span className="font-semibold">{healthAnalysis.maintenanceCompliance}%</span>
                </div>
                <Progress value={healthAnalysis.maintenanceCompliance} className="h-2" />
                <p className="text-xs text-slate-500 mt-1">维护计划执行良好</p>
              </div>

              <div className="pt-2 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">预防性维护比例</span>
                    <span className="font-semibold">{healthAnalysis.preventiveRatio}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">平均维护间隔</span>
                    <span className="font-semibold">{healthAnalysis.avgMaintenanceInterval}个月</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">关键问题数</span>
                    <span className="font-semibold text-green-600">{healthAnalysis.criticalIssues}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 维护状态概览 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                维护状态
              </CardTitle>
              <CardDescription>当前设备维护状态</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">维护状态</span>
                <Badge className={
                  data.maintenanceStatus === "正常" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : data.maintenanceStatus === "待维护" 
                      ? "bg-amber-50 text-amber-700 border-amber-200" 
                      : "bg-red-50 text-red-700 border-red-200"
                }>
                  {data.maintenanceStatus || "正常"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">上次维护</span>
                <span className="font-semibold">
                  {sortedRecords.length > 0 ? sortedRecords[0].date : "未记录"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">下次维护</span>
                <span className="font-semibold text-amber-600">
                  {healthAnalysis.nextMaintenanceDays}天后
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">保修状态</span>
                <Badge className={
                  data.warrantyExpiry && new Date(data.warrantyExpiry) > new Date() 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                }>
                  {data.warrantyExpiry && new Date(data.warrantyExpiry) > new Date() ? "保修中" : "已过保"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* 维护统计 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                维护统计
              </CardTitle>
              <CardDescription>维护相关数据统计</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">今年维护次数</span>
                <span className="font-semibold">3 次</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">平均维护费用</span>
                <span className="font-semibold">
                  ￥{Math.round(statistics.totalCost / statistics.completed).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">故障率</span>
                <span className="font-semibold text-green-600">2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">维护效率</span>
                <span className="font-semibold">优秀</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 