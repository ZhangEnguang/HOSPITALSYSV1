import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Eye,
  Pencil,
  Trash2,
  Check,
  X,
  Clock,
  Package,
  FileText,
  AlertTriangle,
  CheckCircle,
  ClipboardCheck,
} from "lucide-react"

// 模拟用户数据
export const users = [
  {
    id: "1",
    name: "张七",
    email: "zhang7@lab.edu.cn",
    avatar: "/avatars/01.png",
    role: "实验室管理员",
  },
  {
    id: "2",
    name: "李三",
    email: "li3@lab.edu.cn",
    avatar: "/avatars/02.png",
    role: "试剂管理员",
  },
  {
    id: "3",
    name: "王五",
    email: "wang5@lab.edu.cn",
    avatar: "/avatars/03.png",
    role: "实验室主任",
  },
  {
    id: "4",
    name: "李四",
    email: "li4@lab.edu.cn",
    avatar: "/avatars/04.png",
    role: "研究员",
  },
  {
    id: "5",
    name: "赵六",
    email: "zhao6@lab.edu.cn",
    avatar: "/avatars/05.png",
    role: "博士研究生",
  },
]

// 自定义扩展Badge组件支持的variant类型
type ExtendedBadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success" | "warning";

// 状态颜色映射
export const statusColors: Record<string, ExtendedBadgeVariant> = {
  "待审核": "secondary",
  "审核通过": "success", 
  "审核退回": "destructive",
  "已取消": "warning",
}

// 快速筛选配置
export const quickFilters = [
  {
    id: "status",
    label: "申领状态",
    value: "",
    options: [
      { id: "1", label: "待审核", value: "待审核" },
      { id: "2", label: "审核通过", value: "审核通过" },
      { id: "3", label: "审核退回", value: "审核退回" },
      { id: "4", label: "已取消", value: "已取消" },
    ],
    category: "default",
  },
  {
    id: "reagentType",
    label: "试剂类型",
    value: "",
    options: [
      { id: "1", label: "有机试剂", value: "有机试剂" },
      { id: "2", label: "无机试剂", value: "无机试剂" },
      { id: "3", label: "生物试剂", value: "生物试剂" },
      { id: "4", label: "标准溶液", value: "标准溶液" },
      { id: "5", label: "缓冲溶液", value: "缓冲溶液" },
      { id: "6", label: "指示剂", value: "指示剂" },
      { id: "7", label: "特殊试剂", value: "特殊试剂" },
    ],
    category: "default",
  },
  {
    id: "department",
    label: "申请部门",
    value: "",
    options: [
      { id: "1", label: "生物实验室", value: "生物实验室" },
      { id: "2", label: "化学实验室", value: "化学实验室" },
      { id: "3", label: "物理实验室", value: "物理实验室" },
      { id: "4", label: "材料实验室", value: "材料实验室" },
      { id: "5", label: "分析实验室", value: "分析实验室" },
      { id: "6", label: "药学实验室", value: "药学实验室" },
    ],
    category: "default",
  },
]

// 高级筛选配置
export const advancedFilters = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "applicationTitle",
        label: "申领标题",
        type: "text",
        placeholder: "请输入申领标题关键词",
      },
      {
        id: "reagentName",
        label: "试剂名称",
        type: "text",
        placeholder: "请输入试剂名称",
      },
      {
        id: "applicant",
        label: "申请人",
        type: "text",
        placeholder: "请输入申请人姓名",
      },
    ],
  },
  {
    id: "quantity",
    title: "申领信息",
    fields: [
      {
        id: "quantityRange",
        label: "申领数量范围",
        type: "number-range",
        placeholder: "请输入数量范围",
      },
      {
        id: "urgency",
        label: "紧急程度",
        type: "select",
        options: [
          { value: "一般", label: "一般" },
          { value: "紧急", label: "紧急" },
          { value: "非常紧急", label: "非常紧急" },
        ],
      },
      {
        id: "specification",
        label: "规格要求",
        type: "text",
        placeholder: "请输入规格要求",
      },
    ],
  },
  {
    id: "time",
    title: "时间信息",
    fields: [
      {
        id: "applicationDateRange",
        label: "申请日期范围",
        type: "date-range",
      },
      {
        id: "expectedDate",
        label: "期望使用日期",
        type: "date",
      },
    ],
  },
  {
    id: "project",
    title: "项目信息",
    fields: [
      {
        id: "project",
        label: "所属项目",
        type: "text",
        placeholder: "请输入项目名称",
      },
      {
        id: "purpose",
        label: "使用目的",
        type: "text",
        placeholder: "请输入使用目的",
      },
    ],
  },
]

// 排序选项
export const sortOptions = [
  {
    id: "applicationDate_desc",
    label: "申请时间 (最近优先)",
    field: "applicationDate",
    direction: "desc" as const,
  },
  {
    id: "applicationDate_asc",
    label: "申请时间 (最早优先)",
    field: "applicationDate",
    direction: "asc" as const,
  },
  {
    id: "expectedDate_desc",
    label: "期望日期 (最近优先)",
    field: "expectedDate",
    direction: "desc" as const,
  },
  {
    id: "expectedDate_asc",
    label: "期望日期 (最早优先)",
    field: "expectedDate",
    direction: "asc" as const,
  },
  {
    id: "reagentName_asc",
    label: "试剂名称 (A-Z)",
    field: "reagentName",
    direction: "asc" as const,
  },
  {
    id: "reagentName_desc",
    label: "试剂名称 (Z-A)",
    field: "reagentName",
    direction: "desc" as const,
  },
  {
    id: "quantity_desc",
    label: "申领数量 (从多到少)",
    field: "quantity",
    direction: "desc" as const,
  },
  {
    id: "quantity_asc",
    label: "申领数量 (从少到多)",
    field: "quantity",
    direction: "asc" as const,
  },
]

// 试剂申领列配置
export const reagentApplicationColumns = [
  {
    id: "applicationTitle",
    header: "申领标题",
    accessorKey: "applicationTitle",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.applicationTitle}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.purpose}</span>
      </div>
    ),
  },
  {
    id: "reagentName",
    header: "申领试剂",
    accessorKey: "reagentName",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.reagentName}</span>
        <span className="text-sm text-muted-foreground">{item.reagentType}</span>
      </div>
    ),
  },
  {
    id: "quantity",
    header: "申领数量",
    accessorKey: "quantity",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.quantity} {item.unit}</span>
        {item.specification && (
          <span className="text-sm text-muted-foreground">{item.specification}</span>
        )}
      </div>
    ),
  },
  {
    id: "applicant",
    header: "申请人",
    accessorKey: "applicant",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.applicant.avatar} />
          <AvatarFallback>{item.applicant.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{item.applicant.name}</span>
          <span className="text-sm text-muted-foreground">{item.department}</span>
        </div>
      </div>
    ),
  },
  {
    id: "urgency",
    header: "紧急程度",
    accessorKey: "urgency",
    cell: (item: any) => {
      const urgencyColors: Record<string, ExtendedBadgeVariant> = {
        "一般": "outline",
        "紧急": "warning",
        "非常紧急": "destructive",
      }
      return <Badge variant={(urgencyColors[item.urgency] || "outline") as any}>{item.urgency}</Badge>
    },
  },
  {
    id: "expectedDate",
    header: "期望日期",
    accessorKey: "expectedDate",
    cell: (item: any) => <span>{format(new Date(item.expectedDate), "yyyy/MM/dd")}</span>,
  },
  {
    id: "applicationDate",
    header: "申请时间",
    accessorKey: "applicationDate",
    cell: (item: any) => <span>{format(new Date(item.applicationDate), "yyyy/MM/dd HH:mm")}</span>,
  },
  {
    id: "status",
    header: "审核状态",
    accessorKey: "status",
    cell: (item: any) => <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>,
  },
]

// 卡片视图字段配置
export const reagentApplicationCardFields = [
  { 
    id: "reagentInfo", 
    label: "申领试剂", 
    value: (item: any) => `${item.reagentName} (${item.reagentType})`
  },
  { 
    id: "quantity", 
    label: "申领数量", 
    value: (item: any) => `${item.quantity} ${item.unit}`
  },
  { 
    id: "status", 
    label: "审核状态", 
    value: (item: any) => (
      <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>
    )
  },
  { 
    id: "urgency", 
    label: "紧急程度", 
    value: (item: any) => {
      const urgencyColors: Record<string, ExtendedBadgeVariant> = {
        "一般": "outline",
        "紧急": "warning",
        "非常紧急": "destructive",
      }
      return <Badge variant={(urgencyColors[item.urgency] || "outline") as any}>{item.urgency}</Badge>
    }
  },
  { 
    id: "applicant", 
    label: "申请人", 
    value: (item: any) => `${item.applicant.name} (${item.department})`
  },
  { 
    id: "expectedDate", 
    label: "期望日期", 
    value: (item: any) => format(new Date(item.expectedDate), "yyyy/MM/dd")
  },
  { 
    id: "applicationDate", 
    label: "申请时间", 
    value: (item: any) => format(new Date(item.applicationDate), "yyyy/MM/dd HH:mm")
  }
]

// 试剂申领操作配置
export const reagentApplicationActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/reagent-application/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑申领",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/reagent-application/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "approve",
    label: "审核申领",
    icon: <ClipboardCheck className="h-4 w-4" />,
  },
  {
    id: "cancel",
    label: "取消申领",
    icon: <X className="h-4 w-4" />,
    variant: "destructive",
  },
  {
    id: "delete",
    label: "删除申领",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 批量操作
export const batchActions = [
  {
    id: "approve",
    label: "批量审核",
    icon: <Check className="h-4 w-4" />,
  },
  {
    id: "reject",
    label: "批量退回",
    icon: <X className="h-4 w-4" />,
  },
  {
    id: "distribute",
    label: "批量发放",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
] 