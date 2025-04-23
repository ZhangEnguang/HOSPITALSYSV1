"use client"

import { useState, useEffect, useRef, ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  User,
  Edit2,
  Save,
  X,
  Trash2,
  PenSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import ReviewSidebar from "./review-sidebar"
import AuditStepsDropdown from "./audit-steps-dropdown"

export type TabConfig = {
  id: string
  label: string
  icon: ReactNode
  content: ReactNode
  visible?: boolean
}

export type StatusConfig = {
  value: string
  label: string
  color: string
}

export type PriorityConfig = {
  value: string
  label: string
  color: string
}

export type ReviewPageProps = {
  // 基本数据
  id: string | number
  title: string
  status: string
  applicant?: string
  date?: string
  
  // 审核状态相关
  reviewStatusLabel?: string
  auditSteps?: { label: string; value: string }[]
  
  // 配置项
  showBackButton?: boolean
  showEditButton?: boolean
  showDeleteButton?: boolean
  showStatusBadge?: boolean
  showAuditSteps?: boolean
  showReviewSidebar?: boolean
  showApplicantInfo?: boolean
  showDateInfo?: boolean
  
  // 自定义样式和颜色
  statusColors?: Record<string, string>
  priorityColors?: Record<string, string>
  
  // 标签页配置
  tabs: TabConfig[]
  defaultActiveTab?: string
  
  // 回调函数
  onBack?: () => void
  onTitleChange?: (newTitle: string) => void
  onEdit?: () => void
  onDelete?: () => void
  onStatusChange?: (newStatus: string) => void
  onTabChange?: (tabId: string) => void
  
  // 审核侧边栏配置
  sidebarWidth?: number
  sidebarContent?: ReactNode
  customSidebar?: ReactNode
}

const defaultStatusColors: Record<string, string> = {
  "default": "bg-slate-50 text-slate-700 border-slate-200",
  "pending": "bg-amber-50 text-amber-700 border-amber-200",
  "approved": "bg-green-50 text-green-700 border-green-200",
  "rejected": "bg-red-50 text-red-700 border-red-200",
  "completed": "bg-slate-50 text-slate-700 border-slate-200",
  "in-progress": "bg-green-50 text-green-700 border-green-200",
}

const defaultPriorityColors: Record<string, string> = {
  "high": "bg-red-500 text-white",
  "medium": "bg-amber-50 text-amber-700",
  "low": "bg-green-50 text-green-700",
  "critical": "bg-black text-white",
  "default": "bg-slate-50 text-slate-700",
}

export default function ReviewPage({
  // 基本数据
  id,
  title,
  status,
  applicant,
  date,
  
  // 审核状态相关
  reviewStatusLabel = "",
  auditSteps = [],
  
  // 配置项
  showBackButton = true,
  showEditButton = true,
  showDeleteButton = true,
  showStatusBadge = true,
  showAuditSteps = true,
  showReviewSidebar = true,
  showApplicantInfo = true,
  showDateInfo = true,
  
  // 自定义样式和颜色
  statusColors = {},
  priorityColors = {},
  
  // 标签页配置
  tabs,
  defaultActiveTab,
  
  // 回调函数
  onBack,
  onTitleChange,
  onEdit,
  onDelete,
  onStatusChange,
  onTabChange,
  
  // 审核侧边栏配置
  sidebarWidth = 370,
  sidebarContent,
  customSidebar,
}: ReviewPageProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [activeTab, setActiveTab] = useState(defaultActiveTab || (tabs.length > 0 ? tabs[0].id : ""))
  const [displayReviewSidebar, setDisplayReviewSidebar] = useState(showReviewSidebar)
  const [currentStatus, setCurrentStatus] = useState(status)
  const [currentReviewStatusLabel, setCurrentReviewStatusLabel] = useState(reviewStatusLabel)
  
  // 编辑标题的引用
  const editContainerRef = useRef<HTMLDivElement>(null)

  // 合并默认颜色和自定义颜色
  const mergedStatusColors = { ...defaultStatusColors, ...statusColors }
  const mergedPriorityColors = { ...defaultPriorityColors, ...priorityColors }

  // 点击外部区域关闭编辑模式
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editContainerRef.current && !editContainerRef.current.contains(event.target as Node) && isEditing) {
        cancelEditing()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing])

  // 返回按钮处理函数
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  // 开始编辑标题
  const startEditing = () => {
    setIsEditing(true)
  }

  // 取消编辑标题
  const cancelEditing = () => {
    setIsEditing(false)
    setEditedTitle(title)
  }

  // 保存编辑后的标题
  const saveTitle = () => {
    if (editedTitle.trim()) {
      if (onTitleChange) {
        onTitleChange(editedTitle)
      }
      setIsEditing(false)
    }
  }

  // 处理编辑项目
  const handleEditProject = () => {
    if (onEdit) {
      onEdit()
    }
  }

  // 处理删除项目
  const handleDeleteProject = () => {
    if (onDelete) {
      onDelete()
    }
  }

  // 获取状态颜色
  const getStatusColor = (statusValue: string) => {
    return mergedStatusColors[statusValue] || mergedStatusColors["default"]
  }

  // 获取优先级颜色
  const getPriorityColor = (priorityValue: string) => {
    return mergedPriorityColors[priorityValue] || mergedPriorityColors["default"]
  }

  // 切换审核侧边栏显示
  const toggleReviewSidebar = () => {
    setDisplayReviewSidebar(!displayReviewSidebar)
  }

  // 处理状态变更
  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
    
    if (onStatusChange) {
      onStatusChange(newStatus)
    }
  }

  // 处理标签页切换
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  // 过滤可见的标签页
  const visibleTabs = tabs.filter(tab => tab.visible !== false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 主内容区域 */}
      <div 
        className={`flex-1 overflow-auto pb-8 ${displayReviewSidebar ? `pr-[${sidebarWidth}px]` : "pr-8"}`}
        style={{ paddingRight: displayReviewSidebar ? `${sidebarWidth}px` : '2rem' }}
      >
        {/* 头部区域：标题、状态、按钮等 */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              {/* 返回按钮 */}
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="h-8 w-8 flex items-center justify-center bg-white border rounded-md text-gray-500 hover:text-primary transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}

              {/* 标题（编辑模式或显示模式） */}
              {isEditing ? (
                <div className="flex items-center gap-2" ref={editContainerRef}>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-2xl font-bold py-2 h-auto"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={saveTitle}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {title}
                    {showEditButton && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={startEditing}
                        className="h-8 w-8 p-0 transition-colors duration-200"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </h1>
                  
                  {/* 状态标签 */}
                  {showStatusBadge && currentStatus && (
                    <Badge className={getStatusColor(currentStatus)}>{currentStatus}</Badge>
                  )}

                  {/* 审核步骤下拉菜单 */}
                  {showAuditSteps && (
                    <AuditStepsDropdown 
                      currentStepLabel={currentReviewStatusLabel} 
                      steps={auditSteps}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 编辑和删除按钮 */}
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {showEditButton && (
              <Button variant="outline" className="gap-2 transition-colors duration-200" onClick={handleEditProject}>
                <PenSquare className="h-4 w-4" />
                编辑
              </Button>
            )}
            {showDeleteButton && (
              <Button variant="destructive" className="gap-2 transition-colors duration-200" onClick={handleDeleteProject}>
                <Trash2 className="h-4 w-4" />
                删除
              </Button>
            )}
          </div>
        </div>

        {/* 申请人和日期信息 */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 ml-12">
          {showApplicantInfo && applicant && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium mr-1">申请人:</span> {applicant}
            </div>
          )}

          {showDateInfo && date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-medium mr-1">申请日期:</span> {date}
            </div>
          )}
        </div>

        {/* 标签页导航 */}
        {visibleTabs.length > 0 && (
          <div className="flex overflow-x-auto pb-2 mb-4 border-b gap-2.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
            {visibleTabs.map((tab) => (
              <Button
                key={`tab-${tab.id}`}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                className={`shrink-0 transition-colors duration-200 ${activeTab !== tab.id ? "hover:bg-white" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
        )}

        {/* 标签页内容 */}
        {visibleTabs.map((tab) => (
          activeTab === tab.id && (
            <div key={`content-${tab.id}`}>
              {tab.content}
            </div>
          )
        ))}
      </div>

      {/* 审核侧边栏 */}
      {displayReviewSidebar && (
        customSidebar || (
          <ReviewSidebar
            status={currentStatus}
            getStatusColor={getStatusColor}
            projectId={id.toString()}
            projectTitle={title}
            onStatusChange={handleStatusChange}
            width={sidebarWidth}
          >
            {sidebarContent}
          </ReviewSidebar>
        )
      )}
    </div>
  )
}
