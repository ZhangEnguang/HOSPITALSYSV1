"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { FormData } from "../../page"
import { cn } from "@/lib/utils"

interface StepRequirementsProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: Record<string, string | undefined>
}

export function StepRequirements({ formData, setFormData, errors }: StepRequirementsProps) {
  // 添加特殊要求
  const handleAddRequirement = () => {
    const newId = `req-${Date.now()}`
    setFormData({
      ...formData,
      requirements: [...formData.requirements, { id: newId, content: "" }]
    })
  }

  // 移除特殊要求
  const handleRemoveRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    })
  }

  // 更新特殊要求内容
  const handleRequirementChange = (index: number, content: string) => {
    const updatedRequirements = [...formData.requirements]
    updatedRequirements[index] = {
      ...updatedRequirements[index],
      content
    }
    setFormData({ ...formData, requirements: updatedRequirements })
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>特殊要求</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={handleAddRequirement}>
          <Plus className="h-4 w-4 mr-1" />
          添加要求
        </Button>
      </CardHeader>
      <CardContent>
        {formData.requirements.length > 0 ? (
          <div className="space-y-4">
            {formData.requirements.map((req, index) => (
              <div 
                key={req.id} 
                className={cn(
                  "p-4 border rounded-md relative", 
                  errors.requirements && "border-destructive"
                )}
              >
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`req-${index}`} className="flex items-center">
                    要求内容 <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Textarea
                    id={`req-${index}`}
                    value={req.content || ""}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    placeholder="请输入特殊要求内容..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            ))}
            {errors.requirements && <p className="text-sm text-destructive">{errors.requirements}</p>}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>请添加特殊要求</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
