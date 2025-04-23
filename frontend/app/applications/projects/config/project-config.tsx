import { Eye, Pencil, Trash2, Check, X, Download, ClipboardCheck } from "lucide-react"
import type { FilterField } from "@/components/data-management/data-list-filters"
import type { TableColumn } from "@/components/data-management/data-list-table"
import type { CardField } from "@/components/data-management/data-list-card"
import type { SortOption } from "@/components/data-management/data-list-toolbar"
import type { BatchAction } from "@/components/data-management/data-list-batch-actions"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 状态颜色映射
export const statusColors: Record<string, string> = {
  准备中: "secondary",
  已提交: "warning",
  已通过: "success",
  已拒绝: "destructive",
  修改中: "primary",
  已撤回: "destructive",
  已过期: "destructive",
}

// 类型颜色映射
export const typeColors: Record<string, string> = {
  国家级: "primary",
  省部级: "warning",
  市厅级: "success",
  校级: "secondary",
  企业合作: "destructive",
}

// 优先级颜色映射
export const priorityColors: Record<string, string> = {
  高: "destructive",
  中: "warning",
  低: "success",
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
    label: "状态",
    value: "all",
    options: [
      { id: "preparing", label: "准备中", value: "准备中" },
      { id: "submitted", label: "已提交", value: "已提交" },
      { id: "approved", label: "已通过", value: "已通过" },
      { id: "rejected", label: "已拒绝", value: "已拒绝" },
      { id: "modifying", label: "修改中", value: "修改中" },
      { id: "withdrawn", label: "已撤回", value: "已撤回" },
      { id: "expired", label: "已过期", value: "已过期" },
    ],
  },
  {
    id: "type",
    label: "类型",
    value: "all",
    options: [
      { id: "national", label: "国家级", value: "国家级" },
      { id: "provincial", label: "省部级", value: "省部级" },
      { id: "municipal", label: "市厅级", value: "市厅级" },
      { id: "school", label: "校级", value: "校级" },
      { id: "enterprise", label: "企业合作", value: "企业合作" },
    ],
  },
]

// 高级筛选字段配置
export const advancedFilters: FilterField[] = [
  {
    id: "applicant",
    type: "select",
    label: "申报人",
    options: users.map((user) => ({
      id: user.id.toString(),
      label: user.name,
      value: user.id.toString(),
      avatar: user.avatar,
    })),
  },
  {
    id: "priority",
    type: "select",
    label: "优先级",
    options: [
      { id: "high", label: "高", value: "高" },
      { id: "medium", label: "中", value: "中" },
      { id: "low", label: "低", value: "低" },
    ],
  },
  {
    id: "dateRange",
    type: "date",
    label: "申报日期",
  },
  {
    id: "deadlineRange",
    type: "date",
    label: "截止日期",
  },
  {
    id: "category",
    type: "select",
    label: "申报类别",
    options: [
      { id: "science", label: "自然科学", value: "自然科学" },
      { id: "engineering", label: "工程技术", value: "工程技术" },
      { id: "agriculture", label: "农业科学", value: "农业科学" },
      { id: "medical", label: "医药科学", value: "医药科学" },
      { id: "humanities", label: "人文社科", value: "人文社科" },
      { id: "education", label: "教育科学", value: "教育科学" },
      { id: "other", label: "其他", value: "其他" },
    ],
  },
  {
    id: "amountRange",
    type: "number",
    label: "申报金额(万元)",
  },
  {
    id: "batchNumber",
    type: "text",
    label: "批次编号",
  },
]

// 排序选项配置
export const sortOptions: SortOption[] = [
  { id: "name_asc", label: "名称 (A-Z)", field: "name", direction: "asc" },
  { id: "name_desc", label: "名称 (Z-A)", field: "name", direction: "desc" },
  { id: "date_desc", label: "申报日期（新-旧）", field: "date", direction: "desc" },
  { id: "date_asc", label: "申报日期（旧-新）", field: "date", direction: "asc" },
  { id: "deadline_asc", label: "截止日期（近-远）", field: "deadline", direction: "asc" },
  { id: "deadline_desc", label: "截止日期（远-近）", field: "deadline", direction: "desc" },
  { id: "amount_desc", label: "申报金额（高-低）", field: "amount", direction: "desc" },
  { id: "amount_asc", label: "申报金额（低-高）", field: "amount", direction: "asc" },
  { id: "priority_desc", label: "优先级（高-低）", field: "priority", direction: "desc" },
]

// 表格列配置
export const tableColumns: TableColumn[] = [
  {
    id: "name",
    header: "项目名称",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
      </div>
    ),
  },
  {
    id: "type",
    header: "项目类型",
    cell: (item) => <Badge variant={typeColors[item.type]}>{item.type}</Badge>,
  },
  {
    id: "category",
    header: "项目类别",
    cell: (item) => <span>{item.category}</span>,
  },
  {
    id: "status",
    header: "状态",
    cell: (item) => <Badge variant={statusColors[item.status]}>{item.status}</Badge>,
  },
  {
    id: "applicant",
    header: "申报人",
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
    id: "amount",
    header: "申报金额(万元)",
    cell: (item) => (
      <span className="font-medium">{item.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</span>
    ),
  },
  {
    id: "progress",
    header: "申报进度",
    cell: (item) => (
      <div className="w-[160px] space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">进度</span>
          <span>{item.progress}%</span>
        </div>
        <Progress value={item.progress} className="h-2 [&>div]:progress-gradient" />
      </div>
    ),
  },
  {
    id: "date",
    header: "申报日期",
    cell: (item) => format(new Date(item.date), "yyyy/MM/dd"),
  },
  {
    id: "deadline",
    header: "截止日期",
    cell: (item) => {
      const deadline = new Date(item.deadline)
      const now = new Date()
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      return (
        <div className="flex flex-col">
          <span>{format(deadline, "yyyy/MM/dd")}</span>
          {daysLeft > 0 ? (
            <span className={`text-xs ${daysLeft <= 7 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
              剩余 {daysLeft} 天
            </span>
          ) : null}
        </div>
      )
    },
  },
]

// 卡片字段配置
export const cardFields: CardField[] = [
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
          <span className="text-muted-foreground text-xs">申报人</span>
        </div>
      </div>
    ),
  },
  {
    id: "amount",
    label: "申报金额",
    value: (item) => (
      <span className="font-medium">{item.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}万元</span>
    ),
  },
  {
    id: "dates",
    label: "截止日期",
    value: (item) => {
      const deadline = new Date(item.deadline)
      const now = new Date()
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      return (
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">{format(deadline, "yyyy/MM/dd")}</span>
          {daysLeft > 0 ? (
            <span className={`text-xs ${daysLeft <= 7 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
              剩余 {daysLeft} 天
            </span>
          ) : null}
        </div>
      )
    },
  },
  {
    id: "category",
    label: "申报类别",
    value: (item) => <span className="text-muted-foreground text-xs">{item.category}</span>,
  },
  {
    id: "batchInfo",
    label: "批次信息",
    value: (item) => (
      <div className="flex flex-col">
        <span className="text-xs font-medium">{item.batchNumber}</span>
        <span className="text-muted-foreground text-xs">{item.batchName}</span>
      </div>
    ),
  },
]

// 表格操作配置
export const tableActions = [
  {
    id: "review",
    label: "审核",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => console.log("审核", item),
    disabled: (item) => item.status !== "已提交",
    hidden: (item) => item.status !== "已提交",
    primary: true,
  },
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => console.log("查看详情", item),
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => console.log("编辑", item),
    disabled: (item) => item.status === "已通过" || item.status === "已拒绝" || item.status === "已过期",
    hidden: (item) => item.status === "已通过" || item.status === "已拒绝" || item.status === "已过期",
  },
  {
    id: "download",
    label: "下载申报书",
    icon: <Download className="h-4 w-4" />,
    onClick: (item) => console.log("下载申报书", item),
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 卡片操作配置
export const cardActions = [
  {
    id: "review",
    label: "审核",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item) => console.log("审核", item),
    disabled: (item) => item.status !== "已提交",
    hidden: (item) => item.status !== "已提交",
    primary: true,
  },
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => console.log("查看详情", item),
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => console.log("编辑", item),
    disabled: (item) => item.status === "已通过" || item.status === "已拒绝" || item.status === "已过期",
    hidden: (item) => item.status === "已通过" || item.status === "已拒绝" || item.status === "已过期",
  },
  {
    id: "download",
    label: "下载",
    icon: <Download className="h-4 w-4" />,
    onClick: (item) => console.log("下载申报书", item),
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 批量操作配置
export const batchActions: BatchAction[] = [
  {
    id: "batchReview",
    label: "批量审核",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: () => console.log("批量审核"),
  },
  {
    id: "batchApprove",
    label: "批量通过",
    icon: <Check className="h-4 w-4" />,
    onClick: () => console.log("批量通过"),
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

