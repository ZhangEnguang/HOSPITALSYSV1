// 创建新文件，拆分页面切换动画设置
"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { AnimationType } from "@/types/settings"

interface AnimationSettingsProps {
  pageAnimation: AnimationType
  onPageAnimationChange: (animation: AnimationType) => void
}

export default function AnimationSettings({ pageAnimation, onPageAnimationChange }: AnimationSettingsProps) {
  const animations = [
    { id: "fade", name: "淡入淡出" },
    { id: "slide", name: "滑动" },
    { id: "zoom", name: "缩放" },
    { id: "none", name: "无动画" },
  ]

  return (
    <div className="space-y-3 pt-4 border-t">
      <h3 className="text-sm font-medium">页面切换动画</h3>
      <RadioGroup
        value={pageAnimation}
        onValueChange={(value) => onPageAnimationChange(value as AnimationType)}
        className="grid grid-cols-2 gap-2"
      >
        {animations.map((animation) => (
          <Label
            key={animation.id}
            htmlFor={`animation-${animation.id}`}
            className={cn(
              "flex items-center space-x-2 rounded-md border p-2 cursor-pointer transition-colors",
              "hover:bg-accent",
              pageAnimation === animation.id && "border-primary",
            )}
            onClick={() => onPageAnimationChange(animation.id as AnimationType)}
          >
            <RadioGroupItem value={animation.id} id={`animation-${animation.id}`} />
            <span className="cursor-pointer">{animation.name}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}

