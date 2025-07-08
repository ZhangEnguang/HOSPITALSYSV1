"use client"

import { Suspense } from "react"
import { HumanGeneticPreservationReview } from "@/app/ethic-projects/review/human/components/human-genetic-preservation-review"

export default function HumanGeneticPreservationPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanGeneticPreservationReview />
    </Suspense>
  )
} 