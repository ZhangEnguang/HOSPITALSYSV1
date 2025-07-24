"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, BarChart3, Heart, Users, FileText, Award, Search, Settings, ChevronDown, UserCog, Shield, User, LogOut, Clock, ChevronUp, Calendar, CalendarDays, CalendarRange, GraduationCap, BookOpen, School, Edit3 } from "lucide-react"
import { cn } from "@/lib/utils"
import MedicalResearchDashboard from "@/components/medical-research-dashboard"
import SearchDialog from "@/components/search/search-dialog"
import SettingsDialog from './components/settings-dialog'
import TimeRangeDialog from './components/time-range-dialog'
import { AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/stores/auth-store"

export default function DataDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeModule, setActiveModule] = useState("overview")
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [timeRangeDialogOpen, setTimeRangeDialogOpen] = useState(false)
  const [timeRangeDropdownOpen, setTimeRangeDropdownOpen] = useState(false)
  
  // 时间范围状态管理
  const [currentTimeRange, setCurrentTimeRange] = useState({
    range: 'year',
    startDate: '',
    endDate: ''
  })
  
  // 获取用户信息和认证状态
  const { user, logout, isAuthenticated } = useAuthStore()

  // 模块配置
  const modules = [
    { id: "overview", name: "数据总览", shortName: "总览", fullName: "总览", icon: BarChart3 },
    { id: "funding", name: "成果转化", shortName: "成果转化", fullName: "成果转化", icon: Award },
    { id: "ethics", name: "伦理审查", shortName: "伦理", fullName: "伦理", icon: Heart }
  ]

  // 时间范围选项
  const timeRangeOptions = [
    { value: 'week', label: '近一周', icon: CalendarDays },
    { value: 'month', label: '近一个月', icon: Calendar },
    { value: 'quarter', label: '近三个月', icon: CalendarRange },
    { value: 'semester', label: '本学期', icon: School },
    { value: 'year', label: '本学年', icon: GraduationCap },
    { value: 'academic_year', label: '本学术年度', icon: BookOpen },
    { value: 'custom', label: '自定义范围', icon: Edit3 },
  ]

  // 格式化时间范围显示
  const formatTimeRangeDisplay = () => {
    const { range, startDate, endDate } = currentTimeRange
    
    switch (range) {
      case 'week':
        return '近一周'
      case 'month':
        return '近一个月'
      case 'quarter':
        return '近三个月'
      case 'semester':
        return '本学期'
      case 'year':
        return '本学年'
      case 'academic_year':
        return '本学术年度'
      case 'custom':
        if (startDate && endDate) {
          return `${startDate} 至 ${endDate}`
        }
        return '自定义范围'
      default:
        return '本学年'
    }
  }

  // 处理时间范围变化
  const handleTimeRangeChange = (range: string, startDate?: string, endDate?: string) => {
    setCurrentTimeRange({
      range,
      startDate: startDate || '',
      endDate: endDate || ''
    })
  }

  // 处理下拉菜单选择
  const handleTimeRangeSelect = (range: string) => {
    if (range === 'custom') {
      // 如果选择自定义范围，打开弹框
      setTimeRangeDialogOpen(true)
    } else {
      // 直接应用预设时间范围
      handleTimeRangeChange(range)
    }
    setTimeRangeDropdownOpen(false)
  }

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
        <div className="bg-transparent border-b border-white/20">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 左侧：返回按钮、logo、标题和五个按钮 */}
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
              
              {/* 分隔线 */}
              <div className="h-6 w-px bg-gray-300"></div>
              
              {/* 五个按钮 */}
              <div className="flex items-center gap-2">
                {/* 模块导航按钮 */}
                <div className="flex gap-2">
                  {modules.map((module) => (
                    <Button
                      key={module.id}
                      variant={activeModule === module.id ? "default" : "ghost"}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 h-9 transition-all duration-200",
                        activeModule === module.id 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "hover:bg-gray-100/80 hover:text-gray-900"
                      )}
                      onClick={() => setActiveModule(module.id)}
                    >
                      <module.icon className="h-4 w-4" />
                      <span className="font-medium">{module.fullName}</span>
                    </Button>
                  ))}
                </div>

                {/* 设置按钮 */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-2 h-9 hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200"
                  onClick={() => setSettingsDialogOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">设置</span>
                </Button>
              </div>
            </div>

            {/* 右侧：时间范围显示和搜索框 */}
            <div className="flex items-center gap-3">
              {/* 时间范围下拉菜单 */}
              <DropdownMenu open={timeRangeDropdownOpen} onOpenChange={setTimeRangeDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 px-3 py-2 rounded-lg border border-gray-200/60 hover:bg-white/80 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium">{formatTimeRangeDisplay()}</span>
                    {timeRangeDropdownOpen ? (
                      <ChevronUp className="h-3 w-3 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {timeRangeOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleTimeRangeSelect(option.value)}
                        className={cn(
                          "cursor-pointer",
                          currentTimeRange.range === option.value && "bg-blue-50 text-blue-700"
                        )}
                      >
                        <IconComponent className="h-4 w-4 mr-2 text-blue-600" />
                        {option.label}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* 搜索框 */}
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

      {/* 时间范围选择对话框 */}
      <AnimatePresence>
        {timeRangeDialogOpen && (
          <TimeRangeDialog 
            open={timeRangeDialogOpen} 
            onOpenChange={setTimeRangeDialogOpen}
            onTimeRangeChange={handleTimeRangeChange}
            currentRange={currentTimeRange.range}
            currentStartDate={currentTimeRange.startDate}
            currentEndDate={currentTimeRange.endDate}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  )
} 