// 模拟评审项目数据
export const initialReviewProjects = [
  {
    id: "proj-1",
    name: "先进轨道交通装备与系统技术研究",
    description:
      "研究先进轨道交通装备与系统，提高运行效率和安全性。本项目旨在开发新一代轨道交通控制系统，实现智能化、自动化运行。",
    category: "工程技术",
    type: "国家级",
    status: "待分配",
    date: "2023-05-10",
    deadline: "2023-06-30",
    amount: 19.91,
    manager: {
      id: "1",
      name: "朱杰",
      department: "机械工程学院",
      title: "副教授",
    },
    expertCount: 2,
    batchNumber: "2023年度校企合作项目评审",
  },
  {
    id: "proj-2",
    name: "新一代人工智能芯片架构设计与优化",
    description:
      "设计新一代人工智能专用芯片架构，提高计算效率和能效比。本项目将研发适用于边缘计算的低功耗AI芯片，支持深度学习算法加速。",
    category: "工程技术",
    type: "国家级",
    status: "待分配",
    date: "2023-05-12",
    deadline: "2023-06-30",
    amount: 23.01,
    manager: {
      id: "2",
      name: "林楠",
      department: "电子工程学院",
      title: "教授",
    },
    expertCount: 2,
    batchNumber: "2023年度校企合作项目评审",
  },
  {
    id: "proj-3",
    name: "新型储能材料与系统集成技术研究",
    description:
      "开发新型储能材料与系统集成技术，提高能量密度和循环寿命。本项目将研究新型锂硫电池材料，解决容量衰减问题。",
    category: "工程技术",
    type: "省部级",
    status: "待分配",
    date: "2023-05-15",
    deadline: "2023-06-30",
    amount: 17.86,
    manager: {
      id: "3",
      name: "张强",
      department: "材料科学学院",
      title: "教授",
    },
    expertCount: 1,
    batchNumber: "2023年度校企合作项目评审",
  },
  {
    id: "proj-4",
    name: "高性能计算与大数据处理技术研究",
    description:
      "研究高性能计算与大数据处理算法，提高数据处理效率。本项目将开发分布式计算框架，支持PB级数据的实时分析。",
    category: "工程技术",
    type: "国家级",
    status: "待分配",
    date: "2023-05-18",
    deadline: "2023-06-30",
    amount: 28.83,
    manager: {
      id: "4",
      name: "赵勇",
      department: "计算机科学学院",
      title: "教授",
    },
    expertCount: 1,
    batchNumber: "2023年度校企合作项目评审",
  },
  {
    id: "proj-5",
    name: "智能制造系统关键技术与应用研究",
    description:
      "研究智能制造关键技术，推动制造业数字化转型。本项目旨在开发工业互联网平台，实现生产过程的智能监控与优化。",
    category: "工程技术",
    type: "省部级",
    status: "待分配",
    date: "2023-05-20",
    deadline: "2023-06-30",
    amount: 11.82,
    manager: {
      id: "5",
      name: "马建华",
      department: "机械工程学院",
      title: "副教授",
    },
    expertCount: 1,
    batchNumber: "2023年度校企合作项目评审",
  },
  {
    id: "proj-6",
    name: "高性能计算与大数据处理技术研究",
    description: "研究高性能计算与大数据处理算法，提高数据处理效率。本项目将开发新型并行计算模型，加速大规模科学计算。",
    category: "工程技术",
    type: "国家级",
    status: "待分配",
    date: "2023-05-22",
    deadline: "2023-06-30",
    amount: 24.61,
    manager: {
      id: "6",
      name: "吴明",
      department: "计算机科学学院",
      title: "教授",
    },
    expertCount: 3,
    batchNumber: "2023年度校企合作项目评审",
  },
  {
    id: "proj-7",
    name: "新型传感器网络与物联网技术研究",
    description:
      "开发新型传感器网络技术，提高物联网应用效率。本项目旨在研究低功耗广域网络技术，支持大规模物联网设备接入。",
    category: "工程技术",
    type: "省部级",
    status: "待分配",
    date: "2023-05-25",
    deadline: "2023-06-30",
    amount: 26.18,
    manager: {
      id: "7",
      name: "吴刚",
      department: "信息科学研究院",
      title: "研究员",
    },
    expertCount: 1,
    batchNumber: "2023年度校企合作项目评审",
  },
]

// 生成更多数据
export const generateMoreReviewProjects = (count: number) => {
  const categories = ["工程技术", "自然科学", "人文社科", "医学健康", "农业科学"]
  const types = ["国家级", "省部级", "市级", "校级"]
  const statuses = ["待分配", "审核中", "已通过", "已拒绝"]
  const managers = [
    { id: "8", name: "陈明", department: "环境科学学院", title: "教授" },
    { id: "9", name: "王丽", department: "生命科学学院", title: "教授" },
    { id: "10", name: "李强", department: "材料科学学院", title: "副教授" },
    { id: "11", name: "张华", department: "电子工程学院", title: "教授" },
    { id: "12", name: "刘伟", department: "计算机科学学院", title: "副教授" },
  ]
  const projectNames = [
    "生物医药新靶点发现与药物筛选",
    "新能源汽车动力系统优化研究",
    "城市交通智能管理系统研究",
    "环境友好型材料研发与应用",
    "数字经济背景下的企业转型研究",
    "网络安全关键技术研究",
    "智慧农业关键技术研发与应用",
    "人工智能辅助教学系统开发",
    "智能电网关键技术研究",
    "高校思政教育创新模式研究",
  ]

  const additionalProjects = []

  for (let i = 0; i < count; i++) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30))
    const formattedDate = startDate.toISOString().split("T")[0]

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30 + Math.floor(Math.random() * 30))
    const formattedEndDate = endDate.toISOString().split("T")[0]

    additionalProjects.push({
      id: `proj-${initialReviewProjects.length + i + 1}`,
      name: projectNames[Math.floor(Math.random() * projectNames.length)],
      description: "项目描述内容，详细说明项目目标、研究内容和预期成果。",
      category: categories[Math.floor(Math.random() * categories.length)],
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: formattedDate,
      deadline: formattedEndDate,
      amount: Math.floor(Math.random() * 50) + 10 + Math.random(),
      manager: managers[Math.floor(Math.random() * managers.length)],
      expertCount: Math.floor(Math.random() * 5),
      batchNumber: "2023年度校企合作项目评审",
    })
  }

  return additionalProjects
}

// 扩展初始数据
export const extendedReviewProjects = [...initialReviewProjects, ...generateMoreReviewProjects(5)]

