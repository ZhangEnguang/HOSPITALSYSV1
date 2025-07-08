"use client"

import { Suspense } from "react"
import { HumanGeneticCollectionReview } from "@/app/ethic-projects/review/human/components/human-genetic-collection-review"

export default function HumanGeneticCollectionPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanGeneticCollectionReview />
    </Suspense>
  )
} 