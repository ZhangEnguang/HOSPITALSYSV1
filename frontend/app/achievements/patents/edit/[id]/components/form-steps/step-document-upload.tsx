"use client"

import { UploadIcon, FileIcon, TrashIcon } from "lucide-react"
import { FormData } from "../patents-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface StepDocumentUploadProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  validationErrors: Record<string, string>
}

export function StepDocumentUpload({ formData, updateFormData, validationErrors }: StepDocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  // 此处仅模拟上传功能，实际项目中应对接真实的文件上传API
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    // 将文件添加到已有文件列表
    const newFiles = [...formData.files]
    for (let i = 0; i < files.length; i++) {
      newFiles.push({
        id: `file-${Date.now()}-${i}`,
        name: files[i].name,
        size: files[i].size,
        type: files[i].type,
        uploadDate: new Date().toISOString()
      })
    }
    updateFormData("files", newFiles)
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = formData.files.filter(file => file.id !== fileId)
    updateFormData("files", updatedFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
    else return (bytes / 1048576).toFixed(2) + ' MB'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <UploadIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">文档上传</h3>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center",
          dragActive ? "border-primary bg-primary/5" : "border-input"
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <UploadIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              拖拽文件到此处或{" "}
              <Label
                htmlFor="file-upload"
                className="text-primary cursor-pointer hover:text-primary/80"
              >
                浏览本地文件
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              支持上传专利说明书、授权证书、申请文件等相关材料
            </p>
          </div>
        </div>
      </div>

      {formData.files && formData.files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">已上传文件</h4>
          <div className="space-y-2">
            {formData.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-md bg-muted/50"
              >
                <div className="flex items-center">
                  <FileIcon className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} - 上传于{" "}
                      {new Date(file.uploadDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 p-3 rounded-md mt-4">
        <p className="text-sm text-amber-800">
          <span className="font-medium">注意：</span> 请确保上传的文件真实有效，系统支持的文件类型包括：PDF、Word、Excel、JPG、PNG等常见文档格式。单个文件大小不超过20MB。
        </p>
      </div>
    </div>
  )
} 