"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Calendar, DollarSign, Users } from "lucide-react"

interface FundsOutboundRelatedProjectsTabProps {
  data: any
}

export default function FundsOutboundRelatedProjectsTab({ data }: FundsOutboundRelatedProjectsTabProps) {
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
    description: "本项目旨在研究基于深度学习的复杂场景目标检测与跟踪关键技术，解决在复杂环境下目标检测精度低、实时性差等问题，提出新的算法和模型，并在智能监控、自动驾驶等领域进行应用验证。"
  }

  // 经费使用情况
  const fundUsage = [
    { category: "设备费", budget: 600000, used: 380000, percentage: 63 },
    { category: "材料费", budget: 300000, used: 120000, percentage: 40 },
    { category: "测试化验费", budget: 200000, used: 50000, percentage: 25 },
    { category: "差旅费", budget: 100000, used: 30000, percentage: 30 },
    { category: "会议费", budget: 80000, used: 20000, percentage: 25 },
    { category: "劳务费", budget: 220000, used: 20000, percentage: 9 }
  ]

  return (
    <div className="space-y-6">
      {/* 关联项目信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <GitBranch className="h-5 w-5 mr-2 text-blue-500" />
            关联项目信息
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

      {/* 经费使用情况 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" />
            经费使用情况
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">总预算</p>
                <p className="text-xl font-medium">¥ {projectData.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">已使用</p>
                <p className="text-xl font-medium">¥ {projectData.usedBudget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">使用比例</p>
                <p className="text-xl font-medium">{Math.round(projectData.usedBudget / projectData.budget * 100)}%</p>
              </div>
            </div>
            
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full" 
                style={{ width: `${Math.round(projectData.usedBudget / projectData.budget * 100)}%` }}
              ></div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm font-medium mb-3">分类经费使用情况</p>
              <div className="space-y-3">
                {fundUsage.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.category}</span>
                      <span>¥ {item.used.toLocaleString()} / ¥ {item.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
              <p className="text-sm text-amber-700">
                <span className="font-medium">注意：</span> 本次外拨金额 ¥ {data.amount.toLocaleString()} 元已计入"{data.category}"类别的已使用经费中。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
