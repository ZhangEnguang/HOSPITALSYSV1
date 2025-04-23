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
  Link,
  MessageSquare
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 导入标签页组件
import ProgressOverviewTab from "./components/progress-overview-tab"
import ProgressDocumentsTab from "./components/progress-documents-tab"
import ProgressRelatedProjectsTab from "./components/progress-related-projects-tab"

// 导入示例数据
import { projectChangeItems } from "../data/progress-demo-data"

// 模拟数据（实际应用中应该从API获取）
const progressData = [
  {
    id: "pc1",
    title: "高校科研创新管理平台项目进度变更申请",
    status: "待审核",
    statusLabel: "待审核",
    applicant: "张三",
    leader: "张三",
    date: "2024-01-01 至 2024-12-31",
    department: "计算机科学学院",
    changeType: "进度延期",
    originalEndDate: "2024-06-30",
    newEndDate: "2024-09-30",
    reason: "由于设备采购延迟和人员变动，项目进度受到影响，需要延期三个月完成。",
    impact: "项目整体进度将延后，但不影响最终成果质量。预计在延期后能够按照原计划完成所有研究目标。",
    attachments: [
      { name: "进度变更申请表.pdf", size: "1.2MB", date: "2024-01-15" },
      { name: "项目进度报告.docx", size: "0.8MB", date: "2024-01-15" }
    ],
    approvalStatus: "待审核",
    approvalHistory: [
      { date: "2024-01-15", user: "张三", action: "提交申请", comment: "提交进度变更申请" }
    ],
    progressBefore: [
      { phase: "需求分析", status: "已完成", completionRate: 100, endDate: "2024-01-31" },
      { phase: "系统设计", status: "已完成", completionRate: 100, endDate: "2024-02-28" },
      { phase: "开发实现", status: "进行中", completionRate: 50, endDate: "2024-04-30" },
      { phase: "测试验收", status: "未开始", completionRate: 0, endDate: "2024-06-30" }
    ],
    progressAfter: [
      { phase: "需求分析", status: "已完成", completionRate: 100, endDate: "2024-01-31" },
      { phase: "系统设计", status: "已完成", completionRate: 100, endDate: "2024-02-28" },
      { phase: "开发实现", status: "进行中", completionRate: 50, endDate: "2024-06-30" },
      { phase: "测试验收", status: "未开始", completionRate: 0, endDate: "2024-09-30" }
    ]
  },
  {
    id: "pc2",
    title: "高校科研成果转化平台研究项目进度变更",
    status: "已通过",
    statusLabel: "已通过",
    applicant: "李四",
    leader: "李四",
    date: "2024-02-01 至 2024-12-31",
    department: "科研管理处",
    changeType: "阶段调整",
    originalEndDate: "2024-07-31",
    newEndDate: "2024-07-31",
    reason: "根据最新研究发现，需要调整研究方向，增加一个研究阶段，但不影响整体结束时间。",
    impact: "项目整体进度不变，但各阶段时间分配有所调整，有利于提高研究成果质量。",
    attachments: [
      { name: "进度变更申请表.pdf", size: "1.5MB", date: "2024-02-10" },
      { name: "研究方向调整说明.docx", size: "1.1MB", date: "2024-02-10" }
    ],
    approvalStatus: "已通过",
    approvalHistory: [
      { date: "2024-02-10", user: "李四", action: "提交申请", comment: "提交进度变更申请" },
      { date: "2024-02-15", user: "王主任", action: "审核通过", comment: "同意调整研究阶段，方案合理" }
    ],
    progressBefore: [
      { phase: "文献调研", status: "已完成", completionRate: 100, endDate: "2024-03-31" },
      { phase: "方案设计", status: "进行中", completionRate: 70, endDate: "2024-05-31" },
      { phase: "实验验证", status: "未开始", completionRate: 0, endDate: "2024-07-31" }
    ],
    progressAfter: [
      { phase: "文献调研", status: "已完成", completionRate: 100, endDate: "2024-03-15" },
      { phase: "方案设计", status: "进行中", completionRate: 70, endDate: "2024-04-30" },
      { phase: "初步实验", status: "未开始", completionRate: 0, endDate: "2024-06-15" },
      { phase: "方案优化", status: "未开始", completionRate: 0, endDate: "2024-07-31" }
    ]
  },
  {
    id: "pc3",
    title: "国家重点研发计划项目人员变更",
    status: "待审核",
    statusLabel: "待审核",
    applicant: "王五",
    leader: "王五",
    date: "2024-03-01 至 2024-12-31",
    department: "物理学院",
    changeType: "人员变更",
    originalEndDate: "2024-08-31",
    newEndDate: "2024-08-31",
    reason: "调整研究团队成员，增加人工智能算法专家，提升研究能力。",
    impact: "增强团队研究能力，有望提前完成研究目标。",
    attachments: [
      { name: "人员变更申请表.pdf", size: "1.3MB", date: "2024-03-05" },
      { name: "新增人员简历.docx", size: "0.9MB", date: "2024-03-05" }
    ],
    approvalStatus: "待审核",
    approvalHistory: [
      { date: "2024-03-05", user: "王五", action: "提交申请", comment: "提交人员变更申请" }
    ],
    progressBefore: [
      { phase: "需求分析", status: "已完成", completionRate: 100, endDate: "2024-02-28" },
      { phase: "算法设计", status: "进行中", completionRate: 30, endDate: "2024-05-31" },
      { phase: "系统实现", status: "未开始", completionRate: 0, endDate: "2024-07-31" },
      { phase: "测试验证", status: "未开始", completionRate: 0, endDate: "2024-08-31" }
    ],
    progressAfter: [
      { phase: "需求分析", status: "已完成", completionRate: 100, endDate: "2024-02-28" },
      { phase: "算法设计", status: "进行中", completionRate: 30, endDate: "2024-05-31" },
      { phase: "系统实现", status: "未开始", completionRate: 0, endDate: "2024-07-31" },
      { phase: "测试验证", status: "未开始", completionRate: 0, endDate: "2024-08-31" }
    ]
  }
]

export default function ProgressDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  // 在 client 组件中，params 不是 Promise，可以直接访问
  const id = params.id
  const [progress, setProgress] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // 先尝试从模拟数据中查找
      const foundProgress = progressData.find(item => item.id === id)
      
      if (foundProgress) {
        setProgress(foundProgress)
      } else {
        // 如果在模拟数据中找不到，尝试从示例数据中查找
        const foundInDemoData = projectChangeItems.find(item => item.id === id)
        
        if (foundInDemoData) {
          // 将示例数据转换为详情页面所需的格式
          setProgress({
            id: foundInDemoData.id,
            title: foundInDemoData.name,
            status: foundInDemoData.status,
            statusLabel: foundInDemoData.status,
            applicant: foundInDemoData.assignee?.name || "未指定",
            leader: foundInDemoData.assignee?.name || "未指定",
            date: `${foundInDemoData.dueDate} 至 ${foundInDemoData.actualDate || "未完成"}`,
            department: "研究部门",
            changeType: foundInDemoData.changeType,
            originalEndDate: foundInDemoData.dueDate,
            newEndDate: foundInDemoData.actualDate || foundInDemoData.dueDate,
            reason: foundInDemoData.description,
            impact: "项目变更影响分析信息",
            attachments: [
              { name: "变更申请表.pdf", size: "1.0MB", date: foundInDemoData.dueDate }
            ],
            approvalStatus: foundInDemoData.approvalStatus,
            approvalHistory: [
              { date: foundInDemoData.dueDate, user: foundInDemoData.assignee?.name || "未指定", action: "提交申请", comment: "提交变更申请" }
            ],
            progressBefore: [
              { phase: "阶段1", status: "已完成", completionRate: 100, endDate: foundInDemoData.dueDate }
            ],
            progressAfter: [
              { phase: "阶段1", status: "已完成", completionRate: 100, endDate: foundInDemoData.actualDate || foundInDemoData.dueDate }
            ]
          })
        }
      }
    } catch (error) {
      console.error("Error fetching progress data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleBack = () => {
    router.push("/progress")
  }

  const handleTitleEdit = (newTitle: string) => {
    if (progress) {
      setProgress({ ...progress, title: newTitle })
    }
  }

  const handleDelete = () => {
    if (confirm("确定要删除此进度变更记录吗？")) {
      alert("删除成功")
      router.push("/progress")
    }
  }

  // 处理变更审核
  const handleReview = () => {
    router.push(`/progress/review/${id}`)
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

  if (!progress) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到项目进度变更记录</h2>
        <p className="text-muted-foreground">该记录可能已被删除或不存在</p>
      </div>
    )
  }

  // 自定义字段
  const customFields = [
    {
      id: "applicant",
      label: "申请人",
      value: progress.applicant,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "changeDate",
      label: "变更日期",
      value: progress.approvalHistory?.[0]?.date || "未知",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "department",
      label: "所属部门",
      value: progress.department,
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: "changeType",
      label: "变更类型",
      value: (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          {progress.changeType}
        </Badge>
      ),
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: "approvalStatus",
      label: "审批状态",
      value: (
        <Badge 
          className={
            progress.approvalStatus === "已通过" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : progress.approvalStatus === "已退回" 
                ? "bg-red-50 text-red-700 border-red-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
          }
        >
          {progress.approvalStatus}
        </Badge>
      ),
      icon: progress.approvalStatus === "已通过" 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : progress.approvalStatus === "已退回" 
          ? <AlertCircle className="h-4 w-4 text-red-500" /> 
          : <Clock className="h-4 w-4 text-amber-500" />,
    },
  ]

  return (
    <div className="flex flex-col">
      <UniversalDetailAdapter
        itemData={progress}
        showRightSidebar={false}
        hiddenTabs={["process", "funds", "achievements", "risks", "reports", "statistics", "members"]} 
        hiddenFields={["period"]} 
        hiddenActions={[]} 
        tabComponents={{
          overview: <ProgressOverviewTab data={progress} />,
          documents: <ProgressDocumentsTab data={progress} />,
          custom: <ProgressRelatedProjectsTab data={progress} />
        }}
        tabsHeight={45}
        headerHeight={65}
        buttonsHeight={42}
        moduleType="progress"
        customBackPath="/progress"
        statusColors={statusColors}
        onBack={handleBack}
        onTitleEdit={handleTitleEdit}
        onDelete={handleDelete}
        // 删除了变更审核按钮
        customActions={[
        ]}
      />
    </div>
  )
}
