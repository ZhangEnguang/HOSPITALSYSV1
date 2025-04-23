"use client"

import React, { useEffect, useState } from "react"
import { BarChart3, Award, FileText, Clock, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"

// 导入拆分后的组件和数据
import { StatCard } from "@/components/dashboard/stat-card"
import { allCharts, defaultChartIds } from "./charts/chart-configs"
import { ChartDialog } from "./chart-dialog"
import "./charts/register"

const OverviewTab = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [activeChartIds, setActiveChartIds] = useState<string[]>(defaultChartIds)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedCharts, setSelectedCharts] = useState(defaultChartIds)

  // 初始化传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setActiveChartIds((items: string[]) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const availableCharts = [
    { id: "project-progress", title: "项目进度统计" },
    { id: "fund-allocation", title: "经费分配情况" },
    { id: "milestone-completion", title: "里程碑完成率" },
    { id: "team-workload", title: "团队工作量" },
    { id: "risk-assessment", title: "风险评估" },
    { id: "quality-metrics", title: "质量指标" },
  ]

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="进行中项目"
          value="12"
          change="+2"
          icon={<FileText className="h-5 w-5" />}
          type="projects"
        />
        <StatCard
          title="待办任务"
          value="24"
          change="15 项紧急"
          icon={<Clock className="h-5 w-5" />}
          type="tasks"
        />
        <StatCard
          title="已获资助"
          value="¥1,234,500"
          change="使用率 58%"
          icon={<BarChart3 className="h-5 w-5" />}
          type="funding"
        />
        <StatCard
          title="研究成果"
          value="85"
          change="+12"
          icon={<Award className="h-5 w-5" />}
          type="achievements"
        />
      </div>

      {/* 图表控制栏 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">总览</h2>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="mr-1 h-4 w-4" />
          添加图表
        </Button>
      </div>

      {/* 图表网格 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
ifiers={[restrictToParentElement]}
      >        mod
        <SortableContext items={activeChartIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeChartIds.map((chartId: string) => {
              const chart = allCharts.find((c) => c.id === chartId)
              if (!chart) return null

              return (
                <Card key={chart.id} className="border-0">
                  <CardHeader>
                    <CardTitle className="text-base font-medium">{chart.title}</CardTitle>
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

      <ChartDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        charts={allCharts}
        activeChartIds={activeChartIds}
        onConfirm={setActiveChartIds}
      />
    </div>
  )
}

export default OverviewTab 