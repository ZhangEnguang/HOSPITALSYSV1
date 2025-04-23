"use client"

import { useState, useEffect } from "react"
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, getDay } from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { CalendarEvent, EventType } from "../types/calendar"

interface WeekViewProps {
  events: CalendarEvent[]
  date: Date
  selectedDate: Date
  filteredEventTypes: EventType[]
  onGridClick: (date: Date, hour: number) => void
  onEventClick: (event: CalendarEvent) => void
}

// 工作时间范围
const WORK_HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00 - 19:00

export function WeekView({ events, date, selectedDate, filteredEventTypes, onGridClick, onEventClick }: WeekViewProps) {
  const [days, setDays] = useState<Date[]>([])

  // 计算当周的所有日期
  useEffect(() => {
    const weekStart = startOfWeek(date, { locale: zhCN })
    const weekEnd = endOfWeek(date, { locale: zhCN })

    setDays(eachDayOfInterval({ start: weekStart, end: weekEnd }))
  }, [date])

  // 获取特定日期和时间的事件
  const getEventsForHour = (day: Date, hour: number) => {
    const dayOfWeek = getDay(day)
    const hourStr = `${hour.toString().padStart(2, "0")}:00`

    return events.filter((event) => {
      if (event.day !== dayOfWeek) return false
      if (!filteredEventTypes.includes(event.subject)) return false

      const eventStartHour = Number.parseInt(event.startTime.split(":")[0])
      const eventEndHour = Number.parseInt(event.endTime.split(":")[0])

      // 事件开始时间在当前小时内，或者事件跨越当前小时
      return eventStartHour === hour || (eventStartHour < hour && eventEndHour > hour)
    })
  }

  // 渲染事件
  const renderEvent = (event: CalendarEvent, isStart: boolean) => {
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
          "px-2 py-1 rounded text-xs cursor-pointer", 
          event.isOverlay ? "border" : ""
        )}
        style={eventStyle}
        onClick={(e) => {
          e.stopPropagation()
          onEventClick(event)
        }}
      >
        {isStart && (
          <>
            <div className="font-medium">{event.title}</div>
            <div className="text-xs opacity-90">
              {event.startTime} - {event.endTime}
              {event.location && ` · ${event.location}`}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* 星期标题 */}
      <div className="grid grid-cols-8 border-b">
        <div className="p-2 text-center font-medium border-r"></div>
        {days.map((day, index) => {
          const isToday = isSameDay(day, new Date())
          const isSelected = isSameDay(day, selectedDate)

          return (
            <div key={index} className={cn("p-2 text-center", isToday && "bg-muted/50", isSelected && "bg-primary/10")}>
              <div className="font-medium !text-[14px] text-gray-600" style={{ fontSize: '14px' }}>{format(day, "EEE", { locale: zhCN })}</div>
              <div
                className={cn(
                  "!text-[14px] mt-1",
                  isToday &&
                    "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto",
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          )
        })}
      </div>

      {/* 时间格子 */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 divide-x h-full">
          {/* 时间列 */}
          <div className="flex flex-col divide-y">
            {WORK_HOURS.map((hour) => (
              <div key={hour} className="p-2 text-right text-sm text-muted-foreground h-20">
                {`${hour}:00`}
              </div>
            ))}
          </div>

          {/* 每天的时间格子 */}
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="flex flex-col divide-y">
              {WORK_HOURS.map((hour) => {
                const hourEvents = getEventsForHour(day, hour)
                const isToday = isSameDay(day, new Date())

                return (
                  <div
                    key={hour}
                    className={cn("p-1 h-20", isToday && "bg-muted/30")}
                    onClick={() => onGridClick(day, hour)}
                  >
                    {hourEvents.map((event) => {
                      const eventStartHour = Number.parseInt(event.startTime.split(":")[0])
                      const isStart = eventStartHour === hour

                      return renderEvent(event, isStart)
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

