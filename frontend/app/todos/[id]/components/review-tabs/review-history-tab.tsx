"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ReviewHistoryItem {
  id: string
  date: string
  user: string
  action: string
  comment: string
  status: string
  details?: string[] // 添加详情字段用于展示修改内容
}

interface ReviewHistoryTabProps {
  reviewHistory?: ReviewHistoryItem[]
}

export default function ReviewHistoryTab({
  reviewHistory = [
    {
      id: "1",
      user: "科研院审核员",
      action: "科研院已通过",
      date: "2024-03-15 14:30",
      comment: "研究方向符合学校重点发展领域，同意立项",
      status: "通过",
    },
    {
      id: "2",
      user: "学院主管",
      action: "学院已审核",
      date: "2024-03-14 10:15",
      comment: "研究计划合理，推荐上报科研院",
      status: "通过",
    },
    {
      id: "3",
      user: "项目负责人",
      action: "已提交",
      date: "2024-03-12 09:45",
      comment: "项目申请已提交系统",
      status: "提交",
    },
    {
      id: "4",
      user: "科研处处长",
      action: "已退回",
      date: "2024-03-10 16:20",
      comment: "研究方案需要进一步完善，请修改后重新提交",
      details: [
        "研究背景文献综述不够全面，需要补充国内外最新研究进展",
        "研究方法部分缺乏创新性，建议结合多学科交叉方法",
        "经费预算中设备采购比例过高，需要调整",
        "研究团队中缺少跨学科合作人员，建议补充相关领域专家",
      ],
      status: "退回",
    },
  ],
}: ReviewHistoryTabProps) {
  // 跟踪展开的项目
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  // 切换展开/折叠状态
  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // 获取操作状态的颜色
  const getActionColor = (action: string) => {
    switch (action) {
      case "科研院已通过":
      case "学院已通过":
      case "管理员已通过":
        return "text-green-600"
      case "已退回":
        return "text-red-600"
      case "科研院已审核":
      case "学院已审核":
        return "text-blue-600"
      case "已提交":
        return "text-indigo-600"
      case "已创建":
        return "text-purple-600"
      default:
        return "text-slate-600"
    }
  }

  return (
    <div className="h-full">
      <div className="relative pl-6 pr-2 mt-4">
        {/* 竖线 */}
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-300 to-blue-100"></div>

        <div className="space-y-4">
          {reviewHistory.map((record, index) => {
            const actionColor = getActionColor(record.action)
            const isExpanded = expandedItems[index]
            const hasDetails = record.details && (Array.isArray(record.details) ? record.details.length > 0 : true)

            return (
              <div key={index} className="relative group">
                {/* 时间点 */}
                <div
                  className={cn(
                    "absolute left-[-20px] top-0 w-4 h-4 rounded-full bg-white border-2 z-10 transition-all duration-500 ease-in-out group-hover:scale-125 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]",
                    record.action.includes("已通过")
                      ? "border-green-400 group-hover:border-green-500"
                      : record.action === "已退回"
                        ? "border-red-400 group-hover:border-red-500"
                        : "border-blue-400 group-hover:border-blue-500",
                  )}
                ></div>

                <div
                  className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-transparent 
                          transition-all duration-400 ease-out 
                          group-hover:bg-white group-hover:border-blue-200 
                          group-hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)] 
                          transform group-hover:translate-x-2 group-hover:-translate-y-1 
                          group-hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={cn(
                        "font-medium text-sm transition-all duration-300 group-hover:translate-x-1",
                        actionColor,
                      )}
                    >
                      {record.action}
                    </span>
                    <span
                      className="text-slate-500 text-xs transition-all duration-300 
                                  group-hover:text-blue-500"
                    >
                      {record.date}
                    </span>
                  </div>
                  <div
                    className="text-xs text-slate-500 mb-1 transition-all duration-300 
                                group-hover:text-slate-700 group-hover:translate-x-1"
                  >
                    {record.user}
                  </div>
                  <div
                    className="text-xs text-slate-700 bg-slate-50 p-2 rounded 
                                transition-all duration-500 ease-in-out 
                                group-hover:bg-blue-50/80 group-hover:text-slate-800 
                                group-hover:shadow-inner"
                  >
                    {record.comment}
                  </div>

                  {/* 展开/折叠按钮 - 只在有详情的项目上显示 */}
                  {hasDetails && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-6 text-xs text-slate-500 hover:text-slate-700 p-0"
                      onClick={() => toggleExpand(index)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          收起详情
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          查看详情
                        </>
                      )}
                    </Button>
                  )}

                  {/* 详情展开区域 */}
                  {hasDetails && isExpanded && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <div className="bg-slate-50 p-2 rounded text-xs text-slate-700 whitespace-pre-line">
                        <div className="font-medium text-xs text-slate-500 mb-1">修改内容：</div>
                        {Array.isArray(record.details) ? (
                          record.details.map((detail, detailIndex) => <div key={detailIndex}>{detail}</div>)
                        ) : (
                          <div>{String(record.details)}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

