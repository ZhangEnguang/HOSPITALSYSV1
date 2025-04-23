"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  FileText,
  FolderOpen,
  LineChart,
  Wallet,
  Calendar,
  CheckSquare,
  Medal,
  Users,
  ClipboardList,
  Brain,
} from "lucide-react"

export type TabItem = {
  id: string
  title: string
  icon: React.ReactNode
  closable: boolean
  path: string
}

interface TabsContextType {
  tabs: TabItem[]
  activeTab: string
  openTab: (tabInfo: { id: string; title: string; icon: React.ReactNode; path: string }) => void
  closeTab: (tabId: string) => void
  closeOtherTabs: () => void
  closeAllTabs: () => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

// 预定义的标签页配置
export const availableTabs = [
  { id: "todos", title: "待办事项", icon: <CheckSquare className="h-4 w-4" />, path: "/todos" },
  { id: "applications", title: "申报管理", icon: <ClipboardList className="h-4 w-4" />, path: "/applications" },
  { id: "projects", title: "项目管理", icon: <FolderOpen className="h-4 w-4" />, path: "/projects" },
  { id: "progress", title: "进度跟踪", icon: <LineChart className="h-4 w-4" />, path: "/progress" },
  { id: "calendar", title: "日历", icon: <Calendar className="h-4 w-4" />, path: "/calendar" },
  { id: "funds", title: "经费管理", icon: <Wallet className="h-4 w-4" />, path: "/funds" },
  { id: "achievements", title: "成果管理", icon: <FileText className="h-4 w-4" />, path: "/achievements" },
  { id: "rewards", title: "考核奖励", icon: <Medal className="h-4 w-4" />, path: "/rewards" },
  { id: "members", title: "成员管理", icon: <Users className="h-4 w-4" />, path: "/members" },
  { id: "documents", title: "文档中心", icon: <FileText className="h-4 w-4" />, path: "/documents" },
  { id: "project-type", title: "项目分类", icon: <FileText className="h-4 w-4" />, path: "/project-type" },
  // 添加AI智能填报标签
  { id: "ai-form", title: "AI智能填报", icon: <Brain className="h-4 w-4" />, path: "/projects/ai-form" },
]

// 自定义标签页配置
export const customTabs: Record<string, { title: string; icon: React.ReactNode }> = {
  "projects/ai-form": { title: "AI智能填报", icon: <Brain className="h-4 w-4" /> },
}

export const TabsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: "workbench", title: "工作台", icon: <Home className="h-4 w-4" />, closable: false, path: "/workbench?tab=overview" },
  ])
  const [activeTab, setActiveTab] = useState("workbench")
  const [tabHistory, setTabHistory] = useState<string[]>(["workbench"])

  // 添加事件监听器
  useEffect(() => {
    const handleSubMenuClick = (event: CustomEvent) => {
      const { tabInfo } = event.detail;
      openTab(tabInfo);
    };

    window.addEventListener('subMenuClick', handleSubMenuClick as EventListener);
    return () => {
      window.removeEventListener('subMenuClick', handleSubMenuClick as EventListener);
    };
  }, []);

  // 监听路由变化，添加或激活对应的页签
  useEffect(() => {
    // 从路径中提取当前页面ID
    const pathSegments = pathname.split("/").filter(Boolean)
    const currentPath = pathname === "/" ? "workbench" : pathSegments[0]

    // 处理自定义路径
    let tabId = currentPath
    let tabInfo = availableTabs.find((tab) => tab.id === currentPath)

    // 检查是否是自定义路径
    if (!tabInfo && pathSegments.length > 0) {
      const fullPath = pathSegments.join("/")
      const customTabInfo = customTabs[fullPath]
      if (customTabInfo) {
        tabId = fullPath
        tabInfo = {
          id: fullPath,
          title: customTabInfo.title,
          icon: customTabInfo.icon,
          path: `/${fullPath}`,
        }
      }
    }

    // 如果当前路径对应的页签已存在，则激活它
    const existingTab = tabs.find((tab) => tab.id === tabId)
    if (existingTab) {
      setActiveTab(tabId)
    } else if (tabInfo) {
      // 如果页签不存在但有配置信息，则添加新页签
      const newTab: TabItem = {
        id: tabId,
        title: tabInfo.title,
        icon: tabInfo.icon,
        closable: true,
        path: tabInfo.path,
      }
      setTabs((prev) => [...prev, newTab])
      setActiveTab(tabId)
    } else if (currentPath === "workbench") {
      setActiveTab("workbench")
    }
  }, [pathname, tabs])

  // 更新标签历史记录
  useEffect(() => {
    if (tabHistory[tabHistory.length - 1] !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab])
    }
  }, [activeTab, tabHistory])

  // 打开新标签
  const openTab = (tabInfo: { id: string; title: string; icon: React.ReactNode; path: string }) => {
    // 检查标签页是否已存在
    if (tabs.some((tab) => tab.id === tabInfo.id)) {
      setActiveTab(tabInfo.id)
      router.push(tabInfo.path)
      return
    }

    const newTab: TabItem = {
      ...tabInfo,
      closable: true,
    }

    setTabs([...tabs, newTab])
    setActiveTab(newTab.id)
    router.push(tabInfo.path)
  }

  // 关闭标签
  const closeTab = (tabId: string) => {
    // 不能关闭工作台标签
    if (tabId === "workbench") return

    // 从标签列表中移除
    const updatedTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(updatedTabs)

    // 如果关闭的是当前激活的标签页，则激活前一个访问的标签
    if (activeTab === tabId) {
      // 从历史记录中找到最近的一个仍然存在的标签
      const newHistory = [...tabHistory]
      newHistory.pop() // 移除当前标签

      // 从后往前查找历史记录中第一个仍然存在的标签
      let previousTab = "workbench" // 默认为工作台
      while (newHistory.length > 0) {
        const lastTab = newHistory.pop()
        // 检查这个标签是否仍然存在（不是刚刚被关闭的，且在当前标签列表中）
        if (lastTab !== tabId && updatedTabs.some((t) => t.id === lastTab)) {
          previousTab = lastTab
          break
        }
      }

      setActiveTab(previousTab)
      // 更新历史记录，移除已关闭的标签
      setTabHistory(tabHistory.filter((t) => t !== tabId))

      // 导航到前一个标签的路径
      const prevTab = updatedTabs.find((t) => t.id === previousTab)
      if (prevTab) {
        router.push(prevTab.path)
      }
    }
  }

  // 关闭其他标签
  const closeOtherTabs = () => {
    // 保留当前标签和工作台标签
    const updatedTabs = tabs.filter((tab) => tab.id === activeTab || tab.id === "workbench")
    setTabs(updatedTabs)
    setTabHistory([activeTab])
  }

  // 关闭所有标签
  const closeAllTabs = () => {
    // 只保留工作台标签
    setTabs(tabs.filter((tab) => tab.id === "workbench"))
    setActiveTab("workbench")
    setTabHistory(["workbench"])
    router.push("/")
  }

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeTab,
        openTab,
        closeTab,
        closeOtherTabs,
        closeAllTabs,
      }}
    >
      {children}
    </TabsContext.Provider>
  )
}

export const useTabs = () => {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error("useTabs must be used within a TabsProvider")
  }
  return context
}

