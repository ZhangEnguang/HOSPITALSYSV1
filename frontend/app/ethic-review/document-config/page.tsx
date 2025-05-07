"use client"

import { documentConfigItems } from "./data/document-config-demo-data"
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
} from "./config/document-config"
import { Eye, FileEdit, Trash2, Files, FilePlus, FileCheck, File, CheckCircle, XCircle, Copy, MoreVertical, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

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

function DocumentConfigContent() {
  const router = useRouter()
  
  // 状态管理
  const [data, setData] = useState(documentConfigItems)
  const [totalItems, setTotalItems] = useState(documentConfigItems.length)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchValue, setSearchValue] = useState("")
  const [sortOption, setSortOption] = useState(sortOptions[0].id)
  const [filterValues, setFilterValues] = useState({
    reviewType: "全部类型",
    projectType: "全部类型",
    status: "全部状态",
  })
  const [seniorFilterValues, setSeniorFilterValues] = useState<Record<string, any>>({})
  const [visibleColumns, setVisibleColumns] = useState(
    tableColumns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {} as Record<string, boolean>)
  )
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  
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
      setData(documentConfigItems)
      setTotalItems(documentConfigItems.length)
      return
    }

    const searchLower = searchValue.toLowerCase()
    const filteredData = documentConfigItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.reviewType?.toLowerCase().includes(searchLower) ||
      item.projectType?.toLowerCase().includes(searchLower) ||
      item.createdBy?.name?.toLowerCase().includes(searchLower)
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
        if (field === "createdAt" || field === "updatedAt") {
          const valueA = new Date(a[field as keyof typeof a] as string || "").getTime() || 0;
          const valueB = new Date(b[field as keyof typeof b] as string || "").getTime() || 0;
          return direction === "asc" ? valueA - valueB : valueB - valueA;
        } 
        // 数字字段
        else if (field === "documentCount" || field === "requiredCount" || field === "optionalCount") {
          const valueA = a[field as keyof typeof a] as number || 0;
          const valueB = b[field as keyof typeof b] as number || 0;
          return direction === "asc" ? valueA - valueB : valueB - valueA;
        }
        // 字符串字段
        else if (field === "name" || field === "reviewType" || field === "projectType") {
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
    
    let filtered = [...documentConfigItems]
    
    // 应用所有筛选条件
    const newFilters = { ...filterValues, [filterId]: value }
    
    // 审查类型筛选
    if (newFilters.reviewType !== "全部类型") {
      filtered = filtered.filter(item => item.reviewType === newFilters.reviewType)
    }
    
    // 项目类型筛选
    if (newFilters.projectType !== "全部类型") {
      filtered = filtered.filter(item => item.projectType === newFilters.projectType)
    }
    
    // 状态筛选
    if (newFilters.status !== "全部状态") {
      const statusValue = newFilters.status === "启用" ? "enabled" : "disabled"
      filtered = filtered.filter(item => item.status === statusValue)
    }
    
    setData(filtered)
    setTotalItems(filtered.length)
    setCurrentPage(1)
  }

  // 处理高级筛选
  const handleAdvancedFilter = (filters: Record<string, any>) => {
    setSeniorFilterValues(filters)
    
    // 筛选逻辑
    let filtered = [...documentConfigItems]
    
    // 配置名称筛选
    if (filters.name) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(filters.name.toLowerCase())
      )
    }
    
    // 审查类型筛选
    if (filters.reviewType) {
      filtered = filtered.filter(item => item.reviewType === filters.reviewType)
    }
    
    // 项目类型筛选
    if (filters.projectType) {
      filtered = filtered.filter(item => item.projectType === filters.projectType)
    }
    
    // 状态筛选
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status)
    }
    
    // 文件数量筛选
    if (filters.documentCount) {
      const count = parseInt(filters.documentCount)
      if (!isNaN(count)) {
        filtered = filtered.filter(item => item.documentCount === count)
      }
    }
    
    // 必交文件数筛选
    if (filters.requiredCount) {
      const count = parseInt(filters.requiredCount)
      if (!isNaN(count)) {
        filtered = filtered.filter(item => item.requiredCount === count)
      }
    }
    
    // 选交文件数筛选
    if (filters.optionalCount) {
      const count = parseInt(filters.optionalCount)
      if (!isNaN(count)) {
        filtered = filtered.filter(item => item.optionalCount === count)
      }
    }
    
    // 创建日期筛选
    if (filters.createdAt) {
      const filterDate = new Date(filters.createdAt)
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt)
        return itemDate.toDateString() === filterDate.toDateString()
      })
    }
    
    // 更新日期筛选
    if (filters.updatedAt) {
      const filterDate = new Date(filters.updatedAt)
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.updatedAt)
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

  // 处理项目点击 - 此函数将不再使用，但保留以备将来需要
  const handleItemClick = (item: any) => {
    // router.push(`/ethic-review/document-config/${item.id}`)
    // 不执行任何操作
    console.log("Item clicked, but navigation disabled:", item.id)
  }

  // 处理添加新配置
  const handleAddNew = () => {
    router.push("/ethic-review/document-config/create")
  }

  // 处理AI辅助生成
  const handleAIAssist = () => {
    console.log("启动AI智能填报")
  }
  
  // 处理查看详情
  const handleViewDetails = (item: any) => {
    router.push(`/ethic-review/document-config/${item.id}`)
  }
  
  // 处理编辑配置
  const handleEditConfig = (item: any) => {
    router.push(`/ethic-review/document-config/${item.id}/edit`)
  }
  
  // 处理删除配置
  const handleDeleteConfig = (item: any) => {
    const confirmed = window.confirm(`确定要删除配置 "${item.name}" 吗？`)
    if (confirmed) {
      console.log("删除配置", item.id)
      // 实际应用中应调用API删除数据
      const newData = data.filter(config => config.id !== item.id)
      setData(newData)
      setTotalItems(newData.length)
    }
  }
  
  return (
    <DataList
      title="送审文件配置"
      data={data}
      addButtonLabel="新建文件配置"
      onAddNew={handleAddNew}
      onAIAssist={handleAIAssist}
      searchValue={searchValue}
      searchPlaceholder="搜索配置名称、审查类型或项目类型..."
      noResultsText="未找到符合条件的送审文件配置"
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
      batchActions={[
        {
          id: "bulkEnable",
          label: "批量启用",
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: () => {
            console.log("批量启用", selectedRows);
            // 实际应用中应调用API批量更新数据
            const newData = data.map(item => 
              selectedRows.includes(item.id) 
                ? { ...item, status: "enabled" } 
                : item
            );
            setData(newData);
            alert(`已成功启用${selectedRows.length}项配置`);
          },
        },
        {
          id: "bulkDisable",
          label: "批量禁用",
          icon: <XCircle className="h-4 w-4" />,
          onClick: () => {
            console.log("批量禁用", selectedRows);
            // 实际应用中应调用API批量更新数据
            const newData = data.map(item => 
              selectedRows.includes(item.id) 
                ? { ...item, status: "disabled" } 
                : item
            );
            setData(newData);
            alert(`已成功禁用${selectedRows.length}项配置`);
          },
        },
        {
          id: "bulkDuplicate",
          label: "批量复制",
          icon: <Copy className="h-4 w-4" />,
          onClick: () => {
            console.log("批量复制", selectedRows);
            alert(`已选择${selectedRows.length}项进行批量复制`);
          },
        },
        {
          id: "bulkDelete",
          label: "批量删除",
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          onClick: () => {
            const confirmed = window.confirm(`确定要删除选中的${selectedRows.length}项配置吗？`);
            if (confirmed) {
              console.log("批量删除", selectedRows);
              // 实际应用中应调用API批量删除数据
              const newData = data.filter(item => !selectedRows.includes(item.id));
              setData(newData);
              setTotalItems(newData.length);
              setSelectedRows([]);
              alert(`已成功删除${selectedRows.length}项配置`);
            }
          },
        },
      ]}
    />
  )
}

export default function DocumentConfigPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Suspense fallback={<div>加载中...</div>}>
        <DocumentConfigContent />
      </Suspense>
    </div>
  )
} 