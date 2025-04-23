"use client"

import type React from "react"

import { useState } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { ArrowDownAZ, ArrowUpZA, ChevronDown, EyeOff, Filter, MoreHorizontal, Settings, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import ColumnSettings from "./column-settings"
import FilterPanel from "./filter-panel"
import { FieldType, type FilterModel, type FilterOption } from "./types"
import DataListToolbar from "./data-list-toolbar"

export interface ColumnDef {
  id: string
  header: string
  accessorKey: string
  type: FieldType
  enableSorting?: boolean
  enableFiltering?: boolean
  cell?: (row: any) => React.ReactNode
  meta?: {
    className?: string
  }
  options?: FilterOption[]
}

export interface Action {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: (row: any) => void
  disabled?: (row: any) => boolean
  hidden?: (row: any) => boolean
  primary?: boolean
  type?: "default" | "destructive" | "warning"
}

export interface BatchAction {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: (rows: any[]) => void
  disabled?: (rows: any[]) => boolean
  type?: "default" | "destructive" | "warning"
}

export interface DataListProps {
  data: any[]
  columns: ColumnDef[]
  title?: string
  actions?: Action[]
  batchActions?: BatchAction[]
  onAdd?: () => void
  onImport?: () => void
  onExport?: () => void
  filterFields?: FilterModel[]
  quickFilters?: string[] // 快速筛选字段名称列表
  cardRender?: (item: any, actions: Action[], selected: boolean, toggleSelect: (id: string) => void) => React.ReactNode
  noDataMessage?: string
  isLoading?: boolean
  totalCount?: number
  pageSize?: number
  pageIndex?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  searchable?: boolean
  selectable?: boolean
  onSearch?: (query: string) => void
  onFilter?: (filters: { [key: string]: any }) => void
  onSort?: (columnId: string, direction: "asc" | "desc" | null) => void
  defaultViewMode?: "table" | "card"
  onItemClick?: (item: any) => void
}

export default function DataList({
  data = [],
  columns = [],
  title = "数据列表",
  actions = [],
  batchActions = [],
  onAdd,
  onImport,
  onExport,
  filterFields = [],
  quickFilters = [],
  cardRender,
  noDataMessage = "暂无数据",
  isLoading = false,
  totalCount = 0,
  pageSize = 10,
  pageIndex = 1,
  onPageChange,
  onPageSizeChange,
  searchable = true,
  selectable = true,
  onSearch,
  onFilter,
  onSort,
  defaultViewMode = "card", // 默认为卡片视图
  onItemClick,
}: DataListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 视图状态
  const [viewMode, setViewMode] = useState<"table" | "card">(defaultViewMode)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map((column) => column.id))
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>({})
  const [isFiltered, setIsFiltered] = useState(false)
  const [sortState, setSortState] = useState<{ columnId: string; direction: "asc" | "desc" | null }>({
    columnId: "",
    direction: null,
  })

  // 获取快速筛选字段
  const quickFilterFields = filterFields.filter((field) => quickFilters.includes(field.name))

  // 重置所有选中行
  const resetSelection = () => {
    setSelectedRows([])
  }

  // 切换行选择状态
  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(data.map((row) => row.id))
    }
  }

  // 处理搜索
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  // 处理快速筛选
  const handleQuickFilter = (fieldName: string, value: any) => {
    const newFilters = { ...activeFilters }

    if (value === undefined || value === null || value === "" || value === "all") {
      delete newFilters[fieldName]
    } else {
      newFilters[fieldName] = value
    }

    setActiveFilters(newFilters)
    setIsFiltered(Object.keys(newFilters).length > 0)

    if (onFilter) {
      onFilter(newFilters)
    }
  }

  // 应用筛选条件
  const applyFilters = (filters: { [key: string]: any }) => {
    setActiveFilters(filters)
    setIsFiltered(Object.keys(filters).length > 0)
    setShowFilterPanel(false)

    if (onFilter) {
      onFilter(filters)
    }
  }

  // 清除筛选条件
  const clearFilters = () => {
    setActiveFilters({})
    setIsFiltered(false)

    if (onFilter) {
      onFilter({})
    }
  }

  // 更新可见列
  const updateVisibleColumns = (columnIds: string[]) => {
    setVisibleColumns(columnIds)
    setShowColumnSettings(false)
  }

  // 处理排序
  const handleSort = (columnId: string) => {
    let direction: "asc" | "desc" | null = "asc"

    if (sortState.columnId === columnId) {
      if (sortState.direction === "asc") {
        direction = "desc"
      } else if (sortState.direction === "desc") {
        direction = null
      }
    }

    setSortState({ columnId, direction })

    if (onSort) {
      onSort(columnId, direction)
    }
  }

  // 获取当前选中的行数据
  const getSelectedRowsData = () => {
    return data.filter((row) => selectedRows.includes(row.id))
  }

  // 过滤出可见的列
  const filteredColumns = columns.filter((col) => visibleColumns.includes(col.id))

  // 构建分页链接
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `${pathname}?${params.toString()}`
  }

  // 页面总数
  const totalPages = Math.ceil(totalCount / pageSize)

  // 渲染分页器
  const renderPagination = () => {
    if (totalCount <= pageSize) return null

    const paginationItems = []
    const maxVisiblePages = 5

    // 添加省略号和页码
    const addPageNumbers = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageUrl(i)}
              isActive={pageIndex === i}
              onClick={(e) => {
                e.preventDefault()
                if (onPageChange) onPageChange(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    }

    // 上一页
    paginationItems.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href={createPageUrl(pageIndex - 1)}
          onClick={(e) => {
            e.preventDefault()
            if (pageIndex > 1 && onPageChange) onPageChange(pageIndex - 1)
          }}
          className={pageIndex <= 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>,
    )

    // 计算显示哪些页码
    if (totalPages <= maxVisiblePages) {
      // 页数较少，全部显示
      addPageNumbers(1, totalPages)
    } else {
      // 页数较多，显示部分页码并用省略号表示
      if (pageIndex <= 3) {
        // 当前页靠近开始
        addPageNumbers(1, 4)
        paginationItems.push(
          <PaginationItem key="ellipsis1">
            <span className="px-4 py-2">&hellip;</span>
          </PaginationItem>,
        )
        addPageNumbers(totalPages, totalPages)
      } else if (pageIndex >= totalPages - 2) {
        // 当前页靠近结束
        addPageNumbers(1, 1)
        paginationItems.push(
          <PaginationItem key="ellipsis2">
            <span className="px-4 py-2">&hellip;</span>
          </PaginationItem>,
        )
        addPageNumbers(totalPages - 3, totalPages)
      } else {
        // 当前页在中间
        addPageNumbers(1, 1)
        paginationItems.push(
          <PaginationItem key="ellipsis3">
            <span className="px-4 py-2">&hellip;</span>
          </PaginationItem>,
        )
        addPageNumbers(pageIndex - 1, pageIndex + 1)
        paginationItems.push(
          <PaginationItem key="ellipsis4">
            <span className="px-4 py-2">&hellip;</span>
          </PaginationItem>,
        )
        addPageNumbers(totalPages, totalPages)
      }
    }

    // 下一页
    paginationItems.push(
      <PaginationItem key="next">
        <PaginationNext
          href={createPageUrl(pageIndex + 1)}
          onClick={(e) => {
            e.preventDefault()
            if (pageIndex < totalPages && onPageChange) onPageChange(pageIndex + 1)
          }}
          className={pageIndex >= totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>,
    )

    return (
      <div className="flex items-center justify-between px-2 mt-4">
        <div className="text-sm text-muted-foreground">
          显示 {Math.min((pageIndex - 1) * pageSize + 1, totalCount)} 至 {Math.min(pageIndex * pageSize, totalCount)}{" "}
          条，共 {totalCount} 条
        </div>

        <div className="flex items-center space-x-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              if (onPageSizeChange) onPageSizeChange(Number.parseInt(value))
            }}
          >
            <SelectTrigger className="h-10 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>

          <Pagination>
            <PaginationContent>{paginationItems}</PaginationContent>
          </Pagination>
        </div>
      </div>
    )
  }

  // 渲染表格视图
  const renderTableView = () => {
    return (
      <div className="rounded-md border overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              {selectable && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = selectedRows.length > 0 && selectedRows.length < data.length
                      }
                    }}
                    onCheckedChange={toggleSelectAll}
                    aria-label="全选"
                  />
                </TableHead>
              )}

              {filteredColumns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    "relative group",
                    column.meta?.className,
                    column.enableSorting && "cursor-pointer select-none",
                  )}
                  onClick={() => column.enableSorting && handleSort(column.id)}
                >
                  <div className="flex items-center">
                    <span>{column.header}</span>
                    {column.enableSorting && (
                      <div className="ml-1">
                        {sortState.columnId === column.id && sortState.direction === "asc" && (
                          <ArrowDownAZ className="h-4 w-4" />
                        )}
                        {sortState.columnId === column.id && sortState.direction === "desc" && (
                          <ArrowUpZA className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        {column.enableSorting && (
                          <>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setSortState({ columnId: column.id, direction: "asc" })
                                if (onSort) onSort(column.id, "asc")
                              }}
                            >
                              <ArrowDownAZ className="mr-2 h-4 w-4" />
                              <span>升序</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setSortState({ columnId: column.id, direction: "desc" })
                                if (onSort) onSort(column.id, "desc")
                              }}
                            >
                              <ArrowUpZA className="mr-2 h-4 w-4" />
                              <span>降序</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}

                        {column.enableFiltering && column.options && (
                          <>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                // 打开筛选面板并聚焦到该字段
                                setShowFilterPanel(true)
                              }}
                            >
                              <Filter className="mr-2 h-4 w-4" />
                              <span>筛选</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // 隐藏该列
                            updateVisibleColumns(visibleColumns.filter((id) => id !== column.id))
                          }}
                        >
                          <EyeOff className="mr-2 h-4 w-4" />
                          <span>隐藏此列</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowColumnSettings(true)
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>列设置</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
              ))}

              {actions.length > 0 && <TableHead className="w-[100px] text-right">操作</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={filteredColumns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="h-24 text-center"
                >
                  加载中...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={filteredColumns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {noDataMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={() => toggleRowSelection(row.id)}
                        aria-label="选择行"
                      />
                    </TableCell>
                  )}

                  {filteredColumns.map((column) => (
                    <TableCell key={`${row.id}-${column.id}`}>
                      {column.cell ? column.cell(row) : row[column.accessorKey]}
                    </TableCell>
                  ))}

                  {actions.length > 0 && (
                    <TableCell className="text-right space-x-1">
                      {actions
                        .filter((action) => !action.hidden || !action.hidden(row))
                        .slice(0, 2)
                        .map((action) => (
                          <Button
                            key={action.id}
                            variant={action.primary ? "default" : "ghost"}
                            size="sm"
                            onClick={() => action.onClick(row)}
                            disabled={action.disabled ? action.disabled(row) : false}
                            className={
                              action.type === "destructive"
                                ? "text-destructive hover:text-destructive/90"
                                : action.type === "warning"
                                  ? "text-orange-500 hover:text-orange-600"
                                  : ""
                            }
                          >
                            {action.label}
                          </Button>
                        ))}

                      {actions.filter((action) => !action.hidden || !action.hidden(row)).length > 2 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions
                              .filter((action) => !action.hidden || !action.hidden(row))
                              .slice(2)
                              .map((action) => (
                                <DropdownMenuItem
                                  key={action.id}
                                  onClick={() => action.onClick(row)}
                                  disabled={action.disabled ? action.disabled(row) : false}
                                  className={
                                    action.type === "destructive"
                                      ? "text-destructive hover:text-destructive/90"
                                      : action.type === "warning"
                                        ? "text-orange-500 hover:text-orange-600"
                                        : ""
                                  }
                                >
                                  {action.icon && <span className="mr-2">{action.icon}</span>}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  // 渲染卡片视图
  const renderCardView = () => {
    if (isLoading) {
      return <div className="text-center py-8">加载中...</div>
    }

    if (data.length === 0) {
      return <div className="text-center py-8">{noDataMessage}</div>
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {data.map((item) => (
          <div key={item.id}>
            {cardRender ? (
              cardRender(item, actions, selectedRows.includes(item.id), toggleRowSelection)
            ) : (
              <Card 
                className="h-[220px] cursor-pointer group overflow-hidden"
                style={{
                  transition: 'all 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                onClick={(e) => {
                  // 防止事件冒泡到复选框等控件
                  if ((e.target as HTMLElement).closest('button, [role="checkbox"], input')) {
                    return;
                  }
                  if (typeof onItemClick === 'function') {
                    onItemClick(item);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.borderColor = '';
                }}
              >
                <CardContent 
                  className="p-6 flex flex-col h-full"
                  style={{
                    transition: 'color 400ms ease-in-out',
                  }}
                >
                  {/* 默认卡片渲染 */}
                  <div className="flex flex-col space-y-2">
                    {selectable && (
                      <div className="flex justify-end">
                        <Checkbox
                          checked={selectedRows.includes(item.id)}
                          onCheckedChange={() => toggleRowSelection(item.id)}
                          aria-label="选择卡片"
                        />
                      </div>
                    )}

                    {filteredColumns.slice(0, 3).map((column) => (
                      <div key={column.id} className="flex justify-between">
                        {column.header === "标题" || column.header === "名称" || column.header === "项目名称" ? (
                          <h3 className="font-medium text-lg truncate">
                            {column.cell ? column.cell(item) : item[column.accessorKey]}
                          </h3>
                        ) : (
                          <>
                            <span className="font-medium">{column.header}:</span>
                            <span className="truncate">{column.cell ? column.cell(item) : item[column.accessorKey]}</span>
                          </>
                        )}
                      </div>
                    ))}

                    {actions.length > 0 && (
                      <div className="flex justify-end space-x-2 pt-2 mt-auto">
                        {actions
                          .filter((action) => !action.hidden || !action.hidden(item))
                          .slice(0, 3)
                          .map((action) => (
                            <Button
                              key={action.id}
                              variant={action.primary ? "default" : "outline"}
                              size="sm"
                              onClick={() => action.onClick(item)}
                              disabled={action.disabled ? action.disabled(item) : false}
                              className={
                                action.type === "destructive"
                                  ? "text-destructive hover:text-destructive/90"
                                  : action.type === "warning"
                                    ? "text-orange-500 hover:text-orange-600"
                                    : ""
                              }
                            >
                              {action.icon}
                              {action.label}
                            </Button>
                          ))}

                        {actions.filter((action) => !action.hidden || !action.hidden(item)).length > 3 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {actions
                                .filter((action) => !action.hidden || !action.hidden(item))
                                .slice(3)
                                .map((action) => (
                                  <DropdownMenuItem
                                    key={action.id}
                                    onClick={() => action.onClick(item)}
                                    disabled={action.disabled ? action.disabled(item) : false}
                                    className={
                                      action.type === "destructive"
                                        ? "text-destructive hover:text-destructive/90"
                                        : action.type === "warning"
                                          ? "text-orange-500 hover:text-orange-600"
                                          : ""
                                    }
                                  >
                                    {action.icon && <span className="mr-2">{action.icon}</span>}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <DataListToolbar
        title={title}
        searchable={searchable}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isFiltered={isFiltered}
        showFilterPanel={showFilterPanel}
        setShowFilterPanel={setShowFilterPanel}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showColumnSettings={showColumnSettings}
        setShowColumnSettings={setShowColumnSettings}
        onImport={onImport}
        onExport={onExport}
        onAdd={onAdd}
      />

      {/* 快速筛选区域 */}
      {quickFilterFields.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-md shadow-sm">
          {quickFilterFields.map((field) => (
            <div key={field.name} className="flex items-center">
              {field.type === FieldType.SELECT && field.options && (
                <Select
                  value={activeFilters[field.name] || "all"}
                  onValueChange={(value) => handleQuickFilter(field.name, value)}
                >
                  <SelectTrigger className="h-10 w-[140px]">
                    <SelectValue placeholder={field.label} /> {/* 使用字段标签作为占位符 */}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部{field.label}</SelectItem>
                    {field.options.map((option) => (
                      <SelectItem key={option.value.toString()} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === FieldType.TEXT && (
                <Input
                  value={activeFilters[field.name] || ""}
                  onChange={(e) => handleQuickFilter(field.name, e.target.value)}
                  placeholder={field.label}
                  className="h-10 w-[140px]"
                />
              )}
            </div>
          ))}

          {isFiltered && (
            <Button variant="ghost" size="sm" className="ml-auto text-xs h-10" onClick={clearFilters}>
              <X className="h-3 w-3 mr-1" />
              清除筛选
            </Button>
          )}
        </div>
      )}

      {/* 已选项和批量操作 */}
      {selectable && selectedRows.length > 0 && (
        <div className="flex items-center gap-3 p-2 rounded-md bg-muted">
          <div className="text-sm">
            已选择 <strong>{selectedRows.length}</strong> 项
          </div>

          <Button variant="ghost" size="sm" onClick={resetSelection}>
            <X className="h-4 w-4 mr-1" />
            清除选择
          </Button>

          <div className="flex-1"></div>

          {batchActions.map((action) => (
            <Button
              key={action.id}
              variant={action.type === "destructive" ? "destructive" : "outline"}
              size="sm"
              onClick={() => action.onClick(getSelectedRowsData())}
              disabled={action.disabled ? action.disabled(getSelectedRowsData()) : false}
              className={
                action.type === "warning"
                  ? "text-orange-500 hover:text-orange-600 border-orange-500 hover:border-orange-600"
                  : ""
              }
            >
              {action.icon && <span className="mr-1">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* 已应用的筛选条件 */}
      {isFiltered && !quickFilterFields.length && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">已筛选: </span>
          {Object.entries(activeFilters).map(([key, value]) => {
            const field = filterFields.find((f) => f.name === key)
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {field?.label || key}: {value.toString()}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const newFilters = { ...activeFilters }
                    delete newFilters[key]
                    applyFilters(newFilters)
                  }}
                />
              </Badge>
            )
          })}
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={clearFilters}>
            清除全部
          </Button>
        </div>
      )}

      {/* 数据展示区域 */}
      <div>{viewMode === "table" ? renderTableView() : renderCardView()}</div>

      {/* 分页 */}
      {renderPagination()}

      {/* 筛选面板对话框 */}
      <Dialog open={showFilterPanel} onOpenChange={setShowFilterPanel}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>高级筛选</DialogTitle>
            <DialogDescription>设置数据筛选条件，多个条件同时生效。</DialogDescription>
          </DialogHeader>

          <FilterPanel
            fields={filterFields}
            initialValues={activeFilters}
            onApply={applyFilters}
            onCancel={() => setShowFilterPanel(false)}
          />

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowFilterPanel(false)}>
              取消
            </Button>
            <Button onClick={() => applyFilters(activeFilters)}>应用筛选</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 显示列设置对话框 */}
      <Dialog open={showColumnSettings} onOpenChange={setShowColumnSettings}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>显示列</DialogTitle>
            <DialogDescription>选择要在表格中显示的列。</DialogDescription>
          </DialogHeader>

          <ColumnSettings
            columns={columns}
            initialSelected={visibleColumns}
            onConfirm={updateVisibleColumns}
            onCancel={() => setShowColumnSettings(false)}
          />

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowColumnSettings(false)}>
              取消
            </Button>
            <Button onClick={() => updateVisibleColumns(visibleColumns)}>应用设置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
