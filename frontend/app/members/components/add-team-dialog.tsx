"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, X, Search, Plus } from "lucide-react"
import { initialMembers } from "../data/members-data"

// 研究方向选项
const researchDirections = [
  "人工智能",
  "深度学习",
  "计算机视觉",
  "自然语言处理",
  "机器学习",
  "大数据技术",
  "云计算",
  "分布式系统",
  "区块链技术",
  "网络安全",
  "密码学",
  "量子信息",
  "量子通信",
  "量子计算",
  "新能源材料",
  "光电转换",
  "柔性电子",
  "储能技术",
  "脑科学",
  "神经工程",
  "智能医学",
  "脑机接口",
  "生物信息学",
  "基因组学",
  "蛋白质组学",
  "系统生物学",
  "机器人技术",
  "智能控制",
  "机器视觉",
  "人机交互",
  "虚拟现实",
  "增强现实",
  "交互设计",
  "计算机图形学",
  "微纳电子",
  "集成电路",
  "半导体器件",
  "存储技术",
  "环境监测",
  "污染控制",
  "传感技术",
  "环境大数据",
]

// 部门选项
const departments = [
  { id: "1", name: "计算机科学与技术学院" },
  { id: "2", name: "电子信息工程学院" },
  { id: "3", name: "机械工程学院" },
  { id: "4", name: "材料科学与工程学院" },
  { id: "5", name: "经济管理学院" },
]

// 职称选项
const titles = ["教授", "副教授", "讲师", "助理研究员", "研究员", "高级研究员", "博士后", "博士生", "硕士生"]

interface AddTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTeam: (team: any) => void
}

export function AddTeamDialog({ open, onOpenChange, onAddTeam }: AddTeamDialogProps) {
  // 表单状态
  const [teamName, setTeamName] = useState("")
  const [teamType, setTeamType] = useState("")
  const [leader, setLeader] = useState("")
  const [teamCode, setTeamCode] = useState("")
  const [foundDate, setFoundDate] = useState<Date>(new Date())
  const [isActive, setIsActive] = useState(true)
  const [selectedDirections, setSelectedDirections] = useState<string[]>([])
  const [directionInput, setDirectionInput] = useState("")

  // 成员选择状态
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<any[]>([])

  // 当前活动标签
  const [activeTab, setActiveTab] = useState("basic")

  // 生成团队编号
  useEffect(() => {
    if (selectedDirections.length > 0) {
      const directionCode = selectedDirections[0]
        .split("")
        .filter((char) => /[A-Za-z]/.test(char))
        .join("")
        .substring(0, 3)
        .toUpperCase()

      const dateCode = format(new Date(), "yyMMdd")
      setTeamCode(`T-${directionCode}-${dateCode}`)
    }
  }, [selectedDirections])

  // 过滤可选成员
  // 确保有演示数据可用
  const demoMembers = [
    {
      id: "101",
      name: "张教授",
      email: "zhang@example.edu.cn",
      phone: "13800138001",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "教授",
      department: { id: "1", name: "计算机科学与技术学院" },
      projects: [],
      skills: ["人工智能", "机器学习"],
      status: "在职",
      joinDate: "2018-09-01",
      isAdmin: true,
      bio: "人工智能领域专家，主持多项国家级科研项目",
      type: "personnel",
    },
    {
      id: "102",
      name: "李研究员",
      email: "li@example.edu.cn",
      phone: "13900139001",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "研究员",
      department: { id: "1", name: "计算机科学与技术学院" },
      projects: [],
      skills: ["深度学习", "计算机视觉"],
      status: "在职",
      joinDate: "2019-03-15",
      isAdmin: false,
      bio: "计算机视觉方向研究员，发表多篇高水平论文",
      type: "personnel",
    },
    {
      id: "103",
      name: "王副教授",
      email: "wang@example.edu.cn",
      phone: "13700137001",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "副教授",
      department: { id: "1", name: "计算机科学与技术学院" },
      projects: [],
      skills: ["自然语言处理", "知识图谱"],
      status: "在职",
      joinDate: "2020-07-01",
      isAdmin: false,
      bio: "自然语言处理专家，主持多项省部级项目",
      type: "personnel",
    },
    {
      id: "104",
      name: "赵博士",
      email: "zhao@example.edu.cn",
      phone: "13600136001",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "博士后",
      department: { id: "1", name: "计算机科学与技术学院" },
      projects: [],
      skills: ["机器学习", "数据挖掘"],
      status: "在职",
      joinDate: "2021-09-01",
      isAdmin: false,
      bio: "数据挖掘方向博士后，有丰富的工业界经验",
      type: "personnel",
    },
    {
      id: "105",
      name: "钱教授",
      email: "qian@example.edu.cn",
      phone: "13500135001",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "教授",
      department: { id: "2", name: "电子信息工程学院" },
      projects: [],
      skills: ["信号处理", "通信技术"],
      status: "在职",
      joinDate: "2017-01-15",
      isAdmin: true,
      bio: "信号处理领域专家，国家杰出青年基金获得者",
      type: "personnel",
    },
    {
      id: "106",
      name: "孙副教授",
      email: "sun@example.edu.cn",
      phone: "13400134001",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "副教授",
      department: { id: "2", name: "电子信息工程学院" },
      projects: [],
      skills: ["嵌入式系统", "物联网"],
      status: "在职",
      joinDate: "2019-06-01",
      isAdmin: false,
      bio: "嵌入式系统与物联网专家，主持多项横向项目",
      type: "personnel",
    },
    {
      id: "107",
      name: "周讲师",
      email: "zhou@example.edu.cn",
      phone: "13300133001",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "讲师",
      department: { id: "2", name: "电子信息工程学院" },
      projects: [],
      skills: ["电路设计", "FPGA"],
      status: "在职",
      joinDate: "2020-09-01",
      isAdmin: false,
      bio: "电路设计专家，有丰富的工程实践经验",
      type: "personnel",
    },
    {
      id: "108",
      name: "吴教授",
      email: "wu@example.edu.cn",
      phone: "13200132001",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "教授",
      department: { id: "3", name: "机械工程学院" },
      projects: [],
      skills: ["机器人技术", "智能控制"],
      status: "在职",
      joinDate: "2016-03-01",
      isAdmin: true,
      bio: "机器人技术专家，国家重点研发计划项目负责人",
      type: "personnel",
    },
    {
      id: "109",
      name: "郑研究员",
      email: "zheng@example.edu.cn",
      phone: "13100131001",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "研究员",
      department: { id: "3", name: "机械工程学院" },
      projects: [],
      skills: ["智能制造", "工业自动化"],
      status: "在职",
      joinDate: "2018-11-01",
      isAdmin: false,
      bio: "智能制造专家，主持多项国家自然科学基金项目",
      type: "personnel",
    },
    {
      id: "110",
      name: "陈博士",
      email: "chen@example.edu.cn",
      phone: "13000130001",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "博士后",
      department: { id: "3", name: "机械工程学院" },
      projects: [],
      skills: ["机械设计", "仿真分析"],
      status: "在职",
      joinDate: "2021-03-01",
      isAdmin: false,
      bio: "机械设计与仿真分析专家，有丰富的工程经验",
      type: "personnel",
    },
    {
      id: "111",
      name: "林教授",
      email: "lin@example.edu.cn",
      phone: "13900139002",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "教授",
      department: { id: "4", name: "材料科学与工程学院" },
      projects: [],
      skills: ["新材料", "纳米技术"],
      status: "在职",
      joinDate: "2015-09-01",
      isAdmin: true,
      bio: "新材料与纳米技术专家，国家重点实验室主任",
      type: "personnel",
    },
    {
      id: "112",
      name: "黄副教授",
      email: "huang@example.edu.cn",
      phone: "13800138002",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "副教授",
      department: { id: "4", name: "材料科学与工程学院" },
      projects: [],
      skills: ["复合材料", "材料表征"],
      status: "在职",
      joinDate: "2018-07-01",
      isAdmin: false,
      bio: "复合材料专家，主持多项省部级科研项目",
      type: "personnel",
    },
    {
      id: "113",
      name: "刘研究员",
      email: "liu@example.edu.cn",
      phone: "13700137002",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "研究员",
      department: { id: "5", name: "经济管理学院" },
      projects: [],
      skills: ["科技管理", "创新战略"],
      status: "在职",
      joinDate: "2019-01-01",
      isAdmin: false,
      bio: "科技管理与创新战略专家，有丰富的企业咨询经验",
      type: "personnel",
    },
    {
      id: "114",
      name: "杨教授",
      email: "yang@example.edu.cn",
      phone: "13600136002",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "教授",
      department: { id: "5", name: "经济管理学院" },
      projects: [],
      skills: ["科研项目管理", "技术经济"],
      status: "在职",
      joinDate: "2016-09-01",
      isAdmin: true,
      bio: "科研项目管理专家，国家社科基金重大项目负责人",
      type: "personnel",
    },
  ]

  // 使用演示数据和初始数据的组合
  const allMembers = [...initialMembers, ...demoMembers]
  const uniqueMembers = Array.from(new Map(allMembers.map((item) => [item.id, item])).values())

  const filteredMembers = uniqueMembers.filter((member) => {
    // 排除已选成员
    if (selectedMembers.some((m) => m.id === member.id)) {
      return false
    }

    // 搜索过滤
    if (searchTerm && !member.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // 部门过滤
    if (selectedDepartment && selectedDepartment !== "all" && member.department.id !== selectedDepartment) {
      return false
    }

    // 职称过滤
    if (selectedTitle && selectedTitle !== "all" && member.role !== selectedTitle) {
      return false
    }

    return true
  })

  // 添加研究方向
  const handleAddDirection = () => {
    if (directionInput && !selectedDirections.includes(directionInput)) {
      setSelectedDirections([...selectedDirections, directionInput])
      setDirectionInput("")
    }
  }

  // 移除研究方向
  const handleRemoveDirection = (direction: string) => {
    setSelectedDirections(selectedDirections.filter((d) => d !== direction))
  }

  // 添加成员
  const handleAddMember = (member: any) => {
    setSelectedMembers([...selectedMembers, member])
  }

  // 移除成员
  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== memberId))
  }

  // 提交表单
  const handleSubmit = () => {
    // 验证必填字段
    if (!teamName || !teamType || !leader) {
      alert("请填写必填字段：团队名称、团队类型、负责人")
      return
    }

    // 创建新团队对象
    const newTeam = {
      id: (Math.floor(Math.random() * 1000) + 100).toString(),
      name: teamName,
      code: teamCode || `T-TEAM-${format(new Date(), "yyMMdd")}`,
      avatar: "/placeholder.svg?height=32&width=32",
      teamType,
      leader,
      memberCount: selectedMembers.length,
      projects: [],
      researchFields: selectedDirections,
      foundDate: format(foundDate, "yyyy-MM-dd"),
      description: "",
      achievements: {
        papers: 0,
        patents: 0,
        awards: 0,
      },
      annualBudget: 0,
      facilities: [],
      collaborators: [],
      website: "",
      contact: {
        email: "",
        phone: "",
        address: "",
      },
      metrics: {
        publicationImpact: 0,
        fundingAmount: 0,
        graduateStudents: 0,
      },
      type: "team",
      status: isActive ? "活跃" : "归档",
    }

    // 调用父组件的添加方法
    onAddTeam(newTeam)

    // 重置表单
    resetForm()

    // 关闭对话框
    onOpenChange(false)
  }

  // 重置表单
  const resetForm = () => {
    setTeamName("")
    setTeamType("")
    setLeader("")
    setTeamCode("")
    setFoundDate(new Date())
    setIsActive(true)
    setSelectedDirections([])
    setDirectionInput("")
    setSearchTerm("")
    setSelectedDepartment(null)
    setSelectedTitle(null)
    setSelectedMembers([])
    setActiveTab("basic")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">新建科研团队</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="basic">基础信息</TabsTrigger>
            <TabsTrigger value="members">成员管理</TabsTrigger>
          </TabsList>

          <div className="mt-6 grid grid-cols-5 gap-6">
            <div className="col-span-3">
              <TabsContent value="basic" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamName" className="text-sm font-medium">
                      团队名称 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teamName"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="请输入团队名称"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamType" className="text-sm font-medium">
                      团队类型 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={teamType} onValueChange={setTeamType}>
                      <SelectTrigger id="teamType">
                        <SelectValue placeholder="请选择团队类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="research">科研组</SelectItem>
                        <SelectItem value="lab">实验室</SelectItem>
                        <SelectItem value="project">项目组</SelectItem>
                        <SelectItem value="center">研究中心</SelectItem>
                        <SelectItem value="institute">研究所</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leader" className="text-sm font-medium">
                      负责人 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="leader"
                      value={leader}
                      onChange={(e) => setLeader(e.target.value)}
                      placeholder="请输入负责人姓名"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamCode" className="text-sm font-medium">
                      团队编号
                    </Label>
                    <Input
                      id="teamCode"
                      value={teamCode}
                      onChange={(e) => setTeamCode(e.target.value)}
                      placeholder="自动生成"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foundDate" className="text-sm font-medium">
                      成立日期
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !foundDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {foundDate ? format(foundDate, "yyyy-MM-dd") : "选择日期"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={foundDate}
                          onSelect={(date) => date && setFoundDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium">
                      团队状态
                    </Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="status" checked={isActive} onCheckedChange={setIsActive} />
                      <Label htmlFor="status" className="cursor-pointer">
                        {isActive ? "活跃" : "归档"}
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">研究方向</Label>
                  <div className="flex items-center space-x-2">
                    <Select value={directionInput} onValueChange={setDirectionInput}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="选择或输入研究方向" />
                      </SelectTrigger>
                      <SelectContent>
                        {researchDirections.map((direction) => (
                          <SelectItem key={direction} value={direction}>
                            {direction}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" size="icon" onClick={handleAddDirection}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDirections.map((direction) => (
                      <Badge key={direction} variant="secondary" className="flex items-center gap-1">
                        {direction}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveDirection(direction)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="members" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">搜索成员</Label>
                  <div className="relative">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="输入成员姓名搜索"
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">按部门筛选</Label>
                    <Select value={selectedDepartment || ""} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择部门" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部部门</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">按职称筛选</Label>
                    <Select value={selectedTitle || ""} onValueChange={setSelectedTitle}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择职称" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部职称</SelectItem>
                        {titles.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-md p-2 h-[200px] overflow-y-auto">
                  <div className="text-sm font-medium mb-2">可选成员列表</div>
                  {filteredMembers.length > 0 ? (
                    <div className="space-y-2">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => handleAddMember(member)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                              {member.name.charAt(0)}
                            </div>
                            <span>{member.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">没有找到匹配的成员</div>
                  )}
                </div>
              </TabsContent>
            </div>

            <div className="col-span-2 border rounded-md p-4">
              <h3 className="text-sm font-medium mb-3">已选成员 ({selectedMembers.length})</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {selectedMembers.length > 0 ? (
                  selectedMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                          {member.name.charAt(0)}
                        </div>
                        <span>{member.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">尚未选择任何成员</div>
                )}
              </div>

              {activeTab === "basic" && (
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("members")}>
                    添加团队成员
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>创建团队</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

