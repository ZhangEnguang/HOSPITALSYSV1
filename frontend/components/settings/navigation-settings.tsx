// 创建新文件，拆分导航栏设置
"use client"

import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface NavigationSettingsProps {
  headerOpacity: number
  glassEffect: boolean
  coloredNavigation: boolean
  onOpacityChange: (value: number[]) => void
  onGlassEffectChange: (checked: boolean) => void
  onColoredNavigationChange: (checked: boolean) => void
}

export default function NavigationSettings({
  headerOpacity,
  glassEffect,
  coloredNavigation,
  onOpacityChange,
  onGlassEffectChange,
  onColoredNavigationChange,
}: NavigationSettingsProps) {
  return (
    <div className="space-y-3 pt-4 border-t">
      <h3 className="text-sm font-medium">导航栏设置</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>背景透明度: {headerOpacity}%</Label>
        </div>
        <Slider value={[headerOpacity]} min={0} max={100} step={5} onValueChange={onOpacityChange} />

        <div className="flex items-center justify-between mt-2">
          <Label htmlFor="glass-effect">毛玻璃效果</Label>
          <Switch id="glass-effect" checked={glassEffect} onCheckedChange={onGlassEffectChange} />
        </div>

        <div className="flex items-center justify-between mt-2">
          <Label htmlFor="colored-navigation">彩色导航栏</Label>
          <Switch id="colored-navigation" checked={coloredNavigation} onCheckedChange={onColoredNavigationChange} />
        </div>
      </div>
    </div>
  )
}

