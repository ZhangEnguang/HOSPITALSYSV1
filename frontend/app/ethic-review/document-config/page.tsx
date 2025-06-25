"use client"

import { documentConfigItems } from "./data/document-config-demo-data"
import { useRouter } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import DataList from "@/components/data-management/data-list"
import { useToast } from "@/hooks/use-toast"
import { SeniorFilterDTO } from "@/components/data-management/data-list-advanced-filter"
import { 
  tableColumns, 
  cardFields, 
  cardActions, 
  sortOptions, 
  quickFilters, 
  filterCategories,
  dataListStatusVariants,
  getStatusName,
  batchActions
} from "./config/document-config"
import { Eye, FileEdit, Trash2, Files, FilePlus, FileCheck, File, CheckCircle, XCircle, Copy, MoreVertical, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import DocumentConfigCard from "./components/document-config-card"

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

// 定义卡片字段类型
interface CardFieldConfig {
  label: string
  value: string
  render: (item: any) => React.ReactNode
  className?: string
}

interface CardField {
  id: string
  label: string
  value: (item: any) => React.ReactNode
  className?: string
}

// 将cardFields转换为DataListCard需要的格式
const adaptedCardFields: CardField[] = cardFields
  // 使用全部4个新配置的字段
  .map((field: CardFieldConfig) => ({
    id: field.value,  // 使用value字段作为id
    label: field.label,
    value: (item: any) => field.render ? field.render(item) : item[field.value], // 将render函数转为value函数
    className: field.className || ""  // 如果没有className则提供空字符串默认值
  }))

function DocumentConfigContent() {
  const router = useRouter()
  const { toast } = useToast()
  
  // 确保表格列包含操作列
  const ensureTableColumns = () => {
    // 检查是否已经包含操作列
    const hasActionsColumn = tableColumns.some(col => col.id === 'actions');
    
    if (!hasActionsColumn) {
      // 添加操作列到表格列
      return [...tableColumns, {
        id: "actions",
        header: "操作",
        className: "w-[120px] text-right pr-4",
        cell: (item: any) => {
          return (
            <div className="flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">打开菜单</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleViewDetails(item)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <span>查看详情</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleEditConfig(item)}
                  >
                    <FileEdit className="mr-2 h-4 w-4" />
                    <span>编辑配置</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => handleDeleteConfig(item)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>删除配置</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }
      }];
    }
    
    return tableColumns;
  };
  
  // 获取处理后的表格列
  const processedTableColumns = ensureTableColumns();
  
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
  const [seniorFilterValues, setSeniorFilterValues] = useState<SeniorFilterDTO>({
    groupOperator: "and" as const,
    groups: []
  })
  const [visibleColumns, setVisibleColumns] = useState(() => {
    // 确保actions列可见
    const columns = processedTableColumns.reduce(
      (acc, col) => ({ ...acc, [col.id]: true }), 
      {} as Record<string, boolean>
    );
    // 明确设置actions列为可见
    columns['actions'] = true;
    return columns;
  })
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
  const handleAdvancedFilter = (filters: SeniorFilterDTO) => {
    setSeniorFilterValues(filters)
    
    // 筛选逻辑
    let filtered = [...documentConfigItems]
    
    // 兼容旧版和新版高级筛选格式
    if (filters.groups && filters.groupOperator) {
      // 新版高级筛选格式 (SeniorFilterDTO)
      
      // 这里就是直接使用未处理的格式，实际应用中需要根据结构进行解析
      console.log("使用新版高级筛选格式", filters)
      
      // 简单处理：从conditions中提取字段和值进行筛选
      filters.groups.forEach((group: any) => {
        group.conditions.forEach((condition: any) => {
          const { fieldId, value, compareType } = condition
          
          if (fieldId && value) {
            filtered = filtered.filter(item => {
              if (compareType === "=") {
                return (item as any)[fieldId] === value
              } else if (compareType === "contains") {
                return String((item as any)[fieldId]).toLowerCase().includes(String(value).toLowerCase())
              }
              return true
            })
          }
        })
      })
    } else {
      // 旧版单字段筛选格式
      
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
    router.push(`/ethic-review/document-config/${item.id}`)
    console.log("Item clicked, navigating to:", item.id)
  }

  // 处理添加新配置
  const handleAddNew = () => {
    router.push("/ethic-review/document-config/create")
  }


  
  // 处理查看详情
  const handleViewDetails = (item: any) => {
    router.push(`/ethic-review/document-config/${item.id}`)
  }
  
  // 处理编辑配置
  const handleEditConfig = (item: any) => {
    console.log("编辑配置被调用", item.id);
    
    // 使用最可靠的导航方式
    if (typeof window !== 'undefined') {
      // 构建编辑页面URL
      const editUrl = `/ethic-review/document-config/edit/${item.id}`;
      console.log("正在导航到编辑页面:", editUrl);
      
      // 直接使用location.href进行导航
      window.location.href = editUrl;
    } else {
      // 服务器端渲染时使用router
      router.push(`/ethic-review/document-config/edit/${item.id}`);
    }
  }
  
  // 处理删除配置
  const handleDeleteConfig = (item: any) => {
    console.log("删除配置", item.id)
    // 实际应用中应调用API删除数据
    const newData = data.filter(config => config.id !== item.id)
    setData(newData)
    setTotalItems(newData.length)
    
    // 显示成功提示toast
    toast({
      title: "删除成功",
      description: `配置 "${item.name}" 已删除`,
      variant: "destructive",
    })
  }
  
  // 处理状态切换（启用/禁用）
  const handleToggleStatus = (item: any) => {
    const newStatus = item.status === "enabled" ? "disabled" : "enabled"
    const statusText = newStatus === "enabled" ? "启用" : "禁用"
    
    console.log(`${statusText}配置`, item.id, "新状态:", newStatus)
    
    // 更新数据中的状态
    const newData = data.map(config => 
      config.id === item.id 
        ? { ...config, status: newStatus, updatedAt: new Date().toISOString() }
        : config
    )
    
    setData(newData)
    
    // 显示成功提示toast
    const toastResult = toast({
      title: "操作成功",
      description: `配置 "${item.name}" 已${statusText}`,
      variant: "default", // 统一使用默认样式
      duration: 3000, // 3秒后自动关闭
    })
    
    // 3秒后自动关闭toast
    setTimeout(() => {
      toastResult.dismiss()
    }, 3000)
    
    // 实际应用中应调用API更新状态
    // await updateDocumentConfigStatus(item.id, newStatus)
  }
  
  // 处理批量状态切换
  const handleBatchToggleStatus = (selectedItems: any[], targetStatus: "enabled" | "disabled") => {
    const statusText = targetStatus === "enabled" ? "启用" : "禁用"
    const actionText = targetStatus === "enabled" ? "启用" : "禁用"
    
    console.log(`批量${actionText}配置`, selectedItems.map(item => item.id), "新状态:", targetStatus)
    
    // 更新数据中的状态
    const selectedIds = selectedItems.map(item => item.id)
    const newData = data.map(config => 
      selectedIds.includes(config.id)
        ? { ...config, status: targetStatus, updatedAt: new Date().toISOString() }
        : config
    )
    
    setData(newData)
    setSelectedRows([]) // 清空选择
    
    // 显示成功提示toast
    toast({
      title: "批量操作成功",
      description: `已${statusText} ${selectedItems.length} 个配置`,
      variant: "default", // 统一使用默认样式
    })
    
    // 实际应用中应调用API更新状态
    // await batchUpdateDocumentConfigStatus(selectedIds, targetStatus)
  }
  
  // 处理批量删除
  const handleBatchDelete = (selectedItems: any[]) => {
    console.log("批量删除配置", selectedItems.map(item => item.id))
    
    // 从数据中移除选中的项目
    const selectedIds = selectedItems.map(item => item.id)
    const newData = data.filter(config => !selectedIds.includes(config.id))
    
    setData(newData)
    setTotalItems(newData.length)
    setSelectedRows([]) // 清空选择
    
    // 显示成功提示toast
    toast({
      title: "批量删除成功",
      description: `已删除 ${selectedItems.length} 个配置`,
      variant: "destructive",
    })
    
    // 实际应用中应调用API删除数据
    // await batchDeleteDocumentConfigs(selectedIds)
  }
  
  // 在DOM加载时注册处理函数到window对象供table和card调用
  useEffect(() => {
    // 避免在服务器端执行
    if (typeof window === 'undefined') return;
    
    // 使用正确的赋值语法，避免被误解为函数调用
    (window as any).__dataListHandlers = {
      handleViewDetails: handleViewDetails,
      handleEditConfig: handleEditConfig,
      handleDeleteConfig: handleDeleteConfig,
      handleToggleStatus: handleToggleStatus,
      handleBatchToggleStatus: handleBatchToggleStatus,
      handleBatchDelete: handleBatchDelete
    };
    
    // 添加一个临时调试函数到window对象
    (window as any).__debugEditConfig = (id: string) => {
      console.log("通过调试函数跳转到编辑页面", id);
      router.push(`/ethic-review/document-config/${id}/edit`)
    };
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__dataListHandlers
        delete (window as any).__debugEditConfig
      }
    }
  }, [router, handleViewDetails, handleEditConfig, handleDeleteConfig, handleToggleStatus, handleBatchToggleStatus, handleBatchDelete])
  
  // 自定义卡片渲染器
  const customCardRenderer = (
    item: any, 
    actions: any[], 
    isSelected: boolean, 
    onToggleSelect: (selected: boolean) => void,
    onRowActionClick?: (action: any, item: any) => void
  ) => {
    // 为卡片操作添加处理回调
    const enhancedActions = actions.map(action => ({
      ...action,
      onClick: (item: any, e: any) => {
        if (action.id === "delete") {
          handleDeleteConfig(item)
        } else if (action.id === "edit") {
          handleEditConfig(item)
        } else if (action.id === "view") {
          handleViewDetails(item)
        } else if (action.id === "toggle-status") {
          handleToggleStatus(item)
        } else {
          action.onClick(item, e)
        }
      }
    }))

    return (
      <DocumentConfigCard
        key={item.id}
        item={item}
        actions={enhancedActions}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        onClick={() => handleItemClick(item)}
        statusVariants={dataListStatusVariants}
        getStatusName={getStatusName}
      />
    )
  }
  
  return (
    <div className="w-full px-1 space-y-6">
      <DataList
        title="送审文件配置"
        data={data}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearch={handleSearchExecute}
        searchPlaceholder="搜索送审文件配置..."
        quickFilters={quickFilters}
        quickFilterValues={filterValues}
        onQuickFilterChange={handleQuickFilterChange}
        sortOptions={sortOptions}
        activeSortOption={sortOption}
        onSortChange={handleSortChange}
        defaultViewMode={viewMode as "grid" | "list"}
        onViewModeChange={handleViewModeChange}
        categories={filterCategories}
        seniorFilterValues={seniorFilterValues}
        onAdvancedFilter={handleAdvancedFilter}
        tableColumns={processedTableColumns as any}
        cardFields={adaptedCardFields}
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
        batchActions={batchActions}
        onItemClick={handleItemClick}
        onViewDetails={handleViewDetails}
        onEditConfig={handleEditConfig}
        onDeleteConfig={handleDeleteConfig}
        detailsUrlPrefix="/ethic-review/document-config"
        onAddNew={handleAddNew}
        addButtonLabel="新建送审文件配置"
        showColumnToggle={true}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={handleVisibleColumnsChange}
        customCardRenderer={customCardRenderer}
      />
    </div>
  )
}

export default function DocumentConfigPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] w-full">
      <Suspense fallback={<div>加载中...</div>}>
        <DocumentConfigContent />
      </Suspense>
    </div>
  )
} 