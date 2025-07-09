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
  FileCheck,
  User,
  FileSignature,
  ClipboardCheck
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
import React from "react"

// 复用快速审查组件
import EthicProjectOverviewTab from "@/app/ethic-review/quick-review/components/overview-tab"
import ReviewFilesTab from "@/app/ethic-review/quick-review/components/review-files-tab"

// 导入AI推荐面板组件
import AISummaryPanel from "./components/ai-summary-panel"

// 导入专家评审页签组件  
import ExpertReviewTab, { ExpertReviewSummaryDialog } from "../../components/expert-review-tab"

// 导入项目数据
import { quickReviewItems } from "../../data/quick-review-demo-data"

// 模拟专家意见数据 - 精简版
const mockExpertOpinions = [
  {
    id: "op-001",
    expertId: "exp-001",
    expertName: "王教授",
    department: "基础医学院",
    title: "教授",
    date: "2024-04-12",
    opinion: "项目总体设计合理，研究目标明确。在基因数据保护方面已有充分考虑，建议进一步完善对参与者的隐私保护措施。项目组具备实施该项目的技术条件和经验，CRISPR技术进行基因诊断是当前国际前沿方向。但在伦理方面，建议项目组关注儿童受试者的特殊保护措施，完善知情同意过程，详细告知参与者其基因数据的使用范围和保护机制。总体而言，项目符合伦理审查的基本要求，同意该项目实施。",
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
    opinion: "项目方案设计科学，CRISPR技术在罕见遗传病诊断中的应用具有创新性和科学价值，方法学上选择的技术路线符合当前研究趋势。但对CRISPR技术应用范围的限制说明不够详细，需要明确技术应用边界，特别是要明确规定该技术仅用于疾病诊断而非基因编辑或其他目的。对于可能的误诊问题，缺乏应对措施和解决方案，数据分析方法中对于假阳性和假阴性的控制措施描述不足。建议项目组补充以上内容，明确技术应用的限制条件和范围，完善质控措施，修改后可以实施。",
    rating: 3.8,
          result: "必要的修改后同意",
    category: "科学性审查",
    specialty: "CRISPR基因技术",
    expertise: ["基因编辑", "CRISPR技术", "分子诊断"],
          key_points: ["技术应用范围", "应用边界限制", "必要的修改后同意"],
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
    opinion: "本项目在知情同意文件的设计上基本符合要求，对研究目的、风险和受益的说明较为清晰，特别是对基因数据使用范围的说明详尽，这点值得肯定。但对于儿童受试者的特殊保护措施说明不足，缺乏对父母/监护人知情同意的详细规定；数据匿名化流程描述不够具体，特别是如何防止数据再识别的措施；没有明确说明研究终止后数据的处理方式。建议项目组补充关于儿童受试者保护的专门章节，详细说明知情同意流程和数据保护措施，同时建议完善数据匿名化和销毁机制的描述。其他方面项目设计合理，同意实施。",
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
    expertName: "李教授",
    department: "生物医学工程系",
    title: "教授",
    date: "2024-04-15",
    opinion: "该项目涉及CRISPR基因检测技术在罕见遗传病诊断中的创新应用，技术路线具有前瞻性，研究意义重大。然而，项目在多个核心环节存在重要问题需要深入讨论：首先，CRISPR技术的特异性和准确性在复杂基因背景下的表现尚需验证，可能存在假阳性和假阴性风险；其次，涉及儿童受试者的基因检测具有特殊的伦理考量，包括知情同意、隐私保护、以及对儿童未来生活的潜在影响；第三，基因数据的长期存储、使用和共享涉及复杂的法律和伦理问题。鉴于项目的复杂性和争议性，建议提交伦理委员会会议进行全面讨论，需要多学科专家共同评估技术风险、伦理风险和社会影响，制定更加详细和严格的实施方案。",
    rating: 3.5,
    result: "转会议",
    category: "综合评估",
    specialty: "生物医学工程",
    expertise: ["基因检测技术", "生物医学伦理", "技术风险评估"],
    key_points: ["技术特异性验证", "儿童伦理保护", "数据治理", "多学科评估"],
    follow_up_questions: ["如何验证CRISPR技术在复杂基因背景下的准确性?", "儿童基因数据的长期影响如何评估?", "多学科专家会议的具体安排?"],
    aiSummary: "专家认为项目具有重要意义但存在多个复杂问题，建议通过伦理委员会会议进行多学科专家的全面评估和讨论。"
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

export default function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const projectId = resolvedParams.id;
  
  const router = useRouter();
  const { startLoading, stopLoading, isLoading } = useLoading();
  
  // 项目数据状态
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [projectTitle, setProjectTitle] = useState<string>("");
  
  // 导出对话框状态
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "docx" | "excel">("pdf");

  // 汇总统计状态 - 必须在所有条件渲染之前
  const [summaryStats, setSummaryStats] = useState<any>({});
  const [starredOpinions, setStarredOpinions] = useState<Set<string>>(new Set());

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

  // 计算统计数据
  useEffect(() => {
    if (currentProject?.expertOpinions) {
      const opinions = currentProject.expertOpinions;
      const total = opinions.length;
      const agree = opinions.filter((op: any) => op.result === "同意").length;
      const modifyAgree = opinions.filter((op: any) => op.result === "必要的修改后同意").length;
    const transferMeeting = opinions.filter((op: any) => op.result === "转会议").length;
      const disagree = opinions.filter((op: any) => op.result === "不同意").length;
      
      const stats = {
        total,
        agree,
        modifyAgree,
        transferMeeting,
        disagree,
        agreePercent: total > 0 ? ((agree / total) * 100).toFixed(0) : "0",
        modifyAgreePercent: total > 0 ? ((modifyAgree / total) * 100).toFixed(0) : "0",
        transferMeetingPercent: total > 0 ? ((transferMeeting / total) * 100).toFixed(0) : "0",
        disagreePercent: total > 0 ? ((disagree / total) * 100).toFixed(0) : "0",
        conflictCount: 0,
        conflicts: {}
      };
      
      setSummaryStats(stats);
    }
  }, [currentProject]);

  // 获取项目详情
  const getProjectDetail = () => {
    const searchId = projectId;
    console.log("意见汇总页面 - 正在查找项目，搜索ID:", searchId);
    
    try {
      console.log("意见汇总页面 - 尝试从quickReviewItems查找项目，可用项目数:", quickReviewItems.length);
      
      console.log("意见汇总页面 - 可用项目ID列表:", quickReviewItems.map((p: any) => p.id).join(", "));
      
      // 先尝试直接匹配完整ID
      let listProject = quickReviewItems.find((p: any) => p.id === searchId);
      console.log("意见汇总页面 - 直接匹配查找结果:", listProject ? "已找到" : "未找到");
      
      // 如果没找到，尝试从URL中解析出正确的格式
      if (!listProject) {
        // 处理 qr-2024-001 或 2024-001 格式
        const idParts = searchId.split('-');
        // 确保是数字部分
        if (idParts.length >= 2) {
          const yearPart = idParts[idParts.length - 2];
          const numberPart = idParts[idParts.length - 1];
          
          // 尝试匹配格式为 qr-YYYY-NNN 的项目
          console.log(`意见汇总页面 - 尝试匹配格式: qr-${yearPart}-${numberPart}`);
          listProject = quickReviewItems.find((p: any) => 
            p.id === `qr-${yearPart}-${numberPart}`
          );
        }
      }
      
      // 如果还没找到，尝试其他属性匹配
      if (!listProject) {
        console.log("意见汇总页面 - 尝试通过其他属性查找...");
        listProject = quickReviewItems.find((p: any) => 
          p.projectId === searchId || 
          p.reviewNumber === searchId
        );
      }
      
      if (listProject) {
        console.log("意见汇总页面 - 在quickReviewItems中找到项目:", listProject.id, listProject.name);
        
        // 将列表项目数据转换为详情页需要的格式
        const detailProject = {
          id: listProject.id,
          title: listProject.name,
          status: mapStatus(listProject.status),
          statusLabel: mapStatus(listProject.status),
          reviewType: listProject.reviewType,
          projectType: listProject.projectType,
          animalType: listProject.projectSubType === "动物" ? ((listProject as any).animalType || "未指定") : undefined,
          animalCount: listProject.projectSubType === "动物" ? ((listProject as any).animalCount || "未指定") : undefined,
          participantCount: listProject.projectSubType === "人体" ? ((listProject as any).participantCount || "未指定") : undefined,
          ethicsCommittee: listProject.ethicsCommittee,
          department: listProject.department,
          leader: listProject.projectLeader?.name || "未指定",
          createdAt: listProject.createdAt || "未指定",
          deadline: (listProject as any).dueDate || "未指定",
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
          ],
          // 添加意见汇总相关数据
          expertOpinions: mockExpertOpinions,
          advisorResponses: mockAdvisorResponses,
          aiSummaryRaw: mockAISummary
        };
        
        console.log("意见汇总页面 - 已转换项目数据:", detailProject.id, detailProject.title);
        return detailProject;
      } else {
        console.error("意见汇总页面 - 在所有数据源中均未找到ID为", searchId, "的项目");
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

  // 处理汇总报告按钮点击
  const handleSummaryReport = () => {
    // 触发隐藏的汇总报告对话框
    const trigger = document.getElementById("summary-report-trigger");
    if (trigger) {
      trigger.click();
    }
  };

  // 获取操作按钮 - 添加汇总报告按钮
  const getActionButtons = () => {
    return [
      {
        id: "summary-report",
        label: "导出汇报",
        icon: <FileText className="h-4 w-4" />,
        onClick: handleSummaryReport,
        variant: "outline" as const
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

  // 处理提交审查意见
  const handleSubmitReview = () => {
    startLoading();
    toast({
      title: "提交中",
      description: "正在提交AI审查意见...",
    });
    
    setTimeout(() => {
      stopLoading();
      toast({
        title: "提交成功",
        description: "AI审查意见已提交，正在返回快速审查列表",
      });
      
      // 返回快速审查列表
      setTimeout(() => {
        router.push('/ethic-review/quick-review');
      }, 1000);
    }, 2000);
  };

  // 处理关闭并返回列表
  const handleCloseAndReturn = () => {
    router.push('/ethic-review/quick-review');
  };

  // 获取AI推荐面板作为侧边栏
  const aiSidebar = currentProject ? (
    <AISummaryPanel 
      projectId={projectId}
      aiSummary={currentProject.aiSummary}
      expertOpinions={currentProject.expertOpinions}
      onExport={handleExport}
      onPrint={handlePrint}
      onSubmit={handleSubmitReview}
      onClose={handleCloseAndReturn}
    />
  ) : null;

  // 获取专家评审页签组件实例
  const getOpinionSummaryTab = () => {
    if (!currentProject) return null;
    return (
      <ExpertReviewTab 
        expertOpinions={currentProject.expertOpinions || []}
        advisorResponses={currentProject.advisorResponses || []}
      />
    );
  };

  // 加载状态或错误处理 - 在所有Hooks之后
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
            component: getOpinionSummaryTab()
          },
          {
            id: "overview",
            label: "项目概要",
            icon: <FileIcon className="h-4 w-4" />,
            component: currentProject ? <EthicProjectOverviewTab project={currentProject} /> : null
          },
          {
            id: "reviewFiles",
            label: "送审文件",
            icon: <FileText className="h-4 w-4" />,
            component: currentProject ? <ReviewFilesTab project={currentProject} /> : null
          }
        ]}
      />

      {/* 专家评审汇总报告对话框 */}
      <ExpertReviewSummaryDialog
        stats={summaryStats}
        starredOpinions={starredOpinions}
        trigger={
          <Button 
            variant="outline" 
            className="hidden" 
            id="summary-report-trigger"
          >
            <FileText className="h-4 w-4 mr-2" />
            导出汇报
          </Button>
        }
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