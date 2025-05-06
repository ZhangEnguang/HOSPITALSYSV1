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
        {/* 所有功能按钮已被移除 */}
      </div>
    </div>
  )
}

