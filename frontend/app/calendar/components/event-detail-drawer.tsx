"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Info, Users } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { CalendarEvent } from "../types/calendar"

interface EventDetailDrawerProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  onDelete: (eventId: string) => void
}

export function EventDetailDrawer({ event, isOpen, onClose, onDelete }: EventDetailDrawerProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  const handleDelete = () => {
    onDelete(event.id)
    setIsDeleteDialogOpen(false)
    onClose()
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">{event.title}</SheetTitle>
            <SheetDescription>
              {event.startTime} - {event.endTime} | {event.location || "未指定地点"}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-6">
            <div className="flex items-center space-x-2">
              <Badge className={getEventTypeColor(event.type)}>{getEventTypeLabel(event.type)}</Badge>
              <Badge variant="outline">{event.subject}</Badge>
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

            {event.students && event.students.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">参与人员</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-7">
                  {event.students.map((student) => (
                    <div key={student.id} className="flex items-center space-x-1 bg-muted p-2 rounded-md">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{student.name}</span>
                      {student.department && (
                        <span className="text-xs text-muted-foreground ml-1">({student.department})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <SheetFooter>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              取消事项
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认取消</AlertDialogTitle>
            <AlertDialogDescription>您确定要取消"{event.title}"吗？此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

