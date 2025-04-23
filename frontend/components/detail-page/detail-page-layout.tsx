"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// 定义标签页配置接口
export interface TabConfig {
  id: string
  label: string
  icon: ReactNode
  content: ReactNode
}

// 定义操作按钮配置接口
export interface ActionButton {
  id: string
  label: string
  icon: ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  onClick: () => void
}

// 定义信息字段配置接口
export interface InfoField {
  id: string
  label: string
  value: string | ReactNode
  icon?: ReactNode
}

// 定义详情页布局组件的props接口
export interface DetailPageLayoutProps {
  id: string | number
  title: string
  tabs: TabConfig[]
  defaultActiveTab?: string
  infoFields?: InfoField[]
  actionButtons?: ActionButton[]
  status?: {
    value: string
    color: string
  }
  onTitleChange?: (newTitle: string) => void
  onBack?: () => void
  showSidebar?: boolean
  sidebarContent?: ReactNode
  sidebarWidth?: number
}

export default function DetailPageLayout({
  id,
  title,
  tabs,
  defaultActiveTab,
  infoFields = [],
  actionButtons = [],
  status,
  onTitleChange,
  onBack,
  showSidebar = false,
  sidebarContent,
  sidebarWidth = 350,
}: DetailPageLayoutProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [activeTab, setActiveTab] = useState(defaultActiveTab || (tabs.length > 0 ? tabs[0].id : ""))

  // 用于检测点击空白处的ref
  const editContainerRef = useRef<HTMLDivElement>(null)

  // 更新标题状态
  useEffect(() => {
    setEditedTitle(title)
  }, [title])

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

  const cancelEditing = () => {
    setIsEditing(false)
    setEditedTitle(title)
  }

  const saveTitle = () => {
    if (editedTitle.trim()) {
      if (onTitleChange) {
        onTitleChange(editedTitle)
      }
      setIsEditing(false)
    }
  }

  // 获取当前活动标签页的内容
  const getActiveTabContent = () => {
    const activeTabConfig = tabs.find((tab) => tab.id === activeTab)
    return activeTabConfig ? activeTabConfig.content : null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左侧主内容区域 */}
      <div
        className={`flex-1 overflow-auto p-8 ${
          showSidebar ? `pr-[${sidebarWidth + 20}px]` : "pr-8"
        } transition-all duration-300`}
      >
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
                  />
                  <Button size="sm" variant="ghost" onClick={saveTitle}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {title}
                  {onTitleChange && (
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
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* 操作按钮 */}
            {actionButtons.map((button) => (
              <Button
                key={button.id}
                variant={button.variant || "outline"}
                className="gap-2 transition-colors duration-200"
                onClick={button.onClick}
              >
                {button.icon}
                {button.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 项目信息 */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 ml-12">
          {infoFields.map((field) => (
            <div key={field.id} className="flex items-center text-sm text-muted-foreground">
              {field.icon && <span className="mr-2">{field.icon}</span>}
              <span className="font-medium mr-1">{field.label}:</span> {field.value}
            </div>
          ))}

          {/* 状态标签 */}
          {status && <Badge className={status.color}>{status.value}</Badge>}
        </div>

        {/* 导航标签 */}
        <div className="flex overflow-x-auto pb-2 mb-4 border-b gap-2.5">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`rounded-md ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent hover:bg-white hover:text-primary text-muted-foreground"
              } transition-colors duration-200`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="pb-8">{getActiveTabContent()}</div>
      </div>

      {/* 侧边栏 */}
      {showSidebar && sidebarContent && (
        <div
          className="fixed top-0 right-0 h-full overflow-auto border-l bg-background shadow-sm"
          style={{ width: `${sidebarWidth}px` }}
        >
          {sidebarContent}
        </div>
      )}
    </div>
  )
}

