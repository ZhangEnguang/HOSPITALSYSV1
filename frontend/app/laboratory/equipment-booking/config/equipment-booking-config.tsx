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
  MoreVertical,
} from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import React from "react"
import { 
  SELECTION_VARIANTS, 
  DECORATION_VARIANTS,
  DEFAULT_CARD_SELECTION_CONFIG,
  type CardSelectionConfig
} from "@/components/ui/card-selection-variants"

// 卡片勾选方案配置 - 使用默认的优雅款配置
export const CARD_SELECTION_CONFIG: CardSelectionConfig = DEFAULT_CARD_SELECTION_CONFIG

// 模拟用户数据
export const users = [
  {
    id: "1",
    name: "张七",
    email: "zhang7@lab.edu.cn",
    avatar: "/avatars/01.png",
    role: "实验室管理员",
    phone: "18012345678",
  },
  {
    id: "2",
    name: "李三",
    email: "li3@lab.edu.cn",
    avatar: "/avatars/02.png",
    role: "设备管理员",
    phone: "18023456789",
  },
  {
    id: "3",
    name: "王五",
    email: "wang5@lab.edu.cn",
    avatar: "/avatars/03.png",
    role: "实验室主任",
    phone: "18034567890",
  },
  {
    id: "4",
    name: "李四",
    email: "li4@lab.edu.cn",
    avatar: "/avatars/04.png",
    role: "研究员",
    phone: "18045678901",
  },
  {
    id: "5",
    name: "赵六",
    email: "zhao6@lab.edu.cn",
    avatar: "/avatars/05.png",
    role: "博士研究生",
    phone: "18056789012",
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
    cell: (item: any) => <Badge className={statusColors[item.status] || "bg-slate-50 text-slate-700 border-slate-200"}>{item.status}</Badge>,
  },
]

// 卡片视图字段配置
export const equipmentBookingCardFields = [
  { 
    id: "equipmentInfo", 
    label: "预约仪器", 
    value: (item: any) => `${item.equipmentName} (${item.equipmentType})`
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

// 仪器预约操作配置
export const equipmentBookingActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment-booking/view/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑预约",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment-booking/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "approve",
    label: "审核预约",
    icon: <ClipboardCheck className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment-booking/approve/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "delete",
    label: "删除预约",
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

// 设备预约卡片组件
const EquipmentBookingCard = ({ 
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
  const [isHovered, setIsHovered] = React.useState(false)
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

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleSelect(!isSelected)
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
          ? "border-primary/50 shadow-[0_0_0_2px_rgba(59,130,246,0.1)] bg-gradient-to-br from-primary/5 to-transparent" 
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
            {/* 预约仪器字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约仪器</span>
              <div className="truncate">
                {`${item.equipmentName} (${item.equipmentType})`}
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
            
            {/* 预约时长字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约时长</span>
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

// 设备预约自定义卡片渲染器
export const equipmentBookingCustomCardRenderer = (
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
    <EquipmentBookingCard 
      item={item}
      actions={processedActions}
      isSelected={isSelected}
      onToggleSelect={onToggleSelect}
    />
  );
}; 