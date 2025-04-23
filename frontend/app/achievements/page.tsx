"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
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
import {
  quickFilters,
  advancedFilters,
  sortOptions,
  getTableColumns,
  cardFields,
  tableActions,
  cardActions,
  batchActions,
  statusColors,
  getTableActionsByType,
  getCardActionsByType,
  getNameHeaderByTab
} from "./config/achievements-config"
import { initialAchievementItems } from "./data/achievements-data"
import { Input } from "@/components/ui/input"

// 创建一个被Suspense包裹的组件
function AchievementsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams ? searchParams.get('tab') : null
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [achievementItems, setAchievementItems] = useState(initialAchievementItems)
  const [activeTab, setActiveTab] = useState<string>(
    tabParam || "academic-papers" // 根据URL的tab参数设置初始激活标签页
  )

  // 监听URL参数变化，更新激活标签页
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("date_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    type: true,
    project: true,
    author: true,
    level: true,
    status: true,
    date: true,
    venue: true,
  })
  // 删除确认对话框状态
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  // 过滤和排序数据
  const filteredAchievementItems = achievementItems
    .filter((item) => {
      // 标签页过滤
      if (activeTab === "academic-papers" && item.type !== "学术论文") {
        return false
      }

      if (activeTab === "academic-works" && item.type !== "学术著作") {
        return false
      }

      if (activeTab === "achievement-awards" && item.type !== "成果获奖") {
        return false
      }

      if (activeTab === "evaluated-achievements" && item.type !== "鉴定成果") {
        return false
      }

      if (activeTab === "patents" && item.type !== "专利") {
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
      if (filterValues.type && filterValues.type !== "all" && item.type !== filterValues.type) {
        return false
      }

      if (filterValues.status && filterValues.status !== "all" && item.status !== filterValues.status) {
        return false
      }

      // 高级筛选
      if (filterValues.author && filterValues.author !== "all" && item.author.id.toString() !== filterValues.author) {
        return false
      }

      if (filterValues.project && filterValues.project !== "all" && item.project.id !== filterValues.project) {
        return false
      }

      if (filterValues.level && filterValues.level !== "all" && item.level !== filterValues.level) {
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

      return true
    })
    .sort((a, b) => {
      // 排序逻辑
      const [field, direction] = sortOption.split("_")

      if (field === "name") {
        return direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }

      if (field === "date") {
        // 处理可能为null的日期
        if (!a.date && !b.date) return 0
        if (!a.date) return direction === "asc" ? 1 : -1
        if (!b.date) return direction === "asc" ? -1 : 1

        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }

      if (field === "level") {
        const levelOrder = {
          国际级: 5,
          国家级: 4,
          省部级: 3,
          市厅级: 2,
          校级: 1,
          行业级: 3,
        }
        return direction === "asc"
          ? (levelOrder[a.level as keyof typeof levelOrder] || 0) -
              (levelOrder[b.level as keyof typeof levelOrder] || 0)
          : (levelOrder[b.level as keyof typeof levelOrder] || 0) -
              (levelOrder[a.level as keyof typeof levelOrder] || 0)
      }

      return 0
    })

  // 分页数据
  const totalItems = filteredAchievementItems.length
  const paginatedItems = filteredAchievementItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchDownload = () => {
    console.log("批量下载", selectedRows)
    // 实际应用中这里会调用下载API
    setSelectedRows([])
  }

  const handleBatchShare = () => {
    console.log("批量分享", selectedRows)
    // 实际应用中这里会调用分享API
    setSelectedRows([])
  }

  const handleBatchDelete = () => {
    setAchievementItems(achievementItems.filter((item) => !selectedRows.includes(item.id)))
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
      setAchievementItems(achievementItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "删除成功",
        description: `成果 "${itemToDelete.name}" 已被删除`,
        duration: 3000,
      })
      setItemToDelete(null)
    }
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      ...batchActions[0],
      onClick: handleBatchDownload,
    },
    {
      ...batchActions[1],
      onClick: handleBatchShare,
    },
    {
      ...batchActions[2],
      onClick: handleBatchDelete,
    },
  ]

  // 配置标签页 - 按照新的顺序排列
  const tabs = [
    {
      id: "academic-papers",
      label: "学术论文",
      count: achievementItems.filter((item) => item.type === "学术论文").length,
    },
    {
      id: "academic-works",
      label: "学术著作",
      count: achievementItems.filter((item) => item.type === "学术著作").length,
    },
    {
      id: "evaluated-achievements",
      label: "鉴定成果",
      count: achievementItems.filter((item) => item.type === "鉴定成果").length,
    },
    {
      id: "achievement-awards",
      label: "成果获奖",
      count: achievementItems.filter((item) => item.type === "成果获奖").length,
    },
    {
      id: "patents",
      label: "专利",
      count: achievementItems.filter((item) => item.type === "专利").length,
    },
  ]

  // 将sortOptions转换为DataList组件期望的格式
  const formattedSortOptions = sortOptions.map(option => ({
    value: option.id,
    label: option.label
  }))

  // 动态获取表格列配置
  const getCustomTableColumns = () => {
    return getTableColumns(activeTab)
  }

  // 根据标签页类型获取定制表格操作
  const getCustomTableActions = (type) => {
    const actions = getTableActionsByType(type)
    return actions.map((action) => ({
      ...action,
      onClick: (item) => {
        if (action.id === "delete") {
          handleDeleteItem(item)
        } else {
          action.onClick(item, router)
        }
      }
    }))
  }

  // 根据标签页类型获取定制卡片操作
  const getCustomCardActions = (type) => {
    const actions = getCardActionsByType(type)
    return actions.map((action) => ({
      ...action,
      onClick: (item) => {
        if (action.id === "delete") {
          handleDeleteItem(item)
        } else {
          action.onClick(item, router)
        }
      }
    }))
  }

  // 添加新成果按钮处理函数
  const handleAddAchievement = () => {
    const achievementType = getAchievementTypeByTab(activeTab)
    let createPath = '/achievements/create'
    
    switch (activeTab) {
      case 'academic-papers':
        createPath += '/academic-papers'
        break
      case 'academic-works':
        createPath += '/academic-works'
        break
      case 'achievement-awards':
        createPath += '/achievement-awards'
        break
      case 'evaluated-achievements':
        createPath += '/evaluated-achievements'
        break
      case 'patents':
        createPath += '/patents'
        break
      default:
        createPath += '/academic-papers'
    }
    
    router.push(createPath)
  }

  // 根据标签页获取成果类型
  const getAchievementTypeByTab = (tab: string): string => {
    switch (tab) {
      case 'academic-papers':
        return '学术论文'
      case 'academic-works':
        return '学术著作'
      case 'achievement-awards':
        return '成果获奖'
      case 'evaluated-achievements':
        return '鉴定成果'
      case 'patents':
        return '专利'
      default:
        return '学术论文'
    }
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // 更新URL参数，不刷新页面
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tabId)
    window.history.pushState({}, '', url.toString())
    // 重置页码
    setCurrentPage(1)
  }

  return (
    <>
      <DataList
        title={getAchievementTypeByTab(activeTab)}
        data={paginatedItems}
        totalItems={totalItems}
        onSearch={(term) => setSearchTerm(term)}
        onFilterChange={(filters) => setFilterValues(filters)}
        onSortChange={(option) => setSortOption(option)}
        onViewModeChange={(mode) => setViewMode(mode)}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => setPageSize(size)}
        onVisibleColumnsChange={(columns) => setVisibleColumns(columns)}
        onSelectedRowsChange={(rows) => setSelectedRows(rows)}
        selectedRows={selectedRows}
        currentPage={currentPage}
        pageSize={pageSize}
        tableColumns={getCustomTableColumns()}
        cardFields={cardFields}
        tableActions={getCustomTableActions(activeTab)}
        cardActions={getCustomCardActions(activeTab)}
        batchActions={configuredBatchActions}
        quickFilters={quickFilters}
        seniorFilterValues={filterValues}
        sortOptions={formattedSortOptions}
        activeSortOption={sortOption}
        defaultViewMode={viewMode}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        statusVariants={statusColors}
        titleField="name"
        customActions={(
          <Button onClick={handleAddAchievement}>
            <Plus className="mr-2 h-4 w-4" />
            添加{getAchievementTypeByTab(activeTab)}
          </Button>
        )}
      />

      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除 "{itemToDelete?.name}" 吗？此操作不能撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// 主页面组件，使用Suspense包裹AchievementsContent
export default function AchievementsPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <AchievementsContent />
    </Suspense>
  )
}
