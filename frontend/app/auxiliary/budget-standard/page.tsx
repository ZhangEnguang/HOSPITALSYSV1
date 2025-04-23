"use client"

import React, { useState } from "react"
import StatusDataList from "@/components/data-list/status-data-list"
import type { Column, ActionButton } from "@/components/data-list/status-data-list"
import type { StatusConfig } from "@/components/status-list"
import { FileText, Edit, Trash2, ArrowLeft, PlusCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import Dict from "@/components/dict/Dict"

import { BudgetStandardQueryParams } from "@/types/budget-standard"

// 定义预算标准列
const budgetStandardColumns = [
  {
    id: "name",
    header: "标准名称",
    accessorKey: "name",
    cell: (row: any) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "code",
    header: "编码",
    accessorKey: "code",
    cell: (row: any) => row.code,
  },
  {
    id: "projectType",
    header: "适用项目类型",
    accessorKey: "projectType",
    cell: (row: any) => <Dict dictCode="project_type" displayType="tag" value={row.projectType} />,
  },
  {
    id: "limitAmount",
    header: "限额",
    accessorKey: "limitAmount",
    cell: (row: any) => row.limitAmount ? `¥${row.limitAmount.toLocaleString()}` : "-",
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => (
      <Badge variant={row.status === "启用" ? "outline" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    header: "创建时间",
    accessorKey: "createdAt",
    cell: (row: any) => row.createdAt,
  },
]

// 使用本地模拟数据
const budgetStandardData = [
  {
    id: "bs1",
    name: "国家级重点项目预算标准",
    code: "YS001",
    projectType: "纵向科研项目",
    limitAmount: 5000000,
    description: "适用于国家级重点科研项目的预算标准",
    status: "启用",
    enabled: true,
    createdAt: "2023-05-20",
  },
  {
    id: "bs2",
    name: "省部级项目预算标准",
    code: "YS002",
    projectType: "纵向科研项目",
    limitAmount: 1000000,
    description: "适用于省部级科研项目的预算标准",
    status: "启用",
    enabled: true,
    createdAt: "2023-06-15",
  },
  {
    id: "bs3",
    name: "市厅级项目预算标准",
    code: "YS003",
    projectType: "纵向科研项目",
    limitAmount: 500000,
    description: "适用于市厅级科研项目的预算标准",
    status: "启用",
    enabled: true,
    createdAt: "2023-07-10",
  },
  {
    id: "bs4",
    name: "校级项目预算标准",
    code: "YS004",
    projectType: "校级科研项目",
    limitAmount: 200000,
    description: "适用于校级科研项目的预算标准",
    status: "启用", 
    enabled: true,
    createdAt: "2023-08-05",
  },
  {
    id: "bs5",
    name: "企业合作项目预算标准",
    code: "YS005",
    projectType: "横向科研项目",
    limitAmount: 3000000,
    description: "适用于企业合作的横向科研项目预算标准",
    status: "启用",
    enabled: true,
    createdAt: "2023-09-12",
  },
  {
    id: "bs6",
    name: "教学改革项目预算标准",
    code: "YS006",
    projectType: "教学改革项目",
    limitAmount: 100000,
    description: "适用于教学改革项目的预算标准",
    status: "停用",
    enabled: false,
    createdAt: "2023-10-25",
  },
]

// 状态配置
const statusConfigs: StatusConfig[] = [
  {
    value: "启用",
    label: "启用",
    color: "green",
  },
  {
    value: "停用",
    label: "停用",
    color: "gray",
  },
]

// 格式化日期时间函数
const formatDateTime = (dateString: string) => {
  try {
    return format(new Date(dateString), 'yyyy-MM-dd');
  } catch (error) {
    return dateString;
  }
};

export default function BudgetStandardPage() {
  const router = useRouter()

  // 状态管理
  const [data, setData] = useState(budgetStandardData)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: budgetStandardData.length,
  })
  const [dialogVisible, setDialogVisible] = useState(false)

  // 处理分页变更
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      page,
      pageSize,
    })
  }

  // 处理搜索
  const handleSearch = (params: BudgetStandardQueryParams) => {
    console.log("搜索参数:", params)
    // 实际项目中这里会调用API进行数据获取
  }

  // 启用/禁用预算标准
  const handleToggleStatus = (row: any) => {
    // 更新本地数据（实际项目中会调用API）
    const newData = data.map((item) => {
      if (item.id === row.id) {
        const newStatus = item.status === "启用" ? "停用" : "启用"
        return { ...item, status: newStatus }
      }
      return item
    })
    
    setData(newData)
    
    // 显示通知
    const statusText = row.status === "启用" ? "停用" : "启用"
    toast.success(`已${statusText}预算标准：${row.name}`)
  }

  // 处理查看预算标准详情
  const handleViewDetail = (item: any) => {
    // 在实际项目中，这里应该导航到预算标准详情页面
    // 如果没有单独的详情页，可以打开一个模态框显示详情
    console.log("查看预算标准详情", item);
    // 跳转到详情页面，假设详情页面路径为 /auxiliary/budget-standard/[id]
    if (item && item.id) {
      router.push(`/auxiliary/budget-standard/${item.id}`);
    } else {
      toast.error("无法查看详情：无效的预算标准ID");
    }
  }

  // 导航到新增预算标准页面
  const handleAddNew = () => {
    router.push('/auxiliary/create/budget-standard')
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/auxiliary" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回辅助信息管理
        </Link>
        <h1 className="text-2xl font-bold ml-4">预算标准管理</h1>

        <Button
          variant="default"
          size="sm"
          className="ml-auto h-8"
          onClick={handleAddNew}
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          新增预算标准
        </Button>
      </div>

      <StatusDataList
        data={data}
        statusField="status"
        statusConfigs={statusConfigs}
        columns={budgetStandardColumns}
        actions={[
          {
            id: "edit",
            label: "编辑",
            icon: <Edit className="h-4 w-4" />,
            onClick: (item) => router.push(`/auxiliary/edit/budget-standard/${item.id}`),
            variant: "outline",
          }
        ]}
        dropdownActions={[
          {
            id: "view",
            label: "查看详情",
            icon: <FileText className="h-4 w-4" />,
            onClick: (item) => handleViewDetail(item)
          },
          {
            id: "toggle",
            label: (item) => item.status === "启用" ? "禁用标准" : "启用标准",
            icon: <Clock className="h-4 w-4" />,
            onClick: (item) => handleToggleStatus(item)
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
            }
          }
        ]}
        selectable={true}
        onRowClick={(item) => handleViewDetail(item)}
      />
    </div>
  );
} 