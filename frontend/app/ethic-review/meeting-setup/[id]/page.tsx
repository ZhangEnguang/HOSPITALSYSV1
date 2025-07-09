"use client"

import { UniversalDetailAdapter } from "@/components/universal-detail"
import { ActionConfig } from "@/components/universal-detail/universal-detail-page"
import { Calendar, Users, MapPin, Clock, FileText, Zap, Building, User, Edit } from "lucide-react"
import { meetingSetupItems } from "../data/meeting-setup-demo-data"
import MeetingOverviewTab from "./components/meeting-overview-tab"
import MeetingProjectsTab from "./components/meeting-projects-tab"

// 状态颜色配置
const meetingStatusColors = {
  "草稿": "bg-gray-50 text-gray-700 border-gray-200",
  "未开始": "bg-blue-50 text-blue-700 border-blue-200", 
  "进行中": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "已结束": "bg-green-50 text-green-700 border-green-200",
  "已取消": "bg-red-50 text-red-700 border-red-200"
}

export default function MeetingSetupDetailPage({ params }: { params: { id: string } }) {
  // 获取会议数据
  const meetingData = meetingSetupItems.find(item => item.id === params.id)

  if (!meetingData) {
    return <div className="flex items-center justify-center h-96">会议数据未找到</div>
  }

  // 定义自定义字段 - 只显示3-5个重要字段
  const customFields = [
    {
      id: "committee",
      label: "伦理委员会",
      value: meetingData.committee || "未指定",
      icon: <Building className="h-4 w-4" />
    },
    {
      id: "date",
      label: "会议时间",
      value: meetingData.date || "未设定",
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: "venue",
      label: "会议场地",
      value: meetingData.venue || "未设定",
      icon: <MapPin className="h-4 w-4" />
    },
    {
      id: "attendeeCount",
      label: "参会人数",
      value: meetingData.attendeeCount ? `${meetingData.attendeeCount}人` : "0人",
      icon: <Users className="h-4 w-4" />
    },
    {
      id: "duration",
      label: "会议时长",
      value: meetingData.duration || "未设定",
      icon: <Clock className="h-4 w-4" />
    }
  ]

  // 定义标签页组件 - 使用overview和custom标签页
  const tabComponents = {
    overview: <MeetingOverviewTab item={meetingData} />,
    custom: <MeetingProjectsTab item={meetingData} />
  }

  // 定义自定义标签页标签
  const customTabLabels = {
    overview: "基本信息",
    custom: "会议报告项目"
  }

  return (
    <UniversalDetailAdapter
      // 数据
      itemData={meetingData}
      
      // 配置项
      moduleType="custom"
      customBackPath="/ethic-review/meeting-setup"
      
      // 状态颜色配置
      statusColors={meetingStatusColors}
      
      // 自定义字段
      customFields={customFields}
      
      // 标签页配置
      tabComponents={tabComponents}
      customTabLabels={customTabLabels}
      
      // 隐藏所有不需要的默认标签页 - 使用正确的标签页ID
      hiddenTabs={[
        "process",        // 执行过程
        "funds",          // 经费管理
        "achievements",   // 成果管理
        "risks",          // 风险与问题
        "reports",        // 报告
        "statistics",     // 统计分析
        "documents",      // 文档
        "members",        // 成员
        "booking",        // 预约记录
        "maintenance",    // 维护记录
        "stockIn",        // 入库记录
        "application",    // 申请记录
        "recommendations" // 相关推荐
      ]}
      
      // 隐藏所有操作按钮
      hiddenActions={["edit", "delete"]}
      
      // 不传递自定义操作按钮，这样右上角就不会显示任何操作按钮
    />
  )
} 