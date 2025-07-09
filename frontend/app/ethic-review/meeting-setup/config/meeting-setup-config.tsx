import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Eye, FileEdit, Trash2, Clock, CheckCircle, XCircle, AlertTriangle, ClipboardCheck, MoreVertical, Calendar, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// 定义用户数据
export const users = [
  {
    id: "u1",
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "/avatars/01.png",
    department: "计算机科学学院",
    title: "教授",
  },
  {
    id: "u2",
    name: "李四",
    email: "lisi@example.com",
    avatar: "/avatars/02.png",
    department: "电子工程学院",
    title: "副教授",
  },
  {
    id: "u3",
    name: "王五",
    email: "wangwu@example.com",
    avatar: "/avatars/03.png",
    department: "物理学院",
    title: "讲师",
  },
  {
    id: "u4",
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: "/avatars/04.png",
    department: "化学学院",
    title: "副教授",
  },
  {
    id: "u5",
    name: "钱七",
    email: "qianqi@example.com",
    avatar: "/avatars/05.png",
    department: "材料科学学院",
    title: "教授",
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
  "草稿": { color: "bg-gray-50 text-gray-600 border-gray-200" },
  "待发布": { color: "bg-amber-50 text-amber-600 border-amber-200" },
  "已完成": { color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  "未开始": { color: "bg-blue-50 text-blue-600 border-blue-200" },
  "进行中": { color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  "已结束": { color: "bg-green-50 text-green-600 border-green-200" },
  "已取消": { color: "bg-rose-50 text-rose-600 border-rose-200" },
}

// 优先级变体和颜色
export const priorityVariants: Record<string, PriorityVariant> = {
  "高": { color: "text-red-600", icon: <AlertTriangle className="h-4 w-4" /> },
  "中": { color: "text-amber-600", icon: <Clock className="h-4 w-4" /> },
  "低": { color: "text-blue-600", icon: <CheckCircle className="h-4 w-4" /> },
}

// 状态名称映射函数
export const getStatusName = (item: any) => {
  const status = item.status;
  if (!status) return "";
  return status;
}

// 列可见性设置
export const getColumnVisibility = () => {
  return {
    meetingId: true,
    meetingType: true,
    title: true,
    date: true,
    venue: true,
    organizer: true,
    status: true,
    reviewType: true,
    actions: true,
  }
}

// 定义表格列配置
export const tableColumns = [
  {
    id: "meetingId",
    header: "会议编号",
    accessorKey: "meetingId",
    cell: (item: any) => (
      <div className="font-medium">
        {item.meetingId || "-"}
      </div>
    ),
  },
  {
    id: "title",
    header: "会议标题",
    accessorKey: "title",
    cell: (item: any) => <div className="font-medium">{item.title}</div>,
  },
  {
    id: "date",
    header: "会议时间",
    accessorKey: "date",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{item.date || "-"}</span>
      </div>
    ),
  },
  {
    id: "venue",
    header: "会议场地",
    accessorKey: "venue",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span>{item.venue || "-"}</span>
      </div>
    ),
  },
  {
    id: "organizer",
    header: "组织者",
    accessorKey: "organizer",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.organizer?.avatar} alt={item.organizer?.name} />
          <AvatarFallback>{item.organizer?.name?.charAt(0) || "-"}</AvatarFallback>
        </Avatar>
        <div>{item.organizer?.name || "-"}</div>
      </div>
    ),
  },
  {
    id: "quickReviewCount",
    header: "快速审查项目",
    accessorKey: "quickReviewCount",
    cell: (item: any) => (
      <div className="text-center">
        <span className="font-medium text-blue-600">{item.quickReviewCount || 0}</span>
        <span className="text-sm text-muted-foreground ml-1">项</span>
      </div>
    ),
  },
  {
    id: "meetingReviewCount",
    header: "会议审查项目",
    accessorKey: "meetingReviewCount",
    cell: (item: any) => (
      <div className="text-center">
        <span className="font-medium text-green-600">{item.meetingReviewCount || 0}</span>
        <span className="text-sm text-muted-foreground ml-1">项</span>
      </div>
    ),
  },
  {
    id: "status",
    header: "状态",
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
  {
    id: "actions",
    header: "操作",
    accessorKey: "actions",
    className: "text-right pr-4",
    cell: (item: any) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => window.location.href = `/ethic-review/meeting-setup/${item.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              查看详情
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `/ethic-review/meeting-setup/edit/${item.id}`}>
              <FileEdit className="h-4 w-4 mr-2" />
              编辑会议
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                if (window.showDeleteConfirm) {
                  window.showDeleteConfirm(item);
                }
              }}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除会议
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

// 定义快速筛选选项
export const quickFilters = [
  {
    id: "meetingType",
    label: "会议类型",
    options: [
      { value: "全部类型", label: "全部类型" },
      { value: "初始审查会议", label: "初始审查会议" },
      { value: "跟踪审查会议", label: "跟踪审查会议" },
      { value: "快速审查会议", label: "快速审查会议" },
      { value: "年度审查会议", label: "年度审查会议" },
    ],
  },
  {
    id: "status",
    label: "状态",
    options: [
      { value: "全部状态", label: "全部状态" },
      { value: "草稿", label: "草稿" },
      { value: "待发布", label: "待发布" },
      { value: "已发布", label: "已发布" },
      { value: "进行中", label: "进行中" },
      { value: "已完成", label: "已完成" },
      { value: "已取消", label: "已取消" },
    ],
  },
  {
    id: "venue",
    label: "会议场地",
    options: [
      { value: "全部场地", label: "全部场地" },
      { value: "会议室A", label: "会议室A" },
      { value: "会议室B", label: "会议室B" },
      { value: "学术报告厅", label: "学术报告厅" },
      { value: "线上会议", label: "线上会议" },
    ],
  },
  {
    id: "reviewType",
    label: "审查类型",
    options: [
      { value: "全部审查", label: "全部审查" },
      { value: "初始审查", label: "初始审查" },
      { value: "跟踪审查", label: "跟踪审查" },
      { value: "快速审查", label: "快速审查" },
      { value: "年度审查", label: "年度审查" },
    ],
  },
  {
    id: "committee",
    label: "伦理委员会",
    options: [
      { value: "全部委员会", label: "全部委员会" },
      { value: "医学伦理委员会", label: "医学伦理委员会" },
      { value: "动物实验伦理委员会", label: "动物实验伦理委员会" },
      { value: "生物安全委员会", label: "生物安全委员会" },
    ],
  },
]

// 定义卡片字段
export const cardFields = [
  {
    id: "organizer",
    label: "组织者",
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={item.organizer?.avatar} alt={item.organizer?.name} />
          <AvatarFallback>{(item.organizer?.name || "-").charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{item.organizer?.name || "-"}</span>
      </div>
    ),
  },
  {
    id: "quickReviewCount",
    label: "快速审查项目",
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-blue-600">{item.quickReviewCount || 0}</span>
        <span className="text-sm text-muted-foreground">项</span>
      </div>
    ),
  },
  {
    id: "date",
    label: "会议日期",
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{item.date || "-"}</span>
      </div>
    ),
  },
  {
    id: "venue",
    label: "会议场地",
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span>{item.venue || "-"}</span>
      </div>
    ),
  },
  {
    id: "meetingReviewCount",
    label: "会议审查项目",
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-green-600">{item.meetingReviewCount || 0}</span>
        <span className="text-sm text-muted-foreground">项</span>
      </div>
    ),
  },
]

// 定义卡片操作
export const cardActions = [
  {
    id: "view",
    icon: <Eye className="h-4 w-4" />,
    label: "查看详情",
    onClick: (item: any) => {
      window.location.href = `/ethic-review/meeting-setup/${item.id}`
    },
  },
  {
    id: "edit",
    icon: <FileEdit className="h-4 w-4" />,
    label: "编辑会议",
    onClick: (item: any) => {
      window.location.href = `/ethic-review/meeting-setup/edit/${item.id}`
    },
  },
  {
    id: "delete",
    icon: <Trash2 className="h-4 w-4" />,
    label: "删除会议",
    onClick: (item: any, e: any, deleteConfirm: any) => {
      if (deleteConfirm) {
        deleteConfirm(item)
      }
    },
  },
]

// 定义排序选项
export const sortOptions = [
  {
    id: "titleAsc",
    label: "标题 A-Z",
    field: "title",
    direction: "asc",
  },
  {
    id: "titleDesc",
    label: "标题 Z-A",
    field: "title",
    direction: "desc",
  },
  {
    id: "dateAsc",
    label: "日期 早-晚",
    field: "date",
    direction: "asc",
  },
  {
    id: "dateDesc",
    label: "日期 晚-早",
    field: "date",
    direction: "desc",
  },
  {
    id: "organizerAsc",
    label: "组织者 A-Z",
    field: "organizer",
    direction: "asc",
  },
  {
    id: "organizerDesc",
    label: "组织者 Z-A",
    field: "organizer",
    direction: "desc",
  },
]

// 定义高级筛选分类
export const filterCategories = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "title",
        label: "会议标题",
        type: "text",
        placeholder: "请输入会议标题关键词"
      },
      {
        id: "meetingId",
        label: "会议编号",
        type: "text",
        placeholder: "请输入会议编号"
      },
      {
        id: "description",
        label: "会议描述",
        type: "text",
        placeholder: "请输入会议描述关键词"
      }
    ]
  },
  {
    id: "meeting",
    title: "会议信息",
    fields: [
      {
        id: "meetingType",
        label: "会议类型",
        type: "select",
        options: [
          { value: "初始审查会议", label: "初始审查会议" },
          { value: "跟踪审查会议", label: "跟踪审查会议" },
          { value: "快速审查会议", label: "快速审查会议" },
          { value: "年度审查会议", label: "年度审查会议" }
        ]
      },
      {
        id: "venue",
        label: "会议场地",
        type: "select",
        options: [
          { value: "会议室A", label: "会议室A" },
          { value: "会议室B", label: "会议室B" },
          { value: "学术报告厅", label: "学术报告厅" },
          { value: "线上会议", label: "线上会议" }
        ]
      },
      {
        id: "date",
        label: "会议日期",
        type: "date",
        placeholder: "请选择会议日期"
      }
    ]
  },
  {
    id: "status",
    title: "状态信息",
    fields: [
      {
        id: "status",
        label: "会议状态",
        type: "select",
        options: [
          { value: "草稿", label: "草稿" },
          { value: "待发布", label: "待发布" },
          { value: "已发布", label: "已发布" },
          { value: "进行中", label: "进行中" },
          { value: "已完成", label: "已完成" },
          { value: "已取消", label: "已取消" }
        ]
      },
      {
        id: "reviewType",
        label: "审查类型",
        type: "select",
        options: [
          { value: "初始审查", label: "初始审查" },
          { value: "跟踪审查", label: "跟踪审查" },
          { value: "快速审查", label: "快速审查" },
          { value: "年度审查", label: "年度审查" }
        ]
      }
    ]
  }
] 