"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Trash2, Paperclip } from "lucide-react"

interface StepDocumentUploadProps {
  files: File[]
  setFiles: (files: File[]) => void
}

export function StepDocumentUpload({ files, setFiles }: StepDocumentUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Paperclip className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">文档上传</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50">
              <Upload className="h-4 w-4" />
              <span>上传文档</span>
            </div>
            <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
          </Label>
          <span className="text-sm text-muted-foreground">支持上传PDF、Word等文档格式</span>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <Label>已上传文档</Label>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-xs text-blue-600">{file.name.split(".").pop()?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-700 mb-2">上传说明</h4>
          <ul className="text-sm text-blue-600 space-y-1 list-disc pl-4">
            <li>请上传论文全文PDF文件</li>
            <li>如有接收证明或录用通知，请一并上传</li>
            <li>如有补充材料，请打包后上传</li>
            <li>单个文件大小不超过20MB</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
