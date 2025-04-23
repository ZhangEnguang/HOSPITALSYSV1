"use client"

import { Suspense } from "react"
import WorkbenchDashboard from "@/components/workbench-dashboard"

export default function WorkbenchPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<div>加载中...</div>}>
        <WorkbenchDashboard />
      </Suspense>
    </div>
  )
}

