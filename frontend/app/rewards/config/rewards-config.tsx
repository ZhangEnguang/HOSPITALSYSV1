import {
  Eye,
  Pencil,
  Trash2,
  Download,
  Printer,
  Share2,
  Award,
  BarChart4,
  FileEdit,
  FileText,
  Send,
} from "lucide-react"
import type { FilterField } from "@/components/data-management/data-list-filters"
import type { TableColumn } from "@/components/data-management/data-list-table"
import type { CardField } from "@/components/data-management/data-list-card"
import type { SortOption } from "@/components/data-management/data-list-toolbar"
import type { BatchAction } from "@/components/data-management/data-list-batch-actions"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 结果颜色映射
export const statusColors: Record<string, string> = {
  优秀: "success",
  良好: "warning",
  合格: "secondary",
  不合格: "destructive",
}

// 用户数据
export const users = [
  {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "技术总监",
  },
  {
    id: 2,
    name: "李四",
    email: "lisi@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "产品经理",
  },
  {
    id: 3,
    name: "王五",
    email: "wangwu@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "UI设计师",
  },
  {
    id: 4,
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "前端开发",
  },
  {
    id: 5,
    name: "孙七",
    email: "sunqi@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "后端开发",
  },
]

// 考核成员配置
export const memberColumns = [
  {
    id: "name",
    header: "姓名",
    accessorKey: "name",
    className: "w-[120px]",
  },
  {
    id: "department",
    header: "部门",
    accessorKey: "department",
  },
  {
    id: "position",
    header: "职位",
    accessorKey: "position",
  },
  {
    id: "assessmentPeriod",
    header: "考核周期",
    accessorKey: "assessmentPeriod",
  },
  {
    id: "score",
    header: "考核得分",
    cell: (item: any) => <div className="font-medium">{item.score}</div>,
  },
  {
    id: "status",
    header: "考核结果",
    cell: (item: any) => {
      const variantMap: Record<string, string> = {
        优秀: "success",
        良好: "default",
        合格: "secondary",
        待改进: "warning",
        不合格: "destructive",
      }

      return <Badge variant={variantMap[item.status] || "secondary"}>{item.status}</Badge>
    },
  },
  {
    id: "assessor",
    header: "考核人",
    accessorKey: "assessor",
  },
  {
    id: "assessmentDate",
    header: "考核日期",
    accessorKey: "assessmentDate",
  },
]

export const memberCardFields = [
  {
    id: "department",
    label: "部门",
    value: (item: any) => item.department,
  },
  {
    id: "position",
    label: "职位",
    value: (item: any) => item.position,
  },
  {
    id: "score",
    label: "考核得分",
    value: (item: any) => <div className="font-medium">{item.score}</div>,
    className: "text-center",
  },
  {
    id: "assessmentDate",
    label: "考核日期",
    value: (item: any) => item.assessmentDate,
  },
]

export const memberActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => console.log("查看考核详情:", item),
  },
  {
    id: "edit",
    label: "编辑考核",
    icon: <FileEdit className="h-4 w-4" />,
    onClick: (item: any) => console.log("编辑考核:", item),
  },
  {
    id: "delete",
    label: "删除考核",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: any) => console.log("删除考核:", item),
    variant: "destructive",
  },
]

export const memberBatchActions = [
  {
    id: "export",
    label: "导出考核",
    icon: <Download className="h-4 w-4 mr-2" />,
    onClick: () => console.log("导出选中的考核"),
  },
  {
    id: "share",
    label: "分享考核",
    icon: <Share2 className="h-4 w-4 mr-2" />,
    onClick: () => console.log("分享选中的考核"),
  },
  {
    id: "award",
    label: "批量奖励",
    icon: <Award className="h-4 w-4 mr-2" />,
    onClick: () => console.log("批量奖励"),
    variant: "default",
  },
]

export const memberQuickFilters = [
  {
    id: "status",
    label: "考核结果",
    value: "all",
    options: [
      { id: "excellent", label: "优秀", value: "优秀" },
      { id: "good", label: "良好", value: "良好" },
      { id: "qualified", label: "合格", value: "合格" },
      { id: "needImprovement", label: "待改进", value: "待改进" },
      { id: "unqualified", label: "不合格", value: "不合格" },
    ],
  },
  {
    id: "department",
    label: "部门",
    value: "all",
    options: [
      { id: "rd", label: "研发部", value: "研发部" },
      { id: "marketing", label: "市场部", value: "市场部" },
      { id: "hr", label: "人力资源部", value: "人力资源部" },
      { id: "finance", label: "财务部", value: "财务部" },
      { id: "operations", label: "运营部", value: "运营部" },
    ],
  },
]

export const memberAdvancedFilters = [
  {
    id: "assessmentPeriod",
    type: "select",
    label: "考核周期",
    options: [
      { id: "2023q4", label: "2023年第四季度", value: "2023年第四季度" },
      { id: "2023q3", label: "2023年第三季度", value: "2023年第三季度" },
      { id: "2023q2", label: "2023年第二季度", value: "2023年第二季度" },
      { id: "2023q1", label: "2023年第一季度", value: "2023年第一季度" },
      { id: "2022q4", label: "2022年第四季度", value: "2022年第四季度" },
    ],
  },
  {
    id: "scoreRange",
    type: "number",
    label: "最低分数",
  },
  {
    id: "assessmentDate",
    type: "date",
    label: "考核日期范围",
  },
  {
    id: "assessor",
    type: "multiselect",
    label: "考核人",
    options: [
      { id: "zhangsan", label: "张三", value: "张三" },
      { id: "lisi", label: "李四", value: "李四" },
      { id: "wangwu", label: "王五", value: "王五" },
      { id: "zhaoliu", label: "赵六", value: "赵六" },
    ],
  },
]

export const memberSortOptions = [
  {
    id: "score_desc",
    label: "分数从高到低",
    field: "score",
    direction: "desc" as const,
  },
  {
    id: "score_asc",
    label: "分数从低到高",
    field: "score",
    direction: "asc" as const,
  },
  {
    id: "date_desc",
    label: "考核日期从新到旧",
    field: "assessmentDate",
    direction: "desc" as const,
  },
  {
    id: "date_asc",
    label: "考核日期从旧到新",
    field: "assessmentDate",
    direction: "asc" as const,
  },
]

// 部门考核配置
export const statisticsColumns = [
  {
    id: "department",
    header: "部门名称",
    accessorKey: "department",
  },
  {
    id: "period",
    header: "考核周期",
    accessorKey: "period",
  },
  {
    id: "score",
    header: "考核得分",
    cell: (item: any) => <div className="font-medium">{item.score}</div>,
  },
  {
    id: "result",
    header: "考核结果",
    cell: (item: any) => <Badge variant={statusColors[item.result] || "secondary"}>{item.result}</Badge>,
  },
  {
    id: "evaluator",
    header: "考核人",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.evaluator?.avatar} />
          <AvatarFallback>{item.evaluator?.name?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <span>{item.evaluator?.name}</span>
      </div>
    ),
  },
  {
    id: "date",
    header: "考核日期",
    cell: (item: any) => (item.date ? format(new Date(item.date), "yyyy-MM-dd") : "-"),
  },
]

export const statisticsCardFields = [
  {
    id: "department",
    label: "部门名称",
    value: (item: any) => <span className="text-muted-foreground text-xs">{item.department}</span>,
  },
  {
    id: "period",
    label: "考核周期",
    value: (item: any) => <span className="text-muted-foreground text-xs">{item.period}</span>,
  },
  {
    id: "score",
    label: "考核得分",
    value: (item: any) => <span className="text-muted-foreground text-xs font-medium">{item.score}</span>,
  },
  {
    id: "result",
    label: "考核结果",
    value: (item: any) => <Badge variant={statusColors[item.result] || "secondary"}>{item.result}</Badge>,
  },
  {
    id: "evaluator",
    label: "考核人",
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.evaluator?.avatar} />
          <AvatarFallback>{item.evaluator?.name?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5 text-sm">
          <span className="font-medium">{item.evaluator?.name}</span>
          <span className="text-muted-foreground text-xs">考核人</span>
        </div>
      </div>
    ),
  },
  {
    id: "date",
    label: "考核日期",
    value: (item: any) => (
      <span className="text-muted-foreground text-xs">
        {item.date ? format(new Date(item.date), "yyyy-MM-dd") : "-"}
      </span>
    ),
  },
]

export const statisticsActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <BarChart4 className="h-4 w-4" />,
    onClick: (item: any) => console.log("查看统计详情:", item),
  },
  {
    id: "export",
    label: "导出报表",
    icon: <FileText className="h-4 w-4" />,
    onClick: (item: any) => console.log("导出报表:", item),
  },
]

export const statisticsBatchActions = [
  {
    id: "export",
    label: "批量导出",
    icon: <Download className="h-4 w-4 mr-2" />,
    onClick: () => console.log("批量导出统计"),
  },
  {
    id: "compare",
    label: "对比分析",
    icon: <BarChart4 className="h-4 w-4 mr-2" />,
    onClick: () => console.log("对比分析"),
    variant: "default",
  },
]

export const statisticsQuickFilters = [
  {
    id: "period",
    label: "统计周期",
    value: "all",
    options: [
      { id: "2023q4", label: "2023年第四季度", value: "2023年第四季度" },
      { id: "2023q3", label: "2023年第三季度", value: "2023年第三季度" },
      { id: "2023q2", label: "2023年第二季度", value: "2023年第二季度" },
      { id: "2023q1", label: "2023年第一季度", value: "2023年第一季度" },
      { id: "2022q4", label: "2022年第四季度", value: "2022年第四季度" },
    ],
  },
]

export const statisticsAdvancedFilters = [
  {
    id: "department",
    type: "multiselect",
    label: "部门",
    options: [
      { id: "rd", label: "研发部", value: "研发部" },
      { id: "marketing", label: "市场部", value: "市场部" },
      { id: "hr", label: "人力资源部", value: "人力资源部" },
      { id: "finance", label: "财务部", value: "财务部" },
      { id: "operations", label: "运营部", value: "运营部" },
    ],
  },
  {
    id: "dateRange",
    type: "date",
    label: "日期范围",
  },
  {
    id: "minExcellentRate",
    type: "number",
    label: "最低优秀率(%)",
  },
]

export const statisticsSortOptions = [
  {
    id: "excellentRate_desc",
    label: "优秀率从高到低",
    field: "excellentRate",
    direction: "desc" as const,
  },
  {
    id: "averageScore_desc",
    label: "平均分从高到低",
    field: "averageScore",
    direction: "desc" as const,
  },
  {
    id: "improvementRate_desc",
    label: "提升率从高到低",
    field: "improvementRate",
    direction: "desc" as const,
  },
]

// 评分报告配置
export const reportColumns = [
  {
    id: "name",
    header: "标准名称",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.avatar} />
          <AvatarFallback>{item.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{item.name}</span>
      </div>
    ),
  },
  {
    id: "department",
    header: "适用部门",
    accessorKey: "department",
  },
  {
    id: "completionRate",
    header: "完成度",
    cell: (item: any) => <div className="font-medium">{item.completionRate}%</div>,
  },
]

export const reportCardFields = [
  {
    id: "author",
    label: "作者",
    value: (item: any) => item.author,
  },
  {
    id: "department",
    label: "部门",
    value: (item: any) => item.department,
  },
]

export const reportActions = [
  {
    id: "view",
    label: "查看报告",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => console.log("查看报告:", item),
  },
  {
    id: "edit",
    label: "编辑报告",
    icon: <FileEdit className="h-4 w-4" />,
    onClick: (item: any) => console.log("编辑报告:", item),
  },
  {
    id: "publish",
    label: "发布报告",
    icon: <Send className="h-4 w-4" />,
    onClick: (item: any) => console.log("发布报告:", item),
    hidden: (item: any) => item.status === "已发布",
  },
  {
    id: "delete",
    label: "删除报告",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item: any) => console.log("删除报告:", item),
    variant: "destructive",
  },
]

export const reportBatchActions = [
  {
    id: "export",
    label: "批量导出",
    icon: <Download className="h-4 w-4 mr-2" />,
    onClick: () => console.log("批量导出报告"),
  },
  {
    id: "publish",
    label: "批量发布",
    icon: <Send className="h-4 w-4 mr-2" />,
    onClick: () => console.log("批量发布报告"),
    variant: "default",
  },
]

export const reportQuickFilters = [
  {
    id: "status",
    label: "状态",
    value: "all",
    options: [
      { id: "published", label: "已发布", value: "已发布" },
      { id: "draft", label: "草稿", value: "草稿" },
      { id: "reviewing", label: "审核中", value: "审核中" },
    ],
  },
  {
    id: "department",
    label: "部门",
    value: "all",
    options: [
      { id: "rd", label: "研发部", value: "研发部" },
      { id: "marketing", label: "市场部", value: "市场部" },
      { id: "hr", label: "人力资源部", value: "人力资源部" },
      { id: "finance", label: "财务部", value: "财务部" },
      { id: "operations", label: "运营部", value: "运营部" },
    ],
  },
]

export const reportAdvancedFilters = [
  {
    id: "period",
    type: "select",
    label: "考核周期",
    options: [
      { id: "2023q4", label: "2023年第四季度", value: "2023年第四季度" },
      { id: "2023q3", label: "2023年第三季度", value: "2023年第三季度" },
      { id: "2023q2", label: "2023年第二季度", value: "2023年第二季度" },
      { id: "2023q1", label: "2023年第一季度", value: "2023年第一季度" },
      { id: "2022q4", label: "2022年第四季度", value: "2022年第四季度" },
    ],
  },
  {
    id: "dateRange",
    type: "date",
    label: "创建日期范围",
  },
  {
    id: "author",
    type: "multiselect",
    label: "作者",
    options: [
      { id: "zhangsan", label: "张三", value: "张三" },
      { id: "lisi", label: "李四", value: "李四" },
      { id: "wangwu", label: "王五", value: "王五" },
      { id: "zhaoliu", label: "赵六", value: "赵六" },
    ],
  },
  {
    id: "minCompletionRate",
    type: "number",
    label: "最低完成度(%)",
  },
]

export const reportSortOptions = [
  {
    id: "updatedAt_desc",
    label: "更新日期从新到旧",
    field: "updatedAt",
    direction: "desc" as const,
  },
  {
    id: "createdAt_desc",
    label: "创建日期从新到旧",
    field: "createdAt",
    direction: "desc" as const,
  },
  {
    id: "completionRate_desc",
    label: "完成度从高到低",
    field: "completionRate",
    direction: "desc" as const,
  },
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "department",
    label: "部门",
    value: "all",
    options: [
      { id: "research", label: "研发部", value: "研发部" },
      { id: "marketing", label: "市场部", value: "市场部" },
      { id: "hr", label: "人力资源部", value: "人力资源部" },
      { id: "finance", label: "财务部", value: "财务部" },
      { id: "operations", label: "运营部", value: "运营部" },
    ],
  },
  {
    id: "result",
    label: "考核结果",
    value: "all",
    options: [
      { id: "excellent", label: "优秀", value: "优秀" },
      { id: "good", label: "良好", value: "良好" },
      { id: "pass", label: "合格", value: "合格" },
      { id: "fail", label: "不合格", value: "不合格" },
    ],
  },
]

// 高级筛选字段配置
export const advancedFilters: FilterField[] = [
  {
    id: "evaluator",
    type: "select",
    label: "考核人",
    options: users.map((user) => ({
      id: user.id.toString(),
      label: user.name,
      value: user.id.toString(),
      avatar: user.avatar,
    })),
  },
  {
    id: "period",
    type: "select",
    label: "考核周期",
    options: [
      { id: "2023-q4", label: "2023年第四季度", value: "2023年第四季度" },
      { id: "2023-q3", label: "2023年第三季度", value: "2023年第三季度" },
      { id: "2023-q2", label: "2023年第二季度", value: "2023年第二季度" },
      { id: "2023-q1", label: "2023年第一季度", value: "2023年第一季度" },
    ],
  },
  {
    id: "dateRange",
    type: "date",
    label: "考核日期",
  },
]

// 排序选项配置
export const sortOptions: SortOption[] = [
  { id: "name_asc", label: "姓名 (A-Z)", field: "name", direction: "asc" },
  { id: "name_desc", label: "姓名 (Z-A)", field: "name", direction: "desc" },
  { id: "date_desc", label: "日期（新-旧）", field: "date", direction: "desc" },
  { id: "date_asc", label: "日期（旧-新）", field: "date", direction: "asc" },
  { id: "score_desc", label: "分数（高-低）", field: "score", direction: "desc" },
  { id: "score_asc", label: "分数（低-高）", field: "score", direction: "asc" },
]

// 表格列配置
export const tableColumns: TableColumn[] = [
  {
    id: "name",
    header: "姓名",
    cell: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.avatar} />
          <AvatarFallback>{item.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{item.name}</span>
      </div>
    ),
  },
  {
    id: "department",
    header: "部门",
    cell: (item) => <span>{item.department}</span>,
  },
  {
    id: "position",
    header: "职位",
    cell: (item) => <span>{item.position}</span>,
  },
  {
    id: "period",
    header: "考核周期",
    cell: (item) => <span>{item.period}</span>,
  },
  {
    id: "score",
    header: "考核得分",
    cell: (item) => <span className="font-medium">{item.score}</span>,
  },
  {
    id: "result",
    header: "考核结果",
    cell: (item) => <Badge variant={statusColors[item.result]}>{item.result}</Badge>,
  },
  {
    id: "evaluator",
    header: "考核人",
    cell: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.evaluator.avatar} />
          <AvatarFallback>{item.evaluator.name[0]}</AvatarFallback>
        </Avatar>
        <span>{item.evaluator.name}</span>
      </div>
    ),
  },
  {
    id: "date",
    header: "考核日期",
    cell: (item) => (item.date ? format(new Date(item.date), "yyyy-MM-dd") : "-"),
  },
]

// 卡片字段配置
export const cardFields: CardField[] = [
  {
    id: "department",
    label: "部门",
    value: (item) => <span className="text-muted-foreground text-xs">{item.department}</span>,
  },
  {
    id: "position",
    label: "职位",
    value: (item) => <span className="text-muted-foreground text-xs">{item.position}</span>,
  },
  {
    id: "period",
    label: "考核周期",
    value: (item) => <span className="text-muted-foreground text-xs">{item.period}</span>,
  },
  {
    id: "score",
    label: "考核得分",
    value: (item) => <span className="text-muted-foreground text-xs font-medium">{item.score}</span>,
  },
  {
    id: "evaluator",
    label: "考核人",
    value: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.evaluator.avatar} />
          <AvatarFallback>{item.evaluator.name[0]}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5 text-sm">
          <span className="font-medium">{item.evaluator.name}</span>
          <span className="text-muted-foreground text-xs">考核人</span>
        </div>
      </div>
    ),
  },
  {
    id: "date",
    label: "考核日期",
    value: (item) => (
      <span className="text-muted-foreground text-xs">
        {item.date ? format(new Date(item.date), "yyyy-MM-dd") : "-"}
      </span>
    ),
  },
]

// 表格操作配置
export const tableActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => console.log("查看详情", item),
  },
  {
    id: "score",
    label: "开始评分",
    icon: <FileEdit className="h-4 w-4" />,
    onClick: (item) => console.log("开始评分", item),
    hidden: (item) => item.type !== "考核成员",
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => console.log("编辑", item),
  },
  {
    id: "download",
    label: "导出",
    icon: <Download className="h-4 w-4" />,
    onClick: (item) => console.log("导出", item),
  },
  {
    id: "print",
    label: "打印",
    icon: <Printer className="h-4 w-4" />,
    onClick: (item) => console.log("打印", item),
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 卡片操作配置
export const cardActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => console.log("查看详情", item),
  },
  {
    id: "score",
    label: "开始评分",
    icon: <FileEdit className="h-4 w-4" />,
    onClick: (item) => console.log("开始评分", item),
    hidden: (item) => item.type !== "考核成员",
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => console.log("编辑", item),
  },
  {
    id: "download",
    label: "导出",
    icon: <Download className="h-4 w-4" />,
    onClick: (item) => console.log("导出", item),
  },
]

// 批量操作配置
export const batchActions: BatchAction[] = [
  {
    id: "batchExport",
    label: "批量导出",
    icon: <Download className="h-4 w-4" />,
    onClick: () => console.log("批量导出"),
  },
  {
    id: "batchPrint",
    label: "批量打印",
    icon: <Printer className="h-4 w-4" />,
    onClick: () => console.log("批量打印"),
  },
  {
    id: "batchDelete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: () => console.log("批量删除"),
    variant: "destructive",
  },
]
