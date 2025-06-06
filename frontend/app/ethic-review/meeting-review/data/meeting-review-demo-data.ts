import { users } from "../config/meeting-review-config"

// 受理号格式规则说明：ETH-两位字母-年份-三位流水号
// ETH-IN-YYYY-NNN  - 初始审查 (Initial)
// ETH-AM-YYYY-NNN  - 修正案审查 (Amendment)
// ETH-PE-YYYY-NNN  - 年度/定期审查 (Periodical)
// ETH-SA-YYYY-NNN  - 安全性审查 (Safety)
// ETH-DE-YYYY-NNN  - 偏离方案报告 (Deviation)
// ETH-TE-YYYY-NNN  - 暂停/终止研究报告 (Termination)
// ETH-CO-YYYY-NNN  - 研究完成报告 (Completion)
// ETH-HC-YYYY-NNN  - 人遗采集审批 (Human Collection)
// ETH-HP-YYYY-NNN  - 人遗保藏审批 (Human Preservation)
// ETH-IC-YYYY-NNN  - 国际合作科学研究审批 (International Cooperation)
// ETH-EX-YYYY-NNN  - 材料出境审批 (Export)
// ETH-CT-YYYY-NNN  - 国际合作临床试验备案 (Clinical Trial)
// ETH-OP-YYYY-NNN  - 对外提供或开放使用备案 (Open Provision)
// ETH-FR-YYYY-NNN  - 重要遗传家系和特定地区人遗资源 (Family Resource)
// ETH-RE-YYYY-NNN  - 复审 (Review)

// 审查类型选项
export const REVIEW_TYPE_OPTIONS = [
  "初始审查",
  "修正案审查",
  "年度/定期审查",
  "安全性审查",
  "偏离方案报告",
  "暂停/终止研究报告",
  "研究完成报告",
  "人遗采集审批",
  "人遗保藏审批",
  "国际合作科学研究审批",
  "材料出境审批",
  "国际合作临床试验备案",
  "对外提供或开放使用备案",
  "重要遗传家系和特定地区人遗资源",
  "复审"
]

// 项目类型选项
export const PROJECT_TYPE_OPTIONS = [
  "诊断性测序",
  "数据分析",
  "国际合作",
  "材料出库",
]

// 项目子类型选项（动物/人体）
export const PROJECT_SUB_TYPE_OPTIONS = [
  "动物",
  "人体",
]

// 审查状态
export const REVIEW_STATUSES = [
  "待审查",
  "审查中",
  "通过",
  "驳回",
]

// 审查结果选项
export const REVIEW_RESULT_OPTIONS = [
  "审查通过",
  "必要的修改后同意",
  "不同意",
  "终止或暂停已同意的研究",
]

// 伦理委员会
export const ETHICS_COMMITTEES = [
  "人类遗传学伦理委员会",
  "临床医学伦理委员会",
  "基础医学伦理委员会",
]

// 科室列表
export const DEPARTMENTS = [
  "基因组学中心",
  "临床医学院",
  "基础医学院",
  "生物信息学院",
  "公共卫生学院",
]

// 随机生成的会议审查数据
export const meetingReviewItems = [
  {
    id: "ETH-IN-2024-001",
    acceptanceNumber: "ETH-IN-2024-001",
    name: "罕见遗传病快速基因诊断体系建立",
    reviewType: "初始审查",
    projectType: "诊断性测序",
    projectSubType: "人体",
    projectId: "GEN-2024-MR-001",
    projectLeader: users[0],
    department: DEPARTMENTS[0],
    mainReviewers: [users[2], users[1]],
    ethicsCommittee: ETHICS_COMMITTEES[0],
    status: "通过",
    reviewProgress: 92,
    reviewResult: "审查通过",
    projectStatus: "已立项",
    createdAt: "2024-04-01T08:30:00Z",
    submissionDate: "2024-04-01",
    meetingDate: "2024-04-10",
    description: "建立适用于罕见遗传病的快速基因诊断流程，缩短诊断时间，提高诊断准确率。",
    reviewDate: "2024-04-05",
    reviewComments: "项目符合伦理要求，可以立即实施。",
  },
  {
    id: "ETH-HC-2024-001",
    acceptanceNumber: "ETH-HC-2024-001",
    name: "儿科遗传病紧急测序分析流程",
    reviewType: "人遗采集审批",
    projectType: "诊断性测序",
    projectSubType: "人体",
    projectId: "GEN-2024-MR-002",
    projectLeader: users[1],
    department: DEPARTMENTS[1],
    mainReviewers: [users[3]],
    ethicsCommittee: ETHICS_COMMITTEES[1],
    status: "审查中",
    reviewProgress: 71,
    reviewResult: "",
    projectStatus: "未立项",
    createdAt: "2024-04-05T10:15:00Z",
    submissionDate: "2024-04-05",
    meetingDate: "2024-04-15",
    description: "为重症儿科患者提供紧急基因测序服务，协助临床快速诊断和治疗决策。",
    reviewDate: "2024-04-10",
    reviewComments: "",
  },
  {
    id: "ETH-IN-2024-002",
    acceptanceNumber: "ETH-IN-2024-002",
    name: "实验动物基因编辑模型构建",
    reviewType: "初始审查",
    projectType: "诊断性测序",
    projectSubType: "动物",
    projectId: "GEN-2024-MR-003",
    projectLeader: users[2],
    department: DEPARTMENTS[2],
    mainReviewers: [users[4], users[0]],
    ethicsCommittee: ETHICS_COMMITTEES[2],
    status: "待审查",
    reviewProgress: 0,
    reviewResult: "",
    projectStatus: "未立项",
    createdAt: "2024-04-07T15:40:00Z",
    submissionDate: "2024-04-07",
    meetingDate: "2024-04-20",
    description: "通过CRISPR-Cas9技术构建基因编辑动物模型，用于罕见遗传病机制研究。",
    reviewDate: "",
    reviewComments: "",
  },
  {
    id: "ETH-AM-2024-001",
    acceptanceNumber: "ETH-AM-2024-001",
    name: "遗传咨询样本临床信息采集系统",
    reviewType: "修正案审查",
    projectType: "数据分析",
    projectSubType: "人体",
    projectId: "GEN-2024-MR-004",
    projectLeader: users[3],
    department: DEPARTMENTS[0],
    mainReviewers: [users[0]],
    ethicsCommittee: ETHICS_COMMITTEES[0],
    status: "通过",
    reviewProgress: 90,
    reviewResult: "必要的修改后同意",
    projectStatus: "已立项",
    createdAt: "2024-04-10T09:20:00Z",
    submissionDate: "2024-04-10",
    meetingDate: "2024-04-25",
    description: "为遗传咨询服务提供临床信息采集系统，优化遗传病样本管理和数据分析流程。",
    reviewDate: "2024-04-15",
    reviewComments: "项目满足伦理要求，但需完善知情同意书内容后方可实施。",
  },
  {
    id: "ETH-IC-2024-001",
    acceptanceNumber: "ETH-IC-2024-001",
    name: "国际多中心罕见病基因研究合作协议",
    reviewType: "国际合作科学研究审批",
    projectType: "国际合作",
    projectSubType: "人体",
    projectId: "GEN-2024-MR-005",
    projectLeader: users[4],
    department: DEPARTMENTS[0],
    mainReviewers: [users[1], users[3]],
    ethicsCommittee: ETHICS_COMMITTEES[1],
    status: "驳回",
    reviewProgress: 33,
    reviewResult: "不同意",
    projectStatus: "未立项",
    createdAt: "2024-04-12T14:10:00Z",
    submissionDate: "2024-04-12",
    meetingDate: "2024-04-18",
    description: "与国际多家研究机构合作开展罕见病基因研究，共享数据和研究成果。",
    reviewDate: "2024-04-18",
    reviewComments: "数据共享协议不完善，需要修订后重新提交。",
  },
  {
    id: "ETH-RE-2024-001",
    acceptanceNumber: "ETH-RE-2024-001",
    name: "转基因小鼠繁育计划",
    reviewType: "复审",
    projectType: "数据分析",
    projectSubType: "动物",
    projectId: "GEN-2024-MR-006",
    projectLeader: users[0],
    department: DEPARTMENTS[2],
    mainReviewers: [users[2]],
    ethicsCommittee: ETHICS_COMMITTEES[2],
    status: "审查中",
    reviewProgress: 45,
    reviewResult: "",
    projectStatus: "未立项",
    createdAt: "2024-04-15T11:30:00Z",
    submissionDate: "2024-04-15",
    meetingDate: "2024-05-05",
    description: "建立转基因小鼠繁育体系，为罕见病研究提供稳定的动物模型支持。",
    reviewDate: "2024-04-20",
    reviewComments: "",
  },
  {
    id: "ETH-CO-2024-001",
    acceptanceNumber: "ETH-CO-2024-001",
    name: "家族性遗传病样本收集与保存",
    reviewType: "人遗保藏审批",
    projectType: "诊断性测序",
    projectSubType: "人体",
    projectId: "GEN-2024-MR-007",
    projectLeader: users[1],
    department: DEPARTMENTS[1],
    mainReviewers: [users[3], users[4]],
    ethicsCommittee: ETHICS_COMMITTEES[0],
    status: "通过",
    reviewProgress: 82,
    reviewResult: "审查通过",
    projectStatus: "已立项",
    createdAt: "2024-04-18T09:45:00Z",
    submissionDate: "2024-04-18",
    meetingDate: "2024-04-28",
    description: "收集家族性遗传病患者样本，建立标准化样本库，支持相关疾病研究。",
    reviewDate: "2024-04-22",
    reviewComments: "方案合理可行，符合伦理要求。",
  },
  {
    id: "ETH-DE-2024-001",
    acceptanceNumber: "ETH-DE-2024-001",
    name: "实验动物行为学研究模型",
    reviewType: "初始审查",
    projectType: "数据分析",
    projectSubType: "动物",
    projectId: "GEN-2024-MR-008",
    projectLeader: users[2],
    department: DEPARTMENTS[2],
    mainReviewers: [users[4], users[1]],
    ethicsCommittee: ETHICS_COMMITTEES[1],
    status: "待审查",
    reviewProgress: 0,
    reviewResult: "",
    projectStatus: "未立项",
    createdAt: "2024-04-20T16:20:00Z",
    submissionDate: "2024-04-20",
    meetingDate: "2024-05-10",
    description: "建立实验动物行为学研究模型，用于神经系统疾病相关药物的前期筛选。",
    reviewDate: "",
    reviewComments: "",
  },
  {
    id: "ETH-PE-2024-001",
    acceptanceNumber: "ETH-PE-2024-001",
    name: "儿童肿瘤基因检测研究项目",
    reviewType: "年度/定期审查",
    projectType: "诊断性测序",
    projectSubType: "人体",
    projectId: "GEN-2024-MR-009",
    projectLeader: users[3],
    department: DEPARTMENTS[1],
    mainReviewers: [users[0]],
    ethicsCommittee: ETHICS_COMMITTEES[2],
    status: "通过",
    reviewProgress: 85,
    reviewResult: "审查通过",
    projectStatus: "已立项",
    createdAt: "2024-04-22T13:15:00Z",
    submissionDate: "2024-04-22",
    meetingDate: "2024-05-02",
    description: "对儿童肿瘤患者进行基因测序研究，寻找潜在治疗靶点和个体化治疗方案。",
    reviewDate: "2024-04-25",
    reviewComments: "项目具有重要临床价值，建议尽快实施。",
  },
  {
    id: "ETH-EX-2024-001",
    acceptanceNumber: "ETH-EX-2024-001",
    name: "国内特有基因资源材料出境申请",
    reviewType: "材料出境审批",
    projectType: "材料出库",
    projectSubType: "人体",
    projectId: "GEN-2024-MR-010",
    projectLeader: users[4],
    department: DEPARTMENTS[4],
    mainReviewers: [users[1], users[2]],
    ethicsCommittee: ETHICS_COMMITTEES[0],
    status: "驳回",
    reviewProgress: 60,
    reviewResult: "终止或暂停已同意的研究",
    projectStatus: "未立项",
    createdAt: "2024-04-25T10:40:00Z",
    submissionDate: "2024-04-25",
    meetingDate: "2024-05-12",
    description: "申请将国内特有基因资源材料提供给国外研究机构，用于合作研究项目。",
    reviewDate: "2024-04-30",
    reviewComments: "材料出境目的和用途描述不清晰，需要补充详细说明后重新提交。",
  },
] 