"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { OpinionSummaryDrawer } from "@/components/opinion-summary-drawer"
import { ArrowLeft, Calendar, Download, FileText, Users, ClipboardCheck, MessageSquare } from "lucide-react"
import { format } from "date-fns"

// 模拟项目详情数据
const mockProjectDetail = {
  id: "proj-1",
  name: "2023年国家社会科学基金项目子项目",
  description: "国家社会科学基金项目申报与管理系统的研究与实现",
  type: "国家级",
  category: "社会科学",
  status: "评审中",
  applicant: {
    id: "1",
    name: "陈教授",
    avatar: "/placeholder.svg?height=40&width=40",
    department: "社会科学学院",
    title: "教授",
    email: "chen@example.com",
    phone: "13800138000",
  },
  amount: 37.35,
  score: 81,
  date: "2023-05-10",
  deadline: "2023-06-30",
  batchNumber: "2023-SS-01",
  batchName: "2023年国家社会科学基金项目",
  reviewers: [
    { id: "expert-1", name: "张教授", department: "计算机科学学院", currentScore: 83 },
    { id: "expert-2", name: "李研究员", department: "信息科学研究所", currentScore: 78 },
    { id: "expert-3", name: "王教授", department: "社会科学学院", currentScore: 80 },
    { id: "expert-4", name: "赵研究员", department: "工程技术研究院", currentScore: 81 },
    { id: "expert-5", name: "陈教授", department: "经济管理学院", currentScore: 85 },
  ],
  documents: [
    { id: "doc-1", name: "申报书.pdf", size: "2.5MB", date: "2023-04-15" },
    { id: "doc-2", name: "研究计划.docx", size: "1.2MB", date: "2023-04-15" },
    { id: "doc-3", name: "预算说明.xlsx", size: "0.8MB", date: "2023-04-15" },
    { id: "doc-4", name: "团队介绍.pdf", size: "1.5MB", date: "2023-04-15" },
  ],
  timeline: [
    { id: "1", event: "项目申报", date: "2023-04-15", status: "已完成" },
    { id: "2", event: "初审通过", date: "2023-04-20", status: "已完成" },
    { id: "3", event: "分配评审专家", date: "2023-04-25", status: "已完成" },
    { id: "4", event: "专家评审", date: "2023-05-10", status: "进行中" },
    { id: "5", event: "评审结果汇总", date: "2023-06-15", status: "待处理" },
    { id: "6", event: "公布结果", date: "2023-06-30", status: "待处理" },
  ],
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isOpinionSummaryOpen, setIsOpinionSummaryOpen] = useState(false)

  // 加载项目数据
  useEffect(() => {
    // 在实际应用中，这里应该从API获取数据
    // 这里使用模拟数据
    setProject(mockProjectDetail)
  }, [params.id])

  // 处理保存评审意见汇总
  const handleSaveSummary = (projectId: string, summaryData: any) => {
    console.log("保存评审意见汇总", projectId, summaryData)
    // 在实际应用中，这里应该调用API保存数据
    setIsOpinionSummaryOpen(false)
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载项目详情...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
      <div
        className="absolute top-0 left-0 right-0 h-[300px] -z-10"
        style={{
          background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
        }}
      ></div>

      <div className="flex items-center justify-between px-4 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => router.push("/applications/review-projects")}
        >
          <ArrowLeft className="h-4 w-4" />
          返回项目列表
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsOpinionSummaryOpen(true)}
          >
            <MessageSquare className="h-4 w-4" />
            意见汇总
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            下载申报书
          </Button>
          <Button variant="default" size="sm" className="flex items-center gap-1">
            <ClipboardCheck className="h-4 w-4" />
            评审项目
          </Button>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="text-muted-foreground mt-1">{project.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {project.batchName}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {project.type}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {project.category}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">申报人</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={project.applicant.avatar} />
                        <AvatarFallback>{project.applicant.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{project.applicant.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">申报金额</p>
                    <p className="font-medium mt-1">{project.amount.toFixed(2)} 万元</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">截止日期</p>
                    <p className="font-medium mt-1">{format(new Date(project.deadline), "yyyy/MM/dd")}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">评审状态</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="warning">{project.status}</Badge>
                      <span className="text-sm">
                        {project.reviewers.filter((r) => r.currentScore).length}/{project.reviewers.length} 已评
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">项目概览</TabsTrigger>
                <TabsTrigger value="reviewers">评审专家</TabsTrigger>
                <TabsTrigger value="documents">申报材料</TabsTrigger>
                <TabsTrigger value="timeline">评审进度</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>项目信息</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">项目名称:</span>
                          <span className="font-medium">{project.name}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">项目类型:</span>
                          <span>{project.type}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">项目类别:</span>
                          <span>{project.category}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">批次编号:</span>
                          <span>{project.batchNumber}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">批次名称:</span>
                          <span>{project.batchName}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">申报人:</span>
                          <span className="font-medium">{project.applicant.name}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">所属部门:</span>
                          <span>{project.applicant.department}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">申报金额:</span>
                          <span>{project.amount.toFixed(2)} 万元</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">申报日期:</span>
                          <span>{format(new Date(project.date), "yyyy/MM/dd")}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">截止日期:</span>
                          <span>{format(new Date(project.deadline), "yyyy/MM/dd")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>评审进度</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">评审完成率</span>
                          <span className="text-sm font-medium">
                            {project.reviewers.filter((r) => r.currentScore).length}/{project.reviewers.length}
                          </span>
                        </div>
                        <Progress
                          value={
                            (project.reviewers.filter((r) => r.currentScore).length / project.reviewers.length) * 100
                          }
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">当前平均分</span>
                          <span className="text-sm font-medium">{project.score} 分</span>
                        </div>
                        <Progress value={project.score} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviewers">
                <Card>
                  <CardHeader>
                    <CardTitle>评审专家</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.reviewers.map((reviewer) => (
                        <Card key={reviewer.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-4 flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{reviewer.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{reviewer.name}</p>
                                <p className="text-sm text-muted-foreground">{reviewer.department}</p>
                              </div>
                            </div>
                            <div className="px-4 pb-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">评分状态</span>
                                {reviewer.currentScore ? (
                                  <Badge variant="success" className="flex items-center gap-1">
                                    已评分
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    未评分
                                  </Badge>
                                )}
                              </div>
                              {reviewer.currentScore && (
                                <div className="mt-2">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">评分</span>
                                    <span className="text-sm font-medium">{reviewer.currentScore} 分</span>
                                  </div>
                                  <Progress value={reviewer.currentScore} className="h-2" />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>申报材料</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.size} · 上传于 {format(new Date(doc.date), "yyyy/MM/dd")}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>评审进度</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {project.timeline.map((item, index) => (
                        <div key={item.id} className="flex mb-6 last:mb-0">
                          <div className="flex flex-col items-center mr-4">
                            <div
                              className={`rounded-full h-8 w-8 flex items-center justify-center ${
                                item.status === "已完成"
                                  ? "bg-primary text-primary-foreground"
                                  : item.status === "进行中"
                                    ? "bg-warning text-warning-foreground"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {index + 1}
                            </div>
                            {index < project.timeline.length - 1 && (
                              <div
                                className={`w-0.5 h-full ${item.status === "已完成" ? "bg-primary" : "bg-muted"}`}
                              ></div>
                            )}
                          </div>
                          <div className="pt-1">
                            <h4 className="font-medium">{item.event}</h4>
                            <p className="text-sm text-muted-foreground">{format(new Date(item.date), "yyyy/MM/dd")}</p>
                            <Badge
                              variant={
                                item.status === "已完成" ? "success" : item.status === "进行中" ? "warning" : "outline"
                              }
                              className="mt-1"
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <OpinionSummaryDrawer
        isOpen={isOpinionSummaryOpen}
        onClose={() => setIsOpinionSummaryOpen(false)}
        project={project}
        onSaveSummary={handleSaveSummary}
      />
    </div>
  )
}

