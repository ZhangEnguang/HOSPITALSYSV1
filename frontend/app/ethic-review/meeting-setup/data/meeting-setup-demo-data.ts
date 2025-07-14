// 会议设置模拟数据

export const meetingSetupItems = [
  {
    id: "1",
    meetingId: "MTG-2025-001",
    title: "2025年第一季度初始审查会议",
    description: "讨论新提交的研究项目初始审查事项",
    meetingType: "初始审查会议",
    date: "2025-03-01",
    time: "09:00",
    duration: "3小时",
    venue: "学术报告厅",
    organizer: {
      id: "u1",
      name: "张三",
      avatar: "/avatars/01.png",
      department: "医学伦理委员会",
      title: "主任委员"
    },
    status: "未开始",
    reviewType: "初始审查",
    committee: "医学伦理委员会",
    attendeeCount: 15,
    quickReviewCount: 2,
    meetingReviewCount: 3,
    // 项目限制相关
    limitProjectCount: true,
    quickReviewLimit: 10,
    meetingReviewLimit: 15,
    projects: [
      "转基因小鼠模型在神经退行性疾病中的应用",
      "新型抗癌药物的临床前研究",
      "基因编辑技术在遗传病治疗中的应用"
    ],
    agenda: [
      "开会致辞",
      "项目审查",
      "讨论与投票",
      "会议总结"
    ],
    createdAt: "2025-02-01",
    updatedAt: "2025-02-15"
  },
  {
    id: "2",
    meetingId: "MTG-2025-002",
    title: "动物实验伦理跟踪审查会议",
    description: "对进行中的动物实验项目进行跟踪审查",
    meetingType: "跟踪审查会议",
    date: "2025-03-15",
    time: "14:00",
    duration: "2小时",
    venue: "会议室A",
    organizer: {
      id: "u2",
      name: "李四",
      avatar: "/avatars/02.png",
      department: "动物实验伦理委员会",
      title: "副主任委员"
    },
    status: "未开始",
    reviewType: "跟踪审查",
    committee: "动物实验伦理委员会",
    attendeeCount: 12,
    quickReviewCount: 1,
    meetingReviewCount: 2,
    // 项目限制相关
    limitProjectCount: false,
    quickReviewLimit: 0,
    meetingReviewLimit: 0,
    projects: [
      "实验动物福利监督检查",
      "动物实验方案修改审查",
      "实验动物使用情况报告"
    ],
    agenda: [
      "项目进展汇报",
      "问题讨论",
      "改进建议",
      "下次审查安排"
    ],
    createdAt: "2025-02-15",
    updatedAt: "2025-03-01"
  },
  {
    id: "3",
    meetingId: "MTG-2025-003",
    title: "紧急快速审查会议",
    description: "处理紧急研究项目的快速审查申请",
    meetingType: "快速审查会议",
    date: "2025-04-01",
    time: "10:30",
    duration: "1.5小时",
    venue: "线上会议",
    organizer: {
      id: "u3",
      name: "王五",
      avatar: "/avatars/03.png",
      department: "生物安全委员会",
      title: "委员"
    },
    status: "未开始",
    reviewType: "快速审查",
    committee: "生物安全委员会",
    attendeeCount: 8,
    quickReviewCount: 3,
    meetingReviewCount: 1,
    // 项目限制相关
    limitProjectCount: true,
    quickReviewLimit: 5,
    meetingReviewLimit: 8,
    projects: [
      "COVID-19疫苗效力研究",
      "病毒载体安全性评估"
    ],
    agenda: [
      "紧急项目介绍",
      "风险评估",
      "快速决策",
      "后续监管"
    ],
    createdAt: "2025-03-15",
    updatedAt: "2025-03-20"
  },
  {
    id: "4",
    meetingId: "MTG-2025-004",
    title: "人体研究伦理审查会议",
    description: "审查涉及人体研究的项目申请",
    meetingType: "初始审查会议",
    date: "2025-04-15",
    time: "09:00",
    duration: "2.5小时",
    venue: "学术报告厅",
    organizer: {
      id: "u4",
      name: "赵六",
      avatar: "/avatars/04.png",
      department: "医学伦理委员会",
      title: "秘书长"
    },
    status: "未开始",
    reviewType: "初始审查",
    committee: "医学伦理委员会",
    attendeeCount: 18,
    quickReviewCount: 1,
    meetingReviewCount: 4,
    // 项目限制相关
    limitProjectCount: true,
    quickReviewLimit: 12,
    meetingReviewLimit: 20,
    projects: [
      "临床试验知情同意书审查",
      "脆弱群体保护措施评估",
      "数据隐私保护方案审查"
    ],
    agenda: [
      "项目背景介绍",
      "伦理风险评估",
      "保护措施讨论",
      "审查结论"
    ],
    createdAt: "2025-03-15",
    updatedAt: "2025-04-01"
  },
  {
    id: "5",
    meetingId: "MTG-2025-005",
    title: "基因编辑技术专项审查会议",
    description: "专门审查基因编辑相关研究项目",
    meetingType: "快速审查会议",
    date: "2025-05-01",
    time: "15:00",
    duration: "2小时",
    venue: "会议室A",
    organizer: {
      id: "u1",
      name: "张三",
      avatar: "/avatars/01.png",
      department: "生物安全委员会",
      title: "主任委员"
    },
    status: "未开始",
    reviewType: "快速审查",
    committee: "生物安全委员会",
    attendeeCount: 10,
    quickReviewCount: 2,
    meetingReviewCount: 0,
    // 项目限制相关
    limitProjectCount: false,
    quickReviewLimit: 0,
    meetingReviewLimit: 0,
    projects: [
      "CRISPR技术在作物改良中的应用",
      "基因治疗载体安全性研究"
    ],
    agenda: [
      "技术背景介绍",
      "安全性评估",
      "监管要求讨论",
      "审查决定"
    ],
    createdAt: "2025-04-01",
    updatedAt: "2025-04-15"
  },
  {
    id: "6",
    meetingId: "MTG-2025-006",
    title: "多中心研究协调会议",
    description: "协调多个研究中心的伦理审查标准",
    meetingType: "跟踪审查会议",
    date: "2025-05-15",
    time: "10:00",
    duration: "3小时",
    venue: "线上会议",
    organizer: {
      id: "u2",
      name: "李四",
      avatar: "/avatars/02.png",
      department: "医学伦理委员会",
      title: "副主任委员"
    },
    status: "未开始",
    reviewType: "跟踪审查",
    committee: "医学伦理委员会",
    attendeeCount: 25,
    quickReviewCount: 0,
    meetingReviewCount: 6,
    // 项目限制相关
    limitProjectCount: true,
    quickReviewLimit: 8,
    meetingReviewLimit: 12,
    projects: [
      "多中心临床试验统一标准",
      "数据共享协议审查",
      "质量控制措施讨论"
    ],
    agenda: [
      "各中心情况汇报",
      "标准化讨论",
      "协调机制建立",
      "后续工作安排"
    ],
    createdAt: "2025-04-15",
    updatedAt: "2025-05-01"
  },
  {
    id: "7",
    meetingId: "MTG-2025-007",
    title: "研究伦理培训会议",
    description: "开展研究伦理相关培训和案例分析",
    meetingType: "培训会议",
    date: "2025-06-01",
    time: "09:00",
    duration: "4小时",
    venue: "学术报告厅",
    organizer: {
      id: "u5",
      name: "钱七",
      avatar: "/avatars/05.png",
      department: "医学伦理委员会",
      title: "委员"
    },
    status: "未开始",
    reviewType: "培训",
    committee: "医学伦理委员会",
    attendeeCount: 30,
    quickReviewCount: 0,
    meetingReviewCount: 0,
    // 项目限制相关
    limitProjectCount: false,
    quickReviewLimit: 0,
    meetingReviewLimit: 0,
    projects: [
      "研究伦理基本原则培训",
      "典型案例分析",
      "伦理审查流程介绍"
    ],
    agenda: [
      "伦理原则讲解",
      "案例分析讨论",
      "实操演练",
      "总结交流"
    ],
    createdAt: "2025-05-01",
    updatedAt: "2025-05-15"
  },
  {
    id: "8",
    meetingId: "MTG-2025-008",
    title: "年中总结会议",
    description: "总结上半年伦理审查工作，规划下半年工作重点",
    meetingType: "总结会议",
    date: "2025-06-15",
    time: "14:00",
    duration: "3小时",
    venue: "会议室B",
    organizer: {
      id: "u1",
      name: "张三",
      avatar: "/avatars/01.png",
      department: "医学伦理委员会",
      title: "主任委员"
    },
    status: "未开始",
    reviewType: "总结",
    committee: "医学伦理委员会",
    attendeeCount: 20,
    quickReviewCount: 0,
    meetingReviewCount: 0,
    // 项目限制相关
    limitProjectCount: false,
    quickReviewLimit: 0,
    meetingReviewLimit: 0,
    projects: [
      "上半年工作总结",
      "问题分析与改进",
      "下半年工作计划"
    ],
    agenda: [
      "工作汇报",
      "问题讨论",
      "计划制定",
      "任务分工"
    ],
    createdAt: "2025-05-15",
    updatedAt: "2025-06-01"
  },
  {
    id: "9",
    meetingId: "MTG-2025-009",
    title: "特殊项目审查会议",
    description: "审查涉及特殊人群或敏感问题的研究项目",
    meetingType: "特殊审查会议",
    date: "2025-07-01",
    time: "10:00",
    duration: "2.5小时",
    venue: "会议室A",
    organizer: {
      id: "u4",
      name: "赵六",
      avatar: "/avatars/04.png",
      department: "医学伦理委员会",
      title: "秘书长"
    },
    status: "未开始",
    reviewType: "特殊审查",
    committee: "医学伦理委员会",
    attendeeCount: 15,
    quickReviewCount: 0,
    meetingReviewCount: 3,
    // 项目限制相关
    limitProjectCount: true,
    quickReviewLimit: 6,
    meetingReviewLimit: 10,
    projects: [
      "儿童医学研究伦理审查",
      "精神疾病患者研究保护措施",
      "少数民族人群研究特殊考虑"
    ],
    agenda: [
      "特殊保护要求说明",
      "项目审查",
      "专家咨询",
      "决议形成"
    ],
    createdAt: "2025-06-01",
    updatedAt: "2025-06-15"
  },
  {
    id: "10",
    meetingId: "MTG-2025-010",
    title: "伦理审查规范修订会议",
    description: "讨论并修订伦理审查相关规范和流程",
    meetingType: "规范制定会议",
    date: "2025-07-15",
    time: "14:00",
    duration: "3小时",
    venue: "会议室B",
    organizer: {
      id: "u2",
      name: "李四",
      avatar: "/avatars/02.png",
      department: "医学伦理委员会",
      title: "副主任委员"
    },
    status: "未开始",
    reviewType: "规范制定",
    committee: "医学伦理委员会",
    attendeeCount: 18,
    quickReviewCount: 0,
    meetingReviewCount: 0,
    // 项目限制相关
    limitProjectCount: false,
    quickReviewLimit: 0,
    meetingReviewLimit: 0,
    projects: [
      "审查流程优化建议",
      "规范文件修订",
      "新增审查要求讨论"
    ],
    agenda: [
      "现行规范回顾",
      "问题分析",
      "修订讨论",
      "文件定稿"
    ],
    createdAt: "2025-06-15",
    updatedAt: "2025-07-01"
  }
];

// 会议类型选项
export const MEETING_TYPES = [
  { value: "初始审查会议", label: "初始审查会议" },
  { value: "跟踪审查会议", label: "跟踪审查会议" },
  { value: "快速审查会议", label: "快速审查会议" },
  { value: "年度审查会议", label: "年度审查会议" }
]

// 会议状态选项
export const MEETING_STATUSES = [
  { value: "草稿", label: "草稿" },
  { value: "待发布", label: "待发布" },
  { value: "已发布", label: "已发布" },
  { value: "进行中", label: "进行中" },
  { value: "已完成", label: "已完成" },
  { value: "已取消", label: "已取消" }
]

// 会议场地选项
export const MEETING_VENUES = [
  { value: "学术报告厅", label: "学术报告厅" },
  { value: "会议室A", label: "会议室A" },
  { value: "会议室B", label: "会议室B" },
  { value: "线上会议", label: "线上会议" }
]

// 审查类型选项
export const REVIEW_TYPES = [
  { value: "初始审查", label: "初始审查" },
  { value: "跟踪审查", label: "跟踪审查" },
  { value: "快速审查", label: "快速审查" },
  { value: "年度审查", label: "年度审查" }
]

// 伦理委员会选项
export const COMMITTEES = [
  { value: "医学伦理委员会", label: "医学伦理委员会" },
  { value: "动物实验伦理委员会", label: "动物实验伦理委员会" },
  { value: "生物安全委员会", label: "生物安全委员会" }
] 