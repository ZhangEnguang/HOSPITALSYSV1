"use client"

import { useState } from "react"
import { CalendarHeader } from "./calendar-header"
import { CalendarSidebar } from "./calendar-sidebar"
import { DayView } from "./day-view"
import { WeekView } from "./week-view"
import { MonthView } from "./month-view"
import { AddEventDialog } from "./add-event-dialog"
import { mockEvents } from "../data/mock-data"
import type { CalendarEvent, CalendarViewMode, EventType } from "../types/calendar"

export function Calendar() {
  const [date, setDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<CalendarViewMode>("周")
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [filteredEventTypes, setFilteredEventTypes] = useState<EventType[]>([
    "研究报告",
    "实验讨论",
    "学术会议",
    "项目评审",
    "实验安排",
    "团队会议",
  ])

  const handleDateChange = (newDate: Date) => {
    setDate(newDate)
  }

  const handleViewModeChange = (mode: CalendarViewMode) => {
    setViewMode(mode)
  }

  const handleAddEvent = () => {
    setIsAddEventOpen(true)
  }

  const handleAddEventSubmit = (event: Partial<CalendarEvent>) => {
    const newEvent: CalendarEvent = {
      id: `event-${events.length + 1}`,
      title: event.title || "未命名事项",
      description: event.description || "",
      startTime: event.startTime || "09:00",
      endTime: event.endTime || "10:00",
      day: event.day || 0,
      type: event.type || "normal",
      subject: event.subject || "研究报告",
      location: event.location || "",
      students: event.students || [],
    }

    setEvents([...events, newEvent])
    setIsAddEventOpen(false)
  }

  const handleFilterChange = (eventTypes: EventType[]) => {
    setFilteredEventTypes(eventTypes)
  }

  return (
    <div className="flex h-full flex-col rounded-lg border bg-background shadow-sm">
      <CalendarHeader
        date={date}
        onDateChange={handleDateChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onAddEvent={handleAddEvent}
        onFilterChange={handleFilterChange}
      />

      <div className="flex flex-1 overflow-hidden">
        <CalendarSidebar />

        <div className="flex-1 overflow-auto">
          {viewMode === "日" && <DayView events={events} date={date} filteredEventTypes={filteredEventTypes} />}
          {viewMode === "周" && <WeekView events={events} date={date} onAddEvent={handleAddEventSubmit} />}
          {viewMode === "月" && <MonthView events={events} date={date} filteredEventTypes={filteredEventTypes} />}
        </div>
      </div>

      <AddEventDialog
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onAddEvent={handleAddEventSubmit}
      />
    </div>
  )
}

