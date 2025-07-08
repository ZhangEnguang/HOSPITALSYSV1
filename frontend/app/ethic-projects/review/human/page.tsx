"use client"

import { Suspense } from "react"
import { HumanInitialReview } from "./components/human-initial-review"

export default function HumanInitialReviewPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanInitialReview />
    </Suspense>
  )
} 