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
  Users,
  UserRoundPlus,
  Check,
  Zap,
  ClipboardList,
  X
} from "lucide-react"
import { useLoading } from "@/hooks/use-loading"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// 复用快速审查组件
import EthicProjectOverviewTab from "@/app/ethic-review/quick-review/components/overview-tab"
import RiskAnalysisTab from "@/app/ethic-review/quick-review/components/risk-analysis-tab"
import ReviewFilesTab from "@/app/ethic-review/quick-review/components/review-files-tab"

// 导入AI推荐面板组件
import AIRecommendationPanel from "./components/ai-recommendation-panel"

// 模拟数据
const mockExperts = [
  {
    id: "exp1",
    name: "张教授",
    department: "基础医学院",
    title: "教授",
    expertise: ["分子生物学", "基因编辑", "动物模型"],
    matchScore: 95,
    relatedPapers: 28,
    reviewCount: 42,
    rating: 4.8,
    availability: true
  },
  {
    id: "exp2",
    name: "李研究员",
    department: "临床医学院",
    title: "研究员",
    expertise: ["临床药理学", "药物安全", "临床试验"],
    matchScore: 87,
    relatedPapers: 15,
    reviewCount: 36,
    rating: 4.5,
    availability: true
  },
  {
    id: "exp3",
    name: "王主任",
    department: "伦理办公室",
    title: "主任医师",
    expertise: ["医学伦理", "知情同意", "伦理审查"],
    matchScore: 83,
    relatedPapers: 12,
    reviewCount: 56,
    rating: 4.7,
    availability: false
  }
];

const mockWorksheets = [
  {
    id: "ws1",
    name: "动物实验标准审查工作表",
    description: "用于动物实验项目的伦理审查，重点关注3R原则、动物福利与实验设计的科学性",
    suitabilityScore: 94,
    createdDate: "2023-12-10",
    lastUpdated: "2024-04-15",
    questionCount: 28,
    usageCount: 156
  },
  {
    id: "ws2",
    name: "转基因动物研究专用工作表",
    description: "专为转基因动物研究设计，包含转基因技术风险评估、生物安全与环境影响等特定审查要点",
    suitabilityScore: 88,
    createdDate: "2024-01-05",
    lastUpdated: "2024-04-02",
    questionCount: 32,
    usageCount: 48
  }
];

// 伦理项目审查详情页
export default function AssignExpertsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [projectTitle, setProjectTitle] = useState("");
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [selectedWorksheet, setSelectedWorksheet] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedExpertDetails, setSelectedExpertDetails] = useState<any[]>([]);
  const [selectedWorksheetDetail, setSelectedWorksheetDetail] = useState<any>(null);

  // 调试信息
  useEffect(() => {
    console.log("分配专家页面 - 当前参数ID:", params.id);
  }, [params.id]);

  // 模拟获取项目详情数据
  useEffect(() => {
    try {
      console.log("分配专家页面 - 开始加载项目详情，ID:", params.id);
      const projectDetail = getProjectDetail();
      
      if (projectDetail) {
        console.log("分配专家页面 - 项目详情加载成功:", projectDetail.id, projectDetail.title);
        setProjectTitle(projectDetail.title);
        setCurrentProject(projectDetail);
      } else {
        console.error("分配专家页面 - 项目详情未找到");
        toast({
          title: "未找到项目",
          description: `无法找到ID为${params.id}的审查项目详情`,
          variant: "destructive",
        });
        router.push("/ethic-review/quick-review");
      }
    } catch (error) {
      console.error("分配专家页面 - 加载项目详情时发生错误:", error);
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
    console.log("分配专家页面 - 正在查找项目，搜索ID:", searchId);
    
    try {
      const { quickReviewItems } = require("../../data/quick-review-demo-data");
      console.log("分配专家页面 - 尝试从quickReviewItems查找项目，可用项目数:", quickReviewItems.length);
      
      console.log("分配专家页面 - 可用项目ID列表:", quickReviewItems.map((p: any) => p.id).join(", "));
      
      // 先尝试直接匹配完整ID
      let listProject = quickReviewItems.find((p: any) => p.id === searchId);
      console.log("分配专家页面 - 直接匹配查找结果:", listProject ? "已找到" : "未找到");
      
      // 如果没找到，尝试从URL中解析出正确的格式
      if (!listProject) {
        // 处理 qr-2024-001 或 2024-001 格式
        const idParts = searchId.split('-');
        // 确保是数字部分
        if (idParts.length >= 2) {
          const yearPart = idParts[idParts.length - 2];
          const numberPart = idParts[idParts.length - 1];
          
          // 尝试匹配格式为 qr-YYYY-NNN 的项目
          console.log(`分配专家页面 - 尝试匹配格式: qr-${yearPart}-${numberPart}`);
          listProject = quickReviewItems.find((p: any) => 
            p.id === `qr-${yearPart}-${numberPart}`
          );
        }
      }
      
      // 如果还没找到，尝试其他属性匹配
      if (!listProject) {
        console.log("分配专家页面 - 尝试通过其他属性查找...");
        listProject = quickReviewItems.find((p: any) => 
          p.projectId === searchId || 
          p.reviewNumber === searchId
        );
      }
      
      if (listProject) {
        console.log("分配专家页面 - 在quickReviewItems中找到项目:", listProject.id, listProject.name);
        
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
          ]
        };
        
        console.log("分配专家页面 - 已转换项目数据:", detailProject.id, detailProject.title);
        return detailProject;
      } else {
        console.error("分配专家页面 - 在所有数据源中均未找到ID为", searchId, "的项目");
        return null;
      }
    } catch (error) {
      console.error("分配专家页面 - 无法加载或处理快速审查项目数据:", error);
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

  // 处理专家选择
  const handleExpertSelect = (expertId: string) => {
    setSelectedExperts(prev => {
      // 如果已选中，则移除，否则添加
      if (prev.includes(expertId)) {
        return prev.filter(id => id !== expertId);
      } else {
        return [...prev, expertId];
      }
    });
  };

  // 处理工作表选择
  const handleWorksheetSelect = (worksheetId: string) => {
    setSelectedWorksheet(prev => prev === worksheetId ? null : worksheetId);
  };

  // 处理提交
  const handleSubmit = () => {
    // 获取选中专家的详细信息
    const expertDetails = mockExperts.filter(expert => 
      selectedExperts.includes(expert.id)
    );
    
    // 获取选中工作表的详细信息
    const worksheetDetail = mockWorksheets.find(worksheet => 
      worksheet.id === selectedWorksheet
    );

    // 设置对话框数据
    setSelectedExpertDetails(expertDetails);
    setSelectedWorksheetDetail(worksheetDetail);
    
    // 显示确认对话框
    setShowConfirmDialog(true);
  };

  // 确认分配处理
  const handleConfirmAssignment = async () => {
    startLoading();
    
    try {
      // 这里可以添加实际的保存逻辑，例如API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 先关闭对话框
      setShowConfirmDialog(false);
      
      // 显示成功消息
      toast({
        title: "分配已保存",
        description: `已成功将${selectedExperts.length}位专家分配到此项目`,
        variant: "default",
      });
      
      // 停止加载状态
      stopLoading();
      
      // 使用await确保跳转完成
      await router.push("/ethic-review/quick-review");
    } catch (error) {
      console.error("分配专家时发生错误:", error);
      stopLoading();
      
      toast({
        title: "操作失败",
        description: "分配专家时发生错误，请稍后重试",
        variant: "destructive",
      });
    }
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
    // 返回空数组，不显示任何操作按钮
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

  // 创建AI推荐面板作为侧边栏
  const aiSidebar = (
    <AIRecommendationPanel 
      projectId={params.id}
      experts={mockExperts}
      worksheets={mockWorksheets}
      loading={false}
      onExpertSelect={handleExpertSelect}
      onWorksheetSelect={handleWorksheetSelect}
      selectedExperts={selectedExperts}
      selectedWorksheet={selectedWorksheet}
      onSubmit={handleSubmit}
      aiSummary={currentProject.aiSummary}
      riskLevel={currentProject.risk?.level}
      aiModelName={currentProject.aiModelName}
      aiModelVersion={currentProject.aiModelVersion}
    />
  );

  // 项目信息页头部信息 - 用于指导用户查看右侧推荐面板
  const InfoHeader = () => (
    <div className="mb-6">
      <div className="rounded-md border p-4 bg-blue-50">
        <div className="flex items-start">
          <div className="p-2 rounded-full bg-blue-100">
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium flex items-center">
              <UserRoundPlus className="h-4 w-4 mr-2 text-blue-600" />
              快速审查专家分配模式
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              您正在为项目分配审查专家。请在右侧<strong>AI智能推荐</strong>面板中查看系统推荐的专家和工作表，
              选择合适的专家后点击"确认分配"按钮提交。
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DetailPage
        id={params.id}
        title={(projectTitle || currentProject.title || `项目 ${params.id}`)}
        status={currentProject.status || "未知状态"}
        statusLabel={currentProject.statusLabel || currentProject.status || "未知状态"}
        onTitleEdit={handleTitleEdit}
        onBack={handleBackToList}
        showReviewSidebar={true}
        reviewSidebar={aiSidebar}
        statusColors={getStatusColors()}
        fields={getDetailFields()}
        actions={getActionButtons()}
        tabs={[
          {
            id: "overview",
            label: "项目概要",
            icon: <FileIcon className="h-4 w-4" />,
            component: (
              <>
                <InfoHeader />
                <EthicProjectOverviewTab project={currentProject} />
              </>
            )
          },
          {
            id: "riskAnalysis",
            label: "风险分析",
            icon: <AlertTriangle className="h-4 w-4" />,
            component: (
              <>
                <InfoHeader />
                <RiskAnalysisTab project={currentProject} />
              </>
            )
          },
          {
            id: "reviewFiles",
            label: "送审文件",
            icon: <FileText className="h-4 w-4" />,
            component: (
              <>
                <InfoHeader />
                <ReviewFilesTab project={currentProject} />
              </>
            )
          }
        ]}
      />

      {/* 确认分配对话框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-[550px] p-0 overflow-hidden">
          <div className="p-6 pb-2 border-b bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
            <DialogTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2.5 text-blue-600">
                <FileCheck className="h-4 w-4" />
              </div>
              确认专家分配
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 mt-1 pl-[42px]">
              请确认以下专家和工作表分配是否正确
            </DialogDescription>
          </div>
          
          <div className="py-6 px-8">
            <h3 className="text-sm font-medium mb-3 flex items-center text-slate-700">
              <User className="h-4 w-4 mr-2 text-blue-500" />
              已选择的专家 ({selectedExpertDetails.length})
            </h3>
            <div className="space-y-2.5 mb-5">
              {selectedExpertDetails.map((expert) => (
                <div 
                  key={expert.id} 
                  className="flex items-center p-3.5 border border-slate-200 rounded-lg bg-slate-50/80 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{expert.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{expert.department} · {expert.title}</div>
                  </div>
                  <div className="ml-auto text-sm">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      expert.matchScore >= 90 
                        ? "bg-green-50 text-green-700 border border-green-200" 
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      <span className="mr-1 flex-shrink-0">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      匹配度 {expert.matchScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-sm font-medium mb-3 flex items-center text-slate-700">
              <ClipboardList className="h-4 w-4 mr-2 text-blue-500" />
              已选择的工作表
            </h3>
            {selectedWorksheetDetail && (
              <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/80 hover:bg-slate-50 transition-colors shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{selectedWorksheetDetail.name}</div>
                    <div className="flex items-center text-xs text-slate-500 mt-0.5 gap-3">
                      <span className="flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        问题数量: {selectedWorksheetDetail.questionCount}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        更新时间: {selectedWorksheetDetail.lastUpdated}
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto text-sm">
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium border border-indigo-200">
                      匹配度 {selectedWorksheetDetail.suitabilityScore}%
                    </span>
                  </div>
                </div>
                {selectedWorksheetDetail.description && (
                  <div className="mt-2.5 text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-100">
                    {selectedWorksheetDetail.description}
                  </div>
                )}
              </div>
            )}
            
            <div>
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    确认后，系统将向选定的专家发送审查邀请，并分配所选工作表用于项目审查流程。
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <DialogFooter className="gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 border-slate-300"
              >
                <X className="h-4 w-4 mr-2" />
                返回修改
              </Button>
              <Button 
                onClick={handleConfirmAssignment} 
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span> 
                    处理中...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    确认分配
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 