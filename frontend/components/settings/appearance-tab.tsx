"use client"

import type { BorderRadiusType, LayoutType, AnimationType } from "@/types/settings"
import LayoutSettings from "./layout-settings"
import ThemeColorSettings from "./theme-color-settings"
import NavigationSettings from "./navigation-settings"
import ElderlyModeSettings from "./elderly-mode-settings"
import AnimationSettings from "./animation-settings"

interface AppearanceTabProps {
  primaryColor: string
  customColor: string
  borderRadius: BorderRadiusType
  headerOpacity: number
  glassEffect: boolean
  layoutType: LayoutType
  showSidebar: boolean
  pageAnimation: AnimationType
  elderlyMode: boolean
  coloredNavigation: boolean
  onColorChange: (color: string) => void
  onCustomColorChange: (color: string) => void
  onApplyCustomColor: () => void
  onBorderRadiusChange: (value: BorderRadiusType) => void
  onOpacityChange: (value: number[]) => void
  onGlassEffectChange: (checked: boolean) => void
  onLayoutTypeChange: (type: LayoutType) => void
  onShowSidebarChange: (checked: boolean) => void
  onPageAnimationChange: (animation: AnimationType) => void
  onElderlyModeChange: (checked: boolean) => void
  onColoredNavigationChange: (checked: boolean) => void
}

export default function AppearanceTab({
  primaryColor,
  customColor,
  headerOpacity,
  glassEffect,
  layoutType,
  showSidebar,
  pageAnimation,
  elderlyMode,
  coloredNavigation,
  onColorChange,
  onCustomColorChange,
  onApplyCustomColor,
  onOpacityChange,
  onGlassEffectChange,
  onLayoutTypeChange,
  onShowSidebarChange,
  onPageAnimationChange,
  onElderlyModeChange,
  onColoredNavigationChange,
}: AppearanceTabProps) {
  return (
    <div className="space-y-6 py-4">
      {/* 布局设置 */}
      <LayoutSettings
        layoutType={layoutType}
        showSidebar={showSidebar}
        onLayoutTypeChange={onLayoutTypeChange}
        onShowSidebarChange={onShowSidebarChange}
      />

      {/* 主题色设置 */}
      <ThemeColorSettings
        primaryColor={primaryColor}
        customColor={customColor}
        onColorChange={onColorChange}
        onCustomColorChange={onCustomColorChange}
        onApplyCustomColor={onApplyCustomColor}
      />

      {/* 导航栏设置 */}
      <NavigationSettings
        headerOpacity={headerOpacity}
        glassEffect={glassEffect}
        coloredNavigation={coloredNavigation}
        onOpacityChange={onOpacityChange}
        onGlassEffectChange={onGlassEffectChange}
        onColoredNavigationChange={onColoredNavigationChange}
      />

      {/* 适老化模式 */}
      <ElderlyModeSettings elderlyMode={elderlyMode} onElderlyModeChange={onElderlyModeChange} />

      {/* 页面切换动画 */}
      <AnimationSettings pageAnimation={pageAnimation} onPageAnimationChange={onPageAnimationChange} />
    </div>
  )
}
