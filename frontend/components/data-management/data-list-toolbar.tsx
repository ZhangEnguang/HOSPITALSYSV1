"use client"

import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dict } from "@/components/dict";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, LayoutGrid, LayoutList, Search, ArrowUpDown, Settings2 } from "lucide-react"

export interface FilterOption {
  id: string
  label: string
  value: string
}

export interface SortOption {
  id: string
  label: string
  field: string
  direction: "asc" | "desc"
  description?: string
}

export interface ColumnVisibility {
  id: string
  header: string
}

interface DataListToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  searchPlaceholder?: string
  quickFilters?: {
    id: string
    label: string
    value: string
    options: FilterOption[]
    category: string
  }[]
  onQuickFilterChange?: (filterId: string, value: string) => void
  quickFilterValues?: Record<string, string>
  onAdvancedFilter?: () => void
  sortOptions?: SortOption[]
  activeSortOption?: string
  onSortChange?: (sortId: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  className?: string
  // 列设置相关
  columns?: ColumnVisibility[]
  visibleColumns?: Record<string, boolean>
  onVisibleColumnsChange?: (columns: Record<string, boolean>) => void
}

export default function DataListToolbar({
  searchValue,
  onSearchChange,
  onSearch,
  searchPlaceholder,
  quickFilters,
  onQuickFilterChange,
  quickFilterValues = {},
  onAdvancedFilter,
  sortOptions,
  activeSortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  className,
  // 列设置相关
  columns = [],
  visibleColumns = {},
  onVisibleColumnsChange,
}: DataListToolbarProps) {

  // Define the custom handler using useCallback
  const handleDictChange = useCallback((updateFunc: (prevState: Record<string, string>) => Record<string, string>) => {
    
    const dummyPrevState = {};
    const newState = updateFunc(dummyPrevState);
    let changedField: string | null = null;
    let changedValue: any = undefined;

    // Find the changed key/value
    for (const key in newState) {
      if (newState.hasOwnProperty(key) && !(key in dummyPrevState)) {
        changedField = key;
        changedValue = newState[key];
        break; // Assume only one change per interaction
      }
    }

    if (changedField && onQuickFilterChange) {
      console.log(`Toolbar (setFormData): Filter ${changedField} changed to:`, changedValue); // Debug log
      onQuickFilterChange(changedField, changedValue);
    }

  }, [onQuickFilterChange]); // Dependency on the callback prop

  return (
    <Card className={`border border-[#E9ECF2] shadow-none ${className}`}>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder || "搜索..."}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                className="pl-8"
              />
            </div>

            {quickFilters &&
              quickFilters.map((filter) => {
                try {
                  // Check if category exists and is not an empty string
                  const useDict = filter.category && filter.category.trim() !== '' && filter.category !== 'default';
                  // Check if options exist and likely have items (truthy check is often enough for arrays)
                  const useSelect = !useDict && filter.options && filter.options.length > 0; 
                  if (useDict) {
                    // Render Dict component if category is present
                    return (
                      <Dict
                        key={filter.id}
                        dictCode={filter.category}
                        displayType="select"
                        value={quickFilterValues[filter.id]} // Use id for value lookup
                        setFormData={handleDictChange}       // Use custom handler
                        field={filter.id}                // Use id for field identification
                        className="w-[120px]"
                        placeholder={filter.label}
                      />
                    );
                  } else if (useSelect) {
                    // Render Select component if options are present and category is not
                    return (
                      <Select
                        key={filter.id}
                        value={quickFilterValues[filter.id] || "all"} // Use id for value lookup
                        // Directly call onQuickFilterChange for Select
                        onValueChange={(value) => onQuickFilterChange?.(filter.id, value === 'all' ? '' : value)} 
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder={filter.label} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部{filter.label}</SelectItem>
                          {filter.options && filter.options.map((option) => (
                            <SelectItem key={option.id || option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  } else {
                    // Optionally render nothing or a placeholder if neither condition met
                    return null; 
                  }
                } catch (error) {
                  console.error('Error rendering filter:', filter, error);
                  return null;
                }
              })}

            {onAdvancedFilter && (
              <Button variant="outline" className="gap-2" onClick={onAdvancedFilter}>
                <Filter className="h-4 w-4" />
                高级筛选
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* 列设置按钮 */}
            {columns.length > 0 && onVisibleColumnsChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Settings2 className="h-4 w-4" />
                    列设置
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>显示/隐藏列</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={visibleColumns[column.id] !== false}
                      onCheckedChange={(checked) => {
                        onVisibleColumnsChange({
                          ...visibleColumns,
                          [column.id]: checked,
                        });
                      }}
                    >
                      {column.header}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {sortOptions && sortOptions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    排序
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px]">
                  <DropdownMenuLabel>排序方式</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {sortOptions.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.id}
                      checked={activeSortOption === option.id}
                      onCheckedChange={() => onSortChange?.(option.id)}
                      className="flex flex-col items-start py-2"
                    >
                      <span>{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground mt-1">
                          {option.description}
                        </span>
                      )}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="flex items-center rounded-md border">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => onViewModeChange("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => onViewModeChange("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

