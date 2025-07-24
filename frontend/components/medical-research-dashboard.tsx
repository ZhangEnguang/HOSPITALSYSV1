"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Users, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Stethoscope,
  FlaskConical,
  Microscope,
  Heart,
  Brain,
  Eye,
  FolderOpen,
  DollarSign,
  Trophy,
  ArrowUpRight,
  Banknote,
  MoreVertical,
  Expand,
  Download,
  ArrowRight,
  ClipboardList
} from "lucide-react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// 动态导入数据看板专用图表组件
const DynamicProjectFundingChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-project-funding-chart"), { ssr: false })
const DynamicTeamDistributionChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-team-distribution-chart"), { ssr: false })
const DynamicResourceUtilizationChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-resource-utilization-chart"), { ssr: false })
const DynamicSingleBarChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-single-bar-chart"), { ssr: false })
const DynamicResearchInstituteTargetChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-research-institute-target-chart"), { ssr: false })
const DynamicMultiDimensionalAnalysisChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-multi-dimensional-analysis-chart"), { ssr: false })
const DynamicTargetCompletionStatusChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-target-completion-status-chart"), { ssr: false })
const DynamicIPTransformationEfficiencyChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-ip-transformation-efficiency-chart"), { ssr: false })
const DynamicRevenueDistributionChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-revenue-distribution-chart"), { ssr: false })
const DynamicHorizontalResearchProjectsChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-horizontal-research-projects-chart"), { ssr: false })
const DynamicTestRadarChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-test-radar-chart"), { ssr: false })
const DynamicIPTransformationRingChart = dynamic(
  () => import("@/components/data-dashboard-charts/dashboard-ip-transformation-ring-chart"), 
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
  }
)

// 统计卡片组件
interface StatCardProps {
  title: string
  value: string
  unit: string
  monthOnMonth: { value: string; isUp: boolean }
  monthRingRatio: { value: string; isUp: boolean }
  valueColor: string
  icon?: React.ReactNode
}

function StatCard({ title, value, unit, monthOnMonth, monthRingRatio, valueColor, icon }: StatCardProps) {
  // 上升三角形图标组件
  const UpTriangleIcon = () => (
    <svg width="12" height="12" viewBox="0 0 1024 1024" className="inline-block">
      <path d="M534.65 393.4a31.991 31.991 0 0 0-45.3 0L297.4 585.355A31.994 31.994 0 0 0 320.05 640h383.9a31.992 31.992 0 0 0 22.65-54.644L534.65 393.4z" fill="#EF3939" />
    </svg>
  )

  // 下降三角形图标组件
  const DownTriangleIcon = () => (
    <svg width="12" height="12" viewBox="0 0 1024 1024" className="inline-block">
      <path d="M483.474286 695.734857l-216.502857-270.628571A36.571429 36.571429 0 0 1 295.497143 365.714286h433.005714a36.571429 36.571429 0 0 1 28.525714 59.465143L540.525714 695.734857a36.571429 36.571429 0 0 1-57.051428 0z" fill="#4DCFA0" />
    </svg>
  )

  // 根据数字颜色生成对应的渐变背景和阴影
  const getGradientClasses = (color: string) => {
    switch (color) {
      case 'text-blue-600':
        return 'hover:bg-gradient-to-br hover:from-slate-50 hover:via-blue-50/50 hover:to-blue-100/30 hover:border-blue-200/60 hover:shadow-[0_12px_24px_-8px_rgba(59,130,246,0.15),0_20px_40px_-12px_rgba(147,197,253,0.2)]'
      case 'text-red-500':
        return 'hover:bg-gradient-to-br hover:from-slate-50 hover:via-red-50/50 hover:to-red-100/30 hover:border-red-200/60 hover:shadow-[0_12px_24px_-8px_rgba(239,68,68,0.15),0_20px_40px_-12px_rgba(252,165,165,0.2)]'
      case 'text-orange-500':
        return 'hover:bg-gradient-to-br hover:from-slate-50 hover:via-orange-50/50 hover:to-orange-100/30 hover:border-orange-200/60 hover:shadow-[0_12px_24px_-8px_rgba(249,115,22,0.15),0_20px_40px_-12px_rgba(254,215,170,0.2)]'
      case 'text-green-600':
        return 'hover:bg-gradient-to-br hover:from-slate-50 hover:via-green-50/50 hover:to-green-100/30 hover:border-green-200/60 hover:shadow-[0_12px_24px_-8px_rgba(34,197,94,0.15),0_20px_40px_-12px_rgba(187,247,208,0.2)]'
      case 'text-purple-600':
        return 'hover:bg-gradient-to-br hover:from-slate-50 hover:via-purple-50/50 hover:to-purple-100/30 hover:border-purple-200/60 hover:shadow-[0_12px_24px_-8px_rgba(147,51,234,0.15),0_20px_40px_-12px_rgba(221,214,254,0.2)]'
      default:
        return 'hover:bg-gradient-to-br hover:from-slate-50 hover:via-blue-50/50 hover:to-blue-100/30 hover:border-blue-200/60 hover:shadow-[0_12px_24px_-8px_rgba(59,130,246,0.15),0_20px_40px_-12px_rgba(147,197,253,0.2)]'
    }
  }

  // 根据数字颜色生成对应的图标颜色
  const getIconColor = (color: string) => {
    switch (color) {
      case 'text-blue-600':
        return 'text-blue-400/70 group-hover:text-blue-500/80'
      case 'text-red-500':
        return 'text-red-300/70 group-hover:text-red-400/80'
      case 'text-orange-500':
        return 'text-orange-300/70 group-hover:text-orange-400/80'
      case 'text-green-600':
        return 'text-green-400/70 group-hover:text-green-500/80'
      case 'text-purple-600':
        return 'text-purple-400/70 group-hover:text-purple-500/80'
      default:
        return 'text-blue-400/70 group-hover:text-blue-500/80'
    }
  }

  return (
    <Card className={`group cursor-pointer transform transition-all duration-700 ease-in-out hover:-translate-y-1 ${getGradientClasses(valueColor)} relative overflow-hidden bg-white/75 backdrop-blur-lg border border-white/40`}>
      {/* 右上角图标 - 纯图标版本 */}
      {icon && (
        <div className={`absolute top-3 right-3 transition-all duration-500 ease-in-out z-10 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 rotate-12 group-hover:rotate-6 drop-shadow-sm ${getIconColor(valueColor)}`}>
          {icon}
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* 卡片名称 */}
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          
          {/* 数量 */}
          <div className={`text-2xl font-bold ${valueColor}`}>
            {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
          </div>
          
          {/* 月同比和月环比 */}
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-500">月同比</span>
              <span className={`${monthOnMonth.isUp ? "text-red-500" : "text-green-500"}`}>
                {monthOnMonth.value}
              </span>
              {monthOnMonth.isUp ? <UpTriangleIcon /> : <DownTriangleIcon />}
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-gray-500">月环比</span>
              <span className={`${monthRingRatio.isUp ? "text-red-500" : "text-green-500"}`}>
                {monthRingRatio.value}
              </span>
              {monthRingRatio.isUp ? <UpTriangleIcon /> : <DownTriangleIcon />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



export default function MedicalResearchDashboard({ activeModule = "overview" }: { activeModule?: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [expandedChart, setExpandedChart] = useState<string | null>(null)
  const [multiDimensionMode, setMultiDimensionMode] = useState<'institute' | 'contract'>('institute')
  const [revenueYear, setRevenueYear] = useState<string>('2024')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedInstitutes, setSelectedInstitutes] = useState<string[]>([]);

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // 图表操作函数
  const handleExpandChart = (chartId: string) => {
    setExpandedChart(chartId)
  }

  const handleCloseExpanded = () => {
    setExpandedChart(null)
  }

  const handleDownloadChart = (chartId: string, chartTitle: string) => {
    // 这里可以实现图表下载功能
    console.log(`下载图表: ${chartTitle}`)
    // 可以使用 html2canvas 或其他库来实现图表截图下载
  }

  // 模拟数据
  const overviewData = {
    totalProjects: 248,
    ethicProjects: 89,
    ongoingProjects: 156,
    completedProjects: 92,
    totalFunding: "2,845万元",
    usedFunding: "1,687万元",
    ethicReviews: 234,
    pendingReviews: 45,
    approvedReviews: 189,
    researchers: 312,
    publications: 127,
    patents: 23
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  // 根据activeModule渲染不同内容
  const renderContent = () => {
    switch (activeModule) {
      case "overview":
        return renderOverviewContent()
      case "ethics":
        return renderEthicsContent()
      case "funding":
        return renderFundingContent()
      default:
        return renderOverviewContent()
    }
  }

  // 综合概览内容
  const renderOverviewContent = () => (
    <div className="space-y-4">
      {/* 顶部统计卡片 */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="科研项目"
          value="2,334"
          unit="项"
          valueColor="text-blue-600"
          monthOnMonth={{ value: "+2.5%", isUp: true }}
          monthRingRatio={{ value: "-1.2%", isUp: false }}
          icon={<FolderOpen className="h-8 w-8" />}
        />
        <StatCard
          title="科研经费"
          value="15,678"
          unit="万元"
          valueColor="text-red-500"
          monthOnMonth={{ value: "-3.1%", isUp: false }}
          monthRingRatio={{ value: "+3.7%", isUp: true }}
          icon={<DollarSign className="h-8 w-8" />}
        />
        <StatCard
          title="科研成果"
          value="1,245"
          unit="项"
          valueColor="text-orange-500"
          monthOnMonth={{ value: "+5.1%", isUp: true }}
          monthRingRatio={{ value: "+2.8%", isUp: true }}
          icon={<Trophy className="h-8 w-8" />}
        />
        <StatCard
          title="转化项目"
          value="156"
          unit="项"
          valueColor="text-green-600"
          monthOnMonth={{ value: "-2.3%", isUp: false }}
          monthRingRatio={{ value: "+6.2%", isUp: true }}
          icon={<ArrowUpRight className="h-8 w-8" />}
        />
        <StatCard
          title="转化经费"
          value="3,456"
          unit="万元"
          valueColor="text-purple-600"
          monthOnMonth={{ value: "+15.8%", isUp: true }}
          monthRingRatio={{ value: "-4.1%", isUp: false }}
          icon={<Banknote className="h-8 w-8" />}
        />
      </div>

      {/* 图表部分 */}
      <div className="space-y-4">
        {isLoading ? (
          // 加载状态
          <div className="space-y-4">
            {/* 第一行：两个图表各占一半 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={`row1-${index}`} className="border border-[#E9ECF2] h-[350px] shadow-none">
                  <CardHeader>
                    <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-[320px]">
                    <div className="animate-pulse h-40 w-40 bg-gray-200 rounded-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* 第二行：左侧一个图表 + 右侧两个图表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 左侧：一个图表 */}
              <Card className="border border-[#E9ECF2] h-[350px] shadow-none">
                <CardHeader>
                  <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[320px]">
                  <div className="animate-pulse h-40 w-40 bg-gray-200 rounded-full"></div>
                </CardContent>
              </Card>
              
              {/* 右侧：两个图表 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Card key={`row2-right-${index}`} className="border border-[#E9ECF2] h-[350px] shadow-none">
                    <CardHeader>
                      <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[320px]">
                      <div className="animate-pulse h-32 w-32 bg-gray-200 rounded-full"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // 实际图表
          <div className="space-y-4">
            {/* 第一行：科研成果产出统计 + 科研项目申报与立项情况 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                    <CardTitle className="text-[18px] font-normal">科研成果产出统计</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem 
                        onClick={() => handleExpandChart('research-output')}
                        className="cursor-pointer"
                      >
                        <Expand className="mr-2 h-4 w-4" />
                        放大查看
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDownloadChart('research-output', '科研成果产出统计')}
                        className="cursor-pointer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        下载图表
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <DynamicSingleBarChart />
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                    <CardTitle className="text-[18px] font-normal">科研项目申报与立项情况</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem 
                        onClick={() => handleExpandChart('project-application')}
                        className="cursor-pointer"
                      >
                        <Expand className="mr-2 h-4 w-4" />
                        放大查看
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDownloadChart('project-application', '科研项目申报与立项情况')}
                        className="cursor-pointer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        下载图表
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <p>图表占位符</p>
                      <p className="text-sm mt-2">科研项目申报与立项情况</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 第二行：科研经费分配情况（左半部分）+ 科研项目状态分布和任务完成情况（右半部分） */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 左侧：科研经费分配情况，占据一半位置 */}
              <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                    <CardTitle className="text-[18px] font-normal">科研经费分配情况</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem 
                        onClick={() => handleExpandChart('funding-distribution')}
                        className="cursor-pointer"
                      >
                        <Expand className="mr-2 h-4 w-4" />
                        放大查看
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDownloadChart('funding-distribution', '科研经费分配情况')}
                        className="cursor-pointer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        下载图表
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <DynamicProjectFundingChart />
                </CardContent>
              </Card>

              {/* 右侧：科研项目状态分布和任务完成情况，共占一半位置 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                                          <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                        <CardTitle className="text-[18px] font-normal">成果转化目标总完成统计</CardTitle>
                      </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem 
                          onClick={() => handleExpandChart('project-status')}
                          className="cursor-pointer"
                        >
                          <Expand className="mr-2 h-4 w-4" />
                          放大查看
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDownloadChart('project-status', '科研项目状态分布')}
                          className="cursor-pointer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          下载图表
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="h-[320px]">
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <p>图表占位符</p>
                        <p className="text-sm mt-2">成果转化目标总完成统计</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                                          <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                        <CardTitle className="text-[18px] font-normal">成果转化经费统计</CardTitle>
                      </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem 
                          onClick={() => handleExpandChart('task-completion')}
                          className="cursor-pointer"
                        >
                          <Expand className="mr-2 h-4 w-4" />
                          放大查看
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDownloadChart('task-completion', '任务完成情况')}
                          className="cursor-pointer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          下载图表
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="h-[320px]">
                    <DynamicTeamDistributionChart />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // 伦理管理内容
  const renderEthicsContent = () => (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-4">
      {/* 伦理审查特色布局：三列式不对称布局 */}
      
      {/* 第一行：三列布局 - 左侧2/5 + 中间2/5 + 右侧1/5 */}
      <div className="flex gap-4 flex-[3]">
        {/* 左侧大卡片 - 占2/5宽度 */}
        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-[2]">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[18px] font-normal">伦理审查统计</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExpandChart('ethics-overview')}>
                  <Expand className="mr-2 h-4 w-4" />
                  放大查看
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  下载图表
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex items-center justify-center flex-1">
            <div className="text-center text-gray-500">
              <p>图表占位符</p>
              <p className="text-sm mt-2">伦理审查统计</p>
            </div>
          </CardContent>
        </Card>

        {/* 中间大卡片 - 占2/5宽度 */}
        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-[2]">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[18px] font-normal">审查类型分布</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExpandChart('review-type')}>
                  <Expand className="mr-2 h-4 w-4" />
                  放大查看
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  下载图表
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex items-center justify-center flex-1">
            <div className="text-center text-gray-500">
              <p>图表占位符</p>
              <p className="text-sm mt-2">审查类型分布</p>
            </div>
          </CardContent>
        </Card>

        {/* 右侧两个小卡片 - 占1/5宽度 */}
        <div className="flex flex-col gap-4 flex-1">
          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[16px] font-normal">审查状态</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExpandChart('review-status')}>
                    <Expand className="mr-2 h-4 w-4" />
                    放大查看
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    下载图表
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex items-center justify-center flex-1">
              <div className="text-center text-gray-500">
                <p>图表占位符</p>
                <p className="text-xs mt-1">审查状态</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[16px] font-normal">审查效率</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExpandChart('review-efficiency')}>
                    <Expand className="mr-2 h-4 w-4" />
                    放大查看
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    下载图表
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex items-center justify-center flex-1">
              <div className="text-center text-gray-500">
                <p>图表占位符</p>
                <p className="text-xs mt-1">审查效率</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 第二行：四等分布局 */}
      <div className="flex gap-4 flex-[2]">
        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[18px] font-normal">审查周期</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExpandChart('review-cycle')}>
                  <Expand className="mr-2 h-4 w-4" />
                  放大查看
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  下载图表
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex items-center justify-center flex-1">
            <div className="text-center text-gray-500">
              <p>图表占位符</p>
              <p className="text-sm mt-2">审查周期分析</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[18px] font-normal">专家评分</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExpandChart('expert-score')}>
                  <Expand className="mr-2 h-4 w-4" />
                  放大查看
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  下载图表
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex items-center justify-center flex-1">
            <div className="text-center text-gray-500">
              <p>图表占位符</p>
              <p className="text-sm mt-2">专家评分统计</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[18px] font-normal">风险评估</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExpandChart('risk-assessment')}>
                  <Expand className="mr-2 h-4 w-4" />
                  放大查看
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  下载图表
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex items-center justify-center flex-1">
            <div className="text-center text-gray-500">
              <p>图表占位符</p>
              <p className="text-sm mt-2">风险评估</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[18px] font-normal">合规性分析</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExpandChart('compliance-analysis')}>
                  <Expand className="mr-2 h-4 w-4" />
                  放大查看
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  下载图表
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex items-center justify-center flex-1">
            <div className="text-center text-gray-500">
              <p>图表占位符</p>
              <p className="text-sm mt-2">合规性分析</p>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  )



  // 渲染成果转化内容
  const renderFundingContent = () => (
    <div className="space-y-4 h-full">
      {/* 顶部统计卡片 */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="横向项目数量"
          value="156"
          unit="项"
          valueColor="text-blue-600"
          monthOnMonth={{ value: "+8.2%", isUp: true }}
          monthRingRatio={{ value: "+3.5%", isUp: true }}
          icon={<FolderOpen className="h-8 w-8" />}
        />
        <StatCard
          title="横向项目金额"
          value="12,456"
          unit="万元"
          valueColor="text-green-600"
          monthOnMonth={{ value: "+12.8%", isUp: true }}
          monthRingRatio={{ value: "+5.2%", isUp: true }}
          icon={<DollarSign className="h-8 w-8" />}
        />
        <StatCard
          title="转化到院金额"
          value="8,234"
          unit="万元"
          valueColor="text-orange-500"
          monthOnMonth={{ value: "+15.3%", isUp: true }}
          monthRingRatio={{ value: "+7.1%", isUp: true }}
          icon={<Banknote className="h-8 w-8" />}
        />
        <StatCard
          title="合同数量"
          value="89"
          unit="项"
          valueColor="text-purple-600"
          monthOnMonth={{ value: "+6.7%", isUp: true }}
          monthRingRatio={{ value: "+2.8%", isUp: true }}
          icon={<FileText className="h-8 w-8" />}
        />
        <StatCard
          title="合同金额"
          value="5,678"
          unit="万元"
          valueColor="text-red-500"
          monthOnMonth={{ value: "+9.4%", isUp: true }}
          monthRingRatio={{ value: "+4.6%", isUp: true }}
          icon={<ClipboardList className="h-8 w-8" />}
        />
      </div>

      {/* 重新布局：左侧大卡片占两行高度，右侧两个独立卡片 */}
      <div className="flex gap-4" style={{ height: '824px' }}>
        {/* 各研究所目标达成对比图 - 占50%宽度，两行高度 */}
        <div className="w-1/2">
          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group h-full">
            <CardHeader className="flex flex-row items-center pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[16px] font-normal">各研究所目标达成对比图</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[769px] px-2 pt-2 pb-6 flex flex-col">
              {/* 图表区域 */}
              <div className="h-[345px] w-full">
                <DynamicResearchInstituteTargetChart />
              </div>
              
              {/* 列表占位符区域 */}
              <div className="flex-1 mt-4 px-2">
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">详细数据列表</h4>
                  
                  {/* 数据表格 */}
                  <div className="overflow-y-auto max-h-[300px] scrollbar-hide">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            研究所名称
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            设定目标金额
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            实际到院金额
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            超额金额
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            完成率
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                                         {[
                   { 
                     name: "畜牧兽医研究所", 
                     target: 2500, 
                     actual: 2800, 
                     completion: 112.0,
                     transform: 1800,
                     horizontal: 1000
                   },
                   { 
                     name: "动物生物技术研究所", 
                     target: 2200, 
                     actual: 1950, 
                     completion: 88.6,
                     transform: 1200,
                     horizontal: 750
                   },
                   { 
                     name: "动物营养与饲料研究所", 
                     target: 3000, 
                     actual: 3200, 
                     completion: 106.7,
                     transform: 2000,
                     horizontal: 1200
                   },
                   { 
                     name: "草地与生态研究所", 
                     target: 1800, 
                     actual: 1650, 
                     completion: 91.7,
                     transform: 900,
                     horizontal: 750
                   },
                   { 
                     name: "农业生物技术研究所", 
                     target: 2100, 
                     actual: 2350, 
                     completion: 111.9,
                     transform: 1500,
                     horizontal: 850
                   },
                   { 
                     name: "农业资源与环境研究所", 
                     target: 1600, 
                     actual: 1450, 
                     completion: 90.6,
                     transform: 800,
                     horizontal: 650
                   },
                   { 
                     name: "农业经济与信息研究所", 
                     target: 1900, 
                     actual: 2100, 
                     completion: 110.5,
                     transform: 1300,
                     horizontal: 800
                   },
                   { 
                     name: "农业质量标准与检测技术研究所", 
                     target: 1400, 
                     actual: 1250, 
                     completion: 89.3,
                     transform: 700,
                     horizontal: 550
                   },
                   { 
                     name: "农村能源与生态研究所", 
                     target: 1300, 
                     actual: 1450, 
                     completion: 111.5,
                     transform: 900,
                     horizontal: 550
                   },
                   { 
                     name: "农产品加工研究所", 
                     target: 1200, 
                     actual: 1150, 
                     completion: 95.8,
                     transform: 650,
                     horizontal: 500
                   },
                   { 
                     name: "植物保护研究所", 
                     target: 2000, 
                     actual: 1850, 
                     completion: 92.5,
                     transform: 1100,
                     horizontal: 750
                   },
                   { 
                     name: "作物资源研究所", 
                     target: 1700, 
                     actual: 1900, 
                     completion: 111.8,
                     transform: 1200,
                     horizontal: 700
                   },
                   { 
                     name: "经济植物研究所", 
                     target: 1500, 
                     actual: 1350, 
                     completion: 90.0,
                     transform: 850,
                     horizontal: 500
                   },
                   { 
                     name: "玉米研究所", 
                     target: 2800, 
                     actual: 3100, 
                     completion: 110.7,
                     transform: 1900,
                     horizontal: 1200
                   },
                   { 
                     name: "水稻研究所", 
                     target: 2600, 
                     actual: 2400, 
                     completion: 92.3,
                     transform: 1600,
                     horizontal: 800
                   },
                   { 
                     name: "大豆研究所", 
                     target: 1900, 
                     actual: 2100, 
                     completion: 110.5,
                     transform: 1300,
                     horizontal: 800
                   },
                   { 
                     name: "花生研究所", 
                     target: 1400, 
                     actual: 1250, 
                     completion: 89.3,
                     transform: 800,
                     horizontal: 450
                   },
                   { 
                     name: "果树研究所", 
                     target: 1600, 
                     actual: 1750, 
                     completion: 109.4,
                     transform: 1000,
                     horizontal: 750
                   },
                   { 
                     name: "主粮工程研究中心", 
                     target: 3200, 
                     actual: 3400, 
                     completion: 106.3,
                     transform: 2200,
                     horizontal: 1200
                   },
                   { 
                     name: "试验地综合服务中心", 
                     target: 1100, 
                     actual: 1000, 
                     completion: 90.9,
                     transform: 600,
                     horizontal: 400
                   },
                   { 
                     name: "洮南综合试验站", 
                     target: 900, 
                     actual: 850, 
                     completion: 94.4,
                     transform: 500,
                     horizontal: 350
                   }
                 ].map((institute, index) => {
                          const excessAmount = institute.actual > institute.target ? institute.actual - institute.target : 0;
                          const isOverTarget = institute.completion >= 100;
                          
                          return (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-2 font-medium text-gray-800">
                                {institute.name}
                              </td>
                              <td className="px-3 py-2 text-right text-gray-700">
                                {institute.target.toLocaleString()}万元
                              </td>
                              <td className="px-3 py-2 text-right font-medium">
                                <span className={isOverTarget ? 'text-green-600' : 'text-red-500'}>
                                  {institute.actual.toLocaleString()}万元
                                </span>
                              </td>
                              <td className="px-3 py-2 text-right">
                                {excessAmount > 0 ? (
                                  <span className="text-green-600 font-medium">
                                    +{excessAmount.toLocaleString()}万元
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-right font-medium">
                                <span className={`${
                                  institute.completion >= 100 
                                    ? 'text-green-600 bg-green-50' 
                                    : institute.completion >= 95 
                                      ? 'text-yellow-600 bg-yellow-50'
                                      : 'text-red-500 bg-red-50'
                                } px-2 py-1 rounded-full text-xs`}>
                                  {institute.completion}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        
                                         {/* 总计行 */}
                 {(() => {
                   const data = [
                     { target: 2500, actual: 2800 },
                     { target: 2200, actual: 1950 },
                     { target: 3000, actual: 3200 },
                     { target: 1800, actual: 1650 },
                     { target: 2100, actual: 2350 },
                     { target: 1600, actual: 1450 },
                     { target: 1900, actual: 2100 },
                     { target: 1400, actual: 1250 },
                     { target: 1300, actual: 1450 },
                     { target: 1200, actual: 1150 },
                     { target: 2000, actual: 1850 },
                     { target: 1700, actual: 1900 },
                     { target: 1500, actual: 1350 },
                     { target: 2800, actual: 3100 },
                     { target: 2600, actual: 2400 },
                     { target: 1900, actual: 2100 },
                     { target: 1400, actual: 1250 },
                     { target: 1600, actual: 1750 },
                     { target: 3200, actual: 3400 },
                     { target: 1100, actual: 1000 },
                     { target: 900, actual: 850 }
                   ];
                          
                          const totalTarget = data.reduce((sum, item) => sum + item.target, 0);
                          const totalActual = data.reduce((sum, item) => sum + item.actual, 0);
                          const totalExcess = totalActual > totalTarget ? totalActual - totalTarget : 0;
                          const totalCompletion = ((totalActual / totalTarget) * 100).toFixed(1);
                          
                          return (
                            <tr className="bg-blue-50 font-medium border-t border-gray-200 sticky bottom-0">
                              <td className="px-3 py-2 text-blue-800">
                                总计
                              </td>
                              <td className="px-3 py-2 text-right text-blue-800">
                                {totalTarget.toLocaleString()}万元
                              </td>
                              <td className="px-3 py-2 text-right text-blue-800">
                                {totalActual.toLocaleString()}万元
                              </td>
                              <td className="px-3 py-2 text-right text-blue-800">
                                {totalExcess > 0 ? `+${totalExcess.toLocaleString()}万元` : '-'}
                              </td>
                              <td className="px-3 py-2 text-right">
                                <span className={`${
                                  parseFloat(totalCompletion) >= 100 
                                    ? 'text-green-600 bg-green-100' 
                                    : 'text-red-500 bg-red-100'
                                } px-2 py-1 rounded-full text-xs font-medium`}>
                                  {totalCompletion}%
                                </span>
                              </td>
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧两个卡片垂直排列 */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* 成果转化综合分析 */}
          <div className="flex-1">
          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                  <CardTitle className="text-[16px] font-normal">成果转化综合分析</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExpandChart('target-completion-status')}>
                    <Expand className="mr-2 h-4 w-4" />
                    放大查看
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    下载图表
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="h-[345px] px-3 pt-2 pb-3">
              <div className="h-full flex gap-4">
                {/* 左侧：饼图 */}
                <div className="w-1/2">
                    <DynamicTargetCompletionStatusChart activeMode="completion" />
                </div>
                
                {/* 右侧：排行榜 */}
                <div className="w-1/2 flex flex-col">
                  <div className="text-xs text-gray-600 font-medium mb-2">完成率排行榜</div>
                  
                  {/* 排行榜列表 - 柱状图样式 */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2" style={{ maxHeight: '280px' }}>
                    {[
                        { rank: 1, name: "畜牧兽医研究所", rate: 112.0, projects: 45, color: "#FFD700", bgColor: "bg-gradient-to-r from-yellow-100 to-yellow-50" },
                        { rank: 2, name: "农业生物技术研究所", rate: 111.9, projects: 38, color: "#C0C0C0", bgColor: "bg-gradient-to-r from-gray-100 to-gray-50" },
                        { rank: 3, name: "作物资源研究所", rate: 111.8, projects: 29, color: "#CD7F32", bgColor: "bg-gradient-to-r from-orange-100 to-orange-50" },
                        { rank: 4, name: "玉米研究所", rate: 110.7, projects: 21, color: "#3B82F6", bgColor: "bg-gradient-to-r from-blue-100 to-blue-50" },
                        { rank: 5, name: "大豆研究所", rate: 110.5, projects: 16, color: "#8B5CF6", bgColor: "bg-gradient-to-r from-purple-100 to-purple-50" },
                        { rank: 6, name: "果树研究所", rate: 109.4, projects: 14, color: "#10B981", bgColor: "bg-gradient-to-r from-green-100 to-green-50" },
                        { rank: 7, name: "农村能源与生态研究所", rate: 111.5, projects: 12, color: "#F59E0B", bgColor: "bg-gradient-to-r from-amber-100 to-amber-50" },
                        { rank: 8, name: "农业经济与信息研究所", rate: 110.5, projects: 11, color: "#8B5A2B", bgColor: "bg-gradient-to-r from-orange-200 to-orange-100" },
                        { rank: 9, name: "动物营养与饲料研究所", rate: 106.7, projects: 10, color: "#FF69B4", bgColor: "bg-gradient-to-r from-pink-100 to-pink-50" },
                        { rank: 10, name: "主粮工程研究中心", rate: 106.3, projects: 9, color: "#20B2AA", bgColor: "bg-gradient-to-r from-teal-100 to-teal-50" },
                        { rank: 11, name: "植物保护研究所", rate: 105.2, projects: 8, color: "#9370DB", bgColor: "bg-gradient-to-r from-indigo-100 to-indigo-50" },
                        { rank: 12, name: "水稻研究所", rate: 103.8, projects: 7, color: "#FF6347", bgColor: "bg-gradient-to-r from-red-100 to-red-50" },
                        { rank: 13, name: "农产品加工研究所", rate: 100.0, projects: 6, color: "#32CD32", bgColor: "bg-gradient-to-r from-lime-100 to-lime-50" },
                        { rank: 14, name: "洮南综合试验站", rate: 100.0, projects: 5, color: "#FF8C00", bgColor: "bg-gradient-to-r from-orange-100 to-orange-50" },
                        { rank: 15, name: "草地与生态研究所", rate: 100.0, projects: 4, color: "#4169E1", bgColor: "bg-gradient-to-r from-blue-200 to-blue-100" },
                        { rank: 16, name: "农业资源与环境研究所", rate: 100.0, projects: 3, color: "#DC143C", bgColor: "bg-gradient-to-r from-red-200 to-red-100" },
                        { rank: 17, name: "农业质量标准与检测技术研究所", rate: 100.0, projects: 2, color: "#9932CC", bgColor: "bg-gradient-to-r from-purple-200 to-purple-100" },
                        { rank: 18, name: "经济植物研究所", rate: 100.0, projects: 1, color: "#FF1493", bgColor: "bg-gradient-to-r from-pink-200 to-pink-100" },
                        { rank: 19, name: "试验地综合服务中心", rate: 97.5, projects: 1, color: "#6A5ACD", bgColor: "bg-gradient-to-r from-slate-100 to-slate-50" },
                        { rank: 20, name: "花生研究所", rate: 96.8, projects: 1, color: "#B8860B", bgColor: "bg-gradient-to-r from-yellow-200 to-yellow-100" },
                        { rank: 21, name: "动物生物技术研究所", rate: 95.2, projects: 1, color: "#2F4F4F", bgColor: "bg-gradient-to-r from-gray-200 to-gray-100" }
                    ].map((item, index) => {
                      const maxProjects = 45; // 最大项目数
                      const barWidth = (item.projects / maxProjects) * 100;
                      return (
                        <div key={index} className="relative">
                          {/* 排名标识 */}
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <div 
                              className={`w-4 h-4 rounded flex items-center justify-center text-xs font-medium text-white ${
                                item.rank <= 3 ? 'bg-blue-500' : 'bg-gray-400'
                              }`}
                            >
                              {item.rank}
                            </div>
                            <div className="text-xs font-medium text-gray-800 truncate flex-1">{item.name}</div>
                            <div className="text-xs font-bold" style={{ color: item.color }}>{item.rate}%</div>
                          </div>
                          
                          {/* 柱状图条 */}
                          <div className="relative h-4 bg-gray-100 rounded-md overflow-hidden">
                            <div 
                              className={`h-full ${item.bgColor} border-r-2 transition-all duration-700 ease-out`}
                              style={{ 
                                width: `${barWidth}%`,
                                borderRightColor: item.color
                              }}
                            >
                              {/* 柱状图内的渐变效果 */}
                              <div 
                                className="h-full opacity-60"
                                style={{ 
                                  background: `linear-gradient(to right, transparent 0%, ${item.color}20 70%, ${item.color}40 100%)`
                                }}
                              ></div>
                            </div>
                            
                            {/* 项目数量标签 */}
                            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                              <span className="text-xs text-gray-500 bg-white px-1 py-0.5 rounded shadow-sm">
                                {item.projects}项
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
      </div>

          {/* 多维度成果转化分析图 */}
          <div className="flex-1">
          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                    <CardTitle className="text-[16px] font-normal">多维度成果转化分析图</CardTitle>
              </div>
                  
                  {/* 维度切换按钮组 */}
                  <div className="flex items-center gap-1 ml-2">
                    <div className="flex items-center bg-gray-100/80 rounded-lg p-1">
                      <button
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                          multiDimensionMode === 'institute' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setMultiDimensionMode('institute')}
                      >
                        我院类别
                      </button>
                      <button
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                          multiDimensionMode === 'contract' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setMultiDimensionMode('contract')}
                      >
                        合同类型
                      </button>
              </div>
        </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExpandChart('multi-dimensional-analysis')}>
                    <Expand className="mr-2 h-4 w-4" />
                    放大查看
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    下载图表
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="h-[345px] px-2 pt-2 pb-6">
              <div className="h-full w-full">
                  <DynamicMultiDimensionalAnalysisChart activeMode={multiDimensionMode} />
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
        </div>

             {/* 第二行：各研究所横向科研项目统计 & 知识产权转化效能图 */}
      <div className="flex gap-4" style={{ height: '400px' }}>
         {/* 各研究所横向科研项目统计 - 占50%宽度 */}
        <div className="flex-1">
          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[16px] font-normal">各研究所横向科研项目统计</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExpandChart('horizontal-research-projects')}>
                    <Expand className="mr-2 h-4 w-4" />
                    放大查看
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    下载图表
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="h-[345px] px-2 pt-2 pb-6">
              <div className="h-full w-full">
                <DynamicHorizontalResearchProjectsChart />
              </div>
            </CardContent>
          </Card>
      </div>

        {/* 知识产权转化效能图卡片 - 占50%宽度 */}
        <div className="flex-1">
          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[16px] font-normal">知识产权转化效能图</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Expand className="mr-2 h-4 w-4" />
                    放大查看
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    下载图表
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="h-[345px] px-3 pt-2 pb-3">
              <div className="h-full flex flex-col">
                {/* 三个环形图并排显示 */}
                <div className="flex gap-2" style={{ height: '300px' }}>
                  {/* 品种环形图 */}
                  <div className="flex-1">
                    <DynamicIPTransformationRingChart type="variety" />
              </div>
                  
                  {/* 专利环形图 */}
                  <div className="flex-1">
                    <DynamicIPTransformationRingChart type="patent" />
        </div>
        
                  {/* 软件著作权环形图 */}
        <div className="flex-1">
                    <DynamicIPTransformationRingChart type="software" />
              </div>
                </div>
                
                {/* 统一图例 - 参考雷达图的底部间距 */}
                <div className="flex justify-center gap-4 pt-1" style={{ paddingBottom: '10px', marginTop: '-28px' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22C55E' }}></div>
                    <span className="text-xs text-gray-600">已转化</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E5E7EB' }}></div>
                    <span className="text-xs text-gray-600">未转化</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 第三行：各研究所收益分配结构图 */}
      <div className="flex gap-4" style={{ height: '420px' }}>
        {/* 各研究所收益分配结构图 - 占100%宽度 */}
        <div className="w-full">
          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[16px] font-normal">各研究所收益分配结构图</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExpandChart('revenue-distribution')}>
                    <Expand className="mr-2 h-4 w-4" />
                    放大查看
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    下载图表
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="h-[345px] px-2 pt-2 pb-6">
              <div className="h-full flex gap-4">
                {/* 左侧：统计图表 */}
                <div className="w-1/2">
                  <DynamicRevenueDistributionChart />
                </div>
                
                {/* 分割线 */}
                <div className="w-px bg-gray-200"></div>
                
                {/* 右侧：详细数据列表 */}
                <div className="w-1/2 flex flex-col">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">详细数据列表</h4>
                  
                  {/* 数据表格 */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            研究所名称
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            总收益
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            到院经费
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            院提费用
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            净额
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            团队奖励
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            institute: "畜牧兽医研究所",
                            totalRevenue: 2800,
                            instituteFunds: 1680,
                            managementFee: 280,
                            netAmount: 560,
                            teamReward: 280
                          },
                          {
                            institute: "动物营养与饲料研究所",
                            totalRevenue: 3200,
                            instituteFunds: 1920,
                            managementFee: 320,
                            netAmount: 640,
                            teamReward: 320
                          },
                          {
                            institute: "动物生物技术研究所",
                            totalRevenue: 1950,
                            instituteFunds: 1170,
                            managementFee: 195,
                            netAmount: 390,
                            teamReward: 195
                          },
                          {
                            institute: "农业生物技术研究所",
                            totalRevenue: 2350,
                            instituteFunds: 1410,
                            managementFee: 235,
                            netAmount: 470,
                            teamReward: 235
                          },
                          {
                            institute: "农业经济与信息研究所",
                            totalRevenue: 2200,
                            instituteFunds: 1320,
                            managementFee: 220,
                            netAmount: 440,
                            teamReward: 220
                          },
                          {
                            institute: "农业质量标准与检测技术研究所",
                            totalRevenue: 1650,
                            instituteFunds: 990,
                            managementFee: 165,
                            netAmount: 330,
                            teamReward: 165
                          },
                          {
                            institute: "农村能源与生态研究所",
                            totalRevenue: 1500,
                            instituteFunds: 900,
                            managementFee: 150,
                            netAmount: 300,
                            teamReward: 150
                          },
                          {
                            institute: "农产品加工研究所",
                            totalRevenue: 1250,
                            instituteFunds: 750,
                            managementFee: 125,
                            netAmount: 250,
                            teamReward: 125
                          },
                          {
                            institute: "农业资源与环境研究所",
                            totalRevenue: 1800,
                            instituteFunds: 1080,
                            managementFee: 180,
                            netAmount: 360,
                            teamReward: 180
                          },
                          {
                            institute: "草地与生态研究所",
                            totalRevenue: 1400,
                            instituteFunds: 840,
                            managementFee: 140,
                            netAmount: 280,
                            teamReward: 140
                          },
                          {
                            institute: "植物保护研究所",
                            totalRevenue: 1900,
                            instituteFunds: 1140,
                            managementFee: 190,
                            netAmount: 380,
                            teamReward: 190
                          },
                          {
                            institute: "作物资源研究所",
                            totalRevenue: 2100,
                            instituteFunds: 1260,
                            managementFee: 210,
                            netAmount: 420,
                            teamReward: 210
                          },
                          {
                            institute: "经济植物研究所",
                            totalRevenue: 1200,
                            instituteFunds: 720,
                            managementFee: 120,
                            netAmount: 240,
                            teamReward: 120
                          },
                          {
                            institute: "玉米研究所",
                            totalRevenue: 2600,
                            instituteFunds: 1560,
                            managementFee: 260,
                            netAmount: 520,
                            teamReward: 260
                          },
                          {
                            institute: "水稻研究所",
                            totalRevenue: 2000,
                            instituteFunds: 1200,
                            managementFee: 200,
                            netAmount: 400,
                            teamReward: 200
                          },
                          {
                            institute: "大豆研究所",
                            totalRevenue: 2400,
                            instituteFunds: 1440,
                            managementFee: 240,
                            netAmount: 480,
                            teamReward: 240
                          },
                          {
                            institute: "花生研究所",
                            totalRevenue: 1100,
                            instituteFunds: 660,
                            managementFee: 110,
                            netAmount: 220,
                            teamReward: 110
                          },
                          {
                            institute: "果树研究所",
                            totalRevenue: 1700,
                            instituteFunds: 1020,
                            managementFee: 170,
                            netAmount: 340,
                            teamReward: 170
                          },
                          {
                            institute: "主粮工程研究中心",
                            totalRevenue: 3500,
                            instituteFunds: 2100,
                            managementFee: 350,
                            netAmount: 700,
                            teamReward: 350
                          },
                          {
                            institute: "试验地综合服务中心",
                            totalRevenue: 800,
                            instituteFunds: 480,
                            managementFee: 80,
                            netAmount: 160,
                            teamReward: 80
                          },
                          {
                            institute: "洮南综合试验站",
                            totalRevenue: 600,
                            instituteFunds: 360,
                            managementFee: 60,
                            netAmount: 120,
                            teamReward: 60
                          }
                        ].map((item, index) => {
                          const instituteFundsPercentage = Math.round((item.instituteFunds / item.totalRevenue) * 100);
                          const managementFeePercentage = Math.round((item.managementFee / item.totalRevenue) * 100);
                          const netAmountPercentage = Math.round((item.netAmount / item.totalRevenue) * 100);
                          const teamRewardPercentage = Math.round((item.teamReward / item.totalRevenue) * 100);
                          
                          return (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-2 font-medium text-gray-800">
                                {item.institute}
                              </td>
                              <td className="px-3 py-2 text-right font-medium text-gray-700">
                                {item.totalRevenue.toLocaleString()}万元
                              </td>
                              <td className="px-3 py-2 text-right">
                                <span className="text-blue-600 font-medium">
                                  {item.instituteFunds.toLocaleString()}万元
                                </span>
                                <span className="text-gray-500 text-xs ml-1">
                                  ({instituteFundsPercentage}%)
                                </span>
                              </td>
                              <td className="px-3 py-2 text-right">
                                <span className="text-orange-600 font-medium">
                                  {item.managementFee.toLocaleString()}万元
                                </span>
                                <span className="text-gray-500 text-xs ml-1">
                                  ({managementFeePercentage}%)
                                </span>
                              </td>
                              <td className="px-3 py-2 text-right">
                                <span className="text-green-600 font-medium">
                                  {item.netAmount.toLocaleString()}万元
                                </span>
                                <span className="text-gray-500 text-xs ml-1">
                                  ({netAmountPercentage}%)
                                </span>
                              </td>
                              <td className="px-3 py-2 text-right">
                                <span className="text-purple-600 font-medium">
                                  {item.teamReward.toLocaleString()}万元
                                </span>
                                <span className="text-gray-500 text-xs ml-1">
                                  ({teamRewardPercentage}%)
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        
                        {/* 总计行 */}
                        {(() => {
                          const data = [
                            { totalRevenue: 2800, instituteFunds: 1680, managementFee: 280, netAmount: 560, teamReward: 280 },
                            { totalRevenue: 3200, instituteFunds: 1920, managementFee: 320, netAmount: 640, teamReward: 320 },
                            { totalRevenue: 1950, instituteFunds: 1170, managementFee: 195, netAmount: 390, teamReward: 195 },
                            { totalRevenue: 2350, instituteFunds: 1410, managementFee: 235, netAmount: 470, teamReward: 235 },
                            { totalRevenue: 2200, instituteFunds: 1320, managementFee: 220, netAmount: 440, teamReward: 220 },
                            { totalRevenue: 1650, instituteFunds: 990, managementFee: 165, netAmount: 330, teamReward: 165 },
                            { totalRevenue: 1500, instituteFunds: 900, managementFee: 150, netAmount: 300, teamReward: 150 },
                            { totalRevenue: 1250, instituteFunds: 750, managementFee: 125, netAmount: 250, teamReward: 125 },
                            { totalRevenue: 1800, instituteFunds: 1080, managementFee: 180, netAmount: 360, teamReward: 180 },
                            { totalRevenue: 1400, instituteFunds: 840, managementFee: 140, netAmount: 280, teamReward: 140 },
                            { totalRevenue: 1900, instituteFunds: 1140, managementFee: 190, netAmount: 380, teamReward: 190 },
                            { totalRevenue: 2100, instituteFunds: 1260, managementFee: 210, netAmount: 420, teamReward: 210 },
                            { totalRevenue: 1200, instituteFunds: 720, managementFee: 120, netAmount: 240, teamReward: 120 },
                            { totalRevenue: 2600, instituteFunds: 1560, managementFee: 260, netAmount: 520, teamReward: 260 },
                            { totalRevenue: 2000, instituteFunds: 1200, managementFee: 200, netAmount: 400, teamReward: 200 },
                            { totalRevenue: 2400, instituteFunds: 1440, managementFee: 240, netAmount: 480, teamReward: 240 },
                            { totalRevenue: 1100, instituteFunds: 660, managementFee: 110, netAmount: 220, teamReward: 110 },
                            { totalRevenue: 1700, instituteFunds: 1020, managementFee: 170, netAmount: 340, teamReward: 170 },
                            { totalRevenue: 3500, instituteFunds: 2100, managementFee: 350, netAmount: 700, teamReward: 350 },
                            { totalRevenue: 800, instituteFunds: 480, managementFee: 80, netAmount: 160, teamReward: 80 },
                            { totalRevenue: 600, instituteFunds: 360, managementFee: 60, netAmount: 120, teamReward: 60 }
                          ];
                          
                          const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
                          const totalInstituteFunds = data.reduce((sum, item) => sum + item.instituteFunds, 0);
                          const totalManagementFee = data.reduce((sum, item) => sum + item.managementFee, 0);
                          const totalNetAmount = data.reduce((sum, item) => sum + item.netAmount, 0);
                          const totalTeamReward = data.reduce((sum, item) => sum + item.teamReward, 0);
                          
                          const instituteFundsPercentage = Math.round((totalInstituteFunds / totalRevenue) * 100);
                          const managementFeePercentage = Math.round((totalManagementFee / totalRevenue) * 100);
                          const netAmountPercentage = Math.round((totalNetAmount / totalRevenue) * 100);
                          const teamRewardPercentage = Math.round((totalTeamReward / totalRevenue) * 100);
                          
                          return (
                            <tr className="bg-blue-50 font-medium border-t border-gray-200 sticky bottom-0">
                              <td className="px-3 py-2 text-blue-800">
                                总计
                              </td>
                              <td className="px-3 py-2 text-right text-blue-800">
                                {totalRevenue.toLocaleString()}万元
                              </td>
                              <td className="px-3 py-2 text-right text-blue-800">
                                {totalInstituteFunds.toLocaleString()}万元 ({instituteFundsPercentage}%)
                              </td>
                              <td className="px-3 py-2 text-right text-blue-800">
                                {totalManagementFee.toLocaleString()}万元 ({managementFeePercentage}%)
                              </td>
                              <td className="px-3 py-2 text-right text-blue-800">
                                {totalNetAmount.toLocaleString()}万元 ({netAmountPercentage}%)
                              </td>
                              <td className="px-3 py-2 text-right text-blue-800">
                                {totalTeamReward.toLocaleString()}万元 ({teamRewardPercentage}%)
                              </td>
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  // 渲染放大的图表组件
  const renderExpandedChart = () => {
    switch (expandedChart) {
      case 'research-output':
        return <DynamicSingleBarChart />
      case 'funding-distribution':
        return <DynamicProjectFundingChart />
      case 'task-completion':
        return <DynamicTeamDistributionChart />
      case 'research-institute-target-comparison':
        return <DynamicResearchInstituteTargetChart />
      case 'multi-dimensional-analysis':
        return <DynamicMultiDimensionalAnalysisChart activeMode={multiDimensionMode} />
      case 'target-completion-status':
        return <DynamicTargetCompletionStatusChart />
      case 'ip-transformation-efficiency':
        return <DynamicIPTransformationEfficiencyChart />
      case 'revenue-distribution':
        return <DynamicRevenueDistributionChart />
      case 'horizontal-research-projects':
        return <DynamicHorizontalResearchProjectsChart />
      case 'project-application':
      case 'project-status':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p>图表占位符</p>
              <p className="text-sm mt-2">该功能暂未实现</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // 获取图表标题
  const getChartTitle = (chartId: string) => {
    const titles = {
      'research-output': '科研成果产出统计',
      'funding-distribution': '科研经费分配情况',
      'task-completion': '任务完成情况',
      'research-institute-target-comparison': '各研究所目标达成对比图',
      'multi-dimensional-analysis': '多维度成果转化分析图',
      'target-completion-status': '成果转化目标完成状态分布图',
      'ip-transformation-efficiency': '测试3',
      'revenue-distribution': '各研究所收益分配结构图',
      'horizontal-research-projects': '各研究所横向科研项目统计'
    }
    return titles[chartId as keyof typeof titles] || '图表详情'
  }

  return (
    <div className="space-y-6">
      {renderContent()}
      
      {/* 图表放大对话框 */}
      <Dialog open={!!expandedChart} onOpenChange={handleCloseExpanded}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-semibold">
              {expandedChart && getChartTitle(expandedChart)}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <div className="h-[500px] w-full">
              {renderExpandedChart()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 