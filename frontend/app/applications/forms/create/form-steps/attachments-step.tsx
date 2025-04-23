"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { File, Paperclip, Plus, Trash2, Upload } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AttachmentsStepProps {
  formData: Record<string, any>
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, string>
}

interface FileItem {
  id: string
  name: string
  type: string
  size: number
  file?: File
}

export function AttachmentsStep({
  formData,
  handleInputChange,
  validationErrors,
}: AttachmentsStepProps) {
  // 初始化附件列表
  const [attachments, setAttachments] = useState<FileItem[]>(formData["附件列表"] || [])

  // 文件上传处理
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newAttachments = [...attachments]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileItem: FileItem = {
        id: Date.now().toString() + i,
        name: file.name,
        type: file.type,
        size: file.size,
        file
      }
      newAttachments.push(fileItem)
    }

    setAttachments(newAttachments)
    handleInputChange("附件列表", newAttachments)
    
    // 重置文件输入，以便可以再次选择相同的文件
    e.target.value = ""
  }

  // 删除附件
  const removeAttachment = (id: string) => {
    const newAttachments = attachments.filter(attachment => attachment.id !== id)
    setAttachments(newAttachments)
    handleInputChange("附件列表", newAttachments)
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* 附件上传区域 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center">项目相关附件</Label>
          <div className="flex items-center">
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-1 cursor-pointer"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4" />
                  上传附件
                </span>
              </Button>
            </label>
          </div>
        </div>

        <div className="border rounded-md p-4 min-h-[240px]">
          {attachments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Paperclip className="h-12 w-12 mb-2 opacity-20" />
              <p>暂无附件，请点击上传按钮添加附件</p>
            </div>
          ) : (
            <ScrollArea className="h-[240px]">
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(attachment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          支持上传PDF、Word、Excel、PPT等格式文件，单个文件不超过10MB
        </p>
      </div>

      {/* 附件说明 */}
      <div className="bg-muted/50 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2">必要附件说明</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>1. 项目申报书（PDF格式）</li>
          <li>2. 项目负责人简历（PDF或Word格式）</li>
          <li>3. 相关证明材料（如有）</li>
          <li>4. 预算详细说明（Excel格式）</li>
        </ul>
      </div>
    </div>
  )
} 