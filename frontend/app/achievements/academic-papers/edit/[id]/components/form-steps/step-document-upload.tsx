"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { InfoIcon, UploadCloud, File, X, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepDocumentUploadProps {
  files: File[]
  setFiles: (files: File[]) => void
}

export function StepDocumentUpload({ files, setFiles }: StepDocumentUploadProps) {
  // 示例已上传的文件
  const [existingFiles, setExistingFiles] = useState([
    { id: 1, name: "论文全文.pdf", size: 2.4, type: "application/pdf" },
    { id: 2, name: "接收证明.pdf", size: 0.8, type: "application/pdf" },
  ])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles([...files, ...acceptedFiles])
  }, [files, setFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  })

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const removeExistingFile = (id: number) => {
    setExistingFiles(existingFiles.filter(file => file.id !== id))
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) return size + ' B'
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
    else return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">文档上传</h3>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-4 block">已上传文件</Label>

          {existingFiles.length > 0 ? (
            <div className="space-y-3">
              {existingFiles.map((file) => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                >
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size} MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="下载文件">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="删除文件" onClick={() => removeExistingFile(file.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">暂无已上传文件</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium mb-4 block">上传新文件</Label>
          
          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
            )}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-10 w-10 text-muted-foreground/70 mb-2" />
            <p className="text-sm text-center mb-1 font-medium">
              {isDragActive ? "放开以上传文件" : "拖放文件至此处，或点击选择文件"}
            </p>
            <p className="text-xs text-center text-muted-foreground">
              支持上传PDF, DOC, DOCX文件，单个文件不超过20MB
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-3">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                >
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" title="删除文件" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 