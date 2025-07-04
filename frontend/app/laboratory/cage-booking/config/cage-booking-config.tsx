import React from "react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Eye,
  Pencil,
  Trash2,
  Check,
  Wrench,
  Clock,
  Info,
  CheckCircle,
  MessageSquare,
  FileText,
  Calendar,
  MoreVertical,
  ClipboardCheck,
  X,
  Home,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { 
  SELECTION_VARIANTS, 
  DECORATION_VARIANTS,
  DEFAULT_CARD_SELECTION_CONFIG,
  type CardSelectionConfig
} from "@/components/ui/card-selection-variants"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 卡片勾选方案配置 - 与仪器预约模块保持一致的优雅款样式
export const CARD_SELECTION_CONFIG: CardSelectionConfig = DEFAULT_CARD_SELECTION_CONFIG

// 用户数据
export const users = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@lab.edu.cn",
    avatar: "/avatars/01.png",
    role: "研究员",
    phone: "18012345678"
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@lab.edu.cn",
    avatar: "/avatars/02.png",
    role: "实验室管理员",
    phone: "18012345679"
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@lab.edu.cn",
    avatar: "/avatars/03.png",
    role: "高级研究员",
    phone: "18012345680"
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@lab.edu.cn",
    avatar: "/avatars/04.png",
    role: "博士后",
    phone: "18012345681"
  },
  {
    id: "5",
    name: "孙七",
    email: "sunqi@lab.edu.cn",
    avatar: "/avatars/05.png",
    role: "研究生",
    phone: "18012345682"
  }
]

// 状态颜色配置 - 与仪器预约模块保持一致的CSS类名形式
export const statusColors: Record<string, string> = {
  "待审核": "bg-amber-50 text-amber-700 border-amber-200",
  "审核通过": "bg-green-50 text-green-700 border-green-200", 
  "审核退回": "bg-red-50 text-red-700 border-red-200",
  "已取消": "bg-gray-50 text-gray-700 border-gray-200",
  "使用中": "bg-blue-50 text-blue-700 border-blue-200",
  "已完成": "bg-green-50 text-green-700 border-green-200"
}

// 排序选项
export const sortOptions = [
  { id: "applicationDate_desc", field: "applicationDate", direction: "desc" as const, label: "申请时间 (最新)" },
  { id: "applicationDate_asc", field: "applicationDate", direction: "asc" as const, label: "申请时间 (最早)" },
  { id: "startTime_desc", field: "startTime", direction: "desc" as const, label: "预约时间 (最新)" },
  { id: "startTime_asc", field: "startTime", direction: "asc" as const, label: "预约时间 (最早)" },
  { id: "bookingTitle_asc", field: "bookingTitle", direction: "asc" as const, label: "预约标题 (A-Z)" },
  { id: "bookingTitle_desc", field: "bookingTitle", direction: "desc" as const, label: "预约标题 (Z-A)" },
]

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
      { id: "5", label: "使用中", value: "使用中" },
      { id: "6", label: "已完成", value: "已完成" },
    ],
    category: "default",
  },
  {
    id: "cageType",
    label: "笼位类型",
    value: "",
    options: [
      { id: "1", label: "小鼠笼", value: "小鼠笼" },
      { id: "2", label: "大鼠笼", value: "大鼠笼" },
      { id: "3", label: "兔笼", value: "兔笼" },
      { id: "4", label: "豚鼠笼", value: "豚鼠笼" },
      { id: "5", label: "特殊笼位", value: "特殊笼位" },
    ],
    category: "default",
  },
  {
    id: "department",
    label: "所属部门",
    value: "",
    options: [
      { id: "1", label: "药理实验室", value: "药理实验室" },
      { id: "2", label: "病理实验室", value: "病理实验室" },
      { id: "3", label: "生理实验室", value: "生理实验室" },
      { id: "4", label: "免疫实验室", value: "免疫实验室" },
      { id: "5", label: "遗传实验室", value: "遗传实验室" },
      { id: "6", label: "行为实验室", value: "行为实验室" },
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
        id: "cageLocation",
        label: "笼位位置",
        type: "text",
        placeholder: "请输入笼位位置",
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
          { value: "1周以内", label: "1周以内" },
          { value: "1-4周", label: "1-4周" },
          { value: "1-3个月", label: "1-3个月" },
          { value: "3个月以上", label: "3个月以上" },
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

// 批量操作配置
export const batchActions = [
  {
    id: "approve",
    label: "批量审核",
    icon: "Check",
  },
  {
    id: "reject",
    label: "批量退回",
    icon: "X",
  },
  {
    id: "delete",
    label: "批量删除",
    icon: "Trash",
    variant: "destructive",
  },
]

// 笼位预约列配置
export const cageBookingColumns = [
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
    id: "cageLocation",
    header: "笼位位置",
    accessorKey: "cageLocation",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.cageLocation}</span>
        <span className="text-sm text-muted-foreground">{item.cageType}</span>
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
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (item: any) => (
      <Badge variant={(statusColors[item.status] || "secondary") as any}>
        {item.status}
      </Badge>
    ),
  },
  {
    id: "applicationDate",
    header: "申请时间",
    accessorKey: "applicationDate",
    cell: (item: any) => format(new Date(item.applicationDate), "MM/dd HH:mm"),
  },
]

// 卡片视图字段配置
export const cageBookingCardFields = [
  { 
    id: "cageInfo", 
    label: "笼位信息", 
    value: (item: any) => `${item.cageLocation} (${item.cageType})`
  },
  { 
    id: "bookingTime", 
    label: "预约时间", 
    value: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{format(new Date(item.startTime), "yyyy年MM月dd日")}</span>
        <span className="text-sm text-muted-foreground">
          {format(new Date(item.startTime), "HH:mm")} - {format(new Date(item.endTime), "HH:mm")} ({item.duration})
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

// 笼位预约操作配置
export const cageBookingActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/cage-booking/view/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑预约",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/cage-booking/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "approve",
    label: "审核预约",
    icon: <ClipboardCheck className="h-4 w-4" />,
    // 不设置onClick，将在主页面中通过handleRowAction处理
  },
  {
    id: "delete",
    label: "删除预约",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 笼位预约卡片组件
const CageBookingCard = ({ 
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
  const [isHovered, setIsHovered] = useState(false)
  const title = item.bookingTitle
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

  // 获取当前使用的勾选组件
  const SelectionComponent = SELECTION_VARIANTS[CARD_SELECTION_CONFIG.currentVariant]
  
  // 获取当前使用的装饰组件
  const decorationComponents = CARD_SELECTION_CONFIG.currentDecorations.map(
    key => DECORATION_VARIANTS[key]
  )

  return (
    <Card
      className={cn(
        "group relative transition-all duration-300 border cursor-pointer",
        "border-[#E9ECF2] shadow-none hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)]",
        isSelected 
          ? "border-primary/50 shadow-[0_0_0_2px_rgba(59,130,246,0.1)]" 
          : "hover:border-primary/20",
        "overflow-hidden"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 动态勾选组件 */}
      <SelectionComponent 
        isHovered={isHovered}
        isSelected={isSelected}
        onToggleSelect={() => onToggleSelect(!isSelected)}
      />

      {/* 选中状态的装饰性元素 */}
      {isSelected && (
        <>
          {decorationComponents.map((DecorationComponent, index) => (
            <DecorationComponent key={index} />
          ))}
        </>
      )}

      <CardHeader className="p-5 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-semibold text-base truncate flex-1 transition-colors duration-300",
                isSelected ? "text-primary" : "group-hover:text-primary"
              )}>
                {renderValue(title)}
              </h3>
              {status && (
                <Badge 
                  variant={getStatusVariant(status)} 
                  className={cn("", getStatusCustomClass(status))}
                >
                  {renderValue(status)}
                </Badge>
              )}
            </div>
            {description && (
              <p className={cn(
                "text-sm truncate mt-1 transition-colors duration-300",
                isSelected ? "text-primary/70" : "text-muted-foreground"
              )}>
                {renderValue(description)}
              </p>
            )}
          </div>
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 -mr-2 transition-colors duration-200",
                    isSelected ? "hover:bg-primary/10" : ""
                  )} 
                  onClick={(e) => e.stopPropagation()}
                >
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
      
      <CardContent className="p-5 pt-0">
        <div className="grid gap-2 mt-2">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {/* 笼位信息字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">笼位信息</span>
              <div className="truncate">
                {`${item.cageLocation} (${item.cageType})`}
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
            
            {/* 预约日期字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约日期</span>
              <div className="truncate">
                {format(new Date(item.startTime), "yyyy/MM/dd")}
              </div>
            </div>
            
            {/* 使用时长字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">使用时长</span>
              <div className="truncate">
                {item.duration}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 笼位预约自定义卡片渲染器
export const cageBookingCustomCardRenderer = (
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
    <CageBookingCard 
      item={item}
      actions={processedActions}
      isSelected={isSelected}
      onToggleSelect={onToggleSelect}
    />
  );
}; 