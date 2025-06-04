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
import EthicProjectOverviewTab from "@/app/ethic-review/human-genetics-review/components/overview-tab"
import RiskAnalysisTab from "@/app/ethic-review/human-genetics-review/components/risk-analysis-tab"
import ReviewFilesTab from "@/app/ethic-review/human-genetics-review/components/review-files-tab"

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
          description: `无法找到ID为${params.id}的人遗资源项目详情`,
          variant: "destructive",
        });
        router.push("/ethic-review/human-genetics-review");
      }
    } catch (error) {
      console.error("加载项目详情时发生错误:", error);
      toast({
        title: "加载错误",
        description: "加载项目详情时发生错误，请稍后重试",
        variant: "destructive",
      });
      router.push("/ethic-review/human-genetics-review");
    }
  }, [params.id, router]);

  // 获取项目详情 - 根据多个属性查找
  const getProjectDetail = () => {
    const searchId = params.id;
    console.log("正在查找项目，搜索ID:", searchId);
    
    // 查找项目
    try {
      // 先尝试从演示数据中查找
      const { humanGeneticsReviewItems } = require("../data/human-genetics-review-demo-data");
      
      // 先检查是否直接匹配ID
      let listProject = humanGeneticsReviewItems.find((p: any) => p.id === searchId);
      
      // 如果没找到，则尝试匹配projectId
      if (!listProject) {
        listProject = humanGeneticsReviewItems.find((p: any) => p.projectId === searchId);
      }
      
      if (listProject) {
        console.log("在humanGeneticsReviewItems中找到项目:", listProject.id, listProject.name);
        
        // 将列表项目数据转换为详情页需要的格式
        const detailProject = {
          id: listProject.id,
          title: listProject.name,
          status: mapStatus(listProject.status),
          statusLabel: mapStatus(listProject.status),
          reviewType: listProject.reviewType,
          approvalType: listProject.approvalType,
          projectType: listProject.projectType,
          geneticMaterial: listProject.geneticMaterial || "未指定",
          sampleSize: listProject.sampleSize || "未指定",
          geneticTest: listProject.geneticTest || "未指定",
          dataProtection: listProject.dataProtection || "未指定",
          ethicsCommittee: listProject.ethicsCommittee,
          department: listProject.department,
          leader: listProject.projectLeader?.name || "未指定",
          createdAt: listProject.dueDate || "未指定",
          deadline: listProject.dueDate || "未指定",
          submittedAt: listProject.actualDate || listProject.dueDate || "未指定",
          reviewNumber: listProject.projectId,
          progress: listProject.completion || 0,
          description: listProject.description || "暂无描述",
          // 构建基于项目特性的AI审核摘要
          aiSummary: getProjectAiSummary(listProject),
          aiModelName: "EthicGPT 2024",
          aiModelVersion: "v3.1",
          // 构建基于项目特性的风险分析数据
          risk: getProjectRiskData(listProject),
          // 构建基于项目特性的文件列表
          files: getProjectFiles(listProject)
        };
        
        console.log("已转换项目数据:", detailProject.id, detailProject.title);
        return detailProject;
      } else {
        console.error("在所有数据源中均未找到ID为", searchId, "的项目");
        // 记录所有可用项目ID以便调试
        console.log("可用的项目ID列表:", humanGeneticsReviewItems.map((p: any) => p.id).join(", "));
        return null;
      }
    } catch (error) {
      console.error("无法加载或处理人遗资源项目数据:", error);
      return null;
    }
  };

  // 获取项目AI审核摘要
  function getProjectAiSummary(project: any) {
    // 根据项目ID或审批类型提供不同的AI摘要
    switch(project.id) {
      case "ETH-HG-2024-001":
        return "【审核要点摘要】\n• 知情同意流程完整规范\n• 基因数据加密存储方案可行\n• 符合人类遗传资源保护条例\n• 遗传咨询方案完善\n\n建议：加强数据脱敏与隐私保护措施";
      case "ETH-HG-2024-004":
        return "【退回原因分析】\n• 数据库共享机制不符合人遗办规定\n• 跨境数据传输协议不完善\n• 未明确说明遗传资源出境目的\n• 未提供足够的数据安全保障措施\n\n建议：补充完善上述内容后重新提交";
      case "ETH-HG-2024-006":
        return "【退回原因分析】\n• 知情同意书缺乏遗传信息共享说明\n• 数据保护措施不完善\n• 样本储存方案不符合规范\n• 缺乏明确的样本使用范围限制\n\n建议：请按照人遗办最新规定完善申请材料";
      default:
        // 根据审批类型提供通用摘要
        if (project.approvalType === "人遗采集审批") {
          return "【审核要点摘要】\n• 知情同意流程基本合规\n• 样本采集方法符合规范\n• 遗传资源保护措施适当\n• 样本运输与储存计划合理\n\n建议：进一步完善数据安全保障措施";
        } else if (project.approvalType === "材料出境审批") {
          return "【审核要点摘要】\n• 出境目的说明清晰\n• 合作方资质审核通过\n• 数据共享协议基本合规\n• 知识产权保护条款完善\n\n建议：明确数据使用期限与范围限制";
        } else {
          return "【审核要点摘要】\n• 项目伦理审查基本符合要求\n• 知情同意流程规范\n• 数据保护措施合理\n• 遗传咨询支持方案完善\n\n建议：持续监测数据安全与隐私保护措施执行情况";
        }
    }
  }

  // 获取项目风险分析数据
  function getProjectRiskData(project: any) {
    // 根据项目ID或审批类型提供不同的风险分析
    switch(project.id) {
      case "ETH-HG-2024-001":
        return {
          level: "中低",
          analysis: "该项目为BRCA1/2基因致病变异筛查，涉及癌症风险评估，需要妥善处理遗传风险告知与心理咨询。采集中符合人遗办相关规定，但需要加强数据保护。",
          suggestions: [
            "该人体项目跟踪报告相关内容",
            "强化基因数据脱敏与加密存储措施",
            "建立专业的遗传咨询团队支持",
            "确保符合最新的人类遗传资源保护条例"
          ]
        };
      case "ETH-HG-2024-004":
        return {
          level: "高",
          analysis: "该项目涉及大规模基因组数据库建设与材料出境，存在数据安全、隐私保护和遗传资源流失风险。当前的跨境数据传输协议与共享机制不符合人遗办最新规定。",
          suggestions: [
            "重新设计数据库访问权限控制机制",
            "完善跨境数据传输协议，确保符合人遗办规定",
            "明确数据使用范围与期限",
            "建立数据安全应急响应机制",
            "加强与合作方的数据保护协议约束"
          ]
        };
      case "ETH-HG-2024-006":
        return {
          level: "中高",
          analysis: "该项目涉及帕金森病相关基因变异研究，对外提供使用，存在数据保护不足与样本储存不规范问题。知情同意书中未充分说明遗传信息共享范围。",
          suggestions: [
            "完善知情同意书，明确说明数据共享范围",
            "建立符合规范的样本库管理体系",
            "强化数据安全保护技术措施",
            "限制遗传数据的使用范围与期限"
          ]
        };
      default:
        // 根据审批类型提供通用风险分析
        if (project.approvalType === "人遗采集审批") {
          return {
            level: "中",
            analysis: "人类遗传资源采集项目存在受试者知情同意、数据隐私保护和遗传信息解读等风险。需确保符合人遗办最新规定。",
            suggestions: [
              "规范知情同意流程，确保受试者充分理解",
              "加强数据加密与访问控制措施",
              "建立专业的遗传咨询支持系统",
              "严格遵循人遗办采集规范与流程"
            ]
          };
        } else if (project.approvalType === "材料出境审批") {
          return {
            level: "高",
            analysis: "涉及遗传资源出境的项目风险较高，包括数据安全风险、遗传资源流失风险和知识产权保护风险。",
            suggestions: [
              "完善合作协议中的知识产权条款",
              "建立出境材料追踪机制",
              "限定出境材料使用范围与期限",
              "确保符合《人类遗传资源管理条例》相关规定"
            ]
          };
        } else {
          return {
            level: "中",
            analysis: "人类遗传资源研究项目存在隐私保护、数据安全和遗传风险告知等方面的风险。需要平衡研究价值与受试者权益保护。",
            suggestions: [
              "加强数据安全保护措施",
              "完善受试者隐私保护机制",
              "建立规范的遗传咨询流程",
              "定期审核项目伦理合规性"
            ]
          };
        }
    }
  }

  // 获取项目文件列表
  function getProjectFiles(project: any) {
    // 根据项目ID提供不同的文件列表
    switch(project.id) {
      case "ETH-HG-2024-001":
        return [
          { id: "f1-1", name: "项目申请书.pdf", type: "application", size: "2.5MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-2", name: "人遗资源采集申请.pdf", type: "application", size: "1.8MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-3", name: "知情同意书.pdf", type: "consent", size: "1.2MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-4", name: "样本采集方案.docx", type: "protocol", size: "1.5MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-5", name: "数据安全保障措施.pdf", type: "security", size: "0.8MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-6", name: "遗传咨询流程.pdf", type: "protocol", size: "0.9MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f1-7", name: "伦理审查意见书.pdf", type: "review", size: "1.1MB", uploadedAt: "2024-03-13", status: "已生成" }
        ];
      case "ETH-HG-2024-004":
        return [
          { id: "f4-1", name: "项目申请书.pdf", type: "application", size: "3.2MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-2", name: "材料出境申请.pdf", type: "application", size: "2.1MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-3", name: "合作协议.pdf", type: "agreement", size: "4.5MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-4", name: "数据库共享方案.docx", type: "protocol", size: "1.8MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-5", name: "知情同意书.pdf", type: "consent", size: "1.3MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-6", name: "数据安全管理方案.pdf", type: "security", size: "1.5MB", uploadedAt: "2024-04-20", status: "需修改" },
          { id: "f4-7", name: "退回意见书.pdf", type: "review", size: "1.2MB", uploadedAt: "2024-04-23", status: "已生成" }
        ];
      case "ETH-HG-2024-006":
        return [
          { id: "f6-1", name: "项目申请书.pdf", type: "application", size: "2.6MB", uploadedAt: project.actualDate, status: "需修改" },
          { id: "f6-2", name: "对外提供使用备案申请.pdf", type: "application", size: "1.7MB", uploadedAt: project.actualDate, status: "需修改" },
          { id: "f6-3", name: "知情同意书.pdf", type: "consent", size: "0.9MB", uploadedAt: project.actualDate, status: "需修改" },
          { id: "f6-4", name: "样本库管理方案.docx", type: "protocol", size: "1.4MB", uploadedAt: project.actualDate, status: "需修改" },
          { id: "f6-5", name: "数据保护措施.pdf", type: "security", size: "0.7MB", uploadedAt: project.actualDate, status: "需修改" },
          { id: "f6-6", name: "合作方资质证明.pdf", type: "qualification", size: "2.2MB", uploadedAt: project.actualDate, status: "已审核" },
          { id: "f6-7", name: "退回意见书.pdf", type: "review", size: "1.0MB", uploadedAt: "2024-02-27", status: "已生成" }
        ];
      default:
        // 为其他项目生成通用文件列表
        const files = [
          { id: `${project.id}-1`, name: "项目申请书.pdf", type: "application", size: "2.4MB", uploadedAt: project.actualDate || "未知", status: project.status === "形审通过" ? "已审核" : "待审核" },
          { id: `${project.id}-2`, name: `${project.approvalType}申请.pdf`, type: "application", size: "1.8MB", uploadedAt: project.actualDate || "未知", status: project.status === "形审通过" ? "已审核" : "待审核" },
          { id: `${project.id}-3`, name: "知情同意书.pdf", type: "consent", size: "1.2MB", uploadedAt: project.actualDate || "未知", status: project.status === "形审通过" ? "已审核" : "待审核" },
          { id: `${project.id}-4`, name: "研究方案.docx", type: "protocol", size: "1.7MB", uploadedAt: project.actualDate || "未知", status: project.status === "形审通过" ? "已审核" : "待审核" },
          { id: `${project.id}-5`, name: "数据保护方案.pdf", type: "security", size: "0.9MB", uploadedAt: project.actualDate || "未知", status: project.status === "形审通过" ? "已审核" : "待审核" }
        ];
        // 如果项目状态为审核通过，添加审查意见书
        if (project.status === "形审通过") {
          files.push({ 
            id: `${project.id}-6`, 
            name: "伦理审查意见书.pdf", 
            type: "review", 
            size: "1.1MB", 
            uploadedAt: project.actualDate ? new Date(project.actualDate).setDate(new Date(project.actualDate).getDate() + 3).toString() : "未知", 
            status: "已生成" 
          });
        }
        // 如果项目状态为已退回，添加退回意见书
        else if (project.status === "形审退回") {
          files.push({ 
            id: `${project.id}-6`, 
            name: "退回意见书.pdf", 
            type: "review", 
            size: "1.0MB", 
            uploadedAt: project.actualDate ? new Date(project.actualDate).setDate(new Date(project.actualDate).getDate() + 2).toString() : "未知", 
            status: "已生成" 
          });
        }
        return files;
    }
  }

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
    router.push("/ethic-review/human-genetics-review");
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
    router.push("/ethic-review/human-genetics-review");
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
        id: "approvalType",
        label: "审批类型",
        value: currentProject.approvalType || "未指定",
        icon: <FileCheck className="h-4 w-4 text-gray-400" />,
      },
      {
        id: "leader",
        label: "负责人",
        value: currentProject.leader || "未指定",
        icon: <User className="h-4 w-4 text-gray-400" />,
      }
    ];
    
    // 添加人遗资源特有的重要字段
    if (currentProject.projectType === "人遗") {
      baseFields.push(
        {
          id: "geneticMaterial",
          label: "遗传物质类型",
          value: currentProject.geneticMaterial || "未指定",
          icon: <FileText className="h-4 w-4 text-gray-400" />,
        },
        {
          id: "sampleSize",
          label: "样本量",
          value: typeof currentProject.sampleSize === 'number' 
            ? `${currentProject.sampleSize}份` 
            : (currentProject.sampleSize || "未指定"),
          icon: <BriefcaseMedical className="h-4 w-4 text-gray-400" />,
        }
      );
    }
    
    return baseFields;
  };

  return (
    <DetailPage
      id={params.id}
      title={projectTitle || currentProject.title || `人遗资源项目 ${params.id}`}
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
  );
} 