"use client"
import { Badge } from "@/components/ui/badge"

interface ReviewHistoryTabProps {
  reviewHistory?: Array<{
    date: string
    user: string
    action: string
    comment: string
  }>
}

export default function ReviewHistoryTab({
  reviewHistory = [
    { date: "2024-03-15", user: "张主任", action: "已审核", comment: "项目进展顺利，继续保持" },
    { date: "2024-02-20", user: "李经理", action: "已提交", comment: "提交月度进展报告" },
    { date: "2024-01-10", user: "系统", action: "已创建", comment: "项目创建成功" },
    { date: "2023-12-25", user: "王总监", action: "已批准", comment: "项目立项已批准" },
    { date: "2023-12-20", user: "赵经理", action: "已提交", comment: "提交项目立项申请" },
  ],
}: ReviewHistoryTabProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case "已审核":
        return "bg-green-100 text-green-800"
      case "已提交":
        return "bg-blue-100 text-blue-800"
      case "已创建":
        return "bg-slate-100 text-slate-800"
      case "已批准":
        return "bg-purple-100 text-purple-800"
      case "已退回":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-4">
      {reviewHistory.length > 0 ? (
        reviewHistory.map((item, index) => (
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
            <p className="text-sm text-slate-700">{item.comment}</p>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-slate-500">暂无审核记录</div>
      )}
    </div>
  )
}

