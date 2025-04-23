"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, PieChart, History, FileText, Users, Building, Award, Activity, ArrowLeft, Download, BookOpen, Archive, Grid3X3, BarChart4, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function ReviewDashboardPage() {
  const router = useRouter()
  const [batchId, setBatchId] = useState("")
  const [batchName, setBatchName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  // 模拟数据
  const [reviewData, setReviewData] = useState({
    totalProjects: 0,
    approvedProjects: 0,
    rejectedProjects: 0,
    pendingProjects: 0,
    totalExperts: 0,
    completedReviews: 0,
    avgScore: 0,
    topDepartments: [] as { name: string; count: number; approvalRate: number }[],
    topDisciplines: [] as { name: string; count: number; approvalRate: number }[],
    reviewComments: [] as { expertName: string; projectName: string; comment: string; sentiment: "positive" | "negative" | "neutral" }[],
    expertWorkloads: [] as { name: string; assigned: number; completed: number; avgTime: string }[],
    crossAnalysis: [] as { 
      discipline: string; 
      materialReview: number;
      expertAssignment: number;
      initialReview: number;
      finalReview: number;
      summary: number;
    }[],
    projectTypes: [] as { type: string; count: number; approvalRate: number }[],
    historicalData: [] as { 
      year: string;
      totalProjects: number;
      approvalRate: number;
      avgReviewTime: number;
      avgScore: number;
    }[]
  })

  useEffect(() => {
    // 从sessionStorage中获取批次ID和名称
    const storedBatchId = typeof window !== 'undefined' ? sessionStorage.getItem('reviewBatchId') : null
    const storedBatchName = typeof window !== 'undefined' ? sessionStorage.getItem('reviewBatchName') : null
    const storedStats = typeof window !== 'undefined' ? sessionStorage.getItem('reviewStats') : null
    
    if (storedBatchId) {
      setBatchId(storedBatchId)
    }
    
    if (storedBatchName) {
      setBatchName(storedBatchName)
    }
    
    // 模拟数据加载
    setTimeout(() => {
      // 使用存储的统计数据或生成随机数据
      let statsData = {
        totalProjects: 0,
        approvedProjects: 0,
        rejectedProjects: 0,
        pendingProjects: 0,
        totalExperts: 0,
        completedReviews: 0,
        totalReviews: 0,
        reviewProgress: 0
      };
      
      if (storedStats) {
        try {
          statsData = { ...statsData, ...JSON.parse(storedStats) };
        } catch (e) {
          console.error("Failed to parse stored stats:", e);
        }
      }
      
      // 使用真实数据或生成随机数据
      const totalProjects = statsData.totalProjects || Math.floor(Math.random() * 30) + 20;
      const approvedProjects = statsData.approvedProjects || Math.floor(Math.random() * totalProjects * 0.7);
      const rejectedProjects = statsData.rejectedProjects || Math.floor(Math.random() * (totalProjects - approvedProjects) * 0.8);
      const pendingProjects = statsData.pendingProjects || (totalProjects - approvedProjects - rejectedProjects);
      
      const totalExperts = statsData.totalExperts || Math.floor(Math.random() * 20) + 10;
      const completedReviews = statsData.completedReviews || Math.floor(Math.random() * totalProjects * 2.5);
      const avgScore = Math.floor(Math.random() * 20) + 75;
      
      // 部门数据
      const departments = [
        "计算机学院", "电子信息学院", "物理学院", "化学学院", 
        "生物医学工程学院", "材料科学与工程学院", "机械工程学院"
      ]
      
      const topDepartments = departments.map(dept => ({
        name: dept,
        count: Math.floor(Math.random() * 15) + 1,
        approvalRate: Math.floor(Math.random() * 60) + 40
      })).sort((a, b) => b.count - a.count).slice(0, 5)
      
      // 学科数据
      const disciplines = [
        "人工智能", "量子计算", "新材料", "生物技术", 
        "医学影像", "可再生能源", "智能制造", "数据科学"
      ]
      
      const topDisciplines = disciplines.map(disc => ({
        name: disc,
        count: Math.floor(Math.random() * 12) + 1,
        approvalRate: Math.floor(Math.random() * 50) + 50
      })).sort((a, b) => b.count - a.count).slice(0, 5)
      
      // 评审意见
      const comments = [
        "该项目创新性强，研究方法合理，预期成果明确，建议优先支持。",
        "项目内容有一定创新性，但预算规划不够合理，建议适当调整后支持。",
        "项目申请书对研究内容描述不够清晰，缺乏创新点，建议不予支持。",
        "该项目具有重要的理论意义和应用价值，研究团队实力强，推荐立项。",
        "项目提出的技术路线可行性有待进一步论证，建议完善后再审。",
        "研究内容与当前国家需求高度一致，应用前景广阔，强烈推荐支持。",
        "项目创新程度不足，与已有研究重复性较高，不建议立项。",
        "研究计划合理，但风险评估不足，建议条件支持。"
      ]
      
      const sentiments = ["positive", "negative", "neutral"] as const
      const expertNames = ["张教授", "李研究员", "王博士", "刘教授", "陈研究员", "杨博士"]
      const projectNames = ["智能语音识别系统", "新型纳米材料研究", "量子通信技术", "生物医学成像", "区块链安全研究"]
      
      const reviewComments = Array.from({ length: 10 }).map(() => ({
        expertName: expertNames[Math.floor(Math.random() * expertNames.length)],
        projectName: projectNames[Math.floor(Math.random() * projectNames.length)],
        comment: comments[Math.floor(Math.random() * comments.length)],
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)]
      }))
      
      // 专家工作量数据
      const expertWorkloads = [
        { name: "张教授", assigned: 15, completed: 12, avgTime: "1.2天/项" },
        { name: "李研究员", assigned: 10, completed: 8, avgTime: "0.8天/项" },
        { name: "王博士", assigned: 12, completed: 6, avgTime: "1.5天/项" },
        { name: "刘教授", assigned: 10, completed: 10, avgTime: "1.0天/项" },
        { name: "陈研究员", assigned: 8, completed: 7, avgTime: "2.1天/项" },
        { name: "杨博士", assigned: 7, completed: 4, avgTime: "1.8天/项" },
        { name: "郑教授", assigned: 14, completed: 11, avgTime: "1.3天/项" },
        { name: "吴研究员", assigned: 6, completed: 3, avgTime: "2.5天/项" }
      ];
      
      // 项目类型数据
      const projectTypes = [
        { type: "基础研究", count: Math.floor(Math.random() * 15) + 5, approvalRate: Math.floor(Math.random() * 40) + 50 },
        { type: "应用研究", count: Math.floor(Math.random() * 10) + 5, approvalRate: Math.floor(Math.random() * 30) + 60 },
        { type: "技术开发", count: Math.floor(Math.random() * 8) + 4, approvalRate: Math.floor(Math.random() * 20) + 70 },
        { type: "成果转化", count: Math.floor(Math.random() * 6) + 3, approvalRate: Math.floor(Math.random() * 25) + 65 }
      ].sort((a, b) => b.count - a.count);
      
      // 学科跨评审阶段表现
      const crossAnalysis = disciplines.slice(0, 5).map(discipline => ({
        discipline,
        materialReview: Math.floor(Math.random() * 30) + 70,
        expertAssignment: Math.floor(Math.random() * 30) + 70,
        initialReview: Math.floor(Math.random() * 30) + 70,
        finalReview: Math.floor(Math.random() * 30) + 70,
        summary: Math.floor(Math.random() * 30) + 70
      }));
      
      // 历史数据
      const currentYear = new Date().getFullYear();
      const historicalData = Array.from({ length: 3 }).map((_, i) => ({
        year: `${currentYear - 3 + i}`,
        totalProjects: Math.floor(Math.random() * 50) + 50,
        approvalRate: Math.floor(Math.random() * 30) + 60,
        avgReviewTime: Math.floor(Math.random() * 5) + 10,
        avgScore: Math.floor(Math.random() * 10) + 75
      }));
      
      setReviewData({
        totalProjects,
        approvedProjects,
        rejectedProjects,
        pendingProjects,
        totalExperts,
        completedReviews,
        avgScore,
        topDepartments,
        topDisciplines,
        reviewComments,
        expertWorkloads,
        crossAnalysis,
        projectTypes,
        historicalData
      })
      
      setIsLoading(false)
    }, 1200)
  }, [])
  
  const handleGoBack = () => {
    router.back()
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">加载中，请稍候...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleGoBack}
            className="h-8 w-8 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{batchName || "评审批次"} · 综合看板</h1>
            <p className="text-muted-foreground">查看评审批次的综合分析和汇总数据</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>
      
      {/* 数据概览卡片 - 使用更多图形化表示 */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-0">
            <div className="flex items-stretch h-full">
              <div className="w-1/3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex flex-col items-center justify-center p-4">
                <FileText className="h-7 w-7 mb-1" />
                <span className="text-xs font-medium">总项目</span>
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-center items-center">
                <div className="text-3xl font-bold">{reviewData.totalProjects}</div>
                <p className="text-xs text-muted-foreground mt-1">评审项目总数</p>
            </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <div className="flex items-stretch h-full">
              <div className="w-1/3 bg-gradient-to-br from-green-500 to-emerald-600 text-white flex flex-col items-center justify-center p-4">
                <CheckCircle className="h-7 w-7 mb-1" />
                <span className="text-xs font-medium">通过率</span>
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-center items-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="none" 
                      stroke="#f1f5f9" 
                      strokeWidth="8"
                    />
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="none" 
                      stroke="#22c55e" 
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * reviewData.approvedProjects / reviewData.totalProjects} ${2 * Math.PI * 40}`}
                      strokeDashoffset="0" 
                      transform="rotate(-90, 50, 50)" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <div className="text-2xl font-bold">
                      {Math.round((reviewData.approvedProjects / reviewData.totalProjects) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">{reviewData.approvedProjects}个项目</div>
                  </div>
                </div>
            </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <div className="flex items-stretch h-full">
              <div className="w-1/3 bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col items-center justify-center p-4">
                <Users className="h-7 w-7 mb-1" />
                <span className="text-xs font-medium">专家数</span>
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-center">
                <div className="flex items-end mb-2">
                  <span className="text-3xl font-bold leading-none">{reviewData.totalExperts}</span>
                  <span className="text-sm ml-2 text-muted-foreground mb-1">名专家</span>
                </div>
                <div className="text-xs text-muted-foreground">已完成 {reviewData.completedReviews} 次评审</div>
                <div className="mt-2 h-1 w-full bg-slate-100 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (reviewData.completedReviews / (reviewData.totalProjects * 2)) * 100)}%` 
                    }}
                  />
                </div>
            </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <div className="flex items-stretch h-full">
              <div className="w-1/3 bg-gradient-to-br from-amber-500 to-amber-600 text-white flex flex-col items-center justify-center p-4">
                <Activity className="h-7 w-7 mb-1" />
                <span className="text-xs font-medium">平均分</span>
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-center items-center">
                <div className="text-3xl font-bold relative">
                  {reviewData.avgScore}
                  <span className="text-sm absolute -right-4 top-1">分</span>
                </div>
                <div className="flex space-x-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-5 h-1 rounded-full ${i < Math.round(reviewData.avgScore / 20) ? 'bg-amber-500' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
            </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 主要内容区域 - 修改标签页 */}
      <Tabs defaultValue="opinion-summary" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="opinion-summary" className="px-6 py-2">
            <FileText className="h-4 w-4 mr-2" />
            评审意见汇总
          </TabsTrigger>
          <TabsTrigger value="data-dashboard" className="px-6 py-2">
            <BarChart3 className="h-4 w-4 mr-2" />
            数据看板
          </TabsTrigger>
          <TabsTrigger value="quality-analysis" className="px-6 py-2">
            <PieChart className="h-4 w-4 mr-2" />
            申报质量分析
          </TabsTrigger>
          <TabsTrigger value="efficiency-analysis" className="px-6 py-2">
            <Activity className="h-4 w-4 mr-2" />
            评审效能分析
          </TabsTrigger>
          <TabsTrigger value="multi-dimension" className="px-6 py-2">
            <Grid3X3 className="h-4 w-4 mr-2" />
            多维分析
          </TabsTrigger>
          <TabsTrigger value="historical-comparison" className="px-6 py-2">
            <History className="h-4 w-4 mr-2" />
            历史对比
          </TabsTrigger>
        </TabsList>
        
        {/* 评审意见汇总 */}
        <TabsContent value="opinion-summary">
          <Card>
            <CardHeader>
              <CardTitle>评审意见汇总</CardTitle>
              <CardDescription>
                汇总所有专家对评审项目的关键意见和建议
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {reviewData.reviewComments.map((comment, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{comment.projectName}</h4>
                          <p className="text-sm text-muted-foreground">评审专家: {comment.expertName}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            comment.sentiment === "positive" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : comment.sentiment === "negative"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-slate-50 text-slate-700 border-slate-200"
                          }
                        >
                          {comment.sentiment === "positive" ? "正面评价" : comment.sentiment === "negative" ? "负面评价" : "中性评价"}
                        </Badge>
                      </div>
                      <p className="text-sm border-l-2 pl-3 border-slate-200 italic">
                        {comment.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 数据看板 */}
        <TabsContent value="data-dashboard">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>申报单位分布</CardTitle>
                <CardDescription>
                  按单位统计的项目申报数量和立项率
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviewData.topDepartments.map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">
                            {dept.count} 个项目
                          </Badge>
                          <span className="text-sm font-medium">
                            通过率 {dept.approvalRate}%
                          </span>
                        </div>
                      </div>
                      <Progress value={dept.approvalRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>学科领域分布</CardTitle>
                <CardDescription>
                  按学科统计的项目申报数量和立项率
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviewData.topDisciplines.map((disc, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">{disc.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">
                            {disc.count} 个项目
                          </Badge>
                          <span className="text-sm font-medium">
                            通过率 {disc.approvalRate}%
                          </span>
                        </div>
                      </div>
                      <Progress value={disc.approvalRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* 申报质量分析 */}
        <TabsContent value="quality-analysis">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>申报质量分析</CardTitle>
              <CardDescription>
                  分析项目申报材料的质量和立项情况
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-center h-64">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* 圆形进度图 - 通过率 */}
                      <div className="relative w-56 h-56">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* 底层圆环 */}
                          <circle 
                            cx="50" cy="50" r="40" 
                            stroke="#f1f5f9" 
                            strokeWidth="12" 
                            fill="none" 
                          />
                          {/* 进度圆环 - 通过项目 */}
                          <circle 
                            cx="50" cy="50" r="40" 
                            stroke="#22c55e" 
                            strokeWidth="12" 
                            fill="none" 
                            strokeDasharray={`${2 * Math.PI * 40 * reviewData.approvedProjects / reviewData.totalProjects} ${2 * Math.PI * 40}`}
                            strokeDashoffset="0" 
                            transform="rotate(-90, 50, 50)" 
                            strokeLinecap="round"
                          />
                          {/* 进度圆环 - 拒绝项目 */}
                          <circle 
                            cx="50" cy="50" r="40" 
                            stroke="#ef4444" 
                            strokeWidth="12" 
                            fill="none" 
                            strokeDasharray={`${2 * Math.PI * 40 * reviewData.rejectedProjects / reviewData.totalProjects} ${2 * Math.PI * 40}`}
                            strokeDashoffset={`${-2 * Math.PI * 40 * reviewData.approvedProjects / reviewData.totalProjects}`}
                            transform="rotate(-90, 50, 50)" 
                            strokeLinecap="round"
                          />
                          {/* 进度圆环 - 待定项目 */}
                          <circle 
                            cx="50" cy="50" r="40" 
                            stroke="#f59e0b" 
                            strokeWidth="12" 
                            fill="none" 
                            strokeDasharray={`${2 * Math.PI * 40 * reviewData.pendingProjects / reviewData.totalProjects} ${2 * Math.PI * 40}`}
                            strokeDashoffset={`${-2 * Math.PI * 40 * (reviewData.approvedProjects + reviewData.rejectedProjects) / reviewData.totalProjects}`}
                            transform="rotate(-90, 50, 50)" 
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-4xl font-bold">{Math.round(reviewData.approvedProjects / reviewData.totalProjects * 100)}%</div>
                          <div className="text-sm text-muted-foreground">通过率</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4 space-x-8">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <div className="text-sm">
                        <div>通过项目</div>
                        <div className="font-semibold">{reviewData.approvedProjects} 个 ({Math.round(reviewData.approvedProjects / reviewData.totalProjects * 100)}%)</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="text-sm">
                        <div>未通过项目</div>
                        <div className="font-semibold">{reviewData.rejectedProjects} 个 ({Math.round(reviewData.rejectedProjects / reviewData.totalProjects * 100)}%)</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                      <div className="text-sm">
                        <div>待定项目</div>
                        <div className="font-semibold">{reviewData.pendingProjects} 个 ({Math.round(reviewData.pendingProjects / reviewData.totalProjects * 100)}%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>评分区间分布</CardTitle>
                <CardDescription>
                  项目评分区间分布情况
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "90-100分", count: Math.floor(reviewData.totalProjects * 0.2), color: "bg-green-500" },
                    { label: "80-89分", count: Math.floor(reviewData.totalProjects * 0.3), color: "bg-emerald-400" },
                    { label: "70-79分", count: Math.floor(reviewData.totalProjects * 0.25), color: "bg-blue-400" },
                    { label: "60-69分", count: Math.floor(reviewData.totalProjects * 0.15), color: "bg-amber-400" },
                    { label: "60分以下", count: Math.floor(reviewData.totalProjects * 0.1), color: "bg-red-400" },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{item.count} 个</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round(item.count / reviewData.totalProjects * 100)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color}`} 
                          style={{ width: `${(item.count / reviewData.totalProjects) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>申报材料质量评估</CardTitle>
                <CardDescription>
                  根据专家评价对申报材料不同方面的质量评估
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: "创新性", score: Math.floor(Math.random() * 15) + 75, max: 100 },
                    { title: "可行性", score: Math.floor(Math.random() * 20) + 70, max: 100 },
                    { title: "研究团队", score: Math.floor(Math.random() * 10) + 80, max: 100 },
                    { title: "预算合理性", score: Math.floor(Math.random() * 25) + 65, max: 100 },
                    { title: "应用价值", score: Math.floor(Math.random() * 15) + 75, max: 100 },
                    { title: "目标清晰度", score: Math.floor(Math.random() * 10) + 80, max: 100 },
                    { title: "前沿程度", score: Math.floor(Math.random() * 20) + 70, max: 100 },
                    { title: "文档规范性", score: Math.floor(Math.random() * 15) + 75, max: 100 },
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4 flex flex-col justify-between">
                      <div className="text-sm font-medium mb-3">{item.title}</div>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-2 bg-slate-200 rounded-full mb-2">
                          <div 
                            className={`h-full rounded-full ${
                              item.score >= 80 ? "bg-green-500" :
                              item.score >= 70 ? "bg-blue-500" :
                              item.score >= 60 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${(item.score / item.max) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between w-full text-xs">
                          <span className="text-muted-foreground">0</span>
                          <span className="font-medium">{item.score}</span>
                          <span className="text-muted-foreground">{item.max}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* 多维分析视图 - 增强样式 */}
        <TabsContent value="multi-dimension">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>项目类型分布</CardTitle>
                <CardDescription>
                  各类型项目的数量和通过率分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="relative h-full w-full flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-48 h-48">
                      {reviewData.projectTypes.map((type, index, array) => {
                        const total = array.reduce((sum, t) => sum + t.count, 0);
                        const startAngle = array.slice(0, index).reduce((sum, t) => sum + t.count / total * 360, 0);
                        const angle = type.count / total * 360;
                        
                        // 计算圆弧路径
                        const startRad = (startAngle - 90) * Math.PI / 180; 
                        const endRad = (startAngle + angle - 90) * Math.PI / 180;
                        const x1 = 50 + 40 * Math.cos(startRad);
                        const y1 = 50 + 40 * Math.sin(startRad);
                        const x2 = 50 + 40 * Math.cos(endRad);
                        const y2 = 50 + 40 * Math.sin(endRad);
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        
                        // 生成颜色
                        const colors = ['#1e40af', '#0e7490', '#0369a1', '#0f766e', '#4338ca', '#a21caf'];
                        const color = colors[index % colors.length];
                        
                        return (
                          <path 
                            key={index}
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={color}
                            opacity={0.85}
                            stroke="#fff"
                            strokeWidth="1"
                          />
                        );
                      })}
                      <circle cx="50" cy="50" r="25" fill="white" />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {reviewData.projectTypes.map((type, index) => {
                    const colors = ['bg-blue-800', 'bg-cyan-800', 'bg-blue-600', 'bg-teal-700', 'bg-indigo-700', 'bg-purple-800'];
                    return (
                      <div key={index} className="flex items-center">
                        <div className={`h-3 w-3 rounded-sm ${colors[index % colors.length]} mr-2`} />
                        <div className="text-sm flex-1 truncate">{type.type}</div>
                        <div className="text-sm font-medium">{type.count}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>通过率对比</CardTitle>
                <CardDescription>
                  不同类型项目的通过率对比
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5 pt-3 h-80 flex flex-col justify-between">
                  {reviewData.projectTypes.map((type, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">{type.type}</div>
                        <div className="text-sm">{type.approvalRate}%</div>
                      </div>
                      <div className="relative h-9">
                        <div className="absolute inset-0 bg-slate-100 rounded-md" />
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-md"
                          style={{ width: `${type.approvalRate}%` }}
                        >
                          {type.approvalRate >= 35 && (
                            <span className="absolute right-2 text-xs text-white font-medium top-1/2 transform -translate-y-1/2">
                              {type.count}个项目
                            </span>
                          )}
                        </div>
                        {type.approvalRate < 35 && (
                          <span className="absolute left-[calc(100%+8px)] text-xs font-medium top-1/2 transform -translate-y-1/2">
                            {type.count}个项目
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>学科评审阶段热力图</CardTitle>
                <CardDescription>
                  不同学科在各评审阶段的完成率可视化
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-3 font-medium w-[140px]">学科领域</th>
                        <th className="text-center py-3 font-medium">材料审核</th>
                        <th className="text-center py-3 font-medium">专家分配</th>
                        <th className="text-center py-3 font-medium">初审阶段</th>
                        <th className="text-center py-3 font-medium">复审阶段</th>
                        <th className="text-center py-3 font-medium">结果汇总</th>
                        <th className="text-center py-3 font-medium">平均进度</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewData.crossAnalysis.map((item, index) => {
                        const avgProgress = Math.round(
                          (item.materialReview + item.expertAssignment + item.initialReview + 
                            item.finalReview + item.summary) / 5
                        );
                        return (
                          <tr key={index} className="border-b">
                            <td className="py-3 font-medium">{item.discipline}</td>
                            {[
                              item.materialReview,
                              item.expertAssignment,
                              item.initialReview,
                              item.finalReview,
                              item.summary
                            ].map((value, i) => (
                              <td key={i} className="py-2 px-2">
                                <div className="flex justify-center items-center">
                                  <div 
                                    className={`h-9 w-9 rounded flex items-center justify-center text-white font-medium ${
                                      value >= 90 ? "bg-green-500" :
                                      value >= 70 ? "bg-blue-500" :
                                      value >= 60 ? "bg-amber-500" : "bg-red-400"
                                    }`}
                                  >
                                    {value}%
                                  </div>
                                </div>
                              </td>
                            ))}
                            <td className="py-3">
                              <div className="flex flex-col items-center">
                                <span className={`font-medium ${
                                  avgProgress >= 80 ? "text-green-600" : 
                                  avgProgress >= 60 ? "text-blue-600" : "text-amber-600"
                                }`}>{avgProgress}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">90-100% (优)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">70-89% (良)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm">60-69% (中)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                    <span className="text-sm">60%以下 (差)</span>
                  </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
        
        {/* 评审效能分析 - 改善样式 */}
        <TabsContent value="efficiency-analysis">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle>评审流程进度</CardTitle>
                <CardDescription>
                  评审流程各阶段的时间分配和完成情况
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="pt-2 space-y-6">
                  <div className="flex mb-6">
                    <div className="h-20 w-20 rounded-full border-8 border-primary flex items-center justify-center mr-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{Math.round((reviewData.completedReviews / (reviewData.totalProjects * 2)) * 100)}%</div>
                        <div className="text-xs">总体进度</div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-sm mb-1">已完成评审: <span className="font-medium">{reviewData.completedReviews}</span> / {reviewData.totalProjects * 2}</div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">预计总完成时间: 12天</span>
                      </div>
                    </div>
                  </div>
                  
                  {[
                    { name: "材料审核阶段", progress: 100, avgTime: "2.3天", estCompletion: "已完成", icon: FileText },
                    { name: "专家分配阶段", progress: 95, avgTime: "1.5天", estCompletion: "预计今日完成", icon: Users },
                    { name: "初审阶段", progress: 88, avgTime: "5.2天", estCompletion: "预计3天后完成", icon: CheckCircle },
                    { name: "复审阶段", progress: 65, avgTime: "4.8天", estCompletion: "预计5天后完成", icon: Activity },
                    { name: "结果汇总阶段", progress: 40, avgTime: "2.1天", estCompletion: "预计7天后完成", icon: BarChart3 },
                  ].map((stage, index) => {
                    const Icon = stage.icon;
                    return (
                      <div key={index} className="relative">
                        <div className="flex items-center mb-1">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                            stage.progress === 100 ? "bg-green-100 text-green-700" :
                            stage.progress >= 75 ? "bg-blue-100 text-blue-700" :
                            stage.progress >= 50 ? "bg-amber-100 text-amber-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm">{stage.name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="h-5 text-xs font-normal">
                                  {stage.avgTime}
                                </Badge>
                                <span className="text-sm">{stage.progress}%</span>
                              </div>
                            </div>
                            <div className="mt-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  stage.progress === 100 ? "bg-green-500" :
                                  stage.progress >= 75 ? "bg-blue-500" :
                                  stage.progress >= 50 ? "bg-amber-500" :
                                  "bg-slate-400"
                                }`} 
                                style={{ width: `${stage.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground ml-11">
                          {stage.estCompletion}
                        </div>
                        
                        {/* 垂直连接线 */}
                        {index < 4 && (
                          <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200 h-6" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>专家评审效率</CardTitle>
                  <CardDescription>
                    评审专家的评审速度和数量分析
                  </CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="筛选专家类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部专家</SelectItem>
                    <SelectItem value="high">效率较高</SelectItem>
                    <SelectItem value="low">效率较低</SelectItem>
                    <SelectItem value="overload">工作量过大</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  {[
                    { name: "张教授", completed: 12, assigned: 15, avgTime: "1.2天/项", efficiency: 94, workload: "中等" },
                    { name: "李研究员", completed: 8, assigned: 10, avgTime: "0.8天/项", efficiency: 98, workload: "适中" },
                    { name: "王博士", completed: 6, assigned: 12, avgTime: "1.5天/项", efficiency: 85, workload: "适中" },
                    { name: "刘教授", completed: 10, assigned: 10, avgTime: "1.0天/项", efficiency: 100, workload: "适中" },
                    { name: "陈研究员", completed: 7, assigned: 8, avgTime: "2.1天/项", efficiency: 78, workload: "较低" },
                  ].map((expert, index) => (
                    <div key={index} className="p-3 border rounded-md space-y-2 bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="font-medium text-primary">{expert.name.charAt(0)}</span>
                          </div>
                          <div className="font-medium">{expert.name}</div>
                        </div>
                        <Badge variant={expert.completed === expert.assigned ? "default" : "outline"}>
                          {expert.completed}/{expert.assigned}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{expert.avgTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-3 w-3" />
                          <span>效率 {expert.efficiency}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>工作量: {expert.workload}</span>
                        </div>
                      </div>
                      <div className="relative pt-1 mt-1">
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-full"
                            style={{ width: `${(expert.completed / expert.assigned) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>专家工作量与完成率</CardTitle>
              <CardDescription>
                  各评审专家的项目分配情况和完成率对比
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-80 w-full flex items-end justify-between px-4">
                  {reviewData.expertWorkloads.slice(0, 8).map((expert, index) => {
                    const completionRate = (expert.completed / expert.assigned) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className="text-xs mb-2 font-medium">{expert.name}</div>
                        <div className="relative w-12 flex flex-col items-center">
                          <div 
                            className="w-10 bg-blue-100 rounded-t-md"
                            style={{ height: `${(expert.assigned / 15) * 200}px` }}
                          >
                            <div 
                              className="w-full bg-blue-600 rounded-t-md absolute bottom-0"
                              style={{ height: `${(expert.completed / 15) * 200}px` }}
                            />
                          </div>
                          <div className="absolute top-0 -mt-6 text-xs font-medium">
                            {expert.assigned}
                          </div>
                          <div className="mt-1 text-xs font-medium text-blue-700">
                            {Math.round(completionRate)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center mt-4 space-x-8">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-100 mr-2"></div>
                    <span className="text-sm">分配项目</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 mr-2"></div>
                    <span className="text-sm">已完成项目</span>
                  </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
        
        {/* 历史对比 - 新增 */}
        <TabsContent value="historical-comparison">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>历年项目数量与通过率</CardTitle>
                <CardDescription>
                  近三年项目申报数量和通过率的变化趋势
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="pt-4 space-y-8">
                  <div>
                    <h3 className="text-sm font-medium mb-3">项目数量趋势</h3>
                    <div className="h-[180px] flex items-end space-x-6">
                      {reviewData.historicalData.map((year, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end">
                          <div 
                            className="w-full min-w-[60px] max-w-[100px] bg-primary/80 rounded-t-md"
                            style={{ height: `${(year.totalProjects / 100) * 100}%` }}
                          >
                            <div className="flex justify-center items-center h-8 text-white font-medium">
                              {year.totalProjects}
                            </div>
                          </div>
                          <div className="text-sm mt-2 font-medium">{year.year}年</div>
                        </div>
                      ))}
                      <div className="flex-1 flex flex-col items-center justify-end">
                        <div 
                          className="w-full min-w-[60px] max-w-[100px] bg-blue-500 rounded-t-md"
                          style={{ height: `${(reviewData.totalProjects / 100) * 100}%` }}
                        >
                          <div className="flex justify-center items-center h-8 text-white font-medium">
                            {reviewData.totalProjects}
                          </div>
                        </div>
                        <div className="text-sm mt-2 font-medium">当前批次</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">通过率趋势</h3>
                    <div className="space-y-3">
                      {reviewData.historicalData.map((year, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{year.year}年</span>
                            <span className="text-sm font-medium">{year.approvalRate}%</span>
                          </div>
                          <Progress value={year.approvalRate} className="h-2 bg-slate-100" />
                        </div>
                      ))}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">当前批次</span>
                          <span className="text-sm font-medium">{Math.round((reviewData.approvedProjects / reviewData.totalProjects) * 100)}%</span>
                        </div>
                        <Progress value={Math.round((reviewData.approvedProjects / reviewData.totalProjects) * 100)} className="h-2 bg-slate-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
          <Card>
            <CardHeader>
                <CardTitle>历年评审指标对比</CardTitle>
                <CardDescription>
                  历年评审各项核心指标的比较分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="pt-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">平均评审时长（天）</h3>
                      <div className="space-y-3">
                        {reviewData.historicalData.map((year, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{year.year}年</span>
                              <span className="text-sm font-medium">{year.avgReviewTime}天</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500"
                                style={{ width: `${(year.avgReviewTime / 15) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">当前批次</span>
                            <span className="text-sm font-medium">12.5天</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500"
                              style={{ width: `${(12.5 / 15) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">平均评分</h3>
                      <div className="space-y-3">
                        {reviewData.historicalData.map((year, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{year.year}年</span>
                              <span className="text-sm font-medium">{year.avgScore}分</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500"
                                style={{ width: `${(year.avgScore / 100) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">当前批次</span>
                            <span className="text-sm font-medium">{reviewData.avgScore}分</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500"
                              style={{ width: `${(reviewData.avgScore / 100) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>历年评审效能指标</CardTitle>
              <CardDescription>
                  历年评审效率和质量的关键指标对比
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-medium">年份</th>
                        <th className="text-center py-3 font-medium">项目总数</th>
                        <th className="text-center py-3 font-medium">通过率</th>
                        <th className="text-center py-3 font-medium">平均评审时长</th>
                        <th className="text-center py-3 font-medium">平均评分</th>
                        <th className="text-center py-3 font-medium">专家满意度</th>
                        <th className="text-center py-3 font-medium">申请人满意度</th>
                        <th className="text-center py-3 font-medium">同行评议质量</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...reviewData.historicalData, {
                        year: "当前批次",
                        totalProjects: reviewData.totalProjects,
                        approvalRate: Math.round((reviewData.approvedProjects / reviewData.totalProjects) * 100),
                        avgReviewTime: 12.5,
                        avgScore: reviewData.avgScore
                      }].map((year, index) => {
                        const expertSatisfaction = Math.floor(Math.random() * 15) + 80;
                        const applicantSatisfaction = Math.floor(Math.random() * 20) + 75;
                        const peerReviewQuality = Math.floor(Math.random() * 10) + 85;
                        
                        return (
                          <tr key={index} className={`border-b ${year.year === "当前批次" ? "bg-slate-50/50" : ""}`}>
                            <td className="py-3 pl-4 font-medium">{year.year}</td>
                            <td className="py-3 text-center">{year.totalProjects}</td>
                            <td className="py-3 text-center">
                              <Badge variant={year.approvalRate > 70 ? "default" : "outline"}>
                                {year.approvalRate}%
                              </Badge>
                            </td>
                            <td className="py-3 text-center">{year.avgReviewTime}天</td>
                            <td className="py-3 text-center">
                              <div className="inline-flex items-center">
                                <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden mr-2">
                                  <div 
                                    className={`h-full ${year.avgScore >= 85 ? "bg-green-500" : year.avgScore >= 75 ? "bg-blue-500" : "bg-amber-500"}`}
                                    style={{ width: `${(year.avgScore / 100) * 100}%` }}
                                  ></div>
                                </div>
                                <span>{year.avgScore}</span>
                              </div>
                            </td>
                            <td className="py-3 text-center">{expertSatisfaction}%</td>
                            <td className="py-3 text-center">{applicantSatisfaction}%</td>
                            <td className="py-3 text-center">{peerReviewQuality}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 