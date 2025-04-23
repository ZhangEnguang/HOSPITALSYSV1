"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { CalendarEvent, EventType } from "../types/calendar"
import { Card } from "@/components/ui/card"
import { BookOpen, Users, Video, ClipboardCheck, FlaskRoundIcon as Flask, Users2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface CalendarGridProps {
  events: CalendarEvent[]
  date: Date
  selectedDate: Date
  filteredEventTypes: EventType[]
  onGridClick?: (date: Date, hour?: number) => void
}

export function CalendarGrid({ events, date, selectedDate, filteredEventTypes, onGridClick }: CalendarGridProps) {
  const hours = Array.from({ length: 11 }, (_, i) => i + 7) // 7 AM to 5 PM
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  // 获取当前周的日期
  const getWeekDates = (date: Date) => {
    const day = date.getDay() // 0 是周日，1 是周一，以此类推
    const diff = date.getDate() - day

    return Array(7)
      .fill(0)
      .map((_, i) => {
        const newDate = new Date(date)
        newDate.setDate(diff + i)
        return newDate
      })
  }

  const weekDates = getWeekDates(selectedDate)

  // 中文星期
  const chineseWeekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

  // 获取事件图标
  const getEventIcon = (event: CalendarEvent) => {
    switch (event.subject) {
      case "研究报告":
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case "实验讨论":
        return <Users className="h-4 w-4 text-orange-500" />
      case "学术会议":
        return <Video className="h-4 w-4 text-green-500" />
      case "项目评审":
        return <ClipboardCheck className="h-4 w-4 text-purple-500" />
      case "实验安排":
        return <Flask className="h-4 w-4 text-amber-500" />
      case "团队会议":
        return <Users2 className="h-4 w-4 text-indigo-500" />
      default:
        return null
    }
  }

  // 获取事件样式
  const getEventStyle = (event: CalendarEvent) => {
    switch (event.subject) {
      case "研究报告":
        return {
          card: "border-blue-200 hover:border-blue-300",
          bg: "bg-blue-50",
          icon: "text-blue-500",
        }
      case "实验讨论":
        return {
          card: "border-orange-200 hover:border-orange-300",
          bg: "bg-orange-50",
          icon: "text-orange-500",
        }
      case "学术会议":
        return {
          card: "border-green-200 hover:border-green-300",
          bg: "bg-green-50",
          icon: "text-green-500",
        }
      case "项目评审":
        return {
          card: "border-purple-200 hover:border-purple-300",
          bg: "bg-purple-50",
          icon: "text-purple-500",
        }
      case "实验安排":
        return {
          card: "border-amber-200 hover:border-amber-300",
          bg: "bg-amber-50",
          icon: "text-amber-500",
        }
      case "团队会议":
        return {
          card: "border-indigo-200 hover:border-indigo-300",
          bg: "bg-indigo-50",
          icon: "text-indigo-500",
        }
      default:
        return {
          card: "border-gray-200 hover:border-gray-300",
          bg: "bg-gray-50",
          icon: "text-gray-500",
        }
    }
  }

  // 获取事件类型样式
  const getEventTypeStyle = (type: string) => {
    switch (type) {
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "important":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取事件类型中文名称
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

  // 过滤事件
  const filteredEvents = events.filter((event) => filteredEventTypes.includes(event.subject))

  return (
    <div className="flex-1 overflow-auto bg-white">
      {/* 使用表格布局代替网格布局，确保完美对齐 */}
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            <th className="w-[60px] min-w-[60px] border-r border-b p-2 text-center text-sm text-muted-foreground">
              GMT+07
            </th>
            {weekDates.map((date, index) => (
              <th
                key={index}
                className={cn(
                  "border-r border-b p-2 text-center",
                  date.getDate() === new Date().getDate() && "bg-blue-50",
                )}
              >
                <div className="text-sm font-medium">{chineseWeekdays[index]}</div>
                <div
                  className={cn(
                    "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm cursor-pointer hover:bg-blue-100",
                    date.getDate() === selectedDate.getDate()
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "text-gray-700",
                  )}
                  onClick={() => onGridClick && onGridClick(date)}
                >
                  {date.getDate()}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="w-[60px] min-w-[60px] border-r border-b p-2 text-right text-sm text-muted-foreground">
                {hour < 10 ? `0${hour}` : hour}:00
              </td>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                // 获取当前单元格的日期
                const cellDate = new Date(weekDates[dayIndex])
                // 设置小时
                cellDate.setHours(hour)

                // 检查此单元格是否有事件
                const cellEvents = filteredEvents.filter((event) => {
                  const [eventHour] = event.startTime.split(":").map(Number)
                  return eventHour === hour && event.day === dayIndex
                })

                const hasEvents = cellEvents.length > 0

                return (
                  <td
                    key={dayIndex}
                    className={cn(
                      "relative border-r border-b h-24 p-1 cursor-pointer",
                      !hasEvents && "hover:bg-blue-50 transition-colors duration-150",
                    )}
                    onClick={(e) => {
                      // 只有当点击的是空白区域时才触发添加事件
                      if (e.currentTarget === e.target && onGridClick) {
                        onGridClick(cellDate, hour)
                      }
                    }}
                  >
                    {cellEvents.map((event) => {
                      const style = getEventStyle(event)
                      return (
                        <Card
                          key={event.id}
                          className={cn(
                            "h-[calc(100%-8px)] overflow-hidden cursor-pointer transition-all rounded-xl",
                            style.card,
                            style.bg,
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEvent(event)
                          }}
                        >
                          <div className="p-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                {getEventIcon(event)}
                                <span className="text-xs font-medium">{event.title}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn("text-xs px-1.5 py-0.5 rounded-full", getEventTypeStyle(event.type))}
                              >
                                {getEventTypeLabel(event.type)}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="flex -space-x-2 overflow-hidden">
                              {event.students.map((student) => (
                                <Avatar key={student.id} className="h-6 w-6 border-2 border-white">
                                  <AvatarImage src={student.avatar} />
                                  <AvatarFallback>{student.name[0]}</AvatarFallback>
                                </Avatar>
                              ))}
                              {event.students.length > 3 && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs">
                                  +{event.students.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 事件详情对话框 */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {getEventIcon(selectedEvent)}
                  <DialogTitle>{selectedEvent.title}</DialogTitle>
                </div>
                <DialogDescription>
                  {selectedEvent.startTime} - {selectedEvent.endTime} | {selectedEvent.location || "未指定地点"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">活动类型</h4>
                  <Badge className={getEventTypeStyle(selectedEvent.type)}>
                    {getEventTypeLabel(selectedEvent.type)}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">活动描述</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description || "暂无描述"}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">参与人员</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.students.map((student) => (
                      <div key={student.id} className="flex items-center gap-2 rounded-lg border p-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{student.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

