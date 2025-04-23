"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, X } from "lucide-react"

interface ProjectAuditDialogProps {
  project: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onAudit: (projectId: number, status: string, comments: string) => void
}

export default function ProjectAuditDialog({ project, open, onOpenChange, onAudit }: ProjectAuditDialogProps) {
  const [auditStatus, setAuditStatus] = useState<string>("通过")
  const [comments, setComments] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async () => {
    if (!project) return

    setIsSubmitting(true)
    try {
      // 调用审核处理函数
      await onAudit(project.id, auditStatus, comments)
      onOpenChange(false)
    } catch (error) {
      console.error("审核失败", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>项目审核</DialogTitle>
          <DialogDescription>请审核项目"{project?.name}"的信息并提供审核意见</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">项目编号</Label>
            <div className="col-span-3">{project?.projectNumber}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">项目名称</Label>
            <div className="col-span-3">{project?.name}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">项目负责人</Label>
            <div className="col-span-3">{project?.leader?.name}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">项目预算</Label>
            <div className="col-span-3">¥{project?.budget?.toLocaleString()}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">审核结果</Label>
            <RadioGroup className="col-span-3" value={auditStatus} onValueChange={setAuditStatus}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="通过" id="pass" />
                <Label htmlFor="pass" className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-green-500" />
                  通过
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="驳回" id="reject" />
                <Label htmlFor="reject" className="flex items-center">
                  <X className="mr-1 h-4 w-4 text-red-500" />
                  驳回
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="需修改" id="revise" />
                <Label htmlFor="revise">需修改</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">审核意见</Label>
            <Textarea
              className="col-span-3"
              placeholder="请输入审核意见..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "提交中..." : "提交审核"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

