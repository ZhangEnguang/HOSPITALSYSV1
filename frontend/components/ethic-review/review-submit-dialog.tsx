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
import { ArrowRight, Check, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ReviewSubmitDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  fileList: ReviewFileItem[]
  onConfirmSubmit: () => void
  onUpdateFileIssues?: (issues: FileReviewIssue[], updatedFiles?: Map<number, File[]>) => void
  files?: Map<number, File[]> // 文件ID到文件列表的映射
}

export function ReviewSubmitDialog({
  isOpen,
  onOpenChange,
  fileList,
  onConfirmSubmit,
  onUpdateFileIssues,
  files
}: ReviewSubmitDialogProps) {
  const [reviewResult, setReviewResult] = useState<FileReviewResult | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)

  // 确保文件列表有效
  const validFileList = Array.isArray(fileList) ? fileList : []

  // 监听对话框打开状态变化，确保isOpen改变时自动开始审查
  useEffect(() => {
    if (isOpen && !isReviewing && !hasReviewed) {
      startAIReview()
    }
  }, [isOpen])

  // 启动AI审查
  const startAIReview = async () => {
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
          setReviewResult(null)
          setHasReviewed(false)
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>提交审查</DialogTitle>
          <DialogDescription>
            在提交前，系统将使用AI检查您的送审文件是否符合要求
          </DialogDescription>
        </DialogHeader>

        {/* AI文件审查结果 */}
        {isReviewing || reviewResult ? (
          <div className="py-4">
            <AIFileReviewResult 
              result={reviewResult || { hasIssues: false, issues: [], totalFiles: 0, validFiles: 0 }}
              isLoading={isReviewing}
              onFixIssues={handleFixIssues}
              files={files}
            />
          </div>
        ) : (
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
        )}

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            取消
          </Button>
          
          {hasReviewed && reviewResult && !reviewResult.hasIssues ? (
            <Button onClick={onConfirmSubmit} className="bg-green-600 hover:bg-green-700">
              <Check className="mr-2 h-4 w-4" />
              确认提交
            </Button>
          ) : hasReviewed && reviewResult && reviewResult.hasIssues ? (
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              返回修改文件
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 