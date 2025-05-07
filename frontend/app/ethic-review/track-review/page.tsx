"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { PlusCircle, Settings, PlusSquare, Sparkles } from "lucide-react"
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
  const [seniorFilterValues, setSeniorFilterValues] = useState<Record<string, any>>({})
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  
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
    setSeniorFilterValues(filters)
    
    // 筛选逻辑
    let filtered = [...trackReviewItems]
    
    // 项目编号筛选
    if (filters.projectId) {
      filtered = filtered.filter(item => 
        item.status === "形审通过" && 
        item.projectId.toLowerCase().includes(filters.projectId.toLowerCase())
      )
    }
    
    // 审查类型筛选
    if (filters.reviewType) {
      filtered = filtered.filter(item => item.reviewType === filters.reviewType)
    }
    
    // 项目名称筛选
    if (filters.name) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(filters.name.toLowerCase())
      )
    }
    
    // 所属院系筛选
    if (filters.department) {
      filtered = filtered.filter(item => 
        item.department?.toLowerCase().includes(filters.department.toLowerCase())
      )
    }
    
    // 伦理委员会筛选
    if (filters.ethicsCommittee) {
      filtered = filtered.filter(item => item.ethicsCommittee === filters.ethicsCommittee)
    }
    
    // 状态筛选
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status)
    }
    
    // 审查结果筛选
    if (filters.reviewResult) {
      filtered = filtered.filter(item => item.reviewResult === filters.reviewResult)
    }
    
    // 项目负责人筛选
    if (filters.projectLeader) {
      filtered = filtered.filter(item => 
        item.projectLeader?.name?.toLowerCase().includes(filters.projectLeader.toLowerCase())
      )
    }
    
    // 日期范围筛选
    if (filters.dueDateRange?.from && filters.dueDateRange?.to) {
      const fromDate = new Date(filters.dueDateRange.from)
      const toDate = new Date(filters.dueDateRange.to)
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.dueDate)
        return itemDate >= fromDate && itemDate <= toDate
      })
    }
    
    setData(filtered)
    setTotalItems(filtered.length)
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
    router.push(`/ethic-review/track-review/${item.id}`)
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
        title="跟踪审查"
        data={data}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearch={handleSearchExecute}
        searchPlaceholder="搜索项目编号、名称、院系或负责人..."
        noResultsText="未找到符合条件的跟踪审查项目"
        quickFilters={quickFilters.map(filter => ({...filter, category: "基本"}))}
        onQuickFilterChange={handleQuickFilterChange}
        quickFilterValues={filterValues}
        filterValues={seniorFilterValues}
        sortOptions={typedSortOptions}
        activeSortOption={sortOption}
        onSortChange={handleSortChange}
        defaultViewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        tableColumns={tableColumns}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={handleVisibleColumnsChange}
        cardFields={cardFields}
        cardActions={cardActions}
        titleField="name"
        descriptionField="description"
        statusField="status"
        statusVariants={dataListStatusVariants}
        getStatusName={getStatusName}
        priorityField="priority"
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        selectedRows={selectedRows}
        onSelectedRowsChange={handleSelectionChange}
        onItemClick={handleItemClick}
        detailsUrlPrefix="/ethic-review/track-review"
        onAddNew={handleAddNew}
        addButtonLabel="新建跟踪审查"
        onOpenSettings={handleOpenSettings}
        settingsButtonLabel="设置"
        categories={filterCategories}
        onAdvancedFilter={handleAdvancedFilter}
        customActions={
          <Button 
            variant="outline"
            className="gap-2 ml-2" 
            onClick={handleAIAssist}
          >
            <Sparkles className="h-4 w-4" />
            AI智能填报
          </Button>
        }
        showHeaderButtons={false}
        batchActions={batchActions}
      />
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