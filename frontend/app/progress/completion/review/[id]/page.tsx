"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReviewSidebar from "@/app/todos/[id]/components/review-sidebar"
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
  Link,
  MessageSquare,
  Award
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import CompletionOverviewTab from "../../[id]/components/completion-overview-tab"
import CompletionDocumentsTab from "../../[id]/components/completion-documents-tab"
import CompletionRelatedProjectsTab from "../../[id]/components/completion-related-projects-tab"

// 导入示例数据
import { allDemoProgressItems } from "../../../data/progress-demo-data"

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

export default function CompletionReviewPage({ params }: { params: { id: string } }) {
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
            evaluationResult: foundInDemoData.evaluationResult || "良好",
            completionDate: foundInDemoData.dueDate,
            completionRate: foundInDemoData.completion || 100,
            reason: foundInDemoData.description,
            summary: "项目结项总结信息",
            achievements: "项目取得的主要成果",
            attachments: [
              { name: "结项报告.pdf", size: "1.0MB", date: foundInDemoData.dueDate }
            ],
            auditStatus: foundInDemoData.auditStatus || "待审核",
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
    router.push(`/progress`)
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
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到项目结项记录</h2>
        <p className="text-muted-foreground">该记录可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "applicant",
      label: "申请人",
      value: completion.applicant,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "completionDate",
      label: "结项日期",
      value: completion.completionDate,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "department",
      label: "所属部门",
      value: completion.department,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "completionType",
      label: "结项类型",
      value: (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          {completion.completionType}
        </Badge>
      ),
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: "evaluationResult",
      label: "评价结果",
      value: (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
          {completion.evaluationResult}
        </Badge>
      ),
      icon: <Award className="h-4 w-4" />,
    },
    {
      id: "auditStatus",
      label: "审核状态",
      value: (
        <Badge 
          className={
            completion.auditStatus === "已通过" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : completion.auditStatus === "已退回" 
                ? "bg-red-50 text-red-700 border-red-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
          }
        >
          {completion.auditStatus}
        </Badge>
      ),
      icon: completion.auditStatus === "已通过" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : completion.auditStatus === "已退回" 
          ? <AlertCircle className="h-4 w-4 text-red-500" /> 
          : <Clock className="h-4 w-4 text-amber-500" />,
    },
  ]

  return (
    <div className="flex flex-col relative">
      <div className="w-[calc(100%-350px)]">
        <UniversalDetailAdapter
          itemData={completion}
          showRightSidebar={false}
          hiddenTabs={["risks", "reports", "statistics", "members", "process", "funds", "achievements"]} 
          hiddenFields={[]} 
          hiddenActions={["delete"]} 
          tabComponents={{
            overview: <CompletionOverviewTab completion={completion} />,
            documents: <CompletionDocumentsTab completion={completion} />,
            custom: <CompletionRelatedProjectsTab completion={completion} />
          }}
          customTabLabels={{
            overview: "概览",
            documents: "文档",
            custom: "关联项目"
          }}
          tabsHeight={45}
          headerHeight={65}
          buttonsHeight={42}
          moduleType="progress"
          customBackPath={`/progress`}
          statusColors={statusColors}
          onBack={handleBack}
        />
      </div>
      
      {/* 将审核侧边栏组件放在UniversalDetailAdapter之外 */}
      <ReviewSidebar projectData={completion} />
    </div>
  )
}
