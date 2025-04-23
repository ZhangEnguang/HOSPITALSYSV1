"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ReviewTabProps {
  projectId?: string
  projectTitle?: string
}

export default function ReviewTab({ projectId, projectTitle }: ReviewTabProps) {
  const [reviewComment, setReviewComment] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const { toast } = useToast()

  const reviewTemplates = [
    { id: "1", name: "项目符合申报要求，建议通过" },
    { id: "2", name: "项目基本符合要求，但需要补充材料" },
    { id: "3", name: "项目存在重大问题，建议退回修改" },
    { id: "4", name: "项目不符合申报条件，建议不予通过" },
  ]

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value)
    const template = reviewTemplates.find((t) => t.id === value)
    if (template) {
      setReviewComment(template.name)
    }
  }

  const handleApprove = () => {
    if (!reviewComment.trim()) {
      toast({
        title: "请填写审核意见",
        description: "审核意见不能为空",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "审核通过",
      description: `项目 "${projectTitle || projectId}" 已审核通过`,
    })
  }

  const handleReject = () => {
    if (!reviewComment.trim()) {
      toast({
        title: "请填写审核意见",
        description: "审核意见不能为空",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "审核拒绝",
      description: `项目 "${projectTitle || projectId}" 已被拒绝`,
      variant: "destructive",
    })
  }

  return (
    <div className="p-5 space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-2">审核要点</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-medium">
              1
            </div>
            <span className="text-sm">项目内容与申请方向一致</span>
            <div className="ml-auto">
              <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 right-0.5"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-medium">
              2
            </div>
            <span className="text-sm">经费预算合理性</span>
            <div className="ml-auto">
              <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 left-0.5"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-medium">
              3
            </div>
            <span className="text-sm">研究方案���行性</span>
            <div className="ml-auto">
              <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 right-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="mt-4 w-full">
          全部要点 (5)
        </Button>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">审核意见</h4>
        <div className="relative mb-2">
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="常用回复" />
            </SelectTrigger>
            <SelectContent>
              {reviewTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder="请输入审核意见，字数限制500字..."
          className="min-h-[120px] text-sm"
        />

        <div className="text-right text-xs text-gray-500 mt-1">{reviewComment.length}/500</div>

        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Upload className="h-3.5 w-3.5" />
            上传附件
          </Button>
          <div className="text-xs text-gray-500">仅支持PDF、JPG</div>
        </div>
      </div>

      <div className="pt-4 flex gap-2">
        <Button variant="destructive" className="flex-1 flex items-center justify-center gap-1" onClick={handleReject}>
          <XCircle className="h-4 w-4" />
          拒绝通过
        </Button>
        <Button className="flex-1 flex items-center justify-center gap-1" onClick={handleApprove}>
          <CheckCircle className="h-4 w-4" />
          审核通过
        </Button>
      </div>
    </div>
  )
}

