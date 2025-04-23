"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReviewSidebar from "@/app/components/review-sidebar"
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
  MessageSquare
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import InspectionOverviewTab from "../../[id]/components/inspection-overview-tab"
import InspectionDocumentsTab from "../../[id]/components/inspection-documents-tab"
import InspectionRelatedProjectsTab from "../../[id]/components/inspection-related-projects-tab"

// 导入示例数据
import { allDemoProgressItems } from "../../../data/progress-demo-data"

// 模拟数据（实际应用中应该从API获取）
const inspectionData = [
  {
    id: "pi1",
    title: "高校科研创新管理平台项目中检报告",
    status: "待审核",
    statusLabel: "待审核",
    applicant: "张三",
    leader: "张三",
    date: "2024-01-01 至 2024-12-31",
    department: "计算机科学学院",
    inspectionType: "阶段检查",
    inspectionResult: "符合预期",
    inspectionDate: "2024-04-15",
    completionRate: 65,
    reason: "根据项目计划安排，项目已完成第一阶段和第二阶段的研发工作，现进行中期检查评估。",
    findings: "项目进展符合预期，研发成果达到计划要求。系统核心功能已完成开发，用户界面友好，性能良好。",
    suggestions: "建议加强用户测试，收集更多用户反馈；优化数据处理流程，提高系统响应速度；完善文档管理功能。",
    attachments: [
      { name: "中检报告.pdf", size: "1.2MB", date: "2024-04-15" },
      { name: "阶段成果展示.pptx", size: "3.5MB", date: "2024-04-15" },
      { name: "测试报告.docx", size: "0.8MB", date: "2024-04-14" }
    ],
    auditStatus: "待审核",
    auditHistory: [
      { date: "2024-04-15", user: "张三", action: "提交中检", comment: "提交项目中检报告" }
    ],
    progressSummary: [
      { phase: "需求分析", status: "已完成", completionRate: 100, endDate: "2024-01-31" },
      { phase: "系统设计", status: "已完成", completionRate: 100, endDate: "2024-02-28" },
      { phase: "开发实现", status: "进行中", completionRate: 65, endDate: "2024-06-30" },
      { phase: "测试验收", status: "未开始", completionRate: 0, endDate: "2024-08-31" }
    ],
    nextSteps: [
      { phase: "完成核心功能开发", deadline: "2024-05-15", responsible: "开发团队" },
      { phase: "系统集成测试", deadline: "2024-06-15", responsible: "测试团队" },
      { phase: "用户验收测试", deadline: "2024-07-15", responsible: "产品团队" },
      { phase: "系统上线准备", deadline: "2024-08-15", responsible: "运维团队" }
    ]
  },
  {
    id: "pi2",
    title: "高校科研成果转化平台项目中检报告",
    status: "已通过",
    statusLabel: "已通过",
    applicant: "李四",
    leader: "李四",
    date: "2024-02-01 至 2024-12-31",
    department: "科研管理处",
    inspectionType: "技术评估",
    inspectionResult: "符合要求",
    inspectionDate: "2024-03-20",
    completionRate: 70,
    reason: "项目已完成关键技术研发和核心功能实现，需要进行技术评估和阶段性验收。",
    findings: "项目技术路线合理，研发进度良好，核心功能已实现并通过初步测试。系统架构设计合理，具有良好的扩展性和可维护性。",
    suggestions: "建议加强性能优化，特别是大数据处理部分；增强系统安全性，完善权限管理；优化用户体验，简化操作流程。",
    attachments: [
      { name: "技术评估报告.pdf", size: "2.1MB", date: "2024-03-20" },
      { name: "系统架构文档.docx", size: "1.5MB", date: "2024-03-19" },
      { name: "测试用例集.xlsx", size: "0.9MB", date: "2024-03-18" }
    ],
    auditStatus: "已通过",
    auditHistory: [
      { date: "2024-03-20", user: "李四", action: "提交中检", comment: "提交项目中检技术评估报告" },
      { date: "2024-03-25", user: "王主任", action: "审核通过", comment: "技术评估报告详实，项目进展良好，同意通过中期检查" }
    ],
    progressSummary: [
      { phase: "需求调研", status: "已完成", completionRate: 100, endDate: "2024-02-28" },
      { phase: "技术方案", status: "已完成", completionRate: 100, endDate: "2024-03-15" },
      { phase: "核心开发", status: "已完成", completionRate: 100, endDate: "2024-05-30" },
      { phase: "系统集成", status: "进行中", completionRate: 40, endDate: "2024-07-30" },
      { phase: "测试部署", status: "未开始", completionRate: 0, endDate: "2024-09-30" },
      { phase: "验收上线", status: "未开始", completionRate: 0, endDate: "2024-11-30" }
    ],
    nextSteps: [
      { phase: "完成系统集成", deadline: "2024-07-30", responsible: "集成团队" },
      { phase: "系统测试", deadline: "2024-09-30", responsible: "测试团队" },
      { phase: "用户培训", deadline: "2024-10-30", responsible: "培训团队" },
      { phase: "系统上线", deadline: "2024-11-30", responsible: "运维团队" }
    ]
  }
]

export default function InspectionReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [inspection, setInspection] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 先尝试从模拟数据中查找
      const foundInspection = inspectionData.find(item => item.id === id)
      
      if (foundInspection) {
        setInspection(foundInspection)
      } else {
        // 如果在模拟数据中找不到，尝试从示例数据中查找
        const foundInDemoData = allDemoProgressItems.find(item => item.id === id && item.progressType === "projectInspection")
        
        if (foundInDemoData) {
          // 将示例数据转换为详情页面所需的格式
          setInspection({
            id: foundInDemoData.id,
            title: foundInDemoData.name,
            status: foundInDemoData.status,
            statusLabel: foundInDemoData.status,
            applicant: foundInDemoData.assignee?.name || "未指定",
            leader: foundInDemoData.assignee?.name || "未指定",
            date: `${foundInDemoData.dueDate} 至 ${foundInDemoData.actualDate || "未完成"}`,
            department: "研究部门",
            inspectionType: foundInDemoData.inspectionType || "常规检查",
            inspectionResult: foundInDemoData.inspectionResult || "待评估",
            inspectionDate: foundInDemoData.dueDate,
            completionRate: foundInDemoData.completion || 0,
            reason: foundInDemoData.description,
            findings: "项目中检发现的问题和成果",
            suggestions: "项目中检建议",
            attachments: [
              { name: "中检报告.pdf", size: "1.0MB", date: foundInDemoData.dueDate }
            ],
            auditStatus: foundInDemoData.auditStatus || "待审核",
            auditHistory: [
              { date: foundInDemoData.dueDate, user: foundInDemoData.assignee?.name || "未指定", action: "提交中检", comment: "提交项目中检报告" }
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
      console.error("Error fetching inspection data:", error)
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

  if (!inspection) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到项目中检记录</h2>
        <p className="text-muted-foreground">该记录可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "applicant",
      label: "申请人",
      value: inspection.applicant,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "inspectionDate",
      label: "中检日期",
      value: inspection.inspectionDate,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "department",
      label: "所属部门",
      value: inspection.department,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "inspectionType",
      label: "检查类型",
      value: (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          {inspection.inspectionType}
        </Badge>
      ),
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: "auditStatus",
      label: "审核状态",
      value: (
        <Badge 
          className={
            inspection.auditStatus === "已通过" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : inspection.auditStatus === "已退回" 
                ? "bg-red-50 text-red-700 border-red-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
          }
        >
          {inspection.auditStatus}
        </Badge>
      ),
      icon: inspection.auditStatus === "已通过" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : inspection.auditStatus === "已退回" 
          ? <AlertCircle className="h-4 w-4 text-red-500" /> 
          : <Clock className="h-4 w-4 text-amber-500" />,
    },
  ]

  return (
    <div className="flex flex-col relative">
      <div className="w-[calc(100%-350px)]">
        <UniversalDetailAdapter
          itemData={inspection}
          showRightSidebar={false}
          hiddenTabs={["risks", "reports", "statistics", "members", "process", "funds", "achievements"]} 
          hiddenFields={[]} 
          hiddenActions={["delete"]} 
          tabComponents={{
            overview: <InspectionOverviewTab data={inspection} />,
            documents: <InspectionDocumentsTab data={inspection} />,
            custom: <InspectionRelatedProjectsTab data={inspection} />
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
      <ReviewSidebar projectData={inspection} />
    </div>
  )
}
