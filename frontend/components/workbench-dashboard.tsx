"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"

// 动态导入各个标签页组件
const OverviewTab = dynamic(() => import("./dashboard/overview-tab"), { ssr: false })
const ProjectsTab = dynamic(() => import("./dashboard/projects-tab"), { ssr: false })
const FundsTab = dynamic(() => import("./dashboard/funds-tab"), { ssr: false })
const ResultsTab = dynamic(() => import("./dashboard/results-tab"), { ssr: false })

// 映射URL参数到tab值
const tabMapping: Record<string, string> = {
  "overview": "overview",
  "project-analysis": "projects",
  "budget-statistics": "funds",
  "achievement-statistics": "results"
}

export default function WorkbenchDashboard() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddDialog, setShowAddDialog] = useState(false)

  // 从URL查询参数更新活动tab
  useEffect(() => {
    if (searchParams) {
      const tabParam = searchParams.get('tab')
      if (tabParam && tabParam in tabMapping) {
        setActiveTab(tabMapping[tabParam])
      }
    }
  }, [searchParams])

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">
              {activeTab === "overview" ? "综合概览" : 
               activeTab === "projects" ? "项目分析" : 
               activeTab === "funds" ? "经费统计" : 
               activeTab === "results" ? "成果统计" : "工作台"}
            </h1>
            <TabsList className="hidden">
              <TabsTrigger value="overview">综合概览</TabsTrigger>
              <TabsTrigger value="projects">项目分析</TabsTrigger>
              <TabsTrigger value="funds">经费统计</TabsTrigger>
              <TabsTrigger value="results">成果统计</TabsTrigger>
            </TabsList>
          </div>
          <Button size="sm" className="gap-1 bg-primary hover:bg-primary/90" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4" /> 添加图表
          </Button>
        </div>

        {/* 总览 Tab */}
        <TabsContent value="overview">
          <OverviewTab showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} activeTab={activeTab} />
        </TabsContent>

        {/* 项目 Tab */}
        <TabsContent value="projects">
          <ProjectsTab showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} activeTab={activeTab} />
        </TabsContent>

        {/* 经费 Tab */}
        <TabsContent value="funds">
          <FundsTab showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} activeTab={activeTab} />
        </TabsContent>

        {/* 成果 Tab */}
        <TabsContent value="results">
          <ResultsTab showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} activeTab={activeTab} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

