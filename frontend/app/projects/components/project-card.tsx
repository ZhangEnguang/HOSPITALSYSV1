"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    status: "进行中" | "规划中" | "已完成"
    priority: "高" | "中" | "低"
    startDate: string
    endDate: string
    budget: number
    progress: number
    manager: {
      name: string
      avatar?: string
    }
    teamSize: number
    completedTasks: number
    totalTasks: number
    changeNumber?: string
    projectNumber?: string
    department?: string
    type?: string
  }
  viewMode: "grid" | "list"
  selected?: boolean
  onSelect?: (id: string) => void
}

export default function ProjectCard({ project, viewMode, selected, onSelect }: ProjectCardProps) {
  const statusColors = {
    进行中: "bg-yellow-500 hover:bg-yellow-600",
    规划中: "bg-blue-500 hover:bg-blue-600",
    已完成: "bg-green-500 hover:bg-green-600",
  }

  const statusTextMap = {
    进行中: "审核中",
    规划中: "待审核",
    已完成: "已批准",
  }

  const statusClassMap = {
    进行中: "bg-yellow-50 text-yellow-600 border-yellow-200",
    规划中: "bg-blue-50 text-blue-600 border-blue-200",
    已完成: "bg-green-50 text-green-600 border-green-200",
  }

  const router = useRouter();
  
  // 处理编辑项目点击
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡到卡片点击
    e.preventDefault(); // 阻止默认行为
    
    // 获取项目ID和类型
    const projectId = project.id;
    const projectType = project.type?.includes('校') ? 'school' : 
                      project.type?.includes('纵') ? 'vertical' : 'horizontal';
    
    // 直接跳转到编辑页面，不通过API路由
    let editUrl = '';
    if (projectType === 'school') {
      editUrl = `/projects/edit/school/${projectId}`;
    } else if (projectType === 'vertical') {
      editUrl = `/projects/edit/vertical/${projectId}`;
    } else {
      editUrl = `/projects/edit/${projectId}`;
    }
    
    console.log('跳转到编辑页面:', editUrl);
    router.push(editUrl);
  };

  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 py-4 px-4 hover:bg-muted/50 border-b">
        <div className="flex-shrink-0">
          <Checkbox checked={selected} onCheckedChange={() => onSelect?.(project.id)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="truncate font-medium">{project.title}</div>
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                变更编号: {project.changeNumber || "BG-2023-001"}
              </div>
            </div>

            <div className="flex-shrink-0 w-[140px]">{project.projectNumber || "NSFC-2023-001"}</div>

            <div className="flex-shrink-0 w-[100px]">内容变更</div>

            <div className="flex-shrink-0 w-[100px]">{project.manager.name}</div>

            <div className="flex-shrink-0 w-[160px]">{project.department || "计算机科学与技术学院"}</div>

            <div className="flex-shrink-0 w-[100px]">{project.startDate}</div>

            <div className="flex-shrink-0 w-[100px]">
              <Badge variant="outline" className={cn("font-normal", statusClassMap[project.status])}>
                {statusTextMap[project.status]}
              </Badge>
            </div>

            <div className="flex-shrink-0">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={handleEditClick}
                >
                  编辑项目
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEditClick}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("group relative overflow-hidden transition-all hover:shadow-md")}>
      <CardContent className="p-6 md:p-8">
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-medium">{project.title}</h3>
                <Badge variant="secondary" className="h-5">
                  {statusTextMap[project.status]}
                </Badge>
                <Badge variant="secondary" className="h-5">
                  {project.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={handleEditClick}
              >
                编辑项目
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEditClick}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Project Info */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={project.manager.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {project.manager.name ? project.manager.name[0] : '?'}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{project.manager.name}</div>
                <div className="text-muted-foreground">项目负责人</div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-medium">项目周期</div>
              <div className="text-sm text-muted-foreground">
                {project.startDate} - {project.endDate}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-medium">项目预算</div>
              <div className="text-sm text-muted-foreground">¥{project.budget.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>项目进度</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                已完成任务: {project.completedTasks}/{project.totalTasks}
              </span>
              <span>团队成员: {project.teamSize} 人</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

