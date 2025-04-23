"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export interface FilterField {
  id: string
  type: "select" | "date" | "multiselect" | "text" | "number"
  label: string
  options?: {
    id: string
    label: string
    value: string
    icon?: React.ReactNode
    avatar?: string
  }[]
}

interface DataListFiltersProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fields: FilterField[]
  values: Record<string, any>
  onValuesChange: (values: Record<string, any>) => void
  onReset: () => void
  onApply: () => void
}

export default function DataListFilters({
  open,
  onOpenChange,
  fields,
  values,
  onValuesChange,
  onReset,
  onApply,
}: DataListFiltersProps) {
  const [localValues, setLocalValues] = useState<Record<string, any>>(values)

  useEffect(() => {
    setLocalValues(values)
  }, [values, open])

  const handleValueChange = (fieldId: string, value: any) => {
    setLocalValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleApply = () => {
    onValuesChange(localValues)
    onApply()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>高级筛选</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 py-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label>{field.label}</Label>

              {field.type === "select" && field.options && (
                <Select
                  value={localValues[field.id] || "all"}
                  onValueChange={(value) => handleValueChange(field.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`选择${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部{field.label}</SelectItem>
                    {field.options.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.avatar ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={option.avatar} />
                              <AvatarFallback>{option.label[0]}</AvatarFallback>
                            </Avatar>
                            <span>{option.label}</span>
                          </div>
                        ) : (
                          <span>{option.label}</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "date" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localValues[field.id]?.from && localValues[field.id]?.to ? (
                        <>
                          {format(localValues[field.id].from, "yyyy-MM-dd")} -{" "}
                          {format(localValues[field.id].to, "yyyy-MM-dd")}
                        </>
                      ) : (
                        "选择日期范围"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="range"
                      selected={localValues[field.id]}
                      onSelect={(range) => handleValueChange(field.id, range)}
                      numberOfMonths={1}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}

              {field.type === "multiselect" && field.options && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      {!localValues[field.id] || localValues[field.id].includes("all")
                        ? `全部${field.label}`
                        : `已选择 ${localValues[field.id].length} 项`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[200px]">
                    <DropdownMenuCheckboxItem
                      checked={!localValues[field.id] || localValues[field.id].includes("all")}
                      onCheckedChange={(checked) => {
                        handleValueChange(field.id, checked ? ["all"] : [])
                      }}
                    >
                      全部{field.label}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    {field.options.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option.id}
                        checked={localValues[field.id]?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = localValues[field.id] || ["all"]
                          let newValues: string[]

                          if (currentValues.includes("all")) {
                            newValues = checked ? [option.value] : []
                          } else {
                            newValues = checked
                              ? [...currentValues, option.value]
                              : currentValues.filter((v: string) => v !== option.value)
                          }

                          if (newValues.length === 0) {
                            newValues = ["all"]
                          }

                          handleValueChange(field.id, newValues)
                        }}
                        className="gap-2"
                      >
                        {option.avatar ? (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={option.avatar} />
                              <AvatarFallback>{option.label[0]}</AvatarFallback>
                            </Avatar>
                            {option.label}
                          </>
                        ) : (
                          option.label
                        )}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {field.type === "text" && (
                <Input
                  value={localValues[field.id] || ""}
                  onChange={(e) => handleValueChange(field.id, e.target.value)}
                  placeholder={`输入${field.label}`}
                />
              )}

              {field.type === "number" && (
                <Input
                  type="number"
                  value={localValues[field.id] || ""}
                  onChange={(e) => handleValueChange(field.id, e.target.value ? Number(e.target.value) : "")}
                  placeholder={`输入${field.label}`}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onReset}>
            重置筛选
          </Button>
          <Button onClick={handleApply}>确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

