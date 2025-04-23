"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { 
  FileText, 
  Download, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Upload,
  Search,
  FileUp
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface InspectionDocumentsTabProps {
  data: any
}

export default function InspectionDocumentsTab({ data }: InspectionDocumentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [documents, setDocuments] = useState(data.attachments || [])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 过滤文档
  const filteredDocuments = documents.filter((doc: any) => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  // 处理文档上传
  const handleUpload = () => {
    if (selectedFile) {
      const newDoc = {
        name: selectedFile.name,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB`,
        date: new Date().toISOString().split('T')[0]
      }
      
      setDocuments([...documents, newDoc])
      setSelectedFile(null)
      setShowUploadDialog(false)
      
      toast({
        title: "文档上传成功",
        description: `${selectedFile.name} 已成功上传`,
        duration: 3000,
      })
    }
  }

  // 处理文档删除
  const handleDelete = (index: number) => {
    const newDocuments = [...documents]
    newDocuments.splice(index, 1)
    setDocuments(newDocuments)
    
    toast({
      title: "文档已删除",
      description: "文档已成功删除",
      duration: 3000,
    })
  }

  // 处理文档预览
  const handlePreview = (doc: any) => {
    toast({
      title: "文档预览",
      description: `正在预览 ${doc.name}`,
      duration: 3000,
    })
  }

  // 处理文档下载
  const handleDownload = (doc: any) => {
    toast({
      title: "文档下载",
      description: `正在下载 ${doc.name}`,
      duration: 3000,
    })
  }

  // 获取文件图标
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch(extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />
      case 'xls':
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-500" />
      case 'ppt':
      case 'pptx':
        return <FileText className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">项目中检文档</CardTitle>
          <Button 
            onClick={() => setShowUploadDialog(true)}
            size="sm"
            className="gap-1"
          >
            <Upload className="h-4 w-4" />
            <span>上传文档</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索文档..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {filteredDocuments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>文档名称</TableHead>
                  <TableHead>大小</TableHead>
                  <TableHead>上传日期</TableHead>
                  <TableHead className="w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.name)}
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreview(doc)}
                          title="预览"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(doc)}
                          title="下载"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePreview(doc)}>
                              <Eye className="h-4 w-4 mr-2" />
                              <span>预览</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(doc)}>
                              <Download className="h-4 w-4 mr-2" />
                              <span>下载</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(index)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>删除</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">没有找到文档</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm ? "没有找到匹配的文档，请尝试其他搜索词" : "此项目中检尚未上传任何文档"}
              </p>
              {!searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span>上传文档</span>
                </Button>
              )}
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
              上传与项目中检相关的文档。支持PDF、Word、Excel和PPT等格式。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-8 transition-colors hover:border-primary/50">
              <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm text-center text-muted-foreground mb-2">
                拖放文件到此处或点击下方按钮选择文件
              </p>
              <Input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                选择文件
              </Button>
              {selectedFile && (
                <div className="mt-4 text-sm">
                  已选择: <span className="font-medium">{selectedFile.name}</span> ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              取消
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile}>
              上传
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
