"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, Wrench, Trash } from "lucide-react"
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
  // 导入自定义卡片渲染器
  equipmentCustomCardRenderer,
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
import { BookingUnavailableDialog } from "./components/booking-unavailable-dialog"

function EquipmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [equipmentItems, setEquipmentItems] = useState(allDemoEquipmentItems)
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
  
  // 预约不可用对话框状态
  const [bookingUnavailableDialog, setBookingUnavailableDialog] = useState({
    open: false,
    equipment: null as any
  })

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
      // 智能综合排序逻辑
      const [field, direction] = sortOption.split("_")

      // 如果选择了智能排序，使用综合排序逻辑
      if (field === "smart") {
        // 1. 主排序：仪器状态优先级（可用性优先）
        const statusPriority = {
          "正常": 1,      // 最高优先级：可直接预约
          "已预约": 2,    // 次优先级：虽然被预约但仍可查看
          "维修中": 3,    // 中等优先级：临时不可用
          "待验收": 4,    // 较低优先级：等待验收
          "外借": 5,      // 低优先级：外借中
          "报废": 6       // 最低优先级：已报废
        }
        
        const statusA = statusPriority[a.status as keyof typeof statusPriority] || 999
        const statusB = statusPriority[b.status as keyof typeof statusPriority] || 999
        const statusDiff = statusA - statusB
        if (statusDiff !== 0) return statusDiff
        
        // 2. 次排序：使用频率（预约次数降序）- 热门设备优先
        const bookingA = a.bookingCount || 0
        const bookingB = b.bookingCount || 0
        const bookingDiff = bookingB - bookingA
        if (bookingDiff !== 0) return bookingDiff
        
        // 3. 三级排序：仪器价值（价格降序）- 高价值设备优先
        const priceA = a.price || 0
        const priceB = b.price || 0
        const priceDiff = priceB - priceA
        if (priceDiff !== 0) return priceDiff
        
        // 4. 最后排序：按名称字母顺序（升序）
        return a.name.localeCompare(b.name)
      }
      
      // 原有的单字段排序逻辑
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
      
      if (field === "bookingCount") {
        const countA = a.bookingCount || 0
        const countB = b.bookingCount || 0
        return direction === "asc" ? countA - countB : countB - countA
      }
      
      if (field === "status") {
        const statusPriority = {
          "正常": 1,
          "已预约": 2,
          "维修中": 3, 
          "待验收": 4,
          "外借": 5,
          "报废": 6
        }
        const priorityA = statusPriority[a.status as keyof typeof statusPriority] || 999
        const priorityB = statusPriority[b.status as keyof typeof statusPriority] || 999
        return direction === "asc" ? priorityA - priorityB : priorityB - priorityA
      }

      return 0
    })

  // 调试信息：显示排序后的前5个项目
  console.log("当前排序选项:", sortOption)
  console.log("排序后前5个项目:", filteredEquipmentItems.slice(0, 5).map(item => ({
    name: item.name,
    status: item.status,
    bookingCount: item.bookingCount,
    price: item.price
  })))

  // 分页数据
  const totalItems = filteredEquipmentItems.length
  const paginatedItems = filteredEquipmentItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchSetInUse = () => {
    setEquipmentItems(
      equipmentItems.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, status: "正常", maintenanceStatus: "正常" }
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
      label: "设为正常",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: handleBatchSetInUse,
    },
    {
      id: "setMaintenance",
      label: "设为维修中",
      icon: <Wrench className="h-4 w-4" />,
      onClick: handleBatchSetMaintenance,
    },
    {
      id: "delete",
      label: "批量删除",
      icon: <Trash className="h-4 w-4" />,
      variant: "destructive",
      onClick: handleBatchDelete,
    },
  ]

  // 创建兼容DataList组件的状态变体映射
  const compatibleStatusVariants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
    "正常": "secondary", // 将success映射为secondary
    "维修中": "destructive", // warning映射为destructive  
    "报废": "destructive",
    "待验收": "outline",
    "外借": "default",
  }

  return (
    <div className="space-y-6">
      <DataList
        title="仪器管理"
        data={paginatedItems}
        searchValue={searchTerm}
        searchPlaceholder="搜索仪器名称、型号或描述..."
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
        onAddNew={() => router.push("/laboratory/equipment/create")}
        onAIAssist={undefined}
        onOpenSettings={undefined}
        settingsButtonLabel={undefined}
        addButtonLabel="新增仪器"
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
        customCardRenderer={equipmentCustomCardRenderer}
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
        gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4"
        onRowActionClick={(action, row) => {
          if (action.id === "delete") {
            handleDeleteItem(row)
          } else if (action.id === "edit") {
            router.push(`/laboratory/equipment/edit/${row.id}`)
          } else if (action.id === "view") {
            router.push(`/laboratory/equipment/${row.id}`)
          } else if (action.id === "booking") {
            // 检查仪器状态是否可预约
            if (row.status === "正常") {
            router.push(`/laboratory/equipment/booking/${row.id}`)
            } else {
              // 显示不可预约对话框
              setBookingUnavailableDialog({
                open: true,
                equipment: row
              })
            }
          } else if (action.id === "maintenance") {
            router.push(`/laboratory/equipment/maintenance/${row.id}`)
          }
        }}
        statusVariants={compatibleStatusVariants}
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

      {/* 预约不可用对话框 */}
      <BookingUnavailableDialog
        open={bookingUnavailableDialog.open}
        onOpenChange={(open) => setBookingUnavailableDialog({ open, equipment: open ? bookingUnavailableDialog.equipment : null })}
        equipment={bookingUnavailableDialog.equipment}
      />
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