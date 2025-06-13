import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Eye, FileEdit, Trash2, Clock, CheckCircle, XCircle, AlertTriangle, ClipboardCheck, MoreVertical } from "lucide-react"
import { REVIEW_TYPE_OPTIONS, REVIEW_RESULTS, APPROVAL_STATUSES, REVIEW_STATUSES } from "../data/track-review-demo-data"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// 定义用户数据
export const users = [
  {
    id: "u1",
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "/avatars/01.png",
    department: "神经科学研究院",
    title: "教授",
  },
  {
    id: "u2",
    name: "李四",
    email: "lisi@example.com",
    avatar: "/avatars/02.png",
    department: "肿瘤医学中心",
    title: "副教授",
  },
  {
    id: "u3",
    name: "王五",
    email: "wangwu@example.com",
    avatar: "/avatars/03.png",
    department: "运动医学科学院",
    title: "讲师",
  },
  {
    id: "u4",
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: "/avatars/04.png",
    department: "药学院",
    title: "研究员",
  },
  {
    id: "u5",
    name: "钱七",
    email: "qianqi@example.com",
    avatar: "/avatars/05.png",
    department: "肿瘤医学中心",
    title: "主任医师",
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
  "已提交": { color: "bg-sky-50 text-sky-600 border-sky-200" },
  "形审通过": { color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  "形审退回": { color: "bg-rose-50 text-rose-600 border-rose-200" },
  "已作废": { color: "bg-gray-50 text-gray-500 border-gray-200" },
}

// 为 DataList 组件提供的状态变体
export const dataListStatusVariants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
  "已提交": "secondary",
  "形审通过": "default",
  "形审退回": "destructive",
  "已作废": "outline",
}

// 优先级变体和颜色
export const priorityVariants: Record<string, PriorityVariant> = {
  "高": { color: "text-red-600", icon: <AlertTriangle className="h-4 w-4" /> },
  "中": { color: "text-amber-600", icon: <Clock className="h-4 w-4" /> },
  "低": { color: "text-blue-600", icon: <CheckCircle className="h-4 w-4" /> },
}

// 状态名称映射函数
export const getStatusName = (item: any) => {
  // 从item中获取status字段
  const status = item.status;
  if (!status) return "";
  
  // 直接返回中文状态值，因为数据中已经是中文的了
  return status;
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
    id: "reviewType",
    header: "审查类型",
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
    id: "dueDate",
    header: "预计完成日期",
    accessorKey: "dueDate",
    cell: (item: any) => <div>{item.dueDate || "-"}</div>,
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
            <DropdownMenuItem onClick={() => window.location.href = `/ethic-review/track-review/${item.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              查看详情
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `/ethic-review/track-review/${item.id}/edit`}>
              <FileEdit className="h-4 w-4 mr-2" />
              编辑项目
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `/ethic-review/track-review/${item.id}/review`}>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              审核项目
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                // 触发删除确认弹框
                if (window.showDeleteConfirm) {
                  window.showDeleteConfirm(item);
                }
              }}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除项目
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
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
    id: "department",
    label: "所属院系",
    value: (item: any) => item.department || "-",
  },
  {
    id: "ethicsCommittee",
    label: "伦理委员会",
    value: (item: any) => item.ethicsCommittee || "-",
  },
  {
    id: "dueDate",
    label: "预计完成时间",
    value: (item: any) => item.dueDate || "-",
  },
]

// 卡片操作按钮
export const cardActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      window.location.href = `/ethic-review/track-review/${item.id}`
    },
  },
  {
    id: "edit",
    label: "编辑项目",
    icon: <FileEdit className="h-4 w-4" />,
    onClick: (item: any) => {
      window.location.href = `/ethic-review/track-review/${item.id}/edit`
    },
  },
  {
    id: "review",
    label: "审核项目",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item: any) => {
      window.location.href = `/ethic-review/track-review/${item.id}/review`
    },
  },
  {
    id: "delete",
    label: "删除项目",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: any, e: any, onDelete?: (item: any) => void) => {
      if (onDelete) {
        onDelete(item);
      }
    },
  },
]

// 排序选项
export const sortOptions = [
  {
    id: "projectIdAsc",
    label: "受理号（升序）",
    field: "projectId",
    direction: "asc",
  },
  {
    id: "projectIdDesc",
    label: "受理号（降序）",
    field: "projectId",
    direction: "desc",
  },
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
    id: "reviewType",
    label: "审查类型",
    value: "全部审查",
    options: [
      { id: "all", label: "全部审查", value: "全部审查" },
      { id: "amendment", label: "修正案审查", value: "修正案审查" },
      { id: "periodical", label: "年度/定期审查", value: "年度/定期审查" },
      { id: "safety", label: "安全性审查", value: "安全性审查" },
      { id: "deviation", label: "偏离方案报告", value: "偏离方案报告" },
      { id: "suspension", label: "暂停/终止研究报告", value: "暂停/终止研究报告" },
      { id: "completion", label: "研究完成报告", value: "研究完成报告" },
      { id: "review", label: "复审", value: "复审" }
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
        id: "reviewType",
        label: "审查类型",
        type: "select" as const,
        options: REVIEW_TYPE_OPTIONS.map(option => ({ value: option.label, label: option.label })),
        placeholder: "请选择审查类型",
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
        options: REVIEW_STATUSES.map(status => ({ value: status, label: status })),
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
    id: "date",
    title: "日期信息",
    fields: [
      {
        id: "dueDateRange",
        label: "预计完成日期",
        type: "date" as const,
        placeholder: "请选择日期范围",
      },
    ],
  },
] 