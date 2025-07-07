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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Settings, PlusSquare, Sparkles, CheckCircle, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { initialReviewItems } from "./data/initial-review-demo-data"
import {
  tableColumns,
  statusVariants,
  getStatusName,
  sortOptions,
  quickFilters,
  cardFields,
  cardActions,
  filterCategories,
} from "./config/initial-review-config"
import { useToast } from "@/components/ui/use-toast"
import { SeniorFilterDTO } from "@/components/data-management/data-list-advanced-filter"
import InitialReviewCard from "./components/initial-review-card"

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

function InitialReviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // 状态管理
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchValue, setSearchValue] = useState<string>("")
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [sortOption, setSortOption] = useState<string>("dueDateDesc")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    reviewType: "全部审查",
    status: "全部状态",
    reviewMethod: "全部方式",
    projectType: "全部类型",
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
    projectType: true,
    name: true,
    projectLeader: true,
    department: true,
    ethicsCommittee: true,
    status: true,
    reviewMethod: true,
    actions: true,
  })

  // 初始化数据
  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setData(initialReviewItems)
      setTotalItems(initialReviewItems.length)
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
    const filtered = initialReviewItems.filter(item => 
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
    let filtered = [...initialReviewItems]
    
    if (newFilterValues.reviewType && newFilterValues.reviewType !== "全部审查") {
      filtered = filtered.filter(item => item.reviewType === newFilterValues.reviewType)
    }
    
    if (newFilterValues.status && newFilterValues.status !== "全部状态") {
      filtered = filtered.filter(item => item.status === newFilterValues.status)
    }
    
    if (newFilterValues.reviewMethod && newFilterValues.reviewMethod !== "全部方式") {
      filtered = filtered.filter(item => item.reviewMethod === newFilterValues.reviewMethod)
    }
    
    if (newFilterValues.projectType && newFilterValues.projectType !== "全部类型") {
      filtered = filtered.filter(item => item.projectType === newFilterValues.projectType)
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
    setData(initialReviewItems)
    setTotalItems(initialReviewItems.length)
  }

  // 处理排序
  const handleSortChange = (sortId: string) => {
    setSortOption(sortId)
    const selectedSort = typedSortOptions.find(option => option.id === sortId)
    
    if (selectedSort) {
      const { field, direction } = selectedSort
      
      const sorted = [...data].sort((a, b) => {
        let aValue = a[field]
        let bValue = b[field]
        
        // 对于嵌套字段的处理
        if (field === "projectLeader") {
          aValue = a.projectLeader?.name || ""
          bValue = b.projectLeader?.name || ""
        }
        
        // 字符串比较
        if (typeof aValue === "string" && typeof bValue === "string") {
          return direction === "asc" 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue)
        }
        
        // 数字比较
        return direction === "asc" ? aValue - bValue : bValue - aValue
      })
      
      setData(sorted)
    }
  }

  // 处理页面变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 处理页面大小变化
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  // 处理选择行变化
  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedRows(selectedIds)
  }

  // 处理查看模式变化
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode)
  }

  // 处理可见列变化
  const handleVisibleColumnsChange = (columns: Record<string, boolean>) => {
    setVisibleColumns(columns)
  }

  // 处理新增项目
  const handleAddNew = () => {
    router.push("/ethic-review/initial-review/create")
  }

  // 处理AI助手
  const handleAIAssist = () => {
    // 调用AI助手相关功能
    toast({
      title: "AI助手已启动",
      description: "正在为您生成智能审查建议...",
    })
  }

  // 处理打开设置
  const handleOpenSettings = () => {
    toast({
      title: "设置",
      description: "设置功能开发中",
    })
  }

  // 处理项目点击
  const handleItemClick = (item: any) => {
    // 始终使用id属性作为路由参数
    const id = item.id;
    console.log("点击项目，跳转到详情页: ", id);
    router.push(`/ethic-review/initial-review/${id}`);
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

  // 批量操作按钮
  const batchActions = [
    {
      label: "批量审核",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: () => {
        toast({
          title: "批量审核",
          description: `已选择 ${selectedRows.length} 个项目进行批量审核`,
        })
      },
    },
    {
      label: "批量删除",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => {
        toast({
          title: "批量删除",
          description: `已选择 ${selectedRows.length} 个项目进行批量删除`,
        })
      },
    },
  ]

  // 新增按钮下拉菜单项
  const addButtonDropdownItems = [
    {
      label: "创建技术可行性审查",
      icon: <PlusSquare className="h-4 w-4" />,
      onClick: () => router.push("/ethic-review/initial-review/create?type=technical"),
    },
    {
      label: "创建伦理审查",
      icon: <PlusSquare className="h-4 w-4" />,
      onClick: () => router.push("/ethic-review/initial-review/create?type=ethics"),
    },
    {
      label: "创建立项必要性审查",
      icon: <PlusSquare className="h-4 w-4" />,
      onClick: () => router.push("/ethic-review/initial-review/create?type=necessity"),
    },
    {
      label: "创建预算审查",
      icon: <PlusSquare className="h-4 w-4" />,
      onClick: () => router.push("/ethic-review/initial-review/create?type=budget"),
    },
  ]

  // 为快速筛选选项添加必要的字段
  const enhancedQuickFilters = quickFilters.map(filter => ({
    ...filter,
    value: filterValues[filter.id] || "",
    category: "basic",
    options: filter.options.map(option => ({
      ...option,
      id: option.value
    }))
  }))

  // 为状态变体添加类型转换，保持与表格列中相同的颜色样式
  const statusVariantsFormatted = Object.keys(statusVariants).reduce((acc, key) => {
    acc[key] = statusVariants[key].color;
    return acc;
  }, {} as Record<string, string>);

  // 使用类型断言直接转换
  const formattedFilterCategories = filterCategories as unknown as {
    id: string;
    title: string;
    fields: {
      id: string;
      label: string;
      type: "number" | "select" | "text" | "date" | "member";
      options?: { value: string; label: string; }[];
      category?: string;
      placeholder?: string;
    }[];
  }[];

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
      <InitialReviewCard
        key={item.id}
        item={item}
        actions={enhancedActions}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        onClick={() => handleItemClick(item)}
        statusVariants={statusVariantsFormatted as Record<string, "default" | "destructive" | "outline" | "secondary">}
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
        title="初始审查"
        data={data}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchValue}
        searchPlaceholder="搜索项目编号、名称、院系或负责人..."
        noResultsText="没有找到符合条件的审查记录"
        onSearchChange={(value) => setSearchValue(value)}
        onSearch={handleSearchExecute}
        quickFilters={enhancedQuickFilters}
        onQuickFilterChange={handleQuickFilterChange}
        quickFilterValues={filterValues}
        seniorFilterValues={seniorFilterValues}
        onAdvancedFilter={handleAdvancedFilter}
        sortOptions={typedSortOptions}
        activeSortOption={sortOption}
        onSortChange={handleSortChange}
        defaultViewMode={viewMode}
        onViewModeChange={(mode) => handleViewModeChange(mode as "grid" | "list")}
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
        addButtonLabel="新建审查"
        onAddNew={handleAddNew}
        categories={formattedFilterCategories}
        idField="id"
        addButtonDropdownItems={addButtonDropdownItems}
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

export default function InitialReviewPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <InitialReviewContent />
    </Suspense>
  )
} 