"use client"

import { ArrowLeft, CheckCircle, Clock, GitBranch, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ResultDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
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
  projectTitle,
  commentText,
  onViewDetails,
  onBackToList,
}: ResultDialogProps) {
  // 获取当前日期和时间
  const currentDate = new Date().toLocaleDateString()
  const currentTime = new Date().toLocaleTimeString()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex flex-col items-center py-4">
          <div className={`p-4 rounded-full ${resultAction === "approval" ? "bg-green-50" : "bg-amber-50"} mb-4`}>
            {resultAction === "approval" ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-amber-500" />
            )}
          </div>

          <h2 className="text-xl font-semibold text-center mb-2">
            {resultAction === "approval" ? "审核已通过" : "已退回修改"}
          </h2>

          <p className="text-center text-gray-500 mb-6">
            {resultAction === "approval"
              ? `您已成功批准「${projectTitle || "项目申请"}」的申请`
              : `您已将「${projectTitle || "项目申请"}」退回等待修改`}
          </p>

          {/* 审核流程可视化 */}
          <div className="w-full mb-6 border border-slate-100 rounded-lg p-4 bg-white">
            <h3 className="font-medium text-slate-800 mb-3 flex items-center">
              <GitBranch className="h-4 w-4 mr-2 text-blue-500" />
              审核流程
            </h3>

            <div className="flex items-center w-full">
              {/* Step 1: Submission */}
              <div className="flex flex-col items-center flex-1 relative">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border z-10 bg-green-50 border-green-200 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="mt-2 text-center">
                  <h4 className="text-xs font-medium text-slate-800">提交申请</h4>
                  <p className="text-[10px] text-slate-500">{currentDate}</p>
                </div>
                {/* Connector line */}
                <div className="absolute top-4 left-[50%] w-[calc(100%-16px)] h-0.5 bg-green-200"></div>
              </div>

              {/* Step 2: Current Review */}
              <div className="flex flex-col items-center flex-1 relative">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border z-10 ${resultAction === "approval" ? "bg-green-50 border-green-200 text-green-500" : "bg-amber-50 border-amber-200 text-amber-500"}`}
                >
                  {resultAction === "approval" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </div>
                <div className="mt-2 text-center">
                  <h4 className="text-xs font-medium text-slate-800">管理员审核</h4>
                  <p className="text-[10px] text-slate-500">{currentTime}</p>
                </div>
                {/* Connector line */}
                <div className="absolute top-4 left-[50%] w-[calc(100%-16px)] h-0.5 bg-slate-200"></div>
              </div>

              {/* Step 3: Next Review */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border z-10 bg-slate-50 border-slate-200 text-slate-300">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="mt-2 text-center">
                  <h4 className="text-xs font-medium text-slate-400">下一步审核</h4>
                  <p className="text-[10px] text-slate-400">待处理</p>
                </div>
              </div>
            </div>

            {/* Status details */}
            <div className="mt-4 p-3 rounded-md text-xs bg-blue-50/50 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium">当前状态：</span>
                  <span className={resultAction === "approval" ? "text-green-600" : "text-amber-600"}>
                    {resultAction === "approval" ? "已通过" : "已退回"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">操作人：</span>
                  <span>当前用户</span>
                </div>
              </div>
              {commentText && (
                <div>
                  <span className="font-medium">审核意见：</span>
                  <span className="text-slate-600">
                    {commentText.length > 50 ? `${commentText.substring(0, 50)}...` : commentText}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1" onClick={onBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>

            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                // 确保状态更新
                if (resultAction === "approval") {
                  // 触发全局事件以更新状态
                  const event = new CustomEvent("updateProjectStatus", {
                    detail: { status: "已通过", label: "管理员审核通过" },
                  })
                  window.dispatchEvent(event)
                } else {
                  // 触发全局事件以更新状态
                  const event = new CustomEvent("updateProjectStatus", {
                    detail: { status: "已退回", label: "管理员审核退回" },
                  })
                  window.dispatchEvent(event)
                }
                onViewDetails()
              }}
            >
              查看详情
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

