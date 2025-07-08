"use client"

import { Suspense } from "react"
import { HumanCompletionReview } from "@/app/ethic-projects/review/human/components/human-completion-review"

export default function HumanCompletionReviewPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanCompletionReview />
    </Suspense>
  )
} 