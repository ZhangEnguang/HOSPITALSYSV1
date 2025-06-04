"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import DetailPage from "@/components/detail-page/detail-page"
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
    title: "新生儿遗传代谢病筛查方案评估",
    status: "形审通过",
    statusLabel: "形审通过", 
    reviewType: "遗传病筛查",
    approvalType: "国际合作临床试验",
    projectType: "人遗",
    department: "临床遗传科",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "王五",
    projectLeader: { name: "王五" },
    createdAt: "2024-03-30",
    deadline: "2024-03-30",
    submittedAt: "2024-03-25",
    approvedAt: "2024-03-25",
    reviewNumber: "GEN-2024-019",
    projectId: "GEN-2024-019",
    progress: 100,
    description: "评估扩展性新生儿遗传代谢病筛查方案的可行性和临床价值",
    geneticMaterial: "滤纸血片",
    sampleSize: 5000,
    geneticTest: "质谱分析、基因检测",
    dataProtection: "符合新生儿筛查数据保护规范",
    aiSummary: "【审核通过要点】\n• 筛查方案科学合理\n• 临床价值明确\n• 数据保护措施完善\n• 家长知情同意规范\n\n建议：可推广应用",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "低",
      analysis: "新生儿筛查为临床常规项目，风险可控。",
      suggestions: [
        "加强筛查结果沟通",
        "完善后续随访机制",
        "保护新生儿隐私"
      ]
    },
    files: [
      { id: "15", name: "筛查方案.pdf", type: "protocol", size: "3.2MB", uploadedAt: "2024-03-25", status: "审核通过" },
      { id: "16", name: "临床评估计划.pdf", type: "assessment", size: "2.0MB", uploadedAt: "2024-03-25", status: "审核通过" },
      { id: "17", name: "家长知情同意书.pdf", type: "consent", size: "1.1MB", uploadedAt: "2024-03-25", status: "审核通过" }
    ]
  },
  {
    id: "ETH-HG-2024-006",
    title: "帕金森病相关基因变异功能验证",
    status: "形审退回",
    statusLabel: "形审退回",
    reviewType: "遗传学研究",
    approvalType: "对外提供使用备案",
    projectType: "人遗",
    department: "遗传学研究所",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "张三",
    projectLeader: { name: "张三" },
    createdAt: "2024-02-28",
    deadline: "2024-02-28",
    submittedAt: "2024-02-25",
    returnedAt: "2024-02-25",
    reviewNumber: "GEN-2024-022",
    projectId: "GEN-2024-022",
    progress: 100,
    description: "对帕金森病相关基因变异进行功能验证和致病性评估",
    geneticMaterial: "口腔拭子、外周血",
    sampleSize: 200,
    geneticTest: "靶向基因测序、功能验证实验",
    dataProtection: "数据保护措施不完善，需重新制定",
    aiSummary: "【退回原因分析】\n• 对外提供使用方案不明确\n• 数据保护措施不完善\n• 合作方资质需要验证\n• 使用监管机制缺失\n\n建议：完善合作管理体系",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "高",
      analysis: "对外提供遗传资源涉及监管合规，需要严格审核。",
      suggestions: [
        "完善合作方资质审查",
        "建立使用监管机制",
        "加强数据流向追踪"
      ]
    },
    files: [
      { id: "18", name: "功能验证方案.pdf", type: "protocol", size: "2.8MB", uploadedAt: "2024-02-25", status: "需修改" },
      { id: "19", name: "对外提供协议.pdf", type: "agreement", size: "1.9MB", uploadedAt: "2024-02-25", status: "需修改" },
      { id: "20", name: "数据保护方案.pdf", type: "protection", size: "1.5MB", uploadedAt: "2024-02-25", status: "需修改" },
      { id: "21", name: "退回意见书.pdf", type: "review", size: "0.9MB", uploadedAt: "2024-02-25", status: "已生成" }
    ]
  },
  {
    id: "ETH-HG-2024-007",
    title: "罕见遗传病无创产前诊断研究",
    status: "已提交",
    statusLabel: "已提交",
    reviewType: "诊断性测序",
    approvalType: "重要家系资源备案",
    projectType: "人遗",
    department: "基因组学中心",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "李四",
    projectLeader: { name: "李四" },
    createdAt: "2024-07-15",
    deadline: "2024-07-15",
    submittedAt: "2024-07-15",
    reviewNumber: "GEN-2024-025",
    projectId: "GEN-2024-025",
    progress: 20,
    description: "研究无创产前诊断技术在罕见单基因遗传病诊断中的应用",
    geneticMaterial: "母体外周血",
    sampleSize: 300,
    geneticTest: "无创产前检测技术",
    dataProtection: "符合产前诊断数据特殊保护规范",
    aiSummary: "【审核要点摘要】\n• 技术创新性较强\n• 临床应用前景良好\n• 产前诊断伦理需要重点关注\n• 家系资源保护需要加强\n\n建议：重点评估伦理风险",
    aiModelName: "EthicGPT 2024", 
    aiModelVersion: "v3.1",
    risk: {
      level: "中高",
      analysis: "产前诊断涉及敏感的生育决策，需要谨慎处理伦理问题。",
      suggestions: [
        "加强遗传咨询服务",
        "完善知情同意流程",
        "建立心理支持机制"
      ]
    },
    files: [
      { id: "22", name: "无创诊断方案.pdf", type: "protocol", size: "3.5MB", uploadedAt: "2024-07-15", status: "待审核" },
      { id: "23", name: "家系资源管理方案.pdf", type: "management", size: "2.2MB", uploadedAt: "2024-07-15", status: "待审核" },
      { id: "24", name: "产前咨询方案.pdf", type: "counseling", size: "1.8MB", uploadedAt: "2024-07-15", status: "待审核" }
    ]
  },
  {
    id: "ETH-HG-2024-008",
    title: "肿瘤液体活检基因谱分析",
    status: "已提交",
    statusLabel: "已提交",
    reviewType: "基因组学研究",
    approvalType: "人遗采集审批",
    projectType: "人遗",
    department: "基因组学中心",
    ethicsCommittee: "人类遗传学伦理委员会",
    leader: "李四",
    projectLeader: { name: "李四" },
    createdAt: "2024-06-20",
    deadline: "2024-06-20", 
    submittedAt: "2024-06-20",
    reviewNumber: "GEN-2024-030",
    projectId: "GEN-2024-030",
    progress: 50,
    description: "基于循环肿瘤DNA的液体活检基因谱分析技术评估",
    geneticMaterial: "外周血、血浆",
    sampleSize: 150,
    geneticTest: "靶向基因测序、液体活检技术",
    dataProtection: "符合肿瘤患者遗传信息特殊保护规范",
    aiSummary: "【审核要点摘要】\n• 液体活检技术具有临床价值\n• 肿瘤患者特殊保护需要关注\n• 基因谱分析方案合理\n• 数据安全措施需要加强\n\n建议：重点关注患者权益保护",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "肿瘤患者群体较为脆弱，需要特殊的伦理保护措施。",
      suggestions: [
        "加强患者知情同意",
        "完善数据安全保护",
        "建立患者权益保障机制"
      ]
    },
    files: [
      { id: "25", name: "液体活检方案.pdf", type: "protocol", size: "4.1MB", uploadedAt: "2024-06-20", status: "待审核" },
      { id: "26", name: "基因谱分析计划.pdf", type: "analysis", size: "3.2MB", uploadedAt: "2024-06-20", status: "待审核" },
      { id: "27", name: "患者保护方案.pdf", type: "protection", size: "2.1MB", uploadedAt: "2024-06-20", status: "待审核" }
    ]
  }
];

// 伦理项目审查详情页
export default function EthicReviewDetail({ params }: { params: { id: string } }) {
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
          description: `无法找到ID为${params.id}的人遗资源项目详情`,
          variant: "destructive",
        });
        router.push("/ethic-review/human-genetics-review");
      }
    } catch (error) {
      console.error("加载项目详情时发生错误:", error);
      toast({
        title: "加载错误",
        description: "加载项目详情时发生错误，请稍后重试",
        variant: "destructive",
      });
      router.push("/ethic-review/human-genetics-review");
    }
  }, [params.id, router]);

  // 获取项目详情 - 根据多个属性查找
  const getProjectDetail = () => {
    const searchId = params.id;
    console.log("正在查找项目，搜索ID:", searchId);
    
    // 首先尝试从mockReviewProjects中查找
    let project = mockReviewProjects.find((p) => p.id === searchId);
    if (project) {
      console.log("在mockReviewProjects中找到项目:", project.id, project.title);
      return project;
    }
    
    // 如果在mockReviewProjects中没找到，再从演示数据中查找
    try {
      const { humanGeneticsReviewItems } = require("../data/human-genetics-review-demo-data");
      
      // 先检查是否直接匹配ID
      let listProject = humanGeneticsReviewItems.find((p: any) => p.id === searchId);
      
      // 如果没找到，则尝试匹配projectId
      if (!listProject) {
        listProject = humanGeneticsReviewItems.find((p: any) => p.projectId === searchId);
      }
      
      if (listProject) {
        console.log("在humanGeneticsReviewItems中找到项目:", listProject.id, listProject.name);
        
        // 将列表项目数据转换为详情页需要的格式
        const detailProject = {
          id: listProject.id,
          title: listProject.name,
          status: mapStatus(listProject.status),
          statusLabel: mapStatus(listProject.status),
          reviewType: listProject.reviewType,
          approvalType: listProject.approvalType,
          projectType: listProject.projectType,
          geneticMaterial: listProject.geneticMaterial || "未指定",
          sampleSize: listProject.sampleSize || "未指定",
          geneticTest: listProject.geneticTest || "未指定",
          dataProtection: listProject.dataProtection || "未指定",
          ethicsCommittee: listProject.ethicsCommittee,
          department: listProject.department,
          leader: listProject.projectLeader?.name || "未指定",
          projectLeader: listProject.projectLeader,
          createdAt: listProject.dueDate || "未指定",
          deadline: listProject.dueDate || "未指定",
          submittedAt: listProject.actualDate || listProject.dueDate || "未指定",
          reviewNumber: listProject.projectId,
          projectId: listProject.projectId,
          progress: listProject.completion || 0,
          description: listProject.description || "暂无描述",
          // 构建基于项目特性的AI审核摘要
          aiSummary: getProjectAiSummary(listProject),
          aiModelName: "EthicGPT 2024",
          aiModelVersion: "v3.1",
          // 构建基于项目特性的风险分析数据
          risk: getProjectRiskData(listProject),
          // 构建基于项目特性的文件列表
          files: getProjectFiles(listProject)
        };
        
        console.log("已转换项目数据:", detailProject.id, detailProject.title);
        return detailProject;
      } else {
        console.error("在所有数据源中均未找到ID为", searchId, "的项目");
        // 记录所有可用项目ID以便调试
        console.log("可用的项目ID列表:", humanGeneticsReviewItems.map((p: any) => p.id).join(", "));
        return null;
      }
    } catch (error) {
      console.error("无法加载或处理人遗资源项目数据:", error);
      return null;
    }
  };

  // 获取项目AI审核摘要
  function getProjectAiSummary(project: any) {
    // 根据项目ID或审批类型提供不同的AI摘要
    switch(project.id) {
      case "ETH-HG-2024-001":
        return "【审核要点摘要】\n• 研究设计科学合理\n• 遗传资源采集符合规范\n• 数据保护措施完善\n• 知情同意过程规范\n\n建议：可作为标准案例推广";
      case "ETH-HG-2024-004":
        return "【退回原因分析】\n• 数据库共享机制不符合人遗办规定\n• 跨境数据传输协议不完善\n• 未明确说明遗传资源出境目的\n• 未提供足够的数据安全保障措施\n\n建议：补充完善上述内容后重新提交";
      case "ETH-HG-2024-006":
        return "【退回原因分析】\n• 知情同意书缺乏遗传信息共享说明\n• 数据保护措施不完善\n• 样本储存方案不符合规范\n• 缺乏明确的样本使用范围限制\n\n建议：请按照人遗办最新规定完善申请材料";
      default:
        // 根据审批类型提供通用摘要
        if (project.approvalType === "人遗采集审批") {
          return "【审核要点摘要】\n• 研究设计科学合理\n• 遗传资源采集符合规范\n• 数据保护措施完善\n• 知情同意过程规范\n\n建议：可作为标准案例推广";
        } else if (project.approvalType === "材料出境审批") {
          return "【审核要点摘要】\n• 出境目的说明清晰\n• 合作方资质审核通过\n• 数据共享协议基本合规\n• 知识产权保护条款完善\n\n建议：明确数据使用期限与范围限制";
        } else {
          return "【审核要点摘要】\n• 项目伦理审查基本符合要求\n• 知情同意流程规范\n• 数据保护措施合理\n• 遗传咨询支持方案完善\n\n建议：持续监测数据安全与隐私保护措施执行情况";
        }
    }
  }

  // 获取项目风险分析数据
  function getProjectRiskData(project: any) {
    // 根据项目ID或审批类型提供不同的风险分析
    switch(project.id) {
      case "ETH-HG-2024-001":
        return {
          level: "中低",
          analysis: "该项目为BRCA1/2基因致病变异筛查，涉及癌症风险评估，需要妥善处理遗传风险告知与心理咨询。采集中符合人遗办相关规定，但需要加强数据保护。",
          suggestions: [
            "该人体项目跟踪报告相关内容",
            "强化基因数据脱敏与加密存储措施",
            "建立专业的遗传咨询团队支持",
            "确保符合最新的人类遗传资源保护条例"
          ]
        };
      case "ETH-HG-2024-004":
        return {
          level: "高",
          analysis: "该项目涉及大规模基因组数据库建设与材料出境，存在数据安全、隐私保护和遗传资源流失风险。当前的跨境数据传输协议与共享机制不符合人遗办最新规定。",
          suggestions: [
            "重新设计数据库访问权限控制机制",
            "完善跨境数据传输协议，确保符合人遗办规定",
            "明确数据使用范围与期限",
            "建立数据安全应急响应机制",
            "加强与合作方的数据保护协议约束"
          ]
        };
      case "ETH-HG-2024-006":
        return {
          level: "中高",
          analysis: "该项目涉及帕金森病相关基因变异研究，对外提供使用，存在数据保护不足与样本储存不规范问题。知情同意书中未充分说明遗传信息共享范围。",
          suggestions: [
            "完善知情同意书，明确说明数据共享范围",
            "建立符合规范的样本库管理体系",
            "强化数据安全保护技术措施",
            "限制遗传数据的使用范围与期限"
          ]
        };
      default:
        // 根据审批类型提供通用风险分析
        if (project.approvalType === "人遗采集审批") {
          return {
            level: "中",
            analysis: "人类遗传资源采集项目存在受试者知情同意、数据隐私保护和遗传信息解读等风险。需确保符合人遗办最新规定。",
            suggestions: [
              "规范知情同意流程，确保受试者充分理解",
              "加强数据加密与访问控制措施",
              "建立专业的遗传咨询支持系统",
              "严格遵循人遗办采集规范与流程"
            ]
          };
        } else if (project.approvalType === "材料出境审批") {
          return {
            level: "高",
            analysis: "涉及遗传资源出境的项目风险较高，包括数据安全风险、遗传资源流失风险和知识产权保护风险。",
            suggestions: [
              "完善合作协议中的知识产权条款",
              "建立出境材料追踪机制",
              "限定出境材料使用范围与期限",
              "确保符合《人类遗传资源管理条例》相关规定"
            ]
          };
        } else {
          return {
            level: "中",
            analysis: "人类遗传资源研究项目存在隐私保护、数据安全和遗传风险告知等方面的风险。需要平衡研究价值与受试者权益保护。",
            suggestions: [
              "加强数据安全保护措施",
              "完善受试者隐私保护机制",
              "建立规范的遗传咨询流程",
              "定期审核项目伦理合规性"
            ]
          };
        }
    }
  }

  // 获取项目文件列表
  function getProjectFiles(project: any) {
    // 根据项目ID提供不同的文件列表
    switch(project.id) {
      case "ETH-HG-2024-001":
        return [
          { id: "f1-1", name: "项目申请书.pdf", type: "application", size: "2.5MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-2", name: "人遗资源采集申请.pdf", type: "application", size: "1.8MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-3", name: "知情同意书.pdf", type: "consent", size: "1.2MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-4", name: "样本采集方案.docx", type: "protocol", size: "1.5MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-5", name: "数据安全保障措施.pdf", type: "security", size: "0.8MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-6", name: "遗传咨询流程.pdf", type: "protocol", size: "0.9MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-7", name: "伦理审查意见书.pdf", type: "review", size: "1.1MB", uploadedAt: "2024-03-13", status: "已生成" }
        ];
      case "ETH-HG-2024-004":
        return [
          { id: "f4-1", name: "项目申请书.pdf", type: "application", size: "3.2MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-2", name: "材料出境申请.pdf", type: "application", size: "2.1MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-3", name: "合作协议.pdf", type: "agreement", size: "4.5MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-4", name: "数据库共享方案.docx", type: "protocol", size: "1.8MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-5", name: "知情同意书.pdf", type: "consent", size: "1.3MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-6", name: "数据安全管理方案.pdf", type: "security", size: "1.5MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-7", name: "退回意见书.pdf", type: "review", size: "1.2MB", uploadedAt: "2024-04-23", status: "已生成" }
        ];
      case "ETH-HG-2024-006":
        return [
          { id: "f6-1", name: "项目申请书.pdf", type: "application", size: "2.6MB", uploadedAt: project.actualDate, status: "需修改" },
          { id: "f6-2", name: "对外提供使用备案申请.pdf", type: "application", size: "1.7MB", uploadedAt: project.actualDate, status: "需修改" },
          { id: "f6-3", name: "知情同意书.pdf", type: "consent", size: "0.9MB", uploadedAt: project.actualDate, status: "需修改" },
          { id: "f6-4", name: "样本库管理方案.docx", type: "protocol", size: "1.4MB", uploadedAt: project.actualDate, status: "需修改" },
          { id: "f6-5", name: "数据保护措施.pdf", type: "security", size: "0.7MB", uploadedAt: project.actualDate, status: "需修改" },
          { id: "f6-6", name: "合作方资质证明.pdf", type: "qualification", size: "2.2MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f6-7", name: "退回意见书.pdf", type: "review", size: "1.0MB", uploadedAt: "2024-02-27", status: "已生成" }
        ];
      default:
        // 为其他项目生成通用文件列表
        const files = [
          { id: `${project.id}-1`, name: "项目申请书.pdf", type: "application", size: "2.4MB", uploadedAt: project.actualDate || "未知", status: project.status === "形审通过" ? "已审核" : "待审核" },
          { id: `${project.id}-2`, name: `${project.approvalType}申请.pdf`, type: "application", size: "1.8MB", uploadedAt: project.actualDate || "未知", status: project.status === "形审通过" ? "已审核" : "待审核" },
          { id: `${project.id}-3`, name: "知情同意书.pdf", type: "consent", size: "1.2MB", uploadedAt: project.actualDate || "未知", status: project.status === "形审通过" ? "已审核" : "待审核" },
          { id: `${project.id}-4`, name: "研究方案.docx", type: "protocol", size: "1.7MB", uploadedAt: project.actualDate || "未知", status: project.status === "形审通过" ? "已审核" : "待审核" },
          { id: `${project.id}-5`, name: "数据保护方案.pdf", type: "security", size: "0.9MB", uploadedAt: project.actualDate || "未知", status: project.status === "形审通过" ? "已审核" : "待审核" }
        ];
        // 如果项目状态为审核通过，添加审查意见书
        if (project.status === "形审通过") {
          files.push({ 
            id: `${project.id}-6`, 
            name: "伦理审查意见书.pdf", 
            type: "review", 
            size: "1.1MB", 
            uploadedAt: project.actualDate ? new Date(project.actualDate).setDate(new Date(project.actualDate).getDate() + 3).toString() : "未知", 
            status: "已生成" 
          });
        }
        // 如果项目状态为已退回，添加退回意见书
        else if (project.status === "形审退回") {
          files.push({ 
            id: `${project.id}-6`, 
            name: "退回意见书.pdf", 
            type: "review", 
            size: "1.0MB", 
            uploadedAt: project.actualDate ? new Date(project.actualDate).setDate(new Date(project.actualDate).getDate() + 2).toString() : "未知", 
            status: "已生成" 
          });
        }
        return files;
    }
  }

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