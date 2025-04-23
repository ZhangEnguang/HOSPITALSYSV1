"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, FileText, X, CheckCircle, AlertCircle, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepDocumentUploadProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepDocumentUpload({ formData, updateFormData, validationErrors }: StepDocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    handleFiles(Array.from(fileList))
  }

  const handleFiles = (fileList: File[]) => {
    setUploadError(null)
    setIsUploading(true)

    // 检查文件类型和大小
    const validFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
    const maxFileSize = 20 * 1024 * 1024 // 20MB

    const invalidFiles = fileList.filter(file => {
      return !validFileTypes.includes(file.type) || file.size > maxFileSize
    })

    if (invalidFiles.length > 0) {
      setUploadError('文件类型或大小不符合要求')
      setIsUploading(false)
      return
    }

    // 模拟上传过程
    setTimeout(() => {
      const newFiles = [...(formData.files || []), ...fileList.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded: true
      }))]
      
      updateFormData("files", newFiles)
      setIsUploading(false)
    }, 1000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...(formData.files || [])]
    newFiles.splice(index, 1)
    updateFormData("files", newFiles)
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Paperclip className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">文档上传</h3>
      </div>

      <div className="space-y-4">
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center",
            isDragging ? "border-primary bg-primary/5" : "border-gray-200",
            uploadError && "border-destructive"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">
                拖放文件到此处或点击上传
              </h4>
              <p className="text-xs text-muted-foreground">
                支持 PDF、Word、JPG、PNG 格式，单个文件不超过20MB
              </p>
            </div>
            <div>
              <Label htmlFor="file-upload" className="sr-only">
                选择文件
              </Label>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isUploading}
              >
                {isUploading ? '上传中...' : '选择文件'}
              </Button>
            </div>
            {uploadError && (
              <div className="flex items-center text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {uploadError}
              </div>
            )}
          </div>
        </div>

        {formData.files && formData.files.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">已上传文件</h4>
            <div className="space-y-2">
              {formData.files.map((file: any, index: number) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.uploaded && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFile(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">删除</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
