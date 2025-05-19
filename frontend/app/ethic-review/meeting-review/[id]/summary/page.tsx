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
  ClipboardCheck,
  Check,
  Zap,
  ClipboardList,
  X,
  Download,
  Printer,
  UserPlus,
  MessageSquareText,
  MailQuestion,
  ChevronUp,
  ChevronDown
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
import React, { use } from "react"

// 修改组件引用路径从quick-review到meeting-review
import EthicProjectOverviewTab from "../../components/overview-tab"
import RiskAnalysisTab from "../../components/risk-analysis-tab"
import ReviewFilesTab from "../../components/review-files-tab"

// 导入AI推荐面板组件
import AISummaryPanel from "./components/ai-summary-panel"

// 导入项目数据 - 修改引用路径
import { meetingReviewItems } from "../../data/meeting-review-demo-data"

// 模拟专家意见数据 - 增强版
const mockExpertOpinions = [
  {
    id: "op-001",
    expertId: "exp-001",
    expertName: "王教授",
    department: "基础医学院",
    title: "教授",
    date: "2024-04-12",
    opinion: "项目总体设计合理，研究目标明确。在基因数据保护方面已有充分考虑，建议进一步完善对参与者的隐私保护措施。同意该项目实施。",
    detailedOpinion: "该项目提出了罕见遗传病快速基因诊断体系的构建，具有重要的临床应用价值。技术路线设计清晰，采用CRISPR技术进行基因诊断是当前国际前沿方向。项目组具备实施该项目的技术条件和经验。\n\n数据保护方面，项目计划通过数据匿名化和加密存储确保基因数据安全，但建议进一步明确参与者隐私保护的具体措施，特别是在知情同意过程中应详细告知参与者其基因数据的使用范围和保护机制。\n\n伦理方面，项目符合伦理审查的基本要求，但建议项目组关注儿童受试者的特殊保护措施，完善知情同意过程。",
    rating: 4.5,
    result: "同意",
    category: "伦理审查",
    specialty: "医学伦理学",
    expertise: ["基因诊断", "伦理审查", "隐私保护"],
    key_points: ["基因数据保护", "隐私保护", "同意实施"],
    follow_up_questions: ["如何确保未成年人的基因数据安全?", "项目中是否有数据销毁机制?"],
    aiSummary: "专家认为项目设计合理且有临床价值，但需加强数据保护措施，特别是针对儿童受试者的保护机制。"
  },
  {
    id: "op-002",
    expertId: "exp-002",
    expertName: "李博士",
    department: "药理学研究所",
    title: "副研究员",
    date: "2024-04-13",
    opinion: "项目方案设计科学，但对CRISPR技术应用范围的限制说明不够详细，建议明确技术应用边界，确保不会用于非诊断目的。修改后同意实施。",
    detailedOpinion: "该项目的科学设计总体合理，CRISPR技术在罕见遗传病诊断中的应用具有创新性和科学价值。方法学上选择的技术路线符合当前研究趋势。\n\n但项目存在以下需要改进的问题：\n1. CRISPR技术应用范围的限制说明不够详细，需要明确技术应用边界，特别是要明确规定该技术仅用于疾病诊断而非基因编辑或其他目的\n2. 对于可能的误诊问题，缺乏应对措施和解决方案\n3. 数据分析方法中，对于假阳性和假阴性的控制措施描述不足\n\n建议项目组补充以上内容，明确技术应用的限制条件和范围，完善质控措施，修改后可以实施。",
    rating: 3.8,
    result: "修改后同意",
    category: "科学性审查",
    specialty: "CRISPR基因技术",
    expertise: ["基因编辑", "CRISPR技术", "分子诊断"],
    key_points: ["技术应用范围", "应用边界限制", "修改后同意"],
    follow_up_questions: ["CRISPR技术的误判率如何控制?", "是否有替代诊断方法作为验证?"],
    aiSummary: "专家指出CRISPR技术应用边界描述不足，需明确限制在诊断用途，并完善质控措施防止误诊。"
  },
  {
    id: "op-003",
    expertId: "exp-004",
    expertName: "陈博士",
    department: "公共卫生学院",
    title: "研究员",
    date: "2024-04-14",
    opinion: "项目的知情同意过程描述详尽，但对于儿童受试者的特殊保护措施不足。建议补充相关内容，并强化数据匿名化流程。其他方面无重大问题。",
    detailedOpinion: "本项目在知情同意文件的设计上基本符合要求，对研究目的、风险和受益的说明较为清晰。特别是对基因数据使用范围的说明详尽，这点值得肯定。\n\n但同时存在以下问题：\n1. 对于儿童受试者的特殊保护措施说明不足，缺乏对父母/监护人知情同意的详细规定\n2. 数据匿名化流程描述不够具体，特别是如何防止数据再识别的措施\n3. 没有明确说明研究终止后数据的处理方式\n\n建议项目组补充关于儿童受试者保护的专门章节，详细说明知情同意流程和数据保护措施。同时建议完善数据匿名化和销毁机制的描述。其他方面项目设计合理，同意实施。",
    rating: 4.2,
    result: "同意",
    category: "伦理审查",
    specialty: "公共卫生伦理",
    expertise: ["知情同意", "数据隐私", "弱势群体保护"],
    key_points: ["知情同意", "儿童受试者保护", "数据匿名化"],
    follow_up_questions: ["儿童受试者的同意年龄界限如何设定?", "研究结束后的数据保存期限?"],
    aiSummary: "专家强调需完善儿童受试者保护措施和数据匿名化流程，特别是知情同意和数据处理环节的详细规定。"
  },
  {
    id: "op-004",
    expertId: "exp-005",
    expertName: "赵主任",
    department: "临床医学中心",
    title: "主任医师",
    date: "2024-04-15",
    opinion: "从临床应用角度，该项目具有较高的转化价值。建议增加临床验证样本量，并明确诊断标准与现有金标准的比对方案。总体上同意该项目实施。",
    detailedOpinion: "作为临床医师，我对该项目的临床应用前景持积极态度。罕见遗传病的快速诊断是当前临床工作中的重要需求，项目提出的CRISPR基因诊断体系如能成功建立，将大大缩短诊断时间，提高诊断准确率。\n\n对项目的几点建议：\n1. 建议增加临床验证样本量，特别是对不同类型罕见病的覆盖范围\n2. 需要明确新方法与现有金标准(如全外显子测序)的比对方案和评价指标\n3. 应考虑不同人种和地区人群的基因差异，增加样本多样性\n4. 临床实施方案中应增加对临床医师的培训计划\n\n总体而言，项目具有较高临床价值，支持实施，但建议完善以上几点内容。",
    rating: 4.3,
    result: "同意",
    category: "临床应用评估",
    specialty: "罕见病诊断",
    expertise: ["临床诊断", "罕见病研究", "转化医学"],
    key_points: ["临床转化价值", "样本量扩大", "诊断标准"],
    follow_up_questions: ["多中心验证是否有计划?", "临床推广时间规划?"],
    aiSummary: "专家从临床角度支持项目，建议扩大临床验证样本量，完善与金标准比对方案，并考虑人群多样性因素。"
  }
];

// 模拟独立顾问回复数据
const mockAdvisorResponses = [
  {
    id: "adv-001",
    advisorId: "advisor-001",
    advisorName: "张顾问",
    organization: "国家生物安全评估中心",
    title: "首席科学家",
    date: "2024-04-16",
    responseType: "技术咨询",
    question: "CRISPR技术在基因诊断中的应用边界与安全控制措施如何保障?",
    response: "关于CRISPR技术在基因诊断中的应用边界，应严格限制在疾病相关基因的检测范围内，不得扩展到基因编辑或其他用途。项目组需要建立多层次安全控制体系：\n\n1. 技术层面：使用无编辑活性的dCas9系统，确保只有检测功能而无编辑功能\n2. 操作层面：建立严格的实验室管理制度，包括人员资质审查、操作标准化、设备专用化\n3. 数据层面：对基因数据实施分级管理，建立访问权限控制系统\n4. 监管层面：成立独立的伦理与安全监督委员会，定期检查项目实施情况\n\n此外，建议项目组制定技术滥用应急预案，一旦发现技术被用于非预期目的时，有清晰的处理流程。总体而言，该项目在技术安全控制方面的规划基本合理，但需要进一步细化具体措施。",
    expertise: ["生物安全", "CRISPR技术", "风险控制"],
    recommendations: [
      "严格限制技术应用范围",
      "建立多层次安全控制体系",
      "成立独立监督委员会"
    ]
  },
  {
    id: "adv-002",
    advisorId: "advisor-002",
    advisorName: "刘教授",
    organization: "医学伦理咨询委员会",
    title: "伦理学专家",
    date: "2024-04-17",
    responseType: "伦理咨询",
    question: "如何完善针对儿童受试者的知情同意和数据保护流程?",
    response: "针对儿童受试者的特殊保护，项目组需要完善以下几个方面：\n\n一、知情同意流程优化：\n1. 年龄分层同意：7岁以下儿童由父母/监护人全权决定；7-14岁儿童在征得儿童本人同意的基础上由监护人签署知情同意；14-18岁未成年人在本人同意基础上由监护人协同签署\n2. 儿童友好的知情同意材料：针对不同年龄段儿童，开发图文并茂、易于理解的知情同意辅助材料\n3. 动态同意机制：随着儿童年龄增长，重新获取其知情同意\n\n二、数据保护强化措施：\n1. 儿童基因数据特殊标识与加密存储\n2. 限制数据使用范围，仅用于本研究诊断目的\n3. 数据去标识化存储，与身份信息分离保存\n4. 明确规定儿童达到成年后的数据处理选择权\n\n三、监督机制：\n1. 设立儿童权益保护专员，负责监督项目中儿童受试者权益\n2. 定期伦理审查，特别关注儿童受试者情况\n\n建议项目组采纳以上建议，完善儿童受试者保护方案，作为知情同意书的专门附录。",
    expertise: ["医学伦理", "弱势群体保护", "知情同意"],
    recommendations: [
      "实施年龄分层知情同意",
      "开发儿童友好的知情同意材料",
      "设立儿童权益保护专员"
    ]
  },
  {
    id: "adv-003",
    advisorId: "advisor-003",
    advisorName: "吴顾问",
    organization: "数据安全与隐私保护协会",
    title: "数据安全专家",
    date: "2024-04-18",
    responseType: "数据安全咨询",
    question: "基因数据的安全存储和隐私保护技术方案是否合规且有效?",
    response: "针对基因数据的安全存储和隐私保护，项目组的技术方案总体上合规，但有以下几点需要完善：\n\n一、数据存储安全：\n1. 当前方案中采用的AES-256加密算法合适，但建议增加密钥管理机制的细节说明\n2. 数据分级存储策略良好，但需明确不同级别数据的访问控制机制\n3. 建议采用区块链技术记录数据访问日志，确保不可篡改\n\n二、匿名化技术：\n1. 当前的k-匿名化方案对基因数据保护不足，建议结合差分隐私技术\n2. 对于罕见基因变异，需要特殊处理，防止通过独特变异位点识别个体\n3. 建议实施数据模糊化处理，在保证诊断精度的前提下降低识别风险\n\n三、数据治理：\n1. 明确数据保存期限和销毁流程\n2. 增加数据泄露应急响应方案\n3. 设立独立数据安全审计机制\n\n总体而言，项目组对数据安全的重视程度高，技术方案基本合理，但需要在上述几个方面进行完善。特别是对于基因数据这类高敏感信息，建议采用更严格的保护标准，可参考欧盟GDPR和我国《个人信息保护法》中关于生物识别信息的特殊保护要求。",
    expertise: ["数据安全", "隐私保护", "生物信息学"],
    recommendations: [
      "结合差分隐私和k-匿名化技术",
      "实施数据访问区块链日志",
      "制定数据泄露应急方案"
    ]
  }
];

// 模拟AI生成的意见汇总
const mockAISummary = {
  overallOpinion: "该项目得到了多数专家的认可，整体设计科学合理，研究目标明确。专家们一致认为项目具有重要的临床应用价值，技术路线可行。建议项目组根据专家意见进行以下修改后实施：",
  keyPoints: [
    "完善基因数据保护和隐私保护措施，特别是对儿童受试者的特殊保护",
    "明确CRISPR技术应用边界，确保仅用于诊断目的",
    "加强数据匿名化流程，防止数据滥用",
    "补充知情同意书中关于风险和益处的详细说明"
  ],
  expertConsensus: "多数专家同意该项目实施，部分专家建议修改后实施",
  recommendations: "建议项目组针对专家提出的问题进行修改，特别是CRISPR技术应用范围的限制和儿童受试者保护措施，完善后可以实施。",
  ethicalConsiderations: "项目在伦理方面基本符合要求，但需要加强对特殊人群的保护措施和数据安全管理。",
  date: "2024-04-15",
  version: "v1.0"
};

export default function SummaryPage({ params }: { params: { id: string } }) {
  // 使用正确的use函数解包params，使用断言解决类型问题
  const projectId = use(params as any).id;
  
  const router = useRouter();
  const { startLoading, stopLoading, isLoading } = useLoading();
  
  // 项目数据状态
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [projectTitle, setProjectTitle] = useState<string>("");
  
  // 导出对话框状态
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "docx" | "excel">("pdf");

  // 初始化
  useEffect(() => {
    // 从路由参数获取项目ID
    console.log("意见汇总页面 - 加载项目:", projectId);
    
    // 获取项目详情
    const projectDetail = getProjectDetail();
    if (projectDetail) {
      setCurrentProject(projectDetail);
      setProjectTitle(projectDetail.title);
    }
  }, [projectId]);

  // 获取项目详情
  const getProjectDetail = () => {
    try {
      // 从模拟数据中查找项目
      console.log("意见汇总页面 - 搜索项目ID:", projectId);
      
      // 从快速审查数据中查找
      const listProject = meetingReviewItems.find(item => item.id === projectId);
      
      if (listProject) {
        console.log("意见汇总页面 - 在meetingReviewItems中找到项目:", listProject.id, listProject.name);
        
        // 将列表项目数据转换为详情页需要的格式
        const detailProject = {
          id: listProject.id,
          title: listProject.name,
          status: mapStatus(listProject.status),
          statusLabel: mapStatus(listProject.status),
          reviewType: listProject.reviewType,
          projectType: listProject.projectType,
          // 处理可能不存在的属性
          ethicsCommittee: listProject.ethicsCommittee,
          department: listProject.department,
          leader: listProject.projectLeader?.name || "未指定",
          createdAt: listProject.createdAt || "未指定",
          submittedAt: listProject.submissionDate || listProject.createdAt || "未指定",
          reviewNumber: listProject.projectId,
          progress: listProject.reviewProgress || 0,
          description: listProject.description || "暂无描述",
          // 添加意见汇总相关数据
          expertOpinions: mockExpertOpinions,
          advisorResponses: mockAdvisorResponses,
          aiSummaryRaw: mockAISummary,
          // 为 EthicProjectOverviewTab 添加字符串格式的 aiSummary
          aiSummary: mockAISummary ? `${mockAISummary.overallOpinion}\n\n专家共识：\n${mockAISummary.expertConsensus}\n\n建议：\n${mockAISummary.recommendations}\n\n伦理考量：\n${mockAISummary.ethicalConsiderations}` : "",
          aiModelName: "EthicGPT 2024",
          aiModelVersion: "v3.1",
          aiSuggestions: mockAISummary ? mockAISummary.keyPoints : [],
          // 额外的属性用于 EthicProjectOverviewTab 组件
          progressScore: "良好",
          riskScore: "中度",
          achievementScore: "良好",
          confidenceScore: 95,
          analysisTime: mockAISummary ? mockAISummary.date : "2024-04-15",
          reviewResult: listProject.reviewResult || "未知",
          reviewDate: listProject.reviewDate || "未知",
          reviewComments: listProject.reviewComments || "暂无评论",
          files: [
            { id: "temp1", name: "项目申请书.pdf", type: "application", size: "未知", uploadedAt: listProject.submissionDate || "未知", status: "已审核" },
            { id: "temp2", name: "专家意见汇总.pdf", type: "review", size: "1.2MB", uploadedAt: listProject.reviewDate || "未知", status: "已生成" }
          ],
          // 添加风险分析数据
          risk: {
            level: "中",
            aiConfidence: 92,
            analysis: "该罕见遗传病快速基因诊断体系建立项目主要涉及基因诊断技术的开发与应用，主要风险点分析如下：\n\n1. 技术相关风险：CRISPR基因诊断技术虽然高效准确，但在临床应用前需要严格验证其特异性和敏感性，避免假阳性和假阴性结果。当前方案中对于技术验证环节设计较为合理，但验证样本量偏小，可能影响技术评估的可靠性。\n\n2. 数据安全风险：基因数据属于高度敏感的个人信息，项目虽然采用了多级加密存储方案，但对于数据使用边界的限定和数据访问审计机制还不够完善，存在潜在的数据滥用或泄露风险。\n\n3. 伦理风险：基因诊断结果可能对受试者产生心理影响，特别是针对儿童受试者的知情同意和结果告知流程需要更加细化。当前方案中对特殊人群（如儿童、孕妇）的保护措施描述不足。\n\n4. 临床应用风险：快速诊断要求在时效性和准确性之间取得平衡，紧急情况下可能面临诊断时间压力，影响结果质量。项目需要建立明确的质量控制流程和异常结果处理机制。",
            suggestions: [
              "扩大技术验证样本量，建议增加至少100例不同类型罕见病样本进行验证，确保诊断技术的普适性和可靠性",
              "完善基因数据保护方案，增加数据访问审计和追溯机制，明确规定数据使用范围和销毁流程",
              "针对儿童受试者，制定专门的知情同意流程和心理支持方案，确保其特殊权益得到充分保障",
              "建立诊断结果质量控制体系，包括结果复核机制、阳性/阴性对照设置和定期能力验证",
              "完善紧急情况下的操作规程，确保在时间压力下仍能保证诊断质量和结果准确性"
            ]
          }
        };
        
        console.log("意见汇总页面 - 已转换项目数据:", detailProject.id, detailProject.title);
        return detailProject;
      } else {
        console.error("意见汇总页面 - 在所有数据源中均未找到ID为", projectId, "的项目");
        return null;
      }
    } catch (error) {
      console.error("意见汇总页面 - 无法加载或处理快速审查项目数据:", error);
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
    router.push("/ethic-review/meeting-review");
  };

  // 处理标题编辑
  const handleTitleEdit = (newTitle: string) => {
    setProjectTitle(newTitle);
    toast({
      title: "标题已更新",
      description: "项目标题已成功更新",
    });
  };

  // 处理导出
  const handleExport = (format: "pdf" | "docx" | "excel") => {
    setExportFormat(format);
    setShowExportDialog(true);
  };

  // 确认导出
  const handleConfirmExport = async () => {
    startLoading();
    
    try {
      // 模拟导出过程
      toast({
        title: "正在导出",
        description: `正在导出${exportFormat.toUpperCase()}格式的意见汇总报告...`,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "导出成功",
        description: "意见汇总报告已成功导出",
      });
      
      setShowExportDialog(false);
      stopLoading();
    } catch (error) {
      console.error("导出意见汇总报告时发生错误:", error);
      stopLoading();
      
      toast({
        title: "导出失败",
        description: "导出意见汇总报告时发生错误，请稍后重试",
        variant: "destructive",
      });
    }
  };

  // 处理打印
  const handlePrint = async () => {
    startLoading();
    
    try {
      toast({
        title: "准备打印",
        description: "正在准备打印意见汇总报告...",
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里实际上会调用打印API
      window.print();
      
      stopLoading();
    } catch (error) {
      console.error("打印意见汇总报告时发生错误:", error);
      stopLoading();
      
      toast({
        title: "打印失败",
        description: "打印意见汇总报告时发生错误，请稍后重试",
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
        <div className="text-sm text-gray-500 mt-2">正在加载项目ID: {projectId} 的详情数据</div>
      </div>
    );
  }

  // 获取操作按钮
  const getActionButtons = () => {
    return [
      {
        id: "export-pdf",
        label: "导出PDF",
        icon: <Download className="h-4 w-4" />,
        onClick: () => handleExport("pdf")
      },
      {
        id: "export-word",
        label: "导出Word",
        icon: <FileText className="h-4 w-4" />,
        onClick: () => handleExport("docx")
      },
      {
        id: "print",
        label: "打印报告",
        icon: <Printer className="h-4 w-4" />,
        onClick: handlePrint
      }
    ];
  };

  // 获取字段信息 - 精简为只显示受理号、审查类型、负责人、所属单位
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
        id: "reviewType",
        label: "审查类型",
        value: currentProject.reviewType || "未指定",
        icon: <FileCheck className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "leader",
        label: "负责人",
        value: currentProject.leader || "未指定",
        icon: <User className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "department",
        label: "所属单位",
        value: currentProject.department || "未指定",
        icon: <Building2 className="h-4 w-4 text-gray-400" />,
      }
    ];
    
    return baseFields;
  };

  // 获取AI推荐面板作为侧边栏
  const aiSidebar = (
    <AISummaryPanel 
      projectId={projectId}
      aiSummary={currentProject.aiSummary}
      expertOpinions={currentProject.expertOpinions}
      onExport={handleExport}
      onPrint={handlePrint}
    />
  );

  // 意见汇总选项卡
  const OpinionSummaryTab = () => {
    // 管理展开状态的钩子
    const [expandedExpert, setExpandedExpert] = useState<string | null>(null);
    
    // 切换展开状态
    const toggleExpert = (expertId: string) => {
      setExpandedExpert(expandedExpert === expertId ? null : expertId);
    };
    
    return (
      <div className="space-y-6">
        {/* 专家评审意见列表 - 简约版 */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-3">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            专家评审意见 ({currentProject.expertOpinions.length})
          </h3>
          
          <div className="overflow-hidden border rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              {/* 优化表头样式 */}
              <thead className="bg-blue-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-blue-700 tracking-wider w-1/5">专家信息</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-blue-700 tracking-wider w-1/6">评审结果</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-blue-700 tracking-wider">AI总结评审意见</th>
                  <th scope="col" className="px-4 py-3 text-center text-sm font-medium text-blue-700 tracking-wider w-24">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProject.expertOpinions.map((opinion: any) => (
                  <React.Fragment key={opinion.id}>
                    <tr 
                      className={`hover:bg-gray-50 ${expandedExpert === opinion.id ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{opinion.expertName}</div>
                            <div className="text-xs text-gray-500">{opinion.department}</div>
                            <div className="text-xs text-gray-500">{opinion.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                          opinion.result === "同意" 
                            ? "bg-green-50 text-green-700" 
                            : opinion.result === "修改后同意" 
                            ? "bg-amber-50 text-amber-700" 
                            : "bg-red-50 text-red-700"
                        }`}>
                          {opinion.result}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {opinion.key_points.map((point: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {point}
                            </span>
                          ))}
                        </div>
                        
                        {/* AI总结部分 */}
                        {opinion.aiSummary && (
                          <div className="text-xs text-gray-700">
                            <p className="text-gray-600 line-clamp-2">{opinion.aiSummary}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {/* 优化详情按钮样式，确保在一行内展示 */}
                        <button
                          onClick={() => toggleExpert(opinion.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center whitespace-nowrap ${
                            expandedExpert === opinion.id
                              ? "bg-blue-100 text-blue-700 border border-blue-300"
                              : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                          }`}
                        >
                          {expandedExpert === opinion.id ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1 flex-shrink-0" /><span>收起</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1 flex-shrink-0" /><span>详情</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {/* 行内展开的详情内容 */}
                    {expandedExpert === opinion.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="px-4 py-3 border-t border-gray-100">
                          <div className="py-2">
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">专家意见</h4>
                              <div className="p-3 bg-white rounded border text-sm">
                                {opinion.opinion}
                              </div>
                            </div>
                            
                            {opinion.detailedOpinion && (
                              <div className="mb-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">详细评审意见</h4>
                                <div className="p-3 bg-white rounded border text-sm whitespace-pre-line">
                                  {opinion.detailedOpinion}
                                </div>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {opinion.expertise && (
                                <div>
                                  <h4 className="text-xs font-medium text-gray-700 mb-1">专业背景</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {opinion.expertise.map((expertise: string, index: number) => (
                                      <div key={index} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                                        {expertise}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {opinion.follow_up_questions && opinion.follow_up_questions.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-medium text-gray-700 mb-1">跟进问题</h4>
                                  <ul className="list-disc pl-4 text-xs text-amber-800 space-y-1">
                                    {opinion.follow_up_questions.map((question: string, index: number) => (
                                      <li key={index}>{question}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 独立顾问回复 - 简约版 */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-3">
            <UserPlus className="h-5 w-5 mr-2 text-indigo-600" />
            独立顾问回复 ({currentProject.advisorResponses.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentProject.advisorResponses.map((advisor: any) => (
              <div key={advisor.id} className="border rounded-lg p-3 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                      <UserPlus className="h-3 w-3" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{advisor.advisorName}</div>
                      <div className="text-xs text-gray-500">{advisor.organization} · {advisor.responseType}</div>
                    </div>
                  </div>
                  
                  {/* 优化顾问详情按钮样式 */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const detailEl = document.getElementById(`advisor-${advisor.id}`);
                      if (detailEl) {
                        const isHidden = detailEl.classList.contains('hidden');
                        detailEl.classList.toggle('hidden', !isHidden);
                        
                        // 同时切换按钮文本
                        const btnEl = e.currentTarget as HTMLButtonElement;
                        if (btnEl.querySelector('.btn-text')?.textContent === '详情') {
                          btnEl.querySelector('.btn-icon')?.classList.replace('rotate-0', '-rotate-180');
                          btnEl.querySelector('.btn-text')!.textContent = '收起';
                        } else {
                          btnEl.querySelector('.btn-icon')?.classList.replace('-rotate-180', 'rotate-0');
                          btnEl.querySelector('.btn-text')!.textContent = '详情';
                        }
                      }
                    }}
                    className="px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all"
                  >
                    <ChevronDown className="h-3 w-3 mr-1 btn-icon rotate-0 transition-transform duration-200" />
                    <span className="btn-text whitespace-nowrap">详情</span>
                  </button>
                </div>
                
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">咨询问题</div>
                  <div className="p-2 bg-indigo-50 rounded text-sm text-indigo-800">
                    {advisor.question}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">主要建议</div>
                  <div className="mt-1">
                    <div className="text-sm text-gray-800">
                      {advisor.recommendations[0]}
                    </div>
                    {advisor.recommendations.length > 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        还有 {advisor.recommendations.length - 1} 条建议...
                      </div>
                    )}
                  </div>
                  
                  <div id={`advisor-${advisor.id}`} className="hidden mt-3">
                    <div className="border-t pt-2 mt-2">
                      <div className="text-xs font-medium text-gray-500 mb-1">完整回复</div>
                      <div className="p-3 bg-gray-50 rounded border text-sm whitespace-pre-line">
                        {advisor.response}
                      </div>
                      
                      {/* 显示所有建议 */}
                      <div className="mt-3">
                        <div className="text-xs font-medium text-gray-500 mb-1">所有建议</div>
                        <ul className="list-disc pl-4 text-xs text-green-800 space-y-1 p-2 bg-green-50 rounded-md">
                          {advisor.recommendations.map((rec: string, index: number) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DetailPage
        id={projectId}
        title={(projectTitle || currentProject.title || `项目 ${projectId}`)}
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
            id: "opinions",
            label: "专家评审",
            icon: <ClipboardCheck className="h-4 w-4" />,
            component: <OpinionSummaryTab />
          },
          {
            id: "overview",
            label: "项目概要",
            icon: <FileIcon className="h-4 w-4" />,
            component: <EthicProjectOverviewTab project={currentProject} />
          },
          {
            id: "reviewFiles",
            label: "送审文件",
            icon: <FileText className="h-4 w-4" />,
            component: <ReviewFilesTab project={currentProject} />
          },
          {
            id: "riskAnalysis",
            label: "风险分析",
            icon: <AlertTriangle className="h-4 w-4" />,
            component: <RiskAnalysisTab project={currentProject} />
          }
        ]}
      />

      {/* 导出确认对话框 */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认导出</DialogTitle>
            <DialogDescription>
              您确定要导出{exportFormat.toUpperCase()}格式的专家意见汇总报告吗？
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                导出的报告将包含所有专家意见和AI生成的意见汇总，可用于项目评审和归档。
              </p>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmExport}>
              确认导出
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 