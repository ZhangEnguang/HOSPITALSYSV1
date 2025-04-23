"use client"

import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface StepCompleteProps {
  formData: any
  onSubmit?: () => void
  isSubmitted?: boolean
}

export function StepComplete({ formData, onSubmit, isSubmitted }: StepCompleteProps) {
  const router = useRouter()
  const [localIsSubmitted, setLocalIsSubmitted] = useState(isSubmitted || false)

  const handleSubmit = () => {
    setLocalIsSubmitted(true)
    if (onSubmit) {
      onSubmit()
    }
  }

  useEffect(() => {
    if (isSubmitted !== undefined) {
      setLocalIsSubmitted(isSubmitted)
    }
  }, [isSubmitted])

  if (localIsSubmitted) {
    return (
      <div className="w-full bg-white shadow-sm rounded-lg p-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        
        <h2 className="text-xl font-medium mb-3">提交成功</h2>
        
        <p className="text-gray-500 text-sm text-center mb-4 max-w-md">
          您的项目信息已经成功提交，我们将尽快处理您的申请。
        </p>
        
        <div className="w-full bg-gray-50 p-4 rounded-md mb-6 text-center max-w-md">
          <p className="text-gray-600 text-sm">已提交申请，敬请等待审核。</p>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            className="bg-blue-500 hover:bg-blue-600" 
            onClick={() => router.push("/projects")}
          >
            返回项目列表
          </Button>
          <Button variant="outline">
            继续创建项目
          </Button>
          <Button variant="outline">
            查看详情
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        {/* 项目基本信息 */}
        <div className="bg-card rounded-lg p-5 space-y-4 shadow-sm border border-border/50">
          <h4 className="font-medium text-primary">项目基本信息</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目名称</p>
              <p className="font-medium">{formData.项目名称 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">所属单位</p>
              <p className="font-medium">{formData.所属单位 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目分类</p>
              <p className="font-medium">{formData.项目分类 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目级别</p>
              <p className="font-medium">{formData.项目级别 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目负责人</p>
              <p className="font-medium">{formData.项目负责人 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目周期</p>
              <p className="font-medium">
                {formData.开始日期 && formData.结束日期 
                  ? `${formData.开始日期} 至 ${formData.结束日期}` 
                  : "未填写"}
              </p>
            </div>
          </div>
        </div>
        
        {/* 负责人信息 */}
        <div className="bg-card rounded-lg p-5 space-y-4 shadow-sm border border-border/50">
          <h4 className="font-medium text-primary">负责人信息</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">负责人姓名</p>
              <p className="font-medium">{formData.负责人姓名 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">联系电话</p>
              <p className="font-medium">{formData.联系电话 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">联系邮箱</p>
              <p className="font-medium">{formData.联系邮箱 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">联系地址</p>
              <p className="font-medium">{formData.联系地址 || "未填写"}</p>
            </div>
          </div>
        </div>

        {/* 预算信息 */}
        <div className="bg-card rounded-lg p-5 space-y-4 shadow-sm border border-border/50">
          <h4 className="font-medium text-primary">预算信息</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">预算金额</p>
              <p className="font-medium">
                {formData.预算金额 ? `¥ ${Number.parseFloat(formData.预算金额).toLocaleString()}` : "未填写"}
              </p>
            </div>
          </div>
        </div>

        {/* 团队成员 */}
        <div className="bg-card rounded-lg p-5 space-y-4 shadow-sm border border-border/50">
          <h4 className="font-medium text-primary">团队成员</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              {formData.团队成员 && formData.团队成员.length > 0 && formData.团队成员.some((member: string) => member.trim() !== "") ? (
                <ul className="list-disc pl-5 space-y-1">
                  {formData.团队成员
                    .filter((member: string) => member.trim() !== "")
                    .map((member: string, index: number) => (
                      <li key={index} className="font-medium">{member}</li>
                    ))}
                </ul>
              ) : (
                <p className="font-medium">未添加团队成员</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-5 border-t border-border">
        {/* 移除下方的提交项目按钮，由上方的提交项目按钮统一处理 */}
      </div>
    </div>
  )
}
