import { ProjectProgressChart } from "./project-progress"
import { FundAllocationChart } from "./fund-allocation"
import { MilestoneCompletionChart } from "./milestone-completion"
import { TeamWorkloadChart } from "./team-workload"
import { RiskAssessmentChart } from "./risk-assessment"
import { QualityMetricsChart } from "./quality-metrics"

export interface ChartConfig {
  id: string
  title: string
  component: React.FC
}

export const allCharts: ChartConfig[] = [
  {
    id: "project-progress",
    title: "项目进度统计",
    component: ProjectProgressChart,
  },
  {
    id: "fund-allocation",
    title: "经费分配情况",
    component: FundAllocationChart,
  },
  {
    id: "milestone-completion",
    title: "里程碑完成率",
    component: MilestoneCompletionChart,
  },
  {
    id: "team-workload",
    title: "团队工作量",
    component: TeamWorkloadChart,
  },
  {
    id: "risk-assessment",
    title: "风险评估",
    component: RiskAssessmentChart,
  },
  {
    id: "quality-metrics",
    title: "质量指标",
    component: QualityMetricsChart,
  },
]

export const defaultChartIds = ["project-progress", "fund-allocation", "milestone-completion"] 