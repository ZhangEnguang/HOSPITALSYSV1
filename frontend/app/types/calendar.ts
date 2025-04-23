export type CalendarViewMode = "日" | "周" | "月" | "年" | "日程"

export type EventType = "研究报告" | "实验讨论" | "学术会议" | "项目评审" | "实验安排" | "团队会议"

export interface Student {
  id: string
  name: string
  avatar: string
}

export interface CalendarEvent {
  id: string
  title: string
  subject: EventType
  description?: string
  startTime: string
  endTime: string
  day: number // 0-6, 0 is Sunday
  type: "normal" | "important" | "urgent"
  location?: string
  students: Student[]
}

export interface CalendarStats {
  totalEvents: number
  normalEvents: number
  importantEvents: number
  urgentEvents: number
  totalHours: number
  workload: number
}

