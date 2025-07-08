"use client"

import { Suspense } from "react"
import { HumanGeneticExportReview } from "@/app/ethic-projects/review/human/components/human-genetic-export-review"

export default function HumanGeneticExportPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanGeneticExportReview />
    </Suspense>
  )
} 