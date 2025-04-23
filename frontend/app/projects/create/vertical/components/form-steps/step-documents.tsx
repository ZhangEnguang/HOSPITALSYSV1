"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, File, X, FileText, CheckCircle2, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// 自定义UUID生成函数，替代React.useId
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// 文件类型定义
interface DocumentType {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  acceptTypes: string // 接受的文件类型
}

// 定义垂直项目需要的文档类型
const documentTypes: DocumentType[] = [
  {
    id: "project_plan",
    name: "项目计划书",
    description: "详细的项目实施计划与目标",
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    acceptTypes: ".pdf,.doc,.docx",
  },
  {
    id: "research_proposal",
    name: "研究方案",
    description: "项目的研究方法与技术路线",
    icon: <FileText className="h-6 w-6 text-green-500" />,
    acceptTypes: ".pdf,.doc,.docx,.ppt,.pptx",
  },
  {
    id: "budget_detail",
    name: "预算明细表",
    description: "详细的经费预算说明",
    icon: <FileText className="h-6 w-6 text-orange-500" />,
    acceptTypes: ".xlsx,.xls,.pdf",
  },
  {
    id: "team_info",
    name: "团队介绍",
    description: "项目团队成员及研究背景介绍",
    icon: <FileText className="h-6 w-6 text-purple-500" />,
    acceptTypes: ".pdf,.doc,.docx,.ppt,.pptx",
  },
  {
    id: "other",
    name: "其他文档",
    description: "其他项目相关的重要文件",
    icon: <File className="h-6 w-6 text-gray-500" />,
    acceptTypes: ".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.jpg,.png,.zip",
  },
]

// 行项目接口
interface DocumentRow {
  id: string
  documentType: string
  file: File | null
  uploadProgress: number
  uploading: boolean
}

export function StepDocuments() {
  // 使用行模式存储文档
  const [rows, setRows] = useState<DocumentRow[]>([
    { id: generateId(), documentType: "", file: null, uploadProgress: 0, uploading: false }
  ])

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      setRows(prevRows => prevRows.map(row => {
        if (row.id === rowId) {
          // 设置上传状态并开始上传进度模拟
          const updatedRow = { 
            ...row, 
            file: file,
            uploading: true,
            uploadProgress: 0
          }
          
          // 模拟上传进度
          simulateUpload(rowId)
          
          return updatedRow
        }
        return row
      }))
    }
  }

  // 模拟上传进度
  const simulateUpload = (rowId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        setRows(prevRows => prevRows.map(row => {
          if (row.id === rowId) {
            return { ...row, uploading: false, uploadProgress: 100 }
          }
          return row
        }))
      } else {
        setRows(prevRows => prevRows.map(row => {
          if (row.id === rowId) {
            return { ...row, uploadProgress: progress }
          }
          return row
        }))
      }
    }, 300)
  }

  // 添加新行
  const addRow = () => {
    setRows(prevRows => [
      ...prevRows, 
      { id: generateId(), documentType: "", file: null, uploadProgress: 0, uploading: false }
    ])
  }

  // 删除行
  const removeRow = (rowId: string) => {
    setRows(prevRows => prevRows.filter(row => row.id !== rowId))
  }

  // 设置行的文档类型
  const setRowDocumentType = (rowId: string, documentType: string) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === rowId) {
        return { ...row, documentType }
      }
      return row
    }))
  }
  
  // 清除行文件
  const clearRowFile = (rowId: string) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === rowId) {
        return { ...row, file: null, uploadProgress: 0, uploading: false }
      }
      return row
    }))
  }

  // 获取文件图标
  const getFileIcon = (fileName: string | undefined) => {
    if (!fileName) return <File className="h-6 w-6 text-gray-500" />
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="h-6 w-6 text-blue-500" />
      case "xls":
      case "xlsx":
        return <FileText className="h-6 w-6 text-green-500" />
      case "ppt":
      case "pptx":
        return <FileText className="h-6 w-6 text-orange-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  // 获取文件大小显示
  const getFileSizeDisplay = (size: number) => {
    if (size < 1024) {
      return `${size} B`
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`
    } else {
      return `${(size / 1024 / 1024).toFixed(2)} MB`
    }
  }

  // 获取可用的文档类型（排除已选择的类型）
  const getAvailableDocumentTypes = (currentRowId: string) => {
    const usedTypes = rows
      .filter(row => row.id !== currentRowId && row.documentType)
      .map(row => row.documentType)
    
    return documentTypes.filter(type => !usedTypes.includes(type.id))
  }

  // 计算已上传的文件数量
  const getUploadedFileCount = () => {
    return rows.filter(row => row.file !== null).length
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-medium">项目文档</Label>

        {/* 文件列表 */}
        <div className="border rounded-lg overflow-hidden">
          {/* 标头 */}
          <div className="bg-muted px-4 py-2 flex font-medium text-sm">
            <div className="w-1/3">文档类型</div>
            <div className="w-2/3">文件</div>
          </div>
          
          {/* 行列表 */}
          <div className="divide-y">
            {rows.map((row) => (
              <div key={row.id} className="flex items-start p-3 bg-card">
                {/* 文档类型选择 */}
                <div className="w-1/3 pr-4">
                  <Select value={row.documentType} onValueChange={(value) => setRowDocumentType(row.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择文档类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableDocumentTypes(row.id).map(type => (
                        <SelectItem key={`${row.id}-${type.id}`} value={type.id}>
                          <div className="flex items-center">
                            {type.icon}
                            <span className="ml-2">{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {row.documentType && (
                    <p className="text-xs text-muted-foreground mt-1 ml-1">
                      {documentTypes.find(t => t.id === row.documentType)?.description}
                    </p>
                  )}
                </div>
                
                {/* 文件上传/显示 */}
                <div className="w-2/3 flex flex-col">
                  {!row.file ? (
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        disabled={!row.documentType}
                        onClick={() => document.getElementById(`file-upload-${row.id}`)?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        上传文件
                      </Button>
                      <input 
                        id={`file-upload-${row.id}`} 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileChange(e, row.id)}
                        accept={documentTypes.find(t => t.id === row.documentType)?.acceptTypes}
                        disabled={!row.documentType}
                      />
                      <p className="text-xs text-muted-foreground ml-3">
                        {row.documentType 
                          ? `支持 ${documentTypes.find(t => t.id === row.documentType)?.acceptTypes} 格式` 
                          : "请先选择文档类型"}
                      </p>
                      
                      {/* 行操作按钮 */}
                      <div className="ml-auto">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeRow(row.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="flex items-center flex-1 mr-3">
                        <div className="mr-3">
                          {getFileIcon(row.file.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{row.file.name}</p>
                          <p className="text-xs text-muted-foreground">{getFileSizeDisplay(row.file.size)}</p>
                        </div>
                      </div>
                      
                      {/* 上传状态 */}
                      <div className="flex items-center space-x-2">
                        {row.uploading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${row.uploadProgress}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {Math.round(row.uploadProgress)}%
                            </span>
                          </div>
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        
                        {/* 操作按钮 */}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => clearRowFile(row.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeRow(row.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* 添加行按钮 */}
          <div className="p-3 flex justify-center bg-muted/30">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={addRow}
            >
              <Plus className="mr-2 h-4 w-4" />
              添加文档
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          已上传 {getUploadedFileCount()} 个文档。请上传与项目相关的文档，如项目计划书、研究方案、预算明细表等。这些文档将作为项目评审的重要参考资料。
        </p>
      </div>
    </div>
  )
}

