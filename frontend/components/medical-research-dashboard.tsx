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
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// 动态导入数据看板专用图表组件
const DynamicProjectStatusChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-project-status-chart"), { ssr: false })
const DynamicProjectApplicationChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-teacher-publication-chart"), { ssr: false })
const DynamicProjectFundingChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-project-funding-chart"), { ssr: false })
const DynamicProjectHealthChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-project-health-chart"), { ssr: false })
const DynamicTeamDistributionChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-team-distribution-chart"), { ssr: false })
const DynamicResourceUtilizationChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-resource-utilization-chart"), { ssr: false })
const DynamicSingleBarChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-single-bar-chart"), { ssr: false })

// 动态导入数据看板专用图表组件
const DynamicProjectProgressPanoramaChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-project-progress-panorama-chart"), { ssr: false })
const DynamicProjectTypeDistributionChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-project-type-distribution-chart"), { ssr: false })
const DynamicProjectLevelStatisticsChart = dynamic(() => import("@/components/data-dashboard-charts/dashboard-project-level-statistics-chart"), { ssr: false })

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
      case "projects":
        return renderProjectsContent()
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
                  <DynamicProjectApplicationChart />
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
                          <MoreVertical className="h-4 w-4 text-gray-500" />
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
                    <DynamicProjectStatusChart />
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
                          <MoreVertical className="h-4 w-4 text-gray-500" />
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

  // 科研项目内容
  const renderProjectsContent = () => (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-4">
      {/* 科研项目特色布局：对称且有合理间隔的混合布局 */}
      {/* 第一行：左侧特大卡片 = 右侧两个中等卡片的总高度 */}
      <div className="flex gap-4 flex-1">
        {/* 左侧特大卡片 - 占1/2宽度，与下方学科分布卡片保持同样宽度 */}
        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[18px] font-normal">项目进度全景分析</CardTitle>
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
                <DropdownMenuItem onClick={() => handleExpandChart('project-overview')}>
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
              <p className="text-sm mt-2">项目进度全景分析</p>
            </div>
          </CardContent>
        </Card>

        {/* 右侧两个中等卡片 - 垂直排列，占1/2宽度，有间隔 */}
        <div className="flex flex-col gap-4 flex-1">
          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[18px] font-normal">纵向项目级别统计</CardTitle>
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
                  <DropdownMenuItem onClick={() => handleExpandChart('project-type')}>
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
                <p className="text-sm mt-2">纵向项目级别统计</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[18px] font-normal">项目级别统计</CardTitle>
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
                  <DropdownMenuItem onClick={() => handleExpandChart('project-level')}>
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
                <p className="text-sm mt-2">项目级别统计</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 第二行：左侧学科分布 + 年度趋势 = 右侧三个小卡片的总高度 */}
      <div className="flex gap-4 flex-1">
        {/* 左侧两个大卡片 - 垂直排列，占1/2宽度，有间隔 */}
        <div className="flex flex-col gap-4 flex-1">
          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[18px] font-normal">学科分布情况</CardTitle>
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
                  <DropdownMenuItem onClick={() => handleExpandChart('discipline-distribution')}>
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
                <p className="text-sm mt-2">学科分布情况</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[18px] font-normal">年度趋势分析</CardTitle>
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
                  <DropdownMenuItem onClick={() => handleExpandChart('annual-trend')}>
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
                <p className="text-sm mt-2">年度趋势分析</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧三个小卡片 - 垂直排列，占1/2宽度，有间隔 */}
        <div className="flex flex-col gap-4 flex-1">
          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[18px] font-normal">经费使用</CardTitle>
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
                  <DropdownMenuItem onClick={() => handleExpandChart('funding-usage')}>
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
                <p className="text-sm mt-2">经费使用</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[18px] font-normal">团队规模</CardTitle>
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
                  <DropdownMenuItem onClick={() => handleExpandChart('team-scale')}>
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
                <p className="text-sm mt-2">团队规模</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
                <CardTitle className="text-[18px] font-normal">成果产出评估</CardTitle>
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
                  <DropdownMenuItem onClick={() => handleExpandChart('achievement-evaluation')}>
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
                <p className="text-sm mt-2">成果产出评估</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  // 经费管理内容
  const renderFundingContent = () => (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-4">
      {/* 经费管理特色布局：梯形金字塔式不对称布局 */}
      
      {/* 第一行：单个核心大卡片 - 顶层核心统计 */}
      <div className="flex gap-4 flex-1">
        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[20px] font-normal">经费总体概览</CardTitle>
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
                <DropdownMenuItem onClick={() => handleExpandChart('funding-overview')}>
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
              <p className="text-sm mt-2">经费总体概览</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 第二行：两个中等卡片 - 中层核心分析 */}
      <div className="flex gap-4 flex-1">
        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[18px] font-normal">经费收支分析</CardTitle>
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
                <DropdownMenuItem onClick={() => handleExpandChart('funding-income-expense')}>
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
              <p className="text-sm mt-2">经费收支分析</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[18px] font-normal">预算执行率</CardTitle>
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
                <DropdownMenuItem onClick={() => handleExpandChart('budget-execution')}>
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
              <p className="text-sm mt-2">预算执行率</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 第三行：三个小卡片 - 底层详细统计 */}
      <div className="flex gap-4 flex-1">
        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[16px] font-normal">项目经费分布</CardTitle>
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
                <DropdownMenuItem onClick={() => handleExpandChart('project-funding-distribution')}>
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
              <p className="text-xs mt-1">项目经费分布</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[16px] font-normal">经费使用效率</CardTitle>
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
                <DropdownMenuItem onClick={() => handleExpandChart('funding-efficiency')}>
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
              <p className="text-xs mt-1">经费使用效率</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-lg border border-white/50 group flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
              <CardTitle className="text-[16px] font-normal">外拨经费统计</CardTitle>
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
                <DropdownMenuItem onClick={() => handleExpandChart('outbound-funding')}>
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
              <p className="text-xs mt-1">外拨经费统计</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // 渲染放大的图表组件
  const renderExpandedChart = () => {
    switch (expandedChart) {
      case 'research-output':
        return <DynamicSingleBarChart />
      case 'project-application':
        return <DynamicProjectApplicationChart />
      case 'funding-distribution':
        return <DynamicProjectFundingChart />
      case 'project-status':
        return <DynamicProjectStatusChart />
      case 'task-completion':
        return <DynamicTeamDistributionChart />
      case 'project-overview':
        return <DynamicProjectProgressPanoramaChart />
      case 'project-type':
        return <DynamicProjectTypeDistributionChart />
      case 'project-level':
        return <DynamicProjectLevelStatisticsChart />
      default:
        return null
    }
  }

  // 获取图表标题
  const getChartTitle = (chartId: string) => {
    const titles = {
      'research-output': '科研成果产出统计',
      'project-application': '科研项目申报与立项情况',
      'funding-distribution': '科研经费分配情况',
      'project-status': '科研项目状态分布',
      'task-completion': '任务完成情况',
      'project-overview': '项目进度全景分析',
      'project-type': '项目类型分布',
      'project-level': '项目级别统计'
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