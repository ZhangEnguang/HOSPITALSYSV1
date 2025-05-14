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
import EthicProjectOverviewTab from "@/app/ethic-review/quick-review/components/overview-tab"
import RiskAnalysisTab from "@/app/ethic-review/quick-review/components/risk-analysis-tab"
import ReviewFilesTab from "@/app/ethic-review/quick-review/components/review-files-tab"

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
    reviewNumber: "ETH-H-2024-002",
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
    reviewNumber: "ETH-H-2024-003",
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
          description: `无法找到ID为${params.id}的审查项目详情`,
          variant: "destructive",
        });
        router.push("/ethic-review/quick-review");
      }
    } catch (error) {
      console.error("加载项目详情时发生错误:", error);
      toast({
        title: "加载错误",
        description: "加载项目详情时发生错误，请稍后重试",
        variant: "destructive",
      });
      router.push("/ethic-review/quick-review");
    }
  }, [params.id, router]);

  // 获取项目详情 - 根据多个属性查找
  const getProjectDetail = () => {
    const searchId = params.id;
    console.log("正在查找项目，搜索ID:", searchId);
    
    // 为项目4添加特殊处理
    if (searchId === "4") {
      console.log("检测到项目4，应用特殊处理");
      try {
        const { quickReviewItems } = require("../data/quick-review-demo-data");
        const project4 = quickReviewItems.find((p: any) => p.id === "4");
        
        if (project4) {
          console.log("项目4数据:", project4);
          // 为项目4构建完整详情数据
          return {
            id: "4",
            title: project4.name,
            status: "形审退回",
            statusLabel: "已退回",
            reviewType: project4.reviewType,
            projectType: "动物",
            animalType: "啮齿类",
            animalCount: "120只",
            ethicsCommittee: project4.ethicsCommittee,
            department: project4.department,
            leader: project4.projectLeader?.name || "赵六",
            createdAt: "2024-01-20",
            deadline: project4.dueDate || "2024-01-30",
            submittedAt: project4.actualDate || "2024-01-28",
            returnedAt: "2024-01-29",
            reviewNumber: project4.projectId,
            progress: project4.completion || 100,
            description: project4.description || "本项目旨在评估各类啮齿动物模型在药物代谢研究中的适用性和有效性，为新药开发提供更精准的前临床评估体系。",
            aiSummary: "【退回原因分析】\n• 实验方案中动物使用数量未充分论证\n• 痛苦程度评估不完善\n• 麻醉和安乐死方案需细化\n• 实验观察指标设置不够合理\n\n建议：补充完善上述内容后重新提交",
            aiModelName: "EthicGPT 2024",
            aiModelVersion: "v3.1",
            risk: {
              level: "中",
              analysis: "该项目中部分实验会引起动物中度痛苦，需要完善动物福利保障措施。同时，药物代谢实验涉及的化合物安全性需进一步评估。",
              suggestions: [
                "完善动物痛苦评估与干预方案",
                "建立更详细的药物不良反应监测指标",
                "优化实验设计，减少使用动物数量"
              ]
            },
            files: [
              { id: "p4-1", name: "项目申请书.pdf", type: "application", size: "2.1MB", uploadedAt: "2024-01-28", status: "需修改" },
              { id: "p4-2", name: "实验方案.docx", type: "protocol", size: "1.7MB", uploadedAt: "2024-01-28", status: "需修改" },
              { id: "p4-3", name: "3R声明.pdf", type: "declaration", size: "0.6MB", uploadedAt: "2024-01-28", status: "需修改" },
              { id: "p4-4", name: "退回意见书.pdf", type: "review", size: "0.9MB", uploadedAt: "2024-01-29", status: "已生成" }
            ]
          };
        }
      } catch (error) {
        console.error("处理项目4时发生错误:", error);
      }
    }
    
    // 先从mockReviewProjects中查找
    let project = mockReviewProjects.find((p) => p.id === searchId);
    if (project) {
      console.log("在mockReviewProjects中通过id找到项目:", project.id);
      return project;
    }
    
    // 尝试从quickReviewItems中查找
    try {
      const { quickReviewItems } = require("../data/quick-review-demo-data");
      console.log("尝试从quickReviewItems查找项目，可用项目数:", quickReviewItems.length);
      
      // 先通过id查找
      let listProject = quickReviewItems.find((p: any) => p.id === searchId);
      
      // 记录项目查找过程
      if (listProject) {
        console.log(`通过ID "${searchId}" 找到项目:`, listProject.id, listProject.name);
      } else {
        console.log(`通过ID "${searchId}" 未找到项目，尝试其他属性...`);
        // 如果找不到，尝试其他属性
        listProject = quickReviewItems.find((p: any) => 
          p.projectId === searchId || p.reviewNumber === searchId
        );
        
        if (listProject) {
          console.log(`通过其他属性找到项目:`, listProject.id, listProject.name);
        }
      }
      
      if (listProject) {
        console.log("在quickReviewItems中找到项目:", listProject.id, listProject.name);
        
        // 将列表项目数据转换为详情页需要的格式
        const detailProject = {
          id: listProject.id,
          title: listProject.name,
          status: mapStatus(listProject.status),
          statusLabel: mapStatus(listProject.status),
          reviewType: listProject.reviewType,
          projectType: listProject.projectType,
          animalType: listProject.projectSubType === "动物" ? (listProject.animalType || "未指定") : undefined,
          animalCount: listProject.projectSubType === "动物" ? (listProject.animalCount || "未指定") : undefined,
          participantCount: listProject.projectSubType === "人体" ? (listProject.participantCount || "未指定") : undefined,
          ethicsCommittee: listProject.ethicsCommittee,
          department: listProject.department,
          leader: listProject.projectLeader?.name || "未指定",
          createdAt: listProject.createdAt || "未指定",
          deadline: listProject.dueDate || "未指定",
          submittedAt: listProject.submissionDate || listProject.createdAt || "未指定",
          reviewNumber: listProject.projectId,
          progress: listProject.reviewProgress || 0,
          description: listProject.description || "暂无描述",
          // 添加其他必要的默认值
          aiSummary: "AI审核摘要尚未生成",
          aiModelName: "EthicGPT 2024",
          aiModelVersion: "v3.1",
          risk: {
            level: "未评估",
            analysis: "风险分析尚未生成",
            suggestions: ["暂无风险控制建议"]
          },
          files: [
            { id: "temp1", name: "项目申请书.pdf", type: "application", size: "未知", uploadedAt: listProject.submissionDate || "未知", status: "待审核" }
          ]
        };
        
        console.log("已转换项目数据:", detailProject.id, detailProject.title);
        return detailProject;
      } else {
        console.error("在所有数据源中均未找到ID为", searchId, "的项目");
        // 记录所有可用项目ID以便调试
        console.log("可用的项目ID列表:", quickReviewItems.map((p: any) => p.id).join(", "));
        return null;
      }
    } catch (error) {
      console.error("无法加载或处理快速审查项目数据:", error);
      return null;
    }
  };

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
    router.push("/ethic-review/quick-review");
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
    router.push("/ethic-review/quick-review");
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
    
    const baseFields = [
      {
        id: "reviewNumber",
        label: "受理号",
        value: currentProject.reviewNumber || "未分配",
        icon: <FileSignature className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "leader",
        label: "负责人",
        value: currentProject.leader || "未指定",
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
      },
      {
        id: "submittedAt",
        label: "提交时间",
        value: currentProject.submittedAt || "未提交",
        icon: <Calendar className="h-4 w-4 text-gray-400" />,
      }
    ];
    
    // 根据项目类型添加特定字段
    if (currentProject.projectType === "动物") {
      baseFields.push(
        {
          id: "animalType",
          label: "动物种系",
          value: currentProject.animalType || "未指定",
          icon: <PawPrint className="h-4 w-4 text-gray-400" />,
        },
        {
          id: "animalCount",
          label: "动物数量",
          value: currentProject.animalCount || "未指定",
          icon: <BriefcaseMedical className="h-4 w-4 text-gray-400" />,
        }
      );
    } else if (currentProject.projectType === "人体") {
      baseFields.push({
        id: "participantCount",
        label: "参与人数",
        value: currentProject.participantCount || "未指定",
        icon: <BriefcaseMedical className="h-4 w-4 text-gray-400" />,
      });
    }
    
    return baseFields;
  };

  return (
    <DetailPage
      id={params.id}
      title={projectTitle || currentProject.title || `项目 ${params.id}`}
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