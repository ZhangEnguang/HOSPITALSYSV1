"use client"

import { useState } from "react"
import StatusDataList from "@/components/data-list/status-data-list"
import type { Column, ActionButton } from "@/components/data-list/status-data-list"
import type { StatusConfig } from "@/components/status-list"
import { FileText, Edit, Trash2, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"

// 模拟评审工作表数据
const mockReviewWorksheets = [
  {
    id: "rw1",
    name: "国家级科研项目立项评审表",
    code: "PS001",
    projectType: "纵向科研项目",
    reviewType: "立项评审",
    description: "用于国家级科研项目立项阶段的专家评审",
    status: "启用",
    enabled: true,
    createdAt: "2023-05-25",
  },
  {
    id: "rw2",
    name: "省部级项目中期评审表",
    code: "PS002",
    projectType: "纵向科研项目",
    reviewType: "中期评审",
    description: "用于省部级科研项目中期进展评审",
    status: "启用",
    enabled: true,
    createdAt: "2023-06-18",
  },
  {
    id: "rw3",
    name: "横向项目结题评审表",
    code: "PS003",
    projectType: "横向科研项目",
    reviewType: "结题评审",
    description: "用于企业合作横向项目结题验收评审",
    status: "停用",
    enabled: false,
    createdAt: "2023-07-22",
  },
  {
    id: "rw4",
    name: "校级项目立项评审表",
    code: "PS004",
    projectType: "校级科研项目",
    reviewType: "立项评审",
    description: "用于校级科研项目立项阶段的评审",
    status: "启用", 
    enabled: true,
    createdAt: "2023-08-15",
  },
  {
    id: "rw5",
    name: "教学改革项目评审表",
    code: "PS005",
    projectType: "教学改革项目",
    reviewType: "综合评审",
    description: "用于教学改革项目的综合评审",
    status: "启用",
    enabled: true,
    createdAt: "2023-09-20",
  },
  {
    id: "rw6",
    name: "实验室建设项目评审表",
    code: "PS006",
    projectType: "实验室建设项目",
    reviewType: "立项评审",
    description: "用于实验室建设与改造项目的立项评审",
    status: "停用",
    enabled: false,
    createdAt: "2023-10-30",
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

export default function ReviewWorksheetPage() {
  const [data, setData] = useState(mockReviewWorksheets)
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
    toast.success(`已${newStatus ? '启用' : '禁用'}评审工作表`)
  }

  // 列定义
  const columns: Column[] = [
    {
      id: "name",
      header: "工作表名称",
      accessorKey: "name",
      cell: (item) => <div className="font-medium">{item.name}</div>,
    },
    {
      id: "code",
      header: "编码",
      accessorKey: "code",
    },
    {
      id: "projectType",
      header: "适用项目类型",
      accessorKey: "projectType",
    },
    {
      id: "reviewType",
      header: "评审类型",
      accessorKey: "reviewType",
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
    <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
      <div
        className="absolute top-0 left-0 right-0 h-[300px] -z-10"
        style={{
          background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
        }}
      ></div>

      <div className="container mx-auto py-4 space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/auxiliary" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold">评审工作表管理</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">评审工作表列表</h2>
              <p className="text-muted-foreground text-sm">管理项目评审工作表模板</p>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="bg-muted p-2 rounded-md mb-4">
              已选择 {selectedIds.length} 个评审工作表
            </div>
          )}

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
            onRowClick={(item) => console.log("点击行", item)}
          />
        </div>
      </div>
    </div>
  )
} 