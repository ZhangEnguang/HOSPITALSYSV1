// utils/font-size-utils.ts
// 处理字体大小相关功能

// 字体大小配置
const fontSizeConfig = {
  small: 0.9,
  medium: 1,
  large: 1.1,
  xlarge: 1.2,
}

// 应用字体大小
export function applyFontSize(size: string) {
  // 获取字体大小因子
  const factor = fontSizeConfig[size as keyof typeof fontSizeConfig] || 1

  // 重要：先重置所有元素的字体大小样式，避免累积效应
  resetAllFontSizes()

  // 设置根元素的字体大小变量
  document.documentElement.style.setProperty("--font-size-factor", factor.toString())

  // 记录当前使用的字体大小设置
  document.documentElement.setAttribute("data-font-size", size)

  // 应用到body元素
  document.body.style.fontSize = `${16 * factor}px`

  console.log(`应用字体大小: ${size}, 因子: ${factor}`)

  return factor
}

// 重置所有元素的字体大小
function resetAllFontSizes() {
  // 移除之前可能直接设置在元素上的字体大小样式
  const textElements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, span, div, button, input, select, textarea, label",
  )

  textElements.forEach((el) => {
    if (el instanceof HTMLElement && !el.classList.contains("icon") && !el.hasAttribute("data-preserve-font-size")) {
      // 移除直接设置的字体大小
      el.style.removeProperty("font-size")
    }
  })
}

// 获取字体大小因子
export function getFontSizeFactor(size: string): string {
  return (fontSizeConfig[size as keyof typeof fontSizeConfig] || 1).toString()
}

// 添加全局CSS规则来统一管理字体大小
export function setupFontSizeSystem() {
  if (typeof document === "undefined") return

  // 检查是否已经添加了字体大小样式表
  if (!document.getElementById("font-size-stylesheet")) {
    const styleSheet = document.createElement("style")
    styleSheet.id = "font-size-stylesheet"
    styleSheet.textContent = `
      :root {
        --font-size-factor: 1;
        --base-font-size: 16px;
      }
      
      html {
        font-size: calc(var(--base-font-size) * var(--font-size-factor));
      }
      
      /* 使用rem单位的元素会自动响应根字体大小的变化 */
      body {
        font-size: 1rem;
      }
    `

    document.head.appendChild(styleSheet)
  }
}

// 初始化字体大小系统
export function initFontSizeSystem(initialSize = "medium") {
  if (typeof document === "undefined") return

  // 设置基础样式系统
  setupFontSizeSystem()

  // 应用初始字体大小
  return applyFontSize(initialSize)
}

