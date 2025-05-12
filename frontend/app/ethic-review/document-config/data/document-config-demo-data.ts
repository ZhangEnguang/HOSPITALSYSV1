// 定义送审文件配置的演示数据

// 创建人用户数据
export const users = [
  {
    id: "u1",
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "/avatars/01.png",
    department: "基础医学院",
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
    department: "临床医学院",
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
    department: "公共卫生学院",
    title: "副研究员",
  },
];

// 审查类型选项 - 更新为用户提供的正确分类
export const REVIEW_TYPE_OPTIONS = [
  "动物初始审查",
  "人体初始审查",
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
];

// 项目类型选项
export const PROJECT_TYPE_OPTIONS = [
  "人体",
  "动物",
];

// 文件需求级别
export const REQUIREMENT_LEVEL_OPTIONS = [
  "必交",
  "选交",
];

// 送审文件类型
export const DOCUMENT_TYPE_OPTIONS = [
  "申请表",
  "知情同意书",
  "研究方案",
  "研究工具",
  "项目预算书",
  "参考资料",
  "调查问卷",
  "动物实验方案",
  "伦理批件",
  "其他"
];

// 文件列表示例
const initialReviewDocuments = [
  { id: "d1", name: "初始审查申请表", type: "申请表", requirementLevel: "必交", template: true, description: "初始项目申请的标准表格" },
  { id: "d2", name: "项目详细方案", type: "研究方案", requirementLevel: "必交", template: false, description: "详细的研究方案，包括背景、目标、方法等" },
  { id: "d3", name: "项目预算书", type: "项目预算书", requirementLevel: "必交", template: true, description: "项目经费使用计划" },
  { id: "d4", name: "知情同意书", type: "知情同意书", requirementLevel: "必交", template: true, description: "受试者/参与者知情同意书" },
  { id: "d5", name: "研究者简历", type: "其他", requirementLevel: "必交", template: false, description: "主要研究者及参与者简历" },
  { id: "d6", name: "相关文献", type: "参考资料", requirementLevel: "选交", template: false, description: "支持研究的相关文献资料" },
];

const amendmentReviewDocuments = [
  { id: "d7", name: "修正案申请表", type: "申请表", requirementLevel: "必交", template: true, description: "项目修正变更的标准申请表" },
  { id: "d8", name: "修正方案详细说明", type: "研究方案", requirementLevel: "必交", template: false, description: "修正内容的详细说明" },
  { id: "d9", name: "变更前后对比表", type: "其他", requirementLevel: "必交", template: true, description: "详细列出变更前后的内容对比" },
  { id: "d10", name: "原批准文件", type: "伦理批件", requirementLevel: "必交", template: false, description: "原伦理委员会批准文件" },
];

const annualReviewDocuments = [
  { id: "d11", name: "年度/定期审查申请表", type: "申请表", requirementLevel: "必交", template: true, description: "项目年度/定期审查的标准申请表" },
  { id: "d12", name: "研究进展报告", type: "研究方案", requirementLevel: "必交", template: true, description: "详细的研究进展报告" },
  { id: "d13", name: "受试者/参与者统计", type: "其他", requirementLevel: "必交", template: true, description: "受试者/参与者招募与参与情况统计" },
  { id: "d14", name: "知情同意执行情况", type: "其他", requirementLevel: "必交", template: true, description: "知情同意实施情况说明" },
  { id: "d15", name: "数据安全报告", type: "其他", requirementLevel: "选交", template: false, description: "研究数据安全性情况报告" },
];

const humanGeneticsDocuments = [
  { id: "d16", name: "人遗资源审批申请表", type: "申请表", requirementLevel: "必交", template: true, description: "人类遗传资源采集标准申请表" },
  { id: "d17", name: "遗传研究方案", type: "研究方案", requirementLevel: "必交", template: false, description: "详细的遗传学研究方案" },
  { id: "d18", name: "特定人群知情同意书", type: "知情同意书", requirementLevel: "必交", template: true, description: "针对特定人群的知情同意书" },
  { id: "d19", name: "伦理审查批件", type: "伦理批件", requirementLevel: "必交", template: false, description: "其他伦理委员会的批准文件（如有）" },
  { id: "d20", name: "样本存储与使用计划", type: "其他", requirementLevel: "必交", template: true, description: "样本采集、存储和使用的详细计划" },
  { id: "d21", name: "国际合作协议", type: "其他", requirementLevel: "选交", template: false, description: "与国际机构合作的协议（如适用）" },
];

const animalInitialDocuments = [
  { id: "d22", name: "动物实验申请表", type: "申请表", requirementLevel: "必交", template: true, description: "动物实验标准申请表" },
  { id: "d23", name: "动物实验方案", type: "动物实验方案", requirementLevel: "必交", template: false, description: "详细的动物实验方案" },
  { id: "d24", name: "3R原则实施计划", type: "其他", requirementLevel: "必交", template: true, description: "减少、优化和替代原则的实施计划" },
  { id: "d25", name: "动物设施资质证明", type: "其他", requirementLevel: "选交", template: false, description: "动物实验设施的资质证明" },
];

const safetyReviewDocuments = [
  { id: "d26", name: "安全性审查申请表", type: "申请表", requirementLevel: "必交", template: true, description: "项目安全性审查的标准申请表" },
  { id: "d27", name: "不良事件报告", type: "其他", requirementLevel: "必交", template: true, description: "研究中发生的不良事件详细报告" },
  { id: "d28", name: "风险评估报告", type: "其他", requirementLevel: "必交", template: false, description: "项目继续进行的风险评估报告" },
  { id: "d29", name: "安全措施调整方案", type: "其他", requirementLevel: "选交", template: false, description: "安全措施的调整方案（如需）" },
];

const protocolDeviationDocuments = [
  { id: "d30", name: "偏离方案报告申请表", type: "申请表", requirementLevel: "必交", template: true, description: "项目偏离方案报告的标准申请表" },
  { id: "d31", name: "偏离情况详细说明", type: "其他", requirementLevel: "必交", template: false, description: "偏离方案的详细情况说明" },
  { id: "d32", name: "偏离影响评估", type: "其他", requirementLevel: "必交", template: false, description: "偏离对研究的影响评估" },
  { id: "d33", name: "预防措施", type: "其他", requirementLevel: "必交", template: false, description: "防止类似偏离再次发生的措施" },
];

const terminationDocuments = [
  { id: "d34", name: "暂停/终止研究报告申请表", type: "申请表", requirementLevel: "必交", template: true, description: "项目暂停或终止的标准申请表" },
  { id: "d35", name: "暂停/终止原因说明", type: "其他", requirementLevel: "必交", template: false, description: "暂停或终止研究的详细原因" },
  { id: "d36", name: "受试者/动物处理方案", type: "其他", requirementLevel: "必交", template: false, description: "已入组受试者/动物的后续处理方案" },
  { id: "d37", name: "数据处理方案", type: "其他", requirementLevel: "必交", template: false, description: "已收集数据的处理方案" },
];

const completionDocuments = [
  { id: "d38", name: "研究完成报告申请表", type: "申请表", requirementLevel: "必交", template: true, description: "项目完成的标准申请表" },
  { id: "d39", name: "研究结果摘要", type: "其他", requirementLevel: "必交", template: false, description: "研究主要结果的摘要" },
  { id: "d40", name: "受试者/动物统计报告", type: "其他", requirementLevel: "必交", template: true, description: "受试者/动物参与情况统计" },
  { id: "d41", name: "数据保存方案", type: "其他", requirementLevel: "必交", template: false, description: "研究数据的长期保存方案" },
  { id: "d42", name: "发表计划", type: "其他", requirementLevel: "选交", template: false, description: "研究成果发表计划" },
];

const internationalDocuments = [
  { id: "d43", name: "国际合作申请表", type: "申请表", requirementLevel: "必交", template: true, description: "国际合作项目的标准申请表" },
  { id: "d44", name: "合作协议", type: "其他", requirementLevel: "必交", template: false, description: "与国外机构的详细合作协议" },
  { id: "d45", name: "合作方资质证明", type: "其他", requirementLevel: "必交", template: false, description: "合作方的资质证明文件" },
  { id: "d46", name: "数据安全保障措施", type: "其他", requirementLevel: "必交", template: true, description: "数据安全保障措施说明" },
  { id: "d47", name: "知识产权协议", type: "其他", requirementLevel: "必交", template: false, description: "知识产权分配协议" },
  { id: "d48", name: "国家安全审查证明", type: "其他", requirementLevel: "选交", template: false, description: "国家安全审查证明（如需）" },
];

// 创建演示数据 - 使用更新后的审查类型
export const documentConfigItems = [
  {
    id: "dc1",
    name: "人体初始审查文件清单",
    reviewType: "人体初始审查",
    projectType: "人体",
    description: "用于人体研究项目初始审查的标准文件清单",
    documents: initialReviewDocuments.filter((_, index) => index < 5),
    documentCount: 5,
    requiredCount: 5,
    optionalCount: 0,
    createdBy: users[0],
    createdAt: "2024-04-10T10:30:00Z",
    updatedAt: "2024-05-01T14:20:00Z",
    updatedBy: users[0],
    status: "enabled",
  },
  {
    id: "dc2",
    name: "动物初始审查文件清单",
    reviewType: "动物初始审查",
    projectType: "动物",
    description: "用于动物实验项目初始审查的标准文件清单",
    documents: animalInitialDocuments,
    documentCount: 4,
    requiredCount: 3,
    optionalCount: 1,
    createdBy: users[1],
    createdAt: "2024-04-12T09:45:00Z",
    updatedAt: "2024-04-12T09:45:00Z",
    updatedBy: users[1],
    status: "enabled",
  },
  {
    id: "dc3",
    name: "修正案审查文件清单",
    reviewType: "修正案审查",
    projectType: "人体",
    description: "用于人体研究项目修正案审查的标准文件清单",
    documents: amendmentReviewDocuments,
    documentCount: 4,
    requiredCount: 4,
    optionalCount: 0,
    createdBy: users[2],
    createdAt: "2024-04-15T13:20:00Z",
    updatedAt: "2024-04-20T10:15:00Z",
    updatedBy: users[0],
    status: "enabled",
  },
  {
    id: "dc4",
    name: "人遗采集审批文件清单",
    reviewType: "人遗采集审批",
    projectType: "人体",
    description: "用于人类遗传资源采集申请的标准文件清单",
    documents: humanGeneticsDocuments.filter((_, index) => index < 4),
    documentCount: 4,
    requiredCount: 4,
    optionalCount: 0,
    createdBy: users[3],
    createdAt: "2024-04-18T15:30:00Z",
    updatedAt: "2024-04-18T15:30:00Z",
    updatedBy: users[3],
    status: "enabled",
  },
  {
    id: "dc5",
    name: "国际合作科学研究审批文件清单",
    reviewType: "国际合作科学研究审批",
    projectType: "人体",
    description: "用于人类遗传资源国际合作申请的标准文件清单",
    documents: internationalDocuments,
    documentCount: 6,
    requiredCount: 5,
    optionalCount: 1,
    createdBy: users[3],
    createdAt: "2024-04-19T11:45:00Z",
    updatedAt: "2024-04-25T09:30:00Z",
    updatedBy: users[3],
    status: "enabled",
  },
  {
    id: "dc6",
    name: "安全性审查文件清单",
    reviewType: "安全性审查",
    projectType: "人体",
    description: "用于人体研究项目安全性审查的标准文件清单",
    documents: safetyReviewDocuments,
    documentCount: 4,
    requiredCount: 3,
    optionalCount: 1,
    createdBy: users[4],
    createdAt: "2024-04-20T14:15:00Z",
    updatedAt: "2024-04-20T14:15:00Z",
    updatedBy: users[4],
    status: "enabled",
  },
  {
    id: "dc7",
    name: "年度/定期审查文件清单",
    reviewType: "年度/定期审查",
    projectType: "人体",
    description: "用于人体研究项目年度/定期审查的标准文件清单",
    documents: annualReviewDocuments,
    documentCount: 5,
    requiredCount: 4,
    optionalCount: 1,
    createdBy: users[0],
    createdAt: "2024-04-22T10:20:00Z",
    updatedAt: "2024-05-02T16:45:00Z",
    updatedBy: users[2],
    status: "enabled",
  },
  {
    id: "dc8",
    name: "偏离方案报告文件清单",
    reviewType: "偏离方案报告",
    projectType: "人体",
    description: "用于人体研究项目偏离方案报告的标准文件清单",
    documents: protocolDeviationDocuments,
    documentCount: 4,
    requiredCount: 4,
    optionalCount: 0,
    createdBy: users[1],
    createdAt: "2024-04-25T09:10:00Z",
    updatedAt: "2024-04-25T09:10:00Z",
    updatedBy: users[1],
    status: "enabled",
  },
  {
    id: "dc9",
    name: "国际合作临床试验备案文件清单",
    reviewType: "国际合作临床试验备案",
    projectType: "人体",
    description: "用于国际合作临床试验备案的标准文件清单",
    documents: [
      ...internationalDocuments.slice(0, 5),
      { id: "d49", name: "临床试验方案", type: "研究方案", requirementLevel: "必交", template: false, description: "详细的临床试验方案" },
      { id: "d50", name: "药物安全性资料", type: "参考资料", requirementLevel: "必交", template: false, description: "药物或医疗器械的安全性资料" },
    ],
    documentCount: 7,
    requiredCount: 6,
    optionalCount: 1,
    createdBy: users[2],
    createdAt: "2024-04-28T14:40:00Z",
    updatedAt: "2024-04-28T14:40:00Z",
    updatedBy: users[2],
    status: "enabled",
  },
  {
    id: "dc10",
    name: "暂停/终止研究报告文件清单",
    reviewType: "暂停/终止研究报告",
    projectType: "人体",
    description: "用于人体研究项目暂停或终止报告的标准文件清单",
    documents: terminationDocuments,
    documentCount: 4,
    requiredCount: 4,
    optionalCount: 0,
    createdBy: users[0],
    createdAt: "2024-05-01T11:30:00Z",
    updatedAt: "2024-05-01T11:30:00Z",
    updatedBy: users[0],
    status: "enabled",
  },
  {
    id: "dc11",
    name: "研究完成报告文件清单",
    reviewType: "研究完成报告",
    projectType: "人体",
    description: "用于人体研究项目完成报告的标准文件清单",
    documents: completionDocuments,
    documentCount: 5,
    requiredCount: 4,
    optionalCount: 1,
    createdBy: users[4],
    createdAt: "2024-05-03T15:20:00Z",
    updatedAt: "2024-05-05T09:45:00Z",
    updatedBy: users[4],
    status: "disabled",
  },
  {
    id: "dc12",
    name: "材料出境审批文件清单",
    reviewType: "材料出境审批",
    projectType: "人体",
    description: "用于人类遗传资源材料出境审批的标准文件清单",
    documents: [
      { id: "d51", name: "材料出境申请表", type: "申请表", requirementLevel: "必交", template: true, description: "材料出境审批标准申请表" },
      { id: "d52", name: "出境材料清单", type: "其他", requirementLevel: "必交", template: true, description: "详细的出境材料清单" },
      { id: "d53", name: "材料使用计划", type: "研究方案", requirementLevel: "必交", template: false, description: "材料在境外的使用计划" },
      { id: "d54", name: "接收方资质证明", type: "其他", requirementLevel: "必交", template: false, description: "境外接收方的资质证明" },
    ],
    documentCount: 4,
    requiredCount: 4,
    optionalCount: 0,
    createdBy: users[3],
    createdAt: "2024-05-05T13:30:00Z",
    updatedAt: "2024-05-05T13:30:00Z",
    updatedBy: users[3],
    status: "enabled",
  },
]; 