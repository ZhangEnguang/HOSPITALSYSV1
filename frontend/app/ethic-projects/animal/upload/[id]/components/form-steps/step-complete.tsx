"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle2, FileText, Upload, Trash2, AlertCircle, UploadCloud, Save, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

interface StepCompleteProps {
  formData: any
  files: File[]
  setFiles: (files: File[]) => void
  onSubmit: () => void
  onPrevStep: () => void
  onSaveDraft: () => void
}

export function StepComplete({ formData, files, setFiles, onSubmit, onPrevStep, onSaveDraft }: StepCompleteProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      setFiles([...files, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">完成提交</h3>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <UploadCloud className="h-5 w-5" />
              <h3 className="font-medium">上传实验数据文件</h3>
            </div>
            
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              onClick={() => document.getElementById("fileUpload")?.click()}
            >
              <UploadCloud className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <div className="text-lg font-medium mb-1">点击或拖拽文件到此处上传</div>
              <div className="text-sm text-muted-foreground">支持Excel、PDF、图片等格式文件</div>
              <input 
                id="fileUpload" 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
            
            {files.length > 0 && (
              <div className="space-y-2">
                <Label>已选择的文件</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="h-5 w-5 text-primary/70" />
                        <div className="truncate">
                          <div className="font-medium truncate">{file.name}</div>
                          <div className="text-sm text-muted-foreground">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeFile(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-700 mb-2">请确认以下信息</h3>
        <ul className="space-y-2 text-sm text-blue-600">
          <li className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            已填写完整的试验阶段信息
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            已填写实验结果和观察记录
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            已详细描述实验过程和方法
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            已完成数据分析和结论
          </li>
          {files.length > 0 ? (
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              已上传 {files.length} 个相关文件
            </li>
          ) : (
            <li className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
              尚未上传任何文件（可选）
            </li>
          )}
        </ul>
      </div>

      {/* 底部按钮操作栏 */}
      <div className="mt-8 border-t border-gray-200 pt-4 pb-2 bg-white flex justify-between items-center">
        <div>
          <Button 
            variant="outline" 
            onClick={onSaveDraft}
            className="flex items-center gap-1 text-gray-600"
            size="sm"
          >
            <Save className="h-4 w-4" />
            保存草稿
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            onClick={onPrevStep}
            className="flex items-center gap-1 text-gray-600"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4" />
            上一步
          </Button>
          
          <Button 
            onClick={onSubmit}
            disabled={isUploading}
            className="bg-primary text-white hover:bg-primary/90"
            size="sm"
          >
            {isUploading ? "提交中..." : "提交"}
          </Button>
        </div>
      </div>
    </div>
  )
} 