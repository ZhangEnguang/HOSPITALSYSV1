// 定义经费项目的接口类型
export interface FundsItem {
  id: string;
  name: string;
  description: string;
  project: {
    id: string;
    name: string;
  };
  type: string;
  category: string;
  amount: number;
  status: string;
  applicant: {
    id: number;
    name: string;
    avatar: string;
  };
  date: string;
  documents?: {
    name: string;
    url: string;
  }[];
}

import { Eye, Pencil, Trash2, Check, X, Download, MessageSquare } from "lucide-react"
import type { FilterField } from "@/components/data-management/data-list-filters"
import type { TableColumn } from "@/components/data-management/data-list-table"
import type { CardField } from "@/components/data-management/data-list-card"
import type { BatchAction } from "@/components/data-management/data-list-batch-actions"
import type { FundsItem } from "./funds-config"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 审核状态颜色映射
export const auditStatusColors: Record<string, string> = {
  待审核: "secondary",
  已通过: "success",
  已退回: "destructive",
}

// 类型颜色映射
export const typeColors: Record<string, string> = {
  入账: "success",
  外拨: "destructive",
  报销: "warning",
  结转: "secondary",
}

// 用户数据
export const users = [
  {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("张三")}&background=random&color=fff&size=128`,
    role: "技术总监",
  },
  {
    id: 2,
    name: "李四",
    email: "lisi@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("李四")}&background=random&color=fff&size=128`,
    role: "产品经理",
  },
  {
    id: 3,
    name: "王五",
    email: "wangwu@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("王五")}&background=random&color=fff&size=128`,
    role: "UI设计师",
  },
  {
    id: 4,
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("赵六")}&background=random&color=fff&size=128`,
    role: "前端开发",
  },
  {
    id: 5,
    name: "孙七",
    email: "sunqi@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("孙七")}&background=random&color=fff&size=128`,
    role: "后端开发",
  },
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "status",
    label: "审核状态",
    value: "all",
    options: [
      { id: "pending", label: "待审核", value: "待审核" },
      { id: "approved", label: "已通过", value: "已通过" },
      { id: "rejected", label: "已退回", value: "已退回" },
    ],
  },
  {
    id: "type",
    label: "类型",
    value: "all",
    options: [
      { id: "income", label: "入账", value: "入账" },
      { id: "outbound", label: "外拨", value: "外拨" },
      { id: "reimbursement", label: "报销", value: "报销" },
      { id: "carryover", label: "结转", value: "结转" },
    ],
  },
]

// 高级筛选字段配置
export const advancedFilters: FilterField[] = [
  {
    id: "applicant",
    type: "select",
    label: "申请人",
    options: users.map((user) => ({
      id: user.id.toString(),
      label: user.name,
      value: user.id.toString(),
      avatar: user.avatar,
    })),
  },
  {
    id: "project",
    type: "select",
    label: "关联项目",
    options: [
      { id: "1", label: "智慧园区综合管理平台", value: "1" },
      { id: "2", label: "AI视觉监控系统", value: "2" },
      { id: "3", label: "智慧能源管理系统", value: "3" },
      { id: "4", label: "智能访客管理系统", value: "4" },
      { id: "5", label: "智慧停车管理平台", value: "5" },
    ],
  },
  {
    id: "dateRange",
    type: "date",
    label: "申请日期",
  },
  {
    id: "category",
    type: "select",
    label: "经费类别",
    options: [
      { id: "equipment", label: "设备费", value: "设备费" },
      { id: "material", label: "材料费", value: "材料费" },
      { id: "travel", label: "差旅费", value: "差旅费" },
      { id: "meeting", label: "会议费", value: "会议费" },
      { id: "labor", label: "劳务费", value: "劳务费" },
      { id: "consulting", label: "咨询费", value: "咨询费" },
      { id: "publication", label: "出版/文献/信息传播/知识产权事务费", value: "出版/文献/信息传播/知识产权事务费" },
      { id: "other", label: "其他费用", value: "其他费用" },
    ],
  },
  {
    id: "amountRange",
    type: "number",
    label: "金额范围",
  },
]

// 排序选项配置
export const sortOptions: SortOption[] = [
  { id: "name_asc", label: "名称 (A-Z)", field: "name", direction: "asc" },
  { id: "name_desc", label: "名称 (Z-A)", field: "name", direction: "desc" },
  { id: "date_desc", label: "申请日期（新-旧）", field: "date", direction: "desc" },
  { id: "date_asc", label: "申请日期（旧-新）", field: "date", direction: "asc" },
  { id: "amount_desc", label: "金额（高-低）", field: "amount", direction: "desc" },
  { id: "amount_asc", label: "金额（低-高）", field: "amount", direction: "asc" },
]

// 表格列配置
export const tableColumns: TableColumn[] = [
  {
    id: "name",
    header: "经费名称",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
      </div>
    ),
  },
  {
    id: "project",
    header: "关联项目",
    cell: (item) => <span>{item.project.name}</span>,
  },
  {
    id: "type",
    header: "类型",
    cell: (item) => <Badge variant={typeColors[item.type]}>{item.type}</Badge>,
  },
  {
    id: "category",
    header: "经费类别",
    cell: (item) => <span>{item.category}</span>,
  },
  {
    id: "amount",
    header: "金额(元)",
    cell: (item) => (
      <span className={`font-medium ${item.type === "入账" ? "text-green-600" : "text-red-600"}`}>
        {item.type === "入账" ? "+" : "-"}¥{item.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    id: "status",
    header: "审核状态",
    cell: (item) => <Badge variant={auditStatusColors[item.status]}>{item.status}</Badge>,
  },
  {
    id: "applicant",
    header: "申请人",
    cell: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.applicant.avatar} />
          <AvatarFallback>{item.applicant.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{item.applicant.name}</span>
      </div>
    ),
  },
  {
    id: "date",
    header: "申请日期",
    cell: (item) => format(new Date(item.date), "yyyy/MM/dd"),
  },
]

// 卡片字段配置
export const cardFields: CardField[] = [
  {
    id: "project",
    label: "关联项目",
    value: (item) => <span className="text-muted-foreground text-xs">{item.project.name}</span>,
  },
  {
    id: "applicant",
    label: "",
    value: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.applicant.avatar} />
          <AvatarFallback>{item.applicant.name[0]}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5 text-sm">
          <span className="font-medium">{item.applicant.name}</span>
          <span className="text-muted-foreground text-xs">申请人</span>
        </div>
      </div>
    ),
  },
  {
    id: "amount",
    label: "金额",
    value: (item) => (
      <span className={`font-medium ${item.type === "入账" ? "text-green-600" : "text-red-600"}`}>
        {item.type === "入账" ? "+" : "-"}¥{item.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    id: "date",
    label: "申请日期",
    value: (item) => <span className="text-muted-foreground text-xs">{format(new Date(item.date), "yyyy/MM/dd")}</span>,
  },
]

// 表格操作配置 - 按经费类型分开
// 经费入账操作配置
export const incomeTableActions = [
  {
    id: "view",
    label: "查看入账",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
  },
  {
    id: "edit_income",
    label: "编辑入账",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/edit/income/${item.id}`, "_self"),
  },
  {
    id: "review",
    label: "审核入账",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
  },
  {
    id: "approve",
    label: "审批通过",
    icon: <Check className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("审批通过", item),
    disabled: (item: FundsItem) => item.status !== "待审核",
    hidden: (item: FundsItem) => item.status !== "待审核",
  },
  {
    id: "reject",
    label: "拒绝",
    icon: <X className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("拒绝", item),
    disabled: (item: FundsItem) => item.status !== "待审核",
    hidden: (item: FundsItem) => item.status !== "待审核",
    variant: "destructive",
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("编辑", item),
    disabled: (item: FundsItem) => item.status === "已通过",
    hidden: (item: FundsItem) => item.status === "已通过",
  },
  {
    id: "delete",
    label: "删除入账",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("删除", item),
    variant: "destructive",
  },
]

// 经费外拨操作配置
export const outboundTableActions = [
  {
    id: "view",
    label: "查看外拨",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
  },
  {
    id: "edit_outbound",
    label: "编辑外拨",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/edit/outbound/${item.id}`, "_self"),
  },
  {
    id: "review",
    label: "审核外拨",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
  },
  {
    id: "delete",
    label: "删除外拨",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("删除", item),
    variant: "destructive",
  },
]

// 经费报销操作配置
export const reimbursementTableActions = [
  {
    id: "view",
    label: "查看报销",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
  },
  {
    id: "edit_reimbursement",
    label: "编辑报销",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/edit/reimbursement/${item.id}`, "_self"),
  },
  {
    id: "review",
    label: "审核报销",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
  },
  {
    id: "delete",
    label: "删除报销",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("删除", item),
    variant: "destructive",
  },
]

// 经费结转操作配置
export const carryoverTableActions = [
  {
    id: "view",
    label: "查看结转",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
  },
  {
    id: "edit_carryover",
    label: "编辑结转",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/edit/carryover/${item.id}`, "_self"),
  },
  {
    id: "review",
    label: "审核结转",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
  },
  {
    id: "delete",
    label: "删除结转",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("删除", item),
    variant: "destructive",
  },
]

// 根据经费类型选择对应的操作配置
export const getTableActionsByType = (type: string) => {
  if (type === "入账") {
    // 自定义操作数组，添加"编辑入账"按钮
    return [
      {
        id: "view",
        label: "查看入账",
        icon: <Eye className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
      },
      {
        id: "edit_income",
        label: "编辑入账",
        icon: <Pencil className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/edit/income/${item.id}`, "_self"),
      },
      {
        id: "review",
        label: "审核入账",
        icon: <MessageSquare className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
      },
      {
        id: "approve",
        label: "审批通过",
        icon: <Check className="h-4 w-4" />,
        onClick: (item: FundsItem) => console.log("审批通过", item),
        disabled: (item: FundsItem) => item.status !== "待审核",
        hidden: (item: FundsItem) => item.status !== "待审核",
      },
      {
        id: "reject",
        label: "拒绝",
        icon: <X className="h-4 w-4" />,
        onClick: (item: FundsItem) => console.log("拒绝", item),
        disabled: (item: FundsItem) => item.status !== "待审核",
        hidden: (item: FundsItem) => item.status !== "待审核",
        variant: "destructive",
      },
      {
        id: "edit",
        label: "编辑",
        icon: <Pencil className="h-4 w-4" />,
        onClick: (item: FundsItem) => console.log("编辑", item),
        disabled: (item: FundsItem) => item.status === "已通过",
        hidden: (item: FundsItem) => item.status === "已通过",
      },
      {
        id: "delete",
        label: "删除入账",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: (item: FundsItem) => console.log("删除", item),
        variant: "destructive",
      },
    ]
  } else if (type === "外拨") {
    // 自定义操作数组，添加"编辑外拨"按钮
    return [
      {
        id: "view",
        label: "查看外拨",
        icon: <Eye className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
      },
      {
        id: "edit_outbound",
        label: "编辑外拨",
        icon: <Pencil className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/edit/outbound/${item.id}`, "_self"),
      },
      {
        id: "review",
        label: "审核外拨",
        icon: <MessageSquare className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
      },
      {
        id: "delete",
        label: "删除外拨",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: (item: FundsItem) => console.log("删除", item),
        variant: "destructive",
      },
    ]
  }
  
  switch (type) {
    case "外拨":
      return outboundTableActions
    case "报销":
      return reimbursementTableActions
    case "结转":
      return carryoverTableActions
    default:
      return incomeTableActions
  }
}

// 卡片操作配置 - 按经费类型分开
// 经费入账卡片操作配置
export const incomeCardActions = [
  {
    id: "view",
    label: "查看入账",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
  },
  {
    id: "edit_income",
    label: "编辑入账",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/edit/income/${item.id}`, "_self"),
  },
  {
    id: "review",
    label: "审核入账",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
  },
  {
    id: "approve",
    label: "审批通过",
    icon: <Check className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("审批通过", item),
    disabled: (item: FundsItem) => item.status !== "待审批",
    hidden: (item: FundsItem) => item.status !== "待审批",
  },
  {
    id: "reject",
    label: "拒绝",
    icon: <X className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("拒绝", item),
    disabled: (item: FundsItem) => item.status !== "待审批",
    hidden: (item: FundsItem) => item.status !== "待审批",
    variant: "destructive",
  },
  {
    id: "delete",
    label: "删除入账",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("删除", item),
    variant: "destructive",
  },
]

// 经费外拨卡片操作配置
export const outboundCardActions = [
  {
    id: "view",
    label: "查看外拨",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
  },
  {
    id: "edit_outbound",
    label: "编辑外拨",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/edit/outbound/${item.id}`, "_self"),
  },
  {
    id: "review",
    label: "审核外拨",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
  },
  {
    id: "delete",
    label: "删除外拨",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("删除", item),
    variant: "destructive",
  },
]

// 经费报销卡片操作配置
export const reimbursementCardActions = [
  {
    id: "view",
    label: "查看报销",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
  },
  {
    id: "edit_reimbursement",
    label: "编辑报销",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/edit/reimbursement/${item.id}`, "_self"),
  },
  {
    id: "review",
    label: "审核报销",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
  },
  {
    id: "delete",
    label: "删除报销",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("删除", item),
    variant: "destructive",
  },
]

// 经费结转卡片操作配置
export const carryoverCardActions = [
  {
    id: "view",
    label: "查看结转",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
  },
  {
    id: "edit_carryover",
    label: "编辑结转",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/edit/carryover/${item.id}`, "_self"),
  },
  {
    id: "review",
    label: "审核结转",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
  },
  {
    id: "delete",
    label: "删除结转",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: FundsItem) => console.log("删除", item),
    variant: "destructive",
  },
]

// 根据经费类型选择对应的卡片操作配置
export const getCardActionsByType = (type: string) => {
  if (type === "入账") {
    // 自定义卡片操作数组，添加"编辑入账"按钮
    return [
      {
        id: "view",
        label: "查看入账",
        icon: <Eye className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
      },
      {
        id: "edit_income",
        label: "编辑入账",
        icon: <Pencil className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/edit/income/${item.id}`, "_self"),
      },
      {
        id: "review",
        label: "审核入账",
        icon: <MessageSquare className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
      },
      {
        id: "approve",
        label: "审批通过",
        icon: <Check className="h-4 w-4" />,
        onClick: (item: FundsItem) => console.log("审批通过", item),
        disabled: (item: FundsItem) => item.status !== "待审批",
        hidden: (item: FundsItem) => item.status !== "待审批",
      },
      {
        id: "reject",
        label: "拒绝",
        icon: <X className="h-4 w-4" />,
        onClick: (item: FundsItem) => console.log("拒绝", item),
        disabled: (item: FundsItem) => item.status !== "待审批",
        hidden: (item: FundsItem) => item.status !== "待审批",
        variant: "destructive",
      },
    ]
  } else if (type === "外拨") {
    // 自定义卡片操作数组，添加"编辑外拨"按钮
    return [
      {
        id: "view",
        label: "查看外拨",
        icon: <Eye className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
      },
      {
        id: "edit_outbound",
        label: "编辑外拨",
        icon: <Pencil className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/edit/outbound/${item.id}`, "_self"),
      },
      {
        id: "review",
        label: "审核外拨",
        icon: <MessageSquare className="h-4 w-4" />,
        onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
      },
      {
        id: "delete",
        label: "删除外拨",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: (item: FundsItem) => console.log("删除", item),
        variant: "destructive",
      },
    ]
  }
  
  switch (type) {
    case "外拨":
      return outboundCardActions
    case "报销":
      // 自定义卡片操作数组，保持与表格操作一致
      return [
        {
          id: "view",
          label: "查看报销",
          icon: <Eye className="h-4 w-4" />,
          onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
        },
        {
          id: "edit_reimbursement",
          label: "编辑报销",
          icon: <Pencil className="h-4 w-4" />,
          onClick: (item: FundsItem) => window.open(`/funds/edit/reimbursement/${item.id}`, "_self"),
        },
        {
          id: "review",
          label: "审核报销",
          icon: <MessageSquare className="h-4 w-4" />,
          onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
        },
        {
          id: "delete",
          label: "删除报销",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: (item: FundsItem) => console.log("删除", item),
          variant: "destructive",
        },
      ]
    case "结转":
      // 自定义卡片操作数组，保持与表格操作一致
      return [
        {
          id: "view",
          label: "查看结转",
          icon: <Eye className="h-4 w-4" />,
          onClick: (item: FundsItem) => window.open(`/funds/${item.id}`, "_self"),
        },
        {
          id: "edit_carryover",
          label: "编辑结转",
          icon: <Pencil className="h-4 w-4" />,
          onClick: (item: FundsItem) => window.open(`/funds/edit/carryover/${item.id}`, "_self"),
        },
        {
          id: "review",
          label: "审核结转",
          icon: <MessageSquare className="h-4 w-4" />,
          onClick: (item: FundsItem) => window.open(`/funds/review/${item.id}`, "_self"),
        },
        {
          id: "delete",
          label: "删除结转",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: (item: FundsItem) => console.log("删除", item),
          variant: "destructive",
        },
      ]
    default:
      return incomeCardActions
  }
}

// 为了向后兼容，保留原有的tableActions和cardActions
export const tableActions = incomeTableActions
export const cardActions = incomeCardActions

// 批量操作配置
export const batchActions: BatchAction[] = [
  {
    id: "batchApprove",
    label: "批量审批",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: () => console.log("批量审批"),
  },
  {
    id: "batchReject",
    label: "批量拒绝",
    icon: <X className="h-4 w-4" />,
    onClick: () => console.log("批量拒绝"),
    variant: "warning",
  },
  {
    id: "batchDelete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: () => console.log("批量删除"),
    variant: "destructive",
  },
]
