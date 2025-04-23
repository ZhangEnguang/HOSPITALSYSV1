"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search, UserPlus, GraduationCap, Building2 } from "lucide-react"
import { extendedMembers } from "../../data/members-data"
import { expertLevelColors } from "../config/experts-config"

interface SelectCampusExpertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectExperts: (expertIds: string[]) => Promise<void>
}

export function SelectCampusExpertDialog({ 
  open, 
  onOpenChange, 
  onSelectExperts 
}: SelectCampusExpertDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedTitle, setSelectedTitle] = useState<string>("all")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all")
  const [selectedExperts, setSelectedExperts] = useState<typeof extendedMembers>([])

  // 重置选择状态
  useEffect(() => {
    if (!open) {
      setSearchTerm("")
      setSelectedDepartment("all")
      setSelectedTitle("all")
      setSelectedSpecialty("all")
      setSelectedExperts([])
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

  // 职称选项
  const titleOptions = [
    "教授/博导",
    "副教授/硕导",
    "讲师",
    "研究员",
    "副研究员",
    "助理研究员",
  ]

  // 专业领域选项
  const specialtyOptions = [
    "计算机科学",
    "人工智能",
    "电子信息",
    "机械工程",
    "材料科学",
    "环境工程",
    "医学",
  ]

  // 过滤校内人员列表，找出可以成为专家的人员
  const filteredCandidates = useMemo(() => {
    return extendedMembers.filter((member) => {
      // 排除已选成员
      if (selectedExperts.some((selected) => selected.id === member.id)) {
        return false
      }

      // 只显示教授、副教授、研究员等高级职称人员（作为专家的候选人）
      const eligibleRoles = [
        "教授", "副教授", "研究员", "副研究员", "高级工程师",
        "研究生导师", "博士生导师", "硕士生导师"
      ]
      
      const hasEligibleRole = member.role && eligibleRoles.some(role => member.role?.includes(role))
      if (!hasEligibleRole) {
        return false
      }

      // 搜索条件过滤
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const nameLower = member.name.toLowerCase()
        const roleLower = member.role ? member.role.toLowerCase() : ""
        const departmentLower = member.department?.name ? member.department.name.toLowerCase() : ""

        // 支持拼音首字母搜索（简化版，仅作演示）
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
      if (selectedTitle !== "all" && !member.role?.includes(selectedTitle)) {
        return false
      }

      // 专业领域过滤（模拟数据，实际应从成员专业中过滤）
      if (selectedSpecialty !== "all") {
        // 简单模拟：根据成员ID判断是否有相关专业
        const memberIdNum = Number.parseInt(member.id)
        if (selectedSpecialty === "计算机科学" && memberIdNum % 7 !== 0) return false
        if (selectedSpecialty === "人工智能" && memberIdNum % 6 !== 0) return false
        if (selectedSpecialty === "电子信息" && memberIdNum % 5 !== 0) return false
        if (selectedSpecialty === "机械工程" && memberIdNum % 4 !== 0) return false
        if (selectedSpecialty === "材料科学" && memberIdNum % 3 !== 0) return false
        if (selectedSpecialty === "环境工程" && memberIdNum % 2 !== 0) return false
      }

      return true
    })
  }, [searchTerm, selectedDepartment, selectedTitle, selectedSpecialty, selectedExperts])

  // 添加专家
  const handleAddExpert = (member: (typeof extendedMembers)[0]) => {
    setSelectedExperts([...selectedExperts, member])
  }

  // 移除专家
  const handleRemoveExpert = (expertId: string) => {
    setSelectedExperts(selectedExperts.filter((expert) => expert.id !== expertId))
  }

  // 提交选择的专家
  const handleSubmit = async () => {
    try {
      await onSelectExperts(selectedExperts.map((expert) => expert.id))
      onOpenChange(false)
    } catch (error) {
      console.error("遴选专家失败:", error)
    }
  }

  // 为候选人分配专家级别
  const getExpertLevel = (member: any): string => {
    // 根据职称和单位确定专家级别
    if (member.role?.includes("教授") && member.role?.includes("博导")) {
      return "国家级"
    } else if (member.role?.includes("研究员")) {
      return "省级"
    } else if (member.role?.includes("副教授") || member.role?.includes("副研究员")) {
      return "市级"
    } else {
      return "校级"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <GraduationCap className="h-6 w-6 text-primary" />
            遴选校内专家
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="输入姓名/职称/专业..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 text-base bg-muted/30"
            />
          </div>

          {/* 筛选标签 */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/30">
            <div className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              筛选条件
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">所属院系</span>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[200px] h-9 bg-background">
                    <SelectValue placeholder="选择院系" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部院系</SelectItem>
                    {departmentOptions.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">职称</span>
                <Select value={selectedTitle} onValueChange={setSelectedTitle}>
                  <SelectTrigger className="w-[200px] h-9 bg-background">
                    <SelectValue placeholder="选择职称" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部职称</SelectItem>
                    {titleOptions.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">专业领域</span>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="w-[200px] h-9 bg-background">
                    <SelectValue placeholder="选择专业" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部专业</SelectItem>
                    {specialtyOptions.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 已选专家 */}
          {selectedExperts.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <UserPlus className="h-4 w-4 text-primary" />
                  已选专家
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                    {selectedExperts.length}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">(点击×移除)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedExperts.map((expert) => (
                  <Badge
                    key={expert.id}
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 flex items-center gap-1.5 bg-primary/10 hover:bg-primary/15"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-[10px]">{expert.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>
                      {expert.name}·{expert.department?.name?.substring(0, 4)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full hover:bg-primary/10"
                      onClick={() => handleRemoveExpert(expert.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 可选专家列表 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4 text-primary" />
              校内专家候选人
            </div>
            <ScrollArea className="h-[320px] border rounded-lg">
              {filteredCandidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                  <GraduationCap className="h-12 w-12 mb-3 opacity-20" />
                  <p className="text-base">没有找到匹配的专家候选人</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
                  {filteredCandidates.map((candidate) => {
                    const expertLevel = getExpertLevel(candidate);
                    const levelVariant = expertLevelColors[expertLevel] || "default";
                    
                    return (
                      <div
                        key={candidate.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => handleAddExpert(candidate)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-muted">
                            <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <Badge variant={levelVariant} className="px-1.5 py-0 text-[10px]">
                                {expertLevel}
                              </Badge>
                              <span>·</span>
                              <span>{candidate.role}</span>
                              <span>·</span>
                              <span className="truncate max-w-[120px]">{candidate.department?.name}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 hover:bg-primary/10">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={selectedExperts.length === 0}
            className="px-6"
          >
            确认添加 ({selectedExperts.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 