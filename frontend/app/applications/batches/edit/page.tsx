"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

// 此页面用于处理没有ID参数的编辑页请求
// 将重定向到批次列表页面
export default function BatchEditRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // 重定向到批次列表页面
    router.replace("/applications")
  }, [])
  
  return (
    <div className="container mx-auto py-8 flex justify-center items-center h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">正在重定向到批次列表...</p>
      </div>
    </div>
  )
}
