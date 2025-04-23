"use client"

import { useState } from "react"
import { 
  GitBranch, 
  Calendar, 
  Users, 
  BarChart, 
  Clock, 
  ArrowUpRight,
  Search,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  FileText,
  Layers,
  CheckCircle,
  AlertCircle,
  Timer,
  User,
  Lightbulb
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

interface PatentRelatedProjectsTabProps {
  data: any
}

export default function PatentRelatedProjectsTab({ data }: PatentRelatedProjectsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  
  // 模拟相关项目数据
  const relatedProjects = [
    {
      id: data.project?.id || "1",
      name: data.project?.name || "智慧园区综合管理平台",
      description: "该项目旨在开发智慧园区综合管理平台，实现园区的智能化管理和运营。",
      status: "进行中",
      startDate: "2022-06-15",
      endDate: "2024-12-31",
      progress: 75,
      leader: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
      members: 12,
      budget: "¥1,200,000",
      department: "信息技术部",
      priority: "高",
      isExpanded: true
    },
    {
      id: "2",
      name: "智能监控系统升级",
      description: "对现有智能监控系统进行升级，提升监控精度和智能分析能力。",
      status: "规划中",
      startDate: "2024-07-01",
      endDate: "2025-06-30",
      progress: 0,
      leader: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
      members: 8,
      budget: "¥800,000",
      department: "信息技术部",
      priority: "中",
      isExpanded: false
    },
    {
      id: "3",
      name: "园区数据中台建设",
      description: "构建园区数据中台，实现数据的统一管理、分析和应用。",
      status: "已完成",
      startDate: "2021-03-10",
      endDate: "2023-09-30",
      progress: 100,
      leader: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
      members: 15,
      budget: "¥2,500,000",
      department: "数据中心",
      priority: "高",
      isExpanded: false
    }
  ]
  
  // 根据搜索过滤项目
  const filteredProjects = relatedProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.department.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // 切换项目展开状态
  const toggleProjectExpand = (projectId: string) => {
    const updatedProjects = relatedProjects.map(project => {
      if (project.id === projectId) {
        return { ...project, isExpanded: !project.isExpanded }
      }
      return project
    })
    // 在实际应用中，这里应该更新状态
  }
  
  // 获取状态徽章样式
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "进行中":
        return "bg-green-50 text-green-700 border-green-200"
      case "规划中":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "已完成":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "已暂停":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }
  
  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "进行中":
        return <Clock className="h-4 w-4 text-green-500" />
      case "规划中":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "已完成":
        return <CheckCircle className="h-4 w-4 text-purple-500" />
      case "已暂停":
        return <Timer className="h-4 w-4 text-amber-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-500" />
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">相关项目</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="搜索项目..."
                  className="w-full pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <GitBranch className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900 mb-1">未找到相关项目</h3>
              <p className="text-sm text-slate-500">没有符合当前搜索条件的项目</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden border-slate-200">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <GitBranch className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Link href={`/projects/${project.id}`} className="text-base font-medium text-slate-900 hover:text-primary hover:underline flex items-center gap-1">
                            {project.name}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <Badge className={getStatusBadgeStyle(project.status)}>
                              {project.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{project.startDate} 至 {project.endDate}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <User className="h-3.5 w-3.5" />
                              <span>{project.leader.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleProjectExpand(project.id)}
                        className="h-8 w-8 p-0"
                      >
                        {project.isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <AnimatePresence initial={false}>
                      {project.isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4"
                        >
                          <Separator className="mb-4" />
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-slate-700 mb-2">项目描述</h4>
                              <p className="text-sm text-slate-600">{project.description}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-slate-700 mb-2">项目进度</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-600">完成度</span>
                                  <span className="font-medium">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-2">项目信息</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">所属部门</span>
                                    <span className="font-medium text-slate-900">{project.department}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">项目预算</span>
                                    <span className="font-medium text-slate-900">{project.budget}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">优先级</span>
                                    <Badge variant="outline" className={
                                      project.priority === "高" ? "border-red-200 text-red-700" :
                                      project.priority === "中" ? "border-amber-200 text-amber-700" :
                                      "border-blue-200 text-blue-700"
                                    }>
                                      {project.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-2">团队信息</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">项目负责人</span>
                                    <span className="font-medium text-slate-900">{project.leader.name}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">团队成员</span>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4 text-slate-400" />
                                      <span className="font-medium text-slate-900">{project.members} 人</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <Button asChild size="sm" variant="outline" className="gap-1">
                                <Link href={`/projects/${project.id}`}>
                                  <LinkIcon className="h-3.5 w-3.5" />
                                  <span>查看项目详情</span>
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">知识产权统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">发明专利</div>
                  <div className="text-2xl font-semibold">8</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">实用新型</div>
                  <div className="text-2xl font-semibold">12</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">外观设计</div>
                  <div className="text-2xl font-semibold">5</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">专利状态分布</h4>
            <div className="h-8 w-full rounded-full overflow-hidden bg-slate-100 flex">
              <div className="h-full bg-green-500" style={{ width: "40%" }}></div>
              <div className="h-full bg-amber-500" style={{ width: "35%" }}></div>
              <div className="h-full bg-blue-500" style={{ width: "15%" }}></div>
              <div className="h-full bg-red-500" style={{ width: "10%" }}></div>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span>已授权 (40%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <span>申请中 (35%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span>已公开 (15%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span>已驳回/放弃 (10%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
