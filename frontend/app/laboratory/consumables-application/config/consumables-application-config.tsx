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
  ShoppingCart,
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
    phone: "18012345678",
  },
  {
    id: "2",
    name: "李三",
    email: "li3@lab.edu.cn",
    avatar: "/avatars/02.png",
    role: "耗材管理员",
    phone: "18023456789",
  },
  {
    id: "3",
    name: "王五",
    email: "wang5@lab.edu.cn",
    avatar: "/avatars/03.png",
    role: "实验室主任",
    phone: "18034567890",
  },
  {
    id: "4",
    name: "李四",
    email: "li4@lab.edu.cn",
    avatar: "/avatars/04.png",
    role: "研究员",
    phone: "18045678901",
  },
  {
    id: "5",
    name: "赵六",
    email: "zhao6@lab.edu.cn",
    avatar: "/avatars/05.png",
    role: "博士研究生",
    phone: "18056789012",
  },
]

// 自定义扩展Badge组件支持的variant类型
type ExtendedBadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success" | "warning";

// 状态颜色映射 - 更新为CSS类名形式，与系统其他模块保持一致
export const statusColors: Record<string, string> = {
  "待审核": "bg-amber-50 text-amber-700 border-amber-200",
  "审核通过": "bg-green-50 text-green-700 border-green-200", 
  "审核退回": "bg-red-50 text-red-700 border-red-200",
  "已取消": "bg-gray-50 text-gray-700 border-gray-200",
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
    id: "consumableType",
    label: "耗材类型",
    value: "",
    options: [
      { id: "1", label: "塑料耗材", value: "塑料耗材" },
      { id: "2", label: "玻璃器皿", value: "玻璃器皿" },
      { id: "3", label: "金属器皿", value: "金属器皿" },
      { id: "4", label: "过滤耗材", value: "过滤耗材" },
      { id: "5", label: "计量器具", value: "计量器具" },
      { id: "6", label: "防护用品", value: "防护用品" },
      { id: "7", label: "文具用品", value: "文具用品" },
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
        id: "consumableName",
        label: "耗材名称",
        type: "text",
        placeholder: "请输入耗材名称",
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
    id: "consumableName_asc",
    label: "耗材名称 (A-Z)",
    field: "consumableName",
    direction: "asc" as const,
  },
  {
    id: "consumableName_desc",
    label: "耗材名称 (Z-A)",
    field: "consumableName",
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

// 耗材申领列配置
export const consumablesApplicationColumns = [
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
    id: "consumableName",
    header: "申领耗材",
    accessorKey: "consumableName",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.consumableName}</span>
        <span className="text-sm text-muted-foreground">{item.consumableType}</span>
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
    cell: (item: any) => <Badge className={statusColors[item.status] || "bg-slate-50 text-slate-700 border-slate-200"}>{item.status}</Badge>,
  },
]

// 卡片视图字段配置
export const consumablesApplicationCardFields = [
  { 
    id: "consumableInfo", 
    label: "申领耗材", 
    value: (item: any) => `${item.consumableName} (${item.consumableType})`
  },
  { 
    id: "quantityInfo", 
    label: "申领信息", 
    value: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.quantity} {item.unit}</span>
        <span className="text-sm text-muted-foreground">
          期望：{format(new Date(item.expectedDate), "MM/dd")} ({item.urgency})
        </span>
      </div>
    )
  },
  { 
    id: "applicant", 
    label: "申请人", 
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{item.applicant.name}</span>
        <div className="w-px h-3 bg-gray-300"></div>
        <span className="text-sm text-muted-foreground">{item.department}</span>
      </div>
    )
  },
  { 
    id: "applicationDate", 
    label: "申请时间", 
    value: (item: any) => format(new Date(item.applicationDate), "MM/dd HH:mm")
  }
]

// 耗材申领操作配置
export const consumablesApplicationActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/consumables-application/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑申领",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/consumables-application/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "approve",
    label: "审核申领",
    icon: <ClipboardCheck className="h-4 w-4" />,
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