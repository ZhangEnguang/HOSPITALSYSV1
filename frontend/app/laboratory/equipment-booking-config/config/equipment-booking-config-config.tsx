import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Eye,
  Edit,
  Trash2,
  Copy,
  Settings,
  FileText,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  Clock,
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

// 状态颜色映射
export const statusColors = {
  "启用": "default",
  "禁用": "secondary", 
  "维护中": "destructive",
  "草稿": "outline"
} as const

// 快速筛选配置
export const quickFilters = [
  {
    id: "status",
    label: "配置状态",
    options: [
      { id: "status_all", label: "全部状态", value: "all" },
      { id: "status_enabled", label: "启用", value: "启用" },
      { id: "status_disabled", label: "禁用", value: "禁用" },
      { id: "status_maintenance", label: "维护中", value: "维护中" },
      { id: "status_draft", label: "草稿", value: "草稿" }
    ]
  },
  {
    id: "configType",
    label: "配置类型",
    options: [
      { id: "type_all", label: "全部类型", value: "all" },
      { id: "type_general", label: "通用", value: "通用" },
      { id: "type_custom", label: "自定义", value: "自定义" }
    ]
  },
  {
    id: "applicableScope",
    label: "适用范围",
    options: [
      { id: "scope_all", label: "全部范围", value: "all" },
      { id: "scope_equipment", label: "指定仪器", value: "指定仪器" },
      { id: "scope_category", label: "仪器类别", value: "仪器类别" },
      { id: "scope_lab", label: "实验室", value: "实验室" },
      { id: "scope_department", label: "部门", value: "部门" }
    ]
  }
]

// 高级筛选配置
export const advancedFilters = [
  {
    id: "basic",
    title: "基本信息",
    fields: [
      {
        id: "configName",
        label: "配置名称",
        type: "text",
        placeholder: "输入配置名称"
      },
      {
        id: "scopeDescription", 
        label: "适用范围",
        type: "text",
        placeholder: "输入适用范围描述"
      },
      {
        id: "updatedBy",
        label: "更新人",
        type: "text",
        placeholder: "输入更新人姓名"
      }
    ]
  },
  {
    id: "time",
    title: "时间信息",
    fields: [
      {
        id: "lastUpdatedRange",
        label: "更新时间",
        type: "text",
        placeholder: "选择时间范围"
      }
    ]
  },
  {
    id: "config",
    title: "配置信息",
    fields: [
      {
        id: "requireApproval",
        label: "需要审核",
        type: "select",
        options: [
          { label: "全部", value: "all" },
          { label: "需要审核", value: "true" },
          { label: "无需审核", value: "false" }
        ]
      },
      {
        id: "allowWeekends",
        label: "允许周末",
        type: "select", 
        options: [
          { label: "全部", value: "all" },
          { label: "允许周末", value: "true" },
          { label: "不允许周末", value: "false" }
        ]
      },
      {
        id: "autoApproval",
        label: "自动审核",
        type: "select",
        options: [
          { label: "全部", value: "all" },
          { label: "启用自动审核", value: "true" },
          { label: "禁用自动审核", value: "false" }
        ]
      }
    ]
  }
]

// 排序选项配置
export const sortOptions = [
  { id: "lastUpdated_desc", label: "最近更新", field: "lastUpdated", direction: "desc" },
  { id: "lastUpdated_asc", label: "更新时间(旧->新)", field: "lastUpdated", direction: "asc" },
  { id: "configName_asc", label: "配置名称(A->Z)", field: "configName", direction: "asc" },
  { id: "configName_desc", label: "配置名称(Z->A)", field: "configName", direction: "desc" },
  { id: "configType_asc", label: "配置类型(A->Z)", field: "configType", direction: "asc" },
  { id: "status_asc", label: "状态(A->Z)", field: "status", direction: "asc" }
]

// 表格列配置
export const equipmentConfigColumns = [
  {
    id: "configName",
    header: "配置名称",
    accessorKey: "configName" as const,
    className: "w-[25%] min-w-[180px]"
  },
  {
    id: "configType", 
    header: "配置类型",
    accessorKey: "configType" as const,
    className: "w-[12%] min-w-[100px]",
    cell: (item: any) => (
      <Badge variant={item.configType === "通用" ? "default" : "secondary"}>
        {item.configType}
      </Badge>
    )
  },
  {
    id: "scopeDescription",
    header: "适用范围",
    accessorKey: "scopeDescription" as const,
    className: "w-[23%] min-w-[160px]"
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status" as const,
    className: "w-[10%] min-w-[80px]",
    cell: (item: any) => (
      <Badge variant={statusColors[item.status as keyof typeof statusColors]}>
        {item.status}
      </Badge>
    )
  },
  {
    id: "lastUpdated",
    header: "更新时间",
    accessorKey: "lastUpdated" as const,
    className: "w-[18%] min-w-[140px]"
  },
  {
    id: "updatedBy",
    header: "更新人",
    accessorKey: "updatedBy" as const,
    className: "w-[12%] min-w-[100px]"
  }
]

// 行操作配置
export const equipmentConfigActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    variant: "ghost" as const
  },
  {
    id: "edit", 
    label: "编辑配置",
    icon: <Edit className="h-4 w-4" />,
    variant: "ghost" as const
  },
  {
    id: "copy",
    label: "复制配置", 
    icon: <Copy className="h-4 w-4" />,
    variant: "ghost" as const
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "ghost" as const,
    className: "text-destructive hover:text-destructive"
  }
]

// 卡片字段配置
export const equipmentConfigCardFields = [
  {
    id: "configName",
    label: "配置名称",
    primary: true
  },
  {
    id: "configType",
    label: "配置类型", 
    render: (value: string) => (
      <Badge variant={value === "通用" ? "default" : "secondary"}>
        {value}
      </Badge>
    )
  },
  {
    id: "scopeDescription",
    label: "适用范围"
  },
  {
    id: "status",
    label: "状态",
    render: (value: string) => (
      <Badge variant={statusColors[value as keyof typeof statusColors]}>
        {value}
      </Badge>
    )
  },
  {
    id: "lastUpdated",
    label: "更新时间"
  },
  {
    id: "updatedBy",
    label: "更新人"
  }
]

// 批量操作配置
export const batchActions = [
  {
    id: "delete",
    label: "批量删除",
    variant: "destructive" as const,
    icon: <Trash2 className="h-4 w-4" />
  }
]

// 设备配置卡片组件
const EquipmentConfigCard = ({ 
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
  const title = item.configName
  const description = item.scopeDescription
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
    const variant = statusColors[status as keyof typeof statusColors];
    // 如果variant是内置的Badge variant类型，直接返回
    if (variant && ["default", "destructive", "outline", "secondary"].includes(variant)) {
      return variant as "default" | "destructive" | "outline" | "secondary";
    }
    // 否则返回outline作为默认值，并在Badge上应用自定义类
    return "outline";
  }

  const getStatusCustomClass = (status: string) => {
    const variant = statusColors[status as keyof typeof statusColors];
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
            {/* 配置类型字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">配置类型</span>
              <div className="truncate">
                <Badge variant={item.configType === "通用" ? "default" : "secondary"} className="text-xs">
                  {item.configType}
                </Badge>
              </div>
            </div>
            
            {/* 更新人字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">更新人</span>
              <div className="truncate">
                <span className="font-medium">{item.updatedBy}</span>
              </div>
            </div>
            
            {/* 更新时间字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">更新时间</span>
              <div className="truncate">
                {item.lastUpdated}
              </div>
            </div>
            
            {/* 预约审核字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约审核</span>
              <div className="truncate">
                {item.requireApproval ? "需要" : "无需"}
              </div>
            </div>
            
            {/* 周末预约字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">周末预约</span>
              <div className="truncate">
                {item.allowWeekends ? "允许" : "不允许"}
              </div>
            </div>
            
            {/* 预约时长字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约时长</span>
              <div className="truncate">
                {item.minBookingDuration}-{item.maxBookingDuration}小时
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 设备配置自定义卡片渲染器
export const equipmentConfigCustomCardRenderer = (
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
    <EquipmentConfigCard 
      item={item}
      actions={processedActions}
      isSelected={isSelected}
      onToggleSelect={onToggleSelect}
    />
  );
} 