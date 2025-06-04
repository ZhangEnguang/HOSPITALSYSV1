// 移除外部导入，使用本地用户数据
// import { users } from "@/app/progress/config/progress-config"

// 受理号格式规则说明：ETH-两位字母-年份-三位流水号
// ETH-IN-YYYY-NNN  - 初始审查 (Initial)
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
  { value: "initial", label: "初始审查" },
  { value: "review", label: "复审" },
]

// 创建初始审查数据
export const initialReviewItems = [
  {
    id: "1",
    projectId: "ETH-IN-2024-001", // 初始审查
    reviewType: "初始审查",
    name: "转基因小鼠模型在神经退行性疾病中的应用",
    description: "审查项目研究方案、研究计划和预期目标，评估项目可行性",
    projectType: "动物",
    department: "神经科学研究院",
    ethicsCommittee: "动物实验伦理委员会",
    status: "形审通过",
    priority: "高",
    projectLeader: activeUsers[0],
    completion: 100,
    dueDate: "2024-01-20",
    actualDate: "2024-01-15",
    comments: 3,
    reviewResult: "通过",
    approvalStatus: "已通过",
  },
  {
    id: "2",
    projectId: "ETH-RE-2024-001", // 复审
    reviewType: "复审",
    name: "新型靶向生物药物在晚期肿瘤患者中的临床试验",
    description: "审查项目伦理问题、实验风险和安全措施，确保符合伦理规范",
    projectType: "人体",
    department: "肿瘤医学中心",
    ethicsCommittee: "医学伦理委员会",
    status: "已提交",
    priority: "高",
    projectLeader: activeUsers[1],
    completion: 40,
    dueDate: "2024-03-10",
    actualDate: null,
    comments: 2,
    reviewResult: "待定",
    approvalStatus: "待审核",
  },
  {
    id: "3",
    projectId: "ETH-IN-2024-002", // 初始审查
    reviewType: "初始审查",
    name: "高血压患者运动干预效果及安全性评估",
    description: "评估项目立项必要性、研究内容创新性和预期成果价值",
    projectType: "人体",
    department: "运动医学科学院",
    ethicsCommittee: "医学伦理委员会",
    status: "已提交",
    priority: "中",
    projectLeader: activeUsers[2],
    completion: 60,
    dueDate: "2024-02-25",
    actualDate: null,
    comments: 4,
    reviewResult: "修改后通过",
    approvalStatus: "进行中",
  },
  {
    id: "4",
    projectId: "ETH-RE-2024-002", // 复审
    reviewType: "复审",
    name: "啮齿类动物模型在药物代谢研究中的应用",
    description: "审查项目预算合理性、资金使用计划和经费管理措施",
    projectType: "动物",
    department: "药学院",
    ethicsCommittee: "动物实验伦理委员会",
    status: "形审退回",
    priority: "低",
    projectLeader: activeUsers[3],
    completion: 100,
    dueDate: "2024-01-30",
    actualDate: "2024-01-28",
    comments: 5,
    reviewResult: "不通过",
    approvalStatus: "已驳回",
  },
  {
    id: "5",
    projectId: "ETH-IN-2024-003", // 初始审查
    reviewType: "初始审查",
    name: "免疫治疗对不同年龄段肿瘤患者生活质量影响",
    description: "检查项目知识产权状况、成果转化可行性和产权保护措施",
    projectType: "人体",
    department: "肿瘤医学中心",
    ethicsCommittee: "医学伦理委员会",
    status: "已提交",
    priority: "中",
    projectLeader: activeUsers[4],
    completion: 20,
    dueDate: "2024-04-15",
    actualDate: null,
    comments: 1,
    reviewResult: "待提交",
    approvalStatus: "待提交",
  },
  {
    id: "6",
    projectId: "ETH-IN-2024-004", // 初始审查
    reviewType: "初始审查",
    name: "非人灵长类动物在神经递质调控研究中的应用",
    description: "评估基于动物模型的肿瘤微环境研究的伦理合规性及实验设计安全性",
    projectType: "动物",
    department: "神经科学研究院",
    ethicsCommittee: "动物实验伦理委员会",
    status: "形审通过",
    priority: "高",
    projectLeader: {
      id: "u6",
      name: "孙七",
      email: "sunqi@example.com",
      avatar: "/avatars/06.png",
      department: "神经科学研究院",
      title: "教授",
    },
    completion: 100,
    dueDate: "2024-02-10",
    actualDate: "2024-02-05",
    comments: 2,
    reviewResult: "通过",
    approvalStatus: "已通过",
  },
  {
    id: "7",
    projectId: "ETH-RE-2024-003", // 复审
    reviewType: "复审",
    name: "针对重度抑郁症患者的认知行为疗法有效性研究",
    description: "评估心理干预方案在人体实验中的伦理问题和隐私保护措施",
    projectType: "人体",
    department: "心理学院",
    ethicsCommittee: "医学伦理委员会",
    status: "已提交",
    priority: "中",
    projectLeader: {
      id: "u7",
      name: "周八",
      email: "zhouba@example.com",
      avatar: "/avatars/07.png",
      department: "心理学院",
      title: "副教授",
    },
    completion: 70,
    dueDate: "2024-03-25",
    actualDate: null,
    comments: 3,
    reviewResult: "修改后通过",
    approvalStatus: "进行中",
  },
  {
    id: "8",
    projectId: "ETH-IN-2024-005", // 初始审查
    reviewType: "初始审查",
    name: "转基因猪模型在器官移植安全性评估中的应用",
    description: "审查基因编辑农作物研究的伦理问题和生物安全风险评估",
    projectType: "动物",
    department: "器官移植研究中心",
    ethicsCommittee: "生物安全委员会",
    status: "已提交",
    priority: "高",
    projectLeader: {
      id: "u8",
      name: "吴九",
      email: "wujiu@example.com",
      avatar: "/avatars/08.png",
      department: "器官移植研究中心",
      title: "教授",
    },
    completion: 30,
    dueDate: "2024-04-05",
    actualDate: null,
    comments: 1,
    reviewResult: "待定",
    approvalStatus: "待审核",
  },
]

// 项目类型选项
export const PROJECT_TYPES = [
  { value: "animal", label: "动物" },
  { value: "human", label: "人体" },
]

// 伦理委员会选项
export const ETHICS_COMMITTEES = [
  { value: "medical", label: "医学伦理委员会" },
  { value: "animal", label: "动物实验伦理委员会" },
  { value: "biosafety", label: "生物安全委员会" },
]

// 审查结果状态
export const REVIEW_RESULTS = [
  { value: "pass", label: "通过" },
  { value: "revise", label: "修改后通过" },
  { value: "reject", label: "不通过" },
  { value: "pending", label: "待定" },
  { value: "unsubmitted", label: "待提交" },
]

// 审批状态
export const APPROVAL_STATUSES = [
  { value: "approved", label: "已通过" },
  { value: "rejected", label: "已驳回" },
  { value: "pending", label: "待审核" },
  { value: "inProgress", label: "进行中" },
  { value: "unsubmitted", label: "待提交" },
]

// 旧的审查类型选项（保留兼容性）
export const REVIEW_TYPES = [
  { value: "technical", label: "技术可行性" },
  { value: "ethics", label: "伦理审查" },
  { value: "necessity", label: "立项必要性" },
  { value: "budget", label: "预算审查" },
  { value: "intellectual", label: "知识产权" },
  { value: "risk", label: "风险评估" },
  { value: "comprehensive", label: "综合评估" },
] 