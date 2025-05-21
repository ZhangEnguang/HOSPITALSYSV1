"use client"

import React from "react"
import { X, Sparkles, LineChart, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AIReviewReminderProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStartAIReview: () => void
  onContinueSubmit: () => void
}

export function AIReviewReminder({
  isOpen,
  onOpenChange,
  onStartAIReview,
  onContinueSubmit
}: AIReviewReminderProps) {
  // 处理启动AI审查
  const handleStartAIReview = () => {
    onStartAIReview()
    onOpenChange(false)
  }
  
  // 处理继续提交
  const handleContinueSubmit = () => {
    onContinueSubmit()
    onOpenChange(false)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="pt-4 pb-2">
          <div className="flex-1 flex items-center mb-4">
            <div className="mr-4 text-blue-500">
              <div className="rounded-full bg-blue-100 p-2">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-700">AI预检可减少60%退回率</h3>
              <p className="text-sm text-slate-600 mt-1">建议在提交前进行AI形式审查，快速发现并修复问题</p>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="ml-auto -mr-1 flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className={cn(
              "relative overflow-hidden rounded-lg border p-3",
              "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
            )}>
              <h4 className="font-medium text-sm text-blue-800 mb-1.5">智能预检优势</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <LineChart className="h-3.5 w-3.5 text-blue-600 mt-0.5" />
                  <span>加快审批速度，减少来回修改</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 mt-0.5" />
                  <span>智能检查命名、格式、内容合规</span>
                </li>
              </ul>
              <div className="absolute -right-3 -bottom-3 opacity-10">
                <Sparkles className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            
            <div className={cn(
              "relative overflow-hidden rounded-lg border p-3",
              "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
            )}>
              <h4 className="font-medium text-sm text-amber-800 mb-1.5">直接提交风险</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5" />
                  <span>可能因格式错误被退回修改</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5" />
                  <span>审核周期延长，影响项目进度</span>
                </li>
              </ul>
              <div className="absolute -right-3 -bottom-3 opacity-10">
                <AlertTriangle className="h-16 w-16 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row-reverse border-t border-slate-100 pt-4">
          <Button 
            onClick={handleStartAIReview} 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            启用AI形式审查
          </Button>
          <Button 
            onClick={handleContinueSubmit} 
            variant="outline" 
            className="w-full sm:w-auto mt-2 sm:mt-0"
          >
            继续提交送审
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 