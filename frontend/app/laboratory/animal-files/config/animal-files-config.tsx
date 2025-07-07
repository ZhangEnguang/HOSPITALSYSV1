"use client"

import React from "react"
import { format } from "date-fns"
import { Eye, Pencil, Trash2, FileText, Plus, Calendar, Heart, Activity } from "lucide-react"
import { MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ElegantCardSelection } from "@/components/ui/elegant-card-selection"

// 状态颜色映射
type ExtendedBadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success" | "warning";

export const statusColors: Record<string, ExtendedBadgeVariant> = {
  "健康": "success",
  "观察中": "warning", 
  "治疗中": "outline",
  "隔离": "destructive",
  "退役": "secondary",
  "死亡": "destructive"
}

// 快速筛选配置
export const quickFilters = [
  {
    id: "species",
    label: "动物种类",
    value: "",
    options: [
      { id: "1", label: "小鼠", value: "小鼠" },
      { id: "2", label: "大鼠", value: "大鼠" },
      { id: "3", label: "兔", value: "兔" },
      { id: "4", label: "豚鼠", value: "豚鼠" },
      { id: "5", label: "猴", value: "猴" },
      { id: "6", label: "犬", value: "犬" },
    ],
    category: "default",
  },
  {
    id: "status",
    label: "健康状态",
    value: "",
    options: [
      { id: "1", label: "健康", value: "健康" },
      { id: "2", label: "观察中", value: "观察中" },
      { id: "3", label: "治疗中", value: "治疗中" },
      { id: "4", label: "隔离", value: "隔离" },
      { id: "5", label: "退役", value: "退役" },
      { id: "6", label: "死亡", value: "死亡" },
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
        id: "animalId",
        label: "动物编号",
        type: "text",
        placeholder: "请输入动物编号",
      },
      {
        id: "species",
        label: "动物种类",
        type: "select",
        options: [
          { value: "小鼠", label: "小鼠" },
          { value: "大鼠", label: "大鼠" },
          { value: "兔", label: "兔" },
          { value: "豚鼠", label: "豚鼠" },
        ],
      },
      {
        id: "strain",
        label: "品系",
        type: "text",
        placeholder: "请输入品系名称",
      },
    ],
  },
  {
    id: "health",
    title: "健康信息",
    fields: [
      {
        id: "healthStatus",
        label: "健康状态",
        type: "select",
        options: [
          { value: "健康", label: "健康" },
          { value: "观察中", label: "观察中" },
          { value: "治疗中", label: "治疗中" },
          { value: "隔离", label: "隔离" },
        ],
      },
      {
        id: "weightRange",
        label: "体重范围(g)",
        type: "number-range",
        placeholder: "请输入体重范围",
      },
      {
        id: "lastCheckDate",
        label: "最后检查日期",
        type: "date-range",
      },
    ],
  },
  {
    id: "management",
    title: "管理信息",
    fields: [
      {
        id: "entryDateRange",
        label: "入档日期范围",
        type: "date-range",
      },
      {
        id: "responsible",
        label: "责任人",
        type: "text",
        placeholder: "请输入责任人姓名",
      },
      {
        id: "location",
        label: "饲养位置",
        type: "select",
        options: [
          { value: "A栋动物房", label: "A栋动物房" },
          { value: "B栋动物房", label: "B栋动物房" },
          { value: "C栋隔离区", label: "C栋隔离区" },
          { value: "D栋实验区", label: "D栋实验区" },
        ],
      },
    ],
  },
]

// 排序选项配置
export const sortOptions = [
  {
    id: "smart_desc",
    field: "smart",
    direction: "desc" as const,
    label: "智能排序",
  },
  {
    id: "entryDate_desc",
    field: "entryDate",
    direction: "desc" as const,
    label: "入档时间 ↓",
  },
  {
    id: "entryDate_asc", 
    field: "entryDate",
    direction: "asc" as const,
    label: "入档时间 ↑",
  },
  {
    id: "animalId_asc",
    field: "animalId", 
    direction: "asc" as const,
    label: "编号 ↑",
  },
  {
    id: "animalId_desc",
    field: "animalId",
    direction: "desc" as const,
    label: "编号 ↓",
  },
  {
    id: "age_desc",
    field: "age",
    direction: "desc" as const,
    label: "年龄 ↓",
  },
  {
    id: "age_asc",
    field: "age", 
    direction: "asc" as const,
    label: "年龄 ↑",
  },
  {
    id: "weight_desc",
    field: "weight",
    direction: "desc" as const,
    label: "体重 ↓",
  },
  {
    id: "weight_asc",
    field: "weight",
    direction: "asc" as const,
    label: "体重 ↑",
  },
]

// 表格列配置
export const tableColumns = [
  {
    id: "animalId",
    header: "动物编号",
    cell: (item: any) => <span className="font-mono">{item.animalId}</span>,
  },
  {
    id: "species",
    header: "种类",
    cell: (item: any) => <span>{item.species}</span>,
  },
  {
    id: "strain",
    header: "品系",
    cell: (item: any) => <span>{item.strain}</span>,
  },
  {
    id: "gender",
    header: "性别",
    cell: (item: any) => <span>{item.gender}</span>,
  },
  {
    id: "age",
    header: "年龄",
    cell: (item: any) => <span>{item.age}周</span>,
  },
  {
    id: "weight",
    header: "体重",
    cell: (item: any) => <span>{item.weight}g</span>,
  },
  {
    id: "status",
    header: "健康状态",
    cell: (item: any) => <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>,
  },
  {
    id: "department",
    header: "所属部门",
    cell: (item: any) => <span>{item.department}</span>,
  },
  {
    id: "location",
    header: "饲养位置",
    cell: (item: any) => <span>{item.location}</span>,
  },
  {
    id: "entryDate",
    header: "入档日期",
    cell: (item: any) => format(new Date(item.entryDate), "yyyy/MM/dd"),
  },
]

// 表格操作配置
export const tableActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/animal-files/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit", 
    label: "编辑档案",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/animal-files/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "healthRecord",
    label: "健康记录",
    icon: <Heart className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/animal-files/health/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "delete",
    label: "删除档案",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 批量操作配置
export const batchActions = [
  {
    id: "healthy",
    label: "标记健康",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    id: "observe",
    label: "标记观察",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    id: "isolate",
    label: "标记隔离",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 动物档案卡片字段配置
export const animalCardFields = [
  { 
    id: "species", 
    label: "动物种类", 
    value: (item: any) => item.species
  },
  { 
    id: "strain", 
    label: "品系", 
    value: (item: any) => item.strain
  },
  { 
    id: "status", 
    label: "健康状态", 
    value: (item: any) => (
      <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>
    )
  },
  { 
    id: "age", 
    label: "年龄", 
    value: (item: any) => `${item.age}周`
  },
  { 
    id: "weight", 
    label: "体重", 
    value: (item: any) => `${item.weight}g`
  },
  { 
    id: "department", 
    label: "所属部门", 
    value: (item: any) => item.department
  },
  { 
    id: "location", 
    label: "饲养位置", 
    value: (item: any) => item.location
  },
  { 
    id: "entryDate", 
    label: "入档日期", 
    value: (item: any) => format(new Date(item.entryDate), "yyyy/MM/dd")
  }
]

// 动物档案特定操作配置
export const animalActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/animal-files/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑档案",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/animal-files/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "healthRecord",
    label: "健康记录",
    icon: <Heart className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/animal-files/health/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "experimentRecord",
    label: "实验记录",
    icon: <FileText className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/animal-files/experiment/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "delete",
    label: "删除档案",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 动物档案卡片组件
const AnimalCard = ({ 
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
  
  // 获取动物图标
  const getAnimalIcon = (species: string) => {
    const icons: Record<string, string> = {
      "小鼠": "🐭",
      "大鼠": "🐀", 
      "兔": "🐰",
      "豚鼠": "🐹",
      "猴": "🐒",
      "犬": "🐕"
    };
    return icons[species] || "🐾";
  };

  // 检查是否需要关注（健康状态异常）
  const needsAttention = () => {
    return ["治疗中", "隔离", "观察中"].includes(item.status);
  };

  // 健康状态颜色
  const getHealthStatusColor = () => {
    if (item.status === "健康") {
      return "text-green-600";
    } else if (["观察中", "治疗中"].includes(item.status)) {
      return "text-orange-600";
    } else if (["隔离", "死亡"].includes(item.status)) {
      return "text-red-600";
    }
    return "text-gray-600";
  };

  // 卡片整体样式
  const getCardStyles = () => {
    if (item.status === "死亡") {
      return "border-gray-300 bg-gray-50/30";
    } else if (needsAttention()) {
      return "border-orange-300 bg-orange-50/30";
    }
    return "";
  };

  // 悬浮描边样式
  const getHoverBorderStyle = () => {
    if (item.status === "死亡") {
      return "hover:border-gray-400/60";
    } else if (needsAttention()) {
      return "hover:border-orange-400/60";
    }
    return "hover:border-primary/20";
  };

  // 操作按钮背景样式
  const getActionButtonStyles = () => {
    if (item.status === "死亡") {
      return "bg-gray-50/80 hover:bg-gray-50/90";
    } else if (needsAttention()) {
      return "bg-orange-50/80 hover:bg-orange-50/90";
    }
    return "bg-white/80 hover:bg-white/90";
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ElegantCardSelection
        isHovered={isHovered}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        className="group transition-all duration-300"
      >
        <Card 
          className={cn(
            "group cursor-pointer border transition-all duration-300 ease-in-out hover:shadow-lg relative",
            getHoverBorderStyle(),
            getCardStyles()
          )}
        >
          {/* 右上角操作菜单 */}
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 backdrop-blur-sm transition-all duration-200",
                    getActionButtonStyles()
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {actions.map((action) => {
                  return (
                    <DropdownMenuItem 
                      key={action.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (action.onClick) {
                          action.onClick(item, e);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        action.variant === "destructive" && "text-red-600 focus:text-red-600"
                      )}
                    >
                      {action.icon}
                      <span>
                        {action.label}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 左上角状态标识 - 已隐藏 */}
          {/* {needsAttention() && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="outline" className="text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">
                需要关注
              </Badge>
            </div>
          )} */}

          {/* 死亡状态标识 - 已隐藏 */}
          {/* {item.status === "死亡" && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="destructive" className="text-xs font-medium">
                已死亡
              </Badge>
            </div>
          )} */}

          {/* 上方区域：左侧动物图标，右侧基本信息 */}
          <div className="flex items-start gap-3 pt-5 px-5 pb-2.5">
            {/* 左侧：动物图标 */}
            <div className="w-14 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center text-2xl">
              {getAnimalIcon(item.species)}
            </div>

            {/* 右侧：基本信息 */}
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-base transition-colors duration-300 group-hover:text-primary truncate leading-tight",
                "text-gray-900"
              )}>
                {item.animalId}
              </h3>
              <p className={cn(
                "text-sm mt-1 truncate",
                "text-muted-foreground"
              )}>
                {item.species} · {item.strain}
              </p>
              <p className={cn(
                "text-sm mt-1 truncate",
                "text-muted-foreground"
              )}>
                {item.gender} · {item.age}周
              </p>
            </div>
          </div>

          {/* 下方区域：健康状态、体重和位置 */}
          <div className="px-5 pb-4 space-y-2">
            {/* 健康状态 */}
            <div className="flex items-center justify-between text-sm pt-2.5 border-t border-gray-100">
              <span className={cn(
                "text-muted-foreground"
              )}>健康状态:</span>
              <span className={cn(
                "font-medium",
                getHealthStatusColor()
              )}>
                {item.status}
              </span>
            </div>
            
            {/* 体重 */}
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm",
                "text-muted-foreground"
              )}>
                体重:
              </span>
              <span className={cn(
                "text-sm font-medium",
                "text-gray-900"
              )}>
                {item.weight}g
              </span>
            </div>

            {/* 饲养位置 */}
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm",
                "text-muted-foreground"
              )}>
                位置:
              </span>
              <span className={cn(
                "text-sm font-medium",
                "text-gray-900"
              )}>
                {item.location}
              </span>
            </div>
          </div>
        </Card>
      </ElegantCardSelection>
    </div>
  );
};

// 动物档案自定义卡片渲染器
export const animalCustomCardRenderer = (
  item: any, 
  actions: any[], 
  isSelected: boolean, 
  onToggleSelect: (selected: boolean) => void,
  onRowActionClick?: (action: any, item: any) => void
) => {
  // 处理操作按钮点击事件
  const processedActions = actions.map(action => ({
    ...action,
    onClick: (item: any, e: React.MouseEvent) => {
      if (onRowActionClick) {
        onRowActionClick(action.id, item);
      } else if (action.onClick) {
        action.onClick(item, e);
      }
    }
  }));

  return (
    <AnimalCard 
      item={item}
      actions={processedActions}
      isSelected={isSelected}
      onToggleSelect={onToggleSelect}
    />
  );
}; 