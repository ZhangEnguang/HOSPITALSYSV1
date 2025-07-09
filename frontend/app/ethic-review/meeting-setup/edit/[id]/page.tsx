"use client"

import { useParams } from "next/navigation"
import { MeetingSetupForm } from "../../create/components/meeting-setup-form"
import { meetingSetupItems } from "../../data/meeting-setup-demo-data"
 
export default function EditMeetingSetupPage() {
  const params = useParams()
  const meetingId = params?.id as string
  
  // 检查meetingId是否存在
  if (!meetingId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">参数错误</h2>
          <p className="text-sm text-gray-500">会议ID不能为空</p>
        </div>
      </div>
    )
  }
  
  // 获取会议数据
  const meetingData = meetingSetupItems.find(item => item.id === meetingId)
  
  if (!meetingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">会议数据未找到</h2>
          <p className="text-sm text-gray-500">请检查会议ID是否正确</p>
        </div>
      </div>
    )
  }
  
  return <MeetingSetupForm mode="edit" initialData={meetingData} />
} 