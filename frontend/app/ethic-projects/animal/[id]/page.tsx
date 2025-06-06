// @ts-nocheck
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
  PawPrint,
  FileText,
  Building2,
  FileCheck,
  BarChart3,
  Users,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react"
import EthicProjectOverviewTab from "../components/overview-tab"
import ReviewProgressTab from "../../components/tabs/review-progress-tab"
import ReviewFilesTab from "../../components/tabs/review-files-tab"
import ExperimentProgressTab from "../components/experiment-progress-tab"
import RiskAnalysisTab from "../components/risk-analysis-tab"
import ProjectTeamTab from "../../components/tabs/project-team-tab"
import "../../styles/ethic-project.css"

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

// 动物伦理项目模拟数据
const animalEthicProjects = [
  {
    id: "1",
    name: "实验大鼠药代谢研究",
    description: "研究药物在大鼠体内的代谢过程及其机制",
    status: "进行中",
    animalType: "大鼠", 
    animalCount: "85只",
    ethicsCommittee: "医学院伦理审查委员会",
    facilityUnit: "基础医学实验中心",
    leader: { name: "王教授", title: "教授", email: "wang@example.com", phone: "13800000001" },
    createdAt: "2023-10-12",
    progress: 35,
    tasks: { completed: 3, total: 8 },
    type: "动物伦理",
    source: "国家自然科学基金",
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    budget: 850000,
    auditStatus: "审核通过",
    priority: "高",
    projectNumber: "动伦2025001",
    department: "基础医学院",
    members: [
      { 
        name: "李助理", 
        title: "研究助理", 
        department: "基础医学院", 
        role: "实验操作", 
        email: "li@example.com", 
        phone: "13800000010",
        workYears: 3,
        specialty: "动物实验操作",
        education: "硕士",
        joinDate: "2022-03-15"
      },
      { 
        name: "张技术员", 
        title: "高级技术员", 
        department: "基础医学院", 
        role: "数据分析", 
        email: "zhang@example.com", 
        phone: "13800000011",
        workYears: 8,
        specialty: "生物统计分析",
        education: "本科",
        joinDate: "2019-07-20"
      },
      { 
        name: "刘研究员", 
        title: "副研究员", 
        department: "药理学系", 
        role: "实验设计", 
        email: "liu@example.com", 
        phone: "13800000003",
        workYears: 12,
        specialty: "药物药理学",
        education: "博士",
        joinDate: "2018-09-01"
      },
      { 
        name: "赵博士", 
        title: "博士后", 
        department: "基础医学院", 
        role: "实验监督", 
        email: "zhao@example.com", 
        phone: "13800000012",
        workYears: 5,
        specialty: "细胞分子生物学",
        education: "博士",
        joinDate: "2021-11-10"
      }
    ]
  },
  {
    id: "2",
    name: "小鼠造血干细胞分化实验",
    description: "研究小鼠造血干细胞的分化过程与调控机制",
    status: "规划中",
    animalType: "小鼠",
    animalCount: "120只",
    ethicsCommittee: "医学院伦理审查委员会",
    facilityUnit: "免疫学实验中心",
    leader: { name: "李研究员", title: "研究员", email: "li@example.com", phone: "13800000002" },
    createdAt: "2023-11-05",
    progress: 15,
    tasks: { completed: 1, total: 7 },
    type: "动物伦理",
    source: "省级科研基金",
    startDate: "2024-03-01", 
    endDate: "2025-12-31",
    budget: 720000,
    auditStatus: "待审核",
    priority: "中",
    projectNumber: "动伦2025002",
    department: "临床医学院",
    members: [
      { 
        name: "陈博士", 
        title: "博士后", 
        department: "临床医学院", 
        role: "项目协调", 
        email: "chen@example.com", 
        phone: "13800000020",
        workYears: 4,
        specialty: "造血干细胞研究",
        education: "博士",
        joinDate: "2021-08-15"
      },
      { 
        name: "吴老师", 
        title: "讲师", 
        department: "临床医学院", 
        role: "实验设计", 
        email: "wu@example.com", 
        phone: "13800000021",
        workYears: 6,
        specialty: "免疫学研究",
        education: "博士",
        joinDate: "2020-03-01"
      },
      { 
        name: "周技术员", 
        title: "技术员", 
        department: "免疫学实验中心", 
        role: "实验操作", 
        email: "zhou@example.com", 
        phone: "13800000005",
        workYears: 2,
        specialty: "实验技术操作",
        education: "本科",
        joinDate: "2023-01-10"
      }
    ]
  },
  {
    id: "3",
    name: "兔脊髓损伤修复研究",
    description: "通过神经干细胞移植技术研究兔脊髓损伤的修复机制",
    status: "已完成",
    animalType: "兔子",
    animalCount: "30只",
    ethicsCommittee: "医学院伦理审查委员会",
    facilityUnit: "神经科学实验中心",
    leader: { name: "张副教授", title: "副教授", email: "zhang@example.com", phone: "13800000003" },
    createdAt: "2023-08-20",
    progress: 100,
    tasks: { completed: 6, total: 6 },
    type: "动物伦理",
    source: "校级研究项目",
    startDate: "2023-09-01", 
    endDate: "2024-03-31",
    budget: 350000,
    auditStatus: "审核通过",
    priority: "高",
    projectNumber: "动伦2025003",
    department: "神经科学学院",
    members: [
      { 
        name: "孙医生", 
        title: "主治医师", 
        department: "附属医院", 
        role: "临床指导", 
        email: "sun@example.com", 
        phone: "13800000030",
        workYears: 10,
        specialty: "神经外科医学",
        education: "博士",
        joinDate: "2019-05-20"
      },
      { 
        name: "钱技术员", 
        title: "高级技术员", 
        department: "神经科学实验中心", 
        role: "实验操作", 
        email: "qian@example.com", 
        phone: "13800000007",
        workYears: 7,
        specialty: "神经电生理技术",
        education: "硕士",
        joinDate: "2020-09-01"
      },
      { 
        name: "郑博士", 
        title: "博士研究生", 
        department: "神经科学学院", 
        role: "数据分析", 
        email: "zheng@example.com", 
        phone: "13800000031",
        workYears: 3,
        specialty: "生物信息学分析",
        education: "博士在读",
        joinDate: "2022-09-01"
      }
    ]
  }
];

// 生成动态AI摘要的函数
const generateAISummary = (project: any, reviewData?: any[], uploadData?: any[]): AISummary => {
  // 获取项目基本信息
  const projectName = project.name;
  const projectStatus = project.status;
  const animalType = project.animalType;
  const animalCount = project.animalCount;
  const progress = project.progress;
  const ethicsCommittee = project.ethicsCommittee;
  
  // 模拟审查数据分析
  const reviewCount = reviewData?.length || Math.floor(Math.random() * 3) + 2;
  const approvedReviews = Math.floor(reviewCount * 0.8);
  const pendingReviews = reviewCount - approvedReviews;
  
  // 模拟上传数据分析
  const uploadCount = uploadData?.length || Math.floor(Math.random() * 5) + 3;
  const dataQualityScore = Math.floor(Math.random() * 20) + 80; // 80-100分
  
  // 根据项目状态和进度生成内容
  let statusDescription = "";
  let ethicsCompliance = "";
  let animalWelfare = "";
  let dataAnalysis = "";
  let recommendations = [];
  
  // 伦理合规分析
  const complianceScore = Math.floor(Math.random() * 20) + 85;
  ethicsCompliance = `该项目已通过${ethicsCommittee}审批，伦理合规评分${complianceScore}/100分。`;
  
  // 动物福利分析
  animalWelfare = `项目涉及${animalType}${animalCount}，严格遵循3R原则（替代、减少、优化），建立了完善的动物福利保障体系。`;
  
  // 审查进度分析
  if (approvedReviews > 0) {
    statusDescription += `已完成${approvedReviews}项伦理审查并获得批准`;
    if (pendingReviews > 0) {
      statusDescription += `，另有${pendingReviews}项审查正在进行中`;
    }
    statusDescription += "。";
  }
  
  // 数据上传分析
  if (uploadCount > 0) {
    dataAnalysis = `项目已上传${uploadCount}批实验数据，数据质量评分${dataQualityScore}分，数据完整性和规范性良好。`;
  }
  
  // 根据进度给出建议
  if (progress < 30) {
    recommendations.push("建议加快初期实验准备工作");
    recommendations.push("完善实验动物饲养环境标准化");
  } else if (progress < 70) {
    recommendations.push("持续监控动物健康状态");
    recommendations.push("及时记录和分析实验数据");
  } else {
    recommendations.push("准备项目结题材料和成果总结");
    recommendations.push("考虑研究成果的转化应用");
  }
  
  // 根据项目状态生成针对性的分析
  let statusAnalysis = "";
  if (projectStatus === "进行中") {
    statusAnalysis = `项目正在有序推进中，已达到${progress}%的完成度。`;
  } else if (projectStatus === "规划中") {
    statusAnalysis = `项目处于规划阶段，各项准备工作正在进行中。`;
  } else if (projectStatus === "已完成") {
    statusAnalysis = `项目已成功完成，取得了预期的研究成果。`;
  } else if (projectStatus === "已暂停") {
    statusAnalysis = `项目目前处于暂停状态，需要重新评估和调整。`;
  }
  
  // 生成综合摘要
  const content = `${ethicsCompliance}${animalWelfare}${statusDescription}${dataAnalysis}${statusAnalysis}在动物伦理规范执行、实验数据管理和研究进展监控等方面均符合相关标准要求，体现了良好的科研伦理素养和规范的项目管理水平。`;
  
  return {
    content,
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

// 动物伦理项目详情页面
export default function AnimalEthicProjectDetailPage({ params }: { params: { id: string } }) {
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
      router.push("/ethic-projects/animal");
    }
  }, [params.id, router]);

  // 获取项目详情
  const getProjectDetail = () => {
    // 确保使用正确的ID查找项目
    const projectId = params.id;
    console.log("正在查找动物伦理项目ID:", projectId);
    
    const project = animalEthicProjects.find((p) => p.id === projectId);
    if (!project) {
      console.error("未找到动物伦理项目:", projectId);
      return null;
    }
    
    console.log("找到动物伦理项目:", project.name);

    // 动态生成AI摘要数据
    // 模拟获取审查数据和上传数据
    const reviewData = []; // 这里可以从API获取实际的审查数据
    const uploadData = []; // 这里可以从API获取实际的上传数据
    
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
    router.push("/ethic-projects/animal");
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
    router.push(`/ethic-projects/animal/edit/${params.id}`);
  };

  // 删除项目
  const handleDeleteProject = () => {
    toast({
      title: "项目已删除",
      description: "项目已成功删除",
    });
    router.push("/ethic-projects/animal");
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
          id: "animalType",
          label: "动物种系",
          value: currentProject.animalType,
          icon: <PawPrint className="h-4 w-4 text-gray-400" />,
        },
        {
          id: "animalCount",
          label: "动物数量",
          value: currentProject.animalCount,
          icon: <FileText className="h-4 w-4 text-gray-400" />,
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
          component: <ReviewProgressTab projectId={params.id} projectType="animal" />,
        },
        {
          id: "experimentProgress",
          label: "实验进度与结果",
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