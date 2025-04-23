"use client"

import { Activity } from "lucide-react"

interface OperationHistoryItem {
  date: string
  user: string
  action: string
  detail: string
}

interface OperationHistoryTabProps {
  operationHistory: OperationHistoryItem[]
}

export default function OperationHistoryTab({ operationHistory }: OperationHistoryTabProps) {
  // 获取操作类型对应的颜色
  const getActionColor = (action: string) => {
    switch (action) {
      case "修改":
        return "bg-blue-500"
      case "添加":
        return "bg-green-500"
      case "删除":
        return "bg-red-500"
      case "分配":
        return "bg-purple-500"
      case "提醒":
        return "bg-amber-500"
      case "更新":
        return "bg-cyan-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-800 mb-4 flex items-center">
        <Activity className="h-4 w-4 mr-2 text-blue-500" />
        操作历史记录
      </h3>

      {operationHistory.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-slate-500">暂无操作记录</p>
        </div>
      ) : (
        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-200"></div>

          <div className="space-y-4">
            {operationHistory.map((item, index) => (
              <div key={index} className="flex items-start gap-4 relative">
                <div className={`w-[18px] h-[18px] rounded-full ${getActionColor(item.action)} flex-shrink-0 z-10 mt-0.5 border-2 border-white`}></div>
                <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 p-3 transition-all duration-300 hover:shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm text-slate-800">{item.action}</h4>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                  <div className="mt-1.5 text-xs text-slate-500">操作人：{item.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
