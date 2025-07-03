"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import DataListHeader from "./data-list-header"
import DataListToolbar from "./data-list-toolbar"
import DataListTable from "./data-list-table"
import DataListCard, { CardAction } from "./data-list-card"
import DataListPagination from "./data-list-pagination"
import DataListBatchActions from "./data-list-batch-actions"
import { DataListAdvancedFilter } from "./data-list-advanced-filter"
import type { SeniorFilterDTO } from "./data-list-advanced-filter"
import { cn } from "@/lib/utils"

// 创建一个显示模板库按钮的页面白名单
const SHOW_TEMPLATES_PAGES = ["项目管理", "申报管理"];

interface SortOption {
  id: string
  field: string
  direction: "asc" | "desc"
  label: string
}

interface DataTableColumn<T> {
  id: string
  header: string
  accessorKey: keyof T
  cell?: (row: T) => React.ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
}

interface DataListProps {
  title: string
  data: any[]
  tabs?: { id: string; label: string; count?: number }[]
  activeTab?: string
  onTabChange?: (value: string) => void
  onAddNew?: () => void
  onOpenSettings?: () => void
  onAIAssist?: () => void
  onCreateProject?: (type: string) => void
  addButtonLabel?: string
  settingsButtonLabel?: string
  searchValue?: string
  searchPlaceholder?: string
  noResultsText?: string
  onSearchChange?: (value: string) => void
  onSearch?: () => void
  quickFilters?: {
    id: string
    label: string
    value: string
    options: { id: string; label: string; value: string }[]
    category: string
  }[]
  onQuickFilterChange?: (filterId: string, value: string) => void
  quickFilterValues?: Record<string, string>
  seniorFilterValues?: SeniorFilterDTO
  onAdvancedFilter?: (filterValues: Record<string, any>) => void
  filterValues?: Record<string, any>
  sortOptions?: SortOption[]
  activeSortOption?: string
  onSortChange?: (value: string) => void
  defaultViewMode?: "grid" | "list"
  onViewModeChange?: (viewMode: string) => void
  tableColumns?: DataTableColumn<any>[]
  tableActions?: any[]
  rowActions?: any[]
  columns?: any[]
  visibleColumns?: Record<string, boolean>
  onVisibleColumnsChange?: (columns: Record<string, boolean>) => void
  cardFields?: any[]
  cardActions?: any[]
  titleField?: string
  descriptionField?: string
  statusField?: string
  statusVariants?: Record<string, "default" | "destructive" | "outline" | "secondary">
  getStatusName?: (item: any) => string
  priorityField?: string
  progressField?: string
  tasksField?: { completed: string; total: string }
  teamSizeField?: string
  pageSize?: number
  currentPage?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  selectedRows?: string[]
  onSelectedRowsChange?: (rows: string[]) => void
  batchActions?: any[]
  onRowActionClick?: (action: any, row: any) => void
  onBatchActionClick?: (action: any, rows: any[]) => void
  onItemClick?: (item: any) => void
  detailsUrlPrefix?: string
  customActions?: React.ReactNode
  className?: string
  idField?: string
  addButtonDropdownItems?: { label: string; onClick: () => void }[]
  categories?: {
    id: string
    title: string
    fields: {
      id: string
      label: string
      type: "text" | "date" | "number" | "select" | "member"
      options?: { value: string; label: string }[]
      category?: string
      placeholder?: string
    }[]
  }[]
  customTable?: () => React.ReactNode
  showColumnToggle?: boolean
  showHeaderButtons?: boolean
  customCardRenderer?: (
    item: any, 
    actions: CardAction[], 
    isSelected: boolean, 
    onToggleSelect: (selected: boolean) => void,
    onRowActionClick?: (action: any, item: any) => void
  ) => React.ReactNode
  onViewDetails?: (item: any) => void
  onEditConfig?: (item: any) => void
  onDeleteConfig?: (item: any) => void
  gridClassName?: string
}

// export const filterCategories = [
//   {
//     id: "basic",
//     title: "基本信息",
//     fields: [
//       {
//         id: "title",
//         label: "标题",
//         type: "text",
//         placeholder: "请输入标题关键词"
//       },
//       {
//         id: "keywords",
//         label: "关键词",
//         type: "text",
//         placeholder: "请输入关键词"
//       },
//       {
//         id: "abstract",
//         label: "摘要",
//         type: "text",
//         placeholder: "请输入摘要关键词"
//       }
//     ]
//   },
//   {
//     id: "project",
//     title: "项目信息",
//     fields: [
//       {
//         id: "projectType",
//         label: "项目类型",
//         type: "select",
//         options: [
//           { value: "national", label: "国家级" },
//           { value: "provincial", label: "省部级" },
//           { value: "municipal", label: "市厅级" },
//           { value: "enterprise", label: "企业合作" }
//         ]
//       },
//       {
//         id: "fundingAmount",
//         label: "经费金额",
//         type: "number",
//         placeholder: "请输入经费金额"
//       },
//       {
//         id: "projectStatus",
//         label: "项目状态",
//         type: "select",
//         options: [
//           { value: "ongoing", label: "在研" },
//           { value: "completed", label: "已结题" },
//           { value: "pending", label: "待立项" }
//         ]
//       }
//     ]
//   },
//   {
//     id: "publication",
//     title: "成果信息",
//     fields: [
//       {
//         id: "publicationType",
//         label: "成果类型",
//         type: "select",
//         options: [
//           { value: "paper", label: "论文" },
//           { value: "patent", label: "专利" },
//           { value: "award", label: "获奖" },
//           { value: "book", label: "著作" }
//         ]
//       },
//       {
//         id: "journalLevel",
//         label: "期刊级别",
//         type: "select",
//         options: [
//           { value: "sci", label: "SCI" },
//           { value: "ei", label: "EI" },
//           { value: "cssci", label: "CSSCI" },
//           { value: "core", label: "核心期刊" }
//         ]
//       },
//       {
//         id: "publishDate",
//         label: "发表日期",
//         type: "date"
//       }
//     ]
//   },
//   {
//     id: "researcher",
//     title: "人员信息",
//     fields: [
//       {
//         id: "researcher",
//         label: "研究人员",
//         type: "member",
//         placeholder: "请选择研究人员"
//       },
//       {
//         id: "department",
//         label: "所属部门",
//         type: "select",
//         options: [
//           { value: "cs", label: "计算机科学与技术" },
//           { value: "ee", label: "电子工程" },
//           { value: "me", label: "机械工程" }
//         ]
//       },
//       {
//         id: "title",
//         label: "职称",
//         type: "select",
//         options: [
//           { value: "professor", label: "教授" },
//           { value: "associate", label: "副教授" },
//           { value: "lecturer", label: "讲师" }
//         ]
//       }
//     ]
//   }
// ]

export default function DataList({
  title,
  data,
  tabs,
  activeTab,
  onTabChange = () => {},
  onAddNew = () => {},
  onOpenSettings,
  onAIAssist,
  onCreateProject = () => {},
  addButtonLabel,
  settingsButtonLabel,
  searchValue = "",
  searchPlaceholder,
  noResultsText,
  onSearchChange = () => {},
  onSearch = () => {},
  quickFilters = [],
  onQuickFilterChange = () => {},
  quickFilterValues = {},
  filterValues,
  seniorFilterValues = {
    groupOperator: "and",
    groups: []
  },
  onAdvancedFilter = () => {},
  sortOptions = [],
  activeSortOption,
  onSortChange = () => {},
  defaultViewMode = "grid",
  onViewModeChange,
  tableColumns = [],
  tableActions = [],
  rowActions,
  columns,
  visibleColumns = {},
  onVisibleColumnsChange = () => {},
  cardFields = [],
  cardActions = [],
  titleField = "title",
  descriptionField = "description",
  statusField = "status",
  statusVariants = {},
  getStatusName,
  priorityField,
  progressField,
  tasksField,
  teamSizeField,
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  selectedRows = [],
  onSelectedRowsChange = () => {},
  batchActions = [],
  onRowActionClick,
  onBatchActionClick,
  onItemClick = () => {},
  detailsUrlPrefix,
  customActions,
  className,
  idField,
  addButtonDropdownItems = [],
  categories = [],
  customTable,
  showColumnToggle,
  showHeaderButtons = true,
  customCardRenderer,
  onViewDetails,
  onEditConfig,
  onDeleteConfig,
  gridClassName,
}: DataListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(defaultViewMode)
  const [showBatchActions, setShowBatchActions] = useState(false)
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [localData, setLocalData] = useState<any[]>(data || [])
  
  // 根据页面标题决定是否显示模板库按钮
  const shouldShowTemplatesButton = SHOW_TEMPLATES_PAGES.includes(title);

  useEffect(() => {
    setLocalData(data || [])
  }, [data])

  useEffect(() => {
    setShowBatchActions(selectedRows.length > 0)
  }, [selectedRows])

  const totalPages = Math.ceil(totalItems / pageSize)

  // 计算当前页要显示的数据
  const currentPageData = localData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleAdvancedFilter = (filters: Record<string, any>) => {
    console.log('Advanced filters:', filters);

    // 调用父组件传入的回调函数，而不是直接修改props
    if (onAdvancedFilter) {
      onAdvancedFilter(filters);
    }

    setShowAdvancedFilter(false);
  }

  const handleResetAdvancedFilter = () => {
    // TODO: 实现重置筛选逻辑
    console.log('Reset advanced filters')
  }

  // Render card view
  const renderCardView = () => {
    return (
      <div className={cn("grid", gridClassName || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4")}>
        {currentPageData.length === 0 ? (
          <div className="col-span-3 h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">{noResultsText || "暂无数据"}</p>
            </div>
          </div>
        ) : (
          currentPageData.map((item) => {
            // 如果提供了customCardRenderer，则使用自定义卡片渲染函数
            if (customCardRenderer) {
              try {
                const renderedCard = customCardRenderer(
                  item, 
                  cardActions, 
                  selectedRows.includes(item.id), 
                  (selected: boolean) => {
                    if (selected) {
                      onSelectedRowsChange([...selectedRows, item.id]);
                    } else {
                      onSelectedRowsChange(selectedRows.filter((id) => id !== item.id));
                    }
                  },
                  onRowActionClick
                );
                
                // 确保返回的是有效的React元素
                if (renderedCard && React.isValidElement(renderedCard)) {
                  return <div key={item.id}>{renderedCard}</div>;
                } else {
                  console.warn('Custom card renderer returned invalid React element:', renderedCard);
                  return null;
                }
              } catch (error) {
                console.error('Error in custom card renderer:', error);
                return null;
              }
            }

            // 处理卡片操作，将onRowActionClick函数应用到卡片操作
            const processedCardActions = cardActions.map(action => ({
              ...action,
              onClick: (item: any, e: React.MouseEvent) => {
                if (onRowActionClick) {
                  onRowActionClick(action, item);
                } else if (action.onClick) {
                  action.onClick(item, e);
                }
              }
            }));

            // 使用标准卡片
            return (
              <DataListCard
                key={item.id}
                item={item}
                actions={processedCardActions}
                fields={cardFields}
                titleField={titleField}
                descriptionField={descriptionField}
                statusField={statusField}
                statusVariants={statusVariants}
                getStatusName={getStatusName}
                priorityField={priorityField}
                progressField={progressField}
                tasksField={tasksField}
                teamSizeField={teamSizeField}
                onClick={() => onItemClick && onItemClick(item)}
                detailsUrl={detailsUrlPrefix ? `${detailsUrlPrefix}/${item.id}` : undefined}
                selected={selectedRows.includes(item.id)}
                onSelect={(selected) => {
                  if (selected) {
                    onSelectedRowsChange([...selectedRows, item.id])
                  } else {
                    onSelectedRowsChange(selectedRows.filter((id) => id !== item.id))
                  }
                }}
              />
            )
          })
        )}
      </div>
    )
  }

  // 将处理函数注册到全局对象，供table和card组件调用
  useEffect(() => {
    // 避免在服务器端执行
    if (typeof window === 'undefined') return;
    
    // 安全地将处理函数注册到window对象
    (window as any).__dataListHandlers = {
      handleViewDetails: onViewDetails,
      handleEditConfig: onEditConfig,
      handleDeleteConfig: onDeleteConfig,
    };
    
    // 清理函数
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__dataListHandlers;
      }
    };
  }, [onViewDetails, onEditConfig, onDeleteConfig]);

  return (
    <div className={cn("space-y-4", className)}>
      <DataListHeader
        title={title}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onAddNew={onAddNew}
        onOpenSettings={onOpenSettings}
        onAIAssist={onAIAssist}
        onCreateProject={onCreateProject}
        addButtonLabel={addButtonLabel}
        settingsButtonLabel={settingsButtonLabel}
        customActions={customActions}
        addButtonDropdownItems={addButtonDropdownItems}
        showButtons={showHeaderButtons}
      />

      <DataListToolbar
        searchValue={searchValue}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        quickFilters={quickFilters}
        onQuickFilterChange={onQuickFilterChange}
        quickFilterValues={quickFilterValues}
        onAdvancedFilter={() => setShowAdvancedFilter(true)}
        sortOptions={sortOptions}
        activeSortOption={activeSortOption}
        onSortChange={onSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        columns={tableColumns}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={onVisibleColumnsChange}
      />

      <DataListAdvancedFilter
        open={showAdvancedFilter}
        seniorFilterValues={seniorFilterValues}
        onOpenChange={setShowAdvancedFilter}
        categories={categories}
        onFilter={handleAdvancedFilter}
        onReset={handleResetAdvancedFilter}
      />

      {viewMode === "list" ? (
        <div className="bg-white rounded-md w-full">
          <div className="p-2">
            <DataListTable
              data={currentPageData}
              columns={tableColumns}
              actions={tableActions}
              visibleColumns={visibleColumns}
              onVisibleColumnsChange={onVisibleColumnsChange}
              selectedRows={selectedRows}
              onSelectedRowsChange={onSelectedRowsChange}
              onItemClick={onItemClick}
              detailsUrlPrefix={detailsUrlPrefix}
              noDataMessage={noResultsText || "暂无数据"}
              onRowActionClick={onRowActionClick}
            />
          </div>
        </div>
      ) : (
        renderCardView()
      )}

      <DataListPagination
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      {showBatchActions && batchActions && (
        <DataListBatchActions
          selectedCount={selectedRows.length}
          actions={batchActions}
          onClearSelection={() => onSelectedRowsChange([])}
          show={showBatchActions}
        />
      )}
    </div>
  )
}
