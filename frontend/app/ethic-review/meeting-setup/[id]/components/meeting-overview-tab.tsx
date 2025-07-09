"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  Mail,
  Phone,
  User,
  FileText,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateToString } from "@/lib/utils"

interface MeetingOverviewTabProps {
  item: any
}

export default function MeetingOverviewTab({ item: meeting }: MeetingOverviewTabProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDateToString(new Date(dateString));
    } catch (error) {
      return dateString;
    }
  };

  // 模拟参会人员数据，实际应从meeting对象获取
  const members = meeting.members || [
    {
      id: "1",
      name: "王五",
      title: "委员",
      department: "生物安全委员会",
      email: "zhangsan@example.com",
      phone: "138-0000-0000",
      role: "委员"
    },
    {
      id: "2",
      name: "李四",
      title: "副教授",
      department: "基础医学院",
      email: "lisi@example.com",
      phone: "138-0000-0001",
      role: "委员"
    },
    {
      id: "3",
      name: "张三",
      title: "教授",
      department: "临床医学院",
      email: "wangwu@example.com",
      phone: "138-0000-0002",
      role: "主任委员"
    }
  ];

  return (
    <div className="space-y-6">
      {/* 基本信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className="text-sm text-muted-foreground">会议编号</div>
              <div className="font-medium">{meeting.meetingId || meeting.id || "MTG-2024-001"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">会议标题</div>
              <div className="font-medium">{meeting.title || meeting.name || "紧急快速审查会议"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">会议时间</div>
              <div className="font-medium">{formatDate(meeting.date || meeting.meetingDate || "2024-03-10")}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">会议场地</div>
              <div className="font-medium">{meeting.venue || meeting.location || "线上会议"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">会议主持人</div>
              <div className="font-medium">{meeting.organizer?.name || meeting.organizer || "王五"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">伦理委员会</div>
              <div className="font-medium">{meeting.committee || meeting.ethicsCommittee || "生物安全委员会"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">状态</div>
              <div className="font-medium">{meeting.status || "已结束"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">快速审查项目</div>
              <div className="font-medium">{meeting.quickReviewCount || meeting.quickReviewProjects || "3"}项</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">会议审查项目</div>
              <div className="font-medium">{meeting.meetingReviewCount || meeting.meetingReviewProjects || "1"}项</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-1">会议描述</div>
            <div className="text-sm">{meeting.description || "处理紧急研究项目的快速审查申请"}</div>
          </div>
        </CardContent>
      </Card>

      {/* 参会人员卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">参会人员</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {members.map((member: any, index: number) => (
              <div key={member.id || index} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                {/* 头像和基本信息 */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 border-2 border-gray-200 text-gray-600 font-medium flex items-center justify-center text-sm flex-shrink-0">
                    {member.name ? member.name.charAt(0) : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{member.name || '未知'}</h4>
                    <p className="text-xs text-muted-foreground">{member.title || '未设置'}</p>
                  </div>
                </div>
                
                {/* 详细信息：四个字段，两行显示 */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3 text-gray-400" />
                    <span className="text-muted-foreground">部门：</span>
                  </div>
                  <div className="text-xs font-medium truncate" title={member.department || '未设置'}>
                    {member.department || '未设置'}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-muted-foreground">邮箱：</span>
                  </div>
                  <div className="text-xs font-medium truncate" title={member.email || '未设置'}>
                    {member.email ? (
                      <a href={`mailto:${member.email}`} className="text-blue-600 hover:text-blue-800">
                        {member.email}
                      </a>
                    ) : '未设置'}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-muted-foreground">电话：</span>
                  </div>
                  <div className="text-xs font-medium">
                    {member.phone ? (
                      <a href={`tel:${member.phone}`} className="text-blue-600 hover:text-blue-800">
                        {member.phone}
                      </a>
                    ) : '未设置'}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-muted-foreground">角色：</span>
                  </div>
                  <div className="text-xs font-medium truncate" title={member.role || '成员'}>
                    {member.role || '成员'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 