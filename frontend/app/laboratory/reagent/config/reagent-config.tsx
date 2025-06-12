import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Eye,
  Pencil,
  Trash2,
  Check,
  AlertTriangle,
  Clock,
  List,
  FileText,
  BarChart,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

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
  "正常": "success",
  "低库存": "warning", 
  "缺货": "destructive",
  "已过期": "secondary",
  "维护中": "secondary",
  "故障": "destructive",
  "申领中": "warning",
  "已预约": "warning",
  "使用中": "warning",
  "清洗中": "secondary",
  "已停用": "outline",
  "待校准": "warning",
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
    label: "试剂类型",
    value: "",
    options: [
      { id: "1", label: "有机溶剂", value: "有机溶剂" },
      { id: "2", label: "无机化合物", value: "无机化合物" },
      { id: "3", label: "有机酸", value: "有机酸" },
      { id: "4", label: "无机盐", value: "无机盐" },
      { id: "5", label: "无机碱", value: "无机碱" },
      { id: "6", label: "同位素试剂", value: "同位素试剂" },
    ],
    category: "default",
  },
  {
    id: "status",
    label: "库存状态",
    value: "",
    options: [
      { id: "1", label: "正常", value: "正常" },
      { id: "2", label: "低库存", value: "低库存" },
      { id: "3", label: "缺货", value: "缺货" },
      { id: "4", label: "已过期", value: "已过期" },
    ],
    category: "default",
  },
  {
    id: "department",
    label: "所属部门",
    value: "",
    options: [
      { id: "1", label: "化学实验室", value: "化学实验室" },
      { id: "2", label: "有机化学实验室", value: "有机化学实验室" },
      { id: "3", label: "分析化学实验室", value: "分析化学实验室" },
      { id: "4", label: "物理化学实验室", value: "物理化学实验室" },
      { id: "5", label: "无机化学实验室", value: "无机化学实验室" },
      { id: "6", label: "仪器分析实验室", value: "仪器分析实验室" },
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
        label: "试剂名称",
        type: "text",
        placeholder: "请输入试剂名称关键词",
      },
      {
        id: "casNumber",
        label: "CAS号",
        type: "text",
        placeholder: "请输入CAS号",
      },
      {
        id: "catalogNumber",
        label: "目录号",
        type: "text",
        placeholder: "请输入目录号",
      },
    ],
  },
  {
    id: "storage",
    title: "存储信息",
    fields: [
      {
        id: "location",
        label: "存放位置",
        type: "select",
        options: [
          { value: "A栋冰箱", label: "A栋冰箱" },
          { value: "B栋试剂柜", label: "B栋试剂柜" },
          { value: "C栋危化品柜", label: "C栋危化品柜" },
          { value: "D栋常温架", label: "D栋常温架" },
        ],
      },
      {
        id: "storageCondition",
        label: "存储条件",
        type: "select",
        options: [
          { value: "常温", label: "常温" },
          { value: "4℃", label: "4℃" },
          { value: "-20℃", label: "-20℃" },
          { value: "-80℃", label: "-80℃" },
        ],
      },
      {
        id: "dangerLevel",
        label: "危险等级",
        type: "select",
        options: [
          { value: "低", label: "低" },
          { value: "中", label: "中" },
          { value: "高", label: "高" },
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
        id: "expiryDateRange",
        label: "有效期范围",
        type: "date-range",
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
    id: "smart_desc",
    label: "🧪 智能排序 (推荐)",
    field: "smart",
    direction: "desc" as const,
    description: "安全等级 → 有效期 → 库存状态 → 使用频率 → 名称"
  },
  {
    id: "safety_desc",
    label: "安全等级 (危险品优先)",
    field: "dangerLevel",
    direction: "desc" as const,
  },
  {
    id: "expiry_asc",
    label: "有效期 (即将过期优先)",
    field: "expiryDate",
    direction: "asc" as const,
  },
  {
    id: "stock_asc",
    label: "库存状态 (不足优先)",
    field: "stockLevel",
    direction: "asc" as const,
  },
  {
    id: "usage_desc",
    label: "使用频率 (常用优先)",
    field: "usageFrequency",
    direction: "desc" as const,
  },
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
    id: "expiryDate_asc",
    label: "过期日期 (最早优先)",
    field: "expiryDate",
    direction: "asc" as const,
  },
  {
    id: "expiryDate_desc",
    label: "过期日期 (最晚优先)",
    field: "expiryDate",
    direction: "desc" as const,
  },
  {
    id: "purchaseDate_desc",
    label: "购置日期 (最新优先)",
    field: "purchaseDate",
    direction: "desc" as const,
  },
  {
    id: "purchaseDate_asc",
    label: "购置日期 (最早优先)",
    field: "purchaseDate",
    direction: "asc" as const,
  },
]

// 试剂特定列配置
export const reagentColumns = [
  {
    id: "image",
    header: "图片",
    cell: (item: any) => (
      <div className="relative w-16 h-12 rounded-md overflow-hidden bg-white">
        <div className="w-full h-full flex items-center justify-center">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={`${item.name} 化学结构`}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="w-5 h-6 relative">
                        <div className="w-full h-5 bg-gradient-to-b from-blue-200 to-blue-300 rounded border border-blue-400 relative">
                          <div className="absolute inset-x-0.5 top-0.5 bottom-0.5 bg-gradient-to-b from-blue-100 to-blue-200 rounded-sm opacity-80"></div>
                          <div className="absolute inset-x-0.5 bottom-0.5 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm opacity-70" style="height: ${Math.max(20, (item.currentAmount / item.initialAmount) * 80)}%"></div>
                        </div>
                        <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-2.5 h-1 bg-gray-400 rounded-t border border-gray-500"></div>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-5 h-6 relative">
                <div className="w-full h-5 bg-gradient-to-b from-blue-200 to-blue-300 rounded border border-blue-400 relative">
                  {/* 瓶身 */}
                  <div className="absolute inset-x-0.5 top-0.5 bottom-0.5 bg-gradient-to-b from-blue-100 to-blue-200 rounded-sm opacity-80"></div>
                  {/* 液体 */}
                  <div 
                    className="absolute inset-x-0.5 bottom-0.5 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm opacity-70"
                    style={{ height: `${Math.max(20, (item.currentAmount / item.initialAmount) * 80)}%` }}
                  ></div>
                </div>
                {/* 瓶盖 */}
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-2.5 h-1 bg-gray-400 rounded-t border border-gray-500"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    id: "name",
    header: "试剂名称",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
      </div>
    ),
  },
  {
    id: "category",
    header: "试剂类型",
    cell: (item: any) => <span>{item.category}</span>,
  },
  {
    id: "status",
    header: "库存状态",
    cell: (item: any) => <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>,
  },
  {
    id: "currentAmount",
    header: "库存量",
    cell: (item: any) => (
      <span className={cn(
        "font-medium",
        item.currentAmount <= item.initialAmount * 0.2 ? "text-red-600" : 
        item.currentAmount <= item.initialAmount * 0.5 ? "text-yellow-600" : "text-green-600"
      )}>
        {item.currentAmount}{item.unit}
      </span>
    ),
  },
  {
    id: "specification",
    header: "规格",
    cell: (item: any) => <span>{item.specification}</span>,
  },
  {
    id: "department",
    header: "所属部门",
    cell: (item: any) => <span>{item.department}</span>,
  },
  {
    id: "location",
    header: "存放位置",
    cell: (item: any) => <span>{item.location}</span>,
  },
  {
    id: "expiryDate",
    header: "有效期至",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        {new Date(item.expiryDate) < new Date() ? (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            已过期
          </Badge>
        ) : (
          <span>{format(new Date(item.expiryDate), "yyyy/MM/dd")}</span>
        )}
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

// 试剂卡片字段配置
export const reagentCardFields = [
  { 
    id: "category", 
    label: "试剂类型", 
    value: (item: any) => item.category
  },
  { 
    id: "status", 
    label: "库存状态", 
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
    id: "expiryDate", 
    label: "有效期至", 
    value: (item: any) => format(new Date(item.expiryDate), "yyyy/MM/dd")
  },
  { 
    id: "currentAmount", 
    label: "当前库存", 
    value: (item: any) => `${item.currentAmount}${item.unit}`
  }
]

// 试剂特定操作配置
export const reagentActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      // 使用路由跳转到试剂详情页
      const url = `/laboratory/reagent/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑试剂",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      // 跳转到试剂编辑页面
      const url = `/laboratory/reagent/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "stockIn",
    label: "试剂入库",
    icon: <FileText className="h-4 w-4" />,
    onClick: (item: any, onOpenStockInDialog?: (reagent: any) => void) => {
      // 如果提供了弹框回调函数，则使用弹框
      if (onOpenStockInDialog) {
        onOpenStockInDialog(item);
      } else {
        // 否则跳转到入库页面
        const url = `/laboratory/reagent/purchase/${item.id}`;
        window.open(url, "_self");
      }
    },
  },
  {
    id: "apply",
    label: "试剂申领",
    icon: <FileText className="h-4 w-4" />,
    onClick: (item: any, onOpenStockInDialog?: (reagent: any) => void, onOpenApplyDialog?: (reagent: any) => void) => {
      // 如果提供了申领弹框回调函数，则使用弹框
      if (onOpenApplyDialog) {
        onOpenApplyDialog(item);
      } else {
        // 否则跳转到申领页面
        const url = `/laboratory/reagent/apply/${item.id}`;
        window.open(url, "_self");
      }
    },
  },
  {
    id: "delete",
    label: "删除试剂",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
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
    id: "outOfStock",
    label: "标记用完",
    icon: <Check className="h-4 w-4" />,
  },
  {
    id: "expired",
    label: "标记过期",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 试剂卡片组件
const ReagentCard = ({ 
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
  // 获取存储条件图标
  const getStorageIcon = (condition: string) => {
    if (condition.includes("℃")) {
      return "❄️";
    } else if (condition === "常温") {
      return "🌡️";
    }
    return "📦";
  };

  // 检查是否即将过期（30天内）
  const isExpiringSoon = () => {
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  // 1. 有效期显示逻辑 - 过期判断条件
  const isExpired = () => {
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    return expiryDate < today || item.status === "已过期";
  };

  // 2. 库存量显示逻辑 - 库存状态判断条件
  const getStockStatus = () => {
    if (item.currentAmount <= 0) {
      return { text: "无库存", color: "text-red-600 bg-red-50" };
    } else if (item.currentAmount <= item.initialAmount * 0.5) {
      return { text: "库存不足", color: "text-orange-600 bg-orange-50" };
    } else {
      return { text: "库存充足", color: "text-green-600 bg-green-50" };
    }
  };

  // 3. 申领功能逻辑 - 可申领条件
  const canApply = () => {
    return !isExpired() && item.currentAmount > 0;
  };

  const stockStatus = getStockStatus();

  // 4. 卡片整体样式逻辑
  const getCardStyles = () => {
    if (isExpired()) {
      return "border-red-300 bg-red-50/30";
    } else if (isExpiringSoon()) {
      return "border-yellow-300 bg-yellow-50/30";
    }
    return "";
  };

  // 5. 悬停提示逻辑
  const getTooltipText = () => {
    if (isExpired()) {
      return "此试剂已过期，无法申领";
    } else if (item.currentAmount <= 0) {
      return "库存不足，无法申领";
    }
    return "";
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer border transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/20 relative",
        isSelected && "ring-2 ring-primary border-primary",
        getCardStyles()
      )}
      title={getTooltipText()}
    >
      {/* 右上角操作菜单 */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
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

      {/* 左上角过期状态标识 */}
      {isExpired() && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="destructive" className="text-xs font-medium">
            已过期
          </Badge>
        </div>
      )}

      {/* 即将过期提醒（未过期且30天内过期时显示） */}
      {isExpiringSoon() && !isExpired() && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="outline" className="text-xs font-medium bg-yellow-100 text-yellow-700 border-yellow-300">
            即将过期
          </Badge>
        </div>
      )}

      {/* 上方区域：左侧图片，右侧试剂名称 */}
      <div className="flex items-start gap-3 p-3 pb-2">
        {/* 左侧：试剂瓶图标 */}
        <div className="w-14 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0 group">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={`${item.name} 化学结构`}
              className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="w-5 h-6 relative">
                        <div className="w-full h-5 bg-gradient-to-b from-blue-200 to-blue-300 rounded border border-blue-400 relative">
                          <div className="absolute inset-x-0.5 top-0.5 bottom-0.5 bg-gradient-to-b from-blue-100 to-blue-200 rounded-sm opacity-80"></div>
                          <div className="absolute inset-x-0.5 bottom-0.5 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm opacity-70" style="height: ${Math.max(20, (item.currentAmount / item.initialAmount) * 80)}%"></div>
                        </div>
                        <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-2.5 h-1 bg-gray-400 rounded-t border border-gray-500"></div>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-5 h-6 relative">
                <div className="w-full h-5 bg-gradient-to-b from-blue-200 to-blue-300 rounded border border-blue-400 relative">
                  {/* 瓶身 */}
                  <div className="absolute inset-x-0.5 top-0.5 bottom-0.5 bg-gradient-to-b from-blue-100 to-blue-200 rounded-sm opacity-80"></div>
                  {/* 液体 - 根据库存量显示高度 */}
                  <div 
                    className="absolute inset-x-0.5 bottom-0.5 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm opacity-70"
                    style={{ height: `${Math.max(20, (item.currentAmount / item.initialAmount) * 80)}%` }}
                  ></div>
                </div>
                {/* 瓶盖 */}
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-2.5 h-1 bg-gray-400 rounded-t border border-gray-500"></div>
              </div>
            </div>
          )}
        </div>

        {/* 右侧：试剂名称和别名 */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-base transition-colors duration-300 group-hover:text-primary truncate leading-tight",
            "text-gray-900"
          )}>
            {item.name}
          </h3>
          {/* 别名作为副标题 */}
          {item.alias && (
            <p className={cn(
              "text-sm mt-1 truncate",
              "text-muted-foreground"
            )}>
              别名: {item.alias}
            </p>
          )}
          {/* 线性分子式 */}
          {item.linearFormula && (
            <p className={cn(
              "text-sm mt-1 truncate",
              "text-muted-foreground"
            )}>
              线性分子式: {item.linearFormula}
            </p>
          )}
        </div>
      </div>

      {/* 下方区域：有效期、库存量和危险标签 */}
      <div className="px-3 mx-3 space-y-2">
        {/* 1. 有效期显示逻辑 - 有效期字段颜色规则 */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
          <span className={cn(
            "text-muted-foreground"
          )}>有效期:</span>
          <span className={cn(
            "font-medium",
            isExpired() ? "text-red-600" : "text-green-600"
          )}>
            {format(new Date(item.expiryDate), "yyyy/MM/dd")}
          </span>
        </div>
        
        {/* 库存量 */}
        <div className="flex items-center justify-between pb-3">
          <span className={cn(
            "text-sm",
            "text-muted-foreground"
          )}>
            库存量:
          </span>
          <span className={cn(
            "text-sm font-medium",
            item.currentAmount <= 0 ? "text-red-600" : 
            item.currentAmount <= item.initialAmount * 0.5 ? "text-orange-600" : "text-green-600"
          )}>
            {item.currentAmount <= 0 ? "无库存" : `${item.currentAmount}${item.unit}`}
          </span>
        </div>
      </div>

      {/* 用户体验优化 - 鼠标悬停提示 */}
      {getTooltipText() && (
        <div className="absolute inset-0 pointer-events-none" title={getTooltipText()}>
        </div>
      )}
    </Card>
  );
};

// 试剂自定义卡片渲染器
export const reagentCustomCardRenderer = (
  item: any, 
  actions: any[], 
  isSelected: boolean, 
  onToggleSelect: (selected: boolean) => void,
  onRowActionClick?: (action: any, item: any) => void,
  onOpenStockInDialog?: (reagent: any) => void,
  onOpenApplyDialog?: (reagent: any) => void
) => {
  // 处理操作按钮点击事件，优先使用onRowActionClick
  const processedActions = actions.map(action => ({
    ...action,
    onClick: (item: any, e: React.MouseEvent) => {
      if (onRowActionClick) {
        onRowActionClick(action.id, item);
      } else if (action.onClick) {
        // 对于试剂入库操作，传递弹框回调函数
        if (action.id === "stockIn" && onOpenStockInDialog) {
          action.onClick(item, onOpenStockInDialog);
        } else if (action.id === "apply" && onOpenApplyDialog) {
          // 对于试剂申领操作，传递弹框回调函数
          action.onClick(item, onOpenStockInDialog, onOpenApplyDialog);
        } else {
          action.onClick(item, e);
        }
      }
    }
  }));

  return (
    <ReagentCard 
      item={item}
      actions={processedActions}
      isSelected={isSelected}
      onToggleSelect={onToggleSelect}
    />
  );
}; 