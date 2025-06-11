import React from "react"
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

interface TrackReviewCardProps {
  item: any
  actions: CardAction[]
  isSelected: boolean
  onToggleSelect: (selected: boolean) => void
  onClick?: () => void
  statusVariants?: Record<string, string>
  getStatusName?: (item: any) => string
}

export default function TrackReviewCard({
  item,
  actions,
  isSelected,
  onToggleSelect,
  onClick,
  statusVariants = {},
  getStatusName
}: TrackReviewCardProps) {
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
    <Card
      className={cn(
        "group transition-all duration-300 border border-[#E9ECF2] shadow-none hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)] hover:border-primary/20 cursor-pointer",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={handleClick}
    >
      <CardHeader className="p-4 pb-3">
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
              <p className="text-sm text-muted-foreground truncate mt-1">
                {renderValue(item.description)}
              </p>
            )}
            
            {/* 添加分割线 */}
            <div className="w-full h-px bg-gray-200 mt-3"></div>
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
        {/* 使用统一的布局，确保行间距与列间距一致 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 项目负责人 */}
          <div className="text-sm">
            <span className="font-medium text-xs text-muted-foreground block mb-1">项目负责人</span>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item.projectLeader?.avatar} alt={item.projectLeader?.name} />
                  <AvatarFallback>{(item.projectLeader?.name || "-").charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{item.projectLeader?.name || "-"}</span>
              </div>
            </div>
          </div>
          
          {/* 所属院系 */}
          <div className="text-sm">
            <span className="font-medium text-xs text-muted-foreground block mb-1">所属院系</span>
            <div className="truncate">
              {item.department || "-"}
            </div>
          </div>
          
          {/* 伦理委员会 */}
          <div className="text-sm">
            <span className="font-medium text-xs text-muted-foreground block mb-1">伦理委员会</span>
            <div className="truncate">
              {item.ethicsCommittee || "-"}
            </div>
          </div>
          
          {/* 预计完成时间 */}
          <div className="text-sm">
            <span className="font-medium text-xs text-muted-foreground block mb-1">预计完成时间</span>
            <div className="truncate">
              {item.dueDate || "-"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 