"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"

interface ReviewHistoryItem {
  date: string
  user: string
  action: string
  comment: string
  details?: string
}

interface ReviewHistoryTabProps {
  reviewHistory: ReviewHistoryItem[]
}

export default function ReviewHistoryTab({ reviewHistory }: ReviewHistoryTabProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})

  // 切换展开/折叠状态
  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-800 mb-4 flex items-center">
        <Clock className="h-4 w-4 mr-2 text-blue-500" />
        审核历史记录
      </h3>

      {reviewHistory.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-slate-500">暂无审核记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewHistory.map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-sm"
            >
              <div className="p-3 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          item.action.includes("通过")
                            ? "bg-green-500"
                            : item.action.includes("退回")
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <h4 className="font-medium text-sm text-slate-800">{item.action}</h4>
                    </div>
                    <div className="mt-1 flex items-center text-xs text-slate-500">
                      <span>{item.date}</span>
                      <span className="mx-1.5">•</span>
                      <span>{item.user}</span>
                    </div>
                  </div>

                  {item.details && (
                    <button
                      onClick={() => toggleExpand(index)}
                      className="p-1 rounded-md hover:bg-slate-100 transition-colors duration-200"
                    >
                      {expandedItems[index] ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>

                <div className="mt-2 text-sm text-slate-600">{item.comment}</div>

                {item.details && (
                  <div
                    className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedItems[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap">
                      {item.details}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
