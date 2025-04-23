"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BudgetStandardRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/auxiliary/create/budget-standard")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">正在跳转...</p>
    </div>
  )
} 