import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Eye,
  Pencil,
  Trash2,
  Check,
  Wrench,
  BarChart,
  AlertTriangle,
  Clock,
  Info,
  CheckCircle,
  List,
  MessageSquare,
  FileText,
  Calendar,
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
    role: "设备管理员",
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
  "在用": "success",
  "维修中": "warning",
  "闲置": "secondary",
  "报废": "destructive",
  "待验收": "outline",
  "外借": "default",
  
  "正常": "success",
  "异常": "destructive",
  "待维护": "warning",
  "已预约": "secondary",
  "未使用": "outline",
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
    label: "仪器类型",
    value: "",
    options: [
      { id: "1", label: "分析仪器", value: "分析仪器" },
      { id: "2", label: "光学仪器", value: "光学仪器" },
      { id: "3", label: "电子仪器", value: "电子仪器" },
      { id: "4", label: "医学仪器", value: "医学仪器" },
      { id: "5", label: "物理仪器", value: "物理仪器" },
      { id: "6", label: "测量仪器", value: "测量仪器" },
      { id: "7", label: "计算设备", value: "计算设备" },
    ],
    category: "default",
  },
  {
    id: "status",
    label: "使用状态",
    value: "",
    options: [
      { id: "1", label: "在用", value: "在用" },
      { id: "2", label: "维修中", value: "维修中" },
      { id: "3", label: "闲置", value: "闲置" },
      { id: "4", label: "报废", value: "报废" },
      { id: "5", label: "待验收", value: "待验收" },
      { id: "6", label: "外借", value: "外借" },
    ],
    category: "default",
  },
  {
    id: "department",
    label: "所属部门",
    value: "",
    options: [
      { id: "1", label: "物理实验室", value: "物理实验室" },
      { id: "2", label: "化学实验室", value: "化学实验室" },
      { id: "3", label: "生物实验室", value: "生物实验室" },
      { id: "4", label: "计算机实验室", value: "计算机实验室" },
      { id: "5", label: "电子实验室", value: "电子实验室" },
      { id: "6", label: "材料实验室", value: "材料实验室" },
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
        label: "仪器名称",
        type: "text",
        placeholder: "请输入仪器名称关键词",
      },
      {
        id: "model",
        label: "型号",
        type: "text",
        placeholder: "请输入型号关键词",
      },
      {
        id: "serialNumber",
        label: "序列号",
        type: "text",
        placeholder: "请输入序列号",
      },
    ],
  },
  {
    id: "usage",
    title: "使用信息",
    fields: [
      {
        id: "location",
        label: "存放位置",
        type: "select",
        options: [
          { value: "A栋实验楼", label: "A栋实验楼" },
          { value: "B栋实验楼", label: "B栋实验楼" },
          { value: "C栋实验楼", label: "C栋实验楼" },
          { value: "D栋实验楼", label: "D栋实验楼" },
        ],
      },
      {
        id: "maintenanceStatus",
        label: "维护状态",
        type: "select",
        options: [
          { value: "正常", label: "正常" },
          { value: "待维护", label: "待维护" },
          { value: "异常", label: "异常" },
        ],
      },
      {
        id: "useFrequency",
        label: "使用频率",
        type: "select",
        options: [
          { value: "高", label: "高" },
          { value: "中", label: "中" },
          { value: "低", label: "低" },
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
        id: "priceRange",
        label: "价格范围",
        type: "number-range",
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
    direction: "asc",
  },
  {
    id: "name_desc",
    label: "名称 (Z-A)",
    field: "name",
    direction: "desc",
  },
  {
    id: "purchaseDate_asc",
    label: "购置日期 (最早优先)",
    field: "purchaseDate",
    direction: "asc",
  },
  {
    id: "purchaseDate_desc",
    label: "购置日期 (最近优先)",
    field: "purchaseDate",
    direction: "desc",
  },
  {
    id: "price_asc",
    label: "价格 (从低到高)",
    field: "price",
    direction: "asc",
  },
  {
    id: "price_desc",
    label: "价格 (从高到低)",
    field: "price",
    direction: "desc",
  },
]

// 仪器特定列配置
export const equipmentColumns = [
  {
    id: "name",
    header: "仪器名称",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.model}</span>
      </div>
    ),
  },
  {
    id: "category",
    header: "仪器类型",
    cell: (item: any) => <span>{item.category}</span>,
  },
  {
    id: "status",
    header: "使用状态",
    cell: (item: any) => <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>,
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
    id: "warrantyExpiry",
    header: "保修到期",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        {new Date(item.warrantyExpiry) < new Date() ? (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            已过期
          </Badge>
        ) : (
          <span>{format(new Date(item.warrantyExpiry), "yyyy/MM/dd")}</span>
        )}
      </div>
    ),
  },
  {
    id: "maintenanceStatus",
    header: "维护状态",
    cell: (item: any) => {
      const statusMap: Record<string, ExtendedBadgeVariant> = {
        正常: "success",
        异常: "destructive",
        待维护: "warning",
      }
      return (
        <Badge variant={(statusMap[item.maintenanceStatus] || "secondary") as any}>
          {item.maintenanceStatus}
        </Badge>
      )
    },
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

// 仪器卡片字段配置
export const equipmentCardFields = [
  { 
    id: "model", 
    label: "型号", 
    value: (item: any) => item.model
  },
  { 
    id: "category", 
    label: "仪器类型", 
    value: (item: any) => item.category
  },
  { 
    id: "status", 
    label: "使用状态", 
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
    id: "purchaseDate", 
    label: "购置日期", 
    value: (item: any) => format(new Date(item.purchaseDate), "yyyy/MM/dd")
  },
  { 
    id: "price", 
    label: "价格", 
    value: (item: any) => `￥${item.price.toLocaleString()}`
  }
]

// 仪器特定操作配置
export const equipmentActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      // 使用路由跳转到仪器详情页
      const url = `/laboratory/equipment/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑仪器",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "booking",
    label: "仪器预约",
    icon: <Calendar className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment/booking/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "maintenance",
    label: "维护记录",
    icon: <Wrench className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment/maintenance/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "usage",
    label: "使用记录",
    icon: <List className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment/usage/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "report",
    label: "统计报表",
    icon: <BarChart className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment/report/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "delete",
    label: "删除仪器",
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
    id: "complete",
    label: "标记完成",
    icon: <Check className="h-4 w-4" />,
  },
  {
    id: "delay",
    label: "标记延期",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
] 