"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Award, 
  FileText, 
  BookOpen, 
  Database, 
  Lightbulb,
  Calendar,
  Plus,
  Download,
  Eye
} from "lucide-react"

interface ContractAchievementsTabProps {
  data: any
}

export default function ContractAchievementsTab({ data }: ContractAchievementsTabProps) {
  // 模拟合同成果数据
  const achievements = [
    {
      id: "ach1",
      type: "论文",
      title: "基于深度学习的目标检测与跟踪关键技术研究",
      date: "2024-04-10",
      authors: "张三, 李四, 王五",
      journal: "计算机科学与技术",
      status: "已发表",
      link: "#"
    },
    {
      id: "ach2",
      type: "专利",
      title: "一种基于深度学习的目标检测方法及系统",
      date: "2024-03-15",
      inventors: "张三, 李四",
      patentNo: "CN202410123456.X",
      status: "已申请",
      link: "#"
    },
    {
      id: "ach3",
      type: "软件著作权",
      title: "目标检测与跟踪系统V1.0",
      date: "2024-02-20",
      authors: "张三, 李四, 王五",
      regNo: "2024SR0123456",
      status: "已登记",
      link: "#"
    },
    {
      id: "ach4",
      type: "技术报告",
      title: "目标检测与跟踪技术研究进展报告",
      date: "2024-01-30",
      authors: "张三, 李四",
      pages: "45",
      status: "已完成",
      link: "#"
    }
  ]
  
  // 模拟合同预期成果
  const expectedAchievements = [
    {
      id: "exp1",
      type: "论文",
      description: "在国内外重要学术期刊发表研究论文不少于2篇",
      deadline: "2024-09-30",
      progress: 50,
      status: "进行中"
    },
    {
      id: "exp2",
      type: "专利",
      description: "申请发明专利不少于1项",
      deadline: "2024-08-31",
      progress: 100,
      status: "已完成"
    },
    {
      id: "exp3",
      type: "软件著作权",
      description: "申请软件著作权不少于1项",
      deadline: "2024-07-31",
      progress: 100,
      status: "已完成"
    },
    {
      id: "exp4",
      type: "技术报告",
      description: "提交技术研究报告不少于2份",
      deadline: "2024-09-15",
      progress: 50,
      status: "进行中"
    },
    {
      id: "exp5",
      type: "原型系统",
      description: "开发完成目标检测与跟踪原型系统",
      deadline: "2024-09-30",
      progress: 30,
      status: "进行中"
    }
  ]
  
  // 获取类型对应的图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "论文":
        return <BookOpen className="h-5 w-5 text-blue-500" />
      case "专利":
        return <Lightbulb className="h-5 w-5 text-amber-500" />
      case "软件著作权":
        return <Database className="h-5 w-5 text-purple-500" />
      case "技术报告":
        return <FileText className="h-5 w-5 text-green-500" />
      case "原型系统":
        return <Award className="h-5 w-5 text-red-500" />
      default:
        return <Award className="h-5 w-5 text-slate-500" />
    }
  }
  
  // 获取状态对应的颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "已发表":
      case "已登记":
      case "已完成":
        return "bg-green-50 text-green-700 border-green-200"
      case "已申请":
      case "进行中":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "未开始":
        return "bg-slate-50 text-slate-700 border-slate-200"
      case "已延期":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* 合同成果概览 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">成果概览</CardTitle>
          <CardDescription>合同相关的研究成果</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-semibold">1</div>
                <div className="text-sm text-slate-600">论文</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-semibold">1</div>
                <div className="text-sm text-slate-600">专利</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <Database className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-semibold">1</div>
                <div className="text-sm text-slate-600">软件著作权</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-semibold">1</div>
                <div className="text-sm text-slate-600">技术报告</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-sm">成果完成进度</div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                总进度: 60%
              </Badge>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>已完成: 3项</span>
              <span>进行中: 2项</span>
              <span>未开始: 0项</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 已有成果 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">已有成果</CardTitle>
          <CardDescription>合同产生的研究成果</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="p-4 rounded-md border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(achievement.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="font-medium">{achievement.title}</div>
                      <Badge className={getStatusColor(achievement.status)}>
                        {achievement.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 text-sm text-slate-600">
                      {achievement.type === "论文" && (
                        <>
                          <div>作者: {achievement.authors}</div>
                          <div>期刊: {achievement.journal}</div>
                        </>
                      )}
                      
                      {achievement.type === "专利" && (
                        <>
                          <div>发明人: {achievement.inventors}</div>
                          <div>专利号: {achievement.patentNo}</div>
                        </>
                      )}
                      
                      {achievement.type === "软件著作权" && (
                        <>
                          <div>著作权人: {achievement.authors}</div>
                          <div>登记号: {achievement.regNo}</div>
                        </>
                      )}
                      
                      {achievement.type === "技术报告" && (
                        <>
                          <div>作者: {achievement.authors}</div>
                          <div>页数: {achievement.pages}页</div>
                        </>
                      )}
                      
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{achievement.date}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>查看详情</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Download className="h-3.5 w-3.5" />
                        <span>下载</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-2 flex justify-center">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>添加成果</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 预期成果 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">预期成果</CardTitle>
          <CardDescription>合同约定的预期成果</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expectedAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="p-4 rounded-md border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(achievement.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="font-medium">{achievement.type}</div>
                      <Badge className={getStatusColor(achievement.status)}>
                        {achievement.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 text-sm text-slate-600">
                      <div>{achievement.description}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>截止日期: {achievement.deadline}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>完成进度</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-2 flex justify-center">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>添加预期成果</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
