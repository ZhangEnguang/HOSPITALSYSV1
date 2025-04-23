"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Edit, Info, UserPlus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MembersTabProps {
  todo?: any
}

export default function MembersTab({ todo }: MembersTabProps) {
  // 状态管理
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "林智慧",
      role: "智慧平台总监",
      type: "负责人",
      degree: "博士",
      workUnit: "计算机科学与技术学院",
      contribution: 35,
      email: "lin.zhihui@example.com",
      phone: "138-1234-5678",
      avatar: "",
      required: true, // 标记为必填项
    },
    {
      id: 2,
      name: "陈数智",
      role: "数据分析师",
      type: "经办人",
      degree: "硕士",
      workUnit: "大数据研究中心",
      contribution: 25,
      email: "chen.shuzhi@example.com",
      phone: "139-8765-4321",
      avatar: "",
      required: true, // 标记为必填项
    },
    {
      id: 3,
      name: "张智能",
      role: "AI算法工程师",
      type: "成员",
      degree: "博士",
      workUnit: "人工智能研究�����",
      contribution: 20,
      email: "zhang.zhineng@example.com",
      phone: "137-2468-1357",
      avatar: "",
      required: false,
    },
    {
      id: 4,
      name: "吴物联",
      role: "IoT架构师",
      type: "成员",
      degree: "硕士",
      workUnit: "电子信息工程学院",
      contribution: 20,
      email: "wu.wulian@example.com",
      phone: "136-1357-2468",
      avatar: "",
      required: false,
    },
  ])

  const [editingMember, setEditingMember] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [newMember, setNewMember] = useState({
    id: 0,
    name: "",
    role: "",
    type: "成员",
    degree: "硕士",
    workUnit: "",
    contribution: 0,
    email: "",
    phone: "",
    avatar: "",
    required: false,
  })

  // 根据成员类型返回对应的徽章变体
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "负责人":
        return "destructive"
      case "经办人":
        return "warning"
      case "成员":
        return "secondary"
      default:
        return "secondary"
    }
  }

  // 处理成员编辑
  const handleEditMember = (member, e) => {
    if (e) e.stopPropagation() // 阻止事件冒泡
    setEditingMember({ ...member })
  }

  // 保存编辑的成员
  const saveEditedMember = () => {
    if (!editingMember) return

    // 验证必填字段
    const errors = {}
    if (!editingMember.name) errors["edit_name"] = true
    if (!editingMember.role) errors["edit_role"] = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    // 检查是否已存在负责人或经办人
    if (editingMember.type === "负责人" || editingMember.type === "经办人") {
      const existingMember = members.find((m) => m.type === editingMember.type && m.id !== editingMember.id)
      if (existingMember) {
        alert(`已存在${editingMember.type}，请先修改现有${editingMember.type}的类型`)
        return
      }
    }

    setMembers(members.map((member) => (member.id === editingMember.id ? editingMember : member)))
    setEditingMember(null)
    setFieldErrors({})
  }

  // 添加新成员
  const saveNewMember = () => {
    // 验证必填字段
    const errors = {}
    if (!newMember.name) errors["name"] = true
    if (!newMember.role) errors["role"] = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    // 检查是否已存在负责人或经办人
    if (newMember.type === "负责人" || newMember.type === "经办人") {
      const existingMember = members.find((m) => m.type === newMember.type)
      if (existingMember) {
        alert(`已存在${newMember.type}，请先修改现有${newMember.type}的类型或选择其他类型`)
        return
      }
      // 标记为必填项
      newMember.required = true
    } else {
      newMember.required = false
    }

    const newId = Math.max(0, ...members.map((m) => m.id)) + 1
    setMembers([...members, { ...newMember, id: newId }])
    setNewMember({
      id: 0,
      name: "",
      role: "",
      type: "成员",
      degree: "硕士",
      workUnit: "",
      contribution: 0,
      email: "",
      phone: "",
      avatar: "",
      required: false,
    })
    setFieldErrors({})
  }

  // 处理成员删除
  const handleDeleteMember = () => {
    if (!memberToDelete) return
    setMembers(members.filter((m) => m.id !== memberToDelete.id))
    setMemberToDelete(null)
    setDeleteConfirmOpen(false)
  }

  // 获取按类型分组的成员
  const getLeader = () => members.find((m) => m.type === "负责人")
  const getHandler = () => members.find((m) => m.type === "经办人")
  const getMembers = () => members.filter((m) => m.type === "成员")

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">人员信息 ({members.length}人)</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              添加人员
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新人员</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name" className="flex items-center">
                    姓名<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="new-name"
                    value={newMember.name}
                    onChange={(e) => {
                      setNewMember({ ...newMember, name: e.target.value })
                      if (e.target.value) {
                        setFieldErrors({ ...fieldErrors, name: false })
                      }
                    }}
                    placeholder="请输入姓名"
                    className={fieldErrors["name"] ? "border-red-500" : ""}
                  />
                  {fieldErrors["name"] && <p className="text-red-500 text-xs mt-1">姓名不能为空</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-role" className="flex items-center">
                    职位<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="new-role"
                    value={newMember.role}
                    onChange={(e) => {
                      setNewMember({ ...newMember, role: e.target.value })
                      if (e.target.value) {
                        setFieldErrors({ ...fieldErrors, role: false })
                      }
                    }}
                    placeholder="请输入职位"
                    className={fieldErrors["role"] ? "border-red-500" : ""}
                  />
                  {fieldErrors["role"] && <p className="text-red-500 text-xs mt-1">职位不能为空</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-type" className="flex items-center">
                    类型<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={newMember.type} onValueChange={(value) => setNewMember({ ...newMember, type: value })}>
                    <SelectTrigger id="new-type">
                      <SelectValue placeholder="选择人员类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {!members.some((m) => m.type === "负责人") && <SelectItem value="负责人">负责人</SelectItem>}
                      {!members.some((m) => m.type === "经办人") && <SelectItem value="经办人">经办人</SelectItem>}
                      <SelectItem value="成员">成员</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-degree">学位</Label>
                  <Select
                    value={newMember.degree}
                    onValueChange={(value) => setNewMember({ ...newMember, degree: value })}
                  >
                    <SelectTrigger id="new-degree">
                      <SelectValue placeholder="选择学位" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="博士">博士</SelectItem>
                      <SelectItem value="硕士">硕士</SelectItem>
                      <SelectItem value="学士">学士</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-workUnit">工作单位</Label>
                  <Input
                    id="new-workUnit"
                    value={newMember.workUnit}
                    onChange={(e) => setNewMember({ ...newMember, workUnit: e.target.value })}
                    placeholder="请输入工作单位"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-contribution">贡献率 (%)</Label>
                  <Input
                    id="new-contribution"
                    type="number"
                    min="0"
                    max="100"
                    value={newMember.contribution}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        contribution: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-email">邮箱</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="请输入邮箱"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-phone">电话</Label>
                  <Input
                    id="new-phone"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="请输入电话"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button onClick={saveNewMember}>添加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="max-h-[320px] overflow-y-auto pr-1">
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="relative group">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex flex-col p-4 rounded-md hover:bg-slate-50 transition-colors border cursor-pointer">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-10 w-10 mr-3 bg-gray-100">
                        <AvatarFallback className="text-gray-500">{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-medium">{member.name}</p>
                          <Badge variant={getTypeBadgeVariant(member.type)} className="text-xs">
                            {member.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1 text-xs pl-[52px]">
                      <div>
                        <span className="text-muted-foreground">学位：</span>
                        <span>{member.degree}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">贡献率：</span>
                        <span>{member.contribution}%</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">工作单位：</span>
                        <span>{member.workUnit}</span>
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center">
                      <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                      人员详细信息
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">姓名</p>
                        <p>{member.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">角色</p>
                        <p>{member.role}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">类型</p>
                        <p>{member.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">学位</p>
                        <p>{member.degree}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">贡献率</p>
                        <p>{member.contribution}%</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground text-xs">工作单位</p>
                        <p>{member.workUnit}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground text-xs">邮箱</p>
                        <p>{member.email}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground text-xs">电话</p>
                        <p>{member.phone}</p>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="absolute right-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditMember(member, e)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>编辑人员信息</DialogTitle>
                    </DialogHeader>
                    {editingMember && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="list-name" className="flex items-center">
                            姓名<span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="list-name"
                            value={editingMember.name}
                            onChange={(e) => {
                              setEditingMember({ ...editingMember, name: e.target.value })
                              if (e.target.value) {
                                setFieldErrors({ ...fieldErrors, edit_name: false })
                              }
                            }}
                            className={fieldErrors["edit_name"] ? "border-red-500" : ""}
                          />
                          {fieldErrors["edit_name"] && <p className="text-red-500 text-xs mt-1">姓名不能为空</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="list-role" className="flex items-center">
                              职位<span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                              id="list-role"
                              value={editingMember.role}
                              onChange={(e) => {
                                setEditingMember({ ...editingMember, role: e.target.value })
                                if (e.target.value) {
                                  setFieldErrors({ ...fieldErrors, edit_role: false })
                                }
                              }}
                              className={fieldErrors["edit_role"] ? "border-red-500" : ""}
                            />
                            {fieldErrors["edit_role"] && <p className="text-red-500 text-xs mt-1">职位不能为空</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="list-type" className="flex items-center">
                              类型<span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Select
                              value={editingMember.type}
                              onValueChange={(value) => setEditingMember({ ...editingMember, type: value })}
                            >
                              <SelectTrigger id="list-type">
                                <SelectValue placeholder="选择人员类型" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="负责人">负责人</SelectItem>
                                <SelectItem value="经办人">经办人</SelectItem>
                                <SelectItem value="成员">成员</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="list-degree">学位</Label>
                            <Select
                              value={editingMember.degree}
                              onValueChange={(value) => setEditingMember({ ...editingMember, degree: value })}
                            >
                              <SelectTrigger id="list-degree">
                                <SelectValue placeholder="选择学位" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="博士">博士</SelectItem>
                                <SelectItem value="硕士">硕士</SelectItem>
                                <SelectItem value="学士">学士</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="list-contribution">贡献率 (%)</Label>
                            <Input
                              id="list-contribution"
                              type="number"
                              min="0"
                              max="100"
                              value={editingMember.contribution}
                              onChange={(e) =>
                                setEditingMember({
                                  ...editingMember,
                                  contribution: Number.parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="list-workUnit">工作单位</Label>
                          <Input
                            id="list-workUnit"
                            value={editingMember.workUnit}
                            onChange={(e) => setEditingMember({ ...editingMember, workUnit: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="list-email">邮箱</Label>
                            <Input
                              id="list-email"
                              type="email"
                              value={editingMember.email}
                              onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="list-phone">电话</Label>
                            <Input
                              id="list-phone"
                              value={editingMember.phone}
                              onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">取消</Button>
                      </DialogClose>
                      <Button onClick={saveEditedMember}>保存</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {!member.required && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMemberToDelete(member)
                      setDeleteConfirmOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 删除确认对话框 */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除人员 "{memberToDelete?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToDelete(null)}>取消</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteMember}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

