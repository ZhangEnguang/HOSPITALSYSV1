"use client"
import {
  Calendar,
  User,
  Trash2,
  PenSquare,
  FileIcon,
  GitBranch,
  DollarSign,
  AlertTriangle,
  ClipboardList,
  AlertCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@/components/data-list/data-list"
import DataListWithDetail from "@/components/data-list/data-list-with-detail"
import type { TabConfig, ActionButton, InfoField } from "@/components/detail-page/detail-page-layout"
import { getStatusColor, getPriorityColor } from "@/components/detail-page/status-badge-utils"
import { FieldType } from "@/components/data-list/types"

// 示例项目数据
const projectsData = [
  {
    id: 1,
    title: "智慧城市数据平台建设",
    status: "进行中",
    priority: "高",
    applicant: "张三",
    department: "信息技术部",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    budget: 1500000,
    progress: 45,
    description: "建设城市级数据共享平台，实现跨部门数据整合与分析，为智慧城市建设提供数据支撑。",
    objectives: [
      "建立统一的数据标准和规范",
      "实现跨部门数据共享与交换",
      "提供数据分析和可视化能力",
      "支持智慧应用快速开发",
    ],
    risks: [
      { id: 1, title: "数据安全风险", level: "高", status: "已解决" },
      { id: 2, title: "系统集成复杂度", level: "中", status: "监控中" },
      { id: 3, title: "部门协作障碍", level: "中", status: "待解决" },
    ],
  },
  {
    id: 2,
    title: "企业财务管理系统升级",
    status: "已完成",
    priority: "中",
    applicant: "李四",
    department: "财务部",
    startDate: "2023-09-01",
    endDate: "2024-03-31",
    budget: 800000,
    progress: 100,
    description: "对现有财务系统进行全面升级，提升财务数据处理效率，增强报表分析能力，支持多维度财务决策。",
    objectives: ["优化财务流程和审批链条", "提升财务数据处理效率", "增强财务报表分析能力", "支持多维度财务决策"],
    risks: [
      { id: 1, title: "数据迁移风险", level: "高", status: "已解决" },
      { id: 2, title: "用户适应性问题", level: "低", status: "已解决" },
    ],
  },
  {
    id: 3,
    title: "新一代人工智能研发平台",
    status: "待审批",
    priority: "高",
    applicant: "王五",
    department: "研发中心",
    startDate: "2024-04-01",
    endDate: "2025-03-31",
    budget: 3000000,
    progress: 0,
    description: "构建企业级人工智能研发平台，整合算法、数据和算力资源，支持AI模型快速训练和部署。",
    objectives: [
      "构建企业级AI研发环境",
      "整合算法、数据和算力资源",
      "支持AI模型快速训练和部署",
      "建立AI模型评估和监控体系",
    ],
    risks: [
      { id: 1, title: "技术路线选择风险", level: "高", status: "评估中" },
      { id: 2, title: "人才储备不足", level: "中", status: "待解决" },
      { id: 3, title: "算力资源不足", level: "中", status: "待解决" },
    ],
  },
  {
    id: 4,
    title: "客户关系管理系统实施",
    status: "进行中",
    priority: "中",
    applicant: "赵六",
    department: "市场部",
    startDate: "2024-02-15",
    endDate: "2024-08-15",
    budget: 1200000,
    progress: 60,
    description: "实施企业级CRM系统，整合销售、市场和客户服务流程，提升���户满意度和销售转化率。",
    objectives: ["整合销售、市场和客户服务流程", "建立360度客户视图", "提升客户满意度和销售转化率", "支持精准营销决策"],
    risks: [
      { id: 1, title: "用户接受度低", level: "中", status: "监控中" },
      { id: 2, title: "数据质量问题", level: "高", status: "处理中" },
    ],
  },
  {
    id: 5,
    title: "供应链优化项目",
    status: "已暂停",
    priority: "低",
    applicant: "孙七",
    department: "供应链管理部",
    startDate: "2023-11-01",
    endDate: "2024-05-31",
    budget: 900000,
    progress: 30,
    description: "优化企业供应链管理流程，提升供应链可视性和响应速度，降低库存成本，提高客户满意度。",
    objectives: ["优化供应链管理流程", "提升供应链可视性和响应速度", "降低库存成本", "提高客户满意度"],
    risks: [
      { id: 1, title: "供应商协作障碍", level: "中", status: "待解决" },
      { id: 2, title: "系统集成复杂", level: "中", status: "暂停处理" },
    ],
  },
]

// 处理项目点击
const handleItemClick = (item: any) => {
  console.log("Item clicked:", item.title)
  // 设置选中项目并显示详情页
  const detailProps = getDetailProps(item)
  console.log("Detail props:", detailProps)

  // 强制重新渲染
  const element = document.querySelector(".container")
  if (element) {
    element.classList.add("processing-click")
    setTimeout(() => {
      element.classList.remove("processing-click")
    }, 100)
  }
}

// 获取详情页配置
const getDetailProps = (project: any) => {
  // 定义标签页配置
  const tabConfigs: TabConfig[] = [
    {
      id: "overview",
      label: "项目概览",
      icon: <FileIcon className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">项目描述</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">项目目标</h3>
            <ul className="list-disc pl-5 space-y-1">
              {project.objectives.map((objective: string, index: number) => (
                <li key={index} className="text-muted-foreground">
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">项目进度</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-4 rounded-full text-xs text-white flex items-center justify-center"
                style={{ width: `${project.progress}%` }}
              >
                {project.progress}%
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              项目周期: {project.startDate} 至 {project.endDate}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "process",
      label: "执行过程",
      icon: <GitBranch className="h-4 w-4 mr-2" />,
      content: <div className="text-center py-12 text-muted-foreground">执行过程内容将在此显示</div>,
    },
    {
      id: "funds",
      label: "经费管理",
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-2">预算概览</h3>
            <div className="text-3xl font-bold text-primary">¥ {project.budget.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">项目总预算</p>
          </div>

          <div className="text-center py-8 text-muted-foreground">详细经费使用情况将在此显示</div>
        </div>
      ),
    },
    {
      id: "risks",
      label: "风险与问题",
      icon: <AlertTriangle className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">风险列表</h3>

          {project.risks.map((risk: any) => (
            <div key={risk.id} className="p-4 border rounded-md flex items-start gap-4">
              <div
                className={`mt-1 ${
                  risk.level === "高" ? "text-red-500" : risk.level === "中" ? "text-amber-500" : "text-blue-500"
                }`}
              >
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{risk.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-sm">
                  <Badge variant="outline">风险等级: {risk.level}</Badge>
                  <Badge
                    className={
                      risk.status === "已解决"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : risk.status === "监控中"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : risk.status === "评估中"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : risk.status === "处理中"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : risk.status === "暂停处理"
                                ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {risk.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {project.risks.length === 0 && <div className="text-center py-8 text-muted-foreground">暂无风险记录</div>}
        </div>
      ),
    },
    {
      id: "reports",
      label: "项目报告",
      icon: <ClipboardList className="h-4 w-4 mr-2" />,
      content: <div className="text-center py-12 text-muted-foreground">项目报告内容将在此显示</div>,
    },
  ]

  // 定义操作按钮配置
  const actionButtons: ActionButton[] = [
    {
      id: "edit",
      label: "编辑",
      icon: <PenSquare className="h-4 w-4" />,
      variant: "outline",
      onClick: () => {
        toast({
          title: "编辑",
          description: "编辑功能正在开发中...",
          duration: 3000,
        })
      },
    },
    {
      id: "delete",
      label: "删除",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      onClick: () => {
        toast({
          title: "删除",
          description: "删除功能正在开发中...",
          duration: 3000,
        })
      },
    },
  ]

  // 定义信息字段配置
  const infoFields: InfoField[] = [
    {
      id: "applicant",
      label: "负责人",
      value: project.applicant,
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "department",
      label: "所属部门",
      value: project.department,
    },
    {
      id: "period",
      label: "项目周期",
      value: `${project.startDate} 至 ${project.endDate}`,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "budget",
      label: "预算",
      value: `¥ ${project.budget.toLocaleString()}`,
      icon: <DollarSign className="h-4 w-4" />,
    },
  ]

  // 返回详情页配置
  return {
    id: project.id,
    title: project.title,
    tabs: tabConfigs,
    defaultActiveTab: "overview",
    infoFields: infoFields,
    actionButtons: actionButtons,
    status: {
      value: project.status,
      color: getStatusColor(project.status),
    },
    onTitleChange: (newTitle: string) => {
      toast({
        title: "标题已更新",
        description: "项目标题已成功更新为: " + newTitle,
        duration: 3000,
      })
    },
  }
}

// 示例页面：使用DataListWithDetail组件
export default function ProjectsWithDetailPage() {
  // 定义列配置
  const columns: ColumnDef[] = [
    {
      id: "title",
      header: "项目名称",
      accessorKey: "title",
      type: FieldType.TEXT,
      enableSorting: true,
      enableFiltering: true,
    },
    {
      id: "status",
      header: "状态",
      accessorKey: "status",
      type: FieldType.SELECT,
      enableSorting: true,
      enableFiltering: true,
      cell: (row) => <Badge className={getStatusColor(row.status)}>{row.status}</Badge>,
      options: [
        { label: "进行中", value: "进行中" },
        { label: "已完成", value: "已完成" },
        { label: "待审批", value: "待审批" },
        { label: "已暂停", value: "已暂停" },
      ],
    },
    {
      id: "priority",
      header: "优先级",
      accessorKey: "priority",
      type: FieldType.SELECT,
      enableSorting: true,
      enableFiltering: true,
      cell: (row) => <Badge className={getPriorityColor(row.priority)}>{row.priority}</Badge>,
      options: [
        { label: "高", value: "高" },
        { label: "中", value: "中" },
        { label: "低", value: "低" },
      ],
    },
    {
      id: "applicant",
      header: "负责人",
      accessorKey: "applicant",
      type: FieldType.TEXT,
      enableSorting: true,
      enableFiltering: true,
    },
    {
      id: "department",
      header: "部门",
      accessorKey: "department",
      type: FieldType.TEXT,
      enableSorting: true,
      enableFiltering: true,
    },
    {
      id: "progress",
      header: "进度",
      accessorKey: "progress",
      type: FieldType.NUMBER,
      enableSorting: true,
      cell: (row) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${row.progress}%` }}></div>
        </div>
      ),
    },
  ]

  // 处理添加项目
  const handleAddProject = () => {
    toast({
      title: "添加项目",
      description: "添加项目功能正在开发中...",
      duration: 3000,
    })
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">项目管理</h1>

      <DataListWithDetail
        data={projectsData}
        columns={columns}
        title="项目列表"
        onAdd={handleAddProject}
        searchable={true}
        selectable={true}
        defaultViewMode="card"
        detailConfig={{
          getDetailProps: getDetailProps,
        }}
        // 添加调试信息，确保点击事件被触发
        cardRender={(item, actions, selected, toggleSelect) => (
          <div
            className="h-[220px] border rounded-lg p-5 hover:border-primary hover:shadow-md transition-all duration-300 flex flex-col"
            onClick={(e) => {
              e.stopPropagation()
              console.log("Card clicked:", item.title)
              // 直接调用 handleItemClick 函数
              handleItemClick(item)
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg truncate">{item.title}</h3>
              <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
            </div>

            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <User className="h-3.5 w-3.5" />
              <span>{item.applicant}</span>
              <span className="text-gray-300">|</span>
              <span>{item.department}</span>
            </div>

            <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {item.startDate} 至 {item.endDate}
              </span>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>进度</span>
                <span>{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
              </div>
            </div>

            <div className="mt-auto pt-3 flex justify-between items-center">
              <Badge variant="outline" className="font-normal">
                预算: ¥{item.budget.toLocaleString()}
              </Badge>

              <Badge variant="outline" className={`font-normal ${getPriorityColor(item.priority)}`}>
                {item.priority}优先级
              </Badge>
            </div>
          </div>
        )}
      />
    </div>
  )
}

