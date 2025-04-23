"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface StepMembersProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  validationErrors?: Record<string, boolean>
}

export const StepMembers = ({ formData, handleInputChange, validationErrors = {} }: StepMembersProps) => {
  // 添加调试日志，查看formData的初始状态
  useEffect(() => {
    console.log("StepMembers 组件加载 - 团队成员状态:", formData.团队成员);
  }, [formData.团队成员]);

  // 添加团队成员的函数
  const addTeamMember = () => {
    console.log("添加团队成员按钮被点击");
    console.log("当前团队成员:", formData.团队成员);
    
    // 确保团队成员是一个数组
    const currentMembers = Array.isArray(formData.团队成员) ? formData.团队成员 : [];
    console.log("处理后的当前团队成员:", currentMembers);
    
    const updatedMembers = [...currentMembers, ""];
    console.log("更新后的团队成员:", updatedMembers);
    
    handleInputChange("团队成员", updatedMembers);
    
    // 添加延迟检查，验证数据是否被正确更新
    setTimeout(() => {
      console.log("添加操作后的团队成员状态:", formData.团队成员);
    }, 100);
  }

  // 移除团队成员的函数
  const removeTeamMember = (index: number) => {
    console.log("移除团队成员", index);
    const updatedMembers = [...(formData.团队成员 || [])]
    updatedMembers.splice(index, 1)
    handleInputChange("团队成员", updatedMembers)
  }

  // 更新特定团队成员的函数
  const updateTeamMember = (index: number, value: string) => {
    const updatedMembers = [...(formData.团队成员 || [])]
    updatedMembers[index] = value
    handleInputChange("团队成员", updatedMembers)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">项目成员配置</h3>
      <p className="text-muted-foreground">请添加项目参与人员，并设置各自的角色与职责</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="leader" className="flex items-center">
            项目负责人 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="leader"
            placeholder="请输入项目负责人姓名"
            value={formData.leader || formData.项目负责人 || ""}
            onChange={(e) => handleInputChange("leader", e.target.value)}
            className={cn(validationErrors.leader && "border-red-500 ring-2 ring-red-500/20")}
          />
          {validationErrors.leader && <p className="text-sm text-red-500 mt-1">请输入项目负责人</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamMembers" className="flex items-start">
            项目成员 <span className="text-red-500 ml-1">*</span>
          </Label>

          <div className="space-y-3">
            {/* 团队成员列表 */}
            {(formData.团队成员 || []).map((member: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`成员 ${index + 1} 姓名`}
                  value={member}
                  onChange={(e) => updateTeamMember(index, e.target.value)}
                  className={cn(index === 0 && validationErrors.团队成员 && "border-red-500 ring-2 ring-red-500/20")}
                />
                {/* 只有当有多个成员时才显示删除按钮 */}
                {(formData.团队成员 || []).length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTeamMember(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {/* 添加成员按钮 */}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addTeamMember} 
              className="mt-2 border-dashed"
              data-testid="add-team-member-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              添加成员
            </Button>
          </div>

          {validationErrors.团队成员 && <p className="text-sm text-red-500 mt-1">请至少添加一名项目成员</p>}
        </div>

        <div className="space-y-2 mt-6">
          <Label htmlFor="roles">角色与职责分配</Label>
          <Textarea
            id="roles"
            placeholder="请描述各成员在项目中的角色与职责分配"
            value={formData.roles || ""}
            onChange={(e) => handleInputChange("roles", e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}

