"use client"

import { useState, useEffect } from "react"
import { X, Mail, Phone, Calendar, Building, Award, FileText, Briefcase } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { roleColors, statusColors } from "../config/members-config.tsx"

interface MemberDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  member: any | null
}

export function MemberDetailsDrawer({ isOpen, onClose, member }: MemberDetailsDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (!member) return null

  // 计算工作年限
  const calculateWorkYears = (joinDate: string) => {
    const join = new Date(joinDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - join.getTime())
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
    return diffYears
  }

  const workYears = calculateWorkYears(member.joinDate)

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform overflow-auto bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">成员详情</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="text-2xl">{member.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <div className="mt-1 flex items-center justify-center gap-2">
                <Badge variant={roleColors[member.role]}>{member.role}</Badge>
                <Badge variant={statusColors[member.status]}>{member.status}</Badge>
                {member.isAdmin && <Badge variant="outline">管理员</Badge>}
              </div>
            </div>
          </div>

          <Separator />

          {/* 联系信息 */}
          <div>
            <h4 className="mb-3 font-medium">联系方式</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{member.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* 工作信息 */}
          <div>
            <h4 className="mb-3 font-medium">工作信息</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">所属部门</span>
                </div>
                <p className="pl-6">{member.department.name}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">入职日期</span>
                </div>
                <p className="pl-6">{member.joinDate}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">工作年限</span>
                </div>
                <p className="pl-6">{workYears}年</p>
              </div>
              {member.position && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">职称</span>
                  </div>
                  <p className="pl-6">{member.position}</p>
                </div>
              )}
            </div>
          </div>

          {/* 研究方向 */}
          {member.researchFields && member.researchFields.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 font-medium">研究方向</h4>
                <div className="flex flex-wrap gap-2">
                  {member.researchFields.map((field: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 教育背景 */}
          {member.education && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 font-medium">教育背景</h4>
                <div className="space-y-3">
                  {member.education.map((edu: any, index: number) => (
                    <div key={index} className="rounded-md bg-muted/50 p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{edu.degree}</span>
                        <span className="text-sm text-muted-foreground">{edu.year}</span>
                      </div>
                      <p className="text-sm">{edu.institution}</p>
                      {edu.major && <p className="text-sm text-muted-foreground">专业: {edu.major}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 项目经历 */}
          {member.projects && member.projects.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 font-medium">项目经历</h4>
                <div className="space-y-3">
                  {member.projects.map((project: any, index: number) => (
                    <div key={index} className="rounded-md bg-muted/50 p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{project.name}</span>
                        <Badge variant={project.status === "进行中" ? "success" : "secondary"} className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{project.role}</p>
                      {project.description && <p className="mt-1 text-sm">{project.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 成果 */}
          {member.achievements && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 font-medium">研究成果</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-md bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold">{member.achievements.papers || 0}</p>
                    <p className="text-sm text-muted-foreground">论文</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold">{member.achievements.patents || 0}</p>
                    <p className="text-sm text-muted-foreground">专利</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold">{member.achievements.awards || 0}</p>
                    <p className="text-sm text-muted-foreground">获奖</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 简介 */}
          {member.bio && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 font-medium">个人简介</h4>
                <div className="rounded-md bg-muted/50 p-3">
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{member.bio}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

