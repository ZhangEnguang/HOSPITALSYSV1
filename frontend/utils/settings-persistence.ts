// utils/settings-persistence.ts
// 处理设置持久化相关功能

import type { SettingsState } from "@/types/settings"
import { applySettings } from "./settings-utils"

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

