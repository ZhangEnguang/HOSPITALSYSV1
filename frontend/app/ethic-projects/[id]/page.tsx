"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockEthicProjects } from "../data/ethic-project-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Users, Wallet, Clock, FileText, ClipboardCheck, Microscope, TestTubes } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export default function EthicProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 模拟API调用获取项目详情
    const getProjectDetail = () => {
      setLoading(true)
      try {
        // 从模拟数据中查找项目
        const foundProject = mockEthicProjects.find(p => p.id === params.id)
        
        if (foundProject) {
          setProject(foundProject)
        } else {
          toast({
            title: "未找到项目",
            description: "无法找到指定的伦理项目，请返回项目列表重试",
            variant: "destructive",
          })
          // 延迟跳转回项目列表
          setTimeout(() => {
            router.push("/ethic-projects")
          }, 2000)
        }
      } catch (error) {
        console.error("获取项目详情失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载伦理项目详情，请稍后再试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getProjectDetail()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">加载项目详情...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <p className="mt-4 text-muted-foreground">未找到项目，正在返回项目列表...</p>
          </div>
        </div>
      </div>
    )
  }

  // 项目类型对应的图标
  const projectTypeIcon = project.type === "动物伦理" 
    ? <Microscope className="h-5 w-5 text-blue-500" /> 
    : <TestTubes className="h-5 w-5 text-green-500" />;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 项目基本信息 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {projectTypeIcon}
                    <Badge variant="outline">{project.type}</Badge>
                    <Badge variant="outline">{project.source}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{project.name}</CardTitle>
                </div>
                <Badge 
                  className={
                    project.status === "进行中" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                    project.status === "规划中" ? "bg-blue-100 text-blue-800 border-blue-300" :
                    "bg-green-100 text-green-800 border-green-300"
                  }
                >
                  {project.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={project.leader.avatar} />
                    <AvatarFallback>{project.leader.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{project.leader.name}</div>
                    <div className="text-xs text-muted-foreground">项目负责人</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{project.members} 名团队成员</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">¥{project.budget.toLocaleString()}</span>
                </div>
              </div>
              <CardDescription className="mt-4">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="text-sm text-muted-foreground mb-1">项目编号</div>
                    <div className="font-medium">{project.projectNumber}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="text-sm text-muted-foreground mb-1">优先级</div>
                    <div className="font-medium">{project.priority}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="text-sm text-muted-foreground mb-1">审核状态</div>
                    <div className="font-medium">{project.auditStatus}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">项目进度</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>完成进度</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>已完成任务: {project.tasks.completed}/{project.tasks.total}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {project.startDate} - {project.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>项目详情</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary">
                <TabsList className="mb-4">
                  <TabsTrigger value="summary">摘要</TabsTrigger>
                  <TabsTrigger value="ethical">伦理审批</TabsTrigger>
                  <TabsTrigger value="documents">相关文档</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-2">项目背景</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.type === "动物伦理" 
                        ? `该项目涉及到${project.name.includes("小鼠") ? "小鼠" : project.name.includes("犬") ? "犬类" : project.name.includes("猪") ? "猪" : "实验动物"}的实验研究，需要严格遵循动物伦理规范，确保实验动物的福利和最小化痛苦原则。` 
                        : `该项目涉及到人体样本采集和临床研究，需要严格遵循人体伦理规范，确保参与者知情同意、隐私保护和安全第一原则。`}
                      本项目已获得{project.source}支持，预计在{project.endDate.split('-')[0]}年完成。
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-2">主要目标</h3>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                      <li>制定符合国际标准的伦理规范和操作流程</li>
                      <li>确保研究过程中{project.type === "动物伦理" ? "动物福利" : "参与者权益"}得到充分保障</li>
                      <li>形成可推广的伦理审批和监督标准</li>
                      <li>提高研究成果的伦理合规性和国际认可度</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="ethical" className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-2">伦理审批流程</h3>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">1</div>
                      <div className="h-0.5 flex-grow bg-gray-200"></div>
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">2</div>
                      <div className="h-0.5 flex-grow bg-gray-200"></div>
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">3</div>
                      <div className="h-0.5 flex-grow bg-gray-200"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">4</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <div className="flex-1 text-center">申请提交</div>
                      <div className="flex-1 text-center">初审</div>
                      <div className="flex-1 text-center">专家评审</div>
                      <div className="flex-1 text-center">终审</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-2">审批历史</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                          <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">申请提交</div>
                          <div className="text-xs text-muted-foreground">2024-01-10 10:30</div>
                          <div className="text-sm mt-1">项目负责人提交了伦理审批申请</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                          <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">初审通过</div>
                          <div className="text-xs text-muted-foreground">2024-01-15 14:20</div>
                          <div className="text-sm mt-1">伦理委员会秘书处完成资料审核，初审通过</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 flex-shrink-0">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto"></div>
                          <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">专家评审中</div>
                          <div className="text-xs text-muted-foreground">2024-01-20 09:45</div>
                          <div className="text-sm mt-1">已分配3名专家进行独立评审，等待评审结果</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="documents" className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-2">相关文档</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="flex-grow">
                          <div className="text-sm font-medium">伦理审批申请书</div>
                          <div className="text-xs text-muted-foreground">PDF文档 · 2.4MB · 2024-01-10</div>
                        </div>
                        <Button variant="outline" size="sm">查看</Button>
                      </div>
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                        <FileText className="h-5 w-5 text-green-500 mr-3" />
                        <div className="flex-grow">
                          <div className="text-sm font-medium">研究方案</div>
                          <div className="text-xs text-muted-foreground">Word文档 · 1.8MB · 2024-01-10</div>
                        </div>
                        <Button variant="outline" size="sm">查看</Button>
                      </div>
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                        <FileText className="h-5 w-5 text-purple-500 mr-3" />
                        <div className="flex-grow">
                          <div className="text-sm font-medium">{project.type === "动物伦理" ? "动物福利保障计划" : "知情同意书模板"}</div>
                          <div className="text-xs text-muted-foreground">PDF文档 · 1.2MB · 2024-01-10</div>
                        </div>
                        <Button variant="outline" size="sm">查看</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 右侧信息栏 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>项目信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">项目编号</span>
                <span className="text-sm font-medium">{project.projectNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">项目类型</span>
                <span className="text-sm font-medium">{project.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">项目来源</span>
                <span className="text-sm font-medium">{project.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">项目状态</span>
                <span className="text-sm font-medium">{project.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">审核状态</span>
                <span className="text-sm font-medium">{project.auditStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">优先级</span>
                <span className="text-sm font-medium">{project.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">团队成员</span>
                <span className="text-sm font-medium">{project.members} 人</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">预算金额</span>
                <span className="text-sm font-medium">¥{project.budget.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">开始日期</span>
                  <span className="text-sm font-medium">{project.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">结束日期</span>
                  <span className="text-sm font-medium">{project.endDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => {
                const projectType = project.type === "动物伦理" ? 'animal' : 'human';
                router.push(`/ethic-projects/edit/${projectType}/${project.id}`);
              }}>
                编辑项目
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "下载项目文档",
                    description: "正在准备下载项目相关文档...",
                  })
                }}
              >
                下载文档
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "提交审核表单",
                    description: "跳转到审核表单提交页面...",
                  })
                }}
              >
                提交审核表单
              </Button>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "操作需确认",
                    description: "您需要联系管理员以删除该项目",
                    variant: "destructive",
                  })
                }}
              >
                申请删除
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 