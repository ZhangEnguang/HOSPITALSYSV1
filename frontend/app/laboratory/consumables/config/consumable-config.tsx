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
  Package,
  MoreVertical,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    role: "耗材管理员",
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
  "充足": "success",
  "库存不足": "warning", 
  "缺货": "destructive",
  "已停用": "outline",
  "待采购": "secondary",
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
      return <Badge variant={(statusColors[status] || "secondary") as any}>{status}</Badge>
    },
  },
]

// 快速筛选配置
export const quickFilters = [
  {
    id: "category",
    label: "耗材类型",
    value: "",
    options: [
      { id: "1", label: "玻璃器皿", value: "玻璃器皿" },
      { id: "2", label: "塑料器皿", value: "塑料器皿" },
      { id: "3", label: "移液器材", value: "移液器材" },
      { id: "4", label: "防护用品", value: "防护用品" },
      { id: "5", label: "培养耗材", value: "培养耗材" },
      { id: "6", label: "分析耗材", value: "分析耗材" },
      { id: "7", label: "通用耗材", value: "通用耗材" },
    ],
    category: "default",
  },
  {
    id: "status",
    label: "库存状态",
    value: "",
    options: [
      { id: "1", label: "充足", value: "充足" },
      { id: "2", label: "库存不足", value: "库存不足" },
      { id: "3", label: "缺货", value: "缺货" },
      { id: "4", label: "已停用", value: "已停用" },
      { id: "5", label: "待采购", value: "待采购" },
    ],
    category: "default",
  },
  {
    id: "department",
    label: "所属部门",
    value: "",
    options: [
      { id: "1", label: "生物实验室", value: "生物实验室" },
      { id: "2", label: "化学实验室", value: "化学实验室" },
      { id: "3", label: "物理实验室", value: "物理实验室" },
      { id: "4", label: "药学实验室", value: "药学实验室" },
      { id: "5", label: "材料实验室", value: "材料实验室" },
      { id: "6", label: "分析实验室", value: "分析实验室" },
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
        label: "耗材名称",
        type: "text",
        placeholder: "请输入耗材名称关键词",
      },
      {
        id: "model",
        label: "型号规格",
        type: "text",
        placeholder: "请输入型号规格",
      },
      {
        id: "manufacturer",
        label: "生产厂家",
        type: "text",
        placeholder: "请输入生产厂家",
      },
    ],
  },
  {
    id: "inventory",
    title: "库存信息",
    fields: [
      {
        id: "location",
        label: "存放位置",
        type: "select",
        options: [
          { value: "A栋储物柜", label: "A栋储物柜" },
          { value: "B栋试剂柜", label: "B栋试剂柜" },
          { value: "C栋专用柜", label: "C栋专用柜" },
          { value: "D栋临时存放", label: "D栋临时存放" },
        ],
      },
      {
        id: "stockRange",
        label: "库存范围",
        type: "number-range",
        placeholder: "请输入库存数量范围",
      },
      {
        id: "priceRange",
        label: "单价范围",
        type: "number-range",
        placeholder: "请输入单价范围",
      },
    ],
  },
  {
    id: "purchase",
    title: "采购信息",
    fields: [
      {
        id: "purchaseDateRange",
        label: "采购日期范围",
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
    label: "采购日期 (最早优先)",
    field: "purchaseDate",
    direction: "asc" as const,
  },
  {
    id: "purchaseDate_desc",
    label: "采购日期 (最近优先)",
    field: "purchaseDate",
    direction: "desc" as const,
  },
  {
    id: "currentStock_asc",
    label: "库存 (从少到多)",
    field: "currentStock",
    direction: "asc" as const,
  },
  {
    id: "currentStock_desc",
    label: "库存 (从多到少)",
    field: "currentStock",
    direction: "desc" as const,
  },
  {
    id: "unitPrice_asc",
    label: "单价 (从低到高)",
    field: "unitPrice",
    direction: "asc" as const,
  },
  {
    id: "unitPrice_desc",
    label: "单价 (从高到低)",
    field: "unitPrice",
    direction: "desc" as const,
  },
]

// 耗材特定列配置
export const consumableColumns = [
  {
    id: "image",
    header: "图片",
    cell: (item: any) => (
      <div className="relative w-16 h-12 rounded-md overflow-hidden bg-white">
        <div className="w-full h-full flex items-center justify-center">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={`${item.name} 产品图片`}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div className="flex items-center justify-center w-full h-full">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    id: "name",
    header: "耗材名称",
    cell: (item: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.model}</span>
      </div>
    ),
  },
  {
    id: "category",
    header: "耗材类型",
    cell: (item: any) => <span>{item.category}</span>,
  },
  {
    id: "status",
    header: "库存状态",
    cell: (item: any) => <Badge variant={(statusColors[item.status] || "secondary") as any}>{item.status}</Badge>,
  },
  {
    id: "currentStock",
    header: "当前库存",
    cell: (item: any) => (
      <div className="flex items-center gap-1">
        <span className={item.currentStock <= item.minStock ? "text-red-600 font-medium" : ""}>
          {item.currentStock}
        </span>
        <span className="text-muted-foreground">{item.unit}</span>
      </div>
    ),
  },
  {
    id: "unitPrice",
    header: "单价",
    cell: (item: any) => <span>¥{item.unitPrice}</span>,
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
    id: "purchaseDate",
    header: "采购日期",
    cell: (item: any) => <span>{format(new Date(item.purchaseDate), "yyyy/MM/dd")}</span>,
  },
  {
    id: "manager",
    header: "负责人",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.manager.avatar} />
          <AvatarFallback>{item.manager.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{item.manager.name}</span>
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
]

// 耗材卡片字段配置
export const consumableCardFields = [
  { 
    id: "model", 
    label: "型号规格", 
    value: (item: any) => item.model
  },
  { 
    id: "category", 
    label: "耗材类型", 
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
    id: "currentStock", 
    label: "当前库存", 
    value: (item: any) => (
      <span className={item.currentStock <= item.minStock ? "text-red-600 font-medium" : ""}>
        {item.currentStock} {item.unit}
      </span>
    )
  },
  { 
    id: "unitPrice", 
    label: "单价", 
    value: (item: any) => `¥${item.unitPrice}`
  },
  { 
    id: "department", 
    label: "所属部门", 
    value: (item: any) => item.department
  }
]

// 耗材特定操作配置
export const consumableActions = [
  {
    id: "view",
    label: "查看详情",
    icon: <Eye className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/consumables/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "edit",
    label: "编辑耗材",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (item: any) => {
      const url = `/laboratory/consumables/edit/${item.id}`;
      window.open(url, "_self");
    },
  },
  {
    id: "stockIn",
    label: "入库耗材",
    icon: <Package className="h-4 w-4" />,
    onClick: (item: any, onOpenStockInDialog?: (consumable: any) => void) => {
      // 如果提供了弹框回调函数，则使用弹框
      if (onOpenStockInDialog) {
        onOpenStockInDialog(item);
      } else {
        // 否则跳转到入库页面
        const url = `/laboratory/consumables/stockin/${item.id}`;
        window.open(url, "_self");
      }
    },
  },
  {
    id: "apply",
    label: "申领耗材",
    icon: <Package className="h-4 w-4" />,
    onClick: (item: any, onOpenStockInDialog?: (consumable: any) => void, onOpenApplyDialog?: (consumable: any) => void) => {
      // 如果提供了申领弹框回调函数，则使用弹框
      if (onOpenApplyDialog) {
        onOpenApplyDialog(item);
      } else {
        // 否则跳转到申领页面
        const url = `/laboratory/consumables/apply/${item.id}`;
        window.open(url, "_self");
      }
    },
  },
  {
    id: "delete",
    label: "删除耗材",
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
    label: "标记缺货",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    id: "lowStock",
    label: "标记库存不足",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "delete",
    label: "批量删除",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
  },
]

// 耗材卡片组件
const ConsumableCard = ({ 
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
  // 处理别名显示，超长时省略
  const formatAliases = (aliases: string[], maxLength: number = 30) => {
    if (!aliases || aliases.length === 0) return '';
    
    const fullText = aliases.join('、');
    if (fullText.length <= maxLength) {
      return fullText;
    }
    
    // 逐个添加别名，直到超过长度限制
    let result = '';
    for (let i = 0; i < aliases.length; i++) {
      const newText = result ? `${result}、${aliases[i]}` : aliases[i];
      if (newText.length > maxLength - 3) { // 预留省略号的空间
        result = result || aliases[0]; // 至少显示一个别名
        break;
      }
      result = newText;
    }
    
    return `${result}...`;
  };

  // 获取库存状态颜色和文本
  const getStockLevelInfo = (status: string) => {
    switch (status) {
      case "缺货":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          text: "缺货"
        };
      case "库存不足":
        return {
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          text: "库存不足"
        };
      case "充足":
        return {
          color: "bg-green-100 text-green-700 border-green-200",
          text: "库存充足"
        };
      case "已停用":
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          text: "已停用"
        };
      case "待采购":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          text: "待采购"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          text: "正常"
        };
    }
  };

  // 检查是否库存不足
  const isLowStock = () => {
    return item.currentStock <= item.minStock || item.status === "库存不足";
  };

  // 检查是否缺货
  const isOutOfStock = () => {
    return item.currentStock <= 0 || item.status === "缺货";
  };

  // 检查是否已停用
  const isDisabled = () => {
    return item.status === "已停用";
  };

  // 检查是否可以申领
  const canApply = () => {
    return !isOutOfStock() && !isDisabled();
  };

  const stockInfo = getStockLevelInfo(item.status);

  return (
    <Card 
      className={cn(
        "group cursor-pointer border transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/20 relative",
        isSelected && "ring-2 ring-primary border-primary",
        // 已停用耗材样式
        isDisabled() && "opacity-60 bg-gray-50/50 border-gray-300",
        // 缺货提示
        isOutOfStock() && !isDisabled() && "border-red-300 bg-red-50/30",
        // 库存不足提示
        isLowStock() && !isOutOfStock() && !isDisabled() && "border-yellow-300 bg-yellow-50/30"
      )}
    >
      {/* 停用遮罩 */}
      {isDisabled() && (
        <div className="absolute inset-0 bg-gray-200/30 rounded-lg pointer-events-none" />
      )}

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
              // 已停用耗材禁用申领操作
              const isActionDisabled = isDisabled() && action.id === "apply";
              
              return (
                <DropdownMenuItem 
                  key={action.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isActionDisabled && action.onClick) {
                      action.onClick(item, e);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    action.variant === "destructive" && "text-red-600 focus:text-red-600",
                    isActionDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={isActionDisabled}
                >
                  {action.icon}
                  <span>
                    {isActionDisabled && action.id === "apply" ? "耗材已停用" : action.label}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 状态标签 */}
      {isOutOfStock() && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="destructive" className="text-xs font-medium">
            缺货
          </Badge>
        </div>
      )}

      {/* 库存不足提醒 */}
      {isLowStock() && !isOutOfStock() && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="outline" className="text-xs font-medium bg-yellow-100 text-yellow-700 border-yellow-300">
            库存不足
          </Badge>
        </div>
      )}

      {/* 已停用标签 */}
      {isDisabled() && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="outline" className="text-xs font-medium bg-gray-100 text-gray-700 border-gray-300">
            已停用
          </Badge>
        </div>
      )}

      {/* 上方区域：左侧图片，右侧耗材名称 */}
      <div className="flex items-start gap-3 p-3 pb-2">
        {/* 左侧：耗材图标 */}
        <div className="w-14 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0 group">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={`${item.name}`}
              className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-[1.2]">
                      <div className="flex flex-col items-center justify-center space-y-1 text-gray-400">
                        <div className="w-8 h-10 relative">
                          <div className="w-full h-8 bg-gradient-to-b from-gray-200 to-gray-300 rounded border border-gray-400 relative shadow-sm">
                            <div className="absolute inset-x-1 top-1 bottom-1 bg-gradient-to-b from-gray-100 to-gray-200 rounded-sm opacity-80"></div>
                            <div className="absolute inset-x-1 bottom-1 bg-gradient-to-t from-gray-500 to-gray-400 rounded-sm opacity-70" style="height: ${Math.max(20, (item.currentStock / item.maxStock) * 80)}%"></div>
                          </div>
                          <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 bg-gray-400 rounded-t border border-gray-500"></div>
                        </div>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-[1.2]">
              <div className="flex flex-col items-center justify-center space-y-1 text-gray-400">
                <div className="w-8 h-10 relative">
                  <div className="w-full h-8 bg-gradient-to-b from-gray-200 to-gray-300 rounded border border-gray-400 relative shadow-sm">
                    {/* 容器 */}
                    <div className="absolute inset-x-1 top-1 bottom-1 bg-gradient-to-b from-gray-100 to-gray-200 rounded-sm opacity-80"></div>
                    {/* 内容物 */}
                    <div 
                      className="absolute inset-x-1 bottom-1 bg-gradient-to-t from-gray-500 to-gray-400 rounded-sm opacity-70"
                      style={{ height: `${Math.max(20, (item.currentStock / item.maxStock) * 80)}%` }}
                    ></div>
                  </div>
                  {/* 盖子 */}
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 bg-gray-400 rounded-t border border-gray-500"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 右侧：耗材名称和信息 */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-base transition-colors duration-300 group-hover:text-primary truncate leading-tight",
            isDisabled() ? "text-gray-500" : "text-gray-900"
          )}>
            {item.name}
          </h3>
          
          {/* 别名 */}
          {item.alias && item.alias.length > 0 && (
            <p 
              className={cn(
                "text-sm mt-1 truncate cursor-help",
                isDisabled() ? "text-gray-400" : "text-muted-foreground"
              )}
              title={`别名: ${item.alias.join('、')}`}
            >
              别名: {formatAliases(item.alias)}
            </p>
          )}
          
          {/* 规格 */}
          {item.model && (
            <p className={cn(
              "text-sm mt-1 truncate",
              isDisabled() ? "text-gray-400" : "text-muted-foreground"
            )}>
              规格: {item.model}
            </p>
          )}
        </div>
      </div>

      {/* 下方区域：采购日期、库存量和状态标签 */}
      <div className="px-3 mx-3 space-y-2">
        {/* 采购日期 */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
          <span className={cn(
            isDisabled() ? "text-gray-400" : "text-muted-foreground"
          )}>采购日期:</span>
          <span className={cn(
            "font-medium",
            isDisabled() ? "text-gray-500" : "text-gray-900"
          )}>
            {format(new Date(item.purchaseDate), "yyyy/MM/dd")}
          </span>
        </div>
        
        {/* 库存量和状态标签 */}
        <div className="flex items-center justify-between pb-5">
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-sm",
              isDisabled() ? "text-gray-400" : "text-muted-foreground"
            )}>
              库存量:
            </span>
            <span className={cn(
              "text-sm font-medium",
              isDisabled() ? "text-gray-500" :
              isOutOfStock() ? "text-red-600" : 
              isLowStock() ? "text-yellow-600" : "text-green-600"
            )}>
              {item.currentStock}{item.unit}
            </span>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "font-medium text-xs",
              isDisabled() ? `${stockInfo.color} opacity-70` : stockInfo.color
            )}
          >
            {stockInfo.text}
          </Badge>
        </div>
      </div>

      {/* 鼠标悬停提示 */}
      {isDisabled() && (
        <div className="absolute inset-0 pointer-events-none" title="此耗材已停用，无法申领">
        </div>
      )}
    </Card>
  );
};

// 耗材自定义卡片渲染器
export const consumableCustomCardRenderer = (
  item: any, 
  actions: any[], 
  isSelected: boolean, 
  onToggleSelect: (selected: boolean) => void,
  onRowActionClick?: (action: any, item: any) => void,
  onOpenStockInDialog?: (consumable: any) => void,
  onOpenApplyDialog?: (consumable: any) => void
) => {
  // 处理操作按钮点击事件，优先使用onRowActionClick
  const processedActions = actions.map(action => ({
    ...action,
    onClick: (item: any, e: React.MouseEvent) => {
      if (onRowActionClick) {
        onRowActionClick(action.id, item);
      } else if (action.onClick) {
        // 对于耗材入库操作，传递弹框回调函数
        if (action.id === "stockIn" && onOpenStockInDialog) {
          action.onClick(item, onOpenStockInDialog);
        } else if (action.id === "apply" && onOpenApplyDialog) {
          // 对于耗材申领操作，传递弹框回调函数
          action.onClick(item, onOpenStockInDialog, onOpenApplyDialog);
        } else {
          action.onClick(item, e);
        }
      }
    }
  }));

  return (
    <ConsumableCard 
      item={item}
      actions={processedActions}
      isSelected={isSelected}
      onToggleSelect={onToggleSelect}
    />
  );
}; 