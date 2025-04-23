"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileUp,
  File,
  FileText,
  FileIcon as FilePdf,
  FileImage,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface DocumentScanPanelProps {
  onDocumentScan?: (result: Record<string, any>) => void
}

export function DocumentScanPanel({ onDocumentScan }: DocumentScanPanelProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; type: string; size: number }>>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResults, setScanResults] = useState<Record<string, any> | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 模拟文件上传
  const handleFileUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)

          // 模拟上传完成后添加文件
          const newFile = {
            name: "项目合同.pdf",
            type: "application/pdf",
            size: 2.4 * 1024 * 1024, // 2.4MB
          }

          setUploadedFiles((prev) => [...prev, newFile])
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // 删除上传的文件
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    setScanResults(null)
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  // 获取文件图标
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FilePdf className="h-5 w-5 text-red-500" />
    if (fileType.includes("image")) return <FileImage className="h-5 w-5 text-blue-500" />
    if (fileType.includes("text") || fileType.includes("document"))
      return <FileText className="h-5 w-5 text-amber-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  // 模拟文档扫描
  const scanDocuments = () => {
    if (uploadedFiles.length === 0) {
      setError("请先上传文档")
      return
    }

    setIsScanning(true)
    setScanProgress(0)
    setError(null)

    // 模拟扫描进度
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)

          // 模拟扫描结果
          const mockResult = {
            项目名称: "智能制造工艺优化与自动化系统开发",
            合同编号: "HT2025-042",
            合作企业: "智能科技有限公司",
            开始日期: "2025-04-01",
            结束日期: "2026-03-31",
            项目负责人: "李明",
            预算金额: "580000",
            知识产权归属: "共有",
          }

          setScanResults(mockResult)

          // 回调函数
          if (onDocumentScan) {
            onDocumentScan(mockResult)
          }

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-muted">
            <FileUp className="h-8 w-8 text-muted-foreground" />
          </div>

          <h3 className="text-lg font-medium mb-2">文档扫描</h3>
          <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
            上传项目文档或合同，AI将自动识别并填充相关字段
          </p>
        </div>

        {/* 文件上传区域 */}
        <div className="mb-6">
          {isUploading ? (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">上传中</span>
                <span className="text-xs font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1" />
            </div>
          ) : (
            <Button onClick={handleFileUpload} className="w-full mb-4" disabled={isScanning}>
              <FileUp className="h-4 w-4 mr-2" />
              上传文档
            </Button>
          )}

          {error && (
            <div className="mb-4 p-2 bg-destructive/10 text-destructive text-sm rounded flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              <ScrollArea className="max-h-[150px]">
                <div className="p-2 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center">
                        {getFileIcon(file.type)}
                        <div className="ml-2">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFile(index)}
                        disabled={isScanning}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* 扫描按钮和进度 */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6">
            {isScanning ? (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">扫描中</span>
                  <span className="text-xs font-medium">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-1 mb-4" />
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  正在分析文档内容...
                </div>
              </div>
            ) : (
              <Button
                onClick={scanDocuments}
                className="w-full"
                disabled={uploadedFiles.length === 0}
                variant={scanResults ? "outline" : "default"}
              >
                {scanResults ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    重新扫描
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    开始扫描
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* 扫描结果 */}
        {scanResults && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">识别结果</h4>
            <ScrollArea className="h-[200px] border rounded-md p-3 bg-card">
              <div className="space-y-2">
                {Object.entries(scanResults).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{key}:</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          <p>支持的文件格式:</p>
          <p className="mt-1">PDF、Word、Excel、图片(JPG/PNG)等</p>
        </div>
      </div>
    </div>
  )
}

