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
    id: "1",
    name: "冠心病患者饮食干预效果研究",
    description: "研究不同饮食模式对冠心病患者血脂和心血管事件的影响",
    status: "进行中",
    projectType: "临床研究", 
    participantCount: "120人",
    ethicsCommittee: "北京医学伦理委员会",
    researchUnit: "内科学系",
    leader: { name: "王教授", title: "教授", email: "wang@example.com", phone: "13800000001" },
    createdAt: "2023-10-12",
    progress: 35,
    tasks: { completed: 3, total: 8 },
    type: "人体伦理",
    source: "国家自然科学基金",
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    budget: 850000,
    auditStatus: "审核通过",
    priority: "高",
    projectNumber: "人伦2025001",
    department: "临床医学院",
    members: [
      { name: "李助理", title: "研究助理", department: "临床医学院", role: "数据收集", contact: "li@example.com" },
      { name: "张医生", title: "主治医师", department: "内科", role: "患者管理", contact: "zhang@example.com" },
      { name: "刘营养师", title: "高级营养师", department: "营养科", role: "饮食指导", contact: "13800000003" },
      { name: "赵博士", title: "博士后", department: "临床医学院", role: "数据分析", contact: "zhao@example.com" }
    ]
  },
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
    name: "脑卒中康复新技术评估研究",
    description: "评估新型康复技术对脑卒中患者运动功能恢复的效果",
    status: "已完成",
    projectType: "干预性研究",
    participantCount: "80人",
    ethicsCommittee: "北京医学伦理委员会",
    researchUnit: "康复医学科",
    leader: { name: "张教授", title: "教授", email: "zhang@example.com", phone: "13800000003" },
    createdAt: "2023-08-20",
    progress: 100,
    tasks: { completed: 6, total: 6 },
    type: "人体伦理",
    source: "省级科研基金",
    startDate: "2023-09-01", 
    endDate: "2024-03-31",
    budget: 650000,
    auditStatus: "审核通过",
    priority: "高",
    projectNumber: "人伦2025003",
    department: "康复医学院",
    members: [
      { name: "孙医生", title: "主治医师", department: "康复科", role: "临床指导", contact: "sun@example.com" },
      { name: "钱技术员", title: "治疗师", department: "康复中心", role: "技术操作", contact: "13800000007" },
      { name: "郑博士", title: "博士研究生", department: "康复医学院", role: "数据分析", contact: "zheng@example.com" }
    ]
  }
];

// 项目AI摘要内容
const projectAISummaries: { [key: string]: AISummary } = {
  "1": {
    content: "【伦理规范执行情况】\n• 已获得伦理委员会批准（批准号：IRB-2023-08-12）\n• 知情同意实施评分95/100（优秀）\n\n【患者保护措施】\n• 完善的数据隐私保护方案\n• 严格的不良反应监测流程\n• 标准化的知情同意流程\n\n【研究现状】\n• 已完成40%受试者随访\n• 中期数据显示饮食干预有积极效果",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "加强饮食依从性监测",
      "扩大样本量提高统计功效"
    ],
    confidenceScore: 95,
    analysisTime: "2024-03-15 10:32",
    platformScores: {
      progress: "良好",
      risk: "低",
      achievement: "良好"
    }
  },
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
    content: "【伦理规范执行情况】\n• 伦理委员会批准（批准号：IRB-2023-06-05）\n• 方案执行评分96/100（优秀）\n\n【患者保护措施】\n• 严格的患者安全监测\n• 个性化康复方案调整\n• 充分的隐私保护\n\n【研究成果】\n• 新技术组患者运动功能恢复速度提高35%\n• 已形成3篇高质量论文和1项专利申请",
    aiModel: "GPT-Scientific 2023",
    version: "v2.4.1",
    recommendations: [
      "推进技术成果转化应用",
      "开展更长期的随访研究"
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
    console.log("正在查找人体伦理项目ID:", projectId);
    
    const project = humanEthicProjects.find((p) => p.id === projectId);
    if (!project) {
      console.error("未找到人体伦理项目:", projectId);
      return null;
    }
    
    console.log("找到人体伦理项目:", project.name);

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