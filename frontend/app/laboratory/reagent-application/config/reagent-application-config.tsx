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
  Package,
  FileText,
  AlertTriangle,
  CheckCircle,
  ClipboardCheck,
  MoreVertical,
} from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import React from "react"

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

// 状态颜色映射 - 更新为CSS类名形式，与系统其他模块保持一致
export const statusColors: Record<string, string> = {
  "待审核": "bg-amber-50 text-amber-700 border-amber-200",
  "审核通过": "bg-green-50 text-green-700 border-green-200", 
  "审核退回": "bg-red-50 text-red-700 border-red-200",
  "已取消": "bg-gray-50 text-gray-700 border-gray-200",
}

// 快速筛选配置
export const quickFilters = [
  {
    id: "status",
    label: "申领状态",
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
    id: "reagentType",
    label: "试剂类型",
    value: "",
    options: [
      { id: "1", label: "有机试剂", value: "有机试剂" },
      { id: "2", label: "无机试剂", value: "无机试剂" },
      { id: "3", label: "生物试剂", value: "生物试剂" },
      { id: "4", label: "标准溶液", value: "标准溶液" },
      { id: "5", label: "缓冲溶液", value: "缓冲溶液" },
      { id: "6", label: "指示剂", value: "指示剂" },
      { id: "7", label: "特殊试剂", value: "特殊试剂" },
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
      { id: "5", label: "分析实验室", value: "分析实验室" },
      { id: "6", label: "药学实验室", value: "药学实验室" },
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
        id: "applicationTitle",
        label: "申领标题",
        type: "text",
        placeholder: "请输入申领标题关键词",
      },
      {
        id: "reagentName",
        label: "试剂名称",
        type: "text",
        placeholder: "请输入试剂名称",
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
    id: "quantity",
    title: "申领信息",
    fields: [
      {
        id: "quantityRange",
        label: "申领数量范围",
        type: "number-range",
        placeholder: "请输入数量范围",
      },
      {
        id: "urgency",
        label: "紧急程度",
        type: "select",
        options: [
          { value: "一般", label: "一般" },
          { value: "紧急", label: "紧急" },
          { value: "非常紧急", label: "非常紧急" },
        ],
      },
      {
        id: "specification",
        label: "规格要求",
        type: "text",
        placeholder: "请输入规格要求",
      },
    ],
  },
  {
    id: "time",
    title: "时间信息",
    fields: [
      {
        id: "applicationDateRange",
        label: "申请日期范围",
        type: "date-range",
      },
      {
        id: "expectedDate",
        label: "期望使用日期",
        type: "date",
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
    id: "expectedDate_desc",
    label: "期望日期 (最近优先)",
    field: "expectedDate",
    direction: "desc" as const,
  },
  {
    id: "expectedDate_asc",
    label: "期望日期 (最早优先)",
    field: "expectedDate",
    direction: "asc" as const,
  },
  {
    id: "reagentName_asc",
    label: "试剂名称 (A-Z)",
    field: "reagentName",
    direction: "asc" as const,
  },
  {
    id: "reagentName_desc",
    label: "试剂名称 (Z-A)",
    field: "reagentName",
    direction: "desc" as const,
  },
  {
    id: "quantity_desc",
    label: "申领数量 (从多到少)",
    field: "quantity",
    direction: "desc" as const,
  },
  {
    id: "quantity_asc",
    label: "申领数量 (从少到多)",
    field: "quantity",
    direction: "asc" as const,
  },
]

// 试剂申领列配置
export const reagentApplicationColumns = [
  {
    id: "applicationTitle",
    header: "申领标题",
    accessorKey: "applicationTitle",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.applicationTitle}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.purpose}</span>
      </div>
    ),
  },
  {
    id: "reagentName",
    header: "申领试剂",
    accessorKey: "reagentName",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.reagentName}</span>
        <span className="text-sm text-muted-foreground">{item.reagentType}</span>
      </div>
    ),
  },
  {
    id: "quantity",
    header: "申领数量",
    accessorKey: "quantity",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.quantity} {item.unit}</span>
        {item.specification && (
          <span className="text-sm text-muted-foreground">{item.specification}</span>
        )}
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
    id: "urgency",
    header: "紧急程度",
    accessorKey: "urgency",
    cell: (item: any) => {
      const urgencyColors: Record<string, ExtendedBadgeVariant> = {
        "一般": "outline",
        "紧急": "warning",
        "非常紧急": "destructive",
      }
      return <Badge variant={(urgencyColors[item.urgency] || "outline") as any}>{item.urgency}</Badge>
    },
  },
  {
    id: "expectedDate",
    header: "期望日期",
    accessorKey: "expectedDate",
    cell: (item: any) => <span>{format(new Date(item.expectedDate), "yyyy/MM/dd")}</span>,
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
    cell: (item: any) => <Badge className={statusColors[item.status] || "bg-slate-50 text-slate-700 border-slate-200"}>{item.status}</Badge>,
  },
]

// 卡片视图字段配置
export const reagentApplicationCardFields = [
  { 
    id: "reagentInfo", 
    label: "申领试剂", 
    value: (item: any) => `${item.reagentName} (${item.reagentType})`
  },
  { 
    id: "quantityInfo", 
    label: "申领信息", 
    value: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.quantity} {item.unit}</span>
        <span className="text-sm text-muted-foreground">
          期望：{format(new Date(item.expectedDate), "MM/dd")} ({item.urgency})
        </span>
      </div>
    )
  },
  { 
    id: "applicant", 
    label: "申请人", 
    value: (item: any) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{item.applicant.name}</span>
        <div className="w-px h-3 bg-gray-300"></div>
        <span className="text-sm text-muted-foreground">{item.department}</span>
      </div>
    )
  },
  { 
    id: "applicationDate", 
    label: "申请时间", 
    value: (item: any) => format(new Date(item.applicationDate), "MM/dd HH:mm")
  }
]

// 试剂申领操作配置
export const reagentApplicationActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/reagent-application/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑申领",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/reagent-application/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "approve",
    label: "审核申领",
    icon: <ClipboardCheck className="h-4 w-4" />,
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
    label: "批量退回",
    icon: <X className="h-4 w-4" />,
  },
  {
    id: "distribute",
    label: "批量发放",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 试剂申领卡片组件
const ReagentApplicationCard = ({ 
  item, 
  actions, 
  isSelected, 
  onToggleSelect 
}: {
  item: any;
  actions: any[];
  isSelected: boolean;
  onToggleSelect: (selected: boolean) => void;
}) => {
  const title = item.applicationTitle
  const description = item.purpose
  const status = item.status

  // 确保值是可渲染的内容
  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return "-";
    if (typeof value === 'object' && value !== null) {
      // 如果是对象且有name属性，返回name
      if ('name' in value) return value.name;
      // 如果是对象且有label属性，返回label
      if ('label' in value) return value.label;
      // 如果是React元素，直接返回
      if (React.isValidElement(value)) return value;
      // 其他情况返回JSON字符串
      return JSON.stringify(value);
    }
    return value;
  };

  const getStatusVariant = (status: string) => {
    const variant = statusColors[status];
    // 如果variant是内置的Badge variant类型，直接返回
    if (variant && ["default", "destructive", "outline", "secondary"].includes(variant)) {
      return variant as "default" | "destructive" | "outline" | "secondary";
    }
    // 否则返回outline作为默认值，并在Badge上应用自定义类
    return "outline";
  }

  const getStatusCustomClass = (status: string) => {
    const variant = statusColors[status];
    // 如果variant不是内置的Badge variant类型，则作为自定义CSS类返回
    if (variant && !["default", "destructive", "outline", "secondary"].includes(variant)) {
      return variant;
    }
    return "";
  }

  return (
    <Card
      className={cn(
        "group transition-all duration-300 border border-[#E9ECF2] shadow-none hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)] hover:border-primary/20",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base transition-colors duration-300 group-hover:text-primary truncate flex-1">{renderValue(title)}</h3>
              {status && (
                <Badge 
                  variant={getStatusVariant(status)} 
                  className={cn("", getStatusCustomClass(status))}
                >
                  {renderValue(status)}
                </Badge>
              )}
            </div>
            {description && <p className="text-sm text-muted-foreground truncate mt-1">{renderValue(description)}</p>}
          </div>
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {actions
                  .filter((action) => !action.hidden || !action.hidden(item))
                  .map((action, index) => (
                    <React.Fragment key={action.id}>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          action.onClick(item, e)
                        }}
                        disabled={action.disabled ? action.disabled(item) : false}
                        className={action.variant === "destructive" ? "text-destructive" : ""}
                      >
                        {action.icon && <span className="mr-2">{action.icon}</span>}
                        {action.label}
                      </DropdownMenuItem>
                      {index < actions.length - 1 && action.variant === "destructive" && (
                        <DropdownMenuSeparator />
                      )}
                    </React.Fragment>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid gap-2 mt-2">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {/* 申领试剂字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">申领试剂</span>
              <div className="truncate">
                {`${item.reagentName} (${item.reagentType})`}
              </div>
            </div>
            
            {/* 申请人字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">申请人</span>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.applicant.name}</span>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <span className="text-sm text-muted-foreground">{item.department}</span>
                </div>
              </div>
            </div>
            
            {/* 申领信息字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">申领信息</span>
              <div className="truncate">
                <span className="font-medium">{item.quantity} {item.unit}</span>
              </div>
            </div>
            
            {/* 申请时间字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">申请时间</span>
              <div className="truncate">
                {format(new Date(item.applicationDate), "yyyy/MM/dd HH:mm")}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 试剂申领自定义卡片渲染器
export const reagentApplicationCustomCardRenderer = (
  item: any, 
  actions: any[], 
  isSelected: boolean, 
  onToggleSelect: (selected: boolean) => void,
  onRowActionClick?: (action: any, item: any) => void
) => {
  // 处理操作按钮点击事件，优先使用onRowActionClick
  const processedActions = actions.map(action => ({
    ...action,
    onClick: (item: any, e: React.MouseEvent) => {
      if (onRowActionClick) {
        onRowActionClick(action, item);
      } else if (action.onClick) {
        action.onClick(item, e);
      }
    }
  }));

  return (
    <ReagentApplicationCard 
      item={item}
      actions={processedActions}
      isSelected={isSelected}
      onToggleSelect={onToggleSelect}
    />
  );
};