"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"

function EthicProjectsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // 获取当前tab参数
    const tab = searchParams?.get('tab') || 'animal'
    
    // 重定向到各自的页面
    if (tab === 'animal') {
      router.replace('/ethic-projects/animal')
    } else if (tab === 'human') {
      router.replace('/ethic-projects/human')
    } else {
      // 默认重定向到动物伦理页面
      router.replace('/ethic-projects/animal')
    }
  }, [router, searchParams])
  
  // 返回null，不渲染任何内容，立即重定向
  return null
}

export default function EthicProjectsPage() {
  return (
    <Suspense fallback={<div>重定向中...</div>}>
      <EthicProjectsPageContent />
    </Suspense>
  )
} 