"use client"

import { useState } from "react"
import StatusDataList from "@/components/data-list/status-data-list"
import type { Column, ActionButton } from "@/components/data-list/status-data-list"
import type { StatusConfig } from "@/components/status-list"
import { Edit, FileText, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// 模拟预算标准数据
const mockBudgetStandards = [
  {
    id: "1",
    code: "JX2023001",
    name: "国自然2020至今(2020-2022)",
    category: "纵向科研项目",
    level: "国家级",
    validPeriod: "2020-01-01至2022-12-31",
    createdBy: "管理员",
    description: "国家自然科学基金项目经费标准",
    status: "启用",
    enabled: true,
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    code: "JX2023002",
    name: "社科基金2021标准",
    category: "纵向科研项目",
    level: "国家级",
    validPeriod: "2021-01-01至2023-12-31",
    createdBy: "管理员",
    description: "国家社会科学基金项目经费标准",
    status: "启用",
    enabled: true,
    createdAt: "2023-06-10",
  },
  {
    id: "3",
    code: "JX2023003",
    name: "校级科研项目2022标准",
    category: "校级科研项目",
    level: "校级",
    validPeriod: "2022-01-01至2024-12-31",
    createdBy: "管理员",
    description: "校级科研项目经费标准",
    status: "启用",
    enabled: true,
    createdAt: "2023-07-22",
  },
  {
    id: "4",
    code: "JX2023004",
    name: "省部级科研项目2023标准",
    category: "省部级科研项目",
    level: "省部级",
    validPeriod: "2023-01-01至2025-12-31",
    createdBy: "管理员",
    description: "省部级科研项目经费标准",
    status: "停用",
    enabled: false,
    createdAt: "2023-08-05",
  },
  {
    id: "5",
    code: "JX2023005",
    name: "横向项目标准2023",
    category: "横向科研项目",
    level: "企业",
    validPeriod: "2023-01-01至2025-12-31",
    createdBy: "管理员",
    description: "横向合作项目经费标准",
    status: "启用", 
    enabled: true,
    createdAt: "2023-09-18",
  },
]

// 状态配置
const statusConfigs: StatusConfig[] = [
  {
    value: "启用",
    label: "启用",
    color: "green",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "#10b981",
  },
  {
    value: "停用",
    label: "停用",
    color: "gray",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "#6b7280",
  },
]

export function BudgetStandardTab() {
  // 状态管理
  const [data, setData] = useState(mockBudgetStandards)
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])

  // 处理状态切换
  const handleToggleStatus = (id: string | number, newStatus: boolean) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { 
              ...item, 
              enabled: newStatus,
              status: newStatus ? "启用" : "停用" 
            } 
          : item
      )
    )
    toast.success(`已${newStatus ? '启用' : '禁用'}预算标准`)
  }

  // 列定义
  const columns: Column[] = [
    {
      id: "code",
      header: "标准编号",
      accessorKey: "code",
    },
    {
      id: "name",
      header: "标准名称",
      accessorKey: "name",
      cell: (item) => <div className="font-medium">{item.name}</div>,
    },
    {
      id: "category",
      header: "所属分类",
      accessorKey: "category",
    },
    {
      id: "level",
      header: "项目级别",
      accessorKey: "level",
    },
    {
      id: "validPeriod",
      header: "有效期",
      accessorKey: "validPeriod",
    },
    {
      id: "createdBy",
      header: "创建人",
      accessorKey: "createdBy",
    },
    {
      id: "status",
      header: "状态",
      accessorKey: "status",
      cell: (item) => (
        <Badge className={item.enabled ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}>
          {item.status}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "创建时间",
      accessorKey: "createdAt",
    },
  ]

  // 操作按钮
  const actions: ActionButton[] = [
    {
      id: "edit",
      label: "编辑",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item) => console.log("编辑", item),
      variant: "outline",
    },
  ]

  // 下拉菜单操作
  const dropdownActions: ActionButton[] = [
    {
      id: "view",
      label: "查看详情",
      icon: <FileText className="h-4 w-4" />,
      onClick: (item) => console.log("查看", item),
    },
    {
      id: "delete",
      label: "删除",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item) => {
        if (confirm(`确定要删除"${item.name}"吗？`)) {
          setData(data.filter(d => d.id !== item.id))
          toast.success("删除成功")
        }
      },
    },
  ]

  return (
    <StatusDataList
      data={data}
      columns={columns}
      statusField="status"
      statusConfigs={statusConfigs}
      actions={actions}
      dropdownActions={[
        ...dropdownActions,
        {
          id: "toggleStatus",
          label: (item) => item.enabled ? "禁用" : "启用",
          icon: null,
          onClick: (item) => handleToggleStatus(item.id, !item.enabled)
        }
      ]}
      selectable={true}
      onSelectionChange={setSelectedIds}
    />
  )
} 