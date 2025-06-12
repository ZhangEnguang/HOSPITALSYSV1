"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  quickFilters,
  advancedFilters,
  sortOptions,
  tableColumns,
  cardFields,
  tableActions,
  batchActions,
  statusColors,
  // 导入特定试剂类型的列和操作
  reagentColumns,
  reagentActions,
  // 导入特定试剂类型的卡片字段
  reagentCardFields,
  // 导入自定义卡片渲染器
  reagentCustomCardRenderer,
} from "./config/reagent-config"
import { allDemoReagentItems } from "./data/reagent-demo-data"
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
import { ReagentStockInDialog } from "./components/reagent-stock-in-dialog"
import { ReagentApplyDialog } from "./components/reagent-apply-dialog"
import { ReagentUnavailableDialog } from "./components/reagent-unavailable-dialog"

function ReagentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [reagentItems, setReagentItems] = useState(allDemoReagentItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("smart_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    image: true,
    name: true,
    category: true,
    status: true,
    currentAmount: true,
    specification: true,
    department: true,
    location: true,
    expiryDate: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  
  // 入库弹框状态
  const [stockInDialogOpen, setStockInDialogOpen] = useState(false)
  const [selectedReagentForStockIn, setSelectedReagentForStockIn] = useState<any>(null)

  // 申领弹框状态
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [selectedReagentForApply, setSelectedReagentForApply] = useState<any>(null)

  // 不可申领弹框状态
  const [unavailableDialogOpen, setUnavailableDialogOpen] = useState(false)
  const [selectedReagentForUnavailable, setSelectedReagentForUnavailable] = useState<any>(null)

  // 过滤和排序数据
  const filteredReagentItems = reagentItems
    .filter((item) => {
      // 搜索过滤
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
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

      if (filterValues.purchaseDateRange?.from && filterValues.purchaseDateRange?.to) {
        const purchaseDate = new Date(item.purchaseDate)
        const filterFrom = new Date(filterValues.purchaseDateRange.from)
        const filterTo = new Date(filterValues.purchaseDateRange.to)

        if (purchaseDate < filterFrom || purchaseDate > filterTo) {
          return false
        }
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
        // 1. 主排序：安全等级优先级（危险品优先管理）
        const dangerPriority = {
          "高": 1,      // 最高优先级：高危险品需要优先关注
          "中": 2,      // 中等优先级：中等危险品
          "低": 3       // 最低优先级：低危险品
        }
        
        const dangerA = dangerPriority[a.dangerLevel as keyof typeof dangerPriority] || 999
        const dangerB = dangerPriority[b.dangerLevel as keyof typeof dangerPriority] || 999
        const dangerDiff = dangerA - dangerB
        if (dangerDiff !== 0) return dangerDiff
        
        // 2. 次排序：有效期状态（即将过期优先）
        const today = new Date()
        const expiryA = new Date(a.expiryDate)
        const expiryB = new Date(b.expiryDate)
        const daysToExpiryA = Math.ceil((expiryA.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const daysToExpiryB = Math.ceil((expiryB.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        // 过期的排在最前面，然后是即将过期的
        if (daysToExpiryA <= 0 && daysToExpiryB > 0) return -1
        if (daysToExpiryA > 0 && daysToExpiryB <= 0) return 1
        if (daysToExpiryA <= 0 && daysToExpiryB <= 0) return daysToExpiryB - daysToExpiryA
        
        // 30天内过期的优先
        const isExpiringA = daysToExpiryA <= 30
        const isExpiringB = daysToExpiryB <= 30
        if (isExpiringA && !isExpiringB) return -1
        if (!isExpiringA && isExpiringB) return 1
        if (isExpiringA && isExpiringB) return daysToExpiryA - daysToExpiryB
        
        // 3. 三级排序：库存状态（不足优先）
        const stockRatioA = a.currentAmount / a.initialAmount
        const stockRatioB = b.currentAmount / b.initialAmount
        
        // 缺货优先
        if (stockRatioA === 0 && stockRatioB > 0) return -1
        if (stockRatioA > 0 && stockRatioB === 0) return 1
        
        // 低库存优先（<20%）
        const isLowStockA = stockRatioA > 0 && stockRatioA <= 0.2
        const isLowStockB = stockRatioB > 0 && stockRatioB <= 0.2
        if (isLowStockA && !isLowStockB) return -1
        if (!isLowStockA && isLowStockB) return 1
        
        // 4. 四级排序：使用频率（常用优先）
        const usageA = a.usageFrequency || 0
        const usageB = b.usageFrequency || 0
        const usageDiff = usageB - usageA
        if (usageDiff !== 0) return usageDiff
        
        // 5. 最后排序：按名称字母顺序
        return a.name.localeCompare(b.name)
      }
      
      // 原有的单字段排序逻辑
      if (field === "dangerLevel") {
        const dangerPriority = { "高": 3, "中": 2, "低": 1 }
        const priorityA = dangerPriority[a.dangerLevel as keyof typeof dangerPriority] || 0
        const priorityB = dangerPriority[b.dangerLevel as keyof typeof dangerPriority] || 0
        return direction === "asc" ? priorityA - priorityB : priorityB - priorityA
      }
      
      if (field === "stockLevel") {
        const stockRatioA = a.currentAmount / a.initialAmount
        const stockRatioB = b.currentAmount / b.initialAmount
        return direction === "asc" ? stockRatioA - stockRatioB : stockRatioB - stockRatioA
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
  if (sortOption === "smart_desc" && filteredReagentItems.length > 0) {
    console.log("🧪 试剂智能排序结果:")
    filteredReagentItems.slice(0, 10).forEach((item, index) => {
      const today = new Date()
      const expiryDate = new Date(item.expiryDate)
      const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      const stockRatio = ((item.currentAmount / item.initialAmount) * 100).toFixed(1)
      
      console.log(`${index + 1}. ${item.name}`)
      console.log(`   安全等级: ${item.dangerLevel} | 有效期: ${daysToExpiry}天 | 库存: ${stockRatio}% | 使用频率: ${item.usageFrequency || 0}`)
      console.log(`   状态: ${item.status}`)
    })
  }

  // 分页数据
  const totalItems = filteredReagentItems.length

  // 处理批量操作
  const handleBatchSetNormal = () => {
    setReagentItems(
      reagentItems.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, status: "正常" }
          : item,
      ),
    )
    setSelectedRows([])
    toast({
      title: "批量操作成功",
      description: `已将选中的${selectedRows.length}个试剂标记为正常`,
      duration: 3000,
    })
  }

  const handleBatchSetExpired = () => {
    setReagentItems(
      reagentItems.map((item) => (selectedRows.includes(item.id) ? { ...item, status: "已过期" } : item)),
    )
    setSelectedRows([])
    toast({
      title: "批量操作成功",
      description: `已将选中的${selectedRows.length}个试剂标记为已过期`,
      duration: 3000,
    })
  }

  const handleBatchSetOutOfStock = () => {
    setReagentItems(
      reagentItems.map((item) => (selectedRows.includes(item.id) ? { ...item, status: "已用完", currentAmount: 0 } : item)),
    )
    setSelectedRows([])
    toast({
      title: "批量操作成功",
      description: `已将选中的${selectedRows.length}个试剂标记为已用完`,
      duration: 3000,
    })
  }

  const handleBatchDelete = () => {
    setReagentItems(reagentItems.filter((item) => !selectedRows.includes(item.id)))
    toast({
      title: "批量删除成功",
      description: `已删除${selectedRows.length}个试剂`,
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
      setReagentItems(reagentItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "删除成功",
        description: `试剂 "${itemToDelete.name}" 已被删除`,
        duration: 3000,
      })
      setItemToDelete(null)
    }
  }

  // 处理入库弹框打开
  const handleOpenStockInDialog = (reagent: any) => {
    setSelectedReagentForStockIn(reagent)
    setStockInDialogOpen(true)
  }

  // 处理申领弹框打开
  const handleOpenApplyDialog = (reagent: any) => {
    // 检查试剂是否可以申领
    const canApply = () => {
      const today = new Date()
      const expiryDate = new Date(reagent.expiryDate)
      const isExpired = expiryDate < today || reagent.status === "已过期"
      const isOutOfStock = reagent.currentAmount <= 0 || reagent.status === "缺货"
      
      return !isExpired && !isOutOfStock
    }

    // 如果试剂不可申领，显示不可申领弹框
    if (!canApply()) {
      setSelectedReagentForUnavailable(reagent)
      setUnavailableDialogOpen(true)
      return
    }

    // 可以申领，打开正常申领弹框
    setSelectedReagentForApply(reagent)
    setApplyDialogOpen(true)
  }

  // 处理行操作
  const handleRowAction = (actionOrId: string | any, item: any) => {
    // 兼容处理：如果传入的是action对象，则提取id；如果是字符串，则直接使用
    const actionId = typeof actionOrId === 'string' ? actionOrId : actionOrId.id;
    
    if (actionId === "view") {
      router.push(`/laboratory/reagent/${item.id}`)
    } else if (actionId === "edit") {
      router.push(`/laboratory/reagent/edit/${item.id}`)
    } else if (actionId === "delete") {
      handleDeleteItem(item)
    } else if (actionId === "stockIn") {
      handleOpenStockInDialog(item)
    } else if (actionId === "apply") {
      handleOpenApplyDialog(item)
    } else if (actionId === "usage") {
      router.push(`/laboratory/reagent/usage/${item.id}`)
    } else if (actionId === "purchase") {
      router.push(`/laboratory/reagent/purchase/${item.id}`)
    } else if (actionId === "report") {
      router.push(`/laboratory/reagent/report/${item.id}`)
    }
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      id: "outOfStock",
      label: "标记用完",
      icon: "X",
      onClick: handleBatchSetOutOfStock,
    },
    {
      id: "expired",
      label: "标记过期",
      icon: "Clock",
      onClick: handleBatchSetExpired,
    },
    {
      id: "normal",
      label: "标记正常",
      icon: "CheckCircle",
      onClick: handleBatchSetNormal,
    },
    {
      id: "delete",
      label: "批量删除",
      icon: "Trash",
      variant: "destructive",
      onClick: handleBatchDelete,
    },
  ]

  return (
    <div className="space-y-6">
      <DataList
        title="试剂管理"
        data={filteredReagentItems}
        searchValue={searchTerm}
        searchPlaceholder="搜索试剂名称、英文名或描述..."
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
        onAddNew={() => router.push("/laboratory/reagent/create")}
        onAIAssist={undefined}
        addButtonLabel="新增试剂"
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
        tableColumns={reagentColumns as any}
        tableActions={reagentActions}
        cardActions={reagentActions}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        cardFields={reagentCardFields}
        customCardRenderer={(item, actions, isSelected, onToggleSelect, onRowActionClick) => 
          reagentCustomCardRenderer(item, actions, isSelected, onToggleSelect, onRowActionClick, handleOpenStockInDialog, handleOpenApplyDialog)
        }
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
        gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除试剂 "{itemToDelete?.name}" 吗？此操作无法撤销。
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

      {/* 试剂入库弹框 */}
      <ReagentStockInDialog
        open={stockInDialogOpen}
        onOpenChange={setStockInDialogOpen}
        reagent={selectedReagentForStockIn}
      />

      {/* 申领弹框 */}
      <ReagentApplyDialog
        open={applyDialogOpen}
        onOpenChange={setApplyDialogOpen}
        reagent={selectedReagentForApply}
      />

      {/* 不可申领弹框 */}
      <ReagentUnavailableDialog
        open={unavailableDialogOpen}
        onOpenChange={setUnavailableDialogOpen}
        reagent={selectedReagentForUnavailable}
      />
    </div>
  )
}

export default function ReagentPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ReagentContent />
    </Suspense>
  )
} 