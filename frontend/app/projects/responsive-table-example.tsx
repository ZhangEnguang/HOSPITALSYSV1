"use client"

import { useState } from "react"
import { StickyTable } from "@/components/ui/sticky-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Pencil, Trash2, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

// 示例数据
const projects = [
  {
    id: 1,
    name: "智慧园区综合管理平台",
    description: "整合园区安防、能源、环境等多系统数据，实现园区智能化管理。",
    status: "进行中",
    priority: "高",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 75,
    tasks: { total: 10, completed: 7 },
    leader: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    members: 5,
    budget: 850000,
  },
  {
    id: 2,
    name: "AI视觉监控系统",
    description: "基于深度学习的智能视频分析系统，提供异常行为识别和预警。",
    status: "规划中",
    priority: "中",
    startDate: "2024-03-01",
    endDate: "2024-09-30",
    progress: 20,
    tasks: { total: 15, completed: 3 },
    leader: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    members: 5,
    budget: 650000,
  },
  {
    id: 3,
    name: "智慧能源管理系统",
    description: "通过IoT设备和AI算法优化园区能源使用，实现节能减排。",
    status: "已完成",
    priority: "高",
    startDate: "2023-07-01",
    endDate: "2023-12-31",
    progress: 100,
    tasks: { total: 10, completed: 10 },
    leader: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    members: 3,
    budget: 720000,
  },
  {
    id: 4,
    name: "智能访客管理系统",
    description: "基于人脸识别的访客管理系统，提供自动化通行和记录。",
    status: "已暂停",
    priority: "中",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    progress: 40,
    tasks: { total: 18, completed: 7 },
    leader: { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    members: 6,
    budget: 450000,
  },
  {
    id: 5,
    name: "智慧停车管理平台",
    description: "集成车位引导、自动收费、车牌识别等功能的智能停车系统。",
    status: "进行中",
    priority: "中",
    startDate: "2024-02-15",
    endDate: "2024-08-15",
    progress: 35,
    tasks: { total: 12, completed: 4 },
    leader: { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    members: 4,
    budget: 580000,
  },
]

// 状态颜色映射
const statusColors = {
  规划中: "secondary", // 灰色
  进行中: "warning", // 橙色
  已完成: "success", // 绿色
  已暂停: "destructive", // 红色
  已取消: "destructive", // 红色
}

export default function ResponsiveTableExample() {
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // 切换行选择状态
  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedRows.length === projects.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(projects.map((project) => project.id))
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">响应式表格示例</h2>
      <p className="text-muted-foreground">首尾列固定，中间内容可横向滚动，自动适配屏幕宽度</p>

      <div className="border rounded-md overflow-hidden bg-white">
        <StickyTable
          stickyFirstCol={true}
          stickyLastCol={true}
          firstColWidth="3rem"
          lastColWidth="5rem"
          shadowIntensity="medium"
          fadeRange="medium"
          cellPadding="normal"
        >
          <thead className="bg-muted/30">
            <tr className="border-b">
              <th className="w-[50px]">
                <Checkbox
                  checked={selectedRows.length === projects.length && projects.length > 0}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = selectedRows.length > 0 && selectedRows.length < projects.length
                    }
                  }}
                  onCheckedChange={toggleSelectAll}
                  aria-label="全选"
                />
              </th>
              <th>项目名称</th>
              <th>状态</th>
              <th>负责人</th>
              <th>进度</th>
              <th>预算</th>
              <th>开始时间</th>
              <th>结束时间</th>
              <th>团队成员</th>
              <th className="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b hover:bg-muted/20">
                <td>
                  <Checkbox
                    checked={selectedRows.includes(project.id)}
                    onCheckedChange={() => toggleRowSelection(project.id)}
                    aria-label={`选择项目 ${project.name}`}
                  />
                </td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-sm text-muted-foreground line-clamp-1">{project.description}</span>
                  </div>
                </td>
                <td>
                  <Badge variant={statusColors[project.status as keyof typeof statusColors]}>{project.status}</Badge>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={project.leader.avatar} />
                      <AvatarFallback>{project.leader.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{project.leader.name}</span>
                  </div>
                </td>
                <td>
                  <div className="w-[160px] space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">进度</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2 [&>div]:progress-gradient progress-loading" />
                  </div>
                </td>
                <td>
                  <div className="font-medium">¥{project.budget.toLocaleString()}</div>
                </td>
                <td>{format(new Date(project.startDate), "yyyy/MM/dd")}</td>
                <td>{format(new Date(project.endDate), "yyyy/MM/dd")}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{project.members}</span>
                  </div>
                </td>
                <td className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        编辑项目
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除项目
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </StickyTable>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>提示：在窄屏幕下，可以横向滚动查看所有列，首列和尾列将保持固定。</p>
      </div>
    </div>
  )
}

