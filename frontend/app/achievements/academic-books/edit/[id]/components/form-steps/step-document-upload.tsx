"use client"

import { useCallback, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { InfoIcon, FileText, Download, X, Upload, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepDocumentUploadProps {
  files: File[]
  setFiles: (files: File[]) => void
}

export function StepDocumentUpload({ files, setFiles }: StepDocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  // 处理文件删除
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files)
      setFiles([...files, ...fileArray])
    }
  }

  // 处理拖拽事件
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files)
      setFiles([...files, ...fileArray])
    }
  }, [files, setFiles])

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 获取文件图标
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch(extension) {
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="h-10 w-10 text-blue-500" />
      case 'xls':
      case 'xlsx':
        return <FileText className="h-10 w-10 text-green-500" />
      case 'ppt':
      case 'pptx':
        return <FileText className="h-10 w-10 text-orange-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileText className="h-10 w-10 text-purple-500" />
      default:
        return <FileText className="h-10 w-10 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">上传相关文档</h3>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-10 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">拖放文件或点击上传</h3>
            <p className="text-sm text-muted-foreground">
              支持PDF、Word、Excel、PPT和图片等多种格式文件
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
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('file-upload')?.click()}
              className="mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              选择文件
            </Button>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4 mt-6">
          <h4 className="text-sm font-medium">已上传文件</h4>
          <div className="space-y-3">
            {files.map((file, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex items-center p-4">
                  <div className="mr-4">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 