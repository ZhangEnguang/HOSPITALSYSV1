"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DataList, { type ColumnDef, type Action, type BatchAction } from "@/components/data-list/data-list"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Edit,
  Eye,
  Trash2,
  FileCheck,
  DownloadCloud,
  Plus,
  Upload,
  LayoutGrid,
  List,
  Search,
} from "lucide-react"
import { FieldType } from "@/components/data-list/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProjectCard from "./components/project-card"
import { mockData, filterFields } from "./data/project-data"

// 内容展示
export default function ProjectExampleList() {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [totalCount, setTotalCount] = useState(mockData.length)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>({})
  const [sortState, setSortState] = useState<{ columnId: string; direction: "asc" | "desc" | null }>({
    columnId: "",
    direction: null,
  })
  const [projectType, setProjectType] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "card">("card")
  const [showFilterPanel, setShowFilterPanel] = useState(false)

  // 加载数据
  useEffect(() => {
    setLoading(true)
    // 模拟异步请求
    setTimeout(() => {
      let filteredData = [...mockData]

      // 按项目类型筛选
      if (projectType !== "all") {
        filteredData = filteredData.filter((item) => {
          if (projectType === "vertical") return item.source === "国家自然科学基金" || item.source === "省部级项目"
          if (projectType === "horizontal") return item.source === "横向项目"
          if (projectType === "school") return item.source === "校级项目"
          return true
        })
      }

      // 模拟搜索
      if (searchQuery) {
        filteredData = filteredData.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // 模拟筛选
      if (Object.keys(activeFilters).length > 0) {
        filteredData = filteredData.filter((item) => {
          return Object.entries(activeFilters).every(([key, value]) => {
            if (!value) return true

            if (key === "startDate" && value instanceof Date) {
              const itemDate = new Date(item[key])
              return itemDate.toDateString() === value.toDateString()
            }

            return item[key] == value // 使用==而不是===以处理数字和字符串的比较
          })
        })
      }

      // 模拟排序
      if (sortState.columnId && sortState.direction) {
        filteredData.sort((a, b) => {
          const aValue = a[sortState.columnId]
          const bValue = b[sortState.columnId]

          if (aValue < bValue) return sortState.direction === "asc" ? -1 : 1
          if (aValue > bValue) return sortState.direction === "asc" ? 1 : -1
          return 0
        })
      }

      const paginatedData = filteredData.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)

      setData(paginatedData)
      setTotalCount(filteredData.length)
      setLoading(false)
    }, 500)
  }, [pageIndex, pageSize, searchQuery, activeFilters, sortState, projectType])

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setPageIndex(page)
  }

  // 处理每页显示数量变化
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPageIndex(1) // 重置到第一页
  }

  // 处理搜索
  const handleSearch = () => {
    setPageIndex(1) // 重置到第一页
  }

  // 处理筛选
  const handleFilter = (filters: { [key: string]: any }) => {
    setActiveFilters(filters)
    setPageIndex(1) // 重置到第一页
  }

  // 处理排序
  const handleSort = (columnId: string, direction: "asc" | "desc" | null) => {
    setSortState({ columnId, direction })
  }

  // 处理新增项目
  const handleAddProject = () => {
    console.log("添加新项目")
    // router.push("/projects/new")
  }

  // 处理导入
  const handleImport = () => {
    console.log("导入项目")
  }

  // 处理导出
  const handleExport = () => {
    console.log("导出项目")
  }

  // 定义操作
  const actions: Action[] = [
    {
      id: "view",
      label: "查看",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => console.log("查看", row),
    },
    {
      id: "edit",
      label: "编辑",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => console.log("编辑", row),
      disabled: (row) => row.status === "completed" || row.status === "rejected",
    },
    {
      id: "documents",
      label: "文档",
      icon: <FileCheck className="h-4 w-4" />,
      onClick: (row) => console.log("查看文档", row),
    },
    {
      id: "approve",
      label: "审批",
      icon: <Check className="h-4 w-4" />,
      onClick: (row) => console.log("审批", row),
      hidden: (row) => row.status !== "pending",
    },
    {
      id: "delete",
      label: "删除",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => console.log("删除", row),
      type: "destructive",
    },
  ]

  // 定义批量操作
  const batchActions: BatchAction[] = [
    {
      id: "batchApprove",
      label: "批量审批",
      icon: <Check className="h-4 w-4 mr-1" />,
      onClick: (rows) => console.log("批量审批", rows),
      disabled: (rows) => !rows.some((row) => row.status === "pending"),
    },
    {
      id: "batchExport",
      label: "批量导出",
      icon: <DownloadCloud className="h-4 w-4 mr-1" />,
      onClick: (rows) => console.log("批量导出", rows),
    },
    {
      id: "batchDelete",
      label: "批量删除",
      icon: <Trash2 className="h-4 w-4 mr-1" />,
      onClick: (rows) => console.log("批量删除", rows),
      type: "destructive",
      disabled: (rows) => rows.some((row) => row.status === "completed"),
    },
  ]

  // 定义列
  const columns: ColumnDef[] = [
    {
      id: "name",
      header: "项目名称",
      accessorKey: "name",
      type: FieldType.TEXT,
      enableSorting: true,
      enableFiltering: true,
      cell: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-muted-foreground">{row.description}</div>
        </div>
      ),
    },
    {
      id: "type",
      header: "项目类型",
      accessorKey: "type",
      type: FieldType.SELECT,
      enableSorting: true,
      enableFiltering: true,
      options: [
        { label: "基础研究", value: "基础研究" },
        { label: "应用研究", value: "应用研究" },
        { label: "科技创新", value: "科技创新" },
        { label: "成果转化", value: "成果转化" },
      ],
    },
    {
      id: "source",
      header: "项目来源",
      accessorKey: "source",
      type: FieldType.SELECT,
      enableSorting: true,
      enableFiltering: true,
      options: [
        { label: "国家自然科学基金", value: "国家自然科���基金" },
        { label: "省部级项目", value: "省部级项目" },
        { label: "横向项目", value: "横向项目" },
        { label: "校级项目", value: "校级项目" },
      ],
    },
    {
      id: "status",
      header: "状态",
      accessorKey: "status",
      type: FieldType.SELECT,
      enableSorting: true,
      enableFiltering: true,
      options: [
        { label: "待审批", value: "pending" },
        { label: "进行中", value: "active" },
        { label: "已完成", value: "completed" },
        { label: "已驳回", value: "rejected" },
      ],
      cell: (row) => {
        const statusMap = {
          pending: { label: "待审批", color: "bg-yellow-500" },
          active: { label: "进行中", color: "bg-blue-500" },
          completed: { label: "已完成", color: "bg-green-500" },
          rejected: { label: "已驳回", color: "bg-red-500" },
        }

        const status = statusMap[row.status as keyof typeof statusMap]

        return (
          <Badge variant="outline" className="gap-1 px-2 py-1 font-normal">
            <span className={`h-2 w-2 rounded-full ${status.color}`}></span>
            {status.label}
          </Badge>
        )
      },
    },
    {
      id: "leader",
      header: "负责人",
      accessorKey: "leader",
      type: FieldType.USER,
      enableSorting: true,
      cell: (row) => (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={row.leader.avatar} alt={row.leader.name} />
            <AvatarFallback>{row.leader.name[0]}</AvatarFallback>
          </Avatar>
          {row.leader.name}
        </div>
      ),
    },
    {
      id: "progress",
      header: "进度",
      accessorKey: "progress",
      type: FieldType.NUMBER,
      enableSorting: true,
      cell: (row) => {
        const progress = row.progress
        let barColor = "bg-blue-500"

        if (row.status === "completed") {
          barColor = "bg-green-500"
        } else if (row.status === "rejected") {
          barColor = "bg-red-500"
        } else if (progress < 50) {
          barColor = "bg-yellow-500"
        }

        return (
          <div className="w-full">
            <div className="text-sm mb-1">{progress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`${barColor} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )
      },
    },
    {
      id: "budget",
      header: "预算(元)",
      accessorKey: "budget",
      type: FieldType.NUMBER,
      enableSorting: true,
      enableFiltering: true,
      cell: (row) => <div className="font-medium">{row.budget.toLocaleString()}</div>,
    },
    {
      id: "dates",
      header: "起止日期",
      accessorKey: "startDate",
      type: FieldType.DATE,
      enableSorting: true,
      enableFiltering: true,
      cell: (row) => (
        <div className="text-sm">
          <div>{row.startDate.toLocaleDateString()}</div>
          <div className="text-muted-foreground">至</div>
          <div>{row.endDate.toLocaleDateString()}</div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* 项目类型标签页和操作按钮 */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">项目管理</h2>
          <Tabs defaultValue="all" value={projectType} onValueChange={setProjectType} className="w-auto">
            <TabsList className="h-10">
              <TabsTrigger value="all" className="h-10 px-4">
                全部项目
              </TabsTrigger>
              <TabsTrigger value="vertical" className="h-10 px-4">
                纵向项目
              </TabsTrigger>
              <TabsTrigger value="horizontal" className="h-10 px-4">
                横向项目
              </TabsTrigger>
              <TabsTrigger value="school" className="h-10 px-4">
                校级项目
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleAddProject}>
            <Plus className="h-4 w-4 mr-2" />
            新增项目
          </Button>
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            导入
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <DownloadCloud className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      {/* 搜索和筛选工具栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 rounded-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[240px]"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* 高级筛选按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={showFilterPanel ? "bg-primary/10 border-primary/30 text-primary" : ""}
          >
            高级筛选
          </Button>
        </div>

        {/* 视图切换 */}
        <div className="border rounded-md flex">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            className="h-9 rounded-r-none border-r"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "card" ? "default" : "ghost"}
            size="sm"
            className="h-9 rounded-l-none"
            onClick={() => setViewMode("card")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 项目列表 */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <ProjectCard key={item.id} item={item} actions={actions} selected={false} toggleSelect={() => {}} />
          ))}
        </div>
      ) : (
        <DataList
          data={data}
          columns={columns}
          title=""
          actions={actions}
          batchActions={batchActions}
          onAdd={null} // 已在上方添加按钮
          onImport={null} // 已在上方添加按钮
          onExport={null} // 已在上方添加按钮
          filterFields={filterFields}
          quickFilters={["status", "type"]} // 添加快速筛选字段
          noDataMessage="暂无项目数据"
          isLoading={loading}
          totalCount={totalCount}
          pageSize={pageSize}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          searchable={false} // 已在上方添加搜索框
          selectable={true}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          viewMode="table"
          setViewMode={setViewMode}
          showFilterPanel={showFilterPanel}
          setShowFilterPanel={setShowFilterPanel}
        />
      )}
    </div>
  )
}

