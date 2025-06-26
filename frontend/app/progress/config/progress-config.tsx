import { Eye, Pencil, Trash2, MessageSquare, AlertCircle } from "lucide-react"
import type { FilterField } from "@/components/data-management/data-list-filters"
import type { TableColumn } from "@/components/data-management/data-list-table"
import type { CardField } from "@/components/data-management/data-list-card"
import type { SortOption } from "@/components/data-management/data-list-toolbar"
import type { BatchAction } from "@/components/data-management/data-list-batch-actions"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 状态颜色映射
export const statusColors: Record<string, string> = {
  未开始: "secondary",
  进行中: "warning",
  已完成: "success",
  已延期: "destructive",
  已取消: "destructive",
}

// 优先级颜色映射
export const priorityColors: Record<string, string> = {
  高: "destructive",
  中: "warning",
  低: "success",
}

// 用户数据
export const users = [
  {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("张三")}&background=random&color=fff&size=128`,
    role: "技术总监",
  },
  {
    id: 2,
    name: "李四",
    email: "lisi@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("李四")}&background=random&color=fff&size=128`,
    role: "产品经理",
  },
  {
    id: 3,
    name: "王五",
    email: "wangwu@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("王五")}&background=random&color=fff&size=128`,
    role: "UI设计师",
  },
  {
    id: 4,
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("赵六")}&background=random&color=fff&size=128`,
    role: "前端开发",
  },
  {
    id: 5,
    name: "孙七",
    email: "sunqi@example.com",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("孙七")}&background=random&color=fff&size=128`,
    role: "后端开发",
  },
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "progressType",
    label: "进度类型",
    value: "all",
    options: [
      { id: "projectChange", label: "项目变更", value: "projectChange" },
      { id: "contractRecognition", label: "合同认定", value: "contractRecognition" },
      { id: "projectInspection", label: "项目中检", value: "projectInspection" },
      { id: "projectCompletion", label: "项目结项", value: "projectCompletion" },
    ],
  },
  {
    id: "status",
    label: "状态",
    value: "all",
    options: [
      { id: "not_started", label: "未开始", value: "未开始" },
      { id: "in_progress", label: "进行中", value: "进行中" },
      { id: "completed", label: "已完成", value: "已完成" },
      { id: "delayed", label: "已延期", value: "已延期" },
      { id: "cancelled", label: "已取消", value: "已取消" },
    ],
  },
  {
    id: "priority",
    label: "优先级",
    value: "all",
    options: [
      { id: "high", label: "高", value: "高" },
      { id: "medium", label: "中", value: "中" },
      { id: "low", label: "低", value: "低" },
    ],
  },
]

// 高级筛选字段配置
export const advancedFilters: FilterField[] = [
  {
    id: "assignee",
    type: "select",
    label: "负责人",
    options: users.map((user) => ({
      id: user.id.toString(),
      label: user.name,
      value: user.id.toString(),
      avatar: user.avatar,
    })),
  },
  {
    id: "project",
    type: "select",
    label: "关联项目",
    options: [
      { id: "1", label: "智慧园区综合管理平台", value: "1" },
      { id: "2", label: "AI视觉监控系统", value: "2" },
      { id: "3", label: "智慧能源管理系统", value: "3" },
      { id: "4", label: "智能访客管理系统", value: "4" },
      { id: "5", label: "智慧停车管理平台", value: "5" },
    ],
  },
  {
    id: "dateRange",
    type: "date",
    label: "计划完成日期",
  },
  {
    id: "type",
    type: "select",
    label: "进度类型",
    options: [
      { id: "milestone", label: "里程碑", value: "里程碑" },
      { id: "task", label: "任务", value: "任务" },
      { id: "phase", label: "阶段", value: "阶段" },
    ],
  },
]

// 排序选项配置
export const sortOptions: SortOption[] = [
  { id: "name_asc", label: "名称 (A-Z)", field: "name", direction: "asc" },
  { id: "name_desc", label: "名称 (Z-A)", field: "name", direction: "desc" },
  { id: "dueDate_asc", label: "截止日期（近-远）", field: "dueDate", direction: "asc" },
  { id: "dueDate_desc", label: "截止日期（远-近）", field: "dueDate", direction: "desc" },
  { id: "completion_desc", label: "完成率（高-低）", field: "completion", direction: "desc" },
  { id: "completion_asc", label: "完成率（低-高）", field: "completion", direction: "asc" },
  { id: "priority_desc", label: "优先级（高-低）", field: "priority", direction: "desc" },
]

// 表格列配置
export const tableColumns: TableColumn[] = [
  {
    id: "name",
    header: "进度名称",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
      </div>
    ),
  },
  {
    id: "project",
    header: "关联项目",
    cell: (item) => <span>{item.project.name}</span>,
  },
  {
    id: "type",
    header: "类型",
    cell: (item) => <Badge variant="outline">{item.type}</Badge>,
  },
  {
    id: "progressType",
    header: "进度类别",
    cell: (item) => {
      const progressTypeMap = {
        projectChange: "项目变更",
        contractRecognition: "合同认定",
        projectInspection: "项目中检",
        projectCompletion: "项目结项",
      }
      return <Badge variant="secondary">{progressTypeMap[item.progressType as keyof typeof progressTypeMap]}</Badge>
    },
  },
  {
    id: "status",
    header: "状态",
    cell: (item) => <Badge variant={statusColors[item.status]}>{item.status}</Badge>,
  },
  {
    id: "assignee",
    header: "负责人",
    cell: (item) => (
      <div className="flex items-start gap-1">
        <div 
          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: '#9ca3af',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {item.assignee.name[0]}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-foreground font-medium truncate">{item.assignee.name}</span>
          <span className="text-xs text-muted-foreground">负责人</span>
        </div>
      </div>
    ),
  },
  {
    id: "completion",
    header: "完成率",
    cell: (item) => (
      <div className="w-[160px] space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">完成率</span>
          <span>{item.completion}%</span>
        </div>
        <Progress value={item.completion} className="h-2 [&>div]:progress-gradient" />
      </div>
    ),
  },
  {
    id: "dueDate",
    header: "计划完成日期",
    cell: (item) => format(new Date(item.dueDate), "yyyy/MM/dd"),
  },
  {
    id: "actualDate",
    header: "实际完成日期",
    cell: (item) => (item.actualDate ? format(new Date(item.actualDate), "yyyy/MM/dd") : "-"),
  },
]

// 添加特定进度类型的表格列配置

// 项目变更特定列
export const projectChangeColumns: TableColumn[] = [
  {
    id: "name",
    header: "变更名称",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
      </div>
    ),
  },
  {
    id: "project",
    header: "关联项目",
    cell: (item) => <span>{item.project.name}</span>,
  },
  {
    id: "changeType",
    header: "变更类型",
    cell: (item) => <Badge variant="outline">{item.changeType || "未指定"}</Badge>,
  },
  {
    id: "changeReason",
    header: "变更原因",
    cell: (item) => <span>{item.changeReason || "未指定"}</span>,
  },
  {
    id: "status",
    header: "状态",
    cell: (item) => <Badge variant={statusColors[item.status]}>{item.status}</Badge>,
  },
  {
    id: "approvalStatus",
    header: "审核状态", // 将"审批状态"改为"审核状态"
    cell: (item) => {
      const statusMap: Record<string, string> = {
        已通过: "success",
        待审核: "secondary",
        已退回: "destructive",
      }
      return (
        <Badge variant={statusMap[item.approvalStatus || "待审核"] || "secondary"}>
          {item.approvalStatus || "待审核"}
        </Badge>
      )
    },
  },
  {
    id: "assignee",
    header: "负责人",
    cell: (item) => (
      <div className="flex items-start gap-1">
        <div 
          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: '#9ca3af',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {item.assignee.name[0]}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-foreground font-medium truncate">{item.assignee.name}</span>
          <span className="text-xs text-muted-foreground">负责人</span>
        </div>
      </div>
    ),
  },
  {
    id: "dueDate",
    header: "计划完成日期",
    cell: (item) => format(new Date(item.dueDate), "yyyy/MM/dd"),
  },
  {
    id: "actualDate",
    header: "实际完成日期",
    cell: (item) => (item.actualDate ? format(new Date(item.actualDate), "yyyy/MM/dd") : "-"),
  },
]

// 合同认定特定列
export const contractRecognitionColumns: TableColumn[] = [
  {
    id: "name",
    header: "合同名称",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
      </div>
    ),
  },
  {
    id: "project",
    header: "关联项目",
    cell: (item) => <span>{item.project.name}</span>,
  },
  {
    id: "contractType",
    header: "合同类型",
    cell: (item) => <Badge variant="outline">{item.contractType || "未指定"}</Badge>,
  },
  {
    id: "contractAmount",
    header: "合同金额",
    cell: (item) => <span className="font-medium">{item.contractAmount || "-"}</span>,
  },
  {
    id: "contractParty",
    header: "合作方",
    cell: (item) => <span>{item.contractParty || "-"}</span>,
  },
  {
    id: "status",
    header: "状态",
    cell: (item) => <Badge variant={statusColors[item.status]}>{item.status}</Badge>,
  },
  {
    id: "recognitionStatus",
    header: "审核状态", // 将"认定状态"改为"审核状态"
    cell: (item) => {
      const statusMap: Record<string, string> = {
        已通过: "success",
        待审核: "secondary",
        已退回: "destructive",
      }
      return (
        <Badge variant={statusMap[item.recognitionStatus || "待审核"] || "secondary"}>
          {item.recognitionStatus || "待审核"}
        </Badge>
      )
    },
  },
  {
    id: "assignee",
    header: "负责人",
    cell: (item) => (
      <div className="flex items-start gap-1">
        <div 
          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: '#9ca3af',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {item.assignee.name[0]}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-foreground font-medium truncate">{item.assignee.name}</span>
          <span className="text-xs text-muted-foreground">负责人</span>
        </div>
      </div>
    ),
  },
  {
    id: "dueDate",
    header: "计划完成日期",
    cell: (item) => format(new Date(item.dueDate), "yyyy/MM/dd"),
  },
]

// 项目中检特定列
export const projectInspectionColumns: TableColumn[] = [
  {
    id: "name",
    header: "中检名称",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
      </div>
    ),
  },
  {
    id: "project",
    header: "关联项目",
    cell: (item) => <span>{item.project.name}</span>,
  },
  {
    id: "inspectionType",
    header: "检查类型",
    cell: (item) => <Badge variant="outline">{item.inspectionType || "未指定"}</Badge>,
  },
  {
    id: "inspectionResult",
    header: "检查结果",
    cell: (item) => {
      const resultMap: Record<string, string> = {
        符合预期: "success",
        基本合规: "warning",
        不合规: "destructive",
        待评估: "secondary",
        部分达标: "warning",
        符合要求: "success",
      }
      return (
        <Badge variant={resultMap[item.inspectionResult || "待评估"] || "secondary"}>
          {item.inspectionResult || "待评估"}
        </Badge>
      )
    },
  },
  {
    id: "status",
    header: "状态",
    cell: (item) => <Badge variant={statusColors[item.status]}>{item.status}</Badge>,
  },
  {
    id: "auditStatus",
    header: "审核状态",
    cell: (item) => {
      const statusMap: Record<string, string> = {
        已通过: "success",
        待审核: "secondary",
        已退回: "destructive",
      }
      return (
        <Badge variant={statusMap[item.auditStatus || "待审核"] || "secondary"}>{item.auditStatus || "待审核"}</Badge>
      )
    },
  },
  {
    id: "assignee",
    header: "负责人",
    cell: (item) => (
      <div className="flex items-start gap-1">
        <div 
          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: '#9ca3af',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {item.assignee.name[0]}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-foreground font-medium truncate">{item.assignee.name}</span>
          <span className="text-xs text-muted-foreground">负责人</span>
        </div>
      </div>
    ),
  },
  {
    id: "inspectionFeedback",
    header: "检查反馈",
    cell: (item) => <span className="text-sm">{item.inspectionFeedback || "-"}</span>,
  },
  {
    id: "dueDate",
    header: "计划完成日期",
    cell: (item) => format(new Date(item.dueDate), "yyyy/MM/dd"),
  },
  {
    id: "actualDate",
    header: "实际完成日期",
    cell: (item) => (item.actualDate ? format(new Date(item.actualDate), "yyyy/MM/dd") : "-"),
  },
]

// 项目结项特定列
export const projectCompletionColumns: TableColumn[] = [
  {
    id: "name",
    header: "结项名称",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
      </div>
    ),
  },
  {
    id: "project",
    header: "关联项目",
    cell: (item) => <span>{item.project.name}</span>,
  },
  {
    id: "completionType",
    header: "结项类型",
    cell: (item) => <Badge variant="outline">{item.completionType || "未指定"}</Badge>,
  },
  {
    id: "evaluationResult",
    header: "评价结果",
    cell: (item) => {
      const resultMap: Record<string, string> = {
        优秀: "success",
        良好: "warning",
        合格: "secondary",
        不合格: "destructive",
        待评定: "secondary",
      }
      return (
        <Badge variant={resultMap[item.evaluationResult || "待评定"] || "secondary"}>
          {item.evaluationResult || "待评定"}
        </Badge>
      )
    },
  },
  {
    id: "status",
    header: "状态",
    cell: (item) => <Badge variant={statusColors[item.status]}>{item.status}</Badge>,
  },
  {
    id: "auditStatus",
    header: "审核状态",
    cell: (item) => {
      const statusMap: Record<string, string> = {
        已通过: "success",
        待审核: "secondary",
        已退回: "destructive",
      }
      return (
        <Badge variant={statusMap[item.auditStatus || "待审核"] || "secondary"}>{item.auditStatus || "待审核"}</Badge>
      )
    },
  },
  {
    id: "assignee",
    header: "负责人",
    cell: (item) => (
      <div className="flex items-start gap-1">
        <div 
          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: '#9ca3af',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {item.assignee.name[0]}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-foreground font-medium truncate">{item.assignee.name}</span>
          <span className="text-xs text-muted-foreground">负责人</span>
        </div>
      </div>
    ),
  },
  {
    id: "achievementSummary",
    header: "成果概述",
    cell: (item) => <span className="text-sm">{item.achievementSummary || "-"}</span>,
  },
  {
    id: "dueDate",
    header: "计划完成日期",
    cell: (item) => format(new Date(item.dueDate), "yyyy/MM/dd"),
  },
  {
    id: "actualDate",
    header: "实际完成日期",
    cell: (item) => (item.actualDate ? format(new Date(item.actualDate), "yyyy/MM/dd") : "-"),
  },
]

// 卡片字段配置
export const cardFields: CardField[] = [
  {
    id: "progressType",
    label: "进度类别",
    value: (item) => {
      const progressTypeMap = {
        projectChange: "项目变更",
        contractRecognition: "合同认定",
        projectInspection: "项目中检",
        projectCompletion: "项目结项",
      }
      return (
        <Badge variant="secondary" className="mt-1">
          {progressTypeMap[item.progressType as keyof typeof progressTypeMap]}
        </Badge>
      )
    },
  },
  {
    id: "project",
    label: "关联项目",
    value: (item) => <span className="text-muted-foreground text-xs">{item.project.name}</span>,
  },
  {
    id: "assignee",
    label: "",
    value: (item) => (
      <div className="flex items-start gap-1">
        <div 
          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: '#9ca3af',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {item.assignee.name[0]}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-foreground font-medium truncate">{item.assignee.name}</span>
          <span className="text-xs text-muted-foreground">负责人</span>
        </div>
      </div>
    ),
  },
  {
    id: "dates",
    label: "计划完成日期",
    value: (item) => (
      <span className="text-muted-foreground text-xs">{format(new Date(item.dueDate), "yyyy/MM/dd")}</span>
    ),
  },
]

// 为每种进度类型添加特定的卡片字段配置

// 项目变更特定卡片字段
export const projectChangeCardFields: CardField[] = [
  {
    id: "assignee",
    label: "",
    value: (item: any) => (
      <div className="flex items-start gap-1">
        <div 
          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: '#9ca3af',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {item.assignee.name[0]}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-foreground font-medium truncate">{item.assignee.name}</span>
          <span className="text-xs text-muted-foreground">负责人</span>
        </div>
      </div>
    ),
    className: "col-span-1",
  },
  {
    id: "changeType",
    label: "变更类别",
    value: (item: any) => (
      <Badge variant="secondary" className="text-sm px-1 py-0 h-5 text-center truncate">
        {item.changeType || "内容变更"}
      </Badge>
    ),
    className: "col-span-1",
  },
  {
    id: "plannedDate",
    label: "计划完成",
    value: (item: any) => (
      <span className="text-sm text-muted-foreground truncate">
        {format(new Date(item.dueDate), "yyyy/MM/dd")}
      </span>
    ),
    className: "col-span-1",
  },
  {
    id: "actualDate",
    label: "实际完成",
    value: (item: any) => (
      <span className="text-sm text-muted-foreground truncate">
        {item.actualDate ? format(new Date(item.actualDate), "yyyy/MM/dd") : "未完成"}
      </span>
    ),
    className: "col-span-1",
  },
]

// 合同认定特定卡片字段
export const contractRecognitionCardFields: CardField[] = [
  {
    id: "assignee",
    label: "",
    value: (item: any) => (
      <div className="flex items-start gap-1">
        <div 
          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: '#9ca3af',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {item.assignee.name[0]}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-foreground font-medium truncate">{item.assignee.name}</span>
          <span className="text-xs text-muted-foreground">负责人</span>
        </div>
      </div>
    ),
    className: "col-span-1",
  },
  {
    id: "changeType",
    label: "合同类型",
    value: (item: any) => (
      <Badge variant="secondary" className="text-sm px-1 py-0 h-5 text-center truncate">
        {item.changeType || "合同认定"}
      </Badge>
    ),
    className: "col-span-1",
  },
  {
    id: "plannedDate",
    label: "计划完成",
    value: (item: any) => (
      <span className="text-sm text-muted-foreground truncate">
        {format(new Date(item.dueDate), "yyyy/MM/dd")}
      </span>
    ),
    className: "col-span-1",
  },
  {
    id: "actualDate",
    label: "实际完成",
    value: (item: any) => (
      <span className="text-sm text-muted-foreground truncate">
        {item.actualDate ? format(new Date(item.actualDate), "yyyy/MM/dd") : "未完成"}
      </span>
    ),
    className: "col-span-1",
  },
]

// 项目中检特定卡片字段
export const projectInspectionCardFields: CardField[] = [
  {
    id: "assignee",
    label: "",
    value: (item: any) => (
      <div className="flex items-start gap-1">
        <div 
          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: '#9ca3af',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {item.assignee.name[0]}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-foreground font-medium truncate">{item.assignee.name}</span>
          <span className="text-xs text-muted-foreground">负责人</span>
        </div>
      </div>
    ),
    className: "col-span-1",
  },
  {
    id: "changeType",
    label: "检查类型",
    value: (item: any) => (
      <Badge variant="secondary" className="text-sm px-1 py-0 h-5 text-center truncate">
        {item.changeType || "项目中检"}
      </Badge>
    ),
    className: "col-span-1",
  },
  {
    id: "plannedDate",
    label: "计划完成",
    value: (item: any) => (
      <span className="text-sm text-muted-foreground truncate">
        {format(new Date(item.dueDate), "yyyy/MM/dd")}
      </span>
    ),
    className: "col-span-1",
  },
  {
    id: "actualDate",
    label: "实际完成",
    value: (item: any) => (
      <span className="text-sm text-muted-foreground truncate">
        {item.actualDate ? format(new Date(item.actualDate), "yyyy/MM/dd") : "未完成"}
      </span>
    ),
    className: "col-span-1",
  },
]

// 项目结项特定卡片字段
export const projectCompletionCardFields: CardField[] = [
  {
    id: "assignee",
    label: "",
    value: (item: any) => (
      <div className="flex items-start gap-1">
        <div 
          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: '#9ca3af',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {item.assignee.name[0]}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-foreground font-medium truncate">{item.assignee.name}</span>
          <span className="text-xs text-muted-foreground">负责人</span>
        </div>
      </div>
    ),
    className: "col-span-1",
  },
  {
    id: "changeType",
    label: "结题类型",
    value: (item: any) => (
      <Badge variant="secondary" className="text-sm px-1 py-0 h-5 text-center truncate">
        {item.changeType || "项目结项"}
      </Badge>
    ),
    className: "col-span-1",
  },
  {
    id: "plannedDate",
    label: "计划完成",
    value: (item: any) => (
      <span className="text-sm text-muted-foreground truncate">
        {format(new Date(item.dueDate), "yyyy/MM/dd")}
      </span>
    ),
    className: "col-span-1",
  },
  {
    id: "actualDate",
    label: "实际完成",
    value: (item: any) => (
      <span className="text-sm text-muted-foreground truncate">
        {item.actualDate ? format(new Date(item.actualDate), "yyyy/MM/dd") : "未完成"}
      </span>
    ),
    className: "col-span-1",
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
    id: "edit",
    label: "更新进度",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => console.log("更新进度", item),
    disabled: (item) => item.status === "已完成" || item.status === "已取消",
  },
  {
    id: "comment",
    label: "添加评论",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item) => console.log("添加评论", item),
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
    id: "edit",
    label: "更新进度",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => console.log("更新进度", item),
    disabled: (item) => item.status === "已完成" || item.status === "已取消",
  },
  {
    id: "comment",
    label: "添加评论",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item) => console.log("添加评论", item),
  },
]

// 批量操作配置
export const batchActions: BatchAction[] = [
  {
    id: "markComplete",
    label: "标记为已完成",
    icon: <Eye className="h-4 w-4" />,
    onClick: () => console.log("批量标记为已完成"),
  },
  {
    id: "markDelayed",
    label: "标记为已延期",
    icon: <AlertCircle className="h-4 w-4" />,
    onClick: () => console.log("批量标记为已延期"),
    variant: "warning",
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: () => console.log("批量删除"),
    variant: "destructive",
  },
]

// 添加特定进度类型的操作配置

// 项目变更特定操作
export const projectChangeActions = [
  {
    id: "view",
    label: "查看变更",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => {
      // 使用路由跳转到项目变更详情页
      const url = `/progress/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑变更",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/edit/projectChange?id=${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "approve",
    label: "审核变更",
    icon: <Check className="h-4 w-4" />,
    onClick: (item) => console.log("审批变更", item),
    disabled: (item) => item.approvalStatus !== "待审核",
    hidden: (item) => item.approvalStatus !== "待审核",
  },
  {
    id: "review",
    label: "审核变更",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/review/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "delete",
    label: "删除变更",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 合同认定特定操作
export const contractRecognitionActions = [
  {
    id: "view",
    label: "查看认定",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/contract/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑认定",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/edit/contractRecognition?id=${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "recognize",
    label: "审核认定",
    icon: <Check className="h-4 w-4" />,
    onClick: (item) => console.log("认定合同", item),
    disabled: (item) => item.recognitionStatus !== "待审核",
    hidden: (item) => item.recognitionStatus !== "待审核",
  },
  {
    id: "review",
    label: "审核认定",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/contract/review/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "delete",
    label: "删除认定",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 项目中检特定操作
export const projectInspectionActions = [
  {
    id: "view",
    label: "查看中检",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/inspection/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑中检",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/edit/projectInspection?id=${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "report",
    label: "审核中检",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/inspection/review/${item.id}`;
      window.open(url, "_self");
    },
    disabled: (item) => false,
  },
  {
    id: "delete",
    label: "删除中检",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 项目结项特定操作
export const projectCompletionActions = [
  {
    id: "view",
    label: "查看结项",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/completion/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑结项",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/edit/projectCompletion?id=${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "evaluate",
    label: "评价结果",
    icon: <Check className="h-4 w-4" />,
    onClick: (item) => console.log("评价结项结果", item),
    disabled: (item) => item.evaluationResult !== "待评定" || item.completion < 100,
    hidden: (item) => item.evaluationResult !== "待评定" || item.completion < 100,
  },
  {
    id: "report",
    label: "审核结项",
    icon: <MessageSquare className="h-4 w-4" />,
    onClick: (item) => {
      const url = `/progress/completion/review/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "delete",
    label: "删除结项",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (item) => console.log("删除", item),
    variant: "destructive",
  },
]

// 导入缺少的图标
import { FileText, Download, Archive, Check } from "lucide-react"
