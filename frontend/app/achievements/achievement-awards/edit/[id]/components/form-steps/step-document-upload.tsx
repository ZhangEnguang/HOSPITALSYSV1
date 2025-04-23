"use client"

import { useState } from "react"
import { InfoIcon, UploadIcon, FileIcon, Trash2Icon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepDocumentUploadProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepDocumentUpload({ formData, updateFormData, validationErrors }: StepDocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  
  // 模拟文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // 在实际项目中应该将文件上传到服务器
      // 这里仅模拟添加文件到表单
      updateFormData("files", [...(formData.files || []), ...Array.from(files)])
    }
  }
  
  // 处理拖放
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      updateFormData("files", [...(formData.files || []), ...Array.from(files)])
    }
  }
  
  // 移除文件
  const removeFile = (index: number) => {
    const newFiles = [...formData.files]
    newFiles.splice(index, 1)
    updateFormData("files", newFiles)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">文档上传</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="files" className="text-sm font-medium">
          获奖证书和相关文档
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          请上传获奖证书扫描件和其他相关文档，支持PDF、JPG、PNG格式
        </p>
        
        <div
          className={cn(
            "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2",
            isDragging ? "border-primary bg-primary/5" : "border-gray-200"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIcon className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            拖放文件到此处或点击上传
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            选择文件
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        {formData.files && formData.files.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">已上传文件</h4>
            <div className="space-y-2">
              {formData.files.map((file: File, index: number) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <Trash2Icon className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 