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
  statusColors,
  // 导入特定动物档案类型的列和操作
  animalActions,
  // 导入特定动物档案类型的卡片字段
  animalCardFields,
  // 导入自定义卡片渲染器
  animalCustomCardRenderer,
} from "./config/animal-files-config"
import { allDemoAnimalItems } from "./data/animal-files-demo-data"
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

function AnimalFilesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [animalItems, setAnimalItems] = useState(allDemoAnimalItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("smart_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    animalId: true,
    species: true,
    strain: true,
    gender: true,
    age: true,
    weight: true,
    status: true,
    department: true,
    location: true,
    entryDate: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  // 过滤和排序数据
  const filteredAnimalItems = animalItems
    .filter((item) => {
      // 搜索过滤
      if (
        searchTerm &&
        !item.animalId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.species.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.strain.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // 快速筛选
      if (
        filterValues.species &&
        filterValues.species !== "" &&
        item.species !== filterValues.species
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

      if (filterValues.entryDateRange?.from && filterValues.entryDateRange?.to) {
        const entryDate = new Date(item.entryDate)
        const filterFrom = new Date(filterValues.entryDateRange.from)
        const filterTo = new Date(filterValues.entryDateRange.to)

        if (entryDate < filterFrom || entryDate > filterTo) {
          return false
        }
      }

      if (filterValues.lastCheckDate?.from && filterValues.lastCheckDate?.to) {
        const checkDate = new Date(item.lastCheckDate)
        const filterFrom = new Date(filterValues.lastCheckDate.from)
        const filterTo = new Date(filterValues.lastCheckDate.to)

        if (checkDate < filterFrom || checkDate > filterTo) {
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
        // 1. 主排序：健康状态优先级（需要关注的优先）
        const statusPriority = {
          "死亡": 1,     // 最高优先级：需要处理
          "隔离": 2,     // 高优先级：需要密切关注
          "治疗中": 3,   // 中高优先级：需要治疗监控
          "观察中": 4,   // 中等优先级：需要观察
          "退役": 5,     // 中低优先级：管理状态
          "健康": 6      // 最低优先级：正常状态
        }
        
        const statusA = statusPriority[a.status as keyof typeof statusPriority] || 999
        const statusB = statusPriority[b.status as keyof typeof statusPriority] || 999
        const statusDiff = statusA - statusB
        if (statusDiff !== 0) return statusDiff
        
        // 2. 次排序：年龄状态（高龄动物优先关注）
        const ageA = a.age || 0
        const ageB = b.age || 0
        
        // 超过52周的为高龄动物，优先关注
        const isElderlyA = ageA > 52
        const isElderlyB = ageB > 52
        if (isElderlyA && !isElderlyB) return -1
        if (!isElderlyA && isElderlyB) return 1
        if (isElderlyA && isElderlyB) return ageB - ageA // 高龄中年龄大的优先
        
        // 3. 三级排序：最后检查时间（检查时间久的优先）
        const lastCheckA = new Date(a.lastCheckDate).getTime()
        const lastCheckB = new Date(b.lastCheckDate).getTime()
        const checkDiff = lastCheckA - lastCheckB
        if (checkDiff !== 0) return checkDiff
        
        // 4. 四级排序：入档时间（新入档的在前）
        const entryA = new Date(a.entryDate).getTime()
        const entryB = new Date(b.entryDate).getTime()
        const entryDiff = entryB - entryA
        if (entryDiff !== 0) return entryDiff
        
        // 5. 最后排序：按动物编号
        return a.animalId.localeCompare(b.animalId)
      }
      
      // 原有的单字段排序逻辑
      if (field === "age" || field === "weight") {
        const valueA = a[field as keyof typeof a] as number || 0
        const valueB = b[field as keyof typeof b] as number || 0
        return direction === "asc" ? valueA - valueB : valueB - valueA
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
  if (sortOption === "smart_desc" && filteredAnimalItems.length > 0) {
    console.log("🐭 动物档案智能排序结果:")
    filteredAnimalItems.slice(0, 10).forEach((item, index) => {
      console.log(`${index + 1}. ${item.animalId} (${item.species})`)
      console.log(`   状态: ${item.status} | 年龄: ${item.age}周 | 体重: ${item.weight}g`)
      console.log(`   位置: ${item.location}`)
    })
  }

  // 分页数据
  const totalItems = filteredAnimalItems.length

  // 处理批量操作
  const handleBatchSetHealthy = () => {
    setAnimalItems(
      animalItems.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, status: "健康" }
          : item,
      ),
    )
    setSelectedRows([])
    toast({
      title: "批量操作成功",
      description: `已将选中的${selectedRows.length}个动物标记为健康`,
      duration: 3000,
    })
  }

  const handleBatchSetObserve = () => {
    setAnimalItems(
      animalItems.map((item) => (selectedRows.includes(item.id) ? { ...item, status: "观察中" } : item)),
    )
    setSelectedRows([])
    toast({
      title: "批量操作成功",
      description: `已将选中的${selectedRows.length}个动物标记为观察中`,
      duration: 3000,
    })
  }

  const handleBatchSetIsolate = () => {
    setAnimalItems(
      animalItems.map((item) => (selectedRows.includes(item.id) ? { ...item, status: "隔离" } : item)),
    )
    setSelectedRows([])
    toast({
      title: "批量操作成功",
      description: `已将选中的${selectedRows.length}个动物标记为隔离`,
      duration: 3000,
    })
  }

  const handleBatchDelete = () => {
    setAnimalItems(animalItems.filter((item) => !selectedRows.includes(item.id)))
    toast({
      title: "批量删除成功",
      description: `已删除${selectedRows.length}个动物档案`,
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
      setAnimalItems(animalItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "删除成功",
        description: `动物档案 "${itemToDelete.animalId}" 已被删除`,
        duration: 3000,
      })
      setItemToDelete(null)
    }
  }

  // 处理行操作
  const handleRowAction = (actionOrId: string | any, item: any) => {
    // 兼容处理：如果传入的是action对象，则提取id；如果是字符串，则直接使用
    const actionId = typeof actionOrId === 'string' ? actionOrId : actionOrId.id;
    
    if (actionId === "view") {
      router.push(`/laboratory/animal-files/${item.id}`)
    } else if (actionId === "edit") {
      router.push(`/laboratory/animal-files/edit/${item.id}`)
    } else if (actionId === "delete") {
      handleDeleteItem(item)
    } else if (actionId === "healthRecord") {
      router.push(`/laboratory/animal-files/health/${item.id}`)
    } else if (actionId === "experimentRecord") {
      router.push(`/laboratory/animal-files/experiment/${item.id}`)
    }
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      id: "isolate",
      label: "标记隔离",
      icon: "Activity",
      onClick: handleBatchSetIsolate,
    },
    {
      id: "observe",
      label: "标记观察",
      icon: "Eye",
      onClick: handleBatchSetObserve,
    },
    {
      id: "healthy",
      label: "标记健康",
      icon: "Heart",
      onClick: handleBatchSetHealthy,
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
        title="动物档案"
        data={filteredAnimalItems}
        searchValue={searchTerm}
        searchPlaceholder="搜索动物编号、种类、品系或描述..."
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
        onAddNew={() => router.push("/laboratory/animal-files/create")}
        onAIAssist={undefined}
        addButtonLabel="新增动物档案"
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
        tableColumns={tableColumns as any}
        tableActions={animalActions}
        cardActions={animalActions}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        cardFields={animalCardFields}
        customCardRenderer={(item, actions, isSelected, onToggleSelect, onRowActionClick) => 
          animalCustomCardRenderer(item, actions, isSelected, onToggleSelect, onRowActionClick)
        }
        titleField="animalId"
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
              您确定要删除动物档案 "{itemToDelete?.animalId}" 吗？此操作无法撤销。
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

export default function AnimalFilesPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <AnimalFilesContent />
    </Suspense>
  )
} 