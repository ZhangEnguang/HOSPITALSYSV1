"use client"

import { useState, useEffect } from "react"
import { CalendarHeader } from "./calendar-header"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { DayView } from "./day-view"
import { AddEventDialog } from "./add-event-dialog"
import { EventDetailDrawer } from "./event-detail-drawer"
import { MemberEventDetailDrawer } from "./member-event-detail-drawer"
import { mockEvents, mockStats, teamMemberEvents } from "../data/mock-data"
import type { CalendarEvent, CalendarViewMode, EventType } from "../types/calendar"

export function Calendar() {
  const [viewMode, setViewMode] = useState<CalendarViewMode>("月")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [stats, setStats] = useState(mockStats)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedMemberEvent, setSelectedMemberEvent] = useState<CalendarEvent | null>(null)
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false)
  const [isMemberEventDetailOpen, setIsMemberEventDetailOpen] = useState(false)
  const [clickedDate, setClickedDate] = useState<Date | null>(null)
  const [clickedHour, setClickedHour] = useState<number | null>(null)
  const [filteredEventTypes, setFilteredEventTypes] = useState<EventType[]>([
    "研究报告",
    "实验讨论",
    "学术会议",
    "项目评审",
    "实验安排",
    "团队会议",
  ])
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [teamEventsOpacity, setTeamEventsOpacity] = useState(0.5)
  const [teamEvents, setTeamEvents] = useState<CalendarEvent[]>([])
  const [isManager] = useState(true) // 模拟当前用户是负责人

  // 更新统计  = useState<CalendarEvent[]>([])

  // 更新统计数据
  useEffect(() => {
    setStats({
      totalEvents: events.length,
      normalEvents: events.filter((e) => e.type === "normal").length,
      importantEvents: events.filter((e) => e.type === "important").length,
      urgentEvents: events.filter((e) => e.type === "urgent").length,
      totalHours: events.reduce((acc, event) => {
        const start = Number.parseInt(event.startTime.split(":")[0])
        const end = Number.parseInt(event.endTime.split(":")[0])
        return acc + (end - start)
      }, 0),
      workload: Math.min(Math.round((events.length / 15) * 100), 100), // 假设15个事件为100%工作量
    })
  }, [events])

  // 更新团队成员日历
  useEffect(() => {
    if (selectedTeamMembers.length === 0) {
      setTeamEvents([])
      return
    }

    // 收集所有选中成员的日历事件
    const allTeamEvents: CalendarEvent[] = []

    selectedTeamMembers.forEach((memberId) => {
      const memberEvents = teamMemberEvents[memberId] || []

      // 为每个事件添加成员标识和透明度
      const eventsWithMemberInfo = memberEvents.map((event) => ({
        ...event,
        id: `${event.id}-overlay`,
        isOverlay: true,
        opacity: teamEventsOpacity,
      }))

      allTeamEvents.push(...eventsWithMemberInfo)
    })

    setTeamEvents(allTeamEvents)
  }, [selectedTeamMembers, teamEventsOpacity])

  const handleAddEvent = (newEvent: Partial<CalendarEvent>) => {
    const id = `event-${events.length + 1}`
    const event = { id, ...newEvent } as CalendarEvent
    setEvents([...events, event])
    setIsAddEventOpen(false)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
    setIsEventDetailOpen(false)
  }

  const handleDateClick = (date: Date, hour?: number) => {
    setClickedDate(date)
    setClickedHour(hour || null)
    setIsAddEventOpen(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    // 区分普通事件和团队成员事件
    if (event.isOverlay) {
      setSelectedMemberEvent(event)
      setIsMemberEventDetailOpen(true)
    } else {
      setSelectedEvent(event)
      setIsEventDetailOpen(true)
    }
  }

  const handleFilterChange = (eventTypes: EventType[]) => {
    setFilteredEventTypes(eventTypes)
  }

  const handleTeamMembersChange = (memberIds: string[], opacity: number) => {
    setSelectedTeamMembers(memberIds)
    setTeamEventsOpacity(opacity)
  }

  // 合并当前用户事件和团队成员事件
  const allEvents = [...events, ...teamEvents]

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg border bg-background shadow-sm">
      <CalendarHeader
        date={currentDate}
        onDateChange={setCurrentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddEvent={() => setIsAddEventOpen(true)}
        onFilterChange={handleFilterChange}
        onTeamMembersChange={handleTeamMembersChange}
        isManager={isManager}
      />

      <div className="flex-1 overflow-auto">
        {viewMode === "日" && (
          <DayView
            events={allEvents}
            date={currentDate}
            filteredEventTypes={filteredEventTypes}
            onGridClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
        {viewMode === "周" && (
          <WeekView
            events={allEvents}
            date={currentDate}
            selectedDate={currentDate}
            filteredEventTypes={filteredEventTypes}
            onGridClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
        {viewMode === "月" && (
          <MonthView
            events={allEvents}
            date={currentDate}
            onDateSelect={setCurrentDate}
            filteredEventTypes={filteredEventTypes}
            onGridClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      <AddEventDialog
        isOpen={isAddEventOpen}
        onClose={() => {
          setIsAddEventOpen(false)
          setClickedDate(null)
          setClickedHour(null)
        }}
        onAddEvent={handleAddEvent}
        initialDate={clickedDate}
        initialHour={clickedHour}
      />

      <EventDetailDrawer
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={() => setIsEventDetailOpen(false)}
        onDelete={handleDeleteEvent}
      />

      <MemberEventDetailDrawer
        event={selectedMemberEvent}
        isOpen={isMemberEventDetailOpen}
        onClose={() => setIsMemberEventDetailOpen(false)}
      />
    </div>
  )
}

