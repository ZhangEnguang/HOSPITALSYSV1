import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import DataListFilters from "@/components/data-management/data-list-filters"
import { quickFilters, advancedFilters } from "../config/applications-config"

interface FiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  filterValues: Record<string, any>
  setFilterValues: (values: Record<string, any>) => void
  sortOption: string
  setSortOption: (value: string) => void
  viewMode: "grid" | "list"
  setViewMode: (value: "grid" | "list") => void
}

export const Filters = ({
  searchTerm,
  setSearchTerm,
  filterValues,
  setFilterValues,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode
}: FiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  return (
    <>
      <Card className="border shadow-sm">
        <CardContent className="p-3 flex flex-wrap items-center gap-2">
          {/* 搜索框 */}
          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          {/* 快速筛选下拉菜单 */}
          {quickFilters.map((filterGroup) => (
            <Select
              key={filterGroup.id}
              value={filterValues[filterGroup.id] || "all"}
              onValueChange={(value) => {
                setFilterValues({
                  ...filterValues,
                  [filterGroup.id]: value,
                })
              }}
            >
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder={`全部${filterGroup.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部{filterGroup.label}</SelectItem>
                {filterGroup.options.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {/* 高级筛选按钮 */}
          <Button variant="outline" size="sm" className="h-10" onClick={() => setShowAdvancedFilters(true)}>
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            高级筛选
          </Button>

          {/* 排序和视图切换 */}
          <div className="ml-auto flex items-center">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[100px] h-10">
                <SelectValue placeholder="排序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">名称升序</SelectItem>
                <SelectItem value="name_desc">名称降序</SelectItem>
                <SelectItem value="date_asc">日期升序</SelectItem>
                <SelectItem value="date_desc">日期降序</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md ml-2">
              <Button
                variant="outline"
                size="icon"
                className={`h-10 w-10 rounded-none ${viewMode === "grid" ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-transparent"}`}
                onClick={() => setViewMode("grid")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-10 w-10 rounded-none ${viewMode === "list" ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-transparent"}`}
                onClick={() => setViewMode("list")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 高级筛选面板 */}
      {showAdvancedFilters && (
        <DataListFilters
          open={showAdvancedFilters}
          onOpenChange={setShowAdvancedFilters}
          fields={advancedFilters}
          values={filterValues}
          onValuesChange={setFilterValues}
          onReset={() => setFilterValues({})}
          onApply={() => setShowAdvancedFilters(false)}
        />
      )}
    </>
  )
} 