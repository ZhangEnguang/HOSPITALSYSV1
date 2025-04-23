"use client"

import type React from "react"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatusConfig {
  value: string
  label: string
  color: string
  textColor?: string
  bgColor?: string
  borderColor?: string
  icon?: React.ReactNode
  urgent?: boolean
}

export interface ActionButton {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: (item: any) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  condition?: (item: any) => boolean
}

export interface TagConfig {
  field: string
  getLabel: (value: string) => string
  getColor?: (value: string) => { textColor: string; bgColor: string }
  getIcon?: (value: string) => React.ReactNode
  position?: "prefix" | "suffix"
  vertical?: boolean
  customRender?: (value: string) => React.ReactNode
}

export interface MetadataField {
  key: string
  icon?: React.ReactNode
  label?: string
  format?: (value: any) => string
}

interface StatusListProps {
  items: any[]
  statusConfig: StatusConfig[]
  tagConfig?: TagConfig
  metadataFields?: MetadataField[]
  actions?: ActionButton[]
  dropdownActions?: ActionButton[]
  selectedItems?: number[]
  onSelectItem?: (id: number) => void
  onItemHover?: (item: any) => void
  showCheckbox?: boolean
  allSelected?: boolean
  onSelectAll?: () => void
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  onItemClick?: (item: any) => void
  itemClassName?: string
  renderExtraContent?: (item: any) => React.ReactNode
}

export default function StatusList({
  items,
  statusConfig,
  tagConfig,
  metadataFields,
  actions,
  dropdownActions,
  selectedItems = [],
  onSelectItem,
  onItemHover,
  showCheckbox = false,
  allSelected = false,
  onSelectAll,
  isLoading = false,
  emptyMessage = "No items found",
  className,
  onItemClick,
  itemClassName,
  renderExtraContent,
}: StatusListProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  // 处理鼠标悬停
  const handleMouseEnter = (item: any) => {
    setHoveredItem(item.id)
    if (onItemHover) {
      onItemHover(item)
    }
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
    if (onItemHover) {
      onItemHover(null)
    }
  }

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    return statusConfig.find((config) => config.value === status) || statusConfig[0]
  }

  // 渲染状态标签
  const renderStatusBadge = (item: any) => {
    const status = item.displayStatus || item.status
    const config = getStatusConfig(status)

    if (!config) return null

    return (
      <Badge
        className={cn("text-xs font-medium", config.urgent ? "urgent-badge" : "", config.textColor, config.bgColor)}
        style={{ borderColor: config.borderColor }}
      >
        {config.icon && <span className="mr-1">{config.icon}</span>}
        {config.label}
      </Badge>
    )
  }

  // 渲染标签
  const renderTag = (item: any) => {
    if (!tagConfig) return null

    const value = item[tagConfig.field]
    if (!value) return null

    if (tagConfig.customRender) {
      return tagConfig.customRender(value)
    }

    const label = tagConfig.getLabel(value)
    const color = tagConfig.getColor ? tagConfig.getColor(value) : { textColor: "", bgColor: "" }
    const icon = tagConfig.getIcon ? tagConfig.getIcon(value) : null

    return (
      <div
        className={cn("flex items-center", tagConfig.vertical ? "flex-col space-y-1" : "space-x-1", color.textColor)}
      >
        {icon && <span className={tagConfig.vertical ? "mb-1" : "mr-1"}>{icon}</span>}
        <span className="text-xs font-medium">{label}</span>
      </div>
    )
  }

  // 渲染元数据
  const renderMetadata = (item: any) => {
    if (!metadataFields || metadataFields.length === 0) return null

    return (
      <div className="flex flex-wrap gap-4">
        {metadataFields.map((field, index) => {
          const value = item[field.key]
          if (!value) return null

          const displayValue = field.format ? field.format(value) : value

          return (
            <div key={index} className="flex items-center text-sm text-muted-foreground">
              {field.icon && <span className="mr-1">{field.icon}</span>}
              {field.label && <span className="mr-1 font-medium">{field.label}:</span>}
              <span className="truncate">{displayValue}</span>
            </div>
          )
        })}
      </div>
    )
  }

  // 渲染操作按钮
  const renderActions = (item: any) => {
    if (!actions || actions.length === 0) return null

    const visibleActions = actions.filter((action) => !action.condition || action.condition(item))

    if (visibleActions.length === 0) return null

    return (
      <div className="flex items-center space-x-2">
        {visibleActions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            variant={action.variant || "default"}
            onClick={(e) => {
              e.stopPropagation()
              action.onClick(item)
            }}
            className="h-8"
          >
            {action.icon && <span className="mr-1">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </div>
    )
  }

  // 渲染下拉菜单操作
  const renderDropdownActions = (item: any) => {
    if (!dropdownActions || dropdownActions.length === 0) return null

    const visibleActions = dropdownActions.filter((action) => !action.condition || action.condition(item))

    if (visibleActions.length === 0) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">打开菜单</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {visibleActions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              onClick={(e) => {
                e.stopPropagation()
                action.onClick(item)
              }}
              className="flex items-center gap-2"
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (items.length === 0 && !isLoading) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
  }

  return (
    <div className={cn(className)} style={{ borderRadius: '0px !important' }}>
      {showCheckbox && onSelectAll && (
        <div className="flex items-center mb-2 pl-4">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onCheckedChange={onSelectAll}
            aria-label="Select all"
            className="mr-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            全选
          </label>
          <span className="text-xs text-muted-foreground ml-2">
            (已选 {selectedItems.filter((id) => items.some((item) => item.id === id)).length} / {items.length} 项)
          </span>
        </div>
      )}

      <div className="divide-y divide-border" style={{ borderRadius: '0px !important', overflow: 'hidden' }}>
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-start p-4 transition-colors",
              hoveredItem === item.id ? "!bg-blue-50" : "",
              "hover:!bg-blue-50",
              itemClassName,
            )}
            style={{
              boxShadow: "none",
              borderRadius: '0px !important',
              overflow: 'hidden'
            }}
            onMouseEnter={() => handleMouseEnter(item)}
            onMouseLeave={handleMouseLeave}
            onClick={() => onItemClick && onItemClick(item)}
          >
            {showCheckbox && onSelectItem && (
              <div className="mr-4 pt-1">
                <Checkbox
                  id={`select-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => onSelectItem(item.id)}
                  aria-label={`Select item ${item.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </div>
            )}

            {tagConfig && tagConfig.position !== "suffix" && (
              <div className="mr-4 flex-shrink-0">{renderTag(item)}</div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold truncate">{item.title}</h3>
                  {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
                </div>

                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  {renderStatusBadge(item)}
                  {tagConfig && tagConfig.position === "suffix" && renderTag(item)}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex-1 min-w-0">{renderMetadata(item)}</div>
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  {renderExtraContent && renderExtraContent(item)}
                  {renderActions(item)}
                  {renderDropdownActions(item)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
