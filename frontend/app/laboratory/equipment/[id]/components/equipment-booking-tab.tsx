"use client"

import { Calendar, Clock, User, AlertCircle, CheckCircle, XCircle, BarChart3, TrendingUp, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"

interface EquipmentBookingTabProps {
  data: any
}

// 模拟预约记录数据
const mockBookingRecords = [
  {
    id: "booking1",
    user: { name: "张三", department: "化学实验室", avatar: "/avatars/user1.jpg" },
    startTime: "2024-01-15 09:00",
    endTime: "2024-01-15 12:00",
    purpose: "材料成分分析实验",
    status: "已完成",
    actualStartTime: "2024-01-15 09:05",
    actualEndTime: "2024-01-15 11:55",
    notes: "实验顺利完成，数据质量良好",
    bookingTime: "2024-01-10 14:30"
  },
  {
    id: "booking2",
    user: { name: "李四", department: "材料实验室", avatar: "/avatars/user2.jpg" },
    startTime: "2024-01-16 14:00",
    endTime: "2024-01-16 17:00",
    purpose: "晶体结构分析",
    status: "使用中",
    actualStartTime: "2024-01-16 14:00",
    actualEndTime: null,
    notes: "正在进行样品测试",
    bookingTime: "2024-01-12 10:15"
  },
  {
    id: "booking3",
    user: { name: "王五", department: "物理实验室", avatar: "/avatars/user3.jpg" },
    startTime: "2024-01-17 10:00",
    endTime: "2024-01-17 15:00",
    purpose: "表面形貌观察",
    status: "已预约",
    actualStartTime: null,
    actualEndTime: null,
    notes: "需要进行样品预处理",
    bookingTime: "2024-01-14 16:20"
  },
  {
    id: "booking4",
    user: { name: "赵六", department: "生物实验室", avatar: "/avatars/user4.jpg" },
    startTime: "2024-01-18 09:00",
    endTime: "2024-01-18 11:00",
    purpose: "生物材料检测",
    status: "已取消",
    actualStartTime: null,
    actualEndTime: null,
    notes: "实验计划变更，取消预约",
    bookingTime: "2024-01-13 11:45"
  },
  {
    id: "booking5",
    user: { name: "孙七", department: "化学实验室", avatar: "/avatars/user5.jpg" },
    startTime: "2024-01-19 13:00",
    endTime: "2024-01-19 16:00",
    purpose: "催化剂性能测试",
    status: "待审核",
    actualStartTime: null,
    actualEndTime: null,
    notes: "需要使用特殊样品台",
    bookingTime: "2024-01-15 09:30"
  }
]

export default function EquipmentBookingTab({ data }: EquipmentBookingTabProps) {
  // 获取状态对应的颜色和图标
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "已完成":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        }
      case "使用中":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock className="h-4 w-4 text-blue-500" />
        }
      case "已预约":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Calendar className="h-4 w-4 text-amber-500" />
        }
      case "已取消":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle className="h-4 w-4 text-red-500" />
        }
      case "待审核":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <Clock className="h-4 w-4 text-purple-500" />
        }
      default:
        return {
          color: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <AlertCircle className="h-4 w-4 text-slate-500" />
        }
    }
  }

  // 按状态分组预约记录
  const groupedBookings = {
    current: mockBookingRecords.filter(booking => booking.status === "使用中"),
    upcoming: mockBookingRecords.filter(booking => booking.status === "已预约" || booking.status === "待审核"),
    completed: mockBookingRecords.filter(booking => booking.status === "已完成"),
    cancelled: mockBookingRecords.filter(booking => booking.status === "已取消")
  }

  // 统计数据
  const statistics = {
    total: mockBookingRecords.length,
    completed: groupedBookings.completed.length,
    current: groupedBookings.current.length,
    upcoming: groupedBookings.upcoming.length,
    cancelled: groupedBookings.cancelled.length,
    utilizationRate: 78,
    avgDuration: 2.5
  }

  // 使用状态分析
  const usageAnalysis = {
    peakHours: "14:00-17:00",
    mostActiveUser: "张三",
    avgBookingDuration: "2.8小时",
    completionRate: Math.round((statistics.completed / statistics.total) * 100),
    cancelRate: Math.round((statistics.cancelled / statistics.total) * 100),
    utilizationTrend: "上升",
    nextMaintenanceIn: "15天"
  }

  return (
    <div className="space-y-6">
      {/* 统计概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总预约数</p>
                <p className="text-2xl font-bold">{statistics.total}</p>
                <p className="text-xs text-green-600 mt-1">本月 +12</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">使用中</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.current}</p>
                <p className="text-xs text-slate-600 mt-1">正常运行</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">完成率</p>
                <p className="text-2xl font-bold text-green-600">{usageAnalysis.completionRate}%</p>
                <p className="text-xs text-green-600 mt-1">表现良好</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">利用率</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.utilizationRate}%</p>
                <p className="text-xs text-purple-600 mt-1">趋势{usageAnalysis.utilizationTrend}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 当前使用状态 */}
      {groupedBookings.current.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              当前使用状态
            </CardTitle>
            <CardDescription>设备正在使用中</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupedBookings.current.map((booking) => {
                const statusInfo = getStatusInfo(booking.status)
                return (
                  <div key={booking.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-blue-900">{booking.user.name}</span>
                          <Badge className={statusInfo.color}>
                            {statusInfo.icon}
                            <span className="ml-1">{booking.status}</span>
                          </Badge>
                          <span className="text-xs text-blue-600">{booking.user.department}</span>
                        </div>
                        <p className="text-sm text-blue-700 mb-2">{booking.purpose}</p>
                        <div className="text-xs text-blue-600 grid grid-cols-1 md:grid-cols-2 gap-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>预约: {booking.startTime} - {booking.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>开始: {booking.actualStartTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 预约记录时间轴 */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">预约记录</CardTitle>
              <CardDescription>最近的预约使用记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBookingRecords
                  .sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime())
                  .slice(0, 6) // 只显示最近6条记录
                  .map((booking, index) => {
                    const statusInfo = getStatusInfo(booking.status)
                    const isLast = index === 5
                    
                    return (
                      <div key={booking.id}>
                        <div className="flex items-start gap-4">
                          {/* 时间轴线条 */}
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full border-2 ${
                              booking.status === "使用中" ? "bg-blue-500 border-blue-500" :
                              booking.status === "已完成" ? "bg-green-500 border-green-500" :
                              booking.status === "已预约" ? "bg-amber-500 border-amber-500" :
                              booking.status === "待审核" ? "bg-purple-500 border-purple-500" :
                              "bg-red-500 border-red-500"
                            }`} />
                            {!isLast && <div className="w-0.5 h-12 bg-slate-200 mt-2" />}
                          </div>
                          
                          {/* 预约信息 */}
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{booking.user.name}</span>
                              <Badge className={statusInfo.color}>
                                {statusInfo.icon}
                                <span className="ml-1">{booking.status}</span>
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {booking.user.department}
                              </span>
                            </div>
                            
                            <p className="text-sm text-slate-700 mb-1">{booking.purpose}</p>
                            
                            <div className="text-xs text-slate-600">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{booking.startTime}</span>
                                </div>
                                {booking.actualStartTime && booking.actualEndTime && (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>实际: {booking.actualStartTime} - {booking.actualEndTime}</span>
                                  </div>
                                )}
                              </div>
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

        {/* 使用分析 */}
        <div className="space-y-6">
          {/* 使用状态分析 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">使用分析</CardTitle>
              <CardDescription>设备使用状况分析</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600">设备利用率</span>
                  <span className="font-semibold">{statistics.utilizationRate}%</span>
                </div>
                <Progress value={statistics.utilizationRate} className="h-2" />
                <p className="text-xs text-slate-500 mt-1">相比上月提升 8%</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600">预约完成率</span>
                  <span className="font-semibold">{usageAnalysis.completionRate}%</span>
                </div>
                <Progress value={usageAnalysis.completionRate} className="h-2" />
                <p className="text-xs text-slate-500 mt-1">取消率 {usageAnalysis.cancelRate}%</p>
              </div>

              <div className="pt-2 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">使用高峰期</span>
                    <span className="font-semibold">{usageAnalysis.peakHours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">最活跃用户</span>
                    <span className="font-semibold">{usageAnalysis.mostActiveUser}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">平均使用时长</span>
                    <span className="font-semibold">{usageAnalysis.avgBookingDuration}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 设备状态概览 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">设备状态</CardTitle>
              <CardDescription>当前设备运行状态</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">运行状态</span>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  正常运行
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">预约状态</span>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  开放预约
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">下次维护</span>
                <span className="font-semibold text-amber-600">{usageAnalysis.nextMaintenanceIn}后</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">设备负责人</span>
                <span className="font-semibold">{data.manager?.name || "未指定"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">所属部门</span>
                <span className="font-semibold">{data.department}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 