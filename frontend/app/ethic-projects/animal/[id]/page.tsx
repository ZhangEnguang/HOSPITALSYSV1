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
} from "lucide-react"
import EthicProjectOverviewTab from "../components/overview-tab"
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
    department: "基础医学院"
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
    department: "临床医学院"
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
    department: "神经科学学院"
  }
];

// 项目AI摘要内容
const projectAISummaries: { [key: string]: AISummary } = {
  "1": {
    content: "该科研项目当前进度为35%，符合预期计划。项目经费使用率为28.5%，整体于计划进度内。项目已产出3篇研究论文，包括实验设计方案、动物伦理规范与代谢机制初步分析。成果转化进展良好，已有2家制药企业表达合作意向，高于同类项目平均水平25%。",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "加快经费使用进度，特别是设备采购和试验材料准备",
      "重点关注代谢途径与肝毒性关联研究",
      "加强与高校和研究机构合作，提高成果影响力"
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
    content: "该科研项目当前进度为15%，符合启动阶段计划。项目经费使用率为12.3%，进度略滞后。项目已完成实验动物饲养环境准备和初步分化实验，尚未产出正式研究成果。项目面临的主要挑战是干细胞纯度控制和分化方向调控。",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "加强实验条件精确控制，提高干细胞分化效率",
      "建立更完善的质量控制体系",
      "考虑引入先进的单细胞测序技术"
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
    content: "该科研项目已顺利完成，进度达100%。项目经费使用率为97.8%，实现了预期全部研究目标。项目产出了5篇高水平论文，其中2篇发表在本领域顶级期刊。研究发现了神经干细胞促进脊髓损伤修复的新机制，具有显著的临床转化价值。",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "整理完善研究数据，形成完整的技术报告",
      "推进研究成果申请专利保护",
      "探索与医疗机构合作，开展临床前研究"
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
    const project = animalEthicProjects.find((p) => p.id === params.id);
    if (!project) return null;

    // 添加AI摘要数据
    const aiSummary = projectAISummaries[params.id];
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
          id: "execution",
          label: "执行过程",
          icon: <GitBranch className="h-4 w-4" />,
          component: <div className="p-6">项目执行过程内容（正在开发中）</div>,
        },
        {
          id: "risks",
          label: "风险与问题",
          icon: <AlertTriangle className="h-4 w-4" />,
          component: <div className="p-6">项目风险与问题内容（正在开发中）</div>,
        },
        {
          id: "reports",
          label: "项目报告",
          icon: <ClipboardList className="h-4 w-4" />,
          component: <div className="p-6">项目报告内容（正在开发中）</div>,
        },
      ]}
    />
  );
} 