import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Eye, FileEdit, Trash2, Clock, CheckCircle, XCircle, AlertTriangle, ClipboardCheck, MoreVertical } from "lucide-react"
import { RESEARCH_TYPE_OPTIONS, REVIEW_RESULTS, APPROVAL_STATUSES, REVIEW_STATUSES } from "../data/human-genetics-review-demo-data"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// 定义用户数据
export const users = [
  {
    id: "u1",
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "/avatars/01.png",
    department: "遗传学研究所",
    title: "教授",
  },
  {
    id: "u2",
    name: "李四",
    email: "lisi@example.com",
    avatar: "/avatars/02.png",
    department: "基因组学中心",
    title: "副教授",
  },
  {
    id: "u3",
    name: "王五",
    email: "wangwu@example.com",
    avatar: "/avatars/03.png",
    department: "临床遗传科",
    title: "主任医师",
  },
  {
    id: "u4",
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: "/avatars/04.png",
    department: "生物信息学院",
    title: "研究员",
  },
  {
    id: "u5",
    name: "钱七",
    email: "qianqi@example.com",
    avatar: "/avatars/05.png",
    department: "遗传咨询科",
    title: "遗传咨询师",
  },
]

// 定义状态变体和颜色类型
interface StatusVariant {
  color: string;
}

interface PriorityVariant {
  color: string;
  icon: React.ReactNode;
}

// 定义状态变体和颜色
export const statusVariants: Record<string, StatusVariant> = {
  "已提交": { color: "bg-blue-100 text-blue-700 border-blue-300" },
  "形审通过": { color: "bg-green-100 text-green-700 border-green-300" },
  "形审退回": { color: "bg-red-100 text-red-700 border-red-300" },
}

// 为 DataList 组件提供的状态变体
export const dataListStatusVariants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
  "已提交": "secondary",
  "形审通过": "default",
  "形审退回": "destructive",
}

// 优先级变体和颜色
export const priorityVariants: Record<string, PriorityVariant> = {
  "高": { color: "text-red-600", icon: <AlertTriangle className="h-4 w-4" /> },
  "中": { color: "text-amber-600", icon: <Clock className="h-4 w-4" /> },
  "低": { color: "text-blue-600", icon: <CheckCircle className="h-4 w-4" /> },
}

// 状态名称映射函数
export const getStatusName = (status: string) => {
  switch (status) {
    case "approved":
      return "已通过"
    case "pending":
      return "待审核"
    case "inProgress":
      return "审查中"
    case "rejected":
      return "已拒绝"
    case "needsModification":
      return "需修改"
    default:
      return status
  }
}

// 表格列配置
export const tableColumns = [
  {
    id: "projectId",
    header: "受理号",
    accessorKey: "projectId",
    cell: (item: any) => (
      <div className="font-medium">
        {item.status === "形审通过" ? 
          (item.projectId || "-") : 
          <span className="text-gray-400 text-sm">受理后自动生成</span>
        }
      </div>
    ),
  },
  {
    id: "approvalType",
    header: "审查类型",
    accessorKey: "approvalType",
    cell: (item: any) => (
      <div className="max-w-[150px] truncate" title={item.approvalType || "-"}>
        {item.approvalType || "-"}
      </div>
    ),
  },
  {
    id: "reviewType",
    header: "研究类型",
    accessorKey: "reviewType",
    cell: (item: any) => <div>{item.reviewType || "-"}</div>,
  },
  {
    id: "name",
    header: "项目名称",
    accessorKey: "name",
    cell: (item: any) => <div className="font-medium">{item.name}</div>,
  },
  {
    id: "projectLeader",
    header: "项目负责人",
    accessorKey: "projectLeader",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.projectLeader?.avatar} alt={item.projectLeader?.name} />
          <AvatarFallback>{item.projectLeader?.name?.charAt(0) || "-"}</AvatarFallback>
        </Avatar>
        <div>{item.projectLeader?.name || "-"}</div>
      </div>
    ),
  },
  {
    id: "department",
    header: "所属院系",
    accessorKey: "department",
    cell: (item: any) => <div>{item.department || "-"}</div>,
  },
  {
    id: "ethicsCommittee",
    header: "伦理委员会",
    accessorKey: "ethicsCommittee",
    cell: (item: any) => <div>{item.ethicsCommittee || "-"}</div>,
  },
  {
    id: "status",
    header: "审核状态",
    accessorKey: "status",
    cell: (item: any) => {
      const status = item.status
      const variant = statusVariants[status] || { color: "bg-gray-100 text-gray-700 border-gray-300" }
      return (
        <Badge variant="outline" className={cn("px-2 py-0.5 border", variant.color)}>
          {status || "-"}
        </Badge>
      )
    },
  },
]

// 卡片字段配置
export const cardFields = [
  {
    id: "projectLeader",
    label: "项目负责人",
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={item.projectLeader?.avatar} alt={item.projectLeader?.name} />
          <AvatarFallback>{item.projectLeader?.name?.charAt(0) || "-"}</AvatarFallback>
        </Avatar>
        <div>{item.projectLeader?.name || "-"}</div>
      </div>
    ),
  },
  {
    id: "reviewType",
    label: "研究类型",
    value: (item: any) => item.reviewType || "-",
  },
  {
    id: "department",
    label: "所属院系",
    value: (item: any) => item.department || "-",
  },
  {
    id: "ethicsCommittee",
    label: "伦理委员会",
    value: (item: any) => item.ethicsCommittee || "-",
  },
]

// 卡片操作按钮
export const cardActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      window.location.href = `/ethic-review/human-genetics-review/${item.id}`
    },
  },
  {
    id: "edit",
    label: "编辑项目",
    icon: <FileEdit className="h-4 w-4" />,
    onClick: (item: any) => {
      window.location.href = `/ethic-review/human-genetics-review/edit?id=${item.id}`
    },
  },
  {
    id: "review",
    label: "审核项目",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item: any) => {
      window.location.href = `/ethic-review/human-genetics-review/${item.id}/review`
    },
  },
  {
    id: "delete",
    label: "删除项目",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: any) => {
      console.log("删除", item)
    },
  },
]

// 排序选项
export const sortOptions = [
  {
    id: "createdAtDesc",
    label: "创建时间（近 - 远）",
    field: "createdAt",
    direction: "desc",
  },
  {
    id: "createdAtAsc",
    label: "创建时间（远 - 近）",
    field: "createdAt",
    direction: "asc",
  },
  {
    id: "dueDateDesc",
    label: "截止日期（近 - 远）",
    field: "dueDate",
    direction: "desc",
  },
  {
    id: "dueDateAsc",
    label: "截止日期（远 - 近）",
    field: "dueDate",
    direction: "asc",
  },
  {
    id: "nameAsc",
    label: "项目名称 A-Z",
    field: "name",
    direction: "asc",
  },
  {
    id: "nameDesc",
    label: "项目名称 Z-A",
    field: "name",
    direction: "desc",
  },
]

// 快速筛选
export const quickFilters = [
  {
    id: "approvalType",
    label: "审查类型",
    value: "全部类型",
    options: [
      { id: "all", label: "全部类型", value: "全部类型" },
      { id: "collection", label: "人遗采集审批", value: "人遗采集审批" },
      { id: "preservation", label: "人遗保藏审批", value: "人遗保藏审批" },
      { id: "international", label: "国际合作科研审批", value: "国际合作科研审批" },
      { id: "export", label: "材料出境审批", value: "材料出境审批" },
      { id: "clinicalTrial", label: "国际合作临床试验", value: "国际合作临床试验" },
      { id: "providing", label: "对外提供使用备案", value: "对外提供使用备案" },
      { id: "family", label: "重要家系资源备案", value: "重要家系资源备案" },
    ],
  },
  {
    id: "reviewType",
    label: "研究类型",
    value: "全部类型",
    options: [
      { id: "all", label: "全部类型", value: "全部类型" },
      { id: "genetic", label: "遗传学研究", value: "遗传学研究" },
      { id: "genomic", label: "基因组学研究", value: "基因组学研究" },
      { id: "diagnostic", label: "诊断性测序", value: "诊断性测序" },
      { id: "screening", label: "遗传病筛查", value: "遗传病筛查" },
      { id: "counseling", label: "遗传咨询研究", value: "遗传咨询研究" },
    ],
  },
  {
    id: "status",
    label: "状态",
    value: "全部状态",
    options: [
      { id: "all", label: "全部状态", value: "全部状态" },
      { id: "submitted", label: "已提交", value: "已提交" },
      { id: "formalPassed", label: "形审通过", value: "形审通过" },
      { id: "formalRejected", label: "形审退回", value: "形审退回" },
    ],
  },
  {
    id: "ethicsCommittee",
    label: "伦理委员会",
    value: "全部委员会",
    options: [
      { id: "all", label: "全部委员会", value: "全部委员会" },
      { id: "human", label: "人类遗传学伦理委员会", value: "人类遗传学伦理委员会" },
      { id: "medical", label: "医学伦理委员会", value: "医学伦理委员会" },
    ],
  },
]

// 高级筛选类别和字段
export const filterCategories = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "projectId",
        label: "受理号",
        type: "text" as const,
        placeholder: "请输入受理号",
      },
      {
        id: "name",
        label: "项目名称",
        type: "text" as const,
        placeholder: "请输入项目名称",
      },
      {
        id: "approvalType",
        label: "审查类型",
        type: "select" as const,
        options: [
          { value: "人遗采集审批", label: "人遗采集审批" },
          { value: "人遗保藏审批", label: "人遗保藏审批" },
          { value: "国际合作科研审批", label: "国际合作科研审批" },
          { value: "材料出境审批", label: "材料出境审批" },
          { value: "国际合作临床试验", label: "国际合作临床试验" },
          { value: "对外提供使用备案", label: "对外提供使用备案" },
          { value: "重要家系资源备案", label: "重要家系资源备案" },
        ],
        placeholder: "请选择审查类型",
      },
      {
        id: "reviewType",
        label: "研究类型",
        type: "select" as const,
        options: RESEARCH_TYPE_OPTIONS.map(option => ({ value: option.label, label: option.label })),
        placeholder: "请选择研究类型",
      },
      {
        id: "sampleSize",
        label: "样本数量",
        type: "number" as const,
        placeholder: "请输入样本数量",
      },
    ],
  },
  {
    id: "organization",
    title: "组织信息",
    fields: [
      {
        id: "department",
        label: "所属院系",
        type: "text" as const,
        placeholder: "请输入所属院系",
      },
      {
        id: "ethicsCommittee",
        label: "伦理委员会",
        type: "select" as const,
        options: [
          { value: "人类遗传学伦理委员会", label: "人类遗传学伦理委员会" },
          { value: "医学伦理委员会", label: "医学伦理委员会" },
        ],
        placeholder: "请选择伦理委员会",
      },
      {
        id: "projectLeader",
        label: "项目负责人",
        type: "text" as const,
        placeholder: "请输入项目负责人姓名",
      },
    ],
  },
  {
    id: "status",
    title: "状态信息",
    fields: [
      {
        id: "status",
        label: "审核状态",
        type: "select" as const,
        options: [
          { value: "", label: "全部状态" },
          { value: "已提交", label: "已提交" },
          { value: "形审通过", label: "形审通过" },
          { value: "形审退回", label: "形审退回" },
        ],
        placeholder: "请选择审核状态",
      },
      {
        id: "reviewResult",
        label: "审查结果",
        type: "select" as const,
        options: REVIEW_RESULTS.map(result => ({ value: result, label: result })),
        placeholder: "请选择审查结果",
      },
    ],
  },
  {
    id: "genetic",
    title: "遗传学信息",
    fields: [
      {
        id: "geneticMaterial",
        label: "遗传材料",
        type: "text" as const,
        placeholder: "请输入遗传材料类型",
      },
      {
        id: "geneticTest",
        label: "测序方法",
        type: "text" as const,
        placeholder: "请输入测序方法",
      },
      {
        id: "dataProtection",
        label: "数据保护措施",
        type: "text" as const,
        placeholder: "请输入数据保护措施",
      },
    ],
  },
] 