"use client"

import { Suspense } from "react"
import { HumanGeneticImportantResourceReview } from "@/app/ethic-projects/review/human/components/human-genetic-important-resource-review"

export default function HumanGeneticImportantResourcePage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanGeneticImportantResourceReview />
    </Suspense>
  )
} 