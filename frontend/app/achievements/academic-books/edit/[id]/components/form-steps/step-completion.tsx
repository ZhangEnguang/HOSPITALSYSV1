"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { InfoIcon, CheckCircle2, FileText } from "lucide-react"

interface StepCompletionProps {
  formData: any
  files: File[]
}

export function StepCompletion({ formData, files }: StepCompletionProps) {
  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '未设置'
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  // 数据项配置
  const sections = [
    {
      title: "基本信息",
      items: [
        { label: "著作名称", value: formData.title },
        { label: "著作类型", value: formData.workType },
        { label: "出版社", value: formData.publisher },
        { label: "出版日期", value: formatDate(formData.publishDate) },
        { label: "ISBN", value: formData.isbn },
        { label: "学科分类", value: formData.category },
        { label: "总页数", value: formData.pages ? `${formData.pages}页` : "未填写" },
        { label: "总字数", value: formData.words ? `${formData.words}字` : "未填写" },
        { label: "出版状态", value: formData.status || "未设置" },
        { label: "丛书名称", value: formData.series || "未填写" },
      ]
    },
    {
      title: "作者信息",
      items: [
        { label: "作者", value: formData.authors ? `共${formData.authors.length}位作者` : "未添加" },
        { label: "第一作者单位", value: formData.firstAuthorUnit || "未填写" },
        { label: "通讯作者单位", value: formData.correspondingAuthorUnit || "未填写" },
      ]
    },
    {
      title: "内容详情",
      items: [
        { label: "内容简介", value: formData.summary },
        { label: "关键词", value: formData.keywords },
        { label: "获奖情况", value: formData.awards || "未填写" },
        { label: "引用情况", value: formData.citation || "未填写" },
        { label: "备注", value: formData.notes || "未填写" }
      ]
    },
    {
      title: "上传文档",
      items: [
        { 
          label: "文档数量", 
          value: files.length > 0 ? `已上传${files.length}个文档` : "未上传文档" 
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">信息确认</h3>
      </div>

      <div className="bg-green-50 p-4 rounded-md flex items-center gap-3 mb-6">
        <CheckCircle2 className="h-6 w-6 text-green-500" />
        <div>
          <h3 className="font-medium text-green-800">所有必填信息已完成</h3>
          <p className="text-sm text-green-600">请检查以下信息是否准确，确认无误后可提交</p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <Card key={idx} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted p-4 font-medium">
                {section.title}
              </div>
              <div className="p-4 divide-y">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="py-3 first:pt-0 last:pb-0">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="text-sm col-span-2 break-words">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {files.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <div className="bg-muted p-4 font-medium">
                已上传文档
              </div>
              <div className="p-4 divide-y">
                {files.map((file, index) => (
                  <div key={index} className="py-3 first:pt-0 last:pb-0 flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 