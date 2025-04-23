"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface EditTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditTeam: (team: any) => void
  team: any
}

export function EditTeamDialog({ open, onOpenChange, onEditTeam, team }: EditTeamDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    teamType: "",
    leader: "",
    description: "",
    foundDate: "",
    website: "",
    contact: {
      email: "",
      phone: "",
      address: "",
    },
    researchFields: [] as string[],
    facilities: [] as string[],
    collaborators: [] as string[],
  })

  const [newResearchField, setNewResearchField] = useState("")
  const [newFacility, setNewFacility] = useState("")
  const [newCollaborator, setNewCollaborator] = useState("")

  // 当团队数据变化时，更新表单数据
  useEffect(() => {
    if (team) {
      setFormData({
        id: team.id || "",
        name: team.name || "",
        code: team.code || "",
        teamType: team.teamType || "",
        leader: team.leader || "",
        description: team.description || "",
        foundDate: team.foundDate ? new Date(team.foundDate).toISOString().split("T")[0] : "",
        website: team.website || "",
        contact: {
          email: team.contact?.email || "",
          phone: team.contact?.phone || "",
          address: team.contact?.address || "",
        },
        researchFields: Array.isArray(team.researchFields) ? [...team.researchFields] : [],
        facilities: Array.isArray(team.facilities) ? [...team.facilities] : [],
        collaborators: Array.isArray(team.collaborators) ? [...team.collaborators] : [],
      })
    }
  }, [team])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      // 确保parent是一个有效的键，并且对应的值是一个对象
      const parentKey = parent as keyof typeof formData
      const parentField = formData[parentKey]
      
      // 创建一个新对象来保存嵌套属性
      const updatedParentField = parentField && typeof parentField === 'object' && !Array.isArray(parentField)
        ? { ...parentField as object, [child]: value }
        : { [child]: value }
        
      setFormData({
        ...formData,
        [parent]: updatedParentField
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const addResearchField = () => {
    if (newResearchField.trim() !== "") {
      setFormData({
        ...formData,
        researchFields: [...formData.researchFields, newResearchField.trim()],
      })
      setNewResearchField("")
    }
  }

  const removeResearchField = (index: number) => {
    const updatedFields = [...formData.researchFields]
    updatedFields.splice(index, 1)
    setFormData({
      ...formData,
      researchFields: updatedFields,
    })
  }

  const addFacility = () => {
    if (newFacility.trim() !== "") {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, newFacility.trim()],
      })
      setNewFacility("")
    }
  }

  const removeFacility = (index: number) => {
    const updatedFacilities = [...formData.facilities]
    updatedFacilities.splice(index, 1)
    setFormData({
      ...formData,
      facilities: updatedFacilities,
    })
  }

  const addCollaborator = () => {
    if (newCollaborator.trim() !== "") {
      setFormData({
        ...formData,
        collaborators: [...formData.collaborators, newCollaborator.trim()],
      })
      setNewCollaborator("")
    }
  }

  const removeCollaborator = (index: number) => {
    const updatedCollaborators = [...formData.collaborators]
    updatedCollaborators.splice(index, 1)
    setFormData({
      ...formData,
      collaborators: updatedCollaborators,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 表单验证
    if (!formData.name.trim()) {
      toast({
        title: "请填写团队名称",
        variant: "destructive",
      })
      return
    }

    if (!formData.teamType) {
      toast({
        title: "请选择团队类型",
        variant: "destructive",
      })
      return
    }

    // 提交编辑后的团队数据
    onEditTeam({
      ...team,
      ...formData,
      // 保持原有的其他字段不变
      avatar: team.avatar,
      memberCount: team.memberCount,
      projects: team.projects,
      achievements: team.achievements,
      annualBudget: team.annualBudget,
      metrics: team.metrics,
      type: "team",
    })

    onOpenChange(false)
  }

  // 获取团队类型的中文名称
  const getTeamTypeLabel = (type: string) => {
    switch (type) {
      case "lab":
        return "实验室"
      case "center":
        return "研究中心"
      case "institute":
        return "研究所"
      case "research":
        return "课题组"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑科研团队</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">团队名称 *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="请输入团队名称"
                  required
                />
              </div>

              <div>
                <Label htmlFor="code">团队编号</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="例如：ENV-MON-012"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="teamType">团队类型 *</Label>
                <Select value={formData.teamType} onValueChange={(value) => handleSelectChange(value, "teamType")}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择团队类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab">实验室</SelectItem>
                    <SelectItem value="center">研究中心</SelectItem>
                    <SelectItem value="institute">研究所</SelectItem>
                    <SelectItem value="research">课题组</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="leader">负责人</Label>
                <Input
                  id="leader"
                  name="leader"
                  value={formData.leader}
                  onChange={handleInputChange}
                  placeholder="请输入负责人姓名"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="foundDate">成立日期</Label>
                <Input
                  id="foundDate"
                  name="foundDate"
                  type="date"
                  value={formData.foundDate}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="website">团队网站</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="例如：https://env-mon.example.edu"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">团队简介</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="请输入团队简介"
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label>联系方式</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  placeholder="电子邮箱"
                />
                <Input
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  placeholder="联系电话"
                />
                <Input
                  name="contact.address"
                  value={formData.contact.address}
                  onChange={handleInputChange}
                  placeholder="办公地址"
                />
              </div>
            </div>

            <div>
              <Label>研究方向</Label>
              <div className="flex mt-2">
                <Input
                  value={newResearchField}
                  onChange={(e) => setNewResearchField(e.target.value)}
                  placeholder="添加研究方向"
                  className="flex-1"
                />
                <Button type="button" onClick={addResearchField} className="ml-2">
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.researchFields.map((field, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {field}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeResearchField(index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>研究设施</Label>
              <div className="flex mt-2">
                <Input
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  placeholder="添加研究设施"
                  className="flex-1"
                />
                <Button type="button" onClick={addFacility} className="ml-2">
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.facilities.map((facility, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {facility}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFacility(index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>合作单位</Label>
              <div className="flex mt-2">
                <Input
                  value={newCollaborator}
                  onChange={(e) => setNewCollaborator(e.target.value)}
                  placeholder="添加合作单位"
                  className="flex-1"
                />
                <Button type="button" onClick={addCollaborator} className="ml-2">
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.collaborators.map((collaborator, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {collaborator}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeCollaborator(index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">保存修改</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

