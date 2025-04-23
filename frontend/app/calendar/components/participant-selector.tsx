"use client"

import { useState, useEffect } from "react"
import { Check, Plus, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Student } from "../types/calendar"

// 扩展学生数据，包含部门和职位信息
const extendedStudents: (Student & { department?: string; position?: string })[] = [
  {
    id: "1",
    name: "张三",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("张三")}&background=random&color=fff&size=128`,
    department: "计算机科学系",
    position: "博士生",
  },
  {
    id: "2",
    name: "李四",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("李四")}&background=random&color=fff&size=128`,
    department: "物理学系",
    position: "硕士生",
  },
  {
    id: "3",
    name: "王五",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("王五")}&background=random&color=fff&size=128`,
    department: "化学系",
    position: "博士生",
  },
  {
    id: "4",
    name: "赵六",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("赵六")}&background=random&color=fff&size=128`,
    department: "生物学系",
    position: "教授",
  },
  {
    id: "5",
    name: "钱七",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("钱七")}&background=random&color=fff&size=128`,
    department: "数学系",
    position: "副教授",
  },
  {
    id: "6",
    name: "孙八",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("孙八")}&background=random&color=fff&size=128`,
    department: "计算机科学系",
    position: "助理教授",
  },
  {
    id: "7",
    name: "周九",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("周九")}&background=random&color=fff&size=128`,
    department: "物理学系",
    position: "博士后",
  },
  {
    id: "8",
    name: "吴十",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("吴十")}&background=random&color=fff&size=128`,
    department: "化学系",
    position: "研究员",
  },
  {
    id: "9",
    name: "郑十一",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("郑十一")}&background=random&color=fff&size=128`,
    department: "生物学系",
    position: "硕士生",
  },
  {
    id: "10",
    name: "王十二",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("王十二")}&background=random&color=fff&size=128`,
    department: "数学系",
    position: "博士生",
  },
  {
    id: "11",
    name: "李十三",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("李十三")}&background=random&color=fff&size=128`,
    department: "计算机科学系",
    position: "硕士生",
  },
  {
    id: "12",
    name: "刘十四",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("刘十四")}&background=random&color=fff&size=128`,
    department: "物理学系",
    position: "教授",
  },
]

// 部门列表
const departments = Array.from(new Set(extendedStudents.map((s) => s.department))).filter(Boolean) as string[]

// 职位列表
const positions = Array.from(new Set(extendedStudents.map((s) => s.position))).filter(Boolean) as string[]

interface ParticipantSelectorProps {
  selectedParticipants: Student[]
  onChange: (participants: Student[]) => void
  className?: string
}

export function ParticipantSelector({ selectedParticipants, onChange, className }: ParticipantSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filteredStudents, setFilteredStudents] = useState(extendedStudents)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newParticipant, setNewParticipant] = useState({ name: "", department: "", position: "" })

  // 过滤学生列表
  useEffect(() => {
    let filtered = extendedStudents

    // 按搜索词过滤
    if (search) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.department?.toLowerCase().includes(search.toLowerCase()) ||
          student.position?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // 按部门过滤
    if (selectedDepartment) {
      filtered = filtered.filter((student) => student.department === selectedDepartment)
    }

    // 按职位过滤
    if (selectedPosition) {
      filtered = filtered.filter((student) => student.position === selectedPosition)
    }

    setFilteredStudents(filtered)
  }, [search, selectedDepartment, selectedPosition])

  // 添加或移除参与者
  const toggleParticipant = (student: Student) => {
    const isSelected = selectedParticipants.some((p) => p.id === student.id)

    if (isSelected) {
      onChange(selectedParticipants.filter((p) => p.id !== student.id))
    } else {
      onChange([...selectedParticipants, student])
    }
  }

  // 移除参与者
  const removeParticipant = (id: string) => {
    onChange(selectedParticipants.filter((p) => p.id !== id))
  }

  // 添加新参与者
  const handleAddNewParticipant = () => {
    if (!newParticipant.name.trim()) return

    const newId = `new-${Date.now()}`
    const newStudent: Student = {
      id: newId,
      name: newParticipant.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newParticipant.name)}&background=random&color=fff&size=128`,
      department: newParticipant.department,
      position: newParticipant.position,
    }

    // 添加到已选列表
    onChange([...selectedParticipants, newStudent])

    // 重置表单
    setNewParticipant({ name: "", department: "", position: "" })
    setIsAddDialogOpen(false)
  }

  // 重置过滤器
  const resetFilters = () => {
    setSearch("")
    setSelectedDepartment(null)
    setSelectedPosition(null)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedParticipants.map((participant) => (
          <Badge key={participant.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={participant.avatar} alt={participant.name} />
              <AvatarFallback>{participant.name[0]}</AvatarFallback>
            </Avatar>
            <span>{participant.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => removeParticipant(participant.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {selectedParticipants.length === 0 && <span className="text-sm text-muted-foreground">未选择参与人员</span>}
      </div>

      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start" onClick={() => setOpen(true)}>
              <Search className="mr-2 h-4 w-4" />
              <span>搜索并选择参与人员</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="搜索人员..." value={search} onValueChange={setSearch} />

              <div className="flex flex-wrap gap-2 p-2 border-b">
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground mr-2">部门:</span>
                  <select
                    className="text-xs bg-transparent border rounded px-1"
                    value={selectedDepartment || ""}
                    onChange={(e) => setSelectedDepartment(e.target.value || null)}
                  >
                    <option value="">全部</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground mr-2">职位:</span>
                  <select
                    className="text-xs bg-transparent border rounded px-1"
                    value={selectedPosition || ""}
                    onChange={(e) => setSelectedPosition(e.target.value || null)}
                  >
                    <option value="">全部</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                {(selectedDepartment || selectedPosition || search) && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={resetFilters}>
                    重置
                  </Button>
                )}
              </div>

              <CommandList>
                <CommandEmpty>
                  <div className="py-6 text-center text-sm">
                    <p>未找到匹配的人员</p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => {
                        setOpen(false)
                        setIsAddDialogOpen(true)
                      }}
                    >
                      添加新人员
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {filteredStudents.map((student) => {
                    const isSelected = selectedParticipants.some((p) => p.id === student.id)
                    return (
                      <CommandItem
                        key={student.id}
                        onSelect={() => toggleParticipant(student)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{student.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {student.department} · {student.position}
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border",
                            isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted",
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
              <div className="p-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setOpen(false)
                    setIsAddDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  添加新人员
                </Button>
              </div>
            </Command>
          </PopoverContent>
        </Popover>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新参与人员</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <span className="text-sm font-medium">姓名</span>
                <Input
                  id="name"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  placeholder="请输入姓名"
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">部门</span>
                <Input
                  id="department"
                  value={newParticipant.department}
                  onChange={(e) => setNewParticipant({ ...newParticipant, department: e.target.value })}
                  placeholder="请输入部门"
                  list="department-list"
                />
                <datalist id="department-list">
                  {departments.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">职位</span>
                <Input
                  id="position"
                  value={newParticipant.position}
                  onChange={(e) => setNewParticipant({ ...newParticipant, position: e.target.value })}
                  placeholder="请输入职位"
                  list="position-list"
                />
                <datalist id="position-list">
                  {positions.map((pos) => (
                    <option key={pos} value={pos} />
                  ))}
                </datalist>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAddNewParticipant}>添加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

