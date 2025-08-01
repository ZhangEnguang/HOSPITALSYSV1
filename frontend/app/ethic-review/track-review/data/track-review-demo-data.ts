// 受理号格式规则说明：ETH-两位字母-年份-三位流水号
// ETH-AM-YYYY-NNN  - 修正案审查 (Amendment)
// ETH-PE-YYYY-NNN  - 年度/定期审查 (Periodical)
// ETH-SA-YYYY-NNN  - 安全性审查 (Safety)
// ETH-DE-YYYY-NNN  - 偏离方案报告 (Deviation)
// ETH-TE-YYYY-NNN  - 暂停/终止研究报告 (Termination)
// ETH-CO-YYYY-NNN  - 研究完成报告 (Completion)
// ETH-RE-YYYY-NNN  - 复审 (Review)

// 本地用户数据
const localUsers = [
  {
    id: "u1",
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "/avatars/01.png",
    department: "神经科学研究院",
    title: "教授",
  },
  {
    id: "u2",
    name: "李四",
    email: "lisi@example.com",
    avatar: "/avatars/02.png",
    department: "肿瘤医学中心",
    title: "副教授",
  },
  {
    id: "u3",
    name: "王五",
    email: "wangwu@example.com",
    avatar: "/avatars/03.png",
    department: "运动医学科学院",
    title: "讲师",
  },
  {
    id: "u4",
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: "/avatars/04.png",
    department: "药学院",
    title: "研究员",
  },
  {
    id: "u5",
    name: "钱七",
    email: "qianqi@example.com",
    avatar: "/avatars/05.png",
    department: "肿瘤医学中心",
    title: "主任医师",
  },
]

// 使用本地用户数据
const activeUsers = localUsers

// 审查类型选项
export const REVIEW_TYPE_OPTIONS = [
  { value: "amendment", label: "修正案审查" },
  { value: "periodical", label: "年度/定期审查" },
  { value: "safety", label: "安全性审查" },
  { value: "deviation", label: "偏离方案报告" },
  { value: "suspension", label: "暂停/终止研究报告" },
  { value: "completion", label: "研究完成报告" },
  { value: "review", label: "复审" }
]

// 审查状态
export const REVIEW_STATUSES = [
  "已提交",
  "形审通过",
  "形审退回"
]

// 审查结果
export const REVIEW_RESULTS = [
  "通过",
  "修改后通过",
  "不通过",
  "暂缓通过",
  "待定"
]

// 审批状态
export const APPROVAL_STATUSES = [
  "待审核",
  "进行中",
  "已通过",
  "已驳回",
  "已撤回"
]

// 创建跟踪报告数据
export const trackReviewItems = [
  {
    id: "ETH-TRK-2024-001",
    projectId: "ETH-AM-2024-001", // 修正案审查
    reviewType: "修正案审查",
    name: "人体细胞治疗方案修正评估",
    description: "审查治疗方案修改内容的合理性和伦理合规性",
    department: "免疫学科研中心",
    ethicsCommittee: "医学伦理委员会",
    projectType: "人体",
    participantCount: "45人",
    status: "形审通过",
    reviewMethod: "快速审查",
    priority: "高",
    projectLeader: activeUsers[0],
    completion: 100,
    dueDate: "2024-04-15",
    actualDate: "2024-04-10",
    comments: 2,
    reviewResult: "通过",
    approvalStatus: "已通过",
    initialReviewId: "ETH-AM-2024-001",
    amendmentType: "治疗方案修改",
  },
  {
    id: "ETH-TRK-2024-002",
    projectId: "ETH-SA-2024-001", // 安全性审查
    reviewType: "安全性审查",
    name: "新型靶向生物药物临床试验不良反应报告",
    description: "对临床试验中出现的严重不良反应进行审查评估，并制定相应干预措施",
    department: "肿瘤医学中心",
    ethicsCommittee: "医学伦理委员会",
    projectType: "人体",
    participantCount: "120人",
    status: "已提交",
    reviewMethod: "待定",
    priority: "高",
    projectLeader: activeUsers[1],
    completion: 60,
    dueDate: "2024-05-10",
    actualDate: null,
    comments: 5,
    reviewResult: "待定",
    approvalStatus: "待审核",
    initialReviewId: "ETH-SA-2024-001",
    incidentDate: "2024-04-28",
    incidentSeverity: "中度",
  },
  {
    id: "ETH-TRK-2024-003",
    projectId: "ETH-PE-2024-001", // 年度/定期审查
    reviewType: "年度/定期审查",
    name: "高血压患者运动干预效果年度评估",
    description: "对研究项目进行年度评估，审查研究进展情况和是否符合伦理要求",
    department: "运动医学科学院",
    ethicsCommittee: "医学伦理委员会",
    projectType: "人体",
    participantCount: "150人",
    status: "已提交",
    reviewMethod: "待定",
    priority: "中",
    projectLeader: activeUsers[2],
    completion: 30,
    dueDate: "2024-05-20",
    actualDate: null,
    comments: 0,
    reviewResult: "待定",
    approvalStatus: "待审核",
    initialReviewId: "ETH-PE-2024-001",
    reviewPeriod: "一年",
    participantsEnrolled: 86,
  },
  {
    id: "ETH-TRK-2024-004",
    projectId: "ETH-DE-2024-001", // 偏离方案报告
    reviewType: "偏离方案报告",
    name: "脑卒中康复治疗方案偏离报告",
    description: "报告临床研究中偏离原方案的情况及原因，评估对受试者的影响",
    department: "神经内科学系",
    ethicsCommittee: "医学伦理委员会",
    projectType: "人体",
    participantCount: "80人",
    status: "形审通过",
    reviewMethod: "会议审查",
    priority: "高",
    projectLeader: {
      id: "u6",
      name: "孙七",
      email: "sunqi@example.com",
      avatar: "/avatars/06.png",
      department: "神经内科学系",
      title: "副主任医师",
    },
    completion: 100,
    dueDate: "2024-03-25",
    actualDate: "2024-03-22",
    comments: 3,
    reviewResult: "通过",
    approvalStatus: "已通过",
    initialReviewId: "ETH-DE-2024-001",
    deviationType: "给药时间调整",
    affectedParticipants: 5,
  },
  {
    id: "ETH-TRK-2024-005",
    projectId: "ETH-TE-2024-001", // 暂停/终止研究报告
    reviewType: "暂停/终止研究报告",
    name: "认知行为疗法研究终止申请",
    description: "由于招募困难，申请终止研究项目并汇报相关情况",
    department: "心理学院",
    ethicsCommittee: "医学伦理委员会",
    projectType: "人体",
    participantCount: "60人",
    status: "形审通过",
    reviewMethod: "快速审查",
    priority: "中",
    projectLeader: {
      id: "u7",
      name: "周八",
      email: "zhouba@example.com",
      avatar: "/avatars/07.png",
      department: "心理学院",
      title: "副教授",
    },
    completion: 100,
    dueDate: "2024-03-30",
    actualDate: "2024-03-28",
    comments: 4,
    reviewResult: "通过",
    approvalStatus: "已通过",
    initialReviewId: "ETH-TE-2024-001",
    suspensionReason: "招募困难",
  },
  {
    id: "ETH-TRK-2024-006",
    projectId: "ETH-CO-2024-001", // 研究完成报告
    reviewType: "研究完成报告",
    name: "人类代谢相关药物临床研究完成报告",
    description: "对已完成的临床研究结果和过程进行最终审查",
    department: "临床药理学研究中心",
    ethicsCommittee: "医学伦理委员会",
    projectType: "人体",
    participantCount: "200人",
    status: "形审退回",
    reviewMethod: "待定",
    priority: "低",
    projectLeader: activeUsers[3],
    completion: 100,
    dueDate: "2024-04-05",
    actualDate: "2024-04-02",
    comments: 6,
    reviewResult: "不通过",
    approvalStatus: "已驳回",
    initialReviewId: "ETH-CO-2024-001",
    completionStatus: "部分完成",
  },
  {
    id: "ETH-TRK-2024-007",
    projectId: "ETH-RE-2024-001", // 复审
    reviewType: "复审",
    name: "免疫治疗安全性评估方案复审",
    description: "对之前已审查研究方案中未明确部分进行再次审查",
    department: "肿瘤医学中心",
    ethicsCommittee: "医学伦理委员会",
    projectType: "人体",
    participantCount: "80人",
    status: "已提交",
    reviewMethod: "待定",
    priority: "高",
    projectLeader: activeUsers[4],
    completion: 20,
    dueDate: "2024-05-15",
    actualDate: null,
    comments: 2,
    reviewResult: "待定",
    approvalStatus: "待审核",
    initialReviewId: "ETH-RE-2024-001",
    reviewReason: "方案不完整",
  },
  {
    id: "ETH-TRK-2024-008",
    projectId: "ETH-AM-2024-002", // 修正案审查
    reviewType: "修正案审查",
    name: "人体细胞治疗受试者标准修正",
    description: "审查受试者入选标准修改的合理性和伦理合规性",
    department: "免疫学科研中心",
    ethicsCommittee: "医学伦理委员会",
    projectType: "人体",
    participantCount: "45人",
    status: "已提交",
    reviewMethod: "待定",
    priority: "中",
    projectLeader: activeUsers[0],
    completion: 50,
    dueDate: "2024-05-25",
    actualDate: null,
    comments: 3,
    reviewResult: "待定",
    approvalStatus: "待审核",
    initialReviewId: "ETH-AM-2024-002",
    amendmentType: "受试者标准修改",
  }
] 