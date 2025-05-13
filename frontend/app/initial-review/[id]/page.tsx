"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectToEthicReview({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  // 自动重定向到正确的路径
  useEffect(() => {
    if (params.id) {
      router.replace(`/ethic-review/initial-review/${params.id}`)
    } else {
      router.replace("/ethic-review/initial-review")
    }
  }, [router, params.id])
  
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold">正在重定向到伦理项目初始审查页面...</h2>
    </div>
  )
} 