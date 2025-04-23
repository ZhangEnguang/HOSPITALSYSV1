"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ChevronRight, ChevronLeft, Send, Clock, CheckCircle, XCircle, AlertCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// 模拟审核意见数据
const mockReviews = [
  {
    id: 1,
    user: {
      name: "张三",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "项目经理",
    },
    content: "项目预算需要重新评估，当前预算可能不足以支持所有计划的活动。",
    status: "warning",
    date: "2024-03-15 14:30",
  },
  {
    id: 2,
    user: {
      name: "李四",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "财务主管",
    },
    content: "经费使用计划已审核通过，符合单位财务规定。",
    status: "approved",
    date: "2024-03-14 09:15",
  },
  {
    id: 3,
    user: {
      name: "王五",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "技术专家",
    },
    content: "技术方案存在风险点，建议增加风险控制措施。特别是在数据安全方面需要加强。",
    status: "rejected",
    date: "2024-03-13 16:45",
  },
  {
    id: 4,
    user: {
      name: "赵六",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "部门领导",
    },
    content: "项目整体规划合理，同意立项。请注意按时提交阶段性成果。",
    status: "approved",
    date: "2024-03-12 11:20",
  },
]

// 获取状态对应的图标和颜色
const getStatusInfo = (status: string) => {
  switch (status) {
    case "approved":
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        color: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "已通过",
      }
    case "rejected":
      return {
        icon: <XCircle className="h-4 w-4" />,
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "已拒绝",
      }
    case "warning":
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        label: "需注意",
      }
    default:
      return {
        icon: <Clock className="h-4 w-4" />,
        color: "text-slate-500",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        label: "待审核",
      }
  }
}

interface ReviewPanelProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function ReviewPanel({ isCollapsed, onToggle }: ReviewPanelProps) {
  const [newReview, setNewReview] = useState("")
  const [reviews, setReviews] = useState(mockReviews)
  const [filter, setFilter] = useState("all")

  const handleSubmit = () => {
    if (!newReview.trim()) return

    const newReviewItem = {
      id: Date.now(),
      user: {
        name: "当前用户",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "系统管理员",
      },
      content: newReview,
      status: "pending",
      date: new Date()
        .toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(/\//g, "-"),
    }

    setReviews([newReviewItem, ...reviews])
    setNewReview("")
  }

  const filteredReviews = filter === "all" ? reviews : reviews.filter((review) => review.status === filter)

  return (
    <div
      className={cn(
        "fixed right-0 top-0 bottom-0 bg-white border-l border-muted/50 shadow-lg transition-all duration-300 flex flex-col h-screen",
        isCollapsed ? "w-[50px]" : "w-[350px]",
      )}
    >
      {/* 切换按钮 */}
      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full flex items-center justify-center w-6 h-20 bg-white border border-l-0 border-muted/50 rounded-l-md shadow-sm"
      >
        <span className="sr-only">{isCollapsed ? "展开审核面板" : "收起审核面板"}</span>
        {isCollapsed ? (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* 收起状态只显示图标 */}
      {isCollapsed ? (
        <div className="flex flex-col items-center pt-20">
          <User className="h-5 w-5 text-muted-foreground mb-2" />
          <div className="h-px w-8 bg-muted/50 my-2"></div>
          <span className="text-xs text-muted-foreground rotate-90 mt-4">审核意见</span>
        </div>
      ) : (
        <>
          {/* 面板头部 */}
          <div className="p-4 border-b border-muted/50 flex justify-between items-center mt-[64px]">
            <h3 className="font-medium text-lg">审核意见</h3>
            <Badge variant="outline" className="text-xs">
              {reviews.length} 条
            </Badge>
          </div>

          {/* 筛选器 */}
          <div className="p-3 border-b border-muted/50 flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="text-xs h-7 px-2"
            >
              全部
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("approved")}
              className="text-xs h-7 px-2"
            >
              已通过
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("rejected")}
              className="text-xs h-7 px-2"
            >
              已拒绝
            </Button>
            <Button
              variant={filter === "warning" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("warning")}
              className="text-xs h-7 px-2"
            >
              需注意
            </Button>
          </div>

          {/* 审核意见列表 */}
          <div className="flex-1 overflow-auto p-3">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">暂无审核意见</div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => {
                  const statusInfo = getStatusInfo(review.status)
                  return (
                    <div
                      key={review.id}
                      className={cn("p-3 rounded-lg border", statusInfo.borderColor, statusInfo.bgColor)}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.user.avatar} alt={review.user.name} />
                          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-sm">{review.user.name}</div>
                            <div className={cn("flex items-center text-xs gap-1", statusInfo.color)}>
                              {statusInfo.icon}
                              <span>{statusInfo.label}</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">{review.user.role}</div>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{review.content}</p>
                      <div className="text-xs text-muted-foreground text-right">{review.date}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 添加审核意见 */}
          <div className="p-3 border-t border-muted/50">
            <div className="flex gap-2 mb-1">
              <Input placeholder="选择审核状态" className="text-xs h-8" defaultValue="需注意" />
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="添加审核意见..."
                className="min-h-[80px] text-sm resize-none"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-2">
              <Button size="sm" onClick={handleSubmit} className="gap-1">
                <Send className="h-3.5 w-3.5" />
                提交
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

