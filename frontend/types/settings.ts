export type ThemeColor = {
  id: string
  name: string
  value: string
}

export type LayoutType = "vertical" | "horizontal" | "double"
export type AnimationType = "fade" | "slide" | "zoom" | "none"
export type FontSizeType = "small" | "medium" | "large" | "xlarge"
export type BorderRadiusType = "none" | "small" | "medium" | "large" | "full"

export interface SettingsState {
  primaryColor: string
  customColor: string
  headerOpacity: number
  borderRadius: BorderRadiusType
  glassEffect: boolean
  layoutType: LayoutType
  showSidebar: boolean
  fontSize: string
  elderlyMode: boolean
  pageAnimation: AnimationType
  language: string
  coloredNavigation: boolean // 新增导航风格设置
}

export interface FontSizeOption {
  id: string
  name: string
  factor: string
}

export interface AnimationOption {
  id: string
  name: string
}

export interface BorderRadiusOption {
  id: BorderRadiusType
  name: string
  value: number
}

