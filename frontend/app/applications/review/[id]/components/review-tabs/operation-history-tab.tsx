"use client"
import { Badge } from "@/components/ui/badge"

interface OperationHistoryTabProps {
  operationHistory?: Array<{
    date: string
    user: string
    action: string
    detail: string
  }>
}

export default function OperationHistoryTab({
  operationHistory = [
    { date: "2024-03-18", user: "王经理", action: "修改", detail: "更新了项目预算" },
    { date: "2024-03-10", user: "李研究员", action: "添加", detail: "上传了研究报告" },
    { date: "2024-02-28", user: "张主任", action: "分配", detail: "将任务分配给李研究员" },
    { date: "2024-02-15", user: "系统", action: "提醒", detail: "项目进度落后提醒" },
    { date: "2024-02-01", user: "赵经理", action: "更新", detail: "更新了项目时间线" },
  ],
}: OperationHistoryTabProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case "修改":
        return "bg-amber-100 text-amber-800"
      case "添加":
        return "bg-green-100 text-green-800"
      case "分配":
        return "bg-blue-100 text-blue-800"
      case "提醒":
        return "bg-red-100 text-red-800"
      case "更新":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-4">
      {operationHistory.length > 0 ? (
        operationHistory.map((item, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.user}</span>
                <Badge variant="outline" className={getActionColor(item.action)}>
                  {item.action}
                </Badge>
              </div>
              <span className="text-xs text-slate-500">{item.date}</span>
            </div>
            <p className="text-sm text-slate-700">{item.detail}</p>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-slate-500">暂无操作记录</div>
      )}
    </div>
  )
}

