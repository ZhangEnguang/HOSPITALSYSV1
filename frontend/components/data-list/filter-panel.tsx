"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { type FilterModel, FieldType } from "./types"

interface FilterPanelProps {
  fields: FilterModel[]
  initialValues: { [key: string]: any }
  onApply: (filters: { [key: string]: any }) => void
  onCancel: () => void
}

export default function FilterPanel({ fields, initialValues = {}, onApply, onCancel }: FilterPanelProps) {
  const [filters, setFilters] = useState<{ [key: string]: any }>(initialValues)

  useEffect(() => {
    setFilters(initialValues)
  }, [initialValues])

  const handleFilterChange = (fieldName: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleRemoveFilter = (fieldName: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[fieldName]
      return newFilters
    })
  }

  const renderFilterField = (field: FilterModel) => {
    const currentValue = filters[field.name]

    switch (field.type) {
      case FieldType.TEXT:
        return (
          <Input
            id={field.name}
            value={currentValue || ""}
            onChange={(e) => handleFilterChange(field.name, e.target.value)}
            placeholder={`输入${field.label}`}
            className="w-full"
          />
        )

      case FieldType.NUMBER:
        return (
          <Input
            id={field.name}
            type="number"
            value={currentValue || ""}
            onChange={(e) => handleFilterChange(field.name, e.target.value ? Number(e.target.value) : null)}
            placeholder={`输入${field.label}`}
            className="w-full"
          />
        )

      case FieldType.SELECT:
        return (
          <Select
            value={currentValue?.toString() || ""}
            onValueChange={(value) => handleFilterChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`选择${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case FieldType.DATE:
        return (
          <DatePicker
            date={currentValue ? new Date(currentValue) : undefined}
            setDate={(date) => handleFilterChange(field.name, date)}
            className="w-full"
          />
        )

      case FieldType.BOOLEAN:
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={!!currentValue}
              onCheckedChange={(checked) => handleFilterChange(field.name, checked)}
            />
            <Label htmlFor={field.name} className="text-sm font-normal cursor-pointer">
              {field.label}
            </Label>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
            </Label>

            {filters[field.name] !== undefined && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFilter(field.name)}
                className="h-6 px-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>

          {renderFilterField(field)}
          {field !== fields[fields.length - 1] && <Separator className="my-3" />}
        </div>
      ))}
    </div>
  )
}

