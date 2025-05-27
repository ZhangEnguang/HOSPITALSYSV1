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
  BarChart,
  FileText,
  Layers,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import UniversalDetailPage, { TabConfig, ActionConfig, FieldConfig } from "./universal-detail-page"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface UniversalDetailAdapterProps {
  // 基本数据
  itemData: any
  
  // 配置项
  showRightSidebar?: boolean
  hiddenTabs?: string[]
  hiddenFields?: string[]
  hiddenActions?: string[]
  
  // 回调函数
  onBack?: () => void
  onTitleEdit?: (newTitle: string) => void
  onDelete?: () => void
  onEdit?: () => void
  
  // 自定义组件
  rightSidebarComponent?: React.ReactNode
  
  // 自定义标签页
  tabComponents?: Record<string, React.ReactNode>
  customTabLabels?: Record<string, string>
  
  // 自定义高度
  tabsHeight?: number
  headerHeight?: number
  buttonsHeight?: number
  
  // 模块类型（用于确定编辑和返回路径）
  moduleType?: "project" | "progress" | "achievement" | "fund" | "risk" | "report" | "custom"
  
  // 自定义路径
  customEditPath?: string
  customBackPath?: string
  
  // 状态颜色配置
  statusColors?: Record<string, string>

  // 自定义操作按钮
  customActions?: ActionConfig[]
  
  // 自定义字段
  customFields?: FieldConfig[]
}

export default function UniversalDetailAdapter({
  itemData,
  showRightSidebar = false,
  hiddenTabs = [],
  hiddenFields = [],
  hiddenActions = [],
  onBack,
  onTitleEdit,
  onDelete,
  onEdit,
  rightSidebarComponent = null,
  tabComponents = {},
  customTabLabels = {},
  tabsHeight = 40,
  headerHeight = 60,
  buttonsHeight = 40,
  moduleType = "project",
  customEditPath,
  customBackPath,
  statusColors = {},
  customActions = [],
  customFields = [],
}: UniversalDetailAdapterProps) {
  const router = useRouter()
  const [itemStatus, setItemStatus] = useState<string>(itemData?.status || "进行中")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)

  // 获取模块对应的路径
  const getModulePath = (type: string) => {
    switch (type) {
      case "project": return "projects"
      case "progress": return "progress"
      case "achievement": return "achievements"
      case "fund": return "funds"
      case "risk": return "risks"
      case "report": return "reports"
      default: return type
    }
  }

  // 处理编辑项目
  const handleEdit = () => {
    if (onEdit) {
      onEdit()
      return
    }
    
    // 确保ID是有效的
    if (itemData && itemData.id) {
      // 使用字符串ID确保路由匹配
      const id = String(itemData.id)
      
      // 确定编辑路径
      const editPath = customEditPath || `/${getModulePath(moduleType)}/edit/${id}`
      
      // 使用绝对路径进行导航
      router.push(editPath)
    } else {
      toast({
        title: "无法编辑",
        description: "ID无效或未找到",
        variant: "destructive"
      })
    }
  }

  // 处理删除项目
  const handleDelete = () => {
    if (onDelete) {
      onDelete()
      return
    }
    
    // 默认删除后跳转回列表页面
    setTimeout(() => {
      const backPath = customBackPath || `/${getModulePath(moduleType)}`
      router.push(backPath)
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
      handleDelete()
    }, 1500)
  }

  // 处理返回
  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }
    
    const backPath = customBackPath || `/${getModulePath(moduleType)}`
    router.push(backPath)
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

  // 定义默认状态颜色映射
  const defaultStatusColors = {
    "待审核": "bg-amber-50 text-amber-700 border-amber-200",
    "已通过": "bg-green-50 text-green-700 border-green-200",
    "已退回": "bg-red-50 text-red-700 border-red-200",
    "已完结": "bg-slate-50 text-slate-700 border-slate-200",
    "进行中": "bg-green-50 text-green-700 border-green-200",
    ...statusColors
  }

  // 定义标签配置
  const getDefaultTabComponent = (tabId: string) => {
    return (
      <div className="p-4 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-medium mb-4">{tabId.charAt(0).toUpperCase() + tabId.slice(1)} 内容</h3>
        <p className="text-muted-foreground">此标签页内容尚未配置，请通过 tabComponents 属性提供自定义内容。</p>
      </div>
    )
  }

  // 定义标签配置
  const tabConfigs: TabConfig[] = [
    {
      id: "overview",
      label: customTabLabels.overview || "概览",
      icon: <FileIcon className="h-4 w-4" />,
      component: tabComponents.overview || getDefaultTabComponent("overview"),
      hidden: hiddenTabs.includes("overview"),
    },
    {
      id: "booking",
      label: customTabLabels.booking || "预约记录",
      icon: <Calendar className="h-4 w-4" />,
      component: tabComponents.booking || getDefaultTabComponent("booking"),
      hidden: hiddenTabs.includes("booking"),
    },
    {
      id: "maintenance",
      label: customTabLabels.maintenance || "维护记录",
      icon: <GitBranch className="h-4 w-4" />,
      component: tabComponents.maintenance || getDefaultTabComponent("maintenance"),
      hidden: hiddenTabs.includes("maintenance"),
    },
    {
      id: "recommendations",
      label: customTabLabels.recommendations || "相关推荐",
      icon: <Award className="h-4 w-4" />,
      component: tabComponents.recommendations || getDefaultTabComponent("recommendations"),
      hidden: hiddenTabs.includes("recommendations"),
    },
    {
      id: "process",
      label: customTabLabels.process || "执行过程",
      icon: <GitBranch className="h-4 w-4" />,
      component: tabComponents.process || getDefaultTabComponent("process"),
      hidden: hiddenTabs.includes("process"),
    },
    {
      id: "funds",
      label: customTabLabels.funds || "经费管理",
      icon: <DollarSign className="h-4 w-4" />,
      component: tabComponents.funds || getDefaultTabComponent("funds"),
      hidden: hiddenTabs.includes("funds"),
    },
    {
      id: "achievements",
      label: customTabLabels.achievements || "成果管理",
      icon: <Award className="h-4 w-4" />,
      component: tabComponents.achievements || getDefaultTabComponent("achievements"),
      hidden: hiddenTabs.includes("achievements"),
    },
    {
      id: "risks",
      label: customTabLabels.risks || "风险与问题",
      icon: <AlertTriangle className="h-4 w-4" />,
      component: tabComponents.risks || getDefaultTabComponent("risks"),
      hidden: hiddenTabs.includes("risks"),
    },
    {
      id: "reports",
      label: customTabLabels.reports || "报告",
      icon: <ClipboardList className="h-4 w-4" />,
      component: tabComponents.reports || getDefaultTabComponent("reports"),
      hidden: hiddenTabs.includes("reports"),
    },
    {
      id: "statistics",
      label: customTabLabels.statistics || "统计分析",
      icon: <BarChart className="h-4 w-4" />,
      component: tabComponents.statistics || getDefaultTabComponent("statistics"),
      hidden: hiddenTabs.includes("statistics"),
    },
    {
      id: "documents",
      label: customTabLabels.documents || "文档",
      icon: <FileText className="h-4 w-4" />,
      component: tabComponents.documents || getDefaultTabComponent("documents"),
      hidden: hiddenTabs.includes("documents"),
    },
    {
      id: "members",
      label: customTabLabels.members || "成员",
      icon: <User className="h-4 w-4" />,
      component: tabComponents.members || getDefaultTabComponent("members"),
      hidden: hiddenTabs.includes("members"),
    },
    {
      id: "custom",
      label: customTabLabels.custom || "关联项目",
      icon: <Layers className="h-4 w-4" />,
      component: tabComponents.custom || getDefaultTabComponent("custom"),
      hidden: hiddenTabs.includes("custom") || !tabComponents.custom,
    },
  ]

  // 定义操作配置
  const actionConfigs: ActionConfig[] = [
    {
      id: "edit",
      label: "编辑",
      icon: <PenSquare className="h-4 w-4" />,
      onClick: handleEdit,
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
    ...customActions,
  ]

  // 定义字段配置
  const defaultFieldConfigs: FieldConfig[] = [
    {
      id: "applicant",
      label: "负责人",
      value: itemData?.applicant || itemData?.leader || "",
      icon: <User className="h-4 w-4" />,
      hidden: hiddenFields.includes("applicant"),
    },
    {
      id: "period",
      label: "周期",
      value: itemData?.period || itemData?.date || "未设置",
      icon: <Calendar className="h-4 w-4" />,
      hidden: hiddenFields.includes("period"),
    },
  ]

  // 合并自定义字段和默认字段
  const fieldConfigs: FieldConfig[] = customFields.length > 0 
    ? customFields.map(field => ({
        ...field,
        hidden: hiddenFields.includes(field.id)
      }))
    : defaultFieldConfigs

  return (
    <>
      <UniversalDetailPage
        id={itemData?.id}
        title={itemData?.title || itemData?.name || ""}
        status={itemStatus}
        statusLabel={itemData?.statusLabel || itemStatus}
        fields={fieldConfigs}
        tabs={tabConfigs}
        actions={actionConfigs}
        rightSidebar={rightSidebarComponent}
        showRightSidebar={showRightSidebar}
        onTitleEdit={onTitleEdit}
        onBack={handleBack}
        defaultTab="overview"
        statusColors={defaultStatusColors}
        tabsHeight={tabsHeight}
        headerHeight={headerHeight}
        buttonsHeight={buttonsHeight}
      />
      
      {/* 删除确认 */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除 "{itemData?.title || itemData?.name}" 吗？此操作不可逆，删除后将无法恢复。
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
              "{itemData?.title || itemData?.name}" 已被删除，正在跳转回列表页面...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
