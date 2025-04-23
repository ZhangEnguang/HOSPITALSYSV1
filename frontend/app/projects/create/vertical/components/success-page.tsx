"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface SuccessViewProps {
  onReturn?: () => void
  onPrint?: () => void
  onSave?: () => void
}

export function SuccessView({ onReturn, onPrint, onSave }: SuccessViewProps) {
  const router = useRouter()

  return (
    <div className="w-full bg-white shadow-sm rounded-lg p-8 flex flex-col items-center">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="h-10 w-10 text-green-500" />
      </div>
      
      <h2 className="text-xl font-bold mb-3">提交成功</h2>
      
      <p className="text-gray-500 text-sm text-center mb-6 max-w-lg">
        您的项目信息已经成功提交，我们将尽快处理您的申请。
      </p>
      
      <div className="w-full max-w-lg bg-gray-50 p-4 rounded-md mb-6 text-center">
        <p className="text-gray-600 text-sm">已提交审核，等待部门预核。</p>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          className="bg-blue-500 hover:bg-blue-600"
          onClick={onReturn}
        >
          返回项目列表
        </Button>
        <Button 
          variant="outline"
          onClick={onSave}
        >
          收藏
        </Button>
        <Button 
          variant="outline"
          onClick={onPrint}
        >
          打印
        </Button>
      </div>
    </div>
  );
}

// 保留旧接口以确保兼容性，但实际导出新组件
export function SuccessPage(props: any) {
  return <SuccessView {...props} />
}
