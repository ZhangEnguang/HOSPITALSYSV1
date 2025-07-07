"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, RefreshCw, Trash } from "lucide-react"
import {
  quickFilters,
  advancedFilters,
  sortOptions,
  tableColumns,
  cardFields,
  batchActions,
  statusColors,
  // 导入特定动物房类型的列和操作
  animalRoomColumns,
  animalRoomActions,
  // 导入特定动物房类型的卡片字段
  animalRoomCardFields,
  // 导入自定义卡片渲染器
  animalRoomCustomCardRenderer,
} from "./config/animal-rooms-config"
import { allDemoAnimalRoomItems } from "./data/animal-rooms-demo-data"
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

function AnimalRoomsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [animalRoomItems, setAnimalRoomItems] = useState(allDemoAnimalRoomItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("roomId_asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    roomId: true,
    name: true,
    type: true,
    capacity: true,
    currentOccupancy: true,
    status: true,
    department: true,
    location: true,
    temperature: true,
    humidity: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  // 过滤和排序数据
  const filteredAnimalRoomItems = animalRoomItems
    .filter((item) => {
      // 搜索过滤
      if (
        searchTerm &&
        !item.roomId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.type.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // 快速筛选
      if (
        filterValues.type &&
        filterValues.type !== "all" &&
        item.type !== filterValues.type
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

      if (filterValues.capacityRange?.min !== undefined && item.capacity < filterValues.capacityRange.min) {
        return false
      }

      if (filterValues.capacityRange?.max !== undefined && item.capacity > filterValues.capacityRange.max) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // 智能综合排序逻辑
      const [field, direction] = sortOption.split("_")

      // 如果选择了智能排序，使用综合排序逻辑
      if (field === "smart") {
        // 1. 主排序：房间状态优先级（异常状态优先）
        const statusPriority = {
          "维修中": 1,    // 最高优先级：需要处理
          "清洁中": 2,    // 次优先级：准备中
          "使用中": 3,    // 中等优先级：正常运行
          "空闲": 4,      // 较低优先级：可用状态
          "停用": 5       // 最低优先级：不可用
        }
        
        const statusA = statusPriority[a.status as keyof typeof statusPriority] || 999
        const statusB = statusPriority[b.status as keyof typeof statusPriority] || 999
        const statusDiff = statusA - statusB
        if (statusDiff !== 0) return statusDiff
        
        // 2. 次排序：使用率（按使用率降序，高使用率优先）
        const usageRateA = a.currentOccupancy / a.capacity
        const usageRateB = b.currentOccupancy / b.capacity
        const usageRateDiff = usageRateB - usageRateA
        if (usageRateDiff !== 0) return usageRateDiff
        
        // 3. 三级排序：容量（大容量优先）
        const capacityDiff = b.capacity - a.capacity
        if (capacityDiff !== 0) return capacityDiff
        
        // 4. 最后排序：按房间号
        return a.roomId.localeCompare(b.roomId)
      }
      
      // 原有的单字段排序逻辑
      if (field === "name" || field === "roomId") {
        return direction === "asc" ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field])
      }

      if (field === "capacity" || field === "currentOccupancy") {
        return direction === "asc" ? a[field] - b[field] : b[field] - a[field]
      }
      
      if (field === "status") {
        const statusPriority = {
          "维修中": 1,
          "清洁中": 2,
          "使用中": 3,
          "空闲": 4,
          "停用": 5
        }
        const priorityA = statusPriority[a.status as keyof typeof statusPriority] || 999
        const priorityB = statusPriority[b.status as keyof typeof statusPriority] || 999
        return direction === "asc" ? priorityA - priorityB : priorityB - priorityA
      }

      return 0
    })

  // 分页数据
  const totalItems = filteredAnimalRoomItems.length
  const paginatedItems = filteredAnimalRoomItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchSetInUse = () => {
    setAnimalRoomItems(
      animalRoomItems.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, status: "使用中" }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchSetCleaning = () => {
    setAnimalRoomItems(
      animalRoomItems.map((item) => (selectedRows.includes(item.id) ? { ...item, status: "清洁中" } : item)),
    )
    setSelectedRows([])
  }

  const handleBatchDelete = () => {
    setAnimalRoomItems(animalRoomItems.filter((item) => !selectedRows.includes(item.id)))
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
      setAnimalRoomItems(animalRoomItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "删除成功",
        description: `动物房 "${itemToDelete.name}" 已被删除`,
        duration: 3000,
      })
      setItemToDelete(null)
    }
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      id: "setInUse",
      label: "设为使用中",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: handleBatchSetInUse,
    },
    {
      id: "setCleaning",
      label: "设为清洁中",
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: handleBatchSetCleaning,
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
    "使用中": "secondary",
    "维修中": "destructive",
    "清洁中": "outline",
    "空闲": "default",
    "停用": "destructive",
  }

  return (
    <div className="space-y-6">
      <DataList
        title="动物房"
        data={paginatedItems}
        searchValue={searchTerm}
        searchPlaceholder="搜索动物房编号、名称或类型..."
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
        onAddNew={() => router.push("/laboratory/animal-rooms/create")}
        onAIAssist={undefined}
        onOpenSettings={undefined}
        settingsButtonLabel={undefined}
        addButtonLabel="新增动物房"
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
        tableColumns={animalRoomColumns}
        tableActions={animalRoomActions}
        cardActions={animalRoomActions}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        cardFields={animalRoomCardFields}
        customCardRenderer={animalRoomCustomCardRenderer}
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
            router.push(`/laboratory/animal-rooms/edit/${row.id}`)
          } else if (action.id === "view") {
            router.push(`/laboratory/animal-rooms/${row.id}`)
          } else if (action.id === "reservation") {
            router.push(`/laboratory/animal-rooms/reservation/${row.id}`)
          } else if (action.id === "manage") {
            router.push(`/laboratory/animal-rooms/manage/${row.id}/create`)
          } else if (action.id === "monitoring") {
            router.push(`/laboratory/animal-rooms/monitoring/${row.id}`)
          }
        }}
        statusVariants={compatibleStatusVariants}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除动物房</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除动物房 "{itemToDelete?.name}" 吗？此操作无法撤销。
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

export default function AnimalRoomsPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <AnimalRoomsContent />
    </Suspense>
  )
} 