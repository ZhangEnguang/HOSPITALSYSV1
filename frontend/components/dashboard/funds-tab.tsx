"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { BarChart3, TrendingUp, Wallet, GripVertical, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 拖拽排序相关库
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

// 动态导入图表组件以避免SSR问题
const ProjectFundingChart = dynamic(() => import("../charts/project-funding-chart"), { ssr: false })
const FundsDistributionChart = dynamic(() => import("../charts/funds-distribution-chart"), { ssr: false })
const FundsGrowthChart = dynamic(() => import("../charts/funds-growth-chart"), { ssr: false })
const FundsCategoryChart = dynamic(() => import("../charts/funds-category-chart"), { ssr: false })
const FundsSourceChart = dynamic(() => import("../charts/funds-source-chart"), { ssr: false })
const FundsYearTrendChart = dynamic(() => import("../charts/funds-year-trend-chart"), { ssr: false })

// 定义统计卡片组件
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, icon }: StatCardProps) {
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
        onClick={() => router.push("/funding")}
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

interface FundsTabProps {
  showAddDialog: boolean;
  setShowAddDialog: (value: boolean) => void;
  activeTab: string;
}

export default function FundsTab({ showAddDialog, setShowAddDialog, activeTab }: FundsTabProps) {
  const [selectedCharts, setSelectedCharts] = useState<string[]>([])
  const [configTabValue, setConfigTabValue] = useState("arrangement")
  const [isLoading, setIsLoading] = useState(true)
  
  // 定义额外的虚拟图表
  const additionalCharts = [
    {
      id: "funds-category",
      title: "经费类别分析",
      description: "按经费类别分析分布情况",
      type: ["funds"],
      icon: <BarChart3 />,
      renderChart: () => <FundsCategoryChart />
    },
    {
      id: "funds-source",
      title: "经费来源分析",
      description: "按经费来源分析占比",
      type: ["funds"],
      icon: <Wallet />,
      renderChart: () => <FundsSourceChart />
    },
    {
      id: "funds-year-trend",
      title: "年度经费趋势",
      description: "多年度经费变化趋势",
      type: ["funds"],
      icon: <TrendingUp />,
      renderChart: () => <FundsYearTrendChart />
    }
  ];
  
  const [activeCharts, setActiveCharts] = useState<ChartType[]>([
    {
      id: "project-funding",
      title: "项目经费分布趋势",
      description: "各类项目经费的分布趋势图",
      type: ["funds"],
      icon: <BarChart3 />,
      renderChart: () => <ProjectFundingChart />
    },
    {
      id: "funds-distribution",
      title: "各学院经费分布",
      description: "学院之间的经费分配比例",
      type: ["funds"],
      icon: <Wallet />,
      renderChart: () => <FundsDistributionChart />
    },
    {
      id: "funds-growth",
      title: "科研经费增长趋势",
      description: "近年科研经费的增长情况",
      type: ["funds"],
      icon: <TrendingUp />,
      renderChart: () => <FundsGrowthChart />
    },
    ...additionalCharts // 添加额外的图表，总共6个图表
  ])

  // 更新可用图表数组，排除已添加的图表
  const availableCharts = additionalCharts.filter(chart => !activeCharts.find(c => c.id === chart.id));

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
    if (showAddDialog && activeTab === "funds") {
      const unselectedCharts = additionalCharts
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

  const handleRemoveChart = (chartId: string) => {
    setActiveCharts((prev) => prev.filter((chart) => chart.id !== chartId))
  }

  const handleAddCharts = () => {
    // 找出选中的图表并添加到activeCharts
    const chartsToAdd = additionalCharts
      .filter(chart => selectedCharts.includes(chart.id) && !activeCharts.find(c => c.id === chart.id));
      
    setActiveCharts(prev => [...prev, ...chartsToAdd]);
    setSelectedCharts([]);
    setShowAddDialog(false);
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

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="本年度总经费"
          value="¥6,240万"
          change="较去年增长 +12.3%"
          icon={<Wallet className="h-6 w-6 text-primary" />}
        />
        
        <StatCard
          title="纵向项目数"
          value="86个"
          change="较去年增长 +8.5%"
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
        />
        
        <StatCard
          title="横向项目数"
          value="42个"
          change="较去年增长 +15.2%"
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
        />
        
        <StatCard
          title="人均科研经费"
          value="¥24.5万"
          change="较去年增长 +5.8%"
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
        />
      </div>

      {/* 图表展示区域 */}
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

      {/* 添加图表对话框 */}
      <Dialog open={showAddDialog && activeTab === "funds"} onOpenChange={(open) => activeTab === "funds" && setShowAddDialog(open)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">图表配置</DialogTitle>
            <DialogDescription>管理和排序经费统计的图表</DialogDescription>
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
                    {[...additionalCharts]
                      .filter(chart => !activeCharts.some(c => c.id === chart.id))
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
                              setActiveCharts(prev => [...prev, chart]);
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