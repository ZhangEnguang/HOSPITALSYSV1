"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  FileIcon,
  GitBranch,
  DollarSign,
  Award,
  AlertTriangle,
  ClipboardList,
  PenSquare,
  Trash2,
  User,
  Calendar,
  FileText,
  Layers,
  AlertCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import DetailPage, { TabConfig, ActionConfig, FieldConfig } from "./detail-page"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// 导入拆分的Tab组件
import OverviewTab from "@/app/todos/[id]/components/overview-tab"
import ReportsTab from "@/app/todos/[id]/components/reports-tab"
import ProcessTab from "@/app/todos/[id]/components/process-tab"
import FundsTab from "@/app/todos/[id]/components/funds-tab"
import AchievementsTab from "@/app/todos/[id]/components/achievements-tab"
import RisksTab from "@/app/todos/[id]/components/risks-tab"
import ReviewSidebar from "@/app/todos/[id]/components/review-sidebar"
import AuditStepsDropdown from "@/app/todos/[id]/components/audit-steps-dropdown"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

interface TodoDetailAdapterProps {
  todoData: any
  showReviewSidebar?: boolean
  hiddenTabs?: string[]
  hiddenFields?: string[]
  hiddenActions?: string[]
  customFields?: { id: string; label: string; value: any; icon: any }[]
  onBack?: () => void
  onTitleEdit?: (newTitle: string) => void
}

export default function TodoDetailAdapter({
  todoData,
  showReviewSidebar = true,
  hiddenTabs = [],
  hiddenFields = [],
  hiddenActions = [],
  customFields = [],
  onBack,
  onTitleEdit,
}: TodoDetailAdapterProps) {
  const router = useRouter()
  const [todoStatus, setTodoStatus] = useState<string>(todoData?.status || "待审核")
  const [reviewStatusLabel, setReviewStatusLabel] = useState<string>("科研院退回")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)

  // 初始化状态标签
  useEffect(() => {
    if (todoData?.status === "已通过") {
      setReviewStatusLabel("管理员审核通过")
    } else if (todoData?.status === "已退回") {
      setReviewStatusLabel("管理员审核退回")
    } else {
      setReviewStatusLabel("科研院退回")
    }
  }, [todoData?.status])

  // 处理编辑项目
  const handleEditProject = () => {
    // 确保ID是有效的
    if (todoData && todoData.id) {
      // 使用字符串ID确保路由匹配
      const projectId = String(todoData.id)
      
      console.log('TodoDetailAdapter - 编辑项目:', todoData);
      console.log('TodoDetailAdapter - 项目ID:', projectId);
      console.log('TodoDetailAdapter - 跳转路径:', `/projects/edit/${projectId}`);
      
      // 使用绝对路径进行导航
      router.push(`/projects/edit/${projectId}`)
      
      // 调试信息
      console.log(`正在跳转到编辑页面: /projects/edit/${projectId}`)
    } else {
      console.error('TodoDetailAdapter - 编辑失败: 无效的项目ID', todoData);
      toast({
        title: "无法编辑",
        description: "项目ID无效或未找到",
        variant: "destructive"
      })
    }
  }

  // 处理删除项目
  const handleDeleteProject = () => {
    // 删除后跳转回项目列表页面
    setTimeout(() => {
      router.push("/projects")
    }, 500)
  }

  // 打开删除确认
  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true)
  }

  // 确认删除
  const confirmDelete = () => {
    // 关闭删除确认
    setShowDeleteConfirm(false)
    
    // 显示删除成功提示
    setShowDeleteSuccess(true)
    
    // 1.5秒后删除项目
    setTimeout(() => {
      handleDeleteProject()
    }, 1500)
  }

  // 获取优先级对应的颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "紧急":
        return "bg-red-500 text-white"
      case "一般":
        return "bg-amber-50 text-amber-700"
      case "普通":
        return "bg-green-50 text-green-700"
      case "高":
        return "bg-black text-white"
      default:
        return "bg-slate-50 text-slate-700"
    }
  }

  // 状态颜色配置
  const statusColors: Record<string, string> = {
    "待审核": "warning",
    "已通过": "success",
    "已退回": "destructive",
    "已完结": "default",
    "进行中": "secondary",
  }

  // 定义标签配置
  const tabConfigs: TabConfig[] = [
    {
      id: "overview",
      label: "项目概览",
      icon: <FileIcon className="h-4 w-4" />,
      component: <OverviewTab todo={{ ...todoData, status: todoStatus }} getPriorityColor={getPriorityColor} />,
      hidden: hiddenTabs.includes("overview"),
    },
    {
      id: "process",
      label: "执行过程",
      icon: <GitBranch className="h-4 w-4" />,
      component: <ProcessTab />,
      hidden: hiddenTabs.includes("process"),
    },
    {
      id: "funds",
      label: "经费管理",
      icon: <DollarSign className="h-4 w-4" />,
      component: <FundsTab />,
      hidden: hiddenTabs.includes("funds"),
    },
    {
      id: "achievements",
      label: "成果管理",
      icon: <Award className="h-4 w-4" />,
      component: <AchievementsTab />,
      hidden: hiddenTabs.includes("achievements"),
    },
    {
      id: "risks",
      label: "风险与问题",
      icon: <AlertTriangle className="h-4 w-4" />,
      component: <RisksTab />,
      hidden: hiddenTabs.includes("risks"),
    },
    {
      id: "reports",
      label: "项目报告",
      icon: <ClipboardList className="h-4 w-4" />,
      component: <ReportsTab />,
      hidden: hiddenTabs.includes("reports"),
    },
  ]

  // 定义操作配置
  const actionConfigs: ActionConfig[] = [
    {
      id: "edit",
      label: "编辑",
      icon: <PenSquare className="h-4 w-4" />,
      onClick: handleEditProject,
      variant: "outline",
      hidden: hiddenActions.includes("edit"),
    },
    {
      id: "delete",
      label: "删除",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: openDeleteConfirm,
      variant: "destructive",
      hidden: hiddenActions.includes("delete"),
    },
  ]

  // 定义详情页字段
  const fieldConfigs = [
    {
      id: "description",
      label: "项目描述",
      value: todoData?.description || "",
      icon: <FileText className="h-4 w-4" />,
      hidden: hiddenFields.includes("description"),
    },
    {
      id: "status",
      label: "项目状态",
      value: todoStatus,
      icon: <Layers className="h-4 w-4" />,
      hidden: hiddenFields.includes("status"),
    },
    {
      id: "priority",
      label: "优先级",
      value: todoData?.priority || "普通",
      icon: <AlertCircle className="h-4 w-4" />,
      hidden: hiddenFields.includes("priority"),
    },
    {
      id: "deadline",
      label: "截止日期",
      value: todoData?.dueDate || "无截止日期",
      icon: <Calendar className="h-4 w-4" />,
      hidden: hiddenFields.includes("deadline"),
    },
    {
      id: "applicant",
      label: "申请人",
      value: todoData?.applicant || "",
      icon: <User className="h-4 w-4" />,
      hidden: hiddenFields.includes("applicant"),
    },
    {
      id: "period",
      label: "项目周期",
      value: "2024-01-01 至 2024-12-31",
      icon: <Calendar className="h-4 w-4" />,
      hidden: hiddenFields.includes("period"),
    },
    ...customFields.map(field => ({
      ...field,
      hidden: hiddenFields.includes(field.id)
    }))
  ]

  // 创建审核侧边栏
  const reviewSidebarComponent = showReviewSidebar ? (
    <ReviewSidebar
      status={todoStatus}
      getStatusColor={(status: string) => statusColors[status as keyof typeof statusColors] || statusColors["待审核"]}
      projectId={todoData?.id?.toString()}
      projectTitle={todoData?.title}
    />
  ) : null

  return (
    <>
      <DetailPage
        id={todoData?.id}
        title={todoData?.title}
        status={todoStatus}
        statusLabel={reviewStatusLabel}
        fields={fieldConfigs}
        tabs={tabConfigs}
        actions={actionConfigs}
        reviewSidebar={reviewSidebarComponent}
        showReviewSidebar={showReviewSidebar}
        onTitleEdit={onTitleEdit}
        onBack={onBack}
        defaultTab="overview"
        statusColors={statusColors}
      />
      
      {/* 删除确认 */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除项目 "{todoData?.title}" 吗？此操作不可逆，删除后将无法恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* 删除成功提示 */}
      <AlertDialog open={showDeleteSuccess} onOpenChange={setShowDeleteSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除成功</AlertDialogTitle>
            <AlertDialogDescription>
              项目 "{todoData?.title}" 已被删除，正在跳转回项目列表...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
