"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, FileText, InfoIcon } from "lucide-react"

interface StepCompleteProps {
  formData: any
  files: File[]
}

export function StepComplete({ formData, files }: StepCompleteProps) {
  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      return dateString ? format(new Date(dateString), "yyyy年MM月dd日") : "未设置"
    } catch (error) {
      return "日期格式错误"
    }
  }

  // 示例已上传的文件
  const existingFiles = [
    { id: 1, name: "论文全文.pdf", size: 2.4, type: "application/pdf" },
    { id: 2, name: "接收证明.pdf", size: 0.8, type: "application/pdf" },
  ]

  // 格式化文件大小
  const formatFileSize = (size: number) => {
    if (typeof size === 'number') {
      if (size < 1024) return size + ' B'
      else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
      else return (size / (1024 * 1024)).toFixed(2) + ' MB'
    }
    return `${size} MB`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">确认信息</h3>
      </div>

      <div className="flex flex-col items-center justify-center py-6 bg-green-50 rounded-lg">
        <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
        <h2 className="text-xl font-bold text-center mb-1">修改完成</h2>
        <p className="text-center text-muted-foreground">
          论文信息已更新，请确认以下信息无误
        </p>
      </div>

      <div className="space-y-6 border rounded-lg p-4">
        <div>
          <h3 className="text-base font-medium mb-3">基本信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">论文编号</p>
              <p className="text-sm font-medium">{formData.paperCode || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">论文标题</p>
              <p className="text-sm font-medium">{formData.paperTitle || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">论文类型</p>
              <p className="text-sm font-medium">{formData.paperType || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">论文级别</p>
              <p className="text-sm font-medium">{formData.paperLevel || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">发表状态</p>
              <Badge variant={formData.paperStatus === "已发表" ? "default" : "outline"}>
                {formData.paperStatus || "未设置"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">所属部门</p>
              <p className="text-sm font-medium">{formData.department || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">学科分类</p>
              <p className="text-sm font-medium">{formData.category || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">经费来源</p>
              <p className="text-sm font-medium">{formData.fundingSource || "未设置"}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-base font-medium mb-3">作者信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">第一作者</p>
              <p className="text-sm font-medium">{formData.firstAuthor || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">通讯作者</p>
              <p className="text-sm font-medium">{formData.correspondingAuthor || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">第一作者单位</p>
              <p className="text-sm font-medium">{formData.firstAuthorUnit || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">其他作者</p>
              <p className="text-sm font-medium">{formData.otherAuthors || "无"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">是否为第一单位</p>
              <p className="text-sm font-medium">{formData.isFirstUnit === "yes" ? "是" : "否"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">是否为通讯单位</p>
              <p className="text-sm font-medium">{formData.isCorrespondingUnit === "yes" ? "是" : "否"}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-base font-medium mb-3">论文详情</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">期刊名称</p>
              <p className="text-sm font-medium">{formData.journal || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">发表日期</p>
              <p className="text-sm font-medium">{formatDate(formData.publishDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">卷号页码</p>
              <p className="text-sm font-medium">{formData.volume || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">DOI编号</p>
              <p className="text-sm font-medium">{formData.doi || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">影响因子</p>
              <p className="text-sm font-medium">{formData.impactFactor || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">引用次数</p>
              <p className="text-sm font-medium">{formData.citations || "0"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">关键词</p>
              <p className="text-sm font-medium">{formData.keywords || "未设置"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">基金资助</p>
              <p className="text-sm font-medium">{formData.funding || "未设置"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">摘要</p>
              <p className="text-sm">{formData.abstract || "未设置"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">是否为ESI论文</p>
              <p className="text-sm font-medium">{formData.isEsi ? "是" : "否"}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-base font-medium mb-3">附件文件</h3>
          <div className="space-y-2">
            {existingFiles.length > 0 ? (
              existingFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({file.size} MB)</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">无已上传文件</p>
            )}

            {files.length > 0 && (
              <>
                <p className="text-sm font-medium mt-2">新上传文件:</p>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 