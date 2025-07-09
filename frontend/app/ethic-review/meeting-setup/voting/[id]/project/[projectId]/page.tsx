"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  ArrowLeft, 
  Vote, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  FileText,
  Calendar,
  MapPin,
  User,
  Building,
  MessageSquare,
  History,
  BarChart3
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// 模拟项目详细数据
const getProjectData = (projectId: string) => {
  const projects = {
    "1": {
      id: "1",
      title: "转基因小鼠模型在神经退行性疾病中的应用",
      acceptanceNumber: "MR-2024-001",
      projectLeader: "张教授",
      department: "神经科学研究所",
      email: "zhang@university.edu",
      phone: "13800138001",
      type: "会议审查",
      description: "本研究旨在建立转基因小鼠模型，用于神经退行性疾病的研究。通过基因编辑技术，我们将构建多种疾病模型，包括阿尔茨海默病、帕金森病等，为相关疾病的机制研究和药物开发提供重要工具。",
      researchObjectives: [
        "建立稳定的转基因小鼠模型",
        "验证模型的疾病特征",
        "评估模型的安全性和有效性",
        "为后续研究提供标准化工具"
      ],
      ethicalConsiderations: [
        "严格遵循3R原则（替代、减少、优化）",
        "确保实验动物福利",
        "最小化动物痛苦",
        "建立完善的监管体系"
      ],
      votingStatus: "进行中",
      votes: {
        agree: 3,
        disagree: 1,
        modify: 2,
        total: 6
      },
      voterDetails: [
        { 
          voterId: "1", 
          voterName: "张三",
          vote: "agree", 
          timestamp: "2024-03-15 14:30",
          comment: "研究方案设计合理，符合伦理要求"
        },
        { 
          voterId: "3", 
          voterName: "王五",
          vote: "agree", 
          timestamp: "2024-03-15 14:35",
          comment: "实验设计科学，预期效果良好"
        },
        { 
          voterId: "5", 
          voterName: "钱七",
          vote: "modify", 
          timestamp: "2024-03-15 14:40",
          comment: "建议增加更多的安全性评估措施"
        },
        { 
          voterId: "7", 
          voterName: "周九",
          vote: "agree", 
          timestamp: "2024-03-15 14:45",
          comment: "研究具有重要科学价值"
        },
        { 
          voterId: "2", 
          voterName: "李四",
          vote: "disagree", 
          timestamp: "2024-03-15 14:50",
          comment: "伦理风险评估不够充分"
        },
        { 
          voterId: "4", 
          voterName: "赵六",
          vote: "modify", 
          timestamp: "2024-03-15 14:55",
          comment: "需要完善动物福利保障措施"
        }
      ]
    },
    "2": {
      id: "2",
      title: "新型抗癌药物的临床前研究",
      acceptanceNumber: "MR-2024-002",
      projectLeader: "陈博士",
      department: "肿瘤研究中心",
      email: "chen@university.edu",
      phone: "13800138002",
      type: "会议审查",
      description: "本研究旨在开发新型抗癌药物，通过体外细胞实验和动物模型验证其抗肿瘤效果和安全性。研究将为后续临床试验提供重要数据支持。",
      researchObjectives: [
        "评估新药的抗肿瘤活性",
        "确定最佳给药剂量",
        "评估药物安全性",
        "为临床试验设计提供依据"
      ],
      ethicalConsiderations: [
        "严格的动物实验伦理审查",
        "最小化实验动物使用",
        "确保实验的科学性和必要性",
        "建立完善的监管机制"
      ],
      votingStatus: "进行中",
      votes: {
        agree: 4,
        disagree: 0,
        modify: 1,
        total: 5
      },
      voterDetails: [
        { 
          voterId: "1", 
          voterName: "张三",
          vote: "agree", 
          timestamp: "2024-03-15 15:00",
          comment: "研究具有重要临床价值"
        },
        { 
          voterId: "2", 
          voterName: "李四",
          vote: "agree", 
          timestamp: "2024-03-15 15:05",
          comment: "实验设计合理，风险可控"
        },
        { 
          voterId: "3", 
          voterName: "王五",
          vote: "agree", 
          timestamp: "2024-03-15 15:10",
          comment: "符合伦理要求，支持通过"
        },
        { 
          voterId: "5", 
          voterName: "钱七",
          vote: "modify", 
          timestamp: "2024-03-15 15:15",
          comment: "建议增加更详细的毒性评估"
        },
        { 
          voterId: "7", 
          voterName: "周九",
          vote: "agree", 
          timestamp: "2024-03-15 15:20",
          comment: "研究方案完善，同意通过"
        }
      ]
    }
  }
  
  return projects[projectId as keyof typeof projects] || projects["1"]
}

// 模拟会议参与者数据
const getMeetingParticipants = () => {
  return [
    { id: "1", name: "张三", role: "主席", department: "医学院", hasVoted: true },
    { id: "2", name: "李四", role: "委员", department: "生物学院", hasVoted: true },
    { id: "3", name: "王五", role: "委员", department: "药学院", hasVoted: true },
    { id: "4", name: "赵六", role: "委员", department: "护理学院", hasVoted: true },
    { id: "5", name: "钱七", role: "委员", department: "公共卫生学院", hasVoted: true },
    { id: "6", name: "孙八", role: "委员", department: "基础医学院", hasVoted: false },
    { id: "7", name: "周九", role: "委员", department: "临床医学院", hasVoted: true },
  ]
}

export default function ProjectVotingPage({ params }: { params: { id: string, projectId: string } }) {
  const router = useRouter()
  const [projectData, setProjectData] = useState(getProjectData(params.projectId))
  const [participants, setParticipants] = useState(getMeetingParticipants())
  const [currentUserVote, setCurrentUserVote] = useState<string>("")
  const [voteComment, setVoteComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVoteDialog, setShowVoteDialog] = useState(false)
  
  // 当前用户ID（模拟）
  const currentUserId = "6" // 假设当前用户是孙八
  const currentUser = participants.find(p => p.id === currentUserId)
  
  // 检查当前用户是否已投票
  const userHasVoted = projectData.voterDetails.some(v => v.voterId === currentUserId)
  const userVoteDetail = projectData.voterDetails.find(v => v.voterId === currentUserId)

  // 投票选项
  const voteOptions = [
    { value: "agree", label: "同意", icon: <CheckCircle className="h-4 w-4" />, color: "text-green-600" },
    { value: "disagree", label: "不同意", icon: <XCircle className="h-4 w-4" />, color: "text-red-600" },
    { value: "modify", label: "需要修改", icon: <AlertTriangle className="h-4 w-4" />, color: "text-amber-600" }
  ]

  // 提交投票
  const submitVote = async () => {
    if (!currentUserVote) {
      toast({
        title: "请选择投票选项",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新项目数据
      const newVoteDetail = {
        voterId: currentUserId,
        voterName: currentUser?.name || "未知用户",
        vote: currentUserVote,
        timestamp: new Date().toLocaleString(),
        comment: voteComment
      }
      
      setProjectData(prev => ({
        ...prev,
        voterDetails: [...prev.voterDetails, newVoteDetail],
        votes: {
          ...prev.votes,
          [currentUserVote]: prev.votes[currentUserVote as keyof typeof prev.votes] + 1,
          total: prev.votes.total + 1
        }
      }))
      
      // 更新参与者投票状态
      setParticipants(prev => 
        prev.map(p => 
          p.id === currentUserId ? { ...p, hasVoted: true } : p
        )
      )
      
      setShowVoteDialog(false)
      setCurrentUserVote("")
      setVoteComment("")
      
      toast({
        title: "投票成功",
        description: "您的投票已提交"
      })
    } catch (error) {
      toast({
        title: "投票失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 投票状态颜色
  const getVoteColor = (vote: string) => {
    const colors = {
      "agree": "text-green-600",
      "disagree": "text-red-600",
      "modify": "text-amber-600"
    }
    return colors[vote as keyof typeof colors] || "text-gray-600"
  }

  const getVoteIcon = (vote: string) => {
    const icons = {
      "agree": <CheckCircle className="h-4 w-4" />,
      "disagree": <XCircle className="h-4 w-4" />,
      "modify": <AlertTriangle className="h-4 w-4" />
    }
    return icons[vote as keyof typeof icons] || <Clock className="h-4 w-4" />
  }

  const getVoteLabel = (vote: string) => {
    const labels = {
      "agree": "同意",
      "disagree": "不同意",
      "modify": "需要修改"
    }
    return labels[vote as keyof typeof labels] || "未知"
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
                <h1 className="text-xl font-semibold text-gray-900">项目投票</h1>
                <p className="text-sm text-gray-600">{projectData.acceptanceNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {projectData.votingStatus}
              </Badge>
              {!userHasVoted && projectData.votingStatus === "进行中" && (
                <AlertDialog open={showVoteDialog} onOpenChange={setShowVoteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Vote className="h-4 w-4 mr-2" />
                      投票
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>项目投票</AlertDialogTitle>
                      <AlertDialogDescription>
                        请选择您的投票选项并添加评论
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                      <RadioGroup value={currentUserVote} onValueChange={setCurrentUserVote}>
                        {voteOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className={`flex items-center gap-2 ${option.color}`}>
                              {option.icon}
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <div className="space-y-2">
                        <Label htmlFor="comment">评论（可选）</Label>
                        <Textarea
                          id="comment"
                          placeholder="请输入您的评论..."
                          value={voteComment}
                          onChange={(e) => setVoteComment(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={submitVote} disabled={isSubmitting}>
                        {isSubmitting ? "提交中..." : "提交投票"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {userHasVoted && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  已投票
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 项目基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  项目信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{projectData.title}</h3>
                  <p className="text-gray-600">{projectData.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium">项目负责人：</span>
                      {projectData.projectLeader}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium">所属部门：</span>
                      {projectData.department}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">研究目标</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {projectData.researchObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">伦理考量</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {projectData.ethicalConsiderations.map((consideration, index) => (
                      <li key={index}>{consideration}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 投票历史 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  投票历史
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.voterDetails.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Vote className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>暂无投票记录</p>
                    </div>
                  ) : (
                    projectData.voterDetails.map((vote, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {vote.voterName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{vote.voterName}</span>
                            <div className={`flex items-center gap-1 ${getVoteColor(vote.vote)}`}>
                              {getVoteIcon(vote.vote)}
                              <span className="text-sm font-medium">{getVoteLabel(vote.vote)}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">{vote.timestamp}</div>
                          {vote.comment && (
                            <div className="text-sm text-gray-700 bg-white p-2 rounded border">
                              {vote.comment}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧侧边栏 */}
          <div className="space-y-6">
            {/* 投票统计 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  投票统计
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{projectData.votes.agree}</div>
                    <div className="text-xs text-gray-600">同意</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{projectData.votes.disagree}</div>
                    <div className="text-xs text-gray-600">不同意</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-600">{projectData.votes.modify}</div>
                    <div className="text-xs text-gray-600">需修改</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>投票进度</span>
                    <span>{projectData.votes.total}/{participants.length}</span>
                  </div>
                  <Progress 
                    value={participants.length > 0 ? (projectData.votes.total / participants.length) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* 我的投票 */}
            {userHasVoted && userVoteDetail && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">我的投票</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className={`flex items-center gap-2 ${getVoteColor(userVoteDetail.vote)}`}>
                      {getVoteIcon(userVoteDetail.vote)}
                      <span className="font-medium">{getVoteLabel(userVoteDetail.vote)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      投票时间：{userVoteDetail.timestamp}
                    </div>
                    {userVoteDetail.comment && (
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        <div className="font-medium mb-1">评论：</div>
                        {userVoteDetail.comment}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 参与者投票状态 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  参与者状态
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.map((participant) => (
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
    </div>
  )
} 