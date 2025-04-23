"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Link, 
  ExternalLink, 
  Calendar, 
  User, 
  Clock,
  CheckCircle,
  AlertCircle,
  Timer,
  BarChart
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ContractRelatedProjectsTabProps {
  data: any
}

export default function ContractRelatedProjectsTab({ data }: ContractRelatedProjectsTabProps) {
  // 模拟关联项目数据
  const relatedProjects = [
    {
      id: "proj1",
      name: data.project?.name || "基于深度学习的复杂场景目标检测与跟踪关键技术研究",
      status: "进行中",
      leader: data.applicant,
      startDate: "2023-09-01",
      endDate: "2025-08-31",
      progress: 45,
      department: data.department,
      type: "国家自然科学基金",
      budget: "120万元"
    }
  ]
  
  // 获取状态对应的颜色和图标
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "进行中":
        return { 
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock className="h-4 w-4 text-blue-500" />
        }
      case "已完成":
        return { 
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        }
      case "已暂停":
        return { 
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Timer className="h-4 w-4 text-amber-500" />
        }
      case "已取消":
        return { 
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <AlertCircle className="h-4 w-4 text-red-500" />
        }
      default:
        return { 
          color: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <BarChart className="h-4 w-4 text-slate-500" />
        }
    }
  }
  
  return (
    <div className="space-y-6">
      {/* 关联项目 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">关联项目</CardTitle>
          <CardDescription>与此合同认定相关联的科研项目</CardDescription>
        </CardHeader>
        <CardContent>
          {relatedProjects.length > 0 ? (
            <div className="space-y-4">
              {relatedProjects.map((project) => {
                const statusInfo = getStatusInfo(project.status)
                
                return (
                  <div 
                    key={project.id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <h3 className="font-medium">{project.name}</h3>
                        <Badge className={statusInfo.color}>
                          <span className="flex items-center gap-1">
                            {statusInfo.icon}
                            {project.status}
                          </span>
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1 self-start md:self-center">
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>查看项目</span>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          负责人
                        </div>
                        <div className="text-sm">{project.leader}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          项目周期
                        </div>
                        <div className="text-sm">{project.startDate} 至 {project.endDate}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Link className="h-3.5 w-3.5" />
                          项目类型
                        </div>
                        <div className="text-sm">{project.type}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <BarChart className="h-3.5 w-3.5" />
                          项目预算
                        </div>
                        <div className="text-sm">{project.budget}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">项目进度</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Link className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p>暂无关联项目</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 gap-1"
              >
                <Link className="h-4 w-4" />
                <span>关联项目</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
