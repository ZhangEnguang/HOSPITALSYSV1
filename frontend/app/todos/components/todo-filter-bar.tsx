"use client"

import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  ArrowUpDown,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// 在 TodoFilterBarProps 接口中添加排序相关属性
interface TodoFilterBarProps {
  viewMode: "card" | "list"
  setViewMode: (mode: "card" | "list") => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterType: string[]
  setFilterType: (types: string[]) => void
  filterPriority: string
  setFilterPriority: (priority: string) => void
  activeTab: string
  sortOption: string
  setSortOption: (option: string) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  setItemsPerPage: (count: number) => void
}

// 在组件参数中添加排序相关属性
export default function TodoFilterBar({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterPriority,
  setFilterPriority,
  activeTab,
  sortOption,
  setSortOption,
  currentPage,
  setCurrentPage,
  setItemsPerPage,
}: TodoFilterBarProps) {
  // 添加排序选项
  const sortOptions = [
    { value: "default", label: "默认排序" },
    { value: "priority-desc", label: "优先级 (高到低)" },
    { value: "priority-asc", label: "优先级 (低到高)" },
    { value: "date-desc", label: "提交日期 (最新)" },
    { value: "date-asc", label: "提交日期 (最早)" },
    { value: "deadline-asc", label: "截止日期 (最近)" },
    { value: "deadline-desc", label: "截止日期 (最远)" },
  ]

  // 获取当前排序选项的标签
  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortOption)
    return option ? option.label : "默认排序"
  }

  // 类型选项
  const typeOptions = ["报销申请", "休假申请", "采购申请", "出差申请", "其他"]

  // 优先级选项
  const priorityOptions = [
    { value: "all", label: "全部" },
    { value: "紧急", label: "紧急" },
    { value: "一般", label: "一般" },
    { value: "普通", label: "普通" },
  ]

  // 切换类型筛选
  const toggleTypeFilter = (type: string) => {
    if (filterType.includes(type)) {
      setFilterType(filterType.filter((t) => t !== type))
    } else {
      setFilterType([...filterType, type])
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索待办事项..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* 添加排序下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {getCurrentSortLabel()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>排序方式</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className={sortOption === option.value ? "bg-muted" : ""}
                  onClick={() => setSortOption(option.value)}
                >
                  {option.label}
                  {sortOption === option.value && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 类型筛选 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                筛选
                {filterType.length > 0 && (
                  <Badge className="ml-2 bg-primary" variant="secondary">
                    {filterType.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
              <DropdownMenuLabel>类型</DropdownMenuLabel>
              <div className="p-2">
                {typeOptions.map((type) => (
                  <div key={type} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filterType.includes(type)}
                      onCheckedChange={() => toggleTypeFilter(type)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>优先级</DropdownMenuLabel>
              <div className="p-2">
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={filterPriority === option.value ? "default" : "outline"}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setFilterPriority(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 视图切换 */}
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => {
              if (value) {
                // 根据视图类型设置每页显示数量
                const itemsCount = value === "list" ? 5 : 6;
                setItemsPerPage(itemsCount);
                setViewMode(value as "card" | "list");
                setCurrentPage(1); // 切换视图时重置页码
                
                // 添加延时以确保切换后页面有时间调整布局
                setTimeout(() => {
                  // 强制重新计算滚动区域
                  window.dispatchEvent(new Event('resize'));
                  // 确保滚动条在正确的范围内
                  const contentContainer = document.querySelector('.flex-1.overflow-auto');
                  if (contentContainer) {
                    contentContainer.scrollTop = 0;
                  }
                }, 10);
              }
            }}
            className="h-9"
          >
            <ToggleGroupItem value="card" aria-label="卡片视图" className="h-9 px-3">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="列表视图" className="h-9 px-3">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}
