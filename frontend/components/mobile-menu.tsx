"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
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
  X,
  ClipboardCheck,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type MenuItem = {
  name: string
  icon: React.ReactNode
  path: string
  active?: boolean
}

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [activeItem, setActiveItem] = useState("")
  const menuRef = useRef<HTMLDivElement>(null)

  const menuItems: MenuItem[] = [
    { name: "仪表盘", icon: <LayoutDashboard className="h-5 w-5" />, path: "/workbench" },
    { name: "待办事项", icon: <CheckSquare className="h-5 w-5" />, path: "/todos" },
    { name: "申报管理", icon: <ClipboardList className="h-5 w-5" />, path: "/applications" },
    { name: "项目管理", icon: <FolderOpen className="h-5 w-5" />, path: "/projects" },
    { name: "初始审查", icon: <ClipboardCheck className="h-5 w-5" />, path: "/initial-review" },
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
    const safePathname = pathname || "/"; // Handle potential null value
    const currentPath = safePathname === "/" ? "/" : `/${safePathname.split("/")[1]}`;
    const currentMenuItem = menuItems.find((item) => item.path === currentPath);
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.name);
    }
  }, [pathname, menuItems]);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onOpenChange])

  const handleItemClick = (name: string) => {
    setActiveItem(name)
    onOpenChange(false)
  }

  // 当菜单打开时禁止背景滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  return (
    <div
      className={cn(
        "fixed top-16 left-0 right-0 bg-white shadow-md z-20 mobile-dropdown md:hidden",
        open ? "open" : "",
      )}
      ref={menuRef}
    >
      <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-custom bg-[#2156FF] flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="text-[1.3rem] font-bold ml-2">科研创新服务平台</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center p-3 rounded-custom group transition-all text-[15px]",
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

