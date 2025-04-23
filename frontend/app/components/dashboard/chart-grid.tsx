import React from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical } from "lucide-react"

interface ChartGridProps {
  charts: Array<{
    id: string
    title: string
    component: React.ComponentType
  }>
  activeChartIds: string[]
  onOrderChange: (newOrder: string[]) => void
}

export function ChartGrid({ charts, activeChartIds, onOrderChange }: ChartGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = activeChartIds.indexOf(active.id)
      const newIndex = activeChartIds.indexOf(over.id)
      onOrderChange(arrayMove(activeChartIds, oldIndex, newIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext items={activeChartIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeChartIds.map((chartId) => {
            const chart = charts.find((c) => c.id === chartId)
            if (!chart) return null

            return (
              <Card key={chart.id} className="border-0 group">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <GripVertical className="h-4 w-4 opacity-0 group-hover:opacity-50 cursor-move" />
                    {chart.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {React.createElement(chart.component)}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </SortableContext>
    </DndContext>
  )
} 