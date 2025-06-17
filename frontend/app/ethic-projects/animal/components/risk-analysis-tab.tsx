"use client"

import React, { useState } from "react"
import { 
  TrendingUp, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Target,
  Shield,
  Download,
  RefreshCw,
  Clock,
  Users,
  Heart,
  Database,
  Coins,
  Maximize2,
  X,
  Calendar,
  ShieldCheck,
  HeartHandshake,
  TrendingDown,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// 专业风险分析数据模型
const riskAnalysisData = {
  // 1. 项目进度与时效性风险
  projectProgressRisk: {
    phases: [
      {
        id: 1,
        name: "伦理审查",
        plannedStart: "2024-01-15",
        plannedEnd: "2024-02-15",
        actualStart: "2024-01-15",
        actualEnd: "2024-02-20",
        status: "延迟", // 延迟、正常、进行中、未开始
        progress: 100
      },
      {
        id: 2,
        name: "实验准备",
        plannedStart: "2024-02-16",
        plannedEnd: "2024-03-30",
        actualStart: "2024-02-21",
        actualEnd: "2024-04-05",
        status: "延迟",
        progress: 100
      },
      {
        id: 3,
        name: "实验执行",
        plannedStart: "2024-04-01",
        plannedEnd: "2024-07-31",
        actualStart: "2024-04-06",
        actualEnd: "2024-08-10",
        status: "延迟",
        progress: 100
      },
      {
        id: 4,
        name: "数据分析",
        plannedStart: "2024-08-01",
        plannedEnd: "2024-09-15",
        actualStart: "2024-08-11",
        actualEnd: null,
        status: "进行中",
        progress: 65
      }
    ],
    totalDelay: 25, // 总延误率百分比
    completedPhases: 3,
    currentPhase: 4
  },

  // 2. 伦理审查结果与合规性风险
  ethicsComplianceRisk: {
    reviewResults: [
      { type: "批准", count: 45, percentage: 60 },
      { type: "修改后批准", count: 20, percentage: 27 },
      { type: "修改后重审", count: 8, percentage: 11 },
      { type: "不批准", count: 2, percentage: 2 }
    ],
    modificationFreq: {
      average: 1.8,
      maximum: 5
    },
    commonIssues: [
      { issue: "样本量问题", frequency: 15 },
      { issue: "麻醉不足", frequency: 12 },
      { issue: "疼痛评估缺失", frequency: 10 },
      { issue: "终点不明确", frequency: 8 },
      { issue: "饲养条件", frequency: 6 }
    ],
    responseTime: 8.5, // 平均回应时间(天)
    totalProjects: 75,
    approvalRate: 92,
    averageReviewTime: 15.2
  },

  // 3. 实验动物福利与数据波动风险
  animalWelfareRisk: {
    animalUsage: {
      approved: 85,
      actual: 82,
      excess: 0
    },
    welfareIndicators: [
      { indicator: "死亡率", baseline: 3, current: 2.1, trend: "down", risk: "低" },
      { indicator: "发病率", baseline: 8, current: 12, trend: "up", risk: "中" },
      { indicator: "体重下降", baseline: 5, current: 7, trend: "up", risk: "中" },
      { indicator: "行为异常", baseline: 2, current: 1.5, trend: "down", risk: "低" }
    ],
    painScores: {
      low: 70,    // 低疼痛百分比
      medium: 25, // 中疼痛百分比
      high: 5     // 高疼痛百分比
    },
    dataMissing: 8 // 数据缺失率
  },

  // 4. 数据质量与完整性风险
  dataQualityRisk: {
    submissionCompleteness: [
      { material: "研究方案", completeness: 95 },
      { material: "SOP文件", completeness: 88 },
      { material: "阶段报告", completeness: 92 },
      { material: "记录表格", completeness: 78 }
    ],
    recordingCompliance: 85, // 记录规范性百分比
    dataConsistency: 92,     // 数据一致性
    followUpRate: 88         // 随访完成率
  },

  // 5. 资源与可持续性风险
  sustainabilityRisk: {
    facilityUsage: 78,    // 笼位占用率
    staffTurnover: 15,    // 人员变更率
    budgetUtilization: 82, // 预算使用率
    resourceEfficiency: [
      { resource: "笼位资源", efficiency: 85 },
      { resource: "设备使用", efficiency: 92 },
      { resource: "人员配置", efficiency: 88 },
      { resource: "时间管理", efficiency: 76 }
    ]
  }
}

// 甘特图组件
const GanttChart = ({ data, isFullScreen = false }: { data: any, isFullScreen?: boolean }) => {
  const today = new Date('2024-08-20') // 当前日期
  const projectStart = new Date('2024-01-15')
  const projectEnd = new Date('2024-11-15')
  const totalDays = Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24))
  
  // 计算位置的辅助函数
  const getPosition = (date: string) => {
    const d = new Date(date)
    const daysDiff = Math.ceil((d.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, Math.min(100, (daysDiff / totalDays) * 100))
  }
  
  // 计算日期差天数
  const getDaysDiff = (start: string, end: string | null) => {
    if (!end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  }
  
  // 获取状态颜色和样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "延迟": 
        return {
          bg: "bg-red-500",
          border: "border-red-600",
          text: "text-white",
          shadow: "shadow-red-200"
        }
      case "正常": 
        return {
          bg: "bg-green-500", 
          border: "border-green-600",
          text: "text-white",
          shadow: "shadow-green-200"
        }
      case "进行中": 
        return {
          bg: "bg-blue-500",
          border: "border-blue-600", 
          text: "text-white",
          shadow: "shadow-blue-200"
        }
      case "未开始": 
        return {
          bg: "bg-gray-200",
          border: "border-gray-300",
          text: "text-gray-600",
          shadow: "shadow-gray-100"
        }
      default: 
        return {
          bg: "bg-gray-400",
          border: "border-gray-500",
          text: "text-white",
          shadow: "shadow-gray-200"
        }
    }
  }
  
  // 获取状态徽章颜色
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "延迟": return "text-red-700 bg-red-100 border-red-300"
      case "正常": return "text-green-700 bg-green-100 border-green-300"
      case "进行中": return "text-blue-700 bg-blue-100 border-blue-300"
      case "未开始": return "text-gray-700 bg-gray-100 border-gray-300"
      default: return "text-gray-700 bg-gray-100 border-gray-300"
    }
  }
  
  const containerWidth = isFullScreen ? '100%' : '100%'
  const barHeight = isFullScreen ? 24 : 20
  
  // 只显示有实际进展的阶段
  const activePhases = data.phases.filter((phase: any) => 
    phase.status !== "未开始" || phase.progress > 0
  )
  
  return (
    <div className="space-y-6">
      {/* 时间轴容器 */}
      <div className="w-full bg-gray-50 rounded-lg p-4">
        {/* 月份标签 */}
        <div className="flex justify-between text-xs font-medium text-gray-600 mb-3 px-2">
          <span>1月</span>
          <span>3月</span>
          <span>5月</span>
          <span>7月</span>
          <span>9月</span>
          <span>11月</span>
        </div>
        
        {/* 时间轴背景 */}
        <div className="relative w-full h-3 bg-white rounded-full border border-gray-200 mb-6 shadow-inner">
          {/* 月份网格线 */}
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 w-px h-3 bg-gray-300"
              style={{ left: `${(i + 1) * 16.67}%` }}
            />
          ))}
          
          {/* 当前时间指示器 */}
          <div
            className="absolute top-0 w-0.5 h-3 bg-red-500 rounded-full"
            style={{ left: `${getPosition(today.toISOString().split('T')[0])}%` }}
            title={`今天: ${today.toLocaleDateString('zh-CN')}`}
          />
        </div>
        
        {/* 甘特图主体 */}
        <div className="space-y-4">
          {activePhases.map((phase: any) => {
            const plannedStart = getPosition(phase.plannedStart)
            const plannedWidth = (getDaysDiff(phase.plannedStart, phase.plannedEnd) / totalDays) * 100
            const actualStart = phase.actualStart ? getPosition(phase.actualStart) : plannedStart
            const actualWidth = phase.actualEnd 
              ? (getDaysDiff(phase.actualStart || phase.plannedStart, phase.actualEnd) / totalDays) * 100
              : phase.status === "进行中" 
                ? (getDaysDiff(phase.actualStart || phase.plannedStart, today.toISOString().split('T')[0]) / totalDays) * 100
                : 0
            
            const statusStyle = getStatusStyle(phase.status)
            const delayDays = phase.actualEnd && getDaysDiff(phase.plannedEnd, phase.actualEnd) > 0 
              ? getDaysDiff(phase.plannedEnd, phase.actualEnd) : 0
            
            return (
              <div key={phase.id} className="group">
                {/* 阶段信息 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-medium text-gray-800 min-w-0 flex-1">
                      {phase.name}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-2 py-0.5 border ${getStatusBadgeColor(phase.status)} font-medium`}
                    >
                      {phase.status}
                    </Badge>
                    {delayDays > 0 && (
                      <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded">
                        延迟{delayDays}天
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {phase.progress}%
                  </div>
                </div>
                
                {/* 进度条容器 */}
                <div className="relative w-full" style={{ height: `${barHeight}px` }}>
                  {/* 计划时间背景条 */}
                  <div
                    className="absolute h-full bg-gray-200 rounded-full border border-gray-300"
                    style={{
                      left: `${plannedStart}%`,
                      width: `${plannedWidth}%`
                    }}
                  />
                  
                  {/* 实际进度条 */}
                  {actualWidth > 0 && (
                    <div
                      className={`absolute h-full ${statusStyle.bg} ${statusStyle.border} rounded-full border shadow-sm ${statusStyle.shadow} transition-all duration-300 group-hover:shadow-md`}
                      style={{
                        left: `${actualStart}%`,
                        width: `${actualWidth}%`
                      }}
                    >
                      {/* 进度条内文字 */}
                      <div className={`absolute inset-0 flex items-center justify-center ${statusStyle.text} text-xs font-medium`}>
                        {actualWidth > 8 ? `${phase.progress}%` : ''}
                      </div>
                    </div>
                  )}
                  
                  {/* 计划结束时间标记线（延迟时显示） */}
                  {phase.status === "延迟" && (
                    <div
                      className="absolute top-0 w-px h-full bg-red-400 opacity-80"
                      style={{ left: `${plannedStart + plannedWidth}%` }}
                      title="计划结束时间"
                    />
                  )}
                </div>
                
                {/* 时间信息 */}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{phase.plannedStart} ~ {phase.plannedEnd}</span>
                  <span>
                    {phase.actualStart ? `实际: ${phase.actualStart}` : '未开始'}
                    {phase.actualEnd ? ` ~ ${phase.actualEnd}` : ''}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* 进度说明 */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 bg-gray-200 rounded border border-gray-300"></div>
            <span>计划时间</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>进行中</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>已完成</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>延迟</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-px h-3 bg-red-400"></div>
            <span>计划结束</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 项目进度详细统计组件
const ProjectProgressDetails = ({ data }: { data: any }) => {
  const completedPhases = data.phases.filter((p: any) => p.progress === 100).length
  const delayedPhases = data.phases.filter((p: any) => p.status === "延迟").length
  const inProgressPhases = data.phases.filter((p: any) => p.status === "进行中").length
  const totalDays = 320 // 项目总天数
  
  const calculateDelayDays = (phase: any) => {
    if (!phase.actualEnd || !phase.actualStart) return 0
    const plannedDays = Math.ceil((new Date(phase.plannedEnd).getTime() - new Date(phase.plannedStart).getTime()) / (1000 * 60 * 60 * 24))
    const actualDays = Math.ceil((new Date(phase.actualEnd).getTime() - new Date(phase.actualStart).getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, actualDays - plannedDays)
  }
  
  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-5 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{totalDays}</div>
          <div className="text-sm text-blue-600 mt-1">项目总天数</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{completedPhases}</div>
          <div className="text-sm text-green-600 mt-1">已完成阶段</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{inProgressPhases}</div>
          <div className="text-sm text-orange-600 mt-1">进行中阶段</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{delayedPhases}</div>
          <div className="text-sm text-red-600 mt-1">延迟阶段</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{data.totalDelay}%</div>
          <div className="text-sm text-purple-600 mt-1">总延误率</div>
        </div>
      </div>
      
      {/* 详细数据表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-medium">阶段名称</th>
              <th className="text-left p-3 font-medium">计划开始</th>
              <th className="text-left p-3 font-medium">计划结束</th>
              <th className="text-left p-3 font-medium">实际开始</th>
              <th className="text-left p-3 font-medium">实际结束</th>
              <th className="text-center p-3 font-medium">计划天数</th>
              <th className="text-center p-3 font-medium">实际天数</th>
              <th className="text-center p-3 font-medium">状态</th>
              <th className="text-center p-3 font-medium">延误天数</th>
            </tr>
          </thead>
          <tbody>
            {data.phases.map((phase: any) => {
              const plannedDays = Math.ceil((new Date(phase.plannedEnd).getTime() - new Date(phase.plannedStart).getTime()) / (1000 * 60 * 60 * 24))
              const actualDays = phase.actualEnd && phase.actualStart ? 
                Math.ceil((new Date(phase.actualEnd).getTime() - new Date(phase.actualStart).getTime()) / (1000 * 60 * 60 * 24)) : 0
              const delayDays = calculateDelayDays(phase)
              
              return (
                <tr key={phase.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium">{phase.name}</td>
                  <td className="p-3 text-gray-600">{phase.plannedStart}</td>
                  <td className="p-3 text-gray-600">{phase.plannedEnd}</td>
                  <td className="p-3 text-gray-600">{phase.actualStart || '-'}</td>
                  <td className="p-3 text-gray-600">{phase.actualEnd || '-'}</td>
                  <td className="p-3 text-center">{plannedDays}</td>
                  <td className="p-3 text-center">{actualDays || '-'}</td>
                  <td className="p-3 text-center">
                    <Badge 
                      variant="outline" 
                      className={`text-xs border ${getStatusTextColor(phase.status)}`}
                    >
                      {phase.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    {delayDays > 0 ? (
                      <span className="text-red-600 font-medium">+{delayDays}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
  
  function getStatusTextColor(status: string) {
    switch (status) {
      case "延迟": return "text-red-600 bg-red-50 border-red-200"
      case "正常": return "text-green-600 bg-green-50 border-green-200"
      case "进行中": return "text-orange-600 bg-orange-50 border-orange-200"
      case "未开始": return "text-gray-600 bg-gray-50 border-gray-200"
      default: return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }
}

// 高频问题排行榜
const IssueRankingChart = ({ data }: { data: any[] }) => {
  const maxFreq = Math.max(...data.map(item => item.frequency))
  
  // 获取排名数字的颜色样式
  const getRankingTextColor = (index: number) => {
    switch (index) {
      case 0: // 第1名 - 深红色
        return "text-red-500 font-bold"
      case 1: // 第2名 - 中红色
        return "text-red-400 font-bold"
      case 2: // 第3名 - 浅红色
        return "text-red-300 font-bold"
      default: // 第4-5名 - 黑色字体
        return "text-gray-700 font-medium"
    }
  }
  
  // 模拟趋势数据（实际项目中应该从数据源获取）
  const getTrend = (index: number) => {
    const trends = ['up', 'up', 'down', 'up', 'down'] // 示例趋势数据
    return trends[index] || 'stable'
  }
  
  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((item, index) => {
        const trend = getTrend(index)
        return (
          <div key={index} className="flex items-center gap-3 py-1">
            <div className={`text-sm ${getRankingTextColor(index)}`}>
              {index + 1}
            </div>
            <span className="text-sm text-gray-700 flex-1">{item.issue}</span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-1.5 bg-red-500 rounded-full"
                  style={{ width: `${(item.frequency / maxFreq) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-900 min-w-0">{item.frequency}</span>
                {trend === 'up' && (
                  <ArrowUp className="h-3 w-3 text-red-500" />
                )}
                {trend === 'down' && (
                  <ArrowDown className="h-3 w-3 text-green-500" />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// 紧凑的饼图组件
const CompactPieChart = ({ data }: { data: any[] }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  const size = 140
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  
  let cumulativePercentage = 0
  
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
  
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.count / total) * 100
            const circumference = 2 * Math.PI * radius
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -((cumulativePercentage / 100) * circumference)
            
            const color = colors[index % colors.length]
            
            const result = (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            )
            
            cumulativePercentage += percentage
            return result
          })}
        </svg>
        
        {/* 中心数字 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{total}</div>
            <div className="text-sm text-gray-500">项目</div>
          </div>
        </div>
      </div>
      
      {/* 图例 - 右侧 */}
      <div className="space-y-1">
        {data.map((item, index) => {
          const color = colors[index % colors.length]
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-600">{item.type}</span>
              <span className="font-medium text-gray-800">{item.count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}





// 堆叠柱状图组件
const StackedBarChart = ({ data }: { data: any[] }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  
  return (
    <div className="space-y-3">
      <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
        {data.map((item, index) => {
          const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
          return (
            <div
              key={index}
              className="h-full flex items-center justify-center text-xs font-medium text-white"
              style={{ 
                width: `${(item.count / total) * 100}%`,
                backgroundColor: colors[index % colors.length]
              }}
            >
              {item.percentage}%
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {data.map((item, index) => {
          const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
          return (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span>{item.type}: {item.count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 多指标趋势图
const WelfareIndicatorChart = ({ data }: { data: any[] }) => {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span>{item.indicator}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${
                item.trend === 'up' ? 'text-red-500' : 'text-green-500'
              }`}>
                {item.current}%
              </span>
              <Badge 
                variant={item.risk === "低" ? "default" : item.risk === "中" ? "secondary" : "destructive"}
                className="text-xs"
              >
                {item.risk}风险
              </Badge>
            </div>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${
                item.trend === 'up' ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(item.current, 100)}%` }}
            />
            {/* 基线标记 */}
            <div 
              className="absolute top-0 w-0.5 h-2 bg-blue-600"
              style={{ left: `${(item.baseline / Math.max(item.current, item.baseline, 20)) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">
            基线: {item.baseline}% | 当前: {item.current}%
          </div>
        </div>
      ))}
    </div>
  )
}

// 雷达完整性图
const CompletenessRadar = ({ data }: { data: any[] }) => {
  const size = 120
  const center = size / 2
  const radius = size / 2 - 20
  const angleStep = (2 * Math.PI) / data.length
  
  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2
    const value = item.completeness / 100
    const x = center + radius * value * Math.cos(angle)
    const y = center + radius * value * Math.sin(angle)
    return { x, y }
  })
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z'
  
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size}>
        {/* 背景网格 */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
          <polygon
            key={index}
            points={data.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2
              const x = center + radius * scale * Math.cos(angle)
              const y = center + radius * scale * Math.sin(angle)
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* 轴线 */}
        {data.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2
          const x = center + radius * Math.cos(angle)
          const y = center + radius * Math.sin(angle)
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          )
        })}
        
        {/* 数据区域 */}
        <path
          d={pathData}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        
        {/* 数据点 */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#3b82f6"
          />
        ))}
      </svg>
      
      <div className="space-y-1 text-xs">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.material}</span>
            <span className="font-medium">{item.completeness}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 精美的资源效率柱状图
const ResourceBarChart = ({ data }: { data: any[] }) => {
  return (
    <div className="flex items-end justify-between gap-4 h-20 px-1">
      {data.map((item, index) => {
        // 简化颜色方案 - 根据效率值选择单一纯色
        const getColor = (efficiency: number) => {
          if (efficiency >= 90) return 'bg-emerald-500'
          if (efficiency >= 80) return 'bg-blue-500'
          if (efficiency >= 70) return 'bg-amber-500'
          return 'bg-red-500'
        }
        
        const color = getColor(item.efficiency)
        const barHeight = (item.efficiency / 100) * 100 // 基于100%计算高度
        
        return (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            {/* 数值 - 简约标签 */}
            <div className="text-xs font-semibold text-slate-700">
              {item.efficiency}%
            </div>
            
            {/* 柱子 - 现代简约风格 */}
            <div className="w-full max-w-10 h-12 bg-slate-100 rounded-md relative overflow-hidden">
              <div 
                className={`absolute bottom-0 w-full ${color} rounded-md transition-all duration-700 ease-out hover:opacity-80`}
                style={{ height: `${barHeight}%` }}
              />
            </div>
            
            {/* 标签 - 简洁文字 */}
            <div className="text-xs text-slate-600 text-center font-medium leading-tight">
              {item.resource}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface RiskAnalysisTabProps {
  todo?: any
}

export default function RiskAnalysisTab({ todo }: RiskAnalysisTabProps) {
  const { toast } = useToast()
  const [data] = useState(riskAnalysisData)
  const [showProgressDetails, setShowProgressDetails] = useState(false)


  // 获取风险等级颜色
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "低风险": return "text-green-600 bg-green-50 border-green-200"
      case "中风险": return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "高风险": return "text-red-600 bg-red-50 border-red-200"
      default: return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  // 导出报告
  const handleExportReport = () => {
    toast({
      title: "导出风险分析报告",
      description: "正在生成专业风险分析报告..."
    })
  }

  // 刷新数据
  const handleRefreshData = () => {
    toast({
      title: "数据已刷新",
      description: "所有风险分析数据已更新至最新状态"
    })
  }

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                动物伦理项目风险分析
                <Badge variant="outline" className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2">
                  专业分析
                </Badge>
              </h1>
              <p className="text-slate-500">基于五维风险模型的综合风险评估与预警</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleRefreshData} className="border-slate-300 hover:bg-slate-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新数据
            </Button>
            <Button size="sm" onClick={handleExportReport} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-md">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>
      </div>

      {/* 风险分析卡片网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. 项目进度与时效性风险 */}
        <Card 
          className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50/30 to-slate-50/50"
          onClick={() => setShowProgressDetails(true)}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  项目进度与时效性风险
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  监控各阶段进展，识别时间延误和推进障碍
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-blue-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowProgressDetails(true)
                }}
              >
                <Maximize2 className="h-4 w-4 text-blue-600" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <GanttChart data={data.projectProgressRisk} isFullScreen={false} />
          </CardContent>
        </Card>

        {/* 2. 伦理审查结果与合规性风险 */}
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-green-50/40 to-slate-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              伦理审查结果与合规性风险
            </CardTitle>
            <p className="text-xs text-slate-500">
              评估项目合规能力，识别高频问题和风险项目
            </p>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            {/* 上层：主要统计图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 审查结果图表 */}
              <div className="py-2">
                <div className="text-sm font-medium text-slate-700 mb-4">审查结果分布</div>
                <div className="flex justify-center">
                  <CompactPieChart data={data.ethicsComplianceRisk.reviewResults} />
                </div>
              </div>
              
              {/* 高频问题 */}
              <div className="py-2">
                <div className="text-sm font-medium text-slate-700 mb-4">高频问题TOP5</div>
                <IssueRankingChart data={data.ethicsComplianceRisk.commonIssues} />
              </div>
            </div>
            
            {/* 中层：关键指标卡片 */}
            <div className="grid grid-cols-4 gap-4 text-xs px-2">
              <div className="text-center p-3 bg-blue-50 rounded border border-blue-200">
                <div className="font-medium text-blue-600 mb-1">平均回应时间</div>
                <div className="text-blue-800 font-bold">{data.ethicsComplianceRisk.responseTime}天</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded border border-orange-200">
                <div className="font-medium text-orange-600 mb-1">平均修改次数</div>
                <div className="text-orange-800 font-bold">{data.ethicsComplianceRisk.modificationFreq.average}次</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                <div className="font-medium text-green-600 mb-1">一次通过率</div>
                <div className="text-green-800 font-bold">68%</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded border border-purple-200">
                <div className="font-medium text-purple-600 mb-1">合规评分</div>
                <div className="text-purple-800 font-bold">85分</div>
              </div>
            </div>
            
            {/* 下层：趋势和风险统计 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 近期审查趋势 */}
              <div className="p-2">
                <div className="text-sm font-medium text-slate-700 mb-3">近期审查趋势</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded p-3 text-center">
                    <div className="text-xs text-slate-600 mb-2">本月提交</div>
                    <div className="text-lg font-bold text-slate-800">23</div>
                    <div className="text-xs text-green-600 mt-1">↑15%</div>
                  </div>
                  <div className="bg-slate-50 rounded p-3 text-center">
                    <div className="text-xs text-slate-600 mb-2">待审查</div>
                    <div className="text-lg font-bold text-orange-600">8</div>
                    <div className="text-xs text-red-600 mt-1">↑2</div>
                  </div>
                  <div className="bg-slate-50 rounded p-3 text-center">
                    <div className="text-xs text-slate-600 mb-2">超时项目</div>
                    <div className="text-lg font-bold text-red-600">3</div>
                    <div className="text-xs text-red-600 mt-1">需关注</div>
                  </div>
                </div>
              </div>
              
              {/* 风险等级分布 */}
              <div className="p-2">
                <div className="text-sm font-medium text-slate-700 mb-3">风险等级分布</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">高风险项目</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-1/4 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-800 min-w-0">2</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">中风险项目</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-3/5 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-800 min-w-0">12</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">低风险项目</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-full h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-800 min-w-0">61</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. 实验动物福利与数据波动风险 */}
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-red-50/40 to-slate-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-red-600" />
              实验动物福利与数据波动风险
            </CardTitle>
            <p className="text-xs text-slate-500">
              实时监控动物福利，预警潜在福利损害风险
            </p>
          </CardHeader>
          <CardContent>
            <WelfareIndicatorChart data={data.animalWelfareRisk.welfareIndicators} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-green-600 font-medium">低疼痛</div>
                <div className="text-green-800">{data.animalWelfareRisk.painScores.low}%</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="text-yellow-600 font-medium">中疼痛</div>
                <div className="text-yellow-800">{data.animalWelfareRisk.painScores.medium}%</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="text-red-600 font-medium">高疼痛</div>
                <div className="text-red-800">{data.animalWelfareRisk.painScores.high}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. 资源与可持续性风险 */}
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-gradient-to-br from-yellow-50/40 to-slate-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-yellow-600" />
              资源与可持续性风险
            </CardTitle>
            <p className="text-xs text-slate-500">
              评估项目资源消耗，预警资源不足或关键人员流失风险
            </p>
          </CardHeader>
          <CardContent className="pt-0 pb-4 space-y-4">
            {/* 资源效率图表 */}
            <div>
              <div className="text-sm font-medium text-slate-700 mb-3">资源效率分析</div>
              <ResourceBarChart data={data.sustainabilityRisk.resourceEfficiency} />
            </div>
            
            {/* 关键指标 */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-3 bg-yellow-50 rounded border border-yellow-200">
                <div className="font-medium text-yellow-600 mb-1">笼位占用率</div>
                <div className="text-yellow-800 font-bold text-sm">{data.sustainabilityRisk.facilityUsage}%</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded border border-orange-200">
                <div className="font-medium text-orange-600 mb-1">人员变更率</div>
                <div className="text-orange-800 font-bold text-sm">{data.sustainabilityRisk.staffTurnover}%</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                <div className="font-medium text-green-600 mb-1">预算使用率</div>
                <div className="text-green-800 font-bold text-sm">{data.sustainabilityRisk.budgetUtilization}%</div>
              </div>
            </div>
            
            {/* 风险预警 */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700">风险预警</div>
              <div className="text-xs text-slate-600 leading-relaxed p-3 bg-slate-50 rounded border border-slate-200">
                当前资源配置整体稳定，设备利用率保持在92%的优良水平，笼位资源充足能够满足项目需求。但需要重点关注人员变更率达15%，存在一定的人员流失风险。时间管理效率为76%，建议加强项目进度控制和任务分配优化，确保资源的可持续性和项目的顺利推进。
              </div>
            </div>
            

          </CardContent>
        </Card>



      </div>

      {/* 项目进度详细分析弹框 */}
      <Dialog open={showProgressDetails} onOpenChange={setShowProgressDetails}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              项目进度与时效性风险详细分析
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* 全屏甘特图 */}
            <div className="border rounded-lg p-4 bg-white">
              <h3 className="text-lg font-medium mb-4">项目进度甘特图</h3>
              <div className="overflow-x-auto">
                <GanttChart data={data.projectProgressRisk} isFullScreen={true} />
              </div>
            </div>
            
            {/* 详细统计分析 */}
            <div className="border rounded-lg p-4 bg-white">
              <h3 className="text-lg font-medium mb-4">详细数据分析</h3>
              <ProjectProgressDetails data={data.projectProgressRisk} />
            </div>
          </div>
        </DialogContent>
      </Dialog>



    </div>
  )
} 