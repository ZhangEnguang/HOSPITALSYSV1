"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UniversalDetailAdapter } from "@/components/universal-detail"
import { 
  Calendar, 
  FileText, 
  BarChart, 
  GitBranch, 
  CheckCircle, 
  AlertCircle,
  Clock,
  User,
  Trash2,
  Link
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

// 导入标签页组件
import CompletionOverviewTab from "./components/completion-overview-tab"
import CompletionDocumentsTab from "./components/completion-documents-tab"
import CompletionRelatedProjectsTab from "./components/completion-related-projects-tab"

// 导入示例数据
import { allDemoProgressItems } from "../../data/progress-demo-data"

// 模拟数据（实际应用中应该从API获取）
const completionData = [
  {
    id: "pc1",
    title: "高校科研创新管理平台项目结项报告",
    status: "待审核",
    statusLabel: "待审核",
    applicant: "张三",
    leader: "张三",
    date: "2024-01-01 至 2024-12-31",
    department: "计算机科学学院",
    completionType: "正常结项",
    evaluationResult: "优秀",
    completionDate: "2024-04-15",
    completionRate: 100,
    reason: "项目已完成全部研发任务，各项指标均达到或超过预期目标，现申请项目结项。",
    summary: "本项目开发了一套高校科研创新管理平台，实现了科研项目全生命周期管理、成果管理、经费管理等功能。系统采用前后端分离架构，前端使用React框架，后端使用Spring Boot框架，数据库使用MySQL。系统具有良好的用户体验和性能表现，已在多个院系试运行，反馈良好。",
    achievements: "1. 开发完成科研管理平台系统一套\n2. 发表学术论文3篇，其中SCI收录2篇\n3. 申请软件著作权2项\n4. 培养研究生3名",
    attachments: [
      { name: "结项报告.pdf", size: "1.2MB", date: "2024-04-15" },
      { name: "成果汇报.pptx", size: "3.5MB", date: "2024-04-15" },
      { name: "用户手册.docx", size: "0.8MB", date: "2024-04-14" }
    ],
    auditStatus: "待审核",
    auditHistory: [
      { date: "2024-04-15", user: "张三", action: "提交结项", comment: "提交项目结项报告" }
    ],
    progressSummary: [
      { phase: "需求分析", status: "已完成", completionRate: 100, endDate: "2024-01-31" },
      { phase: "系统设计", status: "已完成", completionRate: 100, endDate: "2024-02-28" },
      { phase: "开发实现", status: "已完成", completionRate: 100, endDate: "2024-03-30" },
      { phase: "测试验收", status: "已完成", completionRate: 100, endDate: "2024-04-15" }
    ],
    nextSteps: [
      { phase: "成果推广", deadline: "2024-05-15", responsible: "推广团队" },
      { phase: "用户培训", deadline: "2024-06-15", responsible: "培训团队" },
      { phase: "系统维护", deadline: "2024-07-15", responsible: "运维团队" }
    ]
  },
  {
    id: "pc2",
    title: "高校科研成果转化平台项目结项报告",
    status: "已通过",
    statusLabel: "已通过",
    applicant: "李四",
    leader: "李四",
    date: "2024-02-01 至 2024-12-31",
    department: "科研管理处",
    completionType: "提前结项",
    evaluationResult: "良好",
    completionDate: "2024-03-20",
    completionRate: 100,
    reason: "项目已提前完成全部研发任务，各项指标均达到预期目标，现申请提前结项。",
    summary: "本项目开发了一套高校科研成果转化平台，实现了成果展示、需求对接、转化服务等功能。系统采用微服务架构，使用Spring Cloud框架，前端使用Vue.js，数据库使用PostgreSQL。系统性能稳定，界面友好，已在校内试运行，并与多家企业建立了对接。",
    achievements: "1. 开发完成成果转化平台系统一套\n2. 发表学术论文2篇\n3. 申请软件著作权1项\n4. 与5家企业建立合作关系",
    attachments: [
      { name: "结项报告.pdf", size: "2.1MB", date: "2024-03-20" },
      { name: "系统架构文档.docx", size: "1.5MB", date: "2024-03-19" },
      { name: "测试报告.xlsx", size: "0.9MB", date: "2024-03-18" }
    ],
    auditStatus: "已通过",
    auditHistory: [
      { date: "2024-03-20", user: "李四", action: "提交结项", comment: "提交项目结项报告" },
      { date: "2024-03-25", user: "王主任", action: "审核通过", comment: "结项报告详实，项目成果显著，同意结项" }
    ],
    progressSummary: [
      { phase: "需求调研", status: "已完成", completionRate: 100, endDate: "2024-02-28" },
      { phase: "系统设计", status: "已完成", completionRate: 100, endDate: "2024-03-15" },
      { phase: "开发实现", status: "已完成", completionRate: 100, endDate: "2024-03-30" },
      { phase: "测试验收", status: "已完成", completionRate: 100, endDate: "2024-04-15" }
    ],
    nextSteps: [
      { phase: "成果推广", deadline: "2024-05-15", responsible: "推广团队" },
      { phase: "用户培训", deadline: "2024-06-15", responsible: "培训团队" }
    ]
  }
]

export default function CompletionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [completion, setCompletion] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 先尝试从模拟数据中查找
      const foundCompletion = completionData.find(item => item.id === id)
      
      if (foundCompletion) {
        setCompletion(foundCompletion)
      } else {
        // 如果在模拟数据中找不到，尝试从示例数据中查找
        const foundInDemoData = allDemoProgressItems.find(item => item.id === id && item.progressType === "projectCompletion")
        
        if (foundInDemoData) {
          // 将示例数据转换为详情页面所需的格式
          setCompletion({
            id: foundInDemoData.id,
            title: foundInDemoData.name,
            status: foundInDemoData.status,
            statusLabel: foundInDemoData.status,
            applicant: foundInDemoData.assignee?.name || "未指定",
            leader: foundInDemoData.assignee?.name || "未指定",
            date: `${foundInDemoData.dueDate} 至 ${foundInDemoData.actualDate || "未完成"}`,
            department: "研究部门",
            completionType: foundInDemoData.type || "正常结项",
            evaluationResult: "良好",
            completionDate: foundInDemoData.dueDate,
            completionRate: foundInDemoData.completion || 100,
            reason: foundInDemoData.description,
            summary: "项目结项总结信息",
            achievements: "项目取得的主要成果",
            attachments: [
              { name: "结项报告.pdf", size: "1.0MB", date: foundInDemoData.dueDate }
            ],
            auditStatus: foundInDemoData.approvalStatus || "待审核",
            auditHistory: [
              { date: foundInDemoData.dueDate, user: foundInDemoData.assignee?.name || "未指定", action: "提交结项", comment: "提交项目结项报告" }
            ],
            progressSummary: [
              { phase: "阶段1", status: "已完成", completionRate: 100, endDate: foundInDemoData.dueDate }
            ],
            nextSteps: [
              { phase: "下一阶段", deadline: foundInDemoData.dueDate, responsible: foundInDemoData.assignee?.name || "未指定" }
            ]
          })
        }
      }
    } catch (error) {
      console.error("Error fetching completion data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/progress")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (completion) {
      setCompletion({ ...completion, title: newTitle })
    }
  }

  const handleDelete = () => {
    toast({
      title: "项目结项已删除",
      description: "项目结项记录已成功删除",
      duration: 3000,
    })
    
    router.push("/progress")
  }

  // 自定义状态颜色
  const statusColors = {
    "待审核": "bg-amber-50 text-amber-700 border-amber-200",
    "已通过": "bg-green-50 text-green-700 border-green-200",
    "已退回": "bg-red-50 text-red-700 border-red-200",
    "进行中": "bg-blue-50 text-blue-700 border-blue-200",
    "已完成": "bg-slate-50 text-slate-700 border-slate-200"
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!completion) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">未找到项目结项信息</div>
      </div>
    )
  }

  // 准备标签页组件
  const tabComponents = {
    overview: <CompletionOverviewTab completion={completion} />,
    documents: <CompletionDocumentsTab completion={completion} />,
    custom: <CompletionRelatedProjectsTab completion={completion} />
  }

  return (
    <UniversalDetailAdapter
      itemData={completion}
      onTitleEdit={handleTitleEdit}
      onBack={handleBack}
      onDelete={handleDelete}
      moduleType="progress"
      tabComponents={tabComponents}
      hiddenTabs={["process", "funds", "achievements", "risks", "reports", "statistics", "members"]}
      statusColors={statusColors}
    />
  )
}
