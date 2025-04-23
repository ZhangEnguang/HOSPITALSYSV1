"use client"

import { Bot, Sparkles, CheckCircle, XCircle, Lightbulb } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AIHelpDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AIHelpDialog({ isOpen, onOpenChange }: AIHelpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Bot className="h-5 w-5 text-blue-500" />
            AI辅助写作帮助
          </DialogTitle>
          <DialogDescription className="text-slate-500 mt-1">
            AI可以帮助您快速生成审核意见，提高工作效率
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI辅助功能介绍
            </h3>
            <p className="text-sm text-blue-700">
              在审核意见输入框中，点击"AI辅助"按钮，可以使用AI自动生成审核意见。系统会根据项目内容和您选择的审核类型，生成专业、规范的审核意见文本。
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-slate-800">AI可以生成三种类型的审核意见：</h3>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="mt-0.5">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">通过意见</h4>
                <p className="text-sm text-green-700 mt-1">
                  生成积极正面的审核意见，适用于项目符合要求，可以直接通过的情况。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="mt-0.5">
                <XCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-amber-800">退回意见</h4>
                <p className="text-sm text-amber-700 mt-1">
                  生成指出问题并提供修改建议的审核意见，适用于项目需要修改完善后重新提交的情况。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="mt-0.5">
                <Lightbulb className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800">建议意见</h4>
                <p className="text-sm text-blue-700 mt-1">
                  生成中性的建议性审核意见，提供改进方向但不明确通过或退回，适用于需要项目组参考但不强制修改的情况。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-medium text-slate-800 mb-2">使用提示</h3>
            <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
              <li>AI生成的内容仅供参考，您可以根据实际情况进行修改</li>
              <li>生成过程中可以随时点击"停止生成"按钮终止</li>
              <li>您可以在生成的内容基础上继续编辑和完善</li>
              <li>如果输入框已有内容，AI生成的内容将追加在后面</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="mt-4 pt-3 border-t border-slate-100">
          <Button onClick={() => onOpenChange(false)}>我知道了</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
