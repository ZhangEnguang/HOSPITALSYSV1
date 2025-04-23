"use client"

import { format, getDay } from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { CalendarEvent, EventType } from "../types/calendar"

interface DayViewProps {
  events: CalendarEvent[]
  date: Date
  filteredEventTypes: EventType[]
  onGridClick: (date: Date, hour: number) => void
  onEventClick: (event: CalendarEvent) => void
}

// 工作时间范围
const WORK_HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00 - 19:00

export function DayView({ events, date, filteredEventTypes, onGridClick, onEventClick }: DayViewProps) {
  // 获取特定时间的事件
  const getEventsForHour = (hour: number) => {
    const dayOfWeek = getDay(date)
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
        className={cn("px-3 py-2 rounded text-sm mb-1 cursor-pointer", event.isOverlay ? "border" : "")}
        style={eventStyle}
        onClick={(e) => {
          e.stopPropagation()
          onEventClick(event)
        }}
      >
        {isStart && (
          <>
            <div className="font-medium">{event.title}</div>
            <div className="text-xs mt-1 opacity-90">
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
      {/* 日期标题 */}
      <div className="p-3 text-center border-b">
        <h2 className="text-lg font-medium">{format(date, "yyyy年MM月dd日", { locale: zhCN })}</h2>
        <p className="text-sm text-muted-foreground">{format(date, "EEEE", { locale: zhCN })}</p>
      </div>

      {/* 时间格子 */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 divide-y">
          {WORK_HOURS.map((hour) => {
            const hourEvents = getEventsForHour(hour)

            return (
              <div key={hour} className="flex">
                {/* 时间列 */}
                <div className="w-20 p-2 text-right text-sm text-muted-foreground border-r">{`${hour}:00`}</div>

                {/* 事件区域 */}
                <div className="flex-1 p-2" onClick={() => onGridClick(date, hour)}>
                  {hourEvents.map((event) => {
                    const eventStartHour = Number.parseInt(event.startTime.split(":")[0])
                    const isStart = eventStartHour === hour

                    return renderEvent(event, isStart)
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

