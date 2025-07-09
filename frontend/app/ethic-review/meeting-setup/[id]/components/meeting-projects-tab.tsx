"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, FileText, ChevronDown, ChevronUp, User, Building, UserCheck, Eye, CheckCircle } from "lucide-react"

interface MeetingProjectsTabProps {
  item: any
}

export default function MeetingProjectsTab({ item }: MeetingProjectsTabProps) {
  const [quickReviewExpanded, setQuickReviewExpanded] = useState(true)
  const [meetingReviewExpanded, setMeetingReviewExpanded] = useState(true)

  // 模拟快速审查项目数据
  const quickReviewProjects = [
    {
      id: "1",
      title: "COVID-19疫苗效力研究",
      acceptanceNumber: "QR-2024-001",
      projectLeader: "李医生",
      department: "传染病科",
      primaryReviewer: "张主任",
      independentAdvisor: "王教授",
      reviewResult: "已通过"
    },
    {
      id: "2", 
      title: "病毒载体安全性评估",
      acceptanceNumber: "QR-2024-002",
      projectLeader: "王研究员",
      department: "病毒学实验室",
      primaryReviewer: "陈教授",
      independentAdvisor: "刘博士",
      reviewResult: "待审查"
    },
    {
      id: "3",
      title: "新型抗病毒药物体外实验",
      acceptanceNumber: "QR-2024-003",
      projectLeader: "赵博士",
      department: "药理学研究所",
      primaryReviewer: "孙教授",
      independentAdvisor: "钱研究员",
      reviewResult: "已通过"
    },
    {
      id: "4",
      title: "细胞培养技术优化研究",
      acceptanceNumber: "QR-2024-004",
      projectLeader: "孙研究员",
      department: "细胞生物学实验室",
      primaryReviewer: "周主任",
      independentAdvisor: "吴教授",
      reviewResult: "需修改"
    },
    {
      id: "5",
      title: "生物标志物检测方法验证",
      acceptanceNumber: "QR-2024-005",
      projectLeader: "钱教授",
      department: "检验医学科",
      primaryReviewer: "郑博士",
      independentAdvisor: "冯主任",
      reviewResult: "待审查"
    },
    {
      id: "6",
      title: "免疫细胞功能分析技术",
      acceptanceNumber: "QR-2024-006",
      projectLeader: "周医生",
      department: "免疫学研究中心",
      primaryReviewer: "何教授",
      independentAdvisor: "韩博士",
      reviewResult: "已通过"
    }
  ]

  // 模拟会议审查项目数据
  const meetingReviewProjects = [
    {
      id: "1",
      title: "转基因小鼠模型在神经退行性疾病中的应用",
      acceptanceNumber: "MR-2024-001",
      projectLeader: "张教授",
      department: "神经科学研究所",
      primaryReviewer: "李主任",
      independentAdvisor: "赵教授",
      reviewResult: "待审查"
    },
    {
      id: "2",
      title: "新型抗癌药物的临床前研究",
      acceptanceNumber: "MR-2024-002",
      projectLeader: "陈博士",
      department: "肿瘤研究中心",
      primaryReviewer: "孙教授",
      independentAdvisor: "马博士",
      reviewResult: "待审查"
    },
    {
      id: "3",
      title: "基因编辑技术在遗传病治疗中的应用",
      acceptanceNumber: "MR-2024-003",
      projectLeader: "刘主任",
      department: "遗传学实验室",
      primaryReviewer: "周教授",
      independentAdvisor: "吴博士",
      reviewResult: "待审查"
    },
    {
      id: "4",
      title: "干细胞治疗心肌梗死的安全性评估",
      acceptanceNumber: "MR-2024-004",
      projectLeader: "王主任",
      department: "心血管研究所",
      primaryReviewer: "陈教授",
      independentAdvisor: "林博士",
      reviewResult: "需修改"
    },
    {
      id: "5",
      title: "人工智能辅助诊断系统的临床验证",
      acceptanceNumber: "MR-2024-005",
      projectLeader: "李研究员",
      department: "医学影像科",
      primaryReviewer: "张博士",
      independentAdvisor: "黄教授",
      reviewResult: "待审查"
    },
    {
      id: "6",
      title: "纳米药物载体在肿瘤治疗中的应用",
      acceptanceNumber: "MR-2024-006",
      projectLeader: "赵博士",
      department: "生物医学工程系",
      primaryReviewer: "刘教授",
      independentAdvisor: "徐主任",
      reviewResult: "已通过"
    },
    {
      id: "7",
      title: "脑机接口技术在瘫痪患者康复中的应用",
      acceptanceNumber: "MR-2024-007",
      projectLeader: "孙教授",
      department: "康复医学科",
      primaryReviewer: "钱博士",
      independentAdvisor: "朱研究员",
      reviewResult: "待审查"
    },
    {
      id: "8",
      title: "3D打印器官模型在手术规划中的应用",
      acceptanceNumber: "MR-2024-008",
      projectLeader: "钱主任",
      department: "外科学研究所",
      primaryReviewer: "周教授",
      independentAdvisor: "沈博士",
      reviewResult: "待审查"
    },
    {
      id: "9",
      title: "基于人工智能的药物重定位研究",
      acceptanceNumber: "MR-2024-009",
      projectLeader: "周博士",
      department: "药物研发中心",
      primaryReviewer: "吴教授",
      independentAdvisor: "郑主任",
      reviewResult: "未通过"
    },
    {
      id: "10",
      title: "液体活检技术在早期癌症筛查中的应用",
      acceptanceNumber: "MR-2024-010",
      projectLeader: "吴研究员",
      department: "分子诊断实验室",
      primaryReviewer: "郑教授",
      independentAdvisor: "冯博士",
      reviewResult: "待审查"
    }
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      "已通过": "bg-green-50 text-green-700 border-green-200",
      "待审查": "bg-blue-50 text-blue-700 border-blue-200",
      "需修改": "bg-amber-50 text-amber-700 border-amber-200",
      "未通过": "bg-red-50 text-red-700 border-red-200"
    }
    return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const ProjectTable = ({ projects }: { projects: any[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">项目名称</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">受理号</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">项目负责人</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">所属科室</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">主审委员</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">独立顾问</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">审查结果</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
              <td className="py-3 px-4 text-sm">
                <div className="font-medium text-gray-900">{project.title}</div>
              </td>
              <td className="py-3 px-4 text-sm">
                <div className="font-mono text-gray-600">{project.acceptanceNumber}</div>
              </td>
              <td className="py-3 px-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{project.projectLeader}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{project.department}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-900">{project.primaryReviewer}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-900">{project.independentAdvisor}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">
                <Badge variant="outline" className={getStatusColor(project.reviewResult)}>
                  {project.reviewResult}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 快速审查项目 */}
      <Card className="border border-gray-100 rounded-md bg-white">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Zap className="h-5 w-5 text-blue-500" />
              快速审查项目
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {item?.quickReviewCount || quickReviewProjects.length}项
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuickReviewExpanded(!quickReviewExpanded)}
              className="h-8 w-8 p-0"
            >
              {quickReviewExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {quickReviewExpanded && (
          <CardContent className="p-0">
            {quickReviewProjects.length > 0 ? (
              <ProjectTable projects={quickReviewProjects} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>暂无快速审查项目</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* 会议审查项目 */}
      <Card className="border border-gray-100 rounded-md bg-white">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5 text-green-500" />
              会议审查项目
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {item?.meetingReviewCount || meetingReviewProjects.length}项
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMeetingReviewExpanded(!meetingReviewExpanded)}
              className="h-8 w-8 p-0"
            >
              {meetingReviewExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {meetingReviewExpanded && (
          <CardContent className="p-0">
            {meetingReviewProjects.length > 0 ? (
              <ProjectTable projects={meetingReviewProjects} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>暂无会议审查项目</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
} 