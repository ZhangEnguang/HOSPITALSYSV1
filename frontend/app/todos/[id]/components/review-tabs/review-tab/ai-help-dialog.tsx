"use client"

import { Bot, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface AIHelpDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function AIHelpDialog({ isOpen, onOpenChange }: AIHelpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="h-5 w-5 text-blue-500 mr-2" />
            AI辅助写作帮助
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-sm font-medium text-blue-700 mb-2">如何使用AI辅助写作</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>在输入框获得焦点时，点击"AI帮我写"按钮自动生成审核意见</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>选中文本后，可以使用"帮我润色一下"或"重新写"功能</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>AI生成内容后，可以选择应用、重写或取消生成的内容</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-sm font-medium text-slate-700 mb-2">AI辅助写作提示</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start">
                <RefreshCw className="h-4 w-4 text-slate-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>AI会根据项目内容自动分析并生成专业的审核意见</span>
              </li>
              <li className="flex items-start">
                <RefreshCw className="h-4 w-4 text-slate-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>您可以随时编辑或修改AI生成的内容</span>
              </li>
              <li className="flex items-start">
                <RefreshCw className="h-4 w-4 text-slate-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>当输入框为空时，"AI帮我写"按钮会自动显示</span>
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>我知道了</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

