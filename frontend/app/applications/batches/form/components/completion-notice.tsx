"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface CompletionNoticeProps {
  batchName: string
  onContinue: () => void
}

export function CompletionNotice({ batchName, onContinue }: CompletionNoticeProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">申报批次创建成功</h2>
      <p className="text-muted-foreground mb-6">
        您已成功创建申报批次 <span className="font-medium text-foreground">{batchName}</span>
      </p>
      <div className="flex gap-4">
        <Button onClick={onContinue}>
          继续添加
        </Button>
        <Button variant="outline" onClick={() => router.push('/applications')}>
          返回列表
        </Button>
      </div>
    </div>
  )
}
