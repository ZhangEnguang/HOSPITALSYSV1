// 受理号格式规则说明：ETH-两位字母-年份-三位流水号
// ETH-HC-YYYY-NNN  - 人遗采集审批 (Human Collection)
// ETH-HP-YYYY-NNN  - 人遗保藏审批 (Human Preservation)
// ETH-IC-YYYY-NNN  - 国际合作科学研究审批 (International Cooperation)
// ETH-EX-YYYY-NNN  - 材料出境审批 (Export)
// ETH-CT-YYYY-NNN  - 国际合作临床试验备案 (Clinical Trial)
// ETH-OP-YYYY-NNN  - 对外提供或开放使用备案 (Open Provision)
// ETH-FR-YYYY-NNN  - 重要遗传家系和特定地区人遗资源 (Family Resource)

// 本地用户数据
const localUsers = [
  {
    id: "u1",
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "/avatars/01.png",
    department: "遗传学研究所",
    title: "教授",
  },
  {
    id: "u2",
    name: "李四",
    email: "lisi@example.com",
    avatar: "/avatars/02.png",
    department: "基因组学中心",
    title: "副教授",
  },
  {
    id: "u3",
    name: "王五",
    email: "wangwu@example.com",
    avatar: "/avatars/03.png",
    department: "临床遗传科",
    title: "主任医师",
  },
  {
    id: "u4",
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: "/avatars/04.png",
    department: "生物信息学院",
    title: "研究员",
  },
  {
    id: "u5",
    name: "钱七",
    email: "qianqi@example.com",
    avatar: "/avatars/05.png",
    department: "遗传咨询科",
    title: "遗传咨询师",
  },
]

// 使用本地用户数据
const activeUsers = localUsers

// 研究类型选项
export const RESEARCH_TYPE_OPTIONS = [
  { value: "genetic", label: "遗传学研究" },
  { value: "genomic", label: "基因组学研究" },
  { value: "diagnostic", label: "诊断性测序" },
  { value: "screening", label: "遗传病筛查" },
  { value: "counseling", label: "遗传咨询研究" },
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

// 审查类型选项
export const APPROVAL_TYPE_OPTIONS = [
  { value: "collection", label: "人遗采集审批" },
  { value: "preservation", label: "人遗保藏审批" },
  { value: "international", label: "国际合作科研审批" },
  { value: "export", label: "材料出境审批" },
  { value: "clinicalTrial", label: "国际合作临床试验" },
  { value: "providing", label: "对外提供使用备案" },
  { value: "family", label: "重要家系资源备案" },
]

// 创建人遗资源数据
export const humanGeneticsReviewItems = [
  {
    id: "ETH-HG-2024-001",
    projectId: "ETH-HC-2024-001", // 人遗采集审批
    reviewType: "遗传学研究",
    approvalType: "人遗采集审批",
    name: "中国汉族人群BRCA1/2基因致病变异筛查",
    description: "针对中国汉族女性人群进行BRCA1/2基因致病变异筛查，评估乳腺癌和卵巢癌的遗传风险",
    projectType: "人遗",
    department: "遗传学研究所",
    ethicsCommittee: "人类遗传学伦理委员会",
    status: "形审通过",
    reviewMethod: "快速审查",
    priority: "高",
    projectLeader: activeUsers[0],
    completion: 100,
    dueDate: "2024-03-15",
    actualDate: "2024-03-10",
    comments: 2,
    reviewResult: "通过",
    approvalStatus: "已通过",
    geneticMaterial: "血液样本",
    sampleSize: 2000,
    geneticTest: "全外显子组测序",
    dataProtection: "符合GDPR与中国遗传资源管理规定",
  },
  {
    id: "ETH-HG-2024-002",
    projectId: "ETH-HP-2024-001", // 人遗保藏审批
    reviewType: "诊断性测序",
    approvalType: "人遗保藏审批",
    name: "单基因遗传病快速诊断测序技术评估",
    description: "评估快速全外显子组测序技术在罕见单基因遗传病诊断中的准确性和临床应用价值",
    projectType: "人遗",
    department: "基因组学中心",
    ethicsCommittee: "人类遗传学伦理委员会",
    status: "已提交",
    reviewMethod: "待定",
    priority: "高",
    projectLeader: activeUsers[1],
    completion: 60,
    dueDate: "2024-05-20",
    actualDate: null,
    comments: 5,
    reviewResult: "待定",
    approvalStatus: "进行中",
    geneticMaterial: "血液、口腔拭子",
    sampleSize: 100,
    geneticTest: "全外显子组测序、靶向基因panel测序",
    dataProtection: "符合临床遗传信息保护规范",
  },
  {
    id: "ETH-HG-2024-003",
    projectId: "ETH-IC-2024-001", // 国际合作科学研究审批
    reviewType: "遗传咨询研究",
    approvalType: "国际合作科研审批",
    name: "遗传性肿瘤高风险家系咨询模式研究",
    description: "研究针对遗传性肿瘤高风险家系的遗传咨询模式，评估心理干预效果",
    projectType: "人遗",
    department: "遗传咨询科",
    ethicsCommittee: "人类遗传学伦理委员会",
    status: "已提交",
    reviewMethod: "待定",
    priority: "中",
    projectLeader: activeUsers[4],
    completion: 30,
    dueDate: "2024-06-15",
    actualDate: null,
    comments: 2,
    reviewResult: "待定",
    approvalStatus: "待审核",
    geneticMaterial: "问卷数据、家系图",
    sampleSize: 50,
    geneticTest: "无实验室测试",
    dataProtection: "符合医学伦理与心理健康数据保护规范",
  },
  {
    id: "ETH-HG-2024-004",
    projectId: "ETH-EX-2024-001", // 材料出境审批
    reviewType: "基因组学研究",
    approvalType: "材料出境审批",
    name: "中国人群基因组变异数据库构建",
    description: "构建中国人群基因组变异数据库，为遗传病诊断和个体化医疗提供参考数据",
    projectType: "人遗",
    department: "生物信息学院",
    ethicsCommittee: "人类遗传学伦理委员会",
    status: "形审退回",
    reviewMethod: "待定",
    priority: "高",
    projectLeader: activeUsers[3],
    completion: 70,
    dueDate: "2024-04-25",
    actualDate: null,
    comments: 7,
    reviewResult: "修改后通过",
    approvalStatus: "进行中",
    geneticMaterial: "全基因组数据",
    sampleSize: 10000,
    geneticTest: "全基因组测序",
    dataProtection: "符合国家人类遗传资源管理条例，数据库访问受限",
  },
  {
    id: "ETH-HG-2024-005",
    projectId: "ETH-CT-2024-001", // 国际合作临床试验备案
    reviewType: "遗传病筛查",
    approvalType: "国际合作临床试验",
    name: "新生儿遗传代谢病筛查方案评估",
    description: "评估扩展性新生儿遗传代谢病筛查方案的可行性和临床价值",
    projectType: "人遗",
    department: "临床遗传科",
    ethicsCommittee: "人类遗传学伦理委员会",
    status: "形审通过",
    reviewMethod: "会议审查",
    priority: "中",
    projectLeader: activeUsers[2],
    completion: 100,
    dueDate: "2024-03-30",
    actualDate: "2024-03-25",
    comments: 3,
    reviewResult: "通过",
    approvalStatus: "已通过",
    geneticMaterial: "滤纸血片",
    sampleSize: 5000,
    geneticTest: "质谱分析、基因检测",
    dataProtection: "符合新生儿筛查数据保护规范",
  },
  {
    id: "ETH-HG-2024-006",
    projectId: "ETH-OP-2024-001", // 对外提供或开放使用备案
    reviewType: "遗传学研究",
    approvalType: "对外提供使用备案",
    name: "帕金森病相关基因变异功能验证",
    description: "对帕金森病相关基因变异进行功能验证和致病性评估",
    projectType: "人遗",
    department: "遗传学研究所",
    ethicsCommittee: "人类遗传学伦理委员会",
    status: "形审退回",
    reviewMethod: "待定",
    priority: "中",
    projectLeader: activeUsers[0],
    completion: 100,
    dueDate: "2024-02-28",
    actualDate: "2024-02-25",
    comments: 5,
    reviewResult: "不通过",
    approvalStatus: "已驳回",
    geneticMaterial: "口腔拭子、外周血",
    sampleSize: 200,
    geneticTest: "靶向基因测序、功能验证实验",
    dataProtection: "数据保护措施不完善，需重新制定",
  },
  {
    id: "ETH-HG-2024-007",
    projectId: "ETH-FR-2024-001", // 重要遗传家系和特定地区人遗资源
    reviewType: "诊断性测序",
    approvalType: "重要家系资源备案",
    name: "罕见遗传病无创产前诊断研究",
    description: "研究无创产前诊断技术在罕见单基因遗传病诊断中的应用",
    projectType: "人遗",
    department: "基因组学中心",
    ethicsCommittee: "人类遗传学伦理委员会",
    status: "已提交",
    reviewMethod: "待定",
    priority: "高",
    projectLeader: activeUsers[1],
    completion: 20,
    dueDate: "2024-07-15",
    actualDate: null,
    comments: 2,
    reviewResult: "待定",
    approvalStatus: "待审核",
    geneticMaterial: "母体外周血",
    sampleSize: 300,
    geneticTest: "无创产前检测技术",
    dataProtection: "符合产前诊断数据特殊保护规范",
  },
  {
    id: "ETH-HG-2024-008",
    projectId: "ETH-OP-2024-002", // 对外提供或开放使用备案
    reviewType: "基因组学研究",
    approvalType: "人遗采集审批",
    name: "肿瘤液体活检基因谱分析",
    description: "基于循环肿瘤DNA的液体活检基因谱分析技术评估",
    projectType: "人遗",
    department: "基因组学中心",
    ethicsCommittee: "人类遗传学伦理委员会",
    status: "已提交",
    reviewMethod: "待定",
    priority: "中",
    projectLeader: activeUsers[1],
    completion: 50,
    dueDate: "2024-06-20",
    actualDate: null,
    comments: 4,
    reviewResult: "待定",
    approvalStatus: "进行中",
    geneticMaterial: "外周血、血浆",
    sampleSize: 150,
    geneticTest: "靶向基因测序、液体活检技术",
    dataProtection: "符合肿瘤患者遗传信息特殊保护规范",
  }
] 