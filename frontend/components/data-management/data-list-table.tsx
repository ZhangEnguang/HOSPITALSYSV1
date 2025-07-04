"use client"

import React, { useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/client-wrapped-checkbox"
import { MoreVertical, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// 类型定义
interface DataTableColumn<T> {
  id: string
  accessorKey?: keyof T
  header: string
  className?: string
  cell?: (item: T) => React.ReactNode
}

interface DataListTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  actions?: any[]
  isLoading?: boolean
  noDataMessage?: string
  onSelectRow?: (id: string, checked: boolean) => void
  selectedRows?: string[]
  onItemClick?: (item: T) => void
  detailsUrlPrefix?: string
  visibleColumns?: Record<string, boolean>
  onVisibleColumnsChange?: (columns: Record<string, boolean>) => void
  onSelectedRowsChange?: (rows: string[]) => void
  onRowActionClick?: (action: any, item: T) => void
}

export default function DataListTable<T extends { id: string }>({
  columns,
  data = [],
  actions = [],
  isLoading = false,
  noDataMessage = "暂无数据",
  onSelectRow,
  selectedRows = [],
  onItemClick,
  detailsUrlPrefix,
  visibleColumns = {},
  onVisibleColumnsChange,
  onSelectedRowsChange,
  onRowActionClick,
}: DataListTableProps<T>) {
  // 过滤后的有效列配置
  const filteredColumns = columns.filter((column) => visibleColumns[column.id] !== false && Boolean(column))
  
  // 本地维护列可见性状态（如果没有外部提供）
  const [localVisibleColumns, setLocalVisibleColumns] = useState<Record<string, boolean>>(
    () => {
      const initialState: Record<string, boolean> = {};
      columns.forEach(column => {
        initialState[column.id] = visibleColumns[column.id] !== false;
      });
      return initialState;
    }
  );
  
  // 处理列可见性变化
  const handleColumnVisibilityChange = (columnId: string, isVisible: boolean) => {
    const updatedVisibility = onVisibleColumnsChange 
      ? { ...visibleColumns, [columnId]: isVisible }
      : { ...localVisibleColumns, [columnId]: isVisible };
      
    if (onVisibleColumnsChange) {
      onVisibleColumnsChange(updatedVisibility);
    } else {
      setLocalVisibleColumns(updatedVisibility);
    }
  };
  
  // 获取当前有效的列可见性配置
  const effectiveVisibleColumns = onVisibleColumnsChange ? visibleColumns : localVisibleColumns;

  // 安全处理行选择
  const handleSelectRow = (item: T | null, checked: boolean) => {
    if (!item || !onSelectRow) return
    onSelectRow(item.id, checked)
  }

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectedRowsChange) return
    if (checked) {
      onSelectedRowsChange(data.map((item) => item.id))
    } else {
      onSelectedRowsChange([])
    }
  }

  return (
    <div className="w-full">
      <div className="relative w-full overflow-visible">
        <Table>
          <TableHeader>
            <TableRow>
              {/* 选择列 */}
              <TableHead className="w-[40px] whitespace-nowrap">
                <Checkbox
                  checked={selectedRows.length === data.length && data.length > 0}
                  ref={(input) => {
                    if (input) {
                      // @ts-ignore - indeterminate用于checkbox但不在TypeScript类型定义中
                      input.indeterminate = selectedRows.length > 0 && selectedRows.length < data.length
                    }
                  }}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  aria-label="全选"
                />
              </TableHead>

              {/* 数据列标题 */}
              {filteredColumns.map((column) => (
                <TableHead key={column.id} className={cn("whitespace-nowrap", column.className)}>
                  {column.header}
                </TableHead>
              ))}

              {/* 操作列 - 固定在右侧 */}
              {actions && actions.length > 0 && (
                <TableHead className="text-right whitespace-nowrap sticky right-0 bg-background pr-4">
                  操作
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // 加载状态
              <TableRow>
                <TableCell
                  colSpan={filteredColumns.length + (actions && actions.length > 0 ? 2 : 1)}
                  className="h-24 text-center"
                >
                  加载中...
                </TableCell>
              </TableRow>
            ) : data.filter(Boolean).length === 0 ? ( // 过滤无效数据
              // 空数据状态
              <TableRow>
                <TableCell
                  colSpan={filteredColumns.length + (actions && actions.length > 0 ? 2 : 1)}
                  className="h-24 text-center"
                >
                  {noDataMessage}
                </TableCell>
              </TableRow>
            ) : (
              // 正常数据渲染
              data
                .filter(Boolean) // 过滤 undefined/null
                .map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={(e) => {
                      // 检查点击元素是否在操作按钮区域内
                      const isActionCell = (e.target as HTMLElement).closest('[data-action-cell="true"]');
                      // 如果点击的是操作按钮区域，不触发行点击事件
                      if (!isActionCell && onItemClick) {
                        onItemClick(item);
                      }
                    }}
                    className=""
                  >
                    {/* 选择列单元格 */}
                    <TableCell onClick={(e) => e.stopPropagation()} className="whitespace-nowrap">
                      <Checkbox
                        checked={selectedRows.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectRow(item, !!checked)}
                        aria-label={`选择行 ${item.id}`}
                      />
                    </TableCell>

                    {/* 数据列单元格 */}
                    {filteredColumns.map((column) => (
                      <TableCell key={column.id} className={cn("whitespace-nowrap", column.className)}>
                        {
                          column.cell
                            ? column.cell(item) // 自定义渲染
                            : column.accessorKey 
                              ? (item[column.accessorKey] as React.ReactNode) ?? "-" // 安全访问属性，添加类型断言
                              : "-"
                        }
                      </TableCell>
                    ))}

                    {/* 操作列单元格 - 固定在右侧 */}
                    {actions && actions.length > 0 && (
                      <TableCell 
                        className="text-right whitespace-nowrap sticky right-0 bg-background pr-4" 
                        onClick={(e) => e.stopPropagation()}
                        data-action-cell="true"
                      >
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {actions
                                .filter((action) => !action.hidden || !action.hidden(item))
                                .map((action) => (
                                  <DropdownMenuItem
                                    key={action.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (onRowActionClick) {
                                        onRowActionClick(action, item)
                                      } else if (action.onClick) {
                                        action.onClick(item)
                                      }
                                    }}
                                    disabled={action.disabled ? action.disabled(item) : false}
                                    className={action.variant === "destructive" ? "text-destructive" : ""}
                                  >
                                    {action.icon && (
                                      (() => {
                                        try {
                                          // 如果是字符串，直接显示
                                          if (typeof action.icon === 'string') {
                                            return <span className="mr-2">{action.icon}</span>
                                          }
                                          // 如果是React元素，直接渲染
                                          if (React.isValidElement(action.icon)) {
                                            return <span className="mr-2">{action.icon}</span>
                                          }
                                          // 如果是React组件，作为组件渲染
                                          if (typeof action.icon === 'function') {
                                            const IconComponent = action.icon
                                            return <IconComponent className="mr-2 h-4 w-4" />
                                          }
                                          // 默认情况：尝试作为组件渲染
                                          const IconComponent = action.icon
                                          return <IconComponent className="mr-2 h-4 w-4" />
                                        } catch (error) {
                                          // 如果渲染失败，返回空
                                          console.warn('Failed to render action icon:', error)
                                          return null
                                        }
                                      })()
                                    )}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

