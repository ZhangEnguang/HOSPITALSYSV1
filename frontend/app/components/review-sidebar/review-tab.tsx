"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

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
  returnPath?: string  // 新增：自定义返回路径
}

export default function ReviewTab({ projectId, projectTitle, onStatusChange, returnPath }: ReviewTabProps) {
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

  // 审查方式选择弹框
  const [showReviewMethodDialog, setShowReviewMethodDialog] = useState(false)
  const [selectedReviewMethod, setSelectedReviewMethod] = useState<'quick' | 'meeting' | null>(null)
  const [selectedMeeting, setSelectedMeeting] = useState<string>("")

  // 会议数据 - 2025年3-7月份，每半个月一次
  const meetingData = [
    {
      id: "1",
      date: "2025-03-01",
      title: "2025年第一季度初始审查会议",
      quickReviewCount: 5,
      meetingReviewCount: 8,
      quickReviewLimit: 5,
      meetingReviewLimit: 8
    },
    {
      id: "2", 
      date: "2025-03-15",
      title: "动物实验伦理跟踪审查会议",
      quickReviewCount: 1,
      meetingReviewCount: 2,
      quickReviewLimit: 5,
      meetingReviewLimit: 8
    },
    {
      id: "3",
      date: "2025-04-01", 
      title: "紧急快速审查会议",
      quickReviewCount: 4,
      meetingReviewCount: 1,
      quickReviewLimit: 5,
      meetingReviewLimit: 8
    },
    {
      id: "4",
      date: "2025-04-15",
      title: "人体研究伦理审查会议", 
      quickReviewCount: 0,
      meetingReviewCount: 4,
      quickReviewLimit: 5,
      meetingReviewLimit: 8
    },
    {
      id: "5",
      date: "2025-05-01",
      title: "基因编辑技术专项审查会议",
      quickReviewCount: 3,
      meetingReviewCount: 2,
      quickReviewLimit: 5,
      meetingReviewLimit: 8
    },
    {
      id: "6",
      date: "2025-05-15", 
      title: "多中心研究协调会议",
      quickReviewCount: 5,
      meetingReviewCount: 8,
      quickReviewLimit: 5,
      meetingReviewLimit: 8
    },
    {
      id: "7",
      date: "2025-06-01",
      title: "研究伦理培训会议",
      quickReviewCount: 1,
      meetingReviewCount: 3,
      quickReviewLimit: 5,
      meetingReviewLimit: 8
    },
    {
      id: "8",
      date: "2025-06-15",
      title: "年中总结会议", 
      quickReviewCount: 0,
      meetingReviewCount: 2,
      quickReviewLimit: 5,
      meetingReviewLimit: 8
    },
    {
      id: "9",
      date: "2025-07-01",
      title: "特殊项目审查会议",
      quickReviewCount: 2,
      meetingReviewCount: 1,
      quickReviewLimit: 5,
      meetingReviewLimit: 8
    },
    {
      id: "10",
      date: "2025-07-15",
      title: "伦理审查规范修订会议",
      quickReviewCount: 1,
      meetingReviewCount: 0,
      quickReviewLimit: 5,
      meetingReviewLimit: 8
    }
  ]

  // 检查会议是否满额的函数
  const isMeetingFull = (meeting: any) => {
    return meeting.quickReviewCount >= meeting.quickReviewLimit && 
           meeting.meetingReviewCount >= meeting.meetingReviewLimit
  }

  // 获取默认会议的函数
  const getDefaultMeeting = () => {
    // 按日期排序，找到最近的未满额会议
    const sortedMeetings = [...meetingData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const availableMeeting = sortedMeetings.find(meeting => !isMeetingFull(meeting))
    return availableMeeting?.id || sortedMeetings[0]?.id || ""
  }

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

  // 审核通过处理 - 显示审查方式选择弹框
  const handleApprove = () => {
    // 清除任何之前的错误
    setCommentError(false)
    setCommentErrorMessage("")

    // 设置默认会议
    setSelectedMeeting(getDefaultMeeting())

    // 显示审查方式选择弹框
    setShowReviewMethodDialog(true)
  }

  // 处理审查方式选择
  const handleReviewMethodSelect = (method: 'quick' | 'meeting') => {
    setSelectedReviewMethod(method)
  }

  // 确认审查方式选择
  const handleConfirmReviewMethod = () => {
    if (!selectedReviewMethod) return

    // 不管选择哪种审查方式，都需要选择关联会议
    if (!selectedMeeting) {
      toast({
        title: "请选择关联会议",
        description: "请选择一个关联的会议",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // 关闭审查方式选择弹框
    setShowReviewMethodDialog(false)

    // 根据选择的方式进行不同的处理
    let methodText = ""
    let description = ""

    const selectedMeetingData = meetingData.find(m => m.id === selectedMeeting)
    
    switch (selectedReviewMethod) {
      case 'quick':
        methodText = "快速审查"
        description = `项目已通过审核，选择审查方式：快速审查，关联会议：${selectedMeetingData?.title}`
        break
      case 'meeting':
        methodText = "会议审查"
        description = `项目已通过审核，选择审查方式：会议审查，关联会议：${selectedMeetingData?.title}`
        break
    }

    // 显示成功提示
    toast({
      title: "操作成功",
      description: description,
      duration: 3000,
    })

    // 重置选择状态
    setSelectedReviewMethod(null)
    setSelectedMeeting("")

    // 根据returnPath或当前路径决定返回地址
    if (returnPath) {
      router.push(returnPath)
    } else {
      // 如果没有指定returnPath，根据当前路径自动判断
      const currentPath = window.location.pathname
      if (currentPath.includes('/human-genetics-review/')) {
        router.push("/ethic-review/human-genetics-review")
      } else if (currentPath.includes('/track-review/')) {
        router.push("/ethic-review/track-review")
      } else {
        // 默认返回初始审查列表
        router.push("/ethic-review/initial-review")
      }
    }
  }

  // 取消审查方式选择
  const handleCancelReviewMethod = () => {
    setShowReviewMethodDialog(false)
    setSelectedReviewMethod(null)
    setSelectedMeeting("")
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

        {/* 审查方式选择弹框 */}
        <Dialog open={showReviewMethodDialog} onOpenChange={handleCancelReviewMethod}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                选择审查方式
              </DialogTitle>
              <DialogDescription>
                项目已通过初步审核，请选择后续的审查方式
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {/* 主要选项 - 横向排列 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* 快速审查选项 */}
                <div 
                  className={`relative rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
                    selectedReviewMethod === 'quick'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                  onClick={() => handleReviewMethodSelect('quick')}
                >
                  {/* 选择器 - 左上角 */}
                  <div className="absolute top-3 left-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedReviewMethod === 'quick'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedReviewMethod === 'quick' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>

                  <div className="text-center space-y-2 pt-4">
                    {/* 图标 */}
                    <div className="flex justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedReviewMethod === 'quick'
                          ? 'bg-blue-500'
                          : 'bg-blue-100'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          selectedReviewMethod === 'quick' ? 'text-white' : 'text-blue-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* 文字内容 */}
                    <div>
                      <div className="font-medium text-gray-900 mb-1">快速审查</div>
                      <div className="text-xs text-gray-600">
                        适用于风险较低的项目<br />审查周期较短
                      </div>
                    </div>
                  </div>
                </div>

                {/* 会议审查选项 */}
                <div 
                  className={`relative rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
                    selectedReviewMethod === 'meeting'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                  }`}
                  onClick={() => handleReviewMethodSelect('meeting')}
                >
                  {/* 选择器 - 左上角 */}
                  <div className="absolute top-3 left-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedReviewMethod === 'meeting'
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedReviewMethod === 'meeting' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>

                  <div className="text-center space-y-2 pt-4">
                    {/* 图标 */}
                    <div className="flex justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedReviewMethod === 'meeting'
                          ? 'bg-green-500'
                          : 'bg-green-100'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          selectedReviewMethod === 'meeting' ? 'text-white' : 'text-green-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* 文字内容 */}
                    <div>
                      <div className="font-medium text-gray-900 mb-1">会议审查</div>
                      <div className="text-xs text-gray-600">
                        召开伦理委员会会议<br />进行集体审查
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 关联会议选择 - 独立显示 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  关联会议 <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedMeeting}
                  onChange={(e) => setSelectedMeeting(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">请选择会议</option>
                  {meetingData.map((meeting) => (
                    <option key={meeting.id} value={meeting.id}>
                      {meeting.date} - {meeting.title}{isMeetingFull(meeting) ? ' (已满额)' : ''}
                    </option>
                  ))}
                </select>
                
                {/* 显示选中会议的项目统计 */}
                {selectedMeeting && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    {(() => {
                      const meeting = meetingData.find(m => m.id === selectedMeeting)
                      if (!meeting) return null
                      
                      const isQuickFull = meeting.quickReviewCount >= meeting.quickReviewLimit
                      const isMeetingReviewFull = meeting.meetingReviewCount >= meeting.meetingReviewLimit
                      const isFullyBooked = isMeetingFull(meeting)
                      
                      return (
                        <div>
                          <div className="flex justify-between text-sm">
                            <span className={isQuickFull ? 'text-red-600' : 'text-gray-600'}>
                              快速审查: {meeting.quickReviewCount}/{meeting.quickReviewLimit}
                              {isQuickFull && ' (已满)'}
                            </span>
                            <span className={isMeetingReviewFull ? 'text-red-600' : 'text-gray-600'}>
                              会议审查: {meeting.meetingReviewCount}/{meeting.meetingReviewLimit}
                              {isMeetingReviewFull && ' (已满)'}
                            </span>
                          </div>
                          {isFullyBooked && (
                            <div className="mt-2 text-xs text-red-500 font-medium">
                              ⚠️ 此会议已满额，建议选择其他会议
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleCancelReviewMethod}>
                取消
              </Button>
              <Button 
                onClick={handleConfirmReviewMethod}
                disabled={!selectedReviewMethod || !selectedMeeting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                确认选择
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
