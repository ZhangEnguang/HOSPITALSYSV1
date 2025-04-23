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
  BarChart,
  ArrowUpRight
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CompletionRelatedProjectsTabProps {
  completion: any
}

export default function CompletionRelatedProjectsTab({ completion }: CompletionRelatedProjectsTabProps) {
  // 模拟关联项目数据
  const relatedProjects = [
    {
      id: "proj1",
      name: completion.title ? completion.title.replace("结项报告", "") : "高校科研创新管理平台",
      status: "已完成",
      leader: completion.applicant,
      startDate: "2023-01-01",
      endDate: completion.completionDate || "2024-04-15",
      progress: 100,
      department: completion.department,
      type: "校级项目",
      budget: "50万元"
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
          <CardDescription>与此项目结项相关联的科研项目</CardDescription>
        </CardHeader>
        <CardContent>
          {relatedProjects.length > 0 ? (
            <div className="space-y-4">
              {relatedProjects.map((project) => {
                const statusInfo = getStatusInfo(project.status)
                
                return (
                  <div 
                    key={project.id}
                    className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <h3 className="font-medium">{project.name}</h3>
                        <Badge variant="outline" className={statusInfo.color}>
                          <span className="flex items-center gap-1">
                            {statusInfo.icon}
                            {project.status}
                          </span>
                        </Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1 relative bg-white hover:bg-primary/5 border border-slate-200 shadow-sm self-start md:self-center"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span className="text-xs">查看项目</span>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">负责人:</span>
                        <span>{project.leader}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">周期:</span>
                        <span>{project.startDate} 至 {project.endDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">进度:</span>
                        <div className="flex items-center gap-1">
                          <Progress value={project.progress} className="h-2 w-16" />
                          <span>{project.progress}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">类型:</span>
                        <span>{project.type}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 col-span-2">
                        <Link className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">部门:</span>
                        <span>{project.department}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-slate-100 p-3 mb-3">
                <Link className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium mb-1">暂无关联项目</h3>
              <p className="text-xs text-muted-foreground mb-3">该项目结项暂未关联任何项目</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
