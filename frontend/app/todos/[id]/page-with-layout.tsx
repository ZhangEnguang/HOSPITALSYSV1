"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  User,
  Trash2,
  PenSquare,
  FileIcon,
  GitBranch,
  DollarSign,
  Award,
  AlertTriangle,
  ClipboardList,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { todoItems } from "../data/mock-data"

// 导入详情页布局组件
import DetailPageLayout, {
  type TabConfig,
  type ActionButton,
  type InfoField,
} from "@/components/detail-page/detail-page-layout"
import { getStatusColor, getPriorityColor } from "@/components/detail-page/status-badge-utils"

// 导入Tab组件
import OverviewTab from "./components/overview-tab"
import ReportsTab from "./components/reports-tab"
import ProcessTab from "./components/process-tab"
import FundsTab from "./components/funds-tab"
import AchievementsTab from "./components/achievements-tab"
import RisksTab from "./components/risks-tab"
import ReviewSidebar from "./components/review-sidebar"
import AuditStepsDropdown from "./components/audit-steps-dropdown"

export default function TodoDetailPageWithLayout({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = Number.parseInt(params.id)
  const [todo, setTodo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewSidebar, setShowReviewSidebar] = useState(true)

  // 获取待办事项数据
  useEffect(() => {
    try {
      const foundTodo = todoItems.find((item) => item.id === id)
      if (foundTodo) {
        setTodo(foundTodo)
      }
    } catch (error) {
      console.error("Error fetching todo:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  // 处理标题更改
  const handleTitleChange = (newTitle: string) => {
    if (todo) {
      setTodo({ ...todo, title: newTitle })
      // 这里应该有一个API调用来保存更改
      toast({
        title: "标题已更新",
        description: "项目标题已成功更新",
        duration: 3000,
      })
    }
  }

  // 处理编辑项目
  const handleEditProject = () => {
    toast({
      title: "编辑",
      description: "编辑功能正在开发中...",
      duration: 3000,
    })
  }

  // 处理删除项目
  const handleDeleteProject = () => {
    toast({
      title: "删除",
      description: "删除功能正在开发中...",
      duration: 3000,
    })
  }

  // 创建审核步骤下拉菜单
  const auditStepDropdown = <AuditStepsDropdown currentStepLabel="科研院退回" />

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!todo) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">未找到待办事项</h2>
        <p className="text-muted-foreground">该待办事项可能已被删除或不存在</p>
      </div>
    )
  }

  // 定义标签页配置
  const tabConfigs: TabConfig[] = [
    {
      id: "overview",
      label: "项目概览",
      icon: <FileIcon className="h-4 w-4 mr-2" />,
      content: <OverviewTab todo={todo} getPriorityColor={getPriorityColor} />,
    },
    {
      id: "process",
      label: "执行过程",
      icon: <GitBranch className="h-4 w-4 mr-2" />,
      content: <ProcessTab />,
    },
    {
      id: "funds",
      label: "经费管理",
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      content: <FundsTab />,
    },
    {
      id: "achievements",
      label: "成果管理",
      icon: <Award className="h-4 w-4 mr-2" />,
      content: <AchievementsTab />,
    },
    {
      id: "risks",
      label: "风险与问题",
      icon: <AlertTriangle className="h-4 w-4 mr-2" />,
      content: <RisksTab />,
    },
    {
      id: "reports",
      label: "项目报告",
      icon: <ClipboardList className="h-4 w-4 mr-2" />,
      content: <ReportsTab />,
    },
  ]

  // 定义操作按钮配置
  const actionButtons: ActionButton[] = [
    {
      id: "edit",
      label: "编辑",
      icon: <PenSquare className="h-4 w-4" />,
      variant: "outline",
      onClick: handleEditProject,
    },
    {
      id: "delete",
      label: "删除",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      onClick: handleDeleteProject,
    },
  ]

  // 定义信息字段配置
  const infoFields: InfoField[] = [
    {
      id: "applicant",
      label: "负责人",
      value: todo.applicant,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "period",
      label: "项目周期",
      value: "2024-01-01 至 2024-12-31",
      icon: <Calendar className="h-4 w-4" />,
    },
  ]

  return (
    <DetailPageLayout
      id={id}
      title={todo.title}
      tabs={tabConfigs}
      defaultActiveTab="overview"
      infoFields={infoFields}
      actionButtons={actionButtons}
      status={{
        value: todo.status || "进行中",
        color: getStatusColor(todo.status || "进行中"),
        showNextToTitle: true,
        extraElement: auditStepDropdown, // 使用审核步骤下拉菜单作为额外元素
      }}
      onTitleChange={handleTitleChange}
      showSidebar={showReviewSidebar}
      sidebarContent={
        <ReviewSidebar
          status={todo.status}
          getStatusColor={getStatusColor}
          projectId={id.toString()}
          projectTitle={todo.title}
        />
      }
    />
  )
}

