// 状态颜色映射
export const statusColors = {
  待评审: "secondary",
  评审中: "warning",
  已评审: "primary",
  已通过: "success",
  未通过: "destructive",
}

// 类型颜色映射
export const typeColors = {
  国家级: "default",
  省部级: "secondary",
  市厅级: "outline",
  校级: "ghost",
}

import { ProjectReviewButton } from "../components/project-review-button"

// 表格列配置
export const tableColumns = [
  {
    id: "name",
    header: "项目名称",
    cell: (row: any) => row.name,
    enableSorting: true,
  },
  {
    id: "category",
    header: "项目类别",
    cell: (row: any) => row.category,
    enableSorting: true,
  },
  {
    id: "manager",
    header: "项目负责人",
    cell: (row: any) => row.manager?.name,
    enableSorting: true,
  },
  {
    id: "amount",
    header: "申请金额(万元)",
    cell: (row: any) => row.amount?.toFixed(2),
    enableSorting: true,
  },
  {
    id: "date",
    header: "申报日期",
    cell: (row: any) => row.date,
    enableSorting: true,
  },
  {
    id: "deadline",
    header: "截止日期",
    cell: (row: any) => row.deadline,
    enableSorting: true,
  },
  {
    id: "status",
    header: "状态",
    cell: (row: any) => row.status,
    enableSorting: true,
  },
  {
    id: "expertCount",
    header: "专家数量",
    cell: (row: any) => row.expertCount || 0,
    enableSorting: true,
  },
  {
    id: "actions",
    header: "操作",
    className: "text-right pr-4",
    cell: (row: any) => (
      <div className="flex items-center justify-end">
        <ProjectReviewButton projectId={row.id} type="review" variant="outline" />
        <ProjectReviewButton projectId={row.id} type="assign" variant="outline" />
      </div>
    ),
  },
]

// 卡片字段配置
export const cardFields = [
  {
    id: "name",
    label: "项目名称",
    value: (row: any) => row.name,
  },
  {
    id: "category",
    label: "项目类别",
    value: (row: any) => row.category,
  },
  {
    id: "manager",
    label: "项目负责人",
    value: (row: any) => row.manager?.name,
  },
  {
    id: "amount",
    label: "申请金额",
    value: (row: any) => `${row.amount?.toFixed(2)} 万元`,
  },
  {
    id: "date",
    label: "申报日期",
    value: (row: any) => row.date,
  },
  {
    id: "deadline",
    label: "截止日期",
    value: (row: any) => row.deadline,
  },
  {
    id: "expertCount",
    label: "专家数量",
    value: (row: any) => row.expertCount || 0,
  },
]

// 卡片操作配置
export const cardActions = [
  {
    id: "assign",
    label: "分派专家",
    icon: "users",
    onClick: (row: any) => console.log("分派专家", row),
  },
]

// 表格操作配置
export const tableActions = [
  {
    id: "assign",
    label: "分派专家",
    icon: "Users",
    onClick: (item: any) => console.log("分派专家", item),
  },
  {
    id: "delete",
    label: "删除",
    icon: "Trash2",
    onClick: (item: any) => console.log("删除", item),
    variant: "destructive",
  },
]

// 批量操作配置
export const batchActions = [
  {
    id: "approve",
    label: "批量通过",
    icon: "check",
    onClick: (rows: any[]) => console.log("批量通过", rows),
  },
  {
    id: "reject",
    label: "批量拒绝",
    icon: "x",
    onClick: (rows: any[]) => console.log("批量拒绝", rows),
  },
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "status",
    label: "状态",
    options: [
      { value: "all", label: "全部" },
      { value: "待分配", label: "待分配" },
      { value: "审核中", label: "审核中" },
      { value: "已通过", label: "已通过" },
      { value: "已拒绝", label: "已拒绝" },
    ],
  },
  {
    id: "category",
    label: "类别",
    options: [
      { value: "all", label: "全部" },
      { value: "工程技术", label: "工程技术" },
      { value: "自然科学", label: "自然科学" },
      { value: "人文社科", label: "人文社科" },
      { value: "医学健康", label: "医学健康" },
    ],
  },
]

// 高级筛选配置
export const advancedFilters = [
  {
    id: "dateRange",
    label: "申报日期",
    type: "dateRange",
  },
  {
    id: "amount",
    label: "申请金额",
    type: "range",
    min: 0,
    max: 1000,
    step: 10,
    unit: "万元",
  },
  {
    id: "manager",
    label: "负责人",
    type: "select",
    options: [
      { value: "all", label: "全部" },
      { value: "1", label: "张三" },
      { value: "2", label: "李四" },
      { value: "3", label: "王五" },
    ],
  },
]

// 排序选项配置
export const sortOptions = [
  { value: "date_desc", label: "申报日期 (新→旧)" },
  { value: "date_asc", label: "申报日期 (旧→新)" },
  { value: "amount_desc", label: "申请金额 (高→低)" },
  { value: "amount_asc", label: "申请金额 (低→高)" },
  { value: "name_asc", label: "项目名称 (A→Z)" },
  { value: "name_desc", label: "项目名称 (Z→A)" },
]

