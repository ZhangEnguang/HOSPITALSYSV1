"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Calendar,
  Clock,
  User,
  Users,
  Mail,
  Phone,
  GitBranch,
  DollarSign,
  Award,
  FileText,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Pencil,
  Trash2,
  Copy,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  Download,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import ReviewSidebar from "../../../todos/[id]/components/review-sidebar";
import { AnimatePresence, motion } from "framer-motion";

// 模拟项目详情数据
const mockProjectDetail = {
  id: "proj-1",
  name: "海洋微塑料降解机制与生态毒性评估研究",
  description:
    "本项目旨在研究海洋环境中微塑料的降解机制及其对海洋生物的生态毒性影响，为海洋微塑料污染防治提供科学依据。",
  type: "国家级",
  category: "环境科学",
  status: "审核中",
  applicant: {
    id: "1",
    name: "张海洋",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "海洋科学学院",
    title: "教授",
    email: "zhanghy@example.com",
    phone: "13800138000",
  },
  amount: 87.35,
  score: 81,
  date: "2023-05-10",
  deadline: "2023-06-30",
  batchNumber: "2023-ES-01",
  batchName: "2023年国家自然科学基金项目",
  reviewers: [
    { id: "expert-1", name: "李教授", department: "环境科学学院", currentScore: 83 },
    { id: "expert-2", name: "王研究员", department: "海洋研究所", currentScore: 78 },
    { id: "expert-3", name: "赵教授", department: "生命科学学院", currentScore: 80 },
  ],
  documents: [
    { id: "doc-1", name: "申报书.pdf", size: "2.5MB", date: "2023-04-15" },
    { id: "doc-2", name: "研究计划.docx", size: "1.2MB", date: "2023-04-15" },
    { id: "doc-3", name: "预算说明.xlsx", size: "0.8MB", date: "2023-04-15" },
    { id: "doc-4", name: "团队介绍.pdf", size: "1.5MB", date: "2023-04-15" },
  ],
  team: [
    { 
      name: "张海洋", 
      role: "项目负责人", 
      department: "海洋科学学院", 
      email: "zhanghy@example.edu.cn", 
      phone: "13800138000" 
    },
    { 
      name: "李水文", 
      role: "核心研究员", 
      department: "海洋科学学院", 
      email: "lisw@example.edu.cn", 
      phone: "13900139000" 
    },
    { 
      name: "王数据", 
      role: "数据分析师", 
      department: "计算机科学学院", 
      email: "wangsj@example.edu.cn", 
      phone: "13700137000" 
    },
    { 
      name: "赵气象", 
      role: "气象模型专家", 
      department: "大气科学学院", 
      email: "zhaoqx@example.edu.cn", 
      phone: "13600136000" 
    }
  ],
  timeline: [
    { 
      event: "项目启动", 
      date: "2023-05-15", 
      status: "完成", 
      description: "完成项目团队组建和初步研究方案制定" 
    },
    { 
      event: "设备采购", 
      date: "2023-07-20", 
      status: "完成", 
      description: "完成主要研究设备的采购和安装调试" 
    },
    { 
      event: "第一阶段数据采集", 
      date: "2023-10-15", 
      status: "完成", 
      description: "完成南海区域的海水样本采集和初步分析" 
    },
    { 
      event: "中期报告", 
      date: "2024-01-10", 
      status: "进行中", 
      description: "整理第一阶段研究成果，撰写中期研究报告" 
    },
    { 
      event: "第二阶段数据采集", 
      date: "2024-04-20", 
      status: "计划中", 
      description: "计划在东海区域进行第二阶段的样本采集" 
    }
  ],
  aiAnalysis: {
    summary:
      "本项目针对海洋微塑料污染这一全球性环境问题，提出了创新性的降解机制研究方案和生态毒性评估体系。项目组在微塑料降解和毒性评估领域有较好的研究基础，发表了多篇高水平论文。研究方案设计合理，技术路线清晰，预期成果具有重要的科学价值和应用前景。",
    conclusion: "综合评估，本项目具有较高的科学价值和创新性，研究团队实力较强，研究方案可行，建议予以支持。",
    strengths: [
      {
        title: "研究方向前沿性",
        content:
          "海洋微塑料污染是当前国际环境科学研究的热点和前沿领域。根据Web of Science数据分析，近5年相关研究论文数量年均增长率达32%，本项目选题具有很强的科学前沿性和国际关注度。",
        metrics: {
          relevantPublications: 1240,
          growthRate: "32%",
          citationImpact: 8.7,
          topJournals: ["Nature", "Science", "Environmental Science & Technology"],
        },
      },
      {
        title: "团队研究基础",
        content:
          "项目团队在微塑料研究领域已有8年积累，近5年发表SCI论文32篇，其中包括Nature子刊2篇，Environmental Science & Technology 5篇，获得国家发明专利3项，具备开展本项目研究的技术积累和人才储备。",
        teamComposition: {
          professors: 3,
          associateProfessors: 4,
          postdocs: 5,
          phDStudents: 8,
          mastersStudents: 12,
        },
        publications: {
          total: 32,
          natureFamily: 2,
          topJournals: 12,
          normalSCI: 18,
        },
        patents: 3,
      },
      {
        title: "技术路线清晰性",
        content:
          "项目提出了'微塑料表征-降解机制-毒性评估-生态风险'的完整研究链条，各研究内容之间逻辑关系清晰，技术路线设计合理，方法学先进，包括高分辨表征技术、同位素示踪、组学分析等多种前沿方法的综合应用。",
        methodologies: [
          { name: "高分辨表征技术", maturity: "成熟", innovation: "中等" },
          { name: "同位素示踪", maturity: "成熟", innovation: "高" },
          { name: "多组学分析", maturity: "发展中", innovation: "高" },
          { name: "生物标志物筛选", maturity: "发展中", innovation: "高" },
          { name: "生态风险模型", maturity: "成熟", innovation: "中等" },
        ],
      },
    ],
    weaknesses: [
      {
        title: "降解机制创新性论述不足",
        content:
          "项目在微塑料降解机制研究方面的创新点描述不够清晰，与国内外现有研究的区别和突破点论述不足。特别是在光降解与生物降解协同作用机制方面，缺乏具体的研究假设和验证方案。",
        comparison: {
          currentResearch: "主要关注单一降解途径（光降解或生物降解）",
          proposedResearch: "声称研究协同降解机制",
          gap: "未明确说明如何研究协同效应及其创新点",
          competingApproaches: ["中科院海洋所的酶促降解", "清华大学的光催化降解", "哈佛大学的微生物群落降解"],
        },
      },
      {
        title: "毒性评估研究不足",
        content:
          "项目在微塑料毒性评估体系构建方面缺乏系统性，所选生物模型代表性不足，未能充分考虑不同营养级生物的差异响应。同时，对微塑料降解中间产物的毒性评估关注不够。",
        coverageAnalysis: {
          proposedModels: 3,
          fieldAverage: 5,
          topProjects: 8,
          trophicLevelsCovered: 2,
          fieldAverageLevels: 3,
          degradationProductsTested: "部分",
          fieldStandard: "全面",
        },
      },
      {
        title: "国际合作计划不具体",
        content:
          "项目提及与多个国际机构的合作意向，但缺乏具体的合作内容、方式和预期成果描述。国际合作对项目推进的实质性贡献不明确，存在流于形式的风险。",
        collaborationAnalysis: {
          mentionedPartners: 4,
          detailedPlans: 0,
          specificContributions: "未提及",
          resourceSharing: "未明确",
          jointPublications: "未规划",
          comparisonToSuccessful: "显著不足",
        },
      },
    ],
    recommendations: [
      {
        title: "加强降解机制创新性研究",
        content:
          "建议明确提出微塑料光降解与生物降解协同作用的具体研究假设，设计针对性实验验证协同效应的分子机制，并与现有研究形成明确区分。可考虑引入原位表征技术和分子动力学模拟方法增强机制研究的深度。",
        methods: [
          "原位拉曼光谱分析",
          "同步辐射X射线吸收精细结构谱",
          "分子动力学模拟",
          "密度泛函理论计算",
          "微生物组-代谢组联合分析",
        ],
      },
      {
        title: "完善毒性评估体系",
        content:
          "建议扩展生物模型选择，构建覆盖浮游植物、浮游动物、底栖生物和鱼类的多营养级毒性评估体系。同时加强对微塑料降解中间产物毒性的系统评估，建立降解程度-毒性关系模型。",
        improvedSystem: {
          primaryProducers: ["硅藻", "绿藻", "蓝藻"],
          primaryConsumers: ["轮虫", "桡足类", "枝角类"],
          secondaryConsumers: ["小型鱼类", "贝类"],
          decomposers: ["细菌", "真菌"],
          degradationProducts: ["微塑料单体", "低聚物", "添加剂", "吸附污染物"],
        },
      },
      {
        title: "深化国际合作",
        content:
          "建议与1-2个国际知名研究机构建立实质性合作关系，明确合作内容、方式和预期成果。可考虑共享样品资源、联合开展实验、共同发表论文等具体合作形式，提升项目的国际影响力。",
        potentialPartners: [
          { institution: "伍兹霍尔海洋研究所", country: "美国", focus: "海洋微塑料采样与表征", priority: "高" },
          { institution: "普利茅斯海洋实验室", country: "英国", focus: "生物毒性评估标准方法", priority: "高" },
          { institution: "阿尔弗雷德-韦格纳研究所", country: "德国", focus: "极地微塑料污染", priority: "中" },
          { institution: "东京大学大气海洋研究所", country: "日本", focus: "微塑料降解中间产物分析", priority: "中" },
        ],
      },
      {
        title: "优化研究周期",
        content:
          "建议将三年研究周期调整为四年，为微塑料长期降解过程和生态毒性的持续观察提供充足时间。同时建议优化各研究内容的时间分配，增加降解中间产物毒性评估的研究时长。",
        timeline: {
          original: [
            { phase: "微塑料表征", duration: "6个月" },
            { phase: "降解机制研究", duration: "12个月" },
            { phase: "毒性评估", duration: "12个月" },
            { phase: "生态风险评估", duration: "6个月" },
          ],
          recommended: [
            { phase: "微塑料表征", duration: "6个月" },
            { phase: "降解机制研究", duration: "15个月" },
            { phase: "降解产物分析", duration: "9个月" },
            { phase: "毒性评估", duration: "15个月" },
            { phase: "生态风险评估", duration: "9个月" },
          ],
        },
      },
    ],
    scores: {
      innovation: 85,
      feasibility: 78,
      significance: 88,
      team: 82,
      overall: 83,
    },
    expertConsensus: {
      high: 65,
      medium: 25,
      low: 10,
    },
  },
  budget: {
    total: 120,
    used: 54, // 添加已使用经费总额
    categories: [
      { name: "设备费", amount: 48, percentage: 40 },
      { name: "材料费", amount: 24, percentage: 20 },
      { name: "测试化验费", amount: 18, percentage: 15 },
      { name: "差旅费", amount: 12, percentage: 10 },
      { name: "劳务费", amount: 18, percentage: 15 }
    ],
    expenses: [
      { name: "设备费", budget: 48, used: 20 },
      { name: "材料费", budget: 24, used: 15 },
      { name: "测试化验费", budget: 18, used: 5 },
      { name: "差旅费", budget: 12, used: 6 },
      { name: "劳务费", budget: 18, used: 8 }
    ],
    equipment: [
      { name: "高效液相色谱-质谱联用仪", amount: 18.5, necessity: "必要", alternatives: "无" },
      { name: "扫描电子显微镜", amount: 8.0, necessity: "必要", alternatives: "可共享使用校内设备" },
      { name: "微塑料采样系统", amount: 3.8, necessity: "必要", alternatives: "无" },
      { name: "生物培养系统", amount: 2.2, necessity: "必要", alternatives: "无" },
    ],
    materials: [
      { name: "标准微塑料颗粒", amount: 4.2, justification: "用于降解实验和毒性测试" },
      { name: "同位素标记物", amount: 6.8, justification: "用于降解途径示踪" },
      { name: "生化试剂", amount: 5.4, justification: "用于毒性评估和生物标志物分析" },
      { name: "采样耗材", amount: 2.2, justification: "用于野外采样和样品保存" },
    ],
    testing: [
      { name: "微塑料表征分析", amount: 5.6, frequency: "200样/年", unitPrice: "700元/样" },
      { name: "组学测序", amount: 4.8, frequency: "30样/年", unitPrice: "4000元/样" },
      { name: "生物标志物检测", amount: 3.2, frequency: "150样/年", unitPrice: "500元/样" },
      { name: "环境因子分析", amount: 2.2, frequency: "100样/年", unitPrice: "550元/样" },
    ],
    travel: [
      { destination: "国内采样点", amount: 4.2, frequency: "6次/年", purpose: "样品采集" },
      { destination: "国内学术会议", amount: 2.4, frequency: "2次/年", purpose: "成果交流" },
      { destination: "国际学术会议", amount: 1.8, frequency: "1次/年", purpose: "成果展示与交流" },
    ],
    meetings: [
      { name: "项目启动会", amount: 0.8, participants: 15, duration: "2天" },
      { name: "年度研讨会", amount: 1.2, participants: 20, duration: "2天", frequency: "1次/年" },
      { name: "专家咨询会", amount: 1.6, participants: 10, duration: "1天", frequency: "2次/年" },
      { name: "成果总结会", amount: 1.6, participants: 25, duration: "2天" },
    ],
    labor: [
      { role: "博士后", amount: 2.4, headcount: 2, duration: "3年" },
      { role: "研究生", amount: 3.6, headcount: 6, duration: "3年" },
      { role: "技术人员", amount: 0.85, headcount: 1, duration: "3年" },
    ],
    analysis: {
      reasonability: "总体合理，设备费占比略高",
      efficiency: "中等",
      risks: ["设备采购延迟可能影响项目进度", "国际差旅受疫情影响存在不确定性"],
      recommendations: [
        "考虑降低设备费比例，增加共享设备使用",
        "增加数据分析与模型构建相关预算",
        "适当增加青年研究人员劳务费比例",
      ],
    },
  },
  outcomes: {
    papers: {
      published: [
        { 
          title: "南海海域碳循环动态监测研究", 
          journal: "海洋科学学报", 
          date: "2023-09-15",
          status: "已发表"
        },
        { 
          title: "海洋碳汇与气候变化的相关性分析", 
          journal: "气候变化研究", 
          date: "2023-11-20",
          status: "已发表"
        }
      ],
      planned: [
        { 
          title: "东海海域碳循环特征与影响因素", 
          targetJournal: "海洋学报", 
          expectedDate: "2024-06-30",
          status: "撰写中"
        },
        { 
          title: "海洋碳循环模型的改进与应用", 
          targetJournal: "Science of The Total Environment", 
          expectedDate: "2024-09-15",
          status: "计划中"
        }
      ],
      riskFactors: [
        "高水平期刊发表竞争激烈，可能面临多轮修改",
        "部分研究结果可能需要更长时间的数据积累才能形成完整论文"
      ],
      mitigationStrategies: [
        "提前规划论文框架，确保研究设计符合目标期刊要求",
        "与领域内专家建立合作，提高论文质量和被接受概率"
      ]
    },
    patents: {
      planned: [
        {
          name: "一种海水碳含量快速检测方法",
          type: "发明专利",
          status: "已申请",
          description: "基于光谱分析的海水碳含量快速检测新方法，可提高检测效率和准确性",
          applicationDate: "2023-08-15"
        },
        {
          name: "海洋碳循环监测装置",
          type: "实用新型",
          status: "准备中",
          description: "一种可长期布放于海洋环境的碳循环监测装置，具有耐腐蚀、低功耗特点"
        }
      ]
    },
    impact: {
      scientific: {
        level: "较高",
        description: "该项目研究成果将填补国内海洋碳循环研究的部分空白，为气候变化研究提供重要数据支持",
        score: 85
      },
      economic: {
        level: "中等",
        description: "研究成果可为海洋碳汇交易提供科学依据，间接促进碳中和相关产业发展",
        score: 70
      },
      environmental: {
        level: "较高",
        description: "有助于更好地理解海洋在全球碳循环中的作用，为海洋环境保护政策制定提供科学依据"
      },
      social: {
        level: "中等",
        description: "提升公众对海洋在应对气候变化中重要性的认识，促进海洋生态保护意识"
      }
    }
  },
}

export default function ProjectReviewPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewStatus, setReviewStatus] = useState<"pending" | "approved" | "rejected" | "revision">("pending");
  const [reviewComments, setReviewComments] = useState("");
  const { toast } = useToast();
  
  // AI分析状态
  const [isUpdatingAnalysis, setIsUpdatingAnalysis] = useState(false);
  const [isAnalysisUpdated, setIsAnalysisUpdated] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasAiWritten, setHasAiWritten] = useState(false);
  const [aiInputValue, setAiInputValue] = useState("");
  
  // 折线图动画的引用
  const chartRef = useRef<SVGPathElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // 处理查看详情按钮点击
  const handleViewProjectDetail = () => {
    router.push("/projects/10");
  };

  // 处理更新分析
  const handleUpdateAnalysis = () => {
    if (isUpdatingAnalysis) return;

    setIsUpdatingAnalysis(true);
    toast({
      title: "正在更新分析",
      description: "AI正在重新分析最新项目数据...",
      duration: 2000,
    });

    // 模拟分析过程
    setTimeout(() => {
      setIsUpdatingAnalysis(false);
      setIsAnalysisUpdated(true);
      toast({
        title: "分析完成",
        description: "AI智能摘要已更新",
        duration: 3000,
      });
    }, 3000);
  };

  // 加载项目数据
  useEffect(() => {
    // 在实际应用中，这里应该从API获取数据
    // 这里使用模拟数据
    setProject(mockProjectDetail);
  }, [params.id]);

  // 处理复制结论
  const handleCopyConclusion = () => {
    if (project) {
      try {
        navigator.clipboard.writeText(project.aiAnalysis.conclusion);
        toast({
          title: "复制成功",
          description: "结论已复制到剪贴板",
        });
      } catch (error) {
        console.error("复制到剪贴板失败:", error);
        toast({
          title: "复制失败",
          description: "无法复制到剪贴板，请手动复制",
          variant: "destructive",
        });
      }
    }
  };

  // 处理审核提交
  const handleSubmitReview = (status: "approved" | "rejected" | "revision") => {
    setReviewStatus(status);
    toast({
      title: "审核已提交",
      description: status === "approved" ? "项目已通过审核" : status === "rejected" ? "项目已被拒绝" : "项目需要修改",
    });

    // 在实际应用中，这里应该调用API保存审核结果
    setTimeout(() => {
      router.push("/applications");
    }, 1500);
  };

  // 监听元素是否在视口中，触发动画
  useEffect(() => {
    if (!chartRef.current || !chartContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 重置动画
            const path = chartRef.current;
            if (path) {
              const length = path.getTotalLength();
              path.style.strokeDasharray = `${length}`;
              path.style.strokeDashoffset = `${length}`;
              path.getBoundingClientRect(); // 触发重绘
              path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
              path.style.strokeDashoffset = "0";
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(chartContainerRef.current);

    // 添加进度条动画样式
    const style = document.createElement("style");
    style.textContent = `
  @keyframes progress {
    0% { width: 0; }
    50% { width: 70%; }
    100% { width: 100%; }
  }
  
  .animate-progress {
    animation: progress 3s ease-in-out;
  }
`;
    document.head.appendChild(style);

    return () => {
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">加载项目详情...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-[calc(100%-320px)] pr-4">
      {/* 顶部标题栏 - 参考图片中的样式 */}
      <div className="mb-4">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-center text-gray-600 hover:text-gray-900 p-2 h-8 w-8 bg-white rounded-md shadow-sm"
              onClick={() => router.push("/applications")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1
              className="text-[20px] font-bold tracking-[0.5px] leading-[1.5em] text-[#2D3748] truncate max-w-2xl"
              style={{ fontFamily: "'Source Han Sans', 'Noto Sans SC', sans-serif" }}
            >
              {project.name}
            </h1>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200">
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>下载申报书</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Pencil className="h-4 w-4" />
              <span>编辑</span>
            </Button>
            <Button variant="destructive" size="sm" className="flex items-center gap-1 bg-red-500 hover:bg-red-600">
              <Trash2 className="h-4 w-4" />
              <span>删除</span>
            </Button>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-6"
              style={{ fontFamily: "'Source Han Sans', 'Noto Sans SC', sans-serif" }}
            >
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-[#718096]" />
                <span className="text-[14px] font-normal">
                  <span className="text-[#718096]">负责人: </span>
                  <span className="text-[#4A5568]">{project.applicant.name}</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-[#718096]" />
                <span className="text-[14px] font-normal">
                  <span className="text-[#718096]">项目周期: </span>
                  <span className="text-[#4A5568]">
                    {format(new Date(project.date), "yyyy-MM-dd")} 至 {format(new Date(project.deadline), "yyyy-MM-dd")}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                {project.type}
              </Badge>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                {project.category}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 主体内容区域 - 使用 flex 布局 */}
      <div className="flex flex-1 gap-4 mt-4 h-full overflow-hidden">
        {/* 左侧主要内容区域 */}
        <div className="flex-1 overflow-auto">
          {/* 标签按钮组 */}
          <div className="flex overflow-x-auto pb-2 mb-4 border-b gap-2.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              size="sm"
              className={`shrink-0 transition-colors duration-200 ${activeTab === "overview" ? "bg-primary text-white hover:bg-primary/90" : "hover:bg-slate-100"}`}
              onClick={() => setActiveTab("overview")}
            >
              <FileText className="h-4 w-4 mr-2" />
              项目概览
            </Button>
            <Button
              variant={activeTab === "process" ? "default" : "ghost"}
              size="sm"
              className={`shrink-0 transition-colors duration-200 ${activeTab === "process" ? "bg-primary text-white hover:bg-primary/90" : "hover:bg-slate-100"}`}
              onClick={() => setActiveTab("process")}
            >
              <GitBranch className="h-4 w-4 mr-2" />
              执行过程
            </Button>
            <Button
              variant={activeTab === "budget" ? "default" : "ghost"}
              size="sm"
              className={`shrink-0 transition-colors duration-200 ${activeTab === "budget" ? "bg-primary text-white hover:bg-primary/90" : "hover:bg-slate-100"}`}
              onClick={() => setActiveTab("budget")}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              经费管理
            </Button>
          </div>

          {/* 内容区域 */}
          <div className="space-y-4">
            {/* 项目概览内容 - 默认显示 */}
            {activeTab === "overview" && (
              <>
                {/* AI智能摘要区域 */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50 border border-slate-200 shadow-sm">
                  {/* 添加渐变色线条 */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <CardHeader className="pb-1 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10">
                          <Image src="/ai-icon.png" alt="AI摘要" width={40} height={40} className="object-contain" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span>AI摘要</span>
                            <Badge
                              className="ml-2 bg-primary/5 text-primary text-[10px] h-5 px-2 tracking-wide font-normal border border-primary/20"
                            >
                              v2.4.1
                            </Badge>
                          </CardTitle>
                          <p className="text-xs text-slate-500 mt-0.5">AI模型: GPT-Scientific 2023</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 relative bg-white hover:bg-primary/5 border border-slate-200 shadow-sm"
                        onClick={handleUpdateAnalysis}
                        disabled={isUpdatingAnalysis}
                      >
                        {isUpdatingAnalysis ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span className="text-xs">分析中...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span className="text-xs">更新分析</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <div className="pl-9 relative">
                      {isUpdatingAnalysis && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative h-10 w-10">
                              <div className="absolute inset-0 rounded-full border-2 border-primary border-opacity-20 border-t-primary animate-spin"></div>
                              <div className="absolute inset-2 rounded-full border-2 border-amber-400 border-opacity-20 border-r-amber-400 animate-spin"></div>
                            </div>
                            <div className="text-sm font-medium text-slate-700">AI模型分析中</div>
                          </div>
                          <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-progress rounded-full"></div>
                          </div>
                          <div className="text-xs text-slate-500 mt-2">正在处理项目数据并生成智能洞察...</div>
                        </div>
                      )}

                      <AnimatePresence mode="wait">
                        {isCollapsed ? (
                          <motion.div
                            key="collapsed"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex items-start gap-4 my-3 py-2"
                          >
                            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                              <div className="text-xs text-slate-600">
                                <span>科学价值</span>
                                <div className="font-semibold text-sm text-slate-900">较高</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                              <PieChart className="h-4 w-4 text-amber-600" />
                              <div className="text-xs text-slate-600">
                                <span>创新程度</span>
                                <div className="font-semibold text-sm text-slate-900">
                                  {isAnalysisUpdated ? (
                                    <>
                                      高 <span className="text-green-600 text-xs">↑</span>
                                    </>
                                  ) : (
                                    "中等"
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <LineChart className="h-4 w-4 text-green-600" />
                              <div className="text-xs text-slate-600">
                                <span>可行性</span>
                                <div className="font-semibold text-sm text-slate-900">较高</div>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="expanded"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="prose prose-sm max-w-none text-slate-700 leading-relaxed"
                          >
                            {isAnalysisUpdated ? (
                              <>
                                <div className="flex items-center gap-2 mb-3 text-sm text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100">
                                  <LayoutGrid className="h-4 w-4" />
                                  <span className="font-medium">最新分析已更新 - 检测到项目创新性提升</span>
                                </div>
                                <p>{project.aiAnalysis.summary}</p>
                                <div className="flex items-start gap-4 my-3 py-2">
                                  <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                                    <BarChart3 className="h-4 w-4 text-blue-600" />
                                    <div className="text-xs text-slate-600">
                                      <span>科学价值</span>
                                      <div className="font-semibold text-sm text-slate-900">较高</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                                    <PieChart className="h-4 w-4 text-amber-600" />
                                    <div className="text-xs text-slate-600">
                                      <span>创新程度</span>
                                      <div className="font-semibold text-sm text-slate-900">
                                        高 <span className="text-green-600 text-xs">↑</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <LineChart className="h-4 w-4 text-green-600" />
                                    <div className="text-xs text-slate-600">
                                      <span>可行性</span>
                                      <div className="font-semibold text-sm text-slate-900">较高</div>
                                    </div>
                                  </div>
                                </div>
                                <p className="mt-2 text-slate-600 border-t border-slate-100 pt-2">
                                  <span className="font-medium text-primary">结论：</span>
                                  {project.aiAnalysis.conclusion}
                                </p>
                              </>
                            ) : (
                              <>
                                <p>{project.aiAnalysis.summary}</p>
                                <div className="flex items-start gap-4 my-3 py-2">
                                  <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                                    <BarChart3 className="h-4 w-4 text-blue-600" />
                                    <div className="text-xs text-slate-600">
                                      <span>科学价值</span>
                                      <div className="font-semibold text-sm text-slate-900">较高</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                                    <PieChart className="h-4 w-4 text-amber-600" />
                                    <div className="text-xs text-slate-600">
                                      <span>创新程度</span>
                                      <div className="font-semibold text-sm text-slate-900">中等</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <LineChart className="h-4 w-4 text-green-600" />
                                    <div className="text-xs text-slate-600">
                                      <span>可行性</span>
                                      <div className="font-semibold text-sm text-slate-900">较高</div>
                                    </div>
                                  </div>
                                </div>
                                <p className="mt-2 text-slate-600 border-t border-slate-100 pt-2">
                                  <span className="font-medium text-primary">结论：</span>
                                  {project.aiAnalysis.conclusion}
                                </p>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex justify-end items-center text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                        <div className="flex-1 flex items-center gap-2">
                          <div className="inline-flex h-5 items-center rounded-full border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-900">
                            可信度 95%
                          </div>
                          <span>分析时间: {isAnalysisUpdated ? "2024-04-10 13:45" : "2024-04-05 09:30"}</span>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 gap-1 text-slate-500 hover:text-slate-900"
                            onClick={() => {
                              try {
                                // 复制文本到剪贴板
                                navigator.clipboard.writeText(project.aiAnalysis.summary);
                                toast({
                                  title: "已复制到剪贴板",
                                  description: "AI智能摘要内容已复制",
                                  duration: 2000,
                                });
                              } catch (error) {
                                console.error("复制到剪贴板失败:", error);
                                toast({
                                  title: "复制失败",
                                  description: "无法复制到剪贴板，请手动复制",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Copy className="h-3 w-3" />
                            <span>复制</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 ml-1 gap-1 text-slate-500 hover:text-slate-900"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                          >
                            <motion.div animate={{ rotate: isCollapsed ? 90 : -90 }} transition={{ duration: 0.2 }}>
                              <ChevronRight className="h-3 w-3" />
                            </motion.div>
                            <span>{isCollapsed ? "展开" : "收起"}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* 基本信息卡片 */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-lg font-semibold mb-4">基本信息</h2>
                  <div>
                    {/* 项目名称 */}
                    <div className="mb-6 pb-4 border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm text-muted-foreground mb-1">项目名称</h3>
                          <div className="text-lg font-medium">{project.name}</div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={handleViewProjectDetail}
                        >
                          <FileText className="h-4 w-4" />
                          <span>查看详情</span>
                        </Button>
                      </div>
                    </div>

                    {/* 项目周期、状态、类型 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-sm text-muted-foreground">项目周期</h3>
                          <p className="font-medium">
                            {format(new Date(project.date), "yyyy/MM/dd")} - {format(new Date(project.deadline), "yyyy/MM/dd")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <h3 className="text-sm text-muted-foreground">项目状态</h3>
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                            {project.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                          <Award className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-sm text-muted-foreground">项目类型</h3>
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                            {project.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* 基本信息字段 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4 mb-6 pb-6 border-b">
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">项目编号</h3>
                        <div>{project.id}</div>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">所属单位</h3>
                        <div>{project.applicant.department}</div>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">项目分类</h3>
                        <div>{project.category}</div>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">申请时间</h3>
                        <div>{format(new Date(project.date), "yyyy/MM/dd")}</div>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">负责人</h3>
                        <div>{project.applicant.name}</div>
                      </div>
                    </div>

                    {/* 预算执行情况 */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">预算执行情况</h3>
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <div className="text-sm text-muted-foreground">批准经费</div>
                            <div className="font-semibold">{project.budget.total}万</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="text-sm text-muted-foreground">已使用经费</div>
                            <div className="font-semibold">
                              {project.budget.used}万
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="text-lg font-bold">
                              {project.budget.used}万 / {project.budget.total}万
                            </div>
                            <div className="text-sm text-muted-foreground">
                              已使用 {Math.round((project.budget.used / project.budget.total) * 100)}%
                            </div>
                          </div>
                        </div>

                        {/* 折线图 */}
                        <div ref={chartContainerRef} className="h-24 w-full md:w-1/2">
                          <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#3b82f6" />
                              </linearGradient>
                            </defs>
                            <path
                              ref={chartRef}
                              d="M0,80 C20,70 40,90 60,75 C80,60 100,50 120,55 C140,60 160,30 180,25 C200,20 220,40 240,35 C260,30 280,20 300,10"
                              fill="none"
                              stroke="url(#lineGradient)"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 项目团队和文档卡片并排显示 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 项目团队卡片 */}
                  <div className="bg-white p-6 border rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">项目团队</h2>
                    <div className="space-y-4">
                      {project.team.map((member: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-medium">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                              <Badge className="bg-slate-50 text-slate-700 border-slate-200 h-5 text-xs">
                                {member.role}
                              </Badge>
                              <span className="text-xs text-slate-400">|</span>
                              <span className="text-xs">{member.department}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Mail className="h-3 w-3" />
                                <span>{member.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Phone className="h-3 w-3" />
                                <span>{member.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 项目文档卡片 */}
                  <div className="bg-white p-6 border rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">项目文档</h2>
                    <div className="space-y-3">
                      {project.documents.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{doc.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {doc.size} · {doc.date}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 隐藏的输入框，用于控制AI按钮的显示/隐藏 */}
                <input
                  type="text"
                  className="hidden"
                  value={aiInputValue}
                  onChange={(e) => {
                    setAiInputValue(e.target.value);
                    if (e.target.value.trim() === "") {
                      setHasAiWritten(false);
                    }
                  }}
                />
              </>
            )}
            
            {/* 执行过程内容 */}
            {activeTab === "process" && (
              <>
                {/* 项目进度时间线卡片 */}
                <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-sm mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      项目进度时间线
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 pl-4 border-l-2 border-blue-100">
                      {project.timeline.map((milestone: any, index: number) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                          <div className="pl-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-800">{milestone.event}</span>
                              <Badge className={milestone.status === "完成" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                                {milestone.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{format(new Date(milestone.date), "yyyy/MM/dd")}</p>
                            <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 项目团队成员卡片 */}
                <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      项目团队成员
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.team.map((member: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{member.name}</span>
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                {member.role}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{member.department}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {member.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {member.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* 经费管理内容 */}
            {activeTab === "budget" && (
              <>
                {/* 经费预算分布卡片 */}
                <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-sm mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-green-600" />
                      经费预算分布
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative h-[200px] flex items-center justify-center">
                        {/* 替换简单线条为饼图 */}
                        <div className="w-36 h-36 rounded-full border-8 border-blue-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">{project.budget.total}</div>
                            <div className="text-xs text-slate-500">万元</div>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 bottom-0 left-0">
                          {project.budget.categories.map((category: any, index: number) => {
                            const colors = [
                              "bg-blue-500",
                              "bg-green-500",
                              "bg-amber-500",
                              "bg-red-500",
                              "bg-purple-500",
                            ];
                            // 计算每个类别的起始角度和结束角度
                            const totalPercentage = project.budget.categories.reduce((sum: number, cat: any) => sum + cat.percentage, 0);
                            const startPercentage = project.budget.categories.slice(0, index).reduce((sum: number, cat: any) => sum + cat.percentage, 0);
                            const startAngle = (startPercentage / totalPercentage) * 360;
                            const angle = (category.percentage / totalPercentage) * 360;
                            
                            // 创建饼图扇形
                            return (
                              <div 
                                key={index}
                                className="absolute top-1/2 left-1/2 w-[150px] h-[150px] -ml-[75px] -mt-[75px]"
                                style={{
                                  clipPath: `conic-gradient(from ${startAngle}deg, ${colors[index % colors.length]} ${angle}deg, transparent ${angle}deg)`,
                                  opacity: 0.8,
                                  zIndex: 10 - index // 确保所有扇形都可见
                                }}
                              ></div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-3">
                        {project.budget.categories.map((category: any, index: number) => {
                          const colors = [
                            "bg-blue-500",
                            "bg-green-500",
                            "bg-amber-500",
                            "bg-red-500",
                            "bg-purple-500",
                          ];
                          return (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                                <span className="text-sm">{category.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{category.amount}万元</span>
                                <span className="text-xs text-slate-500">({category.percentage}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 经费使用情况卡片 */}
                <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      经费使用情况
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-slate-500">总预算</div>
                          <div className="text-xl font-bold">{project.budget.total}万元</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">已使用</div>
                          <div className="text-xl font-bold text-blue-600">{project.budget.used}万元</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">剩余</div>
                          <div className="text-xl font-bold text-green-600">{project.budget.total - project.budget.used}万元</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>使用进度</span>
                          <span className="font-medium">{Math.round((project.budget.used / project.budget.total) * 100)}%</span>
                        </div>
                        <Progress value={Math.round((project.budget.used / project.budget.total) * 100)} className="h-2" />
                      </div>

                      <div className="mt-6">
                        <h3 className="text-base font-medium mb-3">支出明细</h3>
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>支出项目</TableHead>
                                <TableHead>预算金额 (万元)</TableHead>
                                <TableHead>已使用金额 (万元)</TableHead>
                                <TableHead>剩余金额 (万元)</TableHead>
                                <TableHead>使用进度</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {project.budget.expenses.map((expense: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{expense.name}</TableCell>
                                  <TableCell>{expense.budget}</TableCell>
                                  <TableCell>{expense.used}</TableCell>
                                  <TableCell>{(expense.budget - expense.used).toFixed(2)}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Progress value={Math.round((expense.used / expense.budget) * 100)} className="h-2 w-16" />
                                      <span className="text-xs">{Math.round((expense.used / expense.budget) * 100)}%</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
        <ReviewSidebar
          status={project.status}
          projectId={project.id}
          projectTitle={project.name}
          reviewHistory={[
            { date: "2024-03-15", user: "张主任", action: "已审核", comment: "项目进展顺利，继续保持" },
            { date: "2024-02-20", user: "李经理", action: "已提交", comment: "提交��度进展报告" },
            { date: "2024-01-10", user: "系统", action: "已创建", comment: "项目创建成功" },
            { date: "2023-12-25", user: "王总监", action: "已批准", comment: "项目立项已批准" },
            { date: "2023-12-20", user: "赵经理", action: "已提交", comment: "提交项目立项申请" },
          ]}
          operationHistory={[
            { date: "2024-03-18", user: "王经理", action: "修改", detail: "更新了项目预算" },
            { date: "2024-03-10", user: "李研究员", action: "添加", detail: "上传了研究报告" },
            { date: "2024-02-28", user: "张主任", action: "分配", detail: "将任务分配给李研究员" },
            { date: "2024-02-15", user: "系统", action: "提醒", detail: "项目进度落后提醒" },
            { date: "2024-02-01", user: "赵经理", action: "更新", detail: "更新了项目时间线" },
          ]}
          showReviewTab={true}
          showReviewHistoryTab={true}
          showOperationHistoryTab={true}
        />
      </div>
    </div>
  );
}
