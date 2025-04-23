"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  ChevronDown, 
  ChevronUp, 
  PlusCircle, 
  Trash2, 
  Edit, 
  UserPlus, 
  Users, 
  PieChart, 
  BarChart, 
  User,
  Briefcase,
  FileText,
  GraduationCap
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TeamMembersStepProps {
  formData: Record<string, any>
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, string>
}

// 成员类型
type MemberType = "校内教师" | "校内学生" | "校外人员"

// 成员结构
interface TeamMember {
  id: string
  姓名: string
  类型: MemberType
  职称?: string
  学历?: string
  单位?: string
  出生年月?: string
  专业方向?: string
  项目分工: string
  负责模块?: string
  工作量占比?: number
}

export function TeamMembersStep({
  formData,
  handleInputChange,
  validationErrors,
}: TeamMembersStepProps) {
  // 当前成员列表
  const [members, setMembers] = useState<TeamMember[]>(
    formData["项目成员"] || []
  )
  
  // 当前编辑的成员
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null)
  
  // 新增/编辑对话框状态
  const [showMemberDialog, setShowMemberDialog] = useState(false)
  
  // 编辑模式标识
  const [isEditMode, setIsEditMode] = useState(false)
  
  // 当前选中的标签页
  const [activeTab, setActiveTab] = useState<string>("list")

  // 职称选项
  const titles = [
    "教授", "副教授", "讲师", "助教", "研究员", "副研究员", 
    "助理研究员", "高级工程师", "工程师", "其他"
  ]

  // 学历选项
  const educations = [
    "博士研究生", "硕士研究生", "本科", "专科", "其他"
  ]

  // 专业方向选项
  const directions = [
    "计算机科学与技术", "信息与通信工程", "控制科学与工程",
    "电子科学与技术", "软件工程", "网络空间安全",
    "数学", "物理学", "化学", "生物学", "机械工程",
    "材料科学与工程", "经济学", "管理学", "教育学", "其他"
  ]

  // 初始化新成员
  const initNewMember = (): TeamMember => ({
    id: Date.now().toString(),
    姓名: "",
    类型: "校内教师",
    职称: "",
    学历: "",
    单位: "",
    出生年月: "",
    专业方向: "",
    项目分工: "",
    负责模块: "",
    工作量占比: 0
  })

  // 打开新增成员对话框
  const handleAddMember = () => {
    setCurrentMember(initNewMember())
    setIsEditMode(false)
    setShowMemberDialog(true)
  }

  // 打开编辑成员对话框
  const handleEditMember = (member: TeamMember) => {
    setCurrentMember({ ...member })
    setIsEditMode(true)
    setShowMemberDialog(true)
  }

  // 删除成员
  const handleDeleteMember = (id: string) => {
    const updatedMembers = members.filter(member => member.id !== id)
    setMembers(updatedMembers)
    handleInputChange("项目成员", updatedMembers)
  }

  // 处理成员字段变更
  const handleMemberChange = (field: keyof TeamMember, value: any) => {
    if (currentMember) {
      setCurrentMember({
        ...currentMember,
        [field]: value
      })
    }
  }

  // 保存成员
  const handleSaveMember = () => {
    if (currentMember && currentMember.姓名 && currentMember.项目分工) {
      let updatedMembers: TeamMember[]
      
      if (isEditMode) {
        // 编辑现有成员
        updatedMembers = members.map(member => 
          member.id === currentMember.id ? currentMember : member
        )
      } else {
        // 添加新成员
        updatedMembers = [...members, currentMember]
      }
      
      setMembers(updatedMembers)
      handleInputChange("项目成员", updatedMembers)
      setShowMemberDialog(false)
      setCurrentMember(null)
    }
  }

  // 统计方法 - 按类型
  const getMemberTypeStats = () => {
    const stats = {
      "校内教师": 0,
      "校内学生": 0,
      "校外人员": 0
    }
    
    members.forEach(member => {
      if (member.类型 in stats) {
        stats[member.类型 as keyof typeof stats]++
      }
    })
    
    return stats
  }

  // 统计方法 - 按职称
  const getTitleStats = () => {
    const stats: Record<string, number> = {}
    
    members.forEach(member => {
      if (member.职称) {
        stats[member.职称] = (stats[member.职称] || 0) + 1
      }
    })
    
    return stats
  }

  // 统计方法 - 按学历
  const getEducationStats = () => {
    const stats: Record<string, number> = {}
    
    members.forEach(member => {
      if (member.学历) {
        stats[member.学历] = (stats[member.学历] || 0) + 1
      }
    })
    
    return stats
  }

  // 计算年龄段分布
  const getAgeDistribution = () => {
    const ageGroups: Record<string, number> = {
      "30岁以下": 0,
      "31-40岁": 0,
      "41-50岁": 0,
      "51-60岁": 0,
      "60岁以上": 0
    };
    
    members.forEach(member => {
      if (member.出生年月) {
        const birthDate = new Date(member.出生年月);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age <= 30) ageGroups["30岁以下"]++;
        else if (age <= 40) ageGroups["31-40岁"]++;
        else if (age <= 50) ageGroups["41-50岁"]++;
        else if (age <= 60) ageGroups["51-60岁"]++;
        else ageGroups["60岁以上"]++;
      }
    });
    
    return ageGroups;
  };

  // 渲染类型图标
  const renderTypeIcon = (type: MemberType) => {
    switch (type) {
      case "校内教师":
        return <Briefcase className="h-4 w-4 text-blue-500" />
      case "校内学生":
        return <GraduationCap className="h-4 w-4 text-green-500" />
      case "校外人员":
        return <User className="h-4 w-4 text-orange-500" />
    }
  }

  // 添加一个计算比例的方法
  const calculatePercentage = (count: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <div className="space-y-6">


          <div className="flex justify-between items-center">

          <CardTitle className="text-md flex items-center gap-2">项目成员列表</CardTitle>

            <Button onClick={handleAddMember} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> 添加成员
            </Button>
          </div>
          
          {validationErrors["项目成员"] && (
            <p className="text-destructive text-sm">{validationErrors["项目成员"]}</p>
          )}
          
          {members.length > 0 ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>序号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>成员类型</TableHead>
                    <TableHead className="hidden md:table-cell">职称/学历</TableHead>
                    <TableHead className="hidden md:table-cell">单位/专业</TableHead>
                    <TableHead>项目分工</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{member.姓名}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        {renderTypeIcon(member.类型)}
                        {member.类型}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {member.职称 || member.学历 || "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {member.单位 || member.专业方向 || "-"}
                      </TableCell>
                      <TableCell>{member.项目分工}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditMember(member)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>编辑成员</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteMember(member.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>删除成员</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                还没有添加任何项目成员，点击"添加成员"按钮开始添加
              </p>
            </Card>
          )}

        
        {/* 成员统计 */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 按类型统计 */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 ">
                <CardTitle className="text-md flex items-center gap-2">
                按成员类型统计
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {Object.entries(getMemberTypeStats()).map(([type, count]) => {
                    const percentage = calculatePercentage(count, members.length);
                    let color = "bg-blue-500";
                    if (type === "校内学生") color = "bg-green-500";
                    if (type === "校外人员") color = "bg-orange-500";
                    
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {type === "校内教师" && <Briefcase className="h-4 w-4 text-blue-500" />}
                            {type === "校内学生" && <GraduationCap className="h-4 w-4 text-green-500" />}
                            {type === "校外人员" && <User className="h-4 w-4 text-orange-500" />}
                            {type}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{percentage}%</span>
                            <span className="font-semibold">{count} 人</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${color}`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center pt-3 mt-2 border-t">
                    <div className="font-medium">总计</div>
                    <div className="font-semibold">{members.length} 人</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 按职称统计 */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 ">
                <CardTitle className="text-md flex items-center gap-2">
                   按职称统计
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {Object.entries(getTitleStats()).map(([title, count]) => {
                    const percentage = calculatePercentage(count, members.length);
                    return (
                      <div key={title} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 truncate">{title || "未填写"}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{percentage}%</span>
                            <span className="font-semibold">{count} 人</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-indigo-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(getTitleStats()).length === 0 && (
                    <div className="text-muted-foreground text-center py-10  rounded-md">
                      暂无数据
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* 按学历统计 */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 ">
                <CardTitle className="text-md flex items-center gap-2">
                  按学历统计
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {Object.entries(getEducationStats()).map(([edu, count]) => {
                    const percentage = calculatePercentage(count, members.length);
                    return (
                      <div key={edu} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 truncate">{edu || "未填写"}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{percentage}%</span>
                            <span className="font-semibold">{count} 人</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-purple-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(getEducationStats()).length === 0 && (
                    <div className="text-muted-foreground text-center py-10  rounded-md">
                      暂无数据
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

      
      {/* 成员编辑对话框 */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "编辑成员信息" : "添加项目成员"}</DialogTitle>
            <DialogDescription>
              请填写项目成员的基本信息和项目分工
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* 成员类型 */}
            <div className="space-y-2 ">
              <Label htmlFor="type" className="flex items-center">
                成员类型
                <span className="text-destructive ml-1">*</span>
              </Label>
              <RadioGroup
                value={currentMember?.类型 || "校内教师"}
                onValueChange={(value) => handleMemberChange("类型", value as MemberType)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="校内教师" id="teacher" />
                  <Label htmlFor="teacher" className="font-normal cursor-pointer">校内教师</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="校内学生" id="student" />
                  <Label htmlFor="student" className="font-normal cursor-pointer">校内学生</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="校外人员" id="external" />
                  <Label htmlFor="external" className="font-normal cursor-pointer">校外人员</Label>
                </div>
              </RadioGroup>
            </div>
            {/* 姓名 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                姓名
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="name"
                value={currentMember?.姓名 || ""}
                onChange={(e) => handleMemberChange("姓名", e.target.value)}
                placeholder="请输入成员姓名"
              />
            </div>
            
    
            
            {/* 职称 */}
            {currentMember?.类型 !== "校内学生" && (
              <div className="space-y-2">
                <Label htmlFor="title">职称</Label>
                <Select
                  value={currentMember?.职称 || ""}
                  onValueChange={(value) => handleMemberChange("职称", value)}
                >
                  <SelectTrigger id="title">
                    <SelectValue placeholder="请选择职称" />
                  </SelectTrigger>
                  <SelectContent>
                    {titles.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* 学历 */}
            <div className="space-y-2">
              <Label htmlFor="education">学历</Label>
              <Select
                value={currentMember?.学历 || ""}
                onValueChange={(value) => handleMemberChange("学历", value)}
              >
                <SelectTrigger id="education">
                  <SelectValue placeholder="请选择学历" />
                </SelectTrigger>
                <SelectContent>
                  {educations.map((edu) => (
                    <SelectItem key={edu} value={edu}>
                      {edu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* 出生年月 */}
            <div className="space-y-2">
              <Label htmlFor="birthday">出生年月</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !currentMember?.出生年月 && "text-muted-foreground"
                    )}
                  >
                    {currentMember?.出生年月 ? format(new Date(currentMember.出生年月), "yyyy-MM-dd") : "请选择出生日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentMember?.出生年月 ? new Date(currentMember.出生年月) : undefined}
                    onSelect={(date) => handleMemberChange("出生年月", date ? format(date, "yyyy-MM-dd") : "")}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1940}
                    toYear={2010}
                  />
                </PopoverContent>
              </Popover>
            </div>
            

            
            {/* 单位 */}
            <div className="space-y-2">
              <Label htmlFor="organization">
                {currentMember?.类型 === "校外人员" ? "所在单位" : "所在院系"}
              </Label>
              <Input
                id="organization"
                value={currentMember?.单位 || ""}
                onChange={(e) => handleMemberChange("单位", e.target.value)}
                placeholder={currentMember?.类型 === "校外人员" ? "请输入单位名称" : "请输入院系名称"}
              />
            </div>
            
            {/* 项目分工 */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="responsibility" className="flex items-center">
                项目分工
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Textarea
                id="responsibility"
                value={currentMember?.项目分工 || ""}
                onChange={(e) => handleMemberChange("项目分工", e.target.value)}
                placeholder="请描述该成员在项目中的具体工作和职责"
                className="min-h-[100px]"
              />
            </div>

    
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMemberDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSaveMember}>
              {isEditMode ? "保存修改" : "添加成员"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 