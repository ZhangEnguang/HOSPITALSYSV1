"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { ColumnDef } from "./data-list"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

interface ColumnSettingsProps {
  columns: ColumnDef[]
  initialSelected: string[]
  onConfirm: (selectedColumns: string[]) => void
  onCancel: () => void
}

interface SortableItemProps {
  id: string
  children: React.ReactNode
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="mb-2 select-none">
      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
        <div {...listeners} className="cursor-grab p-1 hover:bg-muted-foreground/10 rounded">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        {children}
      </div>
    </div>
  )
}

export default function ColumnSettings({ columns, initialSelected, onConfirm, onCancel }: ColumnSettingsProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(initialSelected)
  const [orderedColumns, setOrderedColumns] = useState<ColumnDef[]>([])

  // 初始化列顺序
  useEffect(() => {
    // 首先把已选中的列按照选中顺序排序
    const selected = columns
      .filter((col) => initialSelected.includes(col.id))
      .sort((a, b) => {
        return initialSelected.indexOf(a.id) - initialSelected.indexOf(b.id)
      })

    // 然后添加未选中的列
    const unselected = columns.filter((col) => !initialSelected.includes(col.id))

    setOrderedColumns([...selected, ...unselected])
  }, [columns, initialSelected])

  // 设置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setOrderedColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = [...items]
        const [movedItem] = newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, movedItem)

        return newItems
      })

      // 更新选中列的顺序
      if (selectedColumns.includes(active.id.toString())) {
        setSelectedColumns((items) => {
          const result = [...items]
          const oldIndex = items.indexOf(active.id.toString())
          const newIndex = items.indexOf(over.id.toString())

          if (oldIndex >= 0 && newIndex >= 0) {
            result.splice(oldIndex, 1)
            result.splice(newIndex, 0, active.id.toString())
          }

          return result
        })
      }
    }
  }

  // 切换列选择状态
  const toggleColumn = (columnId: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId)
      } else {
        return [...prev, columnId]
      }
    })
  }

  // 全选/取消全选
  const toggleAll = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([])
    } else {
      setSelectedColumns(columns.map((col) => col.id))
    }
  }

  // 应用设置
  const applySettings = () => {
    // 根据orderedColumns的顺序重新排列selectedColumns
    const orderedSelected = orderedColumns.filter((col) => selectedColumns.includes(col.id)).map((col) => col.id)

    onConfirm(orderedSelected)
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="flex items-center space-x-2 pb-2">
        <Checkbox id="select-all" checked={selectedColumns.length === columns.length} onCheckedChange={toggleAll} />
        <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
          全选
        </Label>
        <span className="text-sm text-muted-foreground ml-auto">
          已选 {selectedColumns.length}/{columns.length}
        </span>
      </div>

      <Separator />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedColumns.map((col) => col.id)} strategy={verticalListSortingStrategy}>
          <div>
            {orderedColumns.map((column) => (
              <SortableItem key={column.id} id={column.id}>
                <div className="flex items-center space-x-2 flex-1">
                  <Checkbox
                    id={column.id}
                    checked={selectedColumns.includes(column.id)}
                    onCheckedChange={() => toggleColumn(column.id)}
                  />
                  <Label htmlFor={column.id} className="cursor-pointer">
                    {column.header}
                  </Label>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="pt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={applySettings}>应用设置</Button>
      </div>
    </div>
  )
}

