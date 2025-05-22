"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lightbulb, Check, FileCheck, BarChart3, TrendingDown } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AIFormCheckGuideProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onContinue: () => void
}

// 本地存储键名
const AI_GUIDE_SHOWN_KEY = "ai_form_check_guide_shown"

export function AIFormCheckGuide({ isOpen, onOpenChange, onContinue }: AIFormCheckGuideProps) {
  const [showNextTime, setShowNextTime] = useState(true)
  
  // 处理引导完成
  const handleContinue = () => {
    // 【演示版本】暂时注释掉 localStorage 存储，使每次都显示引导
    // TODO: 实际上线前需要恢复下方代码逻辑
    /*
    // 如果用户选择不再显示，将状态存入localStorage
    if (!showNextTime) {
      try {
        localStorage.setItem(AI_GUIDE_SHOWN_KEY, "true")
      } catch (error) {
        console.error("无法保存用户偏好设置:", error)
      }
    }
    */
    
    onContinue()
    onOpenChange(false)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2 text-blue-600">
            <Lightbulb className="h-5 w-5" />
            AI形式审查助手
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600">
            智能检查您的送审文件，提前发现并修复问题
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-2">
          {/* 功能介绍卡片 */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <h3 className="font-medium text-blue-800 mb-3 text-base">AI形式审查能帮您：</h3>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <FileCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-slate-700">自动检查文件命名、格式和版本要求</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-slate-700">提供送审文件合规性分析和修改建议</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-slate-700">平均减少<span className="text-blue-600 font-medium">60%</span>的退回率，加快审批流程</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 使用步骤 */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-medium text-slate-800 mb-3 text-base">使用方法：</h3>
            <div className="space-y-2.5 ml-1">
              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-medium">1</div>
                <p className="text-slate-700">上传送审文件</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-medium">2</div>
                <p className="text-slate-700">点击「AI形式审查」按钮</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-medium">3</div>
                <p className="text-slate-700">根据AI建议修改文件问题</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-medium">4</div>
                <p className="text-slate-700">完成修改后点击「提交送审」</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 sm:justify-between sm:gap-0 border-t border-slate-100 pt-4 mt-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-next-time" 
              checked={showNextTime}
              onCheckedChange={setShowNextTime}
            />
            <Label htmlFor="show-next-time" className="text-sm text-slate-600">下次继续显示</Label>
          </div>
          
          <Button onClick={handleContinue} className="w-full sm:w-auto">
            <Check className="mr-2 h-4 w-4" />
            开始使用
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 检查是否应该显示引导
export function shouldShowAIGuide(): boolean {
  // 【演示版本】返回 false，避免每次自动显示引导
  // TODO: 实际上线前需要根据用户偏好决定是否显示
  return false;
  
  /*
  if (typeof window === "undefined") return true
  
  try {
    const hasShown = localStorage.getItem(AI_GUIDE_SHOWN_KEY)
    return hasShown !== "true"
  } catch (error) {
    console.error("无法读取用户偏好设置:", error)
    return true
  }
  */
} 