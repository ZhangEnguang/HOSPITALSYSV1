import { Suspense } from "react"
import { HumanSafetyReview } from "../components/human-safety-review"

export default function HumanSafetyReviewPage() {
  return (
    <div className="container max-w-screen-xl mx-auto">
      <Suspense fallback={<div>加载中...</div>}>
        <HumanSafetyReview />
      </Suspense>
    </div>
  )
} 