"use client"

import { useState } from "react"
import { Paperclip, X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ApplicationFormData, FormMode, Material, Attachment } from "../types"

interface StepMaterialsProps {
  formData: ApplicationFormData
  setFormData: (formData: ApplicationFormData) => void
  errors?: Record<string, boolean>
  mode?: FormMode
  disabledFields?: string[]
  hiddenFields?: string[]
  // u6587u4ef6u76f8u5173u5c5eu6027
  handleFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveAttachment?: (id: string) => void
  formatFileSize?: (bytes: number) => string
  attachments?: Attachment[]
}

export function StepMaterials({
  formData,
  setFormData,
  errors = {},
  mode = FormMode.CREATE,
  disabledFields = [],
  hiddenFields = [],
  handleFileUpload,
  handleRemoveAttachment,
  formatFileSize = (bytes) => `${Math.round(bytes / 1024)} KB`,
  attachments = [],
}: StepMaterialsProps) {
  const isDisabled = mode === FormMode.VIEW
  const [tempMaterial, setTempMaterial] = useState<Material>({
    id: "",
    name: "",
    description: "",
  })

  const isFieldDisabled = (fieldName: string) => {
    return isDisabled || disabledFields.includes(fieldName)
  }

  const isFieldHidden = (fieldName: string) => {
    return hiddenFields.includes(fieldName)
  }

  // u5904u7406u7533u62a5u6750u6599u66f4u65b0
  const updateMaterial = (id: string, field: keyof Material, value: string) => {
    if (isDisabled) return
    const updatedMaterials = formData.materials.map((material) =>
      material.id === id ? { ...material, [field]: value } : material
    )
    setFormData({ ...formData, materials: updatedMaterials })
  }

  // u6dfbu52a0u65b0u7533u62a5u6750u6599
  const addMaterial = () => {
    if (isDisabled || !tempMaterial.name.trim()) return
    
    const newMaterial: Material = {
      ...tempMaterial,
      id: `material-${Date.now()}`,
    }
    
    setFormData({
      ...formData,
      materials: [...formData.materials, newMaterial],
    })
    
    // u91cdu7f6eu4e34u65f6u6570u636e
    setTempMaterial({ id: "", name: "", description: "" })
  }

  // u5220u9664u7533u62a5u6750u6599
  const removeMaterial = (id: string) => {
    if (isDisabled) return
    setFormData({
      ...formData,
      materials: formData.materials.filter((material) => material.id !== id),
    })
  }

  // u6587u4ef6u4e0au4f20u76f8u5173
  const fileInputRef = useState<HTMLInputElement | null>(null)[1]

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="space-y-6 p-0">
        {/* u7533u62a5u6750u6599u5217u8868 */}
        {!isFieldHidden('materials') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">u7533u62a5u6750u6599u6e05u5355</h3>
              {errors.materials && (
                <p className="text-sm text-destructive">u8bf7u6dfbu52a0u81f3u5c11u4e00u9879u7533u62a5u6750u6599</p>
              )}
            </div>

            {/* u6750u6599u5217u8868 */}
            <div className="space-y-3">
              {formData.materials.length > 0 ? (
                formData.materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex space-x-3 items-start border rounded-md p-3"
                  >
                    <div className="flex-grow space-y-2">
                      <div className="flex space-x-2">
                        <div className="flex-grow">
                          <Input
                            value={material.name}
                            onChange={(e) =>
                              updateMaterial(material.id, "name", e.target.value)
                            }
                            placeholder="u6750u6599u540du79f0"
                            disabled={isFieldDisabled('materials')}
                            className={cn(
                              "font-medium",
                              !material.name.trim() && "border-destructive"
                            )}
                          />
                        </div>
                        {!isDisabled && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMaterial(material.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        value={material.description}
                        onChange={(e) =>
                          updateMaterial(material.id, "description", e.target.value)
                        }
                        placeholder="u6750u6599u8bf4u660eu6216u8981u6c42"
                        disabled={isFieldDisabled('materials')}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground border border-dashed rounded-md">
                  u6682u65e0u7533u62a5u6750u6599u8981u6c42
                </div>
              )}
            </div>

            {/* u6dfbu52a0u6750u6599u8868u5355 */}
            {!isDisabled && (
              <div className="border rounded-md p-4 mt-4">
                <h4 className="text-sm font-medium mb-3">u6dfbu52a0u65b0u6750u6599</h4>
                <div className="space-y-3">
                  <div>
                    <Input
                      value={tempMaterial.name}
                      onChange={(e) =>
                        setTempMaterial({ ...tempMaterial, name: e.target.value })
                      }
                      placeholder="u6750u6599u540du79f0 (u5fc5u586b)"
                    />
                  </div>
                  <div>
                    <Textarea
                      value={tempMaterial.description}
                      onChange={(e) =>
                        setTempMaterial({ ...tempMaterial, description: e.target.value })
                      }
                      placeholder="u6750u6599u8bf4u660eu6216u8981u6c42 (u9009u586b)"
                      className="min-h-[80px]"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addMaterial}
                    disabled={!tempMaterial.name.trim()}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> u6dfbu52a0u6750u6599
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* u9644u4ef6u4e0au4f20u529fu80fd */}
        {!isFieldHidden('attachments') && handleFileUpload && handleRemoveAttachment && (
          <div className="space-y-4 mt-8">
            <h3 className="text-lg font-medium">u9644u4ef6u4e0au4f20</h3>

            {/* u9644u4ef6u5217u8868 */}
            <div className="space-y-3">
              {attachments.length > 0 ? (
                <div className="border rounded-md p-4">
                  <ul className="space-y-2">
                    {attachments.map((attachment) => (
                      <li key={attachment.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{attachment.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatFileSize(attachment.size)}
                          </span>
                        </div>
                        {!isDisabled && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAttachment(attachment.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground border border-dashed rounded-md">
                  u6682u65e0u9644u4ef6
                </div>
              )}
            </div>

            {/* u4e0au4f20u6309u94ae */}
            {!isDisabled && (
              <div>
                <Label htmlFor="file-upload" className="block mb-2">
                  u5141u8bb8u683cu5f0f: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar (u6700u591a10u4e2au6587u4ef6uff0cu6bcfu4e2au6587u4ef6u6700u592710MB)
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef?.click()}
                  disabled={attachments.length >= 10}
                  className="w-full"
                >
                  <Paperclip className="h-4 w-4 mr-2" /> u9009u62e9u6587u4ef6u4e0au4f20
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
