import { BarChart3, TrendingUp, PieChart, FileText, Award, Users, Target, Calendar, Wallet } from "lucide-react"
import React from "react"
import dynamic from "next/dynamic"

// 动态导入图表组件以避免SSR问题
const DynamicOverviewPieChart = dynamic(() => import("../overview-pie-chart"), { ssr: false })
const DynamicOverviewBarChart = dynamic(() => import("../overview-bar-chart"), { ssr: false })
const DynamicOverviewLineChart = dynamic(() => import("../overview-line-chart"), { ssr: false })

// 项目进度分布数据
const projectProgressData = [
  { name: "进行中", value: 42 },
  { name: "已完成", value: 38 },
  { name: "准备中", value: 16 },
  { name: "已终止", value: 4 }
]

// 任务完成情况数据
const taskCompletionData = [
  { month: "1月", 已完成: 12, 进行中: 8, 逾期: 2 },
  { month: "2月", 已完成: 15, 进行中: 9, 逾期: 3 },
  { month: "3月", 已完成: 18, 进行中: 12, 逾期: 2 },
  { month: "4月", 已完成: 21, 进行中: 14, 逾期: 4 },
  { month: "5月", 已完成: 25, 进行中: 16, 逾期: 3 },
  { month: "6月", 已完成: 28, 进行中: 15, 逾期: 5 }
]

// 经费使用数据
const fundingData = [
  { month: "1月", 申请经费: 1500000, 到账经费: 1200000, 使用经费: 800000 },
  { month: "2月", 申请经费: 1800000, 到账经费: 1600000, 使用经费: 1200000 },
  { month: "3月", 申请经费: 2100000, 到账经费: 1900000, 使用经费: 1500000 },
  { month: "4月", 申请经费: 2400000, 到账经费: 2200000, 使用经费: 1800000 },
  { month: "5月", 申请经费: 2700000, 到账经费: 2500000, 使用经费: 2100000 },
  { month: "6月", 申请经费: 3000000, 到账经费: 2800000, 使用经费: 2400000 }
]

// 图表类型定义
export type ChartType = "overview" | "projects" | "funds" | "results"

// 图表配置接口
export interface ChartConfig {
  id: string
  title: string
  description?: string
  type: ChartType[]
  icon: React.ReactNode
  size?: "normal" | "large"
  renderChart: () => React.ReactNode
}

// 综合概览图表
export const overviewCharts: ChartConfig[] = [
  {
    id: "project-progress",
    title: "项目进度分布",
    description: "各阶段项目数量统计",
    type: ["overview"],
    icon: React.createElement(PieChart, { className: "h-4 w-4" }),
    renderChart: () => React.createElement(DynamicOverviewPieChart, { data: projectProgressData })
  },
  {
    id: "task-completion",
    title: "任务完成情况",
    description: "近期任务完成趋势",
    type: ["overview"],
    icon: React.createElement(TrendingUp, { className: "h-4 w-4" }),
    renderChart: () => React.createElement(DynamicOverviewBarChart, { data: taskCompletionData })
  },
  {
    id: "funding-overview",
    title: "经费概览",
    description: "总体经费使用情况",
    type: ["overview"],
    icon: React.createElement(Wallet, { className: "h-4 w-4" }),
    renderChart: () => React.createElement(DynamicOverviewLineChart, { data: fundingData })
  }
]

// 项目分析图表
export const projectCharts: ChartConfig[] = [
  {
    id: "project-type",
    title: "项目类型分布",
    description: "按项目类型统计数量",
    type: ["projects"],
    icon: React.createElement(PieChart, { className: "h-4 w-4" }),
    renderChart: () => React.createElement("div", null, "项目类型分布图表")
  },
  {
    id: "project-timeline",
    title: "项目时间线",
    description: "项目进展时间轴",
    type: ["projects"],
    icon: React.createElement(Calendar, { className: "h-4 w-4" }),
    size: "large",
    renderChart: () => React.createElement("div", null, "项目时间线图表")
  },
  {
    id: "team-workload",
    title: "团队工作量",
    description: "团队成员工作量分布",
    type: ["projects"],
    icon: React.createElement(Users, { className: "h-4 w-4" }),
    renderChart: () => React.createElement("div", null, "团队工作量图表")
  }
]

// 经费统计图表
export const fundingCharts: ChartConfig[] = [
  {
    id: "funding-trend",
    title: "经费趋势",
    description: "月度经费使用趋势",
    type: ["funds"],
    icon: React.createElement(TrendingUp, { className: "h-4 w-4" }),
    size: "large",
    renderChart: () => React.createElement("div", null, "经费趋势图表")
  },
  {
    id: "funding-category",
    title: "经费分类",
    description: "按支出类别统计",
    type: ["funds"],
    icon: React.createElement(PieChart, { className: "h-4 w-4" }),
    renderChart: () => React.createElement("div", null, "经费分类图表")
  },
  {
    id: "budget-execution",
    title: "预算执行",
    description: "预算执行进度",
    type: ["funds"],
    icon: React.createElement(Target, { className: "h-4 w-4" }),
    renderChart: () => React.createElement("div", null, "预算执行图表")
  }
]

// 成果统计图表
export const resultsCharts: ChartConfig[] = [
  {
    id: "achievement-trend",
    title: "成果趋势",
    description: "近5年成果趋势",
    type: ["results"],
    icon: React.createElement(TrendingUp, { className: "h-4 w-4" }),
    size: "large",
    renderChart: () => React.createElement("div", null, "成果趋势图表")
  },
  {
    id: "paper-citations",
    title: "论文引用",
    description: "论文引用情况统计",
    type: ["results"],
    icon: React.createElement(FileText, { className: "h-4 w-4" }),
    renderChart: () => React.createElement("div", null, "论文引用图表")
  },
  {
    id: "patent-status",
    title: "专利状态",
    description: "专利申请与授权情况",
    type: ["results"],
    icon: React.createElement(Award, { className: "h-4 w-4" }),
    renderChart: () => React.createElement("div", null, "专利状态图表")
  }
]

// 所有图表配置
export const allCharts = [
  ...overviewCharts,
  ...projectCharts,
  ...fundingCharts,
  ...resultsCharts
]

// 默认显示的图表ID
export const defaultChartIds = {
  overview: ["project-progress", "task-completion", "funding-overview"],
  projects: ["project-type", "project-timeline", "team-workload"],
  funds: ["funding-trend", "funding-category", "budget-execution"],
  results: ["achievement-trend", "paper-citations", "patent-status"]
}

