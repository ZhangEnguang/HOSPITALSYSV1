"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Users,
  ChevronRight,
  PlusCircle,
  FileText,
  BookOpen,
  Award,
  Edit2,
} from "lucide-react"

// 高校科研项目阶段数据
const projectPhases = [
  {
    id: 1,
    name: "项目立项",
    status: "已完成",
    startDate: "2023-01-01",
    endDate: "2023-02-15",
    progress: 100,
    description: "项目申请与立项阶段，包括申请书撰写、专家评审和立项批复。",
    milestones: [
      { id: 1, name: "项目申请书提交", date: "2023-01-10", status: "已完成" },
      { id: 2, name: "专家评审会议", date: "2023-01-25", status: "已完成" },
      { id: 3, name: "立项批复", date: "2023-02-15", status: "已完成" },
    ],
    tasks: [
      { id: 1, name: "项目申请书撰写", assignee: "张教授", status: "已完成", dueDate: "2023-01-05" },
      { id: 2, name: "预算编制", assignee: "李研究员", status: "已完成", dueDate: "2023-01-08" },
      { id: 3, name: "评审答辩准备", assignee: "王博士", status: "已完成", dueDate: "2023-01-20" },
      { id: 4, name: "立项材料准备", assignee: "赵助研", status: "已完成", dueDate: "2023-02-10" },
    ],
  },
  {
    id: 2,
    name: "研究准备",
    status: "已完成",
    startDate: "2023-02-16",
    endDate: "2023-04-15",
    progress: 100,
    description: "研究准备阶段，包括文献调研、实验方案设计和研究团队组建。",
    milestones: [
      { id: 4, name: "文献综述完成", date: "2023-03-10", status: "已完成" },
      { id: 5, name: "实验方案确定", date: "2023-03-25", status: "已完成" },
      { id: 6, name: "研究团队组建", date: "2023-04-15", status: "已完成" },
    ],
    tasks: [
      { id: 5, name: "文献检索与分析", assignee: "王博士", status: "已完成", dueDate: "2023-03-05" },
      { id: 6, name: "实验方案设计", assignee: "张教授", status: "已完成", dueDate: "2023-03-20" },
      { id: 7, name: "实验设备采购", assignee: "李研究员", status: "已完成", dueDate: "2023-04-10" },
      { id: 8, name: "研究生招募", assignee: "张教授", status: "已完成", dueDate: "2023-04-15" },
    ],
  },
  {
    id: 3,
    name: "研究实施",
    status: "已完成",
    startDate: "2023-04-16",
    endDate: "2023-10-15",
    progress: 100,
    description: "研究实施阶段，包括实验开展、数据收集和初步分析。",
    milestones: [
      { id: 7, name: "实验平台搭建", date: "2023-05-20", status: "已完成" },
      { id: 8, name: "初步数据收集", date: "2023-07-30", status: "已完成" },
      { id: 9, name: "阶段性实验报告", date: "2023-10-15", status: "已完成" },
    ],
    tasks: [
      { id: 9, name: "实验设备调试", assignee: "赵助研", status: "已完成", dueDate: "2023-05-15" },
      { id: 10, name: "实验样本制备", assignee: "刘研究生", status: "已完成", dueDate: "2023-06-10" },
      { id: 11, name: "实验数据收集", assignee: "陈研究生", status: "已完成", dueDate: "2023-08-20" },
      { id: 12, name: "数据初步分析", assignee: "王博士", status: "已完成", dueDate: "2023-10-10" },
    ],
  },
  {
    id: 4,
    name: "中期检查",
    status: "进行中",
    startDate: "2023-10-16",
    endDate: "2024-01-15",
    progress: 75,
    description: "项目中期检查阶段，包括中期报告撰写、成果整理和专家评审。",
    milestones: [
      { id: 10, name: "中期报告提交", date: "2023-11-30", status: "已完成" },
      { id: 11, name: "中期成果整理", date: "2023-12-20", status: "已完成" },
      { id: 12, name: "中期专家评审", date: "2024-01-10", status: "进行中" },
    ],
    tasks: [
      { id: 13, name: "中期报告撰写", assignee: "张教授", status: "已完成", dueDate: "2023-11-25" },
      { id: 14, name: "研究成果整理", assignee: "王博士", status: "已完成", dueDate: "2023-12-15" },
      { id: 15, name: "经费使用报告", assignee: "李研究员", status: "进行中", dueDate: "2024-01-05" },
      { id: 16, name: "评审答辩准备", assignee: "张教授", status: "进行中", dueDate: "2024-01-08" },
    ],
  },
  {
    id: 5,
    name: "成果产出",
    status: "未开始",
    startDate: "2024-01-16",
    endDate: "2024-07-15",
    progress: 0,
    description: "研究成果产出阶段，包括论文撰写、专利申请和成果转化。",
    milestones: [
      { id: 13, name: "SCI论文发表", date: "2024-03-30", status: "未开始" },
      { id: 14, name: "专利申请", date: "2024-05-15", status: "未开始" },
      { id: 15, name: "成果转化洽谈", date: "2024-07-10", status: "未开始" },
    ],
    tasks: [
      { id: 17, name: "论文撰写", assignee: "张教授", status: "未开始", dueDate: "2024-02-28" },
      { id: 18, name: "专利材料准备", assignee: "王博士", status: "未开始", dueDate: "2024-04-20" },
      { id: 19, name: "学术会议交流", assignee: "李研究员", status: "未开始", dueDate: "2024-06-10" },
      { id: 20, name: "企业合作洽谈", assignee: "张教授", status: "未开始", dueDate: "2024-07-05" },
    ],
  },
  {
    id: 6,
    name: "项目结题",
    status: "未开始",
    startDate: "2024-07-16",
    endDate: "2024-09-30",
    progress: 0,
    description: "项目结题阶段，包括结题报告撰写、成果验收和资料归档。",
    milestones: [
      { id: 16, name: "结题报告提交", date: "2024-08-15", status: "未开始" },
      { id: 17, name: "成果验收会议", date: "2024-09-10", status: "未开始" },
      { id: 18, name: "项目正式结题", date: "2024-09-30", status: "未开始" },
    ],
    tasks: [
      { id: 21, name: "结题报告撰写", assignee: "张教授", status: "未开始", dueDate: "2024-08-10" },
      { id: 22, name: "经费决算报告", assignee: "李研究员", status: "未开始", dueDate: "2024-08-20" },
      { id: 23, name: "验收材料准备", assignee: "王博士", status: "未开始", dueDate: "2024-09-05" },
      { id: 24, name: "资料归档整理", assignee: "赵助研", status: "未开始", dueDate: "2024-09-25" },
    ],
  },
]

// 获取状态对应的颜色和图标
const getStatusInfo = (status: string) => {
  switch (status) {
    case "已完成":
      return {
        color: "bg-white text-green-700 border-green-200",
        textColor: "text-green-600",
        borderColor: "border-green-200",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      }
    case "进行中":
      return {
        color: "bg-white text-blue-700 border-blue-200",
        textColor: "text-blue-600",
        borderColor: "border-blue-200",
        icon: <Clock className="h-4 w-4 text-blue-500" />,
      }
    case "未开始":
      return {
        color: "bg-white text-slate-600 border-slate-200",
        textColor: "text-slate-600",
        borderColor: "border-slate-200",
        icon: <Clock className="h-4 w-4 text-slate-500" />,
      }
    case "已延期":
      return {
        color: "bg-white text-red-700 border-red-200",
        textColor: "text-red-600",
        borderColor: "border-red-200",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      }
    default:
      return {
        color: "bg-white text-slate-600 border-slate-200",
        textColor: "text-slate-600",
        borderColor: "border-slate-200",
        icon: <Clock className="h-4 w-4 text-slate-500" />,
      }
  }
}

// 计算总体进度
const calculateOverallProgress = () => {
  const totalPhases = projectPhases.length
  const completedPhases = projectPhases.filter((phase) => phase.status === "已完成").length
  const inProgressPhase = projectPhases.find((phase) => phase.status === "进行中")

  if (!inProgressPhase) {
    return (completedPhases / totalPhases) * 100
  }

  const progressContribution = inProgressPhase.progress / totalPhases
  return (completedPhases / totalPhases) * 100 + progressContribution
}

export default function ProcessTab() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(4) // 默认展开当前进行中的阶段

  const togglePhase = (phaseId: number) => {
    if (expandedPhase === phaseId) {
      setExpandedPhase(null)
    } else {
      setExpandedPhase(phaseId)
    }
  }

  const overallProgress = calculateOverallProgress()
  const activePhase = projectPhases.find((p) => p.status === "进行中") || projectPhases[0]

  // 获取近期任务
  const upcomingTasks = projectPhases
    .flatMap((phase) =>
      phase.tasks
        .filter((task) => task.status === "进行中" || task.status === "未开始")
        .map((task) => ({
          ...task,
          phase: phase.name,
        })),
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  // 科研成果统计
  const researchOutputs = {
    papers: 3,
    patents: 1,
    conferences: 2,
    awards: 0,
  }

  return (
    <div className="space-y-6">
      {/* 项目进度概览 */}
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">科研项目执行进度</CardTitle>
          <CardDescription>项目周期：2023-01-01 至 2024-09-30 | 国家自然科学基金面上项目</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">总体进度</span>
              <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-green-100 bg-white">
              <div className="p-2 rounded-full bg-white border border-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">已完成阶段</div>
                <div className="text-xl font-semibold text-green-600">
                  {projectPhases.filter((phase) => phase.status === "已完成").length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border border-blue-100 bg-white">
              <div className="p-2 rounded-full bg-white border border-blue-100">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">进行中阶段</div>
                <div className="text-xl font-semibold text-blue-600">
                  {projectPhases.filter((phase) => phase.status === "进行中").length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white">
              <div className="p-2 rounded-full bg-white border border-slate-100">
                <FileText className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">研究成果</div>
                <div className="text-xl font-semibold text-slate-600">
                  {researchOutputs.papers + researchOutputs.patents}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-100 bg-white">
              <div className="p-2 rounded-full bg-white border border-amber-100">
                <Award className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">经费执行率</div>
                <div className="text-xl font-semibold text-amber-600">48%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 当前阶段 */}
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-medium">当前研究阶段</CardTitle>
              <CardDescription>
                {activePhase.name} ({activePhase.startDate} 至 {activePhase.endDate})
              </CardDescription>
            </div>
            <Badge className={getStatusInfo(activePhase.status).color}>{activePhase.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">进度</span>
              <span className="text-sm font-medium">{activePhase.progress}%</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{activePhase.description}</p>

          <div className="space-y-4">
            {/* 即将到来的里程碑 */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Award className="h-4 w-4 mr-1.5" />
                近期里程碑
              </h4>
              <div className="pl-6 space-y-2">
                {activePhase.milestones
                  .filter((m) => m.status !== "已完成")
                  .slice(0, 2)
                  .map((milestone) => {
                    const { icon } = getStatusInfo(milestone.status)
                    return (
                      <div
                        key={milestone.id}
                        className="flex items-center justify-between p-2 rounded-md border bg-white"
                      >
                        <div className="flex items-center gap-2">
                          {icon}
                          <span className="text-sm">{milestone.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{milestone.date}</div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* 当前任务 */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1.5" />
                进行中任务
              </h4>
              <div className="pl-6 space-y-2">
                {activePhase.tasks
                  .filter((t) => t.status === "进行中")
                  .slice(0, 2)
                  .map((task) => {
                    return (
                      <div key={task.id} className="flex items-center justify-between p-2 rounded-md border bg-white">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{task.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                          <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目时间线 */}
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-medium">科研项目执行时间线</CardTitle>
              <CardDescription>项目各阶段及其进度</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Edit2 className="h-3.5 w-3.5" />
              <span className="text-xs">编辑</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectPhases.map((phase, index) => {
              const { icon, textColor, borderColor } = getStatusInfo(phase.status)
              const isExpanded = expandedPhase === phase.id
              const isActive = phase.status === "进行中"

              return (
                <div
                  key={phase.id}
                  className={`border rounded-lg ${isActive ? "border-blue-200" : "border-slate-200"} bg-white`}
                >
                  {/* 阶段头部 */}
                  <div
                    className={`flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 ${isActive ? "bg-white" : ""}`}
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full border ${isActive ? "border-blue-200" : "border-slate-200"}`}>
                        {icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{phase.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {phase.startDate} - {phase.endDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusInfo(phase.status).color}>{phase.status}</Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium">{phase.progress}%</span>
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* 展开的内容 */}
                  {isExpanded && (
                    <div className="p-3 pt-0 border-t border-slate-100">
                      <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>

                      {/* 里程碑和任务 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 里程碑 */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">研究里程碑</h4>
                          <div className="space-y-2">
                            {phase.milestones.map((milestone) => {
                              const { icon } = getStatusInfo(milestone.status)
                              return (
                                <div
                                  key={milestone.id}
                                  className="flex items-center justify-between p-2 rounded-md border bg-white"
                                >
                                  <div className="flex items-center gap-2">
                                    {icon}
                                    <span className="text-sm">{milestone.name}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">{milestone.date}</div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* 任务 */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">研究任务</h4>
                          <div className="space-y-2">
                            {phase.tasks.map((task) => {
                              const { icon } = getStatusInfo(task.status)
                              return (
                                <div
                                  key={task.id}
                                  className="flex items-center justify-between p-2 rounded-md border bg-white"
                                >
                                  <div className="flex items-center gap-2">
                                    {icon}
                                    <span className="text-sm">{task.name}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">{task.assignee}</span>
                                    <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 研究成果 */}
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">研究成果</CardTitle>
          <CardDescription>已产出的科研成果</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-md border bg-white">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm">基于深度学习的复杂场景目标检测算法研究</span>
                <Badge variant="outline" className="text-xs">
                  SCI论文
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">影响因子: 4.2</span>
                <span className="text-xs text-muted-foreground">2023-09-15</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md border bg-white">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm">多模态数据融合方法在目标识别中的应用</span>
                <Badge variant="outline" className="text-xs">
                  EI论文
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">会议: ICML</span>
                <span className="text-xs text-muted-foreground">2023-11-20</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md border bg-white">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-500" />
                <span className="text-sm">一种基于深度学习的目标检测与跟踪方法</span>
                <Badge variant="outline" className="text-xs">
                  发明专利
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">申请号: CN202310123456.X</span>
                <span className="text-xs text-muted-foreground">2023-12-05</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md border bg-white">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm">轻量级神经网络在边缘设备上的优化研究</span>
                <Badge variant="outline" className="text-xs">
                  核心期刊
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">期刊: 计算机学报</span>
                <span className="text-xs text-muted-foreground">2024-01-10</span>
              </div>
            </div>

            <Button variant="outline" className="mt-2 w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              添加研究成果
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 近期任务 */}
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">近期任务</CardTitle>
          <CardDescription>按日期排序的近期研究任务</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => {
                const { icon } = getStatusInfo(task.status)
                return (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-md border bg-white">
                    <div className="flex items-center gap-2">
                      {icon}
                      <span className="text-sm">{task.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {task.phase}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {task.assignee}
                      </div>
                      <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-4 text-muted-foreground">没有近期任务</div>
            )}

            <Button variant="outline" className="mt-2 w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              添加新任务
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

