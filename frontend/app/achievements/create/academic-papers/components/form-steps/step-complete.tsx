"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, CheckCircle, CheckCircle2 } from "lucide-react"

interface StepCompleteProps {
  formData: any
  files: File[]
}

export function StepComplete({ formData, files }: StepCompleteProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">确认论文信息</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">基本信息</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">论文标题：</span>
              <span>{formData.paperTitle || "未填写"}</span>
            </div>
            <div>
              <span className="text-gray-500">论文类型：</span>
              <span>{formData.paperType || "未选择"}</span>
            </div>
            <div>
              <span className="text-gray-500">论文级别：</span>
              <span>{formData.paperLevel || "未选择"}</span>
            </div>
            <div>
              <span className="text-gray-500">发表状态：</span>
              <span>{formData.paperStatus || "未选择"}</span>
            </div>
            <div>
              <span className="text-gray-500">所属院系：</span>
              <span>{formData.department || "未填写"}</span>
            </div>
            <div>
              <span className="text-gray-500">研究领域：</span>
              <span>{formData.category || "未选择"}</span>
            </div>
            <div>
              <span className="text-gray-500">经费来源：</span>
              <span>{formData.fundingSource || "未选择"}</span>
            </div>
            <div>
              <span className="text-gray-500">开始日期：</span>
              <span>{formData.startDate ? format(new Date(formData.startDate), "yyyy/MM/dd") : "未选择"}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">作者信息</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">第一作者：</span>
              <span>{formData.firstAuthor || "未填写"}</span>
            </div>
            <div>
              <span className="text-gray-500">通讯作者：</span>
              <span>{formData.correspondingAuthor || "未填写"}</span>
            </div>
            <div>
              <span className="text-gray-500">第一作者单位：</span>
              <span>{formData.firstAuthorUnit || "未填写"}</span>
            </div>
            <div>
              <span className="text-gray-500">其他作者：</span>
              <span>{formData.otherAuthors || "无"}</span>
            </div>
            <div>
              <span className="text-gray-500">其他单位：</span>
              <span>{formData.otherUnits || "无"}</span>
            </div>
            <div>
              <span className="text-gray-500">是否为第一单位：</span>
              <span>{formData.isFirstUnit === "yes" ? "是" : "否"}</span>
            </div>
            <div>
              <span className="text-gray-500">是否为通讯单位：</span>
              <span>{formData.isCorrespondingUnit === "yes" ? "是" : "否"}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">论文详情</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">期刊名称：</span>
              <span>{formData.journal || "未选择"}</span>
            </div>
            <div>
              <span className="text-gray-500">发表日期：</span>
              <span>{formData.publishDate ? format(new Date(formData.publishDate), "yyyy/MM/dd") : "未选择"}</span>
            </div>
            <div>
              <span className="text-gray-500">卷号页码：</span>
              <span>{formData.volume || "未填写"}</span>
            </div>
            <div>
              <span className="text-gray-500">DOI：</span>
              <span>{formData.doi || "未填写"}</span>
            </div>
            <div>
              <span className="text-gray-500">影响因子：</span>
              <span>{formData.impactFactor || "未选择"}</span>
            </div>
            <div>
              <span className="text-gray-500">引用次数：</span>
              <span>{formData.citations || "0"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">关键词：</span>
              <span>{formData.keywords || "未填写"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">基金项目：</span>
              <span>{formData.funding || "未填写"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">是否为ESI高被引论文：</span>
              <span>{formData.isEsi ? "是" : "否"}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">文档信息</h4>
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
              <span>未上传文档</span>
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
