// 将十六进制颜色转换为HSL格式
export function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
  // 移除#号
  hex = hex.replace(/^#/, "")

  // 解析RGB值
  let r, g, b
  if (hex.length === 3) {
    r = Number.parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255
    g = Number.parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255
    b = Number.parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255
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

// 将十六进制颜色转换为HSL字符串格式，用于CSS变量
export function convertHexToHsl(hex: string): string {
  const hsl = hexToHSL(hex)
  if (hsl) {
    return `${hsl.h} ${hsl.s}% ${hsl.l}%`
  }
  // 默认蓝色HSL值
  return "221 100% 56%"
}

// 应用主题色到所有相关元素
export function applyThemeColor(color: string, hslValue: string) {
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

