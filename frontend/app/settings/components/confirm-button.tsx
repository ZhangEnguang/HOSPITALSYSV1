"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/hooks/use-settings"
import { Check, X } from "lucide-react"

export function ConfirmButton() {
  const { settings, tempSettings, handleConfirm, handleCancel } = useSettings()
  const [isVisible, setIsVisible] = useState(false)

  // 检查设置是否已更改
  useEffect(() => {
    // 将对象转换为字符串进行比较
    const settingsStr = JSON.stringify(settings)
    const tempSettingsStr = JSON.stringify(tempSettings)

    // 如果设置已更改，显示确认按钮
    setIsVisible(settingsStr !== tempSettingsStr)
  }, [settings, tempSettings])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 bg-background/80 backdrop-blur-sm border-t">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleCancel} className="flex items-center gap-1">
          <X className="h-4 w-4" />
          <span>取消</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleConfirm}
          className="flex items-center gap-1 bg-primary text-primary-foreground"
        >
          <Check className="h-4 w-4" />
          <span>确认更改</span>
        </Button>
      </div>
    </div>
  )
}

