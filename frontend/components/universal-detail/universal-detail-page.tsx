"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

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

export type UniversalDetailPageProps = {
  id: string | number
  title: string
  status?: string
  statusLabel?: string
  fields?: FieldConfig[]
  tabs: TabConfig[]
  actions?: ActionConfig[]
  rightSidebar?: React.ReactNode
  showRightSidebar?: boolean
  onTitleEdit?: (newTitle: string) => void
  onBack?: () => void
  defaultTab?: string
  statusColors?: Record<string, string>
  tabsHeight?: number
  headerHeight?: number
  buttonsHeight?: number
}

export default function UniversalDetailPage({
  id,
  title,
  status = "进行中",
  statusLabel = "进行中",
  fields = [],
  tabs = [],
  actions = [],
  rightSidebar = null,
  showRightSidebar = true,
  onTitleEdit,
  onBack,
  defaultTab = "",
  statusColors = {},
  tabsHeight = 40,
  headerHeight = 60,
  buttonsHeight = 40,
}: UniversalDetailPageProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : ""))
  const [currentStatus, setCurrentStatus] = useState(status)
  const [currentStatusLabel, setCurrentStatusLabel] = useState(statusLabel)
  const [showSidebar, setShowSidebar] = useState(showRightSidebar)

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
    <div className="w-full">
      {/* 主内容区域 */}
      <div 
        className={`w-full ${showSidebar ? "mr-[350px]" : ""}`}
      >
        {/* 标题和操作区域 */}
        <div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 z-10"
          style={{ height: `${headerHeight}px` }}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              {/* 返回按钮 */}
              <button
                onClick={handleBack}
                className="h-8 w-8 flex items-center justify-center border rounded-md text-gray-500 hover:text-primary transition-colors duration-200 bg-white shadow-sm"
                style={{ height: `${buttonsHeight}px`, width: `${buttonsHeight}px` }}
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
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={saveTitle}
                    style={{ height: `${buttonsHeight}px` }}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={cancelEditing}
                    style={{ height: `${buttonsHeight}px` }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {title}
                    {onTitleEdit && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={startEditing} 
                        className="h-6 w-6"
                        style={{ height: `${buttonsHeight * 0.75}px`, width: `${buttonsHeight * 0.75}px` }}
                      >
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
                    style={{ height: `${buttonsHeight}px` }}
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

        {/* 导航标签 */}
        {tabs.length > 0 && (
          <div 
            className="flex overflow-x-auto pb-2 mb-4 border-b gap-2.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full pl-6"
            style={{ minHeight: `${tabsHeight}px`, height: 'auto' }}
          >
            {tabs
              .filter((tab) => !tab.hidden)
              .map((tab) => (
                <Button
                  key={`tab-${tab.id}-${activeTab === tab.id}`}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  className={`shrink-0 transition-colors duration-200 ${activeTab !== tab.id ? "hover:bg-white" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ height: `${tabsHeight * 0.8}px` }}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </Button>
              ))}
          </div>
        )}

        {/* 内容区域 */}
        <div className="px-6 pb-8">
          {tabs
            .filter((tab) => !tab.hidden && tab.id === activeTab)
            .map((tab) => (
              <div key={tab.id}>{tab.component}</div>
            ))}
        </div>
      </div>

      {/* 右侧边栏 */}
      {showSidebar && (
        <div className="fixed top-0 right-0 w-[350px] h-screen border-l bg-background">
          <div className="p-6 h-full">
            {rightSidebar}
          </div>
        </div>
      )}
    </div>
  )
}
