"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, User, Mail, Phone, Building, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 定义项目团队成员类型
interface TeamMember {
  name: string
  title: string
  department: string
  role: string
  contact: string
}

// 项目团队成员标签页组件
export default function ProjectTeamTab({ members = [] }: { members: TeamMember[] }) {
  return (
    <div className="space-y-6">
      {/* 标签页标题区域 */}
      <div className="border-b pb-4 mb-2">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          项目团队成员
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          项目所有参与成员及其联系方式
        </p>
      </div>

      {/* 负责人卡片 */}
      {members.length > 0 && (
        <Card className="shadow-sm border-blue-100">
          <CardHeader className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <CardTitle className="text-base font-medium flex items-center">
              <User className="h-5 w-5 text-blue-500 mr-2" />
              负责人信息
            </CardTitle>
            <CardDescription>
              项目主要负责人/联系人
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-start">
              <Avatar className="h-14 w-14 mr-4 border-2 border-blue-100">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                  {members[0].name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-semibold">{members[0].name}</h3>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-blue-100 text-blue-700 border-none font-normal">
                      {members[0].title}
                    </Badge>
                    <span className="mx-2 text-slate-300">|</span>
                    <span className="text-sm text-slate-600">{members[0].department}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center text-slate-600">
                    <Briefcase className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{members[0].role}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Building className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{members[0].department}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    {members[0].contact.includes('@') ? (
                      <>
                        <Mail className="h-4 w-4 mr-2 text-slate-400" />
                        <a href={`mailto:${members[0].contact}`} className="text-blue-600 hover:underline">
                          {members[0].contact}
                        </a>
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2 text-slate-400" />
                        <a href={`tel:${members[0].contact}`} className="text-blue-600 hover:underline">
                          {members[0].contact}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 团队成员列表 */}
      {members.length > 1 && (
        <Card className="shadow-sm">
          <CardHeader className="px-6 py-4 border-b">
            <CardTitle className="text-base font-medium flex items-center">
              <Users className="h-5 w-5 text-slate-500 mr-2" />
              团队成员列表
            </CardTitle>
            <CardDescription>
              项目其他参与成员 ({members.length - 1}人)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {members.slice(1).map((member, index) => (
                <div key={index} className="flex items-center p-4 hover:bg-slate-50 transition-colors">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback className="bg-slate-100 text-slate-700">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 grid md:grid-cols-2 gap-1">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 truncate">
                        {member.name}
                      </h4>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="font-normal text-xs h-5">
                          {member.title}
                        </Badge>
                        <span className="ml-2 text-xs text-slate-500">{member.role}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                      <div className="flex items-center text-slate-600">
                        <Building className="h-4 w-4 mr-1 text-slate-400" />
                        <span className="text-xs truncate">{member.department}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        {member.contact.includes('@') ? (
                          <>
                            <Mail className="h-4 w-4 mr-1 text-slate-400" />
                            <a href={`mailto:${member.contact}`} className="text-xs text-blue-600 hover:underline truncate">
                              {member.contact}
                            </a>
                          </>
                        ) : (
                          <>
                            <Phone className="h-4 w-4 mr-1 text-slate-400" />
                            <a href={`tel:${member.contact}`} className="text-xs text-blue-600 hover:underline truncate">
                              {member.contact}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 无成员提示 */}
      {members.length === 0 && (
        <div className="text-center p-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-base font-medium text-slate-800 mb-1">暂无团队成员数据</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            该项目尚未添加团队成员信息，请联系项目负责人更新成员数据。
          </p>
        </div>
      )}
    </div>
  )
} 