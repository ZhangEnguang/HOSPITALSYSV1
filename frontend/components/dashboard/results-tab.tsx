"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Award, PieChart, FileText, GripVertical, X, Plus } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

// 导入拖拽排序相关库
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

// 导入图表配置
import { allCharts, defaultChartIds } from "./charts/chart-configs/index"

// 动态导入图表组件
const DynamicLineChart = dynamic(() => import("../charts/line-chart"), { ssr: false })
const DynamicBarChart = dynamic(() => import("../charts/bar-chart"), { ssr: false })
const DynamicDoughnutChart = dynamic(() => import("../charts/doughnut-chart"), { ssr: false })
const DynamicAchievementImpactChart = dynamic(() => import("../charts/achievement-impact-chart"), { ssr: false })
const DynamicAchievementMapChart = dynamic(() => import("../charts/achievement-map-chart"), { ssr: false })

// 模拟数据
const achievementTrendData = [
  { month: "1月", 论文: 5, 专利: 2, 软著: 1 },
  { month: "2月", 论文: 7, 专利: 3, 软著: 2 },
  { month: "3月", 论文: 10, 专利: 4, 软著: 3 },
  { month: "4月", 论文: 8, 专利: 2, 软著: 1 },
  { month: "5月", 论文: 12, 专利: 5, 软著: 4 },
  { month: "6月", 论文: 15, 专利: 6, 软著: 5 },
  { month: "7月", 论文: 13, 专利: 4, 软著: 3 },
  { month: "8月", 论文: 18, 专利: 7, 软著: 6 },
  { month: "9月", 论文: 20, 专利: 8, 软著: 7 },
  { month: "10月", 论文: 17, 专利: 6, 软著: 5 },
  { month: "11月", 论文: 22, 专利: 9, 软著: 8 },
  { month: "12月", 论文: 25, 专利: 10, 软著: 9 },
]

const achievementTypeData = [
  { name: "论文", value: 165 },
  { name: "专利", value: 70 },
  { name: "软件著作权", value: 55 },
  { name: "技术转让", value: 40 },
  { name: "其他", value: 25 },
]

const achievementByProjectData = [
  { name: "国家重点项目", 成果数量: 32 },
  { name: "省部级项目", 成果数量: 25 },
  { name: "横向合作项目", 成果数量: 18 },
  { name: "科技创新项目", 成果数量: 15 },
  { name: "基础研究项目", 成果数量: 10 },
]

// 模拟其他虚拟图表
const virtualCharts = [
  {
    id: "achievement-impact",
    title: "成果影响力分析",
    description: "按引用次数评估成果影响力",
    type: ["results"],
    icon: <Award />,
    renderChart: () => <DynamicAchievementImpactChart 
      customColors={["#0095FF", "#8AD7FC"]}
    />
  },
  {
    id: "achievement-distribution",
    title: "成果地域分布",
    description: "按地域统计成果发布情况",
    type: ["results"],
    icon: <PieChart />,
    renderChart: () => <DynamicAchievementMapChart />
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
  );
}

// 定义统计卡片组件
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  type?: string;
}

function StatCard({ title, value, change, icon, type }: StatCardProps) {
  const router = useRouter();

  return (
    <div className="transform-gpu transition-transform duration-300 ease-out hover:-translate-y-1">
      <Card 
        className={cn(
          "group border border-[#E9ECF2] shadow-none flex flex-col cursor-pointer",
          "transition-[border-color,box-shadow] duration-300 ease-out",
          "hover:border-primary/20",
          "hover:shadow-[0px_100px_80px_0px_rgba(212,_212,_219,_0.07),_0px_41.778px_33.422px_0px_rgba(212,_212,_219,_0.05),_0px_22.336px_17.869px_0px_rgba(212,_212,_219,_0.04),_0px_12.522px_10.017px_0px_rgba(212,_212,_219,_0.04),_0px_6.65px_5.32px_0px_rgba(212,_212,_219,_0.03),_0px_2.767px_2.214px_0px_rgba(212,_212,_219,_0.02)]"
        )}
        onClick={() => type && router.push(`/${type}`)}
      >
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <CardTitle className="text-[14px] font-medium text-muted-foreground">{title}</CardTitle>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{change}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg flex items-center justify-center transition-colors duration-300 ease-out group-hover:bg-primary/20">
            {React.cloneElement(icon as React.ReactElement, { 
              className: "h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" 
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

interface ResultsTabProps {
  showAddDialog: boolean;
  setShowAddDialog: (value: boolean) => void;
  activeTab: string;
}

export default function ResultsTab({ showAddDialog, setShowAddDialog, activeTab }: ResultsTabProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCharts, setSelectedCharts] = useState<string[]>([])
  const [activeCharts, setActiveCharts] = useState<ChartType[]>([
    {
      id: "achievement-trend",
      title: "成果趋势",
      description: "近12个月成果产出情况",
      type: ["results"],
      icon: <TrendingUp />,
      size: "large",
      renderChart: () => <DynamicLineChart data={achievementTrendData} />
    },
    {
      id: "achievement-type",
      title: "成果类型分布",
      description: "按类型统计成果数量",
      type: ["results"],
      icon: <PieChart />,
      renderChart: () => <DynamicDoughnutChart data={achievementTypeData} />
    },
    {
      id: "achievement-by-project",
      title: "项目成果分析",
      description: "按项目统计成果数量",
      type: ["results"],
      icon: <BarChart3 />,
      renderChart: () => <DynamicBarChart data={achievementByProjectData} />
    },
    {
      id: "achievement-impact",
      title: "成果影响力分析",
      description: "按引用次数评估成果影响力",
      type: ["results"],
      icon: <Award />,
      renderChart: () => <DynamicAchievementImpactChart />
    },
    {
      id: "achievement-distribution",
      title: "成果地域分布",
      description: "按地域统计成果发布情况",
      type: ["results"],
      icon: <PieChart />,
      renderChart: () => <DynamicAchievementMapChart />
    }
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

  // 设置默认选中所有未添加的图表
  useEffect(() => {
    if (showAddDialog && activeTab === "results") {
      const unselectedCharts = allCharts
        .filter(chart => chart.type.includes("results"))
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

  // 处理图表选择
  const handleAddCharts = () => {
    const chartsToAdd = allCharts
      .filter(chart => 
        chart.type.includes("results") && 
        selectedCharts.includes(chart.id) && 
        !activeCharts.find(c => c.id === chart.id)
      );
      
    setActiveCharts(prev => [...prev, ...chartsToAdd] as ChartType[]);
    setShowAddDialog(false);
  };

  const handleRemoveChart = (chartId: string) => {
    setActiveCharts(prev => prev.filter(chart => chart.id !== chartId));
  };

  const availableCharts = [...allCharts, ...virtualCharts]
    .filter(chart => chart.type.includes("results"))
    .filter(chart => !activeCharts.find(c => c.id === chart.id));

  return (
    <div className="space-y-6">
      {/* 数据统计卡片 */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="总成果数" 
          value="355" 
          change="+15.6%" 
          icon={<Award className="h-4 w-4 text-blue-600" />} 
          type="achievements" 
        />
        <StatCard 
          title="论文发表数量" 
          value="165" 
          change="+12.3%" 
          icon={<FileText className="h-4 w-4 text-yellow-600" />} 
          type="papers" 
        />
        <StatCard 
          title="专利申请数量" 
          value="70" 
          change="+8.5%" 
          icon={<Award className="h-4 w-4 text-green-600" />} 
          type="patents" 
        />
        <StatCard 
          title="软件著作权" 
          value="55" 
          change="+15.2%" 
          icon={<BarChart3 className="h-4 w-4 text-purple-600" />} 
          type="software" 
        />
      </div>
      
      {/* 图表展示区域 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {activeCharts.map((chart) => (
          <div key={chart.id} className={cn(
            "col-span-1 md:col-span-6",
            chart.size === "large" ? "2xl:col-span-8" : "2xl:col-span-4",
            chart.size === "large" ? "xl:col-span-12" : "xl:col-span-6"
          )}>
            <ChartCard chart={chart} />
          </div>
        ))}
      </div>

      {/* 添加图表对话框 */}
      <Dialog open={showAddDialog && activeTab === "results"} onOpenChange={(open) => activeTab === "results" && setShowAddDialog(open)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">图表配置</DialogTitle>
            <DialogDescription>管理和排序成果统计的图表</DialogDescription>
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
                    {allCharts
                      .filter(chart => chart.type.includes("results") && !activeCharts.some(c => c.id === chart.id))
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
  );
}

