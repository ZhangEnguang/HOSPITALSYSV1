"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, ArrowLeft, Plus } from "lucide-react"

interface SubmitSuccessDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onReturnToList: () => void
  onContinueAdd: () => void
}

export function SubmitSuccessDialog({
  isOpen,
  onOpenChange,
  onReturnToList,
  onContinueAdd
}: SubmitSuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            提交成功
          </DialogTitle>
          <DialogDescription>
            人体伦理初始审查表单已提交成功，将进入审查流程
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex justify-center">
          <div className="bg-green-50 text-green-700 p-6 rounded-lg w-full max-w-md text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <p className="text-xl font-medium mb-2">提交成功</p>
            <p className="text-sm text-green-600">您的伦理审查申请已成功提交，请等待审核结果</p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between pt-2">
          <Button variant="outline" onClick={onReturnToList} className="border-green-200 text-green-700 hover:bg-green-50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
          
          <Button 
            onClick={onContinueAdd} 
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            继续新增
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 