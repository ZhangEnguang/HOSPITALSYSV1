"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, BarChart3, Heart, Users, FileText, Award, Search, Settings, ChevronDown, UserCog, Shield, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import MedicalResearchDashboard from "@/components/medical-research-dashboard"
import SearchDialog from "@/components/search/search-dialog"
import SettingsDialog from './components/settings-dialog'
import { AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/stores/auth-store"

export default function DataDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeModule, setActiveModule] = useState("overview")
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  
  // 获取用户信息和认证状态
  const { user, logout, isAuthenticated } = useAuthStore()

  // 模块配置
  const modules = [
    { id: "overview", name: "数据总览", shortName: "总览", fullName: "数据总览", icon: BarChart3 },
    { id: "projects", name: "科研项目", shortName: "科研", fullName: "科研项目", icon: FileText },
    { id: "funding", name: "经费管理", shortName: "经费", fullName: "经费管理", icon: Award },
    { id: "ethics", name: "伦理审查", shortName: "伦理", fullName: "伦理审查", icon: Heart }
  ]

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K 打开搜索对话框
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        openSearchDialog()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleBackToDashboard = () => {
    router.push('/workbench')
  }

  const handleModuleChange = (moduleId: string) => {
    setActiveModule(moduleId)
  }

  const openSearchDialog = () => {
    setSearchDialogOpen(true)
  }

  // 处理退出登录
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error("退出登录失败", error)
      router.push('/login')
    }
  }

  // 获取当前角色名称
  const getCurrentRoleName = () => {
    if (!user) {
      return "未设置角色";
    }
    
    if (user.currentRole) {
      if (user.currentRole.roleName) {
        return user.currentRole.roleName;
      } else if (user.currentRole.name) {
        return user.currentRole.name;
      }
    }
    
    if (user.roles && user.roles.length > 0) {
      const firstRole = user.roles[0];
      if (firstRole) {
        if (firstRole.roleName) {
          return firstRole.roleName;
        } else if (firstRole.name) {
          return firstRole.name;
        }
      }
    }
    
    return "未设置角色";
  }
  
  // 获取用户头像
  const getUserAvatar = () => {
    if (!user) {
      return "/default-avatar.png";
    }
    return user.avatar || "/avatar.jpeg";
  }
  
  // 获取用户名
  const getUserName = () => {
    if (!user) {
      return "未登录";
    }
    
    if (!user.name) {
      return user.username || "用户";
    }
    
    return user.name;
  }
  
  // 获取头像占位符
  const getAvatarFallback = () => {
    if (!user) {
      return "用户";
    }
    
    if (!user.name) {
      return "用户";
    }
    
    return user.name.charAt(0);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">

        
        {/* 加载内容 */}
        <div className="relative z-10 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">正在加载数据看板...</p>
        </div>
      </div>
    )
  }

  // 根据模块设置背景
  const getBackgroundStyle = () => {
    if (activeModule === "overview") {
      return {
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }
    }
    return {}
  }

  const getBackgroundClass = () => {
    if (activeModule === "overview") {
      return "min-h-screen relative"
    }
    return "min-h-screen relative bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100"
  }

  return (
    <div className={getBackgroundClass()} style={getBackgroundStyle()}>
      {/* 为数据总览模块添加渐变遮罩 */}
      {activeModule === "overview" && (
        <div className="absolute inset-0 z-0">
          {/* 渐变遮罩：从透明（上半部分显示图片）到白色（下半部分遮住图片） */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% via-white/50 via-60% to-white/95 to-100%"></div>
        </div>
      )}
      
      {/* 内容容器 */}
      <div className="relative z-10">
              {/* 顶部标题栏 */}
        <div className="bg-white/50 backdrop-blur-md border-b border-white/20">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 左侧：返回按钮和标题 */}
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 p-2"
                      onClick={handleBackToDashboard}
                    >
                      <ArrowLeft className="h-5 w-5 font-bold stroke-2" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>返回仪表盘</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-[1.1rem] font-bold truncate hidden md:block app-title">医院科研数据看板</span>
              </div>
            </div>

            {/* 中间：搜索框 */}
            <div className="flex-1 flex justify-center">
              <div className="relative hidden md:block">
                <Button
                  variant="outline"
                  className="w-[180px] justify-between pl-3 pr-2 py-2 rounded-lg border border-gray-200/60 bg-white/60 text-gray-500 text-sm font-normal hover:bg-white/80 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                  onClick={openSearchDialog}
                >
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-500">搜索</span>
                  </div>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-gray-200 bg-gray-100/60 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                    <span className="text-xs">Ctrl</span>
                    <span>+</span>
                    <span>K</span>
                  </kbd>
                </Button>
              </div>
            </div>

            {/* 右侧：模块导航按钮 */}
            <div className="flex items-center gap-3">

              {/* 模块导航按钮 */}
              <div className="flex gap-2">
                {modules.map((module) => (
                  <Button
                    key={module.id}
                    variant={activeModule === module.id ? "default" : "ghost"}
                    className="group flex items-center gap-2 transition-all duration-300 px-3 py-2 h-9"
                    onClick={() => setActiveModule(module.id)}
                  >
                    <module.icon className="h-4 w-4" />
                    <span className="group-hover:hidden">{module.shortName}</span>
                    <span className="hidden group-hover:inline">{module.fullName}</span>
                  </Button>
                ))}
              </div>

              {/* 设置按钮 */}
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-3 py-2 h-9"
                onClick={() => setSettingsDialogOpen(true)}
              >
                <Settings className="h-4 w-4" />
                <span>设置</span>
              </Button>

              {/* 个人中心 */}
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getUserAvatar()} alt="用户头像" />
                        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium">{getUserName()}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <span className="truncate max-w-[100px]">{getCurrentRoleName()}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "ml-1 h-2 w-2 p-0 rounded-full",
                              (user?.currentRole?.roleName || user?.roles?.[0]?.roleName || "").includes("管理员")
                                ? "bg-green-500"
                                : "bg-blue-500"
                            )}
                          />
                          {user?.roles && user.roles.length > 1 && (
                            <span className="text-xs ml-1 text-gray-400">
                              +{user.roles.length - 1}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[260px] p-0 rounded-xl">
                    {/* 用户信息头部 */}
                    <div className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={getUserAvatar()} alt="用户头像" />
                        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-base font-medium">{getUserName()}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-0.5">
                          当前角色: <span className="font-medium ml-1">{getCurrentRoleName()}</span>
                        </div>
                      </div>
                    </div>

                    {/* 快捷操作区 */}
                    <div className="py-4 px-3 grid grid-cols-3 gap-2 border-t border-b">
                      <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover:bg-primary/10 group-hover:scale-105">
                          <UserCog className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-xs group-hover:text-primary transition-colors">切换角色</span>
                      </div>

                      <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover:bg-primary/10 group-hover:scale-105">
                          <Shield className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-xs group-hover:text-primary transition-colors">账号授权</span>
                      </div>

                      <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover:bg-primary/10 group-hover:scale-105">
                          <User className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-xs group-hover:text-primary transition-colors">个人资料</span>
                      </div>
                    </div>

                    {/* 退出登录 */}
                    <div className="py-3 flex justify-center">
                      <div 
                        className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 cursor-pointer transition-colors group"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 group-hover:text-red-500 transition-colors" />
                        <span className="text-sm">退出登录</span>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="w-full px-4 py-6">
        <MedicalResearchDashboard activeModule={activeModule} />
      </div>

      {/* 搜索对话框 */}
      <AnimatePresence>
        {searchDialogOpen && (
          <SearchDialog 
            open={searchDialogOpen} 
            onOpenChange={setSearchDialogOpen}
          />
        )}
      </AnimatePresence>

      {/* 设置对话框 */}
      <AnimatePresence>
        {settingsDialogOpen && (
          <SettingsDialog 
            open={settingsDialogOpen} 
            onOpenChange={setSettingsDialogOpen}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  )
} 