"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import {
  quickFilters,
  advancedFilters,
  sortOptions,
  tableColumns,
  cardFields,
  batchActions,
  auditStatusColors,
  getTableActionsByType,
  getCardActionsByType
} from "./config/funds-config"
import { initialFundsItems } from "./data/funds-data"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
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

// 创建一个包装组件来处理 searchParams
function FundsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [fundsItems, setFundsItems] = useState(initialFundsItems)
  const [activeTab, setActiveTab] = useState<"income" | "outbound" | "reimbursement" | "carryover">("income")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("date_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    project: true,
    type: true,
    category: true,
    amount: true,
    status: true,
    applicant: true,
    date: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  // 从URL查询参数中读取并设置活动标签页
  useEffect(() => {
    const tabParam = searchParams?.get('tab')
    if (tabParam === 'income' || tabParam === 'outbound' || 
        tabParam === 'reimbursement' || tabParam === 'carryover') {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // 过滤和排序数据
  const filteredFundsItems = fundsItems
    .filter((item) => {
      // 标签页过滤
      if (activeTab === "income" && item.type !== "入账") {
        return false
      }

      if (activeTab === "outbound" && item.type !== "外拨") {
        return false
      }

      if (activeTab === "reimbursement" && item.type !== "报销") {
        return false
      }

      if (activeTab === "carryover" && item.type !== "结转") {
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

      if (filterValues.project && filterValues.project !== "all" && item.project.id !== filterValues.project) {
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

      if (field === "amount") {
        return direction === "asc" ? a.amount - b.amount : b.amount - a.amount
      }

      return 0
    })

  // 分页数据
  const totalItems = filteredFundsItems.length
  const paginatedItems = filteredFundsItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchApprove = () => {
    setFundsItems(
      fundsItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "待审核"
          ? {
              ...item,
              status: "已通过",
              approver: { id: currentUserId, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
              approveDate: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchReject = () => {
    setFundsItems(
      fundsItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "待审核"
          ? {
              ...item,
              status: "已退回",
              approver: { id: currentUserId, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
              approveDate: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    )
    setSelectedRows([])
  }

  const handleBatchDelete = () => {
    setFundsItems(fundsItems.filter((item) => !selectedRows.includes(item.id)))
    setSelectedRows([])
  }

  const handleDeleteItem = (item: any) => {
    setItemToDelete(item)
  }

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      // 执行删除操作
      setFundsItems(fundsItems.filter(item => item.id !== itemToDelete.id))
      
      // 显示成功提示
      toast({
        title: "删除成功",
        description: `已成功删除: ${itemToDelete.name}`,
      })
      
      // 清空删除项
      setItemToDelete(null)
    }
  }

  // 配置批量操作按钮，根据选中行的状态来启用或禁用批量审批按钮
  // 检查是否有可审批的项目（必须是待审核状态）
  const hasApprovableItems = selectedRows.some(id => {
    const item = fundsItems.find(item => item.id === id)
    return item && item.status === "待审核"
  })

  const configuredBatchActions = batchActions.map(action => {
    if (action.id === "approve" || action.id === "reject") {
      return {
        ...action,
        disabled: !hasApprovableItems
      }
    }
    return action
  })

  // 获取当前类型中文名称
  const getCurrentType = () => {
    switch (activeTab) {
      case "income": return "入账"
      case "outbound": return "外拨"
      case "reimbursement": return "报销"
      case "carryover": return "结转"
      default: return ""
    }
  }

  // 获取表格操作按钮
  const getTableActions = () => {
    return getTableActionsByType({
      type: getCurrentType(),
      onApprove: handleBatchApprove,
      onReject: handleBatchReject,
      onDelete: handleDeleteItem,
    })
  }

  // 获取卡片操作按钮
  const getCardActions = () => {
    return getCardActionsByType({
      type: getCurrentType(),
      onApprove: handleBatchApprove,
      onReject: handleBatchReject,
      onDelete: handleDeleteItem,
    })
  }

  // 处理标签页切换
  const handleTabChange = (value: string) => {
    // 验证标签页值
    if (
      value !== "income" &&
      value !== "outbound" &&
      value !== "reimbursement" &&
      value !== "carryover"
    ) {
      return
    }

    // 更新状态
    setActiveTab(value as "income" | "outbound" | "reimbursement" | "carryover")
    
    // 更新URL查询参数，不刷新页面
    const newTab = value
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
        title={activeTab === "income" ? "经费入账" : 
              activeTab === "outbound" ? "经费外拨" : 
              activeTab === "reimbursement" ? "经费报销" : 
              activeTab === "carryover" ? "经费结转" : "经费管理"}
        data={paginatedItems}
        // 标签页配置（已隐藏但功能保留）
        activeTab={activeTab}
        onTabChange={handleTabChange}
        // 使用自定义操作按钮，放在右侧与其他按钮同行
        customActions={
          <Button
            className="gap-2 ml-2"  // 添加左边距，与其他按钮保持间距
            onClick={() => {
              if (activeTab === "income") {
                window.location.href = "/funds/create/income";
              } else if (activeTab === "outbound") {
                window.location.href = "/funds/create/outbound";
              } else if (activeTab === "reimbursement") {
                window.location.href = "/funds/create/reimbursement";
              } else if (activeTab === "carryover") {
                window.location.href = "/funds/create/carryover";
              }
            }}
          >
            <Plus className="h-4 w-4" />
            {activeTab === "income" ? "新建经费入账" :
             activeTab === "outbound" ? "新建经费外拨" :
             activeTab === "reimbursement" ? "新建经费报销" :
             activeTab === "carryover" ? "新建经费结转" : "新建"}
          </Button>
        }
        // 设置addButtonLabel为空字符串，这样就不会显示默认的新建按钮
        addButtonLabel=""
        // 添加模板库按钮
        onOpenSettings={() => {
          // 这个函数会在模板库按钮点击时执行
          console.log("打开模板库");
        }}
        settingsButtonLabel="模板库"
        // 添加AI智能填报按钮
        onAIAssist={() => {
          console.log("AI智能填报");
        }}
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
        tableActions={getTableActions()}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        // 卡片视图配置
        cardFields={cardFields}
        cardActions={getCardActions()}
        titleField="name"
        descriptionField="description"
        statusField="status"
        statusVariants={auditStatusColors}
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
        onItemClick={(item) => router.push(`/funds/${item.id}`)}
        detailsUrlPrefix="/funds"
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

export default function FundsPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <FundsPageContent />
    </Suspense>
  );
}
