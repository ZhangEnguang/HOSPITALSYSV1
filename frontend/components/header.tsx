"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Search,
  Menu,
  Settings,
  UserCog,
  Shield,
  User,
  LogOut,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Monitor,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import RoleSwitcher from "./role-switcher"
import SettingsPanel from "./theme-settings"
import MobileMenu from "./mobile-menu"
import SearchDialog from "./search/search-dialog"
import NotificationCenter, { NotificationItem } from "./notification-center"
import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"
import HorizontalMenu from "./horizontal-menu"
import { useSettings } from "@/hooks/use-settings"

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "notification",
    icon: "globe",
    title: "系统功能更新：新增国际合作项目管理模块",
    time: "2024-6-13 0:10",
    read: false,
  },
  {
    id: "2",
    type: "todo",
    icon: "clock",
    title: "国家自然科学基金项目申报截止提醒",
    time: "2024-4-21 8:05",
    read: false,
  },
  {
    id: "3",
    type: "notification",
    icon: "alert",
    title: "项目经费使用进度提醒",
    time: "2024-3-17 21:12",
    read: true,
  },
  {
    id: "4",
    type: "notification",
    icon: "file",
    title: "科研项目管理系统使用手册已更新",
    time: "2024-2-14 6:20",
    read: true,
  },
  {
    id: "5",
    type: "todo",
    icon: "check",
    title: "横向项目结题报告待审核",
    time: "2024-1-20 0:15",
    read: false,
  },
  {
    id: "6",
    type: "notification",
    icon: "mail",
    title: "您有一个新的项目合作邀请",
    time: "2024-1-15 14:30",
    read: false,
  }
]

export default function Header() {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false)
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [glassEffect, setGlassEffect] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications)
  const [unreadCount, setUnreadCount] = useState(mockNotifications.filter(n => !n.read).length)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [forceUpdateState, forceUpdate] = useState({})
  const [layoutType, setLayoutType] = useState("vertical")
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  
  const router = useRouter()
  const { user, logout, switchRole, isAuthenticated, refreshUserInfo } = useAuthStore()
  const { settings } = useSettings()
  const { layoutType: authLayoutType, glassEffect: authGlassEffect } = settings

  // 确保主题切换在客户端渲染
  useEffect(() => {
    setMounted(true)
    const savedGlassEffect = localStorage.getItem("glassEffect") !== "false"
    setGlassEffect(savedGlassEffect)

    // 获取侧边栏折叠状态
    const savedSidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true"
    setSidebarCollapsed(savedSidebarCollapsed)

    // Force apply glass effect on mount
    const header = document.querySelector("header")
    if (header && savedGlassEffect) {
      header.classList.add("glass-enabled")
    }

    // 监听全屏状态变化
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    // 添加键盘快捷键监听
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否按下了Ctrl+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setSearchDialogOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    
    // 如果已登录，刷新用户信息
    if (isAuthenticated) {
      
      // 调试信息
      console.log('Header组件挂载，当前认证状态：', isAuthenticated);
      console.log('当前用户信息：', user);
      
      // 不捕获错误，refreshUserInfo已修改为不再抛出错误
      refreshUserInfo()
        .then((updatedUser) => {
          console.log('刷新后的用户信息：', updatedUser);
          
          // 检查用户角色信息是否完整
          if (updatedUser && (!updatedUser.currentRole || !updatedUser.currentRole.roleName)) {
            console.log('检测到角色信息不完整，尝试再次刷新');
            
            // 强制更新状态，触发重新渲染
            forceUpdate({});
            
            // 延迟再次尝试刷新用户信息
            setTimeout(() => {
              refreshUserInfo()
                .then(user => {
                  console.log('第二次刷新用户信息:', user);
                  forceUpdate({}); // 再次强制更新UI
                })
                .catch(err => console.error('第二次刷新用户信息失败:', err));
            }, 800);
          }
        })
        .catch((error) => {
          // 应该不会走到这里，但为了安全还是保留
          console.error('刷新用户信息失败（意外错误）：', error);
        });
    } else {
      console.log('组件挂载时未登录，不刷新用户信息');
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isAuthenticated, refreshUserInfo])

  // 在组件挂载后从HTML文档属性中获取布局类型
  useEffect(() => {
    if (typeof document !== "undefined") {
      const currentLayoutType = document.documentElement.getAttribute("data-layout") || "vertical"
      setLayoutType(currentLayoutType)
      
      // 监听布局类型变化
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-layout" &&
            mutation.target === document.documentElement
          ) {
            const newLayoutType = document.documentElement.getAttribute("data-layout") || "vertical"
            setLayoutType(newLayoutType)
          }
        })
      })
      
      observer.observe(document.documentElement, { attributes: true })
      
      return () => {
        observer.disconnect()
      }
    }
  }, [])

  // 监听窗口大小变化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      
      window.addEventListener('resize', handleResize);
      handleResize(); // 初始获取窗口宽度
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // 处理角色切换
  const handleRoleChange = async (roleId: number | string) => {
    console.log(`开始切换角色，ID: ${roleId}`);
    // 避免重复点击
    if (isLoading) {
      console.log('角色切换中，请稍后再试');
      return;
    }
    
    try {
      // 设置加载状态
      setIsLoading(true);
      
      // 确保数字ID类型
      const numericRoleId = typeof roleId === 'string' ? parseInt(roleId as string, 10) : roleId;
      console.log(`角色ID转换为数字: ${numericRoleId}`);
      
      // 提前关闭对话框（提高响应速度）
      setRoleSwitcherOpen(false);
      
      // 调用store中的switchRole方法（内部已包含API调用）
      await switchRole(numericRoleId);
      console.log('角色切换store方法调用成功');
      
      // 确保UI刷新
      forceUpdate({});
      
      // 添加短暂延迟，确保新token已经生效
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 角色切换成功后刷新用户信息，强制使用最新token
      try {
        const refreshedUser = await refreshUserInfo();
        console.log('角色切换后已刷新用户信息:', refreshedUser?.currentRole);
        
        // 强制重新渲染组件
        forceUpdate({});
      } catch (refreshError) {
        console.error('刷新用户信息失败:', refreshError);
        // 尝试再次刷新（如果第一次失败）
        setTimeout(async () => {
          try {
            await refreshUserInfo();
            console.log('第二次尝试刷新用户信息成功');
            // 强制重新渲染组件
            forceUpdate({});
          } catch (e) {
            console.error('第二次尝试刷新用户信息也失败:', e);
          }
        }, 500);
      }
      
      // 添加成功提示
      console.log('角色切换成功');
      // 可以添加提示信息：toast.success('角色切换成功')
    } catch (error) {
      console.error("角色切换失败", error);
      // 可以添加提示信息：toast.error('角色切换失败，请稍后重试')
    } finally {
      // 无论成功失败，重置加载状态
      setIsLoading(false);
    }
  }

  const toggleSidebar = () => {
    const newCollapsedState = !sidebarCollapsed
    setSidebarCollapsed(newCollapsedState)
    localStorage.setItem("sidebarCollapsed", newCollapsedState.toString())

    // 触发自定义事件，让sidebar组件知道状态变化
    const event = new CustomEvent("sidebarStateChange", {
      detail: { collapsed: newCollapsedState },
    })
    window.dispatchEvent(event)
  }

  // 切换全屏模式
  const toggleFullscreen = () => {
    // 获取所有可能的全屏方法
    const doc = document.documentElement;
    const requestFullscreen = doc.requestFullscreen || 
                            (doc as any).mozRequestFullScreen || 
                            (doc as any).webkitRequestFullscreen || 
                            (doc as any).msRequestFullscreen;
    
    const exitFullscreen = document.exitFullscreen || 
                          (document as any).mozCancelFullScreen || 
                          (document as any).webkitExitFullscreen || 
                          (document as any).msExitFullscreen;

    const fullscreenElement = document.fullscreenElement || 
                             (document as any).mozFullScreenElement || 
                             (document as any).webkitFullscreenElement || 
                             (document as any).msFullscreenElement;

    try {
      if (!fullscreenElement) {
        // 进入全屏
        requestFullscreen.call(doc)
          .then(() => {
            setIsFullscreen(true);
          })
          .catch((err: any) => {
            console.error('进入全屏失败:', err);
          });
      } else {
        // 退出全屏
        exitFullscreen.call(document)
          .then(() => {
            setIsFullscreen(false);
          })
          .catch((err: any) => {
            console.error('退出全屏失败:', err);
          });
      }
    } catch (err) {
      console.error('全屏操作失败:', err);
    }
  };

  // 打开搜索对话框
  const openSearchDialog = useCallback(() => {
    setSearchDialogOpen(true)
  }, [])
  
  // 处理退出登录
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
      // 可以添加提示信息：toast.success('已成功退出登录')
    } catch (error) {
      console.error("退出登录失败", error)
      // 依然执行退出登录操作
      router.push('/login')
      // 可以添加提示信息：toast.warning('退出登录时遇到问题，但已成功退出')
    }
  }

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])
  
  // 获取当前角色名称
  const getCurrentRoleName = () => {

  
    if (!user) {
      return "未设置角色";
    }
    
    // 从currentRole获取角色名称（优先）
    if (user.currentRole) {
      if (user.currentRole.roleName) {
        return user.currentRole.roleName;
      } else if (user.currentRole.name) {
        // 如果没有roleName但有name
        return user.currentRole.name;
      }
    }
    
    // 从角色列表获取第一个角色名称（备选）
    if (user.roles && user.roles.length > 0) {
      const firstRole = user.roles[0];
      if (firstRole) {
        if (firstRole.roleName) {
          return firstRole.roleName;
        } else if (firstRole.name) {
          // 如果没有roleName但有name
          return firstRole.name;
        }
      }
    }
    
    // 没有任何角色信息
    return "未设置角色";
  }
  
  // 获取用户头像
  const getUserAvatar = () => {
    if (!user) {
      return "/default-avatar.png"; // 确保有一个默认头像路径
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

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 w-full h-16 z-30 px-4 header-glass bg-white border-b border-gray-200",
          glassEffect && "glass-enabled",
          "transition-all duration-150 ease-out", // 平滑过渡效果
        )}
      >
        <div className="flex items-center justify-between h-full opacity-95">
          {/* 左侧Logo和平台名称 */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-[1.1rem] font-bold truncate hidden md:block app-title">高校科研创新智能服务平台</span>
            </div>

            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
            
          {/* 水平菜单 - 当布局类型为horizontal时显示，使用flex-1让它自动占用可用空间 */}
          {layoutType === "horizontal" && (
            <div className={cn(
              "hidden md:flex overflow-hidden",
              windowWidth >= 1366 ? "mx-4" : "mx-2",
              "flex-1"
            )}>
              <HorizontalMenu />
            </div>
          )}

          {/* 右侧功能区 */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* 搜索栏 - 固定宽度 */}
            <div className="relative hidden md:block">
              <Button
                variant="outline"
                className="w-[160px] justify-between pl-3 pr-2 py-2 rounded-lg border border-gray-200 bg-white/80 text-gray-500 text-sm font-normal"
                onClick={openSearchDialog}
              >
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-2 text-gray-400" />
                  <span>搜索</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500">
                  <span className="text-xs">Ctrl</span>K
                </kbd>
              </Button>
            </div>

            {/* 数据看板按钮 */}
            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/data-dashboard')}
                className="relative hidden md:flex"
                title="点击进入数据看板"
              >
                <Monitor className="h-5 w-5" />
              </Button>
            </div>

            {/* 全屏切换按钮 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="relative hidden md:flex"
              title={isFullscreen ? "退出全屏" : "全屏显示"}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>

            {/* 通知中心 - 仅在桌面端显示 */}
            <div className="hidden md:block">
              <NotificationCenter
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
            </div>

            {/* 主题切换 - 仅在桌面端显示 */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsPanelOpen(true)}
                className="relative hidden md:flex"
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}

            {/* 用户信息 - 在所有设备上显示 */}
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
                <div
                  className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setRoleSwitcherOpen(true)}
                >
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
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* 快捷操作区 */}
                <div className="py-4 px-3 grid grid-cols-3 gap-2 border-t border-b">
                  <div
                    className="flex flex-col items-center gap-1.5 cursor-pointer group"
                    onClick={() => setRoleSwitcherOpen(true)}
                  >
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
          </div>
        </div>
      </header>

      {/* 搜索对话框 */}
      <AnimatePresence>
        {searchDialogOpen && <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />}
      </AnimatePresence>

      {/* 移动端下拉菜单 */}
      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      {/* 角色切换器 */}
      {user && (
        <RoleSwitcher
          open={roleSwitcherOpen}
          onOpenChange={setRoleSwitcherOpen}
          currentRole={user.currentRole?.roleName || user.currentRole?.name || ""}
          availableRoles={user.roles || []}
          onRoleChange={handleRoleChange}
        />
      )}

      {/* 设置面板 */}
      <SettingsPanel open={settingsPanelOpen} onOpenChange={setSettingsPanelOpen} />

      <style jsx global>{`
        /* 响应式控制系统名称显示/隐藏 */
        @media (max-width: 1365px) {
          .app-title {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

