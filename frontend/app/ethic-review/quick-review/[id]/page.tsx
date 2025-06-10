"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import DetailPage from "@/components/detail-page/detail-page"
import {
  FileIcon,
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
import ReviewFilesTab from "@/app/ethic-review/quick-review/components/review-files-tab"

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
    
    try {
      const { quickReviewItems } = require("../data/quick-review-demo-data");
      console.log("尝试从quickReviewItems查找项目，可用项目数:", quickReviewItems.length);
      
      console.log("可用项目ID列表:", quickReviewItems.map((p: any) => p.id).join(", "));
      
      // 先尝试直接匹配完整ID
      let listProject = quickReviewItems.find((p: any) => p.id === searchId);
      console.log("直接匹配查找结果:", listProject ? "已找到" : "未找到");
      
      // 如果没找到，尝试从URL中解析出正确的格式
      if (!listProject) {
        // 处理 qr-2024-001 或 2024-001 格式
        const idParts = searchId.split('-');
        // 确保是数字部分
        if (idParts.length >= 2) {
          const yearPart = idParts[idParts.length - 2];
          const numberPart = idParts[idParts.length - 1];
          
          // 尝试匹配格式为 qr-YYYY-NNN 的项目
          console.log(`尝试匹配格式: qr-${yearPart}-${numberPart}`);
          listProject = quickReviewItems.find((p: any) => 
            p.id === `qr-${yearPart}-${numberPart}`
          );
        }
      }
      
      // 如果还没找到，尝试其他属性匹配
      if (!listProject) {
        console.log("尝试通过其他属性查找...");
        listProject = quickReviewItems.find((p: any) => 
          p.projectId === searchId || 
          p.reviewNumber === searchId
        );
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
          assignedExperts: [], // 初始化为空的已分配专家列表
          aiSummary: "该项目提出了基于CRISPR基因编辑技术的罕见遗传病快速基因诊断体系，拟通过基因组筛查和AI辅助分析提高罕见病诊断效率。项目涉及人类基因组数据和动物模型验证，具有中度伦理风险。建议审查重点关注：(1)知情同意过程及基因信息保密措施；(2)基因编辑范围的明确限制；(3)动物实验3R原则落实情况。推荐分配具有分子生物学和医学伦理专业背景的专家进行评审。",
          aiModelName: "EthicGPT 2024",
          aiModelVersion: "v3.1",
          risk: {
            level: "中度风险",
            analysis: "项目涉及人类基因组数据采集与分析，存在隐私泄露风险；同时涉及基因编辑技术应用于诊断，需确保不会用于非医疗目的；动物实验部分需评估动物福利保障措施的充分性。",
            suggestions: [
              "完善受试者基因数据保护与匿名化方案",
              "明确CRISPR技术仅限于体外诊断用途，禁止人体基因组修饰",
              "加强实验动物福利保障措施，严格遵循3R原则",
              "建立基因信息安全泄露应急处理机制"
            ]
          },
          files: [
            { id: "temp1", name: "项目申请书.pdf", type: "application", size: "未知", uploadedAt: listProject.submissionDate || "未知", status: "待审核" }
          ],
          members: [
            { id: "m1", name: "李助理", title: "研究助理", department: "神经科学研究院", email: "li@example.com", phone: "13800000010" },
            { id: "m2", name: "张技术员", title: "高级技术员", department: "神经科学研究院", email: "zhang@example.com", phone: "13800000011" },
            { id: "m3", name: "刘研究员", title: "副研究员", department: "药学院", email: "liu@example.com", phone: "13800000012" },
            { id: "m4", name: "赵博士", title: "博士后", department: "神经科学研究院", email: "zhao@example.com", phone: "13800000012" }
          ]
        };
        
        console.log("已转换项目数据:", detailProject.id, detailProject.title);
        return detailProject;
      } else {
        console.error("在所有数据源中均未找到ID为", searchId, "的项目");
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
      "形审中": "审核中",
      "通过": "审核通过",
      "驳回": "已退回",
      "待审查": "待审核",
      "审查中": "审核中"
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
          id: "reviewFiles",
          label: "送审文件",
          icon: <FileText className="h-4 w-4" />,
          component: <ReviewFilesTab project={currentProject} />,
        },
      ]}
    />
  );
} 