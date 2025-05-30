"use client"

import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConsumableApplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  consumable: any
}

export function ConsumableApplyDialog({ open, onOpenChange, consumable }: ConsumableApplyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>耗材申领</DialogTitle>
          <DialogDescription>
            {consumable ? `申领耗材：${consumable.name}` : "申领耗材"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground text-center">
            耗材申领功能正在开发中...
          </p>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 