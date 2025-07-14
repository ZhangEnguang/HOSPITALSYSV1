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
import { MoreVertical, Calendar, MapPin, Users, Clock, FileText, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { CardAction } from "@/components/data-management/data-list-card"
import { ElegantCardSelection } from "@/components/ui/elegant-card-selection"

interface MeetingSetupCardProps {
  item: any
  actions: CardAction[]
  isSelected: boolean
  onToggleSelect: (selected: boolean) => void
  onClick?: () => void
  statusVariants?: Record<string, string>
  getStatusName?: (item: any) => string
}

export default function MeetingSetupCard({
  item,
  actions,
  isSelected,
  onToggleSelect,
  onClick,
  statusVariants = {},
  getStatusName
}: MeetingSetupCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  
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

  const getReviewTypeColor = (reviewType: string) => {
    switch (reviewType) {
      case "初始审查":
        return "text-blue-600"
      case "跟踪审查":
        return "text-green-600"
      case "快速审查":
        return "text-purple-600"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <ElegantCardSelection
        isHovered={isHovered}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        className="group transition-all duration-300"
      >
        <Card>
          <CardHeader className="flex flex-col space-y-1.5 px-5 pt-5 pb-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base transition-colors duration-300 group-hover:text-primary truncate flex-1">
                    {item.title}
                  </h3>
                  {item.status && (
                    <Badge 
                      variant="outline" 
                      className={cn("px-2 py-0.5 border", getStatusCustomClass(item.status))}
                    >
                      {getDisplayStatus()}
                    </Badge>
                  )}
                </div>
                {/* 副标题显示会议编号和伦理委员会 */}
                {item.meetingId && (
                  <p className="text-xs text-muted-foreground mt-1 mb-0">
                    编号: {item.meetingId}{item.committee ? ` · ${item.committee}` : ''}
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
          
          {/* 标题与内容之间的优雅分割线 */}
          <div className="mx-5 mb-4 mt-3">
            <div className="h-[1px] bg-gradient-to-r from-blue-50 via-blue-200/40 to-blue-50"></div>
          </div>
          
          <CardContent className="px-5 py-3 pt-0 pb-5">
            {/* 第一行：会议主持人、参会人数 */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground block mb-1">会议主持人</span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.organizer?.avatar} alt={item.organizer?.name} />
                      <AvatarFallback>{(item.organizer?.name || "-").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{item.organizer?.name || "-"}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground block mb-1">参会人数</span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{item.attendeeCount ? `${item.attendeeCount}人` : "-"}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* 第二行：会议场地、会议日期 */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground block mb-1">会议场地</span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{item.venue || "-"}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground block mb-1">会议日期</span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{item.date || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* 第三行：快速审查项目、会议审查项目 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground block mb-1">快速审查项目</span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-blue-600">{item.quickReviewCount || 0}</span>
                    <span className="text-sm text-muted-foreground">/</span>
                    <span className="text-sm text-muted-foreground">
                      {item.limitProjectCount ? `${item.quickReviewLimit || 0}项` : "不限额"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground block mb-1">会议审查项目</span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-green-600">{item.meetingReviewCount || 0}</span>
                    <span className="text-sm text-muted-foreground">/</span>
                    <span className="text-sm text-muted-foreground">
                      {item.limitProjectCount ? `${item.meetingReviewLimit || 0}项` : "不限额"}
                    </span>
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