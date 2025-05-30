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
  Calendar,
  User,
  Settings,
  FileText,
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
    label: "预约状态",
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
    id: "equipmentType",
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
    id: "department",
    label: "申请部门",
    value: "",
    options: [
      { id: "1", label: "生物实验室", value: "生物实验室" },
      { id: "2", label: "化学实验室", value: "化学实验室" },
      { id: "3", label: "物理实验室", value: "物理实验室" },
      { id: "4", label: "材料实验室", value: "材料实验室" },
      { id: "5", label: "计算机实验室", value: "计算机实验室" },
      { id: "6", label: "电子实验室", value: "电子实验室" },
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
        id: "bookingTitle",
        label: "预约标题",
        type: "text",
        placeholder: "请输入预约标题关键词",
      },
      {
        id: "equipmentName",
        label: "仪器名称",
        type: "text",
        placeholder: "请输入仪器名称",
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
    id: "time",
    title: "时间信息",
    fields: [
      {
        id: "bookingDateRange",
        label: "预约日期范围",
        type: "date-range",
      },
      {
        id: "applicationDateRange",
        label: "申请日期范围", 
        type: "date-range",
      },
      {
        id: "duration",
        label: "使用时长",
        type: "select",
        options: [
          { value: "1小时以内", label: "1小时以内" },
          { value: "1-4小时", label: "1-4小时" },
          { value: "4-8小时", label: "4-8小时" },
          { value: "1天以上", label: "1天以上" },
        ],
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
    id: "bookingDate_desc",
    label: "预约日期 (最近优先)",
    field: "bookingDate",
    direction: "desc" as const,
  },
  {
    id: "bookingDate_asc",
    label: "预约日期 (最早优先)",
    field: "bookingDate",
    direction: "asc" as const,
  },
  {
    id: "equipmentName_asc",
    label: "仪器名称 (A-Z)",
    field: "equipmentName",
    direction: "asc" as const,
  },
  {
    id: "equipmentName_desc",
    label: "仪器名称 (Z-A)",
    field: "equipmentName",
    direction: "desc" as const,
  },
]

// 仪器预约列配置
export const equipmentBookingColumns = [
  {
    id: "bookingTitle",
    header: "预约标题",
    accessorKey: "bookingTitle",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.bookingTitle}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.purpose}</span>
      </div>
    ),
  },
  {
    id: "equipmentName",
    header: "预约仪器",
    accessorKey: "equipmentName",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.equipmentName}</span>
        <span className="text-sm text-muted-foreground">{item.equipmentType}</span>
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
    id: "bookingDate",
    header: "预约日期",
    accessorKey: "bookingDate",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span>{format(new Date(item.startTime), "yyyy/MM/dd")}</span>
        <span className="text-sm text-muted-foreground">
          {format(new Date(item.startTime), "HH:mm")} - {format(new Date(item.endTime), "HH:mm")}
        </span>
      </div>
    ),
  },
  {
    id: "duration",
    header: "使用时长",
    accessorKey: "duration",
    cell: (item: any) => <span>{item.duration}</span>,
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
export const equipmentBookingCardFields = [
  { 
    id: "equipmentName", 
    label: "预约仪器", 
    value: (item: any) => `${item.equipmentName} (${item.equipmentType})`
  },
  { 
    id: "status", 
    label: "预约状态", 
    value: (item: any) => (
      <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>
    )
  },
  { 
    id: "bookingTime", 
    label: "预约时间", 
    value: (item: any) => (
      <div className="flex flex-col">
        <span>{format(new Date(item.startTime), "yyyy/MM/dd")}</span>
        <span className="text-sm text-muted-foreground">
          {format(new Date(item.startTime), "HH:mm")} - {format(new Date(item.endTime), "HH:mm")}
        </span>
      </div>
    )
  },
  { 
    id: "duration", 
    label: "使用时长", 
    value: (item: any) => item.duration
  },
  { 
    id: "applicant", 
    label: "申请人", 
    value: (item: any) => `${item.applicant.name} (${item.department})`
  },
  { 
    id: "applicationDate", 
    label: "申请时间", 
    value: (item: any) => format(new Date(item.applicationDate), "yyyy/MM/dd HH:mm")
  }
]

// 仪器预约操作配置
export const equipmentBookingActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment-booking/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑申领",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment-booking/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "approve",
    label: "审核申领",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment-booking/approve/${item.id}`;
      window.open(url, "_self");
    },
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
    label: "批量拒绝",
    icon: <X className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
] 