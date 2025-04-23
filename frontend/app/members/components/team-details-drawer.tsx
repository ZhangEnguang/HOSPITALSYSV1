"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Users, Calendar, Award, Briefcase } from "lucide-react"
import { teamTypeColors } from "../config/members-config.tsx"

interface TeamDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  team: any
}

export function TeamDetailsDrawer({ isOpen, onClose, team }: TeamDetailsDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!team) return null

  // 修改适配科研团队数据结构部分，确保所有集合属性都是数组

  // 适配科研团队数据结构
  const adaptedTeam = {
    ...team,
    type: team.teamType || "研究团队",
    completedProjects: Array.isArray(team.projects)
      ? team.projects.filter((p: any) => p.status === "已完成").length
      : 0,
    totalProjects: Array.isArray(team.projects) ? team.projects.length : 2,
    leader: {
      name: team.leader || "未指定",
      title: "团队负责人",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    members: Array.isArray(team.members)
      ? team.members
      : [
          {
            id: "1",
            name: "李研究员",
            title: "环境工程",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "2",
            name: "王工程师",
            title: "传感技术",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "3",
            name: "张博士",
            title: "环境化学",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "4",
            name: "赵助理",
            title: "计算机科学",
            avatar: "/placeholder.svg?height=40&width=40",
          },
        ],
    projects: Array.isArray(team.projects)
      ? team.projects
      : [
          {
            id: "p1",
            name: "环境监测系统",
            description: "开发新一代环境监测系统",
            status: "进行中",
            date: "2023-05-15",
          },
          {
            id: "p2",
            name: "水质在线分析平台",
            description: "构建水质实时监测与分析平台",
            status: "规划中",
            date: "2023-08-20",
          },
        ],
    achievements: Array.isArray(team.achievements)
      ? team.achievements
      : [
          {
            id: "a1",
            title: "污染预警模型研究",
            journal: "环境科学学报",
            type: "论文",
            date: "2023-03-10",
          },
          {
            id: "a2",
            title: "便携式水质检测仪",
            journal: "实用新型专利",
            type: "专利",
            date: "2022-11-25",
          },
        ],
    activities: Array.isArray(team.activities)
      ? team.activities
      : [
          {
            id: "act1",
            title: "团队研讨会",
            description: "讨论项目进展与技术难点",
            type: "内部会议",
            date: "2023-09-05",
          },
          {
            id: "act2",
            title: "学术交流会",
            description: "与清华大学环境学院交流研究成果",
            type: "学术活动",
            date: "2023-08-15",
          },
        ],
    researchFields: Array.isArray(team.researchFields) ? team.researchFields : [],
  }

  // 获取团队类型显示名称
  const getTeamTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      research: "研究团队",
      project: "项目团队",
      lab: "实验室",
      center: "研究中心",
      institute: "研究所",
    }
    return typeMap[type] || type
  }

  return (
    <>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className={`fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* 抽屉内容 */}
          <div
            className={`fixed inset-y-0 right-0 z-50 w-full md:w-2/5 2xl:w-1/3 bg-background shadow-lg overflow-hidden transition-transform duration-300 ease-in-out ${
              isVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="h-full flex flex-col relative">
              {/* 关闭按钮 */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">关闭</span>
              </button>

              {/* 团队信息 */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mt-2 space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={adaptedTeam.avatar} alt={adaptedTeam.name} />
                      <AvatarFallback>{adaptedTeam.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{adaptedTeam.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={teamTypeColors[adaptedTeam.type] || "outline"}>
                          {getTeamTypeName(adaptedTeam.type)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {adaptedTeam.memberCount || adaptedTeam.members.length} 成员
                        </span>
                      </div>
                    </div>
                  </div>

                  {adaptedTeam.description && (
                    <div className="text-sm text-muted-foreground">{adaptedTeam.description}</div>
                  )}

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>项目进展</span>
                      <span>
                        {adaptedTeam.completedProjects}/{adaptedTeam.totalProjects}
                      </span>
                    </div>
                    <Progress
                      value={(adaptedTeam.completedProjects / Math.max(adaptedTeam.totalProjects, 1)) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-medium mb-2">团队负责人</h3>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={adaptedTeam.leader.avatar} alt={adaptedTeam.leader.name} />
                        <AvatarFallback>{adaptedTeam.leader.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{adaptedTeam.leader.name}</div>
                        <div className="text-sm text-muted-foreground">{adaptedTeam.leader.title}</div>
                      </div>
                    </div>
                  </div>

                  {adaptedTeam.researchFields && adaptedTeam.researchFields.length > 0 && (
                    <div>
                      <h3 className="text-base font-medium mb-2">研究方向</h3>
                      <div className="flex flex-wrap gap-2">
                        {adaptedTeam.researchFields.map((field: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-muted/50">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Tabs defaultValue="members">
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="members">
                        <Users className="h-4 w-4 mr-2" />
                        成员
                      </TabsTrigger>
                      <TabsTrigger value="projects">
                        <Briefcase className="h-4 w-4 mr-2" />
                        项目
                      </TabsTrigger>
                      <TabsTrigger value="achievements">
                        <Award className="h-4 w-4 mr-2" />
                        成果
                      </TabsTrigger>
                      <TabsTrigger value="activities">
                        <Calendar className="h-4 w-4 mr-2" />
                        活动
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="members" className="space-y-4 mt-4">
                      <h3 className="text-base font-medium">团队成员 ({adaptedTeam.members.length})</h3>
                      <div className="space-y-3">
                        {adaptedTeam.members.map((member: any) => (
                          <div key={member.id} className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-4 mt-4">
                      <h3 className="text-base font-medium">相关项目 ({adaptedTeam.projects.length})</h3>
                      <div className="space-y-3">
                        {adaptedTeam.projects.map((project: any) => (
                          <div key={project.id} className="border rounded-md p-3">
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">{project.description}</div>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant={project.status === "进行中" ? "default" : "secondary"}>
                                {project.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{project.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="achievements" className="space-y-4 mt-4">
                      <h3 className="text-base font-medium">研究成果 ({adaptedTeam.achievements.length})</h3>
                      <div className="space-y-3">
                        {adaptedTeam.achievements.map((achievement: any) => (
                          <div key={achievement.id} className="border rounded-md p-3">
                            <div className="font-medium">{achievement.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">{achievement.journal}</div>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline">{achievement.type}</Badge>
                              <span className="text-xs text-muted-foreground">{achievement.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="activities" className="space-y-4 mt-4">
                      <h3 className="text-base font-medium">近期活动 ({adaptedTeam.activities.length})</h3>
                      <div className="space-y-3">
                        {adaptedTeam.activities.map((activity: any) => (
                          <div key={activity.id} className="border rounded-md p-3">
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">{activity.description}</div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{activity.date}</span>
                              </div>
                              <Badge variant="outline">{activity.type}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="p-4 md:p-6 pt-2 border-t mt-auto">
                <Button onClick={handleClose} variant="outline" className="w-full">
                  关闭
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

