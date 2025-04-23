"use client"

import { useState } from "react"
import { CheckCircle, Clock, FileText, User, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import StatusDataList, { type Column, type ActionButton } from "@/components/data-list/status-data-list"
import type { StatusConfig } from "@/components/status-list"

// 示例数据
const projectData = [
  {
    id: 1,
    title: "高校科研管理系统开发",
    leader: "张教授",
    department: "计算机科学学院",
    startDate: "2023-01-15",
    endDate: "2023-12-31",
    status: "进行中",
    priority: "高",
    budget: 250000,
    type: "技术开发",
  },
  {
    id: 2,
    title: "人工智能在教育中的应用研究",
    leader: "李研究员",
    department: "教育学院",
    startDate: "2023-03-01",
    endDate: "2024-02-28",
    status: "已完成",
    priority: "中",
    budget: 180000,
    type: "基础研究",
  },
  {
    id: 3,
    title: "新能源材料性能测试",
    leader: "王教授",
    department: "材料科学与工程学院",
    startDate: "2023-02-10",
    endDate: "2023-11-30",
    status: "已暂停",
    priority: "高",
    budget: 320000,
    type: "应用研究",
  },
  {
    id: 4,
    title: "校园文化建设与学生发展关系研究",
    leader: "赵博士",
    department: "社会学院",
    startDate: "2023-04-15",
    endDate: "2024-04-14",
    status: "审核中",
    priority: "低",
    budget: 120000,
    type: "人文社科",
  },
  {
    id: 5,
    title: "生物医药新型递送系统开发",
    leader: "陈研究员",
    department: "生物医学工程学院",
    startDate: "2023-01-20",
    endDate: "2024-01-19",
    status: "已拒绝",
    priority: "高",
    budget: 450000,
    type: "应用研究",
  },
]

// 状态配置
const statusConfigs: StatusConfig[] = [
  {
    value: "进行中",
    label: "进行中",
    color: "green",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "#10b981",
    icon: <CheckCircle className="h-3 w-3" />,
    urgent: false,
  },
  {
    value: "已完成",
    label: "已完成",
    color: "blue",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "#3b82f6",
    icon: <CheckCircle className="h-3 w-3" />,
    urgent: false,
  },
  {
    value: "已暂停",
    label: "已暂停",
    color: "amber",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "#f59e0b",
    urgent: false,
  },
  {
    value: "审核中",
    label: "审核中",
    color: "purple",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "#8b5cf6",
    icon: <Clock className="h-3 w-3" />,
    urgent: false,
  },
  {
    value: "已拒绝",
    label: "已拒绝",
    color: "red",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "#ef4444",
    icon: <XCircle className="h-3 w-3" />,
    urgent: false,
  },
]

export default function StatusExample() {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])

  // 列定义
  const columns: Column[] = [
    {
      id: "title",
      header: "项目名称",
      accessorKey: "title",
      cell: (item) => <div className="font-medium">{item.title}</div>,
    },
    {
      id: "leader",
      header: "负责人",
      accessorKey: "leader",
      cell: (item) => (
        <div className="flex items-center">
          <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          {item.leader}
        </div>
      ),
    },
    {
      id: "department",
      header: "所属部门",
      accessorKey: "department",
    },
    {
      id: "type",
      header: "类型",
      accessorKey: "type",
      cell: (item) => (
        <div className="flex items-center">
          <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          {item.type}
        </div>
      ),
    },
    {
      id: "status",
      header: "状态",
      accessorKey: "status",
      cell: (item) => {
        const config = statusConfigs.find((c) => c.value === item.status)
        return (
          <Badge className={`${config?.textColor} ${config?.bgColor}`}>
            {config?.icon && <span className="mr-1">{config.icon}</span>}
            {item.status}
          </Badge>
        )
      },
    },
    {
      id: "budget",
      header: "预算",
      accessorKey: "budget",
      cell: (item) => <div className="font-medium">¥{item.budget.toLocaleString()}</div>,
    },
  ]

  // 操作按钮
  const actions: ActionButton[] = [
    {
      id: "view",
      label: "查看",
      onClick: (item) => console.log("查看", item),
      variant: "outline",
    },
  ]

  // 下拉菜单操作
  const dropdownActions: ActionButton[] = [
    {
      id: "edit",
      label: "编辑",
      onClick: (item) => console.log("编辑", item),
      condition: (item) => item.status !== "已完成",
    },
    {
      id: "delete",
      label: "删除",
      onClick: (item) => console.log("删除", item),
      condition: (item) => item.status !== "已完成",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">项目列表（状态颜色示例）</h2>

      {selectedIds.length > 0 && <div className="bg-muted p-2 rounded-md mb-2">已选择 {selectedIds.length} 个项目</div>}

      <StatusDataList
        data={projectData}
        columns={columns}
        statusField="status"
        statusConfigs={statusConfigs}
        actions={actions}
        dropdownActions={dropdownActions}
        selectable={true}
        onSelectionChange={setSelectedIds}
        onRowClick={(item) => console.log("点击行", item)}
      />
    </div>
  )
}

