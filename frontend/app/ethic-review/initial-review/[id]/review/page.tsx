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
  XCircle,
  RotateCw,
  User,
  FileSignature,
  BriefcaseMedical,
  PawPrint,
  Users
} from "lucide-react"
import { useLoading } from "@/hooks/use-loading"

// 导入我们创建的组件
import EthicProjectOverviewTab from "@/app/ethic-review/initial-review/components/overview-tab"
import RiskAnalysisTab from "@/app/ethic-review/initial-review/components/risk-analysis-tab"
import ReviewFilesTab from "@/app/ethic-review/initial-review/components/review-files-tab"
import ReviewSidebar from "@/app/components/review-sidebar"

// 模拟数据 - 审查项目（复用详情页面的数据）
const mockReviewProjects = [
  {
    id: "1",
    title: "转基因小鼠模型在神经退行性疾病中的应用",
    status: "待审核",
    statusLabel: "待审核",
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
    reviewNumber: "ETH-A-2024-001",
    progress: 100,
    description: "本项目旨在建立转基因小鼠模型，用于研究神经退行性疾病的发病机制与潜在治疗靶点。",
    aiSummary: "【审核要点摘要】\n• 需要评估3R原则要求\n• 实验设计需要审核\n• 动物福利保障措施需要确认\n• 安乐死方案需要审核\n\n建议：仔细审核实验伦理相关内容",
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
      { id: "1", name: "项目申请书.pdf", type: "application", size: "2.4MB", uploadedAt: "2024-05-18", status: "待审核" },
      { id: "2", name: "实验方案.docx", type: "protocol", size: "1.8MB", uploadedAt: "2024-05-18", status: "待审核" },
      { id: "3", name: "3R声明.pdf", type: "declaration", size: "0.5MB", uploadedAt: "2024-05-18", status: "待审核" }
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
    aiSummary: "【审核要点摘要】\n• 知情同意书内容需要审核\n• 受试者招募计划需要评估\n• 数据安全监测计划需要确认\n• 不良反应报告与处置流程需要审核\n\n建议：重点关注受试者安全保障措施",
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
  }
];

// 伦理项目审查页面
export default function EthicReviewPage({ params }: { params: { id: string } }) {
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
      console.log("开始加载项目审核数据，ID:", params.id);
      const projectDetail = getProjectDetail();
      
      if (projectDetail) {
        console.log("项目审核数据加载成功:", projectDetail.id, projectDetail.title);
        setProjectTitle(projectDetail.title);
        setCurrentProject(projectDetail);
      } else {
        console.error("项目审核数据未找到");
        toast({
          title: "未找到项目",
          description: `无法找到ID为${params.id}的审查项目`,
          variant: "destructive",
        });
        router.push("/ethic-review/initial-review");
      }
    } catch (error) {
      console.error("加载项目审核数据时发生错误:", error);
      toast({
        title: "加载错误",
        description: "加载项目审核数据时发生错误，请稍后重试",
        variant: "destructive",
      });
      router.push("/ethic-review/initial-review");
    }
  }, [params.id, router]);

  // 获取项目详情 - 根据多个属性查找
  const getProjectDetail = () => {
    const searchId = params.id;
    console.log("正在查找项目，搜索ID:", searchId);
    
    try {
      // 从模拟数据中查找
      let project = mockReviewProjects.find(p => p.id === searchId);
      
      if (!project) {
        // 尝试从初始审查数据中查找
        const { initialReviewItems } = require("../../data/initial-review-demo-data");
        const initialProject = initialReviewItems.find((p: any) => p.id === searchId);
        
        if (initialProject) {
          // 转换为审核页面需要的格式
          project = {
            id: initialProject.id,
            title: initialProject.name,
            status: "待审核",
            statusLabel: "待审核",
            reviewType: initialProject.reviewType,
            projectType: initialProject.projectType,
            ethicsCommittee: initialProject.ethicsCommittee,
            department: initialProject.department,
            leader: initialProject.projectLeader?.name || "未指定",
            submittedAt: "2024-05-18",
            reviewNumber: initialProject.projectId,
            description: initialProject.description,
            createdAt: "2024-05-15",
            deadline: "2024-06-15",
            progress: 100,
            animalType: initialProject.projectType === "动物" ? "待确认" : "",
            animalCount: initialProject.projectType === "动物" ? "待确认" : "",
            participantCount: initialProject.projectType === "人体" ? "待确认" : "",
            aiSummary: "【审核要点摘要】\n• 项目材料已提交\n• 需要进行伦理审查\n• 等待委员会审核\n\n建议：按照标准流程进行审核",
            aiModelName: "EthicGPT 2024",
            aiModelVersion: "v3.1",
            risk: {
              level: "待评估",
              analysis: "项目风险等级需要通过审核确定。",
              suggestions: [
                "仔细审阅项目材料",
                "评估伦理风险等级",
                "确认安全保障措施"
              ]
            },
            files: [
              { id: "1", name: "项目申请书.pdf", type: "application", size: "2.4MB", uploadedAt: "2024-05-18", status: "待审核" },
              { id: "2", name: "实验方案.docx", type: "protocol", size: "1.8MB", uploadedAt: "2024-05-18", status: "待审核" }
            ]
          };
          
          // 根据项目类型添加特定字段
          if (project && initialProject.projectType === "动物") {
            project.animalType = "待确认";
            project.animalCount = "待确认";
          } else if (project && initialProject.projectType === "人体") {
            project.participantCount = "待确认";
          }
        }
      }
      
      console.log("找到项目数据:", project?.id, project?.title);
      return project;
    } catch (error) {
      console.error("无法加载项目数据:", error);
      return null;
    }
  };

  // 获取状态颜色
  const getStatusColors = () => {
    return {
      "待审核": "bg-amber-50 text-amber-700 border-amber-200",
      "审核中": "bg-blue-50 text-blue-700 border-blue-200",
      "审核通过": "bg-green-50 text-green-700 border-green-200",
      "已退回": "bg-red-50 text-red-700 border-red-200"
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

  // 加载状态或错误处理
  if (!currentProject) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
        <div className="text-lg font-medium">加载中...</div>
        <div className="text-sm text-gray-500 mt-2">正在加载项目ID: {params.id} 的审核数据</div>
      </div>
    );
  }

  // 获取审核操作按钮
  const getActionButtons = () => {
    // 审核页面不需要右上角的操作按钮，所有审核操作都在右侧面板中
    return [];
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
        id: "submittedAt",
        label: "提交时间",
        value: currentProject.submittedAt || "未提交",
        icon: <Calendar className="h-4 w-4 text-gray-400" />,
      }
    ];
    
    // 根据项目类型添加一个特定字段
    if (currentProject.projectType === "动物") {
      baseFields.push({
        id: "animalCount",
        label: "动物数量",
        value: currentProject.animalCount || "未指定",
        icon: <PawPrint className="h-4 w-4 text-gray-400" />,
      });
    } else if (currentProject.projectType === "人体") {
      baseFields.push({
        id: "participantCount",
        label: "参与人数",
        value: currentProject.participantCount || "未指定",
        icon: <Users className="h-4 w-4 text-gray-400" />,
      });
    }
    
    return baseFields;
  };

  return (
    <div className="flex min-h-0 overflow-hidden">
      {/* 左侧主内容区域 */}
      <div className="flex-1 overflow-auto pb-8 pr-[350px]">
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
      </div>
      
      {/* 右侧审核面板 */}
      <ReviewSidebar 
        status={currentProject.status}
        projectId={currentProject.id}
        projectTitle={currentProject.title}
        getStatusColor={(status: string) => {
          const colors = getStatusColors();
          return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
        }}
      />
    </div>
  );
} 