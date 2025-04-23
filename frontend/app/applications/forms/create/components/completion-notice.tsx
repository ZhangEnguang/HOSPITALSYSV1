"use client"

import React from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface CompletionNoticeProps {
  onCreateNew?: () => void
  title?: string
  subtitle?: string
  onBackToList?: () => void
}

export function CompletionNotice({ 
  onCreateNew,
  title = "申报提交成功",
  subtitle = "您的申报已成功提交，我们将尽快进行审核。",
  onBackToList
}: CompletionNoticeProps) {
  const router = useRouter()
  const submissionNumber = React.useMemo(() => 
    `AP${new Date().getTime().toString().slice(-8)}`, 
    []
  );

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      // 如果没有提供回调，则直接刷新页面
      router.push("/applications/forms/create");
    }
  };

  const handleBackToList = () => {
    if (onBackToList) {
      onBackToList();
    } else {
      router.push("/applications");
    }
  };

  return (
    <div className="mx-auto py-6">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
          <p className="text-muted-foreground">
            {subtitle}
          </p>
          <div className="mt-2 text-sm bg-muted p-2 rounded">
            <span className="text-muted-foreground">申报编号：</span>
            <span className="font-medium">{submissionNumber}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full">
          <Button 
            variant="outline"
            onClick={handleBackToList}
            className="w-full"
          >
            返回列表
          </Button>
          <Button 
            onClick={handleCreateNew}
            className="w-full"
          >
            继续添加
          </Button>
        </div>
      </div>
    </div>
  )
} 