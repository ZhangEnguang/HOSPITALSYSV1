"use client"

import { quickReviewItems } from "./data/quick-review-demo-data"
import { useRouter } from "next/navigation"
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
} from "./config/quick-review-config"
import { Brain, Eye, Users, ClipboardCheck, MoreVertical, Trash2, UserPlus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import AssignAdvisorDialog from "./components/assign-advisor-dialog"
import { toast } from "@/components/ui/use-toast"

// 定义排序选项类型
interface SortOption {
  id: string
  field: string
  direction: "asc" | "desc"
  label: string
}

// 定义列类型
interface Column {
  id: string
  header: string
  accessorKey?: string
  cell: (item: any) => JSX.Element
}

function QuickReviewContent() {
  const router = useRouter()
  
  // 状态管理
  const [data, setData] = useState(quickReviewItems)
  const [totalItems, setTotalItems] = useState(quickReviewItems.length)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchValue, setSearchValue] = useState("")
  const [sortOption, setSortOption] = useState(sortOptions[0].id)
  const [filterValues, setFilterValues] = useState({
    projectSubType: "全部类型",
    reviewType: "全部类型",
    status: "全部状态",
    reviewResult: "全部结果",
  })
  const [seniorFilterValues, setSeniorFilterValues] = useState<any>({})
  const [visibleColumns, setVisibleColumns] = useState(
    tableColumns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {} as Record<string, boolean>)
  )
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [assignAdvisorDialogOpen, setAssignAdvisorDialogOpen] = useState(false)
  const [selectedProjectForAdvisor, setSelectedProjectForAdvisor] = useState<any>(null)
  
  // 定义排序选项类型
  const typedSortOptions: SortOption[] = sortOptions as unknown as SortOption[]
  // 定义表格列类型
  const typedTableColumns: Column[] = tableColumns as Column[]

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
      setData(quickReviewItems)
      setTotalItems(quickReviewItems.length)
      return
    }

    const searchLower = searchValue.toLowerCase()
    const filteredData = quickReviewItems.filter(item => 
      item.projectId?.toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower) ||
      item.department?.toLowerCase().includes(searchLower) ||
      item.projectLeader?.name?.toLowerCase().includes(searchLower) ||
      (item.mainReviewers && item.mainReviewers.some(reviewer => 
        reviewer?.name?.toLowerCase().includes(searchLower)
      ))
    )
    
    setData(filteredData)
    setTotalItems(filteredData.length)
    setCurrentPage(1)
  }

  // 处理搜索值变化
  const handleSearchChange = (value: string) => {
    setSearchValue(value)
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
    
    let filtered = [...quickReviewItems]
    
    // 应用所有筛选条件
    const newFilters = { ...filterValues, [filterId]: value }
    
    // 项目类型筛选
    if (newFilters.projectSubType !== "全部类型") {
      filtered = filtered.filter(item => item.projectSubType === newFilters.projectSubType)
    }
    
    // 审查类型筛选
    if (newFilters.reviewType !== "全部类型") {
      filtered = filtered.filter(item => item.reviewType === newFilters.reviewType)
    }
    
    // 状态筛选
    if (newFilters.status !== "全部状态") {
      filtered = filtered.filter(item => item.status === newFilters.status)
    }
    
    // 审查结果筛选
    if (newFilters.reviewResult !== "全部结果") {
      filtered = filtered.filter(item => item.reviewResult === newFilters.reviewResult)
    }
    
    setData(filtered)
    setTotalItems(filtered.length)
    setCurrentPage(1)
  }

  // 处理独立顾问指派事件监听
  useEffect(() => {
    const handleAssignAdvisor = (event: CustomEvent) => {
      const { item } = event.detail
      setSelectedProjectForAdvisor(item)
      setAssignAdvisorDialogOpen(true)
    }

    window.addEventListener('assignAdvisor', handleAssignAdvisor as EventListener)
    
    return () => {
      window.removeEventListener('assignAdvisor', handleAssignAdvisor as EventListener)
    }
  }, [])

  // 处理高级筛选
  const handleAdvancedFilter = (filters: any) => {
    setSeniorFilterValues(filters)
    
    // 筛选逻辑
    let filtered = [...quickReviewItems]
    
    // 项目编号筛选
    if (filters.projectId) {
      filtered = filtered.filter(item => 
        item.projectId?.toLowerCase().includes(filters.projectId.toLowerCase())
      )
    }
    
    // 审查类型筛选
    if (filters.reviewType) {
      filtered = filtered.filter(item => item.reviewType === filters.reviewType)
    }
    
    // 项目类型筛选
    if (filters.projectSubType) {
      filtered = filtered.filter(item => item.projectSubType === filters.projectSubType)
    }
    
    // 项目类型筛选
    if (filters.projectType) {
      filtered = filtered.filter(item => item.projectType === filters.projectType)
    }
    
    // 项目名称筛选
    if (filters.name) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(filters.name.toLowerCase())
      )
    }
    
    // 所属科室筛选
    if (filters.department) {
      filtered = filtered.filter(item => 
        item.department?.toLowerCase().includes(filters.department.toLowerCase())
      )
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

    // 主审委员筛选
    if (filters.mainReviewer) {
      filtered = filtered.filter(item => 
        item.mainReviewers && item.mainReviewers.some(reviewer => 
          reviewer?.name?.toLowerCase().includes(filters.mainReviewer.toLowerCase())
        )
      )
    }

    // 提交日期筛选
    if (filters.submissionDate) {
      const filterDate = new Date(filters.submissionDate)
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.submissionDate)
        return itemDate.toDateString() === filterDate.toDateString()
      })
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

  // 处理项目点击 - 现在不需要了，但保留函数以免其他地方引用
  const handleItemClick = (item: any) => {
    // 取消跳转功能
    // router.push(`/ethic-review/quick-review/${item.id}`)
    console.log("点击项目", item.id)
  }

  // 批量删除项目
  const handleBatchDelete = () => {
    // 在实际应用中，这里应该有一个确认对话框
    console.log("批量删除项目", selectedRows)
    // 删除选中的项目
    const newData = data.filter(item => !selectedRows.includes(item.id))
    setData(newData)
    setTotalItems(newData.length)
    setSelectedRows([])
  }
  
  // 批量分配专家
  const handleBatchAssignExperts = () => {
    // 获取选中项目
    const selectedItems = data.filter(item => selectedRows.includes(item.id))
    console.log("批量分配专家", selectedItems)
    // 在实际应用中，应该打开一个模态框来选择专家
    router.push(`/ethic-review/quick-review/batch-assign?ids=${selectedRows.join(",")}`)
  }
  
  // 批量意见汇总
  const handleBatchSummaryOpinions = () => {
    // 获取选中项目
    const selectedItems = data.filter(item => selectedRows.includes(item.id))
    console.log("批量意见汇总", selectedItems)
    // 在实际应用中，应该生成一个汇总报告
    router.push(`/ethic-review/quick-review/batch-summary?ids=${selectedRows.join(",")}`)
  }

  // 定义批量操作按钮
  const batchActions = [
    {
      id: "batchDelete",
      label: "批量删除",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleBatchDelete,
      variant: "destructive"
    },
    {
      id: "batchAssignExperts",
      label: "批量分配专家",
      icon: <UserPlus className="h-4 w-4" />,
      onClick: handleBatchAssignExperts,
      variant: "default"
    },
    {
      id: "batchSummaryOpinions",
      label: "批量意见汇总",
      icon: <FileText className="h-4 w-4" />,
      onClick: handleBatchSummaryOpinions,
      variant: "default"
    }
  ]

  // 处理添加新项目
  const handleAddNew = () => {
    router.push("/ethic-review/quick-review/create")
  }

  // 处理AI辅助
  const handleAIAssist = () => {
    console.log("启动AI智能填报")
  }
  
  // 处理查看详情
  const handleViewDetails = (item: any) => {
    router.push(`/ethic-review/quick-review/${item.id}`)
  }
  
  // 处理分配专家
  const handleAssignExperts = (item: any) => {
    router.push(`/ethic-review/quick-review/${item.id}/assign`)
  }
  
  // 处理意见汇总
  const handleSummaryOpinions = (item: any) => {
    router.push(`/ethic-review/quick-review/${item.id}/summary`)
  }

  // 处理独立顾问指派
  const handleAssignAdvisor = async (advisorIds: string[], questions: string) => {
    try {
      // 模拟API调用
      console.log("指派独立顾问:", {
        projectId: selectedProjectForAdvisor?.id,
        advisorIds,
        questions
      })
      
      // 这里应该调用实际的API
      // await assignAdvisorToProject(selectedProjectForAdvisor.id, advisorIds, questions)
      
      toast({
        title: "指派成功",
        description: `已成功为项目 "${selectedProjectForAdvisor?.name}" 指派独立顾问`,
      })
      
      // 可以选择刷新数据或更新本地状态
      // refreshData()
      
    } catch (error) {
      console.error("指派独立顾问失败:", error)
      toast({
        title: "指派失败",
        description: "指派过程中发生错误，请稍后重试",
        variant: "destructive",
      })
      throw error // 重新抛出错误，让对话框处理
    }
  }
  
  return (
    <>
      <DataList
        title="快速审查"
      data={data}
      showHeaderButtons={false}
      searchValue={searchValue}
      searchPlaceholder="搜索项目名称、院系或负责人..."
      noResultsText="未找到符合条件的快速审查项目"
      onSearchChange={handleSearchChange}
      onSearch={handleSearchExecute}
      quickFilters={quickFilters}
      onQuickFilterChange={handleQuickFilterChange}
      quickFilterValues={filterValues}
      seniorFilterValues={seniorFilterValues}
      onAdvancedFilter={handleAdvancedFilter}
      categories={filterCategories}
      sortOptions={sortOptions}
      activeSortOption={sortOption}
      onSortChange={handleSortChange}
      defaultViewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      tableColumns={typedTableColumns as any}
      visibleColumns={visibleColumns}
      onVisibleColumnsChange={handleVisibleColumnsChange}
      cardFields={cardFields}
      cardActions={cardActions}
      titleField="name"
      descriptionField="description"
      statusField="status"
      statusVariants={dataListStatusVariants}
      getStatusName={getStatusName}
      pageSize={pageSize}
      currentPage={currentPage}
      totalItems={totalItems}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      selectedRows={selectedRows}
      onSelectedRowsChange={handleSelectionChange}
      idField="id"
      batchActions={batchActions}
    />

    {/* 独立顾问指派对话框 */}
    <AssignAdvisorDialog
      isOpen={assignAdvisorDialogOpen}
      onOpenChange={setAssignAdvisorDialogOpen}
      project={selectedProjectForAdvisor}
      onAssign={handleAssignAdvisor}
    />
    </>
  )
}

export default function QuickReviewPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Suspense fallback={<div>加载中...</div>}>
        <QuickReviewContent />
      </Suspense>
    </div>
  )
} 