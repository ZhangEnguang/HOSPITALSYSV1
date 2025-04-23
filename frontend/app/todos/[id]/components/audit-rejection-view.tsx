"use client"

import { useState } from "react"
import { XCircle, Clock, ArrowLeft, Send, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface AuditRejectionViewProps {
  projectId: string
  projectTitle: string
  onBack: () => void
}

const rejectionReasons = [
  { id: "incomplete", label: "资料不完整" },
  { id: "incorrect", label: "信息有误" },
  { id: "format", label: "格式不符合要求" },
  { id: "budget", label: "预算问题" },
  { id: "other", label: "其他原因" },
]

export default function AuditRejectionView({ projectId, projectTitle, onBack }: AuditRejectionViewProps) {
  const [comment, setComment] = useState("")
  const [selectedReason, setSelectedReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ reason?: string; comment?: string }>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { reason?: string; comment?: string } = {}

    if (!selectedReason) {
      newErrors.reason = "请选择退回原因"
    }

    if (!comment.trim()) {
      newErrors.comment = "请填写退回说明"
    } else if (comment.trim().length < 10) {
      newErrors.comment = "退回说明至少需要10个字符"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    // 模拟API调用
    setTimeout(() => {
      setIsSubmitting(false)

      // 重定向到结果页面
      router.push(`/todos/${projectId}/approval-result?action=rejection&title=${encodeURIComponent(projectTitle)}`)
    }, 1000)
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h2 className="text-xl font-semibold">审核退回</h2>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center text-red-700 mb-2">
          <XCircle className="h-5 w-5 mr-2" />
          <span className="font-medium">正在退回项目</span>
        </div>
        <p className="text-sm text-gray-700">项目ID: {projectId}</p>
        <p className="text-sm text-gray-700 font-medium mt-1">{projectTitle}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          退回原因 <span className="text-red-500">*</span>
        </label>
        <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="space-y-2">
          {rejectionReasons.map((reason) => (
            <div key={reason.id} className="flex items-center space-x-2">
              <RadioGroupItem value={reason.id} id={reason.id} />
              <Label htmlFor={reason.id}>{reason.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {errors.reason && (
          <p className="text-sm text-red-500 mt-1 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {errors.reason}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          退回说明 <span className="text-red-500">*</span>
        </label>
        <Textarea
          placeholder="请详细说明退回原因，以便申请人进行修改..."
          className={cn("min-h-[120px]", errors.comment && "border-red-500")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {errors.comment && (
          <p className="text-sm text-red-500 mt-1 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {errors.comment}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          审核时间: {new Date().toLocaleString("zh-CN")}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-1 bg-red-600 hover:bg-red-700">
            <Send className="h-4 w-4" />
            {isSubmitting ? "提交中..." : "确认退回"}
          </Button>
        </div>
      </div>
    </div>
  )
}

