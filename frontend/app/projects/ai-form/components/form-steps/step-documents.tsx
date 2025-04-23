"use client"

import type React from "react"

import { Upload, File, X } from "lucide-react"
import { useState } from "react"
import { Progress } from "@/components/ui/progress"

interface StepDocumentsProps {
  formData?: any
  handleInputChange?: (field: string, value: any) => void
  validationErrors?: Record<string, boolean>
}

export const StepDocuments = ({
  formData = {},
  handleInputChange = () => {},
  validationErrors = {},
}: StepDocumentsProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; progress: number; complete: boolean }>>([])
  const [isDragging, setIsDragging] = useState(false)

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

    // 模拟文件上传
    if (e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        name: file.name,
        progress: 0,
        complete: false,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // 模拟上传进度
      newFiles.forEach((file, index) => {
        const simulateProgress = setInterval(() => {
          setUploadedFiles((prev) => {
            const updated = [...prev]
            const fileIndex = prev.findIndex((f) => f.name === file.name && f.progress < 100)

            if (fileIndex !== -1) {
              const newProgress = Math.min(updated[fileIndex].progress + 20, 100)
              updated[fileIndex].progress = newProgress
              updated[fileIndex].complete = newProgress === 100

              if (newProgress === 100) {
                clearInterval(simulateProgress)
              }
            } else {
              clearInterval(simulateProgress)
            }

            return updated
          })
        }, 500)
      })
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        progress: 0,
        complete: false,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // 模拟上传进度
      newFiles.forEach((file) => {
        const simulateProgress = setInterval(() => {
          setUploadedFiles((prev) => {
            const updated = [...prev]
            const fileIndex = prev.findIndex((f) => f.name === file.name && f.progress < 100)

            if (fileIndex !== -1) {
              const newProgress = Math.min(updated[fileIndex].progress + 20, 100)
              updated[fileIndex].progress = newProgress
              updated[fileIndex].complete = newProgress === 100

              if (newProgress === 100) {
                clearInterval(simulateProgress)
              }
            } else {
              clearInterval(simulateProgress)
            }

            return updated
          })
        }, 500)
      })
    }
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">项目文档上传</h3>
      <p className="text-muted-foreground">请上传项目相关文档，如立项申请书、合同协议等</p>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" id="fileUpload" className="hidden" multiple onChange={handleFileInputChange} />
        <label htmlFor="fileUpload" className="cursor-pointer">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="text-lg font-medium mb-1">点击上传或拖拽文件到此处</div>
          <div className="text-sm text-muted-foreground">支持PDF、Word、Excel等格式</div>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium">已上传文件</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center p-3 border rounded-md bg-background">
                <File className="h-5 w-5 text-blue-500 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{file.name}</span>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Progress value={file.progress} className="h-1 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>提示：</strong> 文档上传非必须，您可以在项目创建后随时补充上传相关文档。
        </p>
      </div>
    </div>
  )
}

