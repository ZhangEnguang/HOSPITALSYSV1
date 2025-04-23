"use client"

import { CheckCircle, XCircle, FileText, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ResultDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  resultAction: "approval" | "rejection"
  projectTitle?: string
  commentText: string
  onViewDetails: () => void
  onBackToList: () => void
}

export function ResultDialog({
  isOpen,
  onOpenChange,
  resultAction,
  projectTitle = "项目",
  commentText,
  onViewDetails,
  onBackToList,
}: ResultDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div
          className={`p-6 ${
            resultAction === "approval" ? "bg-green-50" : "bg-amber-50"
          } flex items-center justify-center flex-col`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              resultAction === "approval" ? "bg-green-100" : "bg-amber-100"
            }`}
          >
            {resultAction === "approval" ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-amber-600" />
            )}
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            {resultAction === "approval" ? "审核通过" : "退回修改"}
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            {resultAction === "approval"
              ? `您已成功审核通过"${projectTitle}"`
              : `您已将"${projectTitle}"退回修改`}
          </DialogDescription>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-800 mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-slate-500" />
              审核意见
            </h4>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-700">
              {commentText || (resultAction === "approval" ? "研究方向符合学校重点发展领域，同意立项" : "研究方案需要进一步完善，请修改后重新提交")}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <Button
              variant="outline"
              onClick={onBackToList}
              className="w-full sm:w-auto order-2 sm:order-1 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              返回列表
            </Button>
            <Button
              onClick={onViewDetails}
              className={`w-full sm:w-auto order-1 sm:order-2 ${
                resultAction === "approval"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              查看详情
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
