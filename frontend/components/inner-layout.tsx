'use client'

import type React from "react"
import { usePathname } from 'next/navigation'
import { useState, useEffect } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import AIAssistant from "@/components/ai-assistant"
import TabsNavigation from "@/components/tabs-navigation"
import GlobalLayoutListener from "@/components/ui/global-layout-listener"
import { cn } from "@/lib/utils"

export default function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showLayout = pathname !== '/' && pathname !== '/login';
  const isFullscreenPage = pathname === '/' || pathname === '/login';
  const [layoutType, setLayoutType] = useState("vertical");

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
  }, []);

  // 对于欢迎页和登录页，不添加任何额外的容器或样式限制
  if (isFullscreenPage) {
    return <>{children}</>;
  }

  // 对于其他页面，使用正常的布局
  return (
    <>
      {/* 添加全局布局监听器 */}
      <GlobalLayoutListener />
      <div className="flex flex-col h-screen w-full overflow-hidden bg-[#F4F7FC]">
        {/* 顶部导航栏 - 条件渲染 */}
        {showLayout && <Header />}

        {/* 主体内容区 */}
        <div className={`flex flex-1 overflow-hidden ${showLayout ? 'pt-16' : ''}`}> {/* 条件添加 pt-16 */}
          {/* 左侧导航栏 - 条件渲染 */}
          {showLayout && layoutType !== "horizontal" && (
            <div className="hidden md:block h-full">
              <Sidebar />
            </div>
          )}

          {/* 内容区域 */}
          <div className={cn(
            "flex flex-col flex-1 w-full overflow-hidden",
            layoutType === "horizontal" && "w-full"
          )}>
            {/* Tabs - 条件渲染 */}
            {showLayout && <TabsNavigation />}
            <div 
              className="flex-1 p-4 md:p-6 overflow-auto"
              style={showLayout ? { 
                overflowX: 'hidden',
                height: layoutType === "horizontal" 
                  ? 'calc(100vh - 112px)' // 减去header(64px)和tabs(48px)的高度
                  : 'calc(100vh - 112px)'
              } : {}}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
      {/* AI 助手 - 条件渲染 (可选) */}
      {showLayout && <AIAssistant />}
    </>
  );
} 