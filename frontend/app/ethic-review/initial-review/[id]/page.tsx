"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import DetailPage from "@/components/detail-page/detail-page"
import {
  FileIcon,
  FileText,
  Building2,
  PenSquare,
  Trash2,
  RotateCw,
  User,
  FileSignature,
  BriefcaseMedical,
  Users
} from "lucide-react"
import { useLoading } from "@/hooks/use-loading"

// 导入我们创建的组件
import EthicProjectOverviewTab from "@/app/ethic-review/initial-review/components/overview-tab"
import ReviewFilesTab from "@/app/ethic-review/initial-review/components/review-files-tab"

// 模拟数据 - 审查项目
const mockReviewProjects = [
  {
    id: "1",
    title: "转基因小鼠模型在神经退行性疾病中的应用",
    status: "审核通过",
    statusLabel: "审核通过",
    reviewType: "初始审查",
    projectType: "动物",
    animalType: "小鼠",
    animalCount: "85只",
    ethicsCommittee: "动物实验伦理委员会",
    department: "神经科学研究院",
    leader: "张三", 
    createdAt: "2024-01-01",
    deadline: "2024-01-20",
    submittedAt: "2024-01-15",
    approvedAt: "2024-01-18",
    reviewNumber: "ETH-A-2024-001",
    progress: 100,
    description: "本项目旨在建立转基因小鼠模型，用于研究神经退行性疾病的发病机制与潜在治疗靶点。",
    aiSummary: "经AI智能分析，该转基因小鼠模型研究项目设计科学合理，完全符合3R原则要求。实验方案中的动物福利保障措施完善，安乐死方案符合相关规范标准。项目实验设计清晰，预期目标明确，研究团队具备充足的专业经验。建议作为标准案例纳入伦理培训教材，为后续同类项目提供参考。",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "低",
      analysis: "该项目使用已成熟的转基因技术，动物痛苦程度低，实验过程中有完善的痛苦控制措施。",
      suggestions: [
        "定期检查动物健康状况",
        "严格执行麻醉和安乐死规程",
        "保持实验环境稳定"
      ]
    },
    files: [
      { id: "1", name: "项目申请书.pdf", type: "application", size: "2.4MB", uploadedAt: "2024-01-15", status: "审核通过" },
      { id: "2", name: "实验方案.docx", type: "protocol", size: "1.8MB", uploadedAt: "2024-01-15", status: "审核通过" },
      { id: "3", name: "3R声明.pdf", type: "declaration", size: "0.5MB", uploadedAt: "2024-01-15", status: "审核通过" },
      { id: "4", name: "伦理审查意见.pdf", type: "review", size: "1.2MB", uploadedAt: "2024-01-18", status: "审核通过" }
    ],
    members: [
      { name: "李勤理", title: "副教授", department: "基础医学院", role: "副教授", email: "li@example.com", phone: "13800000010" },
      { name: "张技术员", title: "高级技术员", department: "基础医学院", role: "数据分析", email: "zhang@example.com", phone: "13800000011" },
      { name: "刘制研员", title: "副研究员", department: "药学院", role: "实验设计", email: "liu@example.com", phone: "13800000012" },
      { name: "赵博士", title: "博士后", department: "基础医学院", role: "实验监督", email: "zhao@example.com", phone: "13800000012" }
    ]
  },
  {
    id: "2",
    title: "新型靶向生物药物在晚期肿瘤患者中的临床试验",
    status: "待审核",
    statusLabel: "待审核",
    reviewType: "复审",
    projectType: "人体",
    participantCount: "120人",
    ethicsCommittee: "医学伦理委员会",
    department: "肿瘤医学中心",
    leader: "李四",
    createdAt: "2024-02-20",
    deadline: "2024-03-10",
    submittedAt: "2024-03-05",
    reviewNumber: "ETH-H-2024-008",
    progress: 40,
    description: "本项目旨在评估新型靶向生物药物在晚期肿瘤患者中的安全性和有效性，通过I期临床试验筛选最佳给药剂量和方案。",
    aiSummary: "经AI智能分析，该新型靶向生物药物临床试验研究方案整体设计合理，数据安全监测计划完善，不良反应报告与处置流程规范。知情同意书内容全面但表述略显复杂，受试者招募计划合理但筛选标准较为严格。建议简化知情同意书语言表述，使一般受试者更易理解，同时保持筛选标准的科学性。",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "该试验为I期临床试验，存在药物不良反应风险，但有完善的受试者监测与紧急处置措施。",
      suggestions: [
        "强化受试者筛查标准执行",
        "增加初期剂量组监测频率",
        "设立独立的数据安全监测委员会"
      ]
    },
    files: [
      { id: "5", name: "临床研究方案.pdf", type: "protocol", size: "3.8MB", uploadedAt: "2024-03-05", status: "待审核" },
      { id: "6", name: "知情同意书.pdf", type: "consent", size: "2.1MB", uploadedAt: "2024-03-05", status: "待审核" },
      { id: "7", name: "研究者手册.pdf", type: "handbook", size: "4.5MB", uploadedAt: "2024-03-05", status: "待审核" },
      { id: "8", name: "病例报告表.docx", type: "report", size: "1.6MB", uploadedAt: "2024-03-05", status: "待审核" }
    ],
    members: [
      { name: "陈医生", title: "主治医师", department: "肿瘤医学中心", role: "临床监测", email: "chen@example.com", phone: "13800000020" },
      { name: "王护士", title: "主管护师", department: "肿瘤医学中心", role: "患者护理", email: "wang@example.com", phone: "13800000021" },
      { name: "李药师", title: "药师", department: "药剂科", role: "药物配制", email: "li@example.com", phone: "13800000022" }
    ]
  },
  {
    id: "3",
    title: "高血压患者运动干预效果及安全性评估",
    status: "已退回",
    statusLabel: "已退回",
    reviewType: "初始审查",
    projectType: "人体",
    participantCount: "150人",
    ethicsCommittee: "医学伦理委员会",
    department: "运动医学科学院",
    leader: "王五",
    createdAt: "2024-02-05",
    deadline: "2024-02-25",
    submittedAt: "2024-02-20",
    returnedAt: "2024-02-23",
    reviewNumber: "ETH-H-2024-012",
    progress: 60,
    description: "本项目旨在评估不同强度有氧运动对高血压患者血压控制、心血管功能及生活质量的影响，确定最佳运动处方。",
    aiSummary: "经AI智能分析，该高血压患者运动干预研究存在一些需要完善的问题。研究方案未充分说明高风险人群的排除标准，缺乏运动中止标准的明确界定，应急处置流程描述不够详细，数据收集表单设计还需进一步完善。建议申请者补充完善上述关键内容，特别是强化安全保障措施，再重新提交审查申请。",
    aiModelName: "EthicGPT 2024", 
    aiModelVersion: "v3.1",
    risk: {
      level: "中高",
      analysis: "高血压患者进行运动干预存在心血管事件风险，需要严格的筛查标准和监测措施。现有方案中的风险控制措施不够完善。",
      suggestions: [
        "制定详细的高危人群排除标准",
        "明确运动中止指标和应急预案",
        "配备专业医护人员现场监督"
      ]
    },
    files: [
      { id: "9", name: "研究方案.pdf", type: "protocol", size: "2.7MB", uploadedAt: "2024-02-20", status: "需修改" },
      { id: "10", name: "知情同意书.pdf", type: "consent", size: "1.8MB", uploadedAt: "2024-02-20", status: "需修改" },
      { id: "11", name: "运动处方设计.docx", type: "prescription", size: "1.4MB", uploadedAt: "2024-02-20", status: "需修改" },
      { id: "12", name: "退回意见书.pdf", type: "review", size: "0.8MB", uploadedAt: "2024-02-23", status: "已生成" }
    ],
    members: [
      { name: "孙教练", title: "运动指导师", department: "运动医学科学院", role: "运动指导", email: "sun@example.com", phone: "13800000030" },
      { name: "马医生", title: "心内科医师", department: "心内科", role: "健康监测", email: "ma@example.com", phone: "13800000031" },
      { name: "朱护士", title: "护师", department: "运动医学科学院", role: "患者护理", email: "zhu@example.com", phone: "13800000032" }
    ]
  },
  {
    id: "4",
    title: "啮齿类动物模型在药物代谢研究中的应用",
    status: "已退回",
    statusLabel: "已退回",
    reviewType: "复审",
    projectType: "动物",
    animalType: "啮齿类",
    animalCount: "120只",
    ethicsCommittee: "动物实验伦理委员会",
    department: "药学院",
    leader: "赵六",
    createdAt: "2024-01-10",
    deadline: "2024-01-30",
    submittedAt: "2024-01-28",
    returnedAt: "2024-01-29",
    reviewNumber: "ETH-A-2024-003",
    progress: 100,
    description: "本项目旨在评估各类啮齿动物模型在药物代谢研究中的适用性和有效性，为新药开发提供更精准的前临床评估体系。",
    aiSummary: "经AI智能分析，该啮齿类动物模型药物代谢研究项目存在几个需要完善的问题。实验方案中动物使用数量的论证依据不够充分，痛苦程度评估体系不够完善，麻醉和安乐死实施方案需要进一步细化，实验观察指标的设置还不够合理。建议申请者针对上述问题进行补充完善，确保实验的科学性和动物福利保障，再重新提交审查申请。",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "该项目中部分实验会引起动物中度痛苦，需要完善动物福利保障措施。同时，药物代谢实验涉及的化合物安全性需进一步评估。",
      suggestions: [
        "完善动物痛苦评估与干预方案",
        "建立更详细的药物不良反应监测指标",
        "优化实验设计，减少使用动物数量"
      ]
    },
    files: [
      { id: "p4-1", name: "项目申请书.pdf", type: "application", size: "2.1MB", uploadedAt: "2024-01-28", status: "需修改" },
      { id: "p4-2", name: "实验方案.docx", type: "protocol", size: "1.7MB", uploadedAt: "2024-01-28", status: "需修改" },
      { id: "p4-3", name: "3R声明.pdf", type: "declaration", size: "0.6MB", uploadedAt: "2024-01-28", status: "需修改" },
      { id: "p4-4", name: "退回意见书.pdf", type: "review", size: "0.9MB", uploadedAt: "2024-01-29", status: "已生成" }
    ],
    members: [
      { name: "田研究员", title: "助理研究员", department: "药学院", role: "实验操作", email: "tian@example.com", phone: "13800000040" },
      { name: "徐技术员", title: "实验技术员", department: "药学院", role: "动物照料", email: "xu@example.com", phone: "13800000041" },
      { name: "何兽医", title: "兽医师", department: "动物中心", role: "动物健康", email: "he@example.com", phone: "13800000042" }
    ]
  },
  {
    id: "5",
    title: "免疫治疗对不同年龄段肿瘤患者生活质量影响",
    status: "待审核",
    statusLabel: "待审核",
    reviewType: "初始审查",
    projectType: "人体",
    participantCount: "200人",
    ethicsCommittee: "医学伦理委员会",
    department: "肿瘤医学中心",
    leader: "钱七",
    createdAt: "2024-03-25",
    deadline: "2024-04-15",
    submittedAt: "2024-04-10",
    reviewNumber: "ETH-H-2024-015",
    progress: 20,
    description: "本项目旨在评估免疫治疗对不同年龄段肿瘤患者生活质量的长期影响，为个体化治疗方案制定提供依据。",
    aiSummary: "经AI智能分析，该免疫治疗对肿瘤患者生活质量影响的研究设计较为完善，样本量计算合理，具有良好的科学研究基础。知情同意过程需要进一步细化，长期随访计划还需要完善。建议重点关注患者隐私保护和数据安全管理，确保研究过程中的伦理合规性和受试者权益保障。",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "免疫治疗相关研究存在一定的安全风险，特别是对老年患者群体，需要完善的监测和应急处置措施。",
      suggestions: [
        "制定年龄分层的安全监测方案",
        "建立完善的不良反应报告系统",
        "加强患者教育和随访管理"
      ]
    },
    files: [
      { id: "p5-1", name: "研究方案.pdf", type: "protocol", size: "3.2MB", uploadedAt: "2024-04-10", status: "待审核" },
      { id: "p5-2", name: "知情同意书.pdf", type: "consent", size: "1.9MB", uploadedAt: "2024-04-10", status: "待审核" },
      { id: "p5-3", name: "病例报告表.docx", type: "report", size: "2.1MB", uploadedAt: "2024-04-10", status: "待审核" },
      { id: "p5-4", name: "统计分析计划.pdf", type: "statistics", size: "1.3MB", uploadedAt: "2024-04-10", status: "待审核" }
    ],
    members: [
      { name: "黄主任", title: "科主任", department: "肿瘤医学中心", role: "项目指导", email: "huang@example.com", phone: "13800000050" },
      { name: "宋研究员", title: "研究员", department: "肿瘤医学中心", role: "数据统计", email: "song@example.com", phone: "13800000051" },
      { name: "曹护士", title: "主管护师", department: "肿瘤医学中心", role: "随访管理", email: "cao@example.com", phone: "13800000052" }
    ]
  },
  {
    id: "6",
    title: "非人灵长类动物在神经递质调控研究中的应用",
    status: "审核通过",
    statusLabel: "审核通过",
    reviewType: "初始审查",
    projectType: "动物",
    animalType: "非人灵长类",
    animalCount: "24只",
    ethicsCommittee: "动物实验伦理委员会",
    department: "神经科学研究院",
    leader: "孙七",
    createdAt: "2024-01-25",
    deadline: "2024-02-10",
    submittedAt: "2024-02-05",
    approvedAt: "2024-02-08",
    reviewNumber: "ETH-A-2024-006",
    progress: 100,
    description: "本项目旨在利用非人灵长类动物模型研究神经递质在认知功能调控中的作用机制，为神经系统疾病治疗提供新的理论基础。",
    aiSummary: "【审核通过要点】\n• 3R原则执行到位\n• 动物福利保障措施完善\n• 实验设计科学合理\n• 伦理审查程序规范\n\n建议：作为优秀案例推广经验",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "使用非人灵长类动物进行神经科学研究存在一定伦理争议，但该项目在动物福利保障和实验必要性论证方面较为充分。",
      suggestions: [
        "严格执行动物福利监测",
        "定期评估实验必要性",
        "加强研究人员伦理培训"
      ]
    },
    files: [
      { id: "p6-1", name: "项目申请书.pdf", type: "application", size: "2.8MB", uploadedAt: "2024-02-05", status: "审核通过" },
      { id: "p6-2", name: "实验方案.docx", type: "protocol", size: "2.2MB", uploadedAt: "2024-02-05", status: "审核通过" },
      { id: "p6-3", name: "3R声明.pdf", type: "declaration", size: "0.7MB", uploadedAt: "2024-02-05", status: "审核通过" },
      { id: "p6-4", name: "审查意见书.pdf", type: "review", size: "1.1MB", uploadedAt: "2024-02-08", status: "已生成" }
    ],
    members: [
      { name: "邓教授", title: "教授", department: "神经科学研究院", role: "理论指导", email: "deng@example.com", phone: "13800000060" },
      { name: "钟博士", title: "博士后", department: "神经科学研究院", role: "行为测试", email: "zhong@example.com", phone: "13800000061" },
      { name: "韩技师", title: "动物技师", department: "神经科学研究院", role: "动物训练", email: "han@example.com", phone: "13800000062" }
    ]
  },
  {
    id: "7",
    title: "针对重度抑郁症患者的认知行为疗法有效性研究",
    status: "待审核",
    statusLabel: "待审核",
    reviewType: "复审",
    projectType: "人体",
    participantCount: "180人",
    ethicsCommittee: "医学伦理委员会",
    department: "心理学院",
    leader: "周八",
    createdAt: "2024-03-05",
    deadline: "2024-03-25",
    submittedAt: "2024-03-20",
    reviewNumber: "ETH-H-2024-019",
    progress: 70,
    description: "本项目旨在评估认知行为疗法在重度抑郁症患者中的治疗效果，并探索最佳的治疗模式和干预频率。",
    aiSummary: "经AI智能分析，该针对重度抑郁症患者的认知行为疗法研究项目设计较为完善，复审中发现前期研究基础良好，修正后的研究方案更加合理。患者隐私保护措施得到了明显加强，心理干预风险控制方案也更加完善。建议重点关注患者心理状态的动态监测，确保治疗过程中的安全性和有效性。",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "心理干预研究涉及患者隐私和心理健康风险，需要专业的心理评估和危机干预机制。",
      suggestions: [
        "建立完善的心理危机干预机制",
        "加强患者隐私保护措施",
        "配备专业心理咨询师全程参与"
      ]
    },
    members: [
      { name: "陈心理师", title: "主任心理师", department: "心理学院", role: "心理干预", email: "chenxinli@example.com", phone: "13800000070" },
      { name: "林医生", title: "主治医师", department: "精神科", role: "医学监督", email: "lin@example.com", phone: "13800000071" },
      { name: "张护士", title: "专科护师", department: "心理学院", role: "患者护理", email: "zhanghl@example.com", phone: "13800000072" }
    ],
    files: [
      { id: "p7-1", name: "修订研究方案.pdf", type: "protocol", size: "3.5MB", uploadedAt: "2024-03-20", status: "待审核" },
      { id: "p7-2", name: "知情同意书.pdf", type: "consent", size: "2.0MB", uploadedAt: "2024-03-20", status: "待审核" },
      { id: "p7-3", name: "心理评估量表.docx", type: "assessment", size: "1.2MB", uploadedAt: "2024-03-20", status: "待审核" },
      { id: "p7-4", name: "危机干预预案.pdf", type: "emergency", size: "0.9MB", uploadedAt: "2024-03-20", status: "待审核" }
    ]
  },
  {
    id: "8",
    title: "转基因猪模型在器官移植安全性评估中的应用",
    status: "待审核",
    statusLabel: "待审核",
    reviewType: "初始审查",
    projectType: "动物",
    animalType: "猪",
    animalCount: "36只",
    ethicsCommittee: "生物安全委员会",
    department: "器官移植研究中心",
    leader: "吴九",
    createdAt: "2024-03-20",
    deadline: "2024-04-05",
    submittedAt: "2024-04-02",
    reviewNumber: "ETH-A-2024-009",
    progress: 30,
    description: "本项目旨在建立转基因猪器官移植模型，评估异种器官移植的安全性和可行性，为临床应用提供前期数据支持。",
    aiSummary: "经AI智能分析，该转基因猪器官移植研究项目具有重要的临床应用前景，但同时也面临着复杂的技术和伦理挑战。项目在转基因技术应用、生物安全风险控制、动物福利保障等方面需要特别关注。建议重点审查生物安全相关内容，确保实验废物处理方案的完整性，同时加强对转基因技术的监管要求。",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "高",
      analysis: "转基因动物实验涉及生物安全风险，器官移植研究还涉及复杂的伦理问题，需要严格的安全控制和伦理审查。",
      suggestions: [
        "制定严格的生物安全防护措施",
        "建立完善的实验动物监测体系",
        "加强转基因产物的环境风险评估"
      ]
    },
    members: [
      { name: "郭教授", title: "教授", department: "器官移植研究中心", role: "项目总监", email: "guo@example.com", phone: "13800000080" },
      { name: "谢博士", title: "博士", department: "生物技术中心", role: "技术支持", email: "xie@example.com", phone: "13800000081" },
      { name: "龚兽医", title: "高级兽医师", department: "实验动物中心", role: "动物健康", email: "gong@example.com", phone: "13800000082" }
    ],
    files: [
      { id: "p8-1", name: "项目申请书.pdf", type: "application", size: "4.1MB", uploadedAt: "2024-04-02", status: "待审核" },
      { id: "p8-2", name: "转基因技术方案.docx", type: "protocol", size: "3.2MB", uploadedAt: "2024-04-02", status: "待审核" },
      { id: "p8-3", name: "生物安全评估.pdf", type: "safety", size: "2.5MB", uploadedAt: "2024-04-02", status: "待审核" },
      { id: "p8-4", name: "动物福利方案.pdf", type: "welfare", size: "1.8MB", uploadedAt: "2024-04-02", status: "待审核" }
    ]
  }
];

// 伦理项目审查详情页
export default function EthicReviewDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  
  // 解包 params Promise
  const resolvedParams = React.use(params);
  
  const [projectTitle, setProjectTitle] = useState("");
  const [currentProject, setCurrentProject] = useState<any>(null);

  // 调试信息
  useEffect(() => {
    console.log("当前参数ID:", resolvedParams.id);
  }, [resolvedParams.id]);

  // 模拟获取项目详情数据
  useEffect(() => {
    try {
      console.log("开始加载项目详情，ID:", resolvedParams.id);
      const projectDetail = getProjectDetail();
      
      if (projectDetail) {
        console.log("项目详情加载成功:", projectDetail.id, projectDetail.title);
        setProjectTitle(projectDetail.title);
        setCurrentProject(projectDetail);
      } else {
        console.error("项目详情未找到");
        toast({
          title: "未找到项目",
          description: `无法找到ID为${resolvedParams.id}的审查项目详情`,
          variant: "destructive",
        });
        router.push("/ethic-review/initial-review");
      }
    } catch (error) {
      console.error("加载项目详情时发生错误:", error);
      toast({
        title: "加载错误",
        description: "加载项目详情时发生错误，请稍后重试",
        variant: "destructive",
      });
      router.push("/ethic-review/initial-review");
    }
  }, [resolvedParams.id, router, toast]);

  // 获取项目详情 - 根据多个属性查找
  const getProjectDetail = () => {
    const searchId = resolvedParams.id;
    console.log("正在查找项目，搜索ID:", searchId);
    
    // 为项目4添加特殊处理
    if (searchId === "4") {
      console.log("检测到项目4，应用特殊处理");
      try {
        const { initialReviewItems } = require("../data/initial-review-demo-data");
        const project4 = initialReviewItems.find((p: any) => p.id === "4");
        
        if (project4) {
          console.log("项目4数据:", project4);
          // 为项目4构建完整详情数据
          return {
            id: "4",
            title: project4.name,
            status: "形审退回",
            statusLabel: "已退回",
            reviewType: project4.reviewType,
            projectType: "动物",
            animalType: "啮齿类",
            animalCount: "120只",
            ethicsCommittee: project4.ethicsCommittee,
            department: project4.department,
            leader: project4.projectLeader?.name || "赵六",
            createdAt: "2024-01-20",
            deadline: project4.dueDate || "2024-01-30",
            submittedAt: project4.actualDate || "2024-01-28",
            returnedAt: "2024-01-29",
            reviewNumber: project4.projectId,
            progress: project4.completion || 100,
            description: project4.description || "本项目旨在评估各类啮齿动物模型在药物代谢研究中的适用性和有效性，为新药开发提供更精准的前临床评估体系。",
            aiSummary: "【退回原因分析】\n• 实验方案中动物使用数量未充分论证\n• 痛苦程度评估不完善\n• 麻醉和安乐死方案需细化\n• 实验观察指标设置不够合理\n\n建议：补充完善上述内容后重新提交",
            aiModelName: "EthicGPT 2024",
            aiModelVersion: "v3.1",
            risk: {
              level: "中",
              analysis: "该项目中部分实验会引起动物中度痛苦，需要完善动物福利保障措施。同时，药物代谢实验涉及的化合物安全性需进一步评估。",
              suggestions: [
                "完善动物痛苦评估与干预方案",
                "建立更详细的药物不良反应监测指标",
                "优化实验设计，减少使用动物数量"
              ]
            },
            files: [
              { id: "p4-1", name: "项目申请书.pdf", type: "application", size: "2.1MB", uploadedAt: "2024-01-28", status: "存在问题" },
              { id: "p4-2", name: "实验方案.docx", type: "protocol", size: "1.7MB", uploadedAt: "2024-01-28", status: "存在问题" },
              { id: "p4-3", name: "3R声明.pdf", type: "declaration", size: "0.6MB", uploadedAt: "2024-01-28", status: "存在问题" },
              { id: "p4-4", name: "退回意见书.pdf", type: "review", size: "0.9MB", uploadedAt: "2024-01-29", status: "审核通过" }
            ]
          };
        }
      } catch (error) {
        console.error("处理项目4时发生错误:", error);
      }
    }
    
    // 先从mockReviewProjects中查找
    let project = mockReviewProjects.find((p) => p.id === searchId);
    if (project) {
      console.log("在mockReviewProjects中通过id找到项目:", project.id);
      return project;
    }
    
    // 尝试从initialReviewItems中查找
    try {
      const { initialReviewItems } = require("../data/initial-review-demo-data");
      console.log("尝试从initialReviewItems查找项目，可用项目数:", initialReviewItems.length);
      
      // 先通过纯数字id查找
      let listProject = initialReviewItems.find((p: any) => p.id === searchId);
      
      // 记录项目查找过程
      if (listProject) {
        console.log(`通过纯数字ID "${searchId}" 找到项目:`, listProject.id, listProject.name);
      } else {
        console.log(`通过纯数字ID "${searchId}" 未找到项目，尝试其他属性...`);
        // 如果找不到，尝试其他属性
        listProject = initialReviewItems.find((p: any) => 
          p.projectId === searchId || p.reviewNumber === searchId
        );
        
        if (listProject) {
          console.log(`通过其他属性找到项目:`, listProject.id, listProject.name);
        }
      }
      
      if (listProject) {
        console.log("在initialReviewItems中找到项目:", listProject.id, listProject.name);
        
        // 将列表项目数据转换为详情页需要的格式
        const detailProject = {
          id: listProject.id,
          title: listProject.name,
          status: mapStatus(listProject.status),
          statusLabel: mapStatus(listProject.status),
          reviewType: listProject.reviewType,
          projectType: listProject.projectType,
          animalType: listProject.projectType === "动物" ? (listProject.animalType || "未指定") : undefined,
          animalCount: listProject.projectType === "动物" ? (listProject.animalCount || "未指定") : undefined,
          participantCount: listProject.projectType === "人体" ? (listProject.participantCount || "未指定") : undefined,
          ethicsCommittee: listProject.ethicsCommittee,
          department: listProject.department,
          leader: listProject.projectLeader?.name || "未指定",
          createdAt: listProject.dueDate || "未指定",
          deadline: listProject.dueDate || "未指定",
          submittedAt: listProject.actualDate || listProject.dueDate || "未指定",
          reviewNumber: listProject.projectId,
          progress: listProject.completion || 0,
          description: listProject.description || "暂无描述",
          // 使用真实的AI摘要或默认值
          aiSummary: listProject.aiSummary || "AI审核摘要尚未生成",
          aiModelName: "EthicGPT 2024",
          aiModelVersion: "v3.1",
          risk: {
            level: "未评估",
            analysis: "风险分析尚未生成",
            suggestions: ["暂无风险控制建议"]
          },
          files: [
            { id: "temp1", name: "项目申请书.pdf", type: "application", size: "未知", uploadedAt: listProject.actualDate || "未知", status: "待审核" }
          ]
        };
        
        console.log("已转换项目数据:", detailProject.id, detailProject.title);
        return detailProject;
      } else {
        console.error("在所有数据源中均未找到ID为", searchId, "的项目");
        // 记录所有可用项目ID以便调试
        console.log("可用的项目ID列表:", initialReviewItems.map((p: any) => p.id).join(", "));
        return null;
      }
    } catch (error) {
      console.error("无法加载或处理初始审查项目数据:", error);
      return null;
    }
  };

  // 状态映射函数
  const mapStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      "形审通过": "审核通过",
      "已提交": "待审核",
      "形审退回": "已退回",
      "形审中": "审核中"
    };
    
    return statusMap[status] || status;
  };

  // 获取状态颜色
  const getStatusColors = () => {
    return {
      "审核通过": "bg-green-50 text-green-700 border-green-200",
      "待审核": "bg-amber-50 text-amber-700 border-amber-200",
      "已退回": "bg-red-50 text-red-700 border-red-200",
      "审核中": "bg-blue-50 text-blue-700 border-blue-200"
    };
  };

  // 处理返回列表
  const handleBackToList = () => {
    router.push("/ethic-review/initial-review");
  };

  // 处理标题编辑
  const handleTitleEdit = (newTitle: string) => {
    setProjectTitle(newTitle);
    toast({
      title: "标题已更新",
      description: "项目标题已成功更新",
    });
  };

  // 编辑项目
  const handleEditProject = () => {
    toast({
      title: "编辑审查项目",
      description: "正在跳转到审查项目编辑页面",
    });
    // 实际应用中跳转到编辑页面
    // router.push(`/ethic-projects/review/edit/${params.id}`);
  };

  // 重新提交
  const handleResubmit = () => {
    startLoading();
    
    // 模拟提交操作
    setTimeout(() => {
      stopLoading();
      toast({
        title: "已重新提交",
        description: "审查项目已重新提交，等待审核",
      });
      // 更新项目状态
      if (currentProject) {
        setCurrentProject({
          ...currentProject,
          status: "待审核",
          statusLabel: "待审核"
        });
      }
    }, 1500);
  };

  // 删除项目
  const handleDeleteProject = () => {
    toast({
      title: "项目已删除",
      description: "审查项目已成功删除",
    });
    router.push("/ethic-review/initial-review");
  };

  // 加载状态或错误处理
  if (!currentProject) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
        <div className="text-lg font-medium">加载中...</div>
        <div className="text-sm text-gray-500 mt-2">正在加载项目ID: {resolvedParams.id} 的详情数据</div>
      </div>
    );
  }

  // 获取操作按钮
  const getActionButtons = () => {
    const actions: {
      id: string;
      icon: React.ReactNode;
      label: string;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
      onClick: () => void;
    }[] = [];
    
    // 编辑按钮 - 对于已退回的项目显示
    if (currentProject.status === "已退回") {
      actions.push({
        id: "edit",
        icon: <PenSquare className="h-4 w-4" />,
        label: "编辑",
        onClick: handleEditProject,
      });
      
      actions.push({
        id: "resubmit",
        icon: <RotateCw className="h-4 w-4" />,
        label: "重新提交",
        onClick: handleResubmit,
      });
    }
    
    // 删除按钮 - 所有项目都显示
    actions.push({
      id: "delete",
      icon: <Trash2 className="h-4 w-4" />,
      label: "删除",
      variant: "destructive",
      onClick: handleDeleteProject,
    });
    
    return actions;
  };

  // 获取字段信息
  const getDetailFields = () => {
    if (!currentProject) {
      console.error("尝试获取字段信息时currentProject为null");
      return [];
    }
    
    const baseFields = [
      {
        id: "reviewNumber",
        label: "受理号",
        value: currentProject.reviewNumber || "未分配",
        icon: <FileSignature className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "leader",
        label: "负责人",
        value: currentProject.leader || "未指定",
        icon: <User className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "department",
        label: "所属院系",
        value: currentProject.department || "未指定",
        icon: <Building2 className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "committee",
        label: "伦理委员会",
        value: currentProject.ethicsCommittee || "未指定",
        icon: <Users className="h-4 w-4 text-gray-400" />,
      }
    ];
    
    // 根据项目类型添加第5个字段（限制总数为5个）
    if (currentProject.projectType === "动物") {
      baseFields.push({
        id: "animalCount",
        label: "动物数量",
        value: currentProject.animalCount || "未指定",
        icon: <BriefcaseMedical className="h-4 w-4 text-gray-400" />,
      });
    } else if (currentProject.projectType === "人体") {
      baseFields.push({
        id: "participantCount",
        label: "参与人数",
        value: currentProject.participantCount || "未指定",
        icon: <BriefcaseMedical className="h-4 w-4 text-gray-400" />,
      });
    }
    
    return baseFields;
  };

      return (
      <DetailPage
        id={resolvedParams.id}
        title={projectTitle || currentProject.title || `项目 ${resolvedParams.id}`}
      status={currentProject.status || "未知状态"}
      statusLabel={currentProject.statusLabel || currentProject.status || "未知状态"}
      onTitleEdit={handleTitleEdit}
      onBack={handleBackToList}
      showReviewSidebar={false}
      statusColors={getStatusColors()}
      fields={getDetailFields()}
      actions={getActionButtons()}
      tabs={[
        {
          id: "overview",
          label: "项目概要",
          icon: <FileIcon className="h-4 w-4" />,
          component: <EthicProjectOverviewTab project={currentProject} />,
        },
        {
          id: "reviewFiles",
          label: "送审文件",
          icon: <FileText className="h-4 w-4" />,
          component: <ReviewFilesTab project={currentProject} />,
        },
      ]}
    />
  );
} 