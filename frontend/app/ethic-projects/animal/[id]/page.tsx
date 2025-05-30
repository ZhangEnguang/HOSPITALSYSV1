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
      { name: "李助理", title: "研究助理", department: "基础医学院", role: "实验操作", contact: "li@example.com" },
      { name: "张技术员", title: "高级技术员", department: "基础医学院", role: "数据分析", contact: "zhang@example.com" },
      { name: "刘研究员", title: "副研究员", department: "药理学系", role: "实验设计", contact: "13800000003" },
      { name: "赵博士", title: "博士后", department: "基础医学院", role: "实验监督", contact: "zhao@example.com" }
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
      { name: "陈博士", title: "博士后", department: "临床医学院", role: "项目协调", contact: "chen@example.com" },
      { name: "吴老师", title: "讲师", department: "临床医学院", role: "实验设计", contact: "wu@example.com" },
      { name: "周技术员", title: "技术员", department: "免疫学实验中心", role: "实验操作", contact: "13800000005" }
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
      { name: "孙医生", title: "主治医师", department: "附属医院", role: "临床指导", contact: "sun@example.com" },
      { name: "钱技术员", title: "高级技术员", department: "神经科学实验中心", role: "实验操作", contact: "13800000007" },
      { name: "郑博士", title: "博士研究生", department: "神经科学学院", role: "数据分析", contact: "zheng@example.com" }
    ]
  }
];

// 项目AI摘要内容
const projectAISummaries: { [key: string]: AISummary } = {
  "1": {
    content: "【伦理规范执行情况】\n• 已获得IACUC批准（批准号：IACUC-2023-05-15）\n• 动物福利认证评分92/100（优秀）\n\n【3R原则实施情况】\n• 替代：体外细胞模型减少20%动物用量\n• 减少：优化设计减少取样频次\n• 优化：无创检测技术减轻动物痛苦\n\n【动物福利保障措施】\n• 环境丰容设施，温湿度控制\n• 专业兽医监护\n• 人道终点标准",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "加强实验动物行为状态监测",
      "优化麻醉和镇痛方案"
    ],
    confidenceScore: 95,
    analysisTime: "2024-03-15 10:32",
    platformScores: {
      progress: "良好",
      risk: "中等",
      achievement: "良好"
    }
  },
  "2": {
    content: "【伦理规范执行情况】\n• 已获批准（批准号：IACUC-2023-08-22）\n• 伦理合规评分88/100（良好）\n\n【3R原则实施情况】\n• 替代：计算机模拟预测减少预实验\n• 减少：统计学优化样本量\n• 优化：微创技术减轻痛苦\n\n项目进度符合启动阶段计划，主要挑战是干细胞纯度控制和分化方向调控。",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "加强实验条件精确控制",
      "建立质量控制体系"
    ],
    confidenceScore: 92,
    analysisTime: "2024-03-12 15:47",
    platformScores: {
      progress: "一般",
      risk: "中等",
      achievement: "待提高"
    }
  },
  "3": {
    content: "【伦理规范执行情况】\n• 伦理委员会批准（批准号：IACUC-2022-11-05）\n• 伦理合规评分96/100（优秀）\n\n【3R原则实施情况】\n• 替代：体外培养替代30%动物实验\n• 减少：比计划减少15%动物用量\n• 优化：先进镇痛与环境丰容提升福利\n\n项目产出5篇高水平论文，发现的神经干细胞促进脊髓损伤修复新机制具有临床转化价值。",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "整理研究数据，形成技术报告",
      "推进成果申请专利保护"
    ],
    confidenceScore: 98,
    analysisTime: "2024-02-28 09:15",
    platformScores: {
      progress: "优秀",
      risk: "低",
      achievement: "优秀"
    }
  }
};

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

    // 添加AI摘要数据
    const aiSummary = projectAISummaries[projectId];
    if (aiSummary) {
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