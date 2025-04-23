"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Plus, 
  File,
  Archive,
  Image,
  Check
} from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CompletionDocumentsTabProps {
  completion: any
}

export default function CompletionDocumentsTab({ completion }: CompletionDocumentsTabProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("结项报告")
  
  // 获取文件图标
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />
      case 'xls':
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-5 w-5 text-purple-500" />
      case 'zip':
      case 'rar':
        return <Archive className="h-5 w-5 text-amber-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }
  
  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }
  
  // 处理上传提交
  const handleUploadSubmit = () => {
    // 这里应该实现实际的文件上传逻辑
    // 为了演示，我们只是关闭对话框
    setShowUploadDialog(false)
    setSelectedFile(null)
    setDocumentType("结项报告")
    
    // 显示上传成功提示
    alert("文件上传成功")
  }
  
  return (
    <div className="space-y-6">
      {/* 结项文档 */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">结项文档</CardTitle>
            <CardDescription>项目结项相关文档</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1 relative bg-white hover:bg-primary/5 border border-slate-200 shadow-sm"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="text-xs">上传文档</span>
          </Button>
        </CardHeader>
        <CardContent>
          {completion.attachments && completion.attachments.length > 0 ? (
            <div className="space-y-3">
              {completion.attachments.map((file: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div>
                      <div className="font-medium text-sm">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{file.size} · {file.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-slate-100 p-3 mb-3">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium mb-1">暂无文档</h3>
              <p className="text-xs text-muted-foreground mb-3">请点击"上传文档"按钮添加项目文档</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1"
                onClick={() => setShowUploadDialog(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="text-xs">添加文档</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 上传文档对话框 */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>上传文档</DialogTitle>
            <DialogDescription>
              上传项目结项相关文档
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="document-type">文档类型</Label>
              <select 
                id="document-type"
                className="w-full p-2 border rounded-md"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="结项报告">结项报告</option>
                <option value="成果汇报">成果汇报</option>
                <option value="用户手册">用户手册</option>
                <option value="技术文档">技术文档</option>
                <option value="测试报告">测试报告</option>
                <option value="其他文档">其他文档</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file-upload">选择文件</Label>
              <Input 
                id="file-upload" 
                type="file" 
                onChange={handleFileChange}
              />
              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  已选择: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              取消
            </Button>
            <Button onClick={handleUploadSubmit} disabled={!selectedFile}>
              <Check className="h-4 w-4 mr-1" />
              上传
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
