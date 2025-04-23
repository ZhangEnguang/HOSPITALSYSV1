"use client"

import { useState, useEffect } from "react"
import { X, Search, Plus, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// 模拟专家数据
const mockExperts = [
  {
    id: "1",
    name: "张教授",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "计算机科学学院",
    title: "教授",
    expertise: ["人工智能", "机器学习", "数据挖掘"],
    projects: 12,
    rating: 4.8,
  },
  {
    id: "2",
    name: "李研究员",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "社会科学研究所",
    title: "研究员",
    expertise: ["社会学", "人口学", "城市规划"],
    projects: 8,
    rating: 4.6,
  },
  {
    id: "3",
    name: "王博士",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "经济管理学院",
    title: "副教授",
    expertise: ["经济学", "管理学", "金融学"],
    projects: 15,
    rating: 4.7,
  },
  {
    id: "4",
    name: "刘教授",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "物理学院",
    title: "教授",
    expertise: ["量子物理", "材料科学", "纳米技术"],
    projects: 20,
    rating: 4.9,
  },
  {
    id: "5",
    name: "陈研究员",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "生命科学学院",
    title: "研究员",
    expertise: ["生物技术", "基因工程", "医学研究"],
    projects: 10,
    rating: 4.5,
  },
  {
    id: "6",
    name: "赵教授",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "环境科学学院",
    title: "教授",
    expertise: ["环境工程", "生态学", "可持续发展"],
    projects: 14,
    rating: 4.7,
  },
  {
    id: "7",
    name: "孙博士",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "人文学院",
    title: "副教授",
    expertise: ["历史学", "考古学", "文化研究"],
    projects: 7,
    rating: 4.4,
  },
  {
    id: "8",
    name: "周教授",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "艺术学院",
    title: "教授",
    expertise: ["设计学", "美术学", "艺术理论"],
    projects: 9,
    rating: 4.6,
  },
  {
    id: "9",
    name: "吴研究员",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "地球科学学院",
    title: "研究员",
    expertise: ["地质学", "地理信息系统", "自然资源"],
    projects: 11,
    rating: 4.5,
  },
  {
    id: "10",
    name: "郑教授",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "教育学院",
    title: "教授",
    expertise: ["教育学", "心理学", "教育技术"],
    projects: 13,
    rating: 4.8,
  },
]

// 模拟已分配专家数据
const mockAssignedExperts = [
  {
    id: "1",
    name: "张教授",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "计算机科学学院",
    title: "教授",
    expertise: ["人工智能", "机器学习", "数据挖掘"],
    assignedDate: "2023-05-15",
    status: "已接受",
  },
  {
    id: "3",
    name: "王博士",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "经济管理学院",
    title: "副教授",
    expertise: ["经济学", "管理学", "金融学"],
    assignedDate: "2023-05-15",
    status: "待确认",
  },
]

interface ExpertAssignmentDrawerProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onAssignExperts: (projectId: string, experts: any[]) => void
}

export function ExpertAssignmentDrawer({ isOpen, onClose, project, onAssignExperts }: ExpertAssignmentDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExperts, setSelectedExperts] = useState<string[]>([])
  const [assignedExperts, setAssignedExperts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")

  // 初始化已分配专家
  useEffect(() => {
    if (project) {
      setAssignedExperts(mockAssignedExperts)
    }
  }, [project])

  // 控制抽屉显示/隐藏的动画
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // 处理关闭抽屉
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  // 过滤专家列表
  const filteredExperts = mockExperts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.expertise.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // 处理选择专家
  const handleSelectExpert = (expertId: string) => {
    setSelectedExperts((prev) => (prev.includes(expertId) ? prev.filter((id) => id !== expertId) : [...prev, expertId]))
  }

  // 处理添加选中的专家
  const handleAddSelectedExperts = () => {
    const expertsToAdd = mockExperts
      .filter((expert) => selectedExperts.includes(expert.id))
      .map((expert) => ({
        ...expert,
        assignedDate: new Date().toISOString().split("T")[0],
        status: "待确认",
      }))

    // 合并已有专家和新添加的专家，避免重复
    const updatedAssignedExperts = [
      ...assignedExperts.filter((expert) => !selectedExperts.includes(expert.id)),
      ...expertsToAdd,
    ]

    setAssignedExperts(updatedAssignedExperts)
    setSelectedExperts([])
  }

  // 处理移除已分配的专家
  const handleRemoveAssignedExpert = (expertId: string) => {
    setAssignedExperts((prev) => prev.filter((expert) => expert.id !== expertId))
  }

  // 处理保存分配
  const handleSaveAssignment = () => {
    if (project) {
      onAssignExperts(project.id, assignedExperts)
      handleClose()
    }
  }

  if (!project) return null

  return (
    <>
      {/* 遮罩层 */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/80 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* 抽屉内容 */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-3/4 bg-background shadow-lg transition-transform duration-300 ease-in-out",
          isVisible ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* 抽屉头部 */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">分派评审专家</h2>
            <p className="text-sm text-muted-foreground">为项目 "{project?.name}" 分派专家进行评审</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">关闭</span>
          </Button>
        </div>

        {/* 抽屉内容区域 */}
        <div className="flex h-[calc(100%-64px)] flex-col">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* 标签页 */}
              <Tabs defaultValue="all" className="flex-1 overflow-hidden" onValueChange={setActiveTab}>
                <div className="border-b px-6">
                  <TabsList className="mb-0 mt-2">
                    <TabsTrigger value="all">所有专家</TabsTrigger>
                    <TabsTrigger value="assigned">已分配专家 ({assignedExperts.length})</TabsTrigger>
                  </TabsList>
                </div>

                {/* 所有专家标签内容 */}
                <TabsContent value="all" className="flex-1 overflow-hidden p-0">
                  <div className="flex flex-col h-full">
                    <div className="border-b p-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="搜索专家..."
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <ScrollArea className="flex-1">
                      <div className="p-4 space-y-4">
                        {filteredExperts.map((expert) => (
                          <div
                            key={expert.id}
                            className={cn(
                              "flex items-start space-x-4 rounded-lg border p-4 transition-colors",
                              selectedExperts.includes(expert.id) ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                            )}
                          >
                            <Checkbox
                              checked={selectedExperts.includes(expert.id)}
                              onCheckedChange={() => handleSelectExpert(expert.id)}
                              className="mt-1"
                            />
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={expert.avatar} alt={expert.name} />
                              <AvatarFallback>{expert.name.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{expert.name}</div>
                                <div className="text-sm text-muted-foreground">{expert.title}</div>
                              </div>
                              <div className="text-sm text-muted-foreground">{expert.department}</div>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {expert.expertise.map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between pt-2 text-sm">
                                <div>已评审项目: {expert.projects}</div>
                                <div>评分: {expert.rating}/5.0</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {selectedExperts.length > 0 && (
                      <div className="border-t p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">已选择 {selectedExperts.length} 位专家</div>
                          <Button onClick={handleAddSelectedExperts} size="sm">
                            <Plus className="mr-1 h-4 w-4" />
                            添加到已分配
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 已分配专家标签内容 */}
                <TabsContent value="assigned" className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {assignedExperts.length === 0 ? (
                        <div className="flex h-40 items-center justify-center text-muted-foreground">
                          尚未分配专家，请从所有专家中选择并添加
                        </div>
                      ) : (
                        assignedExperts.map((expert) => (
                          <div key={expert.id} className="flex items-start space-x-4 rounded-lg border p-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={expert.avatar} alt={expert.name} />
                              <AvatarFallback>{expert.name.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{expert.name}</div>
                                <Badge variant={expert.status === "已接受" ? "success" : "outline"} className="text-xs">
                                  {expert.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {expert.department} · {expert.title}
                              </div>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {expert.expertise.map((skill: string) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between pt-2 text-sm">
                                <div>分配日期: {expert.assignedDate}</div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveAssignedExpert(expert.id)}
                                >
                                  <Trash2 className="mr-1 h-3 w-3" />
                                  移除
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* 抽屉底部操作区 */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">已分配 {assignedExperts.length} 位专家进行评审</div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  取消
                </Button>
                <Button onClick={handleSaveAssignment}>
                  <Check className="mr-1 h-4 w-4" />
                  保存分配
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

