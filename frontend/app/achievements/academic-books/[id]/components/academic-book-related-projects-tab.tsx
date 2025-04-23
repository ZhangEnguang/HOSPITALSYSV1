"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Calendar, DollarSign, Users, FileText, BookOpen } from "lucide-react"

interface AcademicBookRelatedProjectsTabProps {
  data: any
}

export default function AcademicBookRelatedProjectsTab({ data }: AcademicBookRelatedProjectsTabProps) {
  // 项目状态映射
  const projectStatusMap = {
    "进行中": "bg-blue-50 text-blue-700 border-blue-200",
    "已完成": "bg-green-50 text-green-700 border-green-200",
    "已暂停": "bg-amber-50 text-amber-700 border-amber-200",
    "已终止": "bg-red-50 text-red-700 border-red-200"
  }
  
  // 示例项目数据（实际应用中应从API获取）
  const projectData = {
    id: data.project.id,
    name: data.project.name,
    code: `PRJ-${data.project.id}-2024`,
    status: "进行中",
    startDate: "2023-09-01",
    endDate: "2025-08-31",
    budget: 1500000,
    usedBudget: 620000,
    leader: {
      name: "张三",
      title: "教授",
      department: "计算机科学与技术学院"
    },
    members: 8,
    description: "本项目旨在研究智能计算关键技术，探索人工智能、大数据分析和高性能计算在各领域的应用，提出创新性解决方案，并通过实际案例验证其有效性和可行性。"
  }

  // 相关成果
  const relatedAchievements = [
    {
      id: "p1",
      name: "一种基于深度学习的智能识别方法",
      type: "专利",
      status: "已授权",
      date: "2023-11-15"
    },
    {
      id: "a2",
      name: "人工智能在科学计算中的应用研究",
      type: "学术论文",
      status: "已发表",
      date: "2023-06-10"
    },
    {
      id: "a3",
      name: "智能计算关键技术创新平台",
      type: "成果获奖",
      status: "已获奖",
      date: "2023-12-10"
    }
  ]

  return (
    <div className="space-y-6">
      {/* 关联项目信息 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-500" />
            <span>关联项目信息</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-medium">{projectData.name}</h3>
                <p className="text-sm text-slate-500 mt-1">项目编号：{projectData.code}</p>
              </div>
              <Badge 
                className={projectStatusMap[projectData.status as keyof typeof projectStatusMap] || ""}
                variant="outline"
              >
                {projectData.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">项目周期</p>
                  <p className="text-sm">{projectData.startDate} 至 {projectData.endDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">项目预算</p>
                  <p className="text-sm">¥ {projectData.budget.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">项目成员</p>
                  <p className="text-sm">{projectData.members} 人</p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">项目简介</p>
              <p className="text-sm text-slate-600">{projectData.description}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">项目负责人</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                  {projectData.leader.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{projectData.leader.name}</p>
                  <p className="text-xs text-slate-500">{projectData.leader.title} · {projectData.leader.department}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目相关成果 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            <span>项目相关成果</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relatedAchievements.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{item.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={
                      item.type === "学术论文" 
                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                        : item.type === "专利"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                    }
                  >
                    {item.type}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{item.status}</span>
                  </div>
                  {item.date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
              <div className="flex items-start">
                <GitBranch className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <p className="text-sm text-blue-700">
                  <span className="font-medium">成果贡献：</span> 本著作是项目"{projectData.name}"的重要研究成果之一，系统总结了项目研究过程中的理论创新和实践经验，为项目的顺利实施和目标达成提供了重要的理论支持和技术指导。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
