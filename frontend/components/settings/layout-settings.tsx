// 创建新文件，拆分布局设置
"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { LayoutType } from "@/types/settings"

interface LayoutSettingsProps {
  layoutType: LayoutType
  showSidebar: boolean
  onLayoutTypeChange: (type: LayoutType) => void
  onShowSidebarChange: (checked: boolean) => void
}

export default function LayoutSettings({
  layoutType,
  showSidebar,
  onLayoutTypeChange,
  onShowSidebarChange,
}: LayoutSettingsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">菜单布局</h3>
      <RadioGroup
        value={layoutType}
        onValueChange={(value) => onLayoutTypeChange(value as LayoutType)}
        className="grid grid-cols-3 gap-3"
      >
        <Label
          htmlFor="layout-vertical"
          className="cursor-pointer flex flex-col items-center space-y-2 rounded-md border p-2 hover:bg-accent"
        >
          <div className="w-full aspect-video flex flex-col">
            <div className="h-2 w-full bg-gray-200 mb-1"></div>
            <div className="flex-1 flex">
              <div className="w-1/4 bg-gray-100"></div>
              <div className="flex-1"></div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vertical" id="layout-vertical" />
            <span className="text-xs">垂直</span>
          </div>
        </Label>

        <Label
          htmlFor="layout-horizontal"
          className="cursor-pointer flex flex-col items-center space-y-2 rounded-md border p-2 hover:bg-accent"
        >
          <div className="w-full aspect-video flex flex-col">
            <div className="h-4 w-full bg-gray-200 mb-1 flex items-center">
              <div className="h-2 w-2/3 mx-auto flex">
                <div className="w-1/6 bg-gray-100 mr-1"></div>
                <div className="w-1/6 bg-gray-100 mr-1"></div>
                <div className="w-1/6 bg-gray-100 mr-1"></div>
                <div className="w-1/6 bg-gray-100 mr-1"></div>
                <div className="w-1/6 bg-gray-100"></div>
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="horizontal" id="layout-horizontal" />
            <span className="text-xs">水平</span>
          </div>
        </Label>

        <Label
          htmlFor="layout-double"
          className="cursor-pointer flex flex-col items-center space-y-2 rounded-md border p-2 hover:bg-accent"
        >
          <div className="w-full aspect-video flex flex-col">
            <div className="h-2 w-full bg-gray-200 mb-1"></div>
            <div className="flex-1 flex">
              <div className="w-1/12 bg-gray-200"></div>
              <div className="w-1/4 bg-gray-100"></div>
              <div className="flex-1"></div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="double" id="layout-double" />
            <span className="text-xs">双列</span>
          </div>
        </Label>
      </RadioGroup>

      <div className="flex items-center justify-between mt-2">
        <Label htmlFor="show-sidebar">显示侧边栏</Label>
        <Switch id="show-sidebar" checked={showSidebar} onCheckedChange={onShowSidebarChange} />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {layoutType === "horizontal" ? "水平布局下侧边栏不会显示" : "关闭后将隐藏侧边菜单栏，可通过顶部菜单按钮重新打开"}
      </p>
    </div>
  )
}

