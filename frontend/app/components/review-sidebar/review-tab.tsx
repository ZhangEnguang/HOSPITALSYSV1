"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle } from "lucide-react"

import { AuditKeyPointsSection } from "./review-tab/audit-key-points-section"
import { ReviewCommentSection } from "./review-tab/review-comment-section"
import { ResultDialog } from "./review-tab/result-dialog"
import { CustomAnimations } from "./review-tab/custom-animations"
import { AIHelpDialog } from "./review-tab/ai-help-dialog"
import { CustomReviewsDialog } from "./review-tab/custom-reviews-dialog"

interface ReviewTabProps {
  projectId?: string
  projectTitle?: string
  onStatusChange?: (newStatus: string) => void
}

export default function ReviewTab({ projectId, projectTitle, onStatusChange }: ReviewTabProps) {
  // 审核状态
  const [isReviewCompleted, setIsReviewCompleted] = useState(false)
  const [finalStatus, setFinalStatus] = useState<"已通过" | "已退回" | "">("")

  // 审核要点
  const [selectedKeyPoints, setSelectedKeyPoints] = useState<string[]>(["1", "3"])
  const [isAllPointsDialogOpen, setIsAllPointsDialogOpen] = useState(false)
  const [tempSelectedPoints, setTempSelectedPoints] = useState<string[]>([])

  // 审核意见
  const [commentText, setCommentText] = useState("")
  const [commentError, setCommentError] = useState(false)
  const [commentErrorMessage, setCommentErrorMessage] = useState("")
  const [files, setFiles] = useState<File[]>([])

  // AI辅助相关
  const [isAiHelpDialogOpen, setIsAiHelpDialogOpen] = useState(false)
  const [customReviewsDialogOpen, setCustomReviewsDialogOpen] = useState(false)
  const [customReviews, setCustomReviews] = useState([
    { id: "1", text: "研究方向符合学校重点发展领域，建议按计划执行", enabled: true },
    { id: "2", text: "研究方法需要进一步明确和创新", enabled: true },
    { id: "3", text: "请补充国内外研究现状和文献综述", enabled: true },
    { id: "4", text: "建议明确阶段性研究成果和验收标准", enabled: true },
    { id: "5", text: "请完善研究团队的分工与合作机制", enabled: true },
  ])

  // 审核结果弹框
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [resultAction, setResultAction] = useState<"approval" | "rejection">("approval")

  // 其他
  const router = useRouter()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<any[]>([])
  const [canScroll, setCanScroll] = useState(true)

  // 清除评论错误
  useEffect(() => {
    if (commentError && commentText.trim()) {
      setCommentError(false)
      setCommentErrorMessage("")
    }
  }, [commentText, commentError])

  // 审核通过处理
  const handleApprove = () => {
    // 审核通过不需要验证评论是否已填写
    if (commentText.trim()) {
      const newReview = {
        id: reviews.length + 1,
        reviewer: "科研院审核员",
        date: new Date().toISOString(),
        status: "通过",
        comments: commentText,
      }
      setReviews([...reviews, newReview])
    }

    // 清除任何之前的错误
    setCommentError(false)
    setCommentErrorMessage("")

    // 更新状态为已通过
    setFinalStatus("已通过")
    setIsReviewCompleted(true)

    // 调用父组件的状态更新回调
    if (onStatusChange) {
      onStatusChange("已通过")
      // 确保状态更新立即生效
      setTimeout(() => {
        onStatusChange("已通过")
      }, 50)
    }

    // 显示成功提示
    toast({
      title: "操作成功",
      description: "项目已通过审核",
      duration: 3000,
    })

    // 显示审核结果弹框
    setResultAction("approval")
    setShowResultDialog(true)
  }

  // 审核退回处理
  const handleReject = () => {
    // 退回修改需要填写意见
    if (!commentText.trim()) {
      setCommentError(true)
      setCommentErrorMessage("请填写审核意见后再退回修改")
      return
    }

    // 添加新的审核记录
    const newReview = {
      id: reviews.length + 1,
      reviewer: "科研院审核员",
      date: new Date().toISOString(),
      status: "退回",
      comments: commentText,
    }
    setReviews([...reviews, newReview])

    // 更新状态为已退回
    setFinalStatus("已退回")
    setIsReviewCompleted(true)

    // 调用父组件的状态更新回调
    if (onStatusChange) {
      onStatusChange("已退回")
      // 确保状态更新立即生效
      setTimeout(() => {
        onStatusChange("已退回")
      }, 50)
    }

    // 清除错误
    setCommentError(false)
    setCommentErrorMessage("")

    // 显示成功提示
    toast({
      title: "操作成功",
      description: "已退回项目进行修改",
      duration: 3000,
    })

    // 显示审核结果弹框
    setResultAction("rejection")
    setShowResultDialog(true)
  }

  // 处理查看详情
  const handleViewDetails = () => {
    // 关闭结果对话框
    setShowResultDialog(false)

    // 更新状态并隐藏审核标签
    const newStatus = resultAction === "approval" ? "科研院已通过" : "已退回"

    // 检查 onStatusChange 是否存在再调用
    if (onStatusChange) {
      // 立即调用状态更新函数
      onStatusChange(newStatus)

      // 确保状态更新立即生效
      setTimeout(() => {
        // 再次调用以确保状态更新被应用
        onStatusChange(newStatus)
      }, 50)
    }

    // 添加新的审核记录
    const currentDate = new Date().toISOString().split("T")[0]

    // 创建新的审核记录，包括详情字段（如果是退回操作）
    const newReviewRecord = {
      date: currentDate,
      user: "科研院审核员",
      action: newStatus,
      comment:
        commentText ||
        (resultAction === "approval"
          ? "研究方向符合学校重点发展领域，同意立项"
          : "研究方案需要进一步完善，请修改后重新提交"),
      // 如果是退回操作，添加详情字段
      ...(resultAction === "rejection" && commentText
        ? {
            details: "需要修改的内容：\n" + commentText,
          }
        : {}),
    }

    // 通知父组件添加新的审核记录并隐藏审核标签
    if (typeof window !== "undefined") {
      // 使用自定义事件传递数据
      const event = new CustomEvent("updateReviewHistory", {
        detail: {
          newRecord: newReviewRecord,
          hideReviewTab: true,
        },
      })
      window.dispatchEvent(event)
    }

    // 切换到概览标签
    if (typeof window !== "undefined") {
      const event = new CustomEvent("switchToOverviewTab")
      window.dispatchEvent(event)
    }
  }

  // 处理返回列表
  const handleBackToList = () => {
    router.push("/todos")
  }

  return (
    <>
      <CustomAnimations />
      <div className="flex flex-col h-full relative">
        {/* 主要内容区域 - 可滚动 */}
        <div className={`flex-1 overflow-y-auto pb-24 px-4 ${canScroll ? "" : "overflow-hidden"}`}>
          {/* 审核要点 */}
          <AuditKeyPointsSection
            isReviewCompleted={isReviewCompleted}
            selectedKeyPoints={selectedKeyPoints}
            setSelectedKeyPoints={setSelectedKeyPoints}
            isAllPointsDialogOpen={isAllPointsDialogOpen}
            setIsAllPointsDialogOpen={setIsAllPointsDialogOpen}
            tempSelectedPoints={tempSelectedPoints}
            setTempSelectedPoints={setTempSelectedPoints}
          />

          {/* 审核意见 */}
          <ReviewCommentSection
            isReviewCompleted={isReviewCompleted}
            finalStatus={finalStatus}
            commentText={commentText}
            setCommentText={setCommentText}
            commentError={commentError}
            commentErrorMessage={commentErrorMessage}
            files={files}
            setFiles={setFiles}
            customReviews={customReviews}
            setCustomReviewsDialogOpen={setCustomReviewsDialogOpen}
            setIsAiHelpDialogOpen={setIsAiHelpDialogOpen}
            setCanScroll={setCanScroll}
          />
        </div>

        {/* 底部固定按钮 - 只在未完成审核时显示 */}
        {!isReviewCompleted && (
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 backdrop-blur-md border-t border-slate-200/50 flex gap-3 shadow-sm">
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm h-10 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-md"
              type="button"
              onClick={handleReject}
            >
              <XCircle className="h-4 w-4 mr-2" />
              退回修改
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm h-10 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-md"
              type="button"
              onClick={handleApprove}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              审核通过
            </Button>
          </div>
        )}

        {/* 对话框 */}
        <AIHelpDialog isOpen={isAiHelpDialogOpen} onOpenChange={setIsAiHelpDialogOpen} />

        <CustomReviewsDialog
          isOpen={customReviewsDialogOpen}
          onOpenChange={setCustomReviewsDialogOpen}
          customReviews={customReviews}
          setCustomReviews={setCustomReviews}
        />

        <ResultDialog
          isOpen={showResultDialog}
          onOpenChange={setShowResultDialog}
          resultAction={resultAction}
          projectTitle={projectTitle}
          commentText={commentText}
          onViewDetails={handleViewDetails}
          onBackToList={handleBackToList}
        />
      </div>
    </>
  )
}
