"use client"

import React from "react"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Dict } from "../dict"

export interface CardAction {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: (item: any, e: React.MouseEvent) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  disabled?: (item: any) => boolean
  hidden?: (item: any) => boolean
}

export interface CardField {
  id: string
  label: string
  value: (item: any) => React.ReactNode
  className?: string
}

export interface DataListCardProps {
  item: any
  actions?: CardAction[]
  fields?: CardField[]
  titleField: string
  descriptionField?: string
  statusField?: string
  statusVariants?: Record<string, "default" | "destructive" | "outline" | "secondary">
  getStatusName?: (item: any) => string
  priorityField?: string
  progressField?: string
  tasksField?: { completed: string; total: string }
  teamSizeField?: string
  detailsUrl?: string
  className?: string
  selected?: boolean
  onSelect?: (selected: boolean) => void
  onClick?: () => void
  customCardRenderer?: (props: Omit<DataListCardProps, 'customCardRenderer'>) => React.ReactNode
}

export default function DataListCard({
  item,
  actions = [],
  fields = [],
  titleField,
  descriptionField,
  statusField,
  statusVariants = {},
  getStatusName,
  priorityField,
  progressField,
  tasksField,
  teamSizeField,
  detailsUrl,
  className,
  selected = false,
  onSelect,
  onClick,
  customCardRenderer
}: DataListCardProps) {
  
  // 如果提供了自定义渲染器并且返回了内容，则使用自定义卡片
  if (customCardRenderer) {
    const customCard = customCardRenderer({
      item,
      actions,
      fields,
      titleField,
      descriptionField,
      statusField,
      statusVariants,
      getStatusName,
      priorityField,
      progressField,
      tasksField,
      teamSizeField,
      detailsUrl,
      className,
      selected,
      onSelect,
      onClick
    });
    
    if (customCard) {
      return customCard as React.ReactElement;
    }
  }

  const title = item[titleField]
  const description = descriptionField ? item[descriptionField] : undefined
  const status = statusField ? item[statusField] : undefined
  const priority = priorityField ? item[priorityField] : undefined
  const progress = progressField ? item[progressField] : undefined

  // 确保值是可渲染的内容
  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return "-";
    if (typeof value === 'object' && value !== null) {
      // 如果是对象且有name属性，返回name
      if ('name' in value) return value.name;
      // 如果是对象且有label属性，返回label
      if ('label' in value) return value.label;
      // 如果是React元素，直接返回
      if (React.isValidElement(value)) return value;
      // 其他情况返回JSON字符串
      return JSON.stringify(value);
    }
    return value;
  };

  const getStatusVariant = (status: string) => {
    return statusVariants[status] || "secondary"
  }

  const getDisplayStatus = () => {
    if (!status) return null;
    return getStatusName ? getStatusName(item) : status;
  }

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick()
    }
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSelect) {
      onSelect(!selected)
    }
  }

  return (
    <Card
      className={cn(
        "group transition-all duration-300 border border-[#E9ECF2] shadow-none hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)] hover:border-primary/20",
        selected && "ring-2 ring-primary",
        className
      )}
      onClick={handleClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base transition-colors duration-300 group-hover:text-primary truncate flex-1">{renderValue(title)}</h3>
              {status && <Badge variant={getStatusVariant(status)}>{renderValue(getDisplayStatus())}</Badge>}
              {priority === "medium" && (
                <Badge variant="destructive" className="whitespace-nowrap flex-shrink-0">
                  高
                </Badge>
              )}
            </div>
            {description && <p className="text-sm text-muted-foreground truncate mt-1">{renderValue(description)}</p>}
          </div>
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {actions
                  .filter((action) => !action.hidden || !action.hidden(item))
                  .map((action) => (
                    <DropdownMenuItem
                      key={action.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        action.onClick(item, e)
                      }}
                      disabled={action.disabled ? action.disabled(item) : false}
                      className={action.id === "delete" ? "text-destructive" : ""}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid gap-2 mt-2">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {fields.map((field, index) => (
              <div 
                key={field.id} 
                className={`text-sm ${field.className || ""}`}
              >
                {field.label && <span className="font-medium text-xs text-muted-foreground block mb-0.5">{field.label}</span>}
                <div className="truncate">
                  {React.isValidElement(field.value(item)) ? field.value(item) : renderValue(field.value(item))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
