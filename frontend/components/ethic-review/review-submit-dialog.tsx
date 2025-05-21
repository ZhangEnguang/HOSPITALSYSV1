"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileReviewIssue, FileReviewResult, aiReviewFiles } from "@/app/services/ai-file-review"
import { ReviewFileItem } from "@/components/ethic-review/review-file-list"
import { AIFileReviewResult } from "@/components/ethic-review/ai-file-review-result"
import { ArrowRight, Check, X, ArrowLeft, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ReviewSubmitDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  fileList: ReviewFileItem[]
  onConfirmSubmit: () => void
  onUpdateFileIssues?: (issues: FileReviewIssue[], updatedFiles?: Map<number, File[]>) => void
  files?: Map<number, File[]> // 文件ID到文件列表的映射
  skipAIReview?: boolean // 新增：是否跳过AI审查
  reviewResult?: FileReviewResult | null // 新增：传入已有的审查结果
}

export function ReviewSubmitDialog({
  isOpen,
  onOpenChange,
  fileList,
  onConfirmSubmit,
  onUpdateFileIssues,
  files,
  skipAIReview = false,
  reviewResult: initialReviewResult = null
}: ReviewSubmitDialogProps) {
  const [reviewResult, setReviewResult] = useState<FileReviewResult | null>(initialReviewResult)
  const [isReviewing, setIsReviewing] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(!!initialReviewResult)
  const [reviewError, setReviewError] = useState<string | null>(null)

  // 确保文件列表有效
  const validFileList = Array.isArray(fileList) ? fileList : []

  // 监听对话框打开状态变化，确保isOpen改变时自动开始审查（除非跳过AI审查）
  useEffect(() => {
    if (isOpen && !isReviewing && !hasReviewed && !skipAIReview) {
      startAIReview()
    }
    
    // 如果有初始审查结果，更新状态
    if (isOpen && initialReviewResult) {
      setReviewResult(initialReviewResult)
      setHasReviewed(true)
    }
  }, [isOpen, initialReviewResult, skipAIReview])

  // 启动AI审查
  const startAIReview = async () => {
    // 如果跳过AI审查，直接返回
    if (skipAIReview) {
      setHasReviewed(true)
      return
    }
    
    setIsReviewing(true)
    setHasReviewed(false)
    setReviewError(null)
    
    // 确保文件列表不为空
    if (!validFileList.length) {
      console.warn("文件列表为空，无法进行审查")
      setReviewResult({
        hasIssues: true,
        issues: [{
          fileId: 0,
          fileName: "系统",
          issueType: 'quantity',
          severity: 'error',
          message: "未找到有效的送审文件",
          suggestion: "请上传至少一个必需的送审文件",
          autoFixable: false
        }],
        totalFiles: 0,
        validFiles: 0
      })
      setIsReviewing(false)
      setHasReviewed(true)
      return
    }
    
    try {
      console.log("开始AI文件审查，文件列表:", validFileList)
      const result = await aiReviewFiles(validFileList)
      console.log("AI文件审查完成:", result)
      setReviewResult(result)
      setHasReviewed(true)
    } catch (error) {
      console.error("AI文件审查失败:", error)
      setReviewError("文件审查过程发生错误，请重试")
      toast({
        title: "审查失败",
        description: "文件审查过程发生错误，请重试",
        variant: "destructive"
      })
      // 设置一个默认的错误结果
      setReviewResult({
        hasIssues: true,
        issues: [{
          fileId: 0,
          fileName: "系统",
          issueType: 'format',
          severity: 'error',
          message: "文件审查过程发生错误",
          suggestion: "请刷新页面后重试",
          autoFixable: false
        }],
        totalFiles: validFileList.length,
        validFiles: 0
      })
    } finally {
      setIsReviewing(false)
    }
  }

  // 手动重新开始审查
  const handleRetryReview = () => {
    startAIReview()
  }

  // 处理对话框打开时自动开始审查
  const handleOpenChange = (open: boolean) => {
    if (open !== isOpen) {
      onOpenChange(open)
    
      if (!open) {
        // 关闭对话框时重置状态
        setTimeout(() => {
          if (!initialReviewResult) {
          setReviewResult(null)
          setHasReviewed(false)
          }
          setReviewError(null)
        }, 300) // 给对话框关闭动画一些时间
      }
    }
  }

  // 处理修复问题
  const handleFixIssues = (fixedIssues: FileReviewIssue[]) => {
    if (reviewResult && onUpdateFileIssues) {
      // 检查是否还有错误或警告
      const stillHasIssues = fixedIssues.some(issue => 
        issue.severity === 'error' || issue.severity === 'warning'
      )
      
      const updatedResult = {
        ...reviewResult,
        issues: fixedIssues,
        hasIssues: stillHasIssues
      }
      
      setReviewResult(updatedResult)
      onUpdateFileIssues(fixedIssues)
    }
  }
  
  // 处理返回列表操作
  const handleReturnToList = () => {
    localStorage.setItem('reviewSubmitAction', 'returnToList')
    handleOpenChange(false)
  }
  
  // 处理继续新增操作
  const handleContinueAdd = () => {
    localStorage.setItem('reviewSubmitAction', 'continueAdd')
    onConfirmSubmit()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>确认提交审查</DialogTitle>
          <DialogDescription>
            您的审查申请已准备就绪，提交后将进入伦理审查流程
          </DialogDescription>
        </DialogHeader>

        {/* AI文件审查结果，如果跳过AI审查则不显示 */}
        {!skipAIReview && (isReviewing || reviewResult) ? (
          <div className="py-4">
            <AIFileReviewResult 
              result={reviewResult || { hasIssues: false, issues: [], totalFiles: 0, validFiles: 0 }}
              isLoading={isReviewing}
              onFixIssues={handleFixIssues}
              files={files}
            />
          </div>
        ) : (!skipAIReview && (
          <div className="py-8 text-center text-muted-foreground flex flex-col items-center gap-4">
            <p>正在准备文件审查...</p>
            {reviewError && (
              <div>
                <p className="text-red-500 mb-2">{reviewError}</p>
                <Button 
                  variant="outline" 
                  onClick={handleRetryReview}
                  className="mt-2"
                >
                  重试
                </Button>
              </div>
            )}
          </div>
        ))}

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleReturnToList}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
          
          {(skipAIReview || (hasReviewed && reviewResult)) && (
            <Button 
              onClick={handleContinueAdd} 
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              继续新增
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 