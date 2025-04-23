"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  FileText,
  TrendingUp,
  RefreshCw,
  Download,
  Lightbulb,
  FileSpreadsheet,
  FilePlus2,
  Eye,
  Link,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  ChevronRight,
  ArrowUp,
  CornerUpRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

// 成果数据
const achievementsData = [
  {
    id: 1,
    title: "高效机器学习算法在科研项目管理中的应用",
    type: "论文",
    authors: "张三、李四、王五",
    journal: "中国科学: 信息科学",
    date: "2023-06-15",
    status: "已发表",
    citations: 23,
    downloads: 156,
    impact: "4.2",
    link: "#",
    fileUrl: "/documents/paper-ml-algorithm.pdf",
  },
  {
    id: 2,
    title: "一种基于区块链的科研经费管理系统",
    type: "专利",
    authors: "张三、刘研究员",
    patentId: "CN123456789A",
    date: "2023-03-22",
    status: "已授权",
    value: "预估350万元",
    conversion: "正在转化",
    link: "#",
    fileUrl: "/documents/patent-blockchain.pdf",
  },
  {
    id: 3,
    title: "科研资源智能分配算法",
    type: "软件著作权",
    authors: "张三团队",
    regId: "2023SR123456",
    date: "2023-05-10",
    status: "已登记",
    downloads: 78,
    users: 12,
    link: "#",
    fileUrl: "/documents/software-algorithm.zip",
  },
  {
    id: 4,
    title: "《科研项目管理最佳实践》",
    type: "著作",
    authors: "张三、李四等",
    publisher: "科学出版社",
    date: "2023-08-01",
    status: "已出版",
    sales: 2500,
    rating: "4.8",
    link: "#",
    fileUrl: "/documents/book-project-management.pdf",
  },
  {
    id: 5,
    title: "科研云平台技术服务",
    type: "技术转让",
    partner: "华为技术有限公司",
    date: "2023-07-18",
    status: "执行中",
    value: "280万元",
    progress: 65,
    link: "#",
    fileUrl: "/documents/tech-transfer-agreement.pdf",
  },
]

// 关键指标数据
const keyMetrics = {
  patentConversionRate: 72,
  citationsCount: 187,
  contractFulfillmentRate: 95,
}

// AI生成的季度成果简报
const quarterlyReport = {
  quarter: "2023年第三季度",
  highlights: [
    "本季度项目组共产出5项科研成果，包括2篇高质量论文、1项专利和2项技术转让",
    "论文《高效机器学习算法在科研项目管理中的应用》被SCI收录，影响因子4.2",
    "专利“一种基于区块链的科研经费管理系统”已获授权，正在与3家企业洽谈转化",
  ],
  challenges: [
    "软件著作权申请周期较长，需进一步优化申请流程",
    "技术转让合同执行中遇到部分技术问题，已组织专家团队解决",
  ],
  nextSteps: [
    "加强与企业合作，推进专利技术转化",
    "筹备下一季度国际学术会议论文投稿",
    "完善科研成果管理系统，提高成果转化效率",
  ],
  generatedAt: "2023-10-05",
  generationTime: "0.8秒",
}

export default function AchievementsTab() {
  const [activeAchievementTab, setActiveAchievementTab] = useState("all")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  // 处理下载功能
  const handleDownload = (fileName: string, fileUrl: string) => {
    // 在实际应用中，这里会是真实的下载逻辑
    // 这里使用模拟下载，显示一个成功提示
    toast({
      title: "开始下载",
      description: `正在下载 ${fileName}...`,
      duration: 3000,
    })

    // 模拟下载延迟
    setTimeout(() => {
      toast({
        title: "下载完成",
        description: `${fileName} 已成功下载到您的设备`,
        duration: 3000,
      })
    }, 1500)
  }

  // 处理生成报告
  const handleGenerateReport = () => {
    if (isGeneratingReport) return

    setIsGeneratingReport(true)
    toast({
      title: "正在生成报告",
      description: "AI正在生成最新季度成果简报...",
      duration: 2000,
    })

    // 模拟生成过程
    setTimeout(() => {
      setIsGeneratingReport(false)
      toast({
        title: "报告生成完成",
        description: "季度成果简报已更新",
        duration: 3000,
      })
    }, 2000)
  }

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes progress {
        0% { width: 0; }
        50% { width: 70%; }
        100% { width: 100%; }
      }
      
      .animate-progress {
        animation: progress 3s ease-in-out;
      }
      
      .animation-delay-200 {
        animation-delay: 0.2s;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 专利转化率 */}
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-green-50">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              专利转化率
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-slate-900">{keyMetrics.patentConversionRate}%</div>
              <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-0.5 mb-1">
                <TrendingUp className="h-3 w-3" />
                <span>+12%</span>
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">相比上季度</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">完成目标</span>
                <span className="text-slate-700 font-medium">{keyMetrics.patentConversionRate}/85%</span>
              </div>
              <Progress value={(keyMetrics.patentConversionRate * 100) / 85} className="h-1.5 bg-muted/40" />
            </div>
          </CardContent>
        </Card>

        {/* 成果引用数 */}
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-50">
                <Link className="h-4 w-4 text-blue-600" />
              </div>
              成果引用数
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-slate-900">{keyMetrics.citationsCount}</div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-0.5 mb-1">
                <TrendingUp className="h-3 w-3" />
                <span>+43</span>
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">相比上季度</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">排名位置</span>
                <span className="text-slate-700 font-medium">前 15%</span>
              </div>
              <Progress value={85} className="h-1.5 bg-muted/40" />
            </div>
          </CardContent>
        </Card>

        {/* 合同履约率 */}
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-violet-50">
                <CheckCircle2 className="h-4 w-4 text-violet-600" />
              </div>
              合同履约率
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-slate-900">{keyMetrics.contractFulfillmentRate}%</div>
              <Badge variant="outline" className="bg-violet-50 text-violet-700 flex items-center gap-0.5 mb-1">
                <TrendingUp className="h-3 w-3" />
                <span>+2%</span>
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">相比上季度</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">完成目标</span>
                <span className="text-slate-700 font-medium">{keyMetrics.contractFulfillmentRate}/100%</span>
              </div>
              <Progress value={keyMetrics.contractFulfillmentRate} className="h-1.5 bg-muted/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 内容主体区域 - 成果列表和NLG生成的季度报告 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 成果列表 */}
        <div className="lg:col-span-2">
          <Card className="bg-card h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg font-semibold">成果列表</CardTitle>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  <span className="text-xs">添加成果</span>
                </Button>
              </div>
              <Tabs
                defaultValue="all"
                value={activeAchievementTab}
                onValueChange={setActiveAchievementTab}
                className="w-auto"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs px-3">
                    全部
                  </TabsTrigger>
                  <TabsTrigger value="paper" className="text-xs px-3">
                    论文
                  </TabsTrigger>
                  <TabsTrigger value="patent" className="text-xs px-3">
                    专利
                  </TabsTrigger>
                  <TabsTrigger value="other" className="text-xs px-3">
                    其他
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                {achievementsData
                  .filter((item) => {
                    if (activeAchievementTab === "all") return true
                    if (activeAchievementTab === "paper") return item.type === "论文"
                    if (activeAchievementTab === "patent") return item.type === "专利"
                    if (activeAchievementTab === "other") return !["论文", "专利"].includes(item.type)
                    return true
                  })
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 border-b last:border-b-0 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {achievement.type === "论文" && (
                            <div className="p-2 rounded-md bg-blue-50">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                          )}
                          {achievement.type === "专利" && (
                            <div className="p-2 rounded-md bg-amber-50">
                              <Lightbulb className="h-5 w-5 text-amber-600" />
                            </div>
                          )}
                          {achievement.type === "软件著作权" && (
                            <div className="p-2 rounded-md bg-purple-50">
                              <FileSpreadsheet className="h-5 w-5 text-purple-600" />
                            </div>
                          )}
                          {achievement.type === "著作" && (
                            <div className="p-2 rounded-md bg-emerald-50">
                              <BookOpen className="h-5 w-5 text-emerald-600" />
                            </div>
                          )}
                          {achievement.type === "技术转让" && (
                            <div className="p-2 rounded-md bg-rose-50">
                              <FilePlus2 className="h-5 w-5 text-rose-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-slate-900 mb-1 hover:text-primary transition-colors">
                              {achievement.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`ml-2 whitespace-nowrap
                                ${
                                  achievement.status === "已发表" ||
                                  achievement.status === "已授权" ||
                                  achievement.status === "已出版" ||
                                  achievement.status === "已登记"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              `}
                            >
                              {achievement.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 mb-2">{achievement.authors}</div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-slate-600">
                            {achievement.date && (
                              <div className="flex items-center gap-1">
                                <span>日期:</span>
                                <span className="font-medium">{achievement.date}</span>
                              </div>
                            )}
                            {achievement.citations && (
                              <div className="flex items-center gap-1">
                                <span>引用:</span>
                                <span className="font-medium">{achievement.citations}</span>
                              </div>
                            )}
                            {achievement.downloads && (
                              <div className="flex items-center gap-1">
                                <span>下载:</span>
                                <span className="font-medium">{achievement.downloads}</span>
                              </div>
                            )}
                            {achievement.impact && (
                              <div className="flex items-center gap-1">
                                <span>影响因子:</span>
                                <span className="font-medium">{achievement.impact}</span>
                              </div>
                            )}
                            {achievement.value && (
                              <div className="flex items-center gap-1">
                                <span>价值:</span>
                                <span className="font-medium">{achievement.value}</span>
                              </div>
                            )}
                            {achievement.conversion && (
                              <div className="flex items-center gap-1">
                                <span>转化状态:</span>
                                <span className="font-medium">{achievement.conversion}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-end gap-2 mt-3">
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                              <Eye className="h-3 w-3" />
                              <span>查看详情</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => handleDownload(achievement.title, achievement.fileUrl)}
                            >
                              <Download className="h-3 w-3" />
                              <span>下载</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NLG季度成果简报 - 科技感增强版 */}
        <Card className="bg-gradient-to-br from-white via-white to-slate-50 border border-slate-200 shadow-sm h-full relative overflow-hidden">
          {/* 移除技术感装饰元素和网格背景 */}

          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <span>季度成果简报</span>
                  <Badge className="ml-2 bg-blue-50 text-blue-600 border-blue-200 text-[10px] h-5 px-2 tracking-wide font-normal">
                    AI生成
                  </Badge>
                </CardTitle>
                <CardDescription className="text-muted-foreground flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="mr-2 h-5 px-1.5 py-0 border-slate-200 text-[10px] bg-white text-slate-500"
                    >
                      Q3-2023
                    </Badge>
                    <span>生成耗时 {quarterlyReport.generationTime}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 -mr-2 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => {
                      window.open("/reports/quarterly-achievement-report.pdf", "_blank")
                      toast({
                        title: "报告已打开",
                        description: "完整版季度成果简报已在新窗口打开",
                        duration: 3000,
                      })
                    }}
                  >
                    <span>查看完整版</span>
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 relative z-10">
            <div className="space-y-4">
              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-md border border-slate-200 p-3">
                <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 mr-2">
                    <ArrowUp className="h-3 w-3 text-primary" />
                  </div>
                  成果亮点
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  {quarterlyReport.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 bg-gradient-to-r hover:from-slate-50 hover:to-transparent rounded-sm transition-colors"
                    >
                      <div className="mt-1 min-w-4 flex justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/70"></div>
                      </div>
                      <p>{highlight}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-md border border-slate-200 p-3">
                <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 mr-2">
                    <CornerUpRight className="h-3 w-3 text-amber-500 rotate-45" />
                  </div>
                  面临挑战
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  {quarterlyReport.challenges.map((challenge, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 bg-gradient-to-r hover:from-amber-50/30 hover:to-transparent rounded-sm transition-colors"
                    >
                      <div className="mt-1 min-w-4 flex justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                      </div>
                      <p>{challenge}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-md border border-slate-200 p-3">
                <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 mr-2">
                    <ChevronRight className="h-3 w-3 text-green-600" />
                  </div>
                  下一步计划
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  {quarterlyReport.nextSteps.map((step, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 bg-gradient-to-r hover:from-green-50/30 hover:to-transparent rounded-sm transition-colors"
                    >
                      <div className="mt-1 min-w-4 flex justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      </div>
                      <p>{step}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-2 pb-4 gap-3 relative z-10">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white hover:bg-primary/5 border border-slate-200 shadow-sm"
              onClick={() => handleDownload("季度成果简报.pdf", "/reports/quarterly-achievement-report.pdf")}
            >
              <Download className="h-4 w-4 mr-2" />
              导出 PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white hover:bg-primary/5 border border-slate-200 shadow-sm"
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重新生成
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

