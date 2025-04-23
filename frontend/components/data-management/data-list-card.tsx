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

interface DataListCardProps {
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
}: DataListCardProps) {
  const title = item[titleField]
  const description = descriptionField ? item[descriptionField] : undefined
  const status = statusField ? item[statusField] : undefined
  const priority = priorityField ? item[priorityField] : undefined
  const progress = progressField ? item[progressField] : undefined

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
        "group cursor-pointer transition-all duration-300 border border-[#E9ECF2] shadow-none hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)] hover:border-primary/20",
        selected && "ring-2 ring-primary",
        className
      )}
      onClick={handleClick}
    >
      <CardHeader className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg transition-colors duration-300 group-hover:text-primary truncate flex-1">{title}</h3>
              {status && <Badge variant={getStatusVariant(status)}>{getDisplayStatus()}</Badge>}
              {priority === "medium" && (
                <Badge variant="destructive" className="whitespace-nowrap flex-shrink-0">
                  高
                </Badge>
              )}
            </div>
            {description && <p className="text-sm text-muted-foreground truncate mt-1">{description}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {fields.map((field, index) => (
              <React.Fragment key={field.id}>
                <div className={`grid gap-0.5 text-sm ${field.className || ""}`}>
                  {field.label && <span className="font-medium">{field.label}</span>}
                  {field.value(item)}
                </div>
                {index < fields.length - 1 && <Separator orientation="vertical" className="h-8 hidden lg:block" />}
              </React.Fragment>
            ))}
          </div>

          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">项目进度</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 [&>div]:progress-gradient" />
              <div className="flex justify-between text-xs text-muted-foreground">
                {tasksField && (
                  <span>
                    已完成任务: {item[tasksField.completed]}/{item[tasksField.total]}
                  </span>
                )}
                {/* {teamSizeField && <span>团队成员: {item[teamSizeField]} 人</span>} */}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
