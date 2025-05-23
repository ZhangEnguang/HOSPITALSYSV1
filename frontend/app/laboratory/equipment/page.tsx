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
  // 导入特定仪器类型的列和操作
  equipmentColumns,
  equipmentActions,
  // 导入特定仪器类型的卡片字段
  equipmentCardFields,
} from "./config/equipment-config"
import { allDemoEquipmentItems } from "./data/equipment-demo-data"
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

function EquipmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [equipmentItems, setEquipmentItems] = useState(allDemoEquipmentItems)
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
    warrantyExpiry: true,
    maintenanceStatus: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  // 过滤和排序数据
  const filteredEquipmentItems = equipmentItems
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
        filterValues.category !== "all" &&
        item.category !== filterValues.category
      ) {
        return false
      }

      if (filterValues.status && filterValues.status !== "all" && item.status !== filterValues.status) {
        return false
      }

      if (filterValues.department && filterValues.department !== "all" && item.department !== filterValues.department) {
        return false
      }

      // 高级筛选
      if (
        filterValues.location &&
        filterValues.location !== "all" &&
        item.location !== filterValues.location
      ) {
        return false
      }

      if (filterValues.dateRange?.from && filterValues.dateRange?.to) {
        const purchaseDate = new Date(item.purchaseDate)
        const filterFrom = new Date(filterValues.dateRange.from)
        const filterTo = new Date(filterValues.dateRange.to)

        if (purchaseDate < filterFrom || purchaseDate > filterTo) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // 排序逻辑
      const [field, direction] = sortOption.split("_")

      if (field === "name") {
        return direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }

      if (field === "purchaseDate") {
        const dateA = new Date(a.purchaseDate).getTime()
        const dateB = new Date(b.purchaseDate).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }

      if (field === "price") {
        return direction === "asc" ? a.price - b.price : b.price - a.price
      }

      return 0
    })

  // 分页数据
  const totalItems = filteredEquipmentItems.length
  const paginatedItems = filteredEquipmentItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchSetInUse = () => {
    setEquipmentItems(
      equipmentItems.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, status: "在用", maintenanceStatus: "正常" }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchSetMaintenance = () => {
    setEquipmentItems(
      equipmentItems.map((item) => (selectedRows.includes(item.id) ? { ...item, status: "维修中" } : item)),
    )
    setSelectedRows([])
  }

  const handleBatchDelete = () => {
    setEquipmentItems(equipmentItems.filter((item) => !selectedRows.includes(item.id)))
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
      setEquipmentItems(equipmentItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "删除成功",
        description: `仪器 "${itemToDelete.name}" 已被删除`,
        duration: 3000,
      })
      setItemToDelete(null)
    }
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      id: "setInUse",
      label: "设为在用",
      icon: "CheckCircle",
      onClick: handleBatchSetInUse,
    },
    {
      id: "setMaintenance",
      label: "设为维修中",
      icon: "Tool",
      onClick: handleBatchSetMaintenance,
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
        title="实验室仪器管理"
        data={paginatedItems}
        searchValue={searchTerm}
        searchPlaceholder="搜索仪器名称、型号或描述..."
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
        onAddNew={() => router.push("/laboratory/equipment/create")}
        onAIAssist={() => router.push("/laboratory/equipment/ai-assist")}
        addButtonLabel="新增仪器"
        settingsButtonLabel="模板库"
        onOpenSettings={() => router.push("/laboratory/equipment/templates")}
        quickFilters={quickFilters}
        onQuickFilterChange={(filterId, value) =>
          setFilterValues((prev) => ({ ...prev, [filterId]: value }))
        }
        quickFilterValues={filterValues}
        onAdvancedFilter={(values) => setFilterValues(values)}
        sortOptions={sortOptions}
        activeSortOption={sortOption}
        onSortChange={setSortOption}
        defaultViewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode as "grid" | "list")}
        tableColumns={equipmentColumns}
        tableActions={equipmentActions}
        cardActions={equipmentActions}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        cardFields={equipmentCardFields}
        titleField="name"
        descriptionField="description"
        statusField="status"
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        batchActions={configuredBatchActions}
        onRowActionClick={(action, row) => {
          if (action.id === "delete") {
            handleDeleteItem(row)
          } else if (action.id === "edit") {
            router.push(`/laboratory/equipment/edit/${row.id}`)
          } else if (action.id === "view") {
            router.push(`/laboratory/equipment/${row.id}`)
          } else if (action.id === "booking") {
            router.push(`/laboratory/equipment/booking/${row.id}`)
          } else if (action.id === "maintenance") {
            router.push(`/laboratory/equipment/maintenance/${row.id}`)
          } else if (action.id === "usage") {
            router.push(`/laboratory/equipment/usage/${row.id}`)
          } else if (action.id === "report") {
            router.push(`/laboratory/equipment/report/${row.id}`)
          }
        }}
        statusVariants={statusColors}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除仪器</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除仪器 "{itemToDelete?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-destructive text-destructive-foreground">
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function EquipmentPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <EquipmentContent />
    </Suspense>
  )
} 