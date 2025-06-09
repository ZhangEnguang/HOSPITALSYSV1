"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import DetailPage from "@/components/detail-page/detail-page"
import ReviewSidebar from "@/app/components/review-sidebar"
import {
  FileIcon,
  AlertTriangle,
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
  Users
} from "lucide-react"
import { useLoading } from "@/hooks/use-loading"

// 导入我们创建的组件
import EthicProjectOverviewTab from "@/app/ethic-review/human-genetics-review/components/overview-tab"
import RiskAnalysisTab from "@/app/ethic-review/human-genetics-review/components/risk-analysis-tab"
import ReviewFilesTab from "@/app/ethic-review/human-genetics-review/components/review-files-tab"

// 模拟数据 - 审查项目
const mockReviewProjects = [
  {
    id: "ETH-HG-2024-001",
    title: "中国汉族人群BRCA1/2基因致病变异筛查",
    status: "形审通过",
    statusLabel: "形审通过",
    reviewType: "遗传学研究",
    approvalType: "人遗采集审批",
    projectType: "人遗",
    department: "遗传学研究所",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "张三", 
    projectLeader: { name: "张三" },
    createdAt: "2024-03-15",
    deadline: "2024-03-15",
    submittedAt: "2024-03-10",
    approvedAt: "2024-03-10",
    reviewNumber: "GEN-2024-001",
    projectId: "GEN-2024-001",
    progress: 100,
    description: "针对中国汉族女性人群进行BRCA1/2基因致病变异筛查，评估乳腺癌和卵巢癌的遗传风险",
    geneticMaterial: "血液样本",
    sampleSize: 2000,
    geneticTest: "全外显子组测序",
    dataProtection: "符合GDPR与中国遗传资源管理规定",
    aiSummary: "【审核要点摘要】\n• 研究设计科学合理\n• 遗传资源采集符合规范\n• 数据保护措施完善\n• 知情同意过程规范\n\n建议：可作为标准案例推广",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "低",
      analysis: "该项目采集流程规范，数据保护措施完善，风险可控。",
      suggestions: [
        "严格执行知情同意流程",
        "加强数据安全管理",
        "定期评估数据使用情况"
      ]
    },
    files: [
      { id: "1", name: "项目申请书.pdf", type: "application", size: "2.4MB", uploadedAt: "2024-03-10", status: "审核通过" },
      { id: "2", name: "遗传资源采集方案.docx", type: "protocol", size: "1.8MB", uploadedAt: "2024-03-10", status: "审核通过" },
      { id: "3", name: "知情同意书.pdf", type: "consent", size: "0.5MB", uploadedAt: "2024-03-10", status: "审核通过" },
      { id: "4", name: "数据保护方案.pdf", type: "protection", size: "1.2MB", uploadedAt: "2024-03-10", status: "审核通过" }
    ]
  },
  {
    id: "ETH-HG-2024-002",
    title: "单基因遗传病快速诊断测序技术评估",
    status: "已提交",
    statusLabel: "已提交",
    reviewType: "诊断性测序",
    approvalType: "人遗保藏审批",
    projectType: "人遗",
    department: "基因组学中心",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "李四",
    projectLeader: { name: "李四" },
    createdAt: "2024-05-20",
    deadline: "2024-05-20",
    submittedAt: "2024-05-20",
    reviewNumber: "GEN-2024-008",
    projectId: "GEN-2024-008",
    progress: 60,
    description: "评估快速全外显子组测序技术在罕见单基因遗传病诊断中的准确性和临床应用价值",
    geneticMaterial: "血液、口腔拭子",
    sampleSize: 100,
    geneticTest: "全外显子组测序、靶向基因panel测序",
    dataProtection: "符合临床遗传信息保护规范",
    aiSummary: "【审核要点摘要】\n• 技术方案需要进一步评估\n• 临床应用价值有待验证\n• 数据保护措施需要完善\n• 伦理风险控制合理\n\n建议：重点关注技术准确性验证",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "技术评估项目存在一定不确定性，需要加强质量控制。",
      suggestions: [
        "建立完善的质量控制体系",
        "加强技术验证和比对",
        "完善临床数据收集"
      ]
    },
    files: [
      { id: "5", name: "技术评估方案.pdf", type: "protocol", size: "3.8MB", uploadedAt: "2024-05-20", status: "待审核" },
      { id: "6", name: "临床应用计划.pdf", type: "plan", size: "2.1MB", uploadedAt: "2024-05-20", status: "待审核" },
      { id: "7", name: "质量控制方案.pdf", type: "quality", size: "1.5MB", uploadedAt: "2024-05-20", status: "待审核" }
    ]
  },
  {
    id: "ETH-HG-2024-003", 
    title: "遗传性肿瘤高风险家系咨询模式研究",
    status: "已提交",
    statusLabel: "已提交",
    reviewType: "遗传咨询研究",
    approvalType: "国际合作科研审批",
    projectType: "人遗",
    department: "遗传咨询科",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "钱七",
    projectLeader: { name: "钱七" },
    createdAt: "2024-06-15",
    deadline: "2024-06-15",
    submittedAt: "2024-06-15",
    reviewNumber: "GEN-2024-012",
    projectId: "GEN-2024-012",
    progress: 30,
    description: "研究针对遗传性肿瘤高风险家系的遗传咨询模式，评估心理干预效果",
    geneticMaterial: "问卷数据、家系图",
    sampleSize: 50,
    geneticTest: "无实验室测试",
    dataProtection: "符合医学伦理与心理健康数据保护规范",
    aiSummary: "【审核要点摘要】\n• 研究设计较为完善\n• 心理干预方案需要细化\n• 数据收集流程合理\n• 伦理保护措施到位\n\n建议：加强心理干预专业性",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "心理干预研究涉及敏感信息，需要专业的心理保护措施。",
      suggestions: [
        "配备专业心理咨询师",
        "建立心理危机干预机制",
        "加强隐私保护措施"
      ]
    },
    files: [
      { id: "8", name: "研究方案.pdf", type: "protocol", size: "2.7MB", uploadedAt: "2024-06-15", status: "待审核" },
      { id: "9", name: "心理干预计划.pdf", type: "intervention", size: "1.8MB", uploadedAt: "2024-06-15", status: "待审核" },
      { id: "10", name: "家系数据收集方案.docx", type: "collection", size: "1.4MB", uploadedAt: "2024-06-15", status: "待审核" }
    ]
  },
  {
    id: "ETH-HG-2024-004",
    title: "中国人群基因组变异数据库构建", 
    status: "形审退回",
    statusLabel: "形审退回",
    reviewType: "基因组学研究",
    approvalType: "材料出境审批",
    projectType: "人遗",
    department: "生物信息学院",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "赵六",
    projectLeader: { name: "赵六" },
    createdAt: "2024-04-25",
    deadline: "2024-04-25",
    submittedAt: "2024-04-25",
    returnedAt: "2024-04-25",
    reviewNumber: "GEN-2024-015",
    projectId: "GEN-2024-015",
    progress: 70,
    description: "构建中国人群基因组变异数据库，为遗传病诊断和个体化医疗提供参考数据",
    geneticMaterial: "全基因组数据",
    sampleSize: 10000,
    geneticTest: "全基因组测序",
    dataProtection: "符合国家人类遗传资源管理条例，数据库访问受限",
    aiSummary: "【退回原因分析】\n• 数据出境申请材料不完整\n• 国际合作协议需要完善\n• 数据安全保护措施需要加强\n• 知识产权保护条款缺失\n\n建议：补充完善上述材料后重新提交",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "高",
      analysis: "大规模基因组数据涉及国家安全和个人隐私，需要严格管控。",
      suggestions: [
        "完善数据出境审批流程",
        "加强国际合作监管",
        "建立数据追踪机制"
      ]
    },
    files: [
      { id: "11", name: "数据库构建方案.pdf", type: "protocol", size: "4.2MB", uploadedAt: "2024-04-25", status: "需修改" },
      { id: "12", name: "国际合作协议.pdf", type: "agreement", size: "2.8MB", uploadedAt: "2024-04-25", status: "需修改" },
      { id: "13", name: "数据安全方案.pdf", type: "security", size: "3.1MB", uploadedAt: "2024-04-25", status: "需修改" },
      { id: "14", name: "退回意见书.pdf", type: "review", size: "0.8MB", uploadedAt: "2024-04-25", status: "已生成" }
    ]
  },
  {
    id: "ETH-HG-2024-005",
    title: "新生儿遗传代谢病筛查方法评估",
    status: "形审通过",
    statusLabel: "形审通过",
    reviewType: "遗传病筛查",
    approvalType: "国际合作临床试验",
    projectType: "人遗",
    department: "临床遗传科",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "王五",
    projectLeader: { name: "王五" },
    createdAt: "2024-07-01",
    deadline: "2024-07-01",
    submittedAt: "2024-07-01",
    approvedAt: "2024-07-01",
    reviewNumber: "GEN-2024-019",
    projectId: "GEN-2024-019",
    progress: 85,
    description: "评估新生儿遗传代谢病筛查的新技术方法，提升筛查准确性",
    geneticMaterial: "新生儿血斑",
    sampleSize: 5000,
    geneticTest: "靶向基因panel测序",
    dataProtection: "符合新生儿隐私保护特殊规定",
    aiSummary: "【审核要点摘要】\n• 新生儿群体特殊保护措施完善\n• 技术方案科学可行\n• 临床试验设计规范\n• 国际合作监管到位\n\n建议：加强新生儿隐私保护",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "新生儿群体需要特殊保护，但技术方案成熟。",
      suggestions: [
        "建立新生儿特殊保护机制",
        "完善家长知情同意流程",
        "加强数据安全管理"
      ]
    },
    files: [
      { id: "15", name: "新生儿筛查方案.pdf", type: "protocol", size: "3.2MB", uploadedAt: "2024-07-01", status: "审核通过" },
      { id: "16", name: "国际合作协议.pdf", type: "agreement", size: "2.5MB", uploadedAt: "2024-07-01", status: "审核通过" },
      { id: "17", name: "家长知情同意书.pdf", type: "consent", size: "0.8MB", uploadedAt: "2024-07-01", status: "审核通过" }
    ]
  },
  {
    id: "ETH-HG-2024-006",
    title: "帕金森病遗传风险因子研究",
    status: "已提交",
    statusLabel: "已提交",
    reviewType: "对外提供使用备案",
    approvalType: "对外提供使用备案",
    projectType: "人遗",
    department: "遗传学研究所",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "张三",
    projectLeader: { name: "张三" },
    createdAt: "2024-08-10",
    deadline: "2024-08-10",
    submittedAt: "2024-08-10",
    reviewNumber: "GEN-2024-012",
    projectId: "GEN-2024-012",
    progress: 40,
    description: "研究帕金森病遗传风险因子，为早期诊断提供分子标记",
    geneticMaterial: "血液样本、脑脊液",
    sampleSize: 800,
    geneticTest: "全外显子组测序",
    dataProtection: "符合神经系统疾病数据保护规范",
    aiSummary: "【审核要点摘要】\n• 神经系统疾病研究具有重要意义\n• 遗传风险因子筛查方案合理\n• 数据对外提供流程需要规范\n• 知情同意过程完善\n\n建议：重点关注数据对外提供的监管",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "数据对外提供存在一定风险，需要严格监管。",
      suggestions: [
        "建立数据对外提供审批机制",
        "加强数据使用追踪",
        "完善数据安全技术措施"
      ]
    },
    files: [
      { id: "18", name: "研究方案.pdf", type: "protocol", size: "4.1MB", uploadedAt: "2024-08-10", status: "待审核" },
      { id: "19", name: "数据使用协议.pdf", type: "agreement", size: "1.9MB", uploadedAt: "2024-08-10", status: "待审核" },
      { id: "20", name: "风险评估报告.pdf", type: "risk", size: "2.3MB", uploadedAt: "2024-08-10", status: "待审核" }
    ]
  },
  {
    id: "ETH-HG-2024-007",
    title: "罕见遗传病基因变异功能研究",
    status: "已提交",
    statusLabel: "已提交",
    reviewType: "基因组学研究",
    approvalType: "人遗采集审批",
    projectType: "人遗",
    department: "基因组学中心",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "李四",
    projectLeader: { name: "李四" },
    createdAt: "2024-09-05",
    deadline: "2024-09-05",
    submittedAt: "2024-09-05",
    reviewNumber: "GEN-2024-007",
    projectId: "GEN-2024-007",
    progress: 20,
    description: "研究罕见遗传病相关基因变异的功能影响，为精准诊断提供依据",
    geneticMaterial: "血液、组织样本",
    sampleSize: 200,
    geneticTest: "基因功能验证实验",
    dataProtection: "符合罕见病数据保护特殊要求",
    aiSummary: "【审核要点摘要】\n• 罕见病研究具有重要科学价值\n• 基因功能验证方案科学\n• 样本采集流程规范\n• 数据保护措施符合要求\n\n建议：加强罕见病患者权益保护",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "低",
      analysis: "罕见病研究风险较低，但需要关注患者隐私保护。",
      suggestions: [
        "建立罕见病患者支持机制",
        "加强基因数据安全管理",
        "完善科研反馈机制"
      ]
    },
    files: [
      { id: "21", name: "基因功能研究方案.pdf", type: "protocol", size: "3.5MB", uploadedAt: "2024-09-05", status: "待审核" },
      { id: "22", name: "实验室质控方案.pdf", type: "quality", size: "2.2MB", uploadedAt: "2024-09-05", status: "待审核" },
      { id: "23", name: "患者隐私保护方案.pdf", type: "privacy", size: "1.3MB", uploadedAt: "2024-09-05", status: "待审核" }
    ]
  },
  {
    id: "ETH-HG-2024-008",
    title: "肿瘤遗传易感性基因筛查与咨询",
    status: "已提交",
    statusLabel: "已提交",
    reviewType: "遗传咨询研究",
    approvalType: "重要家系资源备案",
    projectType: "人遗",
    department: "基因组学中心",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "李四",
    projectLeader: { name: "李四" },
    createdAt: "2024-10-12",
    deadline: "2024-10-12",
    submittedAt: "2024-10-12",
    reviewNumber: "GEN-2024-004",
    projectId: "GEN-2024-004",
    progress: 15,
    description: "针对肿瘤易感性基因进行筛查，并开展专业遗传咨询服务",
    geneticMaterial: "全血、组织样本",
    sampleSize: 300,
    geneticTest: "肿瘤易感基因panel测序",
    dataProtection: "符合肿瘤遗传咨询专业规范",
    aiSummary: "【审核要点摘要】\n• 肿瘤易感性筛查具有预防价值\n• 遗传咨询服务设计专业\n• 重要家系资源管理规范\n• 心理支持措施完善\n\n建议：重点关注咨询质量和心理支持",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "肿瘤易感性信息可能对患者心理产生影响，需要专业心理支持。",
      suggestions: [
        "配备专业遗传咨询师",
        "建立心理支持体系",
        "完善家系隐私保护"
      ]
    },
    files: [
      { id: "24", name: "易感基因筛查方案.pdf", type: "protocol", size: "4.0MB", uploadedAt: "2024-10-12", status: "待审核" },
      { id: "25", name: "遗传咨询流程.pdf", type: "counseling", size: "2.8MB", uploadedAt: "2024-10-12", status: "待审核" },
      { id: "26", name: "家系资源管理方案.pdf", type: "management", size: "2.1MB", uploadedAt: "2024-10-12", status: "待审核" }
    ]
  }
];

export default function EthicReviewReview({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { startLoading, stopLoading } = useLoading()

  // 项目状态
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [projectTitle, setProjectTitle] = useState<string>("")

  // 获取项目详情
  useEffect(() => {
    const getProjectDetail = () => {
      const project = mockReviewProjects.find(p => p.id === params.id);
      if (project) {
        console.log("找到项目:", project);
        setCurrentProject(project);
        setProjectTitle(project.title);
      } else {
        console.error("找不到项目ID:", params.id);
        console.log("可用的项目ID:", mockReviewProjects.map(p => p.id));
      }
    };

    getProjectDetail();
  }, [params.id]);

  // 生成AI摘要内容
  function getProjectAiSummary(project: any) {
    if (!project) return "";
    
    const summaryIntro = `【${project.title}】审查摘要\n\n`;
    const basicInfo = `研究类型: ${project.approvalType || "未指定"}\n研究子类型: ${project.reviewType || "未指定"}\n负责人: ${project.leader || "未指定"}\n院系: ${project.department || "未指定"}\n\n`;
    const aiAnalysis = project.aiSummary || "AI分析摘要暂未生成";
    
    return summaryIntro + basicInfo + aiAnalysis;
  }

  // 生成风险分析数据
  function getProjectRiskData(project: any) {
    if (!project || !project.risk) {
      return {
        level: "低",
        analysis: "风险分析数据暂未生成",
        suggestions: ["完善项目文档", "加强过程监管", "建立应急预案"]
      };
    }
    
    return {
      level: project.risk.level || "低",
      analysis: project.risk.analysis || "风险分析数据暂未生成",
      suggestions: project.risk.suggestions || ["完善项目文档", "加强过程监管", "建立应急预案"],
      lastUpdated: project.risk.lastUpdated || "2024-03-15 10:30",
      reviewer: project.risk.reviewer || "系统自动分析",
      confidenceLevel: project.risk.confidenceLevel || 85
    };
  }

  // 获取项目文件列表
  function getProjectFiles(project: any) {
    if (!project || !project.files) {
      return [
        {
          id: "default-1",
          name: "项目申请书.pdf",
          type: "application",
          size: "2.1MB",
          uploadedAt: "2024-03-10",
          status: "审核中",
          description: "项目的基本申请材料"
        },
        {
          id: "default-2", 
          name: "研究方案.docx",
          type: "protocol",
          size: "1.5MB",
          uploadedAt: "2024-03-10",
          status: "审核中",
          description: "详细的研究实施方案"
        },
        {
          id: "default-3",
          name: "知情同意书.pdf", 
          type: "consent",
          size: "0.8MB",
          uploadedAt: "2024-03-10",
          status: "审核中",
          description: "受试者知情同意相关文件"
        }
      ];
    }
    
    return project.files.map((file: any) => ({
      ...file,
      description: file.description || getFileDescription(file.type),
      reviewer: file.reviewer || "待分配",
      reviewComments: file.reviewComments || []
    }));
  }

  // 根据文件类型获取描述
  const getFileDescription = (type: string) => {
    const typeMap: { [key: string]: string } = {
      application: "项目申请相关文件",
      protocol: "研究方案文件",
      consent: "知情同意相关文件",
      protection: "数据保护方案",
      agreement: "合作协议文件",
      plan: "实施计划文件",
      quality: "质量控制文件",
      risk: "风险评估文件",
      security: "安全保护文件",
      review: "审查意见文件"
    };
    return typeMap[type] || "项目相关文件";
  };

  // 状态映射
  const mapStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      "submitted": "已提交",
      "formalPassed": "形审通过", 
      "formalRejected": "形审退回",
      "inReview": "审查中",
      "approved": "审核通过",
      "rejected": "审核拒绝"
    };
    return statusMap[status] || status;
  };

  // 获取状态颜色配置
  const getStatusColors = () => {
    return {
      "已提交": "bg-blue-50 text-blue-700 border-blue-200",
      "形审通过": "bg-green-50 text-green-700 border-green-200",
      "形审退回": "bg-red-50 text-red-700 border-red-200",
      "审核通过": "bg-green-50 text-green-700 border-green-200",
      "待审核": "bg-amber-50 text-amber-700 border-amber-200",
      "已退回": "bg-red-50 text-red-700 border-red-200",
      "审核中": "bg-blue-50 text-blue-700 border-blue-200"
    };
  };

  // 处理返回列表
  const handleBackToList = () => {
    router.push("/ethic-review/human-genetics-review");
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
    router.push("/ethic-review/human-genetics-review");
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
    
    // 添加调试日志
    console.log("当前项目数据:", {
      id: currentProject.id,
      title: currentProject.title,
      reviewType: currentProject.reviewType,
      approvalType: currentProject.approvalType
    });
    
    const baseFields = [
      {
        id: "reviewNumber",
        label: "受理号",
        value: currentProject.reviewNumber || currentProject.projectId || "未分配",
        icon: <FileSignature className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "approvalType",
        label: "审查类型",
        value: currentProject.approvalType || "未指定",
        icon: <FileCheck className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "leader",
        label: "负责人",
        value: currentProject.leader || (currentProject.projectLeader && currentProject.projectLeader.name) || "未指定",
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
    
    return baseFields;
  };

  return (
    <DetailPage
      id={params.id}
      title={projectTitle || currentProject.title || `人遗资源项目 ${params.id}`}
      status={currentProject.status || "未知状态"}
      statusLabel={currentProject.statusLabel || currentProject.status || "未知状态"}
      onTitleEdit={handleTitleEdit}
      onBack={handleBackToList}
      showReviewSidebar={true}
      reviewSidebar={
        <ReviewSidebar 
          status={currentProject.status}
          projectId={currentProject.id}
          projectTitle={currentProject.title}
          projectData={currentProject}
          getStatusColor={(status: string) => {
            const colors = getStatusColors();
            return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200";
          }}
        />
      }
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
        {
          id: "riskAnalysis",
          label: "风险分析",
          icon: <AlertTriangle className="h-4 w-4" />,
          component: <RiskAnalysisTab project={currentProject} />,
        },
      ]}
    />
  );
} 