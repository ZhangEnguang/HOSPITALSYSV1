"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  Eye,
  Clock,
  Check,
  XCircle,
  AlertCircle,
  RotateCw,
  Upload,
  PlusCircle,
  FileIcon,
  FileSearch,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// 文件类型到图标的映射
function getFileIcon(fileType: string) {
  switch (fileType) {
    case "application":
      return <FileSearch className="h-4 w-4 text-blue-500" />
    case "protocol":
      return <FileText className="h-4 w-4 text-green-500" />
    case "consent":
      return <FileText className="h-4 w-4 text-amber-500" />
    case "declaration":
      return <FileText className="h-4 w-4 text-purple-500" />
    case "review":
      return <FileText className="h-4 w-4 text-red-500" />
    case "handbook":
      return <FileText className="h-4 w-4 text-cyan-500" />
    case "report":
      return <FileText className="h-4 w-4 text-indigo-500" />
    case "prescription":
      return <FileText className="h-4 w-4 text-teal-500" />
    default:
      return <FileIcon className="h-4 w-4 text-gray-500" />
  }
}

// 文件状态到Badge的映射
function getStatusBadge(status: string) {
  switch (status) {
    case "已审核":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          <span>已审核</span>
        </Badge>
      )
    case "待审核":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>待审核</span>
        </Badge>
      )
    case "需修改":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          <span>需修改</span>
        </Badge>
      )
    case "已生成":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1">
          <Check className="h-3 w-3" />
          <span>已生成</span>
        </Badge>
      )
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>{status}</span>
        </Badge>
      )
  }
}

// 获取文件类型名称
function getFileTypeName(fileType: string) {
  const typeMap: Record<string, string> = {
    "application": "项目申请书",
    "protocol": "实验方案",
    "consent": "知情同意书",
    "declaration": "声明文件",
    "review": "审查意见",
    "handbook": "研究者手册",
    "report": "报告表",
    "prescription": "处方设计"
  }
  
  return typeMap[fileType] || "其他文件"
}

// 送审文件标签页组件
export default function ReviewFilesTab({
  project
}: { 
  project: any 
}) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  
  // 文件列表
  const files = project.files || []
  
  // 处理文件预览
  const handlePreview = (file: any) => {
    setSelectedFile(file)
    setPreviewDialogOpen(true)
  }
  
  // 处理文件下载
  const handleDownload = (file: any) => {
    toast({
      title: "开始下载",
      description: `正在下载 ${file.name}`,
      duration: 3000,
    })
  }
  
  // 处理文件上传
  const handleUpload = () => {
    setUploadDialogOpen(true)
  }
  
  // 处理文件更新
  const handleUpdateFile = (file: any) => {
    toast({
      title: "文件更新",
      description: `请上传新版本的 ${file.name}`,
      duration: 3000,
    })
    setUploadDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* 送审文件卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">送审文件</CardTitle>
              <CardDescription>
                项目审查相关文件
              </CardDescription>
            </div>
            {/* 项目状态为已退回时，显示上传按钮 */}
            {project.status === "已退回" && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={handleUpload}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>上传文件</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">文件名称</TableHead>
                <TableHead className="w-[15%]">类型</TableHead>
                <TableHead className="w-[10%]">大小</TableHead>
                <TableHead className="w-[15%]">上传时间</TableHead>
                <TableHead className="w-[10%]">状态</TableHead>
                <TableHead className="w-[10%] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    暂无送审文件
                  </TableCell>
                </TableRow>
              ) : (
                files.map((file: any) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span>{file.name}</span>
                    </TableCell>
                    <TableCell>{getFileTypeName(file.type)}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{file.uploadedAt}</TableCell>
                    <TableCell>{getStatusBadge(file.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePreview(file)}>
                            <Eye className="h-4 w-4 mr-2" />
                            预览
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(file)}>
                            <Download className="h-4 w-4 mr-2" />
                            下载
                          </DropdownMenuItem>
                          {project.status === "已退回" && file.status === "需修改" && (
                            <DropdownMenuItem onClick={() => handleUpdateFile(file)}>
                              <RotateCw className="h-4 w-4 mr-2" />
                              更新
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 文件上传区说明 */}
      {project.status === "已退回" && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Upload className="h-10 w-10 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">上传修改后的文件</h3>
            <p className="mt-2 text-sm text-slate-600">
              请上传修改后的送审文件，系统将自动跟踪文件更新记录。
            </p>
            <Button
              variant="default"
              className="mt-4"
              onClick={handleUpload}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              选择文件
            </Button>
          </div>
        </div>
      )}

      {/* 文件预览对话框 */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFile && getFileIcon(selectedFile.type)}
              <span>{selectedFile?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedFile?.uploadedAt} · {selectedFile?.size}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 p-6 rounded-md min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600">文件预览功能正在开发中</p>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              关闭
            </Button>
            <Button onClick={() => selectedFile && handleDownload(selectedFile)}>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 文件上传对话框 */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>上传送审文件</DialogTitle>
            <DialogDescription>
              请选择要上传的文件，支持PDF、Word、Excel等格式
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-dashed p-6 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <Upload className="h-8 w-8 text-slate-400" />
              <p className="text-sm text-slate-600">
                拖放文件到此处，或点击选择文件
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "文件选择",
                    description: "文件选择功能模拟中...",
                    duration: 3000,
                  })
                }}
              >
                选择文件
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast({
                title: "文件上传",
                description: "文件上传成功",
                duration: 3000,
              })
              setUploadDialogOpen(false)
            }}>
              上传
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 