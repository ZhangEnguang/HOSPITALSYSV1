"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import {
  quickFilters,
  advancedFilters,
  sortOptions,
  tableColumns,
  cardFields,
  tableActions,
  cardActions,
  batchActions,
  statusColors,
} from "./config/project-config.tsx"
import { extendedProjectItems } from "./data/project-data"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const batchParam = searchParams.get("batch")

  // 状态管理
  const [projectItems, setProjectItems] = useState(extendedProjectItems)
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
        item.applicant.id.toString() !== filterValues.applicant
      ) {
        return false
      }

      if (filterValues.priority && filterValues.priority !== "all" && item.priority !== filterValues.priority) {
        return false
      }

      if (filterValues.category && filterValues.category !== "all" && item.category !== filterValues.category) {
        return false
      }

      if (filterValues.dateRange?.from && filterValues.dateRange?.to) {
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

      if (field === "priority") {
        const priorityOrder = { 高: 3, 中: 2, 低: 1 }
        return direction === "asc"
          ? priorityOrder[a.priority as keyof typeof priorityOrder] -
              priorityOrder[b.priority as keyof typeof priorityOrder]
          : priorityOrder[b.priority as keyof typeof priorityOrder] -
              priorityOrder[a.priority as keyof typeof priorityOrder]
      }

      return 0
    })

  // 分页数据
  const totalItems = filteredProjectItems.length
  const paginatedItems = filteredProjectItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchReview = () => {
    console.log("批量审核", selectedRows)
    setSelectedRows([])
  }

  const handleBatchApprove = () => {
    setProjectItems(
      projectItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "已提交"
          ? {
              ...item,
              status: "已通过",
              progress: 100,
              approvalDate: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchReject = () => {
    setProjectItems(
      projectItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "已提交"
          ? {
              ...item,
              status: "已拒绝",
              progress: 100,
              approvalDate: new Date().toISOString().split("T")[0],
              rejectionReason: "批量操作：不符合申报要求",
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
        return item && item.status === "已提交"
      }),
    },
    {
      ...batchActions[1],
      onClick: handleBatchApprove,
      disabled: !selectedRows.some((id) => {
        const item = projectItems.find((item) => item.id === id)
        return item && item.status === "已提交"
      }),
    },
    {
      ...batchActions[2],
      onClick: handleBatchReject,
      disabled: !selectedRows.some((id) => {
        const item = projectItems.find((item) => item.id === id)
        return item && item.status === "已提交"
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
        title="申报项目列表"
        data={paginatedItems}
        // 操作按钮配置
        onAddNew={() => console.log("新建申报项目")}
        addButtonLabel="新建申报项目"
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
        tableActions={tableActions}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        // 卡片视图配置
        cardFields={cardFields}
        cardActions={cardActions}
        titleField="name"
        descriptionField="description"
        statusField="status"
        statusVariants={statusColors}
        priorityField="priority"
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
        onItemClick={(item) => router.push(`/applications/projects/${item.id}`)}
        detailsUrlPrefix="/applications/projects"
      />
    </div>
  )
}

