"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import DetailPage from "@/components/detail-page/detail-page"

import {
  FileIcon,
  AlertTriangle,
  PenSquare,
  Trash2,
  User,
  FileText,
  Building2,
  FileCheck,
  BarChart3,
  Users,
  Tag,
} from "lucide-react"
import EthicProjectOverviewTab from "../components/overview-tab"
import ReviewProgressTab from "../../components/tabs/review-progress-tab"
import ExperimentProgressTab from "../components/experiment-progress-tab"
import ReviewFilesTab from "../components/review-files-tab"
import RiskAnalysisTab from "../components/risk-analysis-tab"
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

// 动态生成AI摘要的函数
const generateAISummary = (project: any, reviewData?: any[], uploadData?: any[]): AISummary => {
  const progress = project.progress || 0;
  const status = project.status || "未知";
  const priority = project.priority || "中";
  
  // 基于项目数据生成智能摘要
  const summaryParts = [
    `这项${project.type === "人体伦理" ? "人体" : "动物"}伦理项目已通过${project.ethicsCommittee}审批，当前项目状态为${status}。`,
    `项目涉及${project.type === "人体伦理" ? `${project.participantCount}受试者，类型为${project.projectType}` : `${project.animalCount}实验${project.animalType}`}，进度完成${progress}%。`,
    `数据质量评分为${Math.floor(Math.random() * 10) + 85}分（良好），样本采集覆盖率达${Math.floor(Math.random() * 20) + 80}%。`,
  ];
  
  const riskFactors = [];
  if (progress < 30) riskFactors.push("进度偏慢");
  if (priority === "高") riskFactors.push("高优先级项目");
  if (status === "待审核") riskFactors.push("待审核状态");
  
  if (riskFactors.length > 0) {
    summaryParts.push(`当前识别到的风险因素包括：${riskFactors.join("、")}。`);
  }
  
  // 生成建议
  const recommendations = [];
  if (progress < 50) {
    recommendations.push("建议加快项目执行进度，确保按时完成各阶段目标");
  }
  if (priority === "高") {
    recommendations.push("作为高优先级项目，建议增加资源投入和监督频率");
  }
  recommendations.push("定期进行伦理合规性检查，确保研究过程符合伦理要求");
  recommendations.push("加强数据质量控制和样本管理，提高研究结果可靠性");
  
  // 计算合规评分
  const complianceScore = Math.floor(Math.random() * 15) + 85;
  const dataQualityScore = Math.floor(Math.random() * 10) + 85;
  
  return {
    content: summaryParts.join(" "),
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations,
    confidenceScore: Math.floor(Math.random() * 10) + 90,
    analysisTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
    platformScores: {
      progress: progress > 70 ? "优秀" : progress > 40 ? "良好" : "一般",
      risk: complianceScore > 90 ? "低" : "中等",
      achievement: dataQualityScore > 90 ? "优秀" : "良好"
    }
  };
};

// 项目AI摘要内容 - 现在使用动态生成
const projectAISummaries: { [key: string]: AISummary } = {};

// 接口定义
interface Params {
  id: string;
}

// 人体伦理项目详情页面
export default function HumanEthicProjectDetailPage({ params }: { params: { id: string } }) {
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
  }, [params.id, router]);

  // 获取项目详情
  const getProjectDetail = () => {
    // 确保使用正确的ID查找项目
    const projectId = params.id;
    console.log("正在查找人体伦理项目ID:", projectId);
    
    const project = humanEthicProjects.find((p) => p.id === projectId);
    if (!project) {
      console.error("未找到人体伦理项目:", projectId);
      return null;
    }
    
    console.log("找到人体伦理项目:", project.name);

    // 动态生成AI摘要数据
    // 模拟获取审查数据和上传数据
    const reviewData: any[] = []; // 这里可以从API获取实际的审查数据
    const uploadData: any[] = []; // 这里可以从API获取实际的上传数据
    
    const aiSummary = generateAISummary(project, reviewData, uploadData);
    
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
    router.push(`/ethic-projects/human/edit/${params.id}`);
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
      id={params.id}
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
          label: "研究类型", 
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
          component: <ReviewProgressTab projectId={params.id} projectType="human" />,
        },
        {
          id: "experimentProgress",
          label: "实验数据",
          icon: <BarChart3 className="h-4 w-4" />,
          component: <ExperimentProgressTab />,
        },
        {
          id: "reviewFiles",
          label: "送审文件",
          icon: <FileText className="h-4 w-4" />,
          component: <ReviewFilesTab projectId={params.id} />,
        },
        {
          id: "riskAnalysis",
          label: "风险与分析",
          icon: <AlertTriangle className="h-4 w-4" />,
          component: <RiskAnalysisTab todo={currentProject} />,
        },
      ]}
    />
  );
} 