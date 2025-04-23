"use client"

import { useState } from "react"
import { Calendar, Clock, FileText, Link, ExternalLink, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface FundsRelatedProjectsTabProps {
  data: any
}

export default function FundsRelatedProjectsTab({ data }: FundsRelatedProjectsTabProps) {
  // 模拟关联项目数据
  const [relatedProjects, setRelatedProjects] = useState([
    {
      id: data.project.id,
      name: data.project.name,
      leader: "张三",
      startDate: "2023-01-01",
      endDate: "2025-12-31",
      status: "进行中",
      budget: data.amount * 1.5, // 假设项目总预算是入账金额的1.5倍
      progress: 45,
    }
  ])
  
  // 如果是大额经费，模拟添加一个子项目
  if (data.amount > 500000) {
    relatedProjects.push({
      id: "sub-" + data.project.id,
      name: data.project.name + " - 子项目",
      leader: "李四",
      startDate: "2023-03-01",
      endDate: "2025-06-30",
      status: "进行中",
      budget: data.amount * 0.4, // 假设子项目预算是入账金额的0.4倍
      progress: 35,
    })
  }
  
  return (
    <div className="space-y-6">
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">关联项目</span>
          </div>
          <div className="space-y-4">
            {relatedProjects.map((project, index) => (
              <div key={index} className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Link className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium text-slate-900">{project.name}</h3>
                    </div>
                    <Badge 
                      className={
                        project.status === "已完成" 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : project.status === "进行中" 
                            ? "bg-blue-50 text-blue-700 border-blue-200" 
                            : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">项目负责人</div>
                      <div className="text-sm">{project.leader}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">项目周期</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{project.startDate} 至 {project.endDate}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">项目预算</div>
                      <div className="text-sm">¥{project.budget.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">项目进度</div>
                      <div className="flex items-center gap-2">
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-600">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs bg-white hover:bg-primary/5"
                    >
                      查看项目详情
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">经费使用情况</span>
          </div>
          <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">总预算</span>
                  </div>
                  <span className="text-sm font-medium">
                    ¥{data.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">已使用</span>
                  <span className="text-sm text-slate-600">
                    ¥{(data.amount * 0.35).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">剩余</span>
                  <span className="text-sm text-green-600 font-medium">
                    ¥{(data.amount * 0.65).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: '35%' }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>0%</span>
                  <span>使用率: 35%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
