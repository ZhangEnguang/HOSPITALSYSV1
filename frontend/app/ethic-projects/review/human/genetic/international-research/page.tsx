"use client"

import { Suspense } from "react"
import { HumanGeneticInternationalResearchReview } from "@/app/ethic-projects/review/human/components/human-genetic-international-research-review"

export default function HumanGeneticInternationalResearchPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanGeneticInternationalResearchReview />
    </Suspense>
  )
} 