"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import {
  Calendar,
  CheckSquare,
  ClipboardList,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LineChart,
  Medal,
  Users,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Cog,
  Layers,
  ChevronDown,
  BarChart2,
  Microscope,
  ClipboardCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { tabEventBus } from "./tabs-navigation"

interface MenuItem {
  name: string
  icon: React.ReactNode
  path: string
  subMenus?: SubMenuItem[] // 添加子菜单选项
}

// 添加子菜单接口
interface SubMenuItem {
  name: string
  path: string
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("")
  const [activeSubItem, setActiveSubItem] = useState("") // 添加当前激活的子菜单状态
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null) // 添加展开菜单状态
  const [layoutType, setLayoutType] = useState<string>("vertical") // 默认垂直布局
  const [showSidebar, setShowSidebar] = useState(true)

  // 辅助函数：获取主题色
  const getThemeColor = () => {
    // 检查是否在客户端环境
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue("--primary-color").trim() || "#2156FF"
    }
    return "#2156FF" // 在服务端环境返回默认主题色
  }

  useEffect(() => {
    const savedLayoutType = localStorage.getItem("layoutType") || "vertical"
    const savedShowSidebar = localStorage.getItem("showSidebar") !== "false"
    const savedCollapsed = localStorage.getItem("sidebarCollapsed") === "true"

    setLayoutType(savedLayoutType)
    setShowSidebar(savedShowSidebar)
    setCollapsed(savedCollapsed)

    // 如果是紧凑布局，自动折叠侧边栏
    if (savedLayoutType === "compact") {
      setCollapsed(true)
    }

    // 监听来自Header的侧边栏折叠状态变化
    const handleSidebarStateChange = (event: CustomEvent) => {
      setCollapsed(event.detail.collapsed)
    }

    // 监听主题色变化
    const handleThemeColorChange = (event: any) => {
      const { color } = event.detail
      if (color) {
        updateActiveItemColors(color)
      }
    }

    // 监听菜单布局变化
    const handleLayoutChange = (event: CustomEvent) => {
      const { layout } = event.detail
      if (layout) {
        setLayoutType(layout)
        localStorage.setItem("layoutType", layout)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener("sidebarStateChange", handleSidebarStateChange as EventListener)
      window.addEventListener("themeColorChange", handleThemeColorChange as EventListener)
      window.addEventListener("layoutChange", handleLayoutChange as EventListener)

      // 初始应用当前主题色
      const currentThemeColor = getThemeColor()
      updateActiveItemColors(currentThemeColor)

      return () => {
        window.removeEventListener("sidebarStateChange", handleSidebarStateChange as EventListener)
        window.removeEventListener("themeColorChange", handleThemeColorChange as EventListener)
        window.removeEventListener("layoutChange", handleLayoutChange as EventListener)
      }
    }
  }, [])

  // 根据当前路径设置活动菜单项
  useEffect(() => {
    if (typeof window === 'undefined') return; // 在服务端环境跳过此效果
    
    // 安全处理pathname可能为null的情况
    const safePathname = pathname || "/";
    
    // 获取当前路径的第一段作为活动菜单项的路径
    const currentPath = safePathname === "/" ? "/" : `/${safePathname.split("/")[1]}`
    
    // 修复根路径到工作台的映射
    const pathToCheck = currentPath === "/" ? "/workbench" : currentPath;
    
    // 获取URL查询参数
    const urlSearchParams = new URLSearchParams(window.location.search);
    const tabParam = urlSearchParams.get('tab');
    
    // 检查主菜单项
    const currentMenuItem = menuItems.find((item) => item.path === pathToCheck)
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.name)
      
      // 如果有子菜单，检查子菜单项
      if (currentMenuItem.subMenus && currentMenuItem.subMenus.length > 0) {
        setExpandedMenu(currentMenuItem.name) // 自动展开包含当前路径的菜单
        
        // 如果存在tab查询参数，查找匹配的子菜单
        if (tabParam) {
          const activeSubMenu = currentMenuItem.subMenus.find(subItem => 
            subItem.path.includes(tabParam)
          );
          
          if (activeSubMenu) {
            setActiveSubItem(activeSubMenu.name);
          } else {
            setActiveSubItem(""); // 重置子菜单激活状态
          }
        } else {
          // 否则检查路径前缀匹配
          const activeSubMenu = currentMenuItem.subMenus.find(subItem => 
            safePathname.startsWith(subItem.path)
          );
          
          if (activeSubMenu) {
            setActiveSubItem(activeSubMenu.name);
          } else {
            setActiveSubItem(""); // 重置子菜单激活状态
          }
        }
      } else {
        setExpandedMenu(null); // 如果没有子菜单，收起所有展开的菜单
        setActiveSubItem(""); // 重置子菜单激活状态
      }
    }

    // 当路径变化时，确保应用当前主题色
    const currentThemeColor = getThemeColor()
    updateActiveItemColors(currentThemeColor)
  }, [pathname])

  const menuItems: MenuItem[] = [
    { 
      name: "仪表盘", 
      icon: <BarChart2 className="h-5 w-5" />, 
      path: "/workbench",
      subMenus: [
        { name: "工作台", path: "/workbench?tab=overview" },
        { name: "项目分析", path: "/workbench?tab=project-analysis" },
        { name: "经费统计", path: "/workbench?tab=budget-statistics" },
        { name: "成果统计", path: "/workbench?tab=achievement-statistics" },
      ]
    },
    { name: "待办事项", icon: <CheckSquare className="h-5 w-5" />, path: "/todos" },
    { 
      name: "申报管理", 
      icon: <ClipboardList className="h-5 w-5" />, 
      path: "/applications",
      subMenus: [
        { name: "申报批次", path: "/applications?tab=application" },
        { name: "评审批次", path: "/applications?tab=review" },
      ]
    },
    { 
      name: "项目管理", 
      icon: <FolderOpen className="h-5 w-5" />, 
      path: "/projects",
      subMenus: [
        { name: "纵向项目", path: "/projects?tab=vertical" },
        { name: "横向项目", path: "/projects?tab=horizontal" },
        { name: "校级项目", path: "/projects?tab=schoolLevel" },
        { name: "出账合同", path: "/projects?tab=disbursement" },
      ]
    },
    { 
      name: "伦理项目", 
      icon: <Microscope className="h-5 w-5" />, 
      path: "/ethic-projects",
      subMenus: [
        { name: "动物伦理", path: "/ethic-projects?tab=animal" },
        { name: "人体伦理", path: "/ethic-projects?tab=human" },
      ]
    },
    { 
      name: "伦理审查", 
      icon: <ClipboardCheck className="h-5 w-5" />, 
      path: "#",
      subMenus: [
        { name: "初始审查", path: "/ethic-review/initial-review" },
        { name: "跟踪审查", path: "/ethic-review/track-review" },
        { name: "人遗审查", path: "/ethic-review/human-genetics-review" },
      ]
    },
    { 
      name: "进度管理", 
      icon: <LineChart className="h-5 w-5" />, 
      path: "/progress",
      subMenus: [
        { name: "项目变更", path: "/progress?tab=projectChange" },
        { name: "合同认定", path: "/progress?tab=contractRecognition" },
        { name: "项目中检", path: "/progress?tab=projectInspection" },
        { name: "项目结项", path: "/progress?tab=projectCompletion" },
      ]
    },
    { name: "日历", icon: <Calendar className="h-5 w-5" />, path: "/calendar" },
    { 
      name: "经费管理", 
      icon: <Wallet className="h-5 w-5" />, 
      path: "/funds",
      subMenus: [
        { name: "经费入账", path: "/funds?tab=income" },
        { name: "经费外拨", path: "/funds?tab=outbound" },
        { name: "经费报销", path: "/funds?tab=reimbursement" },
        { name: "经费结转", path: "/funds?tab=carryover" },
      ]
    },
    { 
      name: "成果管理", 
      icon: <FileText className="h-5 w-5" />, 
      path: "/achievements",
      subMenus: [
        { name: "学术论文", path: "/achievements?tab=academic-papers" },
        { name: "学术著作", path: "/achievements?tab=academic-works" },
        { name: "鉴定成果", path: "/achievements?tab=evaluated-achievements" },
        { name: "成果获奖", path: "/achievements?tab=achievement-awards" },
        { name: "专利", path: "/achievements?tab=patents" },
      ]
    },
    { 
      name: "考核奖励", 
      icon: <Medal className="h-5 w-5" />, 
      path: "/rewards",
      subMenus: [
        { name: "成员考核", path: "/rewards?tab=evaluation-members" },
        { name: "部门考核", path: "/rewards?tab=evaluation-statistics" },
        { name: "考核标准", path: "/rewards?tab=scoring-report" },
      ]
    },
    { 
      name: "成员管理", 
      icon: <Users className="h-5 w-5" />, 
      path: "/members",
      subMenus: [
        { name: "科研人员", path: "/members?tab=personnel" },
        { name: "专家库", path: "/members?tab=experts" },
        { name: "科研团队", path: "/members?tab=teams" },
        { name: "组织结构", path: "/members?tab=organization" },
      ]
    },
    { name: "文档共享", icon: <FileText className="h-5 w-5" />, path: "/documents" },
    { 
      name: "辅助管理", 
      icon: <Layers className="h-5 w-5" />, 
      path: "/auxiliary",
      subMenus: [
        { name: "项目分类", path: "/auxiliary?tab=projectCategory" },
        { name: "预算标准", path: "/auxiliary?tab=budgetStandard" },
        { name: "管理费提取方案", path: "/auxiliary?tab=managementFeeScheme" },
        { name: "评审方案", path: "/auxiliary?tab=reviewWorksheet" },
        { name: "刊物级别", path: "/auxiliary?tab=journalLevel" },
        { name: "用章类型", path: "/auxiliary?tab=sealType" },
      ]
    },
  ]

  const handleItemClick = (name: string, path: string) => {
    // 如果点击的是当前活动项，并且有子菜单，则切换展开/折叠状态
    if (activeItem === name && menuItems.find(item => item.name === name)?.subMenus) {
      setExpandedMenu(expandedMenu === name ? null : name);
    } else if (name === "伦理审查") {
      // 对于伦理审查特殊处理，只切换展开/折叠状态，不进行导航
      setActiveItem(name);
      setExpandedMenu(expandedMenu === name ? null : name);
    } else {
      setActiveItem(name);
      router.push(path);
    }
  }

  // 处理子菜单点击
  const handleSubItemClick = (parentName: string, subName: string, path: string) => {
    setActiveItem(parentName);
    setActiveSubItem(subName);
    
    // 确保不丢失查询参数
    if (path.includes('?tab=')) {
      const tabParam = path.split('?tab=')[1];
      // 对于工作台特殊处理，确保使用正确的URL格式
      if (path.startsWith('/workbench')) {
        // 新增页签
        const tabId = `workbench-${tabParam}`;
        const tabInfo = {
          id: tabId,
          title: subName,
          icon: <LayoutDashboard className="h-4 w-4" />,
          path: `/workbench?tab=${tabParam}`
        };
        // 使用tabEventBus打开新页签
        if (tabEventBus.openTab) {
          tabEventBus.openTab(tabInfo);
        }
      } else {
        // 新增页签
        const tabId = `${parentName}-${tabParam}`;
        const tabInfo = {
          id: tabId,
          title: subName,
          icon: menuItems.find(item => item.name === parentName)?.icon,
          path: path
        };
        // 使用tabEventBus打开新页签
        if (tabEventBus.openTab) {
          tabEventBus.openTab(tabInfo);
        }
      }
    } else {
      router.push(path);
    }
  }

  // 辅助函数：更新活动项目的颜色
  const updateActiveItemColors = (color: string) => {
    // 在服务端环境跳过此效果
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    // 获取所有菜单项
    const menuLinks = document.querySelectorAll(".sidebar-container a")

    menuLinks.forEach((link) => {
      if (link instanceof HTMLElement) {
        const isActive = link.classList.contains("active") || (activeItem && link.textContent?.includes(activeItem))

        // 重置所有样式，确保文本可见
        link.style.backgroundColor = ""
        link.style.color = ""

        // 为活动项应用主题色
        if (isActive) {
          link.style.backgroundColor = color
          link.style.color = "white"

          // 确保图标也是白色
          const icon = link.querySelector(".h-5.w-5")
          if (icon instanceof HTMLElement) {
            icon.style.color = "white"
          }
        } else {
          // 非活动项恢复默认样式
          link.style.color = ""
          const icon = link.querySelector(".h-5.w-5")
          if (icon instanceof HTMLElement) {
            icon.style.color = ""
          }

          // 确保文本标签可见
          const textSpan = link.querySelector("span")
          if (textSpan instanceof HTMLElement) {
            textSpan.style.color = ""
            textSpan.style.display = ""
            textSpan.style.visibility = "visible"
          }
        }
      }
    })
  }

  // 渲染垂直菜单布局
  const renderVerticalLayout = () => {
    return (
      <div className="flex flex-col space-y-2">
        {menuItems.map((item, index) => {
          const isActive = activeItem === item.name || 
                    (pathname === '/' && item.path === '/workbench');
          const hasSubMenus = item.subMenus && item.subMenus.length > 0;
          const isExpanded = expandedMenu === item.name;
          const primaryColor = getThemeColor();
    
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="w-full"
            >
              <div 
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md cursor-pointer group transition-all text-[14px]",
                  isActive && !hasSubMenus ? "active" : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                )}
                onClick={() => handleItemClick(item.name, item.path)}
                style={
                  isActive && !hasSubMenus
                    ? {
                        backgroundColor: primaryColor,
                        color: "white",
                      }
                    : {}
                }
              >
                <div 
                  className={cn(
                    "transition-all",
                    isActive && !hasSubMenus ? "text-white" : "text-gray-600 group-hover:text-primary"
                  )}
                  style={isActive && !hasSubMenus ? { color: "white" } : {}}
                >
                  {item.icon}
                </div>
                
                {!collapsed && (
                  <>
                    <span className="ml-3 truncate flex-grow">{item.name}</span>
                    {hasSubMenus && (
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 transition-transform", 
                          isExpanded ? "rotate-180" : ""
                        )} 
                      />
                    )}
                  </>
                )}
              </div>

              {/* 渲染子菜单 */}
              {!collapsed && hasSubMenus && isExpanded && (
                <div className="ml-7 mt-2 space-y-1.5">
                  {item.subMenus?.map((subItem) => {
                    const isSubActive = activeSubItem === subItem.name;
                    
                    return (
                      <div
                        key={subItem.name}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md cursor-pointer text-[14px] transition-all",
                          isSubActive 
                            ? "text-white" 
                            : "text-gray-600 hover:bg-primary/10 hover:text-primary"
                        )}
                        onClick={() => handleSubItemClick(item.name, subItem.name, subItem.path)}
                        style={
                          isSubActive
                            ? {
                                backgroundColor: primaryColor,
                                color: "white",
                              }
                            : {}
                        }
                      >
                        <span className="truncate">{subItem.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // 渲染双列菜单布局
  const renderDoubleColumnLayout = () => {
    // 将菜单名称映射为两个字的简称
    const getShortName = (name: string): string => {
      switch(name) {
        case "工作台": return "工台";
        case "待办事项": return "待办";
        case "申报管理": return "申报";
        case "项目管理": return "项目";
        case "进度管理": return "进度";
        case "日历": return "日历";
        case "经费管理": return "经费";
        case "成果管理": return "成果";
        case "考核奖励": return "考核";
        case "成员管理": return "成员";
        case "文档共享": return "文档";
        case "辅助管理": return "辅助";
        default: return name.substring(0, 2); // 默认取前两个字
      }
    };
    
    return (
      <div className="flex">
        {/* 左侧一级菜单列 */}
        <div className="w-[60px] border-r border-gray-100 pr-1">
          {menuItems.map((item, index) => {
            const isActive = activeItem === item.name;
            const primaryColor = getThemeColor();
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="mb-1"
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center py-3 px-1 rounded-md cursor-pointer",
                    isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100",
                    "transition-all duration-200"
                  )}
                  onClick={() => handleItemClick(item.name, item.path)}
                >
                  <div className={cn(
                    "mb-1", 
                    isActive ? "text-primary" : "text-gray-600"
                  )}>
                    {item.icon}
                  </div>
                  <span className="text-xs text-center">{getShortName(item.name)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* 右侧二级菜单列 */}
        <div className="flex-1 pl-2">
          {menuItems.find(item => item.name === activeItem)?.subMenus && (
            <div className="py-2">
              <h3 className="text-xs text-gray-500 mb-2 pl-2">{activeItem}</h3>
              <div className="space-y-1">
                {menuItems.find(item => item.name === activeItem)?.subMenus?.map((subItem) => {
                  const isSubActive = activeSubItem === subItem.name;
                  const primaryColor = getThemeColor();
                  
                  return (
                    <div
                      key={subItem.name}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md cursor-pointer text-[13px] transition-all",
                        isSubActive 
                          ? "bg-primary text-white" 
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                      onClick={() => handleSubItemClick(activeItem, subItem.name, subItem.path)}
                      style={isSubActive ? { backgroundColor: primaryColor } : {}}
                    >
                      <span className="truncate">{subItem.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 如果侧边栏设置为隐藏，则不渲染
  if (!showSidebar) {
    return null
  }

  // 如果布局类型为水平，则不渲染侧边栏
  if (layoutType === "horizontal") {
    return null
  }

  return (
    <motion.aside
      className={cn(
        "bg-white shadow-sm z-40 pt-0 flex flex-col sidebar-container border-r border-gray-200",
        "h-[calc(100vh-4rem)] flex flex-col", // 减去顶部导航栏的高度，添加 flex flex-col
        collapsed ? "w-[60px]" : "w-[220px]",
        layoutType === "double" && !collapsed && "w-[280px]",
        layoutType === "compact" && "w-[60px]",
      )}
      initial={false}
      animate={{
        width: collapsed ? 60 : layoutType === "double" ? 280 : layoutType === "compact" ? 60 : 220,
      }}
      transition={{
        duration: 0.15,
        ease: [0.2, 0, 0, 1],
        staggerChildren: 0.03,
      }}
    >
      <div className={cn("flex-1 overflow-y-auto py-2 scrollbar-none", collapsed ? "px-1" : "px-3", "pt-2")}>
        {collapsed ? (
          // 折叠状态下只显示图标
          <div className="flex flex-col space-y-2 items-center">
            {menuItems.map((item, index) => {
              const isActive = activeItem === item.name;
              const primaryColor = getThemeColor();

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="w-full flex justify-center"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-md cursor-pointer text-[14px]",
                      isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                    )}
                    onClick={() => handleItemClick(item.name, item.path)}
                    style={isActive ? { backgroundColor: primaryColor } : {}}
                  >
                    <div className={isActive ? "text-white" : "text-gray-600"}>
                      {item.icon}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // 根据布局类型选择不同的布局
          layoutType === "double" ? renderDoubleColumnLayout() : renderVerticalLayout()
        )}
      </div>
      
      {/* 底部工具栏 - 折叠按钮和布局切换 */}
      <div className={cn("border-t border-gray-200 py-2", collapsed ? "px-2" : "px-4")}>
        <div className="flex items-center justify-center">
          <button
            className="flex items-center justify-center text-gray-500 hover:text-primary transition-colors py-1.5 w-full"
            onClick={() => {
              const newCollapsed = !collapsed;
              setCollapsed(newCollapsed);
              if (typeof window !== 'undefined') {
                localStorage.setItem("sidebarCollapsed", String(newCollapsed));
              }
            }}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
