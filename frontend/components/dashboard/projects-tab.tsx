"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, BarChart3, PieChart, TrendingUp, Award, CheckCircle, X, GripVertical, Plus } from "lucide-react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 导入拖拽排序相关库
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

// 动态导入图表组件以避免SSR问题
const DynamicBarChart = dynamic(() => import("../charts/bar-chart"), { ssr: false })
const DynamicPieChart = dynamic(() => import("../charts/pie-chart"), { ssr: false })
const DynamicStackedBarChart = dynamic(() => import("../charts/stacked-bar-chart"), { ssr: false })
const DynamicRadarChart = dynamic(() => import("../charts/radar-chart"), { ssr: false })
const DynamicProjectDistributionChart = dynamic(() => import("../../components/charts/project-distribution-chart"), { ssr: false })

// 导入图表配置
import { allCharts, defaultChartIds } from "./charts/chart-configs/index"

// 立项阶段分布数据
const projectDistributionData = {
  discipline: [
    { name: "信息科学", value: 28 },
    { name: "材料科学", value: 22 },
    { name: "生物医学", value: 18 },
    { name: "能源环境", value: 12 },
    { name: "人文社科", value: 6 },
  ],
  department: [
    { name: "计算机学院", value: 18 },
    { name: "材料学院", value: 16 },
    { name: "电子信息学院", value: 14 },
    { name: "生命科学学院", value: 12 },
    { name: "机械工程学院", value: 10 },
    { name: "化学化工学院", value: 8 },
    { name: "其他学院", value: 8 },
  ],
  level: [
    { name: "国家级重点", value: 12 },
    { name: "国家级一般", value: 18 },
    { name: "省部级重点", value: 24 },
    { name: "省部级一般", value: 20 },
    { name: "横向合作", value: 12 },
  ],
}

// 项目进度里程碑统计数据
const milestoneStatusData = [
  {
    name: "立项阶段",
    正常完成: 42,
    延期完成: 8,
    超期完成: 2,
  },
  {
    name: "中期检查",
    正常完成: 36,
    延期完成: 12,
    超期完成: 4,
  },
  {
    name: "成果产出",
    正常完成: 30,
    延期完成: 15,
    超期完成: 7,
  },
  {
    name: "结题验收",
    正常完成: 28,
    延期完成: 18,
    超期完成: 6,
  },
  {
    name: "成果转化",
    正常完成: 22,
    延期完成: 14,
    超期完成: 8,
  },
]

// 结题验收质量评估 - 各学院数据
const completionQualityByDepartment = [
  { subject: "计算机学院", 优秀: 85, 合格: 12, 整改: 3 },
  { subject: "材料学院", 优秀: 78, 合格: 18, 整改: 4 },
  { subject: "电子信息学院", 优秀: 82, 合格: 15, 整改: 3 },
  { subject: "生命科学学院", 优秀: 75, 合格: 20, 整改: 5 },
  { subject: "机械工程学院", 优秀: 70, 合格: 25, 整改: 5 },
  { subject: "化学化工学院", 优秀: 80, 合格: 15, 整改: 5 },
]

// 结题验收质量评估 - 近五年趋势
const completionQualityTrend = [
  { year: "2019", 优秀: 65, 合格: 30, 整改: 5 },
  { year: "2020", 优秀: 68, 合格: 28, 整改: 4 },
  { year: "2021", 优秀: 72, 合格: 24, 整改: 4 },
  { year: "2022", 优秀: 75, 合格: 22, 整改: 3 },
  { year: "2023", 优秀: 78, 合格: 19, 整改: 3 },
]

interface ProjectsTabProps {
  showAddDialog: boolean;
  setShowAddDialog: (value: boolean) => void;
  activeTab: string;
}

// 图表类型定义
type ChartType = {
  id: string;
  title: string;
  description: string;
  type: string[];
  icon: React.ReactElement;
  size?: string;
  renderChart: () => React.ReactNode;
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

// 图表卡片组件
function ChartCard({ chart }: { chart: ChartType }) {
  return (
    <Card 
      className={cn(
        "border border-[#E9ECF2]",
        chart.size === "large" && "lg:col-span-2"
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              {React.cloneElement(chart.icon, { className: "h-4 w-4 text-primary" })}
            </div>
            <CardTitle className="text-[20px] font-normal">{chart.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[350px]">
        {chart.renderChart()}
      </CardContent>
    </Card>
  );
}

export default function ProjectsTab({ showAddDialog, setShowAddDialog, activeTab }: ProjectsTabProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCharts, setSelectedCharts] = useState<string[]>([])
  const [activeCharts, setActiveCharts] = useState<ChartType[]>([
    {
      id: "project-distribution",
      title: "立项阶段分布分析",
      description: "按学科/单位/项目级别分布",
      type: ["projects"],
      icon: <PieChart />,
      size: "large",
      renderChart: () => <DynamicProjectDistributionChart />
    },
    {
      id: "milestone-status",
      title: "项目进度里程碑统计",
      description: "正常/延期/超期完成率",
      type: ["projects"],
      icon: <BarChart3 />,
      renderChart: () => (
        <div className="h-[350px] px-2">
          <DynamicStackedBarChart 
            data={milestoneStatusData}
            colors={{
              正常完成: "#0ea5e9",
              延期完成: "#f97316",
              超期完成: "#ef4444"
            }}
            layout={{
              barCategoryGap: "30%",
              margin: { top: 20, right: 30, left: 20, bottom: 10 }
            }}
          />
        </div>
      ),
    },
    {
      id: "completion-quality",
      title: "结题验收质量评估",
      description: "优秀/合格/整改比例",
      type: ["projects"],
      icon: <Award />,
      size: "large",
      renderChart: () => (
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col">
            <h3 className="mb-4 text-center text-sm font-medium">各学院结题质量评估</h3>
            <div className="flex-1">
              <DynamicRadarChart data={completionQualityByDepartment} />
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-center text-sm font-medium">近五年结题质量趋势</h3>
            <div className="h-[280px]">
              <DynamicBarChart data={completionQualityTrend} />
            </div>
          </div>
        </div>
      ),
    },
  ])
  const [configTabValue, setConfigTabValue] = useState("arrangement")

  // 初始化传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  )

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

  // 处理添加图表
  const handleAddCharts = () => {
    const chartsToAdd = allCharts
      .filter(chart => 
        chart.type.includes("projects") && 
        selectedCharts.includes(chart.id) && 
        !activeCharts.find(c => c.id === chart.id)
      );
      
    setActiveCharts(prev => [...prev, ...chartsToAdd] as ChartType[]);
    setShowAddDialog(false);
  };

  // 处理移除图表
  const handleRemoveChart = (chartId: string) => {
    setActiveCharts(prev => prev.filter(chart => chart.id !== chartId));
  };

  // 设置默认选中所有未添加的图表
  useEffect(() => {
    if (showAddDialog && activeTab === "projects") {
      const unselectedCharts = allCharts
        .filter(chart => chart.type.includes("projects"))
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

  const virtualCharts: ChartType[] = [
    {
      id: "achievement-impact",
      title: "成果影响力分析",
      description: "按引用次数评估成果影响力",
      type: ["results"],
      icon: <Award />,
      renderChart: () => <div>成果影响力分析图表</div>
    },
    {
      id: "achievement-distribution",
      title: "成果地域分布",
      description: "按地域统计成果发布情况",
      type: ["results"],
      icon: <PieChart />,
      renderChart: () => <div>成果地域分布图表</div>
    },
    {
      id: "achievement-growth",
      title: "成果增长率",
      description: "按年度统计成果增长情况",
      type: ["results"],
      icon: <TrendingUp />,
      renderChart: () => <div>成果增长率图表</div>
    }
  ];

  const availableCharts = [...allCharts, ...virtualCharts]
    .filter(chart => Array.isArray(chart.type) ? chart.type.includes("projects") : chart.type === "projects")
    .filter(chart => !activeCharts.find(c => c.id === chart.id))
    .map(chart => ({
      ...chart,
      type: Array.isArray(chart.type) ? chart.type : [chart.type]
    }));

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
        <div className="transform-gpu transition-transform duration-300 ease-out hover:-translate-y-1">
          <Card className="group border border-[#E9ECF2] shadow-none flex flex-col cursor-pointer transition-[border-color,box-shadow] duration-300 ease-out hover:border-primary/20 hover:shadow-[0px_100px_80px_0px_rgba(212,_212,_219,_0.07),_0px_41.778px_33.422px_0px_rgba(212,_212,_219,_0.05),_0px_22.336px_17.869px_0px_rgba(212,_212,_219,_0.04),_0px_12.522px_10.017px_0px_rgba(212,_212,_219,_0.04),_0px_6.65px_5.32px_0px_rgba(212,_212,_219,_0.03),_0px_2.767px_2.214px_0px_rgba(212,_212,_219,_0.02)]">
            <div className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <CardTitle className="text-[14px] font-medium text-muted-foreground">立项总数</CardTitle>
                <div className="text-2xl font-bold">86</div>
                <p className="text-xs text-muted-foreground">本年度新增 24 项</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg flex items-center justify-center transition-colors duration-300 ease-out group-hover:bg-primary/20">
                <FileText className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" />
              </div>
            </div>
          </Card>
        </div>
        <div className="transform-gpu transition-transform duration-300 ease-out hover:-translate-y-1">
          <Card className="group border border-[#E9ECF2] shadow-none flex flex-col cursor-pointer transition-[border-color,box-shadow] duration-300 ease-out hover:border-primary/20 hover:shadow-[0px_100px_80px_0px_rgba(212,_212,_219,_0.07),_0px_41.778px_33.422px_0px_rgba(212,_212,_219,_0.05),_0px_22.336px_17.869px_0px_rgba(212,_212,_219,_0.04),_0px_12.522px_10.017px_0px_rgba(212,_212,_219,_0.04),_0px_6.65px_5.32px_0px_rgba(212,_212,_219,_0.03),_0px_2.767px_2.214px_0px_rgba(212,_212,_219,_0.02)]">
            <div className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <CardTitle className="text-[14px] font-medium text-muted-foreground">进行中项目</CardTitle>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">平均进度 63%</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg flex items-center justify-center transition-colors duration-300 ease-out group-hover:bg-primary/20">
                <TrendingUp className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" />
              </div>
            </div>
          </Card>
        </div>
        <div className="transform-gpu transition-transform duration-300 ease-out hover:-translate-y-1">
          <Card className="group border border-[#E9ECF2] shadow-none flex flex-col cursor-pointer transition-[border-color,box-shadow] duration-300 ease-out hover:border-primary/20 hover:shadow-[0px_100px_80px_0px_rgba(212,_212,_219,_0.07),_0px_41.778px_33.422px_0px_rgba(212,_212,_219,_0.05),_0px_22.336px_17.869px_0px_rgba(212,_212,_219,_0.04),_0px_12.522px_10.017px_0px_rgba(212,_212,_219,_0.04),_0px_6.65px_5.32px_0px_rgba(212,_212,_219,_0.03),_0px_2.767px_2.214px_0px_rgba(212,_212,_219,_0.02)]">
            <div className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <CardTitle className="text-[14px] font-medium text-muted-foreground">已结题项目</CardTitle>
                <div className="text-2xl font-bold">38</div>
                <p className="text-xs text-muted-foreground">优秀率 76%</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg flex items-center justify-center transition-colors duration-300 ease-out group-hover:bg-primary/20">
                <CheckCircle className="h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 图表网格 */}
      <div className="grid gap-4 auto-rows-[minmax(350px,auto)]" style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 450px), 1fr))"
      }}>
        {activeCharts.map((chart) => (
          <ChartCard 
            key={chart.id} 
            chart={chart}
          />
        ))}
      </div>

      {/* 添加图表对话框 */}
      <Dialog open={showAddDialog && activeTab === "projects"} onOpenChange={(open) => activeTab === "projects" && setShowAddDialog(open)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">图表配置</DialogTitle>
            <DialogDescription>管理和排序项目分析的图表</DialogDescription>
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
                <SortableContext items={activeCharts.map(c => c.id)} strategy={rectSortingStrategy}>
                  <div className="grid gap-4 max-h-[350px] overflow-y-auto">
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
                  <div className="grid gap-4 max-h-[350px] overflow-y-auto pr-2">
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
                  <div className="grid gap-4 max-h-[350px] overflow-y-auto pl-2">
                    {allCharts
                      .filter(chart => chart.type.includes("projects") && !activeCharts.some(c => c.id === chart.id))
                      .map((chart) => (
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
                              setActiveCharts(prev => [...prev, {
                                ...chart, 
                                type: Array.isArray(chart.type) ? chart.type : [chart.type]
                              } as ChartType]);
                              setShowAddDialog(false);
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
    </div>
  )
}

