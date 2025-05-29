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
    role: "设备管理员",
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
    role: "技术员",
  },
  {
    id: "5",
    name: "赵六",
    email: "zhao6@lab.edu.cn",
    avatar: "/avatars/05.png",
    role: "技术员",
  },
]

// 自定义扩展Badge组件支持的variant类型
type ExtendedBadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success" | "warning";

// 状态颜色映射
export const statusColors: Record<string, ExtendedBadgeVariant> = {
  "在用": "success",
  "维修中": "warning",
  "闲置": "secondary",
  "报废": "destructive",
  "待验收": "outline",
  "外借": "default",
  
  "正常": "success",
  "异常": "destructive",
  "待维护": "warning",
  "已预约": "secondary",
  "未使用": "outline",
}

// 通用表格列配置
export const tableColumns = [
  {
    id: "name",
    header: "名称",
    accessorKey: "name",
  },
  {
    id: "department",
    header: "部门",
    accessorKey: "department",
  },
  {
    id: "status",
    header: "状态",
    accessorKey: "status",
    cell: (row: any) => {
      const status = row.getValue() as string
      // 确保使用正确的类型，此处需要类型断言为任意字符串
      return <Badge variant={(statusColors[status] || "secondary") as any}>{status}</Badge>
    },
  },
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "category",
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
    id: "status",
    label: "使用状态",
    value: "",
    options: [
      { id: "1", label: "在用", value: "在用" },
      { id: "2", label: "维修中", value: "维修中" },
      { id: "3", label: "闲置", value: "闲置" },
      { id: "4", label: "报废", value: "报废" },
      { id: "5", label: "待验收", value: "待验收" },
      { id: "6", label: "外借", value: "外借" },
    ],
    category: "default",
  },
  {
    id: "department",
    label: "所属部门",
    value: "",
    options: [
      { id: "1", label: "物理实验室", value: "物理实验室" },
      { id: "2", label: "化学实验室", value: "化学实验室" },
      { id: "3", label: "生物实验室", value: "生物实验室" },
      { id: "4", label: "计算机实验室", value: "计算机实验室" },
      { id: "5", label: "电子实验室", value: "电子实验室" },
      { id: "6", label: "材料实验室", value: "材料实验室" },
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
        id: "name",
        label: "仪器名称",
        type: "text",
        placeholder: "请输入仪器名称关键词",
      },
      {
        id: "model",
        label: "型号",
        type: "text",
        placeholder: "请输入型号关键词",
      },
      {
        id: "serialNumber",
        label: "序列号",
        type: "text",
        placeholder: "请输入序列号",
      },
    ],
  },
  {
    id: "usage",
    title: "使用信息",
    fields: [
      {
        id: "location",
        label: "存放位置",
        type: "select",
        options: [
          { value: "A栋实验楼", label: "A栋实验楼" },
          { value: "B栋实验楼", label: "B栋实验楼" },
          { value: "C栋实验楼", label: "C栋实验楼" },
          { value: "D栋实验楼", label: "D栋实验楼" },
        ],
      },
      {
        id: "maintenanceStatus",
        label: "维护状态",
        type: "select",
        options: [
          { value: "正常", label: "正常" },
          { value: "待维护", label: "待维护" },
          { value: "异常", label: "异常" },
        ],
      },
      {
        id: "useFrequency",
        label: "使用频率",
        type: "select",
        options: [
          { value: "高", label: "高" },
          { value: "中", label: "中" },
          { value: "低", label: "低" },
        ],
      },
    ],
  },
  {
    id: "purchase",
    title: "购置信息",
    fields: [
      {
        id: "purchaseDateRange",
        label: "购置日期范围",
        type: "date-range",
      },
      {
        id: "priceRange",
        label: "价格范围",
        type: "number-range",
      },
      {
        id: "supplier",
        label: "供应商",
        type: "text",
        placeholder: "请输入供应商名称",
      },
    ],
  },
]

// 排序选项
export const sortOptions = [
  {
    id: "name_asc",
    label: "名称 (A-Z)",
    field: "name",
    direction: "asc" as const,
  },
  {
    id: "name_desc",
    label: "名称 (Z-A)",
    field: "name",
    direction: "desc" as const,
  },
  {
    id: "purchaseDate_asc",
    label: "购置日期 (最早优先)",
    field: "purchaseDate",
    direction: "asc" as const,
  },
  {
    id: "purchaseDate_desc",
    label: "购置日期 (最近优先)",
    field: "purchaseDate",
    direction: "desc" as const,
  },
  {
    id: "price_asc",
    label: "价格 (从低到高)",
    field: "price",
    direction: "asc" as const,
  },
  {
    id: "price_desc",
    label: "价格 (从高到低)",
    field: "price",
    direction: "desc" as const,
  },
]

// 仪器特定列配置
export const equipmentColumns = [
  {
    id: "image",
    header: "图片",
    accessorKey: "images",
    cell: (row: any) => {
      const item = row;
      if (item.images && item.images.length > 0) {
        return (
          <div className="relative w-16 h-12 rounded-md overflow-hidden bg-gray-100">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  `;
                }
              }}
            />
            {item.images.length > 1 && (
              <div className="absolute top-0.5 right-0.5 bg-black/60 text-white text-xs px-1 rounded">
                +{item.images.length - 1}
              </div>
            )}
          </div>
        );
      }
      return (
        <div className="w-16 h-12 rounded-md bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      );
    },
  },
  {
    id: "name",
    header: "仪器名称",
    accessorKey: "name",
    cell: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{row.model}</span>
      </div>
    ),
  },
  {
    id: "category",
    header: "仪器类型",
    accessorKey: "category",
    cell: (row: any) => <span>{row.category}</span>,
  },
  {
    id: "status",
    header: "使用状态",
    accessorKey: "status",
    cell: (row: any) => <Badge variant={(statusColors[row.status] || "secondary") as any}>{row.status}</Badge>,
  },
  {
    id: "department",
    header: "所属部门",
    accessorKey: "department",
    cell: (row: any) => <span>{row.department}</span>,
  },
  {
    id: "location",
    header: "存放位置",
    accessorKey: "location",
    cell: (row: any) => <span>{row.location}</span>,
  },
  {
    id: "bookingType",
    header: "预约类型",
    accessorKey: "bookingType",
    cell: (row: any) => (
      <Badge variant="outline" className="text-blue-600 border-blue-200">
        {row.bookingType}
          </Badge>
    ),
  },
  {
    id: "bookingMethod",
    header: "预约方式",
    accessorKey: "bookingMethod",
    cell: (row: any) => <span className="text-gray-700">{row.bookingMethod}</span>,
  },
  {
    id: "bookingCount",
    header: "预约次数",
    accessorKey: "bookingCount",
    cell: (row: any) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.bookingCount}</span>
        <span className="text-xs text-gray-500">次</span>
      </div>
    ),
  },
]

// 卡片视图字段配置
export const cardFields = [
  { 
    id: "name", 
    label: "名称",
    value: (item: any) => item.name 
  },
  { 
    id: "department", 
    label: "部门",
    value: (item: any) => item.department
  },
  { 
    id: "status", 
    label: "状态", 
    type: "badge",
    value: (item: any) => item.status
  },
  { 
    id: "dueDate", 
    label: "截止日期", 
    type: "date",
    value: (item: any) => item.dueDate ? format(new Date(item.dueDate), "yyyy/MM/dd") : "-"
  },
]

// 仪器卡片字段配置
export const equipmentCardFields = [
  { 
    id: "model", 
    label: "型号", 
    value: (item: any) => item.model
  },
  { 
    id: "category", 
    label: "仪器类型", 
    value: (item: any) => item.category
  },
  { 
    id: "status", 
    label: "使用状态", 
    value: (item: any) => (
      <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>
    )
  },
  { 
    id: "department", 
    label: "所属部门", 
    value: (item: any) => item.department
  },
  { 
    id: "purchaseDate", 
    label: "购置日期", 
    value: (item: any) => format(new Date(item.purchaseDate), "yyyy/MM/dd")
  },
  { 
    id: "price", 
    label: "价格", 
    value: (item: any) => `￥${item.price.toLocaleString()}`
  }
]

// 仪器特定操作配置
export const equipmentActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      // 使用路由跳转到仪器详情页
      const url = `/laboratory/equipment/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑仪器",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "booking",
    label: "预约仪器",
    icon: <Calendar className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment/booking/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "maintenance",
    label: "维护仪器",
    icon: <Wrench className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/equipment/maintenance/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "delete",
    label: "删除仪器",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
    onClick: (item: any) => {
      // 这个onClick会被DataList组件的onRowActionClick处理
      // 实际的删除逻辑在page.tsx中的handleDeleteItem函数中
      console.log("删除仪器:", item.name);
    },
  },
]

// 通用操作
export const tableActions = [
  {
    id: "view",
    label: "查看",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    id: "edit",
    label: "编辑",
    icon: <Pencil className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 批量操作
export const batchActions = [
  {
    id: "complete",
    label: "标记完成",
    icon: <Check className="h-4 w-4" />,
  },
  {
    id: "delay",
    label: "标记延期",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 仪器卡片组件
const EquipmentCard = ({ 
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
  return (
    <Card
      className={cn(
        "group transition-all duration-300 border border-[#E9ECF2] shadow-none hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)] hover:border-primary/20 cursor-pointer",
        "flex flex-col w-full", // 确保卡片占据完整宽度且为flex布局
        isSelected && "ring-2 ring-primary"
      )}
    >
      {/* 仪器图片区域 - 只显示第一张图片 */}
      <div 
        className="relative w-full overflow-hidden rounded-t-lg bg-gray-50 flex-shrink-0"
        style={{ paddingBottom: '60%' }}
      >
        <div className="absolute inset-0">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={`${item.name} - 图片`}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 bg-white"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <div class="flex flex-col items-center justify-center space-y-2 text-gray-400">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-xs text-gray-500">暂无图片</span>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-gray-500">暂无图片</span>
              </div>
            </div>
          )}
        </div>
        
        {/* 操作按钮 - 移动到图片区域右上角 */}
        {actions && actions.length > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-white/80 backdrop-blur-sm transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {actions
                  .filter((action) => !action.hidden || !action.hidden(item))
                  .map((action) => (
                    <DropdownMenuItem
                      key={action.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        action.onClick(item, e)
                      }}
                      disabled={action.disabled ? action.disabled(item) : false}
                      className={action.id === "delete" ? "text-destructive" : ""}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      {/* 卡片内容 */}
      <div className="p-3 flex flex-col flex-1">
        <div className="mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 transition-colors duration-300 group-hover:text-primary truncate leading-tight">
              {item.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {item.model}
            </p>
          </div>
        </div>

        {/* 仪器信息 */}
        <div className="space-y-2 flex-1">
          {/* 移除原有的详细信息网格 */}
          
          {/* 简化后只保留必要信息 */}
        </div>
        
        {/* 预约次数和使用状态 - 固定在底部 */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-muted-foreground">
            预约次数：{item.bookingCount || 0}次
          </span>
          <Badge 
            variant={(statusColors[item.status] || "secondary") as any}
            className="font-medium text-xs"
          >
            {item.status}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

// 仪器自定义卡片渲染器（支持图片显示）
export const equipmentCustomCardRenderer = (
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
    <EquipmentCard 
      item={item}
      actions={processedActions}
      isSelected={isSelected}
      onToggleSelect={onToggleSelect}
    />
  );
}; 