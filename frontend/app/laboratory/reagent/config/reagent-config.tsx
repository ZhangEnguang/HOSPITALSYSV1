import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Eye,
  Pencil,
  Trash2,
  Check,
  AlertTriangle,
  Clock,
  List,
  FileText,
  BarChart,
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
    role: "技术员",
  },
  {
    id: "5",
    name: "赵六",
    email: "zhao6@lab.edu.cn",
    avatar: "/avatars/05.png",
    role: "技术员",
  },
]

// 自定义扩展Badge组件支持的variant类型
type ExtendedBadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success" | "warning";

// 状态颜色映射
export const statusColors: Record<string, ExtendedBadgeVariant> = {
  "正常": "success",
  "低库存": "warning",
  "已用完": "destructive",
  "已过期": "destructive",
  "即将过期": "warning",
  "未入库": "outline",
  "待检验": "secondary",
}

// 通用表格列配置
export const tableColumns = [
  {
    id: "name",
    header: "名称",
    accessorKey: "name",
  },
  {
    id: "department",
    header: "部门",
    accessorKey: "department",
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => {
      const status = row.getValue() as string
      // 确保使用正确的类型，此处需要类型断言为任意字符串
      return <Badge variant={(statusColors[status] || "secondary") as any}>{status}</Badge>
    },
  },
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "category",
    label: "试剂类型",
    value: "",
    options: [
      { id: "1", label: "生物试剂", value: "生物试剂" },
      { id: "2", label: "化学试剂", value: "化学试剂" },
      { id: "3", label: "分析试剂", value: "分析试剂" },
      { id: "4", label: "医用试剂", value: "医用试剂" },
      { id: "5", label: "标准品", value: "标准品" },
      { id: "6", label: "染色剂", value: "染色剂" },
    ],
    category: "default",
  },
  {
    id: "status",
    label: "库存状态",
    value: "",
    options: [
      { id: "1", label: "正常", value: "正常" },
      { id: "2", label: "低库存", value: "低库存" },
      { id: "3", label: "已用完", value: "已用完" },
      { id: "4", label: "已过期", value: "已过期" },
      { id: "5", label: "即将过期", value: "即将过期" },
      { id: "6", label: "未入库", value: "未入库" },
    ],
    category: "default",
  },
  {
    id: "department",
    label: "所属部门",
    value: "",
    options: [
      { id: "1", label: "生物实验室", value: "生物实验室" },
      { id: "2", label: "化学实验室", value: "化学实验室" },
      { id: "3", label: "物理实验室", value: "物理实验室" },
      { id: "4", label: "药学实验室", value: "药学实验室" },
      { id: "5", label: "材料实验室", value: "材料实验室" },
      { id: "6", label: "分析实验室", value: "分析实验室" },
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
        id: "name",
        label: "试剂名称",
        type: "text",
        placeholder: "请输入试剂名称关键词",
      },
      {
        id: "casNumber",
        label: "CAS号",
        type: "text",
        placeholder: "请输入CAS号",
      },
      {
        id: "catalogNumber",
        label: "目录号",
        type: "text",
        placeholder: "请输入目录号",
      },
    ],
  },
  {
    id: "storage",
    title: "存储信息",
    fields: [
      {
        id: "location",
        label: "存放位置",
        type: "select",
        options: [
          { value: "A栋冰箱", label: "A栋冰箱" },
          { value: "B栋试剂柜", label: "B栋试剂柜" },
          { value: "C栋危化品柜", label: "C栋危化品柜" },
          { value: "D栋常温架", label: "D栋常温架" },
        ],
      },
      {
        id: "storageCondition",
        label: "存储条件",
        type: "select",
        options: [
          { value: "常温", label: "常温" },
          { value: "4℃", label: "4℃" },
          { value: "-20℃", label: "-20℃" },
          { value: "-80℃", label: "-80℃" },
        ],
      },
      {
        id: "dangerLevel",
        label: "危险等级",
        type: "select",
        options: [
          { value: "低", label: "低" },
          { value: "中", label: "中" },
          { value: "高", label: "高" },
        ],
      },
    ],
  },
  {
    id: "purchase",
    title: "购置信息",
    fields: [
      {
        id: "purchaseDateRange",
        label: "购置日期范围",
        type: "date-range",
      },
      {
        id: "expiryDateRange",
        label: "有效期范围",
        type: "date-range",
      },
      {
        id: "supplier",
        label: "供应商",
        type: "text",
        placeholder: "请输入供应商名称",
      },
    ],
  },
]

// 排序选项
export const sortOptions = [
  {
    id: "name_asc",
    label: "名称 (A-Z)",
    field: "name",
    direction: "asc" as const,
  },
  {
    id: "name_desc",
    label: "名称 (Z-A)",
    field: "name",
    direction: "desc" as const,
  },
  {
    id: "purchaseDate_asc",
    label: "购置日期 (最早优先)",
    field: "purchaseDate",
    direction: "asc" as const,
  },
  {
    id: "purchaseDate_desc",
    label: "购置日期 (最近优先)",
    field: "purchaseDate",
    direction: "desc" as const,
  },
  {
    id: "expiryDate_asc",
    label: "过期日期 (最早优先)",
    field: "expiryDate",
    direction: "asc" as const,
  },
  {
    id: "expiryDate_desc",
    label: "过期日期 (最晚优先)",
    field: "expiryDate",
    direction: "desc" as const,
  },
]

// 试剂特定列配置
export const reagentColumns = [
  {
    id: "name",
    header: "试剂名称",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.englishName}</span>
      </div>
    ),
  },
  {
    id: "category",
    header: "试剂类型",
    cell: (item: any) => <span>{item.category}</span>,
  },
  {
    id: "status",
    header: "库存状态",
    cell: (item: any) => <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>,
  },
  {
    id: "specification",
    header: "规格",
    cell: (item: any) => <span>{item.specification}</span>,
  },
  {
    id: "department",
    header: "所属部门",
    cell: (item: any) => <span>{item.department}</span>,
  },
  {
    id: "location",
    header: "存放位置",
    cell: (item: any) => <span>{item.location}</span>,
  },
  {
    id: "purchaseDate",
    header: "购置日期",
    cell: (item: any) => <span>{format(new Date(item.purchaseDate), "yyyy/MM/dd")}</span>,
  },
  {
    id: "expiryDate",
    header: "有效期至",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        {new Date(item.expiryDate) < new Date() ? (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            已过期
          </Badge>
        ) : (
          <span>{format(new Date(item.expiryDate), "yyyy/MM/dd")}</span>
        )}
      </div>
    ),
  },
  {
    id: "manager",
    header: "负责人",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.manager.avatar} />
          <AvatarFallback>{item.manager.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{item.manager.name}</span>
      </div>
    ),
  },
]

// 卡片视图字段配置
export const cardFields = [
  { 
    id: "name", 
    label: "名称",
    value: (item: any) => item.name 
  },
  { 
    id: "department", 
    label: "部门",
    value: (item: any) => item.department
  },
  { 
    id: "status", 
    label: "状态", 
    type: "badge",
    value: (item: any) => item.status
  },
  { 
    id: "dueDate", 
    label: "截止日期", 
    type: "date",
    value: (item: any) => item.dueDate ? format(new Date(item.dueDate), "yyyy/MM/dd") : "-"
  },
]

// 试剂卡片字段配置
export const reagentCardFields = [
  { 
    id: "englishName", 
    label: "英文名称", 
    value: (item: any) => item.englishName
  },
  { 
    id: "category", 
    label: "试剂类型", 
    value: (item: any) => item.category
  },
  { 
    id: "status", 
    label: "库存状态", 
    value: (item: any) => (
      <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>
    )
  },
  { 
    id: "department", 
    label: "所属部门", 
    value: (item: any) => item.department
  },
  { 
    id: "expiryDate", 
    label: "有效期至", 
    value: (item: any) => format(new Date(item.expiryDate), "yyyy/MM/dd")
  },
  { 
    id: "currentAmount", 
    label: "当前库存", 
    value: (item: any) => `${item.currentAmount}${item.unit}`
  }
]

// 试剂特定操作配置
export const reagentActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      // 使用路由跳转到试剂详情页
      const url = `/laboratory/reagent/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑试剂",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/reagent/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "apply",
    label: "申领试剂",
    icon: <FileText className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/reagent/apply/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "usage",
    label: "使用记录",
    icon: <List className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/reagent/usage/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "purchase",
    label: "入库记录",
    icon: <FileText className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/reagent/purchase/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "report",
    label: "消耗统计",
    icon: <BarChart className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/reagent/report/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "delete",
    label: "删除试剂",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 通用操作
export const tableActions = [
  {
    id: "view",
    label: "查看",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 批量操作
export const batchActions = [
  {
    id: "outOfStock",
    label: "标记用完",
    icon: <Check className="h-4 w-4" />,
  },
  {
    id: "expired",
    label: "标记过期",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
] 