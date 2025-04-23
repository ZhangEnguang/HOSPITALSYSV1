// utils/settings-utils.ts
// 设置应用工具

import type { SettingsState } from "@/types/settings"
import { applyBorderRadius, getBorderRadiusValue } from "./border-radius-utils"
import { applyElderlyMode } from "./elderly-mode-utils"
import { applyFontSize } from "./font-size-utils"

// 转换HEX颜色为HSL格式
export function convertHexToHsl(hex: string): string {
  // 移除#前缀
  hex = hex.replace(/^#/, "")

  // 解析RGB值
  let r, g, b
  if (hex.length === 3) {
    r = Number.parseInt(hex[0] + hex[0], 16) / 255
    g = Number.parseInt(hex[1] + hex[1], 16) / 255
    b = Number.parseInt(hex[2] + hex[2], 16) / 255
  } else {
    r = Number.parseInt(hex.substring(0, 2), 16) / 255
    g = Number.parseInt(hex.substring(2, 4), 16) / 255
    b = Number.parseInt(hex.substring(4, 6), 16) / 255
  }

  // 计算HSL值
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h = Math.round(h * 60)
  }

  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `${h} ${s}% ${l}%`
}

// 应用主题色
export function applyThemeColor(color: string, hslValue: string) {
  // 应用到使用主题色的元素
  const elementsToUpdate = [
    ".bg-primary",
    ".text-primary",
    ".border-primary",
    ".ring-primary",
    ".sidebar",
    ".sidebar-item.active",
    ".progress-bar",
    ".progress-value",
    "[data-theme-color='primary']",
    ".nav-item.active",
    ".status-indicator",
  ]

  elementsToUpdate.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.setProperty("--primary", hslValue)

        // 对于背景色元素，直接设置背景色以确保立即生效
        if (
          selector.includes("bg-primary") ||
          selector.includes("active") ||
          selector.includes("progress") ||
          selector.includes("status-indicator")
        ) {
          el.style.backgroundColor = color
        }

        // 对于边框元素，直接设置边框色
        if (selector.includes("border")) {
          el.style.borderColor = color
        }
      }
    })
  })
}

// 应用页面动画
export function applyPageAnimation(animation: string) {
  // 简单实现，实际应用中可能需要更复杂的逻辑
  document.documentElement.setAttribute("data-animation", animation)
}

// 修改 applySettings 函数，使用拆分后的工具函数
export function applySettings(settings: SettingsState) {
  // 应用主题色
  document.documentElement.style.setProperty("--primary-color", settings.primaryColor)
  const hslValue = convertHexToHsl(settings.primaryColor)
  document.documentElement.style.setProperty("--primary", hslValue)
  document.documentElement.style.setProperty("--ring", hslValue)
  applyThemeColor(settings.primaryColor, hslValue)

  // 应用导航栏透明度
  document.documentElement.style.setProperty("--header-opacity", settings.headerOpacity + "%")

  // 应用圆角
  const radiusValue = getBorderRadiusValue(settings.borderRadius)
  applyBorderRadius(radiusValue)

  // 应用毛玻璃效果
  document.documentElement.style.setProperty("--glass-effect", settings.glassEffect ? "1" : "0")
  const header = document.querySelector("header")
  if (header) {
    if (settings.glassEffect && !settings.coloredNavigation) {
      header.classList.add("glass-enabled")
      if (header instanceof HTMLElement) {
        header.style.backdropFilter = "blur(15px)"
        header.style.WebkitBackdropFilter = "blur(15px)"
      }
    } else {
      header.classList.remove("glass-enabled")
      if (header instanceof HTMLElement) {
        header.style.backdropFilter = "none"
        header.style.WebkitBackdropFilter = "none"
      }
    }
  }

  // 应用彩色导航
  if (header) {
    if (settings.coloredNavigation) {
      header.classList.add("colored-navigation")
      if (header instanceof HTMLElement) {
        header.style.backgroundColor = settings.primaryColor
        header.style.color = "#ffffff"
      }
    } else {
      header.classList.remove("colored-navigation")
      if (header instanceof HTMLElement) {
        header.style.backgroundColor = ""
        header.style.color = ""
      }
    }
  }

  // 应用布局类型
  document.documentElement.setAttribute("data-layout", settings.layoutType)

  // 应用侧边栏显示状态
  document.documentElement.setAttribute("data-sidebar", settings.showSidebar ? "show" : "hide")

  // 应用字体大小
  applyFontSize(settings.fontSize)

  // 应用适老化模式
  if (settings.elderlyMode) {
    document.documentElement.classList.add("elderly-mode")
    applyElderlyMode(true)
  } else {
    document.documentElement.classList.remove("elderly-mode")
    applyElderlyMode(false)
  }

  // 应用页面动画
  document.documentElement.setAttribute("data-animation", settings.pageAnimation)
  applyPageAnimation(settings.pageAnimation)

  // 应用语言
  document.documentElement.setAttribute("data-language", settings.language)
}

// 设置变更时重新应用设置
export function onSettingsChanged(settings: SettingsState) {
  // 每当设置变更时，重新应用所有设置
  applySettings(settings)

  // 记录最后一次设置应用的时间戳
  localStorage.setItem("lastSettingsUpdate", Date.now().toString())
}

// 修改页面切换监听，避免频繁触发
export function setupSettingsPersistence(settings: SettingsState) {
  // 创建一个防抖函数，避免短时间内多次触发
  let debounceTimer: number | null = null
  const debounce = (callback: () => void, delay: number) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = window.setTimeout(callback, delay)
  }

  // 上次应用设置的时间戳，避免频繁应用
  let lastApplied = Date.now()

  // 创建MutationObserver监听DOM变化
  const observer = new MutationObserver((mutations) => {
    // 检查是否有重要的DOM变化
    const hasSignificantChange = mutations.some((mutation) => {
      // 只有当变化是添加/删除节点，且是主要内容区域时才触发
      return (
        mutation.type === "childList" &&
        (mutation.target.nodeName === "MAIN" ||
          mutation.target.nodeName === "BODY" ||
          (mutation.addedNodes.length > 5 && Date.now() - lastApplied > 1000))
      ) // 至少1秒钟后才重新应用
    })

    if (hasSignificantChange) {
      // 使用防抖，延迟应用设置
      debounce(() => {
        console.log("Significant DOM change detected, reapplying settings")
        applySettings(settings)
        lastApplied = Date.now()
      }, 300) // 300ms防抖
    }
  })

  // 观察文档变化，但排除一些不必要的变化
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false, // 不监听属性变化，减少触发次数
  })

  return observer
}

