"use client"

import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ApplicationFormData, FormMode, KeyDate } from "../types"
import { useState } from "react"

interface StepDatesProps {
  formData: ApplicationFormData
  setFormData: (formData: ApplicationFormData) => void
  errors?: Record<string, boolean>
  mode?: FormMode
  disabledFields?: string[]
  hiddenFields?: string[]
}

export function StepDates({
  formData,
  setFormData,
  errors = {},
  mode = FormMode.CREATE,
  disabledFields = [],
  hiddenFields = [],
}: StepDatesProps) {
  const isDisabled = mode === FormMode.VIEW
  const [tempDate, setTempDate] = useState<KeyDate>({
    id: "",
    name: "",
    date: new Date(),
  })

  const isFieldDisabled = (fieldName: string) => {
    return isDisabled || disabledFields.includes(fieldName)
  }

  const isFieldHidden = (fieldName: string) => {
    return hiddenFields.includes(fieldName)
  }

  // 处理时间节点更新
  const updateKeyDate = (id: string, field: keyof KeyDate, value: string | Date) => {
    if (isDisabled) return
    const updatedDates = formData.keyDates.map((date) =>
      date.id === id ? { ...date, [field]: value } : date
    )
    setFormData({ ...formData, keyDates: updatedDates })
  }

  // 添加新时间节点
  const addKeyDate = () => {
    if (isDisabled || !tempDate.name.trim() || !tempDate.date) return
    
    const newDate: KeyDate = {
      ...tempDate,
      id: `date-${Date.now()}`,
    }
    
    setFormData({
      ...formData,
      keyDates: [...formData.keyDates, newDate],
    })
    
    // 重置临时数据
    setTempDate({ id: "", name: "", date: new Date() })
  }

  // 删除时间节点
  const removeKeyDate = (id: string) => {
    if (isDisabled) return
    setFormData({
      ...formData,
      keyDates: formData.keyDates.filter((date) => date.id !== id),
    })
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="space-y-6 p-0">
        {/* 关键时间节点列表 */}
        {!isFieldHidden('keyDates') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">关键时间节点</h3>
              {errors.keyDates && (
                <p className="text-sm text-destructive">请添加至少一个关键时间节点</p>
              )}
            </div>

            {/* 时间节点列表 */}
            <div className="space-y-3">
              {formData.keyDates.length > 0 ? (
                formData.keyDates.map((keyDate) => (
                  <div
                    key={keyDate.id}
                    className="flex space-x-3 items-start border rounded-md p-3"
                  >
                    <div className="flex-grow space-y-2">
                      <div className="flex space-x-2">
                        <div className="flex-grow">
                          <Input
                            value={keyDate.name}
                            onChange={(e) =>
                              updateKeyDate(keyDate.id, "name", e.target.value)
                            }
                            placeholder="节点名称"
                            disabled={isFieldDisabled('keyDates')}
                            className={cn(
                              "font-medium",
                              !keyDate.name.trim() && "border-destructive"
                            )}
                          />
                        </div>
                        <div className="w-40">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                disabled={isFieldDisabled('keyDates')}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !keyDate.date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {keyDate.date instanceof Date
                                  ? format(keyDate.date, "yyyy-MM-dd")
                                  : "选择日期"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={keyDate.date instanceof Date ? keyDate.date : undefined}
                                onSelect={(date) => date && updateKeyDate(keyDate.id, "date", date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        {!isDisabled && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeKeyDate(keyDate.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground border border-dashed rounded-md">
                  暂无关键时间节点
                </div>
              )}
            </div>

            {/* 添加时间节点表单 */}
            {!isDisabled && (
              <div className="border rounded-md p-4 mt-4">
                <h4 className="text-sm font-medium mb-3">添加新时间节点</h4>
                <div className="space-y-3">
                  <div>
                    <Input
                      value={tempDate.name}
                      onChange={(e) =>
                        setTempDate({ ...tempDate, name: e.target.value })
                      }
                      placeholder="节点名称 (必填)"
                    />
                  </div>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {tempDate.date
                            ? format(tempDate.date, "yyyy-MM-dd")
                            : "选择日期"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={tempDate.date}
                          onSelect={(date) =>
                            date && setTempDate({ ...tempDate, date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button
                    type="button"
                    onClick={addKeyDate}
                    disabled={!tempDate.name.trim()}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> 添加时间节点
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
