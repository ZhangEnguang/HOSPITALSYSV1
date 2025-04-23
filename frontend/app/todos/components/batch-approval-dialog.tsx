"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface BatchApprovalDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  onConfirm: (comment: string) => void
}

export default function BatchApprovalDialog({ isOpen, onClose, selectedCount, onConfirm }: BatchApprovalDialogProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = () => {
    setIsSubmitting(true)
    // 模拟提交过程
    setTimeout(() => {
      onConfirm(comment)
      setIsSubmitting(false)
      setComment("")
      toast({
        title: "批量审批成功",
        description: `已成功批准 ${selectedCount} 个待办事项`,
        variant: "default",
      })
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            批量通过确认
          </DialogTitle>
          <DialogDescription>
            您正在批量通过 <span className="font-medium text-foreground">{selectedCount}</span> 个待办事项
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              审核意见 (选填)
            </label>
            <Textarea
              id="comment"
              placeholder="请输入审核意见..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              <>确认通过</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

