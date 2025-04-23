"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Info, User } from "lucide-react"
import type { CalendarEvent } from "../types/calendar"

interface MemberEventDetailDrawerProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
}

export function MemberEventDetailDrawer({ event, isOpen, onClose }: MemberEventDetailDrawerProps) {
  if (!event) return null

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-500 text-white"
      case "important":
        return "bg-amber-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "normal":
        return "普通"
      case "important":
        return "重要"
      case "urgent":
        return "紧急"
      default:
        return "普通"
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: event.memberColor }} />
            <SheetTitle className="text-xl font-bold">{event.title}</SheetTitle>
          </div>
          <SheetDescription>
            {event.startTime} - {event.endTime} | {event.location || "未指定地点"}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          <div className="flex items-center space-x-2">
            <Badge className={getEventTypeColor(event.type)}>{getEventTypeLabel(event.type)}</Badge>
            <Badge variant="outline">{event.subject}</Badge>
          </div>

          <div className="space-y-2 bg-muted p-3 rounded-md">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">团队成员</span>
            </div>
            <div className="flex items-center space-x-2 pl-7">
              <Avatar className="h-8 w-8 border-2" style={{ borderColor: event.memberColor }}>
                <AvatarImage src={event.memberAvatar} alt={event.memberName} />
                <AvatarFallback style={{ backgroundColor: event.memberColor, color: "white" }}>
                  {event.memberName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{event.memberName}</div>
                <div className="text-xs text-muted-foreground">{event.memberRole}</div>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">活动描述</span>
              </div>
              <p className="text-sm text-muted-foreground pl-7">{event.description}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-muted p-2 rounded mt-4">
            注意：您只能查看团队成员的日程安排，无法修改或删除
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

