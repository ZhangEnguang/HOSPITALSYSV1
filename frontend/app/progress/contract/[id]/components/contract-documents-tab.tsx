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

interface ContractDocumentsTabProps {
  data: any
}

export default function ContractDocumentsTab({ data }: ContractDocumentsTabProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("合同文本")
  
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
    setDocumentType("合同文本")
    
    // 显示上传成功提示
    alert("文件上传成功")
  }
  
  return (
    <div className="space-y-6">
      {/* 合同文档 */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">合同文档</CardTitle>
            <CardDescription>合同认定相关文档</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="h-4 w-4" />
            <span>上传文档</span>
          </Button>
        </CardHeader>
        <CardContent>
          {data.attachments && data.attachments.length > 0 ? (
            <div className="space-y-2">
              {data.attachments.map((file: any, index: number) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div>
                      <div className="font-medium text-sm">{file.name}</div>
                      <div className="text-xs text-muted-foreground flex gap-3">
                        <span>{file.size}</span>
                        <span>上传于 {file.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p>暂无文档</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 gap-1"
                onClick={() => setShowUploadDialog(true)}
              >
                <Plus className="h-4 w-4" />
                <span>上传文档</span>
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
              上传合同认定相关的文档资料
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="documentType">文档类型</Label>
              <select 
                id="documentType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="合同文本">合同文本</option>
                <option value="认定申请表">认定申请表</option>
                <option value="合作方资质">合作方资质</option>
                <option value="其他附件">其他附件</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">选择文件</Label>
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  已选择: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>取消</Button>
            <Button 
              onClick={handleUploadSubmit}
              disabled={!selectedFile}
            >
              上传
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
