// 创建新文件，拆分主题色设置
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ThemeColor } from "@/types/settings"

interface ThemeColorSettingsProps {
  primaryColor: string
  customColor: string
  onColorChange: (color: string) => void
  onCustomColorChange: (color: string) => void
  onApplyCustomColor: () => void
}

export default function ThemeColorSettings({
  primaryColor,
  customColor,
  onColorChange,
  onCustomColorChange,
  onApplyCustomColor,
}: ThemeColorSettingsProps) {
  const themeColors: ThemeColor[] = [
    { id: "blue", name: "蓝色", value: "#2156FF" },
    { id: "red", name: "红色", value: "#CD2B25" },
    { id: "green", name: "绿色", value: "#16A468" },
    { id: "purple", name: "紫色", value: "#670775" },
    { id: "orange", name: "橙色", value: "#F59E0B" },
    { id: "pink", name: "粉色", value: "#EC4899" },
    { id: "cyan", name: "青色", value: "#06B6D4" },
    { id: "indigo", name: "靛蓝", value: "#4F46E5" },
    { id: "teal", name: "蓝绿", value: "#14B8A6" },
    { id: "amber", name: "琥珀", value: "#D97706" },
    { id: "lime", name: "青柠", value: "#65A30D" },
    { id: "gray", name: "灰色", value: "#0F172A" },
  ]

  return (
    <div className="space-y-3 pt-4 border-t">
      <h3 className="text-sm font-medium">选择主题色</h3>
      <div className="flex flex-wrap gap-2">
        {themeColors.map((color) => (
          <div
            key={color.id}
            className={cn(
              "h-8 w-8 rounded-full cursor-pointer flex items-center justify-center",
              primaryColor === color.value && "ring-2 ring-primary ring-offset-2",
            )}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorChange(color.value)}
          >
            {primaryColor === color.value && <div className="h-2 w-2 rounded-full bg-white" />}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={customColor}
          onChange={(e) => onCustomColorChange(e.target.value)}
          className="flex-1 h-9"
          placeholder="自定义颜色"
        />
        <input
          type="color"
          value={customColor}
          onChange={(e) => onCustomColorChange(e.target.value)}
          className="h-9 w-9 rounded border p-1"
        />
        <Button variant="outline" size="sm" onClick={onApplyCustomColor}>
          应用
        </Button>
      </div>
    </div>
  )
}

