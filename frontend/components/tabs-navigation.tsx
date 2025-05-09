"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  X,
  Home,
  FileText,
  FolderOpen,
  LineChart,
  Wallet,
  Calendar,
  CheckSquare,
  Medal,
  Users,
  XCircle,
  ClipboardList,
  Check,
  ListFilter,
  Network,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export type TabItem = {
  id: string
  title: string
  icon: React.ReactNode
  closable: boolean
  path: string
}

// 创建一个全局事件总线
export const tabEventBus = {
  openTab: null as ((tabInfo: { id: string; title: string; icon: React.ReactNode; path: string }) => void) | null,
};

export default function TabsNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: "workbench", title: "工作台", icon: <Home className="h-4 w-4" />, closable: false, path: "/workbench?tab=overview" },
  ])

  const [activeTab, setActiveTab] = useState("workbench")
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [tabHistory, setTabHistory] = useState<string[]>(["workbench"])
  const [rightClickedTab, setRightClickedTab] = useState<string | null>(null)

  // 可添加的标签页选项
  const availableTabs: Array<{
    id: string
    title: string
    icon: React.ReactNode
    path: string
  }> = [
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
  ]

  // 监听路由变化，添加或激活对应的页签
  useEffect(() => {
    // 从路径中提取当前页面ID和完整路径
    const pathSegments = pathname?.split("/").filter(Boolean) || [];
    const currentPath = pathname === "/" ? "workbench" : pathSegments[0];
    const fullPath = pathname === "/" ? "/" : pathname || "/";
    
    // 如果当前路径对应的页签已存在，则激活它
    const existingTab = tabs.find((tab) => tab.path === fullPath);
    if (existingTab) {
      setActiveTab(existingTab.id);
      return;
    }

    // 查找基础路由配置
    const baseTabInfo = availableTabs.find((tab) => tab.id === currentPath);

    // 处理子路由（如添加、编辑、查看等页面）
    if (pathSegments.length > 1) {
      const action = pathSegments[1];
      const id = pathSegments[2];
      const baseTitle = baseTabInfo ? baseTabInfo.title : "未知页面";
      const baseIcon = baseTabInfo ? baseTabInfo.icon : <FileText className="h-4 w-4" />;

      // 根据操作类型设置标题
      let title: string;
      switch (action) {
        case "create":
          title = `新建${baseTitle}`;
          break;
        case "edit":
          title = `编辑${baseTitle}`;
          break;
        case "view":
          title = `查看${baseTitle}`;
          break;
        default:
          title = id ? `${baseTitle} ${id}` : baseTitle;
      }

      // 创建新标签 - 添加时间戳确保ID唯一
      const tabId = `${fullPath}-${Date.now()}`;
      const newTab: TabItem = {
        id: tabId,
        title,
        icon: baseIcon,
        closable: true,
        path: fullPath,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTab(tabId);
    } else if (baseTabInfo) {
      // 处理一级路由
      const newTab: TabItem = {
        id: baseTabInfo.id,
        title: baseTabInfo.title,
        icon: baseTabInfo.icon,
        closable: true,
        path: baseTabInfo.path,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTab(baseTabInfo.id);
    } else if (currentPath === "workbench") {
      setActiveTab("workbench");
    }
  }, [pathname]);

  // 更新标签历史记录
  useEffect(() => {
    if (tabHistory[tabHistory.length - 1] !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab])
    }
  }, [activeTab, tabHistory])

  // 修改 handleTabClick 函数，防止重复打开工作台
  const handleTabClick = (tabId: string) => {
    // 找到对应的标签并导航到其路径
    const tab = tabs.find((t) => t.id === tabId)
    if (tab) {
      // 如果是工作台且已经在工作台页面，则不做任何操作
      if (tabId === "workbench" && activeTab === "workbench") {
        return;
      }
      setActiveTab(tabId)
      router.push(tab.path)
    }
  }

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    closeTab(tabId)
  }

  // 修改 closeTab 函数，确保正确移除页签并更新状态
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
        if (lastTab && lastTab !== tabId && updatedTabs.some((t) => t.id === lastTab)) {
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

  // 修改 closeCurrentTab 函数，确保正确关闭当前页签
  const closeCurrentTab = () => {
    if (activeTab !== "workbench") {
      closeTab(activeTab)
    }
  }

  // 修改 closeOtherTabs 函数，确保正确保留当前页签和工作台页签
  const closeOtherTabs = () => {
    // 保留当前标签和工作台标签
    const updatedTabs = tabs.filter((tab) => tab.id === activeTab || tab.id === "workbench")
    setTabs(updatedTabs)
    setTabHistory([activeTab])
  }

  // 修改 closeAllTabs 函数，确保正确只保留工作台页签
  const closeAllTabs = () => {
    // 只保留工作台标签
    setTabs(tabs.filter((tab) => tab.id === "workbench"))
    setActiveTab("workbench")
    setTabHistory(["workbench"])
    router.push("/")
  }

  // 添加openTab方法
  const openTab = useCallback((tabInfo: { id: string; title: string; icon: React.ReactNode; path: string }) => {
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

    setTabs((prev) => [...prev, newTab])
    setActiveTab(newTab.id)
    router.push(tabInfo.path)
  }, [tabs, router])

  // 注册openTab方法到全局事件总线
  useEffect(() => {
    tabEventBus.openTab = openTab;
    return () => {
      tabEventBus.openTab = null;
    };
  }, [openTab]);

  // 获取未打开的标签
  const getUnopenedTabs = () => {
    return availableTabs.filter((tab) => !tabs.some((t) => t.id === tab.id))
  }

  return (
    // 修改标签栏容器，确保右侧图标固定
    <div className="w-full bg-white">
      <div className="flex items-center relative mt-2.5">
        <div className="flex-1 overflow-x-auto hide-scrollbar">
          <div className="flex min-w-0 ml-2.5">
            {tabs.map((tab, index) => (
              <ContextMenu key={tab.id}>
                <ContextMenuTrigger>
                  <motion.div
                    className={cn(
                      "flex items-center px-4 py-2 cursor-pointer relative group first:rounded-tl-lg first:rounded-tr-lg last:rounded-tl-lg last:rounded-tr-lg",
                      activeTab === tab.id ? "bg-[#F4F7FC] text-primary" : "text-gray-600 hover:bg-gray-50",
                      "flex items-center"
                    )}
                    onClick={() => handleTabClick(tab.id)}
                    onMouseEnter={() => setHoveredTab(tab.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    onContextMenu={() => setRightClickedTab(tab.id)}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm whitespace-nowrap">
                        {tab.title}
                      </span>
                    </div>

                    {tab.closable && (
                      <button
                        className="ml-2 rounded-full p-0.5 hover:bg-gray-200 text-gray-500"
                        onClick={(e) => handleTabClose(e, tab.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* 添加分隔线，但不在最后一个标签后添加 */}
                    {index < tabs.length - 1 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[14px] w-[1px] bg-gray-200" />
                    )}
                  </motion.div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  {tab.id !== "workbench" && (
                    <ContextMenuItem onClick={() => closeTab(tab.id)}>关闭标签页</ContextMenuItem>
                  )}
                  {tabs.length > 1 && (
                    <>
                      <ContextMenuItem onClick={closeOtherTabs}>关闭其他标签页</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem onClick={closeAllTabs} className="text-red-500">
                        关闭全部标签页
                      </ContextMenuItem>
                    </>
                  )}
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        </div>

        {/* 标签页操作按钮 - 固定在右侧 */}
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full ml-1 mr-2">
                <ListFilter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              {/* 已打开的标签列表 */}
              <DropdownMenuLabel>已打开标签</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.id}
                  className={cn("cursor-pointer flex items-center justify-between", activeTab === tab.id && "bg-muted")}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <div className="flex items-center gap-2">
                    {tab.icon}
                    <span>{tab.title}</span>
                  </div>
                  {activeTab === tab.id && <Check className="h-4 w-4 text-primary" />}
                  {tab.id !== "workbench" && (
                    <X
                      className="h-4 w-4 text-muted-foreground hover:text-foreground ml-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeTab(tab.id)
                      }}
                    />
                  )}
                </DropdownMenuItem>
              ))}

              {/* 可添加的新标签 */}
              {getUnopenedTabs().length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>添加新标签</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {getUnopenedTabs().map((tab) => (
                    <DropdownMenuItem key={tab.id} className="cursor-pointer" onClick={() => openTab(tab)}>
                      <div className="flex items-center gap-2">
                        {tab.icon}
                        <span>{tab.title}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </>
              )}

              {/* 标签操作 */}
              {tabs.length > 1 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>标签操作</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {activeTab !== "workbench" && (
                    <DropdownMenuItem className="cursor-pointer" onClick={closeCurrentTab}>
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        <span>关闭当前标签页</span>
                      </div>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer" onClick={closeOtherTabs}>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      <span>关闭其他标签页</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={closeAllTabs}>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      <span>关闭全部标签页</span>
                    </div>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

