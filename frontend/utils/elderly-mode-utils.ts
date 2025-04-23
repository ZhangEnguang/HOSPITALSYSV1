// utils/elderly-mode-utils.ts
// 处理适老化模式相关功能

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

