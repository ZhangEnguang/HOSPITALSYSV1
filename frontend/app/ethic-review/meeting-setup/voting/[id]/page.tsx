"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, BarChart3, FileText, Search, Play, Pause, Square, Calendar, MapPin, Users, MoreVertical, Eye, Vote, RotateCcw, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

// 模拟会议数据
const getMeetingData = (id: string) => {
  return {
    id,
    title: "医学伦理委员会第12次会议",
    date: "2024-03-15",
    time: "14:00-17:00",
    venue: "学术报告厅",
    participants: [
      { id: "1", name: "张三", department: "医学院", hasVoted: true },
      { id: "2", name: "李四", department: "生物学院", hasVoted: false },
      { id: "3", name: "王五", department: "药学院", hasVoted: true },
      { id: "4", name: "赵六", department: "护理学院", hasVoted: false },
      { id: "5", name: "钱七", department: "公共卫生学院", hasVoted: true },
      { id: "6", name: "周九", department: "基础医学院", hasVoted: true },
      { id: "7", name: "孙八", department: "临床医学院", hasVoted: false }
    ]
  }
}

// 模拟项目数据
const getProjectsData = () => {
  return [
    {
      id: "1",
      title: "转基因小鼠模型在神经退行性疾病中的应用",
      acceptanceNumber: "MR-2024-001",
      projectLeader: "张教授",
      department: "神经科学研究所",
      type: "会议审查",
      votingStatus: "未开始",
      votes: { agree: 0, disagree: 0, modify: 0, total: 0 },
      voterDetails: []
    },
    {
      id: "2", 
      title: "新型抗癌药物的临床前研究",
      acceptanceNumber: "MR-2024-002",
      projectLeader: "陈博士",
      department: "肿瘤研究中心",
      type: "会议审查",
      votingStatus: "进行中",
      votes: { agree: 3, disagree: 1, modify: 2, total: 6 },
      voterDetails: [
        { voterId: "1", voterName: "张三", vote: "agree", comment: "研究方案合理" },
        { voterId: "3", voterName: "王五", vote: "agree", comment: "具有创新性" },
        { voterId: "5", voterName: "钱七", vote: "modify", comment: "需要完善实验设计" }
      ]
    },
    {
      id: "3",
      title: "基因编辑技术在遗传病治疗中的应用",
      acceptanceNumber: "MR-2024-003",
      projectLeader: "刘主任",
      department: "遗传学实验室",
      type: "快速审查",
      votingStatus: "已暂停",
      votes: { agree: 2, disagree: 1, modify: 1, total: 4 },
      voterDetails: [
        { voterId: "1", voterName: "张三", vote: "agree", comment: "技术先进" },
        { voterId: "2", voterName: "李四", vote: "disagree", comment: "风险较高" },
        { voterId: "3", voterName: "王五", vote: "agree", comment: "应用前景广阔" }
      ]
    },
    {
      id: "4",
      title: "干细胞治疗心血管疾病的临床试验",
      acceptanceNumber: "MR-2024-004",
      projectLeader: "王教授",
      department: "心血管研究中心",
      type: "会议审查",
      votingStatus: "未开始",
      votes: { agree: 0, disagree: 0, modify: 0, total: 0 },
      voterDetails: []
    },
    {
      id: "5",
      title: "人工智能在医学影像诊断中的应用",
      acceptanceNumber: "MR-2024-005",
      projectLeader: "李博士",
      department: "医学影像科",
      type: "会议审查",
      votingStatus: "进行中",
      votes: { agree: 2, disagree: 0, modify: 1, total: 3 },
      voterDetails: [
        { voterId: "1", voterName: "张三", vote: "agree", comment: "技术创新" },
        { voterId: "3", voterName: "王五", vote: "agree", comment: "应用价值高" },
        { voterId: "5", voterName: "钱七", vote: "modify", comment: "需要更多临床验证" }
      ]
    },
    {
      id: "6",
      title: "纳米材料在药物递送中的研究",
      acceptanceNumber: "MR-2024-006",
      projectLeader: "赵主任",
      department: "药物研究所",
      type: "快速审查",
      votingStatus: "已结束",
      votes: { agree: 4, disagree: 2, modify: 1, total: 7 },
      voterDetails: [
        { voterId: "1", voterName: "张三", vote: "agree", comment: "研究方向正确" },
        { voterId: "2", voterName: "李四", vote: "disagree", comment: "安全性待验证" },
        { voterId: "3", voterName: "王五", vote: "agree", comment: "具有前瞻性" }
      ]
    },
    {
      id: "7",
      title: "免疫细胞治疗恶性肿瘤的机制研究",
      acceptanceNumber: "MR-2024-007",
      projectLeader: "孙教授",
      department: "免疫学研究所",
      type: "会议审查",
      votingStatus: "未开始",
      votes: { agree: 0, disagree: 0, modify: 0, total: 0 },
      voterDetails: []
    },
    {
      id: "8",
      title: "基于大数据的精准医疗平台建设",
      acceptanceNumber: "MR-2024-008",
      projectLeader: "周博士",
      department: "信息技术中心",
      type: "会议审查",
      votingStatus: "进行中",
      votes: { agree: 1, disagree: 1, modify: 2, total: 4 },
      voterDetails: [
        { voterId: "1", voterName: "张三", vote: "agree", comment: "符合发展趋势" },
        { voterId: "2", voterName: "李四", vote: "disagree", comment: "技术难度较大" },
        { voterId: "3", voterName: "王五", vote: "modify", comment: "需要更详细的实施方案" }
      ]
    }
  ]
}

export default function MeetingVotingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const meetingData = getMeetingData(params.id)
  const [projectsData, setProjectsData] = useState(getProjectsData())
  const [globalVotingStatus, setGlobalVotingStatus] = useState("未开始")
  
  // 投票设置
  const [votingSettings, setVotingSettings] = useState({
    isAnonymous: false,
    allowChangeVote: true,
    showRealTimeResults: true,
    requireAllVotes: false
  })

  // 筛选状态
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部状态")
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // 每页显示5个项目
  
  // 项目详情对话框状态
  const [showProjectDetail, setShowProjectDetail] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const getVotingStatusColor = (status: string) => {
    switch (status) {
      case "未开始": return "text-gray-500 border-gray-300"
      case "进行中": return "text-blue-500 border-blue-300"
      case "已完成": return "text-green-500 border-green-300"
      case "已暂停": return "text-amber-500 border-amber-300"
      default: return "text-gray-500 border-gray-300"
    }
  }

  const startVoting = () => {
    setGlobalVotingStatus("进行中")
    setProjectsData(prev => prev.map(p => ({
      ...p,
      votingStatus: p.votingStatus === "未开始" ? "进行中" : p.votingStatus
    })))
    toast({
      title: "投票已开始",
      description: "所有参会人员现在可以开始投票"
    })
  }

  const pauseVoting = () => {
    setGlobalVotingStatus("已暂停")
    toast({
      title: "投票已暂停",
      description: "投票已暂停，可以稍后恢复"
    })
  }

  const endVoting = () => {
    setGlobalVotingStatus("已结束")
    setProjectsData(prev => prev.map(p => ({
      ...p,
      votingStatus: "已完成"
    })))
    toast({
      title: "投票已结束",
      description: "所有投票已结束，可以查看最终结果"
    })
  }

  // 计算总体投票进度
  const calculateOverallProgress = () => {
    const totalProjects = projectsData.length
    const completedProjects = projectsData.filter(p => p.votingStatus === "已结束").length
    return totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
  }

  // 计算总体投票统计
  const calculateOverallStats = () => {
    const totalVotes = projectsData.reduce((sum, project) => sum + project.votes.total, 0)
    const totalAgree = projectsData.reduce((sum, project) => sum + project.votes.agree, 0)
    const totalDisagree = projectsData.reduce((sum, project) => sum + project.votes.disagree, 0)
    const totalModify = projectsData.reduce((sum, project) => sum + project.votes.modify, 0)
    
    return {
      totalVotes,
      totalAgree,
      totalDisagree,
      totalModify,
      totalParticipants: meetingData.participants.length,
      votedParticipants: meetingData.participants.filter(p => p.hasVoted).length
    }
  }

  const overallStats = calculateOverallStats()

  // 筛选项目数据
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.acceptanceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectLeader.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "全部状态" || project.votingStatus === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // 分页计算
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  // 当筛选条件改变时重置页码
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  // 开始单个项目投票
  const handleStartProjectVoting = (project: any) => {
    setProjectsData(prev => prev.map(p => 
      p.id === project.id 
        ? { ...p, votingStatus: "进行中" }
        : p
    ))
    
    toast({
      title: "投票已开始",
      description: `项目"${project.title}"投票已开始`
    })
  }

  // 暂停单个项目投票
  const handlePauseProjectVoting = (project: any) => {
    setProjectsData(prev => prev.map(p => 
      p.id === project.id 
        ? { ...p, votingStatus: "已暂停" }
        : p
    ))
    
    toast({
      title: "投票已暂停",
      description: `项目"${project.title}"投票已暂停`
    })
  }

  // 继续单个项目投票
  const handleResumeProjectVoting = (project: any) => {
    setProjectsData(prev => prev.map(p => 
      p.id === project.id 
        ? { ...p, votingStatus: "进行中" }
        : p
    ))
    
    toast({
      title: "投票已继续",
      description: `项目"${project.title}"投票已继续`
    })
  }

  // 重新投票功能
  const handleRevote = (project: any) => {
    // 重置该项目的投票状态
    setProjectsData(prev => prev.map(p => 
      p.id === project.id 
        ? {
            ...p,
            votingStatus: "进行中",
            votes: { agree: 0, disagree: 0, modify: 0, total: 0 },
            voterDetails: []
          }
        : p
    ))
    
    toast({
      title: "重新投票",
      description: `项目"${project.title}"已重置，可以重新投票`
    })
  }

  // 查看项目详情
  const handleViewProjectDetail = (project: any) => {
    setSelectedProject(project)
    setShowProjectDetail(true)
  }

  return (
    <div className="min-h-screen">
      {/* 页面头部 */}
      <div style={{background: 'rgba(0, 0, 0, 0)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">会议投票管理</h1>
                <p className="text-sm text-gray-600">{meetingData.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={getVotingStatusColor(globalVotingStatus)}>
                {globalVotingStatus}
              </Badge>
              {globalVotingStatus === "未开始" && (
                <Button onClick={startVoting} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  开始投票
                </Button>
              )}
              {globalVotingStatus === "进行中" && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={pauseVoting}>
                    <Pause className="h-4 w-4 mr-2" />
                    暂停投票
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Square className="h-4 w-4 mr-2" />
                        结束投票
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认结束投票</AlertDialogTitle>
                        <AlertDialogDescription>
                          结束投票后将无法恢复投票，确定要结束吗？
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={endVoting}>确认结束</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
              {globalVotingStatus === "已暂停" && (
                <Button onClick={() => setGlobalVotingStatus("进行中")} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4 mr-2" />
                  恢复投票
                </Button>
              )}
              {globalVotingStatus === "已结束" && (
                <Button onClick={() => router.push(`/ethic-review/meeting-setup/voting/${params.id}/results`)} className="bg-purple-600 hover:bg-purple-700">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  查看结果
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 投票概览 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  投票概览
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{overallStats.totalVotes}</div>
                    <div className="text-sm text-gray-600">总投票数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{overallStats.totalAgree}</div>
                    <div className="text-sm text-gray-600">同意票</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{overallStats.totalDisagree}</div>
                    <div className="text-sm text-gray-600">不同意票</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{overallStats.totalModify}</div>
                    <div className="text-sm text-gray-600">需修改票</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>总体进度</span>
                    <span>{Math.round(calculateOverallProgress())}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${calculateOverallProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 项目投票列表 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    项目投票列表
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      共 {filteredProjects.length} 个项目
                    </span>
                  </div>
                </div>
                
                {/* 筛选器 */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="搜索项目名称、受理号、负责人或部门..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="投票状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="全部状态">全部状态</SelectItem>
                        <SelectItem value="未开始">未开始</SelectItem>
                        <SelectItem value="进行中">进行中</SelectItem>
                        <SelectItem value="已暂停">已暂停</SelectItem>
                        <SelectItem value="已结束">已结束</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentProjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>没有找到匹配的项目</p>
                    </div>
                  ) : (
                    currentProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{project.title}</h3>
                            <Badge variant="outline" className={getVotingStatusColor(project.votingStatus)}>
                              {project.votingStatus}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>受理号：{project.acceptanceNumber}</span>
                            <span>负责人：{project.projectLeader}</span>
                            <span>部门：{project.department}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* 查看详情 - 所有状态都有 */}
                              <DropdownMenuItem onClick={() => handleViewProjectDetail(project)}>
                                <Eye className="h-4 w-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              
                              {/* 未开始状态的操作 */}
                              {project.votingStatus === "未开始" && (
                                <DropdownMenuItem onClick={() => handleStartProjectVoting(project)}>
                                  <Play className="h-4 w-4 mr-2" />
                                  开始投票
                                </DropdownMenuItem>
                              )}
                              
                              {/* 进行中状态的操作 */}
                              {project.votingStatus === "进行中" && (
                                <>
                                  <DropdownMenuItem onClick={() => handlePauseProjectVoting(project)}>
                                    <Pause className="h-4 w-4 mr-2" />
                                    暂停投票
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRevote(project)}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    重新投票
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {/* 已暂停状态的操作 */}
                              {project.votingStatus === "已暂停" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleResumeProjectVoting(project)}>
                                    <Play className="h-4 w-4 mr-2" />
                                    恢复投票
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRevote(project)}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    重新投票
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {/* 已结束状态的操作 */}
                              {project.votingStatus === "已结束" && (
                                <DropdownMenuItem onClick={() => handleRevote(project)}>
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  重新投票
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      {/* 投票统计 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-600">同意</span>
                            <span className="text-sm font-medium">{project.votes.agree}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-gray-600">不同意</span>
                            <span className="text-sm font-medium">{project.votes.disagree}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-sm text-gray-600">需修改</span>
                            <span className="text-sm font-medium">{project.votes.modify}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {project.votes.total}/{meetingData.participants.length}
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                </div>
                
                {/* 分页组件 */}
                {filteredProjects.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      显示第 {startIndex + 1} 到 {Math.min(endIndex, filteredProjects.length)} 项，共 {filteredProjects.length} 项
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        上一页
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        下一页
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧侧边栏 */}
          <div className="space-y-6">
            {/* 会议信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">会议信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{meetingData.date} {meetingData.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{meetingData.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{meetingData.participants.length} 人参会</span>
                </div>
              </CardContent>
            </Card>

            {/* 投票设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">投票设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="anonymous" className="text-sm font-medium">
                    匿名投票
                  </Label>
                  <Switch
                    id="anonymous"
                    checked={votingSettings.isAnonymous}
                    onCheckedChange={(checked) => 
                      setVotingSettings(prev => ({ ...prev, isAnonymous: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="changeVote" className="text-sm font-medium">
                    允许修改投票
                  </Label>
                  <Switch
                    id="changeVote"
                    checked={votingSettings.allowChangeVote}
                    onCheckedChange={(checked) => 
                      setVotingSettings(prev => ({ ...prev, allowChangeVote: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="realTimeResults" className="text-sm font-medium">
                    实时显示结果
                  </Label>
                  <Switch
                    id="realTimeResults"
                    checked={votingSettings.showRealTimeResults}
                    onCheckedChange={(checked) => 
                      setVotingSettings(prev => ({ ...prev, showRealTimeResults: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireAll" className="text-sm font-medium">
                    要求全员投票
                  </Label>
                  <Switch
                    id="requireAll"
                    checked={votingSettings.requireAllVotes}
                    onCheckedChange={(checked) => 
                      setVotingSettings(prev => ({ ...prev, requireAllVotes: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* 参会人员投票状态 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">参会人员</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meetingData.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {participant.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{participant.name}</div>
                          <div className="text-xs text-gray-500">{participant.department}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {participant.hasVoted ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-500">
                          {participant.hasVoted ? "已投票" : "未投票"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 项目详情对话框 */}
      <Dialog open={showProjectDetail} onOpenChange={setShowProjectDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>项目详情</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{selectedProject.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">受理号：</span>
                    <span>{selectedProject.acceptanceNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">项目负责人：</span>
                    <span>{selectedProject.projectLeader}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">所属部门：</span>
                    <span>{selectedProject.department}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">项目类型：</span>
                    <span>{selectedProject.type}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 投票状态 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">投票状态</h4>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline" className={getVotingStatusColor(selectedProject.votingStatus)}>
                    {selectedProject.votingStatus}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    已投票：{selectedProject.votes.total}/{meetingData.participants.length} 人
                  </span>
                </div>
                
                {/* 投票统计 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedProject.votes.agree}</div>
                    <div className="text-sm text-gray-600">同意</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{selectedProject.votes.disagree}</div>
                    <div className="text-sm text-gray-600">不同意</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{selectedProject.votes.modify}</div>
                    <div className="text-sm text-gray-600">需修改</div>
                  </div>
                </div>
              </div>

              {selectedProject.voterDetails && selectedProject.voterDetails.length > 0 && (
                <>
                  <Separator />
                  
                  {/* 投票历史 */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">投票历史</h4>
                    <div className="space-y-3">
                      {selectedProject.voterDetails.map((voter: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                            {voter.voterName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{voter.voterName}</span>
                              <Badge variant="outline" className={
                                voter.vote === "agree" ? "text-green-600 border-green-300" :
                                voter.vote === "disagree" ? "text-red-600 border-red-300" :
                                "text-amber-600 border-amber-300"
                              }>
                                {voter.vote === "agree" ? "同意" : voter.vote === "disagree" ? "不同意" : "需修改"}
                              </Badge>
                            </div>
                            {voter.comment && (
                              <p className="text-sm text-gray-600">{voter.comment}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 