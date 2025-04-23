"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Trash2, XCircle } from "lucide-react"
import BatchActionsBar, { type BatchAction } from "@/components/batch-actions-bar"
import BatchApprovalDialog from "./batch-approval-dialog"
import BatchRejectionDialog from "./batch-rejection-dialog"
import BatchDeleteDialog from "./batch-delete-dialog"
import { toast } from "@/components/ui/use-toast"
import { extendedTodoItems, extendedCompletedItems } from "../data/mock-data"

interface TodoBatchActionsProps {
  selectedItems: number[]
  onClearSelection: () => void
  activeTab: string
  onBatchApprove?: (ids: number[], comment: string) => void
  onBatchReject?: (ids: number[], comments: Record<number, string>) => void
  onBatchDelete?: (ids: number[]) => void
}

export default function TodoBatchActions({
  selectedItems,
  onClearSelection,
  activeTab,
  onBatchApprove = () => {},
  onBatchReject = () => {},
  onBatchDelete = () => {},
}: TodoBatchActionsProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedItemsDetails, setSelectedItemsDetails] = useState<any[]>([])

  // 获取选中的项目详情 - 根据当前标签页选择不同的数据源
  useEffect(() => {
    let itemDetails: any[] = []

    if (activeTab === "completed") {
      // 从已完成项目中查找
      itemDetails = selectedItems
        .map((id) => extendedCompletedItems.find((item) => item.id === id))
        .filter(Boolean) as any[]
    } else {
      // 从待办项目中查找
      itemDetails = selectedItems.map((id) => extendedTodoItems.find((item) => item.id === id)).filter(Boolean) as any[]
    }

    setSelectedItemsDetails(itemDetails)
  }, [selectedItems, activeTab])

  // 处理批量通过
  const handleBatchApprove = (comment: string) => {
    const validIds = selectedItemsDetails.map((item) => item.id)
    onBatchApprove(validIds, comment)
    setShowApprovalDialog(false)
    onClearSelection()
    toast({
      title: "批量通过成功",
      description: `已成功通过 ${validIds.length} 个项目`,
    })
  }

  // 处理批量退回
  const handleBatchReject = (comments: Record<number, string>) => {
    const validIds = selectedItemsDetails.map((item) => item.id)
    onBatchReject(validIds, comments)
    setShowRejectionDialog(false)
    onClearSelection()
    toast({
      title: "批量退回成功",
      description: `已成功退回 ${validIds.length} 个项目`,
    })
  }

  // 处理批量删除
  const handleBatchDelete = () => {
    const validIds = selectedItemsDetails.map((item) => item.id)
    onBatchDelete(validIds)
    setShowDeleteDialog(false)
    onClearSelection()
    toast({
      title: "批量删除成功",
      description: `已成功删除 ${validIds.length} 个项目`,
      variant: "default",
    })
  }

  // 根据当前标签页显示不同的操作按钮
  const getActions = (): BatchAction[] => {
    if (activeTab === "completed") {
      return [
        {
          id: "delete",
          label: "批量删除",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: () => setShowDeleteDialog(true),
          variant: "destructive",
        },
      ]
    } else if (activeTab === "pending") {
      return [
        {
          id: "approve",
          label: "批量通过",
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: () => setShowApprovalDialog(true),
          variant: "default",
        },
        {
          id: "reject",
          label: "批量退回",
          icon: <XCircle className="h-4 w-4" />,
          onClick: () => setShowRejectionDialog(true),
          variant: "destructive",
        },
      ]
    } else {
      // 全部标签页
      return [
        {
          id: "approve",
          label: "批量通过",
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: () => setShowApprovalDialog(true),
          variant: "default",
        },
        {
          id: "reject",
          label: "批量退回",
          icon: <XCircle className="h-4 w-4" />,
          onClick: () => setShowRejectionDialog(true),
          variant: "destructive",
        },
        {
          id: "delete",
          label: "批量删除",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: () => setShowDeleteDialog(true),
          variant: "destructive",
        },
      ]
    }
  }

  // 确保有选中的项目时才显示批量操作栏
  if (selectedItems.length === 0) {
    return null
  }

  return (
    <>
      <BatchActionsBar
        show={selectedItems.length > 0}
        selectedCount={selectedItems.length}
        actions={getActions()}
        onClearSelection={onClearSelection}
        selectionLabel="已选择"
        clearSelectionLabel="取消选择"
        position="bottom"
      />

      {/* 批量通过确认对话框 */}
      <BatchApprovalDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        selectedCount={selectedItemsDetails.length}
        onConfirm={handleBatchApprove}
      />

      {/* 批量退回确认对话框 */}
      <BatchRejectionDialog
        isOpen={showRejectionDialog}
        onClose={() => setShowRejectionDialog(false)}
        selectedItems={selectedItemsDetails}
        onConfirm={handleBatchReject}
      />

      {/* 批量删除确认对话框 */}
      <BatchDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        selectedCount={selectedItemsDetails.length}
        onConfirm={handleBatchDelete}
      />
    </>
  )
}

