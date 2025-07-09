"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText,
  Calendar,
  MapPin,
  Download,
  Eye
} from "lucide-react"

// 模拟会议数据
const getMeetingData = (id: string) => {
  return {
    id: id,
    meetingId: "MTG-2024-001",
    title: "2024年第一季度初始审查会议",
    date: "2024-03-15",
    time: "14:00-17:00",
    venue: "学术报告厅",
    organizer: {
      name: "张三",
      avatar: "/avatars/01.png"
    },
    committee: "医学伦理委员会",
    participants: [
      { id: "1", name: "张三", role: "主席", department: "医学院", hasVoted: true },
      { id: "2", name: "李四", role: "委员", department: "生物学院", hasVoted: true },
      { id: "3", name: "王五", role: "委员", department: "药学院", hasVoted: true },
      { id: "4", name: "赵六", role: "委员", department: "护理学院", hasVoted: true },
      { id: "5", name: "钱七", role: "委员", department: "公共卫生学院", hasVoted: true },
      { id: "6", name: "孙八", role: "委员", department: "基础医学院", hasVoted: true },
      { id: "7", name: "周九", role: "委员", department: "临床医学院", hasVoted: true },
    ],
    status: "已结束",
    votingStatus: "已结束"
  }
}

// 模拟投票结果数据
const getVotingResults = () => {
  return [
    {
      id: "1",
      title: "转基因小鼠模型在神经退行性疾病中的应用",
      acceptanceNumber: "MR-2024-001",
      projectLeader: "张教授",
      department: "神经科学研究所",
      type: "会议审查",
      finalResult: "通过",
      votes: {
        agree: 5,
        disagree: 1,
        modify: 1,
        total: 7
      },
      passRate: 71.4,
      voterDetails: [
        { voterId: "1", voterName: "张三", vote: "agree", timestamp: "2024-03-15 14:30" },
        { voterId: "2", voterName: "李四", vote: "agree", timestamp: "2024-03-15 14:35" },
        { voterId: "3", voterName: "王五", vote: "agree", timestamp: "2024-03-15 14:40" },
        { voterId: "4", voterName: "赵六", vote: "modify", timestamp: "2024-03-15 14:45" },
        { voterId: "5", voterName: "钱七", vote: "agree", timestamp: "2024-03-15 14:50" },
        { voterId: "6", voterName: "孙八", vote: "disagree", timestamp: "2024-03-15 14:55" },
        { voterId: "7", voterName: "周九", vote: "agree", timestamp: "2024-03-15 15:00" }
      ]
    },
    {
      id: "2",
      title: "新型抗癌药物的临床前研究",
      acceptanceNumber: "MR-2024-002",
      projectLeader: "陈博士",
      department: "肿瘤研究中心",
      type: "会议审查",
      finalResult: "通过",
      votes: {
        agree: 6,
        disagree: 0,
        modify: 1,
        total: 7
      },
      passRate: 85.7,
      voterDetails: [
        { voterId: "1", voterName: "张三", vote: "agree", timestamp: "2024-03-15 15:05" },
        { voterId: "2", voterName: "李四", vote: "agree", timestamp: "2024-03-15 15:10" },
        { voterId: "3", voterName: "王五", vote: "agree", timestamp: "2024-03-15 15:15" },
        { voterId: "4", voterName: "赵六", vote: "agree", timestamp: "2024-03-15 15:20" },
        { voterId: "5", voterName: "钱七", vote: "modify", timestamp: "2024-03-15 15:25" },
        { voterId: "6", voterName: "孙八", vote: "agree", timestamp: "2024-03-15 15:30" },
        { voterId: "7", voterName: "周九", vote: "agree", timestamp: "2024-03-15 15:35" }
      ]
    },
    {
      id: "3",
      title: "基因编辑技术在遗传病治疗中的应用",
      acceptanceNumber: "MR-2024-003",
      projectLeader: "刘主任",
      department: "遗传学实验室",
      type: "会议审查",
      finalResult: "需修改",
      votes: {
        agree: 2,
        disagree: 1,
        modify: 4,
        total: 7
      },
      passRate: 28.6,
      voterDetails: [
        { voterId: "1", voterName: "张三", vote: "modify", timestamp: "2024-03-15 15:40" },
        { voterId: "2", voterName: "李四", vote: "modify", timestamp: "2024-03-15 15:45" },
        { voterId: "3", voterName: "王五", vote: "agree", timestamp: "2024-03-15 15:50" },
        { voterId: "4", voterName: "赵六", vote: "modify", timestamp: "2024-03-15 15:55" },
        { voterId: "5", voterName: "钱七", vote: "disagree", timestamp: "2024-03-15 16:00" },
        { voterId: "6", voterName: "孙八", vote: "modify", timestamp: "2024-03-15 16:05" },
        { voterId: "7", voterName: "周九", vote: "agree", timestamp: "2024-03-15 16:10" }
      ]
    },
    {
      id: "4",
      title: "干细胞治疗心肌梗死的安全性评估",
      acceptanceNumber: "MR-2024-004",
      projectLeader: "王主任",
      department: "心血管研究所",
      type: "会议审查",
      finalResult: "不通过",
      votes: {
        agree: 1,
        disagree: 5,
        modify: 1,
        total: 7
      },
      passRate: 14.3,
      voterDetails: [
        { voterId: "1", voterName: "张三", vote: "disagree", timestamp: "2024-03-15 16:15" },
        { voterId: "2", voterName: "李四", vote: "disagree", timestamp: "2024-03-15 16:20" },
        { voterId: "3", voterName: "王五", vote: "disagree", timestamp: "2024-03-15 16:25" },
        { voterId: "4", voterName: "赵六", vote: "agree", timestamp: "2024-03-15 16:30" },
        { voterId: "5", voterName: "钱七", vote: "disagree", timestamp: "2024-03-15 16:35" },
        { voterId: "6", voterName: "孙八", vote: "modify", timestamp: "2024-03-15 16:40" },
        { voterId: "7", voterName: "周九", vote: "disagree", timestamp: "2024-03-15 16:45" }
      ]
    },
    {
      id: "5",
      title: "人工智能辅助诊断系统的临床验证",
      acceptanceNumber: "MR-2024-005",
      projectLeader: "李研究员",
      department: "医学影像科",
      type: "会议审查",
      finalResult: "通过",
      votes: {
        agree: 6,
        disagree: 0,
        modify: 1,
        total: 7
      },
      passRate: 85.7,
      voterDetails: [
        { voterId: "1", voterName: "张三", vote: "agree", timestamp: "2024-03-15 16:50" },
        { voterId: "2", voterName: "李四", vote: "agree", timestamp: "2024-03-15 16:55" },
        { voterId: "3", voterName: "王五", vote: "agree", timestamp: "2024-03-15 17:00" },
        { voterId: "4", voterName: "赵六", vote: "agree", timestamp: "2024-03-15 17:05" },
        { voterId: "5", voterName: "钱七", vote: "modify", timestamp: "2024-03-15 17:10" },
        { voterId: "6", voterName: "孙八", vote: "agree", timestamp: "2024-03-15 17:15" },
        { voterId: "7", voterName: "周九", vote: "agree", timestamp: "2024-03-15 17:20" }
      ]
    }
  ]
}

export default function VotingResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [meetingData, setMeetingData] = useState(getMeetingData(params.id))
  const [votingResults, setVotingResults] = useState(getVotingResults())

  // 计算总体统计
  const calculateOverallStats = () => {
    const totalProjects = votingResults.length
    const totalVotes = votingResults.reduce((sum, project) => sum + project.votes.total, 0)
    const totalAgree = votingResults.reduce((sum, project) => sum + project.votes.agree, 0)
    const totalDisagree = votingResults.reduce((sum, project) => sum + project.votes.disagree, 0)
    const totalModify = votingResults.reduce((sum, project) => sum + project.votes.modify, 0)
    
    const passedProjects = votingResults.filter(p => p.finalResult === "通过").length
    const modifyProjects = votingResults.filter(p => p.finalResult === "需修改").length
    const rejectedProjects = votingResults.filter(p => p.finalResult === "不通过").length
    
    const averagePassRate = totalProjects > 0 ? 
      votingResults.reduce((sum, project) => sum + project.passRate, 0) / totalProjects : 0
    
    return {
      totalProjects,
      totalVotes,
      totalAgree,
      totalDisagree,
      totalModify,
      passedProjects,
      modifyProjects,
      rejectedProjects,
      averagePassRate,
      participationRate: meetingData.participants.length > 0 ? 
        (meetingData.participants.filter(p => p.hasVoted).length / meetingData.participants.length) * 100 : 0
    }
  }

  const stats = calculateOverallStats()

  // 获取结果颜色
  const getResultColor = (result: string) => {
    const colors = {
      "通过": "bg-green-50 text-green-700 border-green-200",
      "需修改": "bg-amber-50 text-amber-700 border-amber-200",
      "不通过": "bg-red-50 text-red-700 border-red-200"
    }
    return colors[result as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const getResultIcon = (result: string) => {
    const icons = {
      "通过": <CheckCircle className="h-4 w-4" />,
      "需修改": <AlertTriangle className="h-4 w-4" />,
      "不通过": <XCircle className="h-4 w-4" />
    }
    return icons[result as keyof typeof icons] || <FileText className="h-4 w-4" />
  }

  // 导出报告
  const exportReport = () => {
    // 这里可以实现导出功能
    console.log("导出投票结果报告")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">投票结果统计</h1>
                <p className="text-sm text-gray-600">{meetingData.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                投票已结束
              </Badge>
              <Button onClick={exportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出报告
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 会议信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                会议信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">会议时间：</span>
                    {meetingData.date} {meetingData.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">会议场地：</span>
                    {meetingData.venue}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">参会人数：</span>
                    {meetingData.participants.length} 人
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 总体统计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  总体统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">审查项目</span>
                    <span className="font-medium">{stats.totalProjects} 项</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">总投票数</span>
                    <span className="font-medium">{stats.totalVotes} 票</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">参与率</span>
                    <span className="font-medium">{stats.participationRate.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  通过项目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600">{stats.passedProjects}</div>
                  <div className="text-sm text-gray-600">
                    占比 {((stats.passedProjects / stats.totalProjects) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    同意票：{stats.totalAgree} 票
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  需修改项目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-amber-600">{stats.modifyProjects}</div>
                  <div className="text-sm text-gray-600">
                    占比 {((stats.modifyProjects / stats.totalProjects) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    修改票：{stats.totalModify} 票
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  不通过项目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-red-600">{stats.rejectedProjects}</div>
                  <div className="text-sm text-gray-600">
                    占比 {((stats.rejectedProjects / stats.totalProjects) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    反对票：{stats.totalDisagree} 票
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 详细结果 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                项目投票详情
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>项目名称</TableHead>
                      <TableHead>受理号</TableHead>
                      <TableHead>负责人</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead className="text-center">同意</TableHead>
                      <TableHead className="text-center">不同意</TableHead>
                      <TableHead className="text-center">需修改</TableHead>
                      <TableHead className="text-center">通过率</TableHead>
                      <TableHead className="text-center">最终结果</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {votingResults.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate" title={project.title}>
                            {project.title}
                          </div>
                        </TableCell>
                        <TableCell>{project.acceptanceNumber}</TableCell>
                        <TableCell>{project.projectLeader}</TableCell>
                        <TableCell>{project.department}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-green-600 font-medium">{project.votes.agree}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-red-600 font-medium">{project.votes.disagree}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-amber-600 font-medium">{project.votes.modify}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{project.passRate.toFixed(1)}%</span>
                            <Progress value={project.passRate} className="h-2 w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getResultColor(project.finalResult)}>
                            <div className="flex items-center gap-1">
                              {getResultIcon(project.finalResult)}
                              {project.finalResult}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/ethic-review/meeting-setup/voting/${params.id}/project/${project.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 投票趋势分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  投票分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">同意票</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stats.totalAgree}</span>
                      <span className="text-sm text-gray-500">
                        ({((stats.totalAgree / stats.totalVotes) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">不同意票</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stats.totalDisagree}</span>
                      <span className="text-sm text-gray-500">
                        ({((stats.totalDisagree / stats.totalVotes) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm">需修改票</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stats.totalModify}</span>
                      <span className="text-sm text-gray-500">
                        ({((stats.totalModify / stats.totalVotes) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  审查结果分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">通过项目</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stats.passedProjects}</span>
                      <span className="text-sm text-gray-500">
                        ({((stats.passedProjects / stats.totalProjects) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">需修改项目</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stats.modifyProjects}</span>
                      <span className="text-sm text-gray-500">
                        ({((stats.modifyProjects / stats.totalProjects) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">不通过项目</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stats.rejectedProjects}</span>
                      <span className="text-sm text-gray-500">
                        ({((stats.rejectedProjects / stats.totalProjects) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 