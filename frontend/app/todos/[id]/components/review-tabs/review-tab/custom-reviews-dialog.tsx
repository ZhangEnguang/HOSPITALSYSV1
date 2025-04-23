"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Eye, EyeOff, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CustomReviewsDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  customReviews: { id: string; text: string; enabled: boolean }[]
  setCustomReviews: (reviews: { id: string; text: string; enabled: boolean }[]) => void
}

export function CustomReviewsDialog({
  isOpen,
  onOpenChange,
  customReviews,
  setCustomReviews,
}: CustomReviewsDialogProps) {
  const [tempCustomReviews, setTempCustomReviews] = useState<typeof customReviews>([])
  const [newReviewText, setNewReviewText] = useState("")
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editingReviewText, setEditingReviewText] = useState("")

  // 初始化临时自定义回复
  useEffect(() => {
    setTempCustomReviews([...customReviews])
  }, [isOpen, customReviews])

  // 添加自定义回复
  const handleAddCustomReview = () => {
    if (newReviewText.trim()) {
      const newId = (tempCustomReviews.length + 1).toString()
      setTempCustomReviews([...tempCustomReviews, { id: newId, text: newReviewText, enabled: true }])
      setNewReviewText("")
    }
  }

  // 切换回复状态
  const handleToggleReviewStatus = (id: string) => {
    setTempCustomReviews(
      tempCustomReviews.map((review) => (review.id === id ? { ...review, enabled: !review.enabled } : review)),
    )
  }

  // 删除回复
  const handleDeleteReview = (id: string) => {
    setTempCustomReviews(tempCustomReviews.filter((review) => review.id !== id))
  }

  // 开始编辑回复
  const startEditingReview = (id: string, text: string) => {
    setEditingReviewId(id)
    setEditingReviewText(text)
  }

  // 保存编辑的回复
  const saveEditingReview = () => {
    if (editingReviewId && editingReviewText.trim()) {
      setTempCustomReviews(
        tempCustomReviews.map((review) =>
          review.id === editingReviewId ? { ...review, text: editingReviewText } : review,
        ),
      )
      setEditingReviewId(null)
      setEditingReviewText("")
    }
  }

  // 取消编辑回复
  const cancelEditingReview = () => {
    setEditingReviewId(null)
    setEditingReviewText("")
  }

  // 确认自定义回复更改
  const confirmCustomReviews = () => {
    setCustomReviews([...tempCustomReviews])
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>自定义常用回复</DialogTitle>
          <DialogDescription>
            您可以添加、编辑、删除或启用/禁用常用回复，这些回复将显示在常用回复下拉菜单中
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">序号</TableHead>
                <TableHead>回复内容</TableHead>
                <TableHead className="w-[120px]">状态</TableHead>
                <TableHead className="w-[120px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tempCustomReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.id}</TableCell>
                  <TableCell>
                    {editingReviewId === review.id ? (
                      <Input
                        value={editingReviewText}
                        onChange={(e) => setEditingReviewText(e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <span className={review.enabled ? "" : "text-slate-400"}>{review.text}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-xs ${review.enabled ? "text-green-600" : "text-slate-400"}`}
                      onClick={() => handleToggleReviewStatus(review.id)}
                    >
                      {review.enabled ? <Eye className="h-3.5 w-3.5 mr-1" /> : <EyeOff className="h-3.5 w-3.5 mr-1" />}
                      {review.enabled ? "已启用" : "已禁用"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    {editingReviewId === review.id ? (
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditingReview}
                          className="h-8 text-slate-500 hover:text-slate-700"
                        >
                          取消
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={saveEditingReview}
                          className="h-8 text-blue-500 hover:text-blue-700"
                        >
                          保存
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditingReview(review.id, review.text)}
                          className="h-8 w-8 text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReview(review.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="输入新的常用回复内容"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddCustomReview} disabled={!newReviewText.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>
        </div>
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={confirmCustomReviews}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

