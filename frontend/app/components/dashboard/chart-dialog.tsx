import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { GripVertical } from "lucide-react"

interface ChartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  charts: Array<{
    id: string
    title: string
  }>
  activeChartIds: string[]
  onConfirm: (chartIds: string[]) => void
}

function SortableChartItem({ chart, isActive }: { chart: { id: string; title: string }; isActive: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chart.id })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-white rounded-md border mb-2 cursor-move"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 text-gray-400" />
      <span className="text-sm">{chart.title}</span>
    </div>
  )
}

export function ChartDialog({ open, onOpenChange, charts, activeChartIds, onConfirm }: ChartDialogProps) {
  const [selectedCharts, setSelectedCharts] = React.useState(activeChartIds)
  const [orderedCharts, setOrderedCharts] = React.useState(activeChartIds)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  React.useEffect(() => {
    setSelectedCharts(activeChartIds)
    setOrderedCharts(activeChartIds)
  }, [activeChartIds])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setOrderedCharts((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-900">图表配置</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div>
            <h3 className="font-medium text-sm mb-3">可添加的图表</h3>
            <div className="space-y-2">
              {charts
                .filter((chart) => !orderedCharts.includes(chart.id))
                .map((chart) => (
                  <div key={chart.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={chart.id}
                      checked={selectedCharts.includes(chart.id)}
                      onCheckedChange={(checked) => {
                        setSelectedCharts(
                          checked
                            ? [...selectedCharts, chart.id]
                            : selectedCharts.filter((id) => id !== chart.id)
                        )
                        if (checked) {
                          setOrderedCharts([...orderedCharts, chart.id])
                        } else {
                          setOrderedCharts(orderedCharts.filter((id) => id !== chart.id))
                        }
                      }}
                    />
                    <Label htmlFor={chart.id}>{chart.title}</Label>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3">已添加的图表（拖动调整顺序）</h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToParentElement]}
            >
              <SortableContext items={orderedCharts} strategy={rectSortingStrategy}>
                <div>
                  {orderedCharts.map((chartId) => {
                    const chart = charts.find((c) => c.id === chartId)
                    if (!chart) return null
                    return <SortableChartItem key={chart.id} chart={chart} isActive={true} />
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setSelectedCharts(activeChartIds)
              setOrderedCharts(activeChartIds)
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              onConfirm(orderedCharts)
              onOpenChange(false)
            }}
          >
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 