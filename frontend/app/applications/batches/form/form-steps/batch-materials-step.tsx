"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FilePlus, FileText, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface Material {
  id: string
  名称: string
  必填: boolean
  说明: string
}

interface BatchMaterialsStepProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, string>
}

export function BatchMaterialsStep({
  formData,
  handleInputChange,
  validationErrors,
}: BatchMaterialsStepProps) {
  // 初始化申报材料数组
  const [materials, setMaterials] = useState<Material[]>(
    formData.申报材料 && formData.申报材料.length > 0
      ? formData.申报材料
      : [
          {
            id: "1",
            名称: "申报书",
            必填: true,
            说明: "请下载模板填写，并转成PDF格式上传",
          },
        ]
  )

  // 添加新材料
  const addMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      名称: "",
      必填: false,
      说明: "",
    }
    const updatedMaterials = [...materials, newMaterial]
    setMaterials(updatedMaterials)
    handleInputChange("申报材料", updatedMaterials)
  }

  // 删除材料
  const removeMaterial = (id: string) => {
    const updatedMaterials = materials.filter((material) => material.id !== id)
    setMaterials(updatedMaterials)
    handleInputChange("申报材料", updatedMaterials)
  }

  // 更新材料
  const updateMaterial = (id: string, field: keyof Material, value: any) => {
    const updatedMaterials = materials.map((material) => {
      if (material.id === id) {
        return { ...material, [field]: value }
      }
      return material
    })
    setMaterials(updatedMaterials)
    handleInputChange("申报材料", updatedMaterials)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">申报材料</h3>
      </div>

      <div className="space-y-4 bg-white p-4 rounded-md">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">设置申报人需要提交的材料</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={addMaterial}
          >
            <FilePlus className="h-4 w-4" />
            <span>添加材料</span>
          </Button>
        </div>

        {materials.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
            <FileText className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">暂无申报材料</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={addMaterial}
            >
              添加第一个材料
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((material, index) => (
              <Card key={material.id} className="border border-muted">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <div className="flex-1 font-medium">材料 {index + 1}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => removeMaterial(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 材料名称 */}
                    <div className="space-y-2">
                      <Label htmlFor={`material-name-${material.id}`} className="flex items-center">
                        材料名称
                        <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id={`material-name-${material.id}`}
                        placeholder="请输入材料名称"
                        value={material.名称}
                        onChange={(e) => updateMaterial(material.id, "名称", e.target.value)}
                      />
                    </div>

                    {/* 是否必填 */}
                    <div className="space-y-2 flex items-center">
                      <div className="flex items-center space-x-2 h-10 mt-7">
                        <Checkbox
                          id={`material-required-${material.id}`}
                          checked={material.必填}
                          onCheckedChange={(checked) => updateMaterial(material.id, "必填", checked)}
                        />
                        <Label
                          htmlFor={`material-required-${material.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          必填材料
                        </Label>
                      </div>
                    </div>

                    {/* 材料说明 - 跨越两列 */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`material-description-${material.id}`}>材料说明</Label>
                      <Textarea
                        id={`material-description-${material.id}`}
                        placeholder="请输入材料说明"
                        value={material.说明}
                        onChange={(e) => updateMaterial(material.id, "说明", e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
