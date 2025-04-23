"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface ColumnSettingsProps {
  columns: {
    id: string
    label: string
    visible: boolean
  }[]
  onColumnChange: (id: string, visible: boolean) => void
}

export default function ColumnSettings({ columns, onColumnChange }: ColumnSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
          <span className="sr-only">列设置</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[240px]">
        <div className="space-y-4">
          <div className="font-medium">显示列</div>
          <Separator />
          <div className="space-y-2">
            {columns.map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`column-${column.id}`}
                  checked={column.visible}
                  onCheckedChange={(checked) => onColumnChange(column.id, !!checked)}
                />
                <Label htmlFor={`column-${column.id}`} className="flex-1 cursor-pointer">
                  {column.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

