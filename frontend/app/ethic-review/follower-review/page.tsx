"use client"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import DataList from "@/components/data-list"

export default function EthicFollowerReviewPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // 处理选择行变化
  const handleSelectionChange = (rows: string[]) => {
    setSelectedRows(rows)
  }

  // 批量操作按钮
  const batchActions = [
    {
      label: "批量审核",
      onClick: () => {
        toast({
          title: "批量审核",
          description: `已选择 ${selectedRows.length} 个项目进行批量审核`,
        })
      },
    },
    {
      label: "批量删除",
      onClick: () => {
        toast({
          title: "批量删除",
          description: `已选择 ${selectedRows.length} 个项目进行批量删除`,
        })
      },
    },
  ]

  return (
    <DataList
      selectedRows={selectedRows}
      onSelectedRowsChange={handleSelectionChange}
      batchActions={batchActions}
    />
  )
} 