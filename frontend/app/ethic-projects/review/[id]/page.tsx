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

// 导入我们刚刚创建的组件
import EthicProjectOverviewTab from "./components/overview-tab"
import RiskAnalysisTab from "./components/risk-analysis-tab"
import ReviewFilesTab from "./components/review-files-tab"

// 模拟数据 - 审查项目
const mockReviewProjects = [
  {
    id: "1",
    title: "转基因小鼠模型在神经退行性疾病中的应用",
    status: "审核通过",
    statusLabel: "审核通过",
    reviewType: "初始审查",
    projectType: "动物",
    animalType: "小鼠",
    animalCount: "85只",
    ethicsCommittee: "动物实验伦理委员会",
    department: "神经科学研究院",
    leader: "张三", 
    createdAt: "2024-05-15",
    deadline: "2024-06-15",
    submittedAt: "2024-05-18",
    approvedAt: "2024-06-02",
    reviewNumber: "ETH-A-2024-001",
    progress: 100,
    description: "本项目旨在建立转基因小鼠模型，用于研究神经退行性疾病的发病机制与潜在治疗靶点。",
    aiSummary: "【审核要点摘要】\n• 已完全符合3R原则要求\n• 实验设计科学合理\n• 动物福利保障措施完善\n• 安乐死方案符合规范\n\n建议：作为标准案例纳入伦理培训教材",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "低",
      analysis: "该项目使用已成熟的转基因技术，动物痛苦程度低，实验过程中有完善的痛苦控制措施。",
      suggestions: [
        "定期检查动物健康状况",
        "严格执行麻醉和安乐死规程",
        "保持实验环境稳定"
      ]
    },
    files: [
      { id: "1", name: "项目申请书.pdf", type: "application", size: "2.4MB", uploadedAt: "2024-05-18", status: "已审核" },
      { id: "2", name: "实验方案.docx", type: "protocol", size: "1.8MB", uploadedAt: "2024-05-18", status: "已审核" },
      { id: "3", name: "3R声明.pdf", type: "declaration", size: "0.5MB", uploadedAt: "2024-05-18", status: "已审核" },
      { id: "4", name: "伦理审查意见.pdf", type: "review", size: "1.2MB", uploadedAt: "2024-06-02", status: "已生成" }
    ]
  },
  {
    id: "2",
    title: "新型靶向生物药物在晚期肿瘤患者中的临床试验",
    status: "待审核",
    statusLabel: "待审核",
    reviewType: "初始审查",
    projectType: "人体",
    participantCount: "120人",
    ethicsCommittee: "医学伦理委员会",
    department: "肿瘤医学中心",
    leader: "李四",
    createdAt: "2024-05-20",
    deadline: "2024-06-20",
    submittedAt: "2024-05-22",
    reviewNumber: "受理后自动生成",
    progress: 25,
    description: "本项目旨在评估新型靶向生物药物在晚期肿瘤患者中的安全性和有效性，通过I期临床试验筛选最佳给药剂量和方案。",
    aiSummary: "【审核要点摘要】\n• 知情同意书内容全面但表述复杂\n• 受试者招募计划合理但筛选标准较严格\n• 数据安全监测计划完善\n• 不良反应报告与处置流程规范\n\n建议：简化知情同意书语言，使一般受试者更易理解",
    aiModelName: "EthicGPT 2024",
    aiModelVersion: "v3.1",
    risk: {
      level: "中",
      analysis: "该试验为I期临床试验，存在药物不良反应风险，但有完善的受试者监测与紧急处置措施。",
      suggestions: [
        "强化受试者筛查标准执行",
        "增加初期剂量组监测频率",
        "设立独立的数据安全监测委员会"
      ]
    },
    files: [
      { id: "5", name: "临床研究方案.pdf", type: "protocol", size: "3.8MB", uploadedAt: "2024-05-22", status: "待审核" },
      { id: "6", name: "知情同意书.pdf", type: "consent", size: "2.1MB", uploadedAt: "2024-05-22", status: "待审核" },
      { id: "7", name: "研究者手册.pdf", type: "handbook", size: "4.5MB", uploadedAt: "2024-05-22", status: "待审核" },
      { id: "8", name: "病例报告表.docx", type: "report", size: "1.6MB", uploadedAt: "2024-05-22", status: "待审核" }
    ]
  },
  {
    id: "3",
    title: "高血压患者运动干预效果及安全性评估",
    status: "已退回",
    statusLabel: "已退回",
    reviewType: "初始审查",
    projectType: "人体",
    participantCount: "150人",
    ethicsCommittee: "医学伦理委员会",
    department: "运动医学科学院",
    leader: "王五",
    createdAt: "2024-05-10",
    deadline: "2024-06-10",
    submittedAt: "2024-05-12",
    returnedAt: "2024-05-25",
    reviewNumber: "受理后自动生成",
    progress: 40,
    description: "本项目旨在评估不同强度有氧运动对高血压患者血压控制、心血管功能及生活质量的影响，确定最佳运动处方。",
    aiSummary: "【退回原因分析】\n• 未充分说明高风险人群的排除标准\n• 缺乏运动中止标准的明确界定\n• 应急处置流程不够详细\n• 数据收集表单设计不完善\n\n建议：补充完善上述内容后重新提交",
    aiModelName: "EthicGPT 2024", 
    aiModelVersion: "v3.1",
    risk: {
      level: "中高",
      analysis: "高血压患者进行运动干预存在心血管事件风险，需要严格的筛查标准和监测措施。现有方案中的风险控制措施不够完善。",
      suggestions: [
        "制定详细的高危人群排除标准",
        "明确运动中止指标和应急预案",
        "配备专业医护人员现场监督"
      ]
    },
    files: [
      { id: "9", name: "研究方案.pdf", type: "protocol", size: "2.7MB", uploadedAt: "2024-05-12", status: "需修改" },
      { id: "10", name: "知情同意书.pdf", type: "consent", size: "1.8MB", uploadedAt: "2024-05-12", status: "需修改" },
      { id: "11", name: "运动处方设计.docx", type: "prescription", size: "1.4MB", uploadedAt: "2024-05-12", status: "需修改" },
      { id: "12", name: "退回意见书.pdf", type: "review", size: "0.8MB", uploadedAt: "2024-05-25", status: "已生成" }
    ]
  }
];

// 伦理项目审查详情页
export default function EthicReviewDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [projectTitle, setProjectTitle] = useState("");
  const [currentProject, setCurrentProject] = useState<any>(null);

  // 模拟获取项目详情数据
  useEffect(() => {
    const projectDetail = getProjectDetail();
    if (projectDetail) {
      setProjectTitle(projectDetail.title);
      setCurrentProject(projectDetail);
    } else {
      toast({
        title: "未找到项目",
        description: "无法找到该审查项目详情",
        variant: "destructive",
      });
      router.push("/ethic-projects/review");
    }
  }, [params.id, router]);

  // 获取项目详情
  const getProjectDetail = () => {
    const projectId = params.id;
    return mockReviewProjects.find((p) => p.id === projectId);
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
    router.push("/ethic-review/initial-review");
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
    router.push("/ethic-review/initial-review");
  };

  if (!currentProject) {
    return <div className="p-8 text-center">加载中...</div>;
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
    const baseFields = [
      {
        id: "reviewNumber",
        label: "受理号",
        value: currentProject.reviewNumber,
        icon: <FileSignature className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "leader",
        label: "负责人",
        value: currentProject.leader,
        icon: <User className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "department",
        label: "所属院系",
        value: currentProject.department,
        icon: <Building2 className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "committee",
        label: "伦理委员会",
        value: currentProject.ethicsCommittee,
        icon: <Users className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "submittedAt",
        label: "提交时间",
        value: currentProject.submittedAt,
        icon: <Calendar className="h-4 w-4 text-gray-400" />,
      }
    ];
    
    // 根据项目类型添加特定字段
    if (currentProject.projectType === "动物") {
      baseFields.push(
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
          icon: <BriefcaseMedical className="h-4 w-4 text-gray-400" />,
        }
      );
    } else if (currentProject.projectType === "人体") {
      baseFields.push({
        id: "participantCount",
        label: "参与人数",
        value: currentProject.participantCount,
        icon: <BriefcaseMedical className="h-4 w-4 text-gray-400" />,
      });
    }
    
    return baseFields;
  };

  return (
    <DetailPage
      id={params.id}
      title={projectTitle}
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
          component: <EthicProjectOverviewTab project={currentProject} />,
        },
        {
          id: "riskAnalysis",
          label: "风险分析",
          icon: <AlertTriangle className="h-4 w-4" />,
          component: <RiskAnalysisTab project={currentProject} />,
        },
        {
          id: "reviewFiles",
          label: "送审文件",
          icon: <FileText className="h-4 w-4" />,
          component: <ReviewFilesTab project={currentProject} />,
        },
      ]}
    />
  );
} 