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

// 人体伦理项目模拟数据
const humanEthicProjects = [
  {
    id: "1",
    name: "多人样本基因测序与健康风险预测",
    description: "采集不同人种血液样本进行基因测序分析，研究疾病与基因的关联性",
    status: "进行中",
    participantCount: "120人",
    ethicsCommittee: "北京医学伦理委员会",
    facilityUnit: "外科学系",
    leader: { name: "王教授", title: "教授", email: "wang@example.com", phone: "13800000001" },
    createdAt: "2023-10-15",
    progress: 45,
    tasks: { completed: 4, total: 9 },
    type: "人体伦理",
    source: "国家自然科学基金",
    startDate: "2023-11-01",
    endDate: "2025-12-31",
    budget: 950000,
    auditStatus: "审核通过",
    priority: "高",
    projectNumber: "人伦2023001",
    department: "基础医学院"
  },
  {
    id: "2",
    name: "新生儿脐带血干细胞提取技术评估",
    description: "研究新生儿脐带血干细胞提取技术的临床安全性与有效性",
    status: "规划中",
    participantCount: "50例",
    ethicsCommittee: "北京医学伦理委员会",
    facilityUnit: "儿科学系",
    leader: { name: "张研究员", title: "研究员", email: "zhang@example.com", phone: "13800000002" },
    createdAt: "2023-11-15",
    progress: 15,
    tasks: { completed: 1, total: 6 },
    type: "人体伦理",
    source: "产学研合作",
    startDate: "2024-01-01",
    endDate: "2025-06-30",
    budget: 620000,
    auditStatus: "待审核",
    priority: "中",
    projectNumber: "人伦2023002",
    department: "医学创新学院"
  },
  {
    id: "3",
    name: "老年痴呆症患者实验性药物临床试验",
    description: "针对老年痴呆症患者的实验性药物临床试验，评估药效与安全性",
    status: "进行中",
    participantCount: "80例",
    ethicsCommittee: "北京医学伦理委员会",
    facilityUnit: "神经内科",
    leader: { name: "李主任", title: "主任医师", email: "li@example.com", phone: "13800000003" },
    createdAt: "2023-09-20",
    progress: 60,
    tasks: { completed: 5, total: 8 },
    type: "人体伦理",
    source: "卫健委项目",
    startDate: "2023-10-01",
    endDate: "2025-10-31",
    budget: 1200000,
    auditStatus: "审核通过",
    priority: "高",
    projectNumber: "人伦2023003",
    department: "医学院"
  }
];

// 项目AI摘要内容
const projectAISummaries: { [key: string]: AISummary } = {
  "1": {
    content: "该科研项目当前进度为45%，符合预期计划。项目经费使用率为42.5%，整体于计划进度内。项目已完成120人样本的采集和初步基因测序，形成了初步的健康风险评估模型。目前已识别出3个与心血管疾病相关的关键基因位点，具有重要研究意义。",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "加强样本多样性，考虑纳入更多区域的人群样本",
      "深入研究基因与环境因素的交互作用",
      "加快风险预测模型的验证工作"
    ],
    confidenceScore: 93,
    analysisTime: "2024-03-25 09:47",
    platformScores: {
      progress: "良好",
      risk: "低",
      achievement: "良好"
    }
  },
  "2": {
    content: "该科研项目当前进度为15%，处于规划初期阶段。项目经费使用率为10.8%，主要用于设备采购和人员培训。项目团队已完成技术方案设计和伦理申请，正在准备首批样本采集工作。项目面临的主要挑战是干细胞纯度和活性保持。",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "加快推进伦理审批流程，确保实验按时开展",
      "优化低温保存条件，提高干细胞活性",
      "增强与产科的协作，提高样本获取效率"
    ],
    confidenceScore: 90,
    analysisTime: "2024-03-18 16:32",
    platformScores: {
      progress: "一般",
      risk: "中等",
      achievement: "待评估"
    }
  },
  "3": {
    content: "该科研项目当前进度为60%，符合预期规划。项目经费使用率为58.2%，资源调配合理。已完成4个阶段的临床试验，纳入80例患者，形成了初步的疗效和安全性评估。初步数据显示药物对轻中度患者有明显改善作用，但重度患者效果有限。",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "增加对药物作用机制的深入研究",
      "细化患者分组，优化给药方案",
      "增强对长期用药安全性的监测工作"
    ],
    confidenceScore: 96,
    analysisTime: "2024-04-02 11:18",
    platformScores: {
      progress: "优秀",
      risk: "中低",
      achievement: "良好"
    }
  }
};

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
    const project = humanEthicProjects.find((p) => p.id === params.id);
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
        type: "人体伦理",
      };
    }

    return {
      ...project,
      type: "人体伦理",
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