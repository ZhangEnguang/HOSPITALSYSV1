import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Eye,
  Pencil,
  Trash2,
  Settings,
  MonitorSpeaker,
  Thermometer,
  Droplets,
  Users,
  Clock,
  CheckCircle,
  MoreVertical,
  RefreshCw,
  Trash,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { 
  SELECTION_VARIANTS, 
  DECORATION_VARIANTS,
  DEFAULT_CARD_SELECTION_CONFIG,
  type CardSelectionConfig
} from "@/components/ui/card-selection-variants"

// 卡片勾选方案配置
export const CARD_SELECTION_CONFIG: CardSelectionConfig = DEFAULT_CARD_SELECTION_CONFIG

// 自定义扩展Badge组件支持的variant类型
type ExtendedBadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success" | "warning";

// 状态颜色映射
export const statusColors: Record<string, ExtendedBadgeVariant> = {
  "使用中": "success",
  "维修中": "warning",
  "清洁中": "outline",
  "空闲": "default",
  "停用": "destructive",
}

// 通用表格列配置
export const tableColumns = [
  {
    id: "roomId",
    header: "房间编号",
    accessorKey: "roomId",
  },
  {
    id: "name",
    header: "房间名称",
    accessorKey: "name",
  },
  {
    id: "type",
    header: "房间类型",
    accessorKey: "type",
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => {
      const status = row.status as string
      return <Badge variant={(statusColors[status] || "secondary") as any}>{status}</Badge>
    },
  },
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "type",
    label: "房间类型",
    value: "",
    options: [
      { id: "1", label: "普通饲养间", value: "普通饲养间" },
      { id: "2", label: "无菌饲养间", value: "无菌饲养间" },
      { id: "3", label: "SPF饲养间", value: "SPF饲养间" },
      { id: "4", label: "普通繁殖间", value: "普通繁殖间" },
      { id: "5", label: "SPF繁殖间", value: "SPF繁殖间" },
      { id: "6", label: "无菌繁殖间", value: "无菌繁殖间" },
    ],
    category: "default",
  },
  {
    id: "status",
    label: "房间状态",
    value: "",
    options: [
      { id: "1", label: "使用中", value: "使用中" },
      { id: "2", label: "维修中", value: "维修中" },
      { id: "3", label: "清洁中", value: "清洁中" },
      { id: "4", label: "空闲", value: "空闲" },
      { id: "5", label: "停用", value: "停用" },
    ],
    category: "default",
  },
  {
    id: "department",
    label: "所属部门",
    value: "",
    options: [
      { id: "1", label: "动物实验中心", value: "动物实验中心" },
      { id: "2", label: "生物医学研究院", value: "生物医学研究院" },
      { id: "3", label: "药学院", value: "药学院" },
      { id: "4", label: "基础医学院", value: "基础医学院" },
      { id: "5", label: "临床医学院", value: "临床医学院" },
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
        id: "roomId",
        label: "房间编号",
        type: "text",
        placeholder: "请输入房间编号",
      },
      {
        id: "name",
        label: "房间名称",
        type: "text",
        placeholder: "请输入房间名称关键词",
      },
      {
        id: "description",
        label: "描述",
        type: "text",
        placeholder: "请输入描述关键词",
      },
    ],
  },
  {
    id: "capacity",
    title: "容量信息",
    fields: [
      {
        id: "capacityRange",
        label: "容量范围",
        type: "number",
        placeholder: "请输入容量范围",
      },
    ],
  },
  {
    id: "environment",
    title: "环境信息",
    fields: [
      {
        id: "location",
        label: "位置",
        type: "select",
        options: [
          { value: "A栋1楼", label: "A栋1楼" },
          { value: "A栋2楼", label: "A栋2楼" },
          { value: "B栋1楼", label: "B栋1楼" },
          { value: "B栋2楼", label: "B栋2楼" },
        ],
      },
      {
        id: "temperatureRange",
        label: "温度范围(°C)",
        type: "text",
        placeholder: "例如：20-25",
      },
      {
        id: "humidityRange",
        label: "湿度范围(%)",
        type: "text",
        placeholder: "例如：40-60",
      },
    ],
  },
]

// 排序选项
export const sortOptions = [
  { 
    id: "smart_desc", 
    field: "smart", 
    direction: "desc" as const, 
    label: "🤖 智能排序 (推荐)",
    description: "状态优先级 → 使用率 → 容量 → 房间号"
  },
  { id: "roomId_asc", field: "roomId", direction: "asc" as const, label: "房间编号 ↑" },
  { id: "roomId_desc", field: "roomId", direction: "desc" as const, label: "房间编号 ↓" },
  { id: "name_asc", field: "name", direction: "asc" as const, label: "房间名称 ↑" },
  { id: "name_desc", field: "name", direction: "desc" as const, label: "房间名称 ↓" },
  { id: "capacity_asc", field: "capacity", direction: "asc" as const, label: "容量 ↑" },
  { id: "capacity_desc", field: "capacity", direction: "desc" as const, label: "容量 ↓" },
  { id: "status_asc", field: "status", direction: "asc" as const, label: "状态 ↑" },
  { id: "status_desc", field: "status", direction: "desc" as const, label: "状态 ↓" },
]

// 动物房专用表格列配置
export const animalRoomColumns = [
  {
    id: "roomId",
    header: "房间编号",
    accessorKey: "roomId",
  },
  {
    id: "name",
    header: "房间名称",
    accessorKey: "name",
  },
  {
    id: "type",
    header: "房间类型",
    accessorKey: "type",
  },
  {
    id: "capacityReservation",
    header: "容量/已预约",
    accessorKey: "capacity",
    cell: (row: any) => {
      return `${row.capacity}/${row.currentOccupancy}`
    },
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => {
      const status = row.status as string
      const variant = statusColors[status] || "secondary"
      return <Badge variant={variant as any}>{status}</Badge>
    },
  },
  {
    id: "department",
    header: "所属部门",
    accessorKey: "department",
  },
  {
    id: "location",
    header: "位置",
    accessorKey: "location",
  },
  {
    id: "temperature",
    header: "温度(°C)",
    accessorKey: "temperature",
    cell: (row: any) => {
      return (
        <div className="flex items-center gap-1">
          <Thermometer className="h-3 w-3" />
          {row.temperature}
        </div>
      )
    },
  },
  {
    id: "humidity",
    header: "湿度(%)",
    accessorKey: "humidity",
    cell: (row: any) => {
      return (
        <div className="flex items-center gap-1">
          <Droplets className="h-3 w-3" />
          {row.humidity}
        </div>
      )
    },
  },
]

// 操作按钮配置
export const animalRoomActions = [
  {
    id: "view",
    label: "查看详情",
    icon: Eye,
  },
  {
    id: "edit",
    label: "编辑房间",
    icon: Pencil,
  },
  {
    id: "reservation",
    label: "预约笼位",
    icon: Users,
  },
  {
    id: "manage",
    label: "饲养管理",
    icon: Settings,
  },
  {
    id: "monitoring",
    label: "环境监控",
    icon: MonitorSpeaker,
  },
  {
    id: "delete",
    label: "删除房间",
    icon: Trash2,
    variant: "destructive",
  },
]

// 批量操作配置
export const batchActions = [
  {
    id: "setInUse",
    label: "设为使用中",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    id: "setCleaning",
    label: "设为清洁中",
    icon: <RefreshCw className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 通用卡片字段配置
export const cardFields = [
  {
    id: "title",
    label: "房间名称",
    field: "name",
    type: "text",
  },
  {
    id: "type",
    label: "类型",
    field: "type",
    type: "text",
  },
  {
    id: "status",
    label: "状态",
    field: "status",
    type: "badge",
  },
]

// 动物房专用卡片字段配置
export const animalRoomCardFields = [
  {
    id: "roomId",
    label: "房间编号",
    field: "roomId",
    type: "text",
  },
  {
    id: "type",
    label: "类型",
    field: "type",
    type: "text",
  },
  {
    id: "capacityReservation",
    label: "容量/已预约",
    field: "capacity",
    type: "text",
    render: (item: any) => `${item.capacity}/${item.currentOccupancy}`,
  },
  {
    id: "status",
    label: "状态",
    field: "status",
    type: "badge",
    render: (item: any) => {
      const variant = statusColors[item.status] || "secondary";
      return <Badge variant={variant as any}>{item.status}</Badge>;
    },
  },
  {
    id: "environment",
    label: "环境",
    field: "environment",
    type: "text",
    render: (item: any) => `${item.temperature}°C / ${item.humidity}%`,
  },
]

// 自定义动物房卡片组件
const AnimalRoomCard = ({ 
  item, 
  actions, 
  isSelected, 
  onToggleSelect,
  onRowActionClick
}: {
  item: any;
  actions: any[];
  isSelected: boolean;
  onToggleSelect: (selected: boolean) => void;
  onRowActionClick?: (action: any, item: any) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  // 获取卡片选中配置
  const SelectionComponent = SELECTION_VARIANTS[CARD_SELECTION_CONFIG.currentVariant]

  // 根据房间类型获取默认图标
  const getRoomTypeIcon = () => {
    const type = item.type
    if (type.includes("繁殖")) return "🐾"
    if (type.includes("SPF")) return "🏠"
    if (type.includes("无菌")) return "🔬"
    if (type.includes("普通")) return "🏠"
    return "🏠"
  }

  // 计算使用率
  const usageRate = Math.round((item.currentOccupancy / item.capacity) * 100)
  
  return (
    <Card
      className={cn(
        "group relative transition-all duration-300 border cursor-pointer",
        "border-[#E9ECF2] shadow-sm hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)]",
        "flex flex-col w-full h-full overflow-hidden",
        isSelected 
          ? "border-primary/50 shadow-[0_0_0_2px_rgba(59,130,246,0.1)]" 
          : "hover:border-primary/20",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 动态勾选组件 */}
      {SelectionComponent && (
        <SelectionComponent 
          isHovered={isHovered}
          isSelected={isSelected}
          onToggleSelect={() => onToggleSelect(!isSelected)}
        />
      )}

      {/* 选中状态的装饰性元素 */}
      {isSelected && CARD_SELECTION_CONFIG.currentDecorations && (
        <>
          {CARD_SELECTION_CONFIG.currentDecorations.map((decorationKey, index) => {
            const DecorationComponent = DECORATION_VARIANTS[decorationKey]
            return DecorationComponent ? <DecorationComponent key={index} /> : null
          })}
        </>
      )}

      {/* 操作按钮 */}
      <div className="absolute top-3 right-3 z-20">
        <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-black/10 hover:bg-black/20 shadow-none border-0 text-white/80 hover:text-white transition-all duration-300 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowDropdown(!showDropdown)
              }}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {actions.map((action) => {
              const IconComponent = action.icon
              return (
                <DropdownMenuItem
                  key={action.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDropdown(false)
                    onRowActionClick?.(action, item)
                  }}
                  className={action.variant === "destructive" ? "text-destructive" : ""}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {action.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 图片区域 */}
      <div className="relative w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {!imageError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center">
              <div className="text-3xl mb-2 opacity-60">{getRoomTypeIcon()}</div>
              <div className="text-xs text-gray-400 font-medium tracking-wide uppercase">{item.type}</div>
            </div>
          </div>
        )}
        
        {/* 状态标识 - 已隐藏 */}
        {/* 
        <div className="absolute top-3 left-3">
          <Badge
            variant={statusColors[item.status] ? statusColors[item.status] as any : "secondary"}
            className="text-xs font-medium shadow-sm backdrop-blur-sm bg-white/90"
          >
            {item.status}
          </Badge>
        </div>
        */}
      </div>

      {/* 内容区域 */}
      <div className="flex flex-col flex-1 p-5 min-h-0">
        {/* 标题区域 */}
        <div className="mb-4">
          <h3 className={cn(
            "leading-tight mb-1 transition-colors duration-300 !text-base font-medium",
            isSelected ? "text-primary" : "text-gray-900 group-hover:text-primary"
          )}>
            {item.name}
          </h3>
          <div className="flex items-center gap-2 !text-sm text-gray-500">
            <span className="font-mono font-medium">{item.roomId}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{item.department}</span>
          </div>
        </div>

        {/* 容量信息 - 创新展示 */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            {/* 左侧：圆环进度 + 数据 */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                {/* 背景圆环 */}
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-gray-100"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 18}`}
                    strokeDashoffset={`${2 * Math.PI * 18 * (1 - usageRate / 100)}`}
                    className={cn(
                      "transition-all duration-1000 ease-out",
                      usageRate >= 90 ? "text-red-400" :
                      usageRate >= 70 ? "text-amber-400" :
                      "text-emerald-400"
                    )}
                    strokeLinecap="round"
                  />
                </svg>
                {/* 中心百分比 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn(
                    "text-xs font-bold transition-colors duration-300",
                    usageRate >= 90 ? "text-red-500" :
                    usageRate >= 70 ? "text-amber-500" :
                    "text-emerald-500"
                  )}>
                    {usageRate}%
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="!text-sm font-medium text-gray-700">使用情况</span>
                </div>
                <div className="!text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{item.currentOccupancy}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-gray-500">{item.capacity}</span>
                </div>
              </div>
            </div>

            {/* 右侧：状态指示器 */}
            <div className="flex flex-col items-end">
              <div className={cn(
                "w-3 h-3 rounded-full mb-1 transition-all duration-500",
                usageRate >= 90 ? "bg-red-400 shadow-lg shadow-red-200" :
                usageRate >= 70 ? "bg-amber-400 shadow-lg shadow-amber-200" :
                "bg-emerald-400 shadow-lg shadow-emerald-200"
              )}>
                <div className={cn(
                  "w-full h-full rounded-full animate-pulse",
                  usageRate >= 90 ? "bg-red-300" :
                  usageRate >= 70 ? "bg-amber-300" :
                  "bg-emerald-300"
                )}></div>
              </div>
              <span className="!text-sm text-gray-500 font-medium">
                {usageRate >= 90 ? "高负荷" :
                 usageRate >= 70 ? "中负荷" :
                 "低负荷"}
              </span>
            </div>
          </div>
        </div>

        {/* 环境信息 - 简化设计 */}
        <div className="flex items-center justify-between !text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Thermometer className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{item.temperature}°C</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{item.humidity}%</span>
          </div>
          <div className="text-xs text-gray-400 font-medium tracking-wide">
            {item.location}
          </div>
        </div>
      </div>
    </Card>
  )
}

// 自定义卡片渲染器
export const animalRoomCustomCardRenderer = (
  item: any, 
  actions: any[], 
  isSelected: boolean, 
  onToggleSelect: (selected: boolean) => void,
  onRowActionClick?: (action: any, item: any) => void
) => {
  return (
    <AnimalRoomCard
      item={item}
      actions={actions}
      isSelected={isSelected}
      onToggleSelect={onToggleSelect}
      onRowActionClick={onRowActionClick}
    />
  )
}
