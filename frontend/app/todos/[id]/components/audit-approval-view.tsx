"use client"

import { useState } from "react"
import { CheckCircle, Clock, ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AuditApprovalViewProps {
  projectId: string
  projectTitle: string
  onBack: () => void
}

export default function AuditApprovalView({ projectId, projectTitle, onBack }: AuditApprovalViewProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Function to handle approval and rejection with redirect to result page
  const handleApprovalAction = (action: "approval" | "rejection") => {
    // Here you would normally call an API to update the status

    // Then redirect to the approval result page
    router.push(`/todos/${projectId}/approval-result?action=${action}&title=${encodeURIComponent(projectTitle)}`)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // 模拟API调用
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "审核意见已提交",
        description: "项目已成功审核通过",
        duration: 3000,
      })
      onBack() // 返回到项目详情页
    }, 1000)
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h2 className="text-xl font-semibold">审核通过</h2>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center text-green-700 mb-2">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span className="font-medium">正在审核通过项目</span>
        </div>
        <p className="text-sm text-gray-700">项目ID: {projectId}</p>
        <p className="text-sm text-gray-700 font-medium mt-1">{projectTitle}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">审核意见</label>
        <Textarea
          placeholder="请输入审核意见（选填）"
          className="min-h-[120px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          审核时间: {new Date().toLocaleString("zh-CN")}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleApprovalAction("rejection")}>
            取消
          </Button>
          <Button onClick={() => handleApprovalAction("approval")} disabled={isSubmitting} className="gap-1">
            <Send className="h-4 w-4" />
            {isSubmitting ? "提交中..." : "提交审核"}
          </Button>
        </div>
      </div>
    </div>
  )
}

