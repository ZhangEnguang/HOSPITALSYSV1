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
  FileCheck,
  PenSquare,
  Trash2,
  RotateCw,
  User,
  FileSignature,
  BriefcaseMedical,
  PawPrint,
  Users,
  ClipboardCheck,
  Clock,
  History
} from "lucide-react"
import { useLoading } from "@/hooks/use-loading"
import { Badge } from "@/components/ui/badge"

// 导入我们创建的组件
import TrackReportOverviewTab from "@/app/ethic-review/track-review/components/overview-tab"
import TrackReportFilesTab from "@/app/ethic-review/track-review/components/review-files-tab"

// 模拟数据 - 审查项目
const mockReviewProjects = [
  {
    id: "ETH-TRK-2024-001",
    title: "人体细胞治疗方案修正评估",
    status: "形审通过",
    statusLabel: "形审通过",
    reviewType: "修正案审查",
    projectType: "人体",
    participantCount: "45人",
    ethicsCommittee: "医学伦理委员会",
    department: "免疫学科研中心",
    leader: "张三",
    createdAt: "2024-04-01",
    deadline: "2024-04-15",
    submittedAt: "2024-04-10",
    approvedAt: "2024-05-18",
    reviewNumber: "ETH-H-2024-001",
    progress: 100,
    description: "审查治疗方案修改内容的合理性和伦理合规性",
    aiSummary: "该人体细胞治疗方案修正案跟踪审查进展顺利，当前执行进度为100%，审查结果良好。治疗方案修改合理，符合伦理要求，受试者安全保障措施完善。知情同意流程执行规范，风险效益比例适当。项目整体风险可控，建议通过审核，可实施修正案。",
    aiModelName: "EthicTracker Pro 2024",
    aiModelVersion: "v3.1.2",
    members: [
      {
        name: "张三",
        title: "主任医师",
        department: "免疫学科研中心",
        role: "主要研究者",
        email: "zhangsan@hospital.com",
        phone: "13800138001"
      },
      {
        name: "李雷",
        title: "副主任医师", 
        department: "免疫学科研中心",
        role: "协同研究者",
        email: "lilei@hospital.com",
        phone: "13800138002"
      },
      {
        name: "韩梅梅",
        title: "主管护师",
        department: "免疫学科研中心", 
        role: "研究护士",
        email: "hanmeimei@hospital.com",
        phone: "13800138003"
      }
    ],
    risk: {
      level: "中",
      analysis: "细胞治疗方案修正涉及给药剂量和随访周期调整，存在一定风险但在可控范围内。",
      suggestions: [
        "严格执行修正后的给药方案",
        "加强随访期间的安全监测",
        "及时记录和报告不良反应"
      ]
    },
    files: [
      { id: "f1", name: "修正案申请表.pdf", type: "application", size: "2.1MB", uploadedAt: "2024-04-10", status: "已审核" },
      { id: "f2", name: "修正后研究方案.docx", type: "protocol", size: "3.5MB", uploadedAt: "2024-04-10", status: "已审核" },
      { id: "f3", name: "安全性评估报告.pdf", type: "safety", size: "2.8MB", uploadedAt: "2024-04-10", status: "已审核" },
      { id: "f4", name: "审查意见书.pdf", type: "review", size: "1.1MB", uploadedAt: "2024-05-18", status: "已生成" }
    ]
  },
  {
    id: "ETH-TRK-2024-002",
    title: "新型靶向生物药物临床试验不良反应报告",
    status: "已提交",
    statusLabel: "待审核",
    reviewType: "安全性审查",
    projectType: "人体",
    participantCount: "120人",
    ethicsCommittee: "医学伦理委员会",
    department: "肿瘤医学中心",
    leader: "李四",
    createdAt: "2024-04-28",
    deadline: "2024-05-10",
    submittedAt: "2024-04-30",
    reviewNumber: "ETH-H-2024-008",
    progress: 60,
    description: "对临床试验中出现的严重不良反应进行审查评估，并制定相应干预措施",
    aiSummary: "该新型靶向生物药物临床试验不良反应跟踪审查进展顺利，当前执行进度为60%，安全性监测良好。共发生12例不良反应，其中2例为严重不良反应，不良反应发生率为10%，在预期范围内。已制定完善的应急处置方案，建议加强高风险受试者监测频率。项目整体风险可控，安全性管理到位。",
    aiModelName: "EthicTracker Pro 2024",
    aiModelVersion: "v3.1.2",
    members: [
      {
        name: "李四",
        title: "主任医师",
        department: "肿瘤医学中心",
        role: "主要研究者",
        email: "lisi@hospital.com",
        phone: "13800138004"
      },
      {
        name: "王明",
        title: "副主任医师",
        department: "肿瘤医学中心",
        role: "协同研究者", 
        email: "wangming@hospital.com",
        phone: "13800138005"
      },
      {
        name: "刘红",
        title: "主管药师",
        department: "药剂科",
        role: "药物管理员",
        email: "liuhong@hospital.com",
        phone: "13800138006"
      },
      {
        name: "陈小婷",
        title: "主管护师",
        department: "肿瘤医学中心",
        role: "研究护士",
        email: "chenxiaoting@hospital.com", 
        phone: "13800138007"
      }
    ],
    risk: {
      level: "中高",
      analysis: "试验药物存在潜在的严重不良反应风险，需要加强监测和应急处置。",
      suggestions: [
        "增加高风险受试者监测频率",
        "完善不良反应分级处理流程",
        "建立独立数据安全监测委员会"
      ]
    },
    files: [
      { id: "f5", name: "严重不良反应报告.pdf", type: "safety", size: "3.2MB", uploadedAt: "2024-04-30", status: "待审核" },
      { id: "f6", name: "不良反应处置方案.docx", type: "protocol", size: "2.1MB", uploadedAt: "2024-04-30", status: "待审核" },
      { id: "f7", name: "安全性监测报告.pdf", type: "safety", size: "4.5MB", uploadedAt: "2024-04-30", status: "待审核" },
      { id: "f8", name: "应急处置流程图.pdf", type: "protocol", size: "0.9MB", uploadedAt: "2024-04-30", status: "待审核" }
    ]
  },
  {
    id: "ETH-TRK-2024-003",
    title: "高血压患者运动干预效果年度评估",
    status: "已提交",
    statusLabel: "待审核",
    reviewType: "年度/定期审查",
    projectType: "人体",
    participantCount: "150人",
    ethicsCommittee: "医学伦理委员会",
    department: "运动医学科学院",
    leader: "王五",
    createdAt: "2024-05-15",
    deadline: "2024-05-20",
    submittedAt: "2024-05-18",
    reviewNumber: "ETH-H-2024-012",
    progress: 30,
    description: "对研究项目进行年度评估，审查研究进展情况和是否符合伦理要求",
    aiSummary: "该高血压患者运动干预效果年度跟踪审查进展良好，当前执行进度为30%，研究计划执行顺利。入组进度良好，已完成86例入组（目标150例），无严重不良事件发生。初步数据显示干预效果明显，受试者依从性良好。项目整体风险较低，建议继续按计划进行，加强受试者随访管理。",
    aiModelName: "EthicTracker Pro 2024",
    aiModelVersion: "v3.1.2",
    members: [
      {
        name: "王五",
        title: "主任医师",
        department: "运动医学科学院",
        role: "主要研究者",
        email: "wangwu@hospital.com",
        phone: "13800138008"
      },
      {
        name: "张伟",
        title: "副教授",
        department: "运动医学科学院",
        role: "协同研究者",
        email: "zhangwei@hospital.com",
        phone: "13800138009"
      },
      {
        name: "李娜",
        title: "康复治疗师",
        department: "康复医学科",
        role: "运动指导员",
        email: "lina@hospital.com",
        phone: "13800138010"
      }
    ],
    risk: {
      level: "低",
      analysis: "运动干预项目风险较低，受试者安全得到充分保障，研究进展顺利。",
      suggestions: [
        "继续严格执行入组标准",
        "加强运动过程中的监测",
        "定期评估受试者运动耐受性"
      ]
    },
    files: [
      { id: "f9", name: "年度进展报告.pdf", type: "report", size: "5.2MB", uploadedAt: "2024-05-18", status: "待审核" },
      { id: "f10", name: "中期数据分析报告.docx", type: "analysis", size: "3.8MB", uploadedAt: "2024-05-18", status: "待审核" },
      { id: "f11", name: "安全性评估报告.pdf", type: "safety", size: "2.1MB", uploadedAt: "2024-05-18", status: "待审核" },
      { id: "f12", name: "受试者入组统计表.xlsx", type: "statistics", size: "1.2MB", uploadedAt: "2024-05-18", status: "待审核" }
    ]
  },
  {
    id: "ETH-TRK-2024-004",
    title: "脑卒中康复治疗方案偏离报告",
    status: "形审通过",
    statusLabel: "形审通过",
    reviewType: "偏离方案报告",
    projectType: "人体",
    participantCount: "80人",
    ethicsCommittee: "医学伦理委员会",
    department: "神经内科学系",
    leader: "孙七",
    createdAt: "2024-03-20",
    deadline: "2024-03-25",
    submittedAt: "2024-03-22",
    approvedAt: "2024-03-30",
    reviewNumber: "ETH-H-2024-023",
    progress: 100,
    description: "报告临床研究中偏离原方案的情况及原因，评估对受试者的影响",
    aiSummary: "该脑卒中康复治疗方案偏离跟踪审查进展顺利，当前执行进度为100%，审查结果良好。偏离原因合理，属于医疗必要性调整，对受试者安全无不良影响。数据完整性未受影响，处理过程规范。项目整体风险较低，建议完善偏离记录流程，加强研究人员培训。",
    aiModelName: "EthicTracker Pro 2024",
    aiModelVersion: "v3.1.2",
    members: [
      {
        name: "孙七",
        title: "主任医师",
        department: "神经内科学系",
        role: "主要研究者",
        email: "sunqi@hospital.com",
        phone: "13800138011"
      },
      {
        name: "赵刚",
        title: "主治医师",
        department: "神经内科学系",
        role: "协同研究者",
        email: "zhaogang@hospital.com",
        phone: "13800138012"
      },
      {
        name: "钱小花",
        title: "康复治疗师",
        department: "康复医学科",
        role: "康复指导员",
        email: "qianxiaohua@hospital.com",
        phone: "13800138013"
      }
    ],
    risk: {
      level: "低",
      analysis: "方案偏离属于医疗必要性调整，对研究结果和受试者安全影响极小。",
      suggestions: [
        "完善偏离方案记录流程",
        "加强研究人员培训",
        "建立偏离方案预防机制"
      ]
    },
    files: [
      { id: "f13", name: "偏离方案报告表.pdf", type: "deviation", size: "1.8MB", uploadedAt: "2024-03-22", status: "已审核" },
      { id: "f14", name: "偏离原因说明.docx", type: "explanation", size: "1.2MB", uploadedAt: "2024-03-22", status: "已审核" },
      { id: "f15", name: "受试者影响评估.pdf", type: "assessment", size: "2.3MB", uploadedAt: "2024-03-22", status: "已审核" },
      { id: "f16", name: "审查意见书.pdf", type: "review", size: "0.9MB", uploadedAt: "2024-03-30", status: "已生成" }
    ]
  },
  {
    id: "ETH-TRK-2024-005",
    title: "认知行为疗法研究终止申请",
    status: "形审通过",
    statusLabel: "形审通过",
    reviewType: "暂停/终止研究报告",
    projectType: "人体",
    participantCount: "60人",
    ethicsCommittee: "医学伦理委员会",
    department: "心理学院",
    leader: "周八",
    createdAt: "2024-03-20",
    deadline: "2024-03-30",
    submittedAt: "2024-03-28",
    approvedAt: "2024-03-30",
    reviewNumber: "ETH-H-2024-019",
    progress: 100,
    description: "由于招募困难，申请终止研究项目并汇报相关情况",
    aiSummary: "该认知行为疗法研究终止跟踪审查进展顺利，当前执行进度为100%，审查结果良好。终止原因合理，确实存在招募困难，已入组受试者处理方案妥当。数据处理和保存符合规范，项目整体风险较低。建议完善研究终止流程，总结经验教训以供后续研究参考。",
    aiModelName: "EthicTracker Pro 2024",
    aiModelVersion: "v3.1.2",
    members: [
      {
        name: "周八",
        title: "教授",
        department: "心理学院",
        role: "主要研究者",
        email: "zhouba@hospital.com",
        phone: "13800138014"
      },
      {
        name: "吴敏",
        title: "副教授",
        department: "心理学院",
        role: "协同研究者",
        email: "wumin@hospital.com",
        phone: "13800138015"
      },
      {
        name: "郑芳",
        title: "心理治疗师",
        department: "心理咨询中心",
        role: "心理评估师",
        email: "zhengfang@hospital.com",
        phone: "13800138016"
      }
    ],
    risk: {
      level: "低",
      analysis: "研究终止风险较低，已入组受试者得到妥善安排，数据处理规范。",
      suggestions: [
        "完善研究终止告知程序",
        "确保数据安全保存",
        "总结经验教训以供后续研究参考"
      ]
    },
    files: [
      { id: "f17", name: "研究终止申请表.pdf", type: "termination", size: "1.5MB", uploadedAt: "2024-03-28", status: "已审核" },
      { id: "f18", name: "终止原因说明.docx", type: "explanation", size: "1.0MB", uploadedAt: "2024-03-28", status: "已审核" },
      { id: "f19", name: "受试者处理方案.pdf", type: "protocol", size: "1.8MB", uploadedAt: "2024-03-28", status: "已审核" },
      { id: "f20", name: "审查意见书.pdf", type: "review", size: "0.8MB", uploadedAt: "2024-03-30", status: "已生成" }
    ]
  },
  {
    id: "ETH-TRK-2024-006",
    title: "人类代谢相关药物临床研究完成报告",
    status: "形审退回",
    statusLabel: "已退回",
    reviewType: "研究完成报告",
    projectType: "人体",
    participantCount: "200人",
    ethicsCommittee: "医学伦理委员会",
    department: "临床药理学研究中心",
    leader: "赵六",
    createdAt: "2024-04-02",
    deadline: "2024-04-05",
    submittedAt: "2024-04-02",
    returnedAt: "2024-04-05",
    reviewNumber: "ETH-H-2024-003",
    progress: 100,
    description: "对已完成的临床研究结果和过程进行最终审查",
    aiSummary: "该人类代谢相关药物临床研究完成报告跟踪审查已完成，但审查结果为退回修改。主要问题包括：研究完成报告数据不完整，缺少部分安全性评估数据，统计分析方法需要补充说明，结论与数据支持不够充分。建议项目团队按照审查意见逐一完善上述内容后重新提交，确保报告质量符合要求。",
    aiModelName: "EthicTracker Pro 2024",
    aiModelVersion: "v3.1.2",
    members: [
      {
        name: "赵六",
        title: "主任医师",
        department: "临床药理学研究中心",
        role: "主要研究者",
        email: "zhaoliu@hospital.com",
        phone: "13800138018"
      },
      {
        name: "孙大伟",
        title: "副主任医师",
        department: "临床药理学研究中心",
        role: "协同研究者",
        email: "sundawei@hospital.com",
        phone: "13800138019"
      },
      {
        name: "李小红",
        title: "主管药师",
        department: "药学部",
        role: "药物监测员",
        email: "lixiaohong@hospital.com",
        phone: "13800138020"
      }
    ],
    risk: {
      level: "中",
      analysis: "研究完成报告存在数据完整性问题，可能影响研究结论的可靠性。",
      suggestions: [
        "补充缺失的安全性评估数据",
        "完善统计分析方法说明",
        "确保结论与数据支持的一致性"
      ]
    },
    files: [
      { id: "f21", name: "研究完成报告.pdf", type: "completion", size: "4.2MB", uploadedAt: "2024-04-02", status: "需修改" },
      { id: "f22", name: "数据分析报告.docx", type: "analysis", size: "3.1MB", uploadedAt: "2024-04-02", status: "需修改" },
      { id: "f23", name: "安全性评估.pdf", type: "safety", size: "2.5MB", uploadedAt: "2024-04-02", status: "需修改" },
      { id: "f24", name: "退回意见书.pdf", type: "review", size: "1.0MB", uploadedAt: "2024-04-05", status: "已生成" }
    ]
  },
  {
    id: "ETH-TRK-2024-007",
    title: "免疫治疗安全性评估方案复审",
    status: "已提交",
    statusLabel: "待审核",
    reviewType: "复审",
    projectType: "人体",
    participantCount: "80人",
    ethicsCommittee: "医学伦理委员会",
    department: "肿瘤医学中心",
    leader: "钱七",
    createdAt: "2024-05-10",
    deadline: "2024-05-15",
    submittedAt: "2024-05-12",
    reviewNumber: "ETH-H-2024-015",
    progress: 20,
    description: "对之前已审查研究方案中未明确部分进行再次审查",
    aiSummary: "该免疫治疗安全性评估方案复审跟踪审查正在进行中，当前执行进度为20%，审查处于初期阶段。复审要点包括：原方案存在部分不明确的表述，需要补充免疫治疗的风险控制措施，知情同意书需要完善，数据监测计划需要细化。建议项目团队重点关注上述问题，及时提供补充材料，确保方案的科学性和安全性。",
    aiModelName: "EthicTracker Pro 2024",
    aiModelVersion: "v3.1.2",
    members: [
      {
        name: "钱七",
        title: "主任医师",
        department: "肿瘤医学中心",
        role: "主要研究者",
        email: "qianqi@hospital.com",
        phone: "13800138021"
      },
      {
        name: "刘小丽",
        title: "副主任医师",
        department: "肿瘤医学中心",
        role: "协同研究者",
        email: "liuxiaoli@hospital.com",
        phone: "13800138022"
      },
      {
        name: "陈威",
        title: "主管护师",
        department: "肿瘤医学中心",
        role: "研究护士",
        email: "chenwei@hospital.com",
        phone: "13800138023"
      },
      {
        name: "张医生",
        title: "免疫科医师",
        department: "免疫科",
        role: "免疫治疗专家",
        email: "zhangyisheng@hospital.com",
        phone: "13800138024"
      }
    ],
    risk: {
      level: "中高",
      analysis: "免疫治疗存在较高的安全风险，需要完善的安全监测和应急处置方案。",
      suggestions: [
        "制定详细的免疫治疗风险监测指标",
        "建立多学科安全评估团队",
        "完善应急处置和救治流程"
      ]
    },
    files: [
      { id: "f25", name: "复审申请表.pdf", type: "application", size: "1.8MB", uploadedAt: "2024-05-12", status: "待审核" },
      { id: "f26", name: "修订后研究方案.docx", type: "protocol", size: "4.2MB", uploadedAt: "2024-05-12", status: "待审核" },
      { id: "f27", name: "安全性监测计划.pdf", type: "safety", size: "2.9MB", uploadedAt: "2024-05-12", status: "待审核" },
      { id: "f28", name: "知情同意书修订版.pdf", type: "consent", size: "1.5MB", uploadedAt: "2024-05-12", status: "待审核" }
    ]
  },
  {
    id: "ETH-TRK-2024-008",
    title: "人体细胞治疗受试者标准修正",
    status: "已提交",
    statusLabel: "待审核",
    reviewType: "修正案审查",
    projectType: "人体",
    participantCount: "45人",
    ethicsCommittee: "医学伦理委员会",
    department: "免疫学科研中心",
    leader: "张三",
    createdAt: "2024-05-20",
    deadline: "2024-05-25",
    submittedAt: "2024-05-22",
    reviewNumber: "ETH-H-2024-002",
    progress: 50,
    description: "审查受试者入选标准修改的合理性和伦理合规性",
    aiSummary: "该人体细胞治疗受试者标准修正跟踪审查正在进行中，当前执行进度为50%，初步审查结果良好。受试者标准修正具有科学依据，新标准有助于提高研究质量，对现有受试者影响较小。建议完善知情同意过程，确保受试者充分了解标准变更的意义和影响。项目整体风险可控，建议加强过渡期管理。",
    aiModelName: "EthicTracker Pro 2024",
    aiModelVersion: "v3.1.2",
    members: [
      {
        name: "张三",
        title: "主任医师",
        department: "免疫学科研中心",
        role: "主要研究者",
        email: "zhangsan@hospital.com",
        phone: "13800138001"
      },
      {
        name: "李雷",
        title: "副主任医师", 
        department: "免疫学科研中心",
        role: "协同研究者",
        email: "lilei@hospital.com",
        phone: "13800138002"
      },
      {
        name: "韩梅梅",
        title: "主管护师",
        department: "免疫学科研中心", 
        role: "研究护士",
        email: "hanmeimei@hospital.com",
        phone: "13800138003"
      },
      {
        name: "王小明",
        title: "统计师",
        department: "生物统计中心",
        role: "数据分析师",
        email: "wangxiaoming@hospital.com",
        phone: "13800138017"
      }
    ],
    risk: {
      level: "中",
      analysis: "受试者标准修正可能影响研究的连续性，需要评估对已入组受试者的影响。",
      suggestions: [
        "评估修正标准对已入组受试者的影响",
        "完善新标准的知情同意过程",
        "建立标准修正的过渡期管理"
      ]
    },
    files: [
      { id: "f29", name: "受试者标准修正申请.pdf", type: "application", size: "2.0MB", uploadedAt: "2024-05-22", status: "待审核" },
      { id: "f30", name: "修正后入选标准.docx", type: "criteria", size: "1.3MB", uploadedAt: "2024-05-22", status: "待审核" },
      { id: "f31", name: "影响评估报告.pdf", type: "assessment", size: "1.8MB", uploadedAt: "2024-05-22", status: "待审核" },
      { id: "f32", name: "知情同意书修订版.pdf", type: "consent", size: "1.4MB", uploadedAt: "2024-05-22", status: "待审核" }
    ]
  }
];

// 跟踪报告详情页
export default function TrackReportDetail({ params }: { params: { id: string } }) {
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
      console.log("开始加载项目详情，ID:", params.id);
      const projectDetail = getProjectDetail();
      
      if (projectDetail) {
        console.log("项目详情加载成功:", projectDetail.id, projectDetail.title);
        setProjectTitle(projectDetail.title);
        setCurrentProject(projectDetail);
      } else {
        console.error("项目详情未找到");
        toast({
          title: "未找到项目",
          description: `无法找到ID为${params.id}的审查项目详情`,
          variant: "destructive",
        });
        router.push("/ethic-review/track-review");
      }
    } catch (error) {
      console.error("加载项目详情时发生错误:", error);
      toast({
        title: "加载错误",
        description: "加载项目详情时发生错误，请稍后重试",
        variant: "destructive",
      });
      router.push("/ethic-review/track-review");
    }
  }, [params.id, router]);

  // 获取项目详情 - 根据多个属性查找
  const getProjectDetail = () => {
    const searchId = params.id;
    console.log("正在查找项目，搜索ID:", searchId);
    
    // 为项目4添加特殊处理
    if (searchId === "4") {
      console.log("检测到项目4，应用特殊处理");
      try {
        const { trackReviewItems } = require("../data/track-review-demo-data");
        const project4 = trackReviewItems.find((p: any) => p.id === "4");
        
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
              { id: "p4-1", name: "项目申请书.pdf", type: "application", size: "2.1MB", uploadedAt: "2024-01-28", status: "需修改" },
              { id: "p4-2", name: "实验方案.docx", type: "protocol", size: "1.7MB", uploadedAt: "2024-01-28", status: "需修改" },
              { id: "p4-3", name: "3R声明.pdf", type: "declaration", size: "0.6MB", uploadedAt: "2024-01-28", status: "需修改" },
              { id: "p4-4", name: "退回意见书.pdf", type: "review", size: "0.9MB", uploadedAt: "2024-01-29", status: "已生成" }
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
    
    // 尝试从trackReviewItems中查找
    try {
      const { trackReviewItems } = require("../data/track-review-demo-data");
      console.log("尝试从trackReviewItems查找项目，可用项目数:", trackReviewItems.length);
      
      // 先通过纯数字id查找
      let listProject = trackReviewItems.find((p: any) => p.id === searchId);
      
      // 记录项目查找过程
      if (listProject) {
        console.log(`通过纯数字ID "${searchId}" 找到项目:`, listProject.id, listProject.name);
      } else {
        console.log(`通过纯数字ID "${searchId}" 未找到项目，尝试其他属性...`);
        // 如果找不到，尝试其他属性
        listProject = trackReviewItems.find((p: any) => 
          p.projectId === searchId || p.reviewNumber === searchId
        );
        
        if (listProject) {
          console.log(`通过其他属性找到项目:`, listProject.id, listProject.name);
        }
      }
      
      if (listProject) {
        console.log("在trackReviewItems中找到项目:", listProject.id, listProject.name);
        
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
          // 添加其他必要的默认值
          aiSummary: "AI审核摘要尚未生成",
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
        console.log("可用的项目ID列表:", trackReviewItems.map((p: any) => p.id).join(", "));
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
      "形审通过": "bg-green-50 text-green-700 border-green-200",
      "待审核": "bg-amber-50 text-amber-700 border-amber-200",
      "已退回": "bg-red-50 text-red-700 border-red-200",
      "审核中": "bg-blue-50 text-blue-700 border-blue-200"
    };
  };

  // 处理返回列表
  const handleBackToList = () => {
    router.push("/ethic-review/track-review");
  };

  // 处理标题编辑
  const handleTitleEdit = (newTitle: string) => {
    setProjectTitle(newTitle);
    toast({
      title: "标题已更新",
      description: "项目标题已成功更新",
    });
  };

  // 编辑报告
  const handleEditReport = () => {
    toast({
      title: "编辑跟踪报告",
      description: "正在跳转到跟踪报告编辑页面",
    });
    // 实际应用中跳转到编辑页面
    // router.push(`/ethic-review/track-review/edit/${params.id}`);
  };

  // 重新提交
  const handleResubmitReport = () => {
    startLoading();
    
    // 模拟提交操作
    setTimeout(() => {
      stopLoading();
      toast({
        title: "已重新提交",
        description: "跟踪报告已重新提交，等待审核",
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

  // 删除报告
  const handleDeleteReport = () => {
    toast({
      title: "报告已删除",
      description: "跟踪报告已成功删除",
    });
    router.push("/ethic-review/track-review");
  };

  // 加载状态或错误处理
  if (!currentProject) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
        <div className="text-lg font-medium">加载中...</div>
        <div className="text-sm text-gray-500 mt-2">正在加载项目ID: {params.id} 的详情数据</div>
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
        label: "编辑报告",
        onClick: handleEditReport,
      });
      
      actions.push({
        id: "resubmit",
        icon: <RotateCw className="h-4 w-4" />,
        label: "重新提交",
        onClick: handleResubmitReport,
      });
    }
    
    // 删除按钮 - 所有项目都显示
    actions.push({
      id: "delete",
      icon: <Trash2 className="h-4 w-4" />,
      label: "删除报告",
      variant: "destructive",
      onClick: handleDeleteReport,
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
      },
      {
        id: "submittedAt",
        label: "提交时间",
        value: currentProject.submittedAt || "未提交",
        icon: <Calendar className="h-4 w-4 text-gray-400" />,
      }
    ];
    
    // 根据项目类型添加特定字段
    if (currentProject.projectType === "动物") {
      baseFields.push(
        {
          id: "animalType",
          label: "动物种系",
          value: currentProject.animalType || "未指定",
          icon: <PawPrint className="h-4 w-4 text-gray-400" />,
        },
        {
          id: "animalCount",
          label: "动物数量",
          value: currentProject.animalCount || "未指定",
          icon: <BriefcaseMedical className="h-4 w-4 text-gray-400" />,
        }
      );
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
      id={params.id}
      title={projectTitle || currentProject.title || `跟踪报告 ${params.id}`}
      status={currentProject.status}
      statusLabel={currentProject.statusLabel}
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
          component: <TrackReportOverviewTab project={currentProject} />,
        },
        {
          id: "reviewFiles",
          label: "送审文件",
          icon: <FileText className="h-4 w-4" />,
          component: <TrackReportFilesTab project={currentProject} />,
        }
      ]}
    />
  );
} 