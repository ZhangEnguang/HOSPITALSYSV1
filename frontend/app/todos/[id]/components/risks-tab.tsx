"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Brain,
  BarChart4,
  Activity,
  Calendar,
  Shield,
  Filter,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 模拟风险数据
const riskData = [
  {
    id: 1,
    title: "研究数据丢失风险",
    description: "主要研究数据未完全备份，存在丢失风险",
    category: "数据安全",
    probability: "中",
    severity: "高",
    impact: "可能导致研究进度延迟3-6个月",
    status: "处理中",
    aiAnalysis: "建议立即实施多重备份策略，包括本地备份、云端备份和物理介质备份",
    createdAt: "2024-02-15",
    dueDate: "2024-03-15",
    owner: "张明",
  },
  {
    id: 2,
    title: "专利申请时效风险",
    description: "3项核心技术专利申请临近截止日期",
    category: "知识产权",
    probability: "高",
    severity: "高",
    impact: "可能导致核心技术无法获得专利保护",
    status: "紧急",
    aiAnalysis: "建议立即完成专利申请材料准备，优先处理最具价值的发明专利申请",
    createdAt: "2024-02-20",
    dueDate: "2024-03-01",
    owner: "李华",
  },
  {
    id: 3,
    title: "研究经费超支风险",
    description: "设备采购成本超出预算20%",
    category: "财务",
    probability: "高",
    severity: "中",
    impact: "可能需要削减其他研究环节的经费",
    status: "已解决",
    aiAnalysis: "建议重新评估设备需求，考虑租赁或共享设备方案，同时申请追加经费",
    createdAt: "2024-01-10",
    dueDate: "2024-02-10",
    owner: "王强",
  },
  {
    id: 4,
    title: "团队成员流失风险",
    description: "核心研究人员有离职倾向",
    category: "人力资源",
    probability: "中",
    severity: "高",
    impact: "可能导致关键技术断层和研究进度延迟",
    status: "监控中",
    aiAnalysis: "建议进行一对一沟通，了解核心成员需求，提供有竞争力的薪资和职业发展路径",
    createdAt: "2024-02-05",
    dueDate: "2024-04-05",
    owner: "刘芳",
  },
  {
    id: 5,
    title: "实验设备故障风险",
    description: "主要实验设备使用超过5年，故障率上升",
    category: "设备",
    probability: "中",
    severity: "中",
    impact: "可能导致实验数据不准确或实验中断",
    status: "处理中",
    aiAnalysis: "建议制定设备维护计划，准备备用设备，同时评估更新设备的可能性",
    createdAt: "2024-01-25",
    dueDate: "2024-03-25",
    owner: "赵明",
  },
  {
    id: 6,
    title: "研究方向偏离风险",
    description: "阶段性研究结果与预期存在较大差异",
    category: "研究内容",
    probability: "低",
    severity: "高",
    impact: "可能需要调整研究方向或重新设计实验",
    status: "监控中",
    aiAnalysis: "建议召开专家评审会，评估当前研究方向的可行性，必要时进行策略调整",
    createdAt: "2024-02-18",
    dueDate: "2024-04-18",
    owner: "孙伟",
  },
  {
    id: 7,
    title: "合作伙伴退出风险",
    description: "主要合作单位因战略调整可能退出合作",
    category: "合作关系",
    probability: "低",
    severity: "中",
    impact: "可能影响部分研究环节的推进",
    status: "已解决",
    aiAnalysis: "建议重新明确合作协议，同时拓展备选合作伙伴，减少对单一合作方的依赖",
    createdAt: "2024-01-15",
    dueDate: "2024-02-28",
    owner: "张华",
  },
]

// 风险预警数据
const riskAlerts = [
  {
    id: 1,
    title: "专利临近失效预警",
    description: "3项核心专利将在90天内到期，需要及时续费或评估放弃",
    severity: "高",
    date: "2024-06-15",
    type: "知识产权",
  },
  {
    id: 2,
    title: "数据安全异常检测",
    description: "检测到非常规时间的数据库访问模式，可能存在安全风险",
    severity: "高",
    date: "2024-03-10",
    type: "数据安全",
  },
  {
    id: 3,
    title: "经费使用异常",
    description: "设备采购类经费使用速度异常，可能导致后期经费不足",
    severity: "中",
    date: "2024-04-20",
    type: "财务",
  },
]

export default function RisksTab() {
  const [selectedRisk, setSelectedRisk] = useState(riskData[0]) // 默认选中第一个风险项
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  // 获取风险状态对应的颜色和图标
  const getRiskStatusInfo = (status: string) => {
    switch (status) {
      case "已解决":
        return { color: "bg-green-100 text-green-800 border-green-200", icon: <CheckCircle2 className="h-3.5 w-3.5" /> }
      case "处理中":
        return { color: "bg-blue-100 text-blue-800 border-blue-200", icon: <Activity className="h-3.5 w-3.5" /> }
      case "监控中":
        return { color: "bg-amber-100 text-amber-800 border-amber-200", icon: <Clock className="h-3.5 w-3.5" /> }
      case "紧急":
        return { color: "bg-red-100 text-red-800 border-red-200", icon: <AlertTriangle className="h-3.5 w-3.5" /> }
      default:
        return { color: "bg-slate-100 text-slate-800 border-slate-200", icon: <AlertCircle className="h-3.5 w-3.5" /> }
    }
  }

  // 获取风险严重性对应的颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "高":
        return "bg-red-100 text-red-800 border-red-200"
      case "中":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "低":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  // 获取风险可能性对应的颜色
  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case "高":
        return "bg-red-100 text-red-800 border-red-200"
      case "中":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "低":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  // 过滤风险数据
  const filteredRisks = riskData.filter((risk) => {
    const matchesStatus = statusFilter === "all" || risk.status === statusFilter
    const matchesCategory = categoryFilter === "all" || risk.category === categoryFilter
    const matchesSeverity = severityFilter === "all" || risk.severity === severityFilter
    return matchesStatus && matchesCategory && matchesSeverity
  })

  // 计算风险统计数据
  const riskStats = {
    total: riskData.length,
    high: riskData.filter((r) => r.severity === "高").length,
    medium: riskData.filter((r) => r.severity === "中").length,
    low: riskData.filter((r) => r.severity === "低").length,
    resolved: riskData.filter((r) => r.status === "已解决").length,
    inProgress: riskData.filter((r) => r.status === "处理中").length,
    urgent: riskData.filter((r) => r.status === "紧急").length,
    monitoring: riskData.filter((r) => r.status === "监控中").length,
  }

  // 获取所有风险类别
  const allCategories = Array.from(new Set(riskData.map((risk) => risk.category)))

  return (
    <div className="space-y-6">
      {/* 风险智能分析 */}
      <Card className="bg-gradient-to-br from-white via-white to-slate-50 border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">风险智能分析</CardTitle>
            </div>
          </div>
          <CardDescription>AI辅助风险识别与分析，帮助您提前预防和管理项目风险</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 风险列表 */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <div className="flex items-center mr-2">
                  <Filter className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">筛选:</span>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="紧急">紧急</SelectItem>
                    <SelectItem value="处理中">处理中</SelectItem>
                    <SelectItem value="监控中">监控中</SelectItem>
                    <SelectItem value="已解决">已解决</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue placeholder="类别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类别</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue placeholder="严重性" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有级别</SelectItem>
                    <SelectItem value="高">高</SelectItem>
                    <SelectItem value="中">中</SelectItem>
                    <SelectItem value="低">低</SelectItem>
                  </SelectContent>
                </Select>

                <div className="ml-auto text-sm text-muted-foreground">
                  显示 {filteredRisks.length} 项风险 (共 {riskData.length} 项)
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">风险项</TableHead>
                    <TableHead>类别</TableHead>
                    <TableHead>可能性</TableHead>
                    <TableHead>严重性</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRisks.map((risk) => (
                    <TableRow
                      key={risk.id}
                      className={selectedRisk?.id === risk.id ? "bg-primary/5" : ""}
                      onClick={() => setSelectedRisk(risk)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{risk.title}</span>
                          <span className="text-xs text-muted-foreground mt-1">{risk.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {risk.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getProbabilityColor(risk.probability)}>{risk.probability}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(risk.severity)}>{risk.severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskStatusInfo(risk.status).color}>
                          <span className="flex items-center gap-1">
                            {getRiskStatusInfo(risk.status).icon}
                            {risk.status}
                          </span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 风险详情和AI分析 */}
            <div>
              {selectedRisk ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-white">
                    <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      风险详情
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">风险名称：</span>
                        <span className="font-medium">{selectedRisk.title}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">影响分析：</span>
                        <span>{selectedRisk.impact}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">责任人：</span>
                        <span>{selectedRisk.owner}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">创建日期：</span>
                        <span>{selectedRisk.createdAt}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">截止日期：</span>
                        <span className={new Date(selectedRisk.dueDate) < new Date() ? "text-red-500 font-medium" : ""}>
                          {selectedRisk.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md bg-primary/5">
                    <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      AI风险分析
                    </h3>
                    <p className="text-sm">{selectedRisk.aiAnalysis}</p>
                  </div>

                  <div className="p-4 border rounded-md bg-white">
                    <h3 className="text-base font-semibold mb-2">风险矩阵位置</h3>
                    <div className="aspect-square relative bg-gradient-to-br from-green-50 via-amber-50 to-red-50 border rounded-md p-2">
                      {/* 风险矩阵网格 */}
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                        <div className="border-b border-r border-slate-200"></div>
                        <div className="border-b border-r border-slate-200"></div>
                        <div className="border-b border-slate-200"></div>
                        <div className="border-b border-r border-slate-200"></div>
                        <div className="border-b border-r border-slate-200"></div>
                        <div className="border-b border-slate-200"></div>
                        <div className="border-r border-slate-200"></div>
                        <div className="border-r border-slate-200"></div>
                        <div></div>
                      </div>

                      {/* 坐标轴标签 */}
                      <div className="absolute bottom-1 left-1 text-xs text-slate-500">低</div>
                      <div className="absolute bottom-1 right-1 text-xs text-slate-500">高</div>
                      <div className="absolute top-1 left-1 text-xs text-slate-500">高</div>
                      <div className="absolute top-1 right-1 text-xs text-red-500 font-medium">危险区</div>

                      {/* X轴标签 */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                        <span className="text-xs text-slate-500">可能性</span>
                      </div>

                      {/* Y轴标签 - 垂直文本 */}
                      <div className="absolute top-0 bottom-0 left-0 flex items-center">
                        <span className="text-xs text-slate-500 transform -rotate-90">严重性</span>
                      </div>

                      {/* 风险点 */}
                      <div
                        className="absolute w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow-md"
                        style={{
                          left: `${selectedRisk.probability === "高" ? 80 : selectedRisk.probability === "中" ? 50 : 20}%`,
                          top: `${selectedRisk.severity === "高" ? 20 : selectedRisk.severity === "中" ? 50 : 80}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        R
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 border rounded-md bg-slate-50">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">选择一个风险项查看详情</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 风险趋势分析 */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart4 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">风险趋势分析</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h4 className="text-sm font-medium mb-4 text-center">风险数量月度趋势</h4>
              <div className="flex items-end h-40 space-x-2">
                {[1, 2, 3, 4, 5, 6].map((month) => (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col-reverse">
                      <div
                        className="w-full bg-red-500 rounded-t-sm"
                        style={{ height: `${40 + Math.sin(month) * 20}px` }}
                      ></div>
                      <div className="w-full bg-amber-500" style={{ height: `${60 + Math.cos(month) * 20}px` }}></div>
                      <div
                        className="w-full bg-green-500 rounded-t-sm"
                        style={{ height: `${20 + Math.sin(month + 2) * 10}px` }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1">{month}月</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
                  <span className="text-xs">高风险</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-sm mr-1"></div>
                  <span className="text-xs">中风险</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                  <span className="text-xs">低风险</span>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h4 className="text-sm font-medium mb-4 text-center">风险解决率趋势</h4>
              <div className="relative h-40">
                <div className="absolute inset-0 flex flex-col justify-between">
                  <div className="border-b border-dashed border-gray-200 relative">
                    <span className="absolute -top-3 -left-2 text-xs text-gray-500">100%</span>
                  </div>
                  <div className="border-b border-dashed border-gray-200 relative">
                    <span className="absolute -top-3 -left-2 text-xs text-gray-500">75%</span>
                  </div>
                  <div className="border-b border-dashed border-gray-200 relative">
                    <span className="absolute -top-3 -left-2 text-xs text-gray-500">50%</span>
                  </div>
                  <div className="border-b border-dashed border-gray-200 relative">
                    <span className="absolute -top-3 -left-2 text-xs text-gray-500">25%</span>
                  </div>
                  <div className="border-b border-dashed border-gray-200 relative">
                    <span className="absolute -top-3 -left-2 text-xs text-gray-500">0%</span>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(79, 70, 229, 0.5)" />
                        <stop offset="100%" stopColor="rgba(79, 70, 229, 0)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,100 L0,70 C20,65 40,60 60,55 C80,50 100,45 120,40 C140,35 160,30 180,25 C200,20 220,15 240,15 C260,15 280,15 300,15 L300,100 Z"
                      fill="url(#gradient)"
                    />
                    <path
                      d="M0,70 C20,65 40,60 60,55 C80,50 100,45 120,40 C140,35 160,30 180,25 C200,20 220,15 240,15 C260,15 280,15 300,15"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                  <span className="text-xs">1月</span>
                  <span className="text-xs">2月</span>
                  <span className="text-xs">3月</span>
                  <span className="text-xs">4月</span>
                  <span className="text-xs">5月</span>
                  <span className="text-xs">6月</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 风险处理效率 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">风险处理效率</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-4 text-center">按类别处理效率（平均处理天数）</h4>
                <div className="space-y-3">
                  {[
                    { category: "数据安全", days: 12, color: "#4f46e5" },
                    { category: "知识产权", days: 8, color: "#0ea5e9" },
                    { category: "财务", days: 15, color: "#10b981" },
                    { category: "人力资源", days: 20, color: "#f59e0b" },
                    { category: "设备", days: 10, color: "#ef4444" },
                    { category: "研究内容", days: 18, color: "#8b5cf6" },
                    { category: "合作关系", days: 7, color: "#ec4899" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 text-sm truncate">{item.category}</div>
                      <div className="flex-1 mx-2">
                        <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(item.days / 20) * 100}%`,
                              backgroundColor: item.color,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-8 text-sm font-medium text-right">{item.days}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-4 text-center">处理时间趋势</h4>
                <div className="relative h-40">
                  <div className="absolute inset-0 flex flex-col justify-between">
                    <div className="border-b border-dashed border-gray-200"></div>
                    <div className="border-b border-dashed border-gray-200"></div>
                    <div className="border-b border-dashed border-gray-200"></div>
                    <div className="border-b border-dashed border-gray-200"></div>
                    <div className="border-b border-dashed border-gray-200"></div>
                  </div>

                  <div className="absolute inset-0 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <path
                        d="M0,20 C20,25 40,30 60,35 C80,40 100,45 120,50 C140,55 160,60 180,65 C200,70 220,75 240,80 C260,85 280,90 300,92"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                      <path
                        d="M0,40 C20,42 40,44 60,46 C80,48 100,50 120,52 C140,54 160,56 180,58 C200,60 220,62 240,64 C260,66 280,68 300,70"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2"
                      />
                      <path
                        d="M0,70 C20,68 40,66 60,64 C80,62 100,60 120,58 C140,56 160,54 180,52 C200,50 220,48 240,46 C260,44 280,42 300,40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                    <span className="text-xs">1月</span>
                    <span className="text-xs">2月</span>
                    <span className="text-xs">3月</span>
                    <span className="text-xs">4月</span>
                    <span className="text-xs">5月</span>
                    <span className="text-xs">6月</span>
                  </div>
                </div>

                <div className="flex justify-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
                    <span className="text-xs">最长处理天数</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-sm mr-1"></div>
                    <span className="text-xs">平均处理天数</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                    <span className="text-xs">最短处理天数</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">风险预警与异常检测</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  className={alert.severity === "高" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}
                >
                  <div className="flex items-start">
                    <AlertTriangle
                      className={`h-4 w-4 ${alert.severity === "高" ? "text-red-500" : "text-amber-500"} mt-0.5 mr-2`}
                    />
                    <div>
                      <AlertTitle className="text-sm font-medium mb-1">{alert.title}</AlertTitle>
                      <AlertDescription className="text-xs">
                        <p>{alert.description}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {alert.date}
                          </span>
                          <Badge
                            className={
                              alert.severity === "高"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }
                          >
                            {alert.severity}优先级
                          </Badge>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

