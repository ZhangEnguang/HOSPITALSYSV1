"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  quickFilters,
  advancedFilters,
  sortOptions,
  tableColumns,
  cardFields,
  tableActions,
  batchActions,
  statusColors,
  // 导入特定进度类型的列和操作
  projectChangeColumns,
  contractRecognitionColumns,
  projectInspectionColumns,
  projectCompletionColumns,
  projectChangeActions,
  contractRecognitionActions,
  projectInspectionActions,
  projectCompletionActions,
  // 导入特定进度类型的卡片字段
  projectChangeCardFields,
  contractRecognitionCardFields,
  projectInspectionCardFields,
  projectCompletionCardFields,
} from "./config/progress-config"
import { allDemoProgressItems } from "./data/progress-demo-data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

function ProgressContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [progressItems, setProgressItems] = useState(allDemoProgressItems)
  const [activeTab, setActiveTab] = useState<
    "projectChange" | "contractRecognition" | "projectInspection" | "projectCompletion"
  >("projectChange")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("dueDate_asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    project: true,
    type: true,
    status: false,
    assignee: true,
    completion: true,
    dueDate: true,
    actualDate: true,
    approvalStatus: true, // 项目变更的审核状态
    recognitionStatus: true, // 合同认定的审核状态
    auditStatus: true, // 项目中检和项目结项的审核状态
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  // 从URL查询参数中读取并设置活动标签页
  useEffect(() => {
    const tabParam = searchParams?.get('tab')
    if (tabParam === 'projectChange' || tabParam === 'contractRecognition' || 
        tabParam === 'projectInspection' || tabParam === 'projectCompletion') {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // 过滤和排序数据
  const filteredProgressItems = progressItems
    .filter((item) => {
      // 标签页过滤
      if (activeTab && item.progressType !== activeTab) {
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
      if (
        filterValues.progressType &&
        filterValues.progressType !== "all" &&
        item.progressType !== filterValues.progressType
      ) {
        return false
      }

      if (filterValues.status && filterValues.status !== "all" && item.status !== filterValues.status) {
        return false
      }

      if (filterValues.priority && filterValues.priority !== "all" && item.priority !== filterValues.priority) {
        return false
      }

      // 高级筛选
      if (
        filterValues.assignee &&
        filterValues.assignee !== "all" &&
        item.assignee.id.toString() !== filterValues.assignee
      ) {
        return false
      }

      if (filterValues.project && filterValues.project !== "all" && item.project.id !== filterValues.project) {
        return false
      }

      if (filterValues.type && filterValues.type !== "all" && item.type !== filterValues.type) {
        return false
      }

      if (filterValues.dateRange?.from && filterValues.dateRange?.to) {
        const dueDate = new Date(item.dueDate)
        const filterFrom = new Date(filterValues.dateRange.from)
        const filterTo = new Date(filterValues.dateRange.to)

        if (dueDate < filterFrom || dueDate > filterTo) {
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

      if (field === "dueDate") {
        const dateA = new Date(a.dueDate).getTime()
        const dateB = new Date(b.dueDate).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }

      if (field === "completion") {
        return direction === "asc" ? a.completion - b.completion : b.completion - a.completion
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
  const totalItems = filteredProgressItems.length
  const paginatedItems = filteredProgressItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchComplete = () => {
    setProgressItems(
      progressItems.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, status: "已完成", completion: 100, actualDate: new Date().toISOString().split("T")[0] }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchDelayed = () => {
    setProgressItems(
      progressItems.map((item) => (selectedRows.includes(item.id) ? { ...item, status: "已延期" } : item)),
    )
    setSelectedRows([])
  }

  const handleBatchDelete = () => {
    setProgressItems(progressItems.filter((item) => !selectedRows.includes(item.id)))
    setSelectedRows([])
  }

  // 处理单个项目删除
  const handleDeleteItem = (item: any) => {
    // 设置要删除的项目并显示确认对话框
    setItemToDelete(item)
  }

  // 确认删除的处理函数
  const confirmDeleteItem = () => {
    if (itemToDelete) {
      setProgressItems(progressItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "删除成功",
        description: `进度 "${itemToDelete.name}" 已被删除`,
        duration: 3000,
      })
      setItemToDelete(null)
    }
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      ...batchActions[0],
      onClick: handleBatchComplete,
    },
    {
      ...batchActions[1],
      onClick: handleBatchDelayed,
    },
    {
      ...batchActions[2],
      onClick: handleBatchDelete,
    },
  ]

  // 配置标签页
  const tabs = [
    {
      id: "projectChange",
      label: "项目变更",
      count: progressItems.filter((item) => item.progressType === "projectChange").length,
    },
    {
      id: "contractRecognition",
      label: "合同认定",
      count: progressItems.filter((item) => item.progressType === "contractRecognition").length,
    },
    {
      id: "projectInspection",
      label: "项目中检",
      count: progressItems.filter((item) => item.progressType === "projectInspection").length,
    },
    {
      id: "projectCompletion",
      label: "项目结项",
      count: progressItems.filter((item) => item.progressType === "projectCompletion").length,
    },
  ]

  // 根据当前活动标签页选择表格列
  const getColumnsForActiveTab = () => {
    switch (activeTab) {
      case "projectChange":
        return projectChangeColumns
      case "contractRecognition":
        return contractRecognitionColumns
      case "projectInspection":
        return projectInspectionColumns
      case "projectCompletion":
        return projectCompletionColumns
      default:
        return tableColumns
    }
  }

  // 根据当前活动标签页选择操作
  const getActionsForActiveTab = () => {
    const actionTypes = {
      projectChange: projectChangeActions,
      contractRecognition: contractRecognitionActions,
      projectInspection: projectInspectionActions,
      projectCompletion: projectCompletionActions,
    }
    
    // 修改操作以使用自定义的删除函数
    const actions = actionTypes[activeTab] || tableActions;
    return actions.map(action => 
      action.id === "delete" 
        ? { ...action, onClick: handleDeleteItem } 
        : action
    );
  }

  // 根据当前活动标签页选择卡片字段
  const getCardFieldsForActiveTab = () => {
    switch (activeTab) {
      case "projectChange":
        return projectChangeCardFields
      case "contractRecognition":
        return contractRecognitionCardFields
      case "projectInspection":
        return projectInspectionCardFields
      case "projectCompletion":
        return projectCompletionCardFields
      default:
        return cardFields
    }
  }

  // 根据当前活动标签页决定是否显示进度条
  const getProgressFieldForActiveTab = () => {
    switch (activeTab) {
      case "projectChange":
      case "contractRecognition":
      case "projectInspection":
      case "projectCompletion":
        return undefined // 不显示进度条
      default:
        return "completion" // 显示进度条
    }
  }

  // 处理标签页切换，并更新URL
  const handleTabChange = (value: string) => {
    const newTab = value as "projectChange" | "contractRecognition" | "projectInspection" | "projectCompletion"
    setActiveTab(newTab)
    
    // 更新URL查询参数，保持当前路径不变
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', newTab)
    router.push(`${pathname}?${params.toString()}`)
    
    // 重置页面状态
    setCurrentPage(1) // 切换标签页时重置到第一页
    setSelectedRows([]) // 清空选中的行
  }

  return (
    <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
      <div
        className="absolute top-0 left-0 right-0 h-[300px] -z-10"
        style={{
          background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
        }}
      ></div>

      <DataList
        title={activeTab === "projectChange" ? "项目变更" : 
              activeTab === "contractRecognition" ? "合同认定" : 
              activeTab === "projectInspection" ? "项目中检" : 
              activeTab === "projectCompletion" ? "项目结项" : "进度管理"}
        data={paginatedItems}
        // 标签页配置
        activeTab={activeTab}
        onTabChange={handleTabChange}
        // 不使用默认的新建按钮
        addButtonLabel=""
        // 使用自定义操作按钮，放在右侧与其他按钮同行
        customActions={
          <Button
            className="gap-2 ml-2"  // 添加左边距，与其他按钮保持间距
            onClick={() => {
              // 直接使用window.location.href进行跳转
              if (activeTab === "projectChange") {
                window.location.href = "/progress/create/projectChange";
              } else if (activeTab === "contractRecognition") {
                window.location.href = "/progress/create/contractRecognition";
              } else if (activeTab === "projectInspection") {
                window.location.href = "/progress/create/projectInspection";
              } else if (activeTab === "projectCompletion") {
                window.location.href = "/progress/create/projectCompletion";
              }
            }}
          >
            <Plus className="h-4 w-4" />
            {activeTab === "projectChange" ? "新建项目变更" :
             activeTab === "contractRecognition" ? "新建合同认定" :
             activeTab === "projectInspection" ? "新建项目中检" :
             activeTab === "projectCompletion" ? "新建项目结项" : "新建进度"}
          </Button>
        }
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
        tableColumns={getColumnsForActiveTab()}
        tableActions={getActionsForActiveTab()}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        // 卡片视图配置
        cardFields={getCardFieldsForActiveTab()}
        cardActions={getActionsForActiveTab()}
        titleField="name"
        descriptionField="description"
        statusField="status"
        statusVariants={statusColors}
        priorityField="priority"
        progressField={getProgressFieldForActiveTab()}
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
        onItemClick={(item) => {
          const url = `/progress/${item.id}`;
          window.open(url, "_self");
        }}
        detailsUrlPrefix="/progress"
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => {
        if (!open) setItemToDelete(null)
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete ? `您确定要删除 "${itemToDelete.name}" 吗？此操作不可逆，删除后数据将无法恢复。` : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function ProgressPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ProgressContent />
    </Suspense>
  )
}
