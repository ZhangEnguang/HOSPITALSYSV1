"use client"

import { Suspense } from "react"
import { HumanSuspensionReview } from "@/app/ethic-projects/review/human/components/human-suspension-review"

export default function HumanSuspensionReviewPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanSuspensionReview />
    </Suspense>
  )
} 