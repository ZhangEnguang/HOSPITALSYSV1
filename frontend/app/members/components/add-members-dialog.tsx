"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search, UserPlus, Target } from "lucide-react"
import { extendedMembers } from "../data/members-data"

interface AddMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string
  teamName: string
  onAddMembers: (teamId: string, memberIds: string[]) => void
}

export function AddMembersDialog({ open, onOpenChange, teamId, teamName, onAddMembers }: AddMembersDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [selectedMembers, setSelectedMembers] = useState<typeof extendedMembers>([])

  // 重置选择状态
  useEffect(() => {
    if (!open) {
      setSearchTerm("")
      setSelectedDepartment("all")
      setSelectedRole("all")
      setSelectedProject("all")
      setSelectedMembers([])
    }
  }, [open])

  // 获取所有部门选项
  const departmentOptions = useMemo(() => {
    const departments = new Set<string>()
    extendedMembers.forEach((member) => {
      if (member.department && member.department.name) {
        departments.add(member.department.name)
      }
    })
    return Array.from(departments)
  }, [])

  // 获取所有职称选项
  const roleOptions = useMemo(() => {
    const roles = new Set<string>()
    extendedMembers.forEach((member) => {
      if (member.role) {
        roles.add(member.role)
      }
    })
    return Array.from(roles)
  }, [])

  // 模拟项目选项
  const projectOptions = ["ENV-MON", "AI-DL", "QIC", "BRAIN-LAB", "BIG-DATA", "NANO-IC"]

  // 过滤成员列表
  const filteredMembers = useMemo(() => {
    return extendedMembers.filter((member) => {
      // 排除已选成员
      if (selectedMembers.some((selected) => selected.id === member.id)) {
        return false
      }

      // 搜索条件过滤
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const nameLower = member.name.toLowerCase()
        const roleLower = member.role ? member.role.toLowerCase() : ""
        const departmentLower = member.department?.name ? member.department.name.toLowerCase() : ""

        // 支持拼音首字母搜索（简化版，仅作演示���
        const pinyinMatch = searchLower === "zj" && member.name.startsWith("张") && member.role?.includes("教授")

        if (
          !nameLower.includes(searchLower) &&
          !roleLower.includes(searchLower) &&
          !departmentLower.includes(searchLower) &&
          !pinyinMatch
        ) {
          return false
        }
      }

      // 部门过滤
      if (selectedDepartment !== "all" && member.department?.name !== selectedDepartment) {
        return false
      }

      // 职称过滤
      if (selectedRole !== "all" && member.role !== selectedRole) {
        return false
      }

      // 项目过滤（模拟数据，实际应从成员项目中过滤）
      if (selectedProject !== "all") {
        // 简单模拟：根据成员ID判断是否参与项目
        const memberIdNum = Number.parseInt(member.id)
        if (selectedProject === "ENV-MON" && memberIdNum % 5 !== 0) return false
        if (selectedProject === "AI-DL" && memberIdNum % 4 !== 0) return false
        if (selectedProject === "QIC" && memberIdNum % 3 !== 0) return false
        if (selectedProject === "BRAIN-LAB" && memberIdNum % 2 !== 0) return false
      }

      return true
    })
  }, [searchTerm, selectedDepartment, selectedRole, selectedProject, selectedMembers])

  // 添加成员
  const handleAddMember = (member: (typeof extendedMembers)[0]) => {
    setSelectedMembers([...selectedMembers, member])
  }

  // 移除成员
  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((member) => member.id !== memberId))
  }

  // 提交添加成员
  const handleSubmit = () => {
    onAddMembers(
      teamId,
      selectedMembers.map((member) => member.id),
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-5 w-5 text-primary" />为 <span className="font-bold text-primary">{teamName}</span>{" "}
            添加成员
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="输入姓名/职称/研究方向..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <p className="text-xs text-muted-foreground mt-1 ml-2">🔍 支持拼音首字母搜索（如「zj」→张教授）</p>
          </div>

          {/* 筛选标签 */}
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">筛选标签：</div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">部门</span>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    {departmentOptions.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">职称</span>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="选择职称" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部职称</SelectItem>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">在研项目</span>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="选择项目" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部项目</SelectItem>
                    {projectOptions.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 已选成员 */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">✅ 已选 {selectedMembers.length} 人：</span>
                <span className="text-xs text-muted-foreground">(点击×移除)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <Badge key={member.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    <span>
                      {member.name}·{member.department?.name?.substring(0, 4)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 可选成员列表 */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="text-sm font-medium">可选成员列表：</div>
            <ScrollArea className="h-[300px] border rounded-md p-2">
              {filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                  <UserPlus className="h-10 w-10 mb-2 opacity-20" />
                  <p>没有找到匹配的成员</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleAddMember(member)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {member.role} · {member.department?.name}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={selectedMembers.length === 0}>
            确认添加 ({selectedMembers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

