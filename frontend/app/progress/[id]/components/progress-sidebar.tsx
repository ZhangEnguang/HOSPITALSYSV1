"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Clock, AlertCircle, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ProgressSidebarProps {
  data: any
}

export default function ProgressSidebar({ data }: ProgressSidebarProps) {
  const [reviewComment, setReviewComment] = useState("")

  // 处理审批通过
  const handleApprove = () => {
    alert("已通过审批")
  }

  // 处理审批退回
  const handleReject = () => {
    alert("已退回申请")
  }

  return (
    <div className="space-y-6">
      {/* 状态卡片 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {data.approvalStatus === "已通过" ? (
              <div className="p-2 bg-green-50 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            ) : data.approvalStatus === "已退回" ? (
              <div className="p-2 bg-red-50 rounded-full">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            ) : (
              <div className="p-2 bg-amber-50 rounded-full">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            )}
            <div>
              <div className="text-sm font-medium">当前状态</div>
              <div className="text-lg font-semibold">{data.approvalStatus}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目信息 */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">项目信息</h3>
        <div className="bg-slate-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">项目编号</span>
            <span className="text-sm font-medium">{data.id}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">申请人</span>
            <span className="text-sm font-medium">{data.applicant}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">所属部门</span>
            <span className="text-sm font-medium">{data.department}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">变更类型</span>
            <span className="text-sm font-medium">{data.changeType}</span>
          </div>
        </div>
      </div>

      {/* 变更时间 */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">变更时间</h3>
        <div className="bg-slate-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">原计划结束</span>
            <span className="text-sm font-medium">{data.originalEndDate}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">新计划结束</span>
            <span className="text-sm font-medium">{data.newEndDate}</span>
          </div>
        </div>
      </div>

      {/* 附件列表 */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">附件</h3>
        {data.attachments && data.attachments.length > 0 ? (
          <div className="space-y-2">
            {data.attachments.map((attachment: any, index: number) => (
              <div key={index} className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm truncate max-w-[150px]">{attachment.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{attachment.size}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground">暂无附件</span>
          </div>
        )}
      </div>

      {/* 审批操作 - 仅在待审核状态显示 */}
      {data.approvalStatus === "待审核" && (
        <>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">审批意见</h3>
            <Textarea
              placeholder="请输入审批意见..."
              className="resize-none"
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              variant="default" 
              className="w-full" 
              onClick={handleApprove}
            >
              通过
            </Button>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleReject}
            >
              退回
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
