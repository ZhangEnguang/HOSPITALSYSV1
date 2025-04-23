import type { CalendarEvent, CalendarStats, Student } from "../types/calendar"

// 模拟学生数据
export const mockStudents: Student[] = [
  { id: "1", name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "4", name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "5", name: "钱七", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "6", name: "孙八", avatar: "/placeholder.svg?height=32&width=32" },
]

// 修改 mockEvents 数组，减少事件数量并使其分布更加合理
export const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "量子计算研究进展报告",
    subject: "研究报告",
    description: "讨论最新的量子计算研究进展和应用前景",
    startTime: "08:00",
    endTime: "10:00",
    day: 1, // 周一
    type: "normal",
    location: "科研楼A301",
    students: [mockStudents[0], mockStudents[1], mockStudents[2]],
  },
  {
    id: "2",
    title: "人工智能算法优化讨论",
    subject: "实验讨论",
    description: "讨论如何优化现有的人工智能算法以提高性能",
    startTime: "08:00",
    endTime: "10:00",
    day: 3, // 周三
    type: "important",
    location: "科研楼B201",
    students: [mockStudents[1], mockStudents[3], mockStudents[4]],
  },
  {
    id: "3",
    title: "国际学术会议筹备",
    subject: "学术会议",
    description: "筹备即将举行的国际学术会议，讨论议程安排",
    startTime: "13:30",
    endTime: "15:30",
    day: 5, // 周五
    type: "urgent",
    location: "会议中心C102",
    students: [mockStudents[0], mockStudents[2], mockStudents[5]],
  },
  {
    id: "4",
    title: "科研项目中期评审",
    subject: "项目评审",
    description: "对当前科研项目进行中期评审，检查进度和成果",
    startTime: "08:00",
    endTime: "10:00",
    day: 2, // 周二
    type: "important",
    location: "科研楼A501",
    students: [mockStudents[0], mockStudents[2], mockStudents[4]],
  },
  {
    id: "5",
    title: "生物医学实验安排",
    subject: "实验安排",
    description: "安排下周的生物医学实验，分配任务和资源",
    startTime: "13:30",
    endTime: "15:30",
    day: 4, // 周四
    type: "normal",
    location: "实验楼B301",
    students: [mockStudents[1], mockStudents[3], mockStudents[5]],
  },
  {
    id: "6",
    title: "研究团队周会",
    subject: "团队会议",
    description: "研究团队的例行周会，汇报本周工作和下周计划",
    startTime: "08:00",
    endTime: "10:00",
    day: 5, // 周五
    type: "normal",
    location: "会议室A101",
    students: mockStudents,
  },
  {
    id: "7",
    title: "科研经费使用讨论",
    subject: "团队会议",
    description: "讨论科研经费的使用情况和未来分配计划",
    startTime: "13:30",
    endTime: "15:30",
    day: 2, // 周二
    type: "important",
    location: "会议室B102",
    students: [mockStudents[0], mockStudents[1], mockStudents[2], mockStudents[3]],
  },
  {
    id: "8",
    title: "学术论文写作指导",
    subject: "研究报告",
    description: "为研究生提供学术论文写作的指导和建议",
    startTime: "08:00",
    endTime: "10:00",
    day: 0, // 周日
    type: "normal",
    location: "图书馆研讨室",
    students: [mockStudents[2], mockStudents[3], mockStudents[4]],
  },
  {
    id: "9",
    title: "实验数据分析会议",
    subject: "实验讨论",
    description: "分析最近收集的实验数据，讨论研究发现",
    startTime: "13:30",
    endTime: "15:30",
    day: 1, // 周一
    type: "normal",
    location: "数据中心",
    students: [mockStudents[0], mockStudents[1], mockStudents[5]],
  },
  {
    id: "10",
    title: "科研成果转化讨论",
    subject: "项目评审",
    description: "讨论如何将科研成果转化为实际应用",
    startTime: "08:00",
    endTime: "10:00",
    day: 6, // 周六
    type: "important",
    location: "创新中心A301",
    students: [mockStudents[1], mockStudents[2], mockStudents[4]],
  },
  {
    id: "11",
    title: "国际合作项目视频会议",
    subject: "学术会议",
    description: "与国际合作伙伴进行视频会议，讨论合作项目进展",
    startTime: "19:00",
    endTime: "21:00",
    day: 3, // 周三
    type: "urgent",
    location: "远程会议室",
    students: [mockStudents[0], mockStudents[1], mockStudents[2]],
  },
]

// 模拟统计数据
export const mockStats: CalendarStats = {
  totalEvents: mockEvents.length,
  normalEvents: mockEvents.filter((e) => e.type === "normal").length,
  importantEvents: mockEvents.filter((e) => e.type === "important").length,
  urgentEvents: mockEvents.filter((e) => e.type === "urgent").length,
  totalHours: mockEvents.reduce((acc, event) => {
    const start = Number.parseInt(event.startTime.split(":")[0])
    const end = Number.parseInt(event.endTime.split(":")[0])
    return acc + (end - start)
  }, 0),
  workload: 80, // 百分比
}

// 修改团队成员日历数据，减少事件数量
export const teamMemberEvents: Record<string, CalendarEvent[]> = {
  "1": [
    {
      id: "team-1-1",
      title: "项目启动会议",
      subject: "团队会议",
      day: 1, // 周一
      startTime: "10:00",
      endTime: "11:30",
      type: "important",
      location: "会议室A",
      students: [],
      description: "讨论新项目的启动计划和任务分配",
      memberId: "1",
      memberName: "张教授",
      memberRole: "负责人",
      memberAvatar: "/placeholder.svg?height=40&width=40",
      memberColor: "#4f46e5",
    },
  ],
  "2": [
    {
      id: "team-2-1",
      title: "数据分析讨论",
      subject: "实验讨论",
      day: 2, // 周二
      startTime: "09:00",
      endTime: "10:30",
      type: "normal",
      location: "实验室",
      students: [],
      description: "讨论实验数据分析方法和结果解读",
      memberId: "2",
      memberName: "李博士",
      memberRole: "研究员",
      memberAvatar: "/placeholder.svg?height=40&width=40",
      memberColor: "#0ea5e9",
    },
  ],
  "3": [
    {
      id: "team-3-1",
      title: "实验数据收集",
      subject: "实验安排",
      day: 3, // 周三
      startTime: "13:00",
      endTime: "16:00",
      type: "normal",
      location: "实验室B",
      students: [],
      description: "收集实验数据并进行初步整理",
      memberId: "3",
      memberName: "王助研",
      memberRole: "助理研究员",
      memberAvatar: "/placeholder.svg?height=40&width=40",
      memberColor: "#10b981",
    },
  ],
  "4": [
    {
      id: "team-4-1",
      title: "文献调研",
      subject: "研究报告",
      day: 4, // 周四
      startTime: "09:00",
      endTime: "12:00",
      type: "normal",
      location: "",
      students: [],
      description: "进行相关领域的文献调研和综述",
      memberId: "4",
      memberName: "赵博士",
      memberRole: "博士生",
      memberAvatar: "/placeholder.svg?height=40&width=40",
      memberColor: "#f59e0b",
    },
  ],
  "5": [
    {
      id: "team-5-1",
      title: "项目进度汇报",
      subject: "团队会议",
      day: 5, // 周五
      startTime: "16:00",
      endTime: "17:00",
      type: "important",
      location: "会议室C",
      students: [],
      description: "向导师汇报项目进度和研究成果",
      memberId: "5",
      memberName: "钱硕士",
      memberRole: "硕士生",
      memberAvatar: "/placeholder.svg?height=40&width=40",
      memberColor: "#ec4899",
    },
  ],
  "6": [
    {
      id: "team-6-1",
      title: "实验设备维护",
      subject: "实验安排",
      day: 0, // 周日
      startTime: "09:00",
      endTime: "11:00",
      type: "normal",
      location: "实验室",
      students: [],
      description: "对实验设备进行定期维护和校准",
      memberId: "6",
      memberName: "孙同学",
      memberRole: "本科生",
      memberAvatar: "/placeholder.svg?height=40&width=40",
      memberColor: "#8b5cf6",
    },
  ],
  "7": [
    {
      id: "team-7-1",
      title: "技术培训",
      subject: "团队会议",
      day: 6, // 周六
      startTime: "14:00",
      endTime: "16:00",
      type: "normal",
      location: "培训室",
      students: [],
      description: "参加新技术培训和学习",
      memberId: "7",
      memberName: "周工程师",
      memberRole: "技术支持",
      memberAvatar: "/placeholder.svg?height=40&width=40",
      memberColor: "#f43f5e",
    },
  ],
  "8": [],
}

