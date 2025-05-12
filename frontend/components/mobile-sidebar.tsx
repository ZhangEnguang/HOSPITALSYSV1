"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  Calendar,
  CheckSquare,
  ClipboardList,
  FileText,
  FolderOpen,
  LineChart,
  Medal,
  Users,
  Wallet,
  LayoutDashboard,
  ClipboardCheck,
  Microscope,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type MenuItem = {
  name: string
  icon: React.ReactNode
  path: string
  active?: boolean
}

export default function MobileSidebar() {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState("")
  const [showEthicSubMenu, setShowEthicSubMenu] = useState(false)

  const menuItems: MenuItem[] = [
    { name: "仪表盘", icon: <LayoutDashboard className="h-5 w-5" />, path: "/workbench" },
    { name: "待办事项", icon: <CheckSquare className="h-5 w-5" />, path: "/todos" },
    { name: "申报管理", icon: <ClipboardList className="h-5 w-5" />, path: "/applications" },
    { name: "项目管理", icon: <FolderOpen className="h-5 w-5" />, path: "/projects" },
    { name: "伦理项目", icon: <Microscope className="h-5 w-5" />, path: "/ethic-projects" },
    { name: "伦理审查", icon: <ClipboardCheck className="h-5 w-5" />, path: "#" },
    { name: "进度管理", icon: <LineChart className="h-5 w-5" />, path: "/progress" },
    { name: "日历", icon: <Calendar className="h-5 w-5" />, path: "/calendar" },
    { name: "经费管理", icon: <Wallet className="h-5 w-5" />, path: "/funds" },
    { name: "成果管理", icon: <FileText className="h-5 w-5" />, path: "/achievements" },
    { name: "考核奖励", icon: <Medal className="h-5 w-5" />, path: "/rewards" },
    { name: "成员管理", icon: <Users className="h-5 w-5" />, path: "/members" },
    { name: "文档共享", icon: <FileText className="h-5 w-5" />, path: "/documents" },
  ]

  // 根据当前路径设置活动菜单项
  useEffect(() => {
    const safePathname = pathname || "/"; // 处理pathname可能为null的情况
    const currentPath = safePathname === "/" ? "/" : `/${safePathname.split("/")[1]}`
    const currentMenuItem = menuItems.find((item) => item.path === currentPath)
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.name)
    }
  }, [pathname, menuItems])

  const handleItemClick = (name: string) => {
    setActiveItem(name)
    
    // 对于伦理审查特殊处理，切换子菜单显示状态
    if (name === "伦理审查") {
      setShowEthicSubMenu(!showEthicSubMenu)
    }
  }

  return (
    <div className="bg-white h-full pt-4">
      <div className="flex items-center justify-center mb-6">
        <div className="w-8 h-8 rounded-md bg-[#2156FF] flex items-center justify-center text-white font-bold">R</div>
        <span className="text-[1.3rem] font-bold ml-2">科研创新服务平台</span>
      </div>

      <div className="px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.name === "伦理审查" ? (
                <>
                  <div
                    className={cn(
                      "flex items-center p-2 rounded-md group transition-all text-[14px]",
                      activeItem === item.name
                        ? "bg-[#2156FF] text-white"
                        : "text-gray-700 hover:bg-[#2156FF]/10 hover:text-[#2156FF]",
                    )}
                    onClick={() => handleItemClick(item.name)}
                  >
                    <div
                      className={cn(
                        "transition-all",
                        activeItem === item.name ? "text-white" : "text-gray-600 group-hover:text-[#2156FF]",
                      )}
                    >
                      {item.icon}
                    </div>
                    <span className="ml-3 transition-all">{item.name}</span>
                  </div>
                  {showEthicSubMenu && (
                    <div className="ml-8 mt-1">
                      <Link
                        href="/ethic-review/initial-review"
                        className="flex items-center p-2 rounded-md text-[13px] text-gray-600 hover:bg-[#2156FF]/10 hover:text-[#2156FF]"
                      >
                        <span>初始审查</span>
                      </Link>
                      <Link
                        href="/ethic-review/track-review"
                        className="flex items-center p-2 rounded-md text-[13px] text-gray-600 hover:bg-[#2156FF]/10 hover:text-[#2156FF]"
                      >
                        <span>跟踪报告</span>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center p-2 rounded-md group transition-all text-[14px]",
                    activeItem === item.name
                      ? "bg-[#2156FF] text-white"
                      : "text-gray-700 hover:bg-[#2156FF]/10 hover:text-[#2156FF]",
                  )}
                  onClick={() => handleItemClick(item.name)}
                >
                  <div
                    className={cn(
                      "transition-all",
                      activeItem === item.name ? "text-white" : "text-gray-600 group-hover:text-[#2156FF]",
                    )}
                  >
                    {item.icon}
                  </div>
                  <span className="ml-3 transition-all">{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

