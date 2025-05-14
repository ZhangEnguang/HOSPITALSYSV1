"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { trackReviewItems } from "../../data/track-review-demo-data"

// 编辑页面路由跳转
export default function EditTrackReviewPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  useEffect(() => {
    // 查找当前项目
    const currentProject = trackReviewItems.find(item => item.id === id)
    
    if (!currentProject) {
      console.error("无法找到ID为", id, "的项目")
      router.push("/ethic-review/track-review")
      return
    }
    
    // 根据审查类型决定重定向到哪个子页面
    let redirectPath = ""
    
    switch (currentProject.reviewType) {
      case "修正案审查":
        redirectPath = `/ethic-review/track-review/${id}/edit/amendment`
        break
      case "年度/定期审查":
        redirectPath = `/ethic-review/track-review/${id}/edit/annual`
        break
      case "安全性审查":
        redirectPath = `/ethic-review/track-review/${id}/edit/safety`
        break
      case "偏离方案报告":
        redirectPath = `/ethic-review/track-review/${id}/edit/deviation`
        break
      case "暂停/终止研究报告":
        redirectPath = `/ethic-review/track-review/${id}/edit/suspension`
        break
      case "研究完成报告":
        redirectPath = `/ethic-review/track-review/${id}/edit/completion`
        break
      default:
        // 默认重定向到修正案审查
        redirectPath = `/ethic-review/track-review/${id}/edit/amendment`
        break
    }
    
    // 重定向到对应的编辑页面
    router.push(redirectPath)
  }, [id, router])

  // 加载状态显示
  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="mb-4">
        <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
      <div className="text-lg font-medium">正在加载...</div>
      <div className="text-sm text-gray-500 mt-2">请稍候，正在准备项目编辑页面</div>
    </div>
  )
} 