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
  Package,
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
    role: "耗材管理员",
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
  "充足": "success",
  "库存不足": "warning", 
  "缺货": "destructive",
  "已停用": "outline",
  "待采购": "secondary",
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
      return <Badge variant={(statusColors[status] || "secondary") as any}>{status}</Badge>
    },
  },
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "category",
    label: "耗材类型",
    value: "",
    options: [
      { id: "1", label: "玻璃器皿", value: "玻璃器皿" },
      { id: "2", label: "塑料器皿", value: "塑料器皿" },
      { id: "3", label: "移液器材", value: "移液器材" },
      { id: "4", label: "防护用品", value: "防护用品" },
      { id: "5", label: "培养耗材", value: "培养耗材" },
      { id: "6", label: "分析耗材", value: "分析耗材" },
      { id: "7", label: "通用耗材", value: "通用耗材" },
    ],
    category: "default",
  },
  {
    id: "status",
    label: "库存状态",
    value: "",
    options: [
      { id: "1", label: "充足", value: "充足" },
      { id: "2", label: "库存不足", value: "库存不足" },
      { id: "3", label: "缺货", value: "缺货" },
      { id: "4", label: "已停用", value: "已停用" },
      { id: "5", label: "待采购", value: "待采购" },
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
        label: "耗材名称",
        type: "text",
        placeholder: "请输入耗材名称关键词",
      },
      {
        id: "model",
        label: "型号规格",
        type: "text",
        placeholder: "请输入型号规格",
      },
      {
        id: "manufacturer",
        label: "生产厂家",
        type: "text",
        placeholder: "请输入生产厂家",
      },
    ],
  },
  {
    id: "inventory",
    title: "库存信息",
    fields: [
      {
        id: "location",
        label: "存放位置",
        type: "select",
        options: [
          { value: "A栋储物柜", label: "A栋储物柜" },
          { value: "B栋试剂柜", label: "B栋试剂柜" },
          { value: "C栋专用柜", label: "C栋专用柜" },
          { value: "D栋临时存放", label: "D栋临时存放" },
        ],
      },
      {
        id: "stockRange",
        label: "库存范围",
        type: "number-range",
        placeholder: "请输入库存数量范围",
      },
      {
        id: "priceRange",
        label: "单价范围",
        type: "number-range",
        placeholder: "请输入单价范围",
      },
    ],
  },
  {
    id: "purchase",
    title: "采购信息",
    fields: [
      {
        id: "purchaseDateRange",
        label: "采购日期范围",
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
    label: "采购日期 (最早优先)",
    field: "purchaseDate",
    direction: "asc" as const,
  },
  {
    id: "purchaseDate_desc",
    label: "采购日期 (最近优先)",
    field: "purchaseDate",
    direction: "desc" as const,
  },
  {
    id: "currentStock_asc",
    label: "库存 (从少到多)",
    field: "currentStock",
    direction: "asc" as const,
  },
  {
    id: "currentStock_desc",
    label: "库存 (从多到少)",
    field: "currentStock",
    direction: "desc" as const,
  },
  {
    id: "unitPrice_asc",
    label: "单价 (从低到高)",
    field: "unitPrice",
    direction: "asc" as const,
  },
  {
    id: "unitPrice_desc",
    label: "单价 (从高到低)",
    field: "unitPrice",
    direction: "desc" as const,
  },
]

// 耗材特定列配置
export const consumableColumns = [
  {
    id: "name",
    header: "耗材名称",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.model}</span>
      </div>
    ),
  },
  {
    id: "category",
    header: "耗材类型",
    cell: (item: any) => <span>{item.category}</span>,
  },
  {
    id: "status",
    header: "库存状态",
    cell: (item: any) => <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>,
  },
  {
    id: "currentStock",
    header: "当前库存",
    cell: (item: any) => (
      <div className="flex items-center gap-1">
        <span className={item.currentStock <= item.minStock ? "text-red-600 font-medium" : ""}>
          {item.currentStock}
        </span>
        <span className="text-muted-foreground">{item.unit}</span>
      </div>
    ),
  },
  {
    id: "unitPrice",
    header: "单价",
    cell: (item: any) => <span>¥{item.unitPrice}</span>,
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
    header: "采购日期",
    cell: (item: any) => <span>{format(new Date(item.purchaseDate), "yyyy/MM/dd")}</span>,
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
]

// 耗材卡片字段配置
export const consumableCardFields = [
  { 
    id: "model", 
    label: "型号规格", 
    value: (item: any) => item.model
  },
  { 
    id: "category", 
    label: "耗材类型", 
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
    id: "currentStock", 
    label: "当前库存", 
    value: (item: any) => (
      <span className={item.currentStock <= item.minStock ? "text-red-600 font-medium" : ""}>
        {item.currentStock} {item.unit}
      </span>
    )
  },
  { 
    id: "unitPrice", 
    label: "单价", 
    value: (item: any) => `¥${item.unitPrice}`
  },
  { 
    id: "department", 
    label: "所属部门", 
    value: (item: any) => item.department
  }
]

// 耗材特定操作配置
export const consumableActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/consumables/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑耗材",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/consumables/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "apply",
    label: "申领耗材",
    icon: <Package className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/consumables/apply/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "usage",
    label: "使用记录",
    icon: <List className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/consumables/usage/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "purchase",
    label: "采购记录",
    icon: <FileText className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/consumables/purchase/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "report",
    label: "消耗统计",
    icon: <BarChart className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/consumables/report/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "delete",
    label: "删除耗材",
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
    label: "标记缺货",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    id: "lowStock",
    label: "标记库存不足",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
] 