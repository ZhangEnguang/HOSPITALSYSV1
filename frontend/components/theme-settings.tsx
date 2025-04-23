"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { RotateCcw, Check } from "lucide-react"
import { useSettings } from "@/hooks/use-settings"
import AppearanceTab from "@/components/settings/appearance-tab"
import GeneralTab from "@/components/settings/general-tab"

interface ThemeSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ThemeSettings({ open, onOpenChange }: ThemeSettingsProps) {
  const {
    settings,
    tempSettings,
    mounted,
    handleColorChange,
    handleCustomColorChange,
    handleApplyCustomColor,
    handleOpacityChange,
    handleGlassEffectChange,
    handleLayoutTypeChange,
    handleShowSidebarChange,
    handleFontSizeChange,
    handleElderlyModeChange,
    handlePageAnimationChange,
    handleLanguageChange,
    handleColoredNavigationChange,
    handleReset,
    handleConfirm,
    handleCancel,
  } = useSettings()

  const [activeTab, setActiveTab] = useState("appearance")

  // 处理关闭事件，确保取消设置更改
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      handleCancel() // 如果关闭面板，取消更改
    }
    onOpenChange(isOpen)
  }

  // 确保在客户端渲染
  if (!mounted) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-[350px] max-w-[350px] overflow-y-auto"
        style={{ paddingBottom: "80px" }} // 留出底部固定按钮的空间
        hideOverlay={true}
      >
        <SheetHeader className="mb-4 flex flex-row items-center justify-start w-full">
          <SheetTitle className="text-left">个性化设置</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="appearance">外观</TabsTrigger>
            <TabsTrigger value="general">通用</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="mt-0">
            <AppearanceTab
              primaryColor={tempSettings.primaryColor}
              customColor={tempSettings.customColor}
              headerOpacity={tempSettings.headerOpacity}
              glassEffect={tempSettings.glassEffect}
              layoutType={tempSettings.layoutType}
              showSidebar={tempSettings.showSidebar}
              pageAnimation={tempSettings.pageAnimation}
              elderlyMode={tempSettings.elderlyMode}
              coloredNavigation={tempSettings.coloredNavigation}
              onColorChange={handleColorChange}
              onCustomColorChange={handleCustomColorChange}
              onApplyCustomColor={handleApplyCustomColor}
              onOpacityChange={handleOpacityChange}
              onGlassEffectChange={handleGlassEffectChange}
              onLayoutTypeChange={handleLayoutTypeChange}
              onShowSidebarChange={handleShowSidebarChange}
              onPageAnimationChange={handlePageAnimationChange}
              onElderlyModeChange={handleElderlyModeChange}
              onColoredNavigationChange={handleColoredNavigationChange}
            />
          </TabsContent>

          <TabsContent value="general" className="mt-0">
            <GeneralTab
              fontSize={tempSettings.fontSize}
              elderlyMode={tempSettings.elderlyMode}
              language={tempSettings.language}
              onFontSizeChange={handleFontSizeChange}
              onElderlyModeChange={handleElderlyModeChange}
              onLanguageChange={handleLanguageChange}
            />
          </TabsContent>
        </Tabs>

        {/* 底部固定的确认和取消按钮 */}
        <div className="fixed bottom-0 right-0 w-[350px] p-4 bg-background border-t border-border flex justify-between z-10">
          <Button variant="outline" onClick={handleReset} className="w-[30%]">
            <RotateCcw className="h-4 w-4 mr-2" />
            重置
          </Button>
          <Button
            onClick={() => {
              handleConfirm()
              onOpenChange(false)
            }}
            className="w-[65%]"
          >
            <Check className="h-4 w-4 mr-2" />
            确定
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
