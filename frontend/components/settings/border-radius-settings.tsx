// 创建新文件，拆分界面圆角设置
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BorderRadiusType } from "@/types/settings"
import { BORDER_RADIUS_OPTIONS } from "@/hooks/use-settings"

interface BorderRadiusSettingsProps {
  borderRadius: BorderRadiusType
  onBorderRadiusChange: (value: BorderRadiusType) => void
}

export default function BorderRadiusSettings({ borderRadius, onBorderRadiusChange }: BorderRadiusSettingsProps) {
  return (
    <div className="space-y-3 pt-4 border-t">
      <h3 className="text-sm font-medium">界面圆角</h3>
      <Select value={borderRadius} onValueChange={(value) => onBorderRadiusChange(value as BorderRadiusType)}>
        <SelectTrigger className="w-full z-10">
          <SelectValue placeholder="选择圆角大小" />
        </SelectTrigger>
        <SelectContent className="z-50">
          {BORDER_RADIUS_OPTIONS.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name} ({option.value}px)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

