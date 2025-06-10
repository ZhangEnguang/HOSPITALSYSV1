import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Eye, FileEdit, Trash2, Clock, CheckCircle, XCircle, AlertTriangle, ClipboardCheck, Users, MoreVertical, MoreHorizontal, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

// 定义用户数据
export const users = [
  {
    id: "u1",
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "/avatars/01.png",
    department: "基础医学院",
    title: "教授",
  },
  {
    id: "u2",
    name: "李四",
    email: "lisi@example.com",
    avatar: "/avatars/02.png",
    department: "基因组学中心",
    title: "副教授",
  },
  {
    id: "u3",
    name: "王五",
    email: "wangwu@example.com",
    avatar: "/avatars/03.png",
    department: "临床医学院",
    title: "主任医师",
  },
  {
    id: "u4",
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: "/avatars/04.png",
    department: "生物信息学院",
    title: "研究员",
  },
  {
    id: "u5",
    name: "钱七",
    email: "qianqi@example.com",
    avatar: "/avatars/05.png",
    department: "公共卫生学院",
    title: "副研究员",
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
  "待审查": { color: "bg-blue-100 text-blue-700 border-blue-300" },
  "审查中": { color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  "通过": { color: "bg-green-100 text-green-700 border-green-300" },
  "驳回": { color: "bg-red-100 text-red-700 border-red-300" },
}

// 定义审查结果变体和颜色
export const reviewResultVariants: Record<string, StatusVariant> = {
  "审查通过": { color: "bg-green-100 text-green-700 border-green-300" },
  "必要的修改后同意": { color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  "不同意": { color: "bg-red-100 text-red-700 border-red-300" },
  "终止或暂停已同意的研究": { color: "bg-purple-100 text-purple-700 border-purple-300" },
}

// 为 DataList 组件提供的状态变体
export const dataListStatusVariants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
  "待审查": "secondary",
  "审查中": "outline",
  "通过": "default",
  "驳回": "destructive",
}

// 优先级变体和颜色
export const priorityVariants: Record<string, PriorityVariant> = {
  "高": { color: "text-red-600", icon: <AlertTriangle className="h-4 w-4" /> },
  "中": { color: "text-amber-600", icon: <Clock className="h-4 w-4" /> },
  "低": { color: "text-blue-600", icon: <CheckCircle className="h-4 w-4" /> },
}

// 状态名称映射函数
export const getStatusName = (status: string) => {
  switch (status) {
    case "pending":
      return "待审查"
    case "reviewing":
      return "审查中"
    case "approved":
      return "通过"
    case "rejected":
      return "驳回"
    default:
      return status
  }
}

// 表格列配置
export const tableColumns = [
  {
    id: "name",
    header: "项目名称",
    accessorKey: "name",
    className: "w-[255px]",
    cell: (item: any) => (
      <div className="space-y-1">
        <div className="font-medium text-gray-900 leading-5">{item.name}</div>
        <div className="text-sm text-gray-500 leading-4">
          {item.acceptanceNumber || item.id || "-"} · {item.projectSubType || "-"}
        </div>
      </div>
    ),
  },
  {
    id: "reviewType",
    header: "审查类型",
    accessorKey: "reviewType",
    className: "w-[115px]",
    cell: (item: any) => <div className="truncate">{item.reviewType || "-"}</div>,
  },
  {
    id: "projectLeader",
    header: "项目负责人",
    accessorKey: "projectLeader",
    className: "w-[130px]",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.projectLeader?.avatar} alt={item.projectLeader?.name} />
          <AvatarFallback>{item.projectLeader?.name?.charAt(0) || "-"}</AvatarFallback>
        </Avatar>
        <div className="truncate">{item.projectLeader?.name || "-"}</div>
      </div>
    ),
  },
  {
    id: "department",
    header: "所属科室",
    accessorKey: "department",
    className: "w-[130px]",
    cell: (item: any) => <div className="truncate">{item.department || "-"}</div>,
  },
  {
    id: "meetingDate",
    header: "会议日期",
    accessorKey: "meetingDate",
    className: "w-[120px]",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <div className="truncate">{item.meetingDate || "-"}</div>
      </div>
    ),
  },
  {
    id: "mainReviewer",
    header: "主审委员",
    accessorKey: "mainReviewer",
    className: "w-[130px]",
    cell: (item: any) => {
      const mainReviewers = Array.isArray(item.mainReviewers) ? item.mainReviewers : [item.mainReviewer].filter(Boolean);
      
      return (
        <div className="flex items-center gap-2 max-w-full overflow-hidden">
          {mainReviewers.length > 0 ? (
            <div className="flex items-center gap-1 truncate">
              {mainReviewers.slice(0, 2).map((reviewer: any, index: number) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="mx-1 text-gray-400">|</span>}
                  <div className="whitespace-nowrap">{reviewer?.name || "-"}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>未分配</div>
          )}
        </div>
      );
    },
  },
  {
    id: "reviewProgress",
    header: "审查进度",
    accessorKey: "reviewProgress",
    className: "w-[110px]",
    cell: (item: any) => {
      // 计算审查进度百分比
      const progress = item.reviewProgress || 0;
      
      return (
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-end items-center">
            <span className="text-xs text-gray-500">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "reviewResult",
    header: "审查结果",
    accessorKey: "reviewResult",
    className: "w-[120px] text-center",
    cell: (item: any) => {
      const result = item.reviewResult;
      const variant = result ? 
        (reviewResultVariants[result] || { color: "bg-gray-100 text-gray-700 border-gray-300" }) : 
        { color: "bg-gray-100 text-gray-700 border-gray-300" };
      
      return (
        <div className="flex justify-center">
          <div className="w-20">
            <Badge variant="outline" className={cn("px-2 py-0.5 border text-xs inline-block", variant.color)}>
              {result || "未出结果"}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "操作",
    className: "w-[60px] text-right pr-4",
    cell: (item: any) => {
      return (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/ethic-review/meeting-review/${item.id}`;
                }}
              >
                <Eye className="mr-2 h-4 w-4 text-blue-600" />
                <span>查看详情</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/ethic-review/meeting-review/${item.id}/assign`;
                }}
              >
                <Users className="mr-2 h-4 w-4 text-purple-600" />
                <span>分配主审委员</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/ethic-review/meeting-review/${item.id}/summary`;
                }}
              >
                <ClipboardCheck className="mr-2 h-4 w-4 text-green-600" />
                <span>意见汇总</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
]

// 卡片字段配置
export const cardFields = [
  {
    id: "projectSubType",
    label: "项目类型",
    value: (item: any) => item.projectSubType || "-",
  },
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
    id: "meetingDate",
    label: "会议日期",
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <div>{item.meetingDate || "-"}</div>
      </div>
    ),
  },
  {
    id: "mainReviewer",
    label: "主审委员",
    value: (item: any) => {
      const mainReviewers = Array.isArray(item.mainReviewers) ? item.mainReviewers : [item.mainReviewer].filter(Boolean);
      
      return (
        <div className="flex items-center gap-1">
          {mainReviewers.length > 0 ? (
            mainReviewers.slice(0, 2).map((reviewer: any, index: number) => (
              <span key={index} className="flex items-center">
                {index > 0 && <span className="mx-1 text-gray-400">|</span>}
                {reviewer?.name || "-"}
              </span>
            ))
          ) : (
            <div>未分配</div>
          )}
        </div>
      );
    },
  },
  {
    id: "reviewResult",
    label: "审查结果",
    value: (item: any) => item.reviewResult || "未出结果",
  },
]

// 卡片操作按钮
export const cardActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      window.location.href = `/ethic-review/meeting-review/${item.id}`
    },
  },
  {
    id: "assign",
    label: "分配主审委员",
    icon: <Users className="h-4 w-4" />,
    onClick: (item: any) => {
      window.location.href = `/ethic-review/meeting-review/${item.id}/assign`
    },
  },
  {
    id: "assignAdvisor",
    label: "指派独立顾问",
    icon: <Users className="h-4 w-4" />,
    onClick: (item: any) => {
      // 这个onClick会在主页面中被覆盖
      console.log("指派独立顾问", item)
    },
  },
  {
    id: "summary",
    label: "意见汇总",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item: any) => {
      window.location.href = `/ethic-review/meeting-review/${item.id}/summary`
    },
  },
]

// 排序选项
export const sortOptions = [
  {
    id: "meetingDate_desc",
    field: "meetingDate",
    direction: "desc" as const,
    label: "会议日期 (降序)"
  },
  {
    id: "meetingDate_asc",
    field: "meetingDate",
    direction: "asc" as const,
    label: "会议日期 (升序)"
  },
  {
    id: "createdAt_desc",
    field: "createdAt",
    direction: "desc" as const,
    label: "创建时间 (降序)"
  },
  {
    id: "createdAt_asc",
    field: "createdAt",
    direction: "asc" as const,
    label: "创建时间 (升序)"
  },
  {
    id: "name_asc",
    field: "name",
    direction: "asc" as const,
    label: "项目名称 (A-Z)"
  },
  {
    id: "name_desc",
    field: "name",
    direction: "desc" as const,
    label: "项目名称 (Z-A)"
  }
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "projectSubType",
    label: "项目类型",
    value: "全部类型",
    options: [
      { id: "all", label: "全部类型", value: "全部类型" },
      { id: "human", label: "人体", value: "人体" },
      { id: "animal", label: "动物", value: "动物" },
    ],
    category: "basic",
  },
  {
    id: "reviewType",
    label: "审查类型",
    value: "全部类型",
    options: [
      { id: "all", label: "全部类型", value: "全部类型" },
      { id: "initial", label: "初始审查", value: "初始审查" },
      { id: "amendment", label: "修正案审查", value: "修正案审查" },
      { id: "annual", label: "年度/定期审查", value: "年度/定期审查" },
      { id: "safety", label: "安全性审查", value: "安全性审查" },
      { id: "deviation", label: "偏离方案报告", value: "偏离方案报告" },
      { id: "suspension", label: "暂停/终止研究报告", value: "暂停/终止研究报告" },
      { id: "completion", label: "研究完成报告", value: "研究完成报告" },
      { id: "collection", label: "人遗采集审批", value: "人遗采集审批" },
      { id: "preservation", label: "人遗保藏审批", value: "人遗保藏审批" },
      { id: "international", label: "国际合作科学研究审批", value: "国际合作科学研究审批" },
      { id: "export", label: "材料出境审批", value: "材料出境审批" },
      { id: "clinical", label: "国际合作临床试验备案", value: "国际合作临床试验备案" },
      { id: "provision", label: "对外提供或开放使用备案", value: "对外提供或开放使用备案" },
      { id: "important", label: "重要遗传家系和特定地区人遗资源", value: "重要遗传家系和特定地区人遗资源" },
      { id: "review", label: "复审", value: "复审" },
    ],
    category: "basic",
  },
  {
    id: "status",
    label: "审核状态",
    value: "全部状态",
    options: [
      { id: "all", label: "全部状态", value: "全部状态" },
      { id: "pending", label: "待审查", value: "待审查" },
      { id: "reviewing", label: "审查中", value: "审查中" },
      { id: "approved", label: "通过", value: "通过" },
      { id: "rejected", label: "驳回", value: "驳回" },
    ],
    category: "basic",
  },
  {
    id: "reviewResult",
    label: "审查结果",
    value: "全部结果",
    options: [
      { id: "all", label: "全部结果", value: "全部结果" },
      { id: "approved", label: "审查通过", value: "审查通过" },
      { id: "modify", label: "必要的修改后同意", value: "必要的修改后同意" },
      { id: "reject", label: "不同意", value: "不同意" },
      { id: "terminate", label: "终止或暂停已同意的研究", value: "终止或暂停已同意的研究" },
    ],
    category: "basic",
  },
]

// 高级筛选分类和字段
export const filterCategories = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "name",
        label: "项目名称",
        type: "text" as const,
        placeholder: "请输入项目名称关键词",
      },
      {
        id: "projectId",
        label: "项目编号",
        type: "text" as const,
        placeholder: "请输入项目编号",
      },
      {
        id: "projectSubType",
        label: "项目类型",
        type: "select" as const,
        options: [
          { value: "", label: "全部" },
          { value: "人体", label: "人体" },
          { value: "动物", label: "动物" },
        ],
      },
      {
        id: "reviewType",
        label: "审查类型",
        type: "select" as const,
        options: [
          { value: "", label: "全部" },
          { value: "初始审查", label: "初始审查" },
          { value: "修正案审查", label: "修正案审查" },
          { value: "年度/定期审查", label: "年度/定期审查" },
          { value: "安全性审查", label: "安全性审查" },
          { value: "偏离方案报告", label: "偏离方案报告" },
          { value: "暂停/终止研究报告", label: "暂停/终止研究报告" },
          { value: "研究完成报告", label: "研究完成报告" },
          { value: "人遗采集审批", label: "人遗采集审批" },
          { value: "人遗保藏审批", label: "人遗保藏审批" },
          { value: "国际合作科学研究审批", label: "国际合作科学研究审批" },
          { value: "材料出境审批", label: "材料出境审批" },
          { value: "国际合作临床试验备案", label: "国际合作临床试验备案" },
          { value: "对外提供或开放使用备案", label: "对外提供或开放使用备案" },
          { value: "重要遗传家系和特定地区人遗资源", label: "重要遗传家系和特定地区人遗资源" },
          { value: "复审", label: "复审" },
        ],
      },
      {
        id: "projectType",
        label: "研究类型",
        type: "select" as const,
        options: [
          { value: "", label: "全部" },
          { value: "诊断性测序", label: "诊断性测序" },
          { value: "数据分析", label: "数据分析" },
          { value: "国际合作", label: "国际合作" },
          { value: "材料出库", label: "材料出库" },
        ],
      },
      {
        id: "meetingDate",
        label: "会议日期",
        type: "date" as const,
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
        options: [
          { value: "", label: "全部" },
          { value: "待审查", label: "待审查" },
          { value: "审查中", label: "审查中" },
          { value: "通过", label: "通过" },
          { value: "驳回", label: "驳回" },
        ],
      },
      {
        id: "reviewResult",
        label: "审查结果",
        type: "select" as const,
        options: [
          { value: "", label: "全部" },
          { value: "审查通过", label: "审查通过" },
          { value: "必要的修改后同意", label: "必要的修改后同意" },
          { value: "不同意", label: "不同意" },
          { value: "终止或暂停已同意的研究", label: "终止或暂停已同意的研究" },
        ],
      },
      {
        id: "submissionDate",
        label: "提交日期",
        type: "date" as const,
      },
    ],
  },
  {
    id: "personnel",
    title: "人员信息",
    fields: [
      {
        id: "projectLeader",
        label: "项目负责人",
        type: "text" as const,
        placeholder: "请输入负责人姓名",
      },
      {
        id: "department",
        label: "所属科室",
        type: "text" as const,
        placeholder: "请输入科室名称",
      },
      {
        id: "mainReviewer",
        label: "主审委员",
        type: "text" as const, 
        placeholder: "请输入主审委员姓名",
      },
    ],
  },
] 