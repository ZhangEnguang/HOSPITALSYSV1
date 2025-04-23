"use client"

import { Calendar, Clock, FileText, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AISummary from "./ai-summary"

interface ProgressOverviewTabProps {
  data: any
}

export default function ProgressOverviewTab({ data }: ProgressOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI摘要 */}
      <AISummary projectData={data} />
      
      {/* 变更基本信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">变更基本信息</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">变更类型</div>
              <div className="flex items-center">
                <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                  {data.changeType}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">申请人</div>
              <div className="text-sm">{data.applicant}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">所属部门</div>
              <div className="text-sm">{data.department}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">申请日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{data.approvalHistory?.[0]?.date || "未知"}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">原计划结束日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{data.originalEndDate}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">新计划结束日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{data.newEndDate}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 变更原因 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">变更原因</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">变更说明</div>
              <p className="text-sm text-gray-700">{data.reason}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 变更影响 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">变更影响</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">进度影响</div>
              <p className="text-sm text-gray-700">{data.impact}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 附件列表 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">附件</span>
          </div>
          {data.attachments && data.attachments.length > 0 ? (
            <div className="space-y-3">
              {data.attachments.map((attachment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">{attachment.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">{attachment.size}</span>
                    <span className="text-xs text-slate-500">{attachment.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 text-muted-foreground text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>暂无附件</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
