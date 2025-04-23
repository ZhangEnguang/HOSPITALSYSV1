import React, { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FolderKanban, ClipboardList, Wallet, Award } from 'lucide-react'
import { StatCard } from './stat-card'
import { ProjectProgressChart } from './charts/project-progress'
import { MilestoneCompletionChart } from './charts/milestone-completion'
import { TeamWorkloadChart } from './charts/team-workload'
import { RiskAssessmentChart } from './charts/risk-assessment'
import { QualityMetricsChart } from './charts/quality-metrics'
import { TaskCompletionChart } from './charts/task-completion'
import { TaskPriorityChart } from './charts/task-priority'
import { TaskTypeChart } from './charts/task-type'
import { ReportSubmissionChart } from './charts/report-submission'
import { ReportTypeChart } from './charts/report-type'
import { ReportQualityChart } from './charts/report-quality'
import { ChartDialog } from './chart-dialog'

// 导入仪表盘标签页组件
import OverviewTab from "@/components/dashboard/overview-tab"
import FundsTab from "@/components/dashboard/funds-tab"
import ResultsTab from "@/components/dashboard/results-tab"

const WorkbenchDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeChartIds, setActiveChartIds] = useState<string[]>([
    'project-progress',
    'milestone-completion',
    'team-workload',
    'task-completion',
    'report-submission',
    'quality-metrics'
  ])

  // 监听URL参数变化，设置默认选中的标签
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('overview');
    }
  }, []);

  // 监听添加图表按钮点击事件
  const handleAddChart = () => {
    setShowAddDialog(true)
  }

  const handleConfirmCharts = (chartIds: string[]) => {
    setActiveChartIds(chartIds)
  }

  const availableCharts = [
    { id: 'project-progress', title: '项目进度' },
    { id: 'milestone-completion', title: '里程碑完成情况' },
    { id: 'team-workload', title: '团队工作量' },
    { id: 'risk-assessment', title: '风险等级评估' },
    { id: 'quality-metrics', title: '质量指标' },
    { id: 'task-completion', title: '任务完成情况' },
    { id: 'task-priority', title: '任务优先级分布' },
    { id: 'task-type', title: '任务类型分布' },
    { id: 'report-submission', title: '报告提交情况' },
    { id: 'report-type', title: '报告类型分布' },
    { id: 'report-quality', title: '报告质量评估' }
  ]

  // 新增标签页处理
  const renderTabs = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} activeTab={activeTab} />;
      case 'projects':
        return renderProjectsTab();
      case 'tasks':
        return renderTasksTab();
      case 'reports':
        return renderReportsTab();
      case 'funds':
        return <FundsTab showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} activeTab={activeTab} />;
      case 'results':
        return <ResultsTab showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} activeTab={activeTab} />;
      default:
        return <OverviewTab showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} activeTab={activeTab} />;
    }
  };

  const renderChart = (chartId: string) => {
    switch (chartId) {
      case 'project-progress':
        return (
          <Card className="col-span-4 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">项目进度</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectProgressChart />
            </CardContent>
          </Card>
        )
      case 'milestone-completion':
        return (
          <Card className="col-span-3 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">里程碑完成情况</CardTitle>
            </CardHeader>
            <CardContent>
              <MilestoneCompletionChart />
            </CardContent>
          </Card>
        )
      case 'team-workload':
        return (
          <Card className="col-span-4 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">团队工作量</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamWorkloadChart />
            </CardContent>
          </Card>
        )
      case 'risk-assessment':
        return (
          <Card className="col-span-3 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">风险等级评估</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskAssessmentChart />
            </CardContent>
          </Card>
        )
      case 'quality-metrics':
        return (
          <Card className="col-span-7 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">质量指标</CardTitle>
            </CardHeader>
            <CardContent>
              <QualityMetricsChart />
            </CardContent>
          </Card>
        )
      case 'task-completion':
        return (
          <Card className="col-span-4 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">任务完成情况</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskCompletionChart />
            </CardContent>
          </Card>
        )
      case 'task-priority':
        return (
          <Card className="col-span-4 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">任务优先级分布</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskPriorityChart />
            </CardContent>
          </Card>
        )
      case 'task-type':
        return (
          <Card className="col-span-4 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">任务类型分布</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskTypeChart />
            </CardContent>
          </Card>
        )
      case 'report-submission':
        return (
          <Card className="col-span-4 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">报告提交情况</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportSubmissionChart />
            </CardContent>
          </Card>
        )
      case 'report-type':
        return (
          <Card className="col-span-4 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">报告类型分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTypeChart />
            </CardContent>
          </Card>
        )
      case 'report-quality':
        return (
          <Card className="col-span-4 shadow-none">
            <CardHeader>
              <CardTitle className="text-[18px] font-normal">报告质量评估</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportQualityChart />
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  // 仅在旧版模式下渲染
  const renderProjectsTab = () => {
    // 确保展示4个图表
    const projectCharts = [
      {
        id: 'project-type-distribution',
        title: '项目类型分布',
        component: <Card className="col-span-4 shadow-none">
          <CardHeader>
            <CardTitle className="text-[18px] font-normal">项目类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectProgressChart />
          </CardContent>
        </Card>
      },
      {
        id: 'project-approval-distribution',
        title: '立项阶段分布分析',
        component: <Card className="col-span-4 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[18px] font-normal">立项阶段分布分析</CardTitle>
              <Tabs defaultValue="discipline" className="w-auto">
                <TabsList className="h-8">
                  <TabsTrigger value="discipline" className="text-xs px-3 py-1">按学科</TabsTrigger>
                  <TabsTrigger value="department" className="text-xs px-3 py-1">按单位</TabsTrigger>
                  <TabsTrigger value="level" className="text-xs px-3 py-1">按级别</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TeamWorkloadChart />
          </CardContent>
        </Card>
      },
      {
        id: 'project-milestone-progress',
        title: '项目进度里程碑统计',
        component: <Card className="col-span-4 shadow-none">
          <CardHeader>
            <CardTitle className="text-[18px] font-normal">项目进度里程碑统计</CardTitle>
          </CardHeader>
          <CardContent>
            <MilestoneCompletionChart />
          </CardContent>
        </Card>
      },
      {
        id: 'project-acceptance-quality',
        title: '结题验收质量评估',
        component: <Card className="col-span-4 shadow-none">
          <CardHeader>
            <CardTitle className="text-[18px] font-normal">结题验收质量评估</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskAssessmentChart />
          </CardContent>
        </Card>
      }
    ];

    return (
      <div className="grid grid-cols-12 gap-6">
        {projectCharts.map(chart => (
          <div key={chart.id} className="col-span-6 lg:col-span-3">
            {chart.component}
          </div>
        ))}
      </div>
    )
  }

  const renderTasksTab = () => {
    return (
      <div className="grid grid-cols-12 gap-6">
        {activeChartIds
          .filter(id => ['task-completion', 'task-priority', 'task-type'].includes(id))
          .map(chartId => renderChart(chartId))}
      </div>
    )
  }

  const renderReportsTab = () => {
    return (
      <div className="grid grid-cols-12 gap-6">
        {activeChartIds
          .filter(id => ['report-submission', 'report-type', 'report-quality'].includes(id))
          .map(chartId => renderChart(chartId))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="projects">项目</TabsTrigger>
            <TabsTrigger value="tasks">任务</TabsTrigger>
            <TabsTrigger value="reports">报告</TabsTrigger>
            <TabsTrigger value="funds">经费</TabsTrigger>
            <TabsTrigger value="results">成果</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleAddChart} className="ml-4">
          <Plus className="mr-2 h-4 w-4" />
          添加图表
        </Button>
      </div>

      {renderTabs()}

      <ChartDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        charts={availableCharts}
        activeChartIds={activeChartIds}
        onConfirm={handleConfirmCharts}
      />
    </div>
  )
}

export default WorkbenchDashboard 