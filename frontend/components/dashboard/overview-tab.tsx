/**
 * 仪表盘概览标签页
 *
 * 该组件展示了项目统计数据和各种图表，包括：
 * - 顶部统计卡片：显示项目数量、任务、资金和成果
 * - 可配置的图表网格：用户可以添加或删除图表
 *
 * 所有图表和数据已被拆分到单独的文件中以提高可维护性
 */
"use client"

import React, { useEffect, useState } from "react"
import { BarChart3, Award, FileText, Clock, Plus, GripVertical, X, PieChart, Activity, Users, CheckCircle, Wallet } from "lucide-react"
import dynamic from "next/dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 导入拆分后的组件和数据
import { StatCard } from "./stat-card"
import { allCharts, defaultChartIds } from "./charts/chart-configs/index"

// 导入拖拽排序相关库
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

// 动态导入图表组件
const DynamicProjectHealthChart = dynamic(() => import("../charts/project-health-chart"), { ssr: false })
const DynamicTeamDistributionChart = dynamic(() => import("../charts/team-distribution-chart"), { ssr: false })
const DynamicResourceUtilizationChart = dynamic(() => import("../charts/resource-utilization-chart"), { ssr: false })

// 新增高校科研系统相关统计图
const DynamicProjectStatusChart = dynamic(() => import("../charts/project-status-chart"), { ssr: false })
const DynamicTeacherPublicationChart = dynamic(() => import("../charts/teacher-publication-chart"), { ssr: false })
const DynamicProjectFundingChart = dynamic(() => import("../charts/project-funding-chart"), { ssr: false })

interface OverviewTabProps {
  showAddDialog: boolean;
  setShowAddDialog: (value: boolean) => void;
  activeTab: string;
}

// 图表类型定义
type ChartType = {
  id: string;
  title: string;
  description?: string;
  type: string[];
  icon: React.ReactElement;
  size?: string;
  renderChart: () => React.ReactNode;
  previewComponent?: React.ReactNode;
};

// 可排序图表项组件
function SortableChartItem({ chart, showGrip = true }: { chart: ChartType, showGrip?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: chart.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center space-x-3 space-y-0 border p-3 rounded-md"
    >
      {showGrip && (
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab p-1 rounded hover:bg-slate-100"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className="p-2 rounded-full bg-primary/10">
        {React.cloneElement(chart.icon, { className: "h-4 w-4 text-primary" })}
      </div>
      <div className="grid gap-1.5 leading-none">
        <span className="text-sm font-medium leading-none">{chart.title}</span>
        {chart.description && (
          <p className="text-xs text-muted-foreground">{chart.description}</p>
        )}
      </div>
    </div>
  );
}

// 修复SortableChartItem子组件问题
function SortableItem({ children, id }: { children: React.ReactNode, id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

// 图表卡片组件
function ChartCard({ chart }: { chart: ChartType }) {
  return (
    <Card 
      className={cn(
        "border border-[#E9ECF2] shadow-none",
        chart.size === "large" && "lg:col-span-2"
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              {React.cloneElement(chart.icon, { className: "h-4 w-4 text-primary" })}
            </div>
            <CardTitle className="text-[18px] font-normal">{chart.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[350px]">
        {chart.renderChart()}
      </CardContent>
    </Card>
  )
}

// 更新虚拟图表为高校科研系统相关统计图
const virtualCharts: ChartType[] = [
  {
    id: "research-status",
    title: "科研项目状态分布",
    type: ["overview"],
    icon: <PieChart className="h-4 w-4" />,
    renderChart: () => <DynamicProjectStatusChart />
  },
  {
    id: "teacher-publication",
    title: "教师发表论文统计",
    type: ["overview"],
    icon: <FileText className="h-4 w-4" />,
    renderChart: () => <DynamicTeacherPublicationChart />
  },
  {
    id: "funding-distribution",
    title: "科研经费分配情况",
    type: ["overview"],
    icon: <BarChart3 className="h-4 w-4" />,
    renderChart: () => <DynamicProjectFundingChart />
  },
  {
    id: "project-health",
    title: "项目健康度评估",
    type: ["overview"],
    icon: <Activity className="h-4 w-4" />,
    renderChart: () => <DynamicProjectHealthChart />
  },
  {
    id: "team-distribution",
    title: "研究团队分布",
    type: ["overview"],
    icon: <Users className="h-4 w-4" />,
    renderChart: () => <DynamicTeamDistributionChart />
  },
  {
    id: "resource-utilization",
    title: "资源利用率",
    type: ["overview"],
    icon: <BarChart3 className="h-4 w-4" />,
    renderChart: () => <DynamicResourceUtilizationChart />
  }
];

export default function OverviewTab({ showAddDialog, setShowAddDialog, activeTab }: OverviewTabProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCharts, setSelectedCharts] = useState<string[]>([])
  const [activeCharts, setActiveCharts] = useState<ChartType[]>([
    // 默认展示6个图表
    {
      id: "research-status",
      title: "科研项目状态分布",
      type: ["overview"],
      icon: <PieChart className="h-4 w-4" />,
      renderChart: () => <DynamicProjectStatusChart />
    },
    {
      id: "teacher-publication",
      title: "教师发表论文统计",
      type: ["overview"],
      icon: <FileText className="h-4 w-4" />,
      renderChart: () => <DynamicTeacherPublicationChart />
    },
    {
      id: "funding-distribution",
      title: "科研经费分配情况",
      type: ["overview"],
      icon: <BarChart3 className="h-4 w-4" />,
      renderChart: () => <DynamicProjectFundingChart />
    },
    {
      id: "project-progress",
      title: "项目进度分布",
      type: ["overview"],
      icon: <Activity className="h-4 w-4" />,
      renderChart: () => <DynamicProjectHealthChart />
    },
    {
      id: "task-completion",
      title: "任务完成情况",
      type: ["overview"],
      icon: <CheckCircle className="h-4 w-4" />,
      renderChart: () => <DynamicTeamDistributionChart />
    },
    {
      id: "funding-overview",
      title: "经费概览",
      type: ["overview"],
      icon: <Wallet className="h-4 w-4" />,
      renderChart: () => <DynamicResourceUtilizationChart />
    }
  ])
  const [configTabValue, setConfigTabValue] = useState("arrangement")
  const [open, setOpen] = useState(false)
  
  // 初始化传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  )

  // 设置默认选中所有未添加的图表
  useEffect(() => {
    if (showAddDialog && activeTab === "overview") {
      const unselectedCharts = allCharts
        .filter(chart => chart.type.includes("overview"))
        .filter(chart => !activeCharts.find(c => c.id === chart.id))
        .map(chart => chart.id);
      setSelectedCharts(unselectedCharts);
    }
  }, [showAddDialog, activeCharts, activeTab]);

  useEffect(() => {
    // 模拟加载数据
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setActiveCharts((charts) => {
        const oldIndex = charts.findIndex(c => c.id === active.id);
        const newIndex = charts.findIndex(c => c.id === over.id);
        
        return arrayMove(charts, oldIndex, newIndex);
      });
    }
  };

  const handleAddCharts = () => {
    const newCharts = allCharts
      .filter((chart) => selectedCharts.includes(chart.id))
      .map(chart => {
        // 为特定图表自定义颜色和样式
        if (chart.id === "project-progress") {
          return {
            ...chart,
            type: Array.isArray(chart.type) ? chart.type : [chart.type],
            customColors: ["#F97F7F", "#8AD7FC", "#7275F2", "#92F1B4"],
            legendPosition: "bottom",
            compactSize: true
          };
        } else if (chart.id === "task-completion") {
          return {
            ...chart,
            type: Array.isArray(chart.type) ? chart.type : [chart.type],
            chartType: "stacked",
            customColors: ["#246EFF", "#00B2FF", "#81E2FF"]
          };
        } else if (chart.id === "funding-overview") {
          return {
            ...chart,
            type: Array.isArray(chart.type) ? chart.type : [chart.type],
            customColors: ["#3469FF", "#37E2E2", "#FF7D00"],
            lineStyle: "gradient",
            lineWidth: 2,
            smooth: true
          };
        }
        
        return {
          ...chart,
          type: Array.isArray(chart.type) ? chart.type : [chart.type]
        };
      }) as ChartType[]
    setActiveCharts((prev) => [...prev, ...newCharts])
    setSelectedCharts([])
    setShowAddDialog(false)
  }

  const handleRemoveChart = (chartId: string) => {
    setActiveCharts((prev) => prev.filter((chart) => chart.id !== chartId))
  }

  const availableCharts = [...allCharts, ...virtualCharts]
    .filter(chart => Array.isArray(chart.type) ? chart.type.includes("overview") : chart.type === "overview")
    .filter(chart => !activeCharts.find(c => c.id === chart.id))
    .map(chart => ({
      ...chart,
      type: Array.isArray(chart.type) ? chart.type : [chart.type]
    })) as ChartType[];

  return (
    <div className="space-y-4">
      {/* 顶部统计卡片 */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="进行中项目"
          value="12"
          change="+2"
          icon={<FileText className="h-4 w-4 text-blue-600" />}
          type="projects"
        />
        <StatCard
          title="待办任务"
          value="24"
          change="15 项紧急"
          icon={<Clock className="h-4 w-4 text-yellow-600" />}
          type="tasks"
        />
        <StatCard
          title="已获资助"
          value="¥1,234,500"
          change="使用率 58%"
          icon={<BarChart3 className="h-4 w-4 text-green-600" />}
          type="funding"
        />
        <StatCard
          title="研究成果"
          value="85"
          change="较上年 +12"
          icon={<Award className="h-4 w-4 text-purple-600" />}
          type="achievements"
        />
      </div>

      {/* 添加/配置图表对话框 */}
      <Dialog open={showAddDialog && activeTab === "overview"} onOpenChange={(open) => activeTab === "overview" && setShowAddDialog(open)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">图表配置</DialogTitle>
            <DialogDescription>管理和排序综合概览的图表</DialogDescription>
          </DialogHeader>
          
          <Tabs value={configTabValue} onValueChange={setConfigTabValue} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="arrangement">排序图表</TabsTrigger>
              <TabsTrigger value="manage">管理图表</TabsTrigger>
            </TabsList>
            
            <TabsContent value="arrangement" className="pt-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToParentElement]}
              >
                <SortableContext items={activeCharts.map(chart => chart.id)} strategy={rectSortingStrategy}>
                  <div className="grid gap-3 max-h-[350px] overflow-y-auto">
                    {activeCharts.map((chart) => (
                      <SortableChartItem key={chart.id} chart={chart} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </TabsContent>
            
            <TabsContent value="manage" className="pt-4">
              <div className="flex space-x-4">
                {/* 已添加图表 */}
                <div className="w-1/2">
                  <h3 className="font-medium text-sm mb-3">已添加图表</h3>
                  <div className="grid gap-3 max-h-[350px] overflow-y-auto pr-2">
                    {activeCharts.map((chart) => (
                      <div key={chart.id} className="flex items-center justify-between border p-3 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            {React.cloneElement(chart.icon, { className: "h-4 w-4 text-primary" })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{chart.title}</p>
                            {chart.description && (
                              <p className="text-xs text-muted-foreground truncate">{chart.description}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveChart(chart.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 可添加图表 */}
                <div className="w-1/2">
                  <h3 className="font-medium text-sm mb-3">可添加图表</h3>
                  <div className="grid gap-3 max-h-[350px] overflow-y-auto pl-2">
                    {availableCharts.map((chart) => (
                      <div key={chart.id} className="flex items-center justify-between border p-3 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            {React.cloneElement(chart.icon, { className: "h-4 w-4 text-primary" })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{chart.title}</p>
                            {chart.description && (
                              <p className="text-xs text-muted-foreground truncate">{chart.description}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 flex-shrink-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                          onClick={() => {
                            setActiveCharts(prev => [...prev, chart]);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button onClick={() => setShowAddDialog(false)}>
              完成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 图表部分 */}
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {isLoading ? (
          // 加载状态
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border border-[#E9ECF2] h-[350px] shadow-none">
              <CardHeader>
                <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[320px]">
                <div className="animate-pulse h-40 w-40 bg-gray-200 rounded-full"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          // 实际图表
          activeCharts.map((chart) => (
            <ChartCard key={chart.id} chart={chart} />
          ))
        )}
      </div>
    </div>
  )
}

