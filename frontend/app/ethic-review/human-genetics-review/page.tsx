"use client"

// 扩展Window接口
declare global {
  interface Window {
    showDeleteConfirm?: (item: any) => void
  }
}

import { humanGeneticsReviewItems } from "./data/human-genetics-review-demo-data"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import DataList from "@/components/data-management/data-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  tableColumns, 
  cardFields, 
  cardActions, 
  sortOptions, 
  quickFilters, 
  filterCategories,
  dataListStatusVariants,
  getStatusName,
  statusVariants
} from "./config/human-genetics-review-config"
import { useToast } from "@/components/ui/use-toast"
import { SeniorFilterDTO } from "@/components/data-management/data-list-advanced-filter"
import HumanGeneticsReviewCard from "./components/human-genetics-review-card"
import { CheckCircle, Trash2 } from "lucide-react"

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchValue, setSearchValue] = useState("")
  const [sortOption, setSortOption] = useState(sortOptions[0].id)
  const [filterValues, setFilterValues] = useState({
    reviewType: "全部类型",
    status: "全部状态",
    reviewMethod: "全部方式",
    projectType: "全部类型",
    ethicsCommittee: "全部委员会",
    approvalType: "全部类型",
  })
  const [seniorFilterValues, setSeniorFilterValues] = useState<SeniorFilterDTO>({
    groupOperator: "and" as const,
    groups: []
  })
  const [visibleColumns, setVisibleColumns] = useState({
    projectId: true,
    approvalType: true,
    reviewType: true,
    name: true,
    projectLeader: true,
    department: true,
    ethicsCommittee: true,
    status: true,
    reviewMethod: true,
    actions: true,
  })
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  
  // 删除确认弹框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  
  // 定义排序选项类型
  const typedSortOptions: SortOption[] = sortOptions as unknown as SortOption[]

  // 初始化全局删除确认函数
  useEffect(() => {
    // 设置全局删除确认函数
    window.showDeleteConfirm = handleDeleteConfirm
    
    // 清理函数
    return () => {
      delete window.showDeleteConfirm
    }
  }, [])

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
    
    // 审查方式筛选
    if (newFilters.reviewMethod !== "全部方式") {
      filtered = filtered.filter(item => item.reviewMethod === newFilters.reviewMethod)
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
    setSeniorFilterValues({
      groupOperator: "and" as const,
      groups: []
    })
    
    // 这里可以根据filters进行更复杂的筛选逻辑
    // 当前先保持简单的筛选实现
    setData(humanGeneticsReviewItems)
    setTotalItems(humanGeneticsReviewItems.length)
  }

  // 处理列可见性变化
  const handleVisibleColumnsChange = (columns: Record<string, boolean>) => {
    setVisibleColumns({
      projectId: columns.projectId ?? true,
      approvalType: columns.approvalType ?? true,
      reviewType: columns.reviewType ?? true,
      name: columns.name ?? true,
      projectLeader: columns.projectLeader ?? true,
      department: columns.department ?? true,
      ethicsCommittee: columns.ethicsCommittee ?? true,
      status: columns.status ?? true,
      actions: columns.actions ?? true,
    })
  }

  // 处理选择行变化
  const handleSelectionChange = (selected: string[]) => {
    setSelectedRows(selected)
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
          duration: 3000,
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
      <HumanGeneticsReviewCard
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
        defaultViewMode="grid"
        onViewModeChange={handleViewModeChange}
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
        onItemClick={handleItemClick}
        detailsUrlPrefix="/ethic-review/human-genetics-review"
        showHeaderButtons={false}
        batchActions={batchActions}
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

export default function HumanGeneticsReviewPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanGeneticsReviewContent />
    </Suspense>
  )
} 