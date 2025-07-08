"use client"

import { Suspense } from "react"
import { HumanGeneticExternalUseReview } from "@/app/ethic-projects/review/human/components/human-genetic-external-use-review"

export default function HumanGeneticExternalUsePage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanGeneticExternalUseReview />
    </Suspense>
  )
} 