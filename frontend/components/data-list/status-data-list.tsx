"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { StatusConfig } from "@/components/status-list"

// 定义列表项接口
export interface DataItem {
  id: string | number
  [key: string]: any
}

// 定义列接口
export interface Column {
  id: string
  header: string
  accessorKey: string
  cell?: (item: any) => React.ReactNode
  className?: string
}

// 定义操作按钮接口
export interface ActionButton {
  id: string
  label: string | ((item: DataItem) => string)
  icon?: React.ReactNode
  onClick: (item: DataItem) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  condition?: (item: DataItem) => boolean
}

// 定义组件属性接口
export interface StatusDataListProps {
  data: DataItem[]
  columns: Column[]
  statusField: string
  statusConfigs: StatusConfig[]
  actions?: ActionButton[]
  dropdownActions?: ActionButton[]
  selectable?: boolean
  onSelectionChange?: (selectedIds: (string | number)[]) => void
  onRowClick?: (item: DataItem) => void
  emptyMessage?: string
  className?: string
  enableToggle?: boolean
  toggleField?: string
  onToggleStatus?: (id: string | number, newStatus: boolean) => void
}

// 添加自定义CSS样式
const useStatusStyles = () => {
  useEffect(() => {
    // 创建样式元素
    const styleEl = document.createElement("style")
    styleEl.textContent = `
      @keyframes statusBreathe {
        0%, 100% {
          opacity: 0.6;
          box-shadow: 0 0 0 rgba(239, 68, 68, 0);
        }
        50% {
          opacity: 1;
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.7);
        }
      }
      .urgent-badge {
        position: relative;
        animation: statusBreathe 1.5s ease-in-out infinite;
      }
      
      .status-data-row {
        transition: all 0.2s ease-in-out;
        position: relative;
      }
      
      .status-data-row:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
      
      .status-indicator {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        border-radius: 0 2px 2px 0;
      }
    `
    document.head.appendChild(styleEl)

    // 清理函数
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])
}

export default function StatusDataList({
  data,
  columns,
  statusField,
  statusConfigs,
  actions = [],
  dropdownActions = [],
  selectable = false,
  onSelectionChange,
  onRowClick,
  emptyMessage = "没有找到数据",
  className = "",
  enableToggle = false,
  toggleField = "enabled",
  onToggleStatus,
}: StatusDataListProps) {
  // 添加样式
  useStatusStyles()

  // 选中项状态
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // 获取状态配置
  const getStatusConfig = (status: string): StatusConfig | undefined => {
    return statusConfigs.find((config) => config.value === status)
  }

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([])
    } else {
      setSelectedIds(data.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  // 处理单个选择
  const handleSelectItem = (id: string | number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // 当选择变化时通知父组件
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedIds)
    }
  }, [selectedIds, onSelectionChange])

  // 当数据变化时，更新全选状态
  useEffect(() => {
    setSelectAll(data.length > 0 && selectedIds.length === data.length)
  }, [data, selectedIds])

  // 处理启用/禁用切换
  const handleToggleStatus = (item: DataItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleStatus) {
      onToggleStatus(item.id, !item[toggleField]);
    }
  };

  // 获取按钮的标签文本
  const getButtonLabel = (action: ActionButton, item: DataItem): string => {
    return typeof action.label === 'function' ? action.label(item) : action.label;
  };

  if (data.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-muted-foreground">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {selectable && (
                <th className="p-2 text-left w-10">
                  <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="全选" />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`p-2 text-left text-sm font-medium text-muted-foreground ${column.className || ""}`}
                >
                  {column.header}
                </th>
              ))}
              {(actions.length > 0 || dropdownActions.length > 0 || enableToggle) && <th className="p-2 text-right w-20">操作</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const status = item[statusField]
              const statusConfig = getStatusConfig(status)

              return (
                <tr
                  key={item.id}
                  className={`status-data-row border-b hover:bg-muted/20 ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {/* 状态指示条 */}
                  {statusConfig && (
                    <div
                      className="status-indicator"
                      style={{ backgroundColor: statusConfig.borderColor || statusConfig.bgColor }}
                    ></div>
                  )}

                  {selectable && (
                    <td className="p-2 pl-4 relative">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="选择行"
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td key={`${item.id}-${column.id}`} className={`p-2 text-sm ${column.className || ""}`}>
                      {column.cell ? column.cell(item) : item[column.accessorKey]}
                    </td>
                  ))}

                  {(actions.length > 0 || dropdownActions.length > 0 || enableToggle) && (
                    <td className="p-2 text-right">
                      <div className="flex justify-end items-center space-x-1">
                        {/* 启用/禁用切换按钮 */}
                        {enableToggle && (
                          <Button
                            size="sm"
                            variant={item[toggleField] ? "default" : "secondary"}
                            className="h-8 px-2"
                            onClick={(e) => handleToggleStatus(item, e)}
                          >
                            {item[toggleField] ? "禁用" : "启用"}
                          </Button>
                        )}
                        
                        {/* 直接操作按钮 */}
                        {actions
                          .filter((action) => !action.condition || action.condition(item))
                          .map((action) => (
                            <Button
                              key={action.id}
                              size="sm"
                              variant={action.variant || "outline"}
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                action.onClick(item)
                              }}
                            >
                              {action.icon && <span className="mr-1">{action.icon}</span>}
                              {getButtonLabel(action, item)}
                            </Button>
                          ))}

                        {/* 下拉菜单操作 */}
                        {dropdownActions.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {dropdownActions
                                .filter((action) => !action.condition || action.condition(item))
                                .map((action) => (
                                  <DropdownMenuItem
                                    key={action.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      action.onClick(item)
                                    }}
                                  >
                                    {action.icon && <span className="mr-2">{action.icon}</span>}
                                    {getButtonLabel(action, item)}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

