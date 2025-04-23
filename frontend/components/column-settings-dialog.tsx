"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { GripVertical, MoreHorizontal } from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Column {
  id: string
  label: string
  visible: boolean
}

interface ColumnSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columns: Column[]
  onColumnsChange: (columns: Column[]) => void
}

interface SortableItemProps {
  column: Column
  onVisibilityChange: (checked: boolean) => void
}

function SortableItem({ column, onVisibilityChange }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className="flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-2 flex-1">
          <div {...attributes} {...listeners} className="cursor-grab p-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <Checkbox
            id={column.id}
            checked={column.visible}
            onCheckedChange={(checked) => onVisibilityChange(!!checked)}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label htmlFor={column.id} className="text-sm cursor-pointer select-none">
            {column.label}
          </label>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>隐藏</DropdownMenuItem>
            <DropdownMenuItem>固定到左侧</DropdownMenuItem>
            <DropdownMenuItem>固定到右侧</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default function ColumnSettingsDialog({
  open,
  onOpenChange,
  columns: initialColumns,
  onColumnsChange,
}: ColumnSettingsDialogProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns)

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id)
      const newIndex = columns.findIndex((col) => col.id === over.id)

      const newColumns = [...columns]
      const [movedItem] = newColumns.splice(oldIndex, 1)
      newColumns.splice(newIndex, 0, movedItem)

      setColumns(newColumns)
    }
  }

  const handleVisibilityChange = (id: string, visible: boolean) => {
    const newColumns = columns.map((col) => (col.id === id ? { ...col, visible } : col))
    setColumns(newColumns)
  }

  const handleReset = () => {
    setColumns(initialColumns)
  }

  const handleApply = () => {
    onColumnsChange(columns)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[320px]">
        <div className="text-base font-medium mb-4">字段设置</div>

        <div className="py-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={columns} strategy={verticalListSortingStrategy}>
              {columns.map((column) => (
                <SortableItem
                  key={column.id}
                  column={column}
                  onVisibilityChange={(checked) => handleVisibilityChange(column.id, checked)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={handleReset}>
            重置
          </Button>
          <Button size="sm" onClick={handleApply} className="bg-primary hover:bg-primary/90">
            应用
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

