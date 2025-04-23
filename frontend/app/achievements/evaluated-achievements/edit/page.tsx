"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"

function EvaluatedAchievementsEditContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  
  useEffect(() => {
    if (id) {
      router.push(`/achievements/evaluated-achievements/edit/${id}`)
    } else {
      router.push("/achievements/evaluated-achievements")
    }
  }, [id, router])
  
  return null
}

export default function EvaluatedAchievementsEditRedirectPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <EvaluatedAchievementsEditContent />
    </Suspense>
  )
} 