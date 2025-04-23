// 生成模拟数据
export const initialProgressItems = [
  {
    id: "1",
    name: "需求分析与规划",
    description: "完成项目需求收集、分析和规划文档",
    project: { id: "1", name: "智慧园区综合管理平台" },
    type: "阶段",
    status: "已完成",
    priority: "高",
    assignee: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 100,
    dueDate: "2024-01-15",
    actualDate: "2024-01-14",
    comments: 5,
    progressType: "projectChange", // 添加进度类型
  },
  {
    id: "2",
    name: "系统架构设计",
    description: "完成系统整体架构设计和技术选型",
    project: { id: "1", name: "智慧园区综合管理平台" },
    type: "里程碑",
    status: "已完成",
    priority: "高",
    assignee: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 100,
    dueDate: "2024-01-31",
    actualDate: "2024-01-30",
    comments: 3,
    progressType: "projectChange",
  },
  {
    id: "3",
    name: "数据库设计",
    description: "完成数据库表结构设计和关系模型",
    project: { id: "1", name: "智慧园区综合管理平台" },
    type: "任务",
    status: "已完成",
    priority: "中",
    assignee: { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 100,
    dueDate: "2024-02-15",
    actualDate: "2024-02-12",
    comments: 2,
    progressType: "projectChange",
  },
  {
    id: "4",
    name: "前端界面开发",
    description: "完成系统前端界面开发和交互设计",
    project: { id: "1", name: "智慧园区综合管理平台" },
    type: "阶段",
    status: "进行中",
    priority: "高",
    assignee: { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 65,
    dueDate: "2024-04-30",
    actualDate: null,
    comments: 8,
    progressType: "contractRecognition",
  },
  {
    id: "5",
    name: "后端API开发",
    description: "完成系统后端API开发和数据处理",
    project: { id: "1", name: "智慧园区综合管理平台" },
    type: "阶段",
    status: "进行中",
    priority: "高",
    assignee: { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 70,
    dueDate: "2024-04-30",
    actualDate: null,
    comments: 6,
    progressType: "contractRecognition",
  },
  {
    id: "6",
    name: "系统集成测试",
    description: "完成系统各模块集成和功能测试",
    project: { id: "1", name: "智慧园区综合管理平台" },
    type: "里程碑",
    status: "未开始",
    priority: "高",
    assignee: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 0,
    dueDate: "2024-05-31",
    actualDate: null,
    comments: 0,
    progressType: "contractRecognition",
  },
  {
    id: "7",
    name: "用户验收测试",
    description: "完成用户验收测试和问题修复",
    project: { id: "1", name: "智慧园区综合管理平台" },
    type: "里程碑",
    status: "未开始",
    priority: "高",
    assignee: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 0,
    dueDate: "2024-06-15",
    actualDate: null,
    comments: 0,
    progressType: "projectInspection",
  },
  {
    id: "8",
    name: "系统部署上线",
    description: "完成系统部署和上线准备",
    project: { id: "1", name: "智慧园区综合管理平台" },
    type: "里程碑",
    status: "未开始",
    priority: "高",
    assignee: { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 0,
    dueDate: "2024-06-30",
    actualDate: null,
    comments: 0,
    progressType: "projectInspection",
  },
  {
    id: "9",
    name: "需求分析",
    description: "完成AI视觉监控系统需求分析",
    project: { id: "2", name: "AI视觉监控系统" },
    type: "阶段",
    status: "已完成",
    priority: "高",
    assignee: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 100,
    dueDate: "2024-03-10",
    actualDate: "2024-03-08",
    comments: 4,
    progressType: "projectInspection",
  },
  {
    id: "10",
    name: "算法研发",
    description: "完成视觉识别算法研发",
    project: { id: "2", name: "AI视觉监控系统" },
    type: "阶段",
    status: "进行中",
    priority: "高",
    assignee: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 45,
    dueDate: "2024-05-15",
    actualDate: null,
    comments: 7,
    progressType: "projectCompletion",
  },
  {
    id: "11",
    name: "模型训练",
    description: "完成AI模型训练和优化",
    project: { id: "2", name: "AI视觉监控系统" },
    type: "任务",
    status: "进行中",
    priority: "高",
    assignee: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 30,
    dueDate: "2024-04-30",
    actualDate: null,
    comments: 3,
    progressType: "projectCompletion",
  },
  {
    id: "12",
    name: "系统原型设计",
    description: "完成智慧能源管理系统原型设计",
    project: { id: "3", name: "智慧能源管理系统" },
    type: "任务",
    status: "已延期",
    priority: "中",
    assignee: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    completion: 80,
    dueDate: "2024-03-15",
    actualDate: null,
    comments: 5,
    progressType: "projectCompletion",
  },
]

// 生成更多模拟数据
export const generateMoreProgressItems = (count: number) => {
  const statuses = ["未开始", "进行中", "已完成", "已延期", "已取消"]
  const priorities = ["高", "中", "低"]
  const types = ["里程碑", "任务", "阶段"]
  const projects = [
    { id: "1", name: "智慧园区综合管理平台" },
    { id: "2", name: "AI视觉监控系统" },
    { id: "3", name: "智慧能源管理系统" },
    { id: "4", name: "智能访客管理系统" },
    { id: "5", name: "智慧停车管理平台" },
  ]
  const assignees = [
    { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  const progressNames = [
    "需求分析",
    "系统设计",
    "数据库设计",
    "前端开发",
    "后端开发",
    "系统测试",
    "用户验收",
    "系统部署",
    "文档编写",
    "培训准备",
  ]

  const additionalItems = []
  const progressTypes = ["projectChange", "contractRecognition", "projectInspection", "projectCompletion"]

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const completion = status === "已完成" ? 100 : status === "未开始" ? 0 : Math.floor(Math.random() * 90) + 5

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 90))

    let actualDate = null
    if (status === "已完成") {
      actualDate = new Date()
      actualDate.setDate(actualDate.getDate() - Math.floor(Math.random() * 30))
    }

    additionalItems.push({
      id: (initialProgressItems.length + i + 1).toString(),
      name: `${progressNames[Math.floor(Math.random() * progressNames.length)]} ${i + 1}`,
      description: "进度描述内容，详细说明进度目标和预期成果。",
      project: projects[Math.floor(Math.random() * projects.length)],
      type: types[Math.floor(Math.random() * types.length)],
      status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      completion,
      dueDate: dueDate.toISOString().split("T")[0],
      actualDate: actualDate ? actualDate.toISOString().split("T")[0] : null,
      comments: Math.floor(Math.random() * 10),
      progressType: progressTypes[Math.floor(Math.random() * progressTypes.length)], // 添加随机进度类型
    })
  }

  return additionalItems
}

// 扩展初始进度数据
export const extendedProgressItems = [...initialProgressItems, ...generateMoreProgressItems(8)]

