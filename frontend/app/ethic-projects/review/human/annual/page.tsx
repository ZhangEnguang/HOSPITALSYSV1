import { Suspense } from "react"
import { HumanAnnualReview } from "../components/human-annual-review"

export default function HumanAnnualReviewPage() {
  return (
    <div className="container max-w-screen-xl mx-auto">
      <Suspense fallback={<div>加载中...</div>}>
        <HumanAnnualReview />
      </Suspense>
    </div>
  )
} 