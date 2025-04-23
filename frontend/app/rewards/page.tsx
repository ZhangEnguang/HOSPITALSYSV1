"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  cardActions,
  batchActions,
  statusColors,
  statisticsColumns,
  statisticsCardFields,
  reportColumns,
  reportCardFields,
  statisticsActions,
  reportActions,
} from "./config/rewards-config"
import { initialRewardItems } from "./data/rewards-data"

// 创建一个被Suspense包裹的组件
function RewardsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams ? searchParams.get('tab') : null
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [rewardItems, setRewardItems] = useState(initialRewardItems || [])
  const [activeTab, setActiveTab] = useState<string>(
    tabParam || "evaluation-members" // 根据URL的tab参数设置初始激活标签页
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
    department: true,
    position: true,
    period: true,
    score: true,
    result: true,
    evaluator: true,
    date: true,
  })

  useEffect(() => {
    // 输出调试信息
    console.log("当前所有数据:", rewardItems)
    console.log("考核标准数据:", rewardItems.filter(item => item.type === "考核标准"))
    
    // Cleanup function to prevent state updates after unmounting
    return () => {
      // This empty cleanup function helps prevent updates after unmounting
    }
  }, [rewardItems])

  // 过滤和排序数据
  const filteredRewardItems = rewardItems
    .filter((item) => {
      // 标签页过滤
      if (activeTab === "evaluation-members" && item.type !== "考核成员") {
        return false
      }

      if (activeTab === "evaluation-statistics" && item.type !== "考核统计") {
        return false
      }

      if (activeTab === "scoring-report" && item.type !== "考核标准") {
        return false
      }

      // 搜索过滤
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.department.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // 快速筛选
      if (filterValues.department && filterValues.department !== "all" && item.department !== filterValues.department) {
        return false
      }

      if (filterValues.result && filterValues.result !== "all" && item.result !== filterValues.result) {
        return false
      }

      // 高级筛选
      if (
        filterValues.evaluator &&
        filterValues.evaluator !== "all" &&
        item.evaluator.id.toString() !== filterValues.evaluator
      ) {
        return false
      }

      if (filterValues.period && filterValues.period !== "all" && item.period !== filterValues.period) {
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
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }

      if (field === "score") {
        return direction === "asc" ? a.score - b.score : b.score - a.score
      }

      return 0
    })

  // 分页数据
  const totalItems = filteredRewardItems.length
  const paginatedItems = filteredRewardItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 处理批量操作
  const handleBatchExport = () => {
    console.log("批量导出", selectedRows)
    setSelectedRows([])
  }

  const handleBatchPrint = () => {
    console.log("批量打印", selectedRows)
    setSelectedRows([])
  }

  const handleBatchDelete = () => {
    setRewardItems(rewardItems.filter((item) => !selectedRows.includes(item.id)))
    setSelectedRows([])
  }

  // 配置批量操作
  const configuredBatchActions = [
    {
      ...batchActions[0],
      onClick: handleBatchExport,
    },
    {
      ...batchActions[1],
      onClick: handleBatchPrint,
    },
    {
      ...batchActions[2],
      onClick: handleBatchDelete,
    },
  ]

  // 配置标签页
  const tabs = [
    {
      id: "evaluation-members",
      label: "成员考核",
      count: rewardItems.filter((item) => item.type === "考核成员").length,
    },
    {
      id: "evaluation-statistics",
      label: "部门考核",
      count: rewardItems.filter((item) => item.type === "考核统计").length,
    },
    {
      id: "scoring-report",
      label: "考核标准",
      count: rewardItems.filter((item) => item.type === "考核标准").length,
    },
  ]

  // 将sortOptions转换为DataList组件期望的格式
  const formattedSortOptions = sortOptions.map(option => ({
    value: option.id,
    label: option.label
  }))

  // 处理开始评分
  const handleStartScoring = (item: any) => {
    if (item.type !== "考核成员") {
      return
    }

    console.log("开始对", item.name, "进行评分")
    // 这里可以添加导航到评分页面或打开评分对话框的逻辑
    router.push(`/rewards/scoring/${item.id}`)
  }

  // 获取当前标签页的表格列
  const getCurrentTableColumns = () => {
    if (activeTab === "evaluation-statistics") {
      return statisticsColumns
    } else if (activeTab === "scoring-report") {
      return reportColumns
    }
    return tableColumns
  }

  // 获取当前标签页的卡片字段
  const getCurrentCardFields = () => {
    if (activeTab === "evaluation-statistics") {
      return statisticsCardFields
    } else if (activeTab === "scoring-report") {
      return reportCardFields
    }
    return cardFields
  }

  // 获取当前标签页的表格操作
  const getCurrentTableActions = () => {
    if (activeTab === "evaluation-statistics") {
      return statisticsActions.map((action) => ({
        ...action,
        onClick: (item: any) => {
          console.log("点击了操作:", action.label, item)
          // 根据操作类型处理不同的操作
          if (action.id === "view") {
            // 查看统计详情
            router.push(`/rewards/departments/${item.id}`)
          } else if (action.id === "edit") {
            // 编辑统计项
            router.push(`/rewards/departments/edit/${item.id}`)
          } else if (action.id === "delete") {
            // 删除统计项
            console.log("删除统计项", item)
            setRewardItems(rewardItems.filter(i => i.id !== item.id))
          }
        },
      }))
    } else if (activeTab === "scoring-report") {
      return reportActions.map((action) => ({
        ...action,
        onClick: (item: any) => {
          console.log("点击了操作:", action.label, item)
          // 根据操作类型处理不同的操作
          if (action.id === "view") {
            // 查看考核标准详情
            router.push(`/rewards/standards/${item.id}`)
          } else if (action.id === "edit") {
            // 编辑考核标准
            router.push(`/rewards/standards/edit/${item.id}`)
          } else if (action.id === "delete") {
            // 删除考核标准
            console.log("删除考核标准", item)
            setRewardItems(rewardItems.filter(i => i.id !== item.id))
          }
        },
      }))
    }
    return tableActions.map((action) => ({
      ...action,
      onClick: (item: any) => {
        console.log("点击了操作:", action.label, item)
        
        // 根据操作类型处理不同的操作
        if (action.id === "score") {
          // 开始评分
          handleStartScoring(item)
        } else if (action.id === "view") {
          // 查看详情
          router.push(`/rewards/members/${item.id}`)
        } else if (action.id === "edit") {
          // 编辑
          router.push(`/rewards/members/edit/${item.id}`)
        } else if (action.id === "delete") {
          // 删除
          console.log("删除项目", item)
          setRewardItems(rewardItems.filter(i => i.id !== item.id))
        }
      },
    }))
  }

  // 获取当前标签页的卡片操作
  const getCurrentCardActions = () => {
    if (activeTab === "evaluation-statistics") {
      return statisticsActions.map((action) => ({
        ...action,
        onClick: (item: any) => {
          console.log("点击了卡片操作:", action.label, item)
          // 根据操作类型处理不同的操作
          if (action.id === "view") {
            // 查看统计详情
            router.push(`/rewards/departments/${item.id}`)
          } else if (action.id === "edit") {
            // 编辑统计项
            router.push(`/rewards/departments/edit/${item.id}`)
          } else if (action.id === "delete") {
            // 删除统计项
            console.log("删除统计项", item)
            setRewardItems(rewardItems.filter(i => i.id !== item.id))
          }
        },
      }))
    } else if (activeTab === "scoring-report") {
      return reportActions.map((action) => ({
        ...action,
        onClick: (item: any) => {
          console.log("点击了卡片操作:", action.label, item)
          // 根据操作类型处理不同的操作
          if (action.id === "view") {
            // 查看考核标准详情
            router.push(`/rewards/standards/${item.id}`)
          } else if (action.id === "edit") {
            // 编辑考核标准
            router.push(`/rewards/standards/edit/${item.id}`)
          } else if (action.id === "delete") {
            // 删除考核标准
            console.log("删除考核标准", item)
            setRewardItems(rewardItems.filter(i => i.id !== item.id))
          }
        },
      }))
    }
    return cardActions.map((action) => ({
      ...action,
      onClick: (item: any) => {
        console.log("点击了卡片操作:", action.label, item)
        
        // 根据操作类型处理不同的操作
        if (action.id === "score") {
          // 开始评分
          handleStartScoring(item)
        } else if (action.id === "view") {
          // 查看详情
          router.push(`/rewards/members/${item.id}`)
        } else if (action.id === "edit") {
          // 编辑
          router.push(`/rewards/members/edit/${item.id}`)
        } else if (action.id === "delete") {
          // 删除
          console.log("删除项目", item)
          setRewardItems(rewardItems.filter(i => i.id !== item.id))
        }
      },
    }))
  }

  // 添加新成员
  const handleAddMember = () => {
    if (activeTab === "evaluation-members") {
      router.push("/rewards/members/new")
    } else if (activeTab === "evaluation-statistics") {
      router.push("/rewards/create/evaluation-statistics")
    } else if (activeTab === "scoring-report") {
      router.push("/rewards/standards/new")
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

  // 获取当前标签页的标题
  const getCurrentTitle = () => {
    if (activeTab === "evaluation-members") {
      return "成员考核";
    } else if (activeTab === "evaluation-statistics") {
      return "部门考核";
    } else if (activeTab === "scoring-report") {
      return "考核标准";
    }
    return "考核奖励";
  }

  return (
    <>
      <DataList
        title={getCurrentTitle()}
        data={paginatedItems}
        totalItems={totalItems}
        onSearch={(term) => setSearchTerm(term)}
        onFilterChange={(filters) => setFilterValues(filters)}
        onSortChange={(option) => setSortOption(option)}
        onViewModeChange={(mode) => setViewMode(mode)}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => setPageSize(size)}
        onColumnToggle={(columns) => setVisibleColumns(columns)}
        onRowSelect={(rows) => setSelectedRows(rows)}
        selectedRows={selectedRows}
        currentPage={currentPage}
        pageSize={pageSize}
        tableColumns={getCurrentTableColumns()}
        cardFields={getCurrentCardFields()}
        tableActions={getCurrentTableActions()}
        cardActions={getCurrentCardActions()}
        batchActions={configuredBatchActions}
        quickFilters={quickFilters}
        advancedFilters={advancedFilters}
        sortOptions={formattedSortOptions}
        activeSort={sortOption}
        viewMode={viewMode}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        statusColorMap={statusColors}
        headerAction={(
          <Button onClick={handleAddMember}>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "evaluation-members" && "添加成员"}
            {activeTab === "evaluation-statistics" && "添加部门考核"}
            {activeTab === "scoring-report" && "添加考核标准"}
          </Button>
        )}
      />
    </>
  )
}

// 主页面组件，使用Suspense包裹RewardsContent
export default function RewardsPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <RewardsContent />
    </Suspense>
  )
}
