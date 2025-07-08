import { Suspense } from "react"
import { HumanAmendmentReview } from "../components/human-amendment-review"

export default function HumanAmendmentReviewPage() {
  return (
    <div className="container max-w-screen-xl mx-auto">
      <Suspense fallback={<div>加载中...</div>}>
        <HumanAmendmentReview />
      </Suspense>
    </div>
  )
} 