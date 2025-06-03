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
  statusColors,
  equipmentBookingColumns,
  equipmentBookingActions,
  equipmentBookingCardFields,
  batchActions,
} from "./config/equipment-booking-config"
import { allDemoEquipmentBookingItems } from "./data/equipment-booking-demo-data"
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
import { BookingDetailDialog } from "./components/booking-detail-dialog"
import { BookingApprovalDialog } from "./components/booking-approval-dialog"

function EquipmentBookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [bookingItems, setBookingItems] = useState(allDemoEquipmentBookingItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("applicationDate_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    bookingTitle: true,
    equipmentName: true,
    status: true,
    applicant: true,
    bookingDate: true,
    duration: true,
    applicationDate: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  
  // 预约详情弹框状态
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  // 审核弹框状态
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [selectedApprovalBooking, setSelectedApprovalBooking] = useState<any>(null)

  // 过滤和排序数据
  const filteredBookingItems = bookingItems
    .filter((item) => {
      // 搜索过滤
      if (
        searchTerm &&
        !item.bookingTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
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
        filterValues.equipmentType &&
        filterValues.equipmentType !== "" &&
        item.equipmentType !== filterValues.equipmentType
      ) {
        return false
      }

      if (filterValues.department && filterValues.department !== "" && item.department !== filterValues.department) {
        return false
      }

      // 高级筛选
      if (filterValues.bookingTitle && filterValues.bookingTitle !== "") {
        if (!item.bookingTitle.toLowerCase().includes(filterValues.bookingTitle.toLowerCase())) {
          return false
        }
      }

      if (filterValues.equipmentName && filterValues.equipmentName !== "") {
        if (!item.equipmentName.toLowerCase().includes(filterValues.equipmentName.toLowerCase())) {
          return false
        }
      }

      if (filterValues.applicant && filterValues.applicant !== "") {
        if (!item.applicant.name.toLowerCase().includes(filterValues.applicant.toLowerCase())) {
          return false
        }
      }

      if (filterValues.bookingDateRange?.from && filterValues.bookingDateRange?.to) {
        const bookingDate = new Date(item.startTime)
        const filterFrom = new Date(filterValues.bookingDateRange.from)
        const filterTo = new Date(filterValues.bookingDateRange.to)

        if (bookingDate < filterFrom || bookingDate > filterTo) {
          return false
        }
      }

      if (filterValues.applicationDateRange?.from && filterValues.applicationDateRange?.to) {
        const applicationDate = new Date(item.applicationDate)
        const filterFrom = new Date(filterValues.applicationDateRange.from)
        const filterTo = new Date(filterValues.applicationDateRange.to)

        if (applicationDate < filterFrom || applicationDate > filterTo) {
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
      
      if (typeof a[field as keyof typeof a] === "string") {
        return direction === "asc" 
          ? (a[field as keyof typeof a] as string).localeCompare(b[field as keyof typeof b] as string)
          : (b[field as keyof typeof b] as string).localeCompare(a[field as keyof typeof a] as string)
      }
      
      return 0
    })

  // 分页数据
  const totalItems = filteredBookingItems.length
  const paginatedItems = filteredBookingItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchApprove = () => {
    setBookingItems(
      bookingItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "待审核"
          ? { 
              ...item, 
              status: "审核通过", 
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
    setSelectedRows([])
    toast({
      title: "批量审核成功",
      description: `已批准${selectedRows.length}个预约申请`,
      duration: 3000,
    })
  }

  const handleBatchReject = () => {
    setBookingItems(
      bookingItems.map((item) =>
        selectedRows.includes(item.id) && item.status === "待审核"
          ? { 
              ...item, 
              status: "审核退回", 
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
    setSelectedRows([])
    toast({
      title: "批量拒绝成功",
      description: `已退回${selectedRows.length}个预约申请`,
      duration: 3000,
    })
  }

  const handleBatchDelete = () => {
    setBookingItems(bookingItems.filter((item) => !selectedRows.includes(item.id)))
    toast({
      title: "批量删除成功",
      description: `已删除${selectedRows.length}个预约记录`,
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
      setBookingItems(bookingItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "删除成功",
        description: `预约 "${itemToDelete.bookingTitle}" 已被删除`,
        duration: 3000,
      })
      setItemToDelete(null)
    }
  }

  // 处理行操作
  const handleRowAction = (action: any, item: any) => {
    const actionId = action.id; // 从action对象中提取id
    
    if (actionId === "view") {
      // 使用弹框显示详情而不是跳转页面
      setSelectedBooking(item)
      setDetailDialogOpen(true)
    } else if (actionId === "edit") {
      router.push(`/laboratory/equipment-booking/edit/${item.id}`)
    } else if (actionId === "approve") {
      // 使用弹框进行审核而不是跳转页面
      setSelectedApprovalBooking(item)
      setApprovalDialogOpen(true)
    } else if (actionId === "usage") {
      router.push(`/laboratory/equipment-booking/usage/${item.id}`)
    } else if (actionId === "cancel") {
      // 取消预约逻辑
      setBookingItems(
        bookingItems.map((booking) =>
          booking.id === item.id ? { ...booking, status: "已取消" } : booking
        )
      )
      toast({
        title: "预约已取消",
        description: `预约 "${item.bookingTitle}" 已被取消`,
        duration: 3000,
      })
    } else if (actionId === "delete") {
      handleDeleteItem(item)
    }
  }

  // 处理审核通过
  const handleApproveBooking = async (booking: any, comments: string) => {
    setBookingItems(
      bookingItems.map((item) =>
        item.id === booking.id
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
      description: `预约 "${booking.bookingTitle}" 审核通过`,
      duration: 3000,
    })
  }

  // 处理审核退回
  const handleRejectBooking = async (booking: any, comments: string) => {
    setBookingItems(
      bookingItems.map((item) =>
        item.id === booking.id
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
      description: `预约 "${booking.bookingTitle}" 已退回`,
      duration: 3000,
    })
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      id: "approve",
      label: "批量审核",
      icon: "Check",
      onClick: handleBatchApprove,
    },
    {
      id: "reject",
      label: "批量退回",
      icon: "X",
      onClick: handleBatchReject,
    },
    {
      id: "delete",
      label: "批量删除",
      icon: "Trash",
      variant: "destructive",
      onClick: handleBatchDelete,
    },
  ]

  return (
    <div className="space-y-6">
      <DataList
        title="仪器预约管理"
        data={paginatedItems}
        searchValue={searchTerm}
        searchPlaceholder="搜索预约标题、仪器名称、申请人..."
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
        onAddNew={() => router.push("/laboratory/equipment-booking/create")}
        onAIAssist={undefined}
        addButtonLabel="新增预约"
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
        tableColumns={equipmentBookingColumns as any}
        tableActions={equipmentBookingActions}
        cardActions={equipmentBookingActions}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        cardFields={equipmentBookingCardFields}
        titleField="bookingTitle"
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
      />

      {/* 预约详情弹框 */}
      <BookingDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        booking={selectedBooking}
      />

      {/* 审核申领弹框 */}
      <BookingApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        booking={selectedApprovalBooking}
        onApprove={handleApproveBooking}
        onReject={handleRejectBooking}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除预约 "{itemToDelete?.bookingTitle}" 吗？此操作无法撤销。
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

export default function EquipmentBookingPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <EquipmentBookingContent />
    </Suspense>
  )
} 