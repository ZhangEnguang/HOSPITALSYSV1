"use client"

import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CalendarStats } from "../types/calendar"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarSidebarProps {
  date: Date
  onDateChange: (date: Date) => void
  stats: CalendarStats
  selectedDate: Date
}

export function CalendarSidebar({ date, onDateChange, stats, selectedDate }: CalendarSidebarProps) {
  // 中文星期
  const chineseWeekdays = ["日", "一", "二", "三", "四", "五", "六"]

  // 当前选中的日期
  const isSelectedDay = (day: Date) => {
    return (
      day.getDate() === selectedDate.getDate() &&
      day.getMonth() === selectedDate.getMonth() &&
      day.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className="w-[280px] border-r p-4 bg-gray-50">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-medium">
          {date.getFullYear()}年{date.getMonth() + 1}月
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {chineseWeekdays.map((day, index) => (
          <div key={index} className="text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      <CalendarPicker
        mode="single"
        selected={date}
        onSelect={(date) => date && onDateChange(date)}
        className="rounded-md border bg-white"
        classNames={{
          day_selected: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
          day_today: "bg-orange-100 text-orange-900",
          day: (day) => cn("h-9 w-9 p-0 font-normal", isSelectedDay(day) && "bg-blue-500 text-white rounded-md"),
        }}
      />

      <Card className="mt-6 p-4 bg-white">
        <h3 className="mb-4 font-medium">课程统计</h3>
        <div className="relative mb-6 flex justify-center">
          {/* 环形图 */}
          <div className="relative h-32 w-32">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="12"
                strokeDasharray={`${(stats.normalClasses / stats.totalClasses) * 251.2} 251.2`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f97316"
                strokeWidth="12"
                strokeDasharray={`${(stats.makeupClasses / stats.totalClasses) * 251.2} 251.2`}
                strokeDashoffset={`${(1 - stats.normalClasses / stats.totalClasses) * 251.2}`}
                transform="rotate(-90 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${(stats.substituteClasses / stats.totalClasses) * 251.2} 251.2`}
                strokeDashoffset={`${(1 - (stats.normalClasses + stats.makeupClasses) / stats.totalClasses) * 251.2}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.totalClasses}</div>
                <div className="text-sm text-muted-foreground">课程</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm">{stats.normalClasses} 常规课程</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-sm">{stats.makeupClasses} 补课</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm">{stats.substituteClasses} 代课</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-4 bg-white">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium">工作量</h3>
          <span className="text-sm text-muted-foreground">
            共 {stats.totalClasses} 节课 - {stats.totalHours} 小时
          </span>
        </div>
        <Progress value={stats.workloadPercentage} className="mb-2 h-2" />
        <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-red-600 mt-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">您的日程安排较为紧张，请注意休息，保持健康！</p>
        </div>
      </Card>
    </div>
  )
}

