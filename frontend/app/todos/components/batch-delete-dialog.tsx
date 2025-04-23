"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BatchDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  onConfirm: () => void
}

export default function BatchDeleteDialog({ isOpen, onClose, selectedCount, onConfirm }: BatchDeleteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = () => {
    setIsSubmitting(true)
    // 模拟网络请求延迟
    setTimeout(() => {
      onConfirm()
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>确认批量删除</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            您确定要删除选中的 <span className="font-semibold text-foreground">{selectedCount}</span>{" "}
            个已审核事项吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md bg-amber-50 p-4 mt-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">注意事项</h3>
              <div className="mt-2 text-sm text-amber-700">
                <ul className="list-disc space-y-1 pl-5">
                  <li>删除后的记录将无法恢复</li>
                  <li>相关的审核历史记录也将被删除</li>
                  <li>如果只是暂时不需要查看，建议使用归档功能</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isSubmitting} className="gap-1">
            {isSubmitting && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {isSubmitting ? "删除中..." : "确认删除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

