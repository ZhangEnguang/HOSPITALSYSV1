import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { CardAction } from "@/components/data-management/data-list-card"
import { ElegantCardSelection } from "@/components/ui/elegant-card-selection"

interface DocumentConfigCardProps {
  item: any
  actions: CardAction[]
  isSelected: boolean
  onToggleSelect: (selected: boolean) => void
  onClick?: () => void
  statusVariants?: Record<string, string>
  getStatusName?: (item: any) => string
}

export default function DocumentConfigCard({
  item,
  actions,
  isSelected,
  onToggleSelect,
  onClick,
  statusVariants = {},
  getStatusName
}: DocumentConfigCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick()
    }
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleSelect(!isSelected)
  }

  const getStatusCustomClass = (status: string) => {
    return statusVariants[status] || "bg-gray-100 text-gray-700 border-gray-300"
  }

  const getDisplayStatus = () => {
    if (!item.status) return null
    return getStatusName ? getStatusName(item) : item.status
  }

  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return "-"
    if (typeof value === 'object' && value !== null) {
      if ('name' in value) return value.name
      if ('label' in value) return value.label
      if (React.isValidElement(value)) return value
      return JSON.stringify(value)
    }
    return value
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ElegantCardSelection 
        isSelected={isSelected} 
        isHovered={isHovered}
        onToggleSelect={onToggleSelect}
      >
        <Card
          className={cn(
            "group transition-all duration-300 cursor-pointer bg-white",
            "border-none shadow-none"
          )}
          onClick={handleClick}
        >
      <CardHeader className="flex flex-col space-y-1.5 px-5 pt-5 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base transition-colors duration-300 group-hover:text-primary truncate flex-1">
                {renderValue(item.name)}
              </h3>
              {item.status && (
                <Badge 
                  variant="outline" 
                  className={cn("px-2 py-0.5 border", getStatusCustomClass(item.status))}
                >
                  {renderValue(getDisplayStatus())}
                </Badge>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground truncate mt-1 mb-0">
                {renderValue(item.description)}
              </p>
            )}
          </div>
          
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {actions
                  .filter((action) => !action.hidden || !action.hidden(item))
                  .map((action) => {
                    // 处理动态的label和icon
                    const label = typeof action.label === 'function' ? action.label(item) : action.label
                    const icon = typeof action.icon === 'function' ? action.icon(item) : action.icon
                    const variant = typeof action.variant === 'function' ? action.variant(item) : action.variant
                    
                    return (
                      <DropdownMenuItem
                        key={action.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (action.onClick) {
                            action.onClick(item, e)
                          }
                        }}
                        disabled={action.disabled ? action.disabled(item) : false}
                        className={cn(
                          action.id === "delete" ? "text-destructive" : ""
                        )}
                      >
                        {icon && <span className="mr-2">{icon}</span>}
                        {label}
                      </DropdownMenuItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      {/* 标题与内容之间的优雅分割线 */}
      <div className="mx-5 mb-4 mt-3">
        <div className="h-[1px] bg-gradient-to-r from-blue-50 via-blue-200/40 to-blue-50"></div>
      </div>
      
      <CardContent className="px-5 py-3 pt-0 pb-5">
        {/* 使用统一的布局，确保行间距与列间距一致 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 审查类型 */}
          <div className="text-sm">
            <span className="font-medium text-xs text-muted-foreground block mb-1">审查类型</span>
            <div className="truncate">
              {item.reviewType || "-"}
            </div>
          </div>
          
          {/* 项目类型 */}
          <div className="text-sm">
            <span className="font-medium text-xs text-muted-foreground block mb-1">项目类型</span>
            <div className="truncate">
              {item.projectType || "-"}
            </div>
          </div>
          
          {/* 文件数量 */}
          <div className="text-sm">
            <span className="font-medium text-xs text-muted-foreground block mb-1">文件数量</span>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.documentCount || 0}</span>
                <span className="text-xs text-muted-foreground">
                  (必交: {item.requiredCount || 0}, 选交: {item.optionalCount || 0})
                </span>
              </div>
            </div>
          </div>
          
          {/* 创建者 */}
          <div className="text-sm">
            <span className="font-medium text-xs text-muted-foreground block mb-1">创建者</span>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item.createdBy?.avatar} alt={item.createdBy?.name} />
                  <AvatarFallback>{(item.createdBy?.name || "-").charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{item.createdBy?.name || "-"}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
        </Card>
      </ElegantCardSelection>
    </div>
  )
} 