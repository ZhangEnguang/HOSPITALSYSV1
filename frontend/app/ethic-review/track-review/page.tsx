"use client"

import { useState, useEffect, Suspense } from "react"

// 扩展Window接口
declare global {
  interface Window {
    showDeleteConfirm?: (item: any) => void
  }
}

import { useRouter, useSearchParams } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { PlusCircle, Settings, PlusSquare, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { trackReviewItems } from "./data/track-review-demo-data"
import {
  tableColumns,
  statusVariants,
  getStatusName,
  sortOptions,
  quickFilters,
  cardFields,
  cardActions,
  filterCategories,
  dataListStatusVariants,
} from "./config/track-review-config"
import { useToast } from "@/components/ui/use-toast"
import { SeniorFilterDTO } from "@/components/data-management/data-list-advanced-filter"
import TrackReviewCard from "./components/track-review-card"

// 定义排序选项类型
interface SortOption {
  id: string
  field: string
  direction: "asc" | "desc"
  label: string
}

// 类型安全的排序选项
const typedSortOptions: SortOption[] = sortOptions.map(option => ({
  ...option,
  direction: option.direction as "asc" | "desc"
}))

function TrackReviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // 状态管理
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState<string>("")
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [sortOption, setSortOption] = useState<string>("dueDateDesc")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    reviewType: "全部审查",
    status: "全部状态",
    ethicsCommittee: "全部委员会"
  })
  const [seniorFilterValues, setSeniorFilterValues] = useState<SeniorFilterDTO>({
    groupOperator: "and" as const,
    groups: []
  })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // 删除确认弹框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  
  // 表格列定义和可见性
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    projectId: true,
    reviewType: true,
    name: true,
    projectLeader: true,
    department: true,
    ethicsCommittee: true,
    status: true,
    dueDate: true,
    actions: true,
  })

  // 初始化数据
  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setData(trackReviewItems)
      setTotalItems(trackReviewItems.length)
      setLoading(false)
    }, 500)
    
    // 设置全局删除确认函数
    window.showDeleteConfirm = handleDeleteConfirm
    
    // 清理函数
    return () => {
      delete window.showDeleteConfirm
    }
  }, [])

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchValue(value)
    const filtered = trackReviewItems.filter(item => 
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.description.toLowerCase().includes(value.toLowerCase()) ||
      (item.status === "形审通过" && item.projectId.toLowerCase().includes(value.toLowerCase())) ||
      item.department?.toLowerCase().includes(value.toLowerCase()) ||
      item.ethicsCommittee?.toLowerCase().includes(value.toLowerCase()) ||
      item.projectLeader?.name?.toLowerCase().includes(value.toLowerCase())
    )
    setData(filtered)
    setTotalItems(filtered.length)
  }
  
  // 不带参数的搜索函数，用于DataList组件
  const handleSearchExecute = () => {
    handleSearch(searchValue)
  }

  // 处理快速筛选
  const handleQuickFilterChange = (id: string, value: string) => {
    const newFilterValues = { ...filterValues, [id]: value }
    setFilterValues(newFilterValues)
    
    // 应用筛选
    let filtered = [...trackReviewItems]
    
    if (newFilterValues.reviewType && newFilterValues.reviewType !== "全部审查") {
      filtered = filtered.filter(item => item.reviewType === newFilterValues.reviewType)
    }
    
    if (newFilterValues.status && newFilterValues.status !== "全部状态") {
      filtered = filtered.filter(item => item.status === newFilterValues.status)
    }
    
    if (newFilterValues.ethicsCommittee && newFilterValues.ethicsCommittee !== "全部委员会") {
      filtered = filtered.filter(item => item.ethicsCommittee === newFilterValues.ethicsCommittee)
    }
    
    setData(filtered)
    setTotalItems(filtered.length)
  }

  // 处理高级筛选
  const handleAdvancedFilter = (filters: Record<string, any>) => {
    setSeniorFilterValues({
      groupOperator: "and" as const,
      groups: []
    })
    
    // 这里可以根据filters进行更复杂的筛选逻辑
    // 当前先保持简单的筛选实现
    setData(trackReviewItems)
    setTotalItems(trackReviewItems.length)
  }

  // 处理排序
  const handleSortChange = (sortId: string) => {
    setSortOption(sortId)
    const selectedSort = typedSortOptions.find(option => option.id === sortId)
    
    if (selectedSort) {
      const { field, direction } = selectedSort
      
      const sortedData = [...data].sort((a, b) => {
        // 日期字段
        if (field === "dueDate" || field === "createdAt") {
          const valueA = new Date(a[field] || "").getTime() || 0;
          const valueB = new Date(b[field] || "").getTime() || 0;
          return direction === "asc" ? valueA - valueB : valueB - valueA;
        } 
        // 字符串字段
        else if (field === "name") {
          const valueA = a[field]?.toLowerCase() || "";
          const valueB = b[field]?.toLowerCase() || "";
          return direction === "asc" 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        // 默认情况
        return 0;
      })
      
      setData(sortedData)
    }
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 处理每页显示数量变化
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // 重置到第一页
  }

  // 处理选择行变化
  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedRows(selectedIds)
  }

  // 批量操作按钮
  const batchActions = [
    {
      label: "批量审核",
      onClick: () => {
        toast({
          title: "批量审核",
          description: `已选择 ${selectedRows.length} 个项目进行批量审核`,
          duration: 3000,
        })
      },
    },
    {
      label: "批量删除",
      onClick: () => {
        toast({
          title: "批量删除",
          description: `已选择 ${selectedRows.length} 个项目进行批量删除`,
          duration: 3000,
        })
      },
    },
  ]

  // 处理视图模式变化
  const handleViewModeChange = (viewMode: string) => {
    if (viewMode === "grid" || viewMode === "list") {
      setViewMode(viewMode as "grid" | "list");
    }
  }

  // 处理可见列变化
  const handleVisibleColumnsChange = (columns: Record<string, boolean>) => {
    setVisibleColumns(columns)
  }

  // 处理新增
  const handleAddNew = () => {
    router.push("/ethic-review/track-review/create")
  }

  // 处理AI智能填报
  const handleAIAssist = () => {
    toast({
      title: "AI智能填报",
      description: "AI智能填报功能正在开发中...",
      duration: 3000,
    })
  }

  // 处理设置
  const handleOpenSettings = () => {
    toast({
      title: "打开设置",
      description: "设置功能正在开发中...",
      duration: 3000,
    })
  }

  // 处理项目点击
  const handleItemClick = (item: any) => {
    console.log("跟踪报告项目点击:", item);
    router.push(`/ethic-review/track-review/${item.id}`);
  }

  // 处理删除确认
  const handleDeleteConfirm = (item: any) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  // 执行删除操作
  const handleDeleteExecute = () => {
    if (itemToDelete) {
      // 从数据中移除项目
      const newData = data.filter(item => item.id !== itemToDelete.id)
      setData(newData)
      setTotalItems(newData.length)
      
      // 显示成功提示
      toast({
        title: "删除成功",
        description: `项目"${itemToDelete.name}"已成功删除`,
        variant: "default",
        duration: 3000,
      })
      
      // 关闭弹框并清理状态
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  // 取消删除
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  // 为状态变体添加类型转换，保持与表格列中相同的颜色样式
  const statusVariantsFormatted = Object.keys(statusVariants).reduce((acc, key) => {
    acc[key] = statusVariants[key].color;
    return acc;
  }, {} as Record<string, string>);

  // 自定义卡片渲染器
  const customCardRenderer = (
    item: any, 
    actions: any[], 
    isSelected: boolean, 
    onToggleSelect: (selected: boolean) => void,
    onRowActionClick?: (action: any, item: any) => void
  ) => {
    // 为卡片操作添加删除回调
    const enhancedActions = actions.map(action => ({
      ...action,
      onClick: (item: any, e: any) => {
        if (action.id === "delete") {
          handleDeleteConfirm(item)
        } else {
          action.onClick(item, e, handleDeleteConfirm)
        }
      }
    }))

    return (
      <TrackReviewCard
        key={item.id}
        item={item}
        actions={enhancedActions}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        onClick={() => handleItemClick(item)}
        statusVariants={statusVariantsFormatted}
        getStatusName={getStatusName}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
      <div
        className="absolute top-0 left-0 right-0 h-[300px] -z-10"
        style={{
          background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
        }}
      ></div>

      <DataList
        title="跟踪报告"
        data={data}
        searchValue={searchValue}
        searchPlaceholder="搜索项目编号、名称、院系或负责人..."
        noResultsText="没有找到符合条件的跟踪报告记录"
        onSearchChange={(value) => setSearchValue(value)}
        onSearch={handleSearchExecute}
        quickFilters={quickFilters.map(filter => ({...filter, category: "基本"}))}
        onQuickFilterChange={handleQuickFilterChange}
        quickFilterValues={filterValues}
        seniorFilterValues={seniorFilterValues}
        onAdvancedFilter={handleAdvancedFilter}
        sortOptions={typedSortOptions}
        activeSortOption={sortOption}
        onSortChange={handleSortChange}
        defaultViewMode={viewMode}
        onViewModeChange={(mode) => handleViewModeChange(mode)}
        tableColumns={tableColumns}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={handleVisibleColumnsChange}
        cardFields={cardFields}
        cardActions={cardActions}
        titleField="name"
        descriptionField="description"
        statusField="status"
        statusVariants={statusVariantsFormatted as Record<string, "default" | "destructive" | "outline" | "secondary">}
        getStatusName={getStatusName}
        priorityField="priority"
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        selectedRows={selectedRows}
        onSelectedRowsChange={handleSelectionChange}
        batchActions={batchActions}
        onItemClick={handleItemClick}
        addButtonLabel="新建跟踪"
        onAddNew={handleAddNew}
        categories={filterCategories}
        idField="id"
        showColumnToggle
        showHeaderButtons={false}
        customCardRenderer={customCardRenderer}
      />

      {/* 删除确认弹框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除项目"{itemToDelete?.name}"吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteExecute}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function TrackReviewPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <TrackReviewContent />
    </Suspense>
  )
} 