"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import DetailPage from "@/components/detail-page/detail-page"
import {
  FileIcon,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  RotateCw,
  User,
  FileSignature,
  BriefcaseMedical,
  PawPrint,
  Users
} from "lucide-react"
import { useLoading } from "@/hooks/use-loading"

// 导入我们创建的组件
import EthicProjectOverviewTab from "@/app/ethic-review/initial-review/components/overview-tab"
import ReviewFilesTab from "@/app/ethic-review/initial-review/components/review-files-tab"
import ReviewSidebar from "@/app/components/review-sidebar"

// 模拟数据 - 审查项目（复用详情页面的数据）
const mockReviewProjects = [
  {
    id: "1",
    title: "转基因小鼠模型在神经退行性疾病中的应用",
    status: "待审核",
    statusLabel: "待审核",
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
    members: [
      { name: "李勤理", title: "副教授", department: "基础医学院", role: "副教授", email: "li@example.com", phone: "13800000010" },
      { name: "张技术员", title: "高级技术员", department: "基础医学院", role: "数据分析", email: "zhang@example.com", phone: "13800000011" },
      { name: "刘制研员", title: "副研究员", department: "药学院", role: "实验设计", email: "liu@example.com", phone: "13800000012" },
      { name: "赵博士", title: "博士后", department: "基础医学院", role: "实验监督", email: "zhao@example.com", phone: "13800000012" }
    ],
    files: [
      { id: "1", name: "项目申请书.pdf", type: "application", size: "2.4MB", uploadedAt: "2024-01-15", status: "待审核" },
      { id: "2", name: "实验方案.docx", type: "protocol", size: "1.8MB", uploadedAt: "2024-01-15", status: "待审核" },
      { id: "3", name: "3R声明.pdf", type: "declaration", size: "0.5MB", uploadedAt: "2024-01-15", status: "待审核" }
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
    members: [
      { name: "陈医生", title: "主治医师", department: "肿瘤医学中心", role: "临床监测", email: "chen@example.com", phone: "13800000020" },
      { name: "王护士", title: "主管护师", department: "肿瘤医学中心", role: "患者护理", email: "wang@example.com", phone: "13800000021" },
      { name: "李药师", title: "药师", department: "药剂科", role: "药物配制", email: "li@example.com", phone: "13800000022" }
    ],
    files: [
      { id: "5", name: "临床研究方案.pdf", type: "protocol", size: "3.8MB", uploadedAt: "2024-03-05", status: "待审核" },
      { id: "6", name: "知情同意书.pdf", type: "consent", size: "2.1MB", uploadedAt: "2024-03-05", status: "待审核" },
      { id: "7", name: "研究者手册.pdf", type: "handbook", size: "4.5MB", uploadedAt: "2024-03-05", status: "待审核" },
      { id: "8", name: "病例报告表.docx", type: "report", size: "1.6MB", uploadedAt: "2024-03-05", status: "待审核" }
    ]
  },
  {
    id: "3",
    title: "高血压患者运动干预效果及安全性评估",
    status: "待审核",
    statusLabel: "待审核",
    reviewType: "初始审查",
    projectType: "人体",
    participantCount: "150人",
    ethicsCommittee: "医学伦理委员会",
    department: "运动医学科学院",
    leader: "王五",
    createdAt: "2024-02-05",
    deadline: "2024-02-25",
    submittedAt: "2024-02-20",
    reviewNumber: "ETH-H-2024-012",
    progress: 60,
    description: "本项目旨在评估不同强度有氧运动对高血压患者血压控制、心血管功能及生活质量的影响，确定最佳运动处方。",
    aiSummary: "经AI智能分析，该高血压患者运动干预研究存在一些需要完善的问题。研究方案未充分说明高风险人群的排除标准，缺乏运动中止标准的明确界定，应急处置流程描述不够详细，数据收集表单设计还需进一步完善。建议申请者补充完善上述关键内容，特别是强化安全保障措施，再重新提交审查申请。",
    aiModelName: "EthicGPT 2024", 
    aiModelVersion: "v3.1",
    risk: {
      level: "中高",
      analysis: "高血压患者进行运动干预存在心血管事件风险，需要严格的筛查标准和监测措施。",
      suggestions: [
        "制定详细的高危人群排除标准",
        "明确运动中止指标和应急预案",
        "配备专业医护人员现场监督"
      ]
    },
    members: [
      { name: "孙教练", title: "运动指导师", department: "运动医学科学院", role: "运动指导", email: "sun@example.com", phone: "13800000030" },
      { name: "马医生", title: "心内科医师", department: "心内科", role: "健康监测", email: "ma@example.com", phone: "13800000031" },
      { name: "朱护士", title: "护师", department: "运动医学科学院", role: "患者护理", email: "zhu@example.com", phone: "13800000032" }
    ],
    files: [
      { id: "9", name: "研究方案.pdf", type: "protocol", size: "2.7MB", uploadedAt: "2024-02-20", status: "待审核" },
      { id: "10", name: "知情同意书.pdf", type: "consent", size: "1.8MB", uploadedAt: "2024-02-20", status: "待审核" },
      { id: "11", name: "运动处方设计.docx", type: "prescription", size: "1.4MB", uploadedAt: "2024-02-20", status: "待审核" }
    ]
  },
  {
    id: "4",
    title: "啮齿类动物模型在药物代谢研究中的应用",
    status: "待审核",
    statusLabel: "待审核",
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
    reviewNumber: "ETH-A-2024-003",
    progress: 100,
    description: "本项目旨在评估各类啮齿动物模型在药物代谢研究中的适用性和有效性，为新药开发提供更精准的前临床评估体系。",
    aiSummary: "经AI智能分析，该啮齿类动物模型药物代谢研究项目存在几个需要完善的问题。实验方案中动物使用数量的论证依据不够充分，痛苦程度评估体系不够完善，麻醉和安乐死实施方案需要进一步细化，实验观察指标的设置还不够合理。建议申请者针对上述问题进行补充完善，确保实验的科学性和动物福利保障，再重新提交审查申请。",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "该项目中部分实验会引起动物中度痛苦，需要完善动物福利保障措施。",
      suggestions: [
        "完善动物痛苦评估与干预方案",
        "建立更详细的药物不良反应监测指标",
        "优化实验设计，减少使用动物数量"
      ]
    },
    members: [
      { name: "田研究员", title: "助理研究员", department: "药学院", role: "实验操作", email: "tian@example.com", phone: "13800000040" },
      { name: "徐技术员", title: "实验技术员", department: "药学院", role: "动物照料", email: "xu@example.com", phone: "13800000041" },
      { name: "何兽医", title: "兽医师", department: "动物中心", role: "动物健康", email: "he@example.com", phone: "13800000042" }
    ],
    files: [
      { id: "p4-1", name: "项目申请书.pdf", type: "application", size: "2.1MB", uploadedAt: "2024-01-28", status: "待审核" },
      { id: "p4-2", name: "实验方案.docx", type: "protocol", size: "1.7MB", uploadedAt: "2024-01-28", status: "待审核" },
      { id: "p4-3", name: "3R声明.pdf", type: "declaration", size: "0.6MB", uploadedAt: "2024-01-28", status: "待审核" }
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
    members: [
      { name: "黄主任", title: "科主任", department: "肿瘤医学中心", role: "项目指导", email: "huang@example.com", phone: "13800000050" },
      { name: "宋研究员", title: "研究员", department: "肿瘤医学中心", role: "数据统计", email: "song@example.com", phone: "13800000051" },
      { name: "曹护士", title: "主管护师", department: "肿瘤医学中心", role: "随访管理", email: "cao@example.com", phone: "13800000052" }
    ],
    files: [
      { id: "p5-1", name: "研究方案.pdf", type: "protocol", size: "3.2MB", uploadedAt: "2024-04-10", status: "待审核" },
      { id: "p5-2", name: "知情同意书.pdf", type: "consent", size: "1.9MB", uploadedAt: "2024-04-10", status: "待审核" },
      { id: "p5-3", name: "病例报告表.docx", type: "report", size: "2.1MB", uploadedAt: "2024-04-10", status: "待审核" },
      { id: "p5-4", name: "统计分析计划.pdf", type: "statistics", size: "1.3MB", uploadedAt: "2024-04-10", status: "待审核" }
    ]
  },
  {
    id: "6",
    title: "非人灵长类动物在神经递质调控研究中的应用",
    status: "待审核",
    statusLabel: "待审核",
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
    reviewNumber: "ETH-A-2024-006",
    progress: 100,
    description: "本项目旨在利用非人灵长类动物模型研究神经递质在认知功能调控中的作用机制，为神经系统疾病治疗提供新的理论基础。",
    aiSummary: "经AI智能分析，该非人灵长类动物神经递质调控研究项目设计科学严谨，研究目标明确，实验方案详实。动物福利保障措施完善，伦理审查程序规范，3R原则执行到位。研究团队具备丰富的专业经验和良好的实验条件。建议作为标准案例纳入伦理培训教材，为同类项目提供参考借鉴。",
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
    members: [
      { name: "邓教授", title: "教授", department: "神经科学研究院", role: "理论指导", email: "deng@example.com", phone: "13800000060" },
      { name: "钟博士", title: "博士后", department: "神经科学研究院", role: "行为测试", email: "zhong@example.com", phone: "13800000061" },
      { name: "韩技师", title: "动物技师", department: "神经科学研究院", role: "动物训练", email: "han@example.com", phone: "13800000062" }
    ],
    files: [
      { id: "p6-1", name: "项目申请书.pdf", type: "application", size: "2.8MB", uploadedAt: "2024-02-05", status: "待审核" },
      { id: "p6-2", name: "实验方案.docx", type: "protocol", size: "2.2MB", uploadedAt: "2024-02-05", status: "待审核" },
      { id: "p6-3", name: "3R声明.pdf", type: "declaration", size: "0.7MB", uploadedAt: "2024-02-05", status: "待审核" }
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

// 伦理项目审查页面
export default function EthicReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [projectTitle, setProjectTitle] = useState("");
  const [currentProject, setCurrentProject] = useState<any>(null);

  // 调试信息
  useEffect(() => {
    console.log("当前参数ID:", params.id);
  }, [params.id]);

  // 模拟获取项目详情数据
  useEffect(() => {
    try {
      console.log("开始加载项目审核数据，ID:", params.id);
      const projectDetail = getProjectDetail();
      
      if (projectDetail) {
        console.log("项目审核数据加载成功:", projectDetail.id, projectDetail.title);
        setProjectTitle(projectDetail.title);
        setCurrentProject(projectDetail);
      } else {
        console.error("项目审核数据未找到");
        toast({
          title: "未找到项目",
          description: `无法找到ID为${params.id}的审查项目`,
          variant: "destructive",
        });
        router.push("/ethic-review/initial-review");
      }
    } catch (error) {
      console.error("加载项目审核数据时发生错误:", error);
      toast({
        title: "加载错误",
        description: "加载项目审核数据时发生错误，请稍后重试",
        variant: "destructive",
      });
      router.push("/ethic-review/initial-review");
    }
  }, [params.id, router]);

  // 获取项目详情 - 根据多个属性查找
  const getProjectDetail = () => {
    const searchId = params.id;
    console.log("正在查找项目，搜索ID:", searchId);
    
    try {
      // 从模拟数据中查找
      let project = mockReviewProjects.find(p => p.id === searchId);
      
      if (!project) {
        // 尝试从初始审查数据中查找
        const { initialReviewItems } = require("../../data/initial-review-demo-data");
        const initialProject = initialReviewItems.find((p: any) => p.id === searchId);
        
        if (initialProject) {

          
          // 转换为审核页面需要的格式
          project = {
            id: initialProject.id,
            title: initialProject.name,
            status: "待审核",
            statusLabel: "待审核",
            reviewType: initialProject.reviewType,
            projectType: initialProject.projectType,
            ethicsCommittee: initialProject.ethicsCommittee,
            department: initialProject.department,
            leader: initialProject.projectLeader?.name || "未指定",
            submittedAt: "2024-05-18",
            reviewNumber: initialProject.projectId,
            description: initialProject.description,
            createdAt: "2024-05-15",
            deadline: "2024-06-15",
            progress: 100,
            animalType: initialProject.projectType === "动物" ? "待确认" : undefined,
            animalCount: initialProject.projectType === "动物" ? "待确认" : undefined,
            participantCount: initialProject.projectType === "人体" ? "待确认" : undefined,
            aiSummary: initialProject.aiSummary || "经AI智能分析，该项目材料已提交完成，等待伦理委员会进行详细审核。请按照标准审核流程进行评估，确保项目符合相关伦理规范要求。",
            aiModelName: "EthicGPT 2024",
            aiModelVersion: "v3.1",
            risk: {
              level: "待评估",
              analysis: "项目风险等级需要通过审核确定。",
              suggestions: [
                "仔细审阅项目材料",
                "评估伦理风险等级",
                "确认安全保障措施"
              ]
            },
            files: initialProject.files || [
              { id: "1", name: "项目申请书.pdf", type: "application", size: "2.4MB", uploadedAt: "2024-05-18", status: "待审核" },
              { id: "2", name: "实验方案.docx", type: "protocol", size: "1.8MB", uploadedAt: "2024-05-18", status: "待审核" }
            ]
          } as any;
          
          // 添加团队成员信息
          if (initialProject.members) {
            (project as any).members = initialProject.members;
          }
          
          // 根据项目类型添加特定字段
          if (project && initialProject.projectType === "动物") {
            project.animalType = "待确认";
            project.animalCount = "待确认";
          } else if (project && initialProject.projectType === "人体") {
            project.participantCount = "待确认";
          }
        }
      }
      
      console.log("找到项目数据:", project?.id, project?.title);
      return project;
    } catch (error) {
      console.error("无法加载项目数据:", error);
      return null;
    }
  };

  // 获取状态颜色
  const getStatusColors = () => {
    return {
      "待审核": "bg-amber-50 text-amber-700 border-amber-200",
      "审核中": "bg-blue-50 text-blue-700 border-blue-200",
      "审核通过": "bg-green-50 text-green-700 border-green-200",
      "已退回": "bg-red-50 text-red-700 border-red-200"
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

  // 加载状态或错误处理
  if (!currentProject) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
        <div className="text-lg font-medium">加载中...</div>
        <div className="text-sm text-gray-500 mt-2">正在加载项目ID: {params.id} 的审核数据</div>
      </div>
    );
  }

  // 获取审核操作按钮
  const getActionButtons = () => {
    // 审核页面不需要右上角的操作按钮，所有审核操作都在右侧面板中
    return [];
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
    <div className="flex min-h-0 overflow-hidden">
      {/* 左侧主内容区域 */}
      <div className="flex-1 overflow-auto pb-8 pr-[350px]">
        <DetailPage
          id={params.id}
          title={projectTitle || currentProject.title || `项目 ${params.id}`}
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
      </div>
      
      {/* 右侧审核面板 */}
      <ReviewSidebar 
        status={currentProject.status}
        projectId={currentProject.id}
        projectTitle={currentProject.title}
        returnPath="/ethic-review/initial-review"
        getStatusColor={(status: string) => {
          const colors = getStatusColors();
          return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200";
        }}
      />
    </div>
  );
} 