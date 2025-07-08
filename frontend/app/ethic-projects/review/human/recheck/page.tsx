import { Suspense } from "react"
import { HumanRecheckReview } from "../components/human-recheck-review"

export default function HumanRecheckPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HumanRecheckReview />
    </Suspense>
  )
} 