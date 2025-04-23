"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, CheckCircle2 } from "lucide-react"

interface StepCompleteProps {
  formData: any
  files: File[]
  projects: Array<{ id: string; name: string }>
}

export function StepComplete({ formData, files, projects }: StepCompleteProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">确认结转信息</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">基本信息</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">结转名称：</span>
              <span>{formData.name || "未填写"}</span>
            </div>
            <div>
              <span className="text-gray-500">结转日期：</span>
              <span>{formData.date ? format(new Date(formData.date), "yyyy/MM/dd") : "未选择"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">结转描述：</span>
              <span>{formData.description || "未填写"}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">项目与分类信息</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">所属项目：</span>
              <span>
                {formData.projectId ? projects.find((p) => p.id === formData.projectId)?.name : "未选择"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">结转类别：</span>
              <span>{formData.category || "未选择"}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">金额与结转信息</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">结转金额：</span>
              <span>{formData.amount ? `${formData.amount} 元` : "未填写"}</span>
            </div>
            <div>
              <span className="text-gray-500">结转年度：</span>
              <span>
                {formData.fromYear && formData.toYear
                  ? `${formData.fromYear} 至 ${formData.toYear}`
                  : "未填写完整"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">结转原因：</span>
              <span>{formData.carryoverReason || "未选择"}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">附件信息</h4>
          <div className="text-sm">
            {files.length > 0 ? (
              <div className="space-y-1">
                {files.map((file, index) => (
                  <div key={index}>
                    <span>{file.name}</span>
                    <span className="text-gray-500 ml-2">({(file.size / 1024).toFixed(2)} KB)</span>
                  </div>
                ))}
              </div>
            ) : (
              <span>未上传附件</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="申请人" />
            <AvatarFallback>张三</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">张三</p>
            <p className="text-sm text-muted-foreground">计算机科学与技术学院</p>
          </div>
          <Badge className="ml-auto">申请人</Badge>
        </div>
      </div>
    </div>
  )
}
