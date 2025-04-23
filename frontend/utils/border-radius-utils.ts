// utils/border-radius-utils.ts
import { BORDER_RADIUS_OPTIONS } from "@/hooks/use-settings"
import type { BorderRadiusType } from "@/types/settings"

// 获取边框圆角像素值
export function getBorderRadiusValue(type: BorderRadiusType): number {
  const option = BORDER_RADIUS_OPTIONS.find((opt) => opt.id === type)
  return option ? option.value : 8
}

// 创建一个样式表来应用圆角，而不是直接修改元素样式
let borderRadiusStyleSheet: HTMLStyleElement | null = null

// 优化的圆角应用函数，减少闪烁并保持开关按钮全圆角
export function applyBorderRadius(radiusValue: number) {
  // 使用requestAnimationFrame确保所有DOM操作在同一帧内完成
  requestAnimationFrame(() => {
    // 设置CSS变量
    document.documentElement.style.setProperty("--border-radius", 0 + "px")

    // 如果样式表不存在，创建一个
    if (!borderRadiusStyleSheet) {
      borderRadiusStyleSheet = document.createElement("style")
      borderRadiusStyleSheet.id = "border-radius-styles"
      document.head.appendChild(borderRadiusStyleSheet)
    }


    // 直接应用样式到所有现有的开关按钮
    applyStylesDirectly()

    // 设置MutationObserver监听DOM变化，确保新添加的开关按钮也能应用正确的样式
    setupMutationObserver()
  })
}

// 添加一个函数，直接将样式应用到所有现有的开关按钮
function applyStylesDirectly() {
  // 查找所有可能的开关按钮元素
  const switchSelectors = [
    '[role="switch"]',
    ".switch",
    ".toggle",
    '[data-state="checked"]',
    '[data-state="unchecked"]',
    'button[role="switch"]',
    'div[role="switch"]',
    'span[role="switch"]',
    ".switch-thumb",
    ".switch-track",
    ".switch-handle",
    ".switch-container",
    ".switch-button",
    ".switch-toggle",
    'input[type="checkbox"][role="switch"]',
    ".form-switch",
    '[class*="switch"]',
    '[class*="toggle"]',
    "[data-ui-switch]",
    ".ui-switch",
  ]

  // 合并所有选择器
  const allSwitchElements = document.querySelectorAll(switchSelectors.join(","))

  // 应用样式到每个元素及其子元素
  allSwitchElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.style.borderRadius = "9999px"
      element.style.WebkitBorderRadius = "9999px"
      element.style.MozBorderRadius = "9999px"

      // 应用到子元素
      const children = element.querySelectorAll("*")
      children.forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.borderRadius = "9999px"
          child.style.WebkitBorderRadius = "9999px"
          child.style.MozBorderRadius = "9999px"
        }
      })
    }
  })
}

// 添加一个函数，设置MutationObserver监听DOM变化
function setupMutationObserver() {
  // 如果已经存在观察器，先断开连接
  if (window.__switchObserver) {
    window.__switchObserver.disconnect()
  }

  // 创建新的观察器
  const observer = new MutationObserver((mutations) => {
    let needsUpdate = false

    // 检查是否有新添加的节点
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        needsUpdate = true
      }
    })

    // 如果有新节点，重新应用样式
    if (needsUpdate) {
      setTimeout(applyStylesDirectly, 0)
    }
  })

  // 开始观察整个文档
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // 保存观察器引用
  window.__switchObserver = observer
}

// 声明全局变量类型
declare global {
  interface Window {
    __switchObserver?: MutationObserver
  }
}
