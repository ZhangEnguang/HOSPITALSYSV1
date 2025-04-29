import React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { EthicProjectsFilterState } from "../types"

// 定义过滤器选项类型
interface FilterOption {
  label: string
  value: string
}

// 自定义数据表格过滤器组件
export const DataTableFilter = ({
  title,
  options,
  value,
  onValueChange,
}: {
  title: string;
  options: FilterOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {title}
          {value?.length > 0 && (
            <span className="ml-1 rounded-full bg-primary text-primary-foreground w-4 h-4 text-xs flex items-center justify-center">
              {value.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={value?.includes(option.value)}
            onCheckedChange={(checked) => {
              if (checked) {
                onValueChange([...value, option.value])
              } else {
                onValueChange(value?.filter((v) => v !== option.value))
              }
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// 自定义数据表格视图选项组件
export const DataTableViewOptions = () => {
  return (
    <Button variant="outline" size="sm" className="h-8">
      视图
    </Button>
  )
}

// 项目类型选项
export const projectTypeOptions: FilterOption[] = [
  { label: "动物伦理", value: "动物伦理" },
  { label: "人体伦理", value: "人体伦理" },
]

// 项目状态选项
export const projectStatusOptions: FilterOption[] = [
  { label: "规划中", value: "规划中" },
  { label: "进行中", value: "进行中" },
  { label: "已完成", value: "已完成" },
  { label: "已暂停", value: "已暂停" },
]

// 审核状态选项
export const auditStatusOptions: FilterOption[] = [
  { label: "未提交", value: "未提交" },
  { label: "审核中", value: "审核中" },
  { label: "已通过", value: "已通过" },
  { label: "已拒绝", value: "已拒绝" },
]

// 来源选项
export const sourceOptions: FilterOption[] = [
  { label: "院内", value: "院内" },
  { label: "外部合作", value: "外部合作" },
]

// 伦理项目工具栏组件
export function EthicProjectsToolbar({
  filters,
  setFilters,
}: {
  filters: EthicProjectsFilterState
  setFilters: (filters: EthicProjectsFilterState) => void
}) {
  // 重置所有过滤器
  const resetFilters = () => {
    setFilters({
      search: "",
      type: [],
      status: [],
      auditStatus: [],
      source: [],
      progress: [],
      dateRange: {
        from: undefined,
        to: undefined,
      },
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
            {/* 使用普通的搜索图标替代 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <Input
            placeholder="搜索项目..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-8"
          />
          {filters.search && (
            <Button
              variant="ghost"
              onClick={() => setFilters({ ...filters, search: "" })}
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          )}
        </div>
        <DataTableFilter
          title="项目类型"
          options={projectTypeOptions}
          value={filters.type}
          onValueChange={(value: string[]) => setFilters({ ...filters, type: value })}
        />
        <DataTableFilter
          title="项目状态"
          options={projectStatusOptions}
          value={filters.status}
          onValueChange={(value: string[]) => setFilters({ ...filters, status: value })}
        />
        <DataTableFilter
          title="审核状态"
          options={auditStatusOptions}
          value={filters.auditStatus}
          onValueChange={(value: string[]) => setFilters({ ...filters, auditStatus: value })}
        />
        <DataTableFilter
          title="来源"
          options={sourceOptions}
          value={filters.source}
          onValueChange={(value: string[]) => setFilters({ ...filters, source: value })}
        />
        <DataTableViewOptions />
        <Button
          variant="outline"
          onClick={resetFilters}
          className="hidden h-8 lg:flex"
        >
          重置过滤器
        </Button>
      </div>
    </div>
  )
} 