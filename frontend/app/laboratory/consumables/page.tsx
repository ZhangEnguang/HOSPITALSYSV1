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
  // 导入特定耗材类型的列和操作
  consumableColumns,
  consumableActions,
  // 导入特定耗材类型的卡片字段
  consumableCardFields,
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

function ConsumableContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [consumableItems, setConsumableItems] = useState(allDemoConsumableItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("purchaseDate_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
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
    purchaseDate: true,
    currentStock: true,
    unitPrice: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)

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

      if (filterValues.purchaseDateRange?.from && filterValues.purchaseDateRange?.to) {
        const purchaseDate = new Date(item.purchaseDate)
        const filterFrom = new Date(filterValues.purchaseDateRange.from)
        const filterTo = new Date(filterValues.purchaseDateRange.to)

        if (purchaseDate < filterFrom || purchaseDate > filterTo) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // 排序逻辑
      const option = sortOptions.find((opt) => opt.id === sortOption)
      if (!option) return 0

      const field = option.field
      const direction = option.direction

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

  // 分页数据
  const totalItems = filteredConsumableItems.length
  const paginatedItems = filteredConsumableItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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
  const handleRowAction = (actionId: string, item: any) => {
    if (actionId === "view") {
      router.push(`/laboratory/consumables/${item.id}`)
    } else if (actionId === "edit") {
      router.push(`/laboratory/consumables/edit/${item.id}`)
    } else if (actionId === "delete") {
      handleDeleteItem(item)
    } else if (actionId === "apply") {
      router.push(`/laboratory/consumables/apply/${item.id}`)
    } else if (actionId === "usage") {
      router.push(`/laboratory/consumables/usage/${item.id}`)
    } else if (actionId === "purchase") {
      router.push(`/laboratory/consumables/purchase/${item.id}`)
    } else if (actionId === "report") {
      router.push(`/laboratory/consumables/report/${item.id}`)
    }
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      id: "outOfStock",
      label: "标记缺货",
      icon: "X",
      onClick: handleBatchSetOutOfStock,
    },
    {
      id: "lowStock",
      label: "标记库存不足",
      icon: "AlertTriangle",
      onClick: handleBatchSetLowStock,
    },
    {
      id: "normal",
      label: "标记充足",
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
        title="实验室耗材管理"
        data={paginatedItems}
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