"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { LayoutType } from "@/types/settings"

interface LayoutTabProps {
  layoutType: LayoutType
  showSidebar: boolean
  onLayoutTypeChange: (type: LayoutType) => void
  onShowSidebarChange: (checked: boolean) => void
}

export default function LayoutTab({
  layoutType,
  showSidebar,
  onLayoutTypeChange,
  onShowSidebarChange,
}: LayoutTabProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">菜单布局</h3>
        <RadioGroup
          value={layoutType}
          onValueChange={(value) => onLayoutTypeChange(value as LayoutType)}
          className="grid grid-cols-1 gap-4"
        >
          <div className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value="vertical" id="layout-vertical" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="layout-vertical" className="font-medium">
                垂直菜单
              </Label>
              <div className="flex gap-4 mt-2">
                <div className="w-24 h-16 border rounded flex">
                  <div className="w-1/4 h-full bg-gray-100 border-r"></div>
                  <div className="flex-1 p-1">
                    <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                    <div className="h-2 w-3/4 bg-gray-100 rounded mb-1"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value="horizontal" id="layout-horizontal" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="layout-horizontal" className="font-medium">
                水平菜单
              </Label>
              <div className="flex gap-4 mt-2">
                <div className="w-24 h-16 border rounded flex flex-col">
                  <div className="h-4 bg-gray-100 border-b flex items-center justify-center">
                    <div className="flex w-3/4 justify-between">
                      <div className="h-1 w-2 bg-gray-400 rounded"></div>
                      <div className="h-1 w-2 bg-gray-400 rounded"></div>
                      <div className="h-1 w-2 bg-gray-400 rounded"></div>
                      <div className="h-1 w-2 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                  <div className="flex-1 p-1">
                    <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                    <div className="h-2 w-3/4 bg-gray-100 rounded mb-1"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value="double" id="layout-double" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="layout-double" className="font-medium">
                双列菜单
              </Label>
              <div className="flex gap-4 mt-2">
                <div className="w-24 h-16 border rounded flex">
                  <div className="w-1/6 h-full bg-gray-100 border-r"></div>
                  <div className="w-1/3 h-full bg-gray-50 border-r p-1">
                    <div className="h-1 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-1 w-full bg-gray-200 rounded mb-1"></div>
                  </div>
                  <div className="flex-1 p-1">
                    <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                    <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-sidebar">显示侧边栏</Label>
          <Switch id="show-sidebar" checked={showSidebar} onCheckedChange={onShowSidebarChange} />
        </div>
        <p className="text-sm text-muted-foreground">
          {layoutType === "horizontal" ? "水平布局下侧边栏不会显示" : "关闭后将隐藏侧边菜单栏，可通过顶部菜单按钮重新打开"}
        </p>
      </div>
    </div>
  )
}

