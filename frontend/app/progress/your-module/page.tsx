"use client"

import { Suspense } from "react"

function YourModuleContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">示例模块</h1>
      <p className="text-muted-foreground">这是一个用于解决编译错误的示例模块页面。</p>
    </div>
  )
}

export default function YourModulePage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <YourModuleContent />
    </Suspense>
  )
} 