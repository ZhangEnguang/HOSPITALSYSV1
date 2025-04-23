"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepMembersProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepMembers({ formData, handleInputChange, validationErrors }: StepMembersProps) {
  // 添加团队成员
  const addTeamMember = () => {
    const updatedMembers = [...formData.团队成员, ""]
    handleInputChange("团队成员", updatedMembers)
  }

  // 移除团队成员
  const removeTeamMember = (index: number) => {
    const updatedMembers = formData.团队成员.filter((_: any, i: number) => i !== index)
    handleInputChange("团队成员", updatedMembers)
  }

  // 更新团队成员
  const updateTeamMember = (index: number, value: string) => {
    const updatedMembers = [...formData.团队成员]
    updatedMembers[index] = value
    handleInputChange("团队成员", updatedMembers)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center">
            团队成员
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addTeamMember} className="flex items-center">
            <Plus className="mr-1 h-4 w-4" />
            添加成员
          </Button>
        </div>

        {validationErrors.团队成员 && <p className="text-destructive text-sm">请至少添加一名团队成员</p>}

        <div className="space-y-3">
          {formData.团队成员.map((member: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`成员 ${index + 1} 姓名`}
                value={member}
                onChange={(e) => updateTeamMember(index, e.target.value)}
                className={cn(validationErrors.团队成员 && !member.trim() && "border-destructive")}
              />
              {formData.团队成员.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTeamMember(index)}
                  className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          请添加所有参与项目的团队成员。团队成员信息将用于项目评审和管理。
        </p>
      </div>
    </div>
  )
}

