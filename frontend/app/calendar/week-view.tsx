"use client"

import { useState } from "react"
import type { CalendarEvent, EventType } from "../types/calendar"
import { AddEventDialog } from "./components/add-event-dialog"

interface WeekViewProps {
  events: CalendarEvent[]
  date: Date
  onAddEvent: (event: Partial<CalendarEvent>) => void
}

export function WeekView({ events, date, onAddEvent }: WeekViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(date)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEventTime, setNewEventTime] = useState<{ date: Date; hour?: number } | null>(null)
  const [filteredEventTypes, setFilteredEventTypes] = useState<EventType[]>([
    "研究报告",
    "实验讨论",
    "学术会议",
    "项目评审",
    "实验安排",
    "团队会议",
  ])

  const handleGridClick = (date: Date, hour?: number) => {
    setNewEventTime({ date, hour })
    setIsAddEventOpen(true)
  }

  const handleAddEvent = (event: Partial<CalendarEvent>) => {
    onAddEvent(event)
    setIsAddEventOpen(false)
  }

  // 中文星期
  const chineseWeekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

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
  const hours = Array.from({ length: 11 }, (_, i) => i + 7) // 7 AM to 5 PM

  return (
    <div className="flex-1 overflow-auto bg-white">
      {/* 使用表格布局确保完美对齐 */}
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            <th className="w-[60px] min-w-[60px] border-r border-b p-2 text-center text-sm text-muted-foreground">
              GMT+07
            </th>
            {weekDates.map((date, index) => (
              <th key={index} className="border-r border-b p-2 text-center">
                <div className="text-sm font-medium">{chineseWeekdays[index]}</div>
                <div className="mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm cursor-pointer hover:bg-blue-100">
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
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <td key={dayIndex} className="border-r border-b h-24 p-1">
                  {/* 单元格内容 */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 添加事件对话框 */}
      <AddEventDialog
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onAddEvent={handleAddEvent}
        initialDate={newEventTime?.date}
        initialHour={newEventTime?.hour}
      />
    </div>
  )
}

