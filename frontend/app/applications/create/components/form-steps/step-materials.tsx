"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Upload } from "lucide-react"
import { FormData } from "../../page"
import { cn } from "@/lib/utils"

interface StepMaterialsProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: Record<string, string | undefined>
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveAttachment: (index: number) => void
  formatFileSize: (size: number) => string
  attachments: { name: string; size: number; type: string }[]
}

export function StepMaterials({
  formData,
  setFormData,
  errors,
  handleFileUpload,
  handleRemoveAttachment,
  formatFileSize,
  attachments
}: StepMaterialsProps) {
  // 添加材料
  const handleAddMaterial = () => {
    const newId = `material-${Date.now()}`
    setFormData({
      ...formData,
      materials: [
        ...formData.materials,
        { id: newId, name: "", description: "", required: false }
      ]
    })
  }

  // 移除材料
  const handleRemoveMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index)
    })
  }

  // 更新材料信息
  const handleMaterialChange = (index: number, field: string, value: string | boolean) => {
    const updatedMaterials = [...formData.materials]
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value
    }
    setFormData({ ...formData, materials: updatedMaterials })
  }

  return (
    <div className="space-y-6">
      <Card className="w-full border-0 shadow-none">
        <CardHeader>
          <CardTitle>附件上传</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-6 text-center border border-dashed border-muted-foreground/25">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground mb-3">将附件拖放到此处或点击上传</p>
            <div className="flex justify-center">
              <Label 
                htmlFor="file-upload" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 inline-block"
              >
                选择文件
              </Label>
              <Input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload} 
                multiple 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">最大文件大小: 10MB</p>
          </div>

          {attachments.length > 0 && (
            <div className="border rounded-md">
              <div className="bg-muted/50 px-4 py-2 text-sm font-medium border-b">
                已上传文件
              </div>
              <div className="divide-y">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between px-4 py-3">
                    <div className="flex-1 mr-4">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full border-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>材料清单</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={handleAddMaterial}>
            <Plus className="h-4 w-4 mr-1" />
            添加材料
          </Button>
        </CardHeader>
        <CardContent>
          {formData.materials.length > 0 ? (
            <div className="space-y-4">
              {formData.materials.map((material, index) => (
                <div 
                  key={material.id} 
                  className={cn(
                    "p-4 border rounded-md relative", 
                    errors.materials && "border-destructive"
                  )}
                >
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMaterial(index)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`material-name-${index}`} className="flex items-center">
                        材料名称 <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id={`material-name-${index}`}
                        value={material.name || ""}
                        onChange={(e) => handleMaterialChange(index, "name", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`material-desc-${index}`}>材料说明</Label>
                    <Textarea
                      id={`material-desc-${index}`}
                      placeholder="请提供材料说明或要求..."
                      value={material.description || ""}
                      onChange={(e) => handleMaterialChange(index, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              {errors.materials && <p className="text-sm text-destructive">{errors.materials}</p>}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>请添加申报材料</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
