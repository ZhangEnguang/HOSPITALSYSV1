"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  PieChart, 
  Clock, 
  CheckCircle, 
  Clipboard, 
  CalendarDays,
  FileCheck,
  FileText,
  BriefcaseMedical,
  User,
  Users,
  AlertCircle,
  CircleAlert,
  Activity,
  Brain,
  Target,
  LineChart,
  Beaker,
  FlaskConical
} from "lucide-react"

// 增强进度组件
import { EnhancedProgress } from "../../animal/components/enhanced-progress"
import { formatDateToString } from "@/lib/utils"

// 人体伦理项目实验进度标签组件
export default function ExperimentProgressTab({ todo }: { todo?: any }) {
  const [activeTab, setActiveTab] = useState("findings")
  
  // 模拟项目基本信息
  const projectInfo = {
    startDate: todo?.startDate || "2024-01-01",
    endDate: todo?.endDate || "2026-12-31",
    progress: todo?.progress || 35,
    budget: todo?.budget || 850000,
    budgetUsed: 242250, // 约28.5%
    milestones: [
      {
        name: "入组准备完成",
        date: "2024-01-15",
        status: "已完成",
        description: "完成受试者筛选标准制定，研究人员培训与入组前准备工作"
      },
      {
        name: "基线数据收集",
        date: "2024-02-28",
        status: "已完成",
        description: "完成所有入组受试者的基线生理和实验室指标数据收集"
      },
      {
        name: "中期数据分析",
        date: "2024-07-30",
        status: "进行中",
        description: "完成干预实施3个月后数据收集与分析，评估初步效果"
      },
      {
        name: "最终结果分析",
        date: "2025-12-31",
        status: "未开始",
        description: "完成全部研究数据收集与分析，形成最终研究报告"
      }
    ],
    tasks: {
      completed: todo?.tasks?.completed || 3,
      total: todo?.tasks?.total || 8
    }
  }
  
  // 模拟研究结果和发现
  const researchFindings = [
    {
      id: "1",
      category: "初步结果",
      title: "饮食干预对血脂水平的影响",
      description: "初步数据显示干预组患者低密度脂蛋白胆固醇平均下降16.5%，高密度脂蛋白胆固醇平均升高8.2%，均达到统计学显著性(p<0.01)。",
      date: "2024-03-10",
      status: "已验证",
      significance: "高"
    },
    {
      id: "2",
      category: "观察发现",
      title: "饮食依从性与效果关系",
      description: "饮食日记记录完整度超过80%的患者血脂改善效果显著优于记录完整度低于50%的患者，提示依从性是影响干预效果的重要因素。",
      date: "2024-03-15",
      status: "观察中",
      significance: "中"
    },
    {
      id: "3",
      category: "观察发现",
      title: "男女性患者对干预方案的反应差异",
      description: "女性患者在饮食干预方案执行中表现出更高的依从性和更好的血脂调节效果，但样本量尚不足以得出确定性结论。",
      date: "2024-03-20",
      status: "待验证",
      significance: "待定"
    }
  ]
  
  // 模拟参与者数据
  const participantData = {
    planned: 120,
    enrolled: 80,
    active: 78,
    completed: 0,
    withdrawn: 2,
    enrollmentRate: 66.7,
    retentionRate: 97.5,
    groups: [
      { name: "干预组", count: 40 },
      { name: "对照组", count: 40 }
    ],
    demographics: {
      gender: { male: 43, female: 37 },
      ageRanges: [
        { range: "40-50岁", count: 22 },
        { range: "51-60岁", count: 38 },
        { range: "61-70岁", count: 20 }
      ]
    }
  }
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      return formatDateToString(new Date(dateString));
    } catch (error) {
      return dateString;
    }
  };
  
  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-700 border-green-200";
      case "进行中":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "未开始":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "已验证":
        return "bg-green-100 text-green-700 border-green-200";
      case "观察中":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "待验证":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };
  
  // 获取重要性样式
  const getSignificanceStyle = (significance: string) => {
    switch (significance) {
      case "高":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "中":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "低":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* 研究进度概览卡片 */}
      <Card className="border-slate-200 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            研究进度概览
          </CardTitle>
          <CardDescription>
            项目时间段：{formatDate(projectInfo.startDate)} 至 {formatDate(projectInfo.endDate)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-600">
                  <BarChart3 className="h-4 w-4" />
                  总体进度
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{projectInfo.progress}%</span>
                  <span className="text-xs text-slate-500">预期进度: 40%</span>
                </div>
                <EnhancedProgress value={projectInfo.progress} variant="default" size="md" />
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>已用时间: {Math.round((new Date().getTime() - new Date(projectInfo.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}个月</span>
                  <span>总计: {Math.round((new Date(projectInfo.endDate).getTime() - new Date(projectInfo.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}个月</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                  <BriefcaseMedical className="h-4 w-4" />
                  经费使用
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">28.5%</span>
                  <span className="text-xs text-slate-500">预期: 30%</span>
                </div>
                <EnhancedProgress value={28.5} variant="warning" size="md" />
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>已使用: ¥{projectInfo.budgetUsed.toLocaleString()}</span>
                  <span>总预算: ¥{projectInfo.budget.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  任务完成
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{Math.round((projectInfo.tasks.completed / projectInfo.tasks.total) * 100)}%</span>
                  <span className="text-xs text-slate-500">预期: 40%</span>
                </div>
                <EnhancedProgress value={(projectInfo.tasks.completed / projectInfo.tasks.total) * 100} variant="success" size="md" />
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>已完成: {projectInfo.tasks.completed}项</span>
                  <span>总计: {projectInfo.tasks.total}项</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 研究里程碑 */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-800 mb-3 flex items-center">
              <CalendarDays className="h-4 w-4 mr-2 text-slate-500" />
              项目关键里程碑
            </h3>
            <div className="relative">
              {/* 连接线 */}
              <div className="absolute left-4 top-6 bottom-6 w-px bg-slate-200"></div>
              
              <div className="space-y-8">
                {projectInfo.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start">
                    <div className="relative flex-none">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        milestone.status === "已完成" 
                          ? "border-green-100 bg-green-50" 
                          : milestone.status === "进行中"
                            ? "border-blue-100 bg-blue-50"
                            : "border-slate-100 bg-slate-50"
                      }`}>
                        {milestone.status === "已完成" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : milestone.status === "进行中" ? (
                          <Clock className="h-4 w-4 text-blue-500" />
                        ) : (
                          <CircleAlert className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          {milestone.name}
                          <Badge variant="outline" className={getStatusStyle(milestone.status)}>
                            {milestone.status}
                          </Badge>
                        </h4>
                        <span className="text-xs text-slate-500">{milestone.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 标签页：研究结果 和 参与者数据 */}
      <Tabs defaultValue="findings" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-4">
          <TabsTrigger value="findings">
            <FileText className="h-4 w-4 mr-2" />
            研究结果
          </TabsTrigger>
          <TabsTrigger value="participants">
            <Users className="h-4 w-4 mr-2" />
            参与者数据
          </TabsTrigger>
        </TabsList>
        
        {/* 研究结果标签内容 */}
        <TabsContent value="findings" className="mt-0">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Beaker className="h-5 w-5 text-blue-500" />
                研究发现与结果
              </CardTitle>
              <CardDescription>
                研究过程中的重要发现与结果记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {researchFindings.map((finding) => (
                  <div key={finding.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                          {finding.category}
                        </Badge>
                        <h3 className="text-sm font-medium">{finding.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={getStatusStyle(finding.status)}
                        >
                          {finding.status}
                        </Badge>
                        {finding.significance !== "待定" && (
                          <Badge 
                            variant="outline" 
                            className={getSignificanceStyle(finding.significance)}
                          >
                            {finding.significance}重要性
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{finding.description}</p>
                    <div className="text-xs text-slate-500">记录日期: {finding.date}</div>
                  </div>
                ))}
                
                {researchFindings.length === 0 && (
                  <div className="py-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                      <FileText className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">尚无研究发现记录</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 参与者数据标签内容 */}
        <TabsContent value="participants" className="mt-0">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                参与者信息
              </CardTitle>
              <CardDescription>
                研究参与者招募和保留情况
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">招募情况</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">计划招募</span>
                        <span className="text-sm font-medium">{participantData.planned}人</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">已招募</span>
                          <span className="text-sm font-medium">{participantData.enrolled}人 ({participantData.enrollmentRate}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{width: `${participantData.enrollmentRate}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <h4 className="text-xs font-medium text-slate-700 mb-2">当前参与者状态</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white p-2 rounded border border-slate-100 text-center">
                          <div className="text-sm font-medium text-blue-600">{participantData.active}</div>
                          <div className="text-xs text-slate-500">活跃</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-100 text-center">
                          <div className="text-sm font-medium text-green-600">{participantData.completed}</div>
                          <div className="text-xs text-slate-500">完成</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-100 text-center">
                          <div className="text-sm font-medium text-amber-600">{participantData.withdrawn}</div>
                          <div className="text-xs text-slate-500">退出</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">保留率:</span>
                          <span className="font-medium text-green-600">{participantData.retentionRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">研究组分布</h3>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {participantData.groups.map((group, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">{group.name}</span>
                            <span className="text-sm font-medium">{group.count}人</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}
                              style={{width: `${(group.count / participantData.enrolled) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <h4 className="text-xs font-medium text-slate-700 mb-2">人口统计学特征</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">性别分布</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                              <span className="text-xs text-slate-600">男性: {participantData.demographics.gender.male}人</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                              <span className="text-xs text-slate-600">女性: {participantData.demographics.gender.female}人</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">年龄分布</span>
                          </div>
                          <div className="space-y-2">
                            {participantData.demographics.ageRanges.map((ageRange, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-xs text-slate-600">{ageRange.range}</span>
                                <div className="flex items-center">
                                  <span className="text-xs font-medium mr-2">{ageRange.count}人</span>
                                  <span className="text-xs text-slate-500">
                                    ({Math.round((ageRange.count / participantData.enrolled) * 100)}%)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 