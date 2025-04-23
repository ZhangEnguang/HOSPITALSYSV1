"use client"

import { useEffect, useState } from "react"
import { useSettings } from "@/hooks/use-settings"
import { applySettings } from "@/utils/settings-utils"

/**
 * 全局布局监听组件
 * 用于监听页面变化并重新应用设置
 */
export default function GlobalLayoutListener() {
  const [lastPath, setLastPath] = useState("")
  const { settings } = useSettings()

  useEffect(() => {
    // 初始应用设置
    applySettings(settings)

    // 记录当前路径
    setLastPath(window.location.pathname)

    // 监听路由变化
    const routeObserver = () => {
      const currentPath = window.location.pathname
      if (currentPath !== lastPath) {
        console.log(`路由从 ${lastPath} 变更为 ${currentPath}`)
        setLastPath(currentPath)

        // 延迟确保DOM已经更新
        setTimeout(() => {
          applySettings(settings)
        }, 200)
      }
    }

    // 创建 intersection observer 来监测页面变化
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(() => {
        routeObserver()
      })
    })

    // 观察文档的主要部分
    const mainElement = document.querySelector("main") || document.body
    observer.observe(mainElement)

    // 创建定时器定期检查URL变化
    const intervalCheck = setInterval(routeObserver, 500)

    // 添加其他事件监听
    window.addEventListener("popstate", routeObserver)
    window.addEventListener("pushstate", routeObserver)
    window.addEventListener("replacestate", routeObserver)

    // 清理函数
    return () => {
      observer.disconnect()
      clearInterval(intervalCheck)
      window.removeEventListener("popstate", routeObserver)
      window.removeEventListener("pushstate", routeObserver)
      window.removeEventListener("replacestate", routeObserver)
    }
  }, [lastPath, settings])

  // 这是一个无UI组件，不渲染任何内容
  return null
}

