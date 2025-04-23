"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2, Save, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CustomReview {
  id: string
  text: string
  enabled: boolean
}

interface CustomReviewsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  customReviews: CustomReview[]
  setCustomReviews: (reviews: CustomReview[]) => void
}

export function CustomReviewsDialog({
  isOpen,
  onOpenChange,
  customReviews,
  setCustomReviews,
}: CustomReviewsDialogProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [newReviewText, setNewReviewText] = useState("")

  // 开始编辑
  const startEditing = (review: CustomReview) => {
    setEditingId(review.id)
    setEditingText(review.text)
  }

  // 保存编辑
  const saveEdit = () => {
    if (editingId && editingText.trim()) {
      setCustomReviews(
        customReviews.map((review) =>
          review.id === editingId ? { ...review, text: editingText.trim() } : review
        )
      )
      setEditingId(null)
      setEditingText("")
    }
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null)
    setEditingText("")
  }

  // 切换启用状态
  const toggleEnabled = (id: string) => {
    setCustomReviews(
      customReviews.map((review) =>
        review.id === id ? { ...review, enabled: !review.enabled } : review
      )
    )
  }

  // 删除常用回复
  const deleteReview = (id: string) => {
    setCustomReviews(customReviews.filter((review) => review.id !== id))
  }

  // 开始添加
  const startAdding = () => {
    setIsAdding(true)
    setNewReviewText("")
  }

  // 保存新回复
  const saveNewReview = () => {
    if (newReviewText.trim()) {
      const newId = (Math.max(...customReviews.map((r) => parseInt(r.id)), 0) + 1).toString()
      setCustomReviews([
        ...customReviews,
        {
          id: newId,
          text: newReviewText.trim(),
          enabled: true,
        },
      ])
      setIsAdding(false)
      setNewReviewText("")
    }
  }

  // 取消添加
  const cancelAdding = () => {
    setIsAdding(false)
    setNewReviewText("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>自定义常用回复</DialogTitle>
          <DialogDescription className="text-slate-500 mt-1">
            管理您的常用审核意见，可以添加、编辑或删除
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-2 my-2">
          <div className="space-y-3">
            {customReviews.map((review) => (
              <div
                key={review.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 transition-all duration-200 hover:border-slate-300"
              >
                {editingId === review.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full resize-none min-h-[80px]"
                      placeholder="请输入常用回复内容..."
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={cancelEdit} className="h-8">
                        <X className="h-3.5 w-3.5 mr-1" />
                        取消
                      </Button>
                      <Button size="sm" onClick={saveEdit} className="h-8">
                        <Save className="h-3.5 w-3.5 mr-1" />
                        保存
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <p className="text-sm text-slate-700">{review.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={review.enabled}
                        onCheckedChange={() => toggleEnabled(review.id)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => startEditing(review)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteReview(review.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isAdding && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 transition-all duration-200">
                <div className="space-y-2">
                  <Textarea
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="w-full resize-none min-h-[80px]"
                    placeholder="请输入新的常用回复内容..."
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={cancelAdding} className="h-8">
                      <X className="h-3.5 w-3.5 mr-1" />
                      取消
                    </Button>
                    <Button size="sm" onClick={saveNewReview} className="h-8">
                      <Save className="h-3.5 w-3.5 mr-1" />
                      保存
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          {!isAdding && (
            <Button
              variant="outline"
              onClick={startAdding}
              className="w-full justify-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              添加新的常用回复
            </Button>
          )}
        </div>

        <DialogFooter className="mt-4 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            完成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
