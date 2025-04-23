"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Paperclip } from "lucide-react"

interface StepDocumentUploadProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepDocumentUpload({ formData, updateFormData, validationErrors }: StepDocumentUploadProps) {
  const handleRemoveFile = (index: number) => {
    const newFiles = [...formData.files]
    newFiles.splice(index, 1)
    updateFormData("files", newFiles)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Paperclip className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">文档上传</h3>
      </div>

      <div className="space-y-6">
        <div className="border-2 border-dashed rounded-lg p-10 text-center">
          <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">拖拽文件到此处或点击上传</h3>
          <p className="text-sm text-muted-foreground mb-4">支持上传PDF、Word、JPG、PNG格式文件，单个文件不超过20MB</p>
          <Button>选择文件</Button>
        </div>

        {formData.files && formData.files.length > 0 && (
          <div className="space-y-2">
            <Label>已上传文件</Label>
            <div className="border rounded-md divide-y">
              {formData.files.map((file: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <span>{file}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 h-8"
                    onClick={() => handleRemoveFile(index)}
                  >
                    删除
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>上传说明</Label>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>请上传鉴定证书原件的扫描件或照片</li>
            <li>如有鉴定报告，请一并上传</li>
            <li>专家意见等相关文档也可一并上传</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
