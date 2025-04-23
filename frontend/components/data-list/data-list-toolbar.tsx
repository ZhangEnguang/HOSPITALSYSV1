"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Settings, Upload, Download, Plus } from "lucide-react"

interface DataListToolbarProps {
  title: string
  searchable: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleSearch: () => void
  isFiltered: boolean
  showFilterPanel: boolean
  setShowFilterPanel: (show: boolean) => void
  viewMode: "table" | "card"
  setViewMode: (mode: "table" | "card") => void
  showColumnSettings: boolean
  setShowColumnSettings: (show: boolean) => void
  onImport?: () => void
  onExport?: () => void
  onAdd?: () => void
}

export default function DataListToolbar({
  title,
  searchable,
  searchQuery,
  setSearchQuery,
  handleSearch,
  isFiltered,
  showFilterPanel,
  setShowFilterPanel,
  viewMode,
  setViewMode,
  showColumnSettings,
  setShowColumnSettings,
  onImport,
  onExport,
  onAdd,
}: DataListToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        {searchable && (
          <div className="relative">
            <Input
              type="search"
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-[200px] md:w-[240px]"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={handleSearch}
            >
              搜索
            </Button>
          </div>
        )}

        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            添加
          </Button>
        )}

        {onImport && (
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            导入
          </Button>
        )}

        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        )}

        {/* 更多操作 */}
        <Button variant="outline" size="icon" onClick={() => setShowFilterPanel(!showFilterPanel)}>
          筛选
        </Button>

        <Button variant="outline" size="icon" onClick={() => setShowColumnSettings(!showColumnSettings)}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

