"use client"

import { useState, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UploadCloud, X, FileText, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepDocumentUploadProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepDocumentUpload({ formData, updateFormData, validationErrors }: StepDocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>(formData.files || [])

  // 处理拖放事件
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  // 处理文件拖放
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  // 处理文件选择
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  // 处理文件
  const handleFiles = (newFiles: File[]) => {
    // 筛选合法文件类型
    const validFiles = newFiles.filter(file => {
      const fileType = file.type
      return fileType === "application/pdf" || 
             fileType === "application/msword" || 
             fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
             fileType === "image/jpeg" ||
             fileType === "image/png"
    })
    
    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles]
      setFiles(updatedFiles)
      updateFormData("files", updatedFiles)
    }
  }

  // 删除文件
  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)
    updateFormData("files", updatedFiles)
  }

  // 获取文件大小的可读格式
  const getFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`
    }
  }
  
  // 渲染文件列表
  const renderFileList = () => {
    return files.map((file, index) => (
      <div 
        key={`${file.name}-${index}`}
        className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
      >
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-blue-500" />
          <div>
            <p className="text-sm font-medium truncate max-w-[250px]">{file.name}</p>
            <p className="text-xs text-muted-foreground">{getFileSize(file.size)}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">上传鉴定相关文档</h3>
      </div>

      <div className="space-y-6">
        <div 
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20",
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
          <h4 className="text-lg font-medium mb-1">将文件拖放至此处</h4>
          <p className="text-sm text-muted-foreground mb-4">或点击下方按钮上传文件</p>
          
          <div className="relative">
            <Button type="button" variant="secondary">
              选择文件
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            支持 PDF、Word 文档和图片（JPG、PNG），单个文件大小不超过 20MB
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">已上传文件</Label>
            <div className="space-y-2">
              {renderFileList()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 