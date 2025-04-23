"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepMembersProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepMembers({ formData, handleInputChange, validationErrors }: StepMembersProps) {
  // 定义团队成员角色选项
  const memberRoles = [
    "项目负责人",
    "技术负责人",
    "财务负责人",
    "研发人员",
    "质量管理",
    "行政支持"
  ]
  
  // 定义职称选项
  const titleOptions = [
    "教授",
    "副教授",
    "讲师",
    "助教",
    "研究员",
    "副研究员",
    "助理研究员",
    "高级工程师",
    "工程师",
    "助理工程师",
    "技术员",
    "其他"
  ]
  
  // 确保团队成员数据结构包含所有必要字段
  const ensureCompleteMembers = () => {
    if (!formData.团队成员 || !Array.isArray(formData.团队成员)) {
      return [{ name: "", role: "", unit: "", title: "", email: "", phone: "", orderId: "1", isLeader: 0 }]
    }
    
    // 转换旧格式（如果是字符串数组）
    if (typeof formData.团队成员[0] === 'string') {
      return formData.团队成员.map((name: string, index: number) => ({
        name,
        role: "",
        unit: "",
        title: "",
        email: "",
        phone: "",
        orderId: (index + 1).toString(),
        isLeader: 0
      }))
    }
    
    // 确保所有成员都有排序字段
    return formData.团队成员.map((member: any, index: number) => ({
      ...member,
      orderId: member.orderId || (index + 1).toString(),
      isLeader: member.isLeader !== undefined ? member.isLeader : 0
    }))
  }
  
  // 获取处理过的团队成员数据
  const members = ensureCompleteMembers()

  // 添加团队成员
  const addTeamMember = () => {
    const updatedMembers = [
      ...members,
      { 
        name: "", 
        role: "", 
        unit: "", 
        title: "", 
        email: "", 
        phone: "", 
        orderId: (members.length + 1).toString(),
        isLeader: 0
      }
    ]
    handleInputChange("团队成员", updatedMembers)
  }

  // 移除团队成员时重新计算排序
  const removeTeamMember = (index: number) => {
    const updatedMembers = members
      .filter((_: any, i: number) => i !== index)
      .map((member: any, newIndex: number) => ({
        ...member,
        orderId: (newIndex + 1).toString()
      }))
    handleInputChange("团队成员", updatedMembers)
  }

  // 更新团队成员字段
  const updateTeamMemberField = (index: number, field: string, value: any) => {
    const updatedMembers = [...members]
    updatedMembers[index] = { ...updatedMembers[index], [field]: value }
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

        <div className="space-y-4">
          {members.map((member: any, index: number) => (
            <div key={index} className="p-4 border border-border rounded-md bg-background/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">
                  {index === 0 ? "负责人" : `团队成员 ${index}`}
                </h4>
                {members.length > 1 && index !== 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTeamMember(index)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`member-name-${index}`}>姓名</Label>
                  <Input
                    id={`member-name-${index}`}
                    placeholder="成员姓名"
                    value={member.name || ""}
                    onChange={(e) => updateTeamMemberField(index, "name", e.target.value)}
                    className={cn(validationErrors.团队成员 && !member.name?.trim() && "border-destructive")}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`member-role-${index}`}>角色</Label>
                  <Select
                    value={member.role || ""}
                    onValueChange={(value) => updateTeamMemberField(index, "role", value)}
                  >
                    <SelectTrigger id={`member-role-${index}`}>
                      <SelectValue placeholder="选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      {memberRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`member-title-${index}`}>职称</Label>
                  <Select
                    value={member.title || ""}
                    onValueChange={(value) => updateTeamMemberField(index, "title", value)}
                  >
                    <SelectTrigger id={`member-title-${index}`}>
                      <SelectValue placeholder="选择职称" />
                    </SelectTrigger>
                    <SelectContent>
                      {titleOptions.map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`member-unit-${index}`}>所属单位</Label>
                  <Input
                    id={`member-unit-${index}`}
                    placeholder="院系/部门名称"
                    value={member.unit || ""}
                    onChange={(e) => updateTeamMemberField(index, "unit", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`member-email-${index}`}>电子邮箱</Label>
                  <Input
                    id={`member-email-${index}`}
                    type="email"
                    placeholder="电子邮箱"
                    value={member.email || ""}
                    onChange={(e) => updateTeamMemberField(index, "email", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`member-phone-${index}`}>联系电话</Label>
                  <Input
                    id={`member-phone-${index}`}
                    placeholder="联系电话"
                    value={member.phone || ""}
                    onChange={(e) => updateTeamMemberField(index, "phone", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          请为项目添加团队成员。第一位成员将被自动视为项目负责人。所有成员的信息将用于项目评审和管理。
        </p>
      </div>
    </div>
  )
} 