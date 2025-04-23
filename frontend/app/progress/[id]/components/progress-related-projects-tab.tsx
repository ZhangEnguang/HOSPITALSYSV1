"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Calendar, User, GitBranch, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface ProgressRelatedProjectsTabProps {
  data: any
}

export default function ProgressRelatedProjectsTab({ data }: ProgressRelatedProjectsTabProps) {
  // 模拟关联项目数据
  const relatedProjects = [
    {
      id: "PRJ-2024-001",
      name: "高校科研创新管理平台",
      status: "进行中",
      leader: "张三",
      department: "计算机科学学院",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      budget: "50万元",
      progress: 45
    }
  ]

  // 获取状态对应的图标和颜色
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "进行中":
        return { icon: <Clock className="h-4 w-4 text-blue-500" />, color: "bg-blue-50 text-blue-700 border-blue-200" }
      case "已完成":
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, color: "bg-green-50 text-green-700 border-green-200" }
      case "已暂停":
        return { icon: <AlertCircle className="h-4 w-4 text-amber-500" />, color: "bg-amber-50 text-amber-700 border-amber-200" }
      case "已取消":
        return { icon: <XCircle className="h-4 w-4 text-red-500" />, color: "bg-red-50 text-red-700 border-red-200" }
      default:
        return { icon: <Clock className="h-4 w-4 text-gray-500" />, color: "bg-gray-50 text-gray-700 border-gray-200" }
    }
  }

  return (
    <div className="space-y-6">
      {/* 关联项目 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">关联项目</span>
          </div>
          
          {relatedProjects.length > 0 ? (
            <div className="space-y-4">
              {relatedProjects.map((project, index) => (
                <div key={index} className="border border-gray-100 rounded-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium mb-1">{project.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{project.id}</span>
                        <span>•</span>
                        <Badge className={getStatusInfo(project.status).color}>
                          <div className="flex items-center gap-1">
                            {getStatusInfo(project.status).icon}
                            <span>{project.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">查看项目</span>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">项目负责人</div>
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-gray-500" />
                        <span>{project.leader}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">所属部门</div>
                      <div>{project.department}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">开始日期</div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span>{project.startDate}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">结束日期</div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span>{project.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>暂无关联项目</p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">变更影响</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm">{data.impact || "暂无影响说明"}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
