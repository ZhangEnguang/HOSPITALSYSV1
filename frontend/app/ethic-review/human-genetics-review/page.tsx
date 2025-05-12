"use client"

import { humanGeneticsReviewItems } from "./data/human-genetics-review-demo-data"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import DataList from "@/components/data-management/data-list"
import { 
  tableColumns, 
  cardFields, 
  cardActions, 
  sortOptions, 
  quickFilters, 
  filterCategories,
  dataListStatusVariants,
  getStatusName
} from "./config/human-genetics-review-config"
import { useToast } from "@/components/ui/use-toast"

// 定义排序选项类型
interface SortOption {
  id: string
  field: string
  direction: "asc" | "desc"
  label: string
}

function HumanGeneticsReviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // 状态管理
  const [data, setData] = useState(humanGeneticsReviewItems)
  const [totalItems, setTotalItems] = useState(humanGeneticsReviewItems.length)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchValue, setSearchValue] = useState("")
  const [sortOption, setSortOption] = useState(sortOptions[0].id)
  const [filterValues, setFilterValues] = useState({
    reviewType: "全部类型",
    status: "全部状态",
    projectType: "全部类型",
    ethicsCommittee: "全部委员会",
    approvalType: "全部类型",
  })
  const [seniorFilterValues, setSeniorFilterValues] = useState<Record<string, any>>({})
  const [visibleColumns, setVisibleColumns] = useState(
    tableColumns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {} as Record<string, boolean>)
  )
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  
  // 定义排序选项类型
  const typedSortOptions: SortOption[] = sortOptions as unknown as SortOption[]

  // 处理视图模式切换
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode as "grid" | "list")
  }

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 处理每页条数变化
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  // 处理搜索执行
  const handleSearchExecute = () => {
    if (!searchValue.trim()) {
      setData(humanGeneticsReviewItems)
      setTotalItems(humanGeneticsReviewItems.length)
      return
    }

    const searchLower = searchValue.toLowerCase()
    const filteredData = humanGeneticsReviewItems.filter(item => 
      item.projectId.toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower) ||
      item.department?.toLowerCase().includes(searchLower) ||
      item.projectLeader?.name?.toLowerCase().includes(searchLower) ||
      item.approvalType?.toLowerCase().includes(searchLower)
    )
    
    setData(filteredData)
    setTotalItems(filteredData.length)
    setCurrentPage(1)
  }

  // 处理排序变化
  const handleSortChange = (sortId: string) => {
    setSortOption(sortId)
    const selectedSort = typedSortOptions.find(option => option.id === sortId)
    
    if (selectedSort) {
      const { field, direction } = selectedSort
      
      const sortedData = [...data].sort((a, b) => {
        // 日期字段
        if (field === "dueDate" || field === "createdAt") {
          const valueA = new Date(a[field as keyof typeof a] as string || "").getTime() || 0;
          const valueB = new Date(b[field as keyof typeof b] as string || "").getTime() || 0;
          return direction === "asc" ? valueA - valueB : valueB - valueA;
        } 
        // 字符串字段
        else if (field === "name") {
          const valueA = (a[field as keyof typeof a] as string)?.toLowerCase() || "";
          const valueB = (b[field as keyof typeof b] as string)?.toLowerCase() || "";
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

  // 处理快速筛选
  const handleQuickFilterChange = (filterId: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [filterId]: value }))
    
    let filtered = [...humanGeneticsReviewItems]
    
    // 应用所有筛选条件
    const newFilters = { ...filterValues, [filterId]: value }
    
    // 审查类型筛选
    if (newFilters.approvalType !== "全部类型") {
      filtered = filtered.filter(item => item.approvalType === newFilters.approvalType)
    }
    
    // 研究类型筛选
    if (newFilters.reviewType !== "全部类型") {
      filtered = filtered.filter(item => item.reviewType === newFilters.reviewType)
    }
    
    // 状态筛选
    if (newFilters.status !== "全部状态") {
      filtered = filtered.filter(item => item.status === newFilters.status)
    }
    
    // 伦理委员会筛选
    if (newFilters.ethicsCommittee !== "全部委员会") {
      filtered = filtered.filter(item => item.ethicsCommittee === newFilters.ethicsCommittee)
    }
    
    setData(filtered)
    setTotalItems(filtered.length)
    setCurrentPage(1)
  }

  // 处理高级筛选
  const handleAdvancedFilter = (filters: Record<string, any>) => {
    setSeniorFilterValues(filters)
    
    // 筛选逻辑
    let filtered = [...humanGeneticsReviewItems]
    
    // 项目编号筛选
    if (filters.projectId) {
      filtered = filtered.filter(item => 
        item.projectId.toLowerCase().includes(filters.projectId.toLowerCase())
      )
    }
    
    // 审查类型筛选
    if (filters.approvalType) {
      filtered = filtered.filter(item => item.approvalType === filters.approvalType)
    }
    
    // 研究类型筛选
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

    // 遗传材料筛选
    if (filters.geneticMaterial) {
      filtered = filtered.filter(item => 
        item.geneticMaterial?.toLowerCase().includes(filters.geneticMaterial.toLowerCase())
      )
    }

    // 测序方法筛选
    if (filters.geneticTest) {
      filtered = filtered.filter(item => 
        item.geneticTest?.toLowerCase().includes(filters.geneticTest.toLowerCase())
      )
    }

    // 数据保护措施筛选
    if (filters.dataProtection) {
      filtered = filtered.filter(item => 
        item.dataProtection?.toLowerCase().includes(filters.dataProtection.toLowerCase())
      )
    }

    // 样本数量筛选
    if (filters.sampleSize) {
      filtered = filtered.filter(item => 
        item.sampleSize === parseInt(filters.sampleSize)
      )
    }
    
    setData(filtered)
    setTotalItems(filtered.length)
    setCurrentPage(1)
  }

  // 处理列可见性变化
  const handleVisibleColumnsChange = (columns: Record<string, boolean>) => {
    setVisibleColumns(columns)
  }

  // 处理选择行变化
  const handleSelectionChange = (selected: string[]) => {
    setSelectedRows(selected)
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

  // 处理点击项目
  const handleItemClick = (item: any) => {
    router.push(`/ethic-review/human-genetics-review/${item.id}`)
  }

  // 处理新建人遗资源
  const handleAddNew = () => {
    router.push("/ethic-review/human-genetics-review/new")
  }

  // AI智能填报处理
  const handleAIAssist = () => {
    console.log("打开AI智能填报")
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
        title="人遗资源"
        data={data}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearch={handleSearchExecute}
        searchPlaceholder="搜索受理号、名称、院系、审查类型或负责人..."
        noResultsText="未找到符合条件的人遗资源项目"
        quickFilters={quickFilters.map(filter => ({...filter, category: "基本"}))}
        onQuickFilterChange={handleQuickFilterChange}
        quickFilterValues={filterValues}
        categories={filterCategories}
        onAdvancedFilter={handleAdvancedFilter}
        filterValues={seniorFilterValues}
        sortOptions={typedSortOptions}
        activeSortOption={sortOption}
        onSortChange={handleSortChange}
        defaultViewMode="list"
        onViewModeChange={handleViewModeChange}
        tableColumns={tableColumns}
        tableActions={cardActions}
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
        detailsUrlPrefix="/ethic-review/human-genetics-review"
        showHeaderButtons={false}
        batchActions={batchActions}
      />
    </div>
  )
}

export default function HumanGeneticsReviewPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanGeneticsReviewContent />
    </Suspense>
  )
} 