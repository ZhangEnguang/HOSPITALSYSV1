"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus, Trash2 } from "lucide-react"
import { ApplicationFormData, FormMode, Requirement } from "../types"

interface StepRequirementsProps {
  formData: ApplicationFormData
  setFormData: (formData: ApplicationFormData) => void
  errors?: Record<string, boolean>
  mode?: FormMode
  disabledFields?: string[]
  hiddenFields?: string[]
}

export function StepRequirements({
  formData,
  setFormData,
  errors = {},
  mode = FormMode.CREATE,
  disabledFields = [],
  hiddenFields = [],
}: StepRequirementsProps) {
  const isDisabled = mode === FormMode.VIEW
  const [tempRequirement, setTempRequirement] = useState<Requirement>({
    id: "",
    content: "",
  })

  const isFieldDisabled = (fieldName: string) => {
    return isDisabled || disabledFields.includes(fieldName)
  }

  const isFieldHidden = (fieldName: string) => {
    return hiddenFields.includes(fieldName)
  }

  // 处理要求更新
  const updateRequirement = (id: string, content: string) => {
    if (isDisabled) return
    const updatedRequirements = formData.requirements.map((requirement) =>
      requirement.id === id ? { ...requirement, content } : requirement
    )
    setFormData({ ...formData, requirements: updatedRequirements })
  }

  // 添加新要求
  const addRequirement = () => {
    if (isDisabled || !tempRequirement.content.trim()) return
    
    const newRequirement: Requirement = {
      ...tempRequirement,
      id: `requirement-${Date.now()}`,
    }
    
    setFormData({
      ...formData,
      requirements: [...formData.requirements, newRequirement],
    })
    
    // 重置临时数据
    setTempRequirement({ id: "", content: "" })
  }

  // 删除要求
  const removeRequirement = (id: string) => {
    if (isDisabled) return
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((requirement) => requirement.id !== id),
    })
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="space-y-6 p-0">
        {/* 特殊要求列表 */}
        {!isFieldHidden('requirements') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">特殊要求</h3>
              {errors.requirements && (
                <p className="text-sm text-destructive">请添加至少一项特殊要求</p>
              )}
            </div>

            {/* 要求列表 */}
            <div className="space-y-3">
              {formData.requirements.length > 0 ? (
                formData.requirements.map((requirement) => (
                  <div
                    key={requirement.id}
                    className="flex space-x-3 items-start border rounded-md p-3"
                  >
                    <div className="flex-grow space-y-2">
                      <div className="flex space-x-2">
                        <div className="flex-grow">
                          <Input
                            value={requirement.content}
                            onChange={(e) =>
                              updateRequirement(requirement.id, e.target.value)
                            }
                            placeholder="要求内容"
                            disabled={isFieldDisabled('requirements')}
                            className={cn(
                              "font-medium",
                              !requirement.content.trim() && "border-destructive"
                            )}
                          />
                        </div>
                        {!isDisabled && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRequirement(requirement.id)}
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
                  暂无特殊要求
                </div>
              )}
            </div>

            {/* 添加要求表单 */}
            {!isDisabled && (
              <div className="border rounded-md p-4 mt-4">
                <h4 className="text-sm font-medium mb-3">添加新要求</h4>
                <div className="space-y-3">
                  <div>
                    <Input
                      value={tempRequirement.content}
                      onChange={(e) =>
                        setTempRequirement({ ...tempRequirement, content: e.target.value })
                      }
                      placeholder="要求内容 (必填)"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addRequirement}
                    disabled={!tempRequirement.content.trim()}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> 添加要求
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 申报备注 */}
        {!isFieldHidden('notes') && (
          <div className="space-y-2 mt-6">
            <Label htmlFor="notes" className="flex items-center">
              申报备注
              {errors.notes && <span className="text-destructive ml-1">*</span>}
            </Label>
            <textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => !isDisabled && setFormData({ ...formData, notes: e.target.value })}
              disabled={isFieldDisabled('notes')}
              className={cn(
                "min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.notes ? "border-destructive" : ""
              )}
              placeholder="添加任何其他相关说明或要求..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
