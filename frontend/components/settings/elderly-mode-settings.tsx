// 创建新文件，拆分适老化模式设置
"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ElderlyModeSettingsProps {
  elderlyMode: boolean
  onElderlyModeChange: (checked: boolean) => void
}

export default function ElderlyModeSettings({ elderlyMode, onElderlyModeChange }: ElderlyModeSettingsProps) {
  return (
    <div className="space-y-3 pt-4 border-t">
      <h3 className="text-sm font-medium">辅助功能</h3>
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="elderly-mode" className="block">
            适老化模式
          </Label>
          <p className="text-xs text-muted-foreground mt-1">增大字体、提高对比度、增强边框</p>
        </div>
        <Switch id="elderly-mode" checked={elderlyMode} onCheckedChange={onElderlyModeChange} />
      </div>
    </div>
  )
}

