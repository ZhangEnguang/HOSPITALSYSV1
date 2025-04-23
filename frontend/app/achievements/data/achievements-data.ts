// 生成模拟数据
export const initialAchievementItems = [
  // 学术论文
  {
    id: "1",
    name: "基于深度学习的复杂场景下目标检测与跟踪关键技术研究",
    description: "提出了一种新型的目标检测与跟踪算法，在复杂场景下具有更高的准确率和实时性。",
    type: "学术论文",
    project: { id: "1", name: "智慧园区综合管理平台" },
    author: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [
      { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    level: "国际级",
    status: "已发表",
    date: "2023-10-15",
    venue: "IEEE Transactions on Pattern Analysis and Machine Intelligence",
    impact: 10.8,
    citations: 12,
    attachments: 2,
  },
  {
    id: "6",
    name: "基于物联网的智慧能源管理系统研究",
    description: "研究了物联网技术在智慧能源管理中的应用，提出了一种新型的能源管理架构。",
    type: "学术论文",
    project: { id: "3", name: "智慧能源管理系统" },
    author: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [
      { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    level: "国际级",
    status: "审核中",
    date: null,
    venue: "Energy and Buildings",
    impact: 8.4,
    citations: 0,
    attachments: 1,
  },
  {
    id: "8",
    name: "基于深度学习的停车位识别算法研究",
    description: "研究了深度学习在停车位识别中的应用，提出了一种新型的停车位识别算法。",
    type: "学术论文",
    project: { id: "5", name: "智慧停车管理平台" },
    author: { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [{ id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" }],
    level: "国家级",
    status: "撰写中",
    date: null,
    venue: "中国科学",
    impact: 0,
    citations: 0,
    attachments: 0,
  },
  {
    id: "11",
    name: "基于人工智能的园区安防系统研究",
    description: "研究了人工智能技术在园区安防中的应用，提出了一种新型的安防系统架构。",
    type: "学术论文",
    project: { id: "1", name: "智慧园区综合管理平台" },
    author: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [{ id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" }],
    level: "国际级",
    status: "已发表",
    date: "2023-06-10",
    venue: "IEEE Internet of Things Journal",
    impact: 9.5,
    citations: 8,
    attachments: 1,
  },

  // 学术著作
  {
    id: "13",
    name: "人工智能与大数据分析",
    description: "系统介绍了人工智能与大数据分析的基本理论和应用实践，包含多个案例研究。",
    type: "学术著作",
    project: { id: "2", name: "AI视觉监控系统" },
    author: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [
      { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    level: "国家级",
    status: "已出版",
    date: "2023-05-20",
    venue: "科学出版社",
    isbn: "978-7-03-XXXXXX-X",
    pages: 320,
    attachments: 1,
  },
  {
    id: "14",
    name: "智慧城市建设理论与实践",
    description: "探讨了智慧城市建设的理论基础和实践经验，提出了智慧城市建设的新模式。",
    type: "学术著作",
    project: { id: "1", name: "智慧园区综合管理平台" },
    author: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [{ id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" }],
    level: "国家级",
    status: "已出版",
    date: "2023-08-15",
    venue: "高等教育出版社",
    isbn: "978-7-04-XXXXXX-X",
    pages: 280,
    attachments: 1,
  },
  {
    id: "15",
    name: "物联网技术与应用",
    description: "全面介绍了物联网技术的基本原理和应用场景，包含多个实际案例。",
    type: "学术著作",
    project: { id: "3", name: "智慧能源管理系统" },
    author: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [
      { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    level: "国家级",
    status: "编写中",
    date: null,
    venue: "电子工业出版社",
    isbn: "待定",
    pages: 0,
    attachments: 0,
  },

  // 成果获奖
  {
    id: "3",
    name: "智慧园区综合管理平台",
    description: "开发了一套智慧园区综合管理平台，实现了园区的智能化管理和运营。",
    type: "成果获奖",
    project: { id: "1", name: "智慧园区综合管理平台" },
    author: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [
      { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    level: "省部级",
    status: "已获奖",
    date: "2023-12-10",
    venue: "省科技厅",
    awardName: "科技进步奖一等奖",
    attachments: 3,
  },
  {
    id: "16",
    name: "AI视觉监控系统",
    description: "开发了一套基于人工智能的视觉监控系统，实现了智能识别和预警功能。",
    type: "成果获奖",
    project: { id: "2", name: "AI视觉监控系统" },
    author: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [
      { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    level: "国家级",
    status: "已获奖",
    date: "2023-11-05",
    venue: "国家科技部",
    awardName: "国家科技进步奖二等奖",
    attachments: 2,
  },
  {
    id: "17",
    name: "智能访客管理系统",
    description: "开发了一套智能访客管理系统，实现了访客的智能化管理和安全控制。",
    type: "成果获奖",
    project: { id: "4", name: "智能访客管理系统" },
    author: { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [{ id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" }],
    level: "市厅级",
    status: "已获奖",
    date: "2023-09-20",
    venue: "市科技局",
    awardName: "科技创新奖",
    attachments: 1,
  },

  // 鉴定成果
  {
    id: "18",
    name: "智慧能源管理系统技术鉴定",
    description: "对智慧能源管理系统进行了技术鉴定，评估了系统的技术水平和应用价值。",
    type: "鉴定成果",
    project: { id: "3", name: "智慧能源管理系统" },
    author: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [{ id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" }],
    level: "省部级",
    status: "已鉴定",
    date: "2023-07-15",
    venue: "省科技厅",
    appraisalNumber: "2023-JD-001",
    appraisalResult: "国内领先",
    attachments: 2,
  },
  {
    id: "19",
    name: "智慧停车管理平台技术鉴定",
    description: "对智慧停车管理平台进行了技术鉴定，评估了系统的技术水平和应用价值。",
    type: "鉴定成果",
    project: { id: "5", name: "智慧停车管理平台" },
    author: { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [{ id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" }],
    level: "市厅级",
    status: "已鉴定",
    date: "2023-08-10",
    venue: "市科技局",
    appraisalNumber: "2023-JD-002",
    appraisalResult: "国内先进",
    attachments: 1,
  },
  {
    id: "20",
    name: "智慧园区综合管理平台技术鉴定",
    description: "对智慧园区综合管理平台进行了技术鉴定，评估了系统的技术水平和应用价值。",
    type: "鉴定成果",
    project: { id: "1", name: "智慧园区综合管理平台" },
    author: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [
      { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    level: "国家级",
    status: "鉴定中",
    date: null,
    venue: "国家科技部",
    appraisalNumber: "申请中",
    appraisalResult: "待定",
    attachments: 0,
  },

  // 专利
  {
    id: "2",
    name: "一种基于边缘计算的智能视频分析系统",
    description: "提出了一种新型的边缘计算架构，实现了视频分析的低延迟和高效处理。",
    type: "专利",
    project: { id: "2", name: "AI视觉监控系统" },
    author: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [
      { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    level: "国家级",
    status: "已授权",
    date: "2023-08-20",
    venue: "国家知识产权局",
    patentNumber: "CN123456789A",
    attachments: 1,
  },
  {
    id: "7",
    name: "一种智能访客管理系统及其方法",
    description: "提出了一种基于人脸识别的智能访客管理系统及其方法。",
    type: "专利",
    project: { id: "4", name: "智能访客管理系统" },
    author: { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [{ id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" }],
    level: "国家级",
    status: "审核中",
    date: null,
    venue: "国家知识产权局",
    patentNumber: "CN申请中",
    attachments: 1,
  },
  {
    id: "12",
    name: "一种基于边缘计算的园区能源管理方法",
    description: "提出了一种基于边缘计算的园区能源管理方法，实现了能源的高效管理和优化。",
    type: "专利",
    project: { id: "3", name: "智慧能源管理系统" },
    author: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [{ id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" }],
    level: "国家级",
    status: "已授权",
    date: "2023-05-15",
    venue: "国家知识产权局",
    patentNumber: "CN987654321A",
    attachments: 1,
  },
  {
    id: "4",
    name: "一种基于人工智能的智慧停车管理系统",
    description: "提出了一种基于人工智能的智慧停车管理系统，实现了停车位的智能识别和管理。",
    type: "专利",
    project: { id: "5", name: "智慧停车管理平台" },
    author: { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    coAuthors: [
      { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" }
    ],
    level: "国家级",
    status: "申请中",
    date: "2023-11-10",
    venue: "国家知识产权局",
    patentNumber: "CN202311100001X",
    patentType: "发明专利",
    applicationDate: "2023-11-10",
    attachments: 2,
  },
]

// 生成更多模拟数据
export const generateMoreAchievementItems = (count: number) => {
  const types = ["学术论文", "学术著作", "成果获奖", "鉴定成果", "专利"]
  const statuses = {
    学术论文: ["已发表", "审核中", "撰写中", "已拒绝"],
    学术著作: ["已出版", "编写中", "审核中", "已拒绝"],
    成果获奖: ["已获奖", "申报中", "已拒绝"],
    鉴定成果: ["已鉴定", "鉴定中", "已拒绝"],
    专利: ["已授权", "审核中", "已拒绝"],
  }
  const levels = ["国际级", "国家级", "省部级", "市厅级", "校级", "行业级"]
  const projects = [
    { id: "1", name: "智慧园区综合管理平台" },
    { id: "2", name: "AI视觉监控系统" },
    { id: "3", name: "智慧能源管理系统" },
    { id: "4", name: "智能访客管理系统" },
    { id: "5", name: "智慧停车管理平台" },
  ]
  const authors = [
    { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
  ]
  const venues = {
    学术论文: [
      "IEEE Transactions on Pattern Analysis and Machine Intelligence",
      "Nature",
      "Science",
      "Cell",
      "中国科学",
      "计算机学报",
    ],
    学术著作: ["科学出版社", "高等教育出版社", "电子工业出版社", "机械工业出版社", "清华大学出版社"],
    成果获奖: ["国家科技部", "省科技厅", "市科技局", "中国科学院", "中国工程院"],
    鉴定成果: ["国家科技部", "省科技厅", "市科技局", "行业协会", "专业机构"],
    专利: ["国家知识产权局", "欧洲专利局", "美国专利商标局", "日本专利局", "韩国知识产权局"],
  }

  const achievementNames = {
    学术论文: ["基于深度学习的", "人工智能在", "大数据分析与", "云计算技术在", "物联网应用于"],
    学术著作: ["人工智能与", "大数据技术", "物联网原理与应用", "智慧城市建设", "数字化转型"],
    成果获奖: ["智能化", "创新型", "高效率", "节能型", "智慧型"],
    鉴定成果: ["技术鉴定：", "系统评估：", "平台鉴定：", "方案评审：", "技术评价："],
    专利: ["一种基于", "一种新型", "一种高效", "一种智能", "一种创新"],
  }

  const additionalItems = []

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const statusOptions = statuses[type as keyof typeof statuses]
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]
    const author = authors[Math.floor(Math.random() * authors.length)]

    // 随机选择1-3个合作者
    const coAuthorsCount = Math.floor(Math.random() * 3) + 1
    const coAuthors = []
    for (let j = 0; j < coAuthorsCount; j++) {
      const coAuthor = authors[Math.floor(Math.random() * authors.length)]
      if (coAuthor.id !== author.id && !coAuthors.some((a) => a.id === coAuthor.id)) {
        coAuthors.push(coAuthor)
      }
    }

    let date = null
    if (
      status === "已发表" ||
      status === "已授权" ||
      status === "已获奖" ||
      status === "已登记" ||
      status === "已发布" ||
      status === "已出版" ||
      status === "已鉴定"
    ) {
      const d = new Date()
      d.setDate(d.getDate() - Math.floor(Math.random() * 365))
      date = d.toISOString().split("T")[0]
    }

    const venueOptions = venues[type as keyof typeof venues]
    const venue = venueOptions[Math.floor(Math.random() * venueOptions.length)]

    const nameOptions = achievementNames[type as keyof typeof achievementNames]
    const namePrefix = nameOptions[Math.floor(Math.random() * nameOptions.length)]

    let suffix = ""
    if (type === "学术论文") suffix = "研究"
    else if (type === "学术著作") suffix = "教程"
    else if (type === "成果获奖") suffix = "项目"
    else if (type === "鉴定成果") suffix = "报告"
    else if (type === "专利") suffix = "方法"

    const item: any = {
      id: (initialAchievementItems.length + i + 1).toString(),
      name: `${namePrefix}${projects[Math.floor(Math.random() * projects.length)].name.substring(0, 4)}${suffix} ${i + 1}`,
      description: "成果描述内容，详细说明成果的创新点和应用价值。",
      type,
      project: projects[Math.floor(Math.random() * projects.length)],
      author,
      coAuthors,
      level: levels[Math.floor(Math.random() * levels.length)],
      status,
      date,
      venue,
      attachments: Math.floor(Math.random() * 3),
    }

    // 添加特定类型的属性
    if (type === "学术论文") {
      item.impact = Number.parseFloat((Math.random() * 10 + 1).toFixed(1))
      item.citations = Math.floor(Math.random() * 20)
    } else if (type === "学术著作") {
      item.isbn =
        status === "已出版"
          ? `978-7-${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10)}`
          : "待定"
      item.pages = status === "已出版" ? Math.floor(Math.random() * 300) + 200 : 0
    } else if (type === "成果获奖") {
      item.awardName = status === "已获奖" ? `科技进步奖${Math.floor(Math.random() * 3) + 1}等奖` : "申请中"
    } else if (type === "鉴定成果") {
      item.appraisalNumber =
        status === "已鉴定"
          ? `${new Date().getFullYear()}-JD-${Math.floor(Math.random() * 1000)
              .toString()
              .padStart(3, "0")}`
          : "申请中"
      item.appraisalResult =
        status === "已鉴定" ? ["国际领先", "国内领先", "国内先进"][Math.floor(Math.random() * 3)] : "待定"
    } else if (type === "专利") {
      item.patentNumber = status === "已授权" ? `CN${Math.floor(Math.random() * 1000000000)}A` : "CN申请中"
    }

    additionalItems.push(item)
  }

  return additionalItems
}

// 扩展初始成果数据
export const extendedAchievementItems = [...initialAchievementItems, ...generateMoreAchievementItems(15)]
