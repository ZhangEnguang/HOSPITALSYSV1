"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreVertical,
  Eye,
  Link,
  Link2Off,
  ExternalLink,
  Calendar,
  Users,
  BarChart2
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"

interface InspectionRelatedProjectsTabProps {
  data: any
}

export default function InspectionRelatedProjectsTab({ data }: InspectionRelatedProjectsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  // 模拟关联项目数据
  const [relatedProjects, setRelatedProjects] = useState([
    {
      id: "proj-001",
      name: "高校科研创新管理平台",
      code: "XM2024001",
      status: "进行中",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      leader: {
        name: "张三",
        avatar: "/avatars/01.png"
      },
      department: "计算机科学学院",
      progress: 65,
      budget: "500,000",
      members: 8
    }
  ])

  // 过滤项目
  const filteredProjects = relatedProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 处理查看项目详情
  const handleViewProject = (project: any) => {
    toast({
      title: "查看项目详情",
      description: `正在跳转到项目 ${project.name} 详情页`,
      duration: 3000,
    })
  }

  // 处理解除关联
  const handleUnlink = (projectId: string) => {
    setRelatedProjects(relatedProjects.filter(p => p.id !== projectId))
    
    toast({
      title: "解除关联成功",
      description: "已解除与该项目的关联",
      duration: 3000,
    })
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "进行中":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "已完成":
        return "bg-green-50 text-green-700 border-green-200"
      case "已延期":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "已暂停":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">关联项目</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索项目..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {filteredProjects.length > 0 ? (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold">{project.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {project.code}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{project.startDate} 至 {project.endDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>{project.members}人</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart2 className="h-3.5 w-3.5" />
                            <span>{project.budget}元</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-500">项目进度</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={project.leader.avatar} />
                          <AvatarFallback>{project.leader.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{project.leader.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => handleViewProject(project)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>查看</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProject(project)}>
                              <Eye className="h-4 w-4 mr-2" />
                              <span>查看项目</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`/projects/${project.id}`, '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              <span>新窗口打开</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUnlink(project.id)}
                              className="text-red-600"
                            >
                              <Link2Off className="h-4 w-4 mr-2" />
                              <span>解除关联</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Link className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">没有找到关联项目</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm ? "没有找到匹配的项目，请尝试其他搜索词" : "此项目中检尚未关联任何项目"}
              </p>
              {!searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                >
                  <Link className="h-4 w-4 mr-2" />
                  <span>关联项目</span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">项目信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">项目名称</h3>
                <p className="text-sm font-medium">高校科研创新管理平台</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">项目编号</h3>
                <p className="text-sm font-medium">XM2024001</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">项目负责人</h3>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/avatars/01.png" />
                    <AvatarFallback>张</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">张三</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">所属部门</h3>
                <p className="text-sm font-medium">计算机科学学院</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">项目周期</h3>
                <p className="text-sm font-medium">2024-01-01 至 2024-12-31</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">项目状态</h3>
                <Badge className={getStatusColor("进行中")}>
                  进行中
                </Badge>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">项目描述</h3>
              <p className="text-sm text-slate-700">
                本项目旨在开发一套高校科研创新管理平台，用于管理高校科研项目、成果、经费等信息，提高科研管理效率和科研成果转化率。平台包括项目管理、成果管理、经费管理、统计分析等模块，支持多角色访问和权限控制。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
