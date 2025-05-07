"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateInitialReviewPage() {
  return (
    <div className="w-full py-6 min-h-screen">
      <div className="flex items-center px-8 mb-6">
        <Link href="/ethic-review/initial-review" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">新建初始审查</h1>
      </div>
      
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <p className="text-center text-gray-500 py-10">
          初始审查创建表单开发中...
        </p>
      </div>
    </div>
  )
} 