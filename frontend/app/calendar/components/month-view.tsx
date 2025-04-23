"use client"

import { useState, useEffect } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  getDay,
} from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { CalendarEvent, EventType } from "../types/calendar"
import { BookOpen, Users, Video, ClipboardCheck, FlaskRoundIcon as Flask, Users2 } from "lucide-react"

interface MonthViewProps {
  events: CalendarEvent[]
  date: Date
  onDateSelect: (date: Date) => void
  filteredEventTypes: EventType[]
  onGridClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export function MonthView({
  events,
  date,
  onDateSelect,
  filteredEventTypes,
  onGridClick,
  onEventClick,
}: MonthViewProps) {
  const [days, setDays] = useState<Date[]>([])

  // 计算当月的所有日期
  useEffect(() => {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    const calendarStart = startOfWeek(monthStart, { locale: zhCN })
    const calendarEnd = endOfWeek(monthEnd, { locale: zhCN })

    setDays(eachDayOfInterval({ start: calendarStart, end: calendarEnd }))
  }, [date])

  // 获取特定日期的事件
  const getEventsForDay = (day: Date) => {
    const dayOfWeek = getDay(day)
    const date = day.getDate()
    
    // 只在特定的几个日期显示事件（每周只显示2-3天的事件）
    // 根据日期+星期的组合来决定是否显示事件，让分布更自然
    if (!((date + dayOfWeek) % 5 === 1 || (date + dayOfWeek) % 7 === 3)) {
      return { events: [], total: 0 }
    }
    
    // 获取所有符合条件的事件
    const allEvents = events.filter((event) => 
      event.day === dayOfWeek && filteredEventTypes.includes(event.subject)
    )

    // 根据事件类型进行优先级排序：urgent > important > normal
    const sortedEvents = [...allEvents].sort((a, b) => {
      const priorityMap = { urgent: 3, important: 2, normal: 1 }
      return (priorityMap[b.type] || 0) - (priorityMap[a.type] || 0)
    })

    // 根据日期的不同显示不同数量的事件（1-2个）
    const maxEvents = (date % 3 === 0) ? 1 : 2

    return {
      events: sortedEvents.slice(0, maxEvents),
      total: sortedEvents.length,
    }
  }

  // 渲染事件
  const renderEvent = (event: CalendarEvent) => {
    // 根据事件类型或自定义颜色设置颜色
    const getEventColor = () => {
      // 如果有自定义颜色，优先使用自定义颜色
      if (event.color) {
        const color = event.color;
        // 根据颜色名称返回对应的样式
        switch (color) {
          case "blue":
            return { 
              backgroundColor: "rgb(238, 242, 255)", 
              color: "rgb(79, 70, 229)",
              borderLeft: "3px solid rgb(79, 70, 229)" 
            }
          case "red":
            return { 
              backgroundColor: "rgb(254, 242, 242)", 
              color: "rgb(239, 68, 68)",
              borderLeft: "3px solid rgb(239, 68, 68)" 
            }
          case "green":
            return { 
              backgroundColor: "rgb(236, 253, 245)", 
              color: "rgb(16, 185, 129)",
              borderLeft: "3px solid rgb(16, 185, 129)" 
            }
          case "purple":
            return { 
              backgroundColor: "rgb(250, 245, 255)", 
              color: "rgb(168, 85, 247)",
              borderLeft: "3px solid rgb(168, 85, 247)" 
            }
          case "orange":
            return { 
              backgroundColor: "rgb(255, 251, 235)", 
              color: "rgb(245, 158, 11)",
              borderLeft: "3px solid rgb(245, 158, 11)" 
            }
          case "teal":
            return { 
              backgroundColor: "rgb(236, 254, 255)", 
              color: "rgb(14, 165, 233)",
              borderLeft: "3px solid rgb(14, 165, 233)" 
            }
        }
      }

      // 对于叠加显示的事件也使用实体色
      if (event.isOverlay) {
        switch (event.type) {
          case "urgent":
            return {
              backgroundColor: "rgb(239, 68, 68)",
              color: "white",
              borderLeft: "3px solid rgb(220, 38, 38)",
            }
          case "important": 
            return {
              backgroundColor: "rgb(79, 70, 229)",
              color: "white",
              borderLeft: "3px solid rgb(67, 56, 202)",
            }
          default: // normal
            return {
              backgroundColor: "rgb(16, 185, 129)",
              color: "white",
              borderLeft: "3px solid rgb(4, 120, 87)",
            }
        }
      }

      // 正常事件样式 - 使用实体色
      switch (event.type) {
        case "urgent":
          return { 
            backgroundColor: "rgb(254, 242, 242)", 
            color: "rgb(239, 68, 68)",
            borderLeft: "3px solid rgb(239, 68, 68)" 
          }
        case "important":
          return { 
            backgroundColor: "rgb(238, 242, 255)", 
            color: "rgb(79, 70, 229)",
            borderLeft: "3px solid rgb(79, 70, 229)" 
          }
        default: // normal
          return { 
            backgroundColor: "rgb(236, 253, 245)", 
            color: "rgb(16, 185, 129)",
            borderLeft: "3px solid rgb(16, 185, 129)" 
          }
      }
    }

    const eventStyle = getEventColor()

    return (
      <div
        key={event.id}
        className={cn(
          "px-2 py-1 rounded-md truncate cursor-pointer transition-all duration-150 mb-1",
          "hover:shadow-sm hover:brightness-95",
          event.isOverlay ? "border" : "",
          "!text-[13px]"
        )}
        style={{
          ...eventStyle,
          height: "24px",
          lineHeight: "1.2",
        }}
        onClick={(e) => {
          e.stopPropagation()
          onEventClick(event)
        }}
      >
        <span className="truncate block font-medium">{event.title}</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-7 h-full">
      {/* 星期标题 */}
      {["周日", "周一", "周二", "周三", "周四", "周五", "周六"].map((day, index) => (
        <div key={index} className="p-1.5 text-center font-medium border-b border-gray-100 text-gray-600 !text-[14px]">
          {day}
        </div>
      ))}

      {/* 日期格子 */}
      {days.map((day, i) => {
        const { events: dayEvents, total: totalEvents } = getEventsForDay(day)
        const isCurrentMonth = isSameMonth(day, date)
        const isToday = isSameDay(day, new Date())

        return (
          <div
            key={i}
            className={cn(
              "border-r border-b border-gray-100 p-1.5 overflow-hidden transition-colors duration-200",
              !isCurrentMonth && "bg-gray-50/50 text-gray-400",
              isToday && "bg-blue-50/50",
              "hover:bg-gray-50/80 cursor-pointer"
            )}
            onClick={() => onGridClick(day)}
          >
            <div className="flex justify-between items-center mb-1 px-0.5">
              <span
                className={cn(
                  "!text-[14px] font-medium w-6 h-6 flex items-center justify-center rounded-full",
                  isToday && "bg-blue-500 text-white",
                  !isToday && !isCurrentMonth && "text-gray-400",
                  !isToday && isCurrentMonth && "text-gray-700"
                )}
              >
                {format(day, "d")}
              </span>
              {totalEvents > 0 && (
                <span className="!text-[12px] text-gray-500 bg-gray-100/80 px-1.5 py-0.5 rounded">
                  {totalEvents}
                </span>
              )}
            </div>

            <div className="space-y-1 max-h-[84px] overflow-hidden px-0.5 pb-[10px]">
              {dayEvents.map((event) => renderEvent(event))}

              {totalEvents > dayEvents.length && (
                <div className="!text-[12px] text-gray-500 text-center mt-1 py-1 bg-gray-50 rounded border border-gray-100/80 hover:bg-gray-100 transition-colors duration-150">
                  +{totalEvents - dayEvents.length}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

