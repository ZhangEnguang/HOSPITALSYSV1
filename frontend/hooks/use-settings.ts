"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import type { SettingsState, LayoutType, AnimationType, BorderRadiusType } from "@/types/settings"
import { usePrevious } from "@/hooks/use-previous"
import { applyBorderRadius, getBorderRadiusValue } from "@/utils/border-radius-utils"
import { applyFontSize, initFontSizeSystem } from "@/utils/font-size-utils"

export const DEFAULT_SETTINGS: SettingsState = {
  primaryColor: "#2156FF",
  customColor: "#2156FF",
  headerOpacity: 100,
  borderRadius: "small", // 默认设置为small (4px)
  glassEffect: false,
  layoutType: "vertical",
  showSidebar: true,
  fontSize: "medium",
  elderlyMode: false,
  pageAnimation: "fade",
  language: "zh",
  coloredNavigation: false,
}

export const BORDER_RADIUS_OPTIONS = [
  { id: "none", name: "无圆角", value: 0 },
  { id: "small", name: "小圆角", value: 4 },
  { id: "medium", name: "中等圆角", value: 8 },
  { id: "large", name: "大圆角", value: 12 },
  { id: "full", name: "全圆角", value: 20 },
]

// 转换HEX颜色为HSL对象
const hexToHSL = (hex: string) => {
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

  return { h, s, l }
}

// 应用适老化模式样式
export function applyElderlyMode(enabled: boolean) {
  if (enabled) {
    // 增加对比度
    document.body.style.fontWeight = "500"
    document.body.style.letterSpacing = "0.5px"

    // 增强按钮边框 - 改为1px黑色描边
    const buttons = document.querySelectorAll("button, .btn")
    buttons.forEach((button) => {
      if (button instanceof HTMLElement) {
        button.style.border = "1px solid #000"
        button.style.fontWeight = "bold"
      }
    })

    // 所有边框元素添加1px描边
    const borderElements = document.querySelectorAll(".card, .border, input, select, textarea, [class*='border-']")
    borderElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.border = "1px solid #000"
      }
    })

    // 增大点击区域
    const clickables = document.querySelectorAll("a, button, .btn, .card")
    clickables.forEach((el) => {
      if (el instanceof HTMLElement) {
        const currentPadding = window.getComputedStyle(el).padding
        el.style.padding = `calc(${currentPadding} + 4px)`
      }
    })
  } else {
    // 恢复默认样式
    document.body.style.fontWeight = ""
    document.body.style.letterSpacing = ""

    const buttons = document.querySelectorAll("button, .btn")
    buttons.forEach((button) => {
      if (button instanceof HTMLElement) {
        button.style.border = ""
        button.style.fontWeight = ""
      }
    })

    const borderElements = document.querySelectorAll(".card, .border, input, select, textarea, [class*='border-']")
    borderElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.border = ""
      }
    })

    const clickables = document.querySelectorAll("a, button, .btn, .card")
    clickables.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.padding = ""
      }
    })
  }
}

// 修改 useSettings hook，添加平滑预览功能
export function useSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  // 临时设置状态，用于存储未确认的设置
  const [tempSettings, setTempSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  // 保存之前的确认设置，用于取消时恢复
  const previousSettings = usePrevious(settings)
  // 标志，表示是否已添加过transition样式
  const hasAddedTransition = useRef(false)
  // 标志，表示是否需要应用平滑过渡
  const needsTransition = useRef(false)
  // 标志，表示是否已初始化字体大小系统
  const fontSizeInitialized = useRef(false)

  // 确保在客户端渲染
  useEffect(() => {
    setMounted(true)

    // 初始化字体大小系统
    if (!fontSizeInitialized.current) {
      initFontSizeSystem()
      fontSizeInitialized.current = true
    }

    // 添加全局CSS transition样式
    if (!hasAddedTransition.current) {
      const transitionStyle = document.createElement("style")
      transitionStyle.id = "settings-transition-styles"
      transitionStyle.textContent = `
        * {
          transition-property: border-radius, background-color, color, opacity, backdrop-filter;
          transition-duration: 0.15s;
          transition-timing-function: ease-out;
        }
        
        /* 确保某些元素不应用transition */
        [role='switch'], .switch, input[type='checkbox'], input[type='radio'] {
          transition: none !important;
        }
      `
      document.head.appendChild(transitionStyle)
      hasAddedTransition.current = true
    }

    // 添加主题色变化事件监听
    const handleThemeColorChange = (e: any) => {
      const { color, hslValue } = e.detail
      // 重新应用主题色到所有元素
      if (color && hslValue) {
        document.documentElement.style.setProperty("--primary-color", color)
        document.documentElement.style.setProperty("--primary", hslValue)
        document.documentElement.style.setProperty("--ring", hslValue)
      }
    }

    window.addEventListener("themeColorChange", handleThemeColorChange)

    // 如果localStorage中有保存的主题色，立即应用
    const savedColor = localStorage.getItem("primaryColor")
    if (savedColor) {
      applyColorChange(savedColor)
    }

    return () => {
      window.removeEventListener("themeColorChange", handleThemeColorChange)
    }
  }, [])

  // 应用所有设置的函数
  const applyAllSettings = (settingsToApply: SettingsState, withTransition = false) => {
    try {
      // 如果需要过渡效果，启用transition
      if (withTransition) {
        needsTransition.current = true

        // 短暂延迟应用设置，让过渡效果更明显
        setTimeout(() => {
          applySettingsImpl(settingsToApply)

          // 应用后再次短暂延迟，然后禁用transition
          setTimeout(() => {
            needsTransition.current = false
          }, 200)
        }, 10)
      } else {
        // 直接应用设置，无过渡效果
        needsTransition.current = false
        applySettingsImpl(settingsToApply)
      }
    } catch (error) {
      console.error("Error applying settings:", error)
    }
  }

  // 实际应用设置的内部函数
  const applySettingsImpl = (settingsToApply: SettingsState) => {
    // 应用主题色
    document.documentElement.style.setProperty("--primary-color", settingsToApply.primaryColor)
    const hslColor = hexToHSL(settingsToApply.primaryColor)
    if (hslColor) {
      const hslValue = `${hslColor.h} ${hslColor.s}% ${hslColor.l}%`
      document.documentElement.style.setProperty("--primary", hslValue)
      document.documentElement.style.setProperty("--ring", hslValue)

      // 应用主题色到相关元素
      applyColorToElements(settingsToApply.primaryColor, hslValue)
    }

    // 应用导航栏透明度
    document.documentElement.style.setProperty("--header-opacity", settingsToApply.headerOpacity + "%")

    // 应用圆角 - 固定为4px
    applyBorderRadius(4, true)

    // 应用毛玻璃效果
    document.documentElement.style.setProperty("--glass-effect", settingsToApply.glassEffect ? "1" : "0")
    const header = document.querySelector("header")
    if (header) {
      if (settingsToApply.glassEffect && !settingsToApply.coloredNavigation) {
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
      if (settingsToApply.coloredNavigation) {
        header.classList.add("colored-navigation")
        if (header instanceof HTMLElement) {
          header.style.backgroundColor = settingsToApply.primaryColor
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
    document.documentElement.setAttribute("data-layout", settingsToApply.layoutType)

    // 应用侧边栏显示状态
    document.documentElement.setAttribute("data-sidebar", settingsToApply.showSidebar ? "show" : "hide")

    // 应用字体大小 - 使用新的字体大小工具函数
    applyFontSize(settingsToApply.fontSize)

    // 应用适老化模式
    if (settingsToApply.elderlyMode) {
      document.documentElement.classList.add("elderly-mode")
      applyElderlyMode(true)
    } else {
      document.documentElement.classList.remove("elderly-mode")
      applyElderlyMode(false)
    }

    // 应用页面动画
    document.documentElement.setAttribute("data-animation", settingsToApply.pageAnimation)

    // 应用语言
    document.documentElement.setAttribute("data-language", settingsToApply.language)
  }

  // 从localStorage加载设置
  useEffect(() => {
    if (!mounted) return

    const savedPrimaryColor = localStorage.getItem("primaryColor") || DEFAULT_SETTINGS.primaryColor
    const savedHeaderOpacity = localStorage.getItem("headerOpacity") || DEFAULT_SETTINGS.headerOpacity.toString()
    const savedBorderRadius =
      (localStorage.getItem("borderRadius") as BorderRadiusType) || DEFAULT_SETTINGS.borderRadius
    const savedGlassEffect = localStorage.getItem("glassEffect") !== "false"
    const savedLayoutType = (localStorage.getItem("layoutType") as LayoutType) || DEFAULT_SETTINGS.layoutType
    const savedShowSidebar = localStorage.getItem("showSidebar") !== "false"
    const savedFontSize = localStorage.getItem("fontSize") || DEFAULT_SETTINGS.fontSize
    const savedElderlyMode = localStorage.getItem("elderlyMode") === "true"
    const savedPageAnimation =
      (localStorage.getItem("pageAnimation") as AnimationType) || DEFAULT_SETTINGS.pageAnimation
    const savedLanguage = localStorage.getItem("language") || DEFAULT_SETTINGS.language
    const savedColoredNavigation = localStorage.getItem("coloredNavigation") === "true"

    const loadedSettings = {
      primaryColor: savedPrimaryColor,
      customColor: savedPrimaryColor,
      headerOpacity: Number(savedHeaderOpacity),
      borderRadius: savedBorderRadius,
      glassEffect: savedGlassEffect,
      layoutType: savedLayoutType,
      showSidebar: savedShowSidebar,
      fontSize: savedFontSize,
      elderlyMode: savedElderlyMode,
      pageAnimation: savedPageAnimation,
      language: savedLanguage,
      coloredNavigation: savedColoredNavigation,
    }

    setSettings(loadedSettings)
    setTempSettings(loadedSettings)

    // 禁用过渡效果应用初始设置
    applyAllSettings(loadedSettings, false)
  }, [mounted, setTheme])

  // 将颜色应用到相关元素的辅助函数
  const applyColorToElements = (color: string, hslValue: string) => {
    // 立即应用到所有使用主题色的元素
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

  // 应用颜色变化的实际函数
  const applyColorChange = (color: string) => {
    try {
      // 应用主题色到CSS变量
      document.documentElement.style.setProperty("--primary-color", color)

      // 转换颜色为HSL格式并应用
      const hslColor = hexToHSL(color)
      if (hslColor) {
        const hslValue = `${hslColor.h} ${hslColor.s}% ${hslColor.l}%`
        document.documentElement.style.setProperty("--primary", hslValue)
        document.documentElement.style.setProperty("--ring", hslValue)

        // 应用到所有相关元素
        applyColorToElements(color, hslValue)
      }

      // 如果启用了彩色导航，更新导航栏颜色
      if (tempSettings.coloredNavigation) {
        const header = document.querySelector("header")
        if (header && header instanceof HTMLElement) {
          header.style.backgroundColor = color
        }
      }

      // 触发自定义事件，通知其他组件主题色已更改
      const event = new CustomEvent("themeColorChange", {
        detail: { color, hslValue: hslColor ? `${hslColor.h} ${hslColor.s}% ${hslColor.l}%` : null },
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.error("Error applying color change:", error)
    }
  }

  // 修改处理颜色变化的函数，使用平滑过渡
  const handleColorChange = (color: string) => {
    setTempSettings((prev) => ({ ...prev, primaryColor: color }))
    // 使用过渡效果应用颜色变化
    needsTransition.current = true
    applyColorChange(color)
  }

  const handleCustomColorChange = (color: string) => {
    setTempSettings((prev) => ({ ...prev, customColor: color }))
  }

  const handleApplyCustomColor = () => {
    handleColorChange(tempSettings.customColor)
  }

  // 修改处理透明度变化的函数，使用平滑过渡
  const handleOpacityChange = (value: number[]) => {
    const opacity = value[0]
    setTempSettings((prev) => ({ ...prev, headerOpacity: opacity }))

    // 使用过渡效果应用透明度变化
    needsTransition.current = true
    document.documentElement.style.setProperty("--header-opacity", opacity + "%")
    if (!tempSettings.coloredNavigation) {
      const header = document.querySelector("header")
      if (header && header instanceof HTMLElement) {
        header.style.backgroundColor = `rgba(255, 255, 255, ${opacity / 100})`
      }
    }
  }

  // 修改处理布局类型变化的函数
  const handleLayoutTypeChange = (type: LayoutType) => {
    setTempSettings((prev) => ({ ...prev, layoutType: type }))
    document.documentElement.setAttribute("data-layout", type)
  }

  // 修改处理侧边栏显示变化的函数
  const handleShowSidebarChange = (checked: boolean) => {
    setTempSettings((prev) => ({ ...prev, showSidebar: checked }))
    document.documentElement.setAttribute("data-sidebar", checked ? "show" : "hide")
    const sidebar = document.querySelector("aside, .sidebar")
    if (sidebar && sidebar instanceof HTMLElement) {
      sidebar.style.display = checked ? "block" : "none"
    }
  }

  // 修改处理字体大小变化的函数，使用新的字体大小工具函数
  const handleFontSizeChange = (size: string) => {
    setTempSettings((prev) => ({ ...prev, fontSize: size }))
    console.log(`字体大小变更为: ${size}`)

    // 使用新的字体大小工具函数应用字体大小
    applyFontSize(size)
  }

  // 修改处理适老化模式变化的函数
  const handleElderlyModeChange = (checked: boolean) => {
    setTempSettings((prev) => ({ ...prev, elderlyMode: checked }))

    // 启用过渡效果
    needsTransition.current = true

    // 应用适老化模式
    if (checked) {
      document.documentElement.classList.add("elderly-mode")
    } else {
      document.documentElement.classList.remove("elderly-mode")
    }
    applyElderlyMode(checked)
  }

  // 修改处理页面动画变化的函数
  const handlePageAnimationChange = (animation: AnimationType) => {
    setTempSettings((prev) => ({ ...prev, pageAnimation: animation }))
    document.documentElement.setAttribute("data-animation", animation)
  }

  // 修改处理语言变化的函数
  const handleLanguageChange = (value: string) => {
    setTempSettings((prev) => ({ ...prev, language: value }))
    document.documentElement.setAttribute("lang", value)
  }

  // 确认应用设置的函数
  const handleConfirm = () => {
    try {
      // 保存当前设置到正式状态
      localStorage.setItem("primaryColor", tempSettings.primaryColor)
      localStorage.setItem("headerOpacity", tempSettings.headerOpacity.toString())
      localStorage.setItem("glassEffect", tempSettings.glassEffect.toString())
      localStorage.setItem("layoutType", tempSettings.layoutType)
      localStorage.setItem("showSidebar", tempSettings.showSidebar.toString())
      localStorage.setItem("fontSize", tempSettings.fontSize)
      localStorage.setItem("elderlyMode", tempSettings.elderlyMode.toString())
      localStorage.setItem("pageAnimation", tempSettings.pageAnimation)
      localStorage.setItem("language", tempSettings.language)
      localStorage.setItem("coloredNavigation", tempSettings.coloredNavigation.toString())

      // 应用所有临时设置
      applyAllSettings(tempSettings, true)

      // 更新设置状态
      setSettings(tempSettings)

      // 显示成功消息
      toast({
        title: "设置已更新",
        description: "您的设置已成功保存并应用。",
      })
    } catch (error) {
      console.error("Error confirming settings:", error)
      toast({
        title: "发生错误",
        description: "保存设置时出现问题，请重试。",
        variant: "destructive",
      })
    }
  }

  // 取消设置的函数
  const handleCancel = () => {
    if (previousSettings) {
      // 恢复到之前的设置
      applyAllSettings(previousSettings, true)
      setTempSettings(previousSettings)
      setSettings(previousSettings)

      // 显示取消消息
      toast({
        title: "设置已取消",
        description: "已恢复到之前的设置。",
      })
    }
  }

  const handleGlassEffectChange = (checked: boolean) => {
    setTempSettings((prev) => ({ ...prev, glassEffect: checked }))

    // 启用过渡效果
    needsTransition.current = true

    // 应用毛玻璃效果
    document.documentElement.style.setProperty("--glass-effect", checked ? "1" : "0")
    const header = document.querySelector("header")
    if (header) {
      if (checked && !tempSettings.coloredNavigation) {
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
  }

  const handleColoredNavigationChange = (checked: boolean) => {
    setTempSettings((prev) => ({ ...prev, coloredNavigation: checked }))

    // 启用过渡效果
    needsTransition.current = true

    // 应用彩色导航
    const header = document.querySelector("header")
    if (header) {
      if (checked) {
        header.classList.add("colored-navigation")
        if (header instanceof HTMLElement) {
          header.style.backgroundColor = tempSettings.primaryColor
          header.style.color = "#ffffff"
          header.style.backdropFilter = "none"
          header.style.WebkitBackdropFilter = "none"
        }
      } else {
        header.classList.remove("colored-navigation")
        if (header instanceof HTMLElement) {
          header.style.backgroundColor = ""
          header.style.color = ""
          if (tempSettings.glassEffect) {
            header.classList.add("glass-enabled")
            header.style.backdropFilter = "blur(15px)"
            header.style.WebkitBackdropFilter = "blur(15px)"
          }
        }
      }
    }
  }

  return {
    settings,
    tempSettings,
    mounted,
    handleColorChange,
    handleCustomColorChange,
    handleApplyCustomColor,
    handleOpacityChange,
    handleLayoutTypeChange,
    handleShowSidebarChange,
    handleFontSizeChange,
    handleElderlyModeChange,
    handlePageAnimationChange,
    handleLanguageChange,
    handleConfirm,
    handleCancel,
    handleGlassEffectChange,
    handleColoredNavigationChange,
    setTheme,
    theme,
  }
}
