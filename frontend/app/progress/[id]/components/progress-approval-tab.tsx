"use client"

import { CheckCircle, XCircle, Clock, User, Calendar, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ProgressApprovalTabProps {
  data: any
}

export default function ProgressApprovalTab({ data }: ProgressApprovalTabProps) {
  // 获取状态对应的图标
  const getStatusIcon = (action: string) => {
    if (action.includes("通过")) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (action.includes("退回") || action.includes("拒绝")) {
      return <XCircle className="h-5 w-5 text-red-500" />
    } else {
      return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  // 获取状态对应的颜色
  const getStatusColor = (action: string) => {
    if (action.includes("通过")) {
      return "bg-green-50 text-green-700 border-green-200"
    } else if (action.includes("退回") || action.includes("拒绝")) {
      return "bg-red-50 text-red-700 border-red-200"
    } else {
      return "bg-blue-50 text-blue-700 border-blue-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* 当前审批状态 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">当前审批状态</CardTitle>
          <CardDescription>项目进度变更的审批状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {data.approvalStatus === "已通过" ? (
              <div className="p-3 bg-green-50 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            ) : data.approvalStatus === "已退回" ? (
              <div className="p-3 bg-red-50 rounded-full">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-full">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-medium">
                {data.approvalStatus}
              </h3>
              <p className="text-sm text-muted-foreground">
                {data.approvalStatus === "已通过" 
                  ? "您的项目进度变更申请已获批准" 
                  : data.approvalStatus === "已退回" 
                    ? "您的项目进度变更申请已被退回" 
                    : "您的项目进度变更申请正在审核中"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 审批历史 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">审批历史</CardTitle>
          <CardDescription>项目进度变更的审批流程记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 border-l border-slate-200">
            {data.approvalHistory && data.approvalHistory.length > 0 ? (
              <div className="space-y-6">
                {data.approvalHistory.map((history: any, index: number) => (
                  <div key={index} className="relative">
                    {/* 时间线节点 */}
                    <div className="absolute -left-[25px] p-1 bg-white border border-slate-200 rounded-full">
                      {getStatusIcon(history.action)}
                    </div>
                    
                    {/* 内容 */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Badge className={getStatusColor(history.action)}>
                            {history.action}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{history.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{history.user}</span>
                      </div>
                      
                      {history.comment && (
                        <div className="mt-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>审批意见：</span>
                          </div>
                          <div className="p-3 bg-white rounded border border-slate-200 text-sm">
                            {history.comment}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-6 text-muted-foreground text-sm">
                <span>暂无审批记录</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 下一步操作 */}
      {data.approvalStatus === "待审核" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">下一步操作</CardTitle>
            <CardDescription>项目进度变更的后续处理</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-700 mb-2">等待审批中</h4>
              <p className="text-sm text-blue-600">您的项目进度变更申请已提交，正在等待相关负责人审批。审批完成后，您将收到通知。</p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.approvalStatus === "已退回" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">下一步操作</CardTitle>
            <CardDescription>项目进度变更的后续处理</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <h4 className="text-sm font-medium text-red-700 mb-2">需要修改</h4>
              <p className="text-sm text-red-600">您的项目进度变更申请已被退回，请根据审批意见修改后重新提交。</p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.approvalStatus === "已通过" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">下一步操作</CardTitle>
            <CardDescription>项目进度变更的后续处理</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="text-sm font-medium text-green-700 mb-2">审批已通过</h4>
              <p className="text-sm text-green-600">您的项目进度变更申请已获批准，请按照新的进度计划执行项目。</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
