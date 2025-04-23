"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export type ReviewSidebarProps = {
  status: string
  getStatusColor: (status: string) => string
  projectId: string
  projectTitle: string
  onStatusChange?: (newStatus: string) => void
  width?: number
  children?: ReactNode
}

export default function ReviewSidebar({
  status,
  getStatusColor,
  projectId,
  projectTitle,
  onStatusChange,
  width = 370,
  children
}: ReviewSidebarProps) {
  const [reviewComment, setReviewComment] = useState("")

  // 处理审核通过
  const handleApprove = () => {
    if (onStatusChange) {
      onStatusChange("已通过")
    }
    
    // 触发自定义事件，通知父组件状态已更改
    const event = new CustomEvent("updateProjectStatus", {
      detail: { status: "已通过", label: "管理员审核通过" }
    })
    window.dispatchEvent(event)
  }

  // 处理审核退回
  const handleReject = () => {
    if (onStatusChange) {
      onStatusChange("已退回")
    }
    
    // 触发自定义事件，通知父组件状态已更改
    const event = new CustomEvent("updateProjectStatus", {
      detail: { status: "已退回", label: "管理员审核退回" }
    })
    window.dispatchEvent(event)
  }

  return (
    <div 
      className="fixed top-0 right-0 h-screen bg-white border-l overflow-y-auto p-6 shadow-md"
      style={{ width: `${width}px` }}
    >
      <h2 className="text-lg font-semibold mb-6">审核信息</h2>

      {/* 项目信息 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">项目信息</h3>
        <div className="bg-slate-50 p-3 rounded-md">
          <p className="text-sm font-medium mb-1">项目编号: {projectId}</p>
          <p className="text-sm font-medium mb-1">项目名称: {projectTitle}</p>
          <p className="text-sm font-medium flex items-center">
            <span className="mr-2">当前状态:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(status)}`}>
              {status || "待审核"}
            </span>
          </p>
        </div>
      </div>

      {/* 审核意见 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">审核意见</h3>
        <Textarea
          placeholder="请输入审核意见..."
          className="resize-none mb-4"
          rows={5}
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
        />
      </div>

      {/* 自定义内容 */}
      {children}

      {/* 审核操作按钮 */}
      <div className="flex flex-col gap-3 mt-8">
        <Button 
          variant="default" 
          className="w-full" 
          onClick={handleApprove}
          disabled={status === "已通过"}
        >
          通过
        </Button>
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={handleReject}
          disabled={status === "已退回"}
        >
          退回
        </Button>
      </div>
    </div>
  )
}
