"use client"

import { Suspense } from "react"
import { HumanGeneticInternationalClinicalReview } from "@/app/ethic-projects/review/human/components/human-genetic-international-clinical-review"

export default function HumanGeneticInternationalClinicalPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanGeneticInternationalClinicalReview />
    </Suspense>
  )
} 