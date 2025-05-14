"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import DetailPage from "@/components/detail-page/detail-page"
import { adaptEthicProjectForDetail } from "../../../../lib/adapters/ethic-project-adapter"
import {
  FileIcon,
  GitBranch,
  AlertTriangle,
  ClipboardList,
  PenSquare,
  Trash2,
  User,
  Users,
  FileText,
  Building2,
  FileCheck,
  BarChart3,
  Mail,
  Phone,
  ExternalLink,
  Tag,
  Bookmark,
  Stethoscope
} from "lucide-react"
import EthicProjectOverviewTab from "../components/overview-tab"
import ReviewProgressTab from "../components/tabs/review-progress-tab"
import ReviewFilesTab from "../components/tabs/review-files-tab"
import ExperimentProgressTab from "../components/experiment-progress-tab"
// @ts-ignore - 文件存在但类型可能有问题
import RiskAnalysisTab from "../components/risk-analysis-tab"
import ProjectTeamTab from "../../components/tabs/project-team-tab"
import "../../styles/ethic-project.css"
import React from "react"

// 添加全局样式覆盖
const globalStyles = `
  /* 覆盖详情页右侧空白区域的样式 */
  .ethic-project-detail div[class*="overflow-auto"] {
    padding-right: 0 !important;
  }
  
  /* 移除右侧占位区域 */
  .ethic-project-detail > div {
    max-width: 100% !important;
    width: 100% !important;
  }
  
  .ethic-project-detail > div > div {
    padding-right: 0 !important;
    margin-right: 0 !important;
  }
  
  /* 修复布局问题 */
  .detail-layout-wrapper {
    max-width: none !important;
    padding-right: 0 !important;
  }
  
  /* 移除不必要的右侧空白 */
  .detail-container {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  /* 增强对右侧审核信息区域的移除 */
  .ethic-project-detail [class*="grid-cols-"] {
    grid-template-columns: 1fr !important;
  }
  
  .ethic-project-detail [data-sidebar="true"] {
    display: none !important;
  }
  
  /* 确保内容区域占满整个页面宽度 */
  .ethic-project-detail [class*="col-span-"] {
    grid-column: span 12 / span 12 !important;
  }
`;

// AI摘要类型定义
interface AISummary {
  content: string;
  aiModel: string;
  version: string;
  recommendations: string[];
  confidenceScore: number;
  analysisTime: string;
  platformScores: {
    progress: string;
    risk: string;
    achievement: string;
  };
}

// 人体伦理项目模拟数据
const humanEthicProjects = [
  {
    id: "2",
    name: "2型糖尿病新药临床试验",
    description: "评估新型口服降糖药物的安全性和有效性",
    status: "规划中",
    projectType: "药物临床试验",
    participantCount: "200人",
    ethicsCommittee: "北京医学伦理委员会",
    researchUnit: "内分泌科",
    leader: { name: "李主任", title: "主任医师", email: "li@example.com", phone: "13800000002" },
    createdAt: "2023-11-05",
    progress: 15,
    tasks: { completed: 1, total: 7 },
    type: "人体伦理",
    source: "制药企业合作项目",
    startDate: "2024-03-01", 
    endDate: "2025-12-31",
    budget: 1200000,
    auditStatus: "待审核",
    priority: "中",
    projectNumber: "人伦2025002",
    department: "临床医学院",
    members: [
      { name: "陈博士", title: "博士后", department: "临床医学院", role: "项目协调", contact: "chen@example.com" },
      { name: "吴医生", title: "主治医师", department: "内分泌科", role: "患者评估", contact: "wu@example.com" },
      { name: "周技术员", title: "技术员", department: "临床检验中心", role: "样本分析", contact: "13800000005" }
    ]
  },
  {
    id: "3",
    name: "多人种样本基因测序与健康风险预测",
    description: "采集不同人种血液样本进行基因组测序分析，研究疾病易感性与健康风险预测",
    status: "进行中",
    projectType: "基因研究",
    participantCount: "500人",
    ethicsCommittee: "北京医学伦理委员会",
    researchUnit: "基因组医学中心",
    leader: { name: "王建国", title: "教授", email: "wang@example.com", phone: "13800138000" },
    createdAt: "2024-01-01",
    progress: 35,
    tasks: { completed: 12, total: 36 },
    type: "人体伦理",
    source: "国家重点研发计划",
    startDate: "2024-01-15", 
    endDate: "2027-12-31",
    budget: 2450000,
    auditStatus: "审核通过",
    priority: "高",
    projectNumber: "人伦2025001",
    department: "基础医学系",
    members: [
      { name: "李助理", title: "助理研究员", department: "基础医学系", role: "数据分析", contact: "li@example.com" },
      { name: "张博士", title: "博士后", department: "公共卫生学院", role: "样本采集", contact: "zhang@example.com" }
    ]
  },
  // 添加与mockEthicProjects中ID为5的项目相匹配的项目
  {
    id: "5",
    name: "新生儿肺带血干细胞提取技术评估",
    description: "研究新生儿肺带血干细胞提取技术的临床安全性与有效性，评估伦理标准",
    status: "进行中",
    projectType: "干细胞研究", 
    participantCount: "80人",
    ethicsCommittee: "北京医学伦理委员会",
    researchUnit: "儿科学系",
    leader: { name: "孙丽娜", title: "教授", email: "sun@example.com", phone: "13800000555" },
    createdAt: "2024-02-01",
    progress: 45,
    tasks: { completed: 9, total: 20 },
    type: "人体伦理",
    source: "国家自然科学基金",
    startDate: "2024-02-15", 
    endDate: "2025-12-15",
    budget: 920000,
    auditStatus: "审核中",
    priority: "中",
    projectNumber: "人伦2025002",
    department: "儿科学系",
    members: [
      { name: "王研究员", title: "副研究员", department: "儿科学系", role: "技术开发", contact: "wang@example.com" },
      { name: "李医生", title: "主治医师", department: "新生儿科", role: "临床评估", contact: "li@example.com" },
      { name: "张技术员", title: "高级技术员", department: "细胞库", role: "样本处理", contact: "zhang@example.com" }
    ]
  },
  // 添加ID为7的老年痴呆症患者实验性药物临床试验项目
  {
    id: "7",
    name: "老年痴呆症患者实验性药物临床试验",
    description: "针对老年痴呆症患者的实验性药物临床试验，评估药效与安全性",
    status: "进行中",
    projectType: "临床试验",
    participantCount: "150人",
    ethicsCommittee: "北京医学伦理委员会",
    researchUnit: "神经内科",
    leader: { name: "郑海涛", title: "主任医师", email: "zheng@example.com", phone: "13900139001" },
    createdAt: "2024-01-05",
    progress: 30,
    tasks: { completed: 9, total: 30 },
    type: "人体伦理",
    source: "国家重点研发计划",
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    budget: 1680000,
    auditStatus: "审核通过",
    priority: "高",
    projectNumber: "人伦2025003",
    department: "神经内科学系",
    members: [
      { name: "李研究员", title: "副研究员", department: "神经内科", role: "项目协调", contact: "li@example.com" },
      { name: "张医生", title: "主治医师", department: "精神科", role: "患者评估", contact: "zhang@example.com" },
      { name: "王技术员", title: "实验技术员", department: "药理实验室", role: "药理分析", contact: "wang@example.com" }
    ]
  },
  // 添加ID为9的孕妇胎儿血液采集技术伦理研究项目
  {
    id: "9",
    name: "孕妇胎儿血液采集技术伦理研究",
    description: "研究孕妇胎儿血液采集技术的安全性与伦理规范，制定相关标准",
    status: "规划中",
    projectType: "伦理规范研究",
    participantCount: "90人",
    ethicsCommittee: "北京医学伦理委员会",
    researchUnit: "妇产科",
    leader: { name: "刘晓峰", title: "教授", email: "liu@example.com", phone: "13800138009" },
    createdAt: "2024-06-10",
    progress: 0,
    tasks: { completed: 0, total: 24 },
    type: "人体伦理",
    source: "省级科研基金",
    startDate: "2024-07-01",
    endDate: "2025-12-31",
    budget: 750000,
    auditStatus: "待审核",
    priority: "高",
    projectNumber: "人伦2025004",
    department: "妇产科学系",
    members: [
      { name: "张主任", title: "主任医师", department: "妇产科", role: "临床指导", contact: "zhang@example.com" },
      { name: "李博士", title: "博士后", department: "伦理学研究中心", role: "伦理规范制定", contact: "li@example.com" },
      { name: "王医生", title: "副主任医师", department: "产科", role: "技术实施", contact: "wang@example.com" }
    ]
  },
  // 添加ID为11的人体干细胞移植治疗帕金森病研究项目
  {
    id: "11",
    name: "人体干细胞移植治疗帕金森病研究",
    description: "研究人体干细胞移植治疗帕金森病的临床疗效与安全性评估",
    status: "进行中",
    projectType: "干细胞治疗",
    participantCount: "60人",
    ethicsCommittee: "北京医学伦理委员会",
    researchUnit: "神经科学研究所",
    leader: { name: "周健", title: "研究员", email: "zhou@example.com", phone: "13800138011" },
    createdAt: "2024-03-15",
    progress: 20,
    tasks: { completed: 5, total: 25 },
    type: "人体伦理",
    source: "国家自然科学基金",
    startDate: "2024-04-01",
    endDate: "2027-03-31",
    budget: 1350000,
    auditStatus: "审核中",
    priority: "高",
    projectNumber: "人伦2025005",
    department: "干细胞研究中心",
    members: [
      { name: "林教授", title: "教授", department: "干细胞研究中心", role: "技术指导", contact: "lin@example.com" },
      { name: "张医生", title: "主治医师", department: "神经内科", role: "临床实施", contact: "zhang@example.com" },
      { name: "王技术员", title: "高级技术员", department: "细胞培养室", role: "细胞培养", contact: "wang@example.com" }
    ]
  }
];

// 项目AI摘要内容
const projectAISummaries: { [key: string]: AISummary } = {
  "2": {
    content: "【伦理规范执行情况】\n• 已提交伦理委员会申请（流程号：IRB-2024-02-18）\n• 试验方案评分92/100（优秀）\n\n【患者保护措施】\n• 全面的安全监测计划\n• 明确的受试者退出标准\n• 完善的数据保密措施\n\n【研究准备】\n• 研究者培训已完成\n• 试验药物准备就绪",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "完善受试者筛选标准",
      "增加中期安全性评估节点"
    ],
    confidenceScore: 92,
    analysisTime: "2024-02-20 15:47",
    platformScores: {
      progress: "一般",
      risk: "中等",
      achievement: "待评估"
    }
  },
  "3": {
    content: "【伦理规范执行情况】\n• 已获得伦理委员会批准（批准号：IRB-2024-01-20）\n• 知情同意实施评分90/100（良好）\n\n【样本采集保障】\n• 严格的隐私保护措施\n• 完善的知情同意流程\n• 样本编码匿名化处理\n\n【研究现状】\n• 已完成30%样本采集\n• 初步数据分析显示种族间基因差异明显",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "增加少数民族样本比例",
      "完善数据安全存储方案"
    ],
    confidenceScore: 93,
    analysisTime: "2024-03-10 09:45",
    platformScores: {
      progress: "良好",
      risk: "中等",
      achievement: "良好"
    }
  },
  "5": {
    content: "【伦理规范执行情况】\n• 伦理委员会审核中（流程号：IRB-2024-02-15）\n• 方案设计评分94/100（优秀）\n\n【患者保护措施】\n• 新生儿安全防护机制完善\n• 家长全程知情同意流程\n• 样本保存符合国家标准\n\n【研究进展】\n• 技术团队培训已完成\n• 初步实验结果显示干细胞活性良好",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "优化干细胞提取步骤",
      "增加长期保存稳定性评估"
    ],
    confidenceScore: 91,
    analysisTime: "2024-03-12 14:22",
    platformScores: {
      progress: "良好",
      risk: "低",
      achievement: "待评估"
    }
  },
  "7": {
    content: "【伦理规范执行情况】\n• 已获得伦理委员会批准（批准号：IRB-2024-01-10）\n• 知情同意实施评分93/100（优秀）\n\n【患者保护措施】\n• 认知障碍患者知情同意特殊流程\n• 家属全程参与决策机制\n• 严格的不良反应监测系统\n\n【研究进展】\n• 已完成首批患者筛选入组\n• 初步安全性数据显示良好耐受性",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "加强长期随访管理",
      "细化认知能力评估工具"
    ],
    confidenceScore: 94,
    analysisTime: "2024-03-05 11:20",
    platformScores: {
      progress: "良好",
      risk: "中等",
      achievement: "待评估"
    }
  },
  "9": {
    content: "【伦理规范准备情况】\n• 伦理委员会申请准备中（预计流程号：IRB-2024-06-25）\n• 方案设计评分91/100（良好）\n\n【患者保护措施规划】\n• 孕妇与胎儿双重安全保障措施\n• 详尽的风险评估与应对预案\n• 特殊人群知情同意强化流程\n\n【前期准备】\n• 技术团队已完成培训\n• 安全性预评估完成",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "增强心理支持服务体系",
      "建立胎儿安全实时监测机制"
    ],
    confidenceScore: 90,
    analysisTime: "2024-06-15 09:30",
    platformScores: {
      progress: "待启动",
      risk: "中等",
      achievement: "待评估"
    }
  },
  "11": {
    content: "【伦理规范执行情况】\n• 伦理委员会审核中（流程号：IRB-2024-03-30）\n• 方案设计评分95/100（优秀）\n\n【患者保护措施】\n• 干细胞来源严格审核\n• 移植过程安全保障体系\n• 全程副作用监测机制\n\n【研究进展】\n• 已完成干细胞制备与鉴定\n• 患者筛选标准确立",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "完善长期预后评估体系",
      "增加免疫排斥反应监测频率"
    ],
    confidenceScore: 92,
    analysisTime: "2024-04-10 15:35",
    platformScores: {
      progress: "初期",
      risk: "较高",
      achievement: "待评估"
    }
  }
};

// 接口定义
interface Params {
  id: string;
}

// 人体伦理项目详情页面
export default function HumanEthicProjectDetailPage({ params }: { params: { id: string } }) {
  // 使用解构处理
  const { id } = params;
  const projectId = id;
  
  const router = useRouter();
  const [projectTitle, setProjectTitle] = useState("");
  const [currentProject, setCurrentProject] = useState<any>(null);

  // 模拟获取项目详情数据
  useEffect(() => {
    const projectDetail = getProjectDetail();
    if (projectDetail) {
      setProjectTitle(projectDetail.name);
      setCurrentProject(projectDetail);
    } else {
      toast({
        title: "未找到项目",
        description: "无法找到该项目详情",
        variant: "destructive",
      });
      router.push("/ethic-projects/human");
    }
  }, [projectId, router]);

  // 获取项目详情
  const getProjectDetail = () => {
    // 使用projectId查找项目
    console.log("正在查找人体伦理项目ID:", projectId, "类型:", typeof projectId);
    console.log("数据库中所有ID:", humanEthicProjects.map(p => ({id: p.id, type: typeof p.id})));
    
    // 使用类型转换确保比较时类型一致
    const project = humanEthicProjects.find((p) => String(p.id) === String(projectId));
    if (!project) {
      console.error("未找到人体伦理项目:", projectId);
      return null;
    }
    
    console.log("找到人体伦理项目:", project.name, "项目ID:", project.id);

    // 添加AI摘要数据
    const aiSummaryId = String(projectId);
    const aiSummary = projectAISummaries[aiSummaryId];
    if (aiSummary) {
      console.log("找到AI摘要数据，ID:", aiSummaryId);
      return {
        ...project,
        aiSummary: aiSummary.content,
        aiModelName: aiSummary.aiModel,
        aiModelVersion: aiSummary.version,
        aiSuggestions: aiSummary.recommendations,
        progressScore: aiSummary.platformScores.progress,
        riskScore: aiSummary.platformScores.risk,
        achievementScore: aiSummary.platformScores.achievement,
        confidenceScore: aiSummary.confidenceScore,
        analysisTime: aiSummary.analysisTime,
      };
    } else {
      console.log("未找到AI摘要数据，ID:", aiSummaryId);
    }

    return project;
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "高":
        return "bg-red-100 text-red-600";
      case "中":
        return "bg-amber-100 text-amber-600";
      case "低":
        return "bg-green-100 text-green-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // 返回列表页
  const handleBackToList = () => {
    router.push("/ethic-projects/human");
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
    router.push(`/ethic-projects/edit/human/${projectId}`);
  };

  // 删除项目
  const handleDeleteProject = () => {
    toast({
      title: "项目已删除",
      description: "项目已成功删除",
    });
    router.push("/ethic-projects/human");
  };

  if (!currentProject) {
    return <div className="p-8 text-center">加载中...</div>;
  }

  return (
    <DetailPage
      id={projectId}
      title={projectTitle}
      onTitleEdit={handleTitleEdit}
      onBack={handleBackToList}
      showReviewSidebar={false}
      fields={[
        {
          id: "leader",
          label: "负责人",
          value: currentProject.leader?.name || "未指定",
          icon: <User className="h-4 w-4 text-gray-400" />,
        },
        {
          id: "projectType",
          label: "项目类型",
          value: currentProject.projectType,
          icon: <Tag className="h-4 w-4 text-gray-400" />,
        },
        {
          id: "participantCount",
          label: "参与人数",
          value: currentProject.participantCount,
          icon: <Users className="h-4 w-4 text-gray-400" />,
        },
        {
          id: "ethicsCommittee",
          label: "伦理委员会",
          value: currentProject.ethicsCommittee,
          icon: <Building2 className="h-4 w-4 text-gray-400" />,
        }
      ]}
      actions={[
        {
          id: "edit",
          icon: <PenSquare className="h-4 w-4" />,
          label: "编辑",
          onClick: handleEditProject,
        },
        {
          id: "delete",
          icon: <Trash2 className="h-4 w-4" />,
          label: "删除",
          variant: "destructive",
          onClick: handleDeleteProject,
        },
      ]}
      tabs={[
        {
          id: "overview",
          label: "项目概要",
          icon: <FileIcon className="h-4 w-4" />,
          component: <EthicProjectOverviewTab todo={currentProject} getPriorityColor={getPriorityColor} />,
        },
        {
          id: "reviewProgress",
          label: "审查进度",
          icon: <FileCheck className="h-4 w-4" />,
          component: <ReviewProgressTab projectId={projectId} projectType="human" />,
        },
        {
          id: "experimentProgress",
          label: "研究进度与结果",
          icon: <BarChart3 className="h-4 w-4" />,
          component: <ExperimentProgressTab />,
        },
        {
          id: "riskAnalysis",
          label: "风险与分析",
          icon: <AlertTriangle className="h-4 w-4" />,
          component: <RiskAnalysisTab todo={currentProject} />,
        },
        {
          id: "reviewFiles",
          label: "送审文件",
          icon: <FileText className="h-4 w-4" />,
          component: <ReviewFilesTab />,
        },
      ]}
    />
  );
} 