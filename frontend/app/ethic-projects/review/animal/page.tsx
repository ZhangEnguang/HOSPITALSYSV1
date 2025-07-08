"use client"

import { Suspense } from "react"
import { AnimalInitialReview } from "./components/animal-initial-review"

export default function AnimalInitialReviewPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <AnimalInitialReview />
    </Suspense>
  )
} 