"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import {
  quickFilters,
  advancedFilters,
  sortOptions,
  statusColors,
  equipmentConfigColumns,
  equipmentConfigActions,
  equipmentConfigCardFields,
  batchActions,
  equipmentConfigCustomCardRenderer,
} from "./config/equipment-booking-config-config"
import { allDemoEquipmentConfigItems } from "./data/equipment-booking-config-demo-data"
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
import { EquipmentConfigDialog } from "./components/equipment-config-dialog"

function EquipmentBookingConfigContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [configItems, setConfigItems] = useState(allDemoEquipmentConfigItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("lastUpdated_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    configName: true,
    configType: true,
    scopeDescription: true,
    status: true,
    lastUpdated: true,
    updatedBy: true,
  })
  
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  // 配置弹框状态
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedConfigItem, setSelectedConfigItem] = useState<any>(null)
  
  // 查看模式弹框状态
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewConfigItem, setViewConfigItem] = useState<any>(null)

  // 过滤和排序数据
  const filteredConfigItems = configItems
    .filter((item) => {
      // 搜索过滤
      if (
        searchTerm &&
        !item.configName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.scopeDescription.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.updatedBy.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // 快速筛选
      if (filterValues.status && filterValues.status !== "" && filterValues.status !== "all" && item.status !== filterValues.status) {
        return false
      }

      if (filterValues.configType && filterValues.configType !== "" && filterValues.configType !== "all" && item.configType !== filterValues.configType) {
        return false
      }

      if (filterValues.applicableScope && filterValues.applicableScope !== "" && filterValues.applicableScope !== "all" && item.applicableScope !== filterValues.applicableScope) {
        return false
      }

      // 高级筛选
      if (filterValues.configName && filterValues.configName !== "") {
        if (!item.configName.toLowerCase().includes(filterValues.configName.toLowerCase())) {
          return false
        }
      }

      if (filterValues.scopeDescription && filterValues.scopeDescription !== "") {
        if (!item.scopeDescription.toLowerCase().includes(filterValues.scopeDescription.toLowerCase())) {
          return false
        }
      }

      if (filterValues.updatedBy && filterValues.updatedBy !== "") {
        if (!item.updatedBy?.toLowerCase().includes(filterValues.updatedBy.toLowerCase())) {
          return false
        }
      }

      if (filterValues.requireApproval && filterValues.requireApproval !== "" && filterValues.requireApproval !== "all") {
        const isRequired = item.requireApproval
        const filterValue = filterValues.requireApproval === "true"
        if (isRequired !== filterValue) {
          return false
        }
      }

      if (filterValues.allowWeekends && filterValues.allowWeekends !== "" && filterValues.allowWeekends !== "all") {
        const allowsWeekends = item.allowWeekends
        const filterValue = filterValues.allowWeekends === "true"
        if (allowsWeekends !== filterValue) {
          return false
        }
      }

      if (filterValues.autoApproval && filterValues.autoApproval !== "" && filterValues.autoApproval !== "all") {
        const hasAutoApproval = item.autoApproval
        const filterValue = filterValues.autoApproval === "true"
        if (hasAutoApproval !== filterValue) {
          return false
        }
      }

      if (filterValues.lastUpdatedRange?.from && filterValues.lastUpdatedRange?.to) {
        const lastUpdatedDate = new Date(item.lastUpdated)
        const filterFrom = new Date(filterValues.lastUpdatedRange.from)
        const filterTo = new Date(filterValues.lastUpdatedRange.to)

        if (lastUpdatedDate < filterFrom || lastUpdatedDate > filterTo) {
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

      if (field.includes("Updated")) {
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
  const totalItems = filteredConfigItems.length
  const paginatedItems = filteredConfigItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量删除
  const handleBatchDelete = () => {
    setConfigItems(
      configItems.filter((item) => !selectedRows.includes(item.id))
    )
    setSelectedRows([])
    toast({
      title: "批量删除成功",
      description: `已删除${selectedRows.length}个配置项`,
      duration: 3000,
    })
  }

  const handleDeleteItem = (item: any) => {
    setItemToDelete(item)
  }

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      setConfigItems(configItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "删除成功",
        description: `配置项"${itemToDelete.configName}"已删除`,
        duration: 3000,
      })
      setItemToDelete(null)
    }
  }

  const handleRowAction = (action: any, item: any) => {
    switch (action.id) {
      case "view":
        // 查看详情
        setViewConfigItem(item)
        setViewDialogOpen(true)
        break
      case "edit":
        // 编辑配置
        setSelectedConfigItem(item)
        setConfigDialogOpen(true)
        break
      case "copy":
        // 复制配置
        const copiedConfig = {
          ...item,
          id: `config_${Date.now()}`,
          configName: `${item.configName}_副本`,
          lastUpdated: new Date().toLocaleDateString("zh-CN") + " " + new Date().toLocaleTimeString("zh-CN", { hour12: false }),
          updatedBy: "当前用户",
        }
        setConfigItems([...configItems, copiedConfig])
        toast({
          title: "复制成功",
          description: `已复制配置"${item.configName}"`,
          duration: 3000,
        })
        break
      case "delete":
        handleDeleteItem(item)
        break
      default:
        break
    }
  }

  const handleConfigSave = (config: any, equipmentId?: string) => {
    if (selectedConfigItem) {
      // 编辑现有配置
      setConfigItems(
        configItems.map((item) =>
          item.id === selectedConfigItem.id
            ? { 
                ...item, 
                ...config,
                lastUpdated: new Date().toISOString(),
                updatedBy: "当前用户"
              }
            : item
        )
      )
      toast({
        title: "配置保存成功",
        description: `配置"${selectedConfigItem.configName}"已更新`,
        duration: 3000,
      })
    } else {
      // 新建配置
      const newConfig = {
        id: `config_${Date.now()}`,
        ...config,
        lastUpdated: new Date().toISOString(),
        updatedBy: "当前用户",
        configType: "自定义",
      }
      setConfigItems([...configItems, newConfig])
      toast({
        title: "配置创建成功", 
        description: `配置"${config.configName}"已创建`,
        duration: 3000,
      })
    }
    setConfigDialogOpen(false)
    setSelectedConfigItem(null)
  }

  return (
    <>
      <DataList
        title="仪器预约配置"
        data={paginatedItems}
        onAddNew={() => {
          setSelectedConfigItem(null)
          setConfigDialogOpen(true)
        }}
        addButtonLabel="新建配置"
        searchValue={searchTerm}
        searchPlaceholder="搜索配置名称、适用范围、更新人..."
        onSearchChange={setSearchTerm}
        onSearch={() => {}}
        quickFilters={quickFilters}
        onQuickFilterChange={(filterId, value) => {
          setFilterValues({ ...filterValues, [filterId]: value })
        }}
        quickFilterValues={filterValues}
        categories={advancedFilters}
        onAdvancedFilter={(filters) => {
          setFilterValues({ ...filterValues, ...filters })
        }}
        filterValues={filterValues}
        sortOptions={sortOptions}
        activeSortOption={sortOption}
        onSortChange={setSortOption}
        defaultViewMode="list"
        onViewModeChange={(mode) => setViewMode(mode as "grid" | "list")}
        tableColumns={equipmentConfigColumns}
        tableActions={equipmentConfigActions}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        cardFields={equipmentConfigCardFields}
        cardActions={equipmentConfigActions}
        statusField="status"
        statusVariants={statusColors}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        batchActions={batchActions}
        onRowActionClick={handleRowAction}
        onBatchActionClick={(action) => {
          if (action.id === "delete") {
            handleBatchDelete()
          }
        }}
        idField="id"
        customCardRenderer={equipmentConfigCustomCardRenderer}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除配置项"{itemToDelete?.configName}"吗？此操作无法撤销。
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

      {/* 配置弹框 */}
      <EquipmentConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        config={selectedConfigItem}
        onSave={handleConfigSave}
      />

      {/* 查看配置弹框 */}
      <EquipmentConfigDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        config={viewConfigItem}
        onSave={() => {}} // 查看模式不需要保存功能
        mode="view"
      />
    </>
  )
}

export default function EquipmentBookingConfigPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <EquipmentBookingConfigContent />
    </Suspense>
  )
} 