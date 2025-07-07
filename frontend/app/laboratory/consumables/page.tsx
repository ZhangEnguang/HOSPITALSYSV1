"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus, X, AlertTriangle, CheckCircle, Trash } from "lucide-react"
import {
  quickFilters,
  advancedFilters,
  sortOptions,
  tableColumns,
  cardFields,
  tableActions,
  batchActions,
  statusColors,
  // 导入特定耗材类型的列和操作
  consumableColumns,
  consumableActions,
  // 导入特定耗材类型的卡片字段
  consumableCardFields,
  // 导入自定义卡片渲染器
  consumableCustomCardRenderer,
} from "./config/consumable-config"
import { allDemoConsumableItems } from "./data/consumable-demo-data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { ConsumableStockInDialog } from "./components/consumable-stock-in-dialog"
import { ConsumableApplyDialog } from "./components/consumable-apply-dialog"
import { ConsumableUnavailableDialog } from "./components/consumable-unavailable-dialog"

function ConsumableContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [consumableItems, setConsumableItems] = useState(allDemoConsumableItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("smart_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    model: true,
    category: true,
    status: true,
    department: true,
    location: true,
    expiryDate: true,
    currentStock: true,
    unitPrice: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  // 入库弹框状态
  const [stockInDialogOpen, setStockInDialogOpen] = useState(false)
  const [selectedConsumableForStockIn, setSelectedConsumableForStockIn] = useState<any>(null)

  // 申领弹框状态
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [selectedConsumableForApply, setSelectedConsumableForApply] = useState<any>(null)

  // 不可申领弹框状态
  const [unavailableDialogOpen, setUnavailableDialogOpen] = useState(false)
  const [selectedConsumableForUnavailable, setSelectedConsumableForUnavailable] = useState<any>(null)

  // 过滤和排序数据
  const filteredConsumableItems = consumableItems
    .filter((item) => {
      // 搜索过滤
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.model.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // 快速筛选
      if (
        filterValues.category &&
        filterValues.category !== "" &&
        item.category !== filterValues.category
      ) {
        return false
      }

      if (filterValues.status && filterValues.status !== "" && item.status !== filterValues.status) {
        return false
      }

      if (filterValues.department && filterValues.department !== "" && item.department !== filterValues.department) {
        return false
      }

      // 高级筛选
      if (
        filterValues.location &&
        filterValues.location !== "" &&
        item.location !== filterValues.location
      ) {
        return false
      }

      if (filterValues.expiryDateRange?.from && filterValues.expiryDateRange?.to) {
        const expiryDate = new Date(item.expiryDate)
        const filterFrom = new Date(filterValues.expiryDateRange.from)
        const filterTo = new Date(filterValues.expiryDateRange.to)

        if (expiryDate < filterFrom || expiryDate > filterTo) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // 智能综合排序逻辑
      const option = sortOptions.find((opt) => opt.id === sortOption)
      if (!option) return 0

      const field = option.field
      const direction = option.direction
      
      // 如果选择了智能排序，使用综合排序逻辑
      if (field === "smart") {
        // 1. 主排序：库存状态优先级（紧急需求优先）
        const stockPriority = {
          "缺货": 1,        // 最高优先级：无库存，需要紧急采购
          "库存不足": 2,    // 高优先级：库存不足，需要及时补充
          "充足": 3,        // 正常优先级：库存充足
          "已过期": 4       // 最低优先级：已过期，需要处理
        }
        
        const stockA = stockPriority[a.status as keyof typeof stockPriority] || 999
        const stockB = stockPriority[b.status as keyof typeof stockPriority] || 999
        const stockDiff = stockA - stockB
        if (stockDiff !== 0) return stockDiff
        
        // 2. 次排序：使用频率（常用耗材优先）
        const usageA = a.usageFrequency || 0
        const usageB = b.usageFrequency || 0
        const usageDiff = usageB - usageA
        if (usageDiff !== 0) return usageDiff
        
        // 3. 三级排序：有效期状态（即将过期优先使用）
        const today = new Date()
        const expiryA = new Date(a.expiryDate)
        const expiryB = new Date(b.expiryDate)
        const daysToExpiryA = Math.ceil((expiryA.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const daysToExpiryB = Math.ceil((expiryB.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        // 过期的排在最前面（需要处理）
        if (daysToExpiryA <= 0 && daysToExpiryB > 0) return -1
        if (daysToExpiryA > 0 && daysToExpiryB <= 0) return 1
        if (daysToExpiryA <= 0 && daysToExpiryB <= 0) return daysToExpiryB - daysToExpiryA
        
        // 30天内过期的优先使用
        const isExpiringA = daysToExpiryA <= 30
        const isExpiringB = daysToExpiryB <= 30
        if (isExpiringA && !isExpiringB) return -1
        if (!isExpiringA && isExpiringB) return 1
        if (isExpiringA && isExpiringB) return daysToExpiryA - daysToExpiryB
        
        // 4. 四级排序：成本价值（高价值耗材优先关注）
        const valueA = a.totalValue || 0
        const valueB = b.totalValue || 0
        const valueDiff = valueB - valueA
        if (valueDiff !== 0) return valueDiff
        
        // 5. 最后排序：按名称字母顺序
        return a.name.localeCompare(b.name)
      }
      
      // 原有的单字段排序逻辑
      if (field === "stockLevel") {
        const stockPriority = { "缺货": 1, "库存不足": 2, "充足": 3, "已过期": 4 }
        const priorityA = stockPriority[a.status as keyof typeof stockPriority] || 999
        const priorityB = stockPriority[b.status as keyof typeof stockPriority] || 999
        return direction === "asc" ? priorityA - priorityB : priorityB - priorityA
      }
      
      if (field === "usageFrequency") {
        const usageA = a.usageFrequency || 0
        const usageB = b.usageFrequency || 0
        return direction === "asc" ? usageA - usageB : usageB - usageA
      }

      if (field.includes("Date")) {
        const dateA = new Date(String(a[field as keyof typeof a])).getTime()
        const dateB = new Date(String(b[field as keyof typeof b])).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }
      
      if (typeof a[field as keyof typeof a] === "string") {
        return direction === "asc" 
          ? (a[field as keyof typeof a] as string).localeCompare(b[field as keyof typeof b] as string)
          : (b[field as keyof typeof b] as string).localeCompare(a[field as keyof typeof a] as string)
      }
      
      return direction === "asc" 
        ? (a[field as keyof typeof a] as number) - (b[field as keyof typeof b] as number) 
        : (b[field as keyof typeof b] as number) - (a[field as keyof typeof a] as number)
    })

  // 调试输出：显示排序结果
  if (sortOption === "smart_desc" && filteredConsumableItems.length > 0) {
    console.log("🧪 耗材智能排序结果:")
    filteredConsumableItems.slice(0, 10).forEach((item, index) => {
      const today = new Date()
      const expiryDate = new Date(item.expiryDate)
      const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      const stockRatio = ((item.currentStock / item.maxStock) * 100).toFixed(1)
      
      console.log(`${index + 1}. ${item.name}`)
      console.log(`   库存状态: ${item.status} | 有效期: ${daysToExpiry}天 | 库存: ${stockRatio}% | 使用频率: ${item.usageFrequency || 0}`)
      console.log(`   成本价值: ¥${item.totalValue} | 类别: ${item.category}`)
    })
  }

  // 分页数据
  const totalItems = filteredConsumableItems.length

  // 处理批量操作
  const handleBatchSetNormal = () => {
    setConsumableItems(
      consumableItems.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, status: "充足" }
          : item,
      ),
    )
    setSelectedRows([])
    toast({
      title: "批量操作成功",
      description: `已将选中的${selectedRows.length}个耗材标记为充足`,
      duration: 3000,
    })
  }

  const handleBatchSetLowStock = () => {
    setConsumableItems(
      consumableItems.map((item) => (selectedRows.includes(item.id) ? { ...item, status: "库存不足" } : item)),
    )
    setSelectedRows([])
    toast({
      title: "批量操作成功",
      description: `已将选中的${selectedRows.length}个耗材标记为库存不足`,
      duration: 3000,
    })
  }

  const handleBatchSetOutOfStock = () => {
    setConsumableItems(
      consumableItems.map((item) => (selectedRows.includes(item.id) ? { ...item, status: "缺货", currentStock: 0 } : item)),
    )
    setSelectedRows([])
    toast({
      title: "批量操作成功",
      description: `已将选中的${selectedRows.length}个耗材标记为缺货`,
      duration: 3000,
    })
  }

  const handleBatchDelete = () => {
    setConsumableItems(consumableItems.filter((item) => !selectedRows.includes(item.id)))
    toast({
      title: "批量删除成功",
      description: `已删除${selectedRows.length}个耗材`,
      duration: 3000,
    })
    setSelectedRows([])
  }

  // 处理单个项目删除
  const handleDeleteItem = (item: any) => {
    // 设置要删除的项目并显示确认对话框
    setItemToDelete(item)
  }

  // 确认删除的处理函数
  const confirmDeleteItem = () => {
    if (itemToDelete) {
      setConsumableItems(consumableItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "删除成功",
        description: `耗材 "${itemToDelete.name}" 已被删除`,
        duration: 3000,
      })
      setItemToDelete(null)
    }
  }

  // 处理行操作
  const handleRowAction = (action: any, item: any) => {
    // 兼容处理：如果第一个参数是字符串，则认为是actionId
    const actionId = typeof action === 'string' ? action : action.id;
    
    if (actionId === "view") {
      router.push(`/laboratory/consumables/${item.id}`)
    } else if (actionId === "edit") {
      router.push(`/laboratory/consumables/edit/${item.id}`)
    } else if (actionId === "stockIn") {
      handleOpenStockInDialog(item)
    } else if (actionId === "apply") {
      handleOpenApplyDialog(item)
    } else if (actionId === "delete") {
      handleDeleteItem(item)
    }
  }

  // 处理入库弹框打开
  const handleOpenStockInDialog = (consumable: any) => {
    setSelectedConsumableForStockIn(consumable)
    setStockInDialogOpen(true)
  }

  // 处理申领弹框打开
  const handleOpenApplyDialog = (consumable: any) => {
    // 检查耗材数据是否有效
    if (!consumable) {
      console.error('耗材数据为空，无法打开申领弹框')
      return
    }

    // 检查耗材是否可以申领
    const canApply = () => {
      const today = new Date()
      const expiryDate = new Date(consumable.expiryDate)
      const isExpired = expiryDate < today || consumable.status === "已过期"
      const isOutOfStock = consumable.currentStock <= 0 || consumable.status === "缺货"
      
      return !isExpired && !isOutOfStock
    }

    // 如果耗材不可申领，显示不可申领弹框
    if (!canApply()) {
      setSelectedConsumableForUnavailable(consumable)
      setUnavailableDialogOpen(true)
      return
    }

    // 可以申领，打开正常申领弹框
    setSelectedConsumableForApply(consumable)
    setApplyDialogOpen(true)
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      id: "outOfStock",
      label: "标记缺货",
      icon: <X className="h-4 w-4" />,
      onClick: handleBatchSetOutOfStock,
    },
    {
      id: "lowStock",
      label: "标记库存不足",
      icon: <AlertTriangle className="h-4 w-4" />,
      onClick: handleBatchSetLowStock,
    },
    {
      id: "normal",
      label: "标记充足",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: handleBatchSetNormal,
    },
    {
      id: "delete",
      label: "批量删除",
      icon: <Trash className="h-4 w-4" />,
      variant: "destructive",
      onClick: handleBatchDelete,
    },
  ]

  return (
    <div className="space-y-6">
      <DataList
        title="耗材管理"
        data={filteredConsumableItems}
        searchValue={searchTerm}
        searchPlaceholder="搜索耗材名称、型号或描述..."
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
        onAddNew={() => router.push("/laboratory/consumables/create")}
        onAIAssist={undefined}
        addButtonLabel="新增耗材"
        settingsButtonLabel={undefined}
        onOpenSettings={undefined}
        quickFilters={quickFilters}
        onQuickFilterChange={(filterId, value) =>
          setFilterValues((prev) => ({ ...prev, [filterId]: value }))
        }
        quickFilterValues={filterValues}
        onAdvancedFilter={(values) => setFilterValues(values)}
        sortOptions={sortOptions as any}
        activeSortOption={sortOption}
        onSortChange={setSortOption}
        defaultViewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode as "grid" | "list")}
        tableColumns={consumableColumns as any}
        tableActions={consumableActions}
        cardActions={consumableActions}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        cardFields={consumableCardFields}
        customCardRenderer={(item, actions, isSelected, onToggleSelect, onRowActionClick) => 
          consumableCustomCardRenderer(item, actions, isSelected, onToggleSelect, onRowActionClick, handleOpenStockInDialog, handleOpenApplyDialog)
        }
        gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        titleField="name"
        descriptionField="description"
        statusField="status"
        statusVariants={statusColors as any}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        batchActions={configuredBatchActions}
        onRowActionClick={handleRowAction}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除耗材 "{itemToDelete?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-destructive text-destructive-foreground">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 耗材入库弹框 */}
      <ConsumableStockInDialog
        open={stockInDialogOpen}
        onOpenChange={setStockInDialogOpen}
        consumable={selectedConsumableForStockIn}
      />

      {/* 耗材申领弹框 */}
      <ConsumableApplyDialog
        open={applyDialogOpen}
        onOpenChange={setApplyDialogOpen}
        consumable={selectedConsumableForApply}
      />

      {/* 耗材不可申领弹框 */}
      <ConsumableUnavailableDialog
        open={unavailableDialogOpen}
        onOpenChange={setUnavailableDialogOpen}
        consumable={selectedConsumableForUnavailable}
      />
    </div>
  )
}

export default function ConsumablePage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ConsumableContent />
    </Suspense>
  )
} 