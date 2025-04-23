"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { format, addMonths, subMonths, addDays, subDays, addWeeks, subWeeks } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { TeamCalendarOverlay } from "./team-calendar-overlay"
import { AddEventButton } from "./add-event-button"
import type { CalendarViewMode, EventType } from "../types/calendar"

interface CalendarHeaderProps {
  date: Date
  onDateChange: (date: Date) => void
  viewMode: CalendarViewMode
  onViewModeChange: (mode: CalendarViewMode) => void
  onAddEvent: () => void
  onFilterChange: (eventTypes: EventType[]) => void
  onTeamMembersChange?: (memberIds: string[], opacity: number) => void
  isManager?: boolean
}

const eventTypes: EventType[] = ["研究报告", "实验讨论", "学术会议", "项目评审", "实验安排", "团队会议"]

export function CalendarHeader({
  date,
  onDateChange,
  viewMode,
  onViewModeChange,
  onAddEvent,
  onFilterChange,
  onTeamMembersChange,
  isManager = false,
}: CalendarHeaderProps) {
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>(eventTypes)

  const handlePrevious = () => {
    if (viewMode === "日") {
      onDateChange(subDays(date, 1))
    } else if (viewMode === "周") {
      onDateChange(subWeeks(date, 1))
    } else {
      onDateChange(subMonths(date, 1))
    }
  }

  const handleNext = () => {
    if (viewMode === "日") {
      onDateChange(addDays(date, 1))
    } else if (viewMode === "周") {
      onDateChange(addWeeks(date, 1))
    } else {
      onDateChange(addMonths(date, 1))
    }
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  const handleEventTypeToggle = (type: EventType) => {
    setSelectedEventTypes((prev) => {
      if (prev.includes(type)) {
        const newTypes = prev.filter((t) => t !== type)
        onFilterChange(newTypes)
        return newTypes
      } else {
        const newTypes = [...prev, type]
        onFilterChange(newTypes)
        return newTypes
      }
    })
  }

  const handleSelectAllEventTypes = () => {
    if (selectedEventTypes.length === eventTypes.length) {
      setSelectedEventTypes([])
      onFilterChange([])
    } else {
      setSelectedEventTypes([...eventTypes])
      onFilterChange([...eventTypes])
    }
  }

  const handleTeamMembersChange = (memberIds: string[], opacity: number) => {
    if (onTeamMembersChange) {
      onTeamMembersChange(memberIds, opacity)
    }
  }

  return (
    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[150px]">
              {viewMode === "月" && format(date, "yyyy年MM月", { locale: zhCN })}
              {viewMode === "周" && `${format(date, "yyyy年MM月dd日", { locale: zhCN })} 起的一周`}
              {viewMode === "日" && format(date, "yyyy年MM月dd日", { locale: zhCN })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={(date) => date && onDateChange(date)} initialFocus />
          </PopoverContent>
        </Popover>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleToday}>
          今天
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <Button
            variant={viewMode === "日" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("日")}
            className="px-3"
          >
            日
          </Button>
          <Button
            variant={viewMode === "周" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("周")}
            className="px-3"
          >
            周
          </Button>
          <Button
            variant={viewMode === "月" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("月")}
            className="px-3"
          >
            月
          </Button>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">筛选事项类型</h4>
                <Button variant="ghost" size="sm" onClick={handleSelectAllEventTypes} className="h-7 text-xs">
                  {selectedEventTypes.length === eventTypes.length ? "取消全选" : "全选"}
                </Button>
              </div>
              <div className="space-y-1">
                {eventTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${type}`}
                      checked={selectedEventTypes.includes(type)}
                      onCheckedChange={() => handleEventTypeToggle(type)}
                    />
                    <label htmlFor={`filter-${type}`} className="text-sm cursor-pointer flex-1">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <TeamCalendarOverlay onMemberToggle={handleTeamMembersChange} isManager={isManager} />

        <AddEventButton onClick={onAddEvent} />
      </div>
    </div>
  )
}

