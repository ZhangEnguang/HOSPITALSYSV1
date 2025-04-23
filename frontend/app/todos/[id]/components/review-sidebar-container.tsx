"use client"
import ReviewSidebar from "./review-sidebar"

interface ReviewSidebarContainerProps {
  status?: string
  reviewInfo?: {
    reviewer: string
    date: string
    result: string
    comment: string
  }
  reviewHistory?: Array<{
    date: string
    user: string
    action: string
    comment: string
  }>
  operationHistory?: Array<{
    date: string
    user: string
    action: string
    detail: string
  }>
  showReviewTab?: boolean
  showReviewHistoryTab?: boolean
  showOperationHistoryTab?: boolean
}

export default function ReviewSidebarContainer({
  status = "进行中",
  reviewInfo,
  reviewHistory,
  operationHistory,
  showReviewTab = true,
  showReviewHistoryTab = true,
  showOperationHistoryTab = true,
}: ReviewSidebarContainerProps) {
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "进行中":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "已暂停":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "已取消":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200"
    }
  }

  return (
    <ReviewSidebar
      status={status}
      getStatusColor={getStatusColor}
      reviewInfo={reviewInfo}
      reviewHistory={reviewHistory}
      operationHistory={operationHistory}
      showReviewTab={showReviewTab}
      showReviewHistoryTab={showReviewHistoryTab}
      showOperationHistoryTab={showOperationHistoryTab}
    />
  )
}

