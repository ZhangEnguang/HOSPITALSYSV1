"use client"

import { useState } from "react"
import { 
  GitBranch, 
  Calendar, 
  Users, 
  Clock, 
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  BarChart
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AnimatePresence, motion } from "framer-motion"

interface EvaluatedAchievementRelatedProjectsTabProps {
  data: any
}

export default function EvaluatedAchievementRelatedProjectsTab({ data }: EvaluatedAchievementRelatedProjectsTabProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 模拟关联项目数据
  const relatedProject = {
    id: data.project.id,
    name: data.project.name,
    description: "该项目旨在研发智慧能源管理系统，实现能源消耗的智能监控、分析和优化，提高能源利用效率。",
    startDate: "2022-03-15",
    endDate: "2024-03-14",
    status: "进行中",
    progress: 75,
    leader: {
      id: 3,
      name: "王五",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    members: 8,
    budget: "¥1,200,000",
    spent: "¥850,000",
    milestones: [
      { name: "需求分析", status: "已完成", date: "2022-04-30" },
      { name: "系统设计", status: "已完成", date: "2022-07-31" },
      { name: "核心功能开发", status: "已完成", date: "2022-12-31" },
      { name: "系统测试", status: "进行中", date: "2023-06-30" },
      { name: "技术鉴定", status: "已完成", date: data.date },
      { name: "系统部署", status: "未开始", date: "2023-12-31" }
    ],
    achievements: [
      { id: "18", name: data.name, type: "鉴定成果", date: data.date },
      { id: "12", name: "智慧能源管理系统设计与实现", type: "学术论文", date: "2022-09-15" },
      { id: "15", name: "一种智能用电监测装置", type: "专利", date: "2023-02-10" }
    ]
  }

  // 模拟其他相关成果
  const otherAchievements = relatedProject.achievements.filter(a => a.id !== data.id)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              <span>关联项目信息</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent>
                <div className="space-y-6">
                  {/* 项目基本信息 */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{relatedProject.name}</h3>
                        <p className="text-sm text-slate-600">{relatedProject.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Calendar className="h-4 w-4" />
                            <span>{relatedProject.startDate} 至 {relatedProject.endDate}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Users className="h-4 w-4" />
                            <span>{relatedProject.members} 人</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              relatedProject.status === "已完成" 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : relatedProject.status === "进行中" 
                                  ? "bg-blue-50 text-blue-700 border-blue-200" 
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                            }
                          >
                            {relatedProject.status}
                          </Badge>
                          <Button variant="outline" size="sm" className="h-8">
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            <span className="text-xs">查看项目</span>
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">项目进度</span>
                            <span className="font-medium">{relatedProject.progress}%</span>
                          </div>
                          <Progress value={relatedProject.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 项目里程碑 */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">项目里程碑</h3>
                    <div className="space-y-3">
                      {relatedProject.milestones.map((milestone, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-md border ${
                            milestone.name === "技术鉴定" 
                              ? "border-primary bg-primary/5" 
                              : "border-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {milestone.status === "已完成" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : milestone.status === "进行中" ? (
                                <Clock className="h-4 w-4 text-blue-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-slate-400" />
                              )}
                              <span className="font-medium">{milestone.name}</span>
                              {milestone.name === "技术鉴定" && (
                                <Badge className="bg-primary/10 text-primary border-primary/20">
                                  当前成果
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={
                                  milestone.status === "已完成" 
                                    ? "text-green-700 border-green-200" 
                                    : milestone.status === "进行中" 
                                      ? "text-blue-700 border-blue-200" 
                                      : "text-slate-500 border-slate-200"
                                }
                              >
                                {milestone.status}
                              </Badge>
                              <span className="text-xs text-slate-500">{milestone.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 项目其他成果 */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">项目其他成果</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {otherAchievements.map((achievement, index) => (
                        <div key={index} className="border border-slate-200 rounded-md p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{achievement.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {achievement.type}
                                </Badge>
                                <span className="text-xs text-slate-500">{achievement.date}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 项目统计 */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">项目统计</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-500">总预算</span>
                          <BarChart className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="text-lg font-semibold">{relatedProject.budget}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-500">已使用</span>
                          <BarChart className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="text-lg font-semibold">{relatedProject.spent}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-500">成果数量</span>
                          <BarChart className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="text-lg font-semibold">{relatedProject.achievements.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
