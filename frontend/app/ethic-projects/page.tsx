"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function EthicProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // 获取当前tab参数
    const tab = searchParams?.get('tab') || 'animal'
    
    // 重定向到各自的页面
    if (tab === 'animal') {
      router.push('/ethic-projects/animal')
    } else if (tab === 'human') {
      router.push('/ethic-projects/human')
    }
  }, [router, searchParams])
  
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-muted-foreground">正在跳转...</p>
      </div>
    </div>
  )
} 