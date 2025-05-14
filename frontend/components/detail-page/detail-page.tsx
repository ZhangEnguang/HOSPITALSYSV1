"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  User,
  Edit2,
  Save,
  X,
  GitBranch,
  DollarSign,
  Award,
  AlertTriangle,
  FileIcon,
  Trash2,
  ClipboardList,
  PenSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export type TabConfig = {
  id: string
  label: string
  icon: React.ReactNode
  component: React.ReactNode
  hidden?: boolean
}

export type ActionConfig = {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  hidden?: boolean
}

export type FieldConfig = {
  id: string
  label: string
  value: string | React.ReactNode
  icon?: React.ReactNode
  hidden?: boolean
}

export type DetailPageProps = {
  id: string | number
  title: string
  status?: string
  statusLabel?: string
  fields?: FieldConfig[]
  tabs: TabConfig[]
  actions?: ActionConfig[]
  reviewSidebar?: React.ReactNode
  showReviewSidebar?: boolean
  onTitleEdit?: (newTitle: string) => void
  onBack?: () => void
  defaultTab?: string
  statusColors?: Record<string, string>
}

export default function DetailPage({
  id,
  title,
  status = "待审核",
  statusLabel = "待审核",
  fields = [],
  tabs = [],
  actions = [],
  reviewSidebar = null,
  showReviewSidebar = true,
  onTitleEdit,
  onBack,
  defaultTab = "",
  statusColors = {},
}: DetailPageProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : ""))
  const [currentStatus, setCurrentStatus] = useState(status)
  const [currentStatusLabel, setCurrentStatusLabel] = useState(statusLabel)
  const [showSidebar, setShowSidebar] = useState(showReviewSidebar)

  // 用于检测点击空白处的ref
  const editContainerRef = useRef<HTMLDivElement>(null)

  // 更新标题状态
  useEffect(() => {
    setEditedTitle(title)
  }, [title])

  // 更新状态
  useEffect(() => {
    setCurrentStatus(status)
  }, [status])

  // 更新状态标签
  useEffect(() => {
    setCurrentStatusLabel(statusLabel)
  }, [statusLabel])

  // 添加点击事件监听器，用于检测点击空白处关闭编辑
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

  // 处理返回
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  // 处理标题编辑
  const startEditing = () => {
    setIsEditing(true)
  }

  const saveTitle = () => {
    if (editedTitle.trim()) {
      if (onTitleEdit) {
        onTitleEdit(editedTitle)
      }
      setIsEditing(false)
    }
  }

  const cancelEditing = () => {
    setEditedTitle(title)
    setIsEditing(false)
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveTitle()
    } else if (e.key === "Escape") {
      cancelEditing()
    }
  }

  // 获取状态对应的颜色
  const getStatusColor = (status: string) => {
    if (statusColors[status]) {
      return statusColors[status]
    }

    switch (status) {
      case "待审核":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "已通过":
        return "bg-green-50 text-green-700 border-green-200"
      case "已退回":
        return "bg-red-50 text-red-700 border-red-200"
      case "已完结":
        return "bg-slate-50 text-slate-700 border-slate-200"
      case "进行中":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  // 切换审核信息栏显示状态
  const toggleReviewSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  // 确保每次路由变化时重置activeTab
  useEffect(() => {
    // 初始化时设置默认tab
    const initialTab = defaultTab || (tabs.length > 0 ? tabs[0].id : "")
    setActiveTab(initialTab)

    // 监听路由变化
    const handleRouteChange = () => {
      const initialTab = defaultTab || (tabs.length > 0 ? tabs[0].id : "")
      setActiveTab(initialTab)
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [defaultTab, tabs])

  return (
    <div className="flex min-h-0 overflow-hidden">
      {/* 左侧主内容区域 */}
      <div className={`flex-1 overflow-auto pb-8 ${showSidebar ? "pr-[346px]" : "pr-6"}`}>
        {/* 头部区域 */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              {/* 返回按钮 */}
              <button
                onClick={handleBack}
                className="h-8 w-8 flex items-center justify-center bg-white border rounded-md text-gray-500 hover:text-primary transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              {isEditing ? (
                <div className="flex items-center gap-2" ref={editContainerRef}>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-2xl font-bold py-2 h-auto"
                    autoFocus
                    onKeyDown={handleKeyDown}
                  />
                  <Button size="sm" variant="ghost" onClick={saveTitle}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {title}
                    {onTitleEdit && (
                      <Button variant="ghost" size="icon" onClick={startEditing} className="h-6 w-6">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </h1>

                  {currentStatus && (
                    <Badge className={getStatusColor(currentStatus)}>
                      {currentStatusLabel || currentStatus}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          {actions.length > 0 && (
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {actions
                .filter((action) => !action.hidden)
                .map((action) => (
                  <Button
                    key={action.id}
                    variant={action.variant || "outline"}
                    className="gap-2 transition-colors duration-200"
                    onClick={action.onClick}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
            </div>
          )}
        </div>

        {/* 字段信息 */}
        {fields.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 ml-12">
            {fields
              .filter((field) => !field.hidden)
              .map((field) => (
                <div key={field.id} className="flex items-center text-sm text-muted-foreground">
                  {field.icon && <span className="mr-2">{field.icon}</span>}
                  <span className="font-medium mr-1">{field.label}:</span> 
                  {React.isValidElement(field.value) 
                    ? field.value 
                    : typeof field.value === 'object' && field.value !== null 
                      ? JSON.stringify(field.value) 
                      : field.value}
                </div>
              ))}
          </div>
        )}

        {/* 导航标签 - 使用原生的shadcn/ui按钮样式，不添加自定义样式 */}
        {tabs.length > 0 && (
          <div className="flex overflow-x-auto pb-2 mb-4 border-b gap-2.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
            {tabs
              .filter((tab) => !tab.hidden)
              .map((tab) => (
                <Button
                  key={`tab-${tab.id}-${activeTab === tab.id}`}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  className={`shrink-0 transition-colors duration-200 ${activeTab !== tab.id ? "hover:bg-white" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </Button>
              ))}
          </div>
        )}

        {/* 内容区域 */}
        <div className="px-1">
          {tabs
            .filter((tab) => !tab.hidden && tab.id === activeTab)
            .map((tab) => (
              <div key={tab.id}>{tab.component}</div>
            ))}
        </div>
      </div>

      {/* 审核信息侧边栏 - 调整位置紧贴标签栏 */}
      {showSidebar && (
        <div className="fixed right-0 w-[360px] top-[112px] bottom-0 border-l bg-background overflow-hidden z-10">
          {reviewSidebar}
        </div>
      )}
    </div>
  )
}
