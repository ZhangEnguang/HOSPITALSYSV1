"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  AwardIcon,
  BookOpenIcon,
  BarChart3Icon,
  TrendingUpIcon,
  UsersIcon,
  BriefcaseIcon,
  FileIcon,
  GraduationCapIcon,
  TargetIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import AchievementSummaryChart from "@/components/charts/achievement-summary-chart"
import FundingDistributionChart from "@/components/charts/funding-distribution-chart"
import ProjectStatusChart from "@/components/charts/project-status-chart"
import TeamPerformanceChart from "@/components/charts/team-performance-chart"
import MilestoneStatusChart from "@/components/charts/milestone-status-chart"

export default function OverviewDashboard() {
  const [activeTab, setActiveTab] = useState("summary")

  return (
    <div className="space-y-4">
      {/* 顶部卡片统计 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中项目</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">较上月 +2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待办任务</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">15 项需要优先处理</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已获资助</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥1,234,500</div>
            <p className="text-xs text-muted-foreground">使用率 50%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本年度成果</CardTitle>
            <AwardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↑ 12%</span> 较去年同期
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 统计图表区域 */}
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">综合概况</TabsTrigger>
          <TabsTrigger value="projects">项目分析</TabsTrigger>
          <TabsTrigger value="achievements">成果统计</TabsTrigger>
          <TabsTrigger value="team">团队表现</TabsTrigger>
        </TabsList>

        {/* 综合概况 */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>项目类型分布</CardTitle>
                <CardDescription>按项目类型和级别统计</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ProjectStatusChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>团队成员贡献</CardTitle>
                <CardDescription>按成员角色统计</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TeamPerformanceChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>项目里程碑完成情况</CardTitle>
                <CardDescription>按阶段统计完成状态</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <MilestoneStatusChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>经费使用情况</CardTitle>
                <CardDescription>按用途分类</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <FundingDistributionChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>成果产出趋势</CardTitle>
                <CardDescription>近五年成果统计</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AchievementSummaryChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 项目分析 */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>项目状态分布</CardTitle>
                <CardDescription>按进度阶段统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500">立项阶段</Badge>
                      <span className="text-sm">4 个项目</span>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <Progress value={25} className={cn("h-2", "bg-blue-100")} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-amber-500">执行阶段</Badge>
                      <span className="text-sm">8 个项目</span>
                    </div>
                    <span className="text-sm font-medium">50%</span>
                  </div>
                  <Progress value={50} className={cn("h-2", "bg-amber-100")} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500">结题阶段</Badge>
                      <span className="text-sm">3 个项目</span>
                    </div>
                    <span className="text-sm font-medium">18.75%</span>
                  </div>
                  <Progress value={18.75} className={cn("h-2", "bg-green-100")} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-500">延期项目</Badge>
                      <span className="text-sm">1 个项目</span>
                    </div>
                    <span className="text-sm font-medium">6.25%</span>
                  </div>
                  <Progress value={6.25} className={cn("h-2", "bg-purple-100")} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>项目级别分布</CardTitle>
                <CardDescription>按项目级别统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-red-500">国家级</Badge>
                      <span className="text-sm">3 个项目</span>
                    </div>
                    <span className="text-sm font-medium">18.75%</span>
                  </div>
                  <Progress value={18.75} className={cn("h-2", "bg-red-100")} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-orange-500">省部级</Badge>
                      <span className="text-sm">5 个项目</span>
                    </div>
                    <span className="text-sm font-medium">31.25%</span>
                  </div>
                  <Progress value={31.25} className={cn("h-2", "bg-orange-100")} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-500">市厅级</Badge>
                      <span className="text-sm">4 个项目</span>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <Progress value={25} className={cn("h-2", "bg-yellow-100")} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500">校级</Badge>
                      <span className="text-sm">4 个项目</span>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <Progress value={25} className={cn("h-2", "bg-blue-100")} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>项目进度</CardTitle>
              <CardDescription>近期进行中的项目</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">人工智能辅助科研决策系统</div>
                    <Badge className="bg-red-500">国家级项目</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-muted-foreground">剩余时间: 45天</div>
                    <div className="text-sm font-medium">75%</div>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">新型材料力学性能研究</div>
                    <Badge className="bg-orange-500">省部级项目</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-muted-foreground">剩余时间: 120天</div>
                    <div className="text-sm font-medium">45%</div>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">生物医学图像处理技术</div>
                    <Badge className="bg-blue-500">校级项目</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-muted-foreground">剩余时间: 180天</div>
                    <div className="text-sm font-medium">30%</div>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 成果统计 */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">论文发表</CardTitle>
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">SCI/SSCI收录 87 篇</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">专利申请</CardTitle>
                <FileIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">已授权 28 项</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">获奖成果</CardTitle>
                <AwardIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">国家级奖项 3 项</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">著作出版</CardTitle>
                <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">专著 8 部，教材 4 部</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>高被引论文</CardTitle>
                <CardDescription>被引次数最多的论文</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">深度学习在医学影像分析中的应用研究</div>
                      <Badge>被引 245</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">发表于《IEEE Transactions on Medical Imaging》</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">新型纳米材料的制备与表征</div>
                      <Badge>被引 187</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">发表于《Advanced Materials》</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">量子计算在密码学中的应用</div>
                      <Badge>被引 156</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">发表于《Nature Quantum Information》</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>成果转化情况</CardTitle>
                <CardDescription>科研成果转化与应用</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">智能制造关键技术</div>
                      <Badge className="bg-green-500">已转化</Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">转化金额: ¥580,000</p>
                      <p className="text-sm text-muted-foreground">2023年</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">新能源材料技术</div>
                      <Badge className="bg-green-500">已转化</Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">转化金额: ¥420,000</p>
                      <p className="text-sm text-muted-foreground">2022年</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">医疗诊断AI系统</div>
                      <Badge className="bg-amber-500">转化中</Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">预计转化金额: ¥650,000</p>
                      <p className="text-sm text-muted-foreground">2024年</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 团队表现 */}
        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">团队成员</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">教授 6人，副教授 8人，讲师 14人</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">研究生培养</CardTitle>
                <GraduationCapIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">博士生 15人，硕士生 30人</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">学术交流</CardTitle>
                <TargetIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">国际会议 5次，国内会议 7次</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">合作单位</CardTitle>
                <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">16</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-muted-foreground">高校 8家，企业 6家，研究所 2家</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>团队成员贡献</CardTitle>
                <CardDescription>按成员统计科研产出</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TeamPerformanceChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>近期团队活动</CardTitle>
                <CardDescription>学术交流与团队建设</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">学术研讨会</p>
                      <p className="text-sm text-muted-foreground">04-28 14:00-16:00</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <UsersIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">团队建设活动</p>
                      <p className="text-sm text-muted-foreground">05-05 全天</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <TrendingUpIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">年度工作计划会议</p>
                      <p className="text-sm text-muted-foreground">05-12 09:00-11:30</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 项目进度和近期日程 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>项目进度</CardTitle>
            <CardDescription>近期进行中的项目</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">人工智能辅助科研决策系统</div>
                  <Badge className="bg-red-500">国家级项目</Badge>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-muted-foreground">剩余时间: 45天</div>
                  <div className="text-sm font-medium">75%</div>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">新型材料力学性能研究</div>
                  <Badge className="bg-orange-500">省部级项目</Badge>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-muted-foreground">剩余时间: 120天</div>
                  <div className="text-sm font-medium">45%</div>
                </div>
                <Progress value={45} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">生物医学图像处理技术</div>
                  <Badge className="bg-blue-500">校级项目</Badge>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-muted-foreground">剩余时间: 180天</div>
                  <div className="text-sm font-medium">30%</div>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>近期日程</CardTitle>
            <CardDescription>未来7天的重要日程</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <CalendarIcon className="h-5 w-5 text-red-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">项目评审会议</p>
                  <p className="text-sm text-muted-foreground">04-24 14:00-16:00</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                  <FileTextIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">经费使用情况检查</p>
                  <p className="text-sm text-muted-foreground">04-25 全天</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">项目组会议</p>
                  <p className="text-sm text-muted-foreground">04-26 10:00-11:30</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

