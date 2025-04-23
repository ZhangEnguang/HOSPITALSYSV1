"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { CheckSquare } from "lucide-react"
import { extendedTodoItems, extendedCompletedItems } from "./data/mock-data"
import TodoStatusCards from "./components/todo-status-cards"
import TodoFilterBar from "./components/todo-filter-bar"
import TodoList from "./components/todo-list"
import CompletedTodoList from "./components/completed-todo-list"
import TodoBatchActions from "./components/todo-batch-actions"
import AIAssistant from "./components/ai-assistant"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function TodosPage() {
  // 状态管理
  const [activeTab, setActiveTab] = useState<string>("pending")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [filterType, setFilterType] = useState<string[]>([])
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(true)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  // 在状态管理部分添加排序状态
  const [sortOption, setSortOption] = useState<string>("default")
  const [pinnedItemId, setPinnedItemId] = useState<number | null>(null)

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(viewMode === "list" ? 5 : 6) // 列表视图5个，卡片视图6个
  
  // 分页和加载状态
  const [displayedItems, setDisplayedItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // 使用 ref 存储过滤后的项目，避免循环依赖
  const filteredItemsRef = useRef<any[]>([])

  // 根据当前标签页筛选数据
  const getFilteredItems = useCallback(() => {
    // 首先按标签页筛选
    const tabFiltered =
      activeTab === "pending"
        ? extendedTodoItems.filter((item) => item.status === "待审核")
        : activeTab === "completed"
          ? extendedCompletedItems // 使用 completedItems 数组作为已审核项目的数据源
          : [...extendedTodoItems, ...extendedCompletedItems] // 全部项目

    // 然后应用其他筛选条件
    const filtered = tabFiltered.filter((item) => {
      // 类型筛选 (多选)
      if (filterType.length > 0 && !filterType.includes(item.type)) return false

      // 优先级筛选 - 对于已审核项目，不应用优先级筛选
      if (activeTab !== "completed" && filterPriority !== "all" && item.priority !== filterPriority) return false

      // 搜索筛选
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false

      return true
    })

    // 应用排序
    return sortItems(filtered, sortOption)
  }, [activeTab, filterType, filterPriority, searchQuery, sortOption])

  // 添加排序函数
  const sortItems = (items: any[], sortOption: string) => {
    const itemsCopy = [...items]

    switch (sortOption) {
      case "priority-desc":
        // 按优先级排序（紧急 > 一般 > 普通）
        return itemsCopy.sort((a, b) => {
          const priorityOrder: Record<string, number> = { 紧急: 0, 一般: 1, 普通: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        })
      case "priority-asc":
        // 按优先级排序（普通 > 一般 > 紧急）
        return itemsCopy.sort((a, b) => {
          const priorityOrder: Record<string, number> = { 紧急: 0, 一般: 1, 普通: 2 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        })
      case "date-desc":
        // 按提交日期排序（最新的在前）
        return itemsCopy.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      case "date-asc":
        // 按提交日期排序（最早的在前）
        return itemsCopy.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
      case "deadline-asc":
        // 按截止日期排序（最近的在前）
        return itemsCopy.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      case "deadline-desc":
        // 按截止日期排序（最远的在前）
        return itemsCopy.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
      default:
        // 默认排序（保持原始顺序）
        return itemsCopy
    }
  }

  // 当筛选条件变化时更新过滤后的项目
  useEffect(() => {
    const newFilteredItems = getFilteredItems()
    filteredItemsRef.current = newFilteredItems

    // 重置分页并显示第一页
    setPage(1)
    setCurrentPage(1) // 确保分页也重置
    setDisplayedItems(newFilteredItems.slice(0, itemsPerPage))
    
    // 添加这行代码提示用户分页改变
    toast({
      title: "筛选条件已更新",
      description: viewMode === "list" ? "每页显示5个项目" : "每页显示6个项目",
      duration: 2000,
    })
  }, [activeTab, filterType, filterPriority, searchQuery, getFilteredItems, viewMode, itemsPerPage])

  // 加载更多数据
  const loadMoreItems = useCallback(() => {
    if (isLoading) return

    const currentFilteredItems = filteredItemsRef.current
    if (displayedItems.length >= currentFilteredItems.length) return

    setIsLoading(true)

    // 模拟网络请求延迟
    // setTimeout(() => {
    //   const nextPage = page + 1
    //   const newItems = currentFilteredItems.slice(0, nextPage * itemsPerPage)
    //   setDisplayedItems(newItems)
    //   setPage(nextPage)
    //   setIsLoading(false)
    // }, 800)
    const nextPage = page + 1
    const newItems = currentFilteredItems.slice(0, nextPage * itemsPerPage)
    setDisplayedItems(newItems)
    setPage(nextPage)
    setIsLoading(false)
  }, [displayedItems.length, isLoading, page])

  // 使用 ref 存储 loadMoreItems 函数，避免在滚动监听器中创建依赖循环
  const loadMoreItemsRef = useRef(loadMoreItems)

  // 更新 loadMoreItemsRef 当 loadMoreItems 变化时
  useEffect(() => {
    loadMoreItemsRef.current = loadMoreItems
  }, [loadMoreItems])

  // 监听页面滚动
  useEffect(() => {
    const handlePageScroll = () => {
      // 检查是否滚动到页面底部
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMoreItemsRef.current()
      }
    }

    window.addEventListener("scroll", handlePageScroll)
    return () => window.removeEventListener("scroll", handlePageScroll)
  }, []) // 空依赖数组，只在组件挂载和卸载时运行

  // 当标签页切换时，清空选中项
  useEffect(() => {
    setSelectedItems([])
    setSelectedItem(null)
  }, [activeTab])

  // 当鼠标悬停在卡片上时，显示AI审核建议
  const handleItemHover = (item: any) => {
    // 如果有选中的项目，则不更新悬停项
    if (selectedItems.length <= 1) {
      // 检查是否有钉住的项目
      const pinnedItem = document.querySelector(".pin-button.pinned")
      if (!pinnedItem) {
        setSelectedItem(item)
      }
    }
  }

  // 切换选中状态 - 支持单个ID或多个ID
  const toggleItemSelection = (id: number | number[]) => {
    if (Array.isArray(id)) {
      // 如果传入的是数组，则切换多个项目的选中状态
      setSelectedItems((prev) => {
        // 找出需要移除的ID（已经在选中列表中的ID）
        const idsToRemove = id.filter((itemId) => prev.includes(itemId))

        if (idsToRemove.length > 0) {
          // 如果有需要移除的ID，则移除它们
          return prev.filter((itemId) => !idsToRemove.includes(itemId))
        } else {
          // 否则添加所有ID
          return [...prev, ...id.filter((itemId) => !prev.includes(itemId))]
        }
      })
    } else {
      // 单个ID的情况保持不变
      setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
    }
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    // 只使用当前显示的项目，而不是所有过滤后的项目
    const availableIds = displayedItems.map((item) => item.id)
    const validSelectedIds = selectedItems.filter((id) => availableIds.includes(id))

    if (validSelectedIds.length === availableIds.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(availableIds)
    }
  }

  // 检查是否全部选中
  const allSelected = selectedItems.length > 0 && displayedItems.every((item) => selectedItems.includes(item.id))

  // 清除选择
  const clearSelection = () => {
    setSelectedItems([])
  }

  // 批量通过处理
  const handleBatchApprove = (ids: number[], comments: Record<number, string>) => {
    console.log("批量通过", ids, comments)
    // 在实际应用中，这里会调用API来批量通过项目
    toast({
      title: "批量通过成功",
      description: `已成功通过 ${ids.length} 个项目`,
    })
  }

  // 批量退回处理
  const handleBatchReject = (ids: number[], comments: Record<number, string>) => {
    console.log("批量退回", ids, comments)
    // 在实际应用中，这里会调用API来批量退回项目
    toast({
      title: "批量退回成功",
      description: `已成功退回 ${ids.length} 个项目`,
    })
  }

  // 批量删除处理
  const handleBatchDelete = (ids: number[]) => {
    console.log("批量删除", ids)
    // 在实际应用中，这里会调用API来批量删除项目
  }

  // 添加事件监听器来处理全选/取消全选的自定义事件
  useEffect(() => {
    const handleUpdateSelectedItems = (event: any) => {
      setSelectedItems(event.detail)
    }

    window.addEventListener("updateSelectedItems", handleUpdateSelectedItems)

    return () => {
      window.removeEventListener("updateSelectedItems", handleUpdateSelectedItems)
    }
  }, [])

  // 计算待办和已办数量
  const pendingCount = extendedTodoItems.filter((item) => item.status === "待审核").length
  const completedCount = extendedCompletedItems.length

  // 当视图模式切换时，更新每页显示的项目数
  useEffect(() => {
    // 根据视图类型设置每页显示数量：列表视图5个，卡片视图6个
    const newItemsPerPage = viewMode === "list" ? 5 : 6;
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // 重置页码
    
    // 强制更新过滤后的项目以应用新的每页显示数量
    const newFilteredItems = getFilteredItems()
    filteredItemsRef.current = newFilteredItems
    setDisplayedItems(newFilteredItems.slice(0, newItemsPerPage))
    
    // 添加视图切换提示
    toast({
      title: viewMode === "list" ? "切换为列表视图" : "切换为卡片视图",
      description: viewMode === "list" ? "每页显示5个项目" : "每页显示6个项目",
      duration: 2000,
    })
  }, [viewMode, getFilteredItems])

  // 当筛选条件变化时，重置当前页
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, filterType, filterPriority, searchQuery, sortOption])

  return (
    <div className="space-y-4 pb-16" style={{ overflow: 'hidden' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">待办事项</h1>
          </div>
          <TodoStatusCards 
            pendingCount={pendingCount}
            completedCount={completedCount}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="ai-assistant" className="text-sm font-medium">
            AI辅助
          </Label>
          <Switch
            id="ai-assistant"
            checked={showAiAssistant}
            onCheckedChange={setShowAiAssistant}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex">
        {/* 左侧内容 */}
        <div className={`transition-all duration-500 ease-in-out ${showAiAssistant ? "w-[70%] pr-4" : "w-full"}`}>
          {/* 筛选和搜索工具栏 */}
          <TodoFilterBar
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            activeTab={activeTab}
            sortOption={sortOption}
            setSortOption={setSortOption}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
          />

          {/* 调整间距 */}
          <div className="mt-4">
            {/* 根据标签页显示待办或已办列表 */}
            {activeTab === "pending" ? (
              <TodoList
                items={filteredItemsRef.current}
                viewMode={viewMode}
                onItemHover={handleItemHover}
                selectedItems={selectedItems}
                onSelectItem={toggleItemSelection}
                onSelectAll={toggleSelectAll}
                allSelected={allSelected}
                showAiAssistant={showAiAssistant}
                isLoading={isLoading}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
              />
            ) : activeTab === "completed" ? (
              <CompletedTodoList
                items={filteredItemsRef.current}
                viewMode={viewMode}
                onItemHover={handleItemHover}
                selectedItems={selectedItems}
                onSelectItem={toggleItemSelection}
                onSelectAll={toggleSelectAll}
                allSelected={allSelected}
                showAiAssistant={showAiAssistant}
                isLoading={isLoading}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
              />
            ) : (
              // 如果是全部标签页，可以显示两个列表，或选择性显示其中一个
              // 这里选择显示待办事项列表作为默认视图
              <TodoList
                items={filteredItemsRef.current}
                viewMode={viewMode}
                onItemHover={handleItemHover}
                selectedItems={selectedItems}
                onSelectItem={toggleItemSelection}
                onSelectAll={toggleSelectAll}
                allSelected={allSelected}
                showAiAssistant={showAiAssistant}
                isLoading={isLoading}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>

          {/* 批量操作栏 */}
          <TodoBatchActions
            selectedItems={selectedItems}
            onClearSelection={clearSelection}
            activeTab={activeTab}
            onBatchApprove={handleBatchApprove}
            onBatchReject={handleBatchReject}
            onBatchDelete={handleBatchDelete}
          />
        </div>

        {/* 右侧AI审核助手 - 固定位置 */}
        {showAiAssistant && (
          <div className="w-[30%] sticky top-4 self-start">
            <AIAssistant
              selectedItem={selectedItem}
              activeTab={activeTab}
              selectedItems={selectedItems}
              pinnedItemId={pinnedItemId}
            />
          </div>
        )}
      </div>
    </div>
  )
}
