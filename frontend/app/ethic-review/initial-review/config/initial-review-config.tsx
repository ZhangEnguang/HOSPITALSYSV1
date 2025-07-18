import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
// 使用MoreVertical代替MoreHorizontal实现竖向省略号样式
import { Eye, FileEdit, Trash2, Clock, CheckCircle, XCircle, AlertTriangle, ClipboardCheck, MoreVertical } from "lucide-react"
import { REVIEW_TYPES, REVIEW_RESULTS, APPROVAL_STATUSES } from "../data/initial-review-demo-data"
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
  "已提交": { color: "bg-sky-50 text-sky-600 border-sky-200" },
  "形审通过": { color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  "形审退回": { color: "bg-rose-50 text-rose-600 border-rose-200" },
  "已作废": { color: "bg-gray-50 text-gray-500 border-gray-200" },
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

// 此函数使用了card-list组件中的MoreVertical
export const getColumnVisibility = () => {
  return {
    projectId: true,
    projectType: true,
    name: true,
    projectLeader: true,
    department: true,
    ethicsCommittee: true,
    status: true,
    reviewMethod: true,
    actions: true,
  }
}

// 定义表格列配置
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
    id: "projectType",
    header: "项目类型",
    accessorKey: "projectType",
    cell: (item: any) => <div>{item.projectType || "-"}</div>,
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
  {
    id: "reviewMethod",
    header: "审查方式",
    accessorKey: "reviewMethod",
    cell: (item: any) => {
      const reviewMethod = item.reviewMethod
      if (!reviewMethod) return <span className="text-gray-400">-</span>
      
      // 根据审查方式显示不同的颜色
      if (reviewMethod === "快速审查") {
        return <span className="text-blue-600 font-medium">{reviewMethod}</span>
      } else if (reviewMethod === "会议审查") {
        return <span className="text-green-600 font-medium">{reviewMethod}</span>
      } else {
        return <span className="text-gray-500">{reviewMethod}</span>
      }
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
            <DropdownMenuItem onClick={() => window.location.href = `/initial-review/${item.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              查看详情
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `/initial-review/${item.id}/edit`}>
              <FileEdit className="h-4 w-4 mr-2" />
              编辑项目
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `/ethic-review/initial-review/${item.id}/review`}>
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

// 定义快速筛选选项
export const quickFilters = [
  {
    id: "reviewType",
    label: "审查类型",
    options: [
      { value: "全部审查", label: "全部审查" },
      { value: "初始审查", label: "初始审查" },
      { value: "复审", label: "复审" },
    ],
  },
  {
    id: "status",
    label: "审核状态",
    options: [
      { value: "全部状态", label: "全部状态" },
      { value: "已提交", label: "已提交" },
      { value: "形审通过", label: "形审通过" },
      { value: "形审退回", label: "形审退回" },
    ],
  },
  {
    id: "reviewMethod",
    label: "审查方式",
    options: [
      { value: "全部方式", label: "全部方式" },
      { value: "快速审查", label: "快速审查" },
      { value: "会议审查", label: "会议审查" },
      { value: "待定", label: "待定" },
    ],
  },
  {
    id: "projectType",
    label: "项目类型",
    options: [
      { value: "全部类型", label: "全部类型" },
      { value: "动物", label: "动物" },
      { value: "人体", label: "人体" },
    ],
  },
  {
    id: "ethicsCommittee",
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
    id: "projectLeader",
    label: "项目负责人",
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={item.projectLeader?.avatar} alt={item.projectLeader?.name} />
          <AvatarFallback>{(item.projectLeader?.name || "-").charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{item.projectLeader?.name || "-"}</span>
      </div>
    ),
  },
  {
    id: "reviewType",
    label: "审查类型",
    value: (item: any) => item.reviewType || "-",
  },
  {
    id: "reviewMethod",
    label: "审查方式",
    value: (item: any) => {
      const reviewMethod = item.reviewMethod
      if (!reviewMethod) return "-"
      
      // 根据审查方式显示不同的颜色
      if (reviewMethod === "快速审查") {
        return <span className="text-blue-600 font-medium">{reviewMethod}</span>
      } else if (reviewMethod === "会议审查") {
        return <span className="text-green-600 font-medium">{reviewMethod}</span>
      } else {
        return <span className="text-gray-500">{reviewMethod}</span>
      }
    },
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

// 定义卡片操作
export const cardActions = [
  {
    id: "view",
    icon: <Eye className="h-4 w-4" />,
    label: "查看详情",
    onClick: (item: any) => {
      window.location.href = `/initial-review/${item.id}`
    },
  },
  {
    id: "edit",
    icon: <FileEdit className="h-4 w-4" />,
    label: "编辑项目",
    onClick: (item: any) => {
      window.location.href = `/initial-review/${item.id}/edit`
    },
  },
  {
    id: "review",
    icon: <ClipboardCheck className="h-4 w-4" />,
    label: "审核项目",
    onClick: (item: any) => {
      window.location.href = `/ethic-review/initial-review/${item.id}/review`
    },
  },
  {
    id: "delete",
    icon: <Trash2 className="h-4 w-4" />,
    label: "删除项目",
    onClick: (item: any, e: any, onDelete?: (item: any) => void) => {
      if (onDelete) {
        onDelete(item);
      }
    },
  },
]

// 定义排序选项
export const sortOptions = [
  {
    id: "projectIdAsc",
    field: "projectId",
    direction: "asc",
    label: "受理号 (升序)"
  },
  {
    id: "projectIdDesc",
    field: "projectId",
    direction: "desc",
    label: "受理号 (降序)"
  },
  {
    id: "nameAsc",
    field: "name",
    direction: "asc",
    label: "项目名称 (升序)"
  },
  {
    id: "nameDesc",
    field: "name",
    direction: "desc",
    label: "项目名称 (降序)"
  },
  {
    id: "departmentAsc",
    field: "department",
    direction: "asc",
    label: "所属院系 (升序)"
  },
  {
    id: "departmentDesc",
    field: "department",
    direction: "desc",
    label: "所属院系 (降序)"
  },
  {
    id: "ethicsCommitteeAsc",
    field: "ethicsCommittee",
    direction: "asc",
    label: "伦理委员会 (升序)"
  },
  {
    id: "ethicsCommitteeDesc",
    field: "ethicsCommittee",
    direction: "desc",
    label: "伦理委员会 (降序)"
  },
  {
    id: "statusAsc",
    field: "status",
    direction: "asc",
    label: "状态 (升序)"
  },
  {
    id: "statusDesc",
    field: "status",
    direction: "desc",
    label: "状态 (降序)"
  },
  {
    id: "projectLeaderAsc",
    field: "projectLeader",
    direction: "asc",
    label: "项目负责人 (升序)"
  },
  {
    id: "projectLeaderDesc",
    field: "projectLeader",
    direction: "desc",
    label: "项目负责人 (降序)"
  },
  {
    id: "dueDateAsc",
    field: "dueDate",
    direction: "asc",
    label: "截止日期 (升序)"
  },
  {
    id: "dueDateDesc",
    field: "dueDate",
    direction: "desc",
    label: "截止日期 (降序)"
  },
  {
    id: "completionAsc",
    field: "completion",
    direction: "asc",
    label: "完成度 (升序)"
  },
  {
    id: "completionDesc",
    field: "completion",
    direction: "desc",
    label: "完成度 (降序)"
  },
]

// 定义高级筛选分类
export const filterCategories = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "projectId",
        label: "受理号",
        type: "text",
        placeholder: "请输入受理号"
      },
      {
        id: "reviewType",
        label: "审查类型",
        type: "select",
        options: [
          { value: "", label: "全部审查类型" },
          { value: "初始审查", label: "初始审查" },
          { value: "复审", label: "复审" }
        ]
      },
      {
        id: "name",
        label: "项目名称",
        type: "text",
        placeholder: "请输入项目名称关键词"
      },
      {
        id: "projectType",
        label: "项目类型",
        type: "select",
        options: [
          { value: "", label: "全部类型" },
          { value: "动物", label: "动物" },
          { value: "人体", label: "人体" }
        ]
      }
    ]
  },
  {
    id: "department",
    title: "院系与委员会",
    fields: [
      {
        id: "department",
        label: "所属院系",
        type: "text",
        placeholder: "请输入院系名称"
      },
      {
        id: "ethicsCommittee",
        label: "伦理委员会",
        type: "select",
        options: [
          { value: "", label: "全部委员会" },
          { value: "医学伦理委员会", label: "医学伦理委员会" },
          { value: "动物实验伦理委员会", label: "动物实验伦理委员会" },
          { value: "生物安全委员会", label: "生物安全委员会" }
        ]
      }
    ]
  },
  {
    id: "status",
    title: "审查状态",
    fields: [
      {
        id: "status",
        label: "审核状态",
        type: "select",
        options: [
          { value: "", label: "全部状态" },
          { value: "已提交", label: "已提交" },
          { value: "形审通过", label: "形审通过" },
          { value: "形审退回", label: "形审退回" }
        ]
      },
      {
        id: "reviewResult",
        label: "审查结果",
        type: "select",
        options: [
          { value: "", label: "全部结果" },
          { value: "通过", label: "通过" },
          { value: "修改后通过", label: "修改后通过" },
          { value: "不通过", label: "不通过" },
          { value: "待定", label: "待定" },
          { value: "待提交", label: "待提交" }
        ]
      }
    ]
  },
  {
    id: "timeline",
    title: "时间信息",
    fields: [
      {
        id: "dueDateFrom",
        label: "截止日期(从)",
        type: "date"
      },
      {
        id: "dueDateTo",
        label: "截止日期(至)",
        type: "date"
      },
      {
        id: "actualDateFrom",
        label: "实际完成日期(从)",
        type: "date"
      },
      {
        id: "actualDateTo",
        label: "实际完成日期(至)",
        type: "date"
      }
    ]
  },
  {
    id: "people",
    title: "负责人信息",
    fields: [
      {
        id: "projectLeader",
        label: "项目负责人",
        type: "member",
        placeholder: "请选择项目负责人"
      },
      {
        id: "priority",
        label: "优先级",
        type: "select",
        options: [
          { value: "", label: "全部优先级" },
          { value: "高", label: "高" },
          { value: "中", label: "中" },
          { value: "低", label: "低" }
        ]
      },
      {
        id: "completion",
        label: "完成进度",
        type: "range",
        min: 0,
        max: 100,
        step: 10
      }
    ]
  }
] 