"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

// 导入项目数据和配置
import { extendedReviewProjects as extendedReviewProjectItems } from "./data/review-project-data"
import { statusColors, typeColors, tableActions } from "./config/review-project-config"

// 定义快速筛选选项
const quickFilters = [
  {
    id: "status",
    label: "状态",
    value: "all",
    options: [
      { id: "pending", label: "待评审", value: "待评审" },
      { id: "reviewing", label: "评审中", value: "评审中" },
      { id: "reviewed", label: "已评审", value: "已评审" },
      { id: "approved", label: "已通过", value: "已通过" },
      { id: "rejected", label: "未通过", value: "未通过" },
    ],
  },
  {
    id: "type",
    label: "类型",
    value: "all",
    options: [
      { id: "national", label: "国家级", value: "国家级" },
      { id: "provincial", label: "省部级", value: "省部级" },
      { id: "municipal", label: "市厅级", value: "市厅级" },
      { id: "school", label: "校级", value: "校级" },
    ],
  },
]

// 定义高级筛选字段
const advancedFilters = [
  {
    id: "applicant",
    type: "select",
    label: "申报人",
    options: [
      { id: "1", label: "张三", value: "1", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "2", label: "李四", value: "2", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "3", label: "王五", value: "3", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "4", label: "赵六", value: "4", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "5", label: "孙七", value: "5", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: "dateRange",
    type: "date",
    label: "评审日期",
  },
  {
    id: "deadlineRange",
    type: "date",
    label: "截止日期",
  },
  {
    id: "category",
    type: "select",
    label: "项目类别",
    options: [
      { id: "science", label: "自然科学", value: "自然科学" },
      { id: "engineering", label: "工程技术", value: "工程技术" },
      { id: "medicine", label: "医药科学", value: "医药科学" },
      { id: "humanities", label: "人文社科", value: "人文社科" },
      { id: "education", label: "教育科学", value: "教育科学" },
      { id: "art", label: "艺术学", value: "艺术学" },
      { id: "economics", label: "经济学", value: "经济学" },
      { id: "environment", label: "环境科学", value: "环境科学" },
    ],
  },
  {
    id: "scoreRange",
    type: "number",
    label: "评审得分",
  },
  {
    id: "amountRange",
    type: "number",
    label: "申报金额(万元)",
  },
]

// 定义排序选项
const sortOptions = [
  { id: "name_asc", label: "名称 (A-Z)", field: "name", direction: "asc" },
  { id: "name_desc", label: "名称 (Z-A)", field: "name", direction: "desc" },
  { id: "date_desc", label: "评审日期（新-旧）", field: "date", direction: "desc" },
  { id: "date_asc", label: "评审日期（旧-新）", field: "date", direction: "asc" },
  { id: "deadline_asc", label: "截止日期（近-远）", field: "deadline", direction: "asc" },
  { id: "deadline_desc", label: "截止日期（远-近）", field: "deadline", direction: "desc" },
  { id: "amount_desc", label: "申报金额（高-低）", field: "amount", direction: "desc" },
  { id: "amount_asc", label: "申报金额（低-高）", field: "amount", direction: "asc" },
  { id: "score_desc", label: "评审得分（高-低）", field: "score", direction: "desc" },
  { id: "score_asc", label: "评审得分（低-高）", field: "score", direction: "asc" },
]

// 定义类型和状态颜色映射
const badgeVariants = {
  default: "default",
  secondary: "secondary",
  outline: "outline",
  destructive: "destructive",
} as const;

// 类型化的颜色映射
const typedStatusColors: Record<keyof typeof statusColors, keyof typeof badgeVariants> = {
  待评审: "secondary",
  评审中: "default", // 修改为支持的variant
  已评审: "default", // 修改为支持的variant
  已通过: "default", // 修改为支持的variant
  未通过: "destructive",
};

// 类型化的颜色映射
const typedTypeColors: Record<keyof typeof typeColors, keyof typeof badgeVariants> = {
  国家级: "default",
  省部级: "secondary",
  市厅级: "outline",
  校级: "default", // 修改为支持的variant
};

// 定义表格列
const tableColumns = [
  {
    id: "name",
    header: "项目名称",
    cell: (item: ReviewProjectItem) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground line-clamp-1">{item.description}</span>
      </div>
    ),
  },
  {
    id: "type",
    header: "项目类型",
    cell: (item: ReviewProjectItem) => <Badge variant={typedTypeColors[item.type]}>{item.type}</Badge>,
  },
  {
    id: "category",
    header: "项目类别",
    cell: (item: ReviewProjectItem) => <span>{item.category}</span>,
  },
  {
    id: "status",
    header: "评审状态",
    cell: (item: ReviewProjectItem) => <Badge variant={typedStatusColors[item.status]}>{item.status}</Badge>,
  },
  {
    id: "applicant",
    header: "申报人",
    cell: (item: ReviewProjectItem) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.applicant?.avatar || "/placeholder.svg?height=32&width=32"} />
          <AvatarFallback>{item.applicant?.name?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{item.applicant?.name || "未指定"}</span>
      </div>
    ),
  },
  {
    id: "amount",
    header: "申报金额(万元)",
    cell: (item: ReviewProjectItem) => (
      <span className="font-medium">{item.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</span>
    ),
  },
  {
    id: "score",
    header: "评审得分",
    cell: (item: ReviewProjectItem) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{item.score || "-"}</span>
        {item.score && (
          <Badge 
            variant={item.score >= 80 ? "default" : item.score >= 60 ? "secondary" : "destructive"} 
            className="ml-2"
          >
            {item.score >= 80 ? "优" : item.score >= 60 ? "良" : "差"}
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "progress",
    header: "评审进度",
    cell: (item) => {
      // 计算评审进度
      let progress = 0
      if (item.status === "待评审") progress = 0
      else if (item.status === "评审中") {
        if (item.reviewers) {
          const completedReviews = item.reviewers.filter((r) => r.currentScore !== null).length
          progress = Math.round((completedReviews / item.reviewers.length) * 100)
        } else {
          progress = 50
        }
      } else if (item.status === "已评审" || item.status === "已通过" || item.status === "未通过") progress = 100

      return (
        <div className="w-[160px] space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">进度</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 [&>div]:progress-gradient" />
        </div>
      )
    },
  },
  {
    id: "date",
    header: "评审日期",
    cell: (item) => (item.date ? format(new Date(item.date), "yyyy/MM/dd") : "-"),
  },
  {
    id: "deadline",
    header: "截止日期",
    cell: (item) => {
      const deadline = new Date(item.deadline)
      const now = new Date()
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      return (
        <div className="flex flex-col">
          <span>{format(deadline, "yyyy/MM/dd")}</span>
          {daysLeft > 0 ? (
            <span className={`text-xs ${daysLeft <= 7 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
              剩余 {daysLeft} 天
            </span>
          ) : null}
        </div>
      )
    },
  },
]

// 定义卡片字段
const cardFields = [
  {
    id: "applicant",
    label: "",
    value: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.applicant?.avatar || "/placeholder.svg?height=32&width=32"} />
          <AvatarFallback>{item.applicant?.name?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5 text-sm">
          <span className="font-medium">{item.applicant?.name || "未指定"}</span>
          <span className="text-muted-foreground text-xs">申报人</span>
        </div>
      </div>
    ),
  },
  {
    id: "amount",
    label: "申报金额",
    value: (item) => (
      <span className="font-medium">{item.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}万元</span>
    ),
  },
  {
    id: "score",
    label: "评审得分",
    value: (item) => (
      <div className="flex items-center gap-1">
        <span className="font-medium">{item.score || "-"}</span>
        {item.score && (
          <Badge variant={item.score >= 80 ? "success" : item.score >= 60 ? "warning" : "destructive"} className="ml-1">
            {item.score >= 80 ? "优" : item.score >= 60 ? "良" : "差"}
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "dates",
    label: "截止日期",
    value: (item) => {
      const deadline = new Date(item.deadline)
      const now = new Date()
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      return (
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">{format(deadline, "yyyy/MM/dd")}</span>
          {daysLeft > 0 ? (
            <span className={`text-xs ${daysLeft <= 7 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
              剩余 {daysLeft} 天
            </span>
          ) : null}
        </div>
      )
    },
  },
  {
    id: "category",
    label: "项目类别",
    value: (item) => <span className="text-muted-foreground text-xs">{item.category}</span>,
  },
  {
    id: "batchInfo",
    label: "批次信息",
    value: (item) => (
      <div className="flex flex-col">
        <span className="text-xs font-medium">{item.batchNumber}</span>
        <span className="text-muted-foreground text-xs">{item.batchName}</span>
      </div>
    ),
  },
]

// 定义项目项接口
interface ReviewProjectItem {
  id: string;
  name: string;
  description: string;
  category: string;
  type: keyof typeof typeColors;
  status: keyof typeof statusColors;
  date: string;
  deadline: string;
  amount: number;
  applicant?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
  score?: number;
  reviewers?: Array<{currentScore: number | null}>;
  batchNumber?: string;
  batchName?: string;
}

// 定义卡片操作
const cardActions = [
  {
    id: "view",
    label: "查看详情",
    icon: "Eye",
    onClick: (item: ReviewProjectItem) => router.push(`/applications/review-projects/${item.id}`),
  },
  {
    id: "review",
    label: "评审",
    icon: "ClipboardCheck",
    onClick: (item: ReviewProjectItem) => router.push(`/applications/review-projects/${item.id}`),
  },
  {
    id: "assign",
    label: "分派专家",
    icon: "Users",
    onClick: (item: ReviewProjectItem) => router.push(`/applications/assign-reviewers/${item.id}`),
  },
  {
    id: "download",
    label: "下载申报书",
    icon: "Download",
    onClick: (item: ReviewProjectItem) => console.log("下载申报书", item),
  },
  {
    id: "delete",
    label: "删除",
    icon: "Trash2",
    onClick: (item: ReviewProjectItem) => console.log("删除", item),
    variant: "destructive",
  },
]

// 定义批量操作
const batchActions = [
  {
    id: "batchReview",
    label: "批量评审",
    icon: "ClipboardCheck",
    onClick: () => console.log("批量评审"),
  },
  {
    id: "batchApprove",
    label: "批量通过",
    icon: "CheckCircle",
    onClick: () => console.log("批量通过"),
  },
  {
    id: "batchReject",
    label: "批量拒绝",
    icon: "XCircle",
    onClick: () => console.log("批量拒绝"),
    variant: "destructive",
  },
  {
    id: "batchDelete",
    label: "批量删除",
    icon: "Trash2",
    onClick: () => console.log("批量删除"),
    variant: "destructive",
  },
]

function ReviewProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const batchParam = searchParams.get("batch")

  // 状态管理
  const [projectItems, setProjectItems] = useState(extendedReviewProjectItems)
  const [filteredBatch, setFilteredBatch] = useState<string | null>(batchParam)
  const [batchName, setBatchName] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("deadline_asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    type: true,
    category: true,
    status: true,
    applicant: true,
    amount: true,
    score: true,
    progress: true,
    date: true,
    deadline: true,
  })

  // 初始化时根据批次参数过滤项目
  useEffect(() => {
    if (batchParam) {
      setFilteredBatch(batchParam)
      // 查找批次名称
      const batchProject = projectItems.find((item) => item.batchNumber === batchParam)
      if (batchProject) {
        setBatchName(batchProject.batchName)
      }
    }
  }, [batchParam, projectItems])

  // 过滤和排序数据
  const filteredProjectItems = projectItems
    .filter((item) => {
      // 批次过滤
      if (filteredBatch && item.batchNumber !== filteredBatch) {
        return false
      }

      // 搜索过滤
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // 快速筛选
      if (filterValues.status && filterValues.status !== "all" && item.status !== filterValues.status) {
        return false
      }

      if (filterValues.type && filterValues.type !== "all" && item.type !== filterValues.type) {
        return false
      }

      // 高级筛选
      if (
        filterValues.applicant &&
        filterValues.applicant !== "all" &&
        item.applicant?.id?.toString() !== filterValues.applicant
      ) {
        return false
      }

      if (filterValues.category && filterValues.category !== "all" && item.category !== filterValues.category) {
        return false
      }

      if (filterValues.dateRange?.from && filterValues.dateRange?.to && item.date) {
        const itemDate = new Date(item.date)
        const filterFrom = new Date(filterValues.dateRange.from)
        const filterTo = new Date(filterValues.dateRange.to)

        if (itemDate < filterFrom || itemDate > filterTo) {
          return false
        }
      }

      if (filterValues.deadlineRange?.from && filterValues.deadlineRange?.to) {
        const itemDeadline = new Date(item.deadline)
        const filterFrom = new Date(filterValues.deadlineRange.from)
        const filterTo = new Date(filterValues.deadlineRange.to)

        if (itemDeadline < filterFrom || itemDeadline > filterTo) {
          return false
        }
      }

      if (filterValues.scoreRange && filterValues.scoreRange > 0 && item.score) {
        if (item.score < filterValues.scoreRange) {
          return false
        }
      }

      if (filterValues.amountRange && filterValues.amountRange > 0) {
        if (item.amount < filterValues.amountRange) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // 排序逻辑
      const [field, direction] = sortOption.split("_")

      if (field === "name") {
        return direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }

      if (field === "date") {
        if (!a.date) return direction === "asc" ? 1 : -1
        if (!b.date) return direction === "asc" ? -1 : 1
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }

      if (field === "deadline") {
        const deadlineA = new Date(a.deadline).getTime()
        const deadlineB = new Date(b.deadline).getTime()
        return direction === "asc" ? deadlineA - deadlineB : deadlineB - deadlineA
      }

      if (field === "amount") {
        return direction === "asc" ? a.amount - b.amount : b.amount - a.amount
      }

      if (field === "score") {
        if (!a.score) return direction === "asc" ? 1 : -1
        if (!b.score) return direction === "asc" ? -1 : 1
        return direction === "asc" ? a.score - b.score : b.score - a.score
      }

      return 0
    })

  // 分页数据
  const totalItems = filteredProjectItems.length
  const paginatedItems = filteredProjectItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchReview = () => {
    console.log("批量评审", selectedRows)
    setSelectedRows([])
  }

  const handleBatchApprove = () => {
    setProjectItems(
      projectItems.map((item) =>
        selectedRows.includes(item.id) && (item.status === "已评审" || item.status === "评审中")
          ? {
              ...item,
              status: "已通过",
              date: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchReject = () => {
    setProjectItems(
      projectItems.map((item) =>
        selectedRows.includes(item.id) && (item.status === "已评审" || item.status === "评审中")
          ? {
              ...item,
              status: "未通过",
              date: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchDelete = () => {
    setProjectItems(projectItems.filter((item) => !selectedRows.includes(item.id)))
    setSelectedRows([])
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      ...batchActions[0],
      onClick: handleBatchReview,
      disabled: !selectedRows.some((id) => {
        const item = projectItems.find((item) => item.id === id)
        return item && (item.status === "待评审" || item.status === "评审中")
      }),
    },
    {
      ...batchActions[1],
      onClick: handleBatchApprove,
      disabled: !selectedRows.some((id) => {
        const item = projectItems.find((item) => item.id === id)
        return item && (item.status === "已评审" || item.status === "评审中")
      }),
    },
    {
      ...batchActions[2],
      onClick: handleBatchReject,
      disabled: !selectedRows.some((id) => {
        const item = projectItems.find((item) => item.id === id)
        return item && (item.status === "已评审" || item.status === "评审中")
      }),
    },
    {
      ...batchActions[3],
      onClick: handleBatchDelete,
    },
  ]

  return (
    <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
      <div
        className="absolute top-0 left-0 right-0 h-[300px] -z-10"
        style={{
          background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
        }}
      ></div>

      {filteredBatch && (
        <div className="flex items-center gap-2 px-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => router.push("/applications")}
          >
            <ArrowLeft className="h-4 w-4" />
            返回批次列表
          </Button>
          {batchName && (
            <div className="text-sm text-muted-foreground">
              当前批次: <span className="font-medium text-foreground">{batchName}</span>
            </div>
          )}
        </div>
      )}

      <DataList
        title="评审项目列表"
        data={paginatedItems}
        // 操作按钮配置
        onAddNew={() => console.log("新建评审项目")}
        addButtonLabel="新建评审项目"
        // 搜索和筛选配置
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={() => console.log("搜索", searchTerm)}
        quickFilters={quickFilters}
        advancedFilters={advancedFilters}
        filterValues={filterValues}
        onFilterChange={setFilterValues}
        // 排序配置
        sortOptions={sortOptions}
        activeSortOption={sortOption}
        onSortChange={setSortOption}
        // 视图模式配置
        defaultViewMode={viewMode}
        // 表格视图配置
        tableColumns={tableColumns}
        tableActions={[
          {
            id: "assign",
            label: "分派专家",
            icon: "Users",
            onClick: (item) => router.push(`/applications/assign-reviewers/${item.id}`),
          },
          {
            id: "review",
            label: "评审",
            icon: "ClipboardCheck",
            onClick: (item) => router.push(`/applications/review-projects/${item.id}`),
          },
          {
            id: "download",
            label: "下载申报书",
            icon: "Download",
            onClick: (item) => console.log("下载申报书", item),
          },
          {
            id: "delete",
            label: "删除",
            icon: "Trash2",
            onClick: (item) => console.log("删除", item),
            variant: "destructive",
          },
        ]}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        // 卡片视图配置
        cardFields={cardFields}
        cardActions={cardActions}
        titleField="name"
        descriptionField="description"
        statusField="status"
        statusVariants={statusColors}
        priorityField="type"
        progressField="progress"
        // 分页配置
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        // 选择和批量操作配置
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        batchActions={configuredBatchActions}
        // 行/卡片点击
        onItemClick={(item) => router.push(`/applications/review-projects/${item.id}`)}
        detailsUrlPrefix="/applications/review-projects"
      />
    </div>
  )
}

export default ReviewProjectsPage

