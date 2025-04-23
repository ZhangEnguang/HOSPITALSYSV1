"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Trash2, FileText, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StepAttachmentsProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export function StepAttachments({ formData, updateFormData }: StepAttachmentsProps) {
  // 必需的文件类型
  const requiredAttachments = [
    { id: "invoice", name: "入账发票", required: true },
    { id: "contract", name: "合同文件", required: true },
    { id: "approval", name: "审批文件", required: true },
  ]
  
  // 可选的文件类型
  const optionalAttachments = [
    { id: "budget", name: "预算表", required: false },
    { id: "other", name: "其他材料", required: false },
  ]

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, attachmentId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // 更新文件列表
      const updatedAttachments = [...(formData.attachments || [])]
      const existingIndex = updatedAttachments.findIndex(att => att.id === attachmentId)
      
      if (existingIndex >= 0) {
        updatedAttachments[existingIndex] = {
          ...updatedAttachments[existingIndex],
          file,
          uploaded: true
        }
      } else {
        updatedAttachments.push({
          id: attachmentId,
          file,
          uploaded: true
        })
      }
      
      updateFormData("attachments", updatedAttachments)
    }
  }

  // 删除文件
  const removeFile = (attachmentId: string) => {
    const updatedAttachments = [...(formData.attachments || [])]
    const existingIndex = updatedAttachments.findIndex(att => att.id === attachmentId)
    
    if (existingIndex >= 0) {
      updatedAttachments[existingIndex] = {
        ...updatedAttachments[existingIndex],
        file: null,
        uploaded: false
      }
      
      updateFormData("attachments", updatedAttachments)
    }
  }

  // 检查文件是否已上传
  const isFileUploaded = (attachmentId: string) => {
    const attachment = (formData.attachments || []).find((att: any) => att.id === attachmentId)
    return attachment && attachment.uploaded
  }

  // 获取文件名
  const getFileName = (attachmentId: string) => {
    const attachment = (formData.attachments || []).find((att: any) => att.id === attachmentId)
    return attachment && attachment.file ? attachment.file.name : ""
  }

  // 检查是否所有必需文件都已上传
  const allRequiredFilesUploaded = requiredAttachments.every(att => isFileUploaded(att.id))

  return (
    <Card className="w-full border border-gray-100 shadow-sm">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-lg font-medium">附件上传</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {!allRequiredFilesUploaded && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>注意</AlertTitle>
            <AlertDescription>
              请上传所有必需的附件文件
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h3 className="font-medium">必需附件</h3>
          <div className="grid grid-cols-1 gap-4">
            {requiredAttachments.map((attachment) => (
              <div key={attachment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{attachment.name}</span>
                    <Badge variant="destructive" className="ml-2">必需</Badge>
                  </div>
                  {isFileUploaded(attachment.id) && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFile(attachment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                
                {isFileUploaded(attachment.id) ? (
                  <div className="bg-muted/30 p-2 rounded text-sm flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="truncate">{getFileName(attachment.id)}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <label 
                      htmlFor={`file-${attachment.id}`}
                      className={cn(
                        "flex items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer",
                        "hover:border-primary hover:bg-muted/30 transition-colors",
                        "border-muted-foreground/30"
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-sm text-muted-foreground">点击上传文件</span>
                      </div>
                      <input
                        id={`file-${attachment.id}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, attachment.id)}
                      />
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">可选附件</h3>
          <div className="grid grid-cols-1 gap-4">
            {optionalAttachments.map((attachment) => (
              <div key={attachment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{attachment.name}</span>
                    <Badge variant="outline" className="ml-2">可选</Badge>
                  </div>
                  {isFileUploaded(attachment.id) && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFile(attachment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                
                {isFileUploaded(attachment.id) ? (
                  <div className="bg-muted/30 p-2 rounded text-sm flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="truncate">{getFileName(attachment.id)}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <label 
                      htmlFor={`file-${attachment.id}`}
                      className={cn(
                        "flex items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer",
                        "hover:border-primary hover:bg-muted/30 transition-colors",
                        "border-muted-foreground/30"
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-sm text-muted-foreground">点击上传文件</span>
                      </div>
                      <input
                        id={`file-${attachment.id}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, attachment.id)}
                      />
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          注：支持上传PDF、Word、Excel、图片等格式文件，单个文件大小不超过10MB
        </div>
      </CardContent>
    </Card>
  )
}
