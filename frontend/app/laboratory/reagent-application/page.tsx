"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus, Check, X, Package, Trash } from "lucide-react"
import {
  quickFilters,
  advancedFilters,
  sortOptions,
  statusColors,
  reagentApplicationColumns,
  reagentApplicationActions,
  reagentApplicationCardFields,
  batchActions,
  reagentApplicationCustomCardRenderer,
} from "./config/reagent-application-config"
import { allDemoReagentApplicationItems } from "./data/reagent-application-demo-data"
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
import { ReagentApplicationApprovalDialog } from "./components/reagent-application-approval-dialog"
import { ReagentApplicationViewDialog } from "./components/reagent-application-view-dialog"
import { ReagentApplicationEditDialog } from "./components/reagent-application-edit-dialog"

function ReagentApplicationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [applicationItems, setApplicationItems] = useState(allDemoReagentApplicationItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("applicationDate_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    applicationTitle: true,
    reagentName: true,
    quantity: true,
    applicant: true,
    urgency: true,
    expectedDate: true,
    applicationDate: true,
    status: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  // 审核弹框状态
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [selectedApprovalApplication, setSelectedApprovalApplication] = useState<any>(null)

  // 查看详情弹框状态
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedViewApplication, setSelectedViewApplication] = useState<any>(null)

  // 编辑弹框状态
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedEditApplication, setSelectedEditApplication] = useState<any>(null)

  // 过滤和排序数据
  const filteredApplicationItems = applicationItems
    .filter((item) => {
      // 搜索过滤
      if (
        searchTerm &&
        !item.applicationTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.reagentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.purpose.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // 快速筛选
      if (filterValues.status && filterValues.status !== "" && item.status !== filterValues.status) {
        return false
      }

      if (
        filterValues.reagentType &&
        filterValues.reagentType !== "" &&
        item.reagentType !== filterValues.reagentType
      ) {
        return false
      }

      if (filterValues.department && filterValues.department !== "" && item.department !== filterValues.department) {
        return false
      }

      // 高级筛选
      if (filterValues.applicationTitle && filterValues.applicationTitle !== "") {
        if (!item.applicationTitle.toLowerCase().includes(filterValues.applicationTitle.toLowerCase())) {
          return false
        }
      }

      if (filterValues.reagentName && filterValues.reagentName !== "") {
        if (!item.reagentName.toLowerCase().includes(filterValues.reagentName.toLowerCase())) {
          return false
        }
      }

      if (filterValues.applicant && filterValues.applicant !== "") {
        if (!item.applicant.name.toLowerCase().includes(filterValues.applicant.toLowerCase())) {
          return false
        }
      }

      if (filterValues.quantityRange?.min !== undefined || filterValues.quantityRange?.max !== undefined) {
        const quantity = item.quantity
        if (filterValues.quantityRange.min !== undefined && quantity < filterValues.quantityRange.min) {
          return false
        }
        if (filterValues.quantityRange.max !== undefined && quantity > filterValues.quantityRange.max) {
          return false
        }
      }

      if (filterValues.urgency && filterValues.urgency !== "" && item.urgency !== filterValues.urgency) {
        return false
      }

      if (filterValues.applicationDateRange?.from && filterValues.applicationDateRange?.to) {
        const applicationDate = new Date(item.applicationDate)
        const filterFrom = new Date(filterValues.applicationDateRange.from)
        const filterTo = new Date(filterValues.applicationDateRange.to)

        if (applicationDate < filterFrom || applicationDate > filterTo) {
          return false
        }
      }

      if (filterValues.expectedDate) {
        const expectedDate = new Date(item.expectedDate)
        const filterDate = new Date(filterValues.expectedDate)

        if (expectedDate.toDateString() !== filterDate.toDateString()) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // 排序逻辑
      const option = sortOptions.find((opt) => opt.id === sortOption)
      if (!option) return 0

      const field = option.field
      const direction = option.direction

      if (field.includes("Date")) {
        const dateA = new Date(String(a[field as keyof typeof a])).getTime()
        const dateB = new Date(String(b[field as keyof typeof b])).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }
      
      if (field === "quantity") {
        return direction === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity
      }
      
      if (typeof a[field as keyof typeof a] === "string") {
        return direction === "asc" 
          ? (a[field as keyof typeof a] as string).localeCompare(b[field as keyof typeof b] as string)
          : (b[field as keyof typeof b] as string).localeCompare(a[field as keyof typeof a] as string)
      }
      
      return 0
    })

  // 分页数据
  const totalItems = filteredApplicationItems.length
  const paginatedItems = filteredApplicationItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchApprove = () => {
    setApplicationItems(
      applicationItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "待审核"
          ? { ...item, status: "审核通过", processor: { id: "1", name: "张七", email: "zhang7@lab.edu.cn", avatar: "/avatars/01.png", role: "实验室管理员" }, processDate: new Date().toISOString() }
          : item,
      ),
    )
    setSelectedRows([])
    toast({
      title: "批量审核成功",
      description: `已批准${selectedRows.length}个申领申请`,
      duration: 3000,
    })
  }

  const handleBatchReject = () => {
    setApplicationItems(
      applicationItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "待审核"
          ? { ...item, status: "审核退回", processor: { id: "1", name: "张七", email: "zhang7@lab.edu.cn", avatar: "/avatars/01.png", role: "实验室管理员" }, processDate: new Date().toISOString() }
          : item,
      ),
    )
    setSelectedRows([])
    toast({
      title: "批量退回成功",
      description: `已退回${selectedRows.length}个申领申请`,
      duration: 3000,
    })
  }

  const handleBatchDistribute = () => {
    setApplicationItems(
      applicationItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "已批准"
          ? { ...item, status: "已发放", distributor: { id: "1", name: "张七", email: "zhang7@lab.edu.cn", avatar: "/avatars/01.png", role: "实验室管理员" }, distributionDate: new Date().toISOString() } as any
          : item,
      ),
    )
    setSelectedRows([])
    toast({
      title: "批量发放成功",
      description: `已发放${selectedRows.length}个试剂申领`,
      duration: 3000,
    })
  }

  const handleBatchDelete = () => {
    setApplicationItems(applicationItems.filter((item) => !selectedRows.includes(item.id)))
    toast({
      title: "批量删除成功",
      description: `已删除${selectedRows.length}个申领记录`,
      duration: 3000,
    })
    setSelectedRows([])
  }

  // 处理单个项目删除
  const handleDeleteItem = (item: any) => {
    setItemToDelete(item)
  }

  // 确认删除的处理函数
  const confirmDeleteItem = () => {
    if (itemToDelete) {
      setApplicationItems(applicationItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "删除成功",
        description: `申领 "${itemToDelete.applicationTitle}" 已被删除`,
        duration: 3000,
      })
      setItemToDelete(null)
    }
  }

  // 处理行操作
  const handleRowAction = (action: any, item: any) => {
    const actionId = action.id
    if (actionId === "view") {
      // 使用弹框查看详情而不是跳转页面
      setSelectedViewApplication(item)
      setViewDialogOpen(true)
    } else if (actionId === "edit") {
      setSelectedEditApplication(item)
      setEditDialogOpen(true)
    } else if (actionId === "approve") {
      // 使用弹框进行审核而不是跳转页面
      setSelectedApprovalApplication(item)
      setApprovalDialogOpen(true)
    } else if (actionId === "distribute") {
      router.push(`/laboratory/reagent-application/distribute/${item.id}`)
    } else if (actionId === "record") {
      router.push(`/laboratory/reagent-application/record/${item.id}`)
    } else if (actionId === "cancel") {
      // 取消申领逻辑
      setApplicationItems(
        applicationItems.map((application) =>
          application.id === item.id ? { ...application, status: "已取消" } : application
        )
      )
      toast({
        title: "申领已取消",
        description: `申领 "${item.applicationTitle}" 已被取消`,
        duration: 3000,
      })
    } else if (actionId === "delete") {
      handleDeleteItem(item)
    }
  }

  // 处理编辑申请保存
  const handleSaveEditedApplication = (updatedApplication: any) => {
    setApplicationItems(
      applicationItems.map((item) =>
        item.id === updatedApplication.id ? updatedApplication : item
      )
    )
  }

  // 处理审核通过
  const handleApproveApplication = async (application: any, comments: string) => {
    setApplicationItems(
      applicationItems.map((item) =>
        item.id === application.id
          ? { 
              ...item, 
              status: "审核通过",
              approvalComments: comments,
              processor: { 
                id: "1", 
                name: "张七", 
                email: "zhang7@lab.edu.cn", 
                avatar: "/avatars/01.png", 
                role: "实验室管理员",
                phone: "18012345678"
              }, 
              processDate: new Date().toISOString() 
            }
          : item,
      ) as any,
    )
    
    toast({
      title: "审核通过",
      description: `申领 "${application.applicationTitle}" 审核通过`,
      duration: 3000,
    })
  }

  // 处理审核退回
  const handleRejectApplication = async (application: any, comments: string) => {
    setApplicationItems(
      applicationItems.map((item) =>
        item.id === application.id
          ? { 
              ...item, 
              status: "审核退回",
              approvalComments: comments,
              processor: { 
                id: "1", 
                name: "张七", 
                email: "zhang7@lab.edu.cn", 
                avatar: "/avatars/01.png", 
                role: "实验室管理员",
                phone: "18012345678"
              }, 
              processDate: new Date().toISOString() 
            }
          : item,
      ) as any,
    )
    
    toast({
      title: "审核退回",
      description: `申领 "${application.applicationTitle}" 已退回`,
      duration: 3000,
    })
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      id: "approve",
      label: "批量审核",
      icon: <Check className="h-4 w-4" />,
      onClick: handleBatchApprove,
    },
    {
      id: "reject",
      label: "批量退回",
      icon: <X className="h-4 w-4" />,
      onClick: handleBatchReject,
    },
    {
      id: "distribute",
      label: "批量发放",
      icon: <Package className="h-4 w-4" />,
      onClick: handleBatchDistribute,
    },
    {
      id: "delete",
      label: "批量删除",
      icon: <Trash className="h-4 w-4" />,
      variant: "destructive",
      onClick: handleBatchDelete,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="reagent-application-cards [&_.grid.grid-cols-2.gap-x-6.gap-y-3]:gap-4">
        <DataList
          title="试剂申领管理"
        data={paginatedItems}
        searchValue={searchTerm}
        searchPlaceholder="搜索申领标题、试剂名称、申请人..."
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
        onAddNew={null as any}
        onAIAssist={undefined}
        addButtonLabel={null as any}
        settingsButtonLabel={undefined}
        onOpenSettings={undefined}
        quickFilters={quickFilters}
        onQuickFilterChange={(filterId, value) =>
          setFilterValues((prev) => ({ ...prev, [filterId]: value }))
        }
        quickFilterValues={filterValues}
        onAdvancedFilter={(values) => setFilterValues(values)}
        sortOptions={sortOptions as any}
        activeSortOption={sortOption}
        onSortChange={setSortOption}
        defaultViewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode as "grid" | "list")}
        tableColumns={reagentApplicationColumns as any}
        tableActions={reagentApplicationActions}
        cardActions={reagentApplicationActions}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        cardFields={reagentApplicationCardFields}
        titleField="applicationTitle"
        descriptionField="purpose"
        statusField="status"
        statusVariants={statusColors as any}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        batchActions={configuredBatchActions}
        onRowActionClick={handleRowAction}
        customCardRenderer={reagentApplicationCustomCardRenderer}
        />
      </div>

      {/* 查看详情弹框 */}
      <ReagentApplicationViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        application={selectedViewApplication}
      />

      {/* 编辑申请弹框 */}
      <ReagentApplicationEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        application={selectedEditApplication}
        onSave={handleSaveEditedApplication}
      />

      {/* 审核申领弹框 */}
      <ReagentApplicationApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        application={selectedApprovalApplication}
        onApprove={handleApproveApplication}
        onReject={handleRejectApplication}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除申领 "{itemToDelete?.applicationTitle}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-destructive text-destructive-foreground">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function ReagentApplicationPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ReagentApplicationContent />
    </Suspense>
  )
} 